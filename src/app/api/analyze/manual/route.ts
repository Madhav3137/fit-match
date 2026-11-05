import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ManualAnalyzeSchema = z.object({
  analysisId: z.string().optional(),
  productTitle: z.string().min(1, "Product title is required."),
  brand: z.string().min(1, "Brand name is required."),
  category: z.enum(["top", "trousers", "outerwear", "dress", "other"]),
  chartType: z.enum(["body_ranges", "garment_measures"]).default("body_ranges"),
  sizes: z.array(
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
    })
  ).min(1, "At least one size definition is required."),
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

    const { productTitle, brand, category, chartType, sizes } = parsed.data;
    const analysisId = parsed.data.analysisId || `anlz_man_${Date.now()}`;

    // Structure into normalized SizeChartData format
    const sizeRows = sizes.map((s) => ({
      label: s.label,
      bodyRanges: {
        chest: s.chestMin && s.chestMax ? { min: s.chestMin, max: s.chestMax } : undefined,
        waist: s.waistMin && s.waistMax ? { min: s.waistMin, max: s.waistMax } : undefined,
        hip: s.hipMin && s.hipMax ? { min: s.hipMin, max: s.hipMax } : undefined,
        inseam: s.inseamMin && s.inseamMax ? { min: s.inseamMin, max: s.inseamMax } : undefined,
      },
      source: "manual" as const,
    }));

    return NextResponse.json({
      analysisId,
      status: "ready_for_matching",
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
        chart: {
          type: chartType,
          unit: "cm",
          category,
          sizes: sizeRows,
          provenance: {
            sourceType: "manual",
            isEstimate: true,
          },
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: error.message || "Failed to process manual chart." } },
      { status: 500 }
    );
  }
}
