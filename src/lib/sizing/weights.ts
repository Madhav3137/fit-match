import { GarmentCategory } from "../retailers/types";

export type DimensionKey = "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | "outseam";

export const DIMENSION_SCALES: Record<DimensionKey, number> = {
  chest: 6.0,
  waist: 5.0,
  hip: 6.0,
  shoulder: 3.0,
  inseam: 4.0,
  outseam: 5.0,
  height: 8.0,
};

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  height: "Height",
  chest: "Chest / Bust",
  waist: "Waist",
  hip: "Hips",
  shoulder: "Shoulder Width",
  inseam: "Inner Inseam",
  outseam: "Outer Outseam",
};

export const CATEGORY_BASE_WEIGHTS: Record<GarmentCategory, Partial<Record<DimensionKey, number>>> = {
  top: {
    chest: 0.45,
    shoulder: 0.25,
    waist: 0.15,
    height: 0.15,
  },
  trousers: {
    waist: 0.40,
    hip: 0.35,
    inseam: 0.25,
    outseam: 0.25,
  },
  outerwear: {
    chest: 0.40,
    shoulder: 0.30,
    height: 0.15,
    waist: 0.15,
  },
  dress: {
    chest: 0.35,
    waist: 0.35,
    hip: 0.30,
  },
  other: {
    chest: 0.35,
    waist: 0.35,
    height: 0.30,
  },
};

/**
 * Renormalizes weights so that available dimensions sum to exactly 1.0.
 */
export function renormalizeWeights(
  category: GarmentCategory,
  availableDimensions: DimensionKey[]
): Record<DimensionKey, number> {
  const base = CATEGORY_BASE_WEIGHTS[category] || CATEGORY_BASE_WEIGHTS.other;
  const filteredWeights: Partial<Record<DimensionKey, number>> = {};
  let totalWeight = 0;

  for (const dim of availableDimensions) {
    const w = base[dim];
    if (w !== undefined && w > 0) {
      filteredWeights[dim] = w;
      totalWeight += w;
    }
  }

  const result = {} as Record<DimensionKey, number>;

  // If no category-specific matches found, distribute evenly across available
  if (totalWeight <= 0) {
    const equalShare = availableDimensions.length > 0 ? 1 / availableDimensions.length : 0;
    for (const dim of availableDimensions) {
      result[dim] = equalShare;
    }
    return result;
  }

  for (const dim of availableDimensions) {
    const raw = filteredWeights[dim] || 0;
    result[dim] = raw / totalWeight;
  }

  return result;
}

