import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'en'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Ken Imoto — Blog',
    description: 'Articles on LLMO, AI development, context engineering, and harness engineering.',
    site: context.site!,
    items: posts.map(post => {
      const slug = post.id.replace(/^en\//, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${slug}`,
        categories: post.data.tags,
      };
    }),
    customData: '<language>en</language>',
  });
}
