# Align — Product & Engineering Spec

A dev-only alignment and spacing auditor that runs inside your own project.

> **How to use this document with Claude Code**
> Put this file at the repo root as `SPEC.md`. Build it in the phase order given in
> §12 — one phase per session, and do not start a phase until the previous phase's
> acceptance criteria pass. Each phase is written to be independently verifiable.
> When prompting, reference sections by number (e.g. "implement §5 cluster.ts").

---

## 1. Problem

Refining a layout in Figma is guesswork twice over: you eyeball alignment in the
mock, then eyeball it again in the browser, and the two never quite agree. The
browser already holds exact geometry for every element — `getBoundingClientRect()`
is ground truth. Nothing surfaces it in a form you can act on.

The specific failure this tool targets is the **near-miss**: five cards whose left
edges sit at `24px` and a sixth at `25.5px`. Invisible to the eye, felt as
sloppiness, and undetectable in a design file because the design file isn't what
shipped.

## 2. What we're building

A single dependency-free TypeScript module, imported into a project's entry file
behind a dev guard. On hotkey it scans the visible DOM, computes edge positions
for every element, clusters those positions, and reports every cluster whose
members don't agree.

Three capabilities, no more:

| # | Capability | Trigger |
|---|---|---|
| 1 | **Measure** — pixel gap between any two elements | `Alt` + hover, hover |
| 2 | **Align audit** — list every near-miss edge cluster | `Cmd/Ctrl+Shift+A` |
| 3 | **Subpixel flag** — every element on a fractional coordinate | part of audit |

Spacing-scale linting falls out of #2 for free (§5.4) and is included.

## 3. Goals and non-goals

**Goals**

- Zero runtime dependencies. Zero config required to get a first result.
- Under 20KB minified; scan of a 2000-element page under 100ms.
- Physically absent from production bundles — not dead code, not present.
- Works unmodified in Next.js (App + Pages Router), Vite, CRA, Remix, Astro,
  SvelteKit. The core module is framework-agnostic vanilla TS.
- Cannot break the host app: no global collisions, no style leakage, no
  hydration interference.

**Non-goals** — explicitly out of scope, do not build:

- Optical/baseline text metrics, font ink-bound measurement
- Responsive breakpoint sweeps
- Design-file (PNG) diffing
- Element → source-file jumping
- Nudge-to-patch / writing CSS back to source
- Colour contrast, a11y checks, touch-target sizing
- Persistence, snapshots, history, CI integration

Each is a separate tool. Adding any of them to this one is scope failure.

## 4. Architecture

```
align/
  index.ts       public API, state machine, hotkeys, lifecycle    ~90 lines
  scan.ts        DOM walk → Box[]                                 ~70 lines
  cluster.ts     clustering + audit rules (pure, no DOM)          ~90 lines
  measure.ts     Alt+hover two-element gap computation            ~60 lines
  overlay.ts     canvas rendering                                ~130 lines
  panel.ts       shadow-DOM results panel                        ~120 lines
  types.ts       shared interfaces                                ~40 lines
  config.ts      defaults + merge                                 ~30 lines
```

Roughly 600 lines. Hard rules:

- `cluster.ts` **must be pure** — no `document`, no `window`, no DOM types
  beyond plain numbers. This is what makes it unit-testable.
- `scan.ts` is the only module that walks the DOM.
- `overlay.ts` and `panel.ts` are the only modules that write to the DOM.
- Nothing outside `index.ts` touches `window` globals or `import.meta.hot`.

### Stack

- **TypeScript**, strict mode.
- **esbuild** for bundling. One command, no config file.
- **Vitest** for `cluster.ts` unit tests only. Nothing else is unit tested.
- Browser APIs only: `getBoundingClientRect`, `getComputedStyle`,
  `Element.checkVisibility`, `MutationObserver`, `<canvas>`, `attachShadow`.

No React, no Preact, no Tailwind, no utility libraries. If a task seems to need
a dependency, it is out of scope or being over-built.

```json
// package.json scripts
{
  "build": "esbuild align/index.ts --bundle --format=esm --minify --outfile=dist/align.js",
  "test": "vitest run"
}
```

## 5. Core specification

### 5.1 Types

