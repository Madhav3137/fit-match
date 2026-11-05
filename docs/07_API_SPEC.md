# 07 — API Specification

All endpoints return JSON and use consistent error shapes. Validate input with Zod on the server.

## POST /api/profile
Create or update a measurement profile.
```json
{
  "heightCm": 170,
  "chestCm": 96,
  "waistCm": 82,
  "shoulderCm": 44,
  "fitPreference": "regular"
}
```
Response: `{ "profile": { "id": "...", "heightCm": 170, "...": "..." } }`

## GET /api/profile
Return the current user's profile, if authenticated.

## DELETE /api/profile
Delete the current user's profile after confirmation.

## POST /api/analyze
Analyze a product URL against a profile.
```json
{
  "url": "https://retailer.example/product/...",
  "profileId": "profile-id",
  "fitPreference": "regular"
}
```
Response:
```json
{
  "analysisId": "analysis-id",
  "status": "recommended",
  "product": {
    "title": "Essential cotton T-shirt",
    "brand": "Example",
    "category": "top",
    "imageUrl": null
  },
  "chart": {
    "status": "verified",
    "sourceType": "product",
    "verifiedAt": "2026-11-02T10:00:00Z"
  },
  "recommendation": {
    "recommendedSize": "M",
    "confidence": "medium",
    "alternatives": [],
    "reasons": ["M is the closest match for the supplied chest and waist ranges."],
    "missingMeasurements": [],
    "disclaimer": "Sizing is an estimate and is not a guarantee of fit."
  }
}
```

## GET /api/analysis/:id
Fetch a saved analysis owned by the current user.

## POST /api/analyze/manual
Submit manually entered product category and size chart when automatic extraction is unavailable.

## Error format
```json
{
  "error": {
    "code": "UNSUPPORTED_RETAILER",
    "message": "Automatic analysis is not available for this store yet.",
    "action": "manual_entry"
  }
}
```

## Error codes
- `INVALID_URL`
- `UNSUPPORTED_RETAILER`
- `URL_BLOCKED`
- `PRODUCT_NOT_FOUND`
- `CHART_NOT_FOUND`
- `INSUFFICIENT_PROFILE`
- `INVALID_MEASUREMENTS`
- `RATE_LIMITED`
- `FETCH_TIMEOUT`
- `PARSER_FAILED`
- `NO_MATCH`
- `INTERNAL_ERROR`
