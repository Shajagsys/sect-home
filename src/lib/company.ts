/**
 * Company profile and social media presence.
 * Update the handles/URLs below (or override via NEXT_PUBLIC_* env vars)
 * once the official pages are live.
 */
export const COMPANY = {
  name: 'SecureEdge Cyber Technologies LLP',
  tagline: 'IT · Cyber Security · Digital Information Security',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@sectech.app',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 9812451305',
  whatsapp: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '919812451305', // digits only
  // Statutory details for invoices — update via env once finalised.
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    'Shop No.28, Sohna Road, Central Market Dharuhera, Rewari 123106',
  gstin: process.env.NEXT_PUBLIC_COMPANY_GSTIN || '',
  stateCode: process.env.NEXT_PUBLIC_COMPANY_STATE_CODE || '06', // Haryana GST state code
  pan: process.env.NEXT_PUBLIC_COMPANY_PAN || '',
  bankDetails:
    process.env.NEXT_PUBLIC_COMPANY_BANK || 'Bank transfer details available on request',
};

export const SOCIAL_LINKS: { label: string; short: string; href: string }[] = [
  {
    label: 'LinkedIn',
    short: 'in',
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://www.linkedin.com/in/sercureedge-cyber-tech-665039427',
  },
  {
    label: 'X (Twitter)',
    short: 'X',
    href: process.env.NEXT_PUBLIC_SOCIAL_X || 'https://x.com/SercureEdg7wzu',
  },
  {
    label: 'Facebook',
    short: 'f',
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://www.facebook.com/share/1BkdcRMeMA/',
  },
  {
    label: 'Instagram',
    short: 'ig',
    href:
      process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ||
      'https://www.instagram.com/sercureedge_cyber_tech?utm_source=qr&igsh=ZHk3aTkxMnlnd3N6',
  },
  {
    label: 'YouTube',
    short: 'yt',
    href:
      process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ||
      'https://youtube.com/@sercureedgecybertech?si=7iWtI6SrF6FTIWL7',
  },
];