```ts
// types.ts
export interface Box {
  el: Element;
  label: string;          // "div.card", "button#submit" — for display
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export type Axis = 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY';

export interface Violation {
  kind: 'align' | 'subpixel' | 'spacing';
  axis?: Axis;
  values: number[];       // distinct values present in the cluster, sorted
  majority: number;       // the value most elements agree on
  spread: number;         // max - min
  boxes: Box[];           // offenders only — boxes NOT at `majority`
  all: Box[];             // every box in the cluster
  message: string;        // pre-rendered human string for the panel
}
```

### 5.2 `scan.ts`

```ts
export function scan(cfg: Config): Box[]
```

Walk the document, return one `Box` per qualifying element, in viewport
coordinates (not document coordinates — the overlay canvas is `position: fixed`,
so they match, and the scan is a point-in-time snapshot).

**Traversal.** Recursive, crossing shadow boundaries:

```ts
function walk(root: Document | ShadowRoot, out: Element[] = []): Element[] {
  for (const el of root.querySelectorAll('*')) {
    if (el.matches(SKIP_SELECTOR)) continue;
    out.push(el);
    if (el.shadowRoot) walk(el.shadowRoot, out);
  }
  return out;
}
```

**Exclusion rules**, applied in this order (cheapest first):

1. Matches `SKIP_SELECTOR` — see §5.5.
2. Is the overlay host or inside it.
3. `el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })` returns false.
4. `rect.width < cfg.minSize || rect.height < cfg.minSize` (default 4) — filters
   dividers, icon strokes, and zero-size wrappers that generate pure noise.
5. Rect is entirely outside the viewport.
6. `getComputedStyle(el).position === 'fixed'` **and** `cfg.skipFixed` — optional,
   default false, but useful for pages with sticky headers that legitimately
   don't align with content.

**Caching.** Results cached in a module-level `WeakMap<Element, Box>`, cleared
wholesale on invalidation (§8.2). Do not attempt incremental invalidation.

**Label generation.** `tagName.toLowerCase()` + `#id` if present + first class
if present, truncated to 40 chars. Purely cosmetic.

### 5.3 `cluster.ts` — the core algorithm

```ts
export function cluster(values: number[], tol: number): number[][]
```

Sort ascending, sweep, break a group when the gap to the previous member exceeds
`tol`. Note the comparison is against the **previous member**, not the group's
first member — this allows a chain to drift, which is intentional: a 1px drift
repeated six times is exactly the bug you want caught.

```ts
export function cluster(values: number[], tol: number): number[][] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const out: number[][] = [];
  let cur = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - cur[cur.length - 1] <= tol) cur.push(sorted[i]);
    else { out.push(cur); cur = [sorted[i]]; }
  }
  out.push(cur);
  return out;
}
```

```ts
export function auditAlignment(boxes: Box[], cfg: Config): Violation[]
```

For each of the six axes:

1. Extract the axis value from every box.
2. `cluster(values, cfg.tol)`.
3. Discard clusters with fewer than `cfg.minCluster` members (default 3 — two
   elements sharing an edge is coincidence, three is intent).
4. Discard clusters whose spread ≤ `cfg.epsilon` (default 0.5) — these are
   correctly aligned.
5. For surviving clusters, compute `majority` = the modal value after rounding to
   `cfg.epsilon` precision; ties break toward the value held by the most boxes,
   then toward the rounder number (prefer integers).
6. `boxes` = members not equal to `majority` within `epsilon`.

Emit one `Violation` per surviving cluster. Sort output by `spread` descending —
worst offenders first.

```ts
export function auditSubpixel(boxes: Box[], cfg: Config): Violation[]
```

Any box where `left`, `top`, `right`, or `bottom` has a fractional part greater
than `epsilon` and less than `1 - epsilon`. Group by element, one violation each.

**DPR caveat:** on a 2× display a `0.5px` offset renders cleanly and is not a
real defect. Multiply the check by `devicePixelRatio` — flag only when
`(value * dpr) % 1 > epsilon`. Without this the tool is unusable on a Retina
display, since it will flag hundreds of legitimate half-pixels.

### 5.4 Spacing lint (free, same data)

```ts
export function auditSpacing(boxes: Box[], cfg: Config): Violation[]
```

Two checks, both derived from the boxes already collected:

**Gap consistency.** Group boxes by `el.parentElement`. Within each group with
≥3 children, sort by `left`, compute the gap between adjacent pairs
(`next.left - cur.right`). Cluster those gaps with `cfg.tol`. A cluster with
spread > `epsilon` means inconsistent gutters. Repeat vertically with
`next.top - cur.bottom`.

