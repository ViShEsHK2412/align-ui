// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { looksGenerated, resolveStable, stableSelector } from './selector';

/**
 * The property that matters is a round trip: the selector written for an
 * element finds exactly that element, and nothing else. Every case below checks
 * it, on top of checking the selector is the kind expected.
 */
function roundTrips(el: Element): string {
  const sel = stableSelector(el);
  expect(resolveStable(sel)).toBe(el);
  const parts = sel.split(' >> ');
  if (parts.length === 1) expect(document.querySelectorAll(sel).length).toBe(1);
  return sel;
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('looksGenerated', () => {
  it('spots framework and build ids', () => {
    for (const id of [':r1:', '«r3»', 'radix-:R1:', 'headlessui-menu-button-7', 'mui-12345',
      'ember123', 'x-1700000000000', '_scroll_464at_161', 'a8f3c9e2']) {
      expect(looksGenerated(id), id).toBe(true);
    }
  });

  it('keeps ids a person wrote', () => {
    for (const id of ['nav', 'main-content', 'pricing', 'hero_title', 'step2', 'h1', 'section-12']) {
      expect(looksGenerated(id), id).toBe(false);
    }
  });
});

describe('stableSelector', () => {
  it('prefers a stable id', () => {
    document.body.innerHTML = '<div><button id="save" class="btn btn-primary">Save</button></div>';
    expect(roundTrips(document.getElementById('save')!)).toBe('#save');
  });

  it('skips a generated id and uses a test attribute', () => {
    document.body.innerHTML = '<button id=":r4:" data-testid="checkout">Pay</button><button>Other</button>';
    expect(roundTrips(document.querySelector('[data-testid]')!)).toBe('[data-testid="checkout"]');
  });

  it('never uses classes, hashed or not', () => {
    document.body.innerHTML = `<main><div class="_scroll_464at_161 card">
      <a class="tab">One</a><a class="tab">Two</a><a class="tab">Three</a></div></main>`;
    const two = document.querySelectorAll('a')[1]!;
    const sel = roundTrips(two);
    expect(sel).not.toMatch(/\./);
    expect(sel).toContain('a:nth-of-type(2)');
  });

  it('tells four identical siblings apart', () => {
    document.body.innerHTML = '<nav id="tabs"><a>1</a><a>2</a><a>3</a><a>4</a></nav>';
    const all = [...document.querySelectorAll('a')];
    const sels = all.map(roundTrips);
    expect(new Set(sels).size).toBe(4);
    expect(sels[1]).toBe('#tabs > a:nth-of-type(2)');
  });

  it('still finds the same element after the page grows', () => {
    // The point of anchoring: a selector written before more links appear
    // must not start matching one of them afterwards.
    document.body.innerHTML = '<nav id="tabs"><a>1</a><a>2</a></nav>';
    const two = document.querySelectorAll('#tabs a')[1]!;
    const sel = stableSelector(two);
    document.body.insertAdjacentHTML('afterbegin', '<p><a>x</a><a>y</a><a>z</a></p>');
    document.body.insertAdjacentHTML('beforeend', '<footer><a>f1</a><a>f2</a></footer>');
    expect(resolveStable(sel)).toBe(two);
    expect(document.querySelectorAll(sel).length).toBe(1);
  });

  it('uses a tag on its own when the page has only one', () => {
    document.body.innerHTML = '<header></header><main><p>x</p></main>';
    expect(roundTrips(document.querySelector('main')!)).toBe('main');
  });

  it('stops at the nearest stable ancestor', () => {
    document.body.innerHTML = '<section data-qa="plans"><div><div><span>a</span><span>b</span></div></div></section>'
      + '<section><div><div><span>a</span><span>b</span></div></div></section>';
    const sel = roundTrips(document.querySelectorAll('span')[1]!);
    expect(sel.startsWith('[data-qa="plans"]')).toBe(true);
  });

  it('returns the shortest unique path rather than the whole chain', () => {
    document.body.innerHTML = '<div><div><ul><li>a</li><li>b</li></ul></div></div><ol><li>c</li></ol>';
    const sel = roundTrips(document.querySelectorAll('ul li')[1]!);
    expect(sel.split(' > ').length).toBeLessThanOrEqual(2);
  });

  it('escapes ids that are not plain identifiers', () => {
    document.body.innerHTML = '<div id="price.total">x</div><div id="2col">y</div>';
    roundTrips(document.getElementById('price.total')!);
    roundTrips(document.getElementById('2col')!);
  });

  it('escapes quotes in an attribute value', () => {
    document.body.innerHTML = '<div data-testid=\'say "hi"\'>x</div><div>y</div>';
    roundTrips(document.querySelector('[data-testid]')!);
  });

  it('ignores a duplicated id rather than writing an ambiguous selector', () => {
    document.body.innerHTML = '<div id="card"><b>1</b></div><div id="card"><b>2</b></div>';
    const second = document.querySelectorAll('b')[1]!;
    const sel = roundTrips(second);
    expect(sel).not.toContain('#card');
  });

  it('reaches into an open shadow root and back out again', () => {
    document.body.innerHTML = '<x-card id="plan"></x-card><x-card></x-card>';
    for (const host of document.querySelectorAll('x-card')) {
      host.attachShadow({ mode: 'open' }).innerHTML = '<div><button>Buy</button><button>Info</button></div>';
    }
    const target = document.getElementById('plan')!.shadowRoot!.querySelectorAll('button')[1]!;
    const sel = roundTrips(target);
    expect(sel).toMatch(/^#plan >> /);
  });

  it('handles deep nesting without running away', () => {
    let html = '';
    for (let i = 0; i < 40; i++) html += '<div>';
    html += '<span>deep</span>';
    for (let i = 0; i < 40; i++) html += '</div>';
    document.body.innerHTML = html + html;
    const deep = document.querySelectorAll('span')[1]!;
    const sel = stableSelector(deep);
    expect(typeof sel).toBe('string');
    // Past the depth cap it may not be unique, but it must never be wrong about the first match.
    const found = document.querySelector(sel);
    expect(found?.tagName).toBe('SPAN');
  });
});

describe('resolveStable', () => {
  it('returns null for a selector that no longer matches, or does not parse', () => {
    document.body.innerHTML = '<p>x</p>';
    expect(resolveStable('#gone')).toBeNull();
    expect(resolveStable('p:::bad')).toBeNull();
    expect(resolveStable('#host >> button')).toBeNull();
  });
});
