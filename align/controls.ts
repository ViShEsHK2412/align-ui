import { createScrub, type Scrub } from './scrub';
import { createSlider, type Slider } from './slider';
import { readValue, type Editor } from './edit';
import {
  GROUND, HAIRLINE, MOTION, ROW, SHADOW, SPACE, surface, TEXT, TYPE, WEIGHT,
} from './theme';
import { icon } from './icons';
import {
  EMPTY_SHADOW, formatBackdropBlur, formatShadows, moveLayer,
  parseBackdropBlur, parseShadows, type Shadow,
} from './shadow';

/**
 * The controls.
 *
 * A panel of the properties you actually reach for, bound to the locked
 * element through the editor. It only exists while edit mode is armed, which
 * is the point: the tool has one surface that reads and a separate one that
 * writes, and they are never the same panel wearing a different hat.
 *
 * Three rules the layout follows:
 *
 *  - **Grouped by what you are doing**, not by CSS's own taxonomy. Type, then
 *    colour, then the box, then its border, then layout. Nobody opens a panel
 *    looking for "inherited properties".
 *  - **The ones you use are visible, the rest are behind a disclosure.** The
 *    full list is over forty properties. Forty rows you cannot scan is worse
 *    than fifteen you can, so the tiers ship as a shipping order rather than
 *    as a screen.
 *  - **A row that the tool has written says so**, and offers to put it back.
 *    The panel reports numbers read from the page, and once it can write, some
 *    of them are its own doing.
 */

type Kind = 'length' | 'number' | 'colour' | 'choice' | 'shadow' | 'blur';

interface Spec {
  /** The CSS property, or the shorthand a per-side group writes through. */
  prop: string;
  label: string;
  kind: Kind;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** For `choice`. The first is treated as the default. */
  options?: readonly string[];
  /**
   * The longhands a per-side group edits. Four sliders and a link, writing
   * these rather than the shorthand, because reading a shorthand back gives
   * you one string you then have to take apart again.
   */
  sides?: readonly string[];
  /** Behind the disclosure rather than in the first screen. */
  more?: boolean;
}

interface Group {
  name: string;
  specs: readonly Spec[];
}

const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const CORNERS = [
  'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-right-radius', 'border-bottom-left-radius',
] as const;

/**
 * What the panel offers.
 *
 * The ranges are not arbitrary. Each one is wide enough to cover what the
 * property is really used for and no wider: a font-size slider that runs to
 * 400 spends nine tenths of its travel on sizes nobody sets, which makes the
 * tenth you want unusable.
 */
