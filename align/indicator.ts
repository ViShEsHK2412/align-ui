import { GROUND, HAIRLINE, SHADOW, surface, TEXT, TYPE, WEIGHT } from './theme';

/**
 * The badge, top-right, saying the tool is running. Clicking it opens the list
 * of keys — the only discoverable place for them, since a hotkey-driven tool
 * has nowhere else to put its own instructions.
 */

export interface Indicator {
  update(locked: number): void;
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
  ['Ctrl/Cmd + Z', 'bring back the guides you just deleted'],
  ['T', 'type and token readout for the locked element'],
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
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${TEXT.primary};
  background: ${GROUND};
  box-shadow: ${SHADOW};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own — an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${surface(1)}; }
.flag .count { color: ${TEXT.secondary}; }
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
  color-scheme: light dark;
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

export function createIndicator(root: ShadowRoot): Indicator {
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

  flag.append(label, count);

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
    update(locked) {
      count.textContent = locked > 0 ? `${locked} locked` : '';
    },
    closeHelp() {
      const wasOpen = help.hasAttribute('data-open');
      help.removeAttribute('data-open');
      return wasOpen;
    },
    destroy() { flag.remove(); help.remove(); style.remove(); },
  };
}
