# 06 — Data Model

## Entities
### User
- id
- email / auth provider id
- created_at
- updated_at

### MeasurementProfile
- id
- user_id (nullable for guest session)
- height_cm
- chest_cm (nullable)
- waist_cm
- hip_cm (nullable)
- shoulder_cm (nullable)
- inseam_cm (nullable)
- fit_preference
- created_at
- updated_at

### Retailer
- id
- name
- canonical_domain
- adapter_key
- support_status (`active`, `beta`, `manual_only`, `unsupported`)

### Product
- id
- retailer_id
- canonical_url
- title
- brand
- category
- image_url
- description
- extracted_at

### SizeChart
- id
- product_id (nullable)
- retailer_id
- category
- chart_type (`body_ranges`, `garment_measures`)
- source_url
- source_type (`product`, `brand`, `manual`)
- data_json
- verified_at
- created_at

### Analysis
- id
- user_id (nullable)
- profile_id
- product_id (nullable)
- submitted_url
- status
- recommendation_json
- chart_id (nullable)
- created_at

## Example chart JSON — body ranges
```json
{
  "type": "body_ranges",
  "unit": "cm",
  "sizes": [
    { "label": "S", "chest": {"min": 88, "max": 94}, "waist": {"min": 74, "max": 80} },
    { "label": "M", "chest": {"min": 95, "max": 101}, "waist": {"min": 81, "max": 87} }
  ]
}
```

## Example chart JSON — garment measurements
```json
{
  "type": "garment_measures",
  "unit": "cm",
  "sizes": [
    { "label": "S", "chest": 104, "length": 68 },
    { "label": "M", "chest": 110, "length": 70 }
  ],
  "ease_model": null
}
```

## Privacy
- Restrict profile rows by authenticated user id using row-level security.
- Encrypt transport and rely on managed encryption at rest.
- Do not include measurements in analytics events.
- Allow profile and analysis deletion.
- Keep guest profiles local/session-based unless user explicitly saves them.
