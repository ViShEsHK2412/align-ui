/**
 * The badge, top-right, saying the tool is running. Clicking it opens the list
 * of keys — the only discoverable place for them, since a hotkey-driven tool
 * has nowhere else to put its own instructions.
 */
/** What the toolbar's toggles should currently look like. */
export interface ToolState {
    rulers: boolean;
    xray: boolean;
    grid: boolean;
    pixels: boolean;
    freeze: boolean;
    type: boolean;
    panel: boolean;
    hide: boolean;
    /** Whether the two one-shots have anything to act on right now. */
    canCopy: boolean;
    canUndo: boolean;
}
/** A control does one of these when pressed; index.ts owns what they mean. */
export type ToolName = 'rulers' | 'xray' | 'grid' | 'pixels' | 'freeze' | 'type' | 'panel' | 'hide' | 'copy' | 'pick' | 'undo';
export interface Indicator {
    update(locked: number, state: ToolState): void;
    /**
     * Report the outcome of a one-shot control. A clipboard write is silent and
     * so is its refusal, so a button that only says it was pressed leaves you
     * with no way to know whether anything happened.
     */
    acknowledge(name: ToolName, ok: boolean): void;
    /** True if it was open — lets Escape dismiss the topmost layer first. */
    closeHelp(): boolean;
    destroy(): void;
}
/**
 * The badge's geometry, written once so the help below it can be placed from
 * the same numbers instead of a hardcoded offset that drifts when either
 * changes. Height is the line box plus the padding either side.
 */
/**
 * Exported because the colour picker parks under this badge, and a second copy
 * of these numbers is how it came to be 10px out of date: the bar grew from a
 * row of letters to a row of icon buttons and the picker went on positioning
 * itself against the old height, overlapping it.
 */
export declare const INSET: 16;
export declare const FLAG_H = 36;
export declare const STEP: 8;
export declare function createIndicator(root: ShadowRoot, onTool: (name: ToolName) => void): Indicator;
