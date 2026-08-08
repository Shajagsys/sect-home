'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Fixed positions (not Math.random) so server- and client-rendered markup match.
const PARTICLES = [
  { top: '12%', left: '18%', size: 3, duration: 9, delay: 0 },
  { top: '24%', left: '76%', size: 2, duration: 11, delay: 1.2 },
  { top: '68%', left: '8%', size: 2, duration: 8, delay: 0.6 },
  { top: '80%', left: '62%', size: 3, duration: 10, delay: 2 },
  { top: '38%', left: '92%', size: 2, duration: 12, delay: 0.4 },
  { top: '55%', left: '34%', size: 2, duration: 9.5, delay: 1.8 },
  { top: '15%', left: '52%', size: 3, duration: 10.5, delay: 2.4 },
  { top: '90%', left: '22%', size: 2, duration: 8.5, delay: 1 },
];

/** Purely decorative motion layer for the hero: drifting grid, concentric
 * rings, ambient particles and a vertical scan beam. Sits above the video
 * overlay and below the foreground content. All loops are disabled when the
 * user prefers reduced motion. */
export function HeroBackgroundFX() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Drifting low-opacity grid */}
      <motion.div
        className="absolute inset-0 bg-grid-faint bg-grid opacity-[0.18] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent_78%)]"
        animate={reduceMotion ? undefined : { backgroundPosition: ['0px 0px', '44px 44px'] }}
        transition={reduceMotion ? undefined : { duration: 26, repeat: Infinity, ease: 'linear' }}
      />

      {/* Concentric rings, centered behind the headline */}
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
        {[46, 36, 26].map((rem, i) => (
          <motion.div
            key={rem}
            className="absolute rounded-full border border-primary-light/[0.08]"
            style={{
              width: `${rem}rem`,
              height: `${rem}rem`,
              left: `-${rem / 2}rem`,
              top: `-${rem / 2}rem`,
            }}
            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={
              reduceMotion ? undefined : { duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }
            }
          />
        ))}
      </div>

      {/* Ambient particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-primary-light/40"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={
            reduceMotion ? undefined : { duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }
          }
        />
      ))}

      {/* Vertical scanning beam */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-primary-light/[0.06] to-transparent"
          initial={{ top: '-15%' }}
          animate={{ top: '115%' }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
      )}
    </div>
  );
}
