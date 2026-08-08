'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Fixed node/path layout (not random) so server- and client-rendered markup match.
const NODES = [
  { cx: 120, cy: 90, r: 3 },
  { cx: 320, cy: 60, r: 2.5 },
  { cx: 540, cy: 140, r: 3.5 },
  { cx: 760, cy: 80, r: 2.5 },
  { cx: 980, cy: 160, r: 3 },
  { cx: 200, cy: 340, r: 2.5 },
  { cx: 620, cy: 380, r: 3 },
  { cx: 900, cy: 320, r: 2.5 },
];

const PATHS = [
  'M120,90 L320,60 L540,140 L760,80 L980,160',
  'M200,340 L120,90',
  'M540,140 L620,380 L900,320',
  'M320,60 L200,340',
];

/** Glowing neon circuit-line backdrop — pulsing nodes connected by thin
 * illuminated paths, evoking augmented-reality / AI-vision imagery. Purely
 * decorative; disables its pulse under prefers-reduced-motion. */
export function CircuitGlow({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1100 460"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="circuit-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#4C7FDB"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />
      ))}

      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="#5B9BF0" opacity="0.12" filter="url(#circuit-blur)" />
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="#8AB4F0"
            animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
            transition={
              reduceMotion ? undefined : { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
            }
          />
        </g>
      ))}
    </svg>
  );
}