**Scale adherence.** For each box, read `getComputedStyle` for `gap`,
`rowGap`, `columnGap`, and the four `padding*` / `margin*` values. Parse to
px. Flag any non-zero value not present in `cfg.scale` within `epsilon`.

Cap scale-adherence output at 20 violations — on an unfamiliar codebase this
check alone can produce hundreds, which drowns the alignment results. Alignment
violations are always listed first.

### 5.5 Ignore list

```ts
const SKIP_SELECTOR = [
  'script', 'style', 'link', 'meta', 'head', 'title', 'noscript', 'br',
  'nextjs-portal',                    // Next.js dev overlay
  '#__next-build-watcher',
  '[data-nextjs-toast]',
  '[data-nextjs-dialog-overlay]',
  '#webpack-dev-server-client-overlay',
  'vite-error-overlay',
  '[data-align-ignore]',              // user escape hatch
].join(', ');
```

Merged with `cfg.ignore` at runtime. Without the framework entries, every dev
overlay in the project reports as an alignment violation on every scan — this is
the single most common reason a tool like this feels broken on first run.

## 6. Measure mode

Active only while `Alt` is held (`e.altKey` on `mousemove`).

- **First hover:** `document.elementFromPoint(x, y)`, walk up to the nearest
  element present in the current scan set. Highlight its rect. Show box-model
  bands: content, padding, border, margin, from `getComputedStyle`.
- **Alt+click:** pin that element as anchor A.
- **Second hover with anchor set:** compute the shortest edge-to-edge distance
  between A and B on both axes and draw dimension lines with px labels.
  - If the rects overlap on an axis, the gap on that axis is 0 and the line is
    drawn on the other axis only.
  - If they're diagonal (no overlap on either axis), draw both, L-shaped.
- **Escape or Alt release:** clear the anchor.

Round displayed values to 2 decimals, strip trailing zeros. Show the raw
fractional value — rounding to integers here defeats the purpose.

## 7. UI

### 7.1 Mounting

```ts
const host = document.createElement('div');
host.id = '__align_host';
host.setAttribute('data-align-ignore', '');
host.style.cssText = 'all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;';
document.documentElement.appendChild(host);
const root = host.attachShadow({ mode: 'closed' });
```

Three non-obvious requirements, all load-bearing:

- **`documentElement`, not `body`.** React reconciles `<body>` children during
  hydration; a node appended there can be removed or cause a hydration mismatch
  warning in Next.js.
- **`all: initial`** on the host. Shadow DOM blocks selector matching but not
  CSS *inheritance*. Without this, a global `font-family` or `line-height` from
  the host page leaks into the panel.
- **`pointer-events: none`** on the host, re-enabled to `auto` only on the panel
  element itself. Otherwise the overlay swallows every click in the app.

### 7.2 Overlay canvas

Single `<canvas>` filling the shadow root. Not divs — one node, one clear
operation, and it stays fast drawing 200 guide lines.

```ts
const dpr = devicePixelRatio;
canvas.width = innerWidth * dpr;
canvas.height = innerHeight * dpr;
canvas.style.width = innerWidth + 'px';
canvas.style.height = innerHeight + 'px';
ctx.scale(dpr, dpr);
```

Redraw inside a single `requestAnimationFrame`, never synchronously from an
event handler. Draw order: highlights → guide lines → dimension lines → labels.

Rendering rules:

- Violation guides: 1px dashed line spanning the viewport at the cluster's
  `majority` value, plus a solid marker at each offending value.
- Offending elements: 1px outline + 10% fill.
- Labels: 11px system mono, dark pill background, 3px padding, offset 4px from
  the line, flipped inward when within 40px of a viewport edge.
- Use `ctx.translate(0.5, 0.5)` before drawing 1px lines so they land on the
  pixel grid rather than straddling it. A blurry alignment tool is absurd.

### 7.3 Panel

Fixed bottom-right, 340px wide, max-height 60vh, scrollable, `pointer-events: auto`.

Contents:
- Header: violation count, tolerance slider (1–8px, live, re-runs audit on
  change), close button.
- Filter tabs: All / Align / Spacing / Subpixel.
- List: one row per violation showing `message`, the axis, and the values.
  Row hover → highlight that violation's boxes on the canvas and dim others.
  Row click → `console.log` the offending elements (so you can inspect them in
  DevTools) and scroll the first into view.