export const GROUPS: readonly Group[] = [
  {
    name: 'Type',
    specs: [
      { prop: 'font-size', label: 'Size', kind: 'length', min: 8, max: 96, step: 1, unit: 'px' },
      { prop: 'font-weight', label: 'Weight', kind: 'number', min: 100, max: 900, step: 100 },
      { prop: 'line-height', label: 'Line height', kind: 'length', min: 0, max: 96, step: 1, unit: 'px' },
      { prop: 'letter-spacing', label: 'Tracking', kind: 'length', min: -4, max: 12, step: 0.1, unit: 'px' },
      { prop: 'font-style', label: 'Style', kind: 'choice', options: ['normal', 'italic'], more: true },
      { prop: 'text-align', label: 'Align', kind: 'choice', options: ['start', 'center', 'end', 'justify'], more: true },
      { prop: 'text-transform', label: 'Case', kind: 'choice', options: ['none', 'uppercase', 'lowercase', 'capitalize'], more: true },
      { prop: 'text-decoration-line', label: 'Decoration', kind: 'choice', options: ['none', 'underline', 'line-through'], more: true },
    ],
  },
  {
    name: 'Colour',
    specs: [
      { prop: 'color', label: 'Text', kind: 'colour' },
      { prop: 'background-color', label: 'Background', kind: 'colour' },
      { prop: 'border-color', label: 'Border', kind: 'colour', more: true },
      { prop: 'opacity', label: 'Opacity', kind: 'number', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    name: 'Box',
    specs: [
      { prop: 'padding', label: 'Padding', kind: 'length', min: 0, max: 128, step: 1, unit: 'px', sides: SIDES.map((s) => `padding-${s}`) },
      { prop: 'margin', label: 'Margin', kind: 'length', min: -64, max: 128, step: 1, unit: 'px', sides: SIDES.map((s) => `margin-${s}`) },
      { prop: 'width', label: 'Width', kind: 'length', min: 0, max: 1600, step: 1, unit: 'px', more: true },
      { prop: 'height', label: 'Height', kind: 'length', min: 0, max: 1200, step: 1, unit: 'px', more: true },
      { prop: 'box-sizing', label: 'Sizing', kind: 'choice', options: ['content-box', 'border-box'] },
    ],
  },
  {
    name: 'Border',
    specs: [
      { prop: 'border-width', label: 'Width', kind: 'length', min: 0, max: 24, step: 1, unit: 'px', sides: SIDES.map((s) => `border-${s}-width`) },
      { prop: 'border-style', label: 'Style', kind: 'choice', options: ['none', 'solid', 'dashed', 'dotted'] },
      { prop: 'border-radius', label: 'Radius', kind: 'length', min: 0, max: 64, step: 1, unit: 'px', sides: CORNERS },
    ],
  },
  {
    name: 'Effects',
    specs: [
      { prop: 'box-shadow', label: 'Shadow', kind: 'shadow' },
      {
        prop: 'backdrop-filter', label: 'Backdrop blur', kind: 'blur',
        min: 0, max: 40, step: 1, unit: 'px', more: true,
      },
    ],
  },
  {
    name: 'Layout',
    specs: [
      { prop: 'display', label: 'Display', kind: 'choice', options: ['block', 'flex', 'grid', 'inline-flex', 'inline-block', 'none'] },
      { prop: 'flex-direction', label: 'Direction', kind: 'choice', options: ['row', 'column', 'row-reverse', 'column-reverse'], more: true },
      { prop: 'justify-content', label: 'Justify', kind: 'choice', options: ['flex-start', 'center', 'flex-end', 'space-between'], more: true },
      { prop: 'align-items', label: 'Align', kind: 'choice', options: ['stretch', 'flex-start', 'center', 'flex-end'], more: true },
      { prop: 'flex-wrap', label: 'Wrap', kind: 'choice', options: ['nowrap', 'wrap'], more: true },
      { prop: 'gap', label: 'Gap', kind: 'length', min: 0, max: 96, step: 1, unit: 'px' },
    ],
  },
];

/**
 * A computed value as a number the sliders can use.
 *
 * `normal` is what `letter-spacing` and `line-height` compute to when nobody
 * has set them, and it is not a number. Zero is the right reading for tracking;
 * for line-height the browser gives a used value in px once it is laid out, so
 * the fallback is only reached before that.
 */
export function numberFrom(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/** Round-trip a computed colour into what an `<input type=color>` accepts. */
export function toHexInput(value: string): string {
  const m = /^rgba?\(([^)]+)\)$/.exec(value.trim());
  if (!m) return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : '#000000';
  const [r, g, b] = m[1]!.split(/[\s,/]+/).filter(Boolean).map(Number);
  if (r === undefined || g === undefined || b === undefined) return '#000000';
  const hex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export interface Controls {
  /** Point the panel at an element, or at nothing. */
  show(el: Element | null): void;
  /** Armed state changed: appear or disappear. */
  setArmed(armed: boolean): void;
  /** Re-read every control from the element, after an outside change. */
  refresh(): void;
  /** The ledger, for the clipboard. */
  asText(): string;
  destroy(): void;
}

/**
 * Wide enough for a per-side group to be two readable columns, and no wider.
 * The panel sits over the page it is editing, so every pixel of it is a pixel
 * of the thing you are looking at.
 */
const PANEL_W = 320;

const CSS = `
.edit-dock {
  position: fixed;
  top: ${SPACE.edge}px;
  left: ${SPACE.edge}px;
  width: ${PANEL_W}px;
  max-height: calc(100vh - ${SPACE.edge * 2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${TYPE.stack};
  font-synthesis: none;
  font-size: ${TYPE.body}px;
  font-weight: ${WEIGHT.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  background: ${GROUND};
  box-shadow: ${SHADOW};
}
.edit-dock[data-open] { display: flex; }

/*
 * The panel is summoned by a keystroke you meant, so it arrives rather than
 * appears. 160ms on the UI curve, an 8px rise and a fade: enough to say where
 * it came from, short enough that arming twice in a row never feels slow.
 *
 * @starting-style animates the first frame after display changes, with no
 * keyframes to restart and nothing to clean up.
 */
@starting-style {
  .edit-dock[data-open] { opacity: 0; translate: 0 8px; }
}
.edit-dock {
  opacity: 1;
  translate: 0 0;
  transition: opacity ${MOTION.ui}, translate ${MOTION.ui}, display ${MOTION.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${MOTION.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${MOTION.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active, .edit-revert:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${SPACE.base}px;
  flex: none;
  height: ${ROW}px;
  padding: 0 ${SPACE.base}px 0 ${SPACE.roomy}px;
  border-bottom: 1px solid ${HAIRLINE};
}
.edit-title { font-size: ${TYPE.title}px; font-weight: ${WEIGHT.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${TEXT.tertiary};
  font-size: ${TYPE.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-align: right;
}
/*
 * The gutter is reserved whether or not it is needed.
 *
 * Without it the scrollbar appears the moment the content is a row too tall,
 * takes about fifteen pixels off the width, and every row reflows under it —
 * which is why the values were being clipped at the right edge on exactly the
 * elements that had enough properties to scroll.
 */
.edit-body {
  /*
   * A flex item's min-height is auto, so it refuses to shrink below its own
   * content and overflow-y never has anything to scroll. The panel
   * grew past its max-height instead, and a wheel over it fell through to the
   * page — which made every group below the fold unreachable. Same shape as
   * the min-width: auto that broke the colour popover in the lab.
   */
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  /*
   * Present but not part of the design until you reach for it. The panel is
   * mostly a column of controls, and a permanent light bar down its edge reads
   * as one more thing to look at.
   */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color ${MOTION.ui};
  padding: ${SPACE.base}px;
}
.edit-body:hover, .edit-body:focus-within {
  scrollbar-color: ${surface(6)} transparent;
}
/* WebKit does not read scrollbar-color, so it gets the same thing said twice. */
.edit-body::-webkit-scrollbar { width: 8px; }
.edit-body::-webkit-scrollbar-track { background: transparent; }
.edit-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
  transition: background ${MOTION.ui};
}
.edit-body:hover::-webkit-scrollbar-thumb,
.edit-body:focus-within::-webkit-scrollbar-thumb { background: ${surface(6)}; }
/* Nothing a control does may push the panel wider than the panel. */
.edit-line > * { min-width: 0; }

/*
 * Three times the gap inside a group. Ambiguous spacing is a functional bug,
 * not an ugly one: at 12px against a 6px row gap, a group's name read as
 * belonging to the rows above it as easily as the ones below.
 */
.edit-group + .edit-group { margin-top: 24px; }
/*
 * The section, and the label inside it, were both 11px and two pixels apart,
 * and the child was the brighter of the two. Hierarchy inverted.
 *
 * They are the same size and the same colour now, and told apart by weight,
 * case and tracking, which is what carries emphasis without making the
 * important thing large or the subordinate thing unreadable.
 */
.edit-group-name {
  display: block;
  margin: 0 0 ${SPACE.base}px 2px;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.semibold};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${TEXT.secondary};
}
.edit-rows { display: grid; gap: ${SPACE.base}px; }

/*
 * A row the tool has written shows its revert control and nothing else.
 *
 * There was a bar down the leading edge as well, which said the same thing
 * twice: the revert arrow only appears on a touched row, so it already marks
 * which rows are the tool's doing, and it is a control rather than a stripe.
 * Two marks for one fact is noise in a panel with twenty rows in it.
 */
.edit-row { position: relative; }

.edit-line {
  display: flex; align-items: center; gap: ${SPACE.base}px;
  min-height: ${ROW}px;
  padding: 0 10px;
  background: ${surface(1)};
}
.edit-label {
  flex: none; width: 88px;
  color: ${TEXT.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
.edit-choice { display: flex; flex-wrap: wrap; gap: 2px; }
.edit-opt {
  /* 24px is WCAG's AA floor and these were 21 by a padding accident. */
  min-height: 24px;
  padding: 5px 8px; border: 0; border-radius: 0;
  background: ${surface(2)}; color: ${TEXT.secondary};
  font: inherit; font-size: ${TYPE.tag}px; cursor: pointer;
  transition: background ${MOTION.ui}, color ${MOTION.ui};
}
.edit-opt:hover { background: ${surface(4)}; color: ${TEXT.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${TEXT.primary}; color: ${GROUND}; }

.edit-swatch {
  flex: none; width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  box-shadow: inset 0 0 0 1px ${HAIRLINE};
  cursor: pointer;
}
.edit-hex {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 6px;
  border: 1px solid ${HAIRLINE}; border-radius: 0;
  background: ${surface(1)}; color: ${TEXT.primary};
  font: inherit; font-size: ${TYPE.tag}px;
  font-variant-numeric: tabular-nums;
}
.edit-hex:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

.edit-row-name {
  display: block;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${SPACE.tight}px 10px;
  color: ${TEXT.secondary};
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.regular};
}
/* Two columns of badges. They size to their own digits, so the grid can be
   tight without anything being clipped. */
.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${SPACE.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${surface(2)}; padding: 6px; }
.edit-layer-head {
  display: flex; align-items: center; gap: 4px;
  margin-bottom: 4px;
}
.edit-layer-name {
  flex: 1; min-width: 0;
  /*
   * Secondary, not tertiary. Tertiary is measured against the ground and
   * clears 4.61:1 there; on this card it is a film over a film and falls to
   * 4.20:1. The constraint is written down in theme.ts and this is the first
   * place in the panel that actually meets it.
   */
  color: ${TEXT.secondary};
  font-size: ${TYPE.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-layer-head .edit-swatch { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${surface(3)}; color: ${TEXT.secondary};
  font: inherit; font-size: ${TYPE.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${surface(5)}; color: ${TEXT.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${TEXT.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${surface(2)}; color: ${TEXT.secondary};
  font: inherit; font-size: ${TYPE.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${surface(4)}; color: ${TEXT.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${TEXT.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${surface(4)}; color: ${TEXT.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

.edit-revert {
  width: 24px; height: 24px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${TEXT.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${TEXT.primary}; }
.edit-revert:active { scale: 0.96; }
.edit-revert:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

.edit-more {
  width: 100%; margin-top: ${SPACE.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${TEXT.tertiary};
  font: inherit; font-size: ${TYPE.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${TEXT.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${SPACE.base}px;
  padding: ${SPACE.base}px;
  border-top: 1px solid ${HAIRLINE};
}
.edit-count { flex: 1; color: ${TEXT.tertiary}; font-size: ${TYPE.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${surface(3)}; color: ${TEXT.primary};
  font: inherit; font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  cursor: pointer;
  transition: background ${MOTION.ui};
}
.edit-action:hover { background: ${surface(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${TEXT.disabled}; cursor: default; background: ${surface(1)}; }
.edit-action:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${SPACE.roomy}px;
  color: ${TEXT.tertiary};
}
`;

/** Everything one row owns, so a refresh can find its way back to the DOM. */
interface Row {
  spec: Spec;
  el: HTMLElement;
  /** Re-read from the element. */
  sync: () => void;
  sliders: Slider[];
  /** The per-side badges, which a linked change has to keep in step. */
  scrubs: Scrub[];
}

export function createControls(root: ShadowRoot, editor: Editor): Controls {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const dock = document.createElement('div');
  dock.className = 'edit-dock';
  dock.setAttribute('role', 'region');
  dock.setAttribute('aria-label', 'Edit the locked element');

  const head = document.createElement('div');
  head.className = 'edit-head';
  const title = document.createElement('span');
  title.className = 'edit-title';
  title.textContent = 'Edit';
  const subject = document.createElement('span');
  subject.className = 'edit-subject';
  head.append(title, subject);

  const body = document.createElement('div');
  body.className = 'edit-body';

  const foot = document.createElement('div');
  foot.className = 'edit-foot';
  const count = document.createElement('span');
  count.className = 'edit-count';
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'edit-action';
  copyBtn.textContent = 'Copy as prompt';
  const revertBtn = document.createElement('button');
  revertBtn.type = 'button';
  revertBtn.className = 'edit-action';
  revertBtn.textContent = 'Revert all';
  foot.append(count, revertBtn, copyBtn);

  dock.append(head, body, foot);
  root.appendChild(dock);

  let target: Element | null = null;
  let armed = false;
  let showMore = false;
  const rows: Row[] = [];
  /** Which per-side groups are writing all four at once. */
  const linked = new Set<string>();

  function updateFooter(): void {
    const n = editor.changes().length;
    count.textContent = n === 0 ? 'No changes' : `${n} change${n === 1 ? '' : 's'}`;
    copyBtn.disabled = n === 0;
    revertBtn.disabled = n === 0;
  }

  /** Mark the rows the tool has written, so the panel never passes its own work off as the page's. */
  function markTouched(): void {
    if (!target) return;
    for (const row of rows) {
      const props = row.spec.sides ?? [row.spec.prop];
      const touched = props.some((p) => editor.touched(target as Element, p));
      row.el.toggleAttribute('data-touched', touched);
    }
    updateFooter();
  }

  function write(prop: string, value: string): void {
    if (!target) return;
    editor.set(target, prop, value);
    markTouched();
  }

  function buildSlider(spec: Spec, prop: string, label: string): { el: HTMLElement; sync: () => void; slider: Slider } {
    const slider = createSlider(root, {
      label,
      value: target ? numberFrom(readValue(target, prop)) : 0,
      min: spec.min ?? 0,
      max: spec.max ?? 100,
      step: spec.step ?? 1,
      ...(spec.unit ? { unit: spec.unit } : {}),
      onChange: (v) => {
        const value = `${v}${spec.unit ?? ''}`;
        if (spec.sides && linked.has(spec.prop)) {
          for (const side of spec.sides) write(side, value);
          // The other three sliders have to follow, or the panel is showing
          // three values the element does not have.
          for (const row of rows) {
            if (row.spec.prop !== spec.prop) continue;
            for (const s of row.sliders) s.set(v);
          }
        } else {
          write(prop, value);
        }
      },
    });
    return {
      el: slider.el,
      slider,
      sync: () => { if (target) slider.set(numberFrom(readValue(target, prop))); },
    };
  }

  /**
   * One side of a box, as a badge you drag.
   *
   * The drag axis follows the edge: top and bottom scrub vertically, left and
   * right horizontally, so the pointer moves the way the value grows and the
   * cursor says so before you press.
   */
  function buildScrub(spec: Spec, prop: string, short: string): {
    el: HTMLElement; sync: () => void; scrub: Scrub;
  } {
    const vertical = /(^|\s)(top|bottom)(\s|$)/.test(short);
    const glyph = short === 'top' ? 'sideTop'
      : short === 'right' ? 'sideRight'
      : short === 'bottom' ? 'sideBottom'
      : short === 'left' ? 'sideLeft'
      : undefined;

    const scrub = createScrub(root, {
      label: `${spec.label} ${short}`,
      value: target ? numberFrom(readValue(target, prop)) : 0,
      min: spec.min ?? 0,
      max: spec.max ?? 999,
      step: spec.step ?? 1,
      axis: vertical ? 'y' : 'x',
      // A corner has no single edge to draw, so it keeps its words.
      ...(glyph ? { glyph } : { text: short }),
      onChange: (v) => {
        const value = `${v}${spec.unit ?? ''}`;
        if (linked.has(spec.prop) && spec.sides) {
          for (const side of spec.sides) write(side, value);
          for (const row of rows) {
            if (row.spec.prop !== spec.prop) continue;
            for (const other of row.scrubs) other.set(v);
          }
        } else {
          write(prop, value);
        }
      },
    });
    return {
      el: scrub.el,
      scrub,
      sync: () => { if (target) scrub.set(numberFrom(readValue(target, prop))); },
    };
  }

  function buildChoice(spec: Spec): { el: HTMLElement; sync: () => void } {
    const wrap = document.createElement('div');
    wrap.className = 'edit-choice';
    // One of these is chosen and the rest are not, which `aria-pressed` states
    // and a data- attribute only draws. Without it the current value is
    // visible and nowhere else.
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', spec.label);
    const buttons: HTMLButtonElement[] = [];
    for (const option of spec.options ?? []) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'edit-opt';
      b.textContent = option;
      b.addEventListener('click', () => {
        write(spec.prop, option);
        sync();
      });
      buttons.push(b);
      wrap.appendChild(b);
    }
    function sync(): void {
      const current = target ? readValue(target, spec.prop) : '';
      for (const b of buttons) {
        const on = b.textContent === current;
        b.toggleAttribute('data-on', on);
        b.setAttribute('aria-pressed', String(on));
      }
    }
    return { el: wrap, sync };
  }

  function buildColour(spec: Spec): { el: HTMLElement; sync: () => void } {
    const wrap = document.createElement('div');
    wrap.className = 'edit-field';
    const swatch = document.createElement('input');
    swatch.type = 'color';
    swatch.className = 'edit-swatch';
    swatch.setAttribute('aria-label', `${spec.label} colour`);
    const hex = document.createElement('input');
    hex.type = 'text';
    hex.className = 'edit-hex';
    hex.spellcheck = false;
    hex.setAttribute('aria-label', `${spec.label} colour, as hex`);

    swatch.addEventListener('input', () => {
      hex.value = swatch.value;
      write(spec.prop, swatch.value);
    });
    hex.addEventListener('change', () => {
      const value = hex.value.trim();
      // Refused rather than applied blind: an unparseable colour written to an
      // element is a transparent element, and the panel would have caused it.
      if (!/^#?[0-9a-f]{3}$|^#?[0-9a-f]{6}$/i.test(value)) { sync(); return; }
      const full = value.startsWith('#') ? value : `#${value}`;
      swatch.value = full.length === 4
        ? `#${full[1]}${full[1]}${full[2]}${full[2]}${full[3]}${full[3]}`
        : full;
      write(spec.prop, swatch.value);
    });

    function sync(): void {
      const current = target ? readValue(target, spec.prop) : '';
      const asHex = toHexInput(current);
      swatch.value = asHex;
      hex.value = asHex;
    }
    wrap.append(swatch, hex);
    return { el: wrap, sync };
  }

  /**
   * The shadow stack.
   *
   * Rebuilt wholesale whenever a layer is added, removed or reordered, and
   * updated in place while a slider moves. Rebuilding on every drag would
   * destroy the slider mid-gesture, which takes the pointer capture with it.
   */
  function buildShadow(spec: Spec): { el: HTMLElement; sync: () => void; sliders: Slider[] } {
    const wrap = document.createElement('div');
    wrap.className = 'edit-stack';
    let layers: Shadow[] = [];
    let sliders: Slider[] = [];

    function push(): void {
      write(spec.prop, formatShadows(layers));
    }

    function render(): void {
      for (const s of sliders) s.destroy();
      sliders = [];
      wrap.textContent = '';

      layers.forEach((layer, index) => {
        const card = document.createElement('div');
        card.className = 'edit-layer';

        const head = document.createElement('div');
        head.className = 'edit-layer-head';
        const name = document.createElement('span');
        name.className = 'edit-layer-name';
        name.textContent = `Layer ${index + 1}`;

        const swatch = document.createElement('input');
        swatch.type = 'color';
        swatch.className = 'edit-swatch';
        swatch.setAttribute('aria-label', `Layer ${index + 1} colour`);
        swatch.value = toHexInput(layer.colour);
        swatch.addEventListener('input', () => {
          layers[index] = { ...layer, colour: swatch.value };
          layer = layers[index]!;
          push();
        });

        const insetBtn = document.createElement('button');
        insetBtn.type = 'button';
        insetBtn.className = 'edit-opt';
        insetBtn.textContent = 'inset';
        insetBtn.toggleAttribute('data-on', layer.inset);
        insetBtn.addEventListener('click', () => {
          layers[index] = { ...layer, inset: !layer.inset };
          layer = layers[index]!;
          insetBtn.toggleAttribute('data-on', layer.inset);
          push();
        });

        const up = document.createElement('button');
        up.type = 'button';
        up.className = 'edit-mini';
        up.setAttribute('aria-label', `Move layer ${index + 1} up`);
        up.appendChild(icon('arrowUp', 12));
        up.disabled = index === 0;
        up.addEventListener('click', () => {
          layers = moveLayer(layers, index, index - 1);
          push();
          render();
        });

        const down = document.createElement('button');
        down.type = 'button';
        down.className = 'edit-mini';
        down.setAttribute('aria-label', `Move layer ${index + 1} down`);
        down.appendChild(icon('arrowDown', 12));
        down.disabled = index === layers.length - 1;
        down.addEventListener('click', () => {
          layers = moveLayer(layers, index, index + 1);
          push();
          render();
        });

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'edit-mini';
        remove.setAttribute('aria-label', `Remove layer ${index + 1}`);
        remove.appendChild(icon('cross', 12));
        remove.addEventListener('click', () => {
          layers = layers.filter((_, i) => i !== index);
          push();
          render();
        });

        head.append(name, swatch, insetBtn, up, down, remove);

        const grid = document.createElement('div');
        grid.className = 'edit-sides';
        const fields = [
          { key: 'x' as const, label: 'x', min: -64, max: 64 },
          { key: 'y' as const, label: 'y', min: -64, max: 64 },
          { key: 'blur' as const, label: 'blur', min: 0, max: 96 },
          { key: 'spread' as const, label: 'spread', min: -32, max: 32 },
        ];
        for (const field of fields) {
          const slider = createSlider(root, {
            label: field.label,
            value: layer[field.key],
            min: field.min,
            max: field.max,
            step: 1,
            unit: 'px',
            onChange: (v) => {
              layers[index] = { ...layers[index]!, [field.key]: v };
              layer = layers[index]!;
              push();
            },
          });
          sliders.push(slider);
          grid.appendChild(slider.el);
        }

        card.append(head, grid);
        wrap.appendChild(card);
      });

      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'edit-add';
      add.textContent = layers.length === 0 ? 'Add a shadow' : 'Add another layer';
      add.addEventListener('click', () => {
        layers = [...layers, { ...EMPTY_SHADOW }];
        push();
        render();
      });
      wrap.appendChild(add);
    }

    function sync(): void {
      layers = target ? parseShadows(readValue(target, spec.prop)) : [];
      render();
    }

    return { el: wrap, sync, sliders: [] as Slider[] };
  }

  /** Backdrop blur: one length, read out of and written back into a filter. */
  function buildBlur(spec: Spec): { el: HTMLElement; sync: () => void; slider: Slider } {
    const slider = createSlider(root, {
      label: spec.label,
      value: target ? parseBackdropBlur(readValue(target, spec.prop)) : 0,
      min: spec.min ?? 0,
      max: spec.max ?? 40,
      step: spec.step ?? 1,
      unit: spec.unit ?? 'px',
      onChange: (v) => write(spec.prop, formatBackdropBlur(v)),
    });
    return {
      el: slider.el,
      slider,
      sync: () => { if (target) slider.set(parseBackdropBlur(readValue(target, spec.prop))); },
    };
  }

  function buildRow(spec: Spec): Row {
    const row = document.createElement('div');
    row.className = 'edit-row';
    const line = document.createElement('div');
    line.className = 'edit-line';

    const label = document.createElement('span');
    label.className = 'edit-label';
    label.textContent = spec.label;

    const field = document.createElement('div');
    field.className = 'edit-field';

    const sliders: Slider[] = [];
    const scrubs: Scrub[] = [];
    const syncs: (() => void)[] = [];

    if (spec.sides) {
      const grid = document.createElement('div');
      grid.className = 'edit-sides';
      grid.style.flex = '1';
      for (const side of spec.sides) {
        /*
         * What is left once the property's own words are removed. A corner has
         * two of them and a side has one, so taking the last word alone labels
         * all four corners "left, right, right, left" — which is what it did.
         */
        const short = side
          .split('-')
          .filter((p) => p !== 'border' && p !== 'radius' && p !== 'width' && p !== 'padding' && p !== 'margin')
          .join(' ') || side;
        const built = buildScrub(spec, side, short);
        scrubs.push(built.scrub);
        syncs.push(built.sync);
        grid.appendChild(built.el);
      }
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'edit-linked';
      link.setAttribute('aria-label', `Link all four ${spec.label.toLowerCase()} values`);
      link.title = 'Change all four together';
      link.appendChild(icon('link', 13));
      link.setAttribute('aria-pressed', 'false');
      link.addEventListener('click', () => {
        if (linked.has(spec.prop)) linked.delete(spec.prop);
        else linked.add(spec.prop);
        const on = linked.has(spec.prop);
        link.toggleAttribute('data-on', on);
        link.setAttribute('aria-pressed', String(on));
      });
      field.append(grid, link);
    } else if (spec.kind === 'shadow') {
      const built = buildShadow(spec);
      syncs.push(built.sync);
      built.el.style.flex = '1';
      field.appendChild(built.el);
    } else if (spec.kind === 'blur') {
      const built = buildBlur(spec);
      sliders.push(built.slider);
      syncs.push(built.sync);
      built.el.style.flex = '1';
      field.appendChild(built.el);
    } else if (spec.kind === 'choice') {
      const built = buildChoice(spec);
      syncs.push(built.sync);
      field.appendChild(built.el);
    } else if (spec.kind === 'colour') {
      const built = buildColour(spec);
      syncs.push(built.sync);
      built.el.style.flex = '1';
      field.appendChild(built.el);
    } else {
      const built = buildSlider(spec, spec.prop, spec.label);
      sliders.push(built.slider);
      syncs.push(built.sync);
      built.el.style.flex = '1';
      field.appendChild(built.el);
    }

    const revert = document.createElement('button');
    revert.type = 'button';
    revert.className = 'edit-revert';
    revert.setAttribute('aria-label', `Revert ${spec.label.toLowerCase()}`);
    revert.title = 'Put this back';
    revert.appendChild(icon('undo', 13));
    revert.addEventListener('click', () => {
      if (!target) return;
      for (const p of spec.sides ?? [spec.prop]) editor.revert(target, p);
      for (const s of syncs) s();
      markTouched();
    });

    /*
     * Only the rows whose control cannot label itself get a leading label.
     *
     * The slider carries its name inside its own track, which is what lets it
     * fit a 36px row — so a label column beside it says everything twice and
     * costs 88px that the panel does not have. It showed up immediately: with
     * both, every slider row overflowed a 300px panel and the values were
     * clipped. Choice and colour rows have no such label, so they keep it.
     */
    if (spec.kind === 'shadow') line.classList.add('edit-line-block');
    // Only a colour row keeps a leading label. Its control is a swatch and a
    // field, both narrow, and the label sits comfortably beside them.
    const labelled = !spec.sides && spec.kind === 'colour';
    if (labelled) line.appendChild(label);
    /*
     * A per-side group had no name at all, and that was the worst thing in the
     * panel. Its four sliders say "top, right, bottom, left" and nothing said
     * what of: the Box group rendered two identical two-by-two grids and there
     * was no way to tell padding from margin. The name goes above the grid,
     * where it covers all four without being repeated four times.
     */
    /*
     * A choice row's name goes above its options for the same reason a
     * per-side group's does: the label column costs 88px, and with it
     * `content-box` and `border-box` could not sit on one line, so the second
     * wrapped underneath and read as a separate thing. Given the full width
     * they fit, and so do the four border styles.
     */
    if (spec.sides || spec.kind === 'shadow' || spec.kind === 'choice') {
      const above = document.createElement('span');
      above.className = 'edit-row-name';
      above.textContent = spec.label;
      // Appended before the line, so the DOM order is the reading order.
      // Reversing it in CSS instead put the name under its own grid and
      // directly above the next one, where it named the wrong thing.
      row.appendChild(above);
    }
    line.append(field, revert);
    row.appendChild(line);
    return { spec, el: row, sliders, scrubs, sync: () => { for (const s of syncs) s(); } };
  }

  function build(): void {
    for (const row of rows) {
      for (const s of row.sliders) s.destroy();
      for (const s of row.scrubs) s.destroy();
    }
    rows.length = 0;
    body.textContent = '';

    if (!target) {
      const empty = document.createElement('p');
      empty.className = 'edit-empty';
      empty.textContent = 'Click an element to lock it, then change it here.';
      body.appendChild(empty);
      updateFooter();
      return;
    }

    for (const group of GROUPS) {
      const specs = group.specs.filter((s) => showMore || !s.more);
      if (specs.length === 0) continue;
      const section = document.createElement('section');
      section.className = 'edit-group';
      const name = document.createElement('span');
      name.className = 'edit-group-name';
      name.textContent = group.name;
      const list = document.createElement('div');
      list.className = 'edit-rows';
      for (const spec of specs) {
        const row = buildRow(spec);
        rows.push(row);
        list.appendChild(row.el);
      }
      section.append(name, list);
      body.appendChild(section);
    }

    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'edit-more';
    more.textContent = showMore ? 'Fewer properties' : 'More properties';
    more.addEventListener('click', () => { showMore = !showMore; build(); });
    body.appendChild(more);

    for (const row of rows) row.sync();
    markTouched();
  }

  revertBtn.addEventListener('click', () => {
    editor.revertAll();
    for (const row of rows) row.sync();
    markTouched();
  });

  /*
   * A clipboard write is silent and so is its refusal, so a button that only
   * looks pressed leaves you with no way to know whether anything happened.
   * The label answers the question where you are already looking, and says
   * which of the two it was.
   */
  let copyAck = 0;
  copyBtn.addEventListener('click', () => {
    const text = editor.asPrompt();
    if (!text) return;
    const say = (word: string) => {
      copyBtn.textContent = word;
      clearTimeout(copyAck);
      copyAck = window.setTimeout(() => { copyBtn.textContent = 'Copy as prompt'; }, 900);
    };
    const clipboard = navigator.clipboard;
    if (!clipboard) { say('No clipboard'); return; }
    void clipboard.writeText(text).then(() => say('Copied'), () => say('Blocked'));
  });

  function open(): void {
    dock.toggleAttribute('data-open', armed);
  }

  return {
    show(el) {
      /*
       * The same element is a refresh, never a rebuild.
       *
       * The shell re-renders whenever the locked element's measurements
       * change, which editing padding does by definition. Rebuilding on that
       * threw away every control and rebuilt it: the panel scrolled back to
       * the top mid-drag, and the slider under the pointer stopped existing
       * halfway through its own gesture. Re-reading the values keeps the
       * elements, the scroll position and the gesture.
       */
      if (el === target) {
        for (const row of rows) row.sync();
        markTouched();
        return;
      }
      target = el;
      subject.textContent = el
        ? el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '')
        : '';
      build();
    },
    setArmed(next) {
      armed = next;
      open();
      if (next) build();
    },
    refresh() {
      for (const row of rows) row.sync();
      markTouched();
    },
    asText() {
      return editor.asPrompt();
    },
    destroy() {
      for (const row of rows) {
        for (const s of row.sliders) s.destroy();
        for (const s of row.scrubs) s.destroy();
      }
      rows.length = 0;
      dock.remove();
      style.remove();
    },
  };
}
