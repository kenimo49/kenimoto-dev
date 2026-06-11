import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'pt'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'ken imoto — Blog',
    description: 'Artigos técnicos sobre LLMO, desenvolvimento com IA, engenharia de contexto e harness engineering.',
    site: context.site!,
    items: posts.map(post => {
      const slug = post.id.replace(/^pt\//, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/pt/blog/${slug}/`,
        categories: post.data.tags,
      };
    }),
    customData: '<language>pt-BR</language>',
  });
}
