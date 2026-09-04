/**
 * The toolbar's icons.
 *
 * Lucide geometry, inlined rather than depended on. Three reasons for that
 * shape:
 *
 *  - The tool ships as one file with no dependencies and runs inside a closed
 *    shadow root. An icon *package* would be a build-time dependency for ten
 *    glyphs and an icon *font* would be a network request into someone else's
 *    page, which is the one thing this tool tries never to be.
 *  - Lucide is the strictest-ruled of the sets in this space — 24×24 box, 2px
 *    stroke, round caps and joins, everything on a 1px grid — which is why the
 *    same geometry keeps turning up in tools like this. DialKit, whose design
 *    system the rest of this tool already follows, inlines exactly these
 *    attributes by hand for exactly the same reason.
 *  - Paths as data means an icon is a constant, not a component, and a button
 *    can be built without a framework.
 *
 * Lucide is ISC-licensed. Each entry below is its icon of that name, unchanged.
 *
 * Two Lucide icons were considered and rejected for being unreadable at 16px:
 * `snowflake` for freeze (twelve strokes, which at this size close up into a
 * blob) and `square-dashed` for x-ray (twelve dashes, same problem). `pause`
 * and `scan` say the same things in two and four strokes.
 */

/** Lucide's canonical drawing attributes. Every icon is drawn with these. */
const VIEW_BOX = '0 0 24 24';
const STROKE_WIDTH = '2';

/** One icon: the `d` of each path, in draw order. `rect` entries are boxes. */
type Shape = { path: string } | { rect: [number, number, number, number, number] };

const p = (path: string): Shape => ({ path });
/** x, y, width, height, radius — Lucide's rects all carry a corner radius. */
const r = (x: number, y: number, w: number, h: number, rx: number): Shape =>
  ({ rect: [x, y, w, h, rx] });

export const ICONS = {
  /** ruler-dimension-line — a rule with ticks, and a dimension line above it. */
  rulers: [
    p('M2 8V4'), p('M22 8V4'), p('M22 6H2'),
    r(2, 12, 20, 8, 2),
    p('M6 15v-3'), p('M10 15v-3'), p('M14 15v-3'), p('M18 15v-3'),
  ],
  /** scan — four corner brackets, for revealing the structure underneath. */
  xray: [
    p('M3 7V5a2 2 0 0 1 2-2h2'),
    p('M17 3h2a2 2 0 0 1 2 2v2'),
    p('M21 17v2a2 2 0 0 1-2 2h-2'),
    p('M7 21H5a2 2 0 0 1-2-2v-2'),
  ],
  /** columns-3 — a frame divided into columns, which is what a column grid is. */
  grid: [r(3, 3, 18, 18, 2), p('M9 3v18'), p('M15 3v18')],
  /** grid-3x3 — a lattice, for the pixel texture. */
  pixels: [
    r(3, 3, 18, 18, 2),
    p('M3 9h18'), p('M3 15h18'), p('M9 3v18'), p('M15 3v18'),
  ],
  /** type — the compositor's T. */
  type: [p('M12 4v16'), p('M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2'), p('M9 20h6')],
  /**
   * square-square — a box inside a box, which is what a box model is.
   *
   * `panel-left` was the obvious pick and the wrong one: it put a third
   * rectangle-with-a-line-in-it next to the column grid and the pixel grid,
   * and three near-identical silhouettes in one bar is worse than one icon
   * that is merely apt.
   */
  panel: [r(3, 3, 18, 18, 2), r(8, 8, 8, 8, 1)],
  /** pause — freezing is pausing what is running, and it says so in two bars. */
  freeze: [r(14, 3, 5, 18, 1), r(5, 3, 5, 18, 1)],
  copy: [
    r(8, 8, 14, 14, 2),
    p('M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'),
  ],
  /** pipette — the eyedropper, which is what every tool calls a colour picker. */
  pick: [
    p('m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12'),
    p('m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z'),
    p('m2 22 .414-.414'),
  ],
  /** eye-off — everything drawn, out of the way for a moment. */
  hide: [
    p('M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49'),
    p('M14.084 14.158a3 3 0 0 1-4.242-4.242'),
    p('M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143'),
    p('m2 2 20 20'),
  ],
  /** undo-2 — an arrow turning back on itself. */
  undo: [p('M9 14 4 9l5-5'), p('M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11')],

  /**
   * check and x — not controls, answers.
   *
   * A one-shot button can say it was pressed and still leave you wondering
   * whether anything happened. These take the button's place for a moment to
   * report the outcome, which for a clipboard write is the only way to know:
   * the write is silent, and so is its refusal.
   */
  check: [p('M20 6 9 17l-5-5')],
  cross: [p('M18 6 6 18'), p('m6 6 12 12')],
} as const;

export type IconName = keyof typeof ICONS;

const NS = 'http://www.w3.org/2000/svg';

/**
 * Build one icon at `size`, inheriting the button's colour.
 *
 * `currentColor` is the whole reason these are inline SVG rather than images:
 * an icon has to go dim when its button is idle and bright when the tool is on,
 * and follow the page's theme while doing it. `aria-hidden` because the button
 * around it carries the label — a screen reader should hear the name, not the
 * drawing.
 */
export function icon(name: IconName, size = 16): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', VIEW_BOX);
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', STROKE_WIDTH);
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  for (const shape of ICONS[name]) {
    if ('rect' in shape) {
      const [x, y, w, h, rx] = shape.rect;
      const el = document.createElementNS(NS, 'rect');
      el.setAttribute('x', String(x));
      el.setAttribute('y', String(y));
      el.setAttribute('width', String(w));
      el.setAttribute('height', String(h));
      el.setAttribute('rx', String(rx));
      svg.appendChild(el);
    } else {
      const el = document.createElementNS(NS, 'path');
      el.setAttribute('d', shape.path);
      svg.appendChild(el);
    }
  }
  return svg;
}
