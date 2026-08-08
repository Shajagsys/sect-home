'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/** Continuously shimmering gradient text — used to spotlight a headline
 * phrase (e.g. "Digital Assets."). Falls back to a static gradient when the
 * user prefers reduced motion. */
export function AnimatedGradientText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(100deg, #1B3B73, #2F5FAE, #5B9BF0, #FFFFFF, #2F5FAE, #1B3B73)',
        backgroundSize: '300% 100%',
        willChange: 'background-position',
      }}
      animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  );
}
