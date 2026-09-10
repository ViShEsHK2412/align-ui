import { icon, type IconName } from './icons';
import { scaleOf } from './measure';
import { HAIRLINE, MOTION, surface, TEXT, TYPE, WEIGHT } from './theme';

/**
 * A number you scrub.
 *
 * The second number control, and it exists because the first one is wrong for
 * half the panel. A slider shows where a value sits in a range, which is what
 * you want for opacity, a font weight or a colour channel — all of which have
 * ends that mean something. Padding does not. There is no maximum padding, so
 * a slider has to invent one, spend most of its travel on values nobody sets,
 * and take a hundred and fifty pixels doing it. Four of those in a 320px panel
 * is why the box section felt cramped no matter how it was spaced.
 *
 * This is the control Figma uses for the same job, and interface-kit's
 * `BoxSpacingControl` is the same idea: a compact badge showing the number,
 * dragged sideways to change it and clicked to type one. It takes the width of
 * its own digits, it has no invented range, and the gesture is unbounded — you
 * keep dragging and it keeps going.
 *
 * Two details worth keeping from theirs:
 *
 *  - **The drag axis follows the edge.** The top and bottom fields scrub
 *    vertically, the left and right ones horizontally, so the pointer moves
 *    the way the padding grows. The cursor says which before you press.
 *  - **A drag is not a click.** Past three pixels the gesture is a scrub and
 *    the click that follows is swallowed, or every scrub would end by opening
 *    a text field.
 */

/** Pointer pixels per unit. Two is interface-kit's, and it feels right. */
export const SENSITIVITY = 2;
/** Past this, the gesture is a drag and never becomes a click. */
export const DRAG_SLOP = 3;

/** Where a scrub lands, given where it started and how far the pointer moved. */
export function scrubbed(
  start: number,
  deltaPx: number,
  min: number,
  max: number,
  step = 1,
): number {
  const raw = start + deltaPx / SENSITIVITY;
  const snapped = step > 0 ? Math.round(raw / step) * step : raw;
  return Math.max(min, Math.min(max, Number(snapped.toPrecision(12))));
}

/**
 * A typed value, or null when it is not one.
 *
 * Units are accepted and ignored rather than refused: the field shows `24` and
 * people type `24px` because that is what they would write in a stylesheet.
 * Refusing that would be correct and useless.
 */
export function parseScrub(text: string, min: number, max: number): number | null {
  const m = /^\s*(-?\d*\.?\d+)\s*(px|rem|em|%)?\s*$/i.exec(text);
  if (!m) return null;
  const n = parseFloat(m[1]!);
  if (!Number.isFinite(n)) return null;
  return Math.max(min, Math.min(max, n));
}

/** Two decimals at most, and no trailing zeros: `24`, not `24.00`. */
export function formatScrub(value: number): string {
  return String(Math.round(value * 100) / 100);
}

export interface ScrubOptions {
  /** Named for a screen reader; the glyph carries it visually. */
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  /** Which way the pointer moves to increase it. */
  axis?: 'x' | 'y';
  /** The edge glyph, when there is one. */
  glyph?: IconName;
  /** Shown instead of a glyph, for the corners. */
  text?: string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
}

export interface Scrub {
  el: HTMLElement;
  set(value: number): void;
  destroy(): void;
}

export const SCRUB_CSS = `
.scrub {
  display: flex; align-items: center; gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0; border-radius: 0;
  background: ${surface(1)};
  color: ${TEXT.primary};
  font: inherit;
  font-size: ${TYPE.body}px; font-weight: ${WEIGHT.regular};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: left;
  user-select: none;
  touch-action: none;
  transition: background ${MOTION.ui};
}
.scrub[data-axis='x'] { cursor: ew-resize; }
.scrub[data-axis='y'] { cursor: ns-resize; }
.scrub:hover { background: ${surface(3)}; }
.scrub[data-scrubbing] { background: ${surface(5)}; }
.scrub:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

/* The glyph is the label, so it must not shrink when the number grows. */
.scrub-glyph { flex: none; display: grid; place-items: center; color: ${TEXT.tertiary}; }
.scrub-text {
  flex: none;
  color: ${TEXT.tertiary};
  font-size: ${TYPE.tag}px;
  white-space: nowrap;
}
.scrub-value {
  flex: 1; min-width: 0;
  text-align: right;
  white-space: nowrap; overflow: hidden;
}

.scrub-input {
  flex: 1; min-width: 0; width: 100%;
  padding: 0; border: 0;
  background: none; outline: none;
  color: ${TEXT.primary};
  font: inherit;
  font-size: ${TYPE.body}px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.scrub-input:focus { box-shadow: inset 0 -1px ${HAIRLINE}; }
`;

const STYLE_ID = 'align-scrub';

