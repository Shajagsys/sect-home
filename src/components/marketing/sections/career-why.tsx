import { Reveal } from '@/components/marketing/reveal';

export default function CareerWhy() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Why Build Your Career With Us</span>
          <p className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
            We are a collective of specialists who identify the single point of failure amidst a
            hundred secured perimeters — and we recruit individuals who derive genuine intellectual
            satisfaction from that pursuit.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            If your instinct is to understand precisely how a system fails, rather than simply
            accept that it did, you will find your place here.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
