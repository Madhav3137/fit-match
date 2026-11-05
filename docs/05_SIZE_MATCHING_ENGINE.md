# 05 — Size Matching Engine

## Core principle
A size recommendation is only as reliable as the product-specific chart and the measurement semantics. Do not compare body measurements to garment measurements as if they were the same thing.

## Inputs
```ts
type BodyProfile = {
  heightCm: number;
  chestCm?: number;
  waistCm: number;
  hipCm?: number;
  shoulderCm?: number;
  inseamCm?: number;
  fitPreference: "slim" | "regular" | "relaxed";
};

type SizeRow = {
  label: string;             // e.g. S, M, L
  bodyRanges?: Partial<Record<"height"|"chest"|"waist"|"hip"|"shoulder"|"inseam",
    { min: number; max: number }>>;
  garmentMeasures?: Partial<Record<"chest"|"waist"|"hip"|"shoulder"|"length",
    number>>;
  source: "product_chart" | "brand_chart" | "manual";
  sourceUrl?: string;
};
```

## Data quality tiers
1. Product-specific body measurement chart — preferred.
2. Brand + garment-category body chart — acceptable if clearly identified.
3. Garment measurements with a documented ease model — possible, but requires garment category and fit semantics.
4. User-entered chart — usable but label as manual.
5. No chart — no recommendation. Ask for chart data.

## Matching steps
1. Normalize all measurements to centimeters.
2. Determine garment category and which body dimensions are relevant.
3. Filter sizes missing required chart dimensions.
4. For each size, calculate how far each user measurement is from the size range.
5. A measurement inside a range has zero range penalty; outside the range has a normalized distance penalty.
6. Apply category-specific weights. Example: tops emphasize chest, shoulders and length; trousers emphasize waist, hips and inseam.
7. Apply fit preference only when the chart supports a meaningful adjustment. Never apply a generic arbitrary size shift.
8. Rank eligible sizes by lowest weighted penalty.
9. If two sizes are close, show both with a clear trade-off.
10. Calculate confidence from chart quality, measurement coverage and separation between top candidates.

## Range penalty
For user value `x` and chart range `[min,max]`:
- `0` if `min <= x <= max`.
- `(min-x)/scale` if `x < min`.
- `(x-max)/scale` if `x > max`.
Use a dimension-specific scale based on range width or documented tolerance; cap extreme values to prevent one dimension dominating.

## Example weighted model
For a top, if valid chart dimensions exist:
- Chest: 0.45
- Shoulder: 0.25
- Waist: 0.15
- Height/length proxy: 0.15

For trousers:
- Waist: 0.40
- Hip: 0.35
- Inseam: 0.25

Weights must be renormalized across available relevant dimensions. These are initial tunable weights, not universal apparel science. If required dimensions are absent, reduce confidence and state why.

## Confidence bands
- High: verified product-specific chart, strong measurement coverage, clear winner.
- Medium: brand/category chart or some optional measurements missing.
- Low: manual chart, incomplete dimensions, ambiguous category or close candidate scores.
Do not display a numerical probability unless it has been calibrated against real fit feedback data.

## Result explanation
Return structured reasons, e.g.:
- “M is the closest match for your chest and shoulder measurements.”
- “L offers more room at the waist but may feel looser through the chest.”
- “Length confidence is limited because the product chart does not include garment length.”

## No-match behavior
If all sizes are outside the supported ranges, do not force a recommendation. Explain the closest candidate and why confidence is low, or return `no_match`.

## Output contract
```ts
type Recommendation = {
  status: "recommended" | "low_confidence" | "no_match" | "insufficient_data";
  recommendedSize?: string;
  alternatives: Array<{ size: string; tradeoff: string }>;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  missingMeasurements: string[];
  chartSource: string;
  disclaimer: string;
};
```

## Required safeguards
- Never assume men's/women's sizing based on user identity.
- Use product category and chart metadata.
- Keep body and garment measures separate.
- Do not claim a size will fit perfectly.
- Show the source and freshness of chart data.
- Add user feedback (“How did it fit?”) to improve future calibration, with consent.
