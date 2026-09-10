import { HAIRLINE, MOTION, ROW, surface, TEXT, TYPE, WEIGHT } from './theme';
import { scaleOf } from './measure';

/**
 * The number control.
 *
 * Every editable value in this tool is a number in a range, so this is the one
 * component that has to be right. The interaction model is a port of the
 * slider in Josh Puckett's DialKit (`dialkit`, MIT, © 2026 Josh Puckett) — the
 * behaviour is his, the implementation here is ours, because align-ui has no
 * dependencies and DialKit's is built on `motion/react`.
 *
 * What makes it worth porting rather than writing a range input:
 *
 *  - **The track is the whole control.** The label and the value live inside
 *    it and the fill is its background, so a row that would need a label, a
 *    track and a number side by side fits in one 36px line and still reads.
 *  - **A drag is instant; a click is animated.** Dragging jumps the fill to the
 *    pointer with no smoothing, because a control that lags the finger feels
 *    broken. Clicking springs to the target, because a click is one discrete
 *    intention and the movement is what tells you it was understood.
 *  - **A click is magnetic.** It pulls to the nearest tenth, but only from
 *    within 3.125% of it — close enough to help, tight enough that it never
 *    fights you for a value you meant.
 *  - **Dragging past the end stretches the track.** 32px of nothing first, then
 *    a square-rooted stretch to a maximum of 8px. The square root is the whole
 *    trick: a linear stretch feels elastic, a rooted one feels like resistance.
 *  - **The handle gets out of the way of the text.** When it would cross the
 *    label or the value it fades and squashes, on thresholds measured from
 *    those elements rather than guessed, so nothing ever overlaps at any width.
 *
 * Two deliberate departures from DialKit:
 *
 *  - **Square corners.** DialKit rounds the track, the handle and the marks.
 *    This tool is square everywhere and stays square.
 *  - **Composite-only animation.** DialKit animates the fill's `width`. Here
 *    the fill is a `scaleX` and the handle a `translateX`, so the whole
 *    animation is a compositor job and never touches layout.
 */

// ── Pure maths ──────────────────────────────────────────────────────────────

/** How many decimals a step needs, so `0.01` reads `0.30` and not `0.3`. */
export function decimalsForStep(step: number, min = 0, max = 0): number {
  return Math.min(100, Math.max(...[step, min, max].map((value) => {
    const [coefficient, exponent = '0'] = String(value).toLowerCase().split('e');
    return Math.max(0, (coefficient!.split('.')[1]?.length ?? 0) - Number(exponent));
  })));
}

/**
 * Snap to the step, measured from `min` rather than from zero.
 *
 * From zero, a range starting at 3 with a step of 2 could never produce 3. Both
 * endpoints are returned untouched so they stay exactly reachable, which is the
 * difference between a slider that can be set to its maximum and one that gets
 * close.
 */
export function roundValue(value: number, step: number, min?: number, max?: number): number {
  const lower = min ?? -Infinity;
  const upper = max ?? Infinity;
  const clamped = Math.max(lower, Math.min(upper, value));
  if (clamped === lower || clamped === upper || !Number.isFinite(step) || step <= 0) return clamped;
  const origin = min ?? 0;
  const snapped = origin + Math.round((clamped - origin) / step) * step;
  return Math.max(lower, Math.min(upper, Number(snapped.toPrecision(14))));
}

/** How close to a tenth a click has to land before it is pulled onto it. */
export const DECILE_PULL = 0.03125;

/** Magnetism, for a click only. A drag is never snapped — it goes where you put it. */
export function snapToDecile(raw: number, min: number, max: number): number {
  const normalised = (raw - min) / (max - min);
  const nearest = Math.round(normalised * 10) / 10;
  return Math.abs(normalised - nearest) <= DECILE_PULL
    ? min + nearest * (max - min)
    : raw;
}

/** Nothing happens for this many pixels past the end. */
export const DEAD_ZONE = 32;
/** How far the track can stretch, however far you drag. */
export const MAX_STRETCH = 8;
/** The distance past the dead zone at which the stretch reaches its maximum. */
export const MAX_CURSOR_RANGE = 200;

/**
 * How far the track gives when dragged past its end.
 *
 * `distancePast` is how far beyond the edge the pointer is, `sign` which edge.
 * Square-rooted, so the first pixels move it most and the last barely at all —
 * the shape of something resisting rather than something stretching.
 */
export function rubberStretch(distancePast: number, sign: number): number {
  const overflow = Math.max(0, distancePast - DEAD_ZONE);
  return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
}

