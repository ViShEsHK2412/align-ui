# Align — Implementation Plan

## Context

`ALIGN-PRD.md` specifies a ~600-line, dependency-free TypeScript dev tool that audits a live page for alignment near-misses (e.g. five cards at `left: 24px`, one at `25.5px`), subpixel positions, and inconsistent spacing, and shows results on a canvas overlay + shadow-DOM panel. The repo currently contains only the spec. This plan turns the spec into an ordered build, strictly following its six phases with a gate between each (§12: "do not proceed on a failing phase").

Decisions already made with the user:
- **Demo page in repo** (Vite) with seeded misalignments + clean control sections → reproducible Phase 1 acceptance, and the Vite target for Phase 6.
- **Next.js scratch app** also in repo for Phase 6 (HMR / SSR / production-strip checks).
- **Repo shape:** package-ready but `private: true` — source in `align/`, build to `dist/`, `exports`/`types` wired, so shipping later is a one-line flip.
- **npm + git**, one commit per phase.

## Target layout

```
workflow-proj/
  ALIGN-PRD.md                  (keep; also copy to SPEC.md per spec §0)
  package.json                  type:module, private:true, exports→dist, scripts
  tsconfig.json                 strict, ESNext, DOM + DOM.Iterable libs, noEmit (tsc used for typecheck + d.ts)
  vitest.config.ts              include: align/**/*.test.ts, environment: node
  align/
    types.ts  config.ts  scan.ts  cluster.ts  measure.ts  overlay.ts  panel.ts  index.ts
    cluster.test.ts
  dist/                         align.js (esbuild) + align.d.ts (tsc), gitignored
  examples/
    vite-demo/                  index.html + main.ts + styles.css, seeded bugs, imports ../../align
    next-app/                   minimal App Router app, components/AlignDev.tsx, imports align via relative path
  .gitignore                    node_modules, dist, examples/**/.next, examples/**/dist
```

Root `package.json` scripts:
- `build`: `esbuild align/index.ts --bundle --format=esm --minify --outfile=dist/align.js` + `tsc -p tsconfig.build.json` (declarations only)
- `test`: `vitest run`
- `typecheck`: `tsc --noEmit`
- `size`: print `dist/align.js` byte size (tiny node one-liner), asserts < 20KB
- `demo`: `vite examples/vite-demo` (vite is a devDependency of the root; demo has no own package.json to keep it simple)

Dev deps only: `typescript`, `esbuild`, `vitest`, `vite`. Next app has its own `package.json` (`next`, `react`, `react-dom`) since Next needs its own project root.

Hard architectural rules to enforce in every phase (spec §4): `cluster.ts` is pure (no DOM, no `Box.el` access — it receives `Box[]` but only reads numeric fields); only `scan.ts` walks the DOM; only `overlay.ts`/`panel.ts` write to the DOM; only `index.ts` touches `window` globals / `import.meta.hot`.

---

## Phase 0 — Scaffold (no spec phase; 15 min)

