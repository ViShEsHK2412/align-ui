import { createBoxModel, type BoxModel } from './boxmodel';
import { createHistory } from './history';
import { mergeConfig, type Config } from './config';
import { createIndicator, type Indicator, type ToolName } from './indicator';
import {
  boxOf, chainPairs, gapSegments, guideGapSegments, guideSegments, guideUnder, hitTest,
  snapCandidates, snapTo,
} from './measure';
import { mountOverlay, type Overlay } from './overlay';
import { loadFont, unloadFont } from './theme';
import { describeGap, gapFactOf } from './inspect';
import { createPicker, type Picker } from './picker';
import { isFrozen, setFrozen } from './freeze';
import { setXray } from './xray';
import { loadFlag, loadGuides, saveFlag, saveGuides } from './store';
import type { GapLine } from './boxmodel';
import type { Box, Guide, Segment } from './types';

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
let picker: Picker | null = null;
/** X-ray is the one thing that writes to the page, so it is tracked here. */
let xray = false;
let grid = loadFlag('grid');
let pixels = loadFlag('pixels');
let hover: Box | null = null;
let pinned: Box[] = [];
let watching = 0;
/** Sticky across open and close, like the panel's position. */
let rulers = loadFlag('rulers');
/** Guides live for the session: across toggling, gone on reload. */
let guides: Guide[] = [];
let nextGuideId = 1;
/** Stored guides are read once, on first open — not at import. */
let restored = false;
/**
 * The guide the keyboard is pointing at: whichever was last clicked or dragged.
 *
 * Nudging cannot target "the guide under the cursor", because ten presses move
 * it out of grab range and the keyboard loses hold of the thing it is moving.
 * This is not a selection model — clicking a guide already did something, and
 * this gives the keyboard reach to the thing you just clicked.
 */
let activeGuideId: number | null = null;
/**
 * Undo, over every change to the guides rather than only deletions.
 *
 * It began as one slot holding the last thing deleted, because Shift+Del can
 * wipe an afternoon's work in one keystroke. But a guide nudged eight pixels
 * off its snap is lost just as thoroughly as a deleted one, and there was no
 * way back from it at all.
 */
const history = createHistory<Guide>();

/**
 * The guide list as it stands, safe to keep. Guides are mutated in place while
 * dragging and nudging, so a snapshot has to copy each one — holding the array
 * alone would leave history pointing at objects that keep changing under it.
 */
function snapshot(): Guide[] {
  return guides.map((g) => ({ ...g }));
}

/**
 * Record where we are before changing it. An empty tag is a one-off; a tag
 * shared with the change before it continues that gesture instead of starting
 * a new one.
 */
function record(tag = ''): void {
  history.push(snapshot(), tag);
}

function activeGuide(): Guide | null {
  return guides.find((g) => g.id === activeGuideId) ?? null;
}

/**
 * Every path that changes the guide list funnels through here, so nothing can
 * quietly change them without the change surviving a reload.
 */
function setGuides(next: Guide[]): void {
  guides = next;
  saveGuides(guides);
}
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

/**
 * Whether this gesture asked to ignore snapping.
 *
 * Ctrl in Figma, on both platforms; GuideFrame takes either Ctrl or Cmd.
 * We take either too, because Ctrl-click is a secondary click on macOS and
 * a Mac user reaches for Cmd. This used to be Alt, which is the wrong key
 * to overload: Alt is Figma's duplicate-drag.
 */
function free(e: { ctrlKey: boolean; metaKey: boolean }): boolean {
  return e.ctrlKey || e.metaKey;
}

/** Place a guide, pulling it onto a nearby candidate unless asked not to. */
function placeGuide(g: Guide, x: number, y: number, free: boolean) {
  const under = hitTest(x, y, cfg);
  const viewport = g.axis === 'x' ? x : y;
  // Every guide but this one: a guide cannot usefully snap to itself.
  const others = guides
    .filter((o) => o.id !== g.id)
    .map((o) => ({ axis: o.axis, at: viewportGuide(o).pos }));
  const snapped = snapTo(viewport, snapCandidates(under, g.axis, others), free);
  g.at = snapped.at + (g.axis === 'x' ? scrollX : scrollY);
  g.caught = snapped.what;
}

function addGuide(axis: 'x' | 'y', x: number, y: number, free: boolean): Guide {
  const g: Guide = { id: nextGuideId++, axis, at: 0, locked: false, caught: '', pinned: false };
  record();
  placeGuide(g, x, y, free);
  setGuides([...guides, g]);
  // A guide you just put down is the one the keyboard should be holding.
  // Without this a guide dropped with V or H could not be nudged at all until
  // it had been clicked, which is a strange thing to have to do to something
  // you placed a moment ago.
  activeGuideId = g.id;
  return g;
}

