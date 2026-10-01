const log = document.getElementById('log')!;
const dialog = document.getElementById('dlg') as HTMLDialogElement;
document.getElementById('open')!.addEventListener('click', () => dialog.showModal());

/** The last few states, newest first: what a host app would see. */
function show(source: string, s: Record<string, unknown>): void {
  const on = Object.entries(s).filter(([, v]) => v === true).map(([k]) => k);
  const line = `${source}  open=${s['open']} locked=${s['locked']} guides=${s['guides']}  on: ${on.join(' ') || '—'}`;
  log.textContent = [line, ...(log.textContent ?? '').split('\n').filter(Boolean)].slice(0, 8).join('\n');
}

addEventListener('align:tools', (e) => show('event   ', (e as CustomEvent).detail));

if (import.meta.env.DEV) {
  import('../../align/index').then((m) => m.initAlign({
    features: { notes: false, pick: false },
    storage: 'session',
    onToolsChange: (s) => show('callback', s as unknown as Record<string, unknown>),
  }));
}
