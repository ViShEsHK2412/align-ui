/**
 * Capture a pointer for a drag, and let go of it if the window loses focus.
 *
 * Alt+Tab, a system dialog or a click into DevTools in the middle of a drag
 * takes the pointer's release somewhere this page never hears about. Capture
 * survives it, so coming back with the button up, every move still drives the
 * drag: a slider follows a pointer nobody is pressing. Toolcraft's sliders end
 * the gesture on window blur for exactly this reason.
 *
 * Releasing the capture is the whole fix, because every drag here already ends
 * on `lostpointercapture`. One rule instead of a blur handler per control.
 */
export declare function holdPointer(el: Element, pointerId: number): void;
