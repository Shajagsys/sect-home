import type { Metadata } from 'next';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';
import PageHero from '@/components/marketing/sections/page-hero';
import { Reveal } from '@/components/marketing/reveal';
import { ManagePreferencesButton } from '@/components/marketing/sections/manage-preferences-button';

const title = 'Cookie Policy';
const description =
  'How SecureEdge Cyber Technologies uses cookies, what each category does, and how to manage your preferences.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/cookie-policy',
  },
  openGraph: {
    title: `${title} · SecureEdge Cyber Technologies`,
    description,
    url: 'https://secureedgecyber.com/cookie-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} · SecureEdge Cyber Technologies`,
    description,
  },
};

const COOKIE_TABLE: { name: string; category: string; provider: string; purpose: string; expiry: string }[] = [
  {
    name: 'se_consent',
    category: 'Strictly Necessary',
    provider: 'SecureEdge (first-party)',
    purpose: 'Stores your cookie preference so we don\u2019t ask again on every visit.',
    expiry: '1 year',
  },
  {
    name: 'se_session / auth token',
    category: 'Strictly Necessary',
    provider: 'SecureEdge (first-party)',
    purpose: 'Keeps you signed in to the client portal and CRM securely.',
    expiry: 'Session / until logout',
  },
  {
    name: '_GRECAPTCHA',
    category: 'Functional',
    provider: 'Google reCAPTCHA',
    purpose: 'Distinguishes human visitors from bots on our contact form to prevent spam submissions.',
    expiry: 'Up to 6 months',
  },
  {
    name: '_ga, _ga_*',
    category: 'Analytics',
    provider: 'Google Analytics 4',
    purpose: 'Distinguishes visitors and sessions so we can see page views, traffic sources, and form completion rates. Only set if you accept Analytics cookies.',
    expiry: 'Up to 2 years',
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Legal"
          title="Cookie Policy"
          description="A plain-language explanation of the cookies this site uses, why, and how you can control them."
        />

        <section className="relative pb-24 sm:pb-32">
          <div className="container relative max-w-3xl">
            <Reveal className="space-y-10 text-sm leading-relaxed text-muted sm:text-[15px]">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">What are cookies?</h2>
                <p className="mt-3">
                  Cookies are small text files stored on your device when you visit a website. They
                  help the site function, remember your preferences, and — where you&apos;ve allowed
                  it — help us understand how the site is used.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Categories we use</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-foreground">Strictly Necessary</span> — required
                    for the site and client portal to function. Always active.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Functional</span> — remembers choices
                    such as your cookie preference.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Analytics</span> — helps us understand
                    site usage. Only active if you opt in.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Marketing</span> — reserved for future
                    campaign attribution. Not currently in use, and only active if you opt in.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Cookies in detail</h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.08]">
                  <table className="w-full min-w-[560px] text-left text-xs sm:text-sm">
                    <thead className="border-b border-white/[0.08] bg-white/[0.02] text-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Provider</th>
                        <th className="px-4 py-3 font-semibold">Purpose</th>
                        <th className="px-4 py-3 font-semibold">Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COOKIE_TABLE.map((row) => (
                        <tr key={row.name} className="border-b border-white/[0.04] last:border-0">
                          <td className="px-4 py-3 font-mono text-[12px] text-foreground/90">{row.name}</td>
                          <td className="px-4 py-3">{row.category}</td>
                          <td className="px-4 py-3">{row.provider}</td>
                          <td className="px-4 py-3">{row.purpose}</td>
                          <td className="px-4 py-3">{row.expiry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted/80">
                  Google reCAPTCHA is loaded on our contact form to prevent automated spam. It is
                  provided by Google LLC and may set cookies and process data per{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light underline underline-offset-2 hover:text-primary"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  . It runs independently of the preference toggles above, as it is required to keep
                  our contact form usable and spam-free.
                </p>
                <p className="mt-3 text-xs text-muted/80">
                  We use Google Analytics 4 to understand site usage, provided by Google LLC. It is
                  only loaded and only sets cookies if you accept the Analytics category above — it
                  never runs before you choose, and stops immediately if you later withdraw consent.
                  See{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light underline underline-offset-2 hover:text-primary"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  {' '}for how Google processes this data.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Managing your preferences</h2>
                <p className="mt-3">
                  You can change your cookie choices at any time using the button below, or via the
                  &ldquo;Cookie Settings&rdquo; link in the footer of any page.
                </p>
                <div className="mt-5">
                  <ManagePreferencesButton />
                </div>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Questions</h2>
                <p className="mt-3">
                  If you have questions about this policy or how your data is handled, contact us
                  through our{' '}
                  <a href="/contact" className="text-primary-light underline underline-offset-2 hover:text-primary">
                    Contact page
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
