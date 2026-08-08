import Link from 'next/link';
import { Search, FileCheck2, UserCog, Swords, Cloud, Radar, ArrowUpRight } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Button } from '@/components/ui/button';
import { ICON_PALETTE } from '@/components/marketing/icon-palette';
import { cn } from '@/lib/utils';

const SERVICES = [
  {
    icon: Search,
    title: 'VAPT — Vulnerability Assessment & Penetration Testing',
    desc: 'Web, mobile, network, cloud, API and code-level testing that identifies exploitable weaknesses before an adversary does.',
    span: 'lg:col-span-3',
    featured: true,
  },
  {
    icon: FileCheck2,
    title: 'Compliance & Regulatory Certification',
    desc: 'End-to-end support for ISO 27001, SOC 2, PCI DSS, HIPAA and DPDP Act readiness.',
    span: 'lg:col-span-3',
  },
  {
    icon: UserCog,
    title: 'Managed Security & vCISO Advisory',
    desc: 'Fractional CISO leadership, GRC advisory and incident response planning.',
    span: 'lg:col-span-2',
  },
  {
    icon: Swords,
    title: 'Advanced Offensive Security',
    desc: 'Red Teaming, Purple Teaming and Breach & Attack Simulation that mirror real adversary behaviour.',
    span: 'lg:col-span-2',
  },
  {
    icon: Cloud,
    title: 'Cloud, Identity & Infrastructure Assurance',
    desc: 'Posture review, container hardening and DevSecOps integration across AWS, Azure and GCP.',
    span: 'lg:col-span-2',
  },
  {
    icon: Radar,
    title: 'Detection, Response & Digital Forensics',
    desc: '24/7 monitoring, incident response retainers and digital forensics for when speed matters most.',
    span: 'lg:col-span-6',
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="relative py-28 sm:py-36">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">What We Do</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comprehensive service offerings, engineered to fit your workflow
          </h2>
          <p className="mt-4 text-muted">
            From offensive testing to regulatory certification to ongoing advisory — six pillars
            that scan quickly to your specific need.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-6" stagger={0.1}>
          {SERVICES.map(({ icon: Icon, title, desc, span, featured }, i) => (
            <RevealItem key={title} className={span}>
              <div
                className={cn(
                  'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#101B2E] p-8 shadow-card backdrop-blur-lg transition-all [transition-duration:400ms] ease-premium hover:-translate-y-1.5 hover:bg-[#131F36]'
                )}
              >
                <GlowingEffect spread={45} glow disabled={false} proximity={90} inactiveZone={0.12} borderWidth={2} />

                {featured && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.1] to-transparent" />
                )}

                {/* Periodic ambient sweep — independent of hover, staggered per card */}
                <span
                  className="card-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/[0.14] to-transparent"
                  style={{ animationDelay: `${i * 1.6}s` }}
                />

                <div className="relative z-[1] flex h-full flex-col">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-transparent transition-all duration-300 group-hover:scale-[1.08]',
                      ICON_PALETTE[i % ICON_PALETTE.length].bg,
                      ICON_PALETTE[i % ICON_PALETTE.length].text,
                      ICON_PALETTE[i % ICON_PALETTE.length].hoverBg,
                      ICON_PALETTE[i % ICON_PALETTE.length].hoverRing,
                      ICON_PALETTE[i % ICON_PALETTE.length].glow
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold leading-snug text-foreground">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 flex justify-center">
          <Button asChild variant="outline" withArrow>
            <Link href="/contact">Discuss Your Requirements</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
