import { audit } from './cluster';
import { mergeConfig, type Config } from './config';
import { invalidate, scan } from './scan';
import type { Violation } from './types';

export type { Box, Violation, Axis } from './types';
export type { Config } from './config';

declare global {
  interface Window {
    __align?: boolean;
    __alignAudit?: () => Violation[];
  }
}

let cfg: Config;

function run(): Violation[] {
  invalidate();
  const t0 = performance.now();
  const boxes = scan(cfg);
  const t1 = performance.now();
  const violations = audit(boxes, cfg, devicePixelRatio);
  const t2 = performance.now();

  console.log(
    `[align] ${boxes.length} boxes, ${violations.length} violations · ` +
    `scan ${(t1 - t0).toFixed(1)}ms, audit ${(t2 - t1).toFixed(1)}ms`,
  );
  console.table(violations.map((v) => ({
    kind: v.kind,
    axis: v.axis ?? '',
    spread: Math.round(v.spread * 100) / 100,
    offenders: v.boxes.length,
    message: v.message,
  })));
  return violations;
}

export function initAlign(partial: Partial<Config> = {}): void {
  if (typeof window === 'undefined') return;   // SSR — Next runs modules on the server
  if (window.__align) return;                  // HMR re-entry
  window.__align = true;

  cfg = mergeConfig(partial);
  window.__alignAudit = run;
  console.log('[align] ready — run __alignAudit() in the console');
}
