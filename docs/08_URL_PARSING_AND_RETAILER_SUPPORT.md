# 08 — URL Parsing & Retailer Support

## Adapter pattern
Each retailer adapter should implement:
```ts
interface RetailerAdapter {
  key: string;
  domains: string[];
  canHandle(url: URL): boolean;
  extractProduct(url: URL): Promise<ProductExtractionResult>;
  extractSizeChart(product: ProductExtractionResult): Promise<ChartExtractionResult>;
}
```

## Extraction order
1. Official retailer API or product feed, where permitted.
2. JSON-LD Product structured data embedded in page.
3. Open Graph / metadata tags for title and image.
4. Retailer-specific page parser, only where permitted and technically stable.
5. Manual fallback.

## Safety requirements
- Only HTTPS.
- Allowlist supported hostnames.
- Resolve DNS and block private, loopback, link-local and reserved IP ranges.
- Revalidate each redirect destination.
- Set strict timeout and maximum response size.
- Reject non-HTML responses unless an adapter explicitly supports them.
- Do not execute arbitrary page scripts.
- Do not accept user-supplied proxy destinations.
- Rate-limit by user and IP.
- Respect retailer terms, robots policies, and applicable law.

## Retailer support matrix
Build a retailer adapter registry and show honest support states:
- Active: tested end-to-end with current product pages.
- Beta: known limitations; show a beta label.
- Manual only: product URL may identify retailer but chart must be entered by user.
- Unsupported: manual chart flow only.

Do not label Zara, H&M or any retailer as fully supported until a real integration has been tested. Retailer page structures and access rules change frequently.

## Product parsing result
```ts
type ProductExtractionResult = {
  status: "success" | "partial" | "not_found" | "blocked";
  retailer: string;
  title?: string;
  brand?: string;
  category?: "top" | "trousers" | "outerwear" | "dress" | "other";
  imageUrl?: string;
  description?: string;
  availableSizes?: string[];
  evidence: string[];
  warnings: string[];
};
```

## Chart extraction result
Return chart type, unit, sizes, source URL, source type, extraction timestamp and warnings. If chart provenance cannot be established, mark it unverified and do not use it for a high-confidence recommendation.
