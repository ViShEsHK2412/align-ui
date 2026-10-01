import { createBoxModel, type BoxModel } from './boxmodel';
import { createHistory } from './history';
import { mergeConfig, skipSelector, type Config } from './config';
import { analyze, scaleFrom, type LintResult } from './lint';
import { collectLintBoxes } from './lint-dom';
import { contentBoxes, gridShapes, normalizeGrids, type GridLayer } from './grid';
import {
  clearAxis, dragGroup, duplicate, guidesIn, prune, removeSelected, shift, toggle,
} from './guide-select';
import type { GridDraw } from './overlay';
import { CLOSED, createToolsReporter, featureOn, resolvePortal, type Feature, type ToolsState } from './api';
import { createIndicator, type Indicator, type ToolName } from './indicator';
import { createControls, type Controls } from './controls';
import { createNoteBoard, type NoteBoard } from './noteboard';
import { createEditor, type Editor } from './edit';
import {
  boxOf, chainPairs, gapSegments, guideGapSegments, guideSegments, guideUnder, hitTest,
  snapCandidates, snapTo,
} from './measure';
import { mountOverlay, type Overlay } from './overlay';
import { forceTheme, loadFont, unloadFont } from './theme';
import { describeGap, gapFactOf, tokensInScope } from './inspect';
import { createPicker, type Picker } from './picker';
import { isFrozen, setFrozen } from './freeze';
import { setXray } from './xray';
import { loadFlag, loadGuides, saveFlag, saveGuides, useStorage } from './store';
import type { GapLine } from './boxmodel';
import type { Box, Guide, Segment } from './types';

/**
 * Public API, state machine, hotkeys, lifecycle. The only module that touches
 * window globals or import.meta.hot.
 */

export type { Box, Bands, Segment } from './types';
export type { Config } from './config';
export type { Feature, Features, PortalTarget, ToolsState } from './api';
export type { GridConfig, GridLayer } from './grid';
export type { CaptureFrame } from './capture';

declare global {
  interface Window { __align?: boolean }
  interface WindowEventMap { 'align:tools': CustomEvent<ToolsState> }
}

let cfg: Config;
let overlay: Overlay | null = null;
let boxmodel: BoxModel | null = null;
let indicator: Indicator | null = null;
let picker: Picker | null = null;
let controls: Controls | null = null;
let noteboard: NoteBoard | null = null;
/**
 * The one thing here that outlives a session rather than a mount.
 *
 * Created once and never torn down, because it holds the record of what the
 * tool changed. A `null`-until-mounted editor would lose that record on
 * deactivate, which is the exact moment it is needed: `teardown` disarms, and
 * disarming is what puts the page back.
 */
const editor: Editor = createEditor();
/** X-ray is the one thing that writes to the page, so it is tracked here. */
let xray = false;
/** Read in initAlign, once the config has said which storage to read. */
let grid = false;
let pixels = false;
let hover: Box | null = null;
let pinned: Box[] = [];
let watching = 0;
/** Sticky across open and close, like the panel's position. */
let rulers = false;
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
 * The guides that move, nudge and delete together. Always holds the active
 * guide when there is one; Shift-click and a Shift-drag marquee add to it.
 */
let selection = new Set<number>();
function selectOnly(id: number | null): void {
  activeGuideId = id;
  selection = id === null ? new Set() : new Set([id]);
}
/** After anything that can remove guides: forget the ids that are gone. */
function settleSelection(): void {
  selection = prune(selection, guides);
  if (!guides.some((g) => g.id === activeGuideId)) activeGuideId = [...selection].pop() ?? null;
  if (hoverGuide && !guides.some((g) => g.id === hoverGuide!.id)) hoverGuide = null;
}
/**
 * Everything drawn, held back for a moment. Not persisted: a tool that reopens
 * showing nothing looks broken, which is the same argument the modes make.
 */
let hidden = false;

/** Whether the config left this tool in. Everything is, unless named off. */
function on(name: Feature | ToolName): boolean {
  return featureOn(cfg.features, name);
}

