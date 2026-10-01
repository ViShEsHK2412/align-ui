// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createEditor, type Editor } from './edit';

/**
 * Undo in edit mode. The clock is injected so "a second later" is a number,
 * and the microtask that closes a run of writes is awaited explicitly.
 */
let t = 0;
let ed: Editor;
let el: HTMLElement;
const tick = () => Promise.resolve();
const style = (prop: string) => el.style.getPropertyValue(prop);

beforeEach(() => {
  t = 1000;
  ed = createEditor(() => t);
  ed.arm();
  document.body.innerHTML = '<div id="x" style="padding-top: 4px"></div>';
  el = document.getElementById('x')!;
});

describe('edit undo', () => {
  it('takes a whole drag back in one step', async () => {
    ed.beginGesture();
    for (const v of ['5px', '6px', '7px', '8px']) { ed.set(el, 'padding-top', v); t += 16; await tick(); }
    ed.endGesture();
    expect(style('padding-top')).toBe('8px');
    ed.undo();
    expect(style('padding-top')).toBe('4px');
    expect(ed.canUndo()).toBe(false);
  });

  it('two drags are two steps, however close together', async () => {
    ed.beginGesture(); ed.set(el, 'padding-top', '10px'); ed.endGesture();
    await tick();
    ed.beginGesture(); ed.set(el, 'padding-top', '20px'); ed.endGesture();
    ed.undo();
    expect(style('padding-top')).toBe('10px');
    ed.undo();
    expect(style('padding-top')).toBe('4px');
  });

  it('takes a linked change of four sides back in one step', async () => {
    for (const side of ['top', 'right', 'bottom', 'left']) ed.set(el, `padding-${side}`, '12px');
    await tick();
    ed.undo();
    expect(style('padding-top')).toBe('4px');
    expect(style('padding-left')).toBe('');
    expect(ed.canUndo()).toBe(false);
  });

  it('collapses a held arrow key on one property, and splits after a pause', async () => {
    for (const v of ['5px', '6px', '7px']) { ed.set(el, 'padding-top', v); t += 100; await tick(); }
    t += 2000;
    ed.set(el, 'padding-top', '20px');
    await tick();
    ed.undo();
    expect(style('padding-top')).toBe('7px');
    ed.undo();
    expect(style('padding-top')).toBe('4px');
  });

  it('does not merge keyboard changes to different properties', async () => {
    ed.set(el, 'padding-top', '9px'); await tick(); t += 10;
    ed.set(el, 'margin-top', '9px'); await tick();
    ed.undo();
    expect(style('margin-top')).toBe('');
    expect(style('padding-top')).toBe('9px');
  });

  it('undoing the first change leaves the property untouched again, so it drops out of the prompt', async () => {
    ed.set(el, 'color', 'red'); await tick();
    expect(ed.touched(el, 'color')).toBe(true);
    ed.undo();
    expect(ed.touched(el, 'color')).toBe(false);
    expect(ed.changes()).toEqual([]);
    expect(style('color')).toBe('');
  });

  it('redoes what was undone, and a new edit clears redo', async () => {
    ed.set(el, 'padding-top', '30px'); await tick();
    ed.undo();
    expect(ed.canRedo()).toBe(true);
    ed.redo();
    expect(style('padding-top')).toBe('30px');
    expect(ed.touched(el, 'padding-top')).toBe(true);
    ed.undo();
    ed.set(el, 'padding-top', '11px'); await tick();
    expect(ed.canRedo()).toBe(false);
  });

  it('keeps the original through undo and redo, so Revert all still lands on the page as it was', async () => {
    ed.set(el, 'padding-top', '30px'); await tick(); t += 5000;
    ed.set(el, 'padding-top', '40px'); await tick();
    ed.undo();
    ed.redo();
    ed.revertAll();
    expect(style('padding-top')).toBe('4px');
  });

  it('can take back Revert all', async () => {
    ed.set(el, 'padding-top', '30px'); await tick();
    ed.set(el, 'margin-top', '2px'); await tick();
    ed.revertAll();
    expect(style('padding-top')).toBe('4px');
    ed.undo();
    expect(style('padding-top')).toBe('30px');
    expect(style('margin-top')).toBe('2px');
    expect(ed.touched(el, 'margin-top')).toBe(true);
  });

  it('forgets everything on disarm, and refuses to undo while disarmed', async () => {
    ed.set(el, 'padding-top', '30px'); await tick();
    ed.disarm();
    expect(ed.canUndo()).toBe(false);
    expect(ed.undo()).toEqual([]);
    expect(style('padding-top')).toBe('4px');
  });

  it('reports which elements a step touched, so the panel can re-read them', async () => {
    ed.set(el, 'padding-top', '30px'); await tick();
    expect(ed.undo()).toEqual([el]);
    expect(ed.redo()).toEqual([el]);
  });

  it('dates its newest step, for ordering against guide undo', async () => {
    expect(ed.lastAt()).toBeNull();
    t = 5000;
    ed.set(el, 'padding-top', '30px'); await tick();
    expect(ed.lastAt()).toBe(5000);
  });

  describe('collapseSince, for a double-click reset', () => {
    it('folds the two clicks and the reset into one step, landing before the clicks', async () => {
      ed.beginGesture(); ed.set(el, 'padding-top', '30px'); ed.endGesture(); await tick();
      t += 5000;
      // The double-click: two clicks that each move the slider, then the reset.
      ed.beginGesture(); ed.set(el, 'padding-top', '50px'); ed.endGesture(); t += 120;
      ed.beginGesture(); ed.set(el, 'padding-top', '52px'); ed.endGesture(); t += 30;
      ed.revert(el, 'padding-top');
      ed.collapseSince(t - 800, el);
      expect(style('padding-top')).toBe('4px');
      ed.undo();
      expect(style('padding-top')).toBe('30px');
      ed.undo();
      expect(style('padding-top')).toBe('4px');
      expect(ed.canUndo()).toBe(false);
    });

    it('leaves alone steps that are older, or touched another element', async () => {
      const other = document.createElement('p');
      document.body.append(other);
      ed.set(other, 'color', 'red'); await tick();
      t += 50;
      ed.set(el, 'padding-top', '50px'); await tick();
      t += 2000;
      ed.revert(el, 'padding-top');
      ed.collapseSince(t - 800, el);
      ed.undo();
      expect(style('padding-top')).toBe('50px');
      ed.undo();
      expect(style('padding-top')).toBe('4px');
      expect(other.style.color).toBe('red');
    });

    it('does nothing with a single step', async () => {
      ed.set(el, 'padding-top', '50px'); await tick();
      ed.collapseSince(0, el);
      ed.undo();
      expect(ed.canUndo()).toBe(false);
    });
  });

  it('nothing to undo is a no-op, not an error', () => {
    expect(ed.undo()).toEqual([]);
    expect(ed.redo()).toEqual([]);
  });
});
