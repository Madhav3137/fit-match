import { GarmentCategory, SizeChartData, SizeRow } from "../retailers/types";
import {
  BodyProfile,
  FitBreakdownItem,
  AlternativeSize,
  RecommendationResult,
  FitPreference,
} from "./types";
import {
  DimensionKey,
  DIMENSION_SCALES,
  DIMENSION_LABELS,
  renormalizeWeights,
} from "./weights";
import {
  evaluateGarmentMeasure,
  normalizeGarmentMeasure,
} from "./ease";
import { validateAndNormalizeSizeChart } from "../retailers/chart-validator";

const MAX_PENALTY_CAP = 3.0;

/**
 * Calculates range penalty for a measurement against an interval [min, max].
 * Returns 0 if within range, or normalized distance outside range.
 */
export function calculateRangePenalty(
  userVal: number,
  min: number,
  max: number,
  scale: number
): { penalty: number; deltaCm: number; status: "ideal" | "snug" | "loose" } {
  if (userVal >= min && userVal <= max) {
    return { penalty: 0, deltaCm: 0, status: "ideal" };
  }

  if (userVal > max) {
    const delta = userVal - max;
    const rawPenalty = delta / scale;
    return {
      penalty: Math.min(MAX_PENALTY_CAP, rawPenalty),
      deltaCm: Math.round(delta * 10) / 10,
      status: "snug", // User is larger than size bounds
    };
  }

  const delta = min - userVal;
  const rawPenalty = delta / scale;
  return {
    penalty: Math.min(MAX_PENALTY_CAP, rawPenalty),
    deltaCm: Math.round(-delta * 10) / 10,
    status: "loose", // User is smaller than size bounds
  };
}

/**
 * Pure, deterministic size recommendation engine.
 * Distinguishes between body range matching and garment measurement ease matching.
 */
