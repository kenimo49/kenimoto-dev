import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'es'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'ken imoto — Blog',
    description: 'Artículos técnicos sobre LLMO, desarrollo con IA, ingeniería de contexto y harness engineering.',
    site: context.site!,
    items: posts.map(post => {
      const slug = post.id.replace(/^es\//, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/es/blog/${slug}`,
        categories: post.data.tags,
      };
    }),
    customData: '<language>es</language>',
  });
}
