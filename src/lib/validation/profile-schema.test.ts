import { describe, it, expect } from "vitest";
import {
  MeasurementProfileSchema,
  PLAUSIBLE_RANGES_CM,
} from "./profile-schema";

describe("MeasurementProfileSchema", () => {
  const validProfile = {
    unit: "cm" as const,
    heightCm: 178,
    chestCm: 98,
    waistCm: 82,
    hipCm: 96,
    shoulderCm: 45,
    inseamCm: 80,
    fitPreference: "regular" as const,
    consentToStore: true,
  };

  it("validates a complete and plausible profile", () => {
    const res = MeasurementProfileSchema.safeParse(validProfile);
    expect(res.success).toBe(true);
  });

  it("allows optional fields to be null or omitted", () => {
    const minimalProfile = {
      unit: "cm" as const,
      heightCm: 175,
      chestCm: 94,
      waistCm: 80,
      fitPreference: "slim" as const,
      consentToStore: true,
    };
    const res = MeasurementProfileSchema.safeParse(minimalProfile);
    expect(res.success).toBe(true);
  });

  it("fails when required fields are missing", () => {
    const missingChest = {
      unit: "cm" as const,
      heightCm: 175,
      waistCm: 80,
      fitPreference: "slim" as const,
      consentToStore: true,
    };
    const res = MeasurementProfileSchema.safeParse(missingChest);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some((i) => i.path.includes("chestCm"))).toBe(true);
    }
  });

  it("rejects values outside plausible human boundaries", () => {
    const implausibleHeight = {
      ...validProfile,
      heightCm: 50, // Below 120 cm min
    };
    const resHeight = MeasurementProfileSchema.safeParse(implausibleHeight);
    expect(resHeight.success).toBe(false);

    const implausibleWaist = {
      ...validProfile,
      waistCm: 300, // Above 150 cm max
    };
    const resWaist = MeasurementProfileSchema.safeParse(implausibleWaist);
    expect(resWaist.success).toBe(false);
  });

  it("requires consentToStore to be explicitly true", () => {
    const noConsent = {
      ...validProfile,
      consentToStore: false,
    };
    const res = MeasurementProfileSchema.safeParse(noConsent);
    expect(res.success).toBe(false);
  });
});
