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
  });
});

