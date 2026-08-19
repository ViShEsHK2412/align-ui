/**
 * The badge, top-right, saying the tool is running. Clicking it opens the list
 * of keys — the only discoverable place for them, since a hotkey-driven tool
 * has nowhere else to put its own instructions.
 */
export interface Indicator {
    update(locked: number): void;
    /** True if it was open — lets Escape dismiss the topmost layer first. */
    closeHelp(): boolean;
    destroy(): void;
}
/** Kept next to the handlers they describe, so they can't drift apart. */
export declare const KEYS: [string, string][];
export declare function createIndicator(root: ShadowRoot): Indicator;
