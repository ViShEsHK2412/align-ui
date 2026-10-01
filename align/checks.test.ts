// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { checkScript } from './checks';
import { formatPrompt, type PromptRow } from './edit';

/** Pull the snippet out of the Markdown and run it, the way an agent would. */
function run(markdown: string): string {
  const code = markdown.match(/```js\n([\s\S]*?)\n```/)?.[1];
  if (!code) throw new Error('no snippet');
  return new Function(`return ${code}`)() as string;
}

afterEach(() => { document.body.innerHTML = ''; });

describe('checkScript', () => {
  it('is nothing when there is nothing to check', () => {
    expect(checkScript('/', [])).toBe('');
  });

  it('passes when every value computes to what was asked', () => {
    document.body.innerHTML = '<div id="card" style="padding-top: 16px; opacity: 0.5"></div>';
    const md = checkScript('/pricing', [
      { selector: '#card', prop: 'padding-top', value: '16px' },
      { selector: '#card', prop: 'opacity', value: '0.5' },
    ]);
    expect(md).toContain('/pricing');
    expect(run(md)).toBe('all 2 checks pass');
  });

  it('says exactly what is still off, and what is missing', () => {
    document.body.innerHTML = '<div id="card" style="padding-top: 12px"></div>';
    const out = run(checkScript('/', [
      { selector: '#card', prop: 'padding-top', value: '16px' },
      { selector: '#gone', prop: 'opacity', value: '1' },
    ]));
    expect(out).toContain('#card padding-top: 12px, want 16px');
    expect(out).toContain('#gone: not found');
  });

  it('steps into shadow roots on >>', () => {
    document.body.innerHTML = '<x-card id="host"></x-card>';
    const root = document.getElementById('host')!.attachShadow({ mode: 'open' });
    root.innerHTML = '<p class="body" style="margin-top: 8px"></p>';
    expect(run(checkScript('/', [{ selector: '#host >> p.body', prop: 'margin-top', value: '8px' }]))).toBe('all 1 checks pass');
  });

  it('keeps the last value asked of a property, once', () => {
    const md = checkScript('/', [
      { selector: '#a', prop: 'gap', value: '4px' },
      { selector: '#a', prop: 'gap', value: '8px' },
    ]);
    expect(md.match(/"gap"/g)).toHaveLength(1);
    expect(md).toContain('"8px"');
  });

  it('survives quotes and backslashes in selectors', () => {
    document.body.innerHTML = '<div data-testid="it\'s" style="opacity: 0.3"></div>';
    expect(run(checkScript('/', [{ selector: '[data-testid="it\'s"]', prop: 'opacity', value: '0.3' }]))).toBe('all 1 checks pass');
  });
});

describe('the edit prompt ends with its check', () => {
  const row = (over: Partial<PromptRow> = {}): PromptRow =>
    ({ selector: '.card', locator: '#card', prop: 'padding-top', from: '12px', to: '16px', token: '--space-4', ...over });

  it('checks the computed value even where it writes a token', () => {
    const md = formatPrompt([row()], '/home');
    expect(md).toContain('var(--space-4)');
    expect(md).toContain('["#card","padding-top","16px"]');
    document.body.innerHTML = '<div id="card" style="padding-top: 16px"></div>';
    expect(run(md)).toBe('all 1 checks pass');
  });

  it('has no check without a page to run it on', () => {
    expect(formatPrompt([row()])).not.toContain('```js');
  });
});
