import { describe, it, expect } from "vitest";
import {
  getEaseAllowance,
  normalizeGarmentMeasure,
  evaluateGarmentMeasure,
} from "./ease";

describe("Garment Ease Allowance Model (05_SIZE_MATCHING_ENGINE.md)", () => {
  describe("getEaseAllowance", () => {
    it("provides category-specific target and range ease for tops", () => {
      const slimTop = getEaseAllowance("top", "chest", "slim");
      const regularTop = getEaseAllowance("top", "chest", "regular");
      const relaxedTop = getEaseAllowance("top", "chest", "relaxed");

      expect(slimTop.targetEaseCm).toBe(5.0);
      expect(regularTop.targetEaseCm).toBe(8.0);
      expect(relaxedTop.targetEaseCm).toBe(15.0);
      expect(slimTop.minEaseCm).toBeLessThan(regularTop.minEaseCm);
    });

    it("requires greater chest ease for outerwear due to layering", () => {
      const topChest = getEaseAllowance("top", "chest", "regular");
      const outerChest = getEaseAllowance("outerwear", "chest", "regular");

      expect(outerChest.targetEaseCm).toBeGreaterThan(topChest.targetEaseCm);
      expect(outerChest.targetEaseCm).toBe(15.0);
    });

    it("provides tight, secure waistband ease for trousers", () => {
      const trouserWaist = getEaseAllowance("trousers", "waist", "regular");
      const topWaist = getEaseAllowance("top", "waist", "regular");

      // Trouser waistband must not have excessive ease (or pants slip)
      expect(trouserWaist.targetEaseCm).toBe(2.5);
      expect(trouserWaist.maxEaseCm).toBeLessThan(topWaist.maxEaseCm);
    });

    it("provides zero target ease for inseam and outseam leg lengths", () => {
      const inseamEase = getEaseAllowance("trousers", "inseam", "regular");
      const outseamEase = getEaseAllowance("trousers", "outseam", "regular");

      expect(inseamEase.targetEaseCm).toBe(0.0);
      expect(outseamEase.targetEaseCm).toBe(0.0);
    });
  });

  describe("normalizeGarmentMeasure", () => {
    it("detects and doubles flat half-measurements for chest/waist/hip", () => {
      const userChest = 100;
      const flatPitToPit = 53; // typical flat half-chest measurement

      const normalized = normalizeGarmentMeasure(flatPitToPit, "chest", userChest);
      expect(normalized.isHalfMeasure).toBe(true);
      expect(normalized.valueCm).toBe(106);
    });

    it("does not double when garment measure is already a full circumference", () => {
      const userChest = 100;
      const fullCircumference = 108;

      const normalized = normalizeGarmentMeasure(fullCircumference, "chest", userChest);
      expect(normalized.isHalfMeasure).toBe(false);
      expect(normalized.valueCm).toBe(108);
    });

    it("does not double length dimensions such as inseam or outseam", () => {
      const userInseam = 80;
      const garmentInseam = 81;

      const normalized = normalizeGarmentMeasure(garmentInseam, "inseam", userInseam);
      expect(normalized.isHalfMeasure).toBe(false);
      expect(normalized.valueCm).toBe(81);
    });
  });

  describe("evaluateGarmentMeasure", () => {
    it("evaluates a garment with ideal ease as status 'ideal'", () => {
      // User 100cm chest, garment 108cm chest (+8cm ease for top regular is target)
      const res = evaluateGarmentMeasure(100, 108, "chest", "top", "regular");

      expect(res.status).toBe("ideal");
      expect(res.actualEaseCm).toBe(8.0);
      expect(res.penalty).toBeLessThan(0.05);
      expect(res.explanation).toContain("matching regular fit criteria");
    });

    it("evaluates an excessively tight garment as status 'snug' with under-ease penalty", () => {
      // User 100cm chest, garment 101cm chest (+1cm ease, min is 5cm)
      const res = evaluateGarmentMeasure(100, 101, "chest", "top", "regular");

      expect(res.status).toBe("snug");
      expect(res.actualEaseCm).toBe(1.0);
      expect(res.penalty).toBeGreaterThan(0.3);
      expect(res.explanation).toContain("below minimum comfortable ease");
    });

    it("evaluates an oversized garment as status 'loose' with over-ease penalty", () => {
      // User 100cm chest, garment 125cm chest (+25cm ease, max is 12cm)
      const res = evaluateGarmentMeasure(100, 125, "chest", "top", "regular");

      expect(res.status).toBe("loose");
      expect(res.actualEaseCm).toBe(25.0);
      expect(res.penalty).toBeGreaterThan(0.5);
      expect(res.explanation).toContain("above maximum recommended ease");
    });

    it("penalizes snugness more heavily when user prefers relaxed fit", () => {
      const regularRes = evaluateGarmentMeasure(100, 101, "chest", "top", "regular");
      const relaxedRes = evaluateGarmentMeasure(100, 101, "chest", "top", "relaxed");

      expect(relaxedRes.penalty).toBeGreaterThan(regularRes.penalty);
    });
  });
});

