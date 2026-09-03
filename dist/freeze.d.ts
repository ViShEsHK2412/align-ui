/**
 * Hold the page still.
 *
 * You cannot measure a moving target, and a great deal of what you most want
 * measured is moving: a hover state, a dropdown mid-open, a toast, a loading
 * skeleton. All of them are unreachable while they animate.
 *
 * `document.getAnimations()` is the whole trick. It returns CSS animations, CSS
 * transitions and WAAPI animations alike, and every one of them can be paused
 * where it stands. Agentation reaches for `transition: none !important`
 * instead, which does not pause a transition — it makes the element jump to its
 * end state. For annotating that hardly matters. For measuring it is precisely
 * wrong: the value you wanted was the one it was passing through.
 */
export declare function isFrozen(): boolean;
export declare function setFrozen(on: boolean): void;
/**
 * What this does not stop: an animation driven by `requestAnimationFrame` or a
 * timer, which is most canvas work and some carousels. Agentation patches
 * `setTimeout`, `setInterval` and `rAF` globally and replays what it swallowed,
 * which does cover them — and which also means a debounce in the host page
 * fires late and a promise resolves out of order. That is a reasonable trade
 * for a tool whose job is annotation, and a poor one for a tool that claims to
 * leave the page as it found it. Left undone deliberately.
 */
