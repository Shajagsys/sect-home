import { Reveal } from '@/components/marketing/reveal';
import { Marquee } from '@/components/marketing/marquee';

const CLIENTS = ['Bank of India', 'Max Healthcare', 'Paytm', 'Amazon', 'Zomato', 'Tata Communications'];

/** Trust strip — real verified clients, shown as a plain uniform wordmark
 * lockup (not brand-specific logo recreations) inside a card with a light
 * that continuously travels around its border. */
export default function TrustedBy() {
  return (
    <Reveal delay={0.3}>
      <div
        className="moving-border mx-auto max-w-6xl overflow-hidden rounded-3xl p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] sm:p-6"
        style={{ '--panel-bg': '#F8FAFC' } as React.CSSProperties}
      >
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">
          Trusted by industry leaders across
        </p>

        <Marquee className="mt-4" reverse>
          {CLIENTS.map((name) => (
            <span key={name} className="font-wordmark text-lg font-bold text-black sm:text-xl">
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </Reveal>
  );
}
