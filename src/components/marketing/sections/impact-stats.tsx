'use client';

import { useCountUp } from '@/hooks/use-count-up';
import { RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { AuroraBackground } from '@/components/ui/aurora-background';

const AURORA_COLORS = ['hsla(217,60%,45%,0.35)', 'hsla(210,70%,55%,0.22)', 'hsla(225,65%,55%,0.15)'];

const STATS = [
  { end: 120, suffix: '+', label: 'Enterprises secured' },
  { end: 45, suffix: 'K+', label: 'Critical vulnerabilities identified' },
  { end: 300, suffix: '+', label: 'Applications & systems assessed' },
  { end: 7, suffix: '+', label: 'Regulated sectors served' },
];

function StatCard({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(end);
  return (
    <RevealItem>
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_32px_-12px_rgba(47,95,174,0.28)]">
        <p ref={ref as React.RefObject<HTMLParagraphElement>} className="font-display text-4xl font-extrabold text-black sm:text-5xl">
          {value}
          {suffix}
        </p>
        <p className="mt-3 text-sm text-slate-600">{label}</p>
      </div>
    </RevealItem>
  );
}

export default function ImpactStats() {
  return (
    <section className="relative overflow-hidden bg-[#071426] py-20">
      <AuroraBackground variant="custom" colors={AURORA_COLORS} speed={0.35} blobCount={4} />
      <div className="absolute inset-0 bg-[#071426]/80" />

      <div className="container relative z-10">
        <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.1}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </RevealGroup>
        <p className="mt-6 text-center text-xs text-white/50">
          Indicative figures — final metrics substituted with verified, audited data at launch.
        </p>
      </div>
    </section>
  );
}
