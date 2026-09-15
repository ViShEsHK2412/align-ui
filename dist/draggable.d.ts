/**
 * Drag a floating surface by a handle.
 *
 * Three panels needed this and one had it: the box model grew a drag, and the
 * toolbar and the edit dock stayed pinned to the corner the CSS put them in.
 * Writing it twice more would have meant three subtly different answers to the
 * same questions — what counts as a handle, what happens at the viewport edge,
 * what a button inside the handle does — so it is one answer, here.
 *
 * The offset is a `transform`, deliberately, and never `translate`, `top` or
 * `left`. Those three are already spoken for: the edit dock animates its
 * entrance with `translate`, the toolbar transitions `top` to make room for
 * the rulers, and both are positioned by `top`/`right`. `transform` is a
 * separate property that composes with all of them, so a drag cannot fight an
 * animation and an animation cannot undo a drag.
 */
/**
 * How far the surface may be pushed, given where it would sit untouched.
 *
 * Pure, and the only part worth testing: everything else is pointer plumbing.
 * `natural` is the offset-free position, so the answer holds no matter how the
 * element was placed — `top`/`right`, `top`/`left` or anything else.
 */
export declare function clampOffset(natural: number, size: number, offset: number, viewport: number, margin?: number): number;
export interface DraggableOptions {
    /**
     * The thing that moves, and the only thing listened to.
     *
     * The handle is named by a `data-drag-handle` attribute somewhere inside it
     * rather than passed as an element, because the box model rebuilds its
     * header on every reading: a handle held as a reference would be a drag
     * bound to a node that is no longer in the document. An attribute survives
     * being re-rendered, and the toolbar — which is its own handle — just puts
     * it on itself.
     */
    surface: HTMLElement;
    /** Gap kept from the viewport edge. */
    margin?: number;
    /**
     * Where it was last left, for a surface that is rebuilt rather than kept.
     *
     * The box model's position outlives its panel: it is destroyed and recreated
     * every time the tool is switched off and on, and a drag that forgot itself
     * each time would be a panel that walks back to the corner behind your back.
     */
    initial?: {
        dx: number;
        dy: number;
    };
    /** Called after every move, for anything that tracks the surface. */
    onMove?: () => void;
}
export interface Draggable {
    /** Re-clamp where it is. Call on resize, or after the surface changes size. */
    place(): void;
    /** Back to where the CSS put it. */
    reset(): void;
    /** Has it been moved from its CSS position? */
    moved(): boolean;
    /** The current offset, for handing back to `initial` next time. */
    offset(): {
        dx: number;
        dy: number;
    };
    destroy(): void;
}
export declare function makeDraggable(options: DraggableOptions): Draggable;
/** The cursor and the lift, shared by every draggable surface. */
export declare const DRAG_CSS = "\n[data-drag-handle] { cursor: grab; touch-action: none; }\n/*\n * Both forms, because the toolbar is its own handle: the two attributes land\n * on the same element there, and a descendant selector alone would leave the\n * one bar you drag by its whole body showing a grab cursor while you drag it.\n */\n[data-dragging] [data-drag-handle],\n[data-dragging][data-drag-handle] { cursor: grabbing; }\n/* No text selection mid-drag, and no transition racing the pointer. */\n[data-dragging] { user-select: none; transition: none !important; }\n";
