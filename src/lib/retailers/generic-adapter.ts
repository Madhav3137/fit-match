import * as cheerio from "cheerio";
import {
  GarmentCategory,
  ProductExtractionResult,
  ChartExtractionResult,
  RetailerAdapter,
  SizeChartData,
} from "./types";

/**
 * Classifies garment category from text tokens (title, description, breadcrumbs).
 */
export function detectGarmentCategory(text: string): GarmentCategory {
  const normalized = text.toLowerCase();

  const outerKeywords = ["jacket", "coat", "parka", "blazer", "trench", "bomber", "puffer", "outerwear", "windbreaker", "anorak", "overcoat"];
  for (const w of outerKeywords) {
    if (new RegExp(`\\b${w}\\b`, "i").test(normalized)) return "outerwear";
  }

  const dressKeywords = ["dress", "shirtdress", "gown", "jumpsuit", "romper", "skirt"];
  for (const w of dressKeywords) {
    if (new RegExp(`(?:\\b|_)${w}`, "i").test(normalized)) return "dress";
  }

  const trouserKeywords = ["trouser", "trousers", "pant", "pants", "jean", "jeans", "denim", "chino", "chinos", "short", "shorts", "jogger", "joggers", "cargo", "legging"];
  for (const w of trouserKeywords) {
    if (new RegExp(`\\b${w}\\b`, "i").test(normalized)) return "trousers";
  }

  const topKeywords = ["shirt", "t-shirt", "tee", "top", "blouse", "sweater", "hoodie", "knit", "knitwear", "cardigan", "sweatshirt", "polo", "tank", "jersey", "pullover"];
  for (const w of topKeywords) {
    if (new RegExp(`\\b${w}\\b`, "i").test(normalized)) return "top";
  }

  return "other";
}

export class GenericRetailerAdapter implements RetailerAdapter {
  key = "generic";
  name = "Universal Parser";
  domains: string[] = [];
  supportStatus = "beta" as const;

  canHandle(url: URL): boolean {
    return true; // Fallback handler for all domains
  }

  async extractProduct(html: string, url: URL): Promise<ProductExtractionResult> {
    const $ = cheerio.load(html);
    const evidence: string[] = [];
    const warnings: string[] = [];

    let title: string | undefined;
    let brand: string | undefined;
    let imageUrl: string | undefined;
    let description: string | undefined;
    let category: GarmentCategory = "other";
    const availableSizes: Set<string> = new Set();

    // 1. JSON-LD Extraction
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const rawJson = $(el).contents().text().trim();
        if (!rawJson) return;
        const parsed = JSON.parse(rawJson);
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          // If graph structure
          const products = item["@graph"] ? item["@graph"].filter((g: any) => g["@type"] === "Product") : [item];

          for (const p of products) {
            if (p["@type"] === "Product" || p["@type"]?.includes?.("Product")) {
              evidence.push("schema_org_jsonld");
              if (!title && p.name) title = String(p.name);
              if (!brand) {
                if (typeof p.brand === "string") brand = p.brand;
                else if (p.brand?.name) brand = String(p.brand.name);
              }
              if (!imageUrl) {
                if (typeof p.image === "string") imageUrl = p.image;
                else if (Array.isArray(p.image) && p.image.length > 0) {
                  imageUrl = typeof p.image[0] === "string" ? p.image[0] : p.image[0]?.url;
                } else if (p.image?.url) imageUrl = p.image.url;
              }
              if (!description && p.description) description = String(p.description);

              // Sizes from offers / variants
              if (Array.isArray(p.offers)) {
                p.offers.forEach((o: any) => {
                  if (o.size) availableSizes.add(String(o.size));
                });
              } else if (p.offers?.size) {
                availableSizes.add(String(p.offers.size));
              }
              if (Array.isArray(p.hasVariant)) {
                p.hasVariant.forEach((v: any) => {
                  if (v.size) availableSizes.add(String(v.size));
                });
              }
            }
          }
        }
      } catch {
        // Silently continue through subsequent JSON-LD tags
      }
    });

    // 2. OpenGraph Fallback
    if (!title) {
      const ogTitle = $('meta[property="og:title"]').attr("content");
      if (ogTitle) {
        title = ogTitle;
        evidence.push("open_graph_title");
      } else {
        const pageTitle = $("title").text().trim();
        if (pageTitle) {
          title = pageTitle.split(/[|\-–]/)[0].trim();
          evidence.push("html_title");
        }
      }
    }

    if (!imageUrl) {
      const ogImage = $('meta[property="og:image"]').attr("content");
      if (ogImage) {
        imageUrl = ogImage;
        evidence.push("open_graph_image");
      }
    }

    if (!description) {
      const ogDesc = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content");
      if (ogDesc) {
        description = ogDesc.trim();
        evidence.push("meta_description");
      }
    }

    if (!brand) {
      const ogSiteName = $('meta[property="og:site_name"]').attr("content");
      if (ogSiteName) {
        brand = ogSiteName;
        evidence.push("open_graph_site_name");
      } else {
        // Infer from domain
        brand = url.hostname.replace(/^www\./, "").split(".")[0].toUpperCase();
      }
    }

    // Determine category
    const classificationCorpus = `${title || ""} ${description || ""}`;
    category = detectGarmentCategory(classificationCorpus);

    if (!title) {
      warnings.push("Product title could not be automatically confirmed.");
      return {
        status: "partial",
        retailer: brand || url.hostname,
        domain: url.hostname,
        title: "Garment Item",
        brand: brand || url.hostname,
        category,
        evidence,
        warnings,
      };
    }

    return {
      status: "success",
      retailer: brand || url.hostname,
      domain: url.hostname,
      title,
      brand,
      category,
      imageUrl,
      description,
      availableSizes: Array.from(availableSizes),
      canonicalUrl: url.toString(),
      evidence,
      warnings,
    };
  }

  async extractSizeChart(product: ProductExtractionResult, html: string): Promise<ChartExtractionResult> {
    // If a clean size chart is not embedded in the initial static HTML (common in modern single-page apps),
    // report manual_required with honest transparency per 01_PRODUCT_REQUIREMENTS.md.
    const warnings: string[] = [
      "Retailer size chart is rendered client-side or behind dynamic modal. Manual chart fallback activated.",
    ];

    return {
      status: "manual_required",
      sourceType: "manual",
      warnings,
    };
  }
}
