import { GarmentCategory } from "../retailers/types";
import { DimensionKey, DIMENSION_SCALES, DIMENSION_LABELS } from "./weights";
import { FitPreference } from "./types";

export interface EaseAllowance {
  targetEaseCm: number;
  minEaseCm: number;
  maxEaseCm: number;
}

export const CATEGORY_EASE_MODELS: Record<
  GarmentCategory,
  Record<FitPreference, Partial<Record<DimensionKey, EaseAllowance>>>
> = {
  top: {
    slim: {
      chest: { targetEaseCm: 5.0, minEaseCm: 3.0, maxEaseCm: 7.0 },
      waist: { targetEaseCm: 4.0, minEaseCm: 2.0, maxEaseCm: 7.0 },
      shoulder: { targetEaseCm: 0.5, minEaseCm: -0.5, maxEaseCm: 1.5 },
      height: { targetEaseCm: 0.0, minEaseCm: -5.0, maxEaseCm: 5.0 },
    },
    regular: {
      chest: { targetEaseCm: 8.0, minEaseCm: 5.0, maxEaseCm: 12.0 },
      waist: { targetEaseCm: 7.0, minEaseCm: 4.0, maxEaseCm: 11.0 },
      shoulder: { targetEaseCm: 1.5, minEaseCm: 0.0, maxEaseCm: 3.0 },
      height: { targetEaseCm: 0.0, minEaseCm: -5.0, maxEaseCm: 5.0 },
    },
    relaxed: {
      chest: { targetEaseCm: 15.0, minEaseCm: 11.0, maxEaseCm: 20.0 },
      waist: { targetEaseCm: 13.0, minEaseCm: 8.0, maxEaseCm: 18.0 },
      shoulder: { targetEaseCm: 3.5, minEaseCm: 1.5, maxEaseCm: 5.5 },
      height: { targetEaseCm: 0.0, minEaseCm: -5.0, maxEaseCm: 5.0 },
    },
  },
  outerwear: {
    slim: {
      chest: { targetEaseCm: 10.0, minEaseCm: 7.0, maxEaseCm: 14.0 },
      waist: { targetEaseCm: 9.0, minEaseCm: 6.0, maxEaseCm: 13.0 },
      shoulder: { targetEaseCm: 2.0, minEaseCm: 0.5, maxEaseCm: 3.5 },
      height: { targetEaseCm: 0.0, minEaseCm: -5.0, maxEaseCm: 5.0 },
    },
    regular: {
      chest: { targetEaseCm: 15.0, minEaseCm: 11.0, maxEaseCm: 20.0 },
      waist: { targetEaseCm: 14.0, minEaseCm: 10.0, maxEaseCm: 19.0 },
      shoulder: { targetEaseCm: 3.5, minEaseCm: 1.5, maxEaseCm: 5.5 },
      height: { targetEaseCm: 0.0, minEaseCm: -5.0, maxEaseCm: 5.0 },
    },
    relaxed: {
      chest: { targetEaseCm: 22.0, minEaseCm: 16.0, maxEaseCm: 28.0 },
      waist: { targetEaseCm: 20.0, minEaseCm: 15.0, maxEaseCm: 26.0 },
      shoulder: { targetEaseCm: 5.0, minEaseCm: 3.0, maxEaseCm: 7.5 },
      height: { targetEaseCm: 0.0, minEaseCm: -5.0, maxEaseCm: 5.0 },
    },
  },
  trousers: {
    slim: {
      waist: { targetEaseCm: 1.0, minEaseCm: 0.0, maxEaseCm: 2.5 },
      hip: { targetEaseCm: 3.5, minEaseCm: 2.0, maxEaseCm: 5.5 },
      inseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
      outseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
    },
    regular: {
      waist: { targetEaseCm: 2.5, minEaseCm: 1.0, maxEaseCm: 4.5 },
      hip: { targetEaseCm: 6.5, minEaseCm: 4.0, maxEaseCm: 9.5 },
      inseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
      outseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
    },
    relaxed: {
      waist: { targetEaseCm: 5.0, minEaseCm: 3.0, maxEaseCm: 7.5 },
      hip: { targetEaseCm: 11.0, minEaseCm: 7.5, maxEaseCm: 15.0 },
      inseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
      outseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
    },
  },
  dress: {
    slim: {
      chest: { targetEaseCm: 3.5, minEaseCm: 1.5, maxEaseCm: 5.5 },
      waist: { targetEaseCm: 2.5, minEaseCm: 0.5, maxEaseCm: 4.5 },
      hip: { targetEaseCm: 4.0, minEaseCm: 2.0, maxEaseCm: 6.5 },
    },
    regular: {
      chest: { targetEaseCm: 7.0, minEaseCm: 4.0, maxEaseCm: 10.0 },
      waist: { targetEaseCm: 5.5, minEaseCm: 3.0, maxEaseCm: 8.0 },
      hip: { targetEaseCm: 8.0, minEaseCm: 5.0, maxEaseCm: 11.5 },
    },
    relaxed: {
      chest: { targetEaseCm: 12.0, minEaseCm: 8.0, maxEaseCm: 16.0 },
      waist: { targetEaseCm: 10.0, minEaseCm: 6.5, maxEaseCm: 14.0 },
      hip: { targetEaseCm: 14.0, minEaseCm: 9.5, maxEaseCm: 19.0 },
    },
  },
  other: {
    slim: {
      chest: { targetEaseCm: 5.0, minEaseCm: 3.0, maxEaseCm: 7.0 },
      waist: { targetEaseCm: 3.0, minEaseCm: 1.0, maxEaseCm: 5.0 },
      hip: { targetEaseCm: 4.0, minEaseCm: 2.0, maxEaseCm: 6.5 },
      inseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
      outseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
    },
    regular: {
      chest: { targetEaseCm: 8.0, minEaseCm: 5.0, maxEaseCm: 12.0 },
      waist: { targetEaseCm: 5.0, minEaseCm: 2.5, maxEaseCm: 8.0 },
      hip: { targetEaseCm: 7.0, minEaseCm: 4.5, maxEaseCm: 10.5 },
      inseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
      outseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
    },
    relaxed: {
      chest: { targetEaseCm: 15.0, minEaseCm: 11.0, maxEaseCm: 20.0 },
      waist: { targetEaseCm: 10.0, minEaseCm: 6.0, maxEaseCm: 14.0 },
      hip: { targetEaseCm: 12.0, minEaseCm: 8.0, maxEaseCm: 16.0 },
      inseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
      outseam: { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 },
    },
  },
};

