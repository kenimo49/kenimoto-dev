import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'ja'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: '井本 賢 — ブログ',
    description: 'LLMO、AI開発、コンテキストエンジニアリング、ハーネスエンジニアリングの技術記事。',
    site: context.site!,
    items: posts.map(post => {
      const slug = post.id.replace(/^ja\//, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/ja/blog/${slug}`,
        categories: post.data.tags,
      };
    }),
    customData: '<language>ja</language>',
  });
}
