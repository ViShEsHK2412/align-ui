/**
 * The number control.
 *
 * Every editable value in this tool is a number in a range, so this is the one
 * component that has to be right. The interaction model is a port of the
 * slider in Josh Puckett's DialKit (`dialkit`, MIT, © 2026 Josh Puckett) — the
 * behaviour is his, the implementation here is ours, because align-ui has no
 * dependencies and DialKit's is built on `motion/react`.
 *
 * What makes it worth porting rather than writing a range input:
 *
 *  - **The track is the whole control.** The label and the value live inside
 *    it and the fill is its background, so a row that would need a label, a
 *    track and a number side by side fits in one 36px line and still reads.
 *  - **A drag is instant; a click is animated.** Dragging jumps the fill to the
 *    pointer with no smoothing, because a control that lags the finger feels
 *    broken. Clicking springs to the target, because a click is one discrete
 *    intention and the movement is what tells you it was understood.
 *  - **A click is magnetic.** It pulls to the nearest tenth, but only from
 *    within 3.125% of it — close enough to help, tight enough that it never
 *    fights you for a value you meant.
 *  - **Dragging past the end stretches the track.** 32px of nothing first, then
 *    a square-rooted stretch to a maximum of 8px. The square root is the whole
 *    trick: a linear stretch feels elastic, a rooted one feels like resistance.
 *  - **The handle gets out of the way of the text.** When it would cross the
 *    label or the value it fades and squashes, on thresholds measured from
 *    those elements rather than guessed, so nothing ever overlaps at any width.
 *
 * Two deliberate departures from DialKit:
 *
 *  - **Square corners.** DialKit rounds the track, the handle and the marks.
 *    This tool is square everywhere and stays square.
 *  - **Composite-only animation.** DialKit animates the fill's `width`. Here
 *    the fill is a `scaleX` and the handle a `translateX`, so the whole
 *    animation is a compositor job and never touches layout.
 */
/** How many decimals a step needs, so `0.01` reads `0.30` and not `0.3`. */
export declare function decimalsForStep(step: number, min?: number, max?: number): number;
/**
 * Snap to the step, measured from `min` rather than from zero.
 *
 * From zero, a range starting at 3 with a step of 2 could never produce 3. Both
 * endpoints are returned untouched so they stay exactly reachable, which is the
 * difference between a slider that can be set to its maximum and one that gets
 * close.
 */
export declare function roundValue(value: number, step: number, min?: number, max?: number): number;
/** How close to a tenth a click has to land before it is pulled onto it. */
export declare const DECILE_PULL = 0.03125;
/** Magnetism, for a click only. A drag is never snapped — it goes where you put it. */
export declare function snapToDecile(raw: number, min: number, max: number): number;
/** Nothing happens for this many pixels past the end. */
export declare const DEAD_ZONE = 32;
/** How far the track can stretch, however far you drag. */
export declare const MAX_STRETCH = 8;
/** The distance past the dead zone at which the stretch reaches its maximum. */
export declare const MAX_CURSOR_RANGE = 200;
/**
 * How far the track gives when dragged past its end.
 *
 * `distancePast` is how far beyond the edge the pointer is, `sign` which edge.
 * Square-rooted, so the first pixels move it most and the last barely at all —
 * the shape of something resisting rather than something stretching.
 */
export declare function rubberStretch(distancePast: number, sign: number): number;
/** Where a value sits along the track, 0..100. */
export declare function percentOf(value: number, min: number, max: number): number;
/** What value a fraction along the track means, clamped to the range. */
export declare function valueAt(fraction: number, min: number, max: number): number;
/**
 * The next value for a key, or undefined if the key is not ours.
 *
 * Stepping is computed from the *step index* rather than by adding to the
 * current value, so a value that is already off-step lands on one rather than
 * carrying the error forward for the rest of the session.
 */
export declare function sliderKeyValue(key: string, value: number, min: number, max: number, step: number, shift?: boolean): number | undefined;
/**
 * Where the marks go.
 *
 * Ten or fewer positions and every one is marked, because you can count them
 * and land on them. More than that and the marks become tenths, which is a
 * reading aid rather than a set of targets.
 */
export declare function hashMarkPercents(min: number, max: number, step: number): number[];
/**
 * How many decimals to *show*, which is not always what the step needs.
 *
 * A value seeded from a stylesheet does not have to sit on the step. A
 * `font-size` of 15.5px with a step of 1 rounds to no decimals, and `toFixed(0)`
 * would render it "16" while the control still held 15.5 — the readout claiming
 * a value the element does not have, which is the one thing this tool must
 * never do. So an off-grid value is shown at its own precision, and the first
 * arrow press pulls it onto the grid where the step's precision takes over.
 */
export declare function displayDecimals(value: number, step: number, min?: number, max?: number): number;
/** What a click lands on: a step when they are countable, a tenth when they are not. */
export declare function clickTarget(raw: number, min: number, max: number, step: number): number;
export interface SpringOptions {
    stiffness: number;
    damping: number;
    mass: number;
}
/** DialKit's click-snap spring. Slightly underdamped: it arrives, then settles. */
export declare const SNAP_SPRING: SpringOptions;
/** The rubber band coming home. Looser, so the release reads as a release. */
export declare const RELEASE_SPRING: SpringOptions;
/**
 * One step of a damped spring, by semi-implicit Euler.
 *
 * `dt` is clamped by the caller. An unclamped frame — a background tab coming
 * back, a long task — integrates a huge step and throws the value to infinity,
 * which is the classic way a hand-rolled spring explodes.
 */
export declare function springStep(x: number, v: number, target: number, dt: number, o: SpringOptions): {
    x: number;
    v: number;
};
/** Near enough, and slow enough, to stop integrating. */
export declare function springSettled(x: number, v: number, target: number, epsilon?: number): boolean;
export interface SliderOptions {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    /** Shown after the number. Not part of the value. */
    unit?: string;
    onChange: (value: number) => void;
    /** Called once when a gesture ends, so the ledger gets one entry per drag. */
    onCommit?: (value: number) => void;
}
export interface Slider {
    el: HTMLElement;
    /** Push a value in from outside without calling back out. */
    set(value: number): void;
    destroy(): void;
}
export declare const SLIDER_CSS: string;
/** So the caller can mount the stylesheet once for however many sliders. */
export declare const SLIDER_STYLE_ID = "align-slider";
export declare function ensureSliderStyle(root: ShadowRoot): void;
export declare function createSlider(root: ShadowRoot, options: SliderOptions): Slider;
