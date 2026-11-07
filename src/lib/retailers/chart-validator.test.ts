import { describe, it, expect } from "vitest";
import { validateAndNormalizeSizeChart } from "./chart-validator";
import { SizeChartData } from "./types";

describe("Size Chart Validation & Normalization (chart-validator.ts)", () => {
  it("normalizes inch dimensions to centimeters correctly", () => {
    const inchChart: SizeChartData = {
      type: "body_ranges",
      unit: "in",
      category: "top",
      sizes: [
        {
          label: "M",
          bodyRanges: {
            chest: { min: 38, max: 40 }, // ~96.5cm - 101.6cm
            waist: { min: 32, max: 34 }, // ~81.3cm - 86.4cm
          },
          source: "brand_chart",
        },
      ],
      provenance: {
        sourceType: "brand",
      },
    };

    const res = validateAndNormalizeSizeChart(inchChart);
    expect(res.isValid).toBe(true);
    expect(res.normalizedChart?.unit).toBe("cm");

    const sizeM = res.normalizedChart?.sizes[0];
    expect(sizeM?.bodyRanges?.chest?.min).toBe(96.5);
    expect(sizeM?.bodyRanges?.chest?.max).toBe(101.6);
    expect(sizeM?.bodyRanges?.waist?.min).toBe(81.3);
    expect(sizeM?.bodyRanges?.waist?.max).toBe(86.4);
  });

  it("rejects reversed ranges where min exceeds max", () => {
    const reversedChart: SizeChartData = {
      type: "body_ranges",
      unit: "cm",
      category: "trousers",
      sizes: [
        {
          label: "32",
          bodyRanges: {
            waist: { min: 85, max: 80 }, // Reversed!
          },
          source: "manual",
        },
      ],
      provenance: { sourceType: "manual" },
    };

    const res = validateAndNormalizeSizeChart(reversedChart);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("reversed bounds");
  });

  it("rejects physically impossible anatomical measurements", () => {
    const impossibleChart: SizeChartData = {
      type: "body_ranges",
      unit: "cm",
      category: "top",
      sizes: [
        {
          label: "XXS",
          bodyRanges: {
            chest: { min: 10, max: 15 }, // Human chest cannot be 15cm
          },
          source: "brand_chart",
        },
      ],
      provenance: { sourceType: "brand" },
    };

    const res = validateAndNormalizeSizeChart(impossibleChart);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("physically implausible chest range");
  });

  it("marks manual provenance charts with isEstimate: true", () => {
    const manualChart: SizeChartData = {
      type: "body_ranges",
      unit: "cm",
      category: "top",
      sizes: [
        {
          label: "L",
          bodyRanges: {
            chest: { min: 102, max: 108 },
            waist: { min: 88, max: 94 },
          },
          source: "manual",
        },
      ],
      provenance: {
        sourceType: "manual",
        isEstimate: false, // Attempt to claim it's verified
      },
    };

    const res = validateAndNormalizeSizeChart(manualChart);
    expect(res.isValid).toBe(true);
    expect(res.normalizedChart?.provenance.isEstimate).toBe(true);
    expect(res.warnings[0]).toContain("Manual size chart requires user verification");
  });

  it("validates garment measurement specifications properly", () => {
    const garmentChart: SizeChartData = {
      type: "garment_measures",
      unit: "cm",
      category: "top",
      sizes: [
        {
          label: "M",
          garmentMeasures: {
            chest: 108,
            waist: 94,
          },
          source: "product_chart",
        },
      ],
      provenance: {
        sourceType: "product",
      },
    };

    const res = validateAndNormalizeSizeChart(garmentChart);
    expect(res.isValid).toBe(true);
    expect(res.normalizedChart?.sizes[0].garmentMeasures?.chest).toBe(108);
  });
});

