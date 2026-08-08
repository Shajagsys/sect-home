'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CircuitGlow } from '@/components/marketing/circuit-glow';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Cinematic poster-style interstitial between the About hero and the body
 * copy — a GSAP scroll-triggered headline reveal (skewed stagger, distinct
 * from the site's usual Framer fade-up) over a glowing circuit backdrop.
 * Purely typographic/motion — no imagery. */
export default function AboutIntroVisual() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.intro-line');
      gsap.set(lines, { yPercent: 120, skewY: 6, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(lines, {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.12,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#050B16] py-24 sm:py-32">
      <CircuitGlow className="opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050B16] via-transparent to-[#050B16]" />

      <div className="container relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          {/* Corner metadata — poster-style index marks */}
          <div className="flex items-center gap-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-white/40">
            <span>01 / About</span>
            <span>SecureEdge</span>
          </div>

          <div className="mt-10 overflow-hidden">
            <h2 className="intro-line font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Human Expertise.
            </h2>
          </div>
          <div className="mt-2 overflow-hidden">
            <h2 className="intro-line font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-primary-light via-[#8AB4F0] to-primary bg-clip-text text-transparent">
                AI-Augmented Precision.
              </span>
            </h2>
          </div>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/60">
            Every engagement pairs adversary-grade human testers with modern tooling — the judgment
            of a determined attacker, applied at the speed your threat landscape demands.
          </p>
        </div>

        {/* Two converging glow orbs — human + tooling meeting at a shared point */}
        <div className="relative mx-auto h-40 w-64 shrink-0 sm:h-52 sm:w-96">
          <motion.div
            className="absolute left-0 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full sm:h-36 sm:w-36"
            style={{ background: 'radial-gradient(circle, rgba(139,180,240,0.45), transparent 70%)' }}
            animate={reduceMotion ? undefined : { x: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
            transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-0 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full sm:h-36 sm:w-36"
            style={{ background: 'radial-gradient(circle, rgba(47,95,174,0.5), transparent 70%)' }}
            animate={reduceMotion ? undefined : { x: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
            transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.6)]"
            animate={reduceMotion ? undefined : { scale: [1, 1.6, 1] }}
            transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* White accent card floating over the orbs — deliberate contrast break */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-6 left-1/2 w-48 -translate-x-1/2 rounded-2xl bg-white px-5 py-4 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] sm:bottom-0 sm:left-auto sm:right-0 sm:translate-x-0 sm:text-left"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2F5FAE]">Where they meet</p>
            <p className="mt-1 font-display text-sm font-bold text-slate-900">100% manually validated findings</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