/**
 * Returns the dimensional ease allowance for category, dimension, and fit preference.
 */
export function getEaseAllowance(
  category: GarmentCategory,
  dimension: DimensionKey,
  fitPreference: FitPreference = "regular"
): EaseAllowance {
  const model = CATEGORY_EASE_MODELS[category] || CATEGORY_EASE_MODELS.other;
  const prefModel = model[fitPreference] || model.regular;
  const allowance = prefModel[dimension];

  if (allowance) return allowance;

  // Fallback defaults if dimension is not explicitly specified
  if (dimension === "inseam" || dimension === "outseam") {
    return { targetEaseCm: 0.0, minEaseCm: -2.0, maxEaseCm: 2.0 };
  }
  if (dimension === "waist") {
    return { targetEaseCm: 4.0, minEaseCm: 2.0, maxEaseCm: 7.0 };
  }
  return { targetEaseCm: 6.0, minEaseCm: 3.0, maxEaseCm: 10.0 };
}

/**
 * Normalizes flat garment width to total circumference if detected as a half-measure.
 */
export function normalizeGarmentMeasure(
  rawVal: number,
  dimension: DimensionKey,
  userBodyVal?: number | null
): { valueCm: number; isHalfMeasure: boolean } {
  if (dimension === "chest" || dimension === "waist" || dimension === "hip") {
    if (userBodyVal && userBodyVal > 60 && rawVal <= 70 && rawVal < userBodyVal * 0.65) {
      return {
        valueCm: Math.round(rawVal * 2 * 10) / 10,
        isHalfMeasure: true,
      };
    }
  }
  return { valueCm: rawVal, isHalfMeasure: false };
}

