// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { collectLintBoxes, LINT_MAX_ELEMENTS } from './lint-dom';

/**
 * happy-dom does no layout, so every element is given a box by hand. What is
 * tested is the walk's judgement — what it keeps, what it skips — not the
 * browser's geometry.
 */
function layout(el: Element, x: number, y: number, w: number, h: number) {
  el.getBoundingClientRect = () => ({
    x, y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, toJSON() {},
  }) as DOMRect;
}

const SKIP = '[data-align-ignore]';

beforeEach(() => {
  document.body.innerHTML = '';
  (globalThis as { innerWidth: number }).innerWidth = 1000;
  (globalThis as { innerHeight: number }).innerHeight = 800;
});

describe('collectLintBoxes', () => {
  it('collects a container with its in-flow children and its padding', () => {
    document.body.innerHTML = '<div id="c" style="padding: 12px 16px; display: flex"><p>a</p><p>b</p></div>';
    const c = document.getElementById('c')!;
    layout(c, 0, 0, 300, 100);
    const [a, b] = c.querySelectorAll('p');
    layout(a!, 16, 12, 100, 40);
    layout(b!, 130, 12, 100, 40);
    const boxes = collectLintBoxes(SKIP);
    const box = boxes.find((x) => x.rect.w === 300)!;
    expect(box.padding).toEqual([12, 16, 12, 16]);
    expect(box.children).toHaveLength(2);
    expect(box.justify).toBe(getComputedStyle(c).justifyContent);
  });

  it('leaves out absolute, fixed, hidden, display:none and zero-size children', () => {
    document.body.innerHTML = `<div id="c">
      <p>kept</p>
      <p style="position:absolute">abs</p>
      <p style="position:fixed">fixed</p>
      <p style="visibility:hidden">hid</p>
      <p style="display:none">none</p>
      <p id="empty"></p>
    </div>`;
    const c = document.getElementById('c')!;
    layout(c, 0, 0, 300, 300);
    for (const p of c.querySelectorAll('p')) layout(p, 0, 0, 100, 20);
    layout(document.getElementById('empty')!, 0, 0, 0, 0);
    const box = collectLintBoxes(SKIP).find((x) => x.rect.h === 300)!;
    expect(box.children).toHaveLength(1);
  });

  it('skips elements off screen, and anything the tool is told to ignore', () => {
    document.body.innerHTML = '<div id="off" style="padding:8px"><p>x</p></div><div id="ign" data-align-ignore style="padding:8px"><p>y</p></div>';
    layout(document.getElementById('off')!, 0, 2000, 100, 100);
    layout(document.getElementById('ign')!, 0, 0, 100, 100);
    for (const p of document.querySelectorAll('p')) layout(p, 8, 8, 50, 20);
    const ids = collectLintBoxes(SKIP).map((b) => b.rect.y);
    expect(ids).not.toContain(2000);
    expect(collectLintBoxes(SKIP).some((b) => b.rect.w === 100 && b.rect.y === 0)).toBe(false);
  });

  it('keeps a padded leaf, like a button, and drops an unpadded one', () => {
    document.body.innerHTML = '<button style="padding: 10px 14px">Go</button><span style="display:block">bare</span>';
    layout(document.querySelector('button')!, 0, 0, 60, 30);
    layout(document.querySelector('span')!, 0, 40, 60, 20);
    const boxes = collectLintBoxes(SKIP);
    expect(boxes).toHaveLength(1);
    expect(boxes[0]!.padding).toEqual([10, 14, 10, 14]);
  });

  it('measures no gaps inside table layout, only the padding of a cell', () => {
    // By display, not tag: divs avoid the implicit tbody, whose display
    // happy-dom does not know.
    const td = (s: string) => `<div style="display: table-cell; ${s}">x</div>`;
    const tr = (cells: string) => `<div style="display: table-row">${cells}</div>`;
    document.body.innerHTML = '<div id="t" style="display: table">'
      + tr(td('padding: 2px 14px') + td('padding: 2px 14px')) + tr(td('') + td('')) + '</div>';
    let y = 0;
    for (const e of document.querySelectorAll('#t, #t *')) { layout(e, 0, y, 200, 20); y += 22; }
    const boxes = collectLintBoxes(SKIP);
    expect(boxes.every((b) => b.children.length === 0)).toBe(true);
    expect(boxes.filter((b) => b.padding[1] === 14)).toHaveLength(2);
  });

  it('never looks inside an SVG', () => {
    document.body.innerHTML = '<svg><g><rect width="10" height="10"></rect></g></svg>';
    for (const e of document.querySelectorAll('svg, g, rect')) layout(e, 0, 0, 10, 10);
    const tags = collectLintBoxes(SKIP);
    expect(tags.every((b) => b.rect.w === 10)).toBe(true);
    expect(tags.length).toBeLessThanOrEqual(1);
  });

  it('still measures what is on screen far down a long page', () => {
    const off = Array.from({ length: LINT_MAX_ELEMENTS + 500 }, () => '<div class="off" style="padding:4px"></div>').join('');
    document.body.innerHTML = off + '<div id="here" style="padding:6px"></div>';
    for (const d of document.querySelectorAll('.off')) layout(d, 0, -5000, 50, 50);
    layout(document.getElementById('here')!, 0, 0, 50, 50);
    expect(collectLintBoxes(SKIP).map((b) => b.padding[0])).toEqual([6]);
  });

  it('stops after the element cap on a huge page', () => {
    const many = Array.from({ length: LINT_MAX_ELEMENTS + 500 }, () => '<div style="padding:4px"></div>').join('');
    document.body.innerHTML = many;
    for (const d of document.querySelectorAll('div')) layout(d, 0, 0, 50, 50);
    expect(collectLintBoxes(SKIP).length).toBeLessThanOrEqual(LINT_MAX_ELEMENTS);
  });
});
