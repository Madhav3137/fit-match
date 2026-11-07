import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { matchSize } from "@/lib/sizing/matcher";
import { BodyProfile } from "@/lib/sizing/types";
import { SizeChartData } from "@/lib/retailers/types";
import { saveAnalysis } from "@/lib/storage/analysis-store";

const ManualAnalyzeSchema = z
  .object({
    analysisId: z.string().optional(),
    productTitle: z.string().min(1, "Product title is required."),
    brand: z.string().min(1, "Brand name is required."),
    category: z.enum(["top", "trousers", "outerwear", "dress", "other"]),
    chartType: z.enum(["body_ranges", "garment_measures"]).default("body_ranges"),
    profileData: z.any().optional(),
    fitPreference: z.enum(["slim", "regular", "relaxed"]).optional().default("regular"),
    sizes: z
      .array(
        z.object({
          label: z.string().min(1, "Size label is required."),
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
        })
      )
      .min(1, "At least one size definition is required."),
  })
  .superRefine((data, ctx) => {
    data.sizes.forEach((s, idx) => {
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

    const { productTitle, brand, category, chartType, sizes, profileData, fitPreference } = parsed.data;
    const analysisId = parsed.data.analysisId || `anlz_man_${Date.now()}`;

    // Structure into normalized SizeChartData format
    const sizeRows = sizes.map((s) => ({
      label: s.label,
      bodyRanges: {
        chest: s.chestMin && s.chestMax ? { min: s.chestMin, max: s.chestMax } : undefined,
        waist: s.waistMin && s.waistMax ? { min: s.waistMin, max: s.waistMax } : undefined,
        hip: s.hipMin && s.hipMax ? { min: s.hipMin, max: s.hipMax } : undefined,
        inseam: s.inseamMin && s.inseamMax ? { min: s.inseamMin, max: s.inseamMax } : undefined,
        outseam: s.outseamMin && s.outseamMax ? { min: s.outseamMin, max: s.outseamMax } : undefined,
      },
      source: "manual" as const,
    }));

    const chartData: SizeChartData = {
      type: chartType,
      unit: "cm",
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
        warnings: ["Recommendation derived from user-entered chart data."],
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
