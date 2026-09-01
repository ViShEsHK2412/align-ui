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