export function matchSize(
  profile: BodyProfile,
  inputChart: SizeChartData,
  fitPreferenceOverride?: FitPreference
): RecommendationResult {
  const disclaimer =
    "FITMATCH sizing guidance is an algorithmic estimate based on published retailer charts and physical dimensions. It does not constitute a legal or contractual fit guarantee.";

  const preference = fitPreferenceOverride || profile.fitPreference || "regular";

  // Validate and normalize chart dimensions to cm
  const validation = validateAndNormalizeSizeChart(inputChart);
  if (!validation.isValid || !validation.normalizedChart) {
    return {
      status: "insufficient_data",
      alternatives: [],
      confidence: "low",
      reasons: validation.errors.length > 0
        ? validation.errors
        : ["The size chart contains invalid or unparseable dimensional definitions."],
      missingMeasurements: [],
      chartSource: inputChart?.provenance?.sourceType || "unknown",
      disclaimer,
      fitBreakdown: [],
    };
  }

  const chart = validation.normalizedChart;
  const category = chart.category || "top";
  const sizes = chart.sizes;

  // 1. Identify category required dimensions
  const missingMeasurements: string[] = [];
  if (category === "top" || category === "outerwear") {
    if (!profile.chestCm && !profile.waistCm) {
      missingMeasurements.push("chest", "waist");
    }
  } else if (category === "trousers") {
    if (!profile.waistCm) {
      missingMeasurements.push("waist");
    }
  } else if (category === "dress") {
    if (!profile.chestCm && !profile.waistCm && !profile.hipCm) {
      missingMeasurements.push("chest", "waist");
    }
  }

  if (missingMeasurements.length > 0) {
    return {
      status: "insufficient_data",
      alternatives: [],
      confidence: "low",
      reasons: [
        `Your profile is missing required measurements (${missingMeasurements.join(", ")}) for ${category} evaluation.`,
      ],
      missingMeasurements,
      chartSource: chart.provenance?.sourceType || "unknown",
      disclaimer,
      fitBreakdown: [],
    };
  }

  // 2. Score each candidate size
  const candidateScores: Array<{
    size: SizeRow;
    totalPenalty: number;
    breakdowns: FitBreakdownItem[];
    evaluatedDimensionsCount: number;
  }> = [];

  const isGarmentMeasureChart = chart.type === "garment_measures";

  for (const sizeRow of sizes) {
    const activeDims: DimensionKey[] = [];
    const sizeBreakdowns: FitBreakdownItem[] = [];

    if (!isGarmentMeasureChart) {
      // === BODY RANGES MATCHING ===
      const ranges = sizeRow.bodyRanges;
      if (!ranges) continue;

      const dimValues: Partial<Record<DimensionKey, { userVal: number; min: number; max: number }>> = {};

      const checkDim = (key: DimensionKey, userVal?: number | null) => {
        if (userVal !== undefined && userVal !== null && userVal > 0) {
          const range = ranges[key];
          if (range && range.min !== undefined && range.max !== undefined && range.max >= range.min) {
            activeDims.push(key);
            dimValues[key] = { userVal, min: range.min, max: range.max };
          }
        }
      };

      checkDim("height", profile.heightCm);
      checkDim("chest", profile.chestCm);
      checkDim("waist", profile.waistCm);
      checkDim("hip", profile.hipCm);
      checkDim("shoulder", profile.shoulderCm);
      checkDim("inseam", profile.inseamCm);
      checkDim("outseam", profile.outseamCm);

      if (activeDims.length === 0) continue;

      const weights = renormalizeWeights(category, activeDims);
      let sizePenalty = 0;

      for (const dim of activeDims) {
        const data = dimValues[dim]!;
        const scale = DIMENSION_SCALES[dim];
        const weight = weights[dim] || 0;

        const { penalty, deltaCm, status } = calculateRangePenalty(
          data.userVal,
          data.min,
          data.max,
          scale
        );

        // Fit preference calibration for body ranges
        let adjustedPenalty = penalty;
        if (preference === "slim") {
          if (status === "snug") adjustedPenalty += 0.12;
          if (status === "loose") adjustedPenalty += 0.08;
        } else if (preference === "relaxed") {
          if (status === "snug") adjustedPenalty += 0.25;
          if (status === "loose") adjustedPenalty = Math.max(0, adjustedPenalty - 0.05);
        }

        sizePenalty += adjustedPenalty * weight;

        let explanation = "";
        if (status === "ideal") {
          explanation = `Your ${data.userVal}cm ${DIMENSION_LABELS[dim].toLowerCase()} falls comfortably within the ${data.min}–${data.max}cm range.`;
        } else if (status === "snug") {
          explanation = `Your ${data.userVal}cm ${DIMENSION_LABELS[dim].toLowerCase()} exceeds size bounds by ${deltaCm}cm.`;
        } else {
          explanation = `Your ${data.userVal}cm ${DIMENSION_LABELS[dim].toLowerCase()} is ${Math.abs(deltaCm)}cm below lower boundary.`;
        }

        sizeBreakdowns.push({
          dimension: dim,
          label: DIMENSION_LABELS[dim],
          userValueCm: data.userVal,
          rangeMinCm: data.min,
          rangeMaxCm: data.max,
          status,
          deltaCm,
          explanation,
        });
      }

      candidateScores.push({
        size: sizeRow,
        totalPenalty: Math.round(sizePenalty * 1000) / 1000,
        breakdowns: sizeBreakdowns,
        evaluatedDimensionsCount: activeDims.length,
      });
    } else {
      // === GARMENT MEASUREMENTS WITH EASE ALLOWANCE MATCHING ===
      const measures = sizeRow.garmentMeasures;
      if (!measures) continue;

      const dimMeasures: Partial<Record<DimensionKey, { userVal: number; garmentVal: number; wasHalf: boolean }>> = {};

      const checkGarmentDim = (key: Exclude<DimensionKey, "height">, userVal?: number | null) => {
        if (userVal !== undefined && userVal !== null && userVal > 0) {
          const rawGarmentVal = measures[key];
          if (rawGarmentVal !== undefined && rawGarmentVal !== null && rawGarmentVal > 0) {
            const { valueCm, isHalfMeasure } = normalizeGarmentMeasure(rawGarmentVal, key, userVal);
            activeDims.push(key);
            dimMeasures[key] = { userVal, garmentVal: valueCm, wasHalf: isHalfMeasure };
          }
        }
      };

      checkGarmentDim("chest", profile.chestCm);
      checkGarmentDim("waist", profile.waistCm);
      checkGarmentDim("hip", profile.hipCm);
      checkGarmentDim("shoulder", profile.shoulderCm);
      checkGarmentDim("inseam", profile.inseamCm);
      checkGarmentDim("outseam", profile.outseamCm);

      if (activeDims.length === 0) continue;

      const weights = renormalizeWeights(category, activeDims);
      let sizePenalty = 0;

      for (const dim of activeDims) {
        const item = dimMeasures[dim]!;
        const weight = weights[dim] || 0;

        const evaluation = evaluateGarmentMeasure(
          item.userVal,
          item.garmentVal,
          dim,
          category,
          preference
        );

        sizePenalty += evaluation.penalty * weight;

        const extraNote = item.wasHalf ? " (flat width doubled to circumference)" : "";

        sizeBreakdowns.push({
          dimension: dim,
          label: DIMENSION_LABELS[dim],
          userValueCm: item.userVal,
          rangeMinCm: item.garmentVal,
          rangeMaxCm: item.garmentVal,
          status: evaluation.status,
          deltaCm: evaluation.deltaCm,
          explanation: evaluation.explanation + extraNote,
        });
      }

      candidateScores.push({
        size: sizeRow,
        totalPenalty: Math.round(sizePenalty * 1000) / 1000,
        breakdowns: sizeBreakdowns,
        evaluatedDimensionsCount: activeDims.length,
      });
    }
  }

  if (candidateScores.length === 0) {
    return {
      status: "insufficient_data",
      alternatives: [],
      confidence: "low",
      reasons: ["No sizes in the chart contained dimensional specifications matching your profile."],
      missingMeasurements: [],
      chartSource: chart.provenance?.sourceType || "unknown",
      disclaimer,
      fitBreakdown: [],
    };
  }

  // 3. Rank sizes deterministically by penalty (lowest penalty wins)
  candidateScores.sort((a, b) => a.totalPenalty - b.totalPenalty);

  const best = candidateScores[0];
  const runnerUps = candidateScores.slice(1, 3);

  // 4. Check for No-Match threshold (all candidates too far)
  if (best.totalPenalty > 1.35) {
    return {
      status: "no_match",
      recommendedSize: undefined,
      alternatives: candidateScores.slice(0, 2).map((c) => ({
        size: c.size.label,
        tradeoff: `Closest candidate, but penalty score (${c.totalPenalty}) indicates significant dimensional mismatch.`,
        scoreDifference: c.totalPenalty,
      })),
      confidence: "low",
      reasons: [
        `Your measurements fall outside all available sizing ranges for this garment. Closest candidate was ${best.size.label}.`,
      ],
      missingMeasurements: [],
      chartSource: chart.provenance?.sourceType || "unknown",
      disclaimer,
      fitBreakdown: best.breakdowns,
      overallScore: best.totalPenalty,
    };
  }

  // 5. Honest Confidence Band Derivation
  let confidence: "high" | "medium" | "low" = "high";
  const secondBest = runnerUps[0];
  const scoreDelta = secondBest ? secondBest.totalPenalty - best.totalPenalty : 1.0;

  // Manual or estimate provenance cap
  if (chart.provenance?.sourceType === "manual" || chart.provenance?.isEstimate) {
    confidence = "medium";
  }

  // Coverage checks
  if (best.evaluatedDimensionsCount < 2) {
    confidence = "low";
  } else if (scoreDelta < 0.08) {
    confidence = "low"; // Close tie / ambiguous fit
  } else if (best.totalPenalty > 0.45) {
    if (confidence === "high") confidence = "medium";
    else confidence = "low";
  }

  // Trouser leg length evaluation check
  const evaluatedInseam = best.breakdowns.some((b) => b.dimension === "inseam");
  const evaluatedOutseam = best.breakdowns.some((b) => b.dimension === "outseam");
  const chartHasInseam = isGarmentMeasureChart
    ? sizes.some((s) => s.garmentMeasures?.inseam)
    : sizes.some((s) => s.bodyRanges?.inseam);
  const chartHasOutseam = isGarmentMeasureChart
    ? sizes.some((s) => s.garmentMeasures?.outseam)
    : sizes.some((s) => s.bodyRanges?.outseam);

  const profileHasInseam = profile.inseamCm !== undefined && profile.inseamCm !== null && profile.inseamCm > 0;
  const profileHasOutseam = profile.outseamCm !== undefined && profile.outseamCm !== null && profile.outseamCm > 0;

  if (category === "trousers" && !evaluatedInseam && !evaluatedOutseam) {
    if (confidence === "high") {
      confidence = "medium";
    }
  }

  // 6. Formulate Structured Reasons
  const reasons: string[] = [];
  const idealDims = best.breakdowns.filter((b) => b.status === "ideal");
  const snugDims = best.breakdowns.filter((b) => b.status === "snug");
  const looseDims = best.breakdowns.filter((b) => b.status === "loose");

  if (idealDims.length > 0) {
    reasons.push(
      `Size ${best.size.label} provides an ideal fit across ${idealDims.map((d) => d.label.toLowerCase()).join(" and ")}.`
    );
  }
  if (snugDims.length > 0) {
    reasons.push(
      `Expect a closer/snug fit at ${snugDims.map((d) => d.label.toLowerCase()).join(", ")}.`
    );
  }
  if (looseDims.length > 0) {
    reasons.push(
      `Allows extra room/drape through ${looseDims.map((d) => d.label.toLowerCase()).join(", ")}.`
    );
  }

  // Garment measure ease transparency
  if (isGarmentMeasureChart) {
    reasons.push(
      `Evaluated against garment finished dimensions using ${category}-specific ease allowances.`
    );
  }

  // Trouser length transparency explanation
  if (category === "trousers") {
    if (!evaluatedInseam && !evaluatedOutseam) {
      if (!profileHasInseam && !profileHasOutseam) {
        reasons.push(
          "Neither Inseam nor Outseam was provided in your profile. Trouser recommendation is evaluated on waist and hip coordinates alone; verify trouser length before ordering."
        );
      } else if (profileHasInseam && !chartHasInseam && !chartHasOutseam) {
        reasons.push(
          "Your profile includes Inseam, but this retailer size chart does not publish inseam or outseam specifications."
        );
      } else if (profileHasOutseam && !chartHasInseam && !chartHasOutseam) {
        reasons.push(
          "Your profile includes Outseam, but this retailer size chart does not publish inseam or outseam specifications."
        );
      } else if (chartHasInseam && !profileHasInseam) {
        reasons.push(
          "Garment size chart specifies Inseam bounds, but Inseam measurement is unavailable in your profile."
        );
      } else if (chartHasOutseam && !profileHasOutseam) {
        reasons.push(
          "Garment size chart specifies Outseam bounds, but Outseam measurement is unavailable in your profile."
        );
      }
    } else if (evaluatedInseam && !evaluatedOutseam && chartHasOutseam && !profileHasOutseam) {
      reasons.push(
        "Garment specifies outseam bounds, but outseam is unavailable in your profile (matched on verified inseam)."
      );
    } else if (evaluatedOutseam && !evaluatedInseam && chartHasInseam && !profileHasInseam) {
      reasons.push(
        "Garment specifies inseam bounds, but inseam is unavailable in your profile (matched on verified outseam)."
      );
    }
  }

  if (preference !== "regular") {
    reasons.push(`Calibration adjusted for your ${preference} fit preference.`);
  }

  // 7. Formulate Alternatives with trade-offs
  const alternatives: AlternativeSize[] = runnerUps.map((alt) => {
    const diff = Math.round((alt.totalPenalty - best.totalPenalty) * 100) / 100;
    let tradeoff = "";

    const altSnug = alt.breakdowns.filter((b) => b.status === "snug");
    const altLoose = alt.breakdowns.filter((b) => b.status === "loose");

    if (altLoose.length > 0) {
      tradeoff = `Size ${alt.size.label} offers more room through ${altLoose.map((d) => d.label.toLowerCase()).join(" and ")}, but may feel looser.`;
    } else if (altSnug.length > 0) {
      tradeoff = `Size ${alt.size.label} provides a more tailored cut, but will be tighter at ${altSnug.map((d) => d.label.toLowerCase()).join(" and ")}.`;
    } else {
      tradeoff = `Size ${alt.size.label} is an alternative candidate within close margin.`;
    }

    return {
      size: alt.size.label,
      tradeoff,
      scoreDifference: diff,
    };
  });

  return {
    status: confidence === "low" ? "low_confidence" : "recommended",
    recommendedSize: best.size.label,
    alternatives,
    confidence,
    reasons,
    missingMeasurements: [],
    chartSource: chart.provenance?.sourceType || "verified_product_chart",
    disclaimer,
    fitBreakdown: best.breakdowns,
    overallScore: best.totalPenalty,
  };
}
