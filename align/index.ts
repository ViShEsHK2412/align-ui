import { createBoxModel, type BoxModel } from './boxmodel';
import { mergeConfig, type Config } from './config';
import { createIndicator, type Indicator } from './indicator';
import { boxOf, chainSegments, gapSegments, hitTest } from './measure';
import { mountOverlay, type Overlay } from './overlay';
import { loadFont, unloadFont } from './theme';
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
let boxmodel: BoxModel | null = null;
let indicator: Indicator | null = null;
let hover: Box | null = null;
let pinned: Box[] = [];

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
  const last = pinned[pinned.length - 1];
  const locked = hover && pinned.some((b) => b.el === hover!.el);
  overlay?.update({
    hover,
    pinned,
    lines: [
      // Gaps within the locked set, then from the newest lock to what you're
      // pointing at — measuring to something already locked would be noise.
      ...chainSegments(pinned),
      ...(last && hover && !locked ? gapSegments(last, hover) : []),
    ],
    ...(cursor ? { cursor } : {}),
  });
  indicator?.update(pinned.length);
}

function onMouseMove(e: MouseEvent) {
  hover = hitTest(e.clientX, e.clientY, cfg);
  render({ x: e.clientX, y: e.clientY });
}

/** Lock exactly this one, dropping whatever was locked before. */
function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;
  const hit = hitTest(e.clientX, e.clientY, cfg);
  if (!hit) return;                       // our own UI — let it have the event
  swallow(e);
  indicator?.closeHelp();
  pinned = [hit];
  hover = hit;
  boxmodel?.show(hit);
  render({ x: e.clientX, y: e.clientY });
}

/**
 * Right-click builds the set: each one adds, and right-clicking something
 * already locked drops it, so a mis-click costs nothing.
 *
 * This used to be shift+click, which Chrome reads as "open in a new window"
 * on any link. Every modifier+click pairing is spoken for by some browser —
 * new tab, new window, download — so the second button is the one gesture
 * that is ours to take, and the context menu is suppressed while the tool is
 * on to make room for it.
 */
function onContextMenu(e: MouseEvent) {
  const hit = hitTest(e.clientX, e.clientY, cfg);
  if (!hit) return;
  swallow(e);
  indicator?.closeHelp();
  const at = pinned.findIndex((b) => b.el === hit.el);
  pinned = at >= 0 ? pinned.filter((_, i) => i !== at) : [...pinned, hit];

  hover = hit;
  const last = pinned[pinned.length - 1];
  if (last) boxmodel?.show(last); else boxmodel?.hide();
  render({ x: e.clientX, y: e.clientY });
}

/**
 * A link activates on `click`, not on `mousedown`, so preventing mousedown
 * alone still lets the page navigate out from under the tool — and lets
 * Chrome's modifier+click shortcuts fire. Both die here.
 */
function onClick(e: MouseEvent) {
  if (hitTest(e.clientX, e.clientY, cfg)) swallow(e);
}

/** Middle-click opens a new tab of its own accord. */
function onAuxClick(e: MouseEvent) {
  if (hitTest(e.clientX, e.clientY, cfg)) swallow(e);
}

function swallow(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

/** Rects move under the cursor on scroll and resize; re-measure the live two. */
function onViewportChange() {
  pinned = pinned.map((b) => boxOf(b.el));
  if (hover) hover = boxOf(hover.el);
  overlay?.resize();
  render();
}

function activate() {
  if (overlay) return;
  // Loaded here rather than at init, so the tool still costs nothing at rest.
  loadFont();
  overlay = mountOverlay();
  boxmodel = createBoxModel(overlay.root);
  indicator = createIndicator(overlay.root);
  indicator.update(0);
  addEventListener('mousemove', onMouseMove);
  addEventListener('mousedown', onMouseDown, { capture: true });
  addEventListener('click', onClick, { capture: true });
  addEventListener('auxclick', onAuxClick, { capture: true });
  addEventListener('contextmenu', onContextMenu, { capture: true });
  addEventListener('resize', onViewportChange);
  addEventListener('scroll', onViewportChange, true);
}

function deactivate() {
  removeEventListener('mousemove', onMouseMove);
  removeEventListener('mousedown', onMouseDown, { capture: true });
  removeEventListener('click', onClick, { capture: true });
  removeEventListener('auxclick', onAuxClick, { capture: true });
  removeEventListener('contextmenu', onContextMenu, { capture: true });
  removeEventListener('resize', onViewportChange);
  removeEventListener('scroll', onViewportChange, true);
  indicator?.destroy();
  indicator = null;
  boxmodel?.destroy();
  boxmodel = null;
  overlay?.destroy();
  overlay = null;
  unloadFont();
  hover = null;
  pinned = [];
}

function onKey(e: KeyboardEvent) {
  if (matchesHotkey(e)) {
    e.preventDefault();
    overlay ? deactivate() : activate();
  } else if (e.key === 'Escape' && overlay) {
    // Escape backs out one step: drop the pin first, close second.
    if (pinned.length) { pinned = []; boxmodel?.hide(); render(); }
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
