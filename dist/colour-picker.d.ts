import { type ColourToken } from './colour-tokens';
export interface PickerOptions {
    /** Where to place it, in viewport coordinates. */
    anchor: HTMLElement;
    value: string;
    /**
     * `value` is what to write: a colour, or `var(--token)` when a token was
     * picked. `shown` is the colour that resolves to, for anything that has to
     * paint it outside the page's cascade, where the token may not be defined.
     */
    onChange: (value: string, shown: string) => void;
    onClose?: () => void;
    /** The page's colour tokens in scope of the element, offered as swatches. */
    tokens?: readonly ColourToken[];
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
