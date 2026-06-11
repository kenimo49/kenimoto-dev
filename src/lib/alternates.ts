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
 * 指定エントリについて、実際に翻訳が存在する言語のhreflangリストを返す。
 * x-default は en にフォールバック、なければ存在する任意の翻訳。
 *
 * 対応付けの優先順位:
 *   1. translationKey が渡され、同じ translation_key を持つエントリ群があればそれで対応付ける
 *      (言語ごとに slug が違っても接続できる)。
 *   2. translationKey が無い場合は従来どおり「同一 slug が他言語にも存在するか」で対応付ける
 *      (後方互換: slug を共有している翻訳ペアはこれで動く)。
 */
export function alternatesFor(
  allEntries: CollectionEntry<'blog'>[] | CollectionEntry<'books'>[],
  kind: 'blog' | 'books',
  slug: string,
  translationKey?: string,
): Alternate[] {
  // (lang, slug) のペアを集める
  let pairs: { lang: Lang; slug: string }[];

  if (translationKey) {
    pairs = allEntries
      .filter((p) => (p.data as { translation_key?: string }).translation_key === translationKey)
      .map((p) => {
        const idx = p.id.indexOf('/');
        return { lang: p.id.slice(0, idx) as Lang, slug: p.id.slice(idx + 1) };
      })
      .filter((e) => (SUPPORTED_LANGS as readonly string[]).includes(e.lang));
  } else {
    pairs = SUPPORTED_LANGS.filter((lang) =>
      allEntries.some((p) => p.id === `${lang}/${slug}`),
    ).map((lang) => ({ lang, slug }));
  }

  if (pairs.length === 0) return [];

  // SUPPORTED_LANGS 順に整列して出力を決定的にする
  pairs.sort((a, b) => SUPPORTED_LANGS.indexOf(a.lang) - SUPPORTED_LANGS.indexOf(b.lang));

  const list: Alternate[] = pairs.map(({ lang, slug: s }) => ({
    hreflang: lang,
    href: urlFor(lang, kind, s),
  }));

  const def = pairs.find((p) => p.lang === 'en') ?? pairs[0];
  list.push({ hreflang: 'x-default', href: urlFor(def.lang, kind, def.slug) });

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
