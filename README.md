# Align

A dev-only measuring tool that runs inside your own project. Hover anything to
see its size, click to pin it, then hover something else to get the exact
distance between them — fractions included.

It measures. It doesn't judge: whether 25.5px is wrong is your call.

No runtime dependencies, ~10KB minified, physically absent from production
bundles.

```
Cmd/Ctrl + Shift + A    toggle
hover                   outline + dotted edge guides + size tooltip
click                   pin it, and open the box model panel
hover with a pin set    distance lines between the two, in px
Escape                  clear the pin; again to close
```

While the tool is on, a click means "pin this", so it doesn't reach the page —
the same bargain DevTools' inspect mode makes. Toggle off to use the app.

## What you see

- **Dotted guides** run the full viewport from each edge of whatever you're
  hovering, so you can line things up by eye.
- **Distance lines** are drawn with end caps and a px label, only between the
  pinned element and the hovered one.
- **The tooltip** follows the cursor with `160 × 24` and nothing else.
- **The box model panel**, bottom-left, shows margin, border, padding and
  content for the pinned element. Zeros render as `–` so real numbers stand out.

Everything is 1px. Numbers are monospace and tabular, so they don't jitter as
the cursor moves.

## Install

Copy the `align/` folder into your project, or build it (`npm run build`) and
import `dist/align.js`. Then wire it up behind a dev guard.

### Vite / CRA / Remix / SvelteKit / Astro

```ts
// main.ts — entry file
if (import.meta.env.DEV) import('./align').then((m) => m.initAlign());
```

### Next.js (App Router)

```tsx
// components/AlignDev.tsx
'use client';
import { useEffect } from 'react';

let didInit = false;

export default function AlignDev() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;   // <- must be here
    if (didInit) return;
    didInit = true;
    import('@/align').then((m) => m.initAlign());
  }, []);
  return null;
}
```

```tsx
// app/layout.tsx
{process.env.NODE_ENV !== 'production' ? <AlignDev /> : null}
```

**The env check has to wrap the dynamic `import()` itself, not just the
element.** Guarding only `<AlignDev />` in the layout leaves the component
statically imported and the `import()` reachable, so the whole tool ships to
production — verified by grepping `.next/static`. The Vite recipe works as
written because `import.meta.env.DEV` guards the import directly.

If `align/` lives outside your Next project root, set
`experimental: { externalDir: true }` in `next.config.mjs`.

## Configuration

Two options, both optional.

```ts
initAlign({
  ignore: '.third-party-widget, [data-radix-portal]',   // extra selector to skip
  hotkey: 'mod+shift+a',
});
```

Mark anything the tool should never measure with `data-align-ignore` — hovering
it walks up to the nearest ancestor that isn't ignored.

## Design

Colours are [Fluid Functionalism](https://fluidfunctionalism.com)'s tokens
converted to OKLCH, written once as `light-dark()` pairs and flipped by
`color-scheme`, so the panel follows your OS theme. The box model bands share
one lightness and one chroma across four hues, so no band reads heavier than
another.

**The tool has exactly one animation** — the box model panel's entrance, 160ms
in and 120ms out (slow in, faster out). Everything else is instant on purpose:
hovering happens hundreds of times a session, and motion there is friction on
every single use. Under `prefers-reduced-motion` the panel keeps its fade and
drops the travel.

## Development

```bash
npm run demo         # the Vite demo page, with fixtures of known size
npm test             # unit tests on the geometry
npm run typecheck
npm run build && npm run size
```

`examples/vite-demo` has elements with exact known dimensions — a 13.5px gap, a
40px header with 16px side padding — so you can check a reading against
DevTools. `?hmrprobe` tracks listener registrations across saves.

## Architecture

```
align/
  index.ts      init, hotkey, hover/pin state, lifecycle
  overlay.ts    canvas: outlines, guides, distances, tooltip
  boxmodel.ts   the bottom-left panel
  measure.ts    geometry, hit-testing, computed styles
  theme.ts      OKLCH tokens, light/dark resolution
  types.ts      Box, Segment, Bands, Quad
  config.ts     ignore selector, hotkey
```

Nothing walks the DOM and nothing is cached: guides come from the hovered
element's own rect, distances from exactly two elements, all measured on demand
through `elementFromPoint`. Since nothing is stored, nothing can go stale — an
animating page can't show you a wrong number.

Only `overlay.ts` and `boxmodel.ts` write to the DOM; only `index.ts` touches
window globals and `import.meta.hot`; the geometry in `measure.ts` is pure and
unit-tested.

## Non-goals

Alignment auditing, spacing lint, subpixel warnings, design-file diffing,
jumping to source, writing CSS back, a11y and contrast checks. This tool tells
you the numbers; you decide what they mean.
