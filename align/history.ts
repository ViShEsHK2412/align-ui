/**
 * One level of undo per *gesture*, not per mutation.
 *
 * The distinction is the whole point. Holding an arrow key moves a guide
 * thirty times and fires thirty state changes, but it is one thing the person
 * did, and it should take one `Ctrl+Z` to put back — otherwise undo becomes a
 * key you hammer, and you cannot tell how many times without watching. Every
 * editor that has solved this solves it the same way: a run of the same small
 * gesture, uninterrupted, collapses into one entry.
 *
 * Entries hold the state *before* a change, so undoing means restoring the
 * entry rather than inverting the operation — no per-operation inverse to get
 * wrong, and a wipe restores identically to a nudge.
 *
 * Pure and generic: no DOM, no guides, nothing to mock.
 */

interface Entry<T> {
  state: T[];
  /** What gesture produced this. Empty never coalesces. */
  tag: string;
  at: number;
}

export interface History<T> {
  /** Record the state as it stands, before applying a change of this kind. */
  push(state: T[], tag: string, now?: number): void;
  /** The state to go back to, or null when there is nothing left. */
  pop(): T[] | null;
  depth(): number;
  clear(): void;
}

/**
 * @param limit how many gestures to remember. Twenty is roughly a session's
 *   worth of guide work; the cost is twenty small arrays.
 * @param idle how long a run may pause and still count as one gesture. Long
 *   enough to cover a slow repeat, short enough that coming back after a
 *   thought starts something new.
 */
export function createHistory<T>(limit = 20, idle = 1000): History<T> {
  const stack: Entry<T>[] = [];
  return {
    push(state, tag, now = Date.now()) {
      const top = stack[stack.length - 1];
      // Same gesture, still running: keep the state from the start of the run,
      // which is where undo has to land, and only move the clock forward.
      if (top && tag !== '' && top.tag === tag && now - top.at <= idle) {
        top.at = now;
        return;
      }
      stack.push({ state, tag, at: now });
      // Oldest first: running out of history should cost you the distant past.
      if (stack.length > limit) stack.shift();
    },
    pop() {
      return stack.pop()?.state ?? null;
    },
    depth() {
      return stack.length;
    },
    clear() {
      stack.length = 0;
    },
  };
}
