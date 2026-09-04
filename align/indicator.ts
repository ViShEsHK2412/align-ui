import {
  GROUND, HAIRLINE, MOTION, ROW, RULER, SHADOW, SPACE, surface, TEXT, TYPE,
  WEIGHT,
} from './theme';
import { icon, type IconName } from './icons';

/**
 * The badge, top-right, saying the tool is running. Clicking it opens the list
 * of keys — the only discoverable place for them, since a hotkey-driven tool
 * has nowhere else to put its own instructions.
 */

/** What the toolbar's toggles should currently look like. */
export interface ToolState {
  rulers: boolean;
  xray: boolean;
  grid: boolean;
  pixels: boolean;
  freeze: boolean;
  type: boolean;
  panel: boolean;
}

/** A control does one of these when pressed; index.ts owns what they mean. */
export type ToolName = 'rulers' | 'xray' | 'grid' | 'pixels' | 'freeze'
  | 'type' | 'panel' | 'copy' | 'pick' | 'undo';

export interface Indicator {
  update(locked: number, state: ToolState): void;
  /**
   * Report the outcome of a one-shot control. A clipboard write is silent and
   * so is its refusal, so a button that only says it was pressed leaves you
   * with no way to know whether anything happened.
   */
  acknowledge(name: ToolName, ok: boolean): void;
  /** True if it was open — lets Escape dismiss the topmost layer first. */
  closeHelp(): boolean;
  destroy(): void;
}

/**
 * The rows that have no button of their own: gestures, and the guide keys.
 *
 * Grouped, because an undifferentiated list of twenty-five keys is a wall. The
 * tools are not listed here — they are generated from TOOLS below, so the
 * button, its tooltip and this list cannot drift apart.
 */
const GESTURES: { title: string; rows: [string, string][] }[] = [
  {
    title: 'Pointing at things',
    rows: [
      ['Ctrl/Cmd + Shift + A', 'turn align on or off'],
      ['Hover', 'measure whatever is under the cursor'],
      ['Click', 'lock an element, so it keeps measuring after the pointer leaves'],
      ['Right-click', 'add another to the locked set, or drop one from it. Two locked also gets you a diff'],
      ['Drag the panel header', 'move the box model out of your way'],
      ['Esc', 'clear the locks, then close the tool'],
    ],
  },
  {
    title: 'Guides',
    rows: [
      ['Drag from a rule', 'pull out a guide; drag it back into the rule to throw it away'],
      ['V  /  H', 'drop a vertical or horizontal guide at the cursor'],
      ['Hover a guide', 'its distance to every locked element'],
      ['Click a guide', 'keep those distances up; click again to release'],
      ['Arrows', 'nudge the guide you last touched. Shift for 10px'],
      ['L', 'pin a guide, so it cannot be moved or deleted by accident'],
      ['Ctrl/Cmd while placing', 'ignore snapping'],
      ['Del', 'remove the guide under the cursor. Shift+Del for all of them'],
    ],
  },
];

/**
 * The badge's geometry, written once so the help below it can be placed from
 * the same numbers instead of a hardcoded offset that drifts when either
 * changes. Height is the line box plus the padding either side.
 */
/**
 * Exported because the colour picker parks under this badge, and a second copy
 * of these numbers is how it came to be 10px out of date: the bar grew from a
 * row of letters to a row of icon buttons and the picker went on positioning
 * itself against the old height, overlapping it.
 */
export const INSET = SPACE.edge;
/* A row of icon buttons, not of text: the height comes from the buttons plus
   the padding either side, which lands on the ROW the panel already uses. */
const BTN = 24;
/**
 * How long an answer stays up. Long enough to be read after you have looked
 * back at the page, short enough that it is gone before you next reach for the
 * button.
 */
const ACK_MS = 900;
export const FLAG_H = ROW;
export const STEP = SPACE.base;