/** Where a value sits along the track, 0..100. */
export function percentOf(value: number, min: number, max: number): number {
  return max === min ? 0 : ((value - min) / (max - min)) * 100;
}

/** What value a fraction along the track means, clamped to the range. */
export function valueAt(fraction: number, min: number, max: number): number {
  const f = Math.max(0, Math.min(1, fraction));
  return min + f * (max - min);
}

/**
 * The next value for a key, or undefined if the key is not ours.
 *
 * Stepping is computed from the *step index* rather than by adding to the
 * current value, so a value that is already off-step lands on one rather than
 * carrying the error forward for the rest of the session.
 */
export function sliderKeyValue(
  key: string,
  value: number,
  min: number,
  max: number,
  step: number,
  shift = false,
): number | undefined {
  if (key === 'Home') return min;
  if (key === 'End') return max;
  const direction = ['ArrowRight', 'ArrowUp', 'PageUp'].includes(key) ? 1
    : ['ArrowLeft', 'ArrowDown', 'PageDown'].includes(key) ? -1 : 0;
  if (!direction) return undefined;
  if (!(step > 0) || max <= min) return min;
  const amount = (key.startsWith('Page') || shift) ? 10 : 1;
  const position = (value - min) / step;
  // The epsilon keeps a value sitting exactly on a step from being counted as
  // just below it by floating-point noise, which would make one press do
  // nothing and the next do two.
  const next = min + (direction > 0
    ? Math.floor(position + 1e-9) + amount
    : Math.ceil(position - 1e-9) - amount) * step;
  return Math.max(min, Math.min(max, Number(next.toPrecision(14))));
}

/**
 * Where the marks go.
 *
 * Ten or fewer positions and every one is marked, because you can count them
 * and land on them. More than that and the marks become tenths, which is a
 * reading aid rather than a set of targets.
 */
export function hashMarkPercents(min: number, max: number, step: number): number[] {
  const steps = (max - min) / step;
  if (steps <= 10 && Number.isFinite(steps) && steps > 1) {
    return Array.from({ length: Math.round(steps) - 1 }, (_, i) => ((i + 1) * step / (max - min)) * 100);
  }
  return Array.from({ length: 9 }, (_, i) => (i + 1) * 10);
}

/** What a click lands on: a step when they are countable, a tenth when they are not. */
export function clickTarget(raw: number, min: number, max: number, step: number): number {
  const steps = (max - min) / step;
  return steps <= 10
    ? Math.max(min, Math.min(max, min + Math.round((raw - min) / step) * step))
    : snapToDecile(raw, min, max);
}

// ── A spring, because there is no motion library here ───────────────────────

export interface SpringOptions { stiffness: number; damping: number; mass: number }

/** DialKit's click-snap spring. Slightly underdamped: it arrives, then settles. */
export const SNAP_SPRING: SpringOptions = { stiffness: 300, damping: 25, mass: 0.8 };
/** The rubber band coming home. Looser, so the release reads as a release. */
export const RELEASE_SPRING: SpringOptions = { stiffness: 220, damping: 22, mass: 1 };

/**
 * One step of a damped spring, by semi-implicit Euler.
 *
 * `dt` is clamped by the caller. An unclamped frame — a background tab coming
 * back, a long task — integrates a huge step and throws the value to infinity,
 * which is the classic way a hand-rolled spring explodes.
 */
export function springStep(
  x: number,
  v: number,
  target: number,
  dt: number,
  o: SpringOptions,
): { x: number; v: number } {
  const a = (-o.stiffness * (x - target) - o.damping * v) / o.mass;
  const nv = v + a * dt;
  return { x: x + nv * dt, v: nv };
}

/** Near enough, and slow enough, to stop integrating. */
export function springSettled(x: number, v: number, target: number, epsilon = 0.01): boolean {
  return Math.abs(x - target) < epsilon && Math.abs(v) < epsilon;
}

// ── The control ─────────────────────────────────────────────────────────────

export interface SliderOptions {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  /** Shown after the number. Not part of the value. */
  unit?: string;
  onChange: (value: number) => void;
  /** Called once when a gesture ends, so the ledger gets one entry per drag. */
  onCommit?: (value: number) => void;
}

export interface Slider {
  el: HTMLElement;
  /** Push a value in from outside without calling back out. */
  set(value: number): void;
  destroy(): void;
}

