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
}
/** A control does one of these when pressed; index.ts owns what they mean. */
export type ToolName = 'rulers' | 'xray' | 'grid' | 'pixels' | 'freeze' | 'type' | 'panel' | 'copy' | 'pick' | 'undo';
export interface Indicator {
    update(locked: number, state: ToolState): void;
    /** True if it was open — lets Escape dismiss the topmost layer first. */
    closeHelp(): boolean;
    destroy(): void;
}
export declare function createIndicator(root: ShadowRoot, onTool: (name: ToolName) => void): Indicator;
