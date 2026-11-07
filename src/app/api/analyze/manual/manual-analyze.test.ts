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
});

