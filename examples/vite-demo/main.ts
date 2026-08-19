// ?stress=2000 tiles N extra elements across the viewport to time a full scan
// against the §11 budget (2000 elements < 100ms).
const stress = Number(new URLSearchParams(location.search).get('stress') ?? 0);
if (stress > 0) {
  const host = document.getElementById('stress')!;
  host.style.cssText = 'position: fixed; inset: 0; z-index: 0;';
  const cols = Math.floor(window.innerWidth / 12) || 1;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < stress; i++) {
    const d = document.createElement('div');
    d.className = 'px';
    // Exact multiples of 12 — these must cluster cleanly and report nothing.
    d.style.left = (i % cols) * 12 + 'px';
    d.style.top = Math.floor(i / cols) * 12 + 'px';
    frag.appendChild(d);
  }
  host.appendChild(frag);
}

// Phase 6 harness: track the keydown listeners actually registered on window,
// so `?hmrprobe` can prove the tool leaves exactly one after N saves. A Set of
// function refs, not a counter — a removal that matches nothing must not skew it.
if (new URLSearchParams(location.search).has('hmrprobe')) {
  const w = window as unknown as { __keydowns: Set<unknown> };
  if (!w.__keydowns) {
    w.__keydowns = new Set();
    const add = EventTarget.prototype.addEventListener;
    const remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (this: unknown, type, fn, ...rest) {
      if ((this === window || this === undefined) && type === 'keydown') w.__keydowns.add(fn);
      return add.call(this, type, fn, ...rest as [never]);
    };
    EventTarget.prototype.removeEventListener = function (this: unknown, type, fn, ...rest) {
      if ((this === window || this === undefined) && type === 'keydown') w.__keydowns.delete(fn);
      return remove.call(this, type, fn, ...rest as [never]);
    };
  }
}

if (import.meta.env.DEV) {
  import('../../align/index').then((m) => m.initAlign());
}

// Accept updates in place so a save exercises the tool's HMR dispose path
// instead of triggering a full page reload, which would hide any stacking.
import.meta.hot?.accept();
