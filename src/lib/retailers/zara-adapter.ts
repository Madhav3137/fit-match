import { GenericRetailerAdapter } from "./generic-adapter";
import { ProductExtractionResult, ChartExtractionResult, GarmentCategory } from "./types";

export class ZaraAdapter extends GenericRetailerAdapter {
  key = "zara";
  name = "Zara";
  domains = ["zara.com"];
  supportStatus = "beta" as const;

  canHandle(url: URL): boolean {
    return url.hostname.includes("zara.com");
  }

  async extractProduct(html: string, url: URL): Promise<ProductExtractionResult> {
    const baseResult = await super.extractProduct(html, url);
    baseResult.retailer = "ZARA";
    baseResult.brand = "ZARA";
    return baseResult;
  }

  async extractSizeChart(product: ProductExtractionResult, html: string): Promise<ChartExtractionResult> {
    // Zara renders size guide tables via a dynamic client-side Web Component/modal.
    // Static HTML scraping does not yield verifiable size charts without private APIs.
    // Per documentation safeguards, we trigger manual chart fallback with category guidance.
    return {
      status: "manual_required",
      sourceType: "manual",
      warnings: [
        "Zara size guides are loaded dynamically via interactive dialogs. Please confirm the chart dimensions below.",
      ],
    };
  }
}
