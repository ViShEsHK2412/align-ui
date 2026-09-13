export interface PickerOptions {
    /** Where to place it, in viewport coordinates. */
    anchor: HTMLElement;
    value: string;
    onChange: (value: string) => void;
    onClose?: () => void;
}
export interface Picker {
    update(value: string): void;
    /**
     * Is this node part of the popover?
     *
     * Asked instead of comparing classes off an event path, because the path a
     * listener outside our shadow root receives has been trimmed to the host and
     * contains none of this.
     */
    contains(node: Node | null): boolean;
    destroy(): void;
}
export declare const PICKER_CSS: string;
export declare function createPicker(root: ShadowRoot, opts: PickerOptions): Picker;