1. `git init`, `.gitignore`, `npm init -y` → edit `package.json` (name `align`, `private: true`, `type: module`, `exports: {".": {"types": "./dist/align.d.ts", "import": "./dist/align.js"}}`, `files: ["dist"]`).
2. `npm i -D typescript esbuild vitest vite`.
3. `tsconfig.json` (strict, `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `lib: [ES2022, DOM, DOM.Iterable]`, `types: ["vite/client"]` so `import.meta.env`/`import.meta.hot` typecheck). `tsconfig.build.json` extends it with `declaration`, `emitDeclarationOnly`, `outDir: dist`, `include: ["align/index.ts"]`... (rootDir align so output is `dist/index.d.ts`; point `types` there instead — simpler than renaming).
4. Copy `ALIGN-PRD.md` → `SPEC.md`.
5. Commit `chore: scaffold`.

Verify: `npm run typecheck` passes on an empty `align/index.ts`.

---

## Phase 1 — Prove the idea (types, config, scan, cluster; no UI)

**Files:** `align/types.ts`, `align/config.ts`, `align/scan.ts`, `align/cluster.ts`, minimal `align/index.ts`, `examples/vite-demo/*`.

### types.ts (§5.1)
`Box`, `Axis`, `Violation` exactly as spec. Add `Config` import type re-export.

### config.ts (§10)
`Config` interface + `DEFAULTS` (`tol 3, epsilon 0.5, minSize 4, minCluster 3, scale [4,8,12,16,24,32,48,64], ignore '', skipFixed false, hotkey 'mod+shift+a'`) + `mergeConfig(partial): Config`. `SKIP_SELECTOR` constant (§5.5) lives here too (it's config-shaped, and `scan.ts` needs it; keeps `scan.ts` focused on traversal). Export `skipSelector(cfg)` = `SKIP_SELECTOR` joined with `cfg.ignore` if non-empty.

### scan.ts (§5.2)
- `walk(root, out)` recursive across shadow roots, skipping `SKIP_SELECTOR` matches (note: `el.matches` with a selector containing an unknown custom tag like `nextjs-portal` is fine — valid selector syntax).
- `scan(cfg): Box[]` — two-pass batching (§11): pass 1 collects candidate elements and calls `getBoundingClientRect` for all; pass 2 applies `checkVisibility`, size, viewport, and (if `skipFixed`) `getComputedStyle` filters. Exclusion order as §5.2 (cheapest first). Overlay host check = `el.closest('#__align_host')` or being inside its shadow (host has `data-align-ignore` so SKIP covers it anyway).
- `checkVisibility` fallback: if method missing (older browsers), treat as visible.
- Module-level `cache: WeakMap<Element, Box>` + exported `invalidate()` that replaces the WeakMap (used by `index.ts` later).
- `label(el)` per §5.2 (tag + `#id` + first class, 40-char cap).

### cluster.ts (§5.3, §5.4) — pure
- `cluster(values, tol)` verbatim from spec.
- `auditAlignment(boxes, cfg)` — six axes; steps 1–6; majority via rounding to epsilon precision then mode; tie-break → most boxes, then prefer integer (`Math.abs(v - Math.round(v))` smaller). Sort by `spread` desc. `message`: `` `${axis} · ${n} elements · ${counts}` `` where counts is `"5 at 24px, 1 at 25.5px"` (descending count). Number formatting helper `fmt(n)` = 2 decimals, trailing zeros stripped — put in `cluster.ts` (pure) and reuse from measure/panel later.
- `auditSubpixel(boxes, cfg, dpr)` — `dpr` passed as a **number argument** so the module stays pure (`index.ts` passes `devicePixelRatio`). Flag when `frac = (value*dpr) % 1` satisfies `epsilon < frac < 1 - epsilon`. One violation per box listing offending edges.
- `auditSpacing(boxes, cfg)` — gap consistency grouped by parent. **Purity constraint:** grouping needs `el.parentElement`; to keep `cluster.ts` DOM-free, `scan.ts` will add an optional `parent?: Element` ... no — simpler: `Box` gets a `parentKey: number` (index of parent box, or -1) assigned in `scan.ts`; `cluster.ts` groups by that number. Scale-adherence needs `getComputedStyle` → that read happens in `scan.ts` pass 2 and is stored on `Box` as `spacing?: number[]` (parsed px values of gap/rowGap/columnGap/padding*/margin*). `auditSpacing` then stays pure. Cap scale violations at 20.
- `audit(boxes, cfg, dpr): Violation[]` = alignment first, then spacing, then subpixel (spec §5.4: alignment always first).

→ Small deliberate deviation from the spec's `Box` shape (adds `parentKey`, `spacing`) in service of the spec's stronger rule "cluster.ts must be pure". Flag in commit message.

### index.ts (Phase 1 version)
`initAlign(cfg?)` with SSR + re-entry guards, merges config, exposes `window.__alignAudit = () => { const v = audit(scan(cfg), cfg, devicePixelRatio); console.table(v.map(summary)); return v; }`. No hotkey yet (spec says no UI; a global function is enough).

### examples/vite-demo
`index.html` + `styles.css` + `main.ts` (`if (import.meta.env.DEV) import('../../align/index').then(m => m.initAlign())`). Page content:
- **Seeded defects (must be found):** card grid with 5 cards at `left: 24px`, 1 at `25.5px`; a nav row with gaps 16/16/18; a heading at `top: 100.5px` (via `margin-top: 0.5px` trick); a button group where one right edge drifts 1px per item (24→25→26→27).
- **Clean controls (must NOT be flagged):** a correctly aligned 3-col grid; a sticky header; a hidden (`display:none`) section; sub-4px divider lines; an off-screen section.
- Comment in HTML listing the expected violations.

### Acceptance (gate)
Open demo, run `__alignAudit()` in console: all seeded defects appear; clean sections produce < 10 false positives (target: 0–2). If noise is high, tune `minSize`/`minCluster`/`SKIP_SELECTOR` **before moving on** (spec §12 hard stop). Also verify scan time on a synthetic 2000-element page (add a `?stress=2000` query flag to the demo that appends N divs) — `performance.now()` around `scan()` < 100ms.