/** Handle opacity at rest, awake, and while dragging. */
const HANDLE_REST = 0;
const HANDLE_AWAKE = 0.5;
const HANDLE_DRAG = 0.9;
/** What the handle fades to rather than sitting on top of the text. */
const HANDLE_DODGE = 0.1;
/** A press that moves less than this is a click, not a drag. */
const CLICK_THRESHOLD = 3;
/** How long the value has to be hovered before it will accept a click to edit. */
const EDIT_HOVER_MS = 800;
/** Clearance between the handle and the text it must not cross. */
const HANDLE_BUFFER = 8;

const HANDLE_W = 3;
const HANDLE_H = 20;
const PAD_LEFT = 10;
const PAD_RIGHT = 12;

export const SLIDER_CSS = `
.sl {
  position: relative;
  height: ${ROW}px;
  overflow: hidden;
  background: ${surface(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${surface(3)};
  transition: background ${MOTION.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${surface(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${MOTION.ui};
}
.sl[data-awake] .sl-mark { background: ${HAIRLINE}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${HANDLE_W}px; height: ${HANDLE_H}px;
  background: ${TEXT.primary};
  pointer-events: none;
  opacity: ${HANDLE_REST};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not — it is written every frame and must not lag the pointer. */
  transition: opacity ${MOTION.ui}, scale ${MOTION.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${HANDLE_AWAKE}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${HANDLE_DRAG}; }
.sl[data-dodge] .sl-handle { opacity: ${HANDLE_DODGE}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${TYPE.body}px; font-weight: ${WEIGHT.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${MOTION.ui};
}
.sl-label { left: ${PAD_LEFT}px; color: ${TEXT.secondary}; pointer-events: none; }
.sl-value {
  right: ${PAD_RIGHT}px;
  color: ${TEXT.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${TEXT.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${TEXT.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${PAD_RIGHT}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${TEXT.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${TYPE.body}px; font-weight: ${WEIGHT.medium};
  font-variant-numeric: tabular-nums;
  color: ${TEXT.primary};
}
`;

/** So the caller can mount the stylesheet once for however many sliders. */
export const SLIDER_STYLE_ID = 'align-slider';

export function ensureSliderStyle(root: ShadowRoot): void {
  // querySelector rather than getElementById: a ShadowRoot has the latter in
  // the DOM spec but not in TypeScript's lib for every target, and the lookup
  // is once per mount either way.
  if (root.querySelector(`#${SLIDER_STYLE_ID}`)) return;
  const style = document.createElement('style');
  style.id = SLIDER_STYLE_ID;
  style.textContent = SLIDER_CSS;
  root.appendChild(style);
}

