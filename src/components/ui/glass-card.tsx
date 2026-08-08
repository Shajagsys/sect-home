'use client';

import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Premium glassmorphic card with a mouse-tracked light source and gradient
 * border. The `spotlight` glow follows the cursor via a CSS custom property
 * so the effect is pure-CSS (no per-frame React re-renders).
 */
export function GlassCard({
  children,
  className,
  spotlight = true,
}: {
  children: ReactNode;
  className?: string;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!spotlight || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-card backdrop-blur-xl',
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[""] group-hover:before:opacity-100',
        'before:[background:radial-gradient(320px_circle_at_var(--x,50%)_var(--y,50%),rgba(47,95,174,0.14),transparent_70%)]',
        'hover:border-primary/25',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
