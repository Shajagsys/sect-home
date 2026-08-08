'use client';

import { useEffect, useState } from 'react';

/** Tracks the user's `prefers-reduced-motion` setting so continuous/looping
 * animations (floating cards, gradient shimmer, scan lines) can be disabled
 * for people who've asked for less motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    function onChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
