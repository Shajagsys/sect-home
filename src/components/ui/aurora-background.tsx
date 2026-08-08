'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface AuroraBackgroundProps {
  variant?: 'default' | 'custom';
  colors?: string[];
  speed?: number;
  blobCount?: number;
  className?: string;
}

const DEFAULT_COLORS = ['hsla(217,60%,45%,0.35)', 'hsla(210,70%,55%,0.22)', 'hsla(225,65%,55%,0.15)'];

// Fixed layout (not Math.random) so server- and client-rendered markup match.
const BLOB_LAYOUT = [
  { top: '8%', left: '12%', size: 30 },
  { top: '55%', left: '72%', size: 34 },
  { top: '78%', left: '18%', size: 26 },
  { top: '18%', left: '82%', size: 28 },
];

/** Soft, slow-drifting blurred color blobs — a premium ambient backdrop.
 * Purely decorative; disables its motion under `prefers-reduced-motion`. */
export function AuroraBackground({
  variant = 'default',
  colors,
  speed = 0.35,
  blobCount = 4,
  className,
}: AuroraBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const palette = variant === 'custom' && colors?.length ? colors : DEFAULT_COLORS;
  const blobs = useMemo(() => BLOB_LAYOUT.slice(0, Math.min(blobCount, BLOB_LAYOUT.length)), [blobCount]);
  // Lower speed = slower, more subtle drift.
  const duration = 26 / Math.max(speed, 0.05);

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 45%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 45%, transparent 100%)',
        }}
      >
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[100px]"
            style={{
              top: b.top,
              left: b.left,
              width: `${b.size}rem`,
              height: `${b.size}rem`,
              background: palette[i % palette.length],
            }}
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.96, 1] }
            }
            transition={
              reduceMotion ? undefined : { duration: duration + i * 4, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-faint bg-grid opacity-[0.04] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent_85%)]" />

      {/* Faint noise texture (~3%) for a premium, non-flat finish */}
      <div className="noise-overlay opacity-[0.03]" />
    </div>
  );
}
