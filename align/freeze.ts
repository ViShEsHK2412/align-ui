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

const STYLE_ID = '__align_freeze';

/**
 * Any animation that *starts* while frozen would otherwise run. Pausing on
 * arrival costs one rule and covers the case where a hover fires under a
 * stationary cursor.
 *
 * Our own UI is in a closed shadow root, which a page rule cannot reach into,
 * so the host element is the only thing needing an exception.
 */
const CSS = `
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`;

let frozen = false;
/** Exactly what we paused, so unfreezing restores that and nothing else. */
let paused: Animation[] = [];
let pausedVideos: HTMLVideoElement[] = [];

/** Is this node part of the tool rather than the page? */
function ours(node: Node | null): boolean {
  let n: Node | null = node;
  while (n) {
    if (n instanceof Element && n.hasAttribute('data-align-ignore')) return true;
    const root = n.getRootNode();
    // Climb out of a shadow tree through its host, not its parent.
    n = root instanceof ShadowRoot ? root.host : (n.parentNode ?? null);
    if (n === document) return false;
  }
  return false;
}

export function isFrozen(): boolean {
  return frozen;
}

export function setFrozen(on: boolean): void {
  if (on === frozen) return;
  frozen = on;

  if (!on) {
    document.documentElement.removeAttribute('data-align-frozen');
    document.getElementById(STYLE_ID)?.remove();
    // Only what we paused, and only if it still exists to be resumed.
    for (const a of paused) {
      try { a.play(); } catch { /* its element went away mid-freeze */ }
    }
    for (const v of pausedVideos) {
      void v.play().catch(() => { /* autoplay policy, or it was removed */ });
    }
    paused = [];
    pausedVideos = [];
    return;
  }

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    style.setAttribute('data-align-ignore', '');
    document.head.appendChild(style);
  }
  document.documentElement.setAttribute('data-align-frozen', '');

  paused = [];
  try {
    for (const a of document.getAnimations()) {
      // Only what is actually running. Pausing a finished animation would make
      // it restart on play(), so an entrance would replay on every unfreeze.
      if (a.playState !== 'running') continue;
      const target = (a.effect as KeyframeEffect | null)?.target ?? null;
      if (ours(target)) continue;
      a.pause();
      paused.push(a);
    }
  } catch {
    /* getAnimations is not everywhere; the CSS rule still does its half */
  }

  pausedVideos = [];
  for (const v of Array.from(document.querySelectorAll('video'))) {
    if (v.paused || ours(v)) continue;
    v.pause();
    pausedVideos.push(v);
  }
}

/**
 * What this does not stop: an animation driven by `requestAnimationFrame` or a
 * timer, which is most canvas work and some carousels. Agentation patches
 * `setTimeout`, `setInterval` and `rAF` globally and replays what it swallowed,
 * which does cover them — and which also means a debounce in the host page
 * fires late and a promise resolves out of order. That is a reasonable trade
 * for a tool whose job is annotation, and a poor one for a tool that claims to
 * leave the page as it found it. Left undone deliberately.
 */
