import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.APP_URL && !process.env.APP_URL.includes('localhost')
      ? process.env.APP_URL
      : 'https://secureedgecyber.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/portal/', '/login', '/api/', '/sign/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