/** The host's view of the tool, reported only when it changes. */
const reportTools = createToolsReporter(() => cfg?.onToolsChange);
function toolsState(): ToolsState {
  return {
    open: overlay !== null,
    locked: pinned.length,
    guides: guides.length,
    notes: noteboard?.count() ?? 0,
    rulers, xray, grid, pixels, lint,
    type: boxmodel?.showsType() ?? false,
    panel: boxmodel?.isOpen() ?? false,
    hide: hidden,
    freeze: isFrozen(),
    edit: editor.armed,
    noting: noteboard?.mode() ?? false,
  };
}

/**
 * The layout grids, laid out fresh for each frame drawn.
 *
 * The page's grids are anchored to the document, so rows and baselines scroll
 * with it; columns are centred in the layout viewport, not `innerWidth`,
 * because a classic scrollbar takes width from what the browser centres in.
 * A scoped grid is drawn in the content box of every element its selector
 * matches, wherever that element is this frame.
 */
let gridLayers: GridLayer[] | null = null;
function layers(): GridLayer[] {
  return (gridLayers ??= normalizeGrids(cfg.grid));
}
function gridDraw(): GridDraw[] | null {
  const list = layers();
  if (!list.length) return null;
  const root = document.documentElement;
  const page = { x: 0, y: -scrollY, w: root.clientWidth, h: Math.max(root.scrollHeight, innerHeight) };
  const view = { top: 0, bottom: innerHeight };
  return list.map((layer) => {
    const out: GridDraw = { fills: [], lines: [] };
    if (layer.color) out.color = layer.color;
    for (const area of layer.selector ? contentBoxes(layer.selector) : [page]) {
      const s = gridShapes(layer, area, view);
      out.fills.push(...s.fills);
      out.lines.push(...s.lines);
    }
    return out;
  });
}
/** Where the scoped grids' elements were last drawn, to notice them move without a scroll. */
let scopedAt = '';
function scopedSignature(): string {
  if (!grid) return '';
  let sig = '';
  for (const layer of layers()) {
    if (!layer.selector) continue;
    for (const r of contentBoxes(layer.selector)) sig += `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.w)},${Math.round(r.h)};`;
    sig += '|';
  }
  return sig;
}

/**
 * The spacing lint. A mode like x-ray, so off on every open.
 *
 * Scanned, not drawn from live geometry each frame: a scan reads a computed
 * style per container, which is cheap once and wasteful sixty times a second.
 * It re-runs when something could have changed the answer — the page
 * scrolled, resized, or changed — and between scans the bands are shifted by
 * the scroll so they never lag behind the spacing they describe.
 */
let lint = false;
let lintResult: LintResult | null = null;
let lintAt = { x: 0, y: 0 };
let lintTimer: ReturnType<typeof setTimeout> | undefined;
let lintObserver: MutationObserver | null = null;

function scanLint(): void {
  lintTimer = undefined;
  if (!lint || !overlay) return;
  const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const scale = scaleFrom(tokensInScope(document.documentElement), cfg.lint, rootFont);
  lintResult = analyze(collectLintBoxes(skipSelector(cfg)), scale, cfg.lint);
  lintAt = { x: scrollX, y: scrollY };
  render();
}

/** Coalesce a burst of changes — a scroll, a typed value, an animation — into one scan. */
function queueLint(): void {
  if (!lint || lintTimer !== undefined) return;
  lintTimer = setTimeout(scanLint, 150);
}

function setLint(on: boolean): void {
  lint = on;
  clearTimeout(lintTimer);
  lintTimer = undefined;
  lintObserver?.disconnect();
  lintObserver = null;
  removeEventListener('scroll', queueLint, true);
  if (!on) { lintResult = null; return; }
  /*
   * Body, not the document: the tool's own UI hangs off <html>, so nothing it
   * does to itself can trigger a rescan of the page. Edits made in edit mode
   * are inline styles on page elements, and do — which is the point: the
   * hatching updates as you drag a padding slider onto the scale.
   */
  lintObserver = new MutationObserver(queueLint);
  if (document.body) {
    lintObserver.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
  }
  addEventListener('scroll', queueLint, { capture: true, passive: true });
  scanLint();
}
/*
 * True while a pointer is down on one of our own controls.
 *
 * Only the lock outline reads this. A press inside the panel means a value is
 * about to move, and during that you are looking at the element rather than
 * hunting for which one is selected.
 */
