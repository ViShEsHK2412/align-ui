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
export function holdPointer(el: Element, pointerId: number): void {
  try {
    el.setPointerCapture(pointerId);
  } catch {
    // Throws for a pointer that is already up. Losing the gesture is worse than losing the capture.
    return;
  }
  const letGo = (): void => {
    try {
      if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
    } catch {
      /* already gone */
    }
  };
  addEventListener('blur', letGo);
  el.addEventListener('lostpointercapture', () => removeEventListener('blur', letGo), { once: true });
}