export function ensureScrubStyle(root: ShadowRoot): void {
  if (root.querySelector(`#${STYLE_ID}`)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = SCRUB_CSS;
  root.appendChild(style);
}

export function createScrub(root: ShadowRoot, options: ScrubOptions): Scrub {
  ensureScrubStyle(root);

  const min = options.min ?? 0;
  const max = options.max ?? 9999;
  const step = options.step ?? 1;
  const axis = options.axis ?? 'x';
  let value = options.value;

  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'scrub';
  el.dataset['axis'] = axis;
  el.setAttribute('aria-label', options.label);
  el.title = `${options.label}. Drag to change, click to type.`;

  if (options.glyph) {
    const g = document.createElement('span');
    g.className = 'scrub-glyph';
    g.appendChild(icon(options.glyph, 14));
    el.appendChild(g);
  } else if (options.text) {
    const t = document.createElement('span');
    t.className = 'scrub-text';
    t.textContent = options.text;
    el.appendChild(t);
  }

  const readout = document.createElement('span');
  readout.className = 'scrub-value';
  el.appendChild(readout);

  function show(): void {
    readout.textContent = formatScrub(value);
    el.setAttribute('aria-valuenow', String(value));
  }

  function commit(next: number, fromGesture: boolean): void {
    const clamped = Math.max(min, Math.min(max, next));
    if (clamped !== value) {
      value = clamped;
      show();
      options.onChange(value);
    }
    if (!fromGesture) options.onCommit?.(value);
  }

  // ── Scrubbing ─────────────────────────────────────────────────────────────

  let from: { x: number; y: number; value: number } | null = null;
  let dragged = false;
  let scale = 1;

  el.addEventListener('pointerdown', (e) => {
    if (input || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    try { el.setPointerCapture(e.pointerId); } catch { /* already gone */ }
    from = { x: e.clientX, y: e.clientY, value };
    dragged = false;
    // The panel can be inside a page the browser is scaling, and a scrub
    // measured in screen pixels would move at the wrong rate.
    scale = (axis === 'x' ? scaleOf(el).x : scaleOf(el).y) || 1;
    el.setAttribute('data-scrubbing', '');
  });

  el.addEventListener('pointermove', (e) => {
    if (!from) return;
    // Down is a smaller y, and padding grows downward, so the vertical axis is
    // inverted: dragging down on `bottom` should make it bigger.
    const delta = axis === 'x'
      ? (e.clientX - from.x) / scale
      : (e.clientY - from.y) / scale;
    if (!dragged && Math.abs(delta) > DRAG_SLOP) dragged = true;
    if (!dragged) return;
    commit(scrubbed(from.value, delta, min, max, step), true);
  });

  const endScrub = (e: PointerEvent) => {
    if (!from) return;
    try { el.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    from = null;
    el.removeAttribute('data-scrubbing');
    if (dragged) options.onCommit?.(value);
  };
  el.addEventListener('pointerup', endScrub);
  el.addEventListener('pointercancel', endScrub);

  // ── Typing ────────────────────────────────────────────────────────────────

  let input: HTMLInputElement | null = null;

  function openInput(): void {
    if (input) return;
    input = document.createElement('input');
    input.className = 'scrub-input';
    input.type = 'text';
    input.value = formatScrub(value);
    input.setAttribute('aria-label', `${options.label}, as a number`);
    readout.style.display = 'none';
    el.appendChild(input);
    input.focus();
    input.select();

    const close = (apply: boolean) => {
      if (!input) return;
      if (apply) {
        const parsed = parseScrub(input.value, min, max);
        if (parsed !== null) commit(parsed, false);
      }
      input.remove();
      input = null;
      readout.style.display = '';
      el.focus();
    };

    input.addEventListener('keydown', (ev) => {
      ev.stopPropagation();
      if (ev.key === 'Enter') { ev.preventDefault(); close(true); }
      else if (ev.key === 'Escape') { ev.preventDefault(); close(false); }
    });
    input.addEventListener('blur', () => close(true));
    input.addEventListener('pointerdown', (ev) => ev.stopPropagation());
  }

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    // A scrub always ends in a click, and opening a field every time you
    // finished dragging would make the control unusable.
    if (dragged) { dragged = false; return; }
    openInput();
  });

  el.addEventListener('keydown', (e) => {
    if (e.target !== el || e.altKey || e.metaKey || e.ctrlKey) return;
    const big = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault(); e.stopPropagation();
      commit(value + step * big, false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault(); e.stopPropagation();
      commit(value - step * big, false);
    } else if (e.key === 'Enter') {
      e.preventDefault(); e.stopPropagation();
      openInput();
    }
  });

  show();

  return {
    el,
    set(next: number) {
      value = Math.max(min, Math.min(max, next));
      show();
    },
    destroy() {
      input?.remove();
      el.remove();
    },
  };
}
