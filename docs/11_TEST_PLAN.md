# 11 — Test Plan

## Unit tests
- cm/in conversion in both directions.
- Measurement validation boundaries.
- URL normalization and host allowlist.
- SSRF blocking: localhost, private IP, redirects to private IP.
- Product parser for each supported adapter fixture.
- Size chart parser for each supported chart format.
- Range penalty inside / below / above range.
- Weight renormalization when dimensions are missing.
- Deterministic tie handling.
- Confidence band rules.
- No-match and insufficient-data behavior.

## Integration tests
- Create/edit/delete profile.
- Analyze a supported product URL.
- Unsupported retailer returns manual fallback.
- Product found but chart missing returns chart fallback.
- Invalid profile blocks analysis with actionable message.
- User cannot fetch another user's profile or analysis.
- Rate limiting and timeout behavior.

## End-to-end tests
1. Landing → create profile → analyze supported product → result.
2. Returning user → dashboard → new analysis.
3. Unsupported URL → manual chart → recommendation.
4. Mobile viewport → complete core journey.
5. Keyboard-only navigation through profile and analysis.

## Visual QA
- Black/white palette consistent across pages.
- No accidental color accents.
- Typography hierarchy matches design system.
- Motion is smooth and not distracting.
- Reduced-motion mode works.
- Empty, loading, error and success states are designed.
- No overflow at 360px width.
- No horizontal page scroll.
