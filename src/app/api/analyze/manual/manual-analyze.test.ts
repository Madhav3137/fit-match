import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("Manual Chart API Validation (POST /api/analyze/manual)", () => {
  const createRequest = (body: any) =>
    new NextRequest("http://localhost:3000/api/analyze/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  it("rejects reversed ranges where min exceeds max with 400 status", async () => {
    const reversedPayload = {
      productTitle: "Test Trouser",
      brand: "Acme",
      category: "trousers",
      sizes: [
        {
          label: "32",
          waistMin: 85,
          waistMax: 80, // Reversed!
        },
      ],
    };

    const res = await POST(createRequest(reversedPayload));
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.code).toBe("INVALID_CHART_DATA");
    expect(JSON.stringify(body.error.details)).toContain("cannot exceed maximum");
  });

  it("rejects incomplete ranges where only min or max is provided with 400 status", async () => {
    const incompletePayload = {
      productTitle: "Test Trouser",
      brand: "Acme",
      category: "trousers",
      sizes: [
        {
          label: "32",
          waistMin: 80, // waistMax missing!
        },
      ],
    };

    const res = await POST(createRequest(incompletePayload));
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.code).toBe("INVALID_CHART_DATA");
    expect(JSON.stringify(body.error.details)).toContain("both minimum and maximum bounds are required");
  });

  it("rejects size definitions that contain no valid measurement ranges", async () => {
    const emptySizePayload = {
      productTitle: "Test Top",
      brand: "Acme",
      category: "top",
      sizes: [
        {
          label: "M",
        },
      ],
    };

    const res = await POST(createRequest(emptySizePayload));
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.code).toBe("INVALID_CHART_DATA");
    expect(JSON.stringify(body.error.details)).toContain("must include at least one complete measurement range");
  });

  it("accepts valid sizes with complete ranges including outseam and inseam", async () => {
    const validPayload = {
      productTitle: "Tailored Trousers",
      brand: "COS",
      category: "trousers",
      sizes: [
        {
          label: "48",
          waistMin: 80,
          waistMax: 84,
          hipMin: 96,
          hipMax: 100,
          inseamMin: 80,
          inseamMax: 83,
          outseamMin: 104,
          outseamMax: 107,
        },
      ],
      profileData: {
        heightCm: 178,
        waistCm: 82,
        hipCm: 98,
        outseamCm: 105,
        fitPreference: "regular",
      },
    };

    const res = await POST(createRequest(validPayload));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.recommendation).toBeDefined();
    expect(body.recommendation.recommendedSize).toBe("48");
  });

  it("accepts garment_measures chartType and evaluates using ease models", async () => {
    const garmentPayload = {
      productTitle: "Relaxed Fit Tee",
      brand: "Acme",
      category: "top",
      chartType: "garment_measures",
      sizes: [
        { label: "S", chest: 100, waist: 90 },
        { label: "M", chest: 108, waist: 96 },
        { label: "L", chest: 116, waist: 102 },
      ],
      profileData: {
        heightCm: 180,
        chestCm: 100, // 100cm body matches 108cm (+8cm ease)
        waistCm: 88,
        fitPreference: "regular",
      },
    };

    const res = await POST(createRequest(garmentPayload));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.chart.chart.type).toBe("garment_measures");
    expect(body.recommendation.recommendedSize).toBe("M");
    expect(body.recommendation.reasons.some((r: string) => r.includes("ease allowances"))).toBe(true);
  });

  it("converts inches to centimeters when unit is 'in'", async () => {
    const inchPayload = {
      productTitle: "Oxford Shirt",
      brand: "Gitman",
      category: "top",
      chartType: "body_ranges",
      unit: "in",
      sizes: [
        {
          label: "M",
          chestMin: 38, // 38in = 96.5cm
          chestMax: 40, // 40in = 101.6cm
          waistMin: 32, // 32in = 81.3cm
          waistMax: 34, // 34in = 86.4cm
        },
      ],
      profileData: {
        heightCm: 180,
        chestCm: 99,
        waistCm: 83,
        fitPreference: "regular",
      },
    };

    const res = await POST(createRequest(inchPayload));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.chart.chart.unit).toBe("cm");
    const mSize = body.chart.chart.sizes[0];
    expect(mSize.bodyRanges.chest.min).toBe(96.5);
    expect(mSize.bodyRanges.chest.max).toBe(101.6);
    expect(body.recommendation.recommendedSize).toBe("M");
  });

  it("rejects garment_measures with non-positive values", async () => {
    const invalidGarmentPayload = {
      productTitle: "Shirt",
      brand: "Acme",
      category: "top",
      chartType: "garment_measures",
      sizes: [
        { label: "M", chest: -5 },
      ],
    };

    const res = await POST(createRequest(invalidGarmentPayload));
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.code).toBe("INVALID_CHART_DATA");
  });
});

