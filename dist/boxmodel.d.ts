import type { Box } from './types';
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
    /**
     * Out of sight for a moment, without forgetting it was open. Distinct from
     * `hide`, which is what happens when the last lock goes.
     */
    setHidden(hidden: boolean): void;
    /** The user asked for it back, or asked it to go away. */
    toggle(): void;
    destroy(): void;
}
/** One measured gap, and where its number came from. */
export interface GapLine {
    px: number;
    detail: string;
}
export declare function createBoxModel(root: ShadowRoot): BoxModel;
