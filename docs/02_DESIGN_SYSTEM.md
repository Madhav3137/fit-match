# 02 — Design System

## Creative direction
A high-end monochrome fashion-tech interface inspired by the supplied reference video: near-black canvas, precise white typography, fine outlines, restrained grey metadata, editorial spacing and technical diagrams.

The site should feel like a premium design studio / fashion technology instrument — not a generic SaaS dashboard and not a crowded shopping marketplace.

## Visual principles
- Black is the primary canvas.
- White is reserved for primary type, key actions and selected states.
- Grey is used for secondary labels, borders and helper copy.
- Large typography, small uppercase metadata and generous negative space.
- Thin 1px borders, subtle corner radii, restrained surfaces.
- Use real product imagery only when available; otherwise use elegant garment line-art placeholders.
- No gradients, neon colors, glassmorphism, colorful blobs or excessive shadows.
- Avoid emoji as interface icons.

## Suggested tokens
```css
:root {
  --bg: #080808;
  --surface: #101010;
  --surface-raised: #151515;
  --text: #f5f5f5;
  --muted: #929292;
  --subtle: #626262;
  --line: #303030;
  --line-strong: #777777;
  --white: #ffffff;
  --black: #000000;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --content-max: 1240px;
}
```

## Typography
- Display: modern grotesk / geometric sans, e.g. Geist, Inter or Manrope.
- Headings: bold, tight tracking, editorial scale.
- Body: clean sans, comfortable line height.
- Metadata: uppercase, 0.12–0.18em letter spacing, 10–12px.
- Use fluid sizing with `clamp()`.

## Layout
- Desktop: centered max-width content, 12-column grid, large vertical rhythm.
- Mobile: 20–24px side padding; avoid tiny labels and compressed controls.
- Header: minimal wordmark left, nav links center/right, single outlined CTA.
- Buttons: solid white primary with black text; outlined secondary.
- Inputs: dark surfaces, subtle borders, clear focus ring, large tap targets.
- Cards: mostly flat black surfaces with thin border; selected card gets brighter border.

## Key screens
1. **Landing:** oversized headline, one sentence, primary “Build your size profile” CTA, secondary “See how it works”, editorial product/measurement visual.
2. **Profile:** title “Your universal size profile”, human measurement line-art, measurement fields in a clean grid, unit toggle, fit preference, save action.
3. **Analyze:** product URL input, retailer detection state, analysis timeline, product preview.
4. **Result:** product card, large recommended size, confidence and fit breakdown, alternatives.
5. **Profile dashboard:** saved profile summary and recently analyzed products.

## Microcopy tone
Confident, concise, calm and precise.
Examples:
- “Your size, translated.”
- “One profile. Every brand.”
- “Paste a product link.”
- “Matching your measurements.”
- “Recommended size”
- “Based on the product’s available size data.”
- “We couldn’t verify this size chart. Add it manually to continue.”

## Do not
- Copy the reference creator's watermark, social handle, or unrelated branding.
- Use fake retailer logos or imply partnerships.
- Use a made-up confidence percentage.
- Make all text uppercase; reserve uppercase for labels and short statements.
