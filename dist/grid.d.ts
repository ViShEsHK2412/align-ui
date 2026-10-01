/**
 * Layout grids: columns, rows and a baseline, on the page or inside elements.
 *
 * A design rarely has one grid. The page has twelve columns, the card inside
 * it has its own four, and the type sits on a 4px baseline under both. Each is
 * a reference to measure against, so each can be drawn, and a grid that
 * belongs to a component is drawn inside every instance of it rather than
 * across the window.
 *
 * The geometry is pure. Where the areas come from — the page, or the content
 * box of each element a selector matches — is the caller's business.
 */
import type { Rect } from './notes';
interface Scoped {
    /**
     * Draw inside each element this matches, in its content box, instead of
     * across the page. Capped at MAX_SCOPED elements on screen.
     */
    selector?: string;
    /** Any CSS colour. The tool's own measure colour when left out. */
    color?: string;
}
export interface ColumnsLayer extends Scoped {
    type: 'columns';
    count: number;
    gutter?: number;
    margin?: number;
    /** The width the columns are centred in; 0 or left out fills the area. */
    maxWidth?: number;
}
export interface RowsLayer extends Scoped {
    type: 'rows';
    /**
     * With no height, this many rows stretch to fill the area. With a height,
     * at most this many rows of that height, from the top.
     */
    count?: number;
    /** Fixed row height. Rows repeat down the area when there is no count. */
    height?: number;
    gutter?: number;
    margin?: number;
}
export interface BaselineLayer extends Scoped {
    type: 'baseline';
    /** Distance between lines. */
    size: number;
    /** Where the first line falls, from the top of the area. */
    offset?: number;
}
export type GridLayer = ColumnsLayer | RowsLayer | BaselineLayer;
/** The shape `grid` took before there were layers. Still accepted, unchanged. */
export interface LegacyGrid {
    columns: number;
    gutter: number;
    margin: number;
    maxWidth: number;
}
export type GridConfig = LegacyGrid | GridLayer | readonly GridLayer[];
/** Elements a scoped grid is drawn in, at most. A grid on every list item of a long page is noise. */
export declare const MAX_SCOPED = 50;
/**
 * Whatever was configured, as a list of layers that can be drawn.
 *
 * Forgiving in the way a config file should be: a layer it cannot make sense
 * of is dropped rather than throwing at startup, and a layer with nothing to
 * draw — no columns, a zero baseline — is the same as no layer.
 */
export declare function normalizeGrids(input: unknown): GridLayer[];
/** What one layer draws in one area: filled bands, and hairlines. */
export interface GridShapes {
    fills: Rect[];
    lines: Rect[];
}
/** The vertical span on screen worth drawing in, so a long page costs only what is visible. */
export interface View {
    top: number;
    bottom: number;
}
/**
 * Lay one layer out inside `area`, keeping only what falls inside `view`.
 *
 * Every number is in viewport pixels. An area can be far taller than the
 * screen — the page, scrolled — so anything repeating starts at the first
 * band that can be seen rather than at the top of the area.
 */
export declare function gridShapes(layer: GridLayer, area: Rect, view: View): GridShapes;
/**
 * The content box of each element a selector matches, on screen, in viewport
 * pixels. Inside padding and border, because that is the box a component's own
 * grid divides. A selector that does not parse matches nothing.
 */
export declare function contentBoxes(selector: string, root?: ParentNode): Rect[];
export {};
