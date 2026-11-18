'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * Reveals `total` characters one at a time (like a terminal being typed
 * live), then holds at the end for `pauseMs` before looping back to zero.
 * Returns the current character count so callers can slice their own
 * per-line text against it. Jumps straight to `total` under
 * prefers-reduced-motion.
 */
export function useTypewriterCount(total: number, speed = 18, pauseMs = 2400) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? total : 0);

  useEffect(() => {
    if (reduceMotion || total <= 0) {
      setCount(total);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function step() {
      if (cancelled) return;
      i += 1;
      setCount(i);
      if (i >= total) {
        timer = setTimeout(() => {
          if (cancelled) return;
          i = 0;
          setCount(0);
          timer = setTimeout(step, speed);
        }, pauseMs);
      } else {
        timer = setTimeout(step, speed);
      }
    }

    timer = setTimeout(step, speed);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [total, speed, pauseMs, reduceMotion]);

  return count;
}
