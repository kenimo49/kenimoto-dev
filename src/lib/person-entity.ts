// 著者エンティティ（Person）と発行者（Organization）の単一ソース。
//
// 背景: 記事・書籍ページの JSON-LD は author/publisher を `@id` 参照
// (`#person` / `#organization`) で書いていたが、その実体（特に sameAs で
// 各プロフィールを束ねた Person ノード）はトップページにしか存在しなかった。
// AI 検索は引用対象の単一 URL を直接取得するため、参照先ノードが同じページに
// 無いと著者の同一性を解決できない。各ページに実体を @graph で同梱するため、
// ここを正典として共有する。
//
// sameAs は言語に依存しない人物同一性なので、全プロフィールの和集合を
// 全言語ページで同一に出す（旧実装は言語ごとに数がバラついていた）。

export const SITE_URL = 'https://kenimoto.dev';

export type Lang = 'en' | 'ja' | 'pt' | 'es';

// 著者の cross-profile 同一性グラフ（全言語共通の正典）。
// Amazon Author Central は author code B0GQNPRCGF が全 region で同一なので 4 store を sameAs に含める。
export const PERSON_SAMEAS = [
  'https://github.com/kenimo49',
  'https://x.com/kenimo49',
  'https://linkedin.com/in/kenimo49',
  'https://qiita.com/kenimo49',
  'https://zenn.dev/kenimo49',
  'https://www.docswell.com/user/kenimo49',
  'https://speakerdeck.com/kenimo49',
  'https://dev.to/kenimo49',
  'https://kenimo49.hashnode.dev',
  'https://medium.com/@kenimo49',
  'https://www.tabnews.com.br/kenimo49',
  'https://www.amazon.co.jp/stores/author/B0GQNPRCGF',
  'https://www.amazon.com/stores/author/B0GQNPRCGF',
  'https://www.amazon.com.br/stores/author/B0GQNPRCGF',
  'https://www.amazon.es/stores/author/B0GQNPRCGF',
];

interface PersonCopy {
  name: string;
  alternateName?: string;
  jobTitle: string;
  description: string;
  knowsAbout: string[];
}

const PERSON_BY_LANG: Record<Lang, PersonCopy> = {
  en: {
    name: 'Ken Imoto',
    jobTitle: 'AI Systems Engineer',
    description: 'Building AI-native organizations powered by LLMs, automation, and distributed agents.',
    knowsAbout: ['LLMO', 'LLM Optimization', 'AI-Native MEO', 'WebRTC', 'Real-time AI', 'Context Engineering', 'AI Agent Design', 'MCP', 'Claude Code', 'Android Development', 'Vision-Language Models', 'Color Perception'],
  },
  ja: {
    name: '井本 賢',
    alternateName: 'Ken Imoto',
    jobTitle: 'AIシステムエンジニア',
    description: 'LLM・自動化・分散エージェントでAIネイティブな組織を構築しています。',
    knowsAbout: ['LLMO', 'LLM最適化', 'AI-Native MEO', 'WebRTC', 'リアルタイムAI', 'コンテキストエンジニアリング', 'AIエージェント設計', 'MCP', 'Claude Code', 'Android開発'],
  },
  pt: {
    name: 'Ken Imoto',
    alternateName: '井本 賢',
    jobTitle: 'AI Systems Engineer',
    description: 'Construindo organizações nativas de IA com LLMs, automação e agentes distribuídos.',
    knowsAbout: ['LLMO', 'Otimização de LLM', 'AI-Native MEO', 'WebRTC', 'IA em tempo real', 'Engenharia de Contexto', 'Design de Agentes de IA', 'MCP', 'Claude Code'],
  },
  es: {
    name: 'Ken Imoto',
    alternateName: '井本 賢',
    jobTitle: 'AI Systems Engineer',
    description: 'Construyendo organizaciones nativas de IA con LLMs, automatización y agentes distribuidos.',
    knowsAbout: ['LLMO', 'Optimización de LLM', 'AI-Native MEO', 'WebRTC', 'IA en tiempo real', 'Ingeniería de Contexto', 'Diseño de Agentes de IA', 'MCP', 'Claude Code'],
  },
};

// @graph 内に同梱する Person ノード（@context は graph 側が持つので付けない）。
export function buildPersonEntity(lang: Lang) {
  const p = PERSON_BY_LANG[lang];
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: p.name,
    ...(p.alternateName ? { alternateName: p.alternateName } : {}),
    jobTitle: p.jobTitle,
    description: p.description,
    url: `${SITE_URL}/`,
    sameAs: PERSON_SAMEAS,
    worksFor: { '@id': `${SITE_URL}/#organization` },
    knowsAbout: p.knowsAbout,
  };
}

// @graph 内に同梱する Organization ノード。
export function buildOrganizationEntity() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Propel-Lab',
    url: 'https://propel-lab.co.jp/',
    logo: `${SITE_URL}/og-image.png`,
    founder: { '@id': `${SITE_URL}/#person` },
  };
}

// WebSite ノードは言語ごとに別 @id（en は #website、他は #website-<lang>）。
// 記事/書籍ページの isPartOf 参照先と、各トップページの WebSite 定義を
// ここで単一ソース化する。
interface WebSiteCopy {
  idFragment: string;
  name: string;
  alternateName?: string;
  path: string;
  description: string;
  inLanguage: string;
}

const WEBSITE_BY_LANG: Record<Lang, WebSiteCopy> = {
  en: {
    idFragment: '#website',
    name: 'Ken Imoto',
    alternateName: 'kenimoto.dev',
    path: '/',
    description: 'Ken Imoto — AI Systems Engineer. Building AI-native organizations powered by LLMs, real-time AI, and context engineering.',
    inLanguage: 'en-US',
  },
  ja: {
    idFragment: '#website-ja',
    name: '井本 賢',
    alternateName: 'kenimoto.dev',
    path: '/ja/',
    description: '井本 賢 — AIシステムエンジニア。LLM・自動化・分散エージェントでAIネイティブな組織を構築。',
    inLanguage: 'ja-JP',
  },
  pt: {
    idFragment: '#website-pt',
    name: 'Ken Imoto — Edições em Português',
    path: '/pt/',
    description: 'Livros sobre Claude Code, Engenharia de Contexto e desenvolvimento com IA, em português.',
    inLanguage: 'pt-BR',
  },
  es: {
    idFragment: '#website-es',
    name: 'Ken Imoto — Ediciones en Español',
    path: '/es/',
    description: 'Libros sobre Claude Code, Ingeniería de Contexto y desarrollo con IA, en español.',
    inLanguage: 'es-ES',
  },
};

// isPartOf などから参照する、言語別 WebSite の @id。
export function websiteId(lang: Lang) {
  return `${SITE_URL}/${WEBSITE_BY_LANG[lang].idFragment}`;
}

// @graph 内に同梱する WebSite ノード（@context は graph 側が持つ）。
export function buildWebSiteEntity(lang: Lang) {
  const w = WEBSITE_BY_LANG[lang];
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/${w.idFragment}`,
    name: w.name,
    ...(w.alternateName ? { alternateName: w.alternateName } : {}),
    url: `${SITE_URL}${w.path}`,
    description: w.description,
    inLanguage: w.inLanguage,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
