import { bandsOf, fmt, scaleOf } from './measure';
import { nest, SEMANTIC, surfaceShadow, themed, TYPE, WEIGHT } from './theme';
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
  /** A lock changed: re-render, and open unless the user closed the panel. */
  show(box: Box): void;
  /** Nothing is locked any more. */
  hide(): void;
  /** The user asked for it back, or asked it to go away. */
  toggle(): void;
  destroy(): void;
}

type Region = 'margin' | 'border' | 'padding';

const MARGIN = 16;      // gap from the viewport edge, and the drag clamp
const CARD = 3;         // the panel floats over the page: Fluid surface-3
const LIFTED = 5;       // while dragging, it lifts
const NESTED = 4;       // every nested region, so the depth reads evenly

/** `box-shadow` can't be themed with light-dark(), which takes colours only. */
const shadow = (sel: string, level: number) => `
${sel} { box-shadow: ${surfaceShadow(level, false)}; }
@media (prefers-color-scheme: dark) {
  ${sel} { box-shadow: ${surfaceShadow(level, true)}; }
}`;

const CSS = `
.dock {
  /* On .dock, not :host — the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${MARGIN}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${themed(SEMANTIC.fg)};
  --muted: ${themed(SEMANTIC.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${TYPE.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${nest(0)};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity 120ms cubic-bezier(0.2, 0, 0, 1),
              transform 120ms cubic-bezier(0.2, 0, 0, 1),
              box-shadow 120ms cubic-bezier(0.2, 0, 0, 1);
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
${shadow('.panel', CARD)}
${shadow('.dock[data-dragging] .panel', LIFTED)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
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
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  padding: 2px 5px; margin-left: -2px;
  color: ${themed(SEMANTIC.fg)}; background: ${nest(3)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${TYPE.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${nest(1)}; }

/* Each region is one step up Fluid's surface ladder. Depth is carried by the
   surface and its shadow — no borders, the same way the system's own nesting
   example reads. Generous, even insets so each surface has room to breathe. */
.region {
  position: relative; border-radius: 0;
  /* Symmetric. An extra-tall top to clear the label offset each box's centre
     from its parent's, and nesting compounded it until the side numbers were
     visibly staggered. The label shares the top number's line instead. */
  padding: 10px;
}
.region[data-level="1"] { background: ${nest(1)}; }
.region[data-level="2"] { background: ${nest(2)}; }
.region[data-level="3"] { background: ${nest(3)}; }
.content { background: ${nest(4)}; }
${shadow('.region, .content', NESTED)}

/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  position: absolute; top: 10px; left: 10px;
  font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${WEIGHT.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${WEIGHT.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${WEIGHT.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`;

/** Where the user left it. Survives closing and reopening, not a reload. */
let dockX = MARGIN;
let dockY = -1;          // -1 means "not placed yet" → default to the bottom

/** Set by the close button, cleared by the key. Outlives one panel instance. */
let dismissed = false;

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
  // Pointer capture keeps tracking when the cursor leaves the header, and the
  // offset from where it was grabbed is preserved rather than snapping to
  // centre. Feedback lands on pointer-down, not on release.
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
  let current: Box | null = null;

  // ── Rendering ─────────────────────────────────────────────────────────────
  function edge(n: number): HTMLElement {
    const el = document.createElement('div');
    el.className = 'edge';
    el.textContent = n === 0 ? '0' : fmt(n);
    if (n === 0) el.setAttribute('data-zero', '');
    return el;
  }

  function region(name: Region, level: number, values: Quad,
                  inner: HTMLElement): HTMLElement {
    const [top, right, bottom, left] = values;
    const el = document.createElement('div');
    el.className = 'region';
    el.setAttribute('data-level', String(level));

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = name;

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

      // Everything here is LAYOUT px — the numbers you would edit in CSS.
      // getComputedStyle already reports layout values, so the size is divided
      // back out of the rendered rect rather than mixing the two spaces, which
      // made the content line wrong by (border + padding) x (1 - scale).
      const s = scaleOf(box.el);
      const w = box.width / s.x;
      const h = box.height / s.y;
      const scaled = Math.abs(s.x - 1) > 0.001 || Math.abs(s.y - 1) > 0.001;

      const header = document.createElement('header');
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = box.label;
      const size = document.createElement('span');
      size.className = 'size';
      size.textContent = `${fmt(w)} × ${fmt(h)}`;
      const close = document.createElement('button');
      close.className = 'close';
      close.textContent = '×';
      close.title = 'close (B brings it back)';
      // The header is the drag handle, so the button has to claim its own
      // pointerdown or a click on it would start a drag instead.
      close.addEventListener('pointerdown', (e) => e.stopPropagation());
      close.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissed = true;
        dock.removeAttribute('data-open');
      });

      header.append(name, size);
      if (scaled) {
        // Say which space these numbers are in, and what they render as.
        const badge = document.createElement('span');
        badge.className = 'scale';
        badge.textContent = `×${fmt(s.x)}`;
        badge.title = `renders at ${fmt(box.width)} × ${fmt(box.height)}`;
        header.appendChild(badge);
      }
      header.appendChild(close);
      header.addEventListener('pointerdown', onPointerDown);
      header.addEventListener('pointermove', onPointerMove);
      header.addEventListener('pointerup', onPointerUp);
      header.addEventListener('pointercancel', onPointerUp);

      const content = document.createElement('div');
      content.className = 'content';
      content.textContent = `${fmt(w - bl - br - pl - pr)} × ${fmt(h - bt - bb - pt - pb)}`;

      panel.replaceChildren(
        header,
        region('margin', 1, b.margin,
          region('border', 2, b.border,
            region('padding', 3, b.padding, content))),
      );
      current = box;
      place();
      if (dismissed) return;
      // A frame first, so the browser paints the closed state before it moves.
      requestAnimationFrame(() => dock.setAttribute('data-open', ''));
    },
    hide() { current = null; dock.removeAttribute('data-open'); },
    toggle() {
      if (!current) return;              // nothing locked, nothing to show
      dismissed = !dismissed;
      if (dismissed) dock.removeAttribute('data-open');
      else { place(); dock.setAttribute('data-open', ''); }
    },
    destroy() {
      removeEventListener('resize', place);
      dock.remove();
      style.remove();
    },
  };
}
