import type { Guide } from './types';

/**
 * What survives a reload.
 *
 * Guides are kept per route. Guides drawn while working on /pricing describe
 * /pricing, and having them reappear over /blog would be worse than losing
 * them. Rulers and the panel's position are preferences rather than work, so
 * they are shared across the whole origin.
 *
 * Modes are deliberately absent: x-ray, typography and the picker all start off
 * every time. A tool that reopens in a mode you have forgotten you left it in
 * looks broken rather than helpful.
 */

const NS = 'align-ui';

/**
 * Storage throws rather than returning null in more places than you would
 * expect — Safari in private browsing, a page served from file://, an embedded
 * webview with site data switched off. None of that is worth a broken tool.
 */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* full, or denied: the tool works fine without it */
  }
}

function routeKey(name: string): string {
  let path = '/';
  try {
    path = location.pathname || '/';
  } catch {
    /* no location worth reading: everything shares one bucket */
  }
  return `${NS}:${name}::${path}`;
}

/** Anything hand-edited or left by an older version has to be survivable. */
function isGuide(v: unknown): v is Guide {
  if (typeof v !== 'object' || v === null) return false;
  const g = v as Partial<Guide>;
  return (g.axis === 'x' || g.axis === 'y')
    && typeof g.at === 'number'
    && Number.isFinite(g.at);
}

export function loadGuides(): Guide[] {
  const raw = read(routeKey('guides'));
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ids are reassigned by the caller, which owns the counter.
    return parsed.filter(isGuide).map((g) => ({
      id: 0,
      axis: g.axis,
      at: g.at,
      locked: g.locked === true,
      pinned: g.pinned === true,
      caught: typeof g.caught === 'string' ? g.caught : '',
    }));
  } catch {
    return [];
  }
}

export function saveGuides(guides: Guide[]): void {
  write(routeKey('guides'), JSON.stringify(
    guides.map((g) => ({
      axis: g.axis, at: g.at, locked: g.locked, pinned: g.pinned, caught: g.caught,
    })),
  ));
}

export function loadFlag(name: string): boolean {
  return read(`${NS}:${name}`) === '1';
}

export function saveFlag(name: string, on: boolean): void {
  write(`${NS}:${name}`, on ? '1' : '0');
}

/** The panel's dragged position, or null if it has never been moved. */
export function loadPoint(name: string): { x: number; y: number } | null {
  const raw = read(`${NS}:${name}`);
  if (!raw) return null;
  try {
    const p: unknown = JSON.parse(raw);
    if (typeof p !== 'object' || p === null) return null;
    const { x, y } = p as { x?: unknown; y?: unknown };
    if (typeof x !== 'number' || typeof y !== 'number') return null;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  } catch {
    return null;
  }
}

export function savePoint(name: string, p: { x: number; y: number }): void {
  write(`${NS}:${name}`, JSON.stringify({ x: p.x, y: p.y }));
}