const CSS = `
.flag {
  position: fixed; top: ${INSET}px; right: ${INSET}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${MOTION.ui};
  padding: ${(ROW - BTN) / 2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  background: ${GROUND};
  box-shadow: ${SHADOW};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own — an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${INSET + RULER}px; }
.help[data-rulers] { top: ${INSET + RULER + FLAG_H + STEP}px; }
.flag:hover { background: ${surface(1)}; }
.flag .count { color: ${TEXT.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${HAIRLINE};
}
.tool {
  width: ${BTN}px; height: ${BTN}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  color: ${TEXT.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${MOTION.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${surface(2)}; color: ${TEXT.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${surface(4)}; color: ${TEXT.primary}; }
.tool:focus-visible { outline: 1px solid ${TEXT.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${surface(4)}; color: ${TEXT.primary}; }

/* The badge steps down out of the ruler gutter, and that step is decoration:
   under reduced motion it should simply be in the right place. */
@media (prefers-reduced-motion: reduce) {
  .flag { transition: none; }
}
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${INSET + FLAG_H + STEP}px; right: ${INSET}px; width: 368px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${INSET * 2 + FLAG_H + STEP}px); overflow-y: auto;
  padding: ${SPACE.base}px; border-radius: 0;
  user-select: none;
  font-family: ${TYPE.stack};
  font-synthesis: none;
  font-size: ${TYPE.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  background: ${GROUND};
  box-shadow: ${SHADOW};
  /*
   * It grows out of the badge that opens it, rather than appearing whole.
   * transform-origin at the top right is the badge's corner, so the list and
   * the thing you pressed to get it stay visibly connected — the one place in
   * this tool where something opens *from* somewhere.
   *
   * Visibility rather than display, because display cannot be transitioned;
   * it is delayed out by the duration on close so the fade finishes first.
   */
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: scale(0.98) translateY(-4px);
  transform-origin: top right;
  transition: opacity ${MOTION.ui}, transform ${MOTION.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${MOTION.ui}, transform ${MOTION.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .help { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .help[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
/* Baselines, not boxes. A key sits in a bordered chip and its description does
   not, so aligning the two boxes puts the key's text 4px below the first line
   of the text it labels — right on one-line rows by luck, wrong on every row
   that wraps. Aligning on the baseline is right on both. */
.help dl {
  display: grid; grid-template-columns: 16px auto 1fr;
  /* Baseline alignment already buys each wrapped row 4px of separation, so
     the gap stays where it was rather than pushing the list off the screen. */
  align-items: baseline; gap: ${SPACE.tight}px ${SPACE.base}px; margin: 0;
}
.help dt { justify-self: start; }
/* The icon column: present for the rows that have a button, blank for the rows
   that are gestures. Blank rather than absent, so the keys stay in one column
   down the whole list instead of stepping in and out. */
.help .glyph {
  justify-self: center;
  /* Not centred: a wrapped description makes the row tall, and an icon
     floating halfway down it reads as belonging to the line it is level with
     rather than to the row it is in. Level with the first line. */
  align-self: start; margin-top: 1px;
  color: ${TEXT.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.semibold};
  color: ${TEXT.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${WEIGHT.medium};
  border: 1px solid ${HAIRLINE};
  background: ${surface(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${TEXT.secondary}; text-wrap: pretty; }
`;

/**
 * The controls, in the three kinds they actually divide into.
 *
 * Mesurer needs a mode palette because its tools exclude one another; almost
 * nothing of ours is a mode. These are things you switch on, one thing that
 * changes the page, and things that happen once — so this is a layers bar, not
 * a palette.
 *
 * Each row carries a name, a sentence saying what the control actually does,
 * and its key. The button shows only the icon; the tooltip and the key list
 * show all three, which is how the keyboard gets learned — there is nowhere
 * else for a hotkey-driven tool to teach its own hotkeys.
 */
interface Tool {
  name: ToolName;
  /** What it is called, in the tooltip and the key list. */
  label: string;
  /** What it does. A sentence, not the label said again. */
  what: string;
  key: string;
  toggle: boolean;
}

const TOOLS: Tool[] = [
  { name: 'rulers', label: 'Rulers', key: 'R', toggle: true,
    what: 'a scale down the top and left edges, in page pixels — and the gutters you drag guides out of' },
  { name: 'xray', label: 'X-ray', key: 'X', toggle: true,
    what: 'outline every element at once, to see the boxes a layout is really made of' },
  { name: 'grid', label: 'Column grid', key: 'G', toggle: true,
    what: 'the grid your design is built on, columns filled and gutters left empty. Needs one configured' },
  { name: 'pixels', label: 'Pixel grid', key: 'K', toggle: true,
    what: 'a ten-pixel lattice over the page, to read an offset off without measuring it' },
  { name: 'type', label: 'Type', key: 'T', toggle: true,
    what: 'add size, weight, line height and tracking to the panel, each checked against your scale' },
  { name: 'panel', label: 'Box model', key: 'B', toggle: true,
    what: 'the readout itself — margins, borders, padding, what places the element, what styles it' },
  { name: 'freeze', label: 'Freeze', key: 'F', toggle: true,
    what: 'hold every animation and transition where it stands, so a moving thing can be measured' },
  { name: 'copy', label: 'Copy', key: 'C', toggle: false,
    what: 'put everything in the panel on the clipboard as text' },
  { name: 'pick', label: 'Colour', key: 'P', toggle: false,
    what: 'sample a colour from anywhere on screen and match it against your palette' },
  { name: 'undo', label: 'Undo', key: 'Ctrl/Cmd + Z', toggle: false,
    what: 'step back through the guides — a whole run of nudges counts as one' },
];

