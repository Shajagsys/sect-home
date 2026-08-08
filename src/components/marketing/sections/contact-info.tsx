import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { COMPANY, SOCIAL_LINKS } from '@/lib/company';
import { Reveal } from '@/components/marketing/reveal';

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  'X (Twitter)': Twitter,
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
};

export default function ContactInfo() {
  const rows = [
    { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    ...(COMPANY.phone
      ? [{ icon: Phone, label: 'Phone', value: COMPANY.phone, href: `tel:${COMPANY.phone}` }]
      : []),
    { icon: MapPin, label: 'Registered Office', value: COMPANY.address, href: undefined },
  ];

  return (
    <Reveal>
      <div className="lg:sticky lg:top-32">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Contact Details</span>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Let&apos;s talk about your risk posture.
        </h2>
        <p className="mt-4 max-w-md text-muted">
          Arrange a complimentary consultation with our strategic security team — delivered
          without pressure or unnecessary technical obfuscation.
        </p>

        <div className="mt-9 space-y-3">
          {rows.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="glass flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors duration-300 hover:border-primary/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              </div>
            );
            return href ? (
              <a key={label} href={href}>{content}</a>
            ) : (
              <div key={label}>{content}</div>
            );
          })}
        </div>

        <div className="mt-9">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Connect</p>
          <div className="mt-3 flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-primary/40 hover:text-primary-light"
                >
                  {Icon ? <Icon className="h-4 w-4" /> : s.short}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