let dimLock = false;
let undim: ReturnType<typeof setTimeout> | undefined;
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
/**
 * A drag of several guides: where each selected guide started, where the
 * pointer started, and whether the guides being dragged are fresh copies.
 */
let group: { from: Map<number, number>; x: number; y: number; copies: boolean } | null = null;
/** A Shift-drag on the page, selecting every guide it crosses. */
let marquee: { x0: number; y0: number; x1: number; y1: number; target: Box } | null = null;
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
function placeGuide(g: Guide, x: number, y: number, free: boolean, moving?: ReadonlySet<number>) {
  const under = hitTest(x, y, cfg);
  const viewport = g.axis === 'x' ? x : y;
  // Every guide but this one: a guide cannot usefully snap to itself, nor to
  // the others in a group dragged with it, which move as it does.
  const others = guides
    .filter((o) => o.id !== g.id && !moving?.has(o.id))
    .map((o) => ({ axis: o.axis, at: viewportGuide(o).pos }));
  const snapped = snapTo(viewport, snapCandidates(under, g.axis, others), free);
  g.at = snapped.at + (g.axis === 'x' ? scrollX : scrollY);
  g.caught = snapped.what;
}

function addGuide(axis: 'x' | 'y', x: number, y: number, free: boolean): Guide {
  const g: Guide = { id: nextGuideId++, axis, at: 0, locked: false, caught: '', pinned: false };
  placeGuide(g, x, y, free);

  // Guides snap to other guides, so asking for one anywhere within the snap
  // tolerance of an existing one lands exactly on top of it. Two guides in the
  // same place are indistinguishable, and deleting one then looks like the
  // delete did nothing. You asked for a guide here and there is one: hand the
  // keyboard that one rather than stacking a second behind it.
  const twin = guides.find((o) => o.axis === g.axis && Math.abs(o.at - g.at) < 0.5);
  if (twin) {
    selectOnly(twin.id);
    return twin;
  }

  record();
  setGuides([...guides, g]);
  // A guide you just put down is the one the keyboard should be holding.
  // Without this a guide dropped with V or H could not be nudged at all until
  // it had been clicked, which is a strange thing to have to do to something
  // you placed a moment ago.
  selectOnly(g.id);
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
    hidden,
    dimLock,
    grid: grid ? gridDraw() : null,
    lint: lint && lintResult
      ? { bands: lintResult.bands, dx: lintAt.x - scrollX, dy: lintAt.y - scrollY }
      : null,
    pixels,
    guides,
    liveGuide: dragging ?? hoverGuide,
    activeGuide: activeGuideId,
    selectedGuides: [...selection],
    marquee: marquee
      ? { x: Math.min(marquee.x0, marquee.x1), y: Math.min(marquee.y0, marquee.y1),
        w: Math.abs(marquee.x1 - marquee.x0), h: Math.abs(marquee.y1 - marquee.y0) }
      : null,
    lines,
    ...(cursor ? { cursor } : {}),
  });
  indicator?.update(pinned.length, {
    edit: editor.armed,
    notes: noteboard?.mode() ?? false,
    lint,
    lintIssues: lintResult?.issues ?? 0,
    rulers,
    xray,
    grid,
    pixels,
    freeze: isFrozen(),
    type: boxmodel?.showsType() ?? false,
    hide: hidden,
    // Copy reads the panel, which needs something locked; undo needs a history.
    canCopy: pinned.length > 0,
    canUndo: history.depth() > 0,
    panel: boxmodel?.isOpen() ?? false,
  });
  reportTools(toolsState());
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
  group = null;
  marquee = null;
  settleSelection();
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
  // Switched off in the config: the button is not there, and the key is not either.
  if (!on(name)) return;
  switch (name) {
    case 'rulers': rulers = !rulers; saveFlag('rulers', rulers); break;
    case 'xray': xray = !xray; setXray(xray); break;
    case 'grid': grid = !grid; saveFlag('grid', grid); break;
    case 'pixels': pixels = !pixels; saveFlag('pixels', pixels); break;
    case 'freeze': setFrozen(!isFrozen()); break;
    case 'type': boxmodel?.toggleType(); break;
    case 'panel': boxmodel?.toggle(); break;
    case 'hide':
      hidden = !hidden;
      boxmodel?.setHidden(hidden || !on('panel'));
      if (hidden) picker?.close();
      break;
    case 'copy': copyReading(); break;
    case 'pick': void picker?.open(); break;
    /*
     * Arming and disarming, and disarming puts everything back.
     *
     * The count goes to the button's own acknowledgement rather than a toast,
     * because "12 changes reverted" is the answer to the question you asked by
     * pressing it, and it has to arrive where you were looking.
     */
    case 'edit':
      if (editor.armed) {
        const reverted = editor.disarm();
        indicator?.acknowledge('edit', reverted >= 0);
      } else {
        editor.arm();
      }
      controls?.setArmed(editor.armed);
      // The box model is reading numbers the editor may just have put back, so
      // it has to be told rather than left showing the state before the revert.
      if (pinned.length) render();
      break;
    case 'notes': noteboard?.setMode(!noteboard.mode()); break;
    case 'lint': setLint(!lint); break;
    case 'undo': undo(); break;
  }
  render();
}

