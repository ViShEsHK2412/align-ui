# Align

A dev-only measuring tool that runs inside your own project. Hover anything to
see its size, click to pin it, then hover something else to get the exact
distance between them — fractions included.

It measures. It doesn't judge: whether 25.5px is wrong is your call.

No runtime dependencies, ~16KB minified, physically absent from production
bundles.

```
Cmd/Ctrl + Shift + A    toggle
hover                   outline + dotted edge guides + size tooltip
click                   lock it, and open the box model panel
right-click             add to the locked set (or drop one already in it)
hover with locks set    distance from the newest lock to what you point at
drag the panel header   move the box model anywhere on screen
Escape                  clear the locks; again to close
```

**Locking more than one** is how you check a row at a glance: click the first
tag, then right-click the rest, and every gutter between them is measured at
once. The set is ordered along whichever axis it actually varies on, so a row
reads left-to-right and a column top-to-bottom without being told which.
Right-clicking something already locked drops it, so a mis-click costs nothing.

*Why the second button:* every modifier+click pairing is already spoken for by
the browser — Shift opens a new window, Ctrl/Cmd a new tab, Alt downloads — so
the right button is the one gesture left to take. The context menu is
suppressed while the tool is on to make room for it.

A badge sits top-right whenever the tool is running, with a count of what is
locked, so it can never be on without you knowing. Click it for the full list
of keys.

While the tool is on it swallows clicks — plain, modified, and middle — so
nothing navigates out from under you. That takes preventing the `click` event,
not just `mousedown`: a link activates on click, so stopping mousedown alone
still lets the page navigate. Toggle off to use the app.

## What you see

- **Dotted guides** run the full viewport from each edge of whatever you're
  hovering, so you can line things up by eye.
- **Distance lines** are drawn with end caps and a px label — between each
  adjacent pair in the locked set, and from the newest lock to whatever you're
  pointing at.
- **The tooltip** follows the cursor with `160 × 24` and nothing else.
- **The box model panel** starts bottom-left and shows margin, border, padding
  and content for the most recently locked element, each region a step up the surface ladder
  so depth is carried by the surface rather than by colour. Zeros are muted so
  the numbers that matter stand out. Drag it by the header to anywhere on
  screen — it lifts while held, stays where you put it, and is clamped so it
  can never be lost off an edge.

Everything is 1px. Numbers are tabular, so they don't jitter as the cursor
moves.

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

**Type** is Inter throughout, on a three-step scale named by use: 13px for the
panel title, 12px for every number and the cursor tooltip, 11px for the band
names — the only thing below the 12px floor, and it never carries a value.
Numbers are `tabular-nums`, which matters more here than anywhere else: they
change on every mousemove, and proportional digits make the readout jitter.
`font-synthesis: none`, so a missing weight fails visibly instead of being
faked.

Inter is loaded from Google Fonts at document level, because `@font-face`
inside a shadow root is ignored — a stylesheet in our own shadow CSS would
never apply. It's fetched on first activation, not at import, and removed on
teardown. If the host page blocks it, the system stack takes over and
everything still reads correctly; it just isn't Inter.

**Colour** is [Fluid Functionalism](https://fluidfunctionalism.com)'s tokens
converted to OKLCH, written once as `light-dark()` pairs and flipped by
`color-scheme`, so the panel follows your OS theme.

The box model uses that system's **surface ladder**: the panel is surface-3, a
card floating over the page, and each nested region climbs one more step, so
margin, border, padding and content read as depth rather than as four tinted
fills. Dark mode is the ladder verbatim — an additive white-opacity climb over
`#171717`. Light mode can't be, because Fluid's light ladder is flat `#FFFFFF`
from surface-3 up and lets *shadow* carry elevation, which does nothing for
regions nested inside one card; light instead steps down through the neutral
tokens the system already defines (surface-1, `--muted`, `--accent`), inverting
the direction at the same perceptual step size. Colour survives only in each
region's label, at a lightness chosen for contrast — L 0.72 on white reads
about 2.4:1, under the 4.5:1 floor for text.

Two CSS notes worth knowing if you touch this: `light-dark()` accepts **colours
only**, so a themed `box-shadow` has to be two declarations with a
`prefers-color-scheme` block — written as one it is silently invalid and you
get no shadow at all. And `color-scheme` has to sit on the panel rather than
`:host`, because the host's inline `all: initial` outranks a `:host` rule and
would pin `light-dark()` to its light branch on a dark page.

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
  index.ts      init, hotkey, hover/lock state, lifecycle
  overlay.ts    canvas: outlines, guides, distances, tooltip
  boxmodel.ts   the draggable box model panel
  indicator.ts  the top-right badge and its key list
  measure.ts    geometry, hit-testing, computed styles
  theme.ts      OKLCH tokens, type scale, font loading
  types.ts      Box, Segment, Bands, Quad
  config.ts     ignore selector, hotkey
```

Nothing walks the DOM and nothing is cached: guides come from the hovered
element's own rect, distances from exactly two elements, all measured on demand
through `elementFromPoint`. Since nothing is stored, nothing can go stale — an
animating page can't show you a wrong number.

Only `overlay.ts`, `boxmodel.ts` and `indicator.ts` write to the DOM; only `index.ts` touches
window globals and `import.meta.hot`; the geometry in `measure.ts` is pure and
unit-tested.

## Non-goals

Alignment auditing, spacing lint, subpixel warnings, design-file diffing,
jumping to source, writing CSS back, a11y and contrast checks. This tool tells
you the numbers; you decide what they mean.