export function createIndicator(
  root: ShadowRoot,
  onTool: (name: ToolName) => void,
): Indicator {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const flag = document.createElement('div');
  flag.className = 'flag';
  const label = document.createElement('span');
  label.className = 'name';
  label.textContent = 'Align';
  const count = document.createElement('span');
  count.className = 'count';

  // Freeze sits alone between the switches and the one-shots: it is the only
  // control that changes the page rather than the overlay.
  const buttons = new Map<ToolName, HTMLButtonElement>();
  const acks = new Map<ToolName, ReturnType<typeof setTimeout>>();
  const tools = document.createElement('div');
  tools.className = 'tools';
  for (const t of TOOLS) {
    if (t.name === 'freeze' || t.name === 'copy') {
      const rule = document.createElement('span');
      rule.className = 'sep';
      tools.appendChild(rule);
    }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tool';
    const glyph = icon(t.name as IconName);
    glyph.classList.add('glyph');
    b.appendChild(glyph);
    // The icon carries no words, so the name has to reach a screen reader some
    // other way — and the tooltip has to say more than the name again.
    b.setAttribute('aria-label', t.label);
    b.title = `${t.label}  ·  ${t.key}
${t.what}`;
    if (!t.toggle) b.setAttribute('data-once', '');
    b.addEventListener('click', (e) => {
      e.stopPropagation();            // the flag itself opens the key list
      onTool(t.name);
    });
    buttons.set(t.name, b);
    tools.appendChild(b);
  }

  flag.append(label, tools, count);

  const help = document.createElement('div');
  help.className = 'help';
  const dl = document.createElement('dl');

  function heading(text: string) {
    const h = document.createElement('h4');
    h.textContent = text;
    dl.appendChild(h);
  }

  /** One row: the icon if it has one, the key, and what it does. */
  function row(key: string, what: string, name?: IconName) {
    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    if (name) glyph.appendChild(icon(name, 14));
    const dt = document.createElement('dt');
    const kbd = document.createElement('kbd');
    kbd.textContent = key;
    dt.appendChild(kbd);
    const dd = document.createElement('dd');
    dd.textContent = what;
    dl.append(glyph, dt, dd);
  }

  // The tools first, because that is what the bar above shows and this is the
  // only place the icons are ever named.
  heading('The bar, left to right');
  for (const t of TOOLS) row(t.key, `${t.label} — ${t.what}`, t.name as IconName);
  for (const group of GESTURES) {
    heading(group.title);
    for (const [key, what] of group.rows) row(key, what);
  }
  help.appendChild(dl);

  flag.addEventListener('click', (e) => {
    e.stopPropagation();
    help.toggleAttribute('data-open');
  });

  root.append(flag, help);

  return {
    acknowledge(name, ok) {
      const b = buttons.get(name);
      if (!b) return;
      clearTimeout(acks.get(name));
      // Rebuilt each time rather than kept around: an answer that is not being
      // shown should not be in the DOM waiting to be mistaken for one.
      b.querySelector('.ack')?.remove();
      // The glyph carries the meaning and nothing is tinted. Red on this
      // canvas already means "a measurement", and one colour gets one job.
      const mark = icon(ok ? 'check' : 'cross');
      mark.classList.add('ack');
      b.appendChild(mark);
      // A frame before flipping the attribute, so the transition has a
      // starting value to run from instead of appearing already finished.
      requestAnimationFrame(() => b.setAttribute('data-ack', ok ? 'yes' : 'no'));
      acks.set(name, setTimeout(() => {
        b.removeAttribute('data-ack');
        // Long enough for the fade back to finish before the node goes.
        setTimeout(() => b.querySelector('.ack')?.remove(), 200);
      }, ACK_MS));
    },

    update(locked, state) {
      count.textContent = locked > 0 ? `${locked} locked` : '';
      flag.toggleAttribute('data-rulers', state.rulers);
      help.toggleAttribute('data-rulers', state.rulers);
      for (const t of TOOLS) {
        if (!t.toggle) continue;
        // Explicitly a boolean: toggleAttribute with undefined flips the
        // attribute rather than setting it, which reads as a flickering button.
        buttons.get(t.name)?.toggleAttribute('data-on', state[t.name as keyof ToolState] === true);
      }
    },
    closeHelp() {
      const wasOpen = help.hasAttribute('data-open');
      help.removeAttribute('data-open');
      return wasOpen;
    },
    destroy() {
      for (const t of acks.values()) clearTimeout(t); flag.remove(); help.remove(); style.remove(); },
  };
}
