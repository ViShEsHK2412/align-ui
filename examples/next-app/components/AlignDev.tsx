'use client';
import { useEffect } from 'react';

// Module-level guard: StrictMode runs effects twice in development and this
// component can remount, but the tool only ever needs loading once per app load.
// initAlign() is idempotent too — this just avoids the redundant import.
let didInit = false;

/**
 * The env check must sit INSIDE the effect, wrapping the dynamic import itself.
 *
 * Guarding only the <AlignDev /> element in layout.tsx (as the spec's §9 snippet
 * does) leaves this module statically imported and the import() below reachable,
 * so the whole tool ships to production — verified by grepping .next/static.
 * With the check here, Next substitutes NODE_ENV, the branch dies, and the
 * import becomes unreachable.
 */
export default function AlignDev() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (didInit) return;
    didInit = true;
    import('../../../align/index').then((m) => m.initAlign());
  }, []);
  return null;
}
