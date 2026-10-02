// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { holdPointer } from './hold-pointer';

/** An element whose pointer capture is tracked by hand, since happy-dom has none. */
function captured() {
  const el = document.createElement('div');
  let held: number | null = null;
  let releases = 0;
  el.setPointerCapture = (id: number) => { held = id; };
  el.hasPointerCapture = (id: number) => held === id;
  el.releasePointerCapture = () => {
    held = null;
    releases++;
    el.dispatchEvent(new Event('lostpointercapture'));
  };
  return { el, releases: () => releases, held: () => held };
}

describe('holdPointer', () => {
  it('captures the pointer', () => {
    const c = captured();
    holdPointer(c.el, 7);
    expect(c.held()).toBe(7);
  });

  it('lets go when the window loses focus mid-drag', () => {
    const c = captured();
    holdPointer(c.el, 7);
    dispatchEvent(new Event('blur'));
    expect(c.held()).toBeNull();
    expect(c.releases()).toBe(1);
  });

  it('forgets the window once the drag has ended normally', () => {
    const c = captured();
    holdPointer(c.el, 7);
    c.el.releasePointerCapture(7);
    dispatchEvent(new Event('blur'));
    expect(c.releases()).toBe(1);
  });

  it('survives a pointer that is already up', () => {
    const el = document.createElement('div');
    el.setPointerCapture = () => { throw new DOMException('gone', 'NotFoundError'); };
    expect(() => holdPointer(el, 1)).not.toThrow();
    expect(() => dispatchEvent(new Event('blur'))).not.toThrow();
  });
});
