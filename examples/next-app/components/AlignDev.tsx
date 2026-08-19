'use client';
import { useEffect } from 'react';

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
    import('../../../align/index').then((m) => m.initAlign());
  }, []);
  return null;
}
