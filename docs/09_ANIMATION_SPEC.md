# 09 — Animation Specification

## Motion direction
The reference uses a deliberate, cinematic sequence. Recreate the *design language and pacing*, not the original creator's exact assets or branding.

Motion should feel precise, expensive and purposeful. “Lots of animation” means layered choreography and polished feedback — not constant movement everywhere.

## Global rules
- Use Framer Motion.
- Prefer transform and opacity; avoid animating layout-heavy properties.
- Respect `prefers-reduced-motion`.
- Keep interactions responsive; do not delay form submission for decorative effects.
- Avoid scroll-jacking.
- Use one coherent easing family: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Typical micro-interactions: 150–250ms.
- Section reveals: 500–900ms.
- Hero sequence: 900–1400ms total.
- Never animate every letter or card on every render.

## Hero choreography
1. Black screen and subtle wordmark fade.
2. Large headline reveals by line with a slight vertical mask.
3. Thin measurement illustration draws in using SVG stroke animation.
4. Supporting copy fades in.
5. CTA border/foreground resolves into place.
6. Scroll cue appears last.

## Profile screen
- Body outline draws on.
- Measurement guide lines extend from the figure.
- Input cards stagger into view.
- Focused field border brightens.
- Valid state shows a restrained checkmark reveal.
- Unit toggle slides smoothly.
- Save action transitions into a compact success state.

## Analyze screen
- URL field expands/focuses.
- On submit, show a sequence of meaningful status labels:
  1. Validating product link
  2. Identifying retailer
  3. Reading product details
  4. Checking size information
  5. Comparing measurements
- Do not fake progress percentages or imply a step completed before the server confirms it.
- Use a subtle animated line/scan motif while waiting.

## Results
- Product card fades/slides in.
- Recommended size appears with a restrained scale/opacity reveal.
- Confidence label fades in.
- Measurement comparison bars animate from zero to actual values.
- Alternatives reveal with a small stagger.
- Explanation text appears last.

## Scroll choreography
- Use IntersectionObserver or Framer Motion `whileInView`.
- Once-only reveal for editorial sections.
- Subtle parallax only on decorative elements.
- Keep content readable if animation is disabled.

## Cursor and hover
- Optional custom cursor only on desktop and only if it does not replace the system cursor for controls.
- Buttons: border/contrast shift, 1–2px lift.
- Cards: border brightens; no exaggerated tilt.
- Links: underline or line-draw.

## Performance
- Lazy-load below-the-fold imagery.
- Avoid huge blur filters and dozens of simultaneous spring animations.
- Use SVG for measurement diagrams.
- Use `will-change` sparingly.
