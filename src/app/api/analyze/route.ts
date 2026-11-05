import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateSafeUrl, safeFetchHtml } from "@/lib/security/url-safety";
import { adapterRegistry } from "@/lib/retailers/adapter-registry";
import { matchSize } from "@/lib/sizing/matcher";
import { BodyProfile } from "@/lib/sizing/types";
import { saveAnalysis } from "@/lib/storage/analysis-store";

const AnalyzeRequestSchema = z.object({
  url: z.string().url("A valid product URL is required."),
  profileId: z.string().optional(),
  profileData: z.any().optional(),
  fitPreference: z.enum(["slim", "regular", "relaxed"]).optional().default("regular"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_URL",
            message: "Please enter a valid, complete web URL (e.g. https://...)",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { url } = parsed.data;

    // 1. SSRF & Protocol Safety Check
    const safety = await validateSafeUrl(url);
    if (!safety.safe || !safety.url) {
      return NextResponse.json(
        {
          error: {
            code: "URL_BLOCKED",
            message: safety.error || "The destination URL is disallowed by security policies.",
            action: "manual_entry",
          },
        },
        { status: 403 }
      );
    }

    // 2. Resolve Retailer Adapter
    const targetUrl = safety.url;
    const adapter = adapterRegistry.resolve(targetUrl);

    // 3. Safe Server-side Fetch
    const fetchResult = await safeFetchHtml(url, { timeoutMs: 8000, maxBytes: 2 * 1024 * 1024 });

    if (!fetchResult.ok || !fetchResult.html) {
      return NextResponse.json(
        {
          error: {
            code: "FETCH_TIMEOUT",
            message: fetchResult.error || "Unable to retrieve the retailer webpage.",
            action: "manual_entry",
          },
          product: {
            brand: targetUrl.hostname.replace(/^www\./, "").split(".")[0].toUpperCase(),
            domain: targetUrl.hostname,
          },
        },
        { status: 422 }
      );
    }

    // 4. Product Metadata Extraction
    const productExtraction = await adapter.extractProduct(fetchResult.html, targetUrl);

    // 5. Size Chart Extraction
    const chartExtraction = await adapter.extractSizeChart(productExtraction, fetchResult.html);

    const analysisId = `anlz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let recommendation = null;

    if (chartExtraction.status === "found" && chartExtraction.chart && parsed.data.profileData) {
      recommendation = matchSize(
        parsed.data.profileData as BodyProfile,
        chartExtraction.chart,
        parsed.data.fitPreference
      );
    }

    const resultPayload = {
      analysisId,
      status: recommendation
        ? recommendation.status
        : chartExtraction.status === "found"
        ? "ready_for_matching"
        : "chart_required",
      product: productExtraction,
      chart: chartExtraction,
      recommendation,
      createdAt: new Date().toISOString(),
    };

    saveAnalysis(resultPayload);

    return NextResponse.json(resultPayload, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "An unexpected error occurred during URL analysis.",
        },
      },
      { status: 500 }
    );
  }
}

