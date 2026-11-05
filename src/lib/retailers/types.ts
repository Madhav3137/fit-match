export type GarmentCategory = "top" | "trousers" | "outerwear" | "dress" | "other";

export type RetailerSupportStatus = "active" | "beta" | "manual_only" | "unsupported";

export interface SizeRow {
  label: string; // e.g. XS, S, M, L, XL, 32
  bodyRanges?: Partial<
    Record<
      "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam",
      { min: number; max: number }
    >
  >;
  garmentMeasures?: Partial<
    Record<"chest" | "waist" | "hip" | "shoulder" | "length" | "inseam", number>
  >;
  source: "product_chart" | "brand_chart" | "manual";
  sourceUrl?: string;
}

export interface SizeChartData {
  type: "body_ranges" | "garment_measures";
  unit: "cm" | "in";
  category: GarmentCategory;
  sizes: SizeRow[];
  provenance: {
    sourceType: "product" | "brand" | "manual";
    sourceUrl?: string;
    verifiedAt?: string;
    isEstimate?: boolean;
  };
}

export interface ProductExtractionResult {
  status: "success" | "partial" | "not_found" | "blocked" | "unsupported";
  retailer: string;
  domain: string;
  title?: string;
  brand?: string;
  category?: GarmentCategory;
  imageUrl?: string;
  description?: string;
  availableSizes?: string[];
  canonicalUrl?: string;
  evidence: string[];
  warnings: string[];
}

export interface ChartExtractionResult {
  status: "found" | "not_found" | "unverified" | "manual_required";
  chart?: SizeChartData;
  sourceUrl?: string;
  sourceType: "product" | "brand" | "manual";
  verifiedAt?: string;
  warnings: string[];
}

export interface RetailerAdapter {
  key: string;
  name: string;
  domains: string[];
  supportStatus: RetailerSupportStatus;
  canHandle(url: URL): boolean;
  extractProduct(html: string, url: URL): Promise<ProductExtractionResult>;
  extractSizeChart(product: ProductExtractionResult, html: string): Promise<ChartExtractionResult>;
}

