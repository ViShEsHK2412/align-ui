import {
  coloursOf, gapDistribution, looksLikeColour, matchColourTokens, ownText,
  diffOf, parentLayoutOf,
  selectorOf, similarCount, stylingRules, tokenSummary, tokensInScope,
  typographyOf,
} from './inspect';
import { bandsOf, fmt, scaleOf } from './measure';
import {
  GROUND, HAIRLINE, SHADOW, SHADOW_LIFTED, surface, TEXT, TYPE, WEIGHT,
} from './theme';
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
  /**
   * A lock changed: re-render, and open unless the user closed the panel.
   * `gaps` are the measured gaps within the locked set, already accounted for
   * by the caller, which is the only place that knows which boxes are paired.
   */
  show(box: Box, gaps?: GapLine[], against?: Box): void;
  /** Show or hide the type readout. */
  toggleType(): void;
  /** Whether the type readout is showing, for the toolbar. */
  showsType(): boolean;
  /** Whether the panel is up at all, for the toolbar. */
  isOpen(): boolean;
  /** The panel's numbers as text, for the clipboard. */
  asText(): string;
  /** Nothing is locked any more. */
  hide(): void;
  /** The user asked for it back, or asked it to go away. */
  toggle(): void;
  destroy(): void;
}

/** One measured gap, and where its number came from. */
export interface GapLine {
  px: number;
  detail: string;
}

type Region = 'margin' | 'border' | 'padding';

/** Joining clipboard lines; written out so it survives a source rewrite. */
const NEWLINE = String.fromCharCode(10);

const MARGIN = 16;      // gap from the viewport edge, and the drag clamp