Message format:

```
left · 6 elements · 5 at 24px, 1 at 25.5px
gap-x · 4 items · 16, 16, 18px
subpixel · div.card · top 100.5px
```

The tolerance slider matters more than it looks. Too tight and everything is a
violation; too loose and you miss real 1.5px drift. It needs to be adjustable
while looking at the results, not set in a config file beforehand.

## 8. Lifecycle

### 8.1 Public API

```ts
export function initAlign(cfg?: Partial<Config>): void
```

Idempotent. Attaches a keydown listener in **capture phase** (`{ capture: true }`)
so app-level shortcut handlers can't swallow the hotkey. Mounts nothing until
first activation.

**Dormancy is a requirement, not an optimisation.** Before first toggle the tool
must register exactly one keydown listener and nothing else — no observers, no
DOM nodes, no scanning. An imported dev tool that costs anything at rest will get
removed from the project within a week.

Hotkeys:
- `Cmd/Ctrl + Shift + A` — toggle
- `Escape` — close if open
- `Alt` (held) — measure mode, only while open

### 8.2 Invalidation

While active only:

```ts
const mo = new MutationObserver(() => { cache = new WeakMap(); stale = true; });
mo.observe(document.body, { childList: true, subtree: true, attributes: true,
                            attributeFilter: ['class', 'style'] });
```

Drop the cache, mark stale, show a "rescan" affordance in the panel header. **Do
not rescan on mutation** — an animating page would rescan hundreds of times a
second. Also invalidate on `resize` and `scroll`, both debounced 150ms.

Disconnect the observer on deactivate.

### 8.3 Guards

```ts
export function initAlign(cfg: Partial<Config> = {}) {
  if (typeof window === 'undefined') return;        // SSR — Next runs modules on the server
  if ((window as any).__align) return;              // HMR re-entry
  (window as any).__align = true;
  // ...
}
```

The SSR guard is not optional. Next.js executes module top-level code during
server render; a bare `document.addEventListener` at file scope crashes the build
with an unhelpful error.

HMR cleanup:

```ts
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    host.remove();
    mo.disconnect();
    removeEventListener('keydown', onKey, true);
    delete (window as any).__align;
  });
}
```

Without this, every file save stacks another canvas and another listener set.
The page degrades gradually over an editing session, which is a miserable bug to
diagnose after the fact.

## 9. Integration

### Vite / CRA / Remix / SvelteKit / Astro

```ts
// main.tsx — entry file
if (import.meta.env.DEV) import('./align').then(m => m.initAlign());
```

### Next.js App Router

```tsx
// components/AlignDev.tsx
'use client';
import { useEffect } from 'react';

export default function AlignDev() {
  useEffect(() => {
    import('@/align').then(m => m.initAlign());
  }, []);
  return null;
}
```

```tsx
// app/layout.tsx
{process.env.NODE_ENV !== 'production' && <AlignDev />}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
useEffect(() => {
  if (process.env.NODE_ENV !== 'production') {
    import('../align').then(m => m.initAlign());
  }
}, []);
```

**Why the dynamic `import()` inside the env check matters:** it makes the module
statically unreachable in a production build, so the bundler drops it from the
output chunk entirely. A static import guarded by an `if` still ships the bytes.
Verify this in Phase 6 — do not assume it.

## 10. Configuration

```ts
export interface Config {
  tol: number;        // clustering tolerance, px          default 3
  epsilon: number;    // "same value" threshold, px        default 0.5
  minSize: number;    // ignore elements smaller than      default 4
  minCluster: number; // min members to count as a group   default 3
  scale: number[];    // spacing scale, px                 default [4,8,12,16,24,32,48,64]
  ignore: string;     // extra CSS selector to skip        default ''
  skipFixed: boolean; //                                   default false
  hotkey: string;     //                                   default 'mod+shift+a'
}
```

Passed at init, checked into the repo:

```ts
initAlign({
  tol: 2,
  scale: [4, 8, 12, 16, 24, 32],
  ignore: '.third-party-widget, [data-radix-portal]',
});
```

**Tailwind projects** can read real tokens instead of hardcoding:

```ts
import twCfg from '../tailwind.config';
const scale = Object.values(twCfg.theme.spacing)
  .map(v => parseFloat(v as string) * 16)
  .filter(n => !isNaN(n));
```

## 11. Performance budget

