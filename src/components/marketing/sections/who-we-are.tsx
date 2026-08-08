import { Reveal } from '@/components/marketing/reveal';

export default function WhoWeAre() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(47,95,174,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(47,95,174,0.06)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent_75%)]" />
      <div className="container relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2F5FAE]">Who We Are</span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            A premier cybersecurity consultancy, built for the enterprises that can&apos;t afford to guess.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-[#2F5FAE]/15 bg-[#F4F8FF] p-8 shadow-[0_20px_60px_-25px_rgba(47,95,174,0.25)] sm:p-10">
            <p className="text-[17px] leading-relaxed text-slate-600">
              SecureEdge Cyber Technologies is a premier cybersecurity consultancy dedicated to
              safeguarding organisations against sophisticated digital threats. We focus on three
              critical pillars: uncovering hidden vulnerabilities, achieving stringent regulatory
              compliance, and cultivating sustainable security frameworks that empower your workforce.
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-slate-600">
              We eschew fear-mongering and convoluted reporting; instead, we provide actionable
              intelligence and practical remediation strategies that accelerate business growth
              without compromising on safety.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
