# 10 — Accessibility & Responsiveness

## Accessibility
- Semantic landmarks and heading hierarchy.
- Every input has a persistent label; placeholders are not labels.
- Measurement instructions are available to screen readers.
- Errors are associated with fields and announced.
- Focus indicators are visible against black backgrounds.
- All actions are keyboard accessible.
- Color is never the only indicator of state.
- Minimum comfortable touch target around 44×44 CSS pixels.
- Maintain readable contrast for muted text.
- Provide reduced-motion mode that removes nonessential movement.
- Do not use animation to communicate information that is not also available in text.

## Responsive behavior
### Mobile
- Single-column profile form.
- Measurement illustration becomes compact and sits above or beside fields.
- Sticky bottom CTA only when it does not obscure content.
- Product preview stacks above recommendation.
- Avoid horizontal scrolling except intentionally scrollable size chips.

### Tablet
- Two-column measurement layout where space allows.
- Result panel can use a 50/50 split.

### Desktop
- Editorial hero with typography and illustration side-by-side.
- Profile: body diagram on left, fields on right.
- Result: product visual and recommendation panel in a balanced grid.

## Browser and loading states
- Skeletons should match final layout.
- Avoid layout shifts when product images load.
- Forms must remain usable on slow connections.
