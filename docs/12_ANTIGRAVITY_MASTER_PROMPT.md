# Antigravity Master Build Prompt — FITMATCH

You are a senior product designer, frontend engineer, backend engineer and QA engineer. Build a production-minded full-stack web application called **FITMATCH**.

The supplied reference video is the primary visual and interaction reference. Study it carefully before coding. Recreate its premium monochrome fashion-tech atmosphere and its product flow, but do not copy the creator's watermark, handle, exact brand identity or proprietary assets.

## PRODUCT
A user enters their body measurements once, pastes a fashion product URL, and receives a product-specific size recommendation. The recommendation must be based on real extracted or manually supplied size-chart data. Do not build a fake recommendation demo.

## FIRST: INSPECT THE PROJECT
- Inspect the existing repository, package manager, framework, routes and components.
- Preserve working code and conventions.
- Do not overwrite the project blindly.
- If the repository is empty, initialize Next.js App Router + TypeScript.
- Before major implementation, write a short plan and then execute it.
- Create/maintain `README.md` and the other documentation files supplied with this prompt.

## VISUAL DIRECTION — VERY IMPORTANT
Build a visually exceptional, premium, black-and-white fashion-tech experience:
- Near-black background (#080808), white primary typography, subtle grey secondary text.
- Fine 1px outlines, restrained rounded corners, generous negative space.
- Oversized editorial typography and tiny uppercase technical labels.
- Minimal SVG human measurement diagrams and garment line-art.
- Sophisticated spacing and alignment.
- No gradients, neon, colorful blobs, glassmorphism, generic SaaS dashboard styling, emoji icons or random accent colors.
- Use a premium sans-serif such as Geist, Inter or Manrope.
- The visual result should look like a high-end fashion-tech startup, not a student template.

## MOTION — MAKE IT FEEL ALIVE
Use Framer Motion throughout, with deliberate choreography:
- Cinematic hero reveal: wordmark, headline line reveal, SVG measurement drawing, supporting copy and CTA.
- Smooth section reveals on scroll.
- SVG body measurement lines draw in.
- Profile input cards stagger into place.
- Focus states animate subtly.
- Product URL analysis has a sophisticated scanning/progress state with real server-driven stage changes.
- Result size reveal, animated comparison bars and staggered alternatives.
- Refined hover/focus transitions on buttons, nav and cards.
- Use page transitions where appropriate.
- Respect `prefers-reduced-motion`; never sacrifice usability for animation.
- Use transforms and opacity for performance. No scroll hijacking or constant distracting movement.

## REQUIRED PAGES
1. `/` — editorial landing page.
2. `/profile` — universal body measurement profile.
3. `/analyze` — paste product URL and inspect extraction.
4. `/result/[analysisId]` — recommendation result.
5. `/dashboard` — saved profile and past analyses (if auth is configured).

## LANDING PAGE
Create a premium hero with a strong headline such as:
“YOUR SIZE. EVERY BRAND.”
Supporting line: “One profile. Product-specific fit guidance.”
Primary CTA: “Build your size profile”.
Secondary CTA: “See how it works”.
Add an elegant SVG measurement illustration, a three-step explanation, retailer support section, product result preview, privacy note and FAQ. Keep content concise and editorial.

## PROFILE EXPERIENCE
Title: “YOUR UNIVERSAL SIZE PROFILE”.
Collect:
- Height (required)
- Chest/bust (required for tops; allow profile to save without it but explain when needed)
- Waist (required)
- Hip (optional)
- Shoulder (optional)
- Inseam (optional)
- Fit preference: slim / regular / relaxed
- Unit toggle: cm / inches

Show measurement helper tips and a human line-art diagram. Validate values. Store normalized centimeters. Do not infer gender identity. Make fields accessible and mobile-friendly. Include edit/save states.

## PRODUCT URL ANALYSIS
- User pastes a product URL.
- Validate it.
- Send it to a server route, never fetch arbitrary retailer pages from the browser.
- Implement a retailer adapter registry.
- Start with robust metadata extraction (JSON-LD Product and Open Graph) and adapter interfaces.
- Add Zara and H&M adapter scaffolding only if they can be implemented and tested with permitted data access. Do not claim they are live if they are not.
- Build a clear support status for each retailer: active, beta, manual-only or unsupported.
- Show product title, brand, image and category if found.
- Resolve product-specific size chart first; brand/category chart second.
- If chart extraction fails, show a premium manual size-chart form.
- Never fabricate a chart or recommendation.

## REAL SIZE MATCHING ENGINE
Create a pure, tested matching module:
- Normalize measurements to cm.
- Keep body measurements separate from garment measurements.
- Match relevant dimensions by garment category.
- For body-range charts, calculate a range penalty: zero inside range, normalized distance outside range.
- Use category-specific weights and renormalize across available dimensions.
- Apply fit preference only when chart semantics support it.
- Rank sizes deterministically.
- Return recommended size, alternatives, reasons, missing measurements and confidence band.
- Confidence is high/medium/low based on chart provenance, measurement coverage and candidate separation.
- Do not show fake percentages.
- If no reliable chart exists, return insufficient data and ask for manual input.
- If no size fits, say so; do not force a result.
- Add tests for matching and edge cases.

## RESULT PAGE
Make the recommended size the visual centerpiece:
- “RECOMMENDED SIZE”
- Large size label (e.g. M) only when calculated from actual chart data.
- Product details and chart source.
- High/Medium/Low confidence with explanation.
- Measurement-by-measurement breakdown.
- Alternative sizes and trade-offs.
- Disclaimer: “Sizing is an estimate and is not a guarantee of fit.”
- CTA to analyze another product and edit profile.

## BACKEND / SECURITY
- Use Next.js route handlers and TypeScript.
- Use Zod validation.
- Use PostgreSQL/Supabase if credentials are configured; otherwise create a clean repository abstraction and a local development fallback. Never hardcode credentials.
- Protect profile and analysis ownership.
- URL safety: HTTPS only, allowlist supported hosts, block localhost/private/link-local IPs, validate DNS and redirects, set timeouts and response size limits, rate-limit requests.
- Respect retailer terms, robots policies and applicable law.
- Do not scrape behind login or bypass anti-bot measures.
- Do not expose secrets to client.
- Do not log body measurements in analytics.

## COMPONENT QUALITY
Build reusable components:
- SiteHeader / SiteFooter
- Button / Input / Select / Card
- MeasurementDiagram
- MeasurementField
- FitPreferenceSelector
- ProductUrlForm
- AnalysisProgress
- ProductPreview
- SizeRecommendation
- FitBreakdown
- AlternativeSizeCard
- EmptyState / ErrorState / Skeleton

## ENGINEERING QUALITY
- TypeScript strict where practical.
- Keep business logic out of React components.
- Use clear loading, empty, success and error states.
- No dead buttons or fake links.
- No placeholder lorem ipsum.
- No console errors.
- Responsive from 360px mobile to wide desktop.
- Keyboard accessible and reduced-motion aware.
- Add unit tests for validation, URL safety and matching logic.
- Add `.env.example` with variable names only.
- Add setup instructions to README.

## WORKING METHOD
1. Inspect the repository.
2. Implement the design system and layout.
3. Build the landing page and profile flow.
4. Build server-side URL analysis and manual fallback.
5. Implement and test the size engine.
6. Build results and dashboard.
7. Add motion and responsive polish.
8. Run lint, typecheck, tests and production build.
9. Fix all errors.
10. Report exactly what works, what is mocked, what requires credentials, and which retailer integrations have actually been tested.

Do not stop after creating a pretty homepage. Deliver a working end-to-end MVP. If a retailer blocks extraction or a chart cannot be verified, make that limitation visible and provide manual chart entry instead of inventing data.
