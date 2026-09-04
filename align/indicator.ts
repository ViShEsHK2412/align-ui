import {
  GROUND, HAIRLINE, RULER, SHADOW, surface, TEXT, TYPE, WEIGHT,
} from './theme';

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
  /** True if it was open — lets Escape dismiss the topmost layer first. */
  closeHelp(): boolean;
  destroy(): void;
}

/** Kept next to the handlers they describe, so they can't drift apart. */
export const KEYS: [string, string][] = [
  ['Ctrl/Cmd + Shift + A', 'turn align on or off'],
  ['Hover', 'measure what is under the cursor'],
  ['Click', 'lock an element'],
  ['Right-click', 'add to, or drop from, the locked set'],
  ['Drag the panel header', 'move the box model'],
  ['B', 'hide or bring back the box model'],
  ['R', 'rulers down the top and left edges'],
  ['Drag from a rule', 'pull out a guide; drag it back to remove'],
  ['V', 'vertical guide at the cursor'],
  ['H', 'horizontal guide at the cursor'],
  ['Hover a guide', 'distance from it to every locked element'],
  ['Click a guide', 'keep those distances up; click again to release'],
  ['Arrows', 'nudge the last guide you touched; Shift for 10px'],
  ['L', 'pin that guide so it cannot be moved or deleted'],
  ['Ctrl/Cmd + Z', 'undo the last change — a run of nudges counts as one'],
  ['T', 'type and token readout for the locked element'],
  ['F', 'freeze the page so a moving thing can be measured'],
  ['G', 'your column grid, if one is configured'],
  ['K', 'a ten-pixel texture to read against'],
  ['X', 'x-ray: outline every element on the page'],
  ['P', 'pick a colour from anywhere on screen'],
  ['C', 'copy the numbers in the panel'],
  ['Ctrl/Cmd while placing', 'ignore snapping'],
  ['Del', 'remove the guide under the cursor; Shift+Del for all'],
  ['Esc', 'clear the locks, then close'],
];

/**
 * The badge's geometry, written once so the help below it can be placed from
 * the same numbers instead of a hardcoded offset that drifts when either
 * changes. Height is the line box plus the padding either side.
 */
const INSET = 16;
const FLAG_H = TYPE.tag + 12;
const STEP = 8;

const CSS = `
.flag {
  position: fixed; top: ${INSET}px; right: ${INSET}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
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
.flag .name { letter-spacing: -0.02em; }
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
  width: 20px; height: 20px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  color: ${TEXT.tertiary};
}
.tool:hover { background: ${surface(2)}; color: ${TEXT.primary}; }
.tool:focus-visible { outline: 1px solid ${TEXT.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${surface(4)}; color: ${TEXT.primary}; }
.tool[data-once]:active { background: ${surface(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${INSET + FLAG_H + STEP}px; right: ${INSET}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${INSET * 2 + FLAG_H + STEP}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${TYPE.stack};
  font-synthesis: none;
  font-size: ${TYPE.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  background: ${GROUND};
  box-shadow: ${SHADOW};
  display: none;
}
.help[data-open] { display: block; }
/* Baselines, not boxes. A key sits in a bordered chip and its description does
   not, so aligning the two boxes puts the key's text 4px below the first line
   of the text it labels — right on one-line rows by luck, wrong on every row
   that wraps. Aligning on the baseline is right on both. */
.help dl {
  display: grid; grid-template-columns: auto 1fr;
  /* Baseline alignment already buys each wrapped row 4px of separation, so
     the gap stays where it was rather than pushing the list off the screen. */
  align-items: baseline; gap: 6px 10px; margin: 0;
}
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${WEIGHT.medium};
  border: 1px solid ${HAIRLINE};
  background: ${surface(2)};
}
.help dd { margin: 0; color: ${TEXT.secondary}; }
`;

/**
 * The controls, in the three kinds they actually divide into.
 *
 * Mesurer needs a mode palette because its tools exclude one another; almost
 * nothing of ours is a mode. These are things you switch on, one thing that
 * changes the page, and things that happen once — so this is a layers bar, not
 * a palette.
 *
 * Each button is labelled with its own key. It is not a replacement for the
 * keyboard, it is how the keyboard gets learned: press the button for a week
 * and you will have the key for good.
 */
const TOOLS: { name: ToolName; label: string; title: string; toggle: boolean }[] = [
  { name: 'rulers', label: 'R', title: 'rulers down the top and left edges', toggle: true },
  { name: 'xray', label: 'X', title: 'outline every element on the page', toggle: true },
  { name: 'grid', label: 'G', title: 'your column grid, if one is configured', toggle: true },
  { name: 'pixels', label: 'K', title: 'a ten-pixel texture to read against', toggle: true },
  { name: 'type', label: 'T', title: 'type and token readout', toggle: true },
  { name: 'panel', label: 'B', title: 'the box model panel', toggle: true },
  { name: 'freeze', label: 'F', title: 'hold the page still', toggle: true },
  { name: 'copy', label: 'C', title: 'copy the numbers in the panel', toggle: false },
  { name: 'pick', label: 'P', title: 'pick a colour from anywhere on screen', toggle: false },
  { name: 'undo', label: '\u21ba', title: 'undo the last change to the guides', toggle: false },
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
    b.textContent = t.label;
    b.title = `${t.title}  \u00b7  ${t.name === 'undo' ? 'Ctrl/Cmd+Z' : t.label}`;
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
  for (const [key, what] of KEYS) {
    const dt = document.createElement('dt');
    const kbd = document.createElement('kbd');
    kbd.textContent = key;
    dt.appendChild(kbd);
    const dd = document.createElement('dd');
    dd.textContent = what;
    dl.append(dt, dd);
  }
  help.appendChild(dl);

  flag.addEventListener('click', (e) => {
    e.stopPropagation();
    help.toggleAttribute('data-open');
  });

  root.append(flag, help);

  return {
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
    destroy() { flag.remove(); help.remove(); style.remove(); },
  };
}
