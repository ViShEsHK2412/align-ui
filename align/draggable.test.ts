import { describe, expect, it } from 'vitest';
import { clampOffset } from './draggable';

/**
 * The clamp is the only part of dragging worth testing without a browser: the
 * rest is pointer capture and event plumbing, which a fake DOM would prove
 * nothing about.
 *
 * `natural` is where the surface sits with no offset. That is what makes one
 * function serve all three panels, which are placed by different CSS — the box
 * model bottom-left, the toolbar top-right, the edit dock top-left.
 */

describe('clampOffset', () => {
  // A 300-wide panel whose CSS puts it at x=100, in a 1000-wide window.
  const panel = { natural: 100, size: 300, viewport: 1000 };
  const at = (offset: number) =>
    clampOffset(panel.natural, panel.size, offset, panel.viewport);

  it('leaves an offset that keeps the surface on screen alone', () => {
    expect(at(0)).toBe(0);
    expect(at(50)).toBe(50);
    expect(at(-50)).toBe(-50);
  });

  it('stops the near edge at the margin', () => {
    // natural 100, so -84 puts the left edge at 16 and -85 would breach it.
    expect(at(-84)).toBe(-84);
    expect(at(-500)).toBe(-84);
  });

  it('stops the far edge at the margin', () => {
    // 1000 - 16 - 300 - 100 = 584.
    expect(at(584)).toBe(584);
    expect(at(5000)).toBe(584);
  });

  it('holds a surface that starts out of bounds rather than teleporting it', () => {
    // Placed off the right edge by its own CSS: the clamp pulls it back to the
    // margin, which is the only position that is both legal and nearest.
    expect(clampOffset(980, 300, 0, 1000)).toBe(1000 - 16 - 300 - 980);
  });

  it('pins the near edge when the surface is bigger than the window', () => {
    /*
     * No legal position exists. Pinning the near edge keeps the top of a panel
     * readable; clamping to the far bound instead would push its header off
     * screen, which is exactly the part you need to drag it back.
     */
    const offset = clampOffset(100, 900, 0, 500);
    expect(offset).toBe(16 - 100);
    expect(100 + offset).toBe(16);
  });

  it('honours a margin of zero', () => {
    expect(clampOffset(100, 300, -500, 1000, 0)).toBe(-100);
    expect(clampOffset(100, 300, 5000, 1000, 0)).toBe(600);
  });

  it('works the same for a surface the CSS pinned to the far edge', () => {
    // The toolbar: 200 wide, 16 from the right of a 1000 window, so x = 784.
    const toolbar = (offset: number) => clampOffset(784, 200, offset, 1000);
    expect(toolbar(0)).toBe(0);
    expect(toolbar(100)).toBe(0);      // already against the right margin
    expect(toolbar(-768)).toBe(-768);  // all the way to the left margin
    expect(toolbar(-5000)).toBe(-768);
  });

  it('is idempotent: clamping a clamped value changes nothing', () => {
    for (const raw of [-5000, -84, 0, 300, 584, 5000]) {
      const once = at(raw);
      expect(at(once)).toBe(once);
    }
  });
});
