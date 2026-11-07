import { describe, it, expect } from "vitest";
import { calculateRangePenalty, matchSize } from "./matcher";
import { renormalizeWeights } from "./weights";
import { BodyProfile } from "./types";
import { SizeChartData } from "../retailers/types";

describe("Size Recommendation Engine (05_SIZE_MATCHING_ENGINE.md)", () => {
  describe("Range Penalty Formulation", () => {
    it("returns zero penalty and status 'ideal' when measurement is inside range", () => {
      const res = calculateRangePenalty(98, 95, 101, 6.0);
      expect(res.penalty).toBe(0);
      expect(res.deltaCm).toBe(0);
      expect(res.status).toBe("ideal");
    });

    it("returns normalized penalty and status 'loose' when measurement is below min", () => {
      // 95 - 89 = 6cm below min; scale = 6.0 -> penalty = 1.0
      const res = calculateRangePenalty(89, 95, 101, 6.0);
      expect(res.penalty).toBeCloseTo(1.0, 2);
      expect(res.deltaCm).toBe(-6);
      expect(res.status).toBe("loose");
    });

    it("returns normalized penalty and status 'snug' when measurement is above max", () => {
      // 104 - 101 = 3cm above max; scale = 6.0 -> penalty = 0.5
      const res = calculateRangePenalty(104, 95, 101, 6.0);
      expect(res.penalty).toBeCloseTo(0.5, 2);
      expect(res.deltaCm).toBe(3);
      expect(res.status).toBe("snug");
    });

    it("caps extreme penalty at 3.0", () => {
      const res = calculateRangePenalty(150, 95, 101, 6.0);
      expect(res.penalty).toBe(3.0);
      expect(res.status).toBe("snug");
    });
  });

  describe("Weight Renormalization", () => {
    it("renormalizes top weights to sum to 1.0 when shoulders and height are absent", () => {
      const weights = renormalizeWeights("top", ["chest", "waist"]);
      // Base top: chest 0.45, waist 0.15 -> total 0.60
      // Renormalized chest: 0.45 / 0.60 = 0.75
      // Renormalized waist: 0.15 / 0.60 = 0.25
      expect(weights.chest).toBeCloseTo(0.75, 2);
      expect(weights.waist).toBeCloseTo(0.25, 2);
      expect(weights.chest + weights.waist).toBeCloseTo(1.0, 5);
    });

    it("renormalizes trouser weights to sum to 1.0 when inseam is absent", () => {
      const weights = renormalizeWeights("trousers", ["waist", "hip"]);
      // Base trousers: waist 0.40, hip 0.35 -> total 0.75
      expect(weights.waist + weights.hip).toBeCloseTo(1.0, 5);
      expect(weights.waist).toBeGreaterThan(weights.hip);
    });

    it("renormalizes trouser weights accurately when outseam is present", () => {
      const weights = renormalizeWeights("trousers", ["waist", "hip", "outseam"]);
      // Base trousers: waist 0.40, hip 0.35, outseam 0.25 -> total 1.0
      expect(weights.waist).toBeCloseTo(0.40, 2);
      expect(weights.hip).toBeCloseTo(0.35, 2);
      expect(weights.outseam).toBeCloseTo(0.25, 2);
      expect(weights.waist + weights.hip + weights.outseam).toBeCloseTo(1.0, 5);
    });
  });

  describe("End-to-End Size Matching", () => {
    const sampleTeeChart: SizeChartData = {
      type: "body_ranges",
      unit: "cm",
      category: "top",
      sizes: [
        { label: "S", bodyRanges: { chest: { min: 88, max: 94 }, waist: { min: 74, max: 80 } }, source: "product_chart" },
        { label: "M", bodyRanges: { chest: { min: 95, max: 101 }, waist: { min: 81, max: 87 } }, source: "product_chart" },
        { label: "L", bodyRanges: { chest: { min: 102, max: 108 }, waist: { min: 88, max: 94 } }, source: "product_chart" },
      ],
      provenance: {
        sourceType: "product",
        verifiedAt: "2026-11-01T00:00:00Z",
      },
    };

    it("deterministically recommends Size M for a 98cm chest and 82cm waist profile", () => {
      const profile: BodyProfile = {
        heightCm: 180,
        chestCm: 98,
        waistCm: 82,
        fitPreference: "regular",
      };

      const result1 = matchSize(profile, sampleTeeChart);
      const result2 = matchSize(profile, sampleTeeChart);

      expect(result1.status).toBe("recommended");
      expect(result1.recommendedSize).toBe("M");
      expect(result1.confidence).toBe("high");
      expect(result1.alternatives.length).toBeGreaterThan(0);
      expect(result1.fitBreakdown.some((b) => b.dimension === "chest" && b.status === "ideal")).toBe(true);
      expect(result1.fitBreakdown.some((b) => b.dimension === "waist" && b.status === "ideal")).toBe(true);

      // Verify determinism
      expect(result1.recommendedSize).toBe(result2.recommendedSize);
      expect(result1.overallScore).toBe(result2.overallScore);
    });

    it("matches trouser sizes using waist and hip weights", () => {
      const trouserChart: SizeChartData = {
        type: "body_ranges",
        unit: "cm",
        category: "trousers",
        sizes: [
          { label: "30", bodyRanges: { waist: { min: 75, max: 78 }, hip: { min: 90, max: 94 } }, source: "brand_chart" },
          { label: "32", bodyRanges: { waist: { min: 80, max: 83 }, hip: { min: 95, max: 99 } }, source: "brand_chart" },
          { label: "34", bodyRanges: { waist: { min: 85, max: 88 }, hip: { min: 100, max: 104 } }, source: "brand_chart" },
        ],
        provenance: {
          sourceType: "brand",
        },
      };

      const profile: BodyProfile = {
        heightCm: 175,
        waistCm: 82,
        hipCm: 97,
        fitPreference: "regular",
      };

      const result = matchSize(profile, trouserChart);
      expect(result.status).toBe("recommended");
      expect(result.recommendedSize).toBe("32");
    });

    it("returns 'no_match' when user dimensions are drastically outside all chart sizes", () => {
      const profile: BodyProfile = {
        heightCm: 190,
        chestCm: 145, // Chart ends at 108cm
        waistCm: 130,
        fitPreference: "regular",
      };

      const result = matchSize(profile, sampleTeeChart);
      expect(result.status).toBe("no_match");
      expect(result.recommendedSize).toBeUndefined();
      expect(result.reasons[0]).toContain("fall outside all available sizing ranges");
    });

    it("returns 'insufficient_data' when profile is missing required measurements", () => {
      const incompleteProfile: BodyProfile = {
        heightCm: 180,
        chestCm: null,
        waistCm: 0,
        fitPreference: "regular",
      };

      const result = matchSize(incompleteProfile, sampleTeeChart);
      expect(result.status).toBe("insufficient_data");
      expect(result.missingMeasurements).toContain("chest");
      expect(result.missingMeasurements).toContain("waist");
    });

    it("flags confidence as 'medium' when using manual chart provenance", () => {
      const manualChart: SizeChartData = {
        ...sampleTeeChart,
        provenance: {
          sourceType: "manual",
        },
      };

      const profile: BodyProfile = {
        heightCm: 180,
        chestCm: 98,
        waistCm: 82,
        fitPreference: "regular",
      };

      const result = matchSize(profile, manualChart);
      expect(result.confidence).toBe("medium");
    });

    it("explains when neither inseam nor outseam is available for trousers and caps confidence", () => {
      const trouserChart: SizeChartData = {
        type: "body_ranges",
        unit: "cm",
        category: "trousers",
        sizes: [
          { label: "30", bodyRanges: { waist: { min: 75, max: 78 }, hip: { min: 90, max: 94 } }, source: "brand_chart" },
          { label: "32", bodyRanges: { waist: { min: 80, max: 83 }, hip: { min: 95, max: 99 } }, source: "brand_chart" },
        ],
        provenance: { sourceType: "brand" },
      };

      const profileWithoutLegs: BodyProfile = {
        heightCm: 175,
        waistCm: 81,
        hipCm: 96,
        fitPreference: "regular",
        // no inseamCm, no outseamCm
      };

      const result = matchSize(profileWithoutLegs, trouserChart);
      expect(result.status).toBe("recommended");
      expect(result.confidence).toBe("medium"); // Capped from high because leg length is unknown
      expect(result.reasons.some((r) => r.includes("Neither Inseam nor Outseam was provided in your profile"))).toBe(true);
      // Ensure fitBreakdown does NOT fabricate an outseam or inseam
      expect(result.fitBreakdown.some((b) => b.dimension === "inseam" || b.dimension === "outseam")).toBe(false);
    });

    it("matches trousers with outseam and explains when chart has outseam bounds", () => {
      const trouserChartWithOutseam: SizeChartData = {
        type: "body_ranges",
        unit: "cm",
        category: "trousers",
        sizes: [
          {
            label: "30",
            bodyRanges: {
              waist: { min: 75, max: 78 },
              hip: { min: 90, max: 94 },
              outseam: { min: 101, max: 104 },
            },
            source: "brand_chart",
          },
          {
            label: "32",
            bodyRanges: {
              waist: { min: 80, max: 83 },
              hip: { min: 95, max: 99 },
              outseam: { min: 105, max: 108 },
            },
            source: "brand_chart",
          },
        ],
        provenance: { sourceType: "brand" },
      };

      const profileWithOutseam: BodyProfile = {
        heightCm: 178,
        waistCm: 82,
        hipCm: 97,
        outseamCm: 106,
        fitPreference: "regular",
      };

      const result = matchSize(profileWithOutseam, trouserChartWithOutseam);
      expect(result.status).toBe("recommended");
      expect(result.recommendedSize).toBe("32");
      expect(result.confidence).toBe("high");
      expect(result.fitBreakdown.some((b) => b.dimension === "outseam" && b.status === "ideal")).toBe(true);
    });

    it("never computes a fabricated outseam when profile only has inseam", () => {
      const trouserChartWithOutseam: SizeChartData = {
        type: "body_ranges",
        unit: "cm",
        category: "trousers",
        sizes: [
          {
            label: "32",
            bodyRanges: {
              waist: { min: 80, max: 83 },
              hip: { min: 95, max: 99 },
              outseam: { min: 105, max: 108 },
            },
            source: "brand_chart",
          },
        ],
        provenance: { sourceType: "brand" },
      };

      const profileWithInseamOnly: BodyProfile = {
        heightCm: 178,
        waistCm: 82,
        hipCm: 97,
        inseamCm: 82, // No outseam provided
        fitPreference: "regular",
      };

      const result = matchSize(profileWithInseamOnly, trouserChartWithOutseam);
      // Sizing engine must NOT fabricate outseam = 82 + 24 = 106
      expect(result.fitBreakdown.some((b) => b.dimension === "outseam")).toBe(false);
      expect(result.reasons.some((r) => r.includes("Garment size chart specifies Outseam bounds, but Outseam measurement is unavailable in your profile"))).toBe(true);
    });

    it("evaluates garment measurement charts using ease allowance rather than raw body circumference", () => {
      const garmentTopChart: SizeChartData = {
        type: "garment_measures",
        unit: "cm",
        category: "top",
        sizes: [
          {
            label: "S",
            garmentMeasures: { chest: 100, waist: 88 },
            source: "product_chart",
          },
          {
            label: "M",
            garmentMeasures: { chest: 108, waist: 94 },
            source: "product_chart",
          },
          {
            label: "L",
            garmentMeasures: { chest: 116, waist: 102 },
            source: "product_chart",
          },
        ],
        provenance: {
          sourceType: "product",
          verifiedAt: "2026-11-01T00:00:00Z",
        },
      };

      const userProfile: BodyProfile = {
        heightCm: 180,
        chestCm: 100, // Body chest is 100cm!
        waistCm: 87,
        fitPreference: "regular",
      };

      // In a raw circumference comparison, 100cm body would erroneously match Size S (100cm garment, 0 ease, skin-tight).
      // With ease allowance model, Size M (108cm chest, +8cm ease) must be recommended for regular fit!
      const result = matchSize(userProfile, garmentTopChart);
      expect(result.status).toBe("recommended");
      expect(result.recommendedSize).toBe("M");
      expect(result.reasons.some((r) => r.includes("ease allowances"))).toBe(true);

      const chestBreakdown = result.fitBreakdown.find((b) => b.dimension === "chest");
      expect(chestBreakdown?.status).toBe("ideal");
      expect(chestBreakdown?.explanation).toContain("provides 8cm ease");
    });

    it("applies fit preference shifts correctly in garment measurement charts", () => {
      const garmentTopChart: SizeChartData = {
        type: "garment_measures",
        unit: "cm",
        category: "top",
        sizes: [
          { label: "S", garmentMeasures: { chest: 104, waist: 90 }, source: "product_chart" },
          { label: "M", garmentMeasures: { chest: 112, waist: 98 }, source: "product_chart" },
          { label: "L", garmentMeasures: { chest: 120, waist: 106 }, source: "product_chart" },
        ],
        provenance: { sourceType: "product" },
      };

      const profile: BodyProfile = {
        heightCm: 180,
        chestCm: 100,
        waistCm: 86,
        fitPreference: "slim", // prefers closer cut (+5cm ease target)
      };

      const slimResult = matchSize(profile, garmentTopChart, "slim");
      expect(slimResult.recommendedSize).toBe("S");

      // For relaxed preference (+15cm ease target), L should be favored over S
      const relaxedResult = matchSize(profile, garmentTopChart, "relaxed");
      expect(relaxedResult.recommendedSize).toBe("M");
    });

    it("downgrades confidence to 'low' when there is a close tie between candidate sizes", () => {
      const tiedChart: SizeChartData = {
        type: "body_ranges",
        unit: "cm",
        category: "top",
        sizes: [
          { label: "1", bodyRanges: { chest: { min: 95, max: 100 }, waist: { min: 80, max: 85 } }, source: "product_chart" },
          { label: "2", bodyRanges: { chest: { min: 96, max: 101 }, waist: { min: 81, max: 86 } }, source: "product_chart" },
        ],
        provenance: { sourceType: "product" },
      };

      const profile: BodyProfile = {
        heightCm: 180,
        chestCm: 98,
        waistCm: 83,
        fitPreference: "regular",
      };

      const result = matchSize(profile, tiedChart);
      // Both sizes fit with 0 penalty (delta = 0 < 0.08)
      expect(result.confidence).toBe("low");
    });

    it("returns alternative sizes with trade-off explanations", () => {
      const sampleTeeChart: SizeChartData = {
        type: "body_ranges",
        unit: "cm",
        category: "top",
        sizes: [
          { label: "S", bodyRanges: { chest: { min: 88, max: 94 }, waist: { min: 74, max: 80 } }, source: "product_chart" },
          { label: "M", bodyRanges: { chest: { min: 95, max: 101 }, waist: { min: 81, max: 87 } }, source: "product_chart" },
          { label: "L", bodyRanges: { chest: { min: 102, max: 108 }, waist: { min: 88, max: 94 } }, source: "product_chart" },
        ],
        provenance: { sourceType: "product" },
      };

      const profile: BodyProfile = {
        heightCm: 180,
        chestCm: 96,
        waistCm: 82,
        fitPreference: "regular",
      };

      const result = matchSize(profile, sampleTeeChart);
      expect(result.alternatives.length).toBeGreaterThan(0);
      expect(result.alternatives[0].tradeoff).toBeTruthy();
    });
  });
});

