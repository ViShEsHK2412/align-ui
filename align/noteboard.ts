import type { Config } from './config';
import { createTabCapture, type TabCapture } from './capture';
import { DRAG_CSS, makeDraggable, type Draggable } from './draggable';
import { icon } from './icons';
import { selectorOf } from './inspect';
import { bandsOf, boxOf, hitTestThrough } from './measure';
import {
  anchorIn, areaFrom, barLift, clampPin, clampToViewport, layoutPins, nextNumber, notesToMarkdown,
  rectFrom, reviveNotes,
  subjectOf,
  type Note, type Rect,
} from './notes';
import { loadNotes, saveNotes } from './store';
import {
  GROUND, HAIRLINE, MOTION, SHADOW, SHADOW_LIFTED, SPACE, surface, TEXT, TYPE, WEIGHT,
} from './theme';

/**
 * Notes mode: point, say, keep going, then copy the lot.
 *
 * The loop is the product. Press N once, and from then on every click on an
 * element or drag over an area takes a screenshot of exactly that, asks what is
 * wrong with it, and puts a numbered pin on the page. Nothing leaves the mode
 * between notes, because the mode existing is what makes the tenth note as
 * quick as the first. Copy prompt turns the batch into one paste.
 *
 * The screenshot is taken before the composer opens, so the question box is
 * never in the picture, and with the whole overlay hidden, so neither are the
 * tool's own lines.
 */

export interface NoteBoard {
  mode(): boolean;
  setMode(on: boolean): void;
  count(): number;
  /** Close the topmost thing. True if there was one. */
  escape(): boolean;
  destroy(): void;
}

export interface NoteBoardOptions {
  root: ShadowRoot;
  cfg: Config;
  /** What edit mode has changed on an element, so a note can say so. */
  changesFor(el: Element): { prop: string; from: string; to: string }[];
  /** The mode changed, so the toolbar can follow. */
  onChange(): void;
}

/** Pointer travel before a press is a drag rather than a click. */
const DRAG_SLOP = 4;
/** Below this a dragged area is treated as a click, not a sliver. */
const MIN_AREA = 6;
/** Context kept around a clicked element, so its edges are in the picture. */
const CLICK_PAD = 8;
const PIN = 20;
/** The tallest the comment box grows before it scrolls: about twelve lines. */
const TEXT_MAX = 240;

