import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'ja']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    canonical_url: z.string().url().optional(),
    cross_posted_to: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).default([]),
    og_image: z.string().optional(),
  }),
});

export const collections = { blog };
