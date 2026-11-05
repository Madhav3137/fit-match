# 01 — Product Requirements

## Product overview
FITMATCH helps shoppers choose a size for a specific fashion product using a reusable body profile and product-specific sizing information.

## Goals
- Reduce uncertainty when buying clothing online.
- Let a shopper enter measurements once and reuse them.
- Accept a product URL and identify the item.
- Recommend a size based on actual available size data.
- Explain why the size was recommended.
- Deliver a distinctive premium fashion-tech experience.

## Primary user
A shopper who knows some body measurements but struggles with inconsistent sizing across brands, categories and garment cuts.

## MVP scope
### A. Landing / home
- Full-screen editorial hero with concise headline and CTA.
- Explain the three-step process: profile → product link → recommendation.
- Supported retailer strip, clearly distinguishing live integrations from planned support.
- Product demo section and FAQ.
- Responsive header and footer.

### B. Universal size profile
Required fields:
- Height (cm)
- Chest/bust circumference (cm)
- Waist circumference (cm)

Optional fields:
- Hip circumference (cm)
- Shoulder width (cm)
- Inseam (cm)
- Fit preference: slim / regular / relaxed
- Measurement unit: cm / inches (store normalized cm)

Requirements:
- Validate positive plausible values and show inline errors.
- Explain how to measure each field.
- Allow profile edit, save and delete.
- Store profile only with clear consent.
- Guest mode may keep the profile in session/local storage; authenticated mode can sync to account.
- Never infer gender identity. Garment-specific fields and size charts should drive the required measurements.

### C. Product URL analysis
- Accept a full product URL.
- Validate protocol and URL format.
- Normalize host and identify supported retailer adapter.
- Fetch and parse on the server only.
- Extract product title, brand, image, product category, color (if available), product fit description, available sizes and size-chart data.
- Show a review/confirmation step when extracted fields are uncertain.
- Provide manual entry fallback for product category and size chart.
- Handle blocked, unsupported, unavailable and malformed URLs gracefully.

### D. Recommendation result
Show:
- Recommended size as the dominant visual element.
- Product and retailer identity.
- Fit preference considered.
- Confidence band (High / Medium / Low) with an explanation, not fake precision.
- Fit notes: chest, waist, shoulders, hips, length where relevant.
- Alternative size and trade-off when useful.
- Measurement/chart source and last checked date when available.
- Disclaimer that sizing is an estimate, not a guarantee.

### E. Account and privacy
- Optional sign-in.
- User can export/delete profile data.
- Do not store pasted URLs longer than necessary unless user saves an item.
- Do not log raw body measurements in analytics.
- Protect account endpoints and rate-limit URL analysis.

## Out of scope for MVP
- Camera-based body scanning.
- AI visual body measurement.
- Guaranteed fit or return reduction claims.
- Every retailer worldwide.
- Checkout or payment processing.
- Automatic size chart generation without source evidence.

## Acceptance criteria
1. A user can create and edit a profile with required measurements.
2. Units convert correctly and values are stored in cm.
3. A valid supported product URL is parsed server-side.
4. The app can identify when product data or chart data is missing.
5. Recommendation output is deterministic for the same profile, product and fit preference.
6. The result explains the key measurement comparisons.
7. Unsupported URLs produce a useful fallback, not a fake result.
8. All core flows work on mobile and desktop.
9. Keyboard navigation, visible focus, labels and reduced-motion support are present.
10. No API keys, credentials or retailer access tokens are shipped to the client.
