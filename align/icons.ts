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
type Shape =
  | { path: string; fade?: number }
  | { rect: [number, number, number, number, number]; fade?: number };

const p = (path: string, fade?: number): Shape =>
  (fade === undefined ? { path } : { path, fade });
/** x, y, width, height, radius — Lucide's rects all carry a corner radius. */
const r = (
  x: number, y: number, w: number, h: number, rx: number, fade?: number,
): Shape => (fade === undefined
  ? { rect: [x, y, w, h, rx] }
  : { rect: [x, y, w, h, rx], fade });

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
  /**
   * pencil, the one control that writes to the page.
   *
   * Not `settings` or `sliders`, which is what a panel of controls looks like:
   * the icon has to say *this changes your page*, not *this has knobs*. A
   * pencil is the only glyph everyone already reads that way.
   */
  edit: [
    p('M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'),
    p('m15 5 4 4'),
  ],

  /**
   * arrow-up, arrow-down and link. Reordering and linking are controls, and a
   * control drawn as a text character is the thing this icon set exists to
   * stop: an arrow glyph inherits the font's own weight and baseline and sits
   * a pixel off from every real icon beside it.
   */
  /*
   * Which edge of a box. Figma labels its padding fields this way and it is
   * the right call at this size: "bottom" is six characters competing with the
   * number beside it, where the glyph says the same thing in a corner of the
   * space and never wraps.
   *
   * The box is faded and the edge is not, so it reads as *this side of that
   * box* rather than as four unrelated marks.
   */
  sideTop: [p('M4 5h16v14H4z', 0.3), p('M4 5h16')],
  sideRight: [p('M4 5h16v14H4z', 0.3), p('M20 5v14')],
  sideBottom: [p('M4 5h16v14H4z', 0.3), p('M4 19h16')],
  sideLeft: [p('M4 5h16v14H4z', 0.3), p('M4 5v14')],

  /*
   * One glyph per row of the edit panel.
   *
   * Lucide's own where it has one that means the right thing, and a drawing of
   * the property where it does not. Line height, tracking and the gap have no
   * Lucide equivalent, so they are drawn the way a spec sheet draws them: the
   * thing being measured in the faded weight, and the measurement itself
   * solid. That reads at 14px, where a literal picture of the property does
   * not.
   */
  fontSize: [p('M12 4v16'), p('M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2'), p('M9 20h6')],
  /** bold. Weight is the one type property everyone already has a glyph for. */
  fontWeight: [
    p('M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8'),
  ],
  /*
   * Two rules and the space between them, and two uprights and the space
   * between them. Three strokes each.
   *
   * The first drawing of these had arrowheads on the measure, which is how a
   * spec sheet does it and is five more strokes: at 15px they closed into a
   * blob, the same way this set already rejects `snowflake` and
   * `square-dashed` for twelve strokes at 16. The bar alone says distance once
   * the two rules give it something to be between.
   */
  lineHeight: [p('M3 5h18', 0.35), p('M3 19h18', 0.35), p('M12 8v8')],
  tracking: [p('M5 5v14', 0.35), p('M19 5v14', 0.35), p('M8 12h8')],
  italic: [p('M19 4h-9'), p('M14 20H5'), p('m15 4-4 16')],
  textAlign: [p('M21 6H3'), p('M15 12H3'), p('M17 18H3')],
  textCase: [p('M3.5 13h6'), p('m2 16 4.5-9 4.5 9'), p('M18 16V7'), p('m14 11 4-4 4 4')],
  underline: [p('M6 4v6a6 6 0 0 0 12 0V4'), p('M4 20h16')],

  /** A letter sitting on its colour. */
  textColour: [p('m6 16 6-12 6 12', 0.35), p('M8 12h8', 0.35), p('M4 20h16')],
  /** The surface behind it, filled rather than outlined. */
  backgroundColour: [r(3, 3, 18, 18, 2), p('M3 12h18', 0.35), p('M12 3v18', 0.35)],
  /** A ring, which is what a border colour paints. */
  borderColour: [r(3, 3, 18, 18, 2), r(8, 8, 8, 8, 1, 0.35)],
  /** Half of it showing through. */
  opacity: [p('M12 3a9 9 0 0 0 0 18z'), p('M12 3a9 9 0 0 1 0 18', 0.35)],

  /** A box inside a box: the space between them is the padding. */
  padding: [r(3, 3, 18, 18, 2, 0.35), r(7, 7, 10, 10, 1)],
  /** The same, the other way round: the space outside is the margin. */
  margin: [r(3, 3, 18, 18, 2), r(7, 7, 10, 10, 1, 0.35)],
  /** Which edges the width is measured to. */
  boxSizing: [r(3, 3, 18, 18, 2), p('M7 7h10v10H7z', 0.35)],
  /** move-horizontal and move-vertical. Lucide's, and three strokes each. */
  widthIcon: [p('M2 12h20'), p('m6 8-4 4 4 4'), p('m18 8 4 4-4 4')],
  heightIcon: [p('M12 2v20'), p('m8 6 4-4 4 4'), p('m8 18 4 4 4-4')],

  borderWidth: [r(3, 3, 18, 18, 2), p('M3 3h18')],
  borderStyle: [p('M3 12h4'), p('M10 12h4'), p('M17 12h4')],
  borderRadius: [p('M21 21V9a6 6 0 0 0-6-6H3')],

  /** Two blocks and the space between them. */
  gap: [r(3, 4, 7, 16, 1, 0.35), r(14, 4, 7, 16, 1, 0.35), p('M12 8v8')],
  flexDirection: [p('M12 5v14'), p('m8 9 4-4 4 4'), p('m8 15 4 4 4-4')],
  justify: [p('M4 4v16', 0.35), p('M20 4v16', 0.35), r(8, 8, 8, 8, 1)],
  alignItems: [p('M4 4h16', 0.35), p('M4 20h16', 0.35), r(8, 8, 8, 8, 1)],
  flexWrap: [p('M3 7h13a4 4 0 0 1 0 8H8'), p('m11 12-3 3 3 3')],

  /** A card and the shadow it casts. */
  shadow: [r(3, 3, 14, 14, 2), p('M21 9v10a2 2 0 0 1-2 2H9', 0.35)],
  /** What shows through a frosted surface. */
  backdrop: [r(3, 3, 18, 18, 2), p('M7 12h10', 0.35), p('M7 8h10', 0.35), p('M7 16h10', 0.35)],

  arrowUp: [p('m5 12 7-7 7 7'), p('M12 19V5')],
  arrowDown: [p('M12 5v14'), p('m19 12-7 7-7-7')],
  link: [
    p('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'),
    p('M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'),
  ],

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
      if (shape.fade !== undefined) el.setAttribute('opacity', String(shape.fade));
      svg.appendChild(el);
    } else {
      const el = document.createElementNS(NS, 'path');
      el.setAttribute('d', shape.path);
      // Same colour at less strength, so a glyph can carry two levels without
      // a second colour that would have to be kept in step with the theme.
      if (shape.fade !== undefined) el.setAttribute('opacity', String(shape.fade));
      svg.appendChild(el);
    }
  }
  return svg;
}
