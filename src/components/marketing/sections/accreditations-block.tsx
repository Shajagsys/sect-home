import { ShieldCheck, Award, FileCheck2, Scale } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { ICON_PALETTE } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const ACCREDITATIONS = [
  { icon: ShieldCheck, title: 'CERT-In Empanelled', desc: 'Security Auditor' },
  { icon: Award, title: 'ISO 27001', desc: 'Certification Readiness' },
  { icon: FileCheck2, title: 'SOC 2', desc: 'Compliant Infrastructure' },
  { icon: Scale, title: 'DPDP Act', desc: 'Aligned Operations' },
];

export default function AccreditationsBlock() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Accreditations &amp; Trust Signals</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Verifiable credentials, not marketing claims
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {ACCREDITATIONS.map(({ icon: Icon, title, desc }, i) => {
            const palette = ICON_PALETTE[i % ICON_PALETTE.length];
            return (
              <RevealItem key={title}>
                <div className="glass group flex flex-col items-center gap-3 rounded-2xl px-6 py-9 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110',
                      palette.bg,
                      palette.text,
                      palette.hoverBg,
                      palette.glow
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-display text-base font-bold text-foreground">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
