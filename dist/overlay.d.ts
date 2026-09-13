import { type GridSpec } from './measure';
import type { Box, Guide, Segment } from './types';
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
    /** The design grid to check against, or null for none. */
    grid: GridSpec | null;
    /** Whether to lay the pixel texture under everything. */
    pixels: boolean;
    guides: Guide[];
    /** The one under the cursor or being dragged, drawn at full strength. */
    liveGuide: Guide | null;
    /** The one the keyboard is pointing at, marked with end handles. */
    activeGuide: number | null;
}
export interface Overlay {
    root: ShadowRoot;
    update(patch: Partial<OverlayState>): void;
    resize(): void;
    destroy(): void;
}
export declare function mountOverlay(): Overlay;
