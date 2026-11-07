import { describe, it, expect } from "vitest";
import {
  cmToInches,
  inchesToCm,
  normalizeToCm,
  formatMeasurement,
  displayFromCm,
} from "./converter";

describe("Unit Converter", () => {
  it("converts centimeters to inches accurately", () => {
    // 1 inch = 2.54 cm
    expect(cmToInches(2.54)).toBe(1.0);
    expect(cmToInches(100)).toBe(39.4);
    expect(cmToInches(180)).toBe(70.9);
  });

  it("converts inches to centimeters accurately", () => {
    expect(inchesToCm(1)).toBe(2.5);
    expect(inchesToCm(39.4)).toBe(100.1);
    expect(inchesToCm(70.9)).toBe(180.1);
  });

  it("handles zero and negative or invalid values gracefully", () => {
    expect(cmToInches(0)).toBe(0);
    expect(inchesToCm(0)).toBe(0);
    expect(cmToInches(-10)).toBe(0);
    expect(inchesToCm(-5)).toBe(0);
  });

  it("formats measurements appropriately", () => {
    expect(formatMeasurement(100, "cm")).toBe("100 cm");
    expect(formatMeasurement(100, "in")).toBe("39.4 in");
    expect(formatMeasurement(undefined, "cm")).toBe("—");
    expect(formatMeasurement(0, "in")).toBe("—");
  });

  it("normalizes to cm accurately", () => {
    expect(normalizeToCm(100, "cm")).toBe(100);
    expect(normalizeToCm(39.4, "in")).toBe(100.1);
  });

  it("displays from stored cm appropriately", () => {
    expect(displayFromCm(100, "cm")).toBe(100);
    expect(displayFromCm(100, "in")).toBe(39.4);
    expect(displayFromCm(undefined, "cm")).toBe("");
  });

  it("converts and formats outseam measurements in standard clothing ranges", () => {
    const outseamCm = 104; // Typical men's/unisex outseam
    const outseamIn = cmToInches(outseamCm);
    expect(outseamIn).toBe(40.9);
    expect(formatMeasurement(outseamCm, "in")).toBe("40.9 in");
    expect(formatMeasurement(outseamCm, "cm")).toBe("104 cm");
    expect(normalizeToCm(outseamIn, "in")).toBe(103.9);
  });

  it("preserves exact canonical measurement across multiple back-and-forth unit switches without rounding drift", () => {
    const originalCm = 178; // e.g. User enters 178 cm height or 106 cm outseam
    let currentUnit: "cm" | "in" = "cm";
    let displayVal: number | string = originalCm;

    for (let i = 0; i < 20; i++) {
      currentUnit = currentUnit === "cm" ? "in" : "cm";
      displayVal = displayFromCm(originalCm, currentUnit);
      if (currentUnit === "cm") {
        expect(displayVal).toBe(178); // Exact preservation; no drift to 178.1 or 178.2
      } else {
        expect(displayVal).toBe(70.1);
      }
    }
  });
});

