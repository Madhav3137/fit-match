import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { matchSize } from "@/lib/sizing/matcher";
import { BodyProfile } from "@/lib/sizing/types";
import { SizeChartData } from "@/lib/retailers/types";
import { saveAnalysis } from "@/lib/storage/analysis-store";

const INCH_TO_CM = 2.54;

const ManualAnalyzeSchema = z
  .object({
    analysisId: z.string().optional(),
    productTitle: z.string().min(1, "Product title is required."),
    brand: z.string().min(1, "Brand name is required."),
    category: z.enum(["top", "trousers", "outerwear", "dress", "other"]),
    chartType: z.enum(["body_ranges", "garment_measures"]).default("body_ranges"),
    unit: z.enum(["cm", "in"]).default("cm"),
    profileData: z.any().optional(),
    fitPreference: z.enum(["slim", "regular", "relaxed"]).optional().default("regular"),
    sizes: z
      .array(
        z.object({
          label: z.string().min(1, "Size label is required."),
          // For body_ranges:
          chestMin: z.number().optional(),
          chestMax: z.number().optional(),
          waistMin: z.number().optional(),
          waistMax: z.number().optional(),
          hipMin: z.number().optional(),
          hipMax: z.number().optional(),
          inseamMin: z.number().optional(),
          inseamMax: z.number().optional(),
          outseamMin: z.number().optional(),
          outseamMax: z.number().optional(),
          // For garment_measures:
          chest: z.number().optional(),
          waist: z.number().optional(),
          hip: z.number().optional(),
          shoulder: z.number().optional(),
          inseam: z.number().optional(),
          outseam: z.number().optional(),
          length: z.number().optional(),
        })
      )
      .min(1, "At least one size definition is required."),
  })
  .superRefine((data, ctx) => {
    data.sizes.forEach((s, idx) => {
      if (data.chartType === "body_ranges") {
        const pairs: Array<{ key: string; label: string; min?: number; max?: number }> = [
          { key: "chest", label: "Chest", min: s.chestMin, max: s.chestMax },
          { key: "waist", label: "Waist", min: s.waistMin, max: s.waistMax },
          { key: "hip", label: "Hips", min: s.hipMin, max: s.hipMax },
          { key: "inseam", label: "Inseam", min: s.inseamMin, max: s.inseamMax },
          { key: "outseam", label: "Outseam", min: s.outseamMin, max: s.outseamMax },
        ];

        let validRanges = 0;
        pairs.forEach((p) => {
          const hasMin = p.min !== undefined && p.min !== null && !isNaN(p.min);
          const hasMax = p.max !== undefined && p.max !== null && !isNaN(p.max);

          if (hasMin !== hasMax) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Incomplete ${p.label} range for size "${s.label}": both minimum and maximum bounds are required.`,
              path: ["sizes", idx, `${p.key}Max`],
            });
          } else if (hasMin && hasMax) {
            if (p.min! > p.max!) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Reversed ${p.label} range for size "${s.label}": minimum (${p.min}) cannot exceed maximum (${p.max}).`,
                path: ["sizes", idx, `${p.key}Min`],
              });
            } else if (p.min! <= 0 || p.max! <= 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid ${p.label} range for size "${s.label}": values must be greater than zero.`,
                path: ["sizes", idx, `${p.key}Min`],
              });
            } else {
              validRanges++;
            }
          }
        });

        if (validRanges === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Size "${s.label}" must include at least one complete measurement range.`,
            path: ["sizes", idx],
          });
        }
      } else {
        // garment_measures mode
        const singleMeasures: Array<{ key: string; label: string; val?: number }> = [
          { key: "chest", label: "Chest", val: s.chest ?? s.chestMin },
          { key: "waist", label: "Waist", val: s.waist ?? s.waistMin },
          { key: "hip", label: "Hips", val: s.hip ?? s.hipMin },
          { key: "shoulder", label: "Shoulder", val: s.shoulder },
          { key: "inseam", label: "Inseam", val: s.inseam ?? s.inseamMin },
          { key: "outseam", label: "Outseam", val: s.outseam ?? s.outseamMin },
          { key: "length", label: "Length", val: s.length },
        ];

        let validMeasures = 0;
        singleMeasures.forEach((m) => {
          if (m.val !== undefined && m.val !== null && !isNaN(m.val)) {
            if (m.val <= 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid ${m.label} measurement for size "${s.label}": value must be greater than zero.`,
                path: ["sizes", idx, m.key],
              });
            } else {
              validMeasures++;
            }
          }
        });

        if (validMeasures === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Size "${s.label}" must include at least one valid garment measurement.`,
            path: ["sizes", idx],
          });
        }
      }
    });
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ManualAnalyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_CHART_DATA",
            message: "Validation failed for manual chart input.",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const {
      productTitle,
      brand,
      category,
      chartType,
      unit,
      sizes,
      profileData,
      fitPreference,
    } = parsed.data;
    const analysisId = parsed.data.analysisId || `anlz_man_${Date.now()}`;
    const scale = unit === "in" ? INCH_TO_CM : 1.0;

    // Structure into normalized SizeChartData format
    let sizeRows;

    if (chartType === "body_ranges") {
      sizeRows = sizes.map((s) => ({
        label: s.label,
        bodyRanges: {
          chest:
            s.chestMin && s.chestMax
              ? {
                  min: Math.round(s.chestMin * scale * 10) / 10,
                  max: Math.round(s.chestMax * scale * 10) / 10,
                }
              : undefined,
          waist:
            s.waistMin && s.waistMax
              ? {
                  min: Math.round(s.waistMin * scale * 10) / 10,
                  max: Math.round(s.waistMax * scale * 10) / 10,
                }
              : undefined,
          hip:
            s.hipMin && s.hipMax
              ? {
                  min: Math.round(s.hipMin * scale * 10) / 10,
                  max: Math.round(s.hipMax * scale * 10) / 10,
                }
              : undefined,
          inseam:
            s.inseamMin && s.inseamMax
              ? {
                  min: Math.round(s.inseamMin * scale * 10) / 10,
                  max: Math.round(s.inseamMax * scale * 10) / 10,
                }
              : undefined,
          outseam:
            s.outseamMin && s.outseamMax
              ? {
                  min: Math.round(s.outseamMin * scale * 10) / 10,
                  max: Math.round(s.outseamMax * scale * 10) / 10,
                }
              : undefined,
        },
        source: "manual" as const,
      }));
    } else {
      // garment_measures
      sizeRows = sizes.map((s) => {
        const toCm = (val?: number) =>
          val !== undefined && val !== null && !isNaN(val) && val > 0
            ? Math.round(val * scale * 10) / 10
            : undefined;

        return {
          label: s.label,
          garmentMeasures: {
            chest: toCm(s.chest ?? s.chestMin),
            waist: toCm(s.waist ?? s.waistMin),
            hip: toCm(s.hip ?? s.hipMin),
            shoulder: toCm(s.shoulder),
            inseam: toCm(s.inseam ?? s.inseamMin),
            outseam: toCm(s.outseam ?? s.outseamMin),
            length: toCm(s.length),
          },
          source: "manual" as const,
        };
      });
    }

    const chartData: SizeChartData = {
      type: chartType,
      unit: "cm", // Normalized to cm
      category,
      sizes: sizeRows,
      provenance: {
        sourceType: "manual",
        isEstimate: true,
        verifiedAt: new Date().toISOString(),
      },
    };

    let recommendation = null;
    if (profileData) {
      recommendation = matchSize(profileData as BodyProfile, chartData, fitPreference);
    }

    const payload = {
      analysisId,
      status: recommendation ? recommendation.status : "ready_for_matching",
      product: {
        title: productTitle,
        brand,
        category,
        evidence: ["user_manual_entry"],
        warnings: [
          chartType === "garment_measures"
            ? "Recommendation derived from manual garment measurement specifications."
            : "Recommendation derived from user-entered body range data.",
        ],
      },
      chart: {
        status: "found",
        sourceType: "manual",
        verifiedAt: new Date().toISOString(),
        chart: chartData,
      },
      recommendation,
      createdAt: new Date().toISOString(),
    };

    saveAnalysis(payload);

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: error.message || "Failed to process manual chart." } },
      { status: 500 }
    );
  }
}
