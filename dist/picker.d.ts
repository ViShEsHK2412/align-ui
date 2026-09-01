/**
 * The colour picker: sample a pixel, then read it in four formats.
 *
 * Sampling is the browser's own EyeDropper, which takes over the whole screen —
 * so this can pick out of a design file sitting beside the browser, not just
 * out of the page. Everything after the sample is arithmetic in `colour.ts`.
 */
export interface Picker {
    /** Sample a pixel. Resolves once the card is up, or immediately if cancelled. */
    open(): Promise<void>;
    /** True if it was showing — lets Escape dismiss the topmost layer first. */
    close(): boolean;
    destroy(): void;
}
export declare function createPicker(root: ShadowRoot): Picker;
