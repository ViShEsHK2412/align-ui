import { audit } from './cluster';
import { mergeConfig, type Config } from './config';
import { bandsOf, gapSegments, nearestScanned } from './measure';
import { mountOverlay, type MeasureView, type Overlay } from './overlay';
import { createPanel, type Panel } from './panel';
import { invalidate, scan } from './scan';
import type { Box, Violation } from './types';

/**
 * Public API, state machine, hotkeys, lifecycle (§8). The only module that
 * touches window globals or import.meta.hot.
 */

export type { Box, Violation, Axis } from './types';
export type { Config } from './config';

declare global {
  interface Window {
    __align?: boolean;
    __alignAudit?: () => Violation[];
  }
}

let cfg: Config;
let overlay: Overlay | null = null;
let panel: Panel | null = null;
let observer: MutationObserver | null = null;
let boxes: Box[] = [];
let violations: Violation[] = [];
let stale = false;
let debounce: ReturnType<typeof setTimeout> | undefined;
let byEl = new Map<Element, Box>();
let anchor: Box | null = null;
let measureShown = false;

function matchesHotkey(e: KeyboardEvent): boolean {
  const parts = cfg.hotkey.toLowerCase().split('+');
  const key = parts[parts.length - 1]!;
  if (e.key.toLowerCase() !== key) return false;
  if (parts.includes('shift') !== e.shiftKey) return false;
  if (parts.includes('alt') !== e.altKey) return false;
  const mod = parts.includes('mod') || parts.includes('ctrl') || parts.includes('cmd');
  return mod === (e.metaKey || e.ctrlKey);
}

/** Re-run the audit over the boxes already measured — no DOM reads. */
function reaudit() {
  violations = audit(boxes, cfg, devicePixelRatio);
  overlay?.update({ violations, highlighted: null });
  panel?.update(violations, { stale });
}

function rescan() {
  invalidate();
  boxes = scan(cfg);
  byEl = new Map(boxes.map((b) => [b.el, b]));
  stale = false;
  reaudit();
}

// ── Measure mode (§6) — active only while Alt is held ───────────────────────

function clearMeasure() {
  anchor = null;
  measureShown = false;
  overlay?.update({ measure: null });
}

function onMouseMove(e: MouseEvent) {
  if (!e.altKey) {
    if (anchor || measureShown) clearMeasure();
    return;
  }
  // One hit test per move; never a rescan (§11).
  const hover = nearestScanned(document.elementFromPoint(e.clientX, e.clientY), byEl);
  const view: MeasureView = {
    hover,
    anchor,
    bands: hover ? bandsOf(hover.el) : null,
    lines: anchor && hover && hover !== anchor ? gapSegments(anchor, hover) : [],
  };
  measureShown = true;
  overlay?.update({ measure: view });
}

function onMouseDown(e: MouseEvent) {
  if (!e.altKey) return;
  const hit = nearestScanned(document.elementFromPoint(e.clientX, e.clientY), byEl);
  if (!hit) return;
  // Alt+click is a browser gesture on some platforms; this one is ours.
  e.preventDefault();
  e.stopPropagation();
  anchor = hit;
  overlay?.update({ measure: { hover: hit, anchor, bands: bandsOf(hit.el), lines: [] } });
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'Alt') clearMeasure();
}

function markStale() {
  if (stale) return;
  stale = true;
  panel?.update(violations, { stale });
}

function onResizeOrScroll() {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    markStale();
    overlay?.resize();
  }, 150);
}

function activate() {
  if (overlay) return;
  overlay = mountOverlay();
  panel = createPanel(overlay.root, cfg, {
    // The slider re-audits the boxes already measured — no rescan, no DOM reads.
    onTol: (tol) => { cfg = { ...cfg, tol }; reaudit(); },
    onHover: (v) => overlay?.update({ highlighted: v }),
    onSelect: (v) => {
      console.log('[align]', v.message, v.boxes.map((b) => b.el));
      v.boxes[0]?.el.scrollIntoView({ block: 'center' });
    },
    onRescan: () => rescan(),
    onClose: () => deactivate(),
  });
  rescan();

  // Drop the cache and flag staleness, but DO NOT rescan: an animating page
  // would rescan hundreds of times a second (§8.2).
  observer = new MutationObserver(() => { invalidate(); markStale(); });
  observer.observe(document.body, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ['class', 'style'],
  });
  addEventListener('resize', onResizeOrScroll);
  addEventListener('scroll', onResizeOrScroll, true);
  addEventListener('mousemove', onMouseMove);
  addEventListener('mousedown', onMouseDown, { capture: true });
  addEventListener('keyup', onKeyUp);
}

function deactivate() {
  observer?.disconnect();
  observer = null;
  removeEventListener('resize', onResizeOrScroll);
  removeEventListener('scroll', onResizeOrScroll, true);
  removeEventListener('mousemove', onMouseMove);
  removeEventListener('mousedown', onMouseDown, { capture: true });
  removeEventListener('keyup', onKeyUp);
  clearTimeout(debounce);
  panel?.destroy();
  panel = null;
  overlay?.destroy();
  overlay = null;
  boxes = [];
  byEl = new Map();
  violations = [];
  anchor = null;
  measureShown = false;
  stale = false;
}

function onKey(e: KeyboardEvent) {
  if (matchesHotkey(e)) {
    e.preventDefault();
    overlay ? deactivate() : activate();
  } else if (e.key === 'Escape' && overlay) {
    // Escape backs out one step: drop the measurement first, close second.
    if (anchor || measureShown) clearMeasure();
    else deactivate();
  }
}

export function initAlign(partial: Partial<Config> = {}): void {
  if (typeof window === 'undefined') return;   // SSR — Next runs modules on the server
  if (window.__align) return;                  // HMR re-entry
  window.__align = true;

  cfg = mergeConfig(partial);

  // Dormancy is a requirement, not an optimisation (§8.1): until the first
  // toggle this listener is the tool's entire footprint. Capture phase so an
  // app-level shortcut handler cannot swallow the hotkey.
  addEventListener('keydown', onKey, { capture: true });

  // Without this, every file save stacks another canvas and another listener
  // set. The page degrades gradually over an editing session, which is a
  // miserable bug to diagnose after the fact (§8.3).
  // Vite and friends expose `import.meta.hot` in dev, but nothing declares it in
  // a plain TS project — and this module has to type-check inside the host app's
  // build (Next runs tsc over it), so declare the sliver we use rather than
  // depending on vite/client being present.
  const hot = (import.meta as ImportMeta & { hot?: { dispose(cb: () => void): void } }).hot;
  if (hot) {
    hot.dispose(() => {
      deactivate();
      removeEventListener('keydown', onKey, { capture: true });
      delete window.__align;
      delete window.__alignAudit;
    });
  }

  window.__alignAudit = () => {
    const t0 = performance.now();
    invalidate();
    const measured = scan(cfg);
    const t1 = performance.now();
    const found = audit(measured, cfg, devicePixelRatio);
    console.log(
      `[align] ${measured.length} boxes, ${found.length} violations · ` +
      `scan ${(t1 - t0).toFixed(1)}ms, audit ${(performance.now() - t1).toFixed(1)}ms`,
    );
    return found;
  };
}
