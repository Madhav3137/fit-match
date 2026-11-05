# 03 — User Flows

## Flow A: first visit
1. User lands on the editorial homepage.
2. Selects “Build your size profile”.
3. Sees a short privacy/measurement explanation.
4. Enters required measurements and optional measurements.
5. Chooses fit preference.
6. Reviews and saves profile.
7. Moves to product URL analysis.

## Flow B: analyze a product
1. User pastes product URL.
2. Client validates URL shape; server validates host and safety.
3. Server chooses retailer adapter.
4. Adapter fetches public product page and structured metadata where permitted.
5. Product parser extracts product information.
6. Size-chart resolver retrieves product-specific chart or verified brand/category chart.
7. UI shows product preview and extracted chart status.
8. Matching engine evaluates eligible sizes.
9. Result screen shows recommended size, fit notes, confidence and alternatives.

## Flow C: unsupported URL
1. User pastes unsupported retailer URL.
2. Explain that automatic extraction is not available for this store.
3. Offer manual product details and size chart entry.
4. User can still receive a recommendation if enough reliable data is entered.
5. Clearly label result as based on user-provided chart data.

## Flow D: missing size chart
1. Product is identified but no reliable chart is found.
2. Do not fabricate chart values.
3. Offer “Enter size chart manually” and “Try another product link”.
4. Explain which measurements are needed for this garment category.

## Flow E: returning user
1. User opens dashboard.
2. Existing profile is loaded after authentication.
3. User can edit profile or paste a new product link.
4. Previously saved analysis may be opened with its chart-source timestamp.

## Important states
- Empty profile.
- Partially completed profile.
- Invalid measurement.
- Saving profile.
- URL analyzing.
- Product found / chart found.
- Product found / chart missing.
- Unsupported retailer.
- Page blocked or unavailable.
- Rate limit reached.
- Network error.
- No size matches all constraints.
- Low-confidence recommendation.
- Success with alternatives.
