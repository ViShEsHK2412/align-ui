import { bandsOf, fmt } from './measure';
import { alpha, BAND, BAND_INK, TYPE, WEIGHT } from './theme';
import type { Box, Quad } from './types';

/**
 * The box model panel. The second of the two modules allowed to write to the
 * DOM. Elements are built, never assembled from HTML strings — labels come off
 * the host page and would otherwise need escaping.
 *
 * Two nested elements on purpose:
 *   .dock   fixed position, carries the drag transform
 *   .panel  the surface, carries the enter/exit transition
 * Keeping them apart means dragging can't fight the entrance animation.
 */

export interface BoxModel {
  show(box: Box): void;
  hide(): void;
  destroy(): void;
}

type BandName = 'margin' | 'border' | 'padding';

const MARGIN = 16;      // gap from the viewport edge, and the drag clamp

const CSS = `
.dock {
  /* On .dock, not :host — the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${MARGIN}px; top: 0; width: 320px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath it. */
  pointer-events: none; user-select: none;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.panel {
  padding: 10px; border-radius: 12px;
  font-size: ${TYPE.body}px; line-height: 1.4;
  color: light-dark(oklch(0.205 0 0), oklch(0.97 0 0));
  background: light-dark(oklch(1 0 0), oklch(0.264 0 0));
  box-shadow:
    light-dark(0 0 0 1px oklch(0 0 0 / 0.06), inset 0 0 0 1px oklch(1 0 0 / 0.04)),
    light-dark(0 1px 1px -0.5px oklch(0 0 0 / 0.06), 0 1px 1px -0.5px oklch(0 0 0 / 0.18)),
    light-dark(0 3px 3px -1.5px oklch(0 0 0 / 0.06), 0 3px 3px -1.5px oklch(0 0 0 / 0.18)),
    light-dark(0 6px 6px -3px oklch(0 0 0 / 0.06), 0 6px 6px -3px oklch(0 0 0 / 0.18));

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity 120ms cubic-bezier(0.2, 0, 0, 1),
              transform 120ms cubic-bezier(0.2, 0, 0, 1);
}
.dock[data-open] .panel {
  pointer-events: auto;
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
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid light-dark(oklch(0.205 0 0 / 0.1), oklch(0.97 0 0 / 0.1));
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${TYPE.title}px; font-weight: ${WEIGHT.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${TYPE.body}px; font-weight: ${WEIGHT.medium};
  color: light-dark(oklch(0.556 0 0), oklch(0.715 0 0));
}

/* Each band names itself in its own hue, so label and region can't be mixed up. */
.band {
  position: relative; border-radius: 4px; border: 1px solid;
  padding: 20px 5px 5px;
}
.band > .tag {
  position: absolute; top: 4px; left: 6px;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  letter-spacing: 0.02em; line-height: 1;
}
.edge {
  text-align: center; font-weight: ${WEIGHT.medium}; line-height: 1;
  white-space: nowrap;
}
.row { display: flex; align-items: center; gap: 4px; margin: 5px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }
.zero { color: light-dark(oklch(0.556 0 0), oklch(0.715 0 0)); opacity: 0.55; }

.content {
  border-radius: 3px; padding: 9px 6px;
  text-align: center; font-weight: ${WEIGHT.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  background: oklch(0.72 0 0 / 0.16);
}
`;

/** Where the user left it. Survives closing and reopening, not a reload. */
let dockX = MARGIN;
let dockY = -1;          // -1 means "not placed yet" → default to the bottom

export function createBoxModel(root: ShadowRoot): BoxModel {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const dock = document.createElement('div');
  dock.className = 'dock';
  const panel = document.createElement('div');
  panel.className = 'panel';
  dock.appendChild(panel);
  root.appendChild(dock);

  const clamp = (v: number, max: number) =>
    Math.min(Math.max(v, MARGIN), Math.max(MARGIN, max - MARGIN));

  function place() {
    const h = dock.offsetHeight || 300;
    if (dockY < 0) dockY = Math.max(MARGIN, innerHeight - h - MARGIN);
    dockX = clamp(dockX, innerWidth - dock.offsetWidth);
    dockY = clamp(dockY, innerHeight - h);
    dock.style.transform = `translate(${dockX - MARGIN}px, ${dockY}px)`;
  }

  // ── Drag ──────────────────────────────────────────────────────────────────
  let from: { x: number; y: number; dx: number; dy: number } | null = null;

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    from = { x: e.clientX, y: e.clientY, dx: dockX, dy: dockY };
    dock.setAttribute('data-dragging', '');
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!from) return;
    dockX = from.dx + (e.clientX - from.x);
    dockY = from.dy + (e.clientY - from.y);
    place();
  }

  function onPointerUp() {
    from = null;
    dock.removeAttribute('data-dragging');
  }

  addEventListener('resize', place);

  // ── Rendering ─────────────────────────────────────────────────────────────
  function edge(n: number): HTMLElement {
    const el = document.createElement('div');
    el.className = 'edge';
    el.textContent = n === 0 ? '–' : fmt(n);
    if (n === 0) el.classList.add('zero');
    return el;
  }

  function band(name: BandName, values: Quad, inner: HTMLElement): HTMLElement {
    const [top, right, bottom, left] = values;
    const el = document.createElement('div');
    el.className = 'band';
    el.style.background = alpha(BAND[name], 0.12);
    el.style.borderColor = alpha(BAND[name], 0.4);

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = name;
    tag.style.color = BAND_INK[name];

    const row = document.createElement('div');
    row.className = 'row';
    const fill = document.createElement('div');
    fill.className = 'fill';
    fill.appendChild(inner);
    row.append(edge(left), fill, edge(right));

    el.append(tag, edge(top), row, edge(bottom));
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
      header.addEventListener('pointerdown', onPointerDown);
      header.addEventListener('pointermove', onPointerMove);
      header.addEventListener('pointerup', onPointerUp);
      header.addEventListener('pointercancel', onPointerUp);

      const content = document.createElement('div');
      content.className = 'content';
      content.textContent =
        `${fmt(box.width - bl - br - pl - pr)} × ${fmt(box.height - bt - bb - pt - pb)}`;

      panel.replaceChildren(
        header,
        band('margin', b.margin, band('border', b.border, band('padding', b.padding, content))),
      );
      place();
      // A frame first, so the browser paints the closed state before it moves.
      requestAnimationFrame(() => dock.setAttribute('data-open', ''));
    },
    hide() { dock.removeAttribute('data-open'); },
    destroy() {
      removeEventListener('resize', place);
      dock.remove();
      style.remove();
    },
  };
}
