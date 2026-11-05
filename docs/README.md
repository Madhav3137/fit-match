# FITMATCH — Project Documentation

A premium fashion-tech sizing assistant. Users create one reusable body-measurement profile, paste a product URL, and receive a brand- and product-specific size recommendation.

## Product promise
**Know your fit before you buy.** One profile. Multiple brands. Product-aware size guidance.

## Reference-video flow
1. Editorial brand intro / hero.
2. User creates a universal size profile.
3. Profile is saved and reusable.
4. User pastes a product URL.
5. The system identifies the retailer, product, garment category, fit and available size chart.
6. A matching engine compares body measurements with product/brand sizing data.
7. The UI presents a recommended size, confidence, fit explanation and alternatives.

## Documentation index
- `01_PRODUCT_REQUIREMENTS.md` — scope, users, features and acceptance criteria.
- `02_DESIGN_SYSTEM.md` — monochrome premium visual language and motion rules.
- `03_USER_FLOWS.md` — core journeys and edge cases.
- `04_TECH_ARCHITECTURE.md` — suggested stack and system architecture.
- `05_SIZE_MATCHING_ENGINE.md` — sizing logic, confidence and safeguards.
- `06_DATA_MODEL.md` — database entities and example schema.
- `07_API_SPEC.md` — backend endpoints and contracts.
- `08_URL_PARSING_AND_RETAILER_SUPPORT.md` — product extraction strategy and limitations.
- `09_ANIMATION_SPEC.md` — animation choreography and performance rules.
- `10_ACCESSIBILITY_AND_RESPONSIVENESS.md` — accessibility and responsive behavior.
- `11_TEST_PLAN.md` — functional, algorithm and visual QA.
- `12_ANTIGRAVITY_MASTER_PROMPT.md` — copy/paste build prompt for Antigravity.
- `13_BUILD_PLAN.md` — phased implementation checklist.

## Recommended implementation
Use a modern React/Next.js application with TypeScript, Tailwind CSS, Framer Motion, a server-side API, and PostgreSQL/Supabase. Keep retailer scraping and sizing logic on the server. Do not expose secrets in the browser.

## Non-negotiable product integrity
- Never invent a size chart or claim a retailer integration works when it does not.
- A URL parser must report unsupported/private/blocked pages clearly.
- Distinguish body measurements from garment measurements.
- Do not promise perfect fit. Present a recommendation with confidence and explain uncertainty.
- Do not silently guess missing measurements.
- Keep a manual product/size-chart fallback so the product remains useful when automatic extraction fails.
