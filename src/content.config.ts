import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'ja', 'pt', 'es']),
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

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    lang: z.enum(['en', 'ja', 'pt', 'es']),

    kindle_url: z.string().url().optional(),
    zenn_url: z.string().url().optional(),
    other_urls: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),

    price: z.number().optional(),
    currency: z.string().default('JPY'),
    published_date: z.coerce.date(),
    updated_date: z.coerce.date().optional(),
    cover_image: z.string().optional(),
    og_image: z.string().optional(),
    topics: z.array(z.string()).default([]),

    tagline: z.string().optional(),
    hero_message: z.string().optional(),
    series_role: z.string().optional(),
    position_statement: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).default([]),

    target_readers: z.array(z.string()).default([]),
    differentiation: z.array(z.string()).default([]),

    chapters: z.array(z.object({
      title: z.string(),
      free: z.boolean().default(false),
      summary: z.string().optional(),
    })).default([]),

    competitor_comparison: z.array(z.object({
      book: z.string(),
      difference: z.string(),
    })).default([]),
    pain_points: z.array(z.string()).default([]),
    related_books: z.array(z.string()).default([]),
    related_articles: z.array(z.object({
      slug: z.string(),
      title: z.string(),
    })).default([]),
    keywords: z.array(z.string()).default([]),

    cta_label: z.string().optional(),
    redirect_delay_seconds: z.number().default(5),
    redirect_destination: z.enum(['kindle', 'zenn']).default('kindle'),

    affiliate_disclosure: z.boolean().default(false),
  }),
});

export const collections = { blog, books };