export const NOTES_CSS = `
/*
 * The catch layer sits under every other surface of the tool. It is prepended
 * to the root rather than given a z-index, because the toolbar, the panels and
 * the dock have none: stacking them by document order keeps them clickable in
 * notes mode without numbering every layer in the tool.
 */
.nb-layer {
  position: fixed; inset: 0;
  display: none;
  pointer-events: auto;
  cursor: crosshair;
  touch-action: none;
}
.nb-layer[data-on] { display: block; }

.nb-hover, .nb-band, .nb-area {
  position: fixed; left: 0; top: 0;
  pointer-events: none;
  display: none;
}
.nb-hover { outline: 1px solid ${TEXT.primary}; outline-offset: 0; }
.nb-band {
  outline: 1px dashed ${TEXT.primary};
  background: ${surface(2)};
}
.nb-area { outline: 1px dashed ${TEXT.primary}; outline-offset: 2px; }
.nb-hover[data-on], .nb-band[data-on], .nb-area[data-on] { display: block; }

.nb-pin {
  position: fixed; left: 0; top: 0;
  z-index: 2;
  width: ${PIN}px; height: ${PIN}px;
  margin: ${-PIN / 2}px 0 0 ${-PIN / 2}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  pointer-events: auto;
  cursor: pointer;
  /*
   * Inverted, like the armed edit button: the two marks this tool leaves that
   * are about the page's future rather than its measurements. Not a hue, since
   * every hue on the canvas already means a measurement.
   */
  background: ${TEXT.primary}; color: ${GROUND};
  box-shadow: ${SHADOW};
  font-family: ${TYPE.stack};
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.semibold};
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.nb-pin:focus-visible { outline: 2px solid ${TEXT.primary}; outline-offset: 2px; }

.nb-surface {
  position: fixed;
  z-index: 2;
  pointer-events: auto;
  font-family: ${TYPE.stack};
  font-synthesis: none;
  font-size: ${TYPE.body}px;
  font-weight: ${WEIGHT.regular};
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  background: ${GROUND};
  border-radius: 0;
}
.nb-surface, .nb-surface * { box-sizing: border-box; }

.nb-composer {
  width: 300px;
  padding: ${SPACE.base}px;
  display: none;
  gap: ${SPACE.base}px;
  box-shadow: ${SHADOW_LIFTED};
}
.nb-composer[data-open] { display: grid; }
@starting-style { .nb-composer[data-open] { opacity: 0; translate: 0 4px; } }
.nb-composer { transition: opacity ${MOTION.ui}, translate ${MOTION.ui}; }

.nb-shot {
  display: grid; place-items: center;
  min-height: 48px; max-height: 140px;
  overflow: hidden;
  background: ${surface(1)};
  color: ${TEXT.secondary};
  font-size: ${TYPE.tag}px;
  text-align: center;
  padding: ${SPACE.tight}px;
}
.nb-shot img { display: block; max-width: 100%; max-height: 132px; object-fit: contain; }

/*
 * Grows with what you write, from three lines to about twelve, then scrolls.
 *
 * field-sizing does the growing where the browser has it; a small script does
 * it where not. No resize grip: a box that already fits its text has nothing
 * to drag, and the grip was a second, fussier way to get the same thing.
 */
.nb-text {
  display: block;
  width: 100%;
  min-height: ${Math.round(TYPE.body * 1.45 * 3 + SPACE.base * 2)}px;
  max-height: ${TEXT_MAX}px;
  field-sizing: content;
  resize: none;
  overflow-y: auto;
  padding: ${SPACE.base}px;
  border: 0; border-radius: 0;
  background: ${surface(1)}; color: ${TEXT.primary};
  font: inherit; font-size: ${TYPE.body}px; line-height: 1.45;
  overflow-wrap: anywhere;
  caret-color: ${TEXT.primary};
}
.nb-text::placeholder { color: ${TEXT.secondary}; opacity: 1; }
.nb-text:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.nb-text::selection { background: ${surface(6)}; color: ${TEXT.primary}; }

/*
 * A 3px bar, invisible until the box is hovered or being typed in.
 *
 * WebKit rules only, and deliberately no scrollbar-width alongside them:
 * Chromium 121 and later ignore every ::-webkit-scrollbar rule on an element
 * that sets the standard property, and the standard "thin" is still around
 * eleven pixels there. Firefox, which has no pseudo-element, gets the standard
 * property on its own below.
 */
.nb-text::-webkit-scrollbar { width: 3px; }
.nb-text::-webkit-scrollbar-track { background: transparent; }
.nb-text::-webkit-scrollbar-thumb { background: transparent; border-radius: 0; }
.nb-text:hover::-webkit-scrollbar-thumb,
.nb-text:focus::-webkit-scrollbar-thumb { background: ${surface(6)}; }
@supports not selector(::-webkit-scrollbar) {
  .nb-text { scrollbar-width: thin; scrollbar-color: transparent transparent; }
  .nb-text:hover, .nb-text:focus { scrollbar-color: ${surface(6)} transparent; }
}

.nb-row { display: flex; align-items: center; gap: ${SPACE.tight}px; }
.nb-grow { flex: 1; min-width: 0; }
.nb-hint { color: ${TEXT.secondary}; font-size: ${TYPE.tag}px; }

.nb-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${surface(3)}; color: ${TEXT.primary};
  font: inherit; font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  line-height: 1;
  cursor: pointer; white-space: nowrap;
  transition: background ${MOTION.ui};
}
.nb-btn:hover { background: ${surface(5)}; }
.nb-btn:active:not(:disabled) { scale: 0.96; }
.nb-btn:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.nb-btn[data-primary] { background: ${TEXT.primary}; color: ${GROUND}; }
.nb-btn[data-primary]:hover { background: ${TEXT.secondary}; }
.nb-btn[data-quiet] { background: none; color: ${TEXT.secondary}; }
.nb-btn[data-quiet]:hover { background: ${surface(2)}; color: ${TEXT.primary}; }
/*
 * After the variants, and carrying the same attribute weight. :disabled and
 * [data-primary] score the same, so whichever came last won: Copy prompt with
 * nothing to copy was drawn as the brightest button on the bar.
 */
.nb-btn:disabled,
.nb-btn[data-primary]:disabled,
.nb-btn[data-quiet]:disabled {
  color: ${TEXT.disabled}; background: ${surface(1)}; cursor: default;
}
/*
 * The hidden attribute is only a default display: none, and every author
 * display rule beats it. Delete was showing on notes that did not exist yet.
 */
.nb-surface [hidden] { display: none; }

/*
 * The batch bar. Bottom centre, the one place none of the other surfaces
 * start, and draggable like all of them. Centred with translate so the drag's
 * transform composes with it rather than replacing it.
 */
.nb-bar {
  left: 50%; bottom: ${SPACE.edge}px;
  translate: -50% 0;
  display: none;
  align-items: center; gap: ${SPACE.base}px;
  padding: ${SPACE.tight}px ${SPACE.tight}px ${SPACE.tight}px ${SPACE.base}px;
  box-shadow: ${SHADOW};
  user-select: none;
}
.nb-bar[data-open] { display: flex; }
.nb-bar .nb-label {
  display: flex; align-items: center; gap: 6px;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  white-space: nowrap;
}
/* A flex child shrinks by default, and an icon has no content to stop it. */
.nb-bar .nb-label svg { flex: none; color: ${TEXT.secondary}; }
.nb-sep { width: 1px; align-self: stretch; margin: 2px 0; background: ${HAIRLINE}; }
/*
 * Its own row, under the controls, and never truncated.
 *
 * It sat inline with an ellipsis, and every message that mattered was cut
 * exactly before its instruction: "That share was not this tab. Screenshots…"
 * with "press N twice to share again" lost off the end. It also squeezed the
 * label beside it onto two lines. A message is only ever shown because
 * something needs saying, so it gets the width to say it.
 */
.nb-bar { flex-wrap: wrap; max-width: min(520px, calc(100vw - ${SPACE.edge * 2}px)); }
.nb-status {
  order: 10;
  flex-basis: 100%;
  padding: 2px ${SPACE.tight}px ${SPACE.tight}px 0;
  font-size: ${TYPE.tag}px; line-height: 1.4; color: ${TEXT.secondary};
}
.nb-status:empty { display: none; }

@media (prefers-reduced-motion: reduce) {
  .nb-composer { transition: none; }
  .nb-btn:active:not(:disabled) { scale: 1; }
}
`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  if (node instanceof HTMLButtonElement) node.type = 'button';
  return node;
}

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function createNoteBoard(options: NoteBoardOptions): NoteBoard {
  const { root, cfg, changesFor, onChange } = options;
  const host = root.host as HTMLElement;
  const capture: TabCapture = createTabCapture();

  let notes: Note[] = reviveNotes(loadNotes());
  let on = false;
  /** Sharing was refused this time round; asking again every note would nag. */
  let declined = false;
  /** Whether the dev server writes files. Unknown until the first save asks. */
  let endpoint: boolean | null = cfg.notesEndpoint ? null : false;

  // ── DOM ───────────────────────────────────────────────────────────────────

  const style = document.createElement('style');
  style.textContent = DRAG_CSS + NOTES_CSS;

  const layer = el('div', 'nb-layer');
  const hoverBox = el('div', 'nb-hover');
  const band = el('div', 'nb-band');
  layer.append(hoverBox, band);

  const area = el('div', 'nb-area');
  const pins = document.createElement('div');

  const composer = el('div', 'nb-surface nb-composer');
  composer.setAttribute('role', 'dialog');
  composer.setAttribute('aria-label', 'Note');
  const shot = el('div', 'nb-shot');
  const text = el('textarea', 'nb-text');
  text.placeholder = 'What should change here?';
  text.setAttribute('aria-label', 'What should change here');
  text.rows = 3;
  const actions = el('div', 'nb-row');
  const del = el('button', 'nb-btn', 'Delete');
  del.setAttribute('data-quiet', '');
  const hint = el('span', 'nb-grow nb-hint', 'Enter to save');
  hint.title = 'Shift+Enter for a new line';
  const cancel = el('button', 'nb-btn', 'Cancel');
  cancel.setAttribute('data-quiet', '');
  const save = el('button', 'nb-btn', 'Save');
  save.setAttribute('data-primary', '');
  actions.append(del, hint, cancel, save);
  composer.append(shot, text, actions);

  const bar = el('div', 'nb-surface nb-bar');
  bar.setAttribute('data-drag-handle', '');
  const label = el('span', 'nb-label');
  label.append(icon('notes', 13));
  const countText = el('span', '');
  label.append(countText);
  const status = el('span', 'nb-status');
  const copy = el('button', 'nb-btn', 'Copy prompt');
  copy.setAttribute('data-primary', '');
  const clear = el('button', 'nb-btn', 'Clear');
  clear.setAttribute('data-quiet', '');
  const done = el('button', 'nb-btn', 'Done');
  done.setAttribute('data-quiet', '');
  done.title = 'Leave notes mode (N)';
  bar.append(label, status, el('span', 'nb-sep'), copy, clear, done);

  root.append(style);
  root.prepend(layer);
  root.append(area, pins, composer, bar);

  const drag: Draggable = makeDraggable({ surface: bar });

  // ── State shown ───────────────────────────────────────────────────────────

  let statusTimer: ReturnType<typeof setTimeout> | undefined;
  function say(message: string, ms = 0): void {
    clearTimeout(statusTimer);
    status.textContent = message;
    if (ms) statusTimer = setTimeout(() => { status.textContent = ''; }, ms);
  }

  function persist(): void {
    saveNotes(notes);
  }

  function here(): Note[] {
    return notes.filter((n) => n.page.path === location.pathname);
  }

  function renderBar(): void {
    const show = on || notes.length > 0;
    bar.toggleAttribute('data-open', show);
    const n = notes.length;
    countText.textContent = n === 0
      ? 'Click an element or drag an area'
      : `${n} note${n === 1 ? '' : 's'}`;
    copy.disabled = n === 0;
    clear.disabled = n === 0;
    done.hidden = !on;
    if (show) requestAnimationFrame(() => { clearPageChrome(); drag.place(); });
  }

  /** Painted: has a fill or a shadow, so it is something you can see sitting there. */
  function painted(node: Element): boolean {
    const cs = getComputedStyle(node);
    const bg = cs.backgroundColor.replace(/\s+/g, '');
    const clear = bg === 'transparent' || bg === 'rgba(0,0,0,0)' || /\/0\)$|,0\)$/.test(bg);
    return !clear || cs.boxShadow !== 'none';
  }

  /**
   * Start the bar above whatever the page docks at the bottom.
   *
   * Only while you have not moved it: a bar you dragged is where you want it.
   * Sampled with elementsFromPoint across the bar's own area, then walked up to
   * the first painted ancestor, because a toolbar's buttons are what the point
   * hits and the toolbar is what has a size worth clearing.
   */
  function clearPageChrome(): void {
    if (drag.moved()) return;
    bar.style.bottom = '';
    const r = bar.getBoundingClientRect();
    if (!r.width) return;
    const blockers: Rect[] = [];
    const seen = new Set<Element>();
    for (const fx of [0.1, 0.5, 0.9]) {
      for (const fy of [0.25, 0.75]) {
        for (const hit of document.elementsFromPoint(r.left + r.width * fx, r.top + r.height * fy)) {
          if (hit === host || hit === document.body || hit === document.documentElement) continue;
          let node: Element | null = hit;
          while (node && node !== document.body && !painted(node)) node = node.parentElement;
          if (!node || node === document.body || seen.has(node)) continue;
          seen.add(node);
          const b = node.getBoundingClientRect();
          blockers.push({ x: b.left, y: b.top, w: b.width, h: b.height });
        }
      }
    }
    const lift = barLift(
      { x: r.left, y: r.top, w: r.width, h: r.height },
      blockers,
      { w: innerWidth, h: innerHeight },
    );
    if (lift !== null) bar.style.bottom = `${lift}px`;
  }

  function renderPins(): void {
    pins.textContent = '';
    for (const note of here()) {
      const pin = el('button', 'nb-pin', String(note.n));
      pin.setAttribute('aria-label', `Note ${note.n}: ${note.comment.slice(0, 60)}`);
      pin.title = note.comment;
      pin.dataset['id'] = note.id;
      pin.addEventListener('pointerenter', () => { hoveredPin = note.id; showArea(note); });
      pin.addEventListener('pointerleave', () => { hoveredPin = null; area.removeAttribute('data-on'); });
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        openComposer({ note });
      });
      pins.appendChild(pin);
    }
    place();
  }

  /**
   * The element each note is about, found again after a reload.
   *
   * Held while the page lives; after a reload it is looked up by the path the
   * note recorded, and that path is only trusted if what it finds still has the
   * note's selector. A note whose element cannot be found falls back to the page
   * position it was taken at.
   */
  const elements = new Map<string, Element>();
  function elementOf(note: Note): Element | null {
    const held = elements.get(note.id);
    if (held?.isConnected) return held;
    const t = note.target;
    if (!t) return null;
    for (const query of [t.path, t.selector]) {
      if (!query) continue;
      try {
        const found = document.querySelector(query);
        if (found && selectorOf(found) === t.selector) {
          elements.set(note.id, found);
          return found;
        }
      } catch {
        /* a path written by an older version may not parse */
      }
    }
    return null;
  }

  /**
   * Where a note's area is right now, in viewport pixels.
   *
   * From the element's live box when it can be found, so a canvas that zooms or
   * pans takes the pin with it; from the page position otherwise, which still
   * follows scrolling.
   */
  function areaOf(note: Note): Rect {
    const found = elementOf(note);
    if (found) {
      const b = found.getBoundingClientRect();
      const live = { x: b.left, y: b.top, w: b.width, h: b.height };
      return note.anchor ? areaFrom(note.anchor, live) : live;
    }
    return { x: note.rect.x - scrollX, y: note.rect.y - scrollY, w: note.rect.w, h: note.rect.h };
  }

  function place(): void {
    const els = Array.from(pins.children) as HTMLElement[];
    const shown = els
      .map((pin) => notes.find((n) => n.id === pin.dataset['id']))
      .filter((n): n is Note => Boolean(n));
    const viewport = { w: innerWidth, h: innerHeight };
    const areas = new Map(shown.map((n) => [n.id, areaOf(n)]));
    /*
     * Only notes whose area is on screen get a pin; a note about something you
     * cannot see has nothing to point at. Held inside the window first, fanned
     * out second, because fanning what will actually be drawn is the only order
     * that cannot re-create a collision at the edge.
     */
    const onScreen = shown.filter((n) => {
      const a = areas.get(n.id)!;
      return a.x + a.w > 0 && a.y + a.h > 0 && a.x < viewport.w && a.y < viewport.h;
    });
    const spots = layoutPins(
      onScreen.map((n) => { const a = areas.get(n.id)!; return clampPin(a.x, a.y, PIN, viewport); }),
      PIN,
    );
    for (const pin of els) {
      const i = onScreen.findIndex((n) => n.id === pin.dataset['id']);
      const display = i < 0 ? 'none' : '';
      if (pin.style.display !== display) pin.style.display = display;
      if (i < 0) continue;
      const translate = Math.round(spots[i]!.x) + 'px ' + Math.round(spots[i]!.y) + 'px';
      // Written only when it moved: this runs every frame.
      if (pin.style.translate !== translate) pin.style.translate = translate;
    }
    if (hoveredPin) {
      const note = notes.find((n) => n.id === hoveredPin);
      if (note) showArea(note);
    }
  }

  /*
   * Every frame while there are pins, not on scroll. A canvas zoom or pan
   * moves the elements without scrolling anything, so no event says a pin is
   * now in the wrong place; reading the boxes each frame is the only signal
   * that covers every way an element can move.
   */
  let placing = 0;
  let hoveredPin: string | null = null;
  function tick(): void {
    placing = 0;
    if (pins.childElementCount > 0) place();
    placing = requestAnimationFrame(tick);
  }

  function box(node: HTMLElement, r: Rect): void {
    node.style.translate = `${r.x}px ${r.y}px`;
    node.style.width = `${r.w}px`;
    node.style.height = `${r.h}px`;
  }

  function showArea(note: Note): void {
    box(area, areaOf(note));
    area.setAttribute('data-on', '');
  }

  // ── Pointing ──────────────────────────────────────────────────────────────

  /**
   * What is under the pointer on the page, looking through the catch layer.
   *
   * The layer has to take every press in notes mode or the page would receive
   * the click, and it has to be invisible to hit testing or every lookup would
   * find the layer. Turning its pointer events off for the length of one
   * synchronous lookup is both, and nothing paints in between.
   */
  function elementAt(x: number, y: number): Element | null {
    layer.style.pointerEvents = 'none';
    try {
      return hitTestThrough(x, y, cfg)?.el ?? null;
    } finally {
      layer.style.pointerEvents = '';
    }
  }

  /** The smallest element that contains a dragged area, for the paste to name. */
  function containerOf(r: Rect): Element | null {
    let node = elementAt(r.x + r.w / 2, r.y + r.h / 2);
    while (node && node !== document.body && node !== document.documentElement) {
      const b = node.getBoundingClientRect();
      if (b.left <= r.x + 1 && b.top <= r.y + 1
        && b.right >= r.x + r.w - 1 && b.bottom >= r.y + r.h - 1) return node;
      node = node.parentElement;
    }
    return null;
  }

  let press: { x: number; y: number; id: number } | null = null;
  let banding = false;
  let hovering = 0;

  layer.addEventListener('pointermove', (e) => {
    if (press) {
      if (!banding && Math.hypot(e.clientX - press.x, e.clientY - press.y) > DRAG_SLOP) {
        banding = true;
        hoverBox.removeAttribute('data-on');
        band.setAttribute('data-on', '');
      }
      if (banding) box(band, rectFrom(press.x, press.y, e.clientX, e.clientY));
      return;
    }
    if (hovering) return;
    const { clientX: x, clientY: y } = e;
    hovering = requestAnimationFrame(() => {
      hovering = 0;
      const target = elementAt(x, y);
      if (!target) { hoverBox.removeAttribute('data-on'); return; }
      const r = target.getBoundingClientRect();
      box(hoverBox, { x: r.left, y: r.top, w: r.width, h: r.height });
      hoverBox.setAttribute('data-on', '');
    });
  });

  layer.addEventListener('pointerleave', () => {
    if (!press) hoverBox.removeAttribute('data-on');
  });

  layer.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || composer.hasAttribute('data-open')) return;
    e.preventDefault();
    press = { x: e.clientX, y: e.clientY, id: e.pointerId };
    banding = false;
    try { layer.setPointerCapture(e.pointerId); } catch { /* already up */ }
  });

  layer.addEventListener('pointerup', (e) => {
    if (!press || e.pointerId !== press.id) return;
    const from = press;
    const wasBand = banding;
    press = null;
    banding = false;
    band.removeAttribute('data-on');
    hoverBox.removeAttribute('data-on');
    if (layer.hasPointerCapture(e.pointerId)) layer.releasePointerCapture(e.pointerId);

    const dragged = clampToViewport(
      rectFrom(from.x, from.y, e.clientX, e.clientY),
      { w: innerWidth, h: innerHeight },
    );
    if (wasBand && dragged.w >= MIN_AREA && dragged.h >= MIN_AREA) {
      void take(dragged, containerOf(dragged), true);
      return;
    }
    const target = elementAt(e.clientX, e.clientY);
    if (!target) return;
    const r = target.getBoundingClientRect();
    void take({ x: r.left, y: r.top, w: r.width, h: r.height }, target, false);
  });

  layer.addEventListener('pointercancel', () => {
    press = null;
    banding = false;
    band.removeAttribute('data-on');
  });

  // ── Taking a note ─────────────────────────────────────────────────────────

  interface Draft {
    note?: Note;
    region?: Rect;
    target?: Element | null;
    isRegion?: boolean;
    blob?: Blob | null;
    url?: string;
    /** Measured when the area was dragged, before any scrolling could move it. */
    inside?: NonNullable<Note['inside']>;
    /** The area inside its element, measured at the same moment. */
    anchor?: NonNullable<Note['anchor']>;
  }
  let draft: Draft | null = null;
  /** Where the open composer is anchored, so it can be re-placed as it grows. */
  let anchor: Rect | null = null;

  /**
   * Hide the whole tool for the length of a screenshot.
   *
   * Opacity, not visibility. A hidden parent does not hide a child that sets
   * visibility: visible for itself, and the colour card does exactly that when
   * open, so it would have been in the picture. Opacity has no such escape:
   * nothing inside a transparent element can paint.
   */
  function hideTool(): () => void {
    const before = host.style.getPropertyValue('opacity');
    host.style.setProperty('opacity', '0');
    return () => {
      if (before) host.style.setProperty('opacity', before);
      else host.style.removeProperty('opacity');
    };
  }

  async function take(region: Rect, target: Element | null, isRegion: boolean): Promise<void> {
    /*
     * Measured before the screenshot, not after: the capture waits for a fresh
     * frame, and a page that scrolls in that time would move what the drag was
     * drawn around.
     */
    let inside: NonNullable<Note['inside']> | undefined;
    if (isRegion) {
      const found = outermostIn(region, target);
      const rectOf = (e: Element) => {
        const b = e.getBoundingClientRect();
        return { x: b.left, y: b.top, w: b.width, h: b.height };
      };
      const subject = subjectOf(region, found.map(rectOf), target ? rectOf(target) : null);
      if (subject === 0) {
        target = found[0]!;
        isRegion = false;
      } else if (subject === 'container') {
        isRegion = false;
      } else {
        inside = grouped(found);
      }
    }

    let blob: Blob | null = null;
    if (capture.active()) {
      const crop = isRegion ? region : {
        x: region.x - CLICK_PAD, y: region.y - CLICK_PAD,
        w: region.w + CLICK_PAD * 2, h: region.h + CLICK_PAD * 2,
      };
      const result = await capture.grab(crop, hideTool);
      if (result.ok) {
        blob = result.blob;
      } else if (result.reason === 'wrong-surface') {
        capture.stop();
        say('That share was not this tab. Screenshots are off — press N twice to share again.');
      }
    }
    const d: Draft = { region, target, isRegion, blob };
    if (inside) d.inside = inside;
    if (target) {
      const b = target.getBoundingClientRect();
      const a = anchorIn(region, { x: b.left, y: b.top, w: b.width, h: b.height });
      if (a) d.anchor = a;
    }
    openComposer(d);
  }

  function openComposer(d: Draft): void {
    closeComposer();
    draft = d;
    const editing = Boolean(d.note);

    shot.textContent = '';
    if (d.blob) {
      d.url = URL.createObjectURL(d.blob);
      const img = document.createElement('img');
      img.alt = 'Screenshot of the area this note is about';
      img.src = d.url;
      shot.append(img);
    } else if (editing && d.note!.image) {
      const image = d.note!.image;
      if (image.path && cfg.notesEndpoint) {
        /*
         * The server wrote it, so it can hand it back: a note reopened after a
         * reload shows the same picture it was taken with, rather than a file
         * name that says nothing about what is in it.
         */
        const img = document.createElement('img');
        img.alt = 'Screenshot of the area this note is about';
        img.src = `${cfg.notesEndpoint}/${encodeURIComponent(image.file)}`;
        img.addEventListener('error', () => { shot.textContent = 'Screenshot saved on disk'; }, { once: true });
        shot.append(img);
      } else {
        shot.textContent = `Screenshot in your downloads: ${image.file}`;
      }
    } else {
      shot.textContent = capture.active()
        ? 'Could not take a screenshot of this area'
        : 'No screenshot — screen sharing is off';
    }

    text.value = d.note?.comment ?? '';
    // Sized for what is already in it, so an edited long note opens at its length.
    requestAnimationFrame(fit);
    del.hidden = !editing;
    save.textContent = editing ? 'Update' : 'Save';
    save.disabled = false;
    composer.setAttribute('data-open', '');

    const target = d.note ? areaOf(d.note) : d.region!;
    if (d.note) showArea(d.note);
    anchor = target;
    positionComposer(target);
    text.focus({ preventScroll: true });
  }

  /** Below the area if it fits, above if not, and always on screen. */
  function positionComposer(r: Rect): void {
    const w = composer.offsetWidth || 300;
    const h = composer.offsetHeight || 220;
    const gap = SPACE.base;
    const margin = SPACE.edge;
    let top = r.y + r.h + gap;
    if (top + h > innerHeight - margin) top = r.y - h - gap;
    top = Math.min(Math.max(top, margin), Math.max(margin, innerHeight - h - margin));
    let left = r.x;
    left = Math.min(Math.max(left, margin), Math.max(margin, innerWidth - w - margin));
    composer.style.left = `${left}px`;
    composer.style.top = `${top}px`;
  }

  function closeComposer(): void {
    if (draft?.url) URL.revokeObjectURL(draft.url);
    draft = null;
    composer.removeAttribute('data-open');
    area.removeAttribute('data-on');
  }

  /**
   * Does the dev server write files? Asked once, on the first save that needs it.
   *
   * Not at startup: a tool that is merely switched on should cost nothing, and
   * most sessions never take a note.
   */
  async function hasEndpoint(): Promise<boolean> {
    if (endpoint !== null) return endpoint;
    try {
      const res = await fetch(cfg.notesEndpoint!, { method: 'GET', cache: 'no-store' });
      const body: unknown = res.ok ? await res.json() : null;
      endpoint = typeof body === 'object' && body !== null && (body as { ok?: unknown }).ok === true;
    } catch {
      endpoint = false;
    }
    return endpoint;
  }

  async function storeImage(blob: Blob, n: number): Promise<NonNullable<Note['image']>> {
    if (await hasEndpoint()) {
      try {
        const res = await fetch(cfg.notesEndpoint!, {
          method: 'POST',
          headers: { 'Content-Type': 'image/png' },
          body: blob,
        });
        if (res.ok) {
          const body = await res.json() as { file?: unknown; path?: unknown };
          if (typeof body.file === 'string' && typeof body.path === 'string') {
            return { file: body.file, path: body.path };
          }
        }
      } catch {
        /* fall through to a download */
      }
    }
    /*
     * No server that writes files: the downloads folder, under a name that
     * says what it is. The paste can name the file but not the folder, since a
     * page is never told where downloads go.
     */
    const file = `align-note-${n}-${Date.now()}.png`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    root.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return { file };
  }

  /** Visible text, collapsed and cut short enough to read in a list. */
  function textOf(node: Element, max = 60): string {
    const t = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    return t.length > max ? `${t.slice(0, max - 1)}…` : t;
  }

  /**
   * A path an agent can follow: up to four ancestors, stopping at an id, with
   * a position wherever a sibling shares the selector.
   *
   * `selectorOf` alone names a kind of element, and four tabs are all `a.tab`.
   * The position is what picks out the second one.
   */
  function pathOf(node: Element): string {
    const steps: string[] = [];
    let at: Element | null = node;
    for (let depth = 0; at && depth < 5; depth++) {
      if (at === document.body || at === document.documentElement) break;
      let step = selectorOf(at);
      const parent: Element | null = at.parentElement;
      if (parent && !at.id) {
        const same = Array.from(parent.children).filter((c) => selectorOf(c) === step);
        if (same.length > 1) step += `:nth-of-type(${Array.from(parent.children)
          .filter((c) => c.tagName === at!.tagName).indexOf(at) + 1})`;
      }
      steps.unshift(step);
      if (at.id) break;
      at = parent;
    }
    return steps.join(' > ');
  }

  function targetData(target: Element): NonNullable<Note['target']> {
    const b = boxOf(target);
    const bands = bandsOf(target);
    const data: NonNullable<Note['target']> = {
      selector: selectorOf(target),
      label: b.label,
      size: { w: b.width / b.scale.x, h: b.height / b.scale.y },
      padding: bands.padding,
      border: bands.border,
      margin: bands.margin,
      path: pathOf(target),
    };
    const text = textOf(target);
    if (text) data.text = text;
    return data;
  }

  /**
   * The outermost elements a dragged area fully contains, grouped by selector.
   *
   * Outermost, because listing a row and then every span inside it says the
   * same thing six times. Bounded, because a region dragged across a large page
   * would otherwise walk every element on it for a note nobody reads to the end.
   */
  function outermostIn(r: Rect, container: Element | null): Element[] {
    const scope = container ?? document.body;
    const found: Element[] = [];
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT);
    let visited = 0;
    for (let n = walker.nextNode(); n && visited < 3000; n = walker.nextNode()) {
      visited++;
      const e = n as Element;
      if (e === host || found.some((f) => f.contains(e))) continue;
      const b = e.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) continue;
      if (b.left >= r.x - 1 && b.top >= r.y - 1
        && b.right <= r.x + r.w + 1 && b.bottom <= r.y + r.h + 1) found.push(e);
    }
    return found;
  }

  function grouped(found: readonly Element[]): NonNullable<Note['inside']> {
    const groups = new Map<string, { selector: string; count: number; text?: string }>();
    for (const e of found) {
      const selector = selectorOf(e);
      const g = groups.get(selector);
      if (g) { g.count++; delete g.text; continue; }
      const entry: { selector: string; count: number; text?: string } = { selector, count: 1 };
      const text = textOf(e, 40);
      if (text) entry.text = text;
      groups.set(selector, entry);
    }
    return Array.from(groups.values()).slice(0, 8);
  }

  /**
   * A save in progress. Enter on a held key repeats in milliseconds, and each
   * repeat used to start another save of the same draft while the first was
   * still uploading, so one note could land twice with two screenshots.
   */
  let saving = false;

  async function commit(): Promise<void> {
    const d = draft;
    if (!d || saving) return;
    saving = true;
    try {
      await commitDraft(d);
    } finally {
      saving = false;
    }
  }

  async function commitDraft(d: Draft): Promise<void> {
    const comment = text.value.trim();

    if (d.note) {
      d.note.comment = comment;
      persist();
      closeComposer();
      renderPins();
      say(`Updated note ${d.note.n}`, 1500);
      return;
    }

    save.disabled = true;
    save.textContent = 'Saving…';
    const n = nextNumber(notes);
    const region = d.region!;
    const note: Note = {
      id: newId(),
      n,
      comment,
      page: { path: location.pathname, viewport: { w: innerWidth, h: innerHeight } },
      rect: { x: region.x + scrollX, y: region.y + scrollY, w: region.w, h: region.h },
    };
    if (d.isRegion) {
      note.region = true;
      if (d.inside?.length) note.inside = d.inside;
    }
    if (d.anchor) note.anchor = d.anchor;
    if (d.target) {
      elements.set(note.id, d.target);
      note.target = targetData(d.target);
      const changes = changesFor(d.target);
      if (changes.length) note.changes = changes;
    }
    if (d.blob) note.image = await storeImage(d.blob, n);

    // The composer may have been cancelled or replaced while the upload ran.
    if (draft !== d) return;
    notes = [...notes, note];
    persist();
    closeComposer();
    renderPins();
    renderBar();
    say(note.image?.path ? `Note ${n} saved` : note.image ? `Note ${n} saved · screenshot downloaded` : `Note ${n} saved`, 1500);
  }

  function remove(note: Note): void {
    notes = notes.filter((n) => n.id !== note.id);
    persist();
    if (note.image?.path && cfg.notesEndpoint) {
      void fetch(`${cfg.notesEndpoint}/${encodeURIComponent(note.image.file)}`, { method: 'DELETE' })
        .catch(() => { /* a stray file in a gitignored folder is harmless */ });
    }
  }

  // ── Composer controls ─────────────────────────────────────────────────────

  /*
   * Growing without field-sizing, and staying on screen either way.
   *
   * A box that grows downwards can push the composer's buttons off the bottom
   * of the window, so each change re-places it against the thing it is about.
   */
  const grows = typeof CSS !== 'undefined' && CSS.supports?.('field-sizing', 'content');
  function fit(): void {
    if (!grows) {
      text.style.height = 'auto';
      text.style.height = `${Math.min(text.scrollHeight, TEXT_MAX)}px`;
    }
    if (anchor && composer.hasAttribute('data-open')) positionComposer(anchor);
  }
  text.addEventListener('input', fit);

  text.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      void commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeComposer();
    }
  });
  save.addEventListener('click', () => { void commit(); });
  cancel.addEventListener('click', () => closeComposer());
  del.addEventListener('click', () => {
    const note = draft?.note;
    if (!note) return;
    remove(note);
    closeComposer();
    renderPins();
    renderBar();
    say(`Deleted note ${note.n}`, 1500);
  });

  // ── Batch controls ────────────────────────────────────────────────────────

  copy.addEventListener('click', async () => {
    const md = notesToMarkdown(notes);
    try {
      await navigator.clipboard.writeText(md);
      say(`Copied ${notes.length} note${notes.length === 1 ? '' : 's'} — paste into your agent`, 2500);
    } catch {
      say('The browser blocked the clipboard. Click the page once and try again.', 4000);
    }
  });

  /*
   * Two presses, because it deletes screenshots from disk. Not a dialog: the
   * button saying what the second press does is the confirmation, and it
   * stands down by itself.
   */
  let clearArmed: ReturnType<typeof setTimeout> | undefined;
  clear.addEventListener('click', () => {
    if (!clearArmed) {
      clear.textContent = 'Clear all?';
      clearArmed = setTimeout(() => {
        clearArmed = undefined;
        clear.textContent = 'Clear';
      }, 3000);
      return;
    }
    clearTimeout(clearArmed);
    clearArmed = undefined;
    clear.textContent = 'Clear';
    const count = notes.length;
    for (const note of notes) remove(note);
    notes = [];
    persist();
    closeComposer();
    renderPins();
    renderBar();
    say(`Cleared ${count} note${count === 1 ? '' : 's'}`, 1500);
  });

  done.addEventListener('click', () => setMode(false));

  capture.onEnded(() => {
    say('Screen sharing stopped. New notes save without a screenshot — press N twice to share again.');
  });

  // ── Mode ──────────────────────────────────────────────────────────────────

  async function setMode(next: boolean): Promise<void> {
    if (next === on) return;
    on = next;
    layer.toggleAttribute('data-on', on);
    if (!on) {
      closeComposer();
      hoverBox.removeAttribute('data-on');
      band.removeAttribute('data-on');
      // Leaving and re-entering is how you ask to be prompted again.
      declined = false;
    }
    renderBar();
    onChange();

    if (on && !capture.active() && !declined) {
      say('Choose "This tab" to include screenshots…');
      const result = await capture.start();
      if (result === 'ok') {
        say('Sharing this tab — click an element or drag an area', 2500);
      } else {
        declined = true;
        say(result === 'unsupported'
          ? 'This browser cannot share a tab. Notes save without screenshots.'
          : 'No screenshots this time. Notes still save — press N twice to share again.');
      }
    }
  }

  placing = requestAnimationFrame(tick);
  addEventListener('resize', place);
  renderPins();
  renderBar();

  return {
    mode: () => on,
    setMode: (next) => { void setMode(next); },
    count: () => notes.length,
    escape(): boolean {
      if (composer.hasAttribute('data-open')) { closeComposer(); return true; }
      if (on) { void setMode(false); return true; }
      return false;
    },
    destroy(): void {
      clearTimeout(statusTimer);
      clearTimeout(clearArmed);
      cancelAnimationFrame(placing);
      cancelAnimationFrame(hovering);
      removeEventListener('resize', place);
      closeComposer();
      capture.stop();
      drag.destroy();
      layer.remove();
      area.remove();
      pins.remove();
      composer.remove();
      bar.remove();
      style.remove();
    },
  };
}
