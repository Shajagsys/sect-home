import { Fingerprint, Presentation, Timer, KeyRound, Handshake } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { ICON_TONES_LIGHT } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const DISTINCTIONS = [
  { icon: Fingerprint, title: 'Genuine Expertise, Not Automated Scanning', desc: 'Engineers manually validate and exploit findings exactly as a determined adversary would.' },
  { icon: Presentation, title: 'Boardroom-Ready Deliverables', desc: 'A report your board can absorb and your engineers can execute against.' },
  { icon: Timer, title: 'Disciplined Turnaround', desc: 'Governance that ensures engagements conclude on schedule, without scope creep.' },
  { icon: KeyRound, title: 'Confidentiality by Design', desc: 'Every mandate under strict NDA, with rigorous, auditable data handling controls.' },
  { icon: Handshake, title: 'Enduring Partnership', desc: 'Retesting, advisory and continuous monitoring extend well past report delivery.' },
];

export default function DistinctionGrid() {
  return (
    <section className="relative border-y border-white/[0.06] bg-surface/30 py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">The SecureEdge Distinction</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why enterprises choose to stay with us
          </h2>
        </Reveal>

        <RevealGroup className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {DISTINCTIONS.map(({ icon: Icon, title, desc }, i) => {
            const tone = ICON_TONES_LIGHT[i % ICON_TONES_LIGHT.length];
            return (
              <RevealItem key={title}>
                <div className="group h-full bg-white p-7 transition-colors duration-300 hover:bg-slate-50">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition-all duration-300 group-hover:scale-110',
                      tone.bg,
                      tone.text,
                      tone.ring,
                      tone.glow
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-[15px] font-semibold leading-snug text-slate-900">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{desc}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
