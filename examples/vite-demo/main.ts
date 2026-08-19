// Demo harness. The tool itself is imported at the bottom.
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
