import { describe, expect, it } from 'vitest';
import { createHistory } from './history';

describe('createHistory', () => {
  it('has nothing to undo until something is recorded', () => {
    const h = createHistory<number>();
    expect(h.pop()).toBeNull();
    expect(h.depth()).toBe(0);
  });

  it('gives back the state as it was before each change, newest first', () => {
    const h = createHistory<number>();
    h.push([1], '', 0);
    h.push([1, 2], '', 0);
    expect(h.pop()).toEqual([1, 2]);
    expect(h.pop()).toEqual([1]);
    expect(h.pop()).toBeNull();
  });

  it('collapses an uninterrupted run of one gesture into a single entry', () => {
    const h = createHistory<number>();
    h.push([0], 'nudge:7', 0);
    for (let i = 1; i < 30; i += 1) h.push([i], 'nudge:7', i * 30);
    expect(h.depth()).toBe(1);
    // Undo lands before the first nudge of the run, not before the last.
    expect(h.pop()).toEqual([0]);
  });

  it('starts a new entry when the run pauses longer than the idle window', () => {
    const h = createHistory<number>(20, 1000);
    h.push([0], 'nudge:7', 0);
    h.push([1], 'nudge:7', 999);
    expect(h.depth()).toBe(1);
    h.push([2], 'nudge:7', 2000);
    expect(h.depth()).toBe(2);
  });

  it('starts a new entry when a different gesture interrupts the run', () => {
    const h = createHistory<number>();
    h.push([0], 'nudge:7', 0);
    h.push([1], 'nudge:9', 10);   // a different guide is a different gesture
    h.push([2], 'nudge:7', 20);
    expect(h.depth()).toBe(3);
  });

  it('never coalesces an untagged change, however fast it repeats', () => {
    // Deleting two guides in quick succession is two things you did.
    const h = createHistory<number>();
    h.push([0], '', 0);
    h.push([1], '', 1);
    expect(h.depth()).toBe(2);
  });

  it('forgets the distant past rather than the recent, at the limit', () => {
    const h = createHistory<number>(3);
    for (let i = 0; i < 5; i += 1) h.push([i], '', i * 5000);
    expect(h.depth()).toBe(3);
    expect(h.pop()).toEqual([4]);
    expect(h.pop()).toEqual([3]);
    expect(h.pop()).toEqual([2]);
  });

  it('shows what pop would return without taking it', () => {
    const h = createHistory<number>();
    h.push([1], '', 0);
    h.push([2], '', 5000);
    expect(h.peek()).toEqual([2]);
    expect(h.depth()).toBe(2);
    expect(h.pop()).toEqual([2]);
    expect(h.peek()).toEqual([1]);
  });

  it('peeks null on an empty stack', () => {
    expect(createHistory<number>().peek()).toBeNull();
  });

  it('clears', () => {
    const h = createHistory<number>();
    h.push([1], '', 0);
    h.clear();
    expect(h.depth()).toBe(0);
    expect(h.pop()).toBeNull();
  });
});
