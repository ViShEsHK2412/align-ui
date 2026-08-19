# Align

A dev-only alignment and spacing auditor that runs inside your own project.
Press one hotkey and get a list of the specific numbers that are wrong.

Built to [`SPEC.md`](./SPEC.md). No runtime dependencies, 16.7KB minified,
physically absent from production bundles.

```
Cmd/Ctrl + Shift + A    toggle the audit
Alt (held)              measure mode — hover for the box model, Alt+click to anchor
Escape                  clear the measurement, then close
```

## What it reports

| Kind | Example |
|---|---|
| **align** | `left · 6 elements · 5 at 24px, 1 at 25.5px` |
| **spacing** | `gap-x · 4 items · 16, 16, 18px` · `scale · div.card · padding-left 18px` |
| **subpixel** | `subpixel · h2#title · top 140.5px` |

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

export default function AlignDev() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;   // <- must be here
    import('@/align').then((m) => m.initAlign());
  }, []);
  return null;
}
```

```tsx
// app/layout.tsx
{process.env.NODE_ENV !== 'production' && <AlignDev />}
```

**The env check has to wrap the dynamic `import()` itself, not just the
element.** Guarding only `<AlignDev />` in the layout leaves the component
statically imported and the `import()` reachable, so the entire tool ships to
production. This was verified by grepping `.next/static` — see
[`examples/next-app`](./examples/next-app). The Vite recipe works as written
because `import.meta.env.DEV` guards the import directly.

If `align/` lives outside your Next project root, set
`experimental: { externalDir: true }` in `next.config.mjs`.

## Configuration

Everything has a default; none of it is required.

```ts
initAlign({
  tol: 2,                                    // clustering tolerance, px
  scale: [4, 8, 12, 16, 24, 32],             // your spacing scale
  ignore: '.third-party-widget, [data-radix-portal]',
});
```

| Option | Default | |
|---|---|---|
| `tol` | `3` | how far apart two edges can be and still count as one cluster |
| `epsilon` | `0.5` | when two values count as the same |
| `minSize` | `4` | ignore elements smaller than this |
| `minCluster` | `3` | members needed before a cluster counts as intent |
| `scale` | `[4,8,12,16,24,32,48,64]` | spacing scale for the lint |
| `ignore` | `''` | extra CSS selector to skip |
| `skipFixed` | `false` | skip `position: fixed` elements |
| `hotkey` | `'mod+shift+a'` | |

Use the tolerance slider in the panel rather than guessing this up front — too
tight and everything is a violation, too loose and you miss real 1.5px drift.

Mark anything the tool should never look at with `data-align-ignore`.

## Development

```bash
npm run demo         # the Vite demo page, with seeded misalignments
npm test             # unit tests (cluster.ts only)
npm run typecheck
npm run build && npm run size
```

`examples/vite-demo` seeds four known defects and a set of clean controls, so a
change that adds noise is visible immediately. `?stress=2000` tiles extra
elements to time a scan; `?hmrprobe` tracks listener registrations across saves.

## Where this differs from the spec

Each of these came out of a phase gate failing against a real page.

- **Subpixel has its own 0.1px threshold.** §5.3 words the check as
  `frac > epsilon && frac < 1 - epsilon`, which at the default `epsilon` of 0.5
  is an empty range — the exact half-pixels it exists to catch could never fire.
- **`Box` carries `key`, `parentKey` and `spacing`.** Sibling grouping and the
  scale lint need structure and computed styles; putting them on the box during
  the scan keeps `cluster.ts` free of DOM access, which §4 requires.
- **Extra filtering.** An unfiltered scan of stripe.com reported 187 findings,
  which is the failure §12 warns about. Now 34: nested pairs collapse, identical
  findings merge across axes, inline text boxes are skipped, subpixel reports
  only the element that introduced the offset (capped at 20), and the scale lint
  ignores fractional values because Chrome reports `margin: auto` as a used px
  value.
- **The Next.js recipe moved the env check inside the effect**, as above.

## Non-goals

Optical text metrics, breakpoint sweeps, design-file diffing, jumping to source,
writing CSS back, a11y and contrast, persistence and CI. Each is a separate
tool.
