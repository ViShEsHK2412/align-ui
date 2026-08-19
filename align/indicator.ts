import { nest, SEMANTIC, surfaceShadow, themed, TYPE, WEIGHT } from './theme';

/**
 * A small badge, top-right, saying the tool is on. Deliberately inert: no
 * pointer events, no controls, nothing to click by accident. It exists so the
 * tool can never be running without you knowing.
 */

export interface Indicator {
  update(locked: number): void;
  destroy(): void;
}

const CSS = `
.flag {
  position: fixed; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 7px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: none; user-select: none;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  letter-spacing: 0.02em; line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${themed(SEMANTIC.fg)};
  background: ${nest(0)};
  box-shadow: ${surfaceShadow(3, false)};
}
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${surfaceShadow(3, true)}; }
}
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: oklch(0.693 0.161 265.2);
}
.count { color: ${themed(SEMANTIC.muted)}; }
`;

export function createIndicator(root: ShadowRoot): Indicator {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const flag = document.createElement('div');
  flag.className = 'flag';
  const dot = document.createElement('span');
  dot.className = 'dot';
  const label = document.createElement('span');
  label.textContent = 'align';
  const count = document.createElement('span');
  count.className = 'count';
  flag.append(dot, label, count);
  root.appendChild(flag);

  return {
    update(locked) {
      count.textContent = locked > 0 ? `${locked} locked` : '';
    },
    destroy() { flag.remove(); style.remove(); },
  };
}
