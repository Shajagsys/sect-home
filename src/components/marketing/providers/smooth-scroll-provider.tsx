'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Mounts a Lenis instance for buttery smooth scrolling across the marketing
 * site and drives it from requestAnimationFrame. Renders nothing itself.
 */
export default function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
