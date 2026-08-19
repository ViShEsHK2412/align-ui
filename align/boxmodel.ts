import { bandsOf, fmt } from './measure';
import { BAND, TYPE } from './theme';
import type { Box, Quad } from './types';

/**
 * The box model panel, bottom-left. The second of the two modules allowed to
 * write to the DOM. Elements are built, never assembled from HTML strings —
 * labels come off the host page and would otherwise need escaping.
 */

export interface BoxModel {
  show(box: Box): void;
  hide(): void;
  destroy(): void;
}

/**
 * Colours are written once as light-dark() pairs and flipped by color-scheme
 * (Fluid rule 7). Values are Fluid Functionalism's tokens in OKLCH.
 *
 * Radii are concentric: 12px panel with 10px padding leaves 2px inside, which
 * is also right for a box model — these are boxes, not cards.
 */
const CSS = `
.panel {
  /* On .panel, not :host — the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and make light-dark() resolve light
     on a dark page. */
  color-scheme: light dark;
  position: fixed; left: 16px; bottom: 16px; width: 232px;
  pointer-events: auto; user-select: none;
  padding: 10px; border-radius: 12px;
  font-family: ${TYPE.mono};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: light-dark(oklch(0.205 0 0), oklch(0.97 0 0));
  background: light-dark(oklch(1 0 0), oklch(0.264 0 0));
  box-shadow:
    light-dark(0 0 0 1px oklch(0 0 0 / 0.06), inset 0 0 0 1px oklch(1 0 0 / 0.04)),
    light-dark(0 1px 1px -0.5px oklch(0 0 0 / 0.06), 0 1px 1px -0.5px oklch(0 0 0 / 0.18)),
    light-dark(0 3px 3px -1.5px oklch(0 0 0 / 0.06), 0 3px 3px -1.5px oklch(0 0 0 / 0.18));

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity 120ms cubic-bezier(0.2, 0, 0, 1),
              transform 120ms cubic-bezier(0.2, 0, 0, 1);
}
.panel[data-open] {
  opacity: 1;
  transform: none;
  /* Slow in, faster out — the exit above is one tier quicker. */
  transition-duration: 160ms;
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  display: flex; align-items: baseline; gap: 8px;
  font-size: 12px; line-height: 1.4; margin-bottom: 8px;
}
header .name {
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size { color: light-dark(oklch(0.556 0 0), oklch(0.715 0 0)); }

.band {
  position: relative; border-radius: 2px;
  padding: 14px 8px 3px; text-align: center;
}
.band > .tag {
  position: absolute; top: 3px; left: 5px;
  font-size: 10px; letter-spacing: 0.01em; line-height: 1;
  color: light-dark(oklch(0.205 0 0), oklch(0.97 0 0)); opacity: 0.75;
}
.row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.v { font-size: 11px; line-height: 1; }
.v[data-zero] { color: light-dark(oklch(0.556 0 0), oklch(0.715 0 0)); opacity: 0.6; }
.content {
  border-radius: 2px; padding: 8px 6px; font-size: 11px; line-height: 1;
  background: oklch(0.72 0 0 / 0.14);
}
`;

export function createBoxModel(root: ShadowRoot): BoxModel {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const panel = document.createElement('div');
  panel.className = 'panel';
  root.appendChild(panel);

  function band(name: 'margin' | 'border' | 'padding', values: Quad,
                inner: HTMLElement): HTMLElement {
    const el = document.createElement('div');
    el.className = 'band';
    el.style.background = BAND[name].replace(/\)$/, ' / 0.14)');

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = name;
    el.appendChild(tag);

    el.appendChild(value(values[0]));                 // top
    const row = document.createElement('div');
    row.className = 'row';
    row.append(value(values[3]), inner, value(values[1]));   // left · inner · right
    el.appendChild(row);
    el.appendChild(value(values[2]));                 // bottom
    return el;
  }

  /** A zero is real information, but it is not the number you are looking for. */
  function value(n: number): HTMLElement {
    const el = document.createElement('span');
    el.className = 'v';
    el.textContent = n === 0 ? '–' : fmt(n);
    if (n === 0) el.setAttribute('data-zero', '');
    return el;
  }

  return {
    show(box) {
      const b = bandsOf(box.el);
      const [bt, br, bb, bl] = b.border;
      const [pt, pr, pb, pl] = b.padding;

      const header = document.createElement('header');
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = box.label;
      const size = document.createElement('span');
      size.className = 'size';
      size.textContent = `${fmt(box.width)} × ${fmt(box.height)}`;
      header.append(name, size);

      const content = document.createElement('div');
      content.className = 'content';
      content.textContent =
        `${fmt(box.width - bl - br - pl - pr)} × ${fmt(box.height - bt - bb - pt - pb)}`;

      panel.replaceChildren(
        header,
        band('margin', b.margin, band('border', b.border, band('padding', b.padding, content))),
      );
      // Two frames so the browser paints the closed state before transitioning.
      requestAnimationFrame(() => panel.setAttribute('data-open', ''));
    },
    hide() { panel.removeAttribute('data-open'); },
    destroy() { panel.remove(); style.remove(); },
  };
}
