/**
 * Company profile and social media presence.
 * Update the handles/URLs below (or override via NEXT_PUBLIC_* env vars)
 * once the official pages are live.
 */
export const COMPANY = {
  name: 'SecureEdge Cyber Technologies LLP',
  tagline: 'IT · Cyber Security · Digital Information Security',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'shajagsystems@gmail.com',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
  whatsapp: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '', // digits only, e.g. 919876543210
};

export const SOCIAL_LINKS: { label: string; short: string; href: string }[] = [
  {
    label: 'LinkedIn',
    short: 'in',
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://www.linkedin.com/company/secureedge-cyber-technologies',
  },
  {
    label: 'X (Twitter)',
    short: 'X',
    href: process.env.NEXT_PUBLIC_SOCIAL_X || 'https://x.com/secureedgecyber',
  },
  {
    label: 'Facebook',
    short: 'f',
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://www.facebook.com/secureedgecyber',
  },
  {
    label: 'Instagram',
    short: 'ig',
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://www.instagram.com/secureedgecyber',
  },
  {
    label: 'YouTube',
    short: 'yt',
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || 'https://www.youtube.com/@secureedgecyber',
  },
];