Commit `feat(phase1): scan + cluster + audit, demo page`.

---

## Phase 2 — Unit tests (cluster.ts only)

**File:** `align/cluster.test.ts`, `vitest.config.ts`.

Cases (spec §12 list + a few for the other pure functions):
- `cluster`: empty → `[]`; single value → `[[v]]`; exact 5×24 → one cluster; `[24,24,24,24,24,25.5]` tol 3 → one cluster; chain `24,25,26,27` tol 3 → one cluster; `[24,24,24,200,200,200]` → two clusters.
- `auditAlignment` (build `Box` fixtures with a helper `box({left,...})`, `el: {} as Element`): exact match → no violation; 5@24+1@25.5 → one violation, `majority 24`, `boxes.length 1`, `spread 1.5`; chain drift → flagged; two separate tight groups → none; `minCluster` respected; sorted by spread desc.
- `auditSubpixel`: 100.5 at dpr 1 → flagged; at dpr 2 → not flagged; 100.25 at dpr 2 → flagged.
- `auditSpacing`: gaps 16/16/18 → violation; scale lint cap 20.
- Purity guard: a test that `cluster.ts` source contains no `document`/`window` (read file via `fs` in the test) — cheap enforcement of §4.

Acceptance: `npm test` green; `cluster.ts` has zero imports other than `./types`/`./config` types.

Commit `test(phase2): cluster unit tests`.

---

## Phase 3 — Overlay

**Files:** `align/overlay.ts`, `align/index.ts` (hotkeys, mount/unmount, state).

### overlay.ts (§7.1, §7.2)
- `mount(): { host, root, canvas, ctx, destroy }` — host per §7.1 verbatim (`documentElement`, `all: initial`, `pointer-events:none`, `data-align-ignore`, closed shadow).
- `resize()` — DPR-scaled canvas backing store.
- `draw(state)` where `state = { violations, highlighted?: Violation|null, measure?: MeasureState|null }` — wrapped so callers call `schedule()` which coalesces into one `requestAnimationFrame`.
- Draw order: highlights → guides → dimension lines → labels. `ctx.translate(0.5,0.5)` for 1px lines. Guide = dashed full-viewport line at `majority` on the axis (vertical for left/right/centerX, horizontal for top/bottom/centerY), solid markers at offending values; offending boxes = 1px outline + 10% fill; labels 11px monospace pill, flipped inward near edges (40px).
- Color palette as constants (align = red-ish, spacing = amber, subpixel = blue) — tiny, no theming.

### index.ts additions
- State: `active`, `violations`, `cfg`, `stale`. Single keydown listener in capture phase registered at init (the *only* thing init does). Hotkey parse: `'mod+shift+a'` → check `e.key.toLowerCase()==='a' && e.shiftKey && (e.metaKey||e.ctrlKey)`; `Escape` closes.
- `activate()`: mount overlay, scan+audit, draw, start MutationObserver + debounced resize/scroll (150ms) that set `stale` (§8.2, no rescan). `deactivate()`: disconnect, remove host, clear state.
- Keep `window.__alignAudit` as a debug export.

### Acceptance (gate)
In demo: toggle on → dashed guides visible and crisp (zoom DevTools screenshot to confirm pixel-grid alignment); page clicks still work through the overlay; page `font-family`/`line-height` do not affect overlay labels (demo sets an aggressive global font); toggle off → `document.querySelector('#__align_host') === null`, `getEventListeners(document)` shows one keydown.

Commit `feat(phase3): canvas overlay + hotkey lifecycle`.

---

## Phase 4 — Panel

**File:** `align/panel.ts`; wiring in `index.ts`.

- `createPanel(root, handlers): PanelApi` — appended inside the same shadow root, `pointer-events:auto`, fixed bottom-right 340px, max-height 60vh, scroll. All CSS in one `<style>` inside the shadow root.
- Header: count, tolerance `<input type=range min=1 max=8 step=0.5>` (live → `handlers.onTol(v)` re-audits from cached boxes, no rescan), "rescan" button shown only when `stale`, close button.
- Tabs: All / Align / Spacing / Subpixel (filter by `kind`).
- Rows: `message` + axis + values. `mouseenter` → `handlers.onHover(v)` (overlay dims others, highlights this); `mouseleave` → `onHover(null)`; click → `console.log(v.boxes.map(b=>b.el))` + `scrollIntoView` first offender (`{block:'center'}`) — this triggers scroll → stale flag, which is correct behaviour.
- `panel.update(violations, {stale})` re-renders list (plain `innerHTML`-free DOM building, or a template string — ~120 lines either way; use DOM building to avoid escaping issues with labels).

