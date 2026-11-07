import { SizeChartData, SizeRow, GarmentCategory } from "./types";
import { DimensionKey } from "../sizing/weights";

export const PLAUSIBLE_LIMITS_CM: Record<string, { min: number; max: number }> = {
  chest: { min: 50, max: 200 },
  waist: { min: 40, max: 200 },
  hip: { min: 50, max: 220 },
  shoulder: { min: 25, max: 75 },
  inseam: { min: 40, max: 120 },
  outseam: { min: 60, max: 160 },
  height: { min: 100, max: 250 },
  length: { min: 30, max: 180 },
};

const INCH_TO_CM = 2.54;

export interface ChartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedChart?: SizeChartData;
}

/**
 * Validates, normalizes to cm, and checks physical realism of a size chart.
 */
export function validateAndNormalizeSizeChart(chart: SizeChartData): ChartValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!chart) {
    return { isValid: false, errors: ["Size chart data is null or undefined."], warnings };
  }

  if (!chart.sizes || !Array.isArray(chart.sizes) || chart.sizes.length === 0) {
    return { isValid: false, errors: ["Size chart contains no size rows."], warnings };
  }

  const isInch = chart.unit === "in";
  const scale = isInch ? INCH_TO_CM : 1.0;

  const normalizedSizes: SizeRow[] = [];

  for (let i = 0; i < chart.sizes.length; i++) {
    const rawRow = chart.sizes[i];
    if (!rawRow || !rawRow.label || rawRow.label.trim() === "") {
      errors.push(`Size row at index ${i} is missing a size label.`);
      continue;
    }

    const label = rawRow.label.trim();
    let validDimensionsCount = 0;

    const normalizedRow: SizeRow = {
      label,
      source: rawRow.source || (chart.provenance?.sourceType === "manual" ? "manual" : "brand_chart"),
      sourceUrl: rawRow.sourceUrl || chart.provenance?.sourceUrl,
      legMeasurementType: rawRow.legMeasurementType,
    };

    if (chart.type === "body_ranges") {
      const bodyRanges: NonNullable<SizeRow["bodyRanges"]> = {};
      const ranges = rawRow.bodyRanges || {};

      for (const [key, range] of Object.entries(ranges)) {
        const dim = key as DimensionKey;
        if (!range) continue;

        const hasMin = range.min !== undefined && range.min !== null && !isNaN(range.min);
        const hasMax = range.max !== undefined && range.max !== null && !isNaN(range.max);

        if (hasMin !== hasMax) {
          errors.push(
            `Size "${label}" has incomplete range for ${dim}: both min and max are required.`
          );
          continue;
        }

        if (hasMin && hasMax) {
          if (range.min <= 0 || range.max <= 0) {
            errors.push(`Size "${label}" has non-positive bounds for ${dim}.`);
            continue;
          }
          if (range.min > range.max) {
            errors.push(
              `Size "${label}" has reversed bounds for ${dim}: min (${range.min}) exceeds max (${range.max}).`
            );
            continue;
          }

          const minCm = Math.round(range.min * scale * 10) / 10;
          const maxCm = Math.round(range.max * scale * 10) / 10;

          const limit = PLAUSIBLE_LIMITS_CM[dim];
          if (limit) {
            if (minCm < limit.min || maxCm > limit.max) {
              errors.push(
                `Size "${label}" has physically implausible ${dim} range (${minCm}–${maxCm} cm). Plausible bounds: ${limit.min}–${limit.max} cm.`
              );
              continue;
            }
          }

          bodyRanges[dim] = { min: minCm, max: maxCm };
          validDimensionsCount++;
        }
      }

      if (validDimensionsCount === 0) {
        errors.push(`Size "${label}" has no valid measurement ranges.`);
      } else {
        normalizedRow.bodyRanges = bodyRanges;
      }
    } else if (chart.type === "garment_measures") {
      const garmentMeasures: NonNullable<SizeRow["garmentMeasures"]> = {};
      const measures = rawRow.garmentMeasures || {};

      for (const [key, rawVal] of Object.entries(measures)) {
        const dim = key as keyof NonNullable<SizeRow["garmentMeasures"]>;
        if (rawVal === undefined || rawVal === null || isNaN(rawVal)) continue;

        if (rawVal <= 0) {
          errors.push(`Size "${label}" has non-positive measurement for ${dim}.`);
          continue;
        }

        const valCm = Math.round(rawVal * scale * 10) / 10;
        const limit = PLAUSIBLE_LIMITS_CM[dim];
        if (limit) {
          // Half-measures might be half of min, e.g. pit-to-pit 25cm
          const minPlausible = dim === "chest" || dim === "waist" || dim === "hip" ? limit.min * 0.45 : limit.min;
          if (valCm < minPlausible || valCm > limit.max) {
            errors.push(
              `Size "${label}" has physically implausible ${dim} measurement (${valCm} cm).`
            );
            continue;
          }
        }

        garmentMeasures[dim] = valCm;
        validDimensionsCount++;
      }

      if (validDimensionsCount === 0) {
        errors.push(`Size "${label}" has no valid garment measurements.`);
      } else {
        normalizedRow.garmentMeasures = garmentMeasures;
      }
    } else {
      errors.push(`Unsupported size chart type: "${chart.type}". Expected "body_ranges" or "garment_measures".`);
    }

    normalizedSizes.push(normalizedRow);
  }

  // Provenance and verification rules
  const sourceType = chart.provenance?.sourceType || "manual";
  let isEstimate = chart.provenance?.isEstimate ?? false;
  let verifiedAt = chart.provenance?.verifiedAt;

  // Never mark manual or generic fallback charts as verified product charts
  if (sourceType === "manual") {
    isEstimate = true;
    warnings.push("Manual size chart requires user verification.");
  } else if (sourceType === "brand") {
    warnings.push("Brand-level chart is generic across styles; fit may vary by specific cut.");
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  const normalizedChart: SizeChartData = {
    type: chart.type,
    unit: "cm",
    category: chart.category || "top",
    sizes: normalizedSizes,
    provenance: {
      sourceType,
      sourceUrl: chart.provenance?.sourceUrl,
      verifiedAt,
      isEstimate,
    },
  };

  return {
    isValid: true,
    errors: [],
    warnings,
    normalizedChart,
  };
}

