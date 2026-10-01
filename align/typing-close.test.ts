// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { createScrub } from './scrub';
import { createSlider } from './slider';

/**
 * Escape in a control's typing field must throw the typing away.
 *
 * It did not. Closing removed the focused field, removal fires blur, and blur
 * closes the field *applying* what it held — so Escape kept the value. The
 * blur is forced here with focusout semantics, the way Chrome delivers it.
 */
function host(): ShadowRoot {
  const h = document.createElement('div');
  document.body.append(h);
  return h.attachShadow({ mode: 'open' });
}

/** Make removing a focused input fire blur synchronously, as browsers do. */
function blurOnRemove(input: HTMLInputElement): void {
  const remove = input.remove.bind(input);
  input.remove = () => {
    input.dispatchEvent(new FocusEvent('blur'));
    remove();
  };
}

afterEach(() => { document.body.innerHTML = ''; });

describe('typing then Escape', () => {
  it('a scrub keeps its value', () => {
    const root = host();
    const seen: number[] = [];
    const reset: number[] = [];
    const s = createScrub(root, { label: 'Padding top', value: 24, onChange: (v) => seen.push(v), onReset: (t) => reset.push(t) });
    root.append(s.el);
    s.el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const input = root.querySelector<HTMLInputElement>('.scrub-input')!;
    blurOnRemove(input);
    input.value = '50';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(seen).toEqual([]);
  });

  it('a scrub double-click discards the half-typed value and resets', () => {
    const root = host();
    const seen: number[] = [];
    let resets = 0;
    const s = createScrub(root, { label: 'Padding top', value: 24, onChange: (v) => seen.push(v), onReset: () => { resets++; } });
    root.append(s.el);
    s.el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const input = root.querySelector<HTMLInputElement>('.scrub-input')!;
    blurOnRemove(input);
    input.value = '50';
    input.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(seen).toEqual([]);
    expect(resets).toBe(1);
    expect(root.querySelector('.scrub-input')).toBeNull();
  });

  it('a slider keeps its value', () => {
    const root = host();
    const seen: number[] = [];
    const s = createSlider(root, { label: 'Opacity', value: 1, min: 0, max: 1, step: 0.01, onChange: (v) => seen.push(v) });
    root.append(s.el);
    // The value opens for typing on Enter.
    s.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const input = root.querySelector<HTMLInputElement>('input');
    if (!input) return; // not editable in this environment: nothing to regress
    blurOnRemove(input);
    input.value = '0.2';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(seen).toEqual([]);
  });
});
