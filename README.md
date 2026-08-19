# align-ui

A dev-only measuring tool that runs inside your own project. Hover any element
to see its size, click to lock it, then hover another to get the exact distance
between them — fractions included.

It measures. It doesn't judge: whether `25.5px` is wrong is your call.

![align-ui measuring the gutters between five chips](docs/screenshot.png)

- No runtime dependencies
- ~21 KB minified, 7.7 KB gzipped
- Physically absent from production builds
- Vite, Next.js, CRA, Remix, Astro, SvelteKit

---

## Install

Copy the `align/` folder into your project, then wire it up behind a dev guard.

### Vite, CRA, Remix, SvelteKit, Astro

```ts
// main.ts
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
    if (process.env.NODE_ENV === 'production') return;   // must be here
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

> The env check has to wrap the dynamic `import()` itself, not just the element.
> Guarding only `<AlignDev />` leaves the component statically imported and the
> import reachable, so the whole tool ships to production. The Vite recipe works
> as written because `import.meta.env.DEV` guards the import directly.

If `align/` sits outside your Next project root, set
`experimental: { externalDir: true }` in `next.config.mjs`.

---

## Keys

| | |
|---|---|
| `Ctrl/Cmd + Shift + A` | turn the tool on or off |
| hover | outline, dotted edge guides, size tooltip |
| click | lock an element, and open the box model |
| right-click | add to the locked set, or drop one from it |
| drag the panel header | move the box model |
| `B`, or the `×` | hide the box model, and bring it back |
| `R` | rulers along the top and left edges |
| `Esc` | close the key list, then the locks, then the tool |

Clicking the **Align** badge, top-right, shows this list in the page.

**Rulers** run along the top and left edges in *page* coordinates, counting from
the top-left of the document rather than the viewport, so the numbers keep
meaning something as you scroll. Ticks step 10 / 50 / 100 px and the cursor is
marked on both rules. Locked elements are shaded on them, so a selection stays
findable once it scrolls off — the hovered element is not, since a band
repainting on every mouse move is noise rather than information.

**Locking more than one** is how you check a row at a glance: click the first
element, right-click the rest, and every gutter between them is measured at
once. The set orders itself along whichever axis it varies on, so a row reads
left-to-right and a column top-to-bottom.

Right-click rather than a modifier because every modifier+click is already
taken by the browser — Shift opens a new window, Ctrl/Cmd a new tab, Alt
downloads. While the tool is on it swallows clicks so nothing navigates out
from under you; toggle off to use the app.

---

## Configuration

Everything has a default. Nothing is required.

```ts
initAlign({
  ignore: '.third-party-widget, [data-radix-portal]',   // extra selector to skip
  hotkey: 'mod+shift+a',
  panelKey: 'b',
  rulerKey: 'r',
});
```

Mark anything the tool should never measure with `data-align-ignore` — hovering
it walks up to the nearest ancestor that isn't ignored.

---

## How it works

The tool asks the browser one question — *what is at this coordinate?* — via
`elementFromPoint`, descending through open shadow roots so pages built from
web components measure their real inner nodes.

Nothing is cached and nothing is stored, so nothing can go stale. Measurements
are re-read every frame while the tool is open, which keeps the overlay correct
through CSS transitions, image loads and framework re-renders, and drops
anything that leaves the document. Nothing redraws unless something moved; the
cost is about 0.01 ms per frame.

```
align/
  index.ts      init, hotkey, hover/lock state, lifecycle
  overlay.ts    canvas: outlines, guides, distances, tooltip
  boxmodel.ts   the draggable box model panel
  indicator.ts  the badge and its key list
  measure.ts    geometry, hit-testing, computed styles
  theme.ts      OKLCH tokens, type scale, font loading
  types.ts      Box, Segment, Bands, Quad
  config.ts     ignore selector, hotkey, panel and ruler keys
```

Only `overlay.ts`, `boxmodel.ts` and `indicator.ts` write to the DOM; only
`index.ts` touches window globals and `import.meta.hot`; the geometry in
`measure.ts` is pure and unit-tested.

**Design.** Type is Inter on a three-step scale, with tabular figures so the
numbers don't jitter as the cursor moves. Colour is
[Fluid Functionalism](https://fluidfunctionalism.com)'s tokens in OKLCH,
written once as `light-dark()` pairs, so the panel follows your OS theme; the
box model uses that system's surface ladder, one step per nested region. There
is exactly one animation — the panel's entrance, 160 ms in and 120 ms out.
Everything else is instant, because hovering happens hundreds of times a
session and motion there is friction on every use.

---

## Known limits

Three things it cannot see. All follow from hit-testing rather than oversight.

| | |
|---|---|
| `pointer-events: none` | the browser looks straight through these, so a decorative overlay measures as its parent |
| inside an `<iframe>` | a separate document — hit-testing stops at the boundary and reports the `iframe` |
| closed shadow roots | nothing can pierce them, by design. Open roots work normally |

---

## Development

```bash
npm install
npm run demo        # http://localhost:5173
npm test            # unit tests on the geometry
npm run typecheck
npm run build       # dist/align.js
npm run size        # fails over 32 KB
```

Two example pages under `examples/vite-demo`:

- **`/`** — simple fixtures of known size, for checking a reading against DevTools
- **`/complex.html`** — twelve hard cases, each stating the numbers it should
  produce: asymmetric box models, `box-sizing`, flex and grid gaps, negative
  margins, transforms, shadow DOM, scrolling containers, fractional thirds,
  deep nesting, SVG and tables, sticky/fixed/iframe

`examples/next-app` is a minimal App Router app used to verify the SSR guard,
HMR cleanup, and that nothing reaches the production bundle.

---

## License

Private. All rights reserved.
