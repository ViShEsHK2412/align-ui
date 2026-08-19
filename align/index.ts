import { audit } from './cluster';
import { mergeConfig, type Config } from './config';
import { mountOverlay, type Overlay } from './overlay';
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
let debounce = 0;

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
  stale = false;
  reaudit();
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
  }, 150) as unknown as number;
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
}

function deactivate() {
  observer?.disconnect();
  observer = null;
  removeEventListener('resize', onResizeOrScroll);
  removeEventListener('scroll', onResizeOrScroll, true);
  clearTimeout(debounce);
  panel?.destroy();
  panel = null;
  overlay?.destroy();
  overlay = null;
  boxes = [];
  violations = [];
  stale = false;
}

function onKey(e: KeyboardEvent) {
  if (matchesHotkey(e)) {
    e.preventDefault();
    overlay ? deactivate() : activate();
  } else if (e.key === 'Escape' && overlay) {
    deactivate();
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
