import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://profil-kelurahan-lapadde.vercel.app/sitemap.xml',
  };
}
