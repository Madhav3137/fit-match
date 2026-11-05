# 04 — Technical Architecture

## Recommended stack
- Frontend: Next.js App Router + React + TypeScript.
- Styling: Tailwind CSS with design tokens in CSS variables.
- Motion: Framer Motion.
- Forms: React Hook Form + Zod.
- Backend: Next.js route handlers initially; extract services if scale requires.
- Database/auth: PostgreSQL + Supabase (or equivalent).
- Validation: Zod on both client and server.
- Tests: Vitest + Playwright.
- Deployment: Vercel or equivalent; database hosted separately.

## High-level architecture
```text
Browser
  ├── Landing / Profile / Analyze / Result UI
  ├── Form validation
  └── Motion and interaction layer
          |
          v
Next.js API
  ├── Auth + profile service
  ├── URL safety validator
  ├── Retailer adapter registry
  ├── Product metadata parser
  ├── Size-chart resolver
  └── Size matching engine
          |
          +---- PostgreSQL
          |       ├── users
          |       ├── measurement_profiles
          |       ├── retailer_adapters
          |       ├── size_charts
          |       └── saved_analyses
          |
          +---- External public product pages / permitted data sources
```

## Suggested folder structure
```text
src/
  app/
    page.tsx
    profile/page.tsx
    analyze/page.tsx
    result/[analysisId]/page.tsx
    dashboard/page.tsx
    api/
      profile/route.ts
      analyze/route.ts
      analysis/[id]/route.ts
  components/
    layout/
    marketing/
    profile/
    analyzer/
    results/
    ui/
  lib/
    validation/
    units/
    url-safety/
    retailers/
      adapter-registry.ts
      base-adapter.ts
      zara-adapter.ts
      hm-adapter.ts
    product/
      product-parser.ts
      chart-resolver.ts
    sizing/
      normalize.ts
      matcher.ts
      confidence.ts
  server/
    services/
    repositories/
  styles/
  types/
```

## Architectural rules
- Retailer scraping and URL fetching must be server-side.
- Never accept arbitrary server-side URLs without SSRF protections.
- Restrict allowed schemes to HTTPS.
- Block localhost, private IP ranges, link-local and internal hostnames after DNS resolution; re-check redirects.
- Apply response size limits, timeouts and content-type checks.
- Use retailer-specific adapters; do not write one fragile universal scraper.
- Prefer retailer APIs, affiliate feeds, structured product metadata and permitted sources.
- Respect retailer terms, robots policies and applicable law.
- Cache public product metadata and chart data with source timestamps.
- Keep recommendation engine pure and deterministic; isolate it from UI.
- Log operational errors without logging body measurements or secrets.
