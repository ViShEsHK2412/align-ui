import { nest, SEMANTIC, surfaceShadow, themed, TYPE, WEIGHT } from './theme';

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
  ['Alt while placing', 'ignore snapping'],
  ['Del', 'remove the guide under the cursor; Shift+Del for all'],
  ['Esc', 'clear the locks, then close'],
];

const CSS = `
.flag {
  position: fixed; top: 16px; right: 16px;
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
  color: ${themed(SEMANTIC.fg)};
  background: ${nest(0)};
  box-shadow: ${surfaceShadow(3, false)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own — an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${nest(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${surfaceShadow(3, true)}; }
}
.flag .count { color: ${themed(SEMANTIC.muted)}; }

.help {
  position: fixed; top: 46px; right: 16px; width: 292px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${TYPE.stack};
  font-synthesis: none;
  font-size: ${TYPE.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${themed(SEMANTIC.fg)};
  background: ${nest(0)};
  box-shadow: ${surfaceShadow(4, false)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${surfaceShadow(4, true)}; }
}
.help[data-open] { display: block; }
.help dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; }
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${WEIGHT.medium};
  border: 1px solid color-mix(in oklab, ${themed(SEMANTIC.fg)} 14%, transparent);
  background: ${nest(2)};
}
.help dd { margin: 0; align-self: center; color: ${themed(SEMANTIC.muted)}; }
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
