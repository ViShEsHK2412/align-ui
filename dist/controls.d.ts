import { type Editor } from './edit';
import { type IconName } from './icons';
/**
 * The controls.
 *
 * A panel of the properties you actually reach for, bound to the locked
 * element through the editor. It only exists while edit mode is armed, which
 * is the point: the tool has one surface that reads and a separate one that
 * writes, and they are never the same panel wearing a different hat.
 *
 * Three rules the layout follows:
 *
 *  - **Grouped by what you are doing**, not by CSS's own taxonomy. Type, then
 *    colour, then the box, then its border, then layout. Nobody opens a panel
 *    looking for "inherited properties".
 *  - **The ones you use are visible, the rest are behind a disclosure.** The
 *    full list is over forty properties. Forty rows you cannot scan is worse
 *    than fifteen you can, so the tiers ship as a shipping order rather than
 *    as a screen.
 *  - **A row that the tool has written says so**, and offers to put it back.
 *    The panel reports numbers read from the page, and once it can write, some
 *    of them are its own doing.
 */
type Kind = 'length' | 'number' | 'colour' | 'choice' | 'shadow' | 'blur';
interface Spec {
    /** The CSS property, or the shorthand a per-side group writes through. */
    prop: string;
    label: string;
    kind: Kind;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** For `choice`. The first is treated as the default. */
    options?: readonly string[];
    /**
     * The longhands a per-side group edits. Four sliders and a link, writing
     * these rather than the shorthand, because reading a shorthand back gives
     * you one string you then have to take apart again.
     */
    sides?: readonly string[];
    /** Behind the disclosure rather than in the first screen. */
    more?: boolean;
    /** The glyph that names the row. Every row has one. */
    glyph: IconName;
}
interface Group {
    name: string;
    specs: readonly Spec[];
}
/**
 * What the panel offers.
 *
 * The ranges are not arbitrary. Each one is wide enough to cover what the
 * property is really used for and no wider: a font-size slider that runs to
 * 400 spends nine tenths of its travel on sizes nobody sets, which makes the
 * tenth you want unusable.
 */
export declare const GROUPS: readonly Group[];
/**
 * A computed value as a number the sliders can use.
 *
 * `normal` is what `letter-spacing` and `line-height` compute to when nobody
 * has set them, and it is not a number. Zero is the right reading for tracking;
 * for line-height the browser gives a used value in px once it is laid out, so
 * the fallback is only reached before that.
 */
export declare function numberFrom(value: string): number;
/** Round-trip a computed colour into what an `<input type=color>` accepts. */
export declare function toHexInput(value: string): string;
export interface Controls {
    /** Point the panel at an element, or at nothing. */
    show(el: Element | null): void;
    /** Armed state changed: appear or disappear. */
    setArmed(armed: boolean): void;
    /** Re-read every control from the element, after an outside change. */
    refresh(): void;
    /** The ledger, for the clipboard. */
    asText(): string;
    destroy(): void;
}
export declare function createControls(root: ShadowRoot, editor: Editor): Controls;
export {};
