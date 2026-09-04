/**
 * The parts of the hard-cases page that cannot be written in HTML: shadow
 * roots, a WAAPI animation, and the two bulk sections whose whole point is that
 * there are a lot of them.
 */

/** Open or closed depending on the attribute — the same host either way. */
class StressCard extends HTMLElement {
  connectedCallback() {
    const mode = this.hasAttribute('closed') ? 'closed' : 'open';
    const root = this.attachShadow({ mode });
    const style = document.createElement('style');
    style.textContent = `
      .frame { width: 200px; padding: 16px; background: #1b2029;
               border: 1px solid #2b3341; font: 12px/1.4 Inter, sans-serif;
               color: #cbd3e1; }
      .body { margin-top: 10px; padding: 12px; background: #232a36; }
      .pill { display: inline-flex; align-items: center; justify-content: center;
              width: 96px; height: 26px; background: #2f3a4a; }
    `;
    const frame = document.createElement('div');
    frame.className = 'frame';
    const title = document.createElement('div');
    title.textContent = this.getAttribute('label') ?? 'card';
    const body = document.createElement('div');
    body.className = 'body';
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = 'inner pill';
    body.appendChild(pill);
    frame.append(title, body);
    root.append(style, frame);
  }
}
customElements.define('stress-card', StressCard);

/**
 * A slot: the child stays in this document and only its *rendering* moves into
 * the shadow tree. Hovering it must reach the light-DOM span, not the slot.
 */
class StressSlot extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `.wrap { padding: 16px; border: 1px dashed #2b3341; }`;
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.appendChild(document.createElement('slot'));
    root.append(style, wrap);
  }
}
customElements.define('stress-slot', StressSlot);

// A WAAPI animation, which no stylesheet can describe and which `transition:
// none` cannot stop — it has to be paused through the animation itself.
const waapi = document.getElementById('waapi');
waapi?.animate(
  [{ transform: 'translateX(0)' }, { transform: 'translateX(180px)' }],
  { duration: 2600, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
);

// A transition only exists while it is running, so it needs starting by hand.
const kick = document.getElementById('kick');
const trans = document.querySelector('.trans');
kick?.addEventListener('click', () => trans?.classList.toggle('go'));

// 1500 elements, to keep hover honest about what it costs.
const swarm = document.getElementById('swarm');
if (swarm) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 1500; i += 1) frag.appendChild(document.createElement('i'));
  swarm.appendChild(frag);
}

// Sixty levels, to check that walking up to a measurable ancestor terminates.
const deep = document.getElementById('deep');
if (deep) {
  let at: HTMLElement = deep;
  for (let i = 0; i < 60; i += 1) {
    const next = document.createElement('div');
    next.className = 'deep';
    if (i === 59) next.textContent = 'level 60';
    at.appendChild(next);
    at = next;
  }
}

if (import.meta.env.DEV) {
  // The same grid the page is built on, so G has something true to draw.
  void import('../../align/index').then((m) => m.initAlign({
    grid: { columns: 12, gutter: 24, margin: 24, maxWidth: 940 },
  }));
}
