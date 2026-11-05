import { GenericRetailerAdapter } from "./generic-adapter";
import { ProductExtractionResult, ChartExtractionResult } from "./types";

export class HmAdapter extends GenericRetailerAdapter {
  key = "hm";
  name = "H&M";
  domains = ["hm.com"];
  supportStatus = "beta" as const;

  canHandle(url: URL): boolean {
    return url.hostname.includes("hm.com");
  }

  async extractProduct(html: string, url: URL): Promise<ProductExtractionResult> {
    const baseResult = await super.extractProduct(html, url);
    baseResult.retailer = "H&M";
    baseResult.brand = "H&M";
    return baseResult;
  }

  async extractSizeChart(product: ProductExtractionResult, html: string): Promise<ChartExtractionResult> {
    return {
      status: "manual_required",
      sourceType: "manual",
      warnings: [
        "H&M size charts require confirmation for this garment category.",
      ],
    };
  }
}
