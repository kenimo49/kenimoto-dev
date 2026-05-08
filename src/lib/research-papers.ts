/**
 * Zenodo に登録した研究論文の共通メタデータ。
 * 各言語トップで ScholarlyArticle JSON-LD を出すために共有する。
 * codex 二次レビュー指摘: ScholarlyArticle が EN top のみだと非英語ページの E-E-A-T が弱い。
 */
export const RESEARCH_PAPERS = [
  {
    name: 'AI Blue: Systematic Color Recognition Bias in Vision-Language Models and Its Implications for AI-Generated UI Design',
    datePublished: '2026-03-22',
    url: 'https://doi.org/10.5281/zenodo.19159702',
    doi: '10.5281/zenodo.19159702',
    about: ['Vision-Language Models', 'Color Perception', 'CIEDE2000', 'AI Slop', 'Computer Vision'],
  },
  {
    name: 'AI Text Slop: A Quantitative Study of Stylistic Convergence Across Six Language Models in Japanese Technical Writing',
    datePublished: '2026-03-23',
    url: 'https://doi.org/10.5281/zenodo.19173035',
    doi: '10.5281/zenodo.19173035',
    about: ['LLM', 'AI Text Detection', 'Japanese NLP', 'Stylistic Convergence', 'RLHF', 'AI Slop'],
  },
  {
    name: 'Excess Vocabulary in Japanese AI-Generated Text: A Cross-Model Quantitative Analysis',
    datePublished: '2026-03-26',
    url: 'https://doi.org/10.5281/zenodo.19233934',
    doi: '10.5281/zenodo.19233934',
    about: ['Excess Vocabulary', 'Japanese NLP', 'LLM Detection', 'MeCab', 'Cross-Model Comparison', 'Vocabulary Coevolution'],
  },
] as const;

export function buildScholarlyArticleJsonLd(personId: string) {
  return RESEARCH_PAPERS.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    name: p.name,
    author: { '@id': personId },
    datePublished: p.datePublished,
    url: p.url,
    identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: p.doi },
    about: p.about,
  }));
}
