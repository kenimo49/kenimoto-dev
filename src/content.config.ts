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
    og_image: z.string().optional(),
    updated: z.coerce.date().optional(),
    // 言語をまたいだ翻訳ペアの対応付けキー。slug が言語ごとに違っても hreflang を張れる。
    translation_key: z.string().optional(),
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
      // 節レベル目次 (1-1, 1-2 ...) — JA market 慣習で必須、 他言語は任意
      sub_chapters: z.array(z.string()).optional(),
    })).default([]),

    // 任意: TOCを3パート構造で書くとき (案B "TOC圧縮 + part毎mini-CTA")
    // partsを定義すると chapters より優先される。番号は通しで振り直される。
    parts: z.array(z.object({
      name: z.string(),
      summary: z.string().optional(),
      chapters: z.array(z.object({
        title: z.string(),
        free: z.boolean().default(false),
        summary: z.string().optional(),
        sub_chapters: z.array(z.string()).optional(),
      })),
    })).optional(),

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

    affiliate_disclosure: z.boolean().default(false),
  }),
});

// 無料章 (LP内 Free Preview) — book frontmatter とは別コレクション
// id format: "{lang}/{book-slug}/{chapter-slug}"
// 例: "en/claude-code-mastery/ch01-birth"
const freeChapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/free_chapters' }),
  schema: z.object({
    title: z.string(),
    free: z.boolean().optional(),
  }),
});

export const collections = { blog, books, freeChapters };
