import { describe, expect, it } from 'vitest';
import { isHitCatcher } from './measure';

const shield = {
  tag: 'DIV', children: 0, text: '', background: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'none', borderWidths: [0, 0, 0, 0], boxShadow: 'none', outlineWidth: 0,
};

describe('isHitCatcher', () => {
  it('recognises the interaction lab shield: empty, transparent, drawing nothing', () => {
    expect(isHitCatcher(shield)).toBe(true);
    expect(isHitCatcher({ ...shield, background: 'transparent' })).toBe(true);
    expect(isHitCatcher({ ...shield, background: 'rgb(0 0 0 / 0)' })).toBe(true);
  });

  it('keeps anything that draws, because you can see it', () => {
    expect(isHitCatcher({ ...shield, background: 'rgb(255, 255, 255)' })).toBe(false);
    expect(isHitCatcher({ ...shield, backgroundImage: 'url(a.png)' })).toBe(false);
    expect(isHitCatcher({ ...shield, borderWidths: [0, 0, 1, 0] })).toBe(false);
    expect(isHitCatcher({ ...shield, boxShadow: '0 1px 2px black' })).toBe(false);
    expect(isHitCatcher({ ...shield, outlineWidth: 1 })).toBe(false);
  });

  it('keeps anything with content', () => {
    expect(isHitCatcher({ ...shield, children: 1 })).toBe(false);
    expect(isHitCatcher({ ...shield, text: 'Continue' })).toBe(false);
  });

  it('keeps elements that paint themselves or take input', () => {
    for (const tag of ['IMG', 'svg', 'CANVAS', 'VIDEO', 'INPUT', 'BUTTON', 'IFRAME']) {
      expect(isHitCatcher({ ...shield, tag })).toBe(false);
    }
  });

  it('does not mistake a partly transparent colour for none', () => {
    expect(isHitCatcher({ ...shield, background: 'rgba(0, 0, 0, 0.05)' })).toBe(false);
  });
});
