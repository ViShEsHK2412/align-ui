import type { Violation } from './types';

/**
 * Shadow-DOM results panel (§7.3). The second of the two modules allowed to
 * write to the DOM. Elements are built, never assembled from HTML strings —
 * labels come off the page and would otherwise need escaping.
 */

export interface PanelHandlers {
  onTol(value: number): void;
  onHover(v: Violation | null): void;
  onSelect(v: Violation): void;
  onRescan(): void;
  onClose(): void;
}

export interface Panel {
  update(violations: Violation[], opts: { stale: boolean }): void;
  destroy(): void;
}

type Filter = 'all' | 'align' | 'spacing' | 'subpixel';

const CSS = `
:host, * { box-sizing: border-box; }
.panel {
  position: fixed; right: 16px; bottom: 16px; width: 340px; max-height: 60vh;
  display: flex; flex-direction: column; pointer-events: auto;
  font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: #e8edf6; background: #0d1016; border: 1px solid #232a36;
  border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,.45); overflow: hidden;
}
header { display: flex; align-items: center; gap: 8px; padding: 8px 10px;
         border-bottom: 1px solid #232a36; }
header .count { font-weight: 700; }
header .spacer { flex: 1; }
button { font: inherit; color: #9fb0c9; background: none; border: 1px solid #232a36;
         border-radius: 4px; padding: 1px 6px; cursor: pointer; }
button:hover { color: #e8edf6; border-color: #3a4658; }
button.on { color: #0d1016; background: #e8edf6; border-color: #e8edf6; }
.tol { display: flex; align-items: center; gap: 6px; padding: 6px 10px;
       border-bottom: 1px solid #232a36; color: #9fb0c9; }
.tol input { flex: 1; accent-color: #ff4d6d; }
.tabs { display: flex; gap: 4px; padding: 6px 10px; border-bottom: 1px solid #232a36; }
ul { list-style: none; margin: 0; padding: 0; overflow-y: auto; }
li { padding: 6px 10px; border-bottom: 1px solid #161b24; cursor: pointer;
     border-left: 2px solid transparent; }
li:hover { background: #141924; }
li.align { border-left-color: #ff4d6d; }
li.spacing { border-left-color: #ffb020; }
li.subpixel { border-left-color: #4da6ff; }
li .meta { color: #6f8098; font-size: 11px; }
.empty { padding: 16px 10px; color: #6f8098; text-align: center; }
.stale { color: #ffb020; }
`;

export function createPanel(root: ShadowRoot, cfg: { tol: number },
                           handlers: PanelHandlers): Panel {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const panel = el('div', 'panel');
  const header = el('header');
  const count = el('span', 'count');
  const rescan = button('rescan');
  const close = button('✕');
  rescan.classList.add('stale');
  header.append(count, el('span', 'spacer'), rescan, close);

  const tolRow = el('div', 'tol');
  const tolValue = el('span');
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '1';
  slider.max = '8';
  slider.step = '0.5';
  slider.value = String(cfg.tol);
  tolRow.append(text('tol'), slider, tolValue);

  const tabs = el('div', 'tabs');
  const list = document.createElement('ul');
  panel.append(header, tolRow, tabs, list);
  root.appendChild(panel);

  let filter: Filter = 'all';
  let current: Violation[] = [];
  let isStale = false;

  const tabButtons = (['all', 'align', 'spacing', 'subpixel'] as Filter[]).map((name) => {
    const b = button(name);
    b.onclick = () => { filter = name; syncTabs(); render(); };
    tabs.appendChild(b);
    return [name, b] as const;
  });

  function syncTabs() {
    for (const [name, b] of tabButtons) b.classList.toggle('on', name === filter);
  }

  function render() {
    const shown = filter === 'all' ? current : current.filter((v) => v.kind === filter);
    count.textContent = `${current.length} violation${current.length === 1 ? '' : 's'}`;
    tolValue.textContent = `${slider.value}px`;
    rescan.style.display = isStale ? '' : 'none';
    list.replaceChildren();

    if (shown.length === 0) {
      const empty = el('div', 'empty');
      empty.textContent = current.length ? 'nothing in this filter' : 'nothing misaligned';
      list.appendChild(empty);
      return;
    }
    for (const v of shown) {
      const row = document.createElement('li');
      row.className = v.kind;
      const msg = el('div');
      msg.textContent = v.message;
      const meta = el('div', 'meta');
      meta.textContent = v.kind === 'align'
        ? `spread ${round(v.spread)}px · ${v.boxes.length} to fix`
        : v.kind;
      row.append(msg, meta);
      row.onmouseenter = () => handlers.onHover(v);
      row.onmouseleave = () => handlers.onHover(null);
      row.onclick = () => handlers.onSelect(v);
      list.appendChild(row);
    }
  }

  slider.oninput = () => {
    const t0 = performance.now();
    handlers.onTol(Number(slider.value));
    console.log(`[align] re-audit ${(performance.now() - t0).toFixed(1)}ms`);
  };
  rescan.onclick = () => handlers.onRescan();
  close.onclick = () => handlers.onClose();
  syncTabs();

  return {
    update(violations, opts) { current = violations; isStale = opts.stale; render(); },
    destroy() { panel.remove(); style.remove(); },
  };
}

function el(tag: string, cls = ''): HTMLElement {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
}

function button(label: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.textContent = label;
  return b;
}

function text(value: string): HTMLElement {
  const span = document.createElement('span');
  span.textContent = value;
  return span;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
