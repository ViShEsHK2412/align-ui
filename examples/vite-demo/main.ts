// ?stress=2000 tiles N extra elements across the viewport to time a full scan
// against the §11 budget (2000 elements < 100ms).
const stress = Number(new URLSearchParams(location.search).get('stress') ?? 0);
if (stress > 0) {
  const host = document.getElementById('stress')!;
  host.style.cssText = 'position: fixed; inset: 0; z-index: 0;';
  const cols = Math.floor(window.innerWidth / 12) || 1;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < stress; i++) {
    const d = document.createElement('div');
    d.className = 'px';
    // Exact multiples of 12 — these must cluster cleanly and report nothing.
    d.style.left = (i % cols) * 12 + 'px';
    d.style.top = Math.floor(i / cols) * 12 + 'px';
    frag.appendChild(d);
  }
  host.appendChild(frag);
}

if (import.meta.env.DEV) {
  import('../../align/index').then((m) => m.initAlign());
}
