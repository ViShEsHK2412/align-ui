import { createSlider, type Slider } from './slider';
import { readValue, type Editor } from './edit';
import {
  GROUND, HAIRLINE, MOTION, ROW, SHADOW, SPACE, surface, TEXT, TYPE, WEIGHT,
} from './theme';
import { icon } from './icons';

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

type Kind = 'length' | 'number' | 'colour' | 'choice';

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
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  padding: ${SPACE.base}px;
}
/* Nothing a control does may push the panel wider than the panel. */
.edit-line > * { min-width: 0; }

.edit-group + .edit-group { margin-top: ${SPACE.roomy}px; }
.edit-group-name {
  display: block;
  margin: 0 0 ${SPACE.tight}px 2px;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${TEXT.tertiary};
}
.edit-rows { display: grid; gap: 6px; }

/* A row the tool has written. The bar is on the leading edge so a column of
   rows shows at a glance which of them are the tool's doing and which are the
   page's, without a word of text per row. */
.edit-row { position: relative; }
.edit-row[data-touched]::before {
  content: '';
  position: absolute; left: -${SPACE.base}px; top: 0; bottom: 0;
  width: 2px;
  background: ${TEXT.primary};
}

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
  padding: 5px 7px; border: 0; border-radius: 0;
  background: ${surface(2)}; color: ${TEXT.secondary};
  font: inherit; font-size: ${TYPE.tag}px; cursor: pointer;
  transition: background ${MOTION.ui}, color ${MOTION.ui};
}
.edit-opt:hover { background: ${surface(4)}; color: ${TEXT.primary}; }
.edit-opt[data-on] { background: ${TEXT.primary}; color: ${GROUND}; }

.edit-swatch {
  flex: none; width: 22px; height: 22px;
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

.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }
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
  width: 22px; height: 22px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${TEXT.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${TEXT.primary}; }
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
}

export function createControls(root: ShadowRoot, editor: Editor): Controls {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const dock = document.createElement('div');
  dock.className = 'edit-dock';

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

  function buildChoice(spec: Spec): { el: HTMLElement; sync: () => void } {
    const wrap = document.createElement('div');
    wrap.className = 'edit-choice';
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
      for (const b of buttons) b.toggleAttribute('data-on', b.textContent === current);
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
    const syncs: (() => void)[] = [];

    if (spec.sides) {
      const grid = document.createElement('div');
      grid.className = 'edit-sides';
      grid.style.flex = '1';
      for (const side of spec.sides) {
        // The last word is the side, which is what the row is asking about.
        const short = side.split('-').filter((p) => p !== 'border' && p !== 'radius' && p !== 'width').pop() ?? side;
        const built = buildSlider(spec, side, short);
        sliders.push(built.slider);
        syncs.push(built.sync);
        grid.appendChild(built.el);
      }
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'edit-linked';
      link.setAttribute('aria-label', `Link all four ${spec.label.toLowerCase()} values`);
      link.title = 'Change all four together';
      link.appendChild(icon('copy', 13));
      link.addEventListener('click', () => {
        if (linked.has(spec.prop)) linked.delete(spec.prop);
        else linked.add(spec.prop);
        link.toggleAttribute('data-on', linked.has(spec.prop));
      });
      field.append(grid, link);
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
    const labelled = !spec.sides && (spec.kind === 'choice' || spec.kind === 'colour');
    if (labelled) line.appendChild(label);
    line.append(field, revert);
    row.appendChild(line);
    return { spec, el: row, sliders, sync: () => { for (const s of syncs) s(); } };
  }

  function build(): void {
    for (const row of rows) for (const s of row.sliders) s.destroy();
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

  copyBtn.addEventListener('click', () => {
    const text = editor.asPrompt();
    if (!text) return;
    void navigator.clipboard?.writeText(text).catch(() => { /* denied */ });
  });

  function open(): void {
    dock.toggleAttribute('data-open', armed);
  }

  return {
    show(el) {
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
      for (const row of rows) for (const s of row.sliders) s.destroy();
      rows.length = 0;
      dock.remove();
      style.remove();
    },
  };
}