export function createSlider(root: ShadowRoot, options: SliderOptions): Slider {
  // Mounted here rather than left to the caller: a slider whose stylesheet is
  // missing is an unstyled div that still responds to drags, which is a harder
  // thing to notice than one that does not appear at all.
  ensureSliderStyle(root);

  const min = options.min ?? 0;
  const max = options.max ?? 1;
  const step = options.step ?? 0.01;
  const decimals = decimalsForStep(step, min, max);

  let value = options.value;

  const el = document.createElement('div');
  el.className = 'sl';
  el.tabIndex = 0;
  el.setAttribute('role', 'slider');
  el.setAttribute('aria-label', options.label);
  el.setAttribute('aria-valuemin', String(min));
  el.setAttribute('aria-valuemax', String(max));

  const fill = document.createElement('div');
  fill.className = 'sl-fill';

  const marks = document.createElement('div');
  marks.className = 'sl-marks';
  for (const pct of hashMarkPercents(min, max, step)) {
    const m = document.createElement('div');
    m.className = 'sl-mark';
    m.style.left = `${pct}%`;
    marks.appendChild(m);
  }

  const handle = document.createElement('div');
  handle.className = 'sl-handle';

  const labelEl = document.createElement('span');
  labelEl.className = 'sl-label';
  labelEl.textContent = options.label;

  const valueEl = document.createElement('span');
  valueEl.className = 'sl-value';

  el.append(marks, fill, handle, labelEl, valueEl);

  // ── Painting ──────────────────────────────────────────────────────────────

  /** The fill percentage actually on screen, which the spring animates. */
  let shown = percentOf(value, min, max);
  let velocity = 0;
  let animTarget: number | null = null;
  let raf = 0;
  let lastT = 0;

  /** Track width in layout px, ignoring any scale an ancestor is applying. */
  function trackWidth(): number {
    return el.offsetWidth;
  }

  function paint(): void {
    fill.style.transform = `scaleX(${shown / 100})`;

    const w = trackWidth();
    const x = (shown / 100) * w;
    // Kept fully inside the track at both ends rather than hanging off it.
    const clamped = Math.max(HANDLE_W, Math.min(w - HANDLE_W, x)) - HANDLE_W / 2;
    handle.style.transform = `translate(${clamped}px, -50%)`;

    // The dodge thresholds come from what the label and value actually measure,
    // so a long label pushes the handle out of its way rather than a guessed
    // percentage doing it approximately.
    let dodge = false;
    if (w > 0) {
      const leftEdge = PAD_LEFT + labelEl.offsetWidth + HANDLE_BUFFER;
      const rightEdge = w - PAD_RIGHT - valueEl.offsetWidth - HANDLE_BUFFER;
      dodge = x < leftEdge || x > rightEdge;
    }
    el.toggleAttribute('data-dodge', dodge);
  }

  function showValue(): void {
    valueEl.textContent = options.unit
      ? `${value.toFixed(decimals)}${options.unit}`
      : value.toFixed(decimals);
    el.setAttribute('aria-valuenow', String(value));
    el.setAttribute('aria-valuetext', valueEl.textContent);
  }

  function stopAnimation(): void {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    animTarget = null;
    velocity = 0;
  }

  function animateTo(target: number, spring = SNAP_SPRING): void {
    animTarget = target;
    lastT = performance.now();
    if (raf) return;
    const tick = (now: number) => {
      // Clamped: a frame delayed by a long task or a hidden tab would otherwise
      // integrate one enormous step and throw the value off the track.
      const dt = Math.min((now - lastT) / 1000, 1 / 30);
      lastT = now;
      if (animTarget === null) { raf = 0; return; }
      const next = springStep(shown, velocity, animTarget, dt, spring);
      shown = next.x;
      velocity = next.v;
      paint();
      if (springSettled(shown, velocity, animTarget)) {
        shown = animTarget;
        velocity = 0;
        animTarget = null;
        raf = 0;
        paint();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function commit(next: number, animate: boolean): void {
    const rounded = roundValue(next, step, min, max);
    const changed = rounded !== value;
    value = rounded;
    showValue();
    if (animate) animateTo(percentOf(value, min, max));
    else { stopAnimation(); shown = percentOf(value, min, max); paint(); }
    if (changed) options.onChange(value);
  }

  // ── Pointer ───────────────────────────────────────────────────────────────

  let downAt: { x: number; y: number } | null = null;
  let isClick = true;
  let rect: DOMRect | null = null;
  let scale = 1;
  let stretch = 0;
  let stretchRaf = 0;

  function applyStretch(px: number): void {
    stretch = px;
    // Widening the track and sliding it back keeps the far edge pinned, so the
    // stretch reads as the track giving rather than the whole row moving.
    el.style.width = `calc(100% + ${Math.abs(px)}px)`;
    el.style.transform = px < 0 ? `translateX(${px}px)` : '';
  }

  function releaseStretch(): void {
    if (stretch === 0) return;
    let v = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const next = springStep(stretch, v, 0, dt, RELEASE_SPRING);
      v = next.v;
      applyStretch(next.x);
      if (springSettled(next.x, v, 0, 0.05)) {
        applyStretch(0);
        el.style.width = '';
        el.style.transform = '';
        stretchRaf = 0;
        return;
      }
      stretchRaf = requestAnimationFrame(tick);
    };
    stretchRaf = requestAnimationFrame(tick);
  }

  /**
   * Pointer x to a fraction of the track.
   *
   * Divided by the accumulated ancestor scale, because this tool is regularly
   * run inside a canvas that scales the whole page. `scaleOf` reads the
   * transform matrices rather than dividing the rect by `offsetWidth`: that
   * ratio is rounded to whole pixels and invents a scale of 1.0011 on an
   * element that is not scaled at all.
   */
  function fractionAt(clientX: number): number {
    if (!rect) return 0;
    const w = trackWidth();
    if (w <= 0) return 0;
    return ((clientX - rect.left) / scale) / w;
  }

  const onPointerDown = (e: PointerEvent) => {
    if (input || e.button !== 0) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    downAt = { x: e.clientX, y: e.clientY };
    isClick = true;
    rect = el.getBoundingClientRect();
    scale = scaleOf(el).x || 1;
    el.setAttribute('data-awake', '');
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!downAt) return;
    const dx = e.clientX - downAt.x;
    const dy = e.clientY - downAt.y;
    if (isClick && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
      isClick = false;
      el.setAttribute('data-dragging', '');
    }
    if (isClick || !rect) return;

    if (e.clientX < rect.left) applyStretch(rubberStretch(rect.left - e.clientX, -1));
    else if (e.clientX > rect.right) applyStretch(rubberStretch(e.clientX - rect.right, 1));
    else if (stretch !== 0) applyStretch(0);

    // A drag is never sprung and never snapped to a decile. It goes exactly
    // where the pointer is, or it does not feel connected to the pointer.
    stopAnimation();
    commit(valueAt(fractionAt(e.clientX), min, max), false);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!downAt) return;
    // A click still moves the value, so both paths end a gesture and both get
    // exactly one commit: the ledger records a drag as one entry, not one per
    // pointer event.
    if (isClick) commit(clickTarget(valueAt(fractionAt(e.clientX), min, max), min, max, step), true);
    options.onCommit?.(value);
    releaseStretch();
    downAt = null;
    el.removeAttribute('data-dragging');
    if (!hovering) el.removeAttribute('data-awake');
  };

  const onPointerCancel = () => {
    if (!downAt) return;
    applyStretch(0);
    el.style.width = '';
    el.style.transform = '';
    downAt = null;
    el.removeAttribute('data-dragging');
    if (!hovering) el.removeAttribute('data-awake');
  };

  let hovering = false;
  const onEnter = () => { hovering = true; el.setAttribute('data-awake', ''); };
  const onLeave = () => {
    hovering = false;
    if (!downAt) el.removeAttribute('data-awake');
  };

  // ── Typing a value ────────────────────────────────────────────────────────

  let input: HTMLInputElement | null = null;
  let editable = false;
  let hoverTimer = 0;

  function openInput(): void {
    if (input) return;
    input = document.createElement('input');
    input.className = 'sl-input';
    input.type = 'text';
    input.setAttribute('aria-label', `${options.label} value`);
    input.value = value.toFixed(decimals);
    valueEl.style.display = 'none';
    el.appendChild(input);
    input.focus();
    input.select();

    const close = (apply: boolean) => {
      if (!input) return;
      if (apply) {
        const parsed = parseFloat(input.value);
        if (Number.isFinite(parsed)) {
          commit(Math.max(min, Math.min(max, parsed)), true);
          options.onCommit?.(value);
        }
      }
      input.remove();
      input = null;
      valueEl.style.display = '';
      setEditable(false);
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

  function setEditable(on: boolean): void {
    editable = on;
    valueEl.toggleAttribute('data-editable', on);
  }

  /*
   * The value only becomes clickable after the pointer has rested on it. Without
   * the delay, a drag that happens to start over the number opens a text field
   * instead of moving the slider, and the two gestures are impossible to tell
   * apart at the moment the press lands.
   */
  valueEl.addEventListener('pointerenter', () => {
    if (input || downAt) return;
    hoverTimer = window.setTimeout(() => setEditable(true), EDIT_HOVER_MS);
  });
  valueEl.addEventListener('pointerleave', () => {
    clearTimeout(hoverTimer);
    if (!input) setEditable(false);
  });
  valueEl.addEventListener('pointerdown', (ev) => {
    if (!editable) return;
    ev.stopPropagation();
    ev.preventDefault();
    openInput();
  });

  // ── Keyboard ──────────────────────────────────────────────────────────────

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== el || e.altKey || e.metaKey || e.ctrlKey) return;
    const next = sliderKeyValue(e.key, value, min, max, step, e.shiftKey);
    if (next === undefined) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      e.stopPropagation();
      setEditable(true);
      openInput();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    /*
     * Keyboard stepping is not animated. A held arrow key repeats faster than a
     * spring can settle, so animating it would leave the fill permanently
     * chasing a value that has already moved on.
     */
    commit(next, false);
    options.onCommit?.(value);
  };

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerCancel);
  el.addEventListener('lostpointercapture', onPointerCancel);
  el.addEventListener('pointerenter', onEnter);
  el.addEventListener('pointerleave', onLeave);
  el.addEventListener('keydown', onKeyDown);

  showValue();
  // The first paint has to wait for a layout pass: offsetWidth is 0 until the
  // element is in the document, and every position here is a fraction of it.
  requestAnimationFrame(paint);

  return {
    el,
    set(next: number) {
      value = roundValue(next, step, min, max);
      showValue();
      stopAnimation();
      shown = percentOf(value, min, max);
      paint();
    },
    destroy() {
      stopAnimation();
      if (stretchRaf) cancelAnimationFrame(stretchRaf);
      clearTimeout(hoverTimer);
      el.remove();
    },
  };
}
