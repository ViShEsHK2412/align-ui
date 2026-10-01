import type { Box, Guide, Segment } from './types';
import { type Band } from './lint';
import type { GridShapes } from './grid';
/** One grid layer, laid out for this frame. */
export interface GridDraw extends GridShapes {
    color?: string;
}
/**
 * Canvas rendering. One of the two modules allowed to write to the DOM.
 * Everything draws inside a single requestAnimationFrame — never synchronously
 * from an event handler.
 */
export interface OverlayState {
    hover: Box | null;
    /** Every locked element, in the order they were locked. */
    pinned: Box[];
    lines: Segment[];
    cursor: {
        x: number;
        y: number;
    } | null;
    rulers: boolean;
    /** Everything drawn, held back for a moment. State is untouched. */
    hidden: boolean;
    /**
     * Pull the lock outline back, without touching anything else.
     *
     * Set while a panel control is being dragged. The outline runs along the
     * element's own edge, which is exactly where a border or a shadow is being
     * set, and at full strength you cannot tell the tool's line from the value
     * you are changing. Everything else stays: the measurements are the reason
     * you are watching, and this only quiets the one mark that competes.
     */
    dimLock: boolean;
    /** The layout grids, already laid out in viewport pixels, or null for none. */
    grid: GridDraw[] | null;
    /** Whether to lay the pixel texture under everything. */
    pixels: boolean;
    /**
     * The spacing lint, measured at one scroll position. dx/dy are how far the
     * page has scrolled since, so the bands stay on their spacing between scans
     * instead of lagging a scroll behind it.
     */
    lint: {
        bands: Band[];
        dx: number;
        dy: number;
    } | null;
    guides: Guide[];
    /** The one under the cursor or being dragged, drawn at full strength. */
    liveGuide: Guide | null;
    /** The one the keyboard is pointing at, marked with end handles. */
    activeGuide: number | null;
    /** Every guide that moves with it, marked the same way. */
    selectedGuides: number[];
    /** A Shift-drag selecting guides, in viewport pixels. */
    marquee: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
}
export interface Overlay {
    root: ShadowRoot;
    update(patch: Partial<OverlayState>): void;
    resize(): void;
    destroy(): void;
}
export declare function mountOverlay(target?: HTMLElement): Overlay;
