import { createScrub, type Scrub } from './scrub';
import { createSlider, type Slider } from './slider';
import { readValue, type Editor } from './edit';
import {
  GROUND, HAIRLINE, MOTION, ROW, SHADOW, SPACE, surface, TEXT, TYPE, WEIGHT,
} from './theme';
import { icon, type IconName } from './icons';
import { createPicker, PICKER_CSS, type Picker } from './colour-picker';
import { formatColour, formatOf, parseColour } from './oklch';
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
  /** The glyph that names the row. Every row has one. */
  glyph: IconName;
}

interface Group {
  name: string;
  specs: readonly Spec[];
  /**
   * Whether this group is worth showing for this element.
   *
   * The honest version of "conditional". In CSS every property applies to
   * every element — `getComputedStyle` answers for all of them, always — so
   * unlike Figma, which can hide Auto layout because a plain frame genuinely
   * has no such properties, this can only ever be a judgement about
   * *relevance*. Which means it has to be a judgement that is obviously right,
   * or it is a tool hiding things from you.
   *
   * Only one rule clears that bar: flex and grid properties do nothing at all
   * on an element that is neither. `flex-direction` on a block is not a
   * setting you might want, it is a setting with no effect.
   */
  when?: (el: Element) => boolean;
}

/** Is this element laid out by flex or grid? */
function isFlexOrGrid(el: Element): boolean {
  // Substring, not a word boundary: every value that means flex or grid
  // contains the word, and every value that does not, does not.
  const d = getComputedStyle(el).display;
  return d.includes('flex') || d.includes('grid');
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
      { prop: 'font-size', label: 'Size', kind: 'length', glyph: 'fontSize', min: 8, max: 96, step: 1, unit: 'px' },
      { prop: 'font-weight', label: 'Weight', kind: 'number', glyph: 'fontWeight', min: 100, max: 900, step: 100 },
      { prop: 'line-height', label: 'Line height', kind: 'length', glyph: 'lineHeight', min: 0, max: 96, step: 1, unit: 'px' },
      { prop: 'letter-spacing', label: 'Tracking', kind: 'length', glyph: 'tracking', min: -4, max: 12, step: 0.1, unit: 'px' },
      { prop: 'font-style', label: 'Style', kind: 'choice', glyph: 'italic', options: ['normal', 'italic'], more: true },
      { prop: 'text-align', label: 'Align', kind: 'choice', glyph: 'textAlign', options: ['start', 'center', 'end', 'justify'], more: true },
      { prop: 'text-transform', label: 'Case', kind: 'choice', glyph: 'textCase', options: ['none', 'uppercase', 'lowercase', 'capitalize'], more: true },
      { prop: 'text-decoration-line', label: 'Decoration', kind: 'choice', glyph: 'underline', options: ['none', 'underline', 'line-through'], more: true },
    ],
  },
  {
    name: 'Colour',
    specs: [
      { prop: 'color', label: 'Text', kind: 'colour', glyph: 'textColour' },
      { prop: 'background-color', label: 'Background', kind: 'colour', glyph: 'backgroundColour' },
      { prop: 'border-color', label: 'Border', kind: 'colour', glyph: 'borderColour', more: true },
      { prop: 'opacity', label: 'Opacity', kind: 'number', glyph: 'opacity', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    name: 'Box',
    specs: [
      { prop: 'padding', label: 'Padding', kind: 'length', glyph: 'padding', min: 0, max: 128, step: 1, unit: 'px', sides: SIDES.map((s) => `padding-${s}`) },
      { prop: 'margin', label: 'Margin', kind: 'length', glyph: 'margin', min: -64, max: 128, step: 1, unit: 'px', sides: SIDES.map((s) => `margin-${s}`) },
      { prop: 'width', label: 'Width', kind: 'length', glyph: 'widthIcon', min: 0, max: 1600, step: 1, unit: 'px', more: true },
      { prop: 'height', label: 'Height', kind: 'length', glyph: 'heightIcon', min: 0, max: 1200, step: 1, unit: 'px', more: true },
      { prop: 'box-sizing', label: 'Sizing', kind: 'choice', glyph: 'boxSizing', options: ['content-box', 'border-box'] },
    ],
  },
  {
    name: 'Border',
    specs: [
      { prop: 'border-width', label: 'Width', kind: 'length', glyph: 'borderWidth', min: 0, max: 24, step: 1, unit: 'px', sides: SIDES.map((s) => `border-${s}-width`) },
      { prop: 'border-style', label: 'Style', kind: 'choice', glyph: 'borderStyle', options: ['none', 'solid', 'dashed', 'dotted'] },
      { prop: 'border-radius', label: 'Radius', kind: 'length', glyph: 'borderRadius', min: 0, max: 64, step: 1, unit: 'px', sides: CORNERS },
    ],
  },
  {
    name: 'Effects',
    specs: [
      { prop: 'box-shadow', label: 'Shadow', kind: 'shadow', glyph: 'shadow' },
      {
        prop: 'backdrop-filter', label: 'Backdrop blur', kind: 'blur', glyph: 'backdrop',
        min: 0, max: 40, step: 1, unit: 'px', more: true,
      },
    ],
  },
  {
    name: 'Layout',
    when: isFlexOrGrid,
    specs: [
      { prop: 'display', label: 'Display', kind: 'choice', glyph: 'boxSizing', options: ['block', 'flex', 'grid', 'inline-flex', 'inline-block', 'none'] },
      { prop: 'flex-direction', label: 'Direction', kind: 'choice', glyph: 'flexDirection', options: ['row', 'column', 'row-reverse', 'column-reverse'], more: true },
      { prop: 'justify-content', label: 'Justify', kind: 'choice', glyph: 'justify', options: ['flex-start', 'center', 'flex-end', 'space-between'], more: true },
      { prop: 'align-items', label: 'Align', kind: 'choice', glyph: 'alignItems', options: ['stretch', 'flex-start', 'center', 'flex-end'], more: true },
      { prop: 'flex-wrap', label: 'Wrap', kind: 'choice', glyph: 'flexWrap', options: ['nowrap', 'wrap'], more: true },
      { prop: 'gap', label: 'Gap', kind: 'length', glyph: 'gap', min: 0, max: 96, step: 1, unit: 'px' },
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

const CSS = PICKER_CSS + `
/*
 * The reset the shadow root does not come with.
 *
 * The host sets all:initial, which stops the page's styles leaking in and also
 * means there is no box-sizing rule at all, so padding and borders are added
 * outside a flex-computed width. The hex field's 12px of padding and 2px of
 * border did exactly that: the colour rows measured 306px inside a 294px
 * column and hung past every other row in the panel.
 *
 * Scoped to the dock so it cannot reach the page.
 */
.edit-dock, .edit-dock * { box-sizing: border-box; }

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
  .edit-action:active { scale: 1; }
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
/*
 * minmax(0, 1fr), not 1fr.
 *
 * A grid track sized 1fr still refuses to go below its content's min-content
 * width, so one row whose contents will not shrink drags the whole column
 * wider than the panel. That is what made the colour rows 306px inside a 294px
 * column and hang past every other row: an input carries an intrinsic width
 * from its size attribute, and the track grew to fit it.
 */
.edit-rows { display: grid; grid-template-columns: minmax(0, 1fr); gap: ${SPACE.base}px; }
/*
 * A per-side group is four controls in two rows, with 4px between them. Eight
 * outside that is only twice the gap inside, which is the floor, and at this
 * density it read as one undifferentiated block of eight numbers: padding and
 * margin ran together. Four more each side makes it sixteen between two
 * groups and twelve against a plain row.
 */
.edit-row[data-grouped] { margin-block: ${SPACE.tight}px; }

/*
 * A row the tool has written shows its revert control and nothing else.
 *
 * There was a bar down the leading edge as well, which said the same thing
 * twice: the revert arrow only appears on a touched row, so it already marks
 * which rows are the tool's doing, and it is a control rather than a stripe.
 * Two marks for one fact is noise in a panel with twenty rows in it.
 */
.edit-row { position: relative; }

/*
 * A row is an alignment, not a container.
 *
 * It used to carry a surface of its own, so every control sat in a box inside
 * a box: the slider has a track, the badge has a chip, the hex field has a
 * border, and each of them was then wrapped again in a rectangle that did no
 * work. Twenty of those down a 320px panel is the boxed-in, over-
 * compartmentalised look, and the fix for it is to drop the outer one rather
 * than to space it better.
 *
 * The padding goes with it. Without a box to inset from, the controls align
 * to the panel's own edge, and every row in the panel starts at the same
 * place.
 */
.edit-line {
  display: flex; align-items: center; gap: ${SPACE.base}px;
  min-height: ${ROW}px;
}
.edit-glyph {
  flex: none;
  display: grid; place-items: center;
  width: 15px; height: 15px;
  color: ${TEXT.tertiary};
}

.edit-label {
  flex: none; width: 74px;
  color: ${TEXT.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
/*
 * A segmented control: the options share the row rather than huddling at the
 * left with the rest of it empty. Nothing was ever going to fill that space,
 * so it read as a control that had failed to lay itself out.
 *
 * They wrap when there are too many to fit, and a wrapped row shares its own
 * width, so six display values come out as two even rows rather than four and
 * a ragged two.
 */
/* The group has to grow before its buttons can share anything: it is itself a
   flex item, and a flex item is content-sized until told otherwise. */
.edit-choice { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 2px; }
.edit-choice .edit-opt { flex: 1 1 auto; }
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

/*
 * The colour field is one control, not two sitting next to each other.
 *
 * It used to be a swatch with its own hairline ring beside a hex input with
 * its own border, on a panel whose every other row has neither. Both edges
 * were redundant with a fill that already drew them, and both measured under
 * 1.2:1 against what they sat on, so neither could have identified a control
 * even where the rules ask a border to. One surface now holds both halves:
 * the swatch is a flush block of the value itself, the hex is the rest.
 */
.edit-colour {
  flex: 1; min-width: 0;
  display: flex; align-items: stretch;
  height: 24px;
  background: ${surface(1)};
}
.edit-colour:focus-within { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.edit-swatch {
  flex: none; width: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: var(--swatch, transparent);
  /* The value can be translucent, and a swatch that hides that is lying. */
  background-image: linear-gradient(var(--swatch, transparent), var(--swatch, transparent)),
    ${'conic-gradient(' + HAIRLINE + ' 0 25%, transparent 0 50%, ' + HAIRLINE + ' 0 75%, transparent 0)'};
  background-size: auto, 8px 8px;
  background-position: 0 0, 0 0;
  cursor: pointer;
}
.edit-swatch:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }
.edit-hex {
  flex: 1; min-width: 0;
  padding: 0 6px;
  border: 0; border-radius: 0;
  background: none; color: ${TEXT.primary};
  font: inherit; font-size: ${TYPE.tag}px;
  font-variant-numeric: tabular-nums;
}
/* The field owns the focus ring now; the input inside it does not draw a second. */
.edit-hex:focus-visible { outline: none; }

.edit-row-name {
  display: flex; align-items: center; gap: 6px;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${SPACE.tight}px;
  color: ${TEXT.secondary};
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.regular};
}
.edit-row-name .edit-glyph { color: ${TEXT.tertiary}; }
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
.edit-swatch-solo { width: 24px; height: 24px; }
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
  /*
   * Every open colour popover. It is portalled to the shadow root rather than
   * parented to its row, so clearing the body would leave it on screen with
   * nothing behind it - the classic orphaned dropdown.
   */
  const colourTeardown: Array<() => void> = [];
  function closePickers(): void {
    for (const close of colourTeardown.splice(0)) close();
  }
  /** Which per-side groups are writing all four at once. */
  const linked = new Set<string>();

  function updateFooter(): void {
    const n = editor.changes().length;
    count.textContent = n === 0 ? 'No changes' : `${n} change${n === 1 ? '' : 's'}`;
    copyBtn.disabled = n === 0;
    revertBtn.disabled = n === 0;
  }

  /**
   * Which rows the tool has written.
   *
   * Nothing renders this any more — the per-row revert was the only thing that
   * did, and it is gone. The attribute stays because it is still true and
   * still cheap, and because the footer count below is computed in the same
   * pass. If the panel ever needs a boxless way to say "this one is mine", the
   * hook is already here.
   */
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

  /**
   * Dismiss a popover on a press somewhere else.
   *
   * Two listeners, because one cannot see both sides of a closed shadow root.
   *
   * The root this panel lives in is closed, so `composedPath()` read from a
   * document listener stops at the host: a press on the picker and a press on
   * the page produce the same path, and the picker closed itself the moment
   * you touched it. That is the same trap `fromOurUI` steps around by testing
   * the host rather than anything inside it.
   *
   * So the decision is made on whichever side the press happened. Inside the
   * root, where the path is whole, the picker can tell its own controls from
   * the rest of the panel. Outside it, every press is someone else's and the
   * only question is whether it reached us at all.
   */
  function dismissOn(
    keep: HTMLElement,
    isInside: (node: Node | null) => boolean,
    close: () => void,
  ): () => void {
    const inRoot = (e: Event): void => {
      const path = e.composedPath();
      if (path.includes(keep)) return;
      if (path.some((n) => n instanceof Node && isInside(n))) return;
      close();
    };
    const onPage = (e: Event): void => {
      // Ours, so the listener above has already had its say.
      const path = e.composedPath?.() ?? [];
      if (path.includes(root.host)) return;
      close();
    };
    root.addEventListener('pointerdown', inRoot, true);
    document.addEventListener('pointerdown', onPage, true);
    return () => {
      root.removeEventListener('pointerdown', inRoot, true);
      document.removeEventListener('pointerdown', onPage, true);
    };
  }

  function buildColour(spec: Spec): { el: HTMLElement; sync: () => void } {
    const wrap = document.createElement('div');
    wrap.className = 'edit-colour';

    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'edit-swatch';
    swatch.setAttribute('aria-haspopup', 'dialog');
    swatch.setAttribute('aria-expanded', 'false');
    swatch.setAttribute('aria-label', `Pick the ${spec.label.toLowerCase()} colour`);

    const hex = document.createElement('input');
    hex.type = 'text';
    hex.className = 'edit-hex';
    hex.spellcheck = false;
    hex.setAttribute('aria-label', `${spec.label} colour`);

    let picker: Picker | null = null;
    let undismiss: (() => void) | null = null;

    function closePicker(): void {
      undismiss?.();
      undismiss = null;
      picker?.destroy();
      picker = null;
      swatch.setAttribute('aria-expanded', 'false');
    }

    swatch.addEventListener('click', () => {
      if (picker) { closePicker(); return; }
      picker = createPicker(root, {
        anchor: swatch,
        value: hex.value || '#000000',
        onChange: (value) => {
          hex.value = value;
          paint(value);
          write(spec.prop, value);
        },
      });
      swatch.setAttribute('aria-expanded', 'true');
      undismiss = dismissOn(swatch, (n) => picker?.contains(n) ?? false, closePicker);
    });

    hex.addEventListener('change', () => {
      const value = hex.value.trim();
      /*
       * Refused rather than applied blind: an unparseable colour written to an
       * element is a transparent element, and the panel would have caused it.
       * The parser is the picker's, so anything the picker can emit round-trips
       * — oklch() and display-p3 included, which the old hex-only test dropped.
       */
      if (!parseColour(value)) { sync(); return; }
      paint(value);
      picker?.update(value);
      write(spec.prop, value);
    });

    function paint(value: string): void {
      swatch.style.setProperty('--swatch', value);
    }

    function sync(): void {
      const current = target ? readValue(target, spec.prop) : '';
      const parsed = parseColour(current);
      /*
       * Shown in the notation the page is written in where that parses, so a
       * value the author wrote as oklch() does not come back as a hex
       * approximation of itself the first time the panel looks at it.
       */
      const value = parsed ? formatColour(parsed, formatOf(current)) : current;
      if (document.activeElement !== hex && root.activeElement !== hex) {
        hex.value = value;
      }
      paint(value);
      picker?.update(value);
    }

    wrap.append(swatch, hex);
    colourTeardown.push(closePicker);
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

        /*
         * The same picker as the colour rows, not the operating system's. A
         * shadow's colour is the half of it people actually tune, and the
         * native dialog cannot express the translucent black almost every real
         * shadow is - it has no alpha at all.
         */
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'edit-swatch edit-swatch-solo';
        swatch.setAttribute('aria-haspopup', 'dialog');
        swatch.setAttribute('aria-expanded', 'false');
        swatch.setAttribute('aria-label', `Layer ${index + 1} colour`);
        swatch.style.setProperty('--swatch', layer.colour);
        let layerPicker: Picker | null = null;
        let unlisten: (() => void) | null = null;
        const closeLayerPicker = (): void => {
          unlisten?.();
          unlisten = null;
          layerPicker?.destroy();
          layerPicker = null;
          swatch.setAttribute('aria-expanded', 'false');
        };
        swatch.addEventListener('click', () => {
          if (layerPicker) { closeLayerPicker(); return; }
          layerPicker = createPicker(root, {
            anchor: swatch,
            value: layer.colour || 'rgb(0 0 0 / 0.2)',
            onChange: (value) => {
              swatch.style.setProperty('--swatch', value);
              layers[index] = { ...layer, colour: value };
              layer = layers[index]!;
              push();
            },
          });
          swatch.setAttribute('aria-expanded', 'true');
          unlisten = dismissOn(
            swatch,
            (n) => layerPicker?.contains(n) ?? false,
            closeLayerPicker,
          );
        });
        colourTeardown.push(closeLayerPicker);

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
        /*
         * A second layer starts as a copy of the one above it, not from zero.
         *
         * Stacked shadows are almost always one shadow described twice - the
         * same colour and offset at a different blur and spread, which is how
         * every real elevation ramp is built. Starting from the defaults threw
         * away the colour you had just chosen and made you set it again before
         * you could see anything at all. Copying means the new layer is
         * already in the same family, and the first drag is the difference you
         * actually came to make.
         */
        layers = [...layers, { ...(layers[layers.length - 1] ?? EMPTY_SHADOW) }];
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

    /*
     * No per-row revert.
     *
     * It appeared on any row the tool had written, which meant a control that
     * came and went as you worked and shifted the row's contents when it did.
     * Revert all in the footer is the escape hatch, and undo is the one people
     * actually reach for.
     */

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
    const glyph = document.createElement('span');
    glyph.className = 'edit-glyph';
    glyph.appendChild(icon(spec.glyph, 15));

    const labelled = !spec.sides && spec.kind === 'colour';
    if (labelled) line.prepend(glyph, label);
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
    // Rows that are a group of controls rather than one, so the spacing can
    // give them room the single rows do not need.
    if (spec.sides || spec.kind === 'shadow') row.setAttribute('data-grouped', '');

    if (spec.sides || spec.kind === 'shadow' || spec.kind === 'choice') {
      // The glyph rides with the name, so a row whose control sits underneath
      // still leads with the same 15px column as one whose control is beside
      // it. Without that the panel has two different leading edges.
      const above = document.createElement('span');
      above.className = 'edit-row-name';
      above.append(glyph, document.createTextNode(spec.label));
      // Appended before the line, so the DOM order is the reading order.
      // Reversing it in CSS instead put the name under its own grid and
      // directly above the next one, where it named the wrong thing.
      row.appendChild(above);
    }
    if (!labelled && !spec.sides && spec.kind !== 'shadow' && spec.kind !== 'choice') {
      line.appendChild(glyph);
    }
    line.appendChild(field);
    row.appendChild(line);
    return { spec, el: row, sliders, scrubs, sync: () => { for (const s of syncs) s(); } };
  }

  function build(): void {
    closePickers();
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
      if (group.when && !group.when(target)) continue;
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
      closePickers();
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
