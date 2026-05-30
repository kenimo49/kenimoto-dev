// Social Proof素材 — Hero下の <SocialProof> Block と Hero内の著者bio行で使う。
// 数字は検証可能なものだけ載せる (KDP Orders Reportとken提供のZenn実数値が一次ソース)。
// 数字を更新するときは asOf も同時に更新する。

export type Lang = 'en' | 'ja' | 'pt' | 'es';

export interface ProofMetric {
  id: string;
  icon: string;
  value: string;
  labels: Record<Lang, string>;
}

export interface ProofData {
  asOf: string;
  metrics: ProofMetric[];
  authorBio: Record<Lang, string>;
  sectionHeading: Record<Lang, string>;
  sampleLabel: Record<Lang, string>;
  kuBadge: Record<Lang, string>;
  guarantee: Record<Lang, string>;
  partCta: Record<Lang, string>;
  freePreviewHeading: Record<Lang, string>;
  freePreviewLead: Record<Lang, string>;
  freePreviewChapterCta: Record<Lang, string>;
  ptHeadlineSignal: string;
  jaHeadlineSignal: string;
}

export const proof: ProofData = {
  asOf: '2026-05-15',

  metrics: [
    {
      id: 'kindle_units',
      icon: '📚',
      value: '33',
      labels: {
        ja: 'Kindle販売 (直近3ヶ月)',
        en: 'Kindle units sold (3 months)',
        pt: 'Vendas no Kindle (3 meses)',
        es: 'Ventas en Kindle (3 meses)',
      },
    },
    {
      id: 'kindle_markets',
      icon: '🌎',
      value: '6',
      labels: {
        ja: '販売国 (JP/US/BR/DE/IT/AU)',
        en: 'Markets sold in (JP/US/BR/DE/IT/AU)',
        pt: 'Países com vendas (JP/US/BR/DE/IT/AU)',
        es: 'Países con ventas (JP/US/BR/DE/IT/AU)',
      },
    },
    {
      id: 'zenn_views',
      icon: '📖',
      value: '32k+',
      labels: {
        ja: 'Zenn累計views (3ヶ月)',
        en: 'Zenn views (3 months)',
        pt: 'Views no Zenn em 3 meses',
        es: 'Vistas en Zenn en 3 meses',
      },
    },
    {
      id: 'book_count',
      icon: '🗂',
      value: '30+',
      labels: {
        ja: '出版書籍数',
        en: 'Books published',
        pt: 'Livros publicados',
        es: 'Libros publicados',
      },
    },
  ],

  authorBio: {
    ja: 'ken imoto / Practical Claude Code・Harness Engineeringシリーズ著者。4言語で30冊以上の技術書を出版。',
    en: 'ken imoto — Author of the Practical Claude Code & Harness Engineering series. 30+ technical books across JA/EN/PT/ES.',
    pt: 'ken imoto — Autor das séries Practical Claude Code e Harness Engineering. Mais de 30 livros técnicos em JA/EN/PT/ES.',
    es: 'ken imoto — Autor de las series Practical Claude Code y Harness Engineering. Más de 30 libros técnicos en JA/EN/PT/ES.',
  },

  // PT 量的シグナル (Rocketseat 風 hero アンカー、 PT 限定で表示)
  // BR 市場リサーチ反映: 会社ロゴ social proof の代替として量的シグナル 1行
  ptHeadlineSignal:
    '7 livros já em PT-BR · 4 traduzidos JA → PT-BR · Devs em 6 países leram a coleção',

  // JA 量的シグナル (Zenn 風いいね数アンカー、 JA 限定で表示)
  // JA 市場リサーチ反映: Zenn 個人技術書の「いいね数」trust signal を kenimoto.dev版で再現
  jaHeadlineSignal:
    'Zenn累計32,000+ views · 4言語で30冊以上出版 · Kindle 6カ国で販売中',

  sectionHeading: {
    ja: '数字で見る著者',
    en: 'By the numbers',
    pt: 'Em números',
    es: 'En cifras',
  },

  sampleLabel: {
    ja: '無料で試し読み',
    en: 'Read sample chapters',
    pt: 'QUERO O TRECHO GRÁTIS',
    es: 'Leer muestra gratis',
  },

  kuBadge: {
    ja: 'Kindle Unlimited 読み放題対象',
    en: 'Included with Kindle Unlimited',
    pt: 'Incluso no Kindle Unlimited',
    es: 'Incluido en Kindle Unlimited',
  },

  guarantee: {
    ja: 'Amazonの方針で購入後7日以内なら返品可',
    en: '7-day return window via Amazon',
    pt: '7 dias para devolução via Amazon',
    es: '7 días para devolución vía Amazon',
  },

  partCta: {
    ja: 'ここまで読んでみたい → Kindleで続きを読む',
    en: 'Sounds good so far → Continue on Kindle',
    pt: 'Curtindo até aqui → Continuar no Kindle',
    es: 'Te interesa hasta aquí → Continuar en Kindle',
  },

  freePreviewHeading: {
    ja: '無料で読める章',
    en: 'Read for free',
    pt: 'Leia de graça',
    es: 'Lee gratis',
  },

  freePreviewLead: {
    ja: '買う前に3章をその場で読めます。気に入ったらKindleで続きを。',
    en: 'Read three full chapters right here before you buy. Liked it? Continue on Kindle.',
    pt: 'Leia 3 capítulos completos aqui mesmo antes de comprar. Curtiu? Continue no Kindle.',
    es: 'Lee 3 capítulos completos aquí antes de comprar. ¿Te gustó? Continúa en Kindle.',
  },

  freePreviewChapterCta: {
    ja: 'この続きはKindleで →',
    en: 'Continue this chapter on Kindle →',
    pt: 'Continue este capítulo no Kindle →',
    es: 'Continúa este capítulo en Kindle →',
  },
};
