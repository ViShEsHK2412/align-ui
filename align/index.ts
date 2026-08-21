import { createBoxModel, type BoxModel } from './boxmodel';
import { mergeConfig, type Config } from './config';
import { createIndicator, type Indicator } from './indicator';
import {
  boxOf, chainSegments, gapSegments, guideSegments, guideUnder, hitTest,
  snapEdges, snapTo,
} from './measure';
import { mountOverlay, type Overlay } from './overlay';
import { loadFont, unloadFont } from './theme';
import type { Box, Guide } from './types';

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
let watching = 0;
/** Sticky across open and close, like the panel's position. */
let rulers = false;
/** Guides live for the session: across toggling, gone on reload. */
let guides: Guide[] = [];
let nextGuideId = 1;
let dragging: Guide | null = null;
let hoverGuide: Guide | null = null;
/**
 * Where a grab on an existing guide began, and whether it has travelled far
 * enough to count as a drag. Pressing a guide has to serve two gestures: move
 * it, or lock it. A press that never really moves is a click.
 */
let grabFrom: { x: number; y: number } | null = null;
/** Hand-twitch allowance, in px. Below this a press is a click, not a drag. */
const CLICK_SLOP = 3;

/** The ruler gutter, mirrored from overlay.ts. */
const RULER = 22;

function inRuler(x: number, y: number): 'x' | 'y' | null {
  if (!rulers) return null;
  // Drag down from the top rule for a horizontal line, right from the left one
  // for a vertical: the axis is implied by where the drag began.
  if (y < RULER && x >= RULER) return 'y';
  if (x < RULER && y >= RULER) return 'x';
  return null;
}

/** Place a guide, pulling it onto a nearby edge unless Alt says otherwise. */
function placeGuide(g: Guide, x: number, y: number, free: boolean) {
  const under = hitTest(x, y, cfg);
  const viewport = g.axis === 'x' ? x : y;
  const snapped = snapTo(viewport, snapEdges(under, g.axis), free);
  g.at = snapped + (g.axis === 'x' ? scrollX : scrollY);
}

function addGuide(axis: 'x' | 'y', x: number, y: number, free: boolean): Guide {
  const g: Guide = { id: nextGuideId++, axis, at: 0, locked: false };
  placeGuide(g, x, y, free);
  guides = [...guides, g];
  return g;
}

function removeGuide(g: Guide) {
  guides = guides.filter((o) => o.id !== g.id);
  if (hoverGuide?.id === g.id) hoverGuide = null;
  if (dragging?.id === g.id) dragging = null;
}

function matchesHotkey(e: KeyboardEvent): boolean {
  const parts = cfg.hotkey.toLowerCase().split('+');
  const key = parts[parts.length - 1]!;
  if (e.key.toLowerCase() !== key) return false;
  if (parts.includes('shift') !== e.shiftKey) return false;
  if (parts.includes('alt') !== e.altKey) return false;
  const mod = parts.includes('mod') || parts.includes('ctrl') || parts.includes('cmd');
  return mod === (e.metaKey || e.ctrlKey);
}

/** A guide in viewport coordinates, which is what the segment maths wants. */
function viewportGuide(g: Guide) {
  return { axis: g.axis, pos: g.axis === 'x' ? g.at - scrollX : g.at - scrollY };
}

function render(cursor?: { x: number; y: number }) {
  const last = pinned[pinned.length - 1];
  const locked = hover && pinned.some((b) => b.el === hover!.el);
  const at = guides.map(viewportGuide);

  // Pointing at a guide means you are asking about that guide, so the element
  // behind it stops measuring. Without this you would get the guide's answer
  // and the element's answer stacked on top of each other.
  const onGuide = !dragging && hoverGuide ? hoverGuide : null;

  // A guide measures to every locked box when it is locked, or while you point
  // at it. Each one measures to itself, not to whichever guide happens to be
  // nearest — that is the whole point of choosing one.
  const measuring = guides.filter((g) => g.locked || g.id === onGuide?.id);
  overlay?.update({
    hover,
    pinned,
    rulers,
    guides,
    liveGuide: dragging ?? hoverGuide,
    lines: [
      // Gaps within the locked set, then from the newest lock to what you're
      // pointing at — measuring to something already locked would be noise.
      ...chainSegments(pinned),
      ...(last && hover && !locked && !onGuide ? gapSegments(last, hover) : []),
      // From every locked box to each guide that is asking.
      ...measuring.flatMap((g) => pinned.flatMap((b) => guideSegments(b, [viewportGuide(g)]))),
      // And from whatever you are pointing at to the nearest guide each way.
      ...(hover && !onGuide && guides.length ? guideSegments(hover, at) : []),
    ],
    ...(cursor ? { cursor } : {}),
  });
  indicator?.update(pinned.length);
}

