import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: 'https://flopfolio.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://flopfolio.com/about',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://flopfolio.com/feedback',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
} 