Acceptance (gate): dragging slider updates list < 50ms (measure with `performance.now()` in the handler, log in dev); hover highlights; click logs elements in DevTools.

Commit `feat(phase4): results panel`.

---

## Phase 5 — Measure mode

**File:** `align/measure.ts`; overlay gains dimension-line + box-model-band drawing; `index.ts` adds `mousemove`/`click`/`keyup` listeners **only while active**.

- `measure.ts` exports pure-ish helpers: `nearestScanned(el, boxes)` (walk `parentElement`/host chain up to a Box), `gap(a: Box, b: Box): { dx?: Segment, dy?: Segment }` (shortest edge-to-edge per axis; 0 if overlapping on that axis; both if diagonal), `boxModel(el)` (reads `getComputedStyle` padding/border/margin → bands). DOM reads here are acceptable per spec (`measure.ts` is listed as doing hover computation), but keep `gap()` pure so it can be tested later if wanted.
- Interaction (§6): `mousemove` with `altKey` → `elementFromPoint`, highlight + bands; Alt+click → pin anchor A; second hover → dimension lines with `fmt()` labels (2 decimals, trailing zeros stripped); Escape / Alt keyup → clear anchor. All through `overlay.schedule()`.

Acceptance (gate): in demo, measured gap between two known elements matches DevTools computed layout exactly incl. fractions (seed a 13.5px gap to check).

Commit `feat(phase5): measure mode`.

---

## Phase 6 — Integration hardening

**Files:** `align/index.ts` (HMR dispose), `examples/next-app/*`, root scripts.

1. HMR: `if (import.meta.hot) import.meta.hot.dispose(() => { deactivate(); removeEventListener('keydown', onKey, true); delete window.__align; })`. Guard with `typeof import.meta.hot !== 'undefined'` style check so esbuild bundle for non-Vite consumers doesn't break (esbuild leaves `import.meta.hot` as-is; it's `undefined` at runtime, fine).
2. `examples/next-app`: `create-next-app`-equivalent minimal App Router (hand-written, no CLI prompts): `app/layout.tsx` with `{process.env.NODE_ENV !== 'production' && <AlignDev />}`, `components/AlignDev.tsx` per spec §9 importing `../../../align/index` (tsconfig path alias `@align/*` → `../../align/*`; Next transpiles TS outside root via `transpilePackages` not needed for relative imports — verify; fallback is a symlink or copying).
3. Production-strip: `npm run build` in next-app → `grep -r "__align" .next/static` must return nothing. Also check Vite: `vite build examples/vite-demo` → grep `dist/assets` for `__align`.
4. HMR stacking test: with tool open, save a file 30 times (script: loop `touch`/append-whitespace to `main.ts` with 300ms sleep) → `document.querySelectorAll('#__align_host').length === 1`, `getEventListeners(document).keydown.length === 1`.
5. Size budget: `npm run size` < 20KB; perf: re-check 2000-element scan < 100ms, audit < 20ms, redraw < 8ms (log `performance.now()` deltas behind a `cfg.debug`?—no, not in spec; just measure ad-hoc in devtools and record numbers in a `NOTES.md` or commit message).
6. Framework ignore selectors verified live: Next dev overlay present on page while scanning → not reported.

Acceptance (gate): spec §12 Phase 6 (a)(b)(c) all pass.

Commit `feat(phase6): HMR/SSR hardening, Next + Vite verification`.

---

## Verification summary (end-to-end)

- `npm run typecheck && npm test && npm run build && npm run size` all green.
- `npm run demo` → `Ctrl+Shift+A` → seeded defects listed, clean sections silent; fix one seeded CSS value → rescan → that row disappears (spec §14 definition of done).
- `cd examples/next-app && npm run dev` → same; `npm run build && grep -r __align .next/static` → empty.
- 30-save HMR test → one host, one listener.

## Risks / open points

- `Element.checkVisibility` is Chromium 105+/Safari 17.4+/Firefox 106+; fallback to "visible" keeps it from crashing elsewhere.
- `Box` shape gains `parentKey` + `spacing` to keep `cluster.ts` pure — a small, explained deviation from §5.1.
- Next importing TS from outside its project root: if it refuses, use `transpilePackages`/`experimental.externalDir` or a symlink; decided at Phase 6, not before.