function removeGuide(g: Guide) {
  if (g.pinned) return;              // pinned guides are not deletable either
  record();
  setGuides(guides.filter((o) => o.id !== g.id));
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

/**
 * Every gap inside the locked set, accounted for. Only the caller knows which
 * boxes are paired, so the panel is handed the answer rather than the boxes.
 */
/**
 * The lock before the newest one, which is what the newest is compared with.
 * Undefined until there are two, because a diff needs something to diff against.
 */
function previousLock(): Box | undefined {
  return pinned.length >= 2 ? pinned[pinned.length - 2] : undefined;
}

function gapFacts(): GapLine[] {
  if (pinned.length < 2) return [];
  const out: GapLine[] = [];
  for (const [a, b] of chainPairs(pinned)) {
    for (const seg of gapSegments(a, b)) {
      if (seg.extension || !seg.label) continue;
      const f = gapFactOf(a.el, b.el, parseFloat(seg.label), seg.axis);
      out.push({ px: f.px, detail: describeGap(f) });
    }
  }
  return out;
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

  // What the pointer is asking about. Four elements measured at once put four
  // answers on screen; pointing at one of them, or at a ruler, brings its own
  // measurements forward and steps the rest back. Anchored on the element or
  // the guide rather than on the thin line itself, which is unhittable in
  // exactly the pile-up this is for.
  const focusEl = !onGuide && locked ? hover!.el : null;
  const focus = onGuide ?? focusEl;
  const gp = onGuide ? viewportGuide(onGuide) : null;

  const lines: Segment[] = [];
  /** Add these, dimmed unless they are what is being asked about. */
  const add = (segs: Segment[], owns: boolean) => {
    for (const seg of segs) lines.push(focus && !owns ? { ...seg, faded: true } : seg);
  };
  /** Does this ruler-to-ruler gap run to the guide under the cursor? */
  const touchesFocus = (seg: Segment) => {
    if (!gp || seg.axis !== gp.axis) return false;
    const ends = seg.axis === 'x' ? [seg.x1, seg.x2] : [seg.y1, seg.y2];
    return ends.some((e) => Math.abs(e - gp.pos) < 0.5);
  };

  // Gaps within the locked set, then from the newest lock to what you're
  // pointing at — measuring to something already locked would be noise.
  for (const [a, b] of chainPairs(pinned)) {
    add(gapSegments(a, b), a.el === focusEl || b.el === focusEl);
  }
  if (last && hover && !locked && !onGuide) add(gapSegments(last, hover), true);
  // From every locked box to each guide that is asking.
  for (const g of measuring) {
    for (const b of pinned) {
      add(guideSegments(b, [viewportGuide(g)]), g.id === onGuide?.id || b.el === focusEl);
    }
  }
  // And from whatever you are pointing at to the nearest guide each way —
  // unless it is locked, in which case the rulers above already measured it,
  // and doing it again draws the same number twice in the same place.
  if (hover && !locked && !onGuide && guides.length) add(guideSegments(hover, at), true);
  // Two rulers are a measurement on their own, with no element involved.
  for (const seg of guideGapSegments(measuring.map(viewportGuide),
    { x: innerWidth / 2, y: innerHeight / 2 })) {
    add([seg], touchesFocus(seg));
  }

  overlay?.update({
    hover,
    pinned,
    rulers,
    grid: grid && cfg.grid ? cfg.grid : null,
    pixels,
    guides,
    liveGuide: dragging ?? hoverGuide,
    activeGuide: activeGuideId,
    lines,
    ...(cursor ? { cursor } : {}),
  });
  indicator?.update(pinned.length, {
    rulers,
    xray,
    grid,
    pixels,
    freeze: isFrozen(),
    type: boxmodel?.showsType() ?? false,
    // Copy reads the panel, which needs something locked; undo needs a history.
    canCopy: pinned.length > 0,
    canUndo: history.depth() > 0,
    panel: boxmodel?.isOpen() ?? false,
  });
}

/**
 * What a toolbar button does. Every one of these has a key too, and both paths
 * end here so the two can never drift apart.
 */
function copyReading(): void {
  // The numbers are this tool's output; retyping them was the only way out.
  const text = boxmodel?.asText() ?? '';
  // Nothing locked is not a failure, but it is not a copy either, and a button
  // that reports success for having done nothing is worse than a silent one.
  if (!text) return;
  const say = (ok: boolean) => indicator?.acknowledge('copy', ok);
  const write = navigator.clipboard?.writeText(text);
  if (write) write.then(() => say(true), () => say(false));
  else say(false);
}

/** Two guide lists that would draw identically. Order is stable, so index-wise. */
function sameGuides(a: Guide[], b: Guide[]): boolean {
  return a.length === b.length && a.every((g, i) => {
    const o = b[i]!;
    return g.id === o.id && g.axis === o.axis && g.at === o.at
      && g.locked === o.locked && g.pinned === o.pinned;
  });
}

function undo(): void {
  // Skip anything that would restore what is already on screen. Guarding the
  // call sites catches the no-ops we know about; this catches the rest, and it
  // cannot skip a real entry -- an entry identical to the present is one whose
  // restoration you could not see.
  while (history.depth() > 0 && sameGuides(history.peek()!, guides)) history.pop();
  const before = history.pop();
  if (!before) return;
  setGuides(before);
  // Whatever the pointer and the keyboard were holding may no longer exist, or
  // may have come back at a different place. Let go of all of it rather than
  // keep a reference into a list that has been replaced.
  hoverGuide = null;
  dragging = null;
  grabFrom = null;
  if (!before.some((g) => g.id === activeGuideId)) activeGuideId = null;
}

/**
 * Every tool, from either direction.
 *
 * The keyboard and the buttons must come through here, and for a while some
 * keys did not: they toggled the thing and skipped the render, so the toolbar
 * went on showing the old state. On x-ray and the panel you could not tell,
 * because the page itself changed and answered the question. On T there is
 * nothing else to look at, so pressing it did nothing observable whatsoever
 * and the feature read as broken.
 */
function onTool(name: ToolName): void {
  switch (name) {
    case 'rulers': rulers = !rulers; saveFlag('rulers', rulers); break;
    case 'xray': xray = !xray; setXray(xray); break;
    case 'grid': grid = !grid; saveFlag('grid', grid); break;
    case 'pixels': pixels = !pixels; saveFlag('pixels', pixels); break;
    case 'freeze': setFrozen(!isFrozen()); break;
    case 'type': boxmodel?.toggleType(); break;
    case 'panel': boxmodel?.toggle(); break;
    case 'copy': copyReading(); break;
    case 'pick': void picker?.open(); break;
    case 'undo': undo(); break;
  }
  render();
}

/** The keyboard needs to know where the pointer is to drop a guide there. */
let cursorAt: { x: number; y: number } | null = null;

function onMouseMove(e: MouseEvent) {
  cursorAt = { x: e.clientX, y: e.clientY };
  if (dragging) {
    if (grabFrom && Math.hypot(e.clientX - grabFrom.x, e.clientY - grabFrom.y) > CLICK_SLOP) {
      grabFrom = null;     // travelled: this is a drag now, and stays one
    }
    if (!grabFrom && !dragging.pinned) {
      placeGuide(dragging, e.clientX, e.clientY, free(e));
      setGuides([...guides]);
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
    activeGuideId = dragging.id;
    setGuides([...guides]);
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
    dragging = addGuide(fromRuler, e.clientX, e.clientY, free(e));
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  const grabbed = guideUnder(guides, e.clientX, e.clientY);
  if (grabbed) {
    swallow(e);
    // One entry for the whole press, whether it turns out to be a drag or the
    // click that toggles the lock. The moves in between record nothing.
    record();
    activeGuideId = grabbed.id;
    // A pinned guide still takes focus and still clicks, it just cannot travel.
    dragging = grabbed;
    grabFrom = { x: e.clientX, y: e.clientY };
    render({ x: e.clientX, y: e.clientY });
    return;
  }

  swallow(e);
  indicator?.closeHelp();
  pinned = [onPage];
  hover = onPage;
  boxmodel?.show(onPage, gapFacts(), previousLock());
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
  if (last) boxmodel?.show(last, gapFacts(), previousLock()); else boxmodel?.hide();
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
  // The canvas has to be redrawn on every scroll frame; the panel almost never
  // does. Nothing it shows depends on where the page is scrolled to — sizes,
  // bands, tokens, rules and the gaps between locked boxes are all unchanged by
  // a scroll — and rebuilding it anyway costs a CSSOM walk, a custom-property
  // enumeration and a diff every frame, for identical output.
  const sig = panelSignature();
  if (sig !== panelSig) {
    panelSig = sig;
    if (last) boxmodel?.show(last, gapFacts(), previousLock()); else boxmodel?.hide();
  }
  render();
}

/**
 * What the panel is showing, as a string, so an unchanged reading can be left
 * alone. Sizes and *relative* positions, never absolute ones: a scroll moves
 * every box by the same amount and changes nothing you can read.
 */
let panelSig = '';
function panelSignature(): string {
  const first = pinned[0];
  if (!first) return '';
  return pinned
    .map((b) => [
      b.label, Math.round(b.width * 100), Math.round(b.height * 100),
      Math.round((b.left - first.left) * 100), Math.round((b.top - first.top) * 100),
    ].join(','))
    .join(';');
}

/** The canvas has to be refitted on resize; the boxes are handled by watch(). */
function onViewportChange() {
  overlay?.resize();
}

function activate() {
  // Deferred to here so an unopened tool touches no storage at all, and so the
  // ids come from a counter that is certainly initialised by now.
  if (!restored) {
    restored = true;
    guides = loadGuides().map((g) => ({ ...g, id: nextGuideId++ }));
  }
  if (overlay) return;
  // Loaded here rather than at init, so the tool still costs nothing at rest.
  loadFont();
  overlay = mountOverlay();
  boxmodel = createBoxModel(overlay.root);
  indicator = createIndicator(overlay.root, onTool);
  picker = createPicker(overlay.root);
  indicator.update(0, {
    rulers, xray, grid, pixels, freeze: isFrozen(), type: false, panel: false,
    canCopy: false, canUndo: false,
  });
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
  picker?.destroy();
  picker = null;
  // Never leave the page outlined because the tool was closed while x-ray was on.
  if (xray) { xray = false; setXray(false); }
  setFrozen(false);
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
    addGuide(axis, cursorAt.x, cursorAt.y, free(e));
    render();
  } else if (overlay && (e.key === 'Delete' || e.key === 'Backspace')) {
    e.preventDefault();
    if (e.shiftKey) {
      // Clearing the lot has to forget the one under the cursor too, or the
      // overlay keeps drawing a position chip for a guide that is gone.
      //
      // Only if there is something to clear. A wipe with nothing deletable --
      // no guides, or every one of them pinned -- used to record an undo entry
      // anyway, so five of them meant five presses of Ctrl+Z that did nothing
      // before the sixth did something. That is the exact failure undo exists
      // to avoid.
      if (guides.some((g) => !g.pinned)) record();
      setGuides(guides.filter((g) => g.pinned));
      hoverGuide = null;
      dragging = null;
      grabFrom = null;
      // Only if the keyboard's guide was actually one of the ones taken — a
      // pinned guide survives the wipe and should keep the keyboard with it.
      if (!guides.some((g) => g.id === activeGuideId)) activeGuideId = null;
    } else if (hoverGuide) removeGuide(hoverGuide);
    render();
  } else if (overlay && e.key.startsWith('Arrow')) {
    // Arrows move the guide the keyboard is pointing at. Horizontal keys move
    // vertical guides and vice versa: you push the line, not the axis it names.
    const g = activeGuide();
    const wants = e.key === 'ArrowLeft' || e.key === 'ArrowRight' ? 'x' : 'y';
    if (!g || g.axis !== wants) return;
    e.preventDefault();
    if (g.pinned) return;
    // A held arrow key is one gesture however many times it repeats, so the
    // whole run shares a tag and collapses to a single step.
    record(`nudge:${g.id}`);
    const step = e.shiftKey ? 10 : 1;
    g.at += (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -step : step;
    // Nudged by hand, so whatever it had snapped to is no longer what it is on.
    g.caught = '';
    setGuides([...guides]);
    render();
  } else if (overlay && e.key.toLowerCase() === 'g') {
    e.preventDefault();
    onTool('grid');
    return;
  } else if (overlay && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    onTool('pixels');
    return;
  } else if (overlay && e.key.toLowerCase() === 'f') {
    // Hold the page still. Everything worth measuring that moves — a hover, a
    // dropdown mid-open, a skeleton — is unmeasurable until this exists.
    e.preventDefault();
    onTool('freeze');
    return;
  } else if (overlay && e.key.toLowerCase() === 'x') {
    e.preventDefault();
    onTool('xray');
    return;
  } else if (overlay && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    onTool('pick');
    return;
  } else if (overlay && e.key.toLowerCase() === 't') {
    e.preventDefault();
    onTool('type');
    return;
  } else if (overlay && e.key.toLowerCase() === 'c') {
    // The numbers are this tool's output; retyping them was the only way out.
    e.preventDefault();
    onTool('copy');
    return;
  } else if (overlay && e.key.toLowerCase() === 'l') {
    // Pin the guide the keyboard is pointing at: still selectable, still
    // measuring, but no longer draggable or deletable by accident.
    const g = activeGuide();
    if (!g) return;
    e.preventDefault();
    record();
    g.pinned = !g.pinned;
    setGuides([...guides]);
    render();
  } else if (overlay && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    if (history.depth() === 0) return;
    e.preventDefault();
    onTool('undo');
    return;
  } else if (overlay && e.key.toLowerCase() === cfg.rulerKey) {
    e.preventDefault();
    onTool('rulers');
    return;
  } else if (overlay && e.key.toLowerCase() === cfg.panelKey) {
    // A plain letter is safe here: while the tool is on it swallows clicks, so
    // nothing on the page can hold focus and receive the keystroke instead.
    e.preventDefault();
    onTool('panel');
    return;
  } else if (e.key === 'Escape' && overlay) {
    // Escape dismisses the topmost thing first: help, then the locks, then the
    // tool itself.
    if (picker?.close()) return;
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