/** The keyboard needs to know where the pointer is to drop a guide there. */
let cursorAt: { x: number; y: number } | null = null;

function onMouseMove(e: MouseEvent) {
  cursorAt = { x: e.clientX, y: e.clientY };
  if (marquee) {
    marquee.x1 = e.clientX;
    marquee.y1 = e.clientY;
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  if (dragging) {
    if (grabFrom && Math.hypot(e.clientX - grabFrom.x, e.clientY - grabFrom.y) > CLICK_SLOP) {
      grabFrom = null;     // travelled: this is a drag now, and stays one
    }
    if (!grabFrom && !dragging.pinned) {
      const moving = group && selection.size > 1 ? selection : undefined;
      placeGuide(dragging, e.clientX, e.clientY, free(e), moving);
      setGuides(moving && group
        ? dragGroup(guides, selection, dragging.id, group.from, { x: e.clientX - group.x, y: e.clientY - group.y })
        : [...guides]);
    }
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  hoverGuide = guideUnder(guides, e.clientX, e.clientY);
  hover = hitTest(e.clientX, e.clientY, cfg);
  render({ x: e.clientX, y: e.clientY });
}

function onMouseUp(e: MouseEvent) {
  if (marquee) {
    const m = marquee;
    marquee = null;
    if (Math.hypot(m.x1 - m.x0, m.y1 - m.y0) > CLICK_SLOP) {
      const hit = guidesIn(guides, { x: m.x0, y: m.y0, w: m.x1 - m.x0, h: m.y1 - m.y0 }, { x: scrollX, y: scrollY });
      selection = new Set([...selection, ...hit]);
      if (hit.length) activeGuideId = hit[hit.length - 1]!;
    } else {
      // Shift held but never dragged: an ordinary click, which locks.
      lockOnly(m.target);
    }
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  if (!dragging) return;
  if (grabFrom) {
    if (group?.copies) {
      // Alt-pressed and let go in place: copies on top of their originals are
      // indistinguishable from them, so this was not a duplicate after all.
      undo();
    } else {
      // Pressed and released without going anywhere: a click, which locks the
      // guide so it keeps measuring after the pointer leaves. Click again to
      // let it go quiet. A click also narrows a selection to this one.
      dragging.locked = !dragging.locked;
      selectOnly(dragging.id);
      setGuides([...guides]);
    }
  } else if (inRuler(e.clientX, e.clientY) || e.clientX < RULER || e.clientY < RULER) {
    // Dropped back in a rule: that is how you throw a guide away, and a
    // dragged group goes with it. Recorded when the press began.
    setGuides(removeSelected(guides, selection.has(dragging.id) ? selection : new Set([dragging.id])));
    settleSelection();
  }
  grabFrom = null;
  dragging = null;
  group = null;
  render({ x: e.clientX, y: e.clientY });
}

/** Lock exactly this one, dropping whatever was locked before. */
/**
 * Did this event start inside the tool's own interface?
 *
 * `composedPath` is the reliable answer even through a closed shadow root: a
 * listener outside it sees the path from the host upward, so the host is in
 * the list exactly when the event came from within.
 *
 * The alternative — asking what is at those coordinates — is what was being
 * done, and it is wrong for a panel. `hitTest` skips our own UI and then
 * reports whatever is *underneath* it, so pressing a button in the edit panel
 * locked the page element behind the panel and changed what you were editing
 * mid-edit.
 */
function fromOurUI(e: Event): boolean {
  const host = overlay?.root.host;
  return host ? (e.composedPath?.() ?? []).includes(host) : false;
}

/**
 * Quieten the lock outline while a panel control is being worked.
 *
 * Capture, because a control inside the closed root stops the event before it
 * reaches the document in the bubble phase, and `composedPath` sees through
 * the root either way. The restore is held for a moment: a scrub is a run of
 * short presses, and an outline flickering back between each of them would be
 * worse than one that simply stays out of the way until you are done.
 */
/**
 * Pointer events, not mouse events.
 *
 * This hung off `onMouseDown` and never once fired for the gesture it exists
 * for. The sliders and the scrub badges call `preventDefault()` on their
 * `pointerdown`, and that suppresses the compatibility mouse events the
 * browser would otherwise synthesise - so `mousedown` simply never arrived
 * for a drag on a control. It worked only on the parts of the panel that do
 * not preventDefault, which is to say: not while dragging anything.
 *
 * Capture, and on window, because the scrub also calls `stopPropagation()`.
 * A capture listener has already run by the time the target can stop
 * anything, so this sees the press either way.
 */
function onPointerDownAny(e: PointerEvent): void {
  if (fromOurUI(e)) setDimLock(true);
}

function onPointerUpAny(): void {
  setDimLock(false);
}

function setDimLock(on: boolean): void {
  clearTimeout(undim);
  if (on) {
    if (dimLock) return;
    dimLock = true;
    render();
    return;
  }
  // Every release on the page reaches here, and almost none of them dimmed
  // anything. Without this the tool schedules a redraw 200ms after each one.
  if (!dimLock) return;
  undim = setTimeout(() => { dimLock = false; render(); }, 200);
}

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;
  if (fromOurUI(e)) return;

  // Our own panels sit over the page, and the box model's left edge overlaps
  // the left rule. hitTest returns null over our own UI, so bailing here keeps
  // a grab on the panel header from being read as a drag off the rule.
  const onPage = hitTest(e.clientX, e.clientY, cfg);
  if (!onPage) return;

  // Precedence, so the gestures never fight: a rule starts a new guide, a
  // guide under the cursor gets picked up, anything else locks an element.
  const fromRuler = inRuler(e.clientX, e.clientY);
  if (fromRuler && on('guides')) {
    swallow(e);
    grabFrom = null;
    dragging = addGuide(fromRuler, e.clientX, e.clientY, free(e));
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  const grabbed = guideUnder(guides, e.clientX, e.clientY);
  if (grabbed) {
    swallow(e);
    if (e.shiftKey) {
      // Shift-click adds a guide to the selection, or takes it out. Nothing
      // moves and nothing locks, so there is nothing to undo.
      selection = toggle(selection, grabbed.id);
      activeGuideId = selection.has(grabbed.id) ? grabbed.id : [...selection].pop() ?? null;
      render({ x: e.clientX, y: e.clientY });
      return;
    }
    // One entry for the whole press, whether it turns out to be a drag or the
    // click that toggles the lock. The moves in between record nothing.
    record();
    let target = grabbed;
    if (!selection.has(grabbed.id)) selectOnly(grabbed.id);
    else activeGuideId = grabbed.id;
    if (e.altKey) {
      // Alt-drag leaves the originals where they are and drags copies, as in
      // Figma. Every selected guide is copied when the grab is on one of them.
      const { copies, map } = duplicate(guides, selection, () => nextGuideId++);
      setGuides([...guides, ...copies]);
      selection = new Set(map.values());
      target = copies.find((c) => c.id === map.get(grabbed.id))!;
      activeGuideId = target.id;
    }
    group = {
      from: new Map(guides.filter((g) => selection.has(g.id)).map((g) => [g.id, g.at])),
      x: e.clientX, y: e.clientY, copies: e.altKey,
    };
    // A pinned guide still takes focus and still clicks, it just cannot travel.
    dragging = target;
    grabFrom = { x: e.clientX, y: e.clientY };
    render({ x: e.clientX, y: e.clientY });
    return;
  }

  swallow(e);
  if (e.shiftKey && guides.length) {
    // Shift-drag draws a marquee over guides. Whether it was a drag or a
    // click is only known on release, so the lock waits until then.
    marquee = { x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY, target: onPage };
    render({ x: e.clientX, y: e.clientY });
    return;
  }
  lockOnly(onPage);
  render({ x: e.clientX, y: e.clientY });
}

/** Lock exactly this element, as a plain click does. */
function lockOnly(onPage: Box): void {
  indicator?.closeHelp();
  pinned = [onPage];
  hover = onPage;
  boxmodel?.show(onPage, gapFacts(), previousLock());
  controls?.show(onPage.el);
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
  if (fromOurUI(e)) return;
  const hit = hitTest(e.clientX, e.clientY, cfg);
  if (!hit) return;
  swallow(e);
  indicator?.closeHelp();
  const at = pinned.findIndex((b) => b.el === hit.el);
  pinned = at >= 0 ? pinned.filter((_, i) => i !== at) : [...pinned, hit];

  hover = hit;
  const last = pinned[pinned.length - 1];
  if (last) boxmodel?.show(last, gapFacts(), previousLock()); else boxmodel?.hide();
  controls?.show(last?.el ?? null);
  render({ x: e.clientX, y: e.clientY });
}

/**
 * A link activates on `click`, not on `mousedown`, so preventing mousedown
 * alone still lets the page navigate out from under the tool — and lets
 * Chrome's modifier+click shortcuts fire. Both die here.
 */
function onClick(e: MouseEvent) {
  if (fromOurUI(e)) return;
  if (hitTest(e.clientX, e.clientY, cfg)) swallow(e);
}

/** Middle-click opens a new tab of its own accord. */
function onAuxClick(e: MouseEvent) {
  if (fromOurUI(e)) return;
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
  // A component with its own grid can move or resize without a scroll: an
  // accordion opening above it, a panel animating in.
  const scoped = scopedSignature();
  const gridMoved = scoped !== scopedAt;
  scopedAt = scoped;
  const moved =
    scrolled || gridMoved ||
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
  controls?.show(last?.el ?? null);
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
  queueLint();
  overlay?.resize();
}

function activate() {
  // Deferred to here so an unopened tool touches no storage at all, and so the
  // ids come from a counter that is certainly initialised by now.
  if (!restored) {
    restored = true;
    guides = on('guides') ? loadGuides().map((g) => ({ ...g, id: nextGuideId++ })) : [];
  }
  if (overlay) return;
  // Loaded here rather than at init, so the tool still costs nothing at rest.
  loadFont();
  overlay = mountOverlay(resolvePortal(cfg.portalTarget, document.documentElement));
  boxmodel = createBoxModel(overlay.root);
  if (!on('panel')) boxmodel.setHidden(true);
  indicator = createIndicator(overlay.root, onTool, on);
  controls = createControls(overlay.root, editor);
  noteboard = createNoteBoard({
    root: overlay.root,
    cfg,
    // Only what was changed on this element, so a note says what was tried on
    // the thing it is about and nothing from elsewhere on the page.
    changesFor: (el) => editor.changes()
      .filter((c) => c.el === el)
      .map(({ prop, from, to }) => ({ prop, from, to })),
    onChange: () => render(),
  });
  picker = createPicker(overlay.root);
  indicator.update(0, {
    rulers, xray, grid, pixels, freeze: isFrozen(), type: false, panel: false,
    hide: false, edit: false, notes: false, lint: false, lintIssues: 0, canCopy: false, canUndo: false,
  });
  addEventListener('pointerdown', onPointerDownAny, { capture: true });
  addEventListener('pointerup', onPointerUpAny, { capture: true });
  addEventListener('pointercancel', onPointerUpAny, { capture: true });
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
  removeEventListener('pointerdown', onPointerDownAny, { capture: true });
  removeEventListener('pointerup', onPointerUpAny, { capture: true });
  removeEventListener('pointercancel', onPointerUpAny, { capture: true });
  removeEventListener('resize', onViewportChange);
  // A pending restore must not fire into an overlay that is already gone.
  clearTimeout(undim);
  dimLock = false;
  cancelAnimationFrame(watching);
  watching = 0;
  indicator?.destroy();
  controls?.destroy();
  controls = null;
  noteboard?.destroy();
  setLint(false);
  noteboard = null;
  picker?.destroy();
  picker = null;
  // Never leave the page outlined because the tool was closed while x-ray was on.
  if (xray) { xray = false; setXray(false); }
  setFrozen(false);
  /*
   * And never leave it rewritten. Closing the tool is the strongest possible
   * statement that you are done with it, so it is also where the promise to
   * leave the page as it was found has to be kept: every edit goes back,
   * whether or not you remembered to turn edit mode off first.
   */
  editor.disarm();
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
  group = null;
  marquee = null;
  // Closed: every tool reads as off, whatever its saved preference, because
  // none of them is drawing. Guides are still there for next time.
  reportTools({ ...CLOSED, guides: guides.length });
}

/**
 * Is this keystroke going somewhere the user is typing?
 *
 * Every shortcut here is a bare letter, and the argument for that was that the
 * tool swallows clicks while it is on, so nothing on the page can be holding
 * focus. That is wrong in the ordinary case: focus set before the tool was
 * turned on survives being turned on, and Tab moves it freely afterwards. Type
 * into a field with the tool running and `r` toggled the rulers instead of
 * typing an r, because we call preventDefault on it.
 *
 * `composedPath()[0]` rather than `target`, because an event from inside an
 * open shadow root is retargeted to the host and the real input would be
 * invisible to a plain check.
 */
function typing(e: KeyboardEvent): boolean {
  /*
   * Our own fields first. The overlay's root is closed, so from this listener
   * on window the event's path stops at the host and composedPath()[0] is the
   * host, never the input inside it. Every text field the tool owns was
   * therefore invisible here: typing the hex colour #bec3fe fired b, c, e and
   * f, and e disarmed edit mode and reverted every change. The root's own
   * activeElement is readable to whoever holds the root, and we do.
   */
  const ours = overlay?.root.activeElement as HTMLElement | null | undefined;
  if (ours && (ours.isContentEditable
    || ours.tagName === 'INPUT' || ours.tagName === 'TEXTAREA' || ours.tagName === 'SELECT')) {
    return true;
  }
  const el = (e.composedPath?.()[0] ?? e.target) as HTMLElement | null;
  if (!el || typeof el !== 'object' || !('tagName' in el)) return false;
  if (el.isContentEditable) return true;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT';
}

function onKey(e: KeyboardEvent) {
  if (matchesHotkey(e)) {
    e.preventDefault();
    overlay ? deactivate() : activate();
  } else if (typing(e)) {
    // Everything below is either a bare letter or a combination a text field
    // already owns, so while someone is typing the tool has nothing to say.
    // The hotkey above is deliberately outside this: you must always be able
    // to switch the tool off.
  } else if (overlay && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey
             && (e.key.toLowerCase() === cfg.guideKeys.vertical || e.key.toLowerCase() === cfg.guideKeys.horizontal)) {
    // Shift+V clears every vertical guide, Shift+H every horizontal one.
    // Pinned guides stay, and the whole clear is one step of undo.
    e.preventDefault();
    const next = clearAxis(guides, e.key.toLowerCase() === cfg.guideKeys.vertical ? 'x' : 'y');
    if (next.length !== guides.length) {
      record();
      setGuides(next);
      settleSelection();
    }
    render();
  } else if (overlay && cursorAt && on('guides') && (e.key.toLowerCase() === cfg.guideKeys.vertical
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
      settleSelection();
    } else if (hoverGuide && !selection.has(hoverGuide.id)) {
      removeGuide(hoverGuide);
      settleSelection();
    } else if (selection.size > 1 || hoverGuide) {
      // The selection, when there is one or the pointer is on part of it.
      // One step of undo however many it held.
      const next = removeSelected(guides, selection);
      if (next.length !== guides.length) {
        record();
        setGuides(next);
      }
      settleSelection();
    }
    render();
  } else if (overlay && e.key.startsWith('Arrow')) {
    // Arrows move the guide the keyboard is pointing at. Horizontal keys move
    // vertical guides and vice versa: you push the line, not the axis it names.
    // Every selected guide on that axis moves together.
    const wants = e.key === 'ArrowLeft' || e.key === 'ArrowRight' ? 'x' : 'y';
    const moving = guides.filter((g) => selection.has(g.id) && g.axis === wants);
    if (!moving.length) return;
    e.preventDefault();
    if (moving.every((g) => g.pinned)) return;
    // A held arrow key is one gesture however many times it repeats, so the
    // whole run shares a tag and collapses to a single step.
    record(`nudge:${wants}:${moving.map((g) => g.id).join(',')}`);
    const step = e.shiftKey ? 10 : 1;
    // Nudged by hand, so whatever they had snapped to is no longer what they are on.
    setGuides(shift(guides, selection, wants, (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -step : step));
    if (hoverGuide) hoverGuide = guides.find((g) => g.id === hoverGuide!.id) ?? null;
    render();
  } else if (overlay && e.key.toLowerCase() === 'g') {
    e.preventDefault();
    onTool('grid');
    return;
  } else if (overlay && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    onTool('pixels');
    return;
  } else if (overlay && e.key === '\\') {
    // Figma hides its UI on the same key. Nothing is torn down: the locks, the
    // guides and the layers are all still there behind it.
    e.preventDefault();
    onTool('hide');
    return;
  } else if (overlay && e.key.toLowerCase() === 'e') {
    // Arming is a keystroke like everything else here, but it is the one that
    // changes what the tool is allowed to do, so the toolbar's own state is
    // what tells you it worked rather than the key doing it quietly.
    e.preventDefault();
    onTool('edit');
    return;
  } else if (overlay && e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // Never with a modifier: Ctrl/Cmd+S is save, and taking it would be the
    // tool eating a keystroke that was never meant for it.
    e.preventDefault();
    onTool('lint');
    return;
  } else if (overlay && e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // Notes. Not while a modifier is held: Ctrl+N is a new window, and taking
    // it would be the tool eating a keystroke that was never meant for it.
    e.preventDefault();
    onTool('notes');
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
    if (noteboard?.escape()) return;
    if (picker?.close()) return;
    if (indicator?.closeHelp()) return;
    if (marquee || selection.size > 1) {
      marquee = null;
      selectOnly(activeGuideId);
      render();
      return;
    }
    if (pinned.length) { pinned = []; boxmodel?.hide(); controls?.show(null); render(); }
    else deactivate();
  }
}

export function initAlign(partial: Partial<Config> = {}): void {
  if (typeof window === 'undefined') return;   // SSR — Next runs modules on the server
  if (window.__align) return;                  // HMR re-entry
  window.__align = true;

  cfg = mergeConfig(partial);
  gridLayers = null;
  useStorage(cfg.storage);
  // Preferences that survive a reload, unless the tool they belong to is off.
  rulers = on('rulers') && loadFlag('rulers');
  grid = on('grid') && loadFlag('grid');
  pixels = on('pixels') && loadFlag('pixels');
  forceTheme(cfg.theme);

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
