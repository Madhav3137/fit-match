import { GarmentCategory, SizeChartData, SizeRow } from "../retailers/types";

export type FitPreference = "slim" | "regular" | "relaxed";

export interface BodyProfile {
  heightCm: number;
  chestCm?: number | null;
  waistCm: number;
  hipCm?: number | null;
  shoulderCm?: number | null;
  inseamCm?: number | null;
  fitPreference: FitPreference;
}

export interface FitBreakdownItem {
  dimension: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam";
  label: string;
  userValueCm: number;
  rangeMinCm: number;
  rangeMaxCm: number;
  status: "ideal" | "snug" | "loose";
  deltaCm: number;
  explanation: string;
}

export interface AlternativeSize {
  size: string;
  tradeoff: string;
  scoreDifference: number;
}

export interface RecommendationResult {
  status: "recommended" | "low_confidence" | "no_match" | "insufficient_data";
  recommendedSize?: string;
  alternatives: AlternativeSize[];
  confidence: "high" | "medium" | "low";
  reasons: string[];
  missingMeasurements: string[];
  chartSource: string;
  disclaimer: string;
  fitBreakdown: FitBreakdownItem[];
  overallScore?: number;
}