| Operation | Budget |
|---|---|
| Full scan, 2000 elements | < 100ms |
| Audit (all rules) | < 20ms |
| Canvas redraw | < 8ms |
| Idle cost when inactive | 1 event listener |
| Bundle, minified | < 20KB |

Rules that make this hold:

- Scan on demand only — hotkey or explicit rescan. Never on `mousemove`.
- Hover does one `elementFromPoint`, no rescan.
- Batch all `getBoundingClientRect` calls in one pass, then all
  `getComputedStyle` calls in a second pass. Interleaving them causes repeated
  style recalculation and will blow the budget by an order of magnitude. This is
  the single biggest performance factor in the whole tool.
- Cache in `WeakMap`, invalidate wholesale.
- All drawing inside one `requestAnimationFrame`.

## 12. Build phases

Each phase ships something verifiable. Do not proceed on a failing phase.

### Phase 1 — Prove the idea (highest priority)

Build `types.ts`, `scan.ts`, `cluster.ts`, `config.ts` only. No UI, no canvas.
Expose `window.__alignAudit()` returning `Violation[]` and `console.table` it.

**Acceptance:** run it on a page you've already polished by hand. It surfaces
at least two genuine misalignments you didn't know about, and fewer than ten
false positives.

**If it reports forty things that are all fine, stop and fix filtering.**
Tune `minSize`, `minCluster`, and `SKIP_SELECTOR` until signal is clean. Every
later phase is wasted effort on top of a noisy scanner, and no amount of UI
polish makes a noisy list useful.

### Phase 2 — Unit tests

Vitest on `cluster.ts` only. Cases: empty input, single value, exact-match
cluster (no violation), 5-at-24 + 1-at-25.5 (one violation, majority 24),
chain drift 24→25→26→27 with tol 3 (one cluster, flagged), two genuinely
separate groups at 24 and 200 (two clusters, neither flagged).

**Acceptance:** all pass. `cluster.ts` imports nothing.

### Phase 3 — Overlay

`overlay.ts` + shadow host + canvas. Draw violation guides and outlines from
Phase 1's results. Toggle hotkey. No panel yet.

**Acceptance:** lines land on the pixel grid (not blurry); no style leakage from
the host page; clicking through the overlay reaches the app normally; toggling
off leaves no trace in the DOM.

### Phase 4 — Panel

`panel.ts`. List, filter tabs, tolerance slider, hover-to-highlight,
click-to-log.

**Acceptance:** adjusting the slider re-runs the audit and updates the list in
under 50ms.

### Phase 5 — Measure mode

`measure.ts`. Alt+hover, box model bands, Alt+click anchor, dimension lines.

**Acceptance:** measured gap matches DevTools' computed values exactly, including
fractional parts.

### Phase 6 — Integration hardening

HMR dispose, SSR guard, framework ignore selectors, production-strip
verification.

**Acceptance:** (a) 30 consecutive file saves with the tool open leaves exactly
one canvas in the DOM and one keydown listener; (b) `next build` succeeds and
`grep -r "__align" .next/static` returns nothing; (c) works unmodified in one
Next.js and one Vite project.

## 13. Known hazards

| Hazard | Mitigation |
|---|---|
| Retina half-pixels flagged as defects | Multiply subpixel check by `devicePixelRatio` (§5.3) |
| Next.js dev overlay reported as violations | `SKIP_SELECTOR` (§5.5) |
| Hydration mismatch from overlay node | Mount to `documentElement` (§7.1) |
| Host page CSS inherits into panel | `all: initial` on shadow host (§7.1) |
| Listener/canvas stacking on HMR | `import.meta.hot.dispose` (§8.3) |
| Build crash on `next build` | SSR `typeof window` guard (§8.3) |
| Overlay eats all clicks | `pointer-events: none` on host (§7.1) |
| Layout thrash from interleaved reads | Batch rect reads, then style reads (§11) |
| Scale lint drowns alignment results | Cap at 20, sort alignment first (§5.4) |
| Scan misses web-component internals | Recursive shadow traversal (§5.2) |

## 14. Definition of done

You open a page you'd normally spend twenty minutes nudging in Figma, press one
hotkey, and get a list of five specific numbers that are wrong. You fix them in
the CSS, press the key again, and the list is empty.

If you're still opening Figma to check alignment after this exists, something in
Phase 1 filtering is wrong — not something in the feature set.
