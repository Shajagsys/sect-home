'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * Reveals items 0..count one at a time (e.g. scan-result rows appearing as
 * if each just finished), holds at the full count for `holdMs`, then loops
 * back to zero — so a list keeps reading as "live" rather than a one-shot
 * entrance. Jumps straight to `count` under prefers-reduced-motion.
 */
export function useSequentialReveal(count: number, stepMs = 450, holdMs = 2600) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(reduceMotion ? count : 0);

  useEffect(() => {
    if (reduceMotion || count <= 0) {
      setRevealed(count);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function step() {
      if (cancelled) return;
      i += 1;
      setRevealed(i);
      if (i >= count) {
        timer = setTimeout(() => {
          if (cancelled) return;
          i = 0;
          setRevealed(0);
          timer = setTimeout(step, stepMs);
        }, holdMs);
      } else {
        timer = setTimeout(step, stepMs);
      }
    }

    timer = setTimeout(step, stepMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [count, stepMs, holdMs, reduceMotion]);

  return revealed;
}
