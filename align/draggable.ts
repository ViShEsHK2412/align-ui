/**
 * Drag a floating surface by a handle.
 *
 * Three panels needed this and one had it: the box model grew a drag, and the
 * toolbar and the edit dock stayed pinned to the corner the CSS put them in.
 * Writing it twice more would have meant three subtly different answers to the
 * same questions — what counts as a handle, what happens at the viewport edge,
 * what a button inside the handle does — so it is one answer, here.
 *
 * The offset is a `transform`, deliberately, and never `translate`, `top` or
 * `left`. Those three are already spoken for: the edit dock animates its
 * entrance with `translate`, the toolbar transitions `top` to make room for
 * the rulers, and both are positioned by `top`/`right`. `transform` is a
 * separate property that composes with all of them, so a drag cannot fight an
 * animation and an animation cannot undo a drag.
 */

const MARGIN = 16;

/**
 * How far the surface may be pushed, given where it would sit untouched.
 *
 * Pure, and the only part worth testing: everything else is pointer plumbing.
 * `natural` is the offset-free position, so the answer holds no matter how the
 * element was placed — `top`/`right`, `top`/`left` or anything else.
 */
export function clampOffset(
  natural: number,
  size: number,
  offset: number,
  viewport: number,
  margin = MARGIN,
): number {
  const lo = margin - natural;
  const hi = viewport - margin - size - natural;
  /*
   * A surface taller or wider than the window leaves no legal position at all,
   * and `lo > hi` would then clamp to whichever bound was written last. Pinning
   * the near edge is the useful half: you can still read the top of a panel
   * that does not fit, and scroll or resize to reach the rest.
   */
  if (lo > hi) return lo;
  return Math.min(Math.max(offset, lo), hi);
}

/** Anything that should be pressed rather than dragged. */
const INTERACTIVE = 'button, a, input, select, textarea, [role="button"], [tabindex]';

/**
 * How far the pointer travels before a press becomes a drag.
 *
 * Without it the handle stops being clickable, and one of these handles is the
 * toolbar itself, whose click opens the key list. The same 3px the scrub
 * badges use, for the same reason and so both gestures feel alike: far enough
 * that a click with a shaky hand is still a click, close enough that a drag
 * never feels like it needs a run-up.
 */
const SLOP = 3;

export interface DraggableOptions {
  /**
   * The thing that moves, and the only thing listened to.
   *
   * The handle is named by a `data-drag-handle` attribute somewhere inside it
   * rather than passed as an element, because the box model rebuilds its
   * header on every reading: a handle held as a reference would be a drag
   * bound to a node that is no longer in the document. An attribute survives
   * being re-rendered, and the toolbar — which is its own handle — just puts
   * it on itself.
   */
  surface: HTMLElement;
  /** Gap kept from the viewport edge. */
  margin?: number;
  /**
   * Where it was last left, for a surface that is rebuilt rather than kept.
   *
   * The box model's position outlives its panel: it is destroyed and recreated
   * every time the tool is switched off and on, and a drag that forgot itself
   * each time would be a panel that walks back to the corner behind your back.
   */
  initial?: { dx: number; dy: number };
  /** Called after every move, for anything that tracks the surface. */
  onMove?: () => void;
}

export interface Draggable {
  /** Re-clamp where it is. Call on resize, or after the surface changes size. */
  place(): void;
  /** Back to where the CSS put it. */
  reset(): void;
  /** Has it been moved from its CSS position? */
  moved(): boolean;
  /** The current offset, for handing back to `initial` next time. */
  offset(): { dx: number; dy: number };
  destroy(): void;
}

