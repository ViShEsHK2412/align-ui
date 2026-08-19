# align-ui

A dev-only measuring tool that runs inside your own project. Hover any element
to see its size, click to lock it, then hover another to get the exact distance
between them — fractions included.

It measures. It doesn't judge: whether `25.5px` is wrong is your call.

![align-ui measuring the gutters between five chips](docs/screenshot.png)

- No runtime dependencies
- ~24 KB minified, 8.7 KB gzipped
- Physically absent from production builds
- Vite, Next.js, CRA, Remix, Astro, SvelteKit

---

## Install

```bash
npm i -D github:ViShEsHK2412/align-ui
```

Then pick the line that matches your setup.

### Vite, Astro, SvelteKit, Remix, Nuxt

One line in the config, and nothing in application code:

```ts
// vite.config.ts
import align from 'align-ui/vite';

export default defineConfig({
  plugins: [align()],
});
```

The plugin is `apply: 'serve'`, so it does not exist during a production build —
there is no dev guard to remember and no way for the tool to reach a bundle by
accident. Options go straight in: `align({ hotkey: 'mod+shift+a' })`.

### Anything else

```ts
// entry file
if (import.meta.env.DEV) import('align-ui/auto');
```

Or take the handle yourself if you want to pass options:

```ts
if (import.meta.env.DEV) {
  import('align-ui').then((m) => m.initAlign({ ignore: '.my-widget' }));
}
```

### Next.js (App Router)

Next has no equivalent of Vite's HTML hook, so it takes a small client
component. No import of ours in the layout, so nothing reaches the bundle:

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
    import('align-ui/auto');
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
> import reachable, so the whole tool ships to production.

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
| drag from a rule | pull out a guide; drag it back to remove |
| `V` / `H` | vertical / horizontal guide at the cursor |
| `Alt` while placing | ignore snapping |
| `Del` / `Shift + Del` | remove the guide under the cursor / all of them |
| `Esc` | close the key list, then the locks, then the tool |

Clicking the **Align** badge, top-right, shows this list in the page.

**Rulers** run along the top and left edges in *page* coordinates, counting from
the top-left of the document rather than the viewport, so the numbers keep
meaning something as you scroll. Ticks step 10 / 50 / 100 px and the cursor is
marked on both rules. Locked elements are shaded on them, so a selection stays
findable once it scrolls off — the hovered element is not, since a band
repainting on every mouse move is noise rather than information.

**Guides** are lines you place yourself, in page coordinates like the rulers.
Pull one out of a rule — down from the top for a horizontal, right from the left
for a vertical — so the axis is implied by where the drag started. Or press `V`
or `H` to drop one at the cursor, which works whether or not the rulers are
showing. Drag a guide back into a rule to throw it away.

They snap onto the edges of whatever is under the cursor within 4px, because a
guide meant to sit on a card's edge has to sit *on* it rather than a pixel off
and quietly lying; hold `Alt` to place one freely. And they measure: hover an
element and the nearest guide on each axis draws the gap and labels it, so
"is this aligned to my guide" gets a number. A guide passing *through* the
element draws nothing, since there is no gap to report.

Guides last for the session — kept across toggling the tool off and on, gone on
reload. Nothing is written to the host page's storage.

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
  guideKeys: { vertical: 'v', horizontal: 'h' },
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
  config.ts     ignore selector, hotkey, panel / ruler / guide keys
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
