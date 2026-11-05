# 13 — Build Plan

## Phase 1: Foundation
- Inspect repository.
- Configure Next.js, TypeScript, Tailwind, Framer Motion.
- Add design tokens, typography, shared layout and navigation.
- Build responsive landing page.

## Phase 2: Profile
- Measurement schema and validation.
- Unit conversion.
- Profile form and measurement diagram.
- Save/edit flow and persistence abstraction.

## Phase 3: Product ingestion
- URL validation and SSRF protections.
- Retailer adapter registry.
- JSON-LD/Open Graph extraction.
- Product preview and extraction status.
- Manual product/chart entry.

## Phase 4: Matching
- Chart normalization.
- Category-aware matching.
- Confidence and explanation generation.
- Unit and edge-case tests.

## Phase 5: Results and account
- Result page and alternatives.
- Saved analysis history.
- Authentication and ownership checks if configured.

## Phase 6: Motion and polish
- Hero choreography.
- Scroll reveals and SVG stroke drawing.
- Form and result transitions.
- Reduced-motion support.
- Responsive QA.

## Phase 7: Release gate
- Lint, typecheck, tests, build.
- Test one real product URL per claimed active retailer.
- Verify unsupported URL fallback.
- Verify security protections.
- Document real integration status and remaining limitations.
