import { describe, it, expect } from "vitest";
import { detectGarmentCategory, GenericRetailerAdapter } from "./generic-adapter";

describe("Product Metadata Parser & Category Classifier", () => {
  it("classifies garment categories accurately from keywords", () => {
    expect(detectGarmentCategory("Heavyweight Boxy Cotton T-Shirt")).toBe("top");
    expect(detectGarmentCategory("Ribbed Cashmere Sweater")).toBe("top");
    expect(detectGarmentCategory("Relaxed Fit Carpenter Denim Jeans")).toBe("trousers");
    expect(detectGarmentCategory("Tailored Wool Chinos")).toBe("trousers");
    expect(detectGarmentCategory("Water-Repellent Puffer Jacket")).toBe("outerwear");
    expect(detectGarmentCategory("Single-Breasted Wool Blazer")).toBe("outerwear");
    expect(detectGarmentCategory("Pleated Midi Shirtdress")).toBe("dress");
    expect(detectGarmentCategory("Leather Belt With Brushed Buckle")).toBe("other");
  });

  it("extracts product metadata from JSON-LD schema", async () => {
    const htmlFixture = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Oversized Organic Cotton Tee",
            "description": "Premium 240gsm jersey cotton.",
            "brand": {
              "@type": "Brand",
              "name": "STUDIO LABEL"
            },
            "image": "https://example.com/image.jpg",
            "offers": [
              { "size": "S", "price": 45 },
              { "size": "M", "price": 45 },
              { "size": "L", "price": 45 }
            ]
          }
          </script>
        </head>
        <body></body>
      </html>
    `;

    const adapter = new GenericRetailerAdapter();
    const result = await adapter.extractProduct(htmlFixture, new URL("https://example.com/item/1"));

    expect(result.status).toBe("success");
    expect(result.title).toBe("Oversized Organic Cotton Tee");
    expect(result.brand).toBe("STUDIO LABEL");
    expect(result.category).toBe("top");
    expect(result.imageUrl).toBe("https://example.com/image.jpg");
    expect(result.availableSizes).toContain("M");
    expect(result.evidence).toContain("schema_org_jsonld");
  });

  it("extracts OpenGraph metadata when JSON-LD is absent", async () => {
    const ogHtmlFixture = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Relaxed Wide-Leg Trousers" />
          <meta property="og:site_name" content="NORDIC WEAR" />
          <meta property="og:image" content="https://example.com/trousers.jpg" />
          <meta property="og:description" content="Wide cut through hip and thigh." />
        </head>
        <body></body>
      </html>
    `;

    const adapter = new GenericRetailerAdapter();
    const result = await adapter.extractProduct(ogHtmlFixture, new URL("https://nordicwear.example/pants"));

    expect(result.status).toBe("success");
    expect(result.title).toBe("Relaxed Wide-Leg Trousers");
    expect(result.category).toBe("trousers");
    expect(result.brand).toBe("NORDIC WEAR");
    expect(result.imageUrl).toBe("https://example.com/trousers.jpg");
    expect(result.evidence).toContain("open_graph_title");
  });
});