export function makeDraggable(options: DraggableOptions): Draggable {
  const { surface, margin = MARGIN, onMove, initial } = options;

  /**
   * Did this press land on the handle, and on nothing that wants it more?
   *
   * Walked outward from the target, so the first answer wins: a button sitting
   * inside the header is a button, not a grab. The box model made each of its
   * buttons stop its own pointerdown to achieve that, which works and has to
   * be remembered every time someone adds one. Asking the event does not.
   */
  function onHandle(e: Event): boolean {
    for (const node of e.composedPath()) {
      if (!(node instanceof Element)) continue;
      if (node.matches(INTERACTIVE)) return false;
      if (node.hasAttribute('data-drag-handle')) return true;
      if (node === surface) return false;
    }
    return false;
  }

  let dx = initial?.dx ?? 0;
  let dy = initial?.dy ?? 0;
  let from: { x: number; y: number; dx: number; dy: number } | null = null;
  /** Pressed, but not yet past the slop. Not a drag until it is. */
  let pending = false;

  function apply(): void {
    surface.style.transform = dx === 0 && dy === 0 ? '' : `translate(${dx}px, ${dy}px)`;
  }

  /**
   * Where the surface would be with no offset applied.
   *
   * Measured rather than assumed, and derived by subtracting the offset we
   * ourselves applied. Reading it any other way would mean clearing the
   * transform to measure and putting it back, which is a visible flash at
   * every frame of a drag.
   */
  function natural(): { left: number; top: number; width: number; height: number } {
    const r = surface.getBoundingClientRect();
    return { left: r.left - dx, top: r.top - dy, width: r.width, height: r.height };
  }

  function place(): void {
    const n = natural();
    dx = clampOffset(n.left, n.width, dx, innerWidth, margin);
    dy = clampOffset(n.top, n.height, dy, innerHeight, margin);
    apply();
    onMove?.();
  }

  function onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    if (!onHandle(e)) return;
    /*
     * Nothing is claimed yet — no preventDefault, no stopPropagation. The
     * handle may have a click of its own, and suppressing it here would make
     * the surface undraggable-or-unclickable rather than both.
     */
    from = { x: e.clientX, y: e.clientY, dx, dy };
    pending = true;
    // Throws for a pointer that is already up. Losing the capture is better
    // than losing the gesture.
    try { surface.setPointerCapture(e.pointerId); } catch { /* fine */ }
  }

  function onPointerMove(e: PointerEvent): void {
    if (!from) return;
    const mx = e.clientX - from.x;
    const my = e.clientY - from.y;
    if (pending) {
      if (Math.abs(mx) < SLOP && Math.abs(my) < SLOP) return;
      pending = false;
      surface.setAttribute('data-dragging', '');
    }
    e.preventDefault();
    dx = from.dx + mx;
    dy = from.dy + my;
    place();
  }

  function end(): void {
    from = null;
    pending = false;
    surface.removeAttribute('data-dragging');
  }

  function onPointerUp(e: PointerEvent): void {
    const dragged = from !== null && !pending;
    if (surface.hasPointerCapture?.(e.pointerId)) surface.releasePointerCapture(e.pointerId);
    end();
    /*
     * A drag that ends over the handle still produces a click, and the toolbar
     * would open its key list every time you finished moving it. One listener,
     * once, in capture: anything later is a real click.
     */
    if (dragged) {
      addEventListener('click', swallow, { capture: true, once: true });
      // If no click follows — released off the handle — the listener would sit
      // there and eat the next real one instead.
      setTimeout(() => removeEventListener('click', swallow, true), 0);
    }
  }

  function swallow(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
  }

  /** Escape puts it back where the drag started, like every other drag. */
  function onKey(e: KeyboardEvent): void {
    if (!from || e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    dx = from.dx;
    dy = from.dy;
    end();
    apply();
    onMove?.();
  }

  function reset(): void {
    dx = 0;
    dy = 0;
    apply();
    onMove?.();
  }

  /*
   * Double-click the handle to put it back. The recovery for a panel dragged
   * somewhere useless, and the reason the drag does not need to be remembered
   * across reloads to be safe.
   */
  function onDoubleClick(e: MouseEvent): void {
    if (onHandle(e)) reset();
  }

  if (dx !== 0 || dy !== 0) apply();

  surface.addEventListener('pointerdown', onPointerDown);
  surface.addEventListener('pointermove', onPointerMove);
  surface.addEventListener('pointerup', onPointerUp);
  surface.addEventListener('pointercancel', onPointerUp);
  surface.addEventListener('dblclick', onDoubleClick);
  addEventListener('keydown', onKey, true);
  addEventListener('resize', place);

  return {
    place,
    reset,
    moved: () => dx !== 0 || dy !== 0,
    offset: () => ({ dx, dy }),
    destroy(): void {
      surface.removeEventListener('pointerdown', onPointerDown);
      surface.removeEventListener('pointermove', onPointerMove);
      surface.removeEventListener('pointerup', onPointerUp);
      surface.removeEventListener('pointercancel', onPointerUp);
      surface.removeEventListener('dblclick', onDoubleClick);
      removeEventListener('keydown', onKey, true);
      removeEventListener('resize', place);
      surface.style.transform = '';
    },
  };
}

/** The cursor and the lift, shared by every draggable surface. */
export const DRAG_CSS = `
[data-drag-handle] { cursor: grab; touch-action: none; }
/*
 * Both forms, because the toolbar is its own handle: the two attributes land
 * on the same element there, and a descendant selector alone would leave the
 * one bar you drag by its whole body showing a grab cursor while you drag it.
 */
[data-dragging] [data-drag-handle],
[data-dragging][data-drag-handle] { cursor: grabbing; }
/* No text selection mid-drag, and no transition racing the pointer. */
[data-dragging] { user-select: none; transition: none !important; }
`;