const CSS = `
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${MARGIN}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${TEXT.primary};
  --muted: ${TEXT.secondary};
  --border: ${HAIRLINE};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now — box, tokens, styled by, matches, colour — and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${MARGIN * 2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${TYPE.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${GROUND};

  box-shadow: ${SHADOW};

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

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${GROUND};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${SHADOW_LIFTED}; }
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
  margin-left: 4px;
  color: ${TEXT.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${TYPE.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${surface(1)}; }

/* Each region is one step up Fluid's surface ladder. Depth is carried by the
   surface and its shadow — no borders, the same way the system's own nesting
   example reads. Generous, even insets so each surface has room to breathe. */
.region {
  border-radius: 0;
  /* Symmetric. An extra-tall top to clear the label offset each box's centre
     from its parent's, and nesting compounded it until the side numbers were
     visibly staggered. The label shares the top number's line instead. */
  padding: 10px;
}
.region[data-level="1"] { background: ${surface(1)}; }
.region[data-level="2"] { background: ${surface(2)}; }
.region[data-level="3"] { background: ${surface(3)}; }
.content { background: ${surface(4)}; }

/* The label and the top number sit on one line, and a label set 1px off the
   number it introduces is the kind of thing this tool exists to catch. Equal
   side columns keep the number centred on the region whatever the label says;
   a label wider than its column overflows rather than shifting the number. */
.head {
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
}
/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  justify-self: start; white-space: nowrap;
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

/* Type and tokens sit under the box, in the same muted register as the band
   labels — they annotate the measurement rather than competing with it. */
.readout {
  margin-top: 10px; padding-top: 10px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: 5px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 8px; align-items: baseline;
  font-size: ${TYPE.tag}px; line-height: 1.5;
}
.readout-row { display: contents; }
.readout-key { color: var(--muted); white-space: nowrap; }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
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

  /** Off by default: a tool that reopens in a mode you forgot looks broken. */
  let showType = false;

  /** A labelled block under the box, one row per fact. */
  function readout(title: string, rows: [string, string][]): HTMLElement {
    const el = document.createElement('div');
    el.className = 'readout';
    const tag = document.createElement('div');
    tag.className = 'tag readout-tag';
    tag.textContent = title;
    el.appendChild(tag);
    const grid = document.createElement('div');
    grid.className = 'readout-rows';
    el.appendChild(grid);
    for (const [label, value] of rows) {
      const row = document.createElement('div');
      row.className = 'readout-row';
      const k = document.createElement('span');
      k.className = 'readout-key';
      k.textContent = label;
      const v = document.createElement('span');
      v.className = 'readout-value';
      v.textContent = value;
      row.append(k, v);
      grid.appendChild(row);
    }
    return el;
  }
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

    // The label and the top number share a line, so they share a baseline too.
    const head = document.createElement('div');
    head.className = 'head';
    head.append(tag, edge(top));

    el.append(head, row, edge(bottom));
    return el;
  }

  return {
    show(box, gaps = [], against) {
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

      const parts: HTMLElement[] = [
        header,
        region('margin', 1, b.margin,
          region('border', 2, b.border,
            region('padding', 3, b.padding, content))),
      ];

      // Type, only when asked for. Line-height is spacing, so this is the same
      // job as the box above it rather than a second tool bolted on.
      if (showType) {
        const text = ownText(box.el);
        const rows = typographyOf(box.el);
        parts.push(rows.length && text
          ? readout('type', rows.map((r) => [r.label, r.value] as [string, string]))
          : readout('type', [['', 'nothing of its own to set type on']]));
      }

      // What is different about this one and the one locked before it. The
      // question behind most of these sessions is "these two should match and
      // they don't", and answering it by measuring each in turn and comparing
      // by eye is exactly the work that should not need a person.
      if (against && against.el !== box.el) {
        const rows = diffOf(against.el, box.el)
          .map((d) => [d.prop, `${d.a || '—'} → ${d.b || '—'}`] as [string, string]);
        // Capped: two elements that differ in twenty ways are two different
        // elements, and the list stops being an answer somewhere before that.
        const shown = rows.slice(0, 10);
        if (rows.length > shown.length) {
          shown.push(['', `and ${rows.length - shown.length} more`]);
        }
        parts.push(readout(
          `differs from ${against.label}`,
          shown.length ? shown : [['', 'nothing in the properties it compares']],
        ));
      }

      // How the parent places this element. For anything inside a flex or grid
      // container this is the answer to "why is it here?", and the child's own
      // CSS usually does not contain it. Shown under type, above the gaps.
      const layout = parentLayoutOf(box.el);
      if (layout && layout.rows.length) {
        parts.push(readout(
          `laid out by ${layout.display}`,
          layout.rows.map((r) => [r.label, r.value] as [string, string]),
        ));
      }

      // Where each gap in the locked set came from. The canvas keeps showing
      // the bare number; this is the part that would not fit on a line.
      if (gaps.length) {
        const rows = gaps.map((g) => [fmt(g.px), g.detail] as [string, string]);
        const spread = gapDistribution(gaps.map((g) => g.px));
        if (spread) rows.push(['', spread]);
        parts.push(readout('gaps', rows));
      }

      // Which of this element's numbers are on the token scale, and which are
      // not. Silent on a page that defines no tokens.
      const tokens = tokensInScope(box.el);
      const summary = tokenSummary(
        [w, h, ...b.margin, ...b.border, ...b.padding,
         ...(showType ? typographyOf(box.el).map((r) => r.px) : [])],
        tokens,
      );
      if (summary) parts.push(readout('tokens', [['', summary]]));

      // Where the styling lives. Candidates in likeliest-first order, never a
      // verdict: naming the winner would mean re-deriving the cascade.
      const rules = stylingRules(box.el);
      if (rules.length) {
        parts.push(readout('styled by',
          rules.slice(0, 4).map((r) => [r.selector, r.file] as [string, string])));
      }

      // Whether a change here would be local or systemic. Only above one:
      // "1 element matches this" is not a fact anybody needs.
      const alike = similarCount(box.el);
      if (alike > 1) {
        parts.push(readout('matches', [['', `${alike} elements share ${selectorOf(box.el)}`]]));
      }

      // The same question asked of colour. Shown only where there are colour
      // tokens to compare against — without a palette this is just a picker,
      // and the point here is whether a colour is on the palette or beside it.
      const palette = tokens.filter((t) => looksLikeColour(t.value));
      if (palette.length) {
        const rows = coloursOf(box.el).map(({ label, value }) => {
          const hit = matchColourTokens(value, palette);
          return [label, hit.length ? `${value}  ${hit.join(' ')}` : `${value}  —`] as
            [string, string];
        });
        if (rows.length) parts.push(readout('colour', rows));
      }

      panel.replaceChildren(...parts);
      current = box;
      place();
      if (dismissed) return;
      // A frame first, so the browser paints the closed state before it moves.
      requestAnimationFrame(() => dock.setAttribute('data-open', ''));
    },
    showsType: () => showType,
    isOpen: () => !dismissed && current !== null,

    toggleType() {
      showType = !showType;
      if (current) this.show(current);
    },

    asText() {
      if (!current) return '';
      const b = bandsOf(current.el);
      const s = scaleOf(current.el);
      const w = current.width / s.x, h = current.height / s.y;
      const quad = (q: readonly number[]) => q.map((n) => fmt(n)).join(' ');
      const lines = [
        `${current.label}  ${fmt(w)} × ${fmt(h)}`,
        `margin   ${quad(b.margin)}`,
        `border   ${quad(b.border)}`,
        `padding  ${quad(b.padding)}`,
      ];
      if (showType) {
        for (const r of typographyOf(current.el)) lines.push(`${r.label.padEnd(8)} ${r.value}`);
      }
      return lines.join(NEWLINE);
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
