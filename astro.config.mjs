import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';

// Zenn の :::message / :::message alert を <aside class="book-callout"> に変換
// :::details "summary" は <details class="book-details"><summary>...</summary>...</details> に
function remarkZennDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective') return;
      const data = node.data || (node.data = {});
      if (node.name === 'message') {
        // :::message alert はvariant文字列としてattributes.class または node.attributes.class に入る
        const attrs = node.attributes || {};
        const isAlert = /\balert\b/.test(attrs.class || '') || /\balert\b/.test((attrs.id || ''));
        data.hName = 'aside';
        data.hProperties = {
          className: isAlert ? ['book-callout', 'book-callout--alert'] : ['book-callout'],
        };
      } else if (node.name === 'details') {
        data.hName = 'details';
        data.hProperties = { className: ['book-details'] };
        // 最初の paragraph を <summary> に転送 (zenn風: :::details タイトル)
        if (node.children && node.children[0] && node.children[0].type === 'paragraph') {
          node.children[0].data = node.children[0].data || {};
          node.children[0].data.hName = 'summary';
        }
      }
    });
  };
}

export default defineConfig({
  site: 'https://kenimoto.dev',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ja: 'ja-JP',
          pt: 'pt-BR',
          es: 'es-ES',
        },
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkDirective, remarkZennDirectives],
  },
});