/** The keyboard needs to know where the pointer is to drop a guide there. */
let cursorAt: { x: number; y: number } | null = null;

function onMouseMove(e: MouseEvent) {
  cursorAt = { x: e.clientX, y: e.clientY };
  if (dragging) {
    if (grabFrom && Math.hypot(e.clientX - grabFrom.x, e.clientY - grabFrom.y) > CLICK_SLOP) {
      grabFrom = null;     // travelled: this is a drag now, and stays one
    }
    if (!grabFrom) {
      placeGuide(dragging, e.clientX, e.clientY, e.altKey);
      guides = [...guides];
    }
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  hoverGuide = guideUnder(guides, e.clientX, e.clientY);
  hover = hitTest(e.clientX, e.clientY, cfg);
  render({ x: e.clientX, y: e.clientY });
}

function onMouseUp(e: MouseEvent) {
  if (!dragging) return;
  // Pressed and released without going anywhere: a click, which locks the
  // guide so it keeps measuring after the pointer leaves. Click again to let
  // it go quiet.
  if (grabFrom) {
    dragging.locked = !dragging.locked;
    guides = [...guides];
  } else if (inRuler(e.clientX, e.clientY) || e.clientX < RULER || e.clientY < RULER) {
    // Dropped back in a rule: that is how you throw a guide away.
    removeGuide(dragging);
  }
  grabFrom = null;
  dragging = null;
  render({ x: e.clientX, y: e.clientY });
}

/** Lock exactly this one, dropping whatever was locked before. */
function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;

  // Our own panels sit over the page, and the box model's left edge overlaps
  // the left rule. hitTest returns null over our own UI, so bailing here keeps
  // a grab on the panel header from being read as a drag off the rule.
  const onPage = hitTest(e.clientX, e.clientY, cfg);
  if (!onPage) return;

  // Precedence, so the gestures never fight: a rule starts a new guide, a
  // guide under the cursor gets picked up, anything else locks an element.
  const fromRuler = inRuler(e.clientX, e.clientY);
  if (fromRuler) {
    swallow(e);
    grabFrom = null;
    dragging = addGuide(fromRuler, e.clientX, e.clientY, e.altKey);
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  const grabbed = guideUnder(guides, e.clientX, e.clientY);
  if (grabbed) {
    swallow(e);
    dragging = grabbed;
    grabFrom = { x: e.clientX, y: e.clientY };
    render({ x: e.clientX, y: e.clientY });
    return;
  }

  swallow(e);
  indicator?.closeHelp();
  pinned = [onPage];
  hover = onPage;
  boxmodel?.show(onPage);
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

function sameRect(a: Box, b: Box): boolean {
  return a.left === b.left && a.top === b.top &&
         a.width === b.width && a.height === b.height;
}

/**
 * Re-measure what is on screen every frame, while the tool is open.
 *
 * Scroll and resize events don't cover it: an element can move because a
 * transition ran, an image loaded, or a framework re-rendered, none of which
 * fire anything we can listen for. Without this the outline stays where the
 * element used to be, which on a measuring tool is the worst possible failure.
 *
 * It also drops anything that has left the document. A locked element removed
 * by a route change otherwise collapses to a 0x0 box at the origin and the
 * tool goes on measuring distances to that phantom.
 *
 * Cost is one getBoundingClientRect per live box per frame, and only while
 * open. Nothing is redrawn unless something actually moved.
 */
/**
 * The last scroll offset drawn at. Guides are anchored to the page, so they
 * move on screen whenever the page scrolls — but nothing else here notices.
 * A sticky element under the cursor keeps its rect through a scroll, so the
 * box comparison below reports no movement and the guides freeze mid-page.
 */
let drawnAtX = 0;
let drawnAtY = 0;

function watch() {
  watching = requestAnimationFrame(watch);

  const live = pinned.filter((b) => b.el.isConnected);
  const next = live.map((b) => boxOf(b.el));
  const nextHover = hover && hover.el.isConnected ? boxOf(hover.el) : null;

  const scrolled = scrollX !== drawnAtX || scrollY !== drawnAtY;
  const moved =
    scrolled ||
    next.length !== pinned.length ||
    next.some((b, i) => !sameRect(b, pinned[i]!)) ||
    (hover === null) !== (nextHover === null) ||
    (hover !== null && nextHover !== null && !sameRect(hover, nextHover));
  if (!moved) return;

  drawnAtX = scrollX;
  drawnAtY = scrollY;
  pinned = next;
  hover = nextHover;
  const last = pinned[pinned.length - 1];
  if (last) boxmodel?.show(last); else boxmodel?.hide();
  render();
}

/** The canvas has to be refitted on resize; the boxes are handled by watch(). */
function onViewportChange() {
  overlay?.resize();
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
  addEventListener('mouseup', onMouseUp, { capture: true });
  addEventListener('click', onClick, { capture: true });
  addEventListener('auxclick', onAuxClick, { capture: true });
  addEventListener('contextmenu', onContextMenu, { capture: true });
  addEventListener('resize', onViewportChange);
  watching = requestAnimationFrame(watch);
  // Draw once on open: rulers and guides are sticky, and watch() only redraws
  // when something moves, so without this they stay invisible until the first
  // mouse move.
  render();
}

function deactivate() {
  removeEventListener('mousemove', onMouseMove);
  removeEventListener('mousedown', onMouseDown, { capture: true });
  removeEventListener('mouseup', onMouseUp, { capture: true });
  removeEventListener('click', onClick, { capture: true });
  removeEventListener('auxclick', onAuxClick, { capture: true });
  removeEventListener('contextmenu', onContextMenu, { capture: true });
  removeEventListener('resize', onViewportChange);
  cancelAnimationFrame(watching);
  watching = 0;
  indicator?.destroy();
  indicator = null;
  boxmodel?.destroy();
  boxmodel = null;
  overlay?.destroy();
  overlay = null;
  unloadFont();
  hover = null;
  pinned = [];
  dragging = null;
  grabFrom = null;
  hoverGuide = null;
}

function onKey(e: KeyboardEvent) {
  if (matchesHotkey(e)) {
    e.preventDefault();
    overlay ? deactivate() : activate();
  } else if (overlay && cursorAt && (e.key.toLowerCase() === cfg.guideKeys.vertical
                                  || e.key.toLowerCase() === cfg.guideKeys.horizontal)) {
    e.preventDefault();
    const axis = e.key.toLowerCase() === cfg.guideKeys.vertical ? 'x' : 'y';
    addGuide(axis, cursorAt.x, cursorAt.y, e.altKey);
    render();
  } else if (overlay && (e.key === 'Delete' || e.key === 'Backspace')) {
    e.preventDefault();
    if (e.shiftKey) guides = [];
    else if (hoverGuide) removeGuide(hoverGuide);
    render();
  } else if (overlay && e.key.toLowerCase() === cfg.rulerKey) {
    e.preventDefault();
    rulers = !rulers;
    render();
  } else if (overlay && e.key.toLowerCase() === cfg.panelKey) {
    // A plain letter is safe here: while the tool is on it swallows clicks, so
    // nothing on the page can hold focus and receive the keystroke instead.
    e.preventDefault();
    boxmodel?.toggle();
  } else if (e.key === 'Escape' && overlay) {
    // Escape dismisses the topmost thing first: help, then the locks, then the
    // tool itself.
    if (indicator?.closeHelp()) return;
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
