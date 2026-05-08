import type { CollectionEntry } from 'astro:content';

export const SUPPORTED_LANGS = ['en', 'ja', 'pt', 'es'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export interface Alternate {
  hreflang: string;
  href: string;
}

const SITE = 'https://kenimoto.dev';

function urlFor(lang: Lang, kind: 'blog' | 'books', slug: string): string {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return `${SITE}${prefix}/${kind}/${slug}/`;
}

/**
 * 指定slugについて、実際に翻訳が存在する言語のhreflangリストを返す。
 * x-default は en にフォールバック、なければ存在する任意の翻訳。
 */
export function alternatesFor(
  allEntries: CollectionEntry<'blog'>[] | CollectionEntry<'books'>[],
  kind: 'blog' | 'books',
  slug: string,
): Alternate[] {
  const available: Lang[] = SUPPORTED_LANGS.filter((lang) =>
    allEntries.some((p) => p.id === `${lang}/${slug}`),
  );

  if (available.length === 0) return [];

  const list: Alternate[] = available.map((lang) => ({
    hreflang: lang,
    href: urlFor(lang, kind, slug),
  }));

  const defaultLang: Lang = available.includes('en') ? 'en' : available[0];
  list.push({ hreflang: 'x-default', href: urlFor(defaultLang, kind, slug) });

  return list;
}

/**
 * canonical_url frontmatter override を正規化。
 * 同ドメインなら末尾スラッシュ補完、外部URL（クロスポスト等）はそのまま。
 */
export function normalizeCanonical(canonicalOverride: string | undefined, fallback: string): string {
  const url = canonicalOverride ?? fallback;
  if (url.startsWith(SITE) && !url.endsWith('/')) return `${url}/`;
  return url;
}

/**
 * 静的ページ用の hreflang ペア生成。
 * path は EN 側の絶対パス ("/", "/blog/", "/about/", "/books/")。
 * EN/JA/PT/ES の 4 言語 + x-default (EN) を返す。
 */
export function staticAlternates(path: string): Alternate[] {
  const enPath = path;
  const jaPath = path === '/' ? '/ja/' : `/ja${path}`;
  const ptPath = path === '/' ? '/pt/' : `/pt${path}`;
  const esPath = path === '/' ? '/es/' : `/es${path}`;
  return [
    { hreflang: 'en', href: `${SITE}${enPath}` },
    { hreflang: 'ja', href: `${SITE}${jaPath}` },
    { hreflang: 'pt', href: `${SITE}${ptPath}` },
    { hreflang: 'es', href: `${SITE}${esPath}` },
    { hreflang: 'x-default', href: `${SITE}${enPath}` },
  ];
}
