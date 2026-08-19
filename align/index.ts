import { mergeConfig, type Config } from './config';
import { boxOf, gapSegments, hitTest } from './measure';
import { mountOverlay, type Overlay } from './overlay';
import type { Box } from './types';

/**
 * Public API, state machine, hotkeys, lifecycle. The only module that touches
 * window globals or import.meta.hot.
 */

export type { Box, Bands, Segment } from './types';
export type { Config } from './config';

declare global {
  interface Window { __align?: boolean }
}

let cfg: Config;
let overlay: Overlay | null = null;
let hover: Box | null = null;
let pinned: Box | null = null;

function matchesHotkey(e: KeyboardEvent): boolean {
  const parts = cfg.hotkey.toLowerCase().split('+');
  const key = parts[parts.length - 1]!;
  if (e.key.toLowerCase() !== key) return false;
  if (parts.includes('shift') !== e.shiftKey) return false;
  if (parts.includes('alt') !== e.altKey) return false;
  const mod = parts.includes('mod') || parts.includes('ctrl') || parts.includes('cmd');
  return mod === (e.metaKey || e.ctrlKey);
}

function render(cursor?: { x: number; y: number }) {
  overlay?.update({
    hover,
    pinned,
    lines: pinned && hover && hover.el !== pinned.el ? gapSegments(pinned, hover) : [],
    ...(cursor ? { cursor } : {}),
  });
}

function onMouseMove(e: MouseEvent) {
  hover = hitTest(e.clientX, e.clientY, cfg);
  render({ x: e.clientX, y: e.clientY });
}

function onMouseDown(e: MouseEvent) {
  const hit = hitTest(e.clientX, e.clientY, cfg);
  if (!hit) return;
  // While the tool is on, a click means "pin this" — it must not also reach the
  // page, the same bargain DevTools' inspect mode makes.
  e.preventDefault();
  e.stopPropagation();
  pinned = hit;
  hover = hit;
  render({ x: e.clientX, y: e.clientY });
}

/** Rects move under the cursor on scroll and resize; re-measure the live two. */
function onViewportChange() {
  if (pinned) pinned = boxOf(pinned.el);
  if (hover) hover = boxOf(hover.el);
  overlay?.resize();
  render();
}

function activate() {
  if (overlay) return;
  overlay = mountOverlay();
  addEventListener('mousemove', onMouseMove);
  addEventListener('mousedown', onMouseDown, { capture: true });
  addEventListener('resize', onViewportChange);
  addEventListener('scroll', onViewportChange, true);
}

function deactivate() {
  removeEventListener('mousemove', onMouseMove);
  removeEventListener('mousedown', onMouseDown, { capture: true });
  removeEventListener('resize', onViewportChange);
  removeEventListener('scroll', onViewportChange, true);
  overlay?.destroy();
  overlay = null;
  hover = null;
  pinned = null;
}

function onKey(e: KeyboardEvent) {
  if (matchesHotkey(e)) {
    e.preventDefault();
    overlay ? deactivate() : activate();
  } else if (e.key === 'Escape' && overlay) {
    // Escape backs out one step: drop the pin first, close second.
    if (pinned) { pinned = null; render(); }
    else deactivate();
  }
}

export function initAlign(partial: Partial<Config> = {}): void {
  if (typeof window === 'undefined') return;   // SSR — Next runs modules on the server
  if (window.__align) return;                  // HMR re-entry
  window.__align = true;

  cfg = mergeConfig(partial);

  // Until the first toggle this listener is the tool's entire footprint.
  // Capture phase so an app-level shortcut handler cannot swallow the hotkey.
  addEventListener('keydown', onKey, { capture: true });

  const hot = (import.meta as ImportMeta & { hot?: { dispose(cb: () => void): void } }).hot;
  if (hot) {
    hot.dispose(() => {
      deactivate();
      removeEventListener('keydown', onKey, { capture: true });
      delete window.__align;
    });
  }
}
