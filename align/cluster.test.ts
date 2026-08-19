import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { audit, auditAlignment, auditSpacing, auditSubpixel, cluster, fmt } from './cluster';
import { mergeConfig } from './config';
import { SPACING_PROPS, type Box } from './types';

const cfg = mergeConfig();

let nextKey = 0;
function box(p: Partial<Box> & { left?: number; top?: number }): Box {
  const left = p.left ?? 0;
  const top = p.top ?? 0;
  const width = p.width ?? 100;
  const height = p.height ?? 20;
  return {
    el: {} as Element,
    label: p.label ?? 'div.x',
    key: p.key ?? nextKey++,
    parentKey: p.parentKey ?? -1,
    left,
    top,
    right: p.right ?? left + width,
    bottom: p.bottom ?? top + height,
    centerX: p.centerX ?? left + width / 2,
    centerY: p.centerY ?? top + height / 2,
    width,
    height,
    spacing: p.spacing ?? SPACING_PROPS.map(() => 0),
  };
}

/** Column of boxes at the given left values — the canonical near-miss shape. */
function column(lefts: number[]): Box[] {
  return lefts.map((left, i) => box({ left, top: i * 40 }));
}

describe('cluster', () => {
  it('returns nothing for empty input', () => {
    expect(cluster([], 3)).toEqual([]);
  });

  it('wraps a single value', () => {
    expect(cluster([24], 3)).toEqual([[24]]);
  });

  it('groups exact matches', () => {
    expect(cluster([24, 24, 24, 24, 24], 3)).toEqual([[24, 24, 24, 24, 24]]);
  });

  it('keeps a near-miss inside its cluster', () => {
    expect(cluster([24, 24, 24, 24, 24, 25.5], 3)).toEqual([[24, 24, 24, 24, 24, 25.5]]);
  });

  it('lets a chain drift — compares to the previous member, not the first', () => {
    expect(cluster([24, 25, 26, 27], 3)).toEqual([[24, 25, 26, 27]]);
    // Were it comparing to the first member, 27 would start a second group.
  });

  it('separates genuinely distinct groups', () => {
    expect(cluster([24, 24, 24, 200, 200, 200], 3))
      .toEqual([[24, 24, 24], [200, 200, 200]]);
  });

  it('breaks exactly at the tolerance boundary', () => {
    expect(cluster([0, 3], 3)).toEqual([[0, 3]]);      // gap == tol → same group
    expect(cluster([0, 3.5], 3)).toEqual([[0], [3.5]]);
  });

  it('does not mutate its input', () => {
    const input = [3, 1, 2];
    cluster(input, 3);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe('auditAlignment', () => {
  it('says nothing about an exactly aligned column', () => {
    expect(auditAlignment(column([24, 24, 24, 24, 24]), cfg)).toEqual([]);
  });

  it('finds the near-miss and names the majority', () => {
    const v = auditAlignment(column([24, 24, 24, 24, 24, 25.5]), cfg)
      .filter((x) => x.axis === 'left');
    expect(v).toHaveLength(1);
    expect(v[0]!.majority).toBe(24);
    expect(v[0]!.spread).toBe(1.5);
    expect(v[0]!.boxes).toHaveLength(1);
    expect(v[0]!.all).toHaveLength(6);
    expect(v[0]!.message).toContain('5 at 24px, 1 at 25.5px');
  });

  it('flags a drifting chain', () => {
    const v = auditAlignment(column([24, 25, 26, 27]), cfg).filter((x) => x.axis === 'left');
    expect(v).toHaveLength(1);
    expect(v[0]!.spread).toBe(3);
  });

  it('ignores two separate, internally exact groups', () => {
    expect(auditAlignment(column([24, 24, 24, 200, 200, 200]), cfg)).toEqual([]);
  });

  it('ignores a group below minCluster — two elements sharing an edge is coincidence', () => {
    expect(auditAlignment(column([24, 25.5]), cfg)).toEqual([]);
    expect(auditAlignment(column([24, 24, 25.5]), cfg)).not.toEqual([]);
  });

  it('sorts the worst offender first', () => {
    const boxes = [
      ...column([24, 24, 24, 25.5]),
      ...column([300, 300, 300, 305]).map((b) => ({ ...b, top: b.top + 500 })),
    ];
    const spreads = auditAlignment(boxes, cfg).map((v) => v.spread);
    expect(spreads).toEqual([...spreads].sort((a, b) => b - a));
  });

  it('does not count a wrapper and the child it hugs as two members', () => {
    const parent = box({ key: 0, left: 24, width: 100 });
    const child = box({ key: 1, parentKey: 0, left: 24, width: 100 });
    const others = [box({ key: 2, left: 24 }), box({ key: 3, left: 25.5 })];
    // Four boxes at ~24, but parent+child are one element's worth of evidence,
    // leaving three — still reported. Without the collapse it would read "4".
    const v = auditAlignment([parent, child, ...others], cfg).filter((x) => x.axis === 'left');
    expect(v[0]!.all).toHaveLength(3);
  });

  it('reports one row when several axes describe the same offenders', () => {
    // Same width throughout, so left/right/centerX all carry identical evidence.
    const v = auditAlignment(column([24, 24, 24, 24, 24, 25.5]), cfg);
    expect(v).toHaveLength(1);
    expect(v[0]!.message).toContain('left/right/centerX');
  });
});

describe('auditSubpixel', () => {
  it('flags a half pixel on a 1x display', () => {
    const v = auditSubpixel([box({ top: 100.5 })], cfg, 1);
    expect(v).toHaveLength(1);
    expect(v[0]!.message).toContain('top 100.5px');
  });

  it('leaves the same half pixel alone on a 2x display', () => {
    expect(auditSubpixel([box({ top: 100.5 })], cfg, 2)).toEqual([]);
  });

  it('still flags a quarter pixel on a 2x display', () => {
    expect(auditSubpixel([box({ top: 100.25 })], cfg, 2)).toHaveLength(1);
  });

  it('says nothing about whole pixels', () => {
    expect(auditSubpixel([box({ left: 24, top: 40 })], cfg, 1)).toEqual([]);
  });

  it('blames the element that introduced the offset, not its children', () => {
    const parent = box({ key: 0, left: 10.5, width: 100 });
    const child = box({ key: 1, parentKey: 0, left: 10.5, width: 100 });
    const v = auditSubpixel([parent, child], cfg, 1);
    expect(v).toHaveLength(1);
    expect(v[0]!.boxes[0]!.key).toBe(0);
  });

  it('caps its output so it cannot drown the alignment results', () => {
    const many = Array.from({ length: 50 }, (_, i) => box({ left: 0.5, top: i * 40 }));
    expect(auditSubpixel(many, cfg, 1)).toHaveLength(20);
  });
});

describe('auditSpacing', () => {
  const row = (lefts: number[], width = 80) =>
    lefts.map((left, i) => box({ key: i + 1, parentKey: 0, left, width, top: 0 }));

  it('finds the odd gutter', () => {
    // gaps 16, 16, 18
    const boxes = [box({ key: 0, width: 400 }), ...row([0, 96, 192, 290])];
    const v = auditSpacing(boxes, cfg).filter((x) => x.message.startsWith('gap-x'));
    expect(v).toHaveLength(1);
    expect(v[0]!.majority).toBe(16);
    expect(v[0]!.message).toContain('16, 16, 18px');
  });

  it('says nothing about even gutters', () => {
    const boxes = [box({ key: 0, width: 400 }), ...row([0, 96, 192, 288])];
    expect(auditSpacing(boxes, cfg).filter((x) => x.message.startsWith('gap-x'))).toEqual([]);
  });

  it('needs three siblings before a gutter counts as a pattern', () => {
    const boxes = [box({ key: 0, width: 400 }), ...row([0, 96])];
    expect(auditSpacing(boxes, cfg)).toEqual([]);
  });

  it('flags a value that is not on the scale', () => {
    const spacing = SPACING_PROPS.map((p) => (p === 'paddingLeft' ? 18 : 0));
    const v = auditSpacing([box({ spacing })], cfg);
    expect(v).toHaveLength(1);
    expect(v[0]!.message).toContain('padding-left 18px');
  });

  it('accepts values on the scale', () => {
    const spacing = SPACING_PROPS.map((p) => (p === 'paddingLeft' ? 16 : 0));
    expect(auditSpacing([box({ spacing })], cfg)).toEqual([]);
  });

  it('ignores computed values like an auto margin', () => {
    const spacing = SPACING_PROPS.map((p) => (p === 'marginLeft' ? 333.141 : 0));
    expect(auditSpacing([box({ spacing })], cfg)).toEqual([]);
  });

  it('caps the scale lint at 20', () => {
    const spacing = SPACING_PROPS.map((p) => (p === 'paddingLeft' ? 18 : 0));
    const many = Array.from({ length: 50 }, () => box({ spacing }));
    expect(auditSpacing(many, cfg)).toHaveLength(20);
  });
});

describe('audit', () => {
  it('lists alignment violations before everything else', () => {
    const boxes = [
      ...column([24, 24, 24, 25.5]),
      box({ left: 10.5, top: 900 }),
      box({ spacing: SPACING_PROPS.map((p) => (p === 'paddingLeft' ? 18 : 0)) }),
    ];
    const kinds = audit(boxes, cfg, 1).map((v) => v.kind);
    expect(kinds[0]).toBe('align');
    expect(kinds.lastIndexOf('align')).toBeLessThan(kinds.indexOf('subpixel'));
  });
});

describe('fmt', () => {
  it('strips trailing zeros and keeps the fraction that matters', () => {
    expect(fmt(24)).toBe('24');
    expect(fmt(25.5)).toBe('25.5');
    expect(fmt(25.10)).toBe('25.1');
    expect(fmt(333.141)).toBe('333.14');
  });
});

describe('purity (§4)', () => {
  it('cluster.ts touches no DOM', () => {
    const src = readFileSync(new URL('./cluster.ts', import.meta.url), 'utf8')
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');   // comments may mention them
    expect(src).not.toMatch(/\bdocument\b|\bwindow\b|getComputedStyle|getBoundingClientRect/);
  });

  it('cluster.ts imports nothing but types', () => {
    const src = readFileSync(new URL('./cluster.ts', import.meta.url), 'utf8');
    const imports = [...src.matchAll(/^import .*?from '(.+?)';/gm)].map((m) => m[1]);
    expect(imports.sort()).toEqual(['./config', './types']);
  });
});
