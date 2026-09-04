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
/** One icon: the `d` of each path, in draw order. `rect` entries are boxes. */
type Shape = {
    path: string;
} | {
    rect: [number, number, number, number, number];
};
export declare const ICONS: {
    /** ruler-dimension-line — a rule with ticks, and a dimension line above it. */
    readonly rulers: readonly [Shape, Shape, Shape, Shape, Shape, Shape, Shape, Shape];
    /** scan — four corner brackets, for revealing the structure underneath. */
    readonly xray: readonly [Shape, Shape, Shape, Shape];
    /** columns-3 — a frame divided into columns, which is what a column grid is. */
    readonly grid: readonly [Shape, Shape, Shape];
    /** grid-3x3 — a lattice, for the pixel texture. */
    readonly pixels: readonly [Shape, Shape, Shape, Shape, Shape];
    /** type — the compositor's T. */
    readonly type: readonly [Shape, Shape, Shape];
    /**
     * square-square — a box inside a box, which is what a box model is.
     *
     * `panel-left` was the obvious pick and the wrong one: it put a third
     * rectangle-with-a-line-in-it next to the column grid and the pixel grid,
     * and three near-identical silhouettes in one bar is worse than one icon
     * that is merely apt.
     */
    readonly panel: readonly [Shape, Shape];
    /** pause — freezing is pausing what is running, and it says so in two bars. */
    readonly freeze: readonly [Shape, Shape];
    readonly copy: readonly [Shape, Shape];
    /** pipette — the eyedropper, which is what every tool calls a colour picker. */
    readonly pick: readonly [Shape, Shape, Shape];
    /** undo-2 — an arrow turning back on itself. */
    readonly undo: readonly [Shape, Shape];
    /**
     * check and x — not controls, answers.
     *
     * A one-shot button can say it was pressed and still leave you wondering
     * whether anything happened. These take the button's place for a moment to
     * report the outcome, which for a clipboard write is the only way to know:
     * the write is silent, and so is its refusal.
     */
    readonly check: readonly [Shape];
    readonly cross: readonly [Shape, Shape];
};
export type IconName = keyof typeof ICONS;
/**
 * Build one icon at `size`, inheriting the button's colour.
 *
 * `currentColor` is the whole reason these are inline SVG rather than images:
 * an icon has to go dim when its button is idle and bright when the tool is on,
 * and follow the page's theme while doing it. `aria-hidden` because the button
 * around it carries the label — a screen reader should hear the name, not the
 * drawing.
 */
export declare function icon(name: IconName, size?: number): SVGSVGElement;
export {};