export interface GarmentMeasureEvaluation {
  penalty: number;
  deltaCm: number;
  actualEaseCm: number;
  targetEaseCm: number;
  status: "ideal" | "snug" | "loose";
  explanation: string;
}

const MAX_PENALTY_CAP = 3.0;

/**
 * Evaluates a garment measurement against a user's body measurement using category ease allowance.
 */
export function evaluateGarmentMeasure(
  userVal: number,
  garmentVal: number,
  dimension: DimensionKey,
  category: GarmentCategory,
  fitPreference: FitPreference = "regular"
): GarmentMeasureEvaluation {
  const allowance = getEaseAllowance(category, dimension, fitPreference);
  const scale = DIMENSION_SCALES[dimension] || 6.0;

  // Actual ease provided by the garment over the body
  const actualEase = garmentVal - userVal;
  const actualEaseCm = Math.round(actualEase * 10) / 10;
  const targetEaseCm = allowance.targetEaseCm;

  let penalty = 0;
  let status: "ideal" | "snug" | "loose" = "ideal";
  let deltaCm = 0;
  let explanation = "";

  const dimLabel = DIMENSION_LABELS[dimension].toLowerCase();

  if (actualEase >= allowance.minEaseCm && actualEase <= allowance.maxEaseCm) {
    // Within ideal ease range for this category/preference
    status = "ideal";
    const easeDiff = Math.abs(actualEase - targetEaseCm);
    // Subtle gradient towards target ease
    penalty = Math.min(0.15, easeDiff / (scale * 3));
    deltaCm = Math.round((actualEase - targetEaseCm) * 10) / 10;
    explanation = `Garment ${dimLabel} (${garmentVal}cm) provides ${actualEaseCm}cm ease over your ${userVal}cm body, matching ${fitPreference} fit criteria (ideal target: +${targetEaseCm}cm).`;
  } else if (actualEase < allowance.minEaseCm) {
    // Insufficient ease -> snug/tight
    status = "snug";
    const underEase = allowance.minEaseCm - actualEase;
    const rawPenalty = underEase / scale;
    penalty = Math.min(MAX_PENALTY_CAP, rawPenalty);
    deltaCm = Math.round((actualEase - allowance.minEaseCm) * 10) / 10;
    explanation = `Garment ${dimLabel} (${garmentVal}cm) provides only ${actualEaseCm}cm ease over your ${userVal}cm body (${Math.abs(deltaCm)}cm below minimum comfortable ease of +${allowance.minEaseCm}cm).`;
  } else {
    // Excessive ease -> loose
    status = "loose";
    const overEase = actualEase - allowance.maxEaseCm;
    const rawPenalty = overEase / scale;
    penalty = Math.min(MAX_PENALTY_CAP, rawPenalty);
    deltaCm = Math.round(overEase * 10) / 10;
    explanation = `Garment ${dimLabel} (${garmentVal}cm) provides ${actualEaseCm}cm ease over your ${userVal}cm body (${deltaCm}cm above maximum recommended ease of +${allowance.maxEaseCm}cm).`;
  }

  // Preference-specific calibration adjustments
  if (fitPreference === "slim") {
    if (status === "snug") penalty += 0.12;
    if (status === "loose") penalty += 0.10;
  } else if (fitPreference === "relaxed") {
    if (status === "snug") penalty += 0.30; // Strongly disfavor constriction in relaxed fit
    if (status === "loose") penalty = Math.max(0, penalty - 0.08); // Relaxed drape is more forgiving of extra ease
  }

  return {
    penalty: Math.round(penalty * 1000) / 1000,
    deltaCm,
    actualEaseCm,
    targetEaseCm,
    status,
    explanation,
  };
}

