#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, '..', 'src', 'content', 'blog');
const booksDir = join(__dirname, '..', 'src', 'content', 'books');
const outDir = join(__dirname, '..', 'dist');
const fullPath = join(outDir, 'llms-full.txt');
const indexPath = join(outDir, 'llms.txt');
const SITE = 'https://kenimoto.dev';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (m) meta[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: match[2] };
}

function stripImages(body) {
  return body.replace(/^!\[[^\]]*\]\([^)]+\)\s*$/gm, '');
}

async function loadCollection(dir) {
  const items = [];
  for (const lang of ['en', 'ja', 'pt', 'es']) {
    const langDir = join(dir, lang);
    let files = [];
    try {
      files = (await readdir(langDir)).filter((f) => f.endsWith('.md')).sort();
    } catch {
      continue;
    }
    for (const f of files) {
      const raw = await readFile(join(langDir, f), 'utf8');
      const { meta, body } = parseFrontmatter(raw);
      items.push({ slug: f.replace(/\.md$/, ''), lang, meta, body });
    }
  }
  return items;
}

function blogUrl(a) {
  return a.lang === 'en'
    ? `${SITE}/blog/${a.slug}/`
    : `${SITE}/${a.lang}/blog/${a.slug}/`;
}

function bookUrl(b) {
  return b.lang === 'en'
    ? `${SITE}/books/${b.slug}/`
    : `${SITE}/${b.lang}/books/${b.slug}/`;
}

function formatIndex(blogPosts, books) {
  const lines = [];
  lines.push('# Ken Imoto');
  lines.push('');
  lines.push('> AI Systems Engineer specializing in LLMO, WebRTC, Real-time AI, and Context Engineering. Building AI-native organizations powered by LLMs, automation, and distributed agents.');
  lines.push('');
  lines.push('## About');
  lines.push('');
  lines.push('Ken Imoto is an AI Systems Engineer based in Fukuoka, Japan. He builds AI-native organizations at Propel-Lab (https://propel-lab.co.jp) and researches LLMO (LLM Optimization), AI Agent Design, and Human-AI Interaction.');
  lines.push('');
  lines.push('LLMO includes approaches such as AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization).');
  lines.push('');
  lines.push('## Expertise');
  lines.push('');
  lines.push('- LLMO (LLM Optimization) — Author of the LLMO Framework (https://llmoframework.com)');
  lines.push('- WebRTC & Real-time AI');
  lines.push('- Context Engineering (CLAUDE.md, AGENTS.md patterns)');
  lines.push('- AI Agent Design (MCP, multi-agent architectures)');
  lines.push('- Android & Web Development (8+ years)');
  lines.push('');
  // Books grouped by lang
  lines.push(`## Books (${books.length} editions, auto-generated)`);
  lines.push('');
  for (const lang of ['en', 'ja', 'pt', 'es']) {
    const subset = books.filter((b) => b.lang === lang).sort((a, b) =>
      String(b.meta.published_date || '').localeCompare(String(a.meta.published_date || ''))
    );
    if (subset.length === 0) continue;
    const langLabel = { en: 'English', ja: 'Japanese (日本語)', pt: 'Portuguese (Português)', es: 'Spanish (Español)' }[lang];
    lines.push(`### ${langLabel}`);
    lines.push('');
    for (const b of subset) {
      const t = b.meta.title || b.slug;
      const sub = b.meta.subtitle ? ` — ${b.meta.subtitle}` : '';
      lines.push(`- ${bookUrl(b)} — ${t}${sub}`);
      const xrefs = [];
      if (b.meta.kindle_url) xrefs.push(`Kindle: ${b.meta.kindle_url}`);
      if (b.meta.zenn_url) xrefs.push(`Zenn: ${b.meta.zenn_url}`);
      if (xrefs.length > 0) lines.push(`  ${xrefs.join(' | ')}`);
    }
    lines.push('');
  }
  // Blog grouped by lang
  lines.push(`## Blog Articles (${blogPosts.length} articles, auto-generated)`);
  lines.push('');
  for (const lang of ['en', 'ja', 'pt', 'es']) {
    const subset = blogPosts.filter((p) => p.lang === lang).sort((a, b) =>
      String(b.meta.date || '').localeCompare(String(a.meta.date || ''))
    );
    if (subset.length === 0) continue;
    const langLabel = { en: 'English', ja: 'Japanese (日本語)', pt: 'Portuguese (Português)', es: 'Spanish (Español)' }[lang];
    lines.push(`### ${langLabel}`);
    lines.push('');
    for (const p of subset) {
      lines.push(`- ${blogUrl(p)} — ${p.meta.title}`);
    }
    lines.push('');
  }
  lines.push('## Research Papers (Zenodo)');
  lines.push('');
  lines.push('- Excess Vocabulary in Japanese AI-Generated Text (DOI: 10.5281/zenodo.19233934)');
  lines.push('- AI Text Slop: Stylistic Convergence Across Six LLMs (DOI: 10.5281/zenodo.19173035)');
  lines.push('- AI Blue: Color Recognition Bias in Vision-Language Models (DOI: 10.5281/zenodo.19159702)');
  lines.push('');
  lines.push('## Side Projects');
  lines.push('');
  lines.push('- legacydram (https://legacydram.com/) — A whisky curation media reading every bottle as somebody\'s commit history.');
  lines.push('');
  lines.push('## Content URLs');
  lines.push('');
  lines.push('- EN Blog: https://kenimoto.dev/blog/');
  lines.push('- JA Blog: https://kenimoto.dev/ja/blog/');
  lines.push('- PT Blog: https://kenimoto.dev/pt/blog/');
  lines.push('- ES Blog: https://kenimoto.dev/es/blog/');
  lines.push('- RSS (EN): https://kenimoto.dev/blog.xml');
  lines.push('- RSS (JA): https://kenimoto.dev/ja/blog.xml');
  lines.push('- Full text (AI citation use): https://kenimoto.dev/llms-full.txt');
  lines.push('');
  lines.push('## AI-Readable Content');
  lines.push('');
  lines.push('- /ai/about.md — Profile and current focus');
  lines.push('- /ai/publications.md — Complete publication list with links');
  lines.push('- /ai/expertise.md — Technical expertise and career highlights');
  lines.push('');
  lines.push('## Links');
  lines.push('');
  lines.push('- Website: https://kenimoto.dev');
  lines.push('- Company: https://propel-lab.co.jp');
  lines.push('- LLMO Framework: https://llmoframework.com');
  lines.push('- legacydram (Side Project): https://legacydram.com');
  lines.push('- GitHub: https://github.com/kenimo49');
  lines.push('- LinkedIn: https://linkedin.com/in/kenimo49');
  lines.push('- X: https://x.com/kenimo49');
  lines.push('- Qiita: https://qiita.com/kenimo49');
  lines.push('- Zenn: https://zenn.dev/kenimo49');
  lines.push('- DEV.to: https://dev.to/kenimo49');
  lines.push('- Amazon Author: https://www.amazon.co.jp/stores/author/B0GQNPRCGF');
  lines.push('');
  return lines.join('\n');
}

function formatFull(blogPosts) {
  const lines = [];
  lines.push('# Ken Imoto — Full Blog Text');
  lines.push('');
  lines.push('> Concatenated full text of all blog articles for AI citation use.');
  lines.push('> Individual URLs are listed in llms.txt or sitemap-index.xml.');
  lines.push('');
  for (const p of blogPosts) {
    lines.push('---');
    lines.push('');
    lines.push(`# ${p.meta.title || p.slug}`);
    lines.push('');
    lines.push(`URL: ${blogUrl(p)}`);
    lines.push(`Lang: ${p.lang}`);
    if (p.meta.date) lines.push(`Date: ${p.meta.date}`);
    if (p.meta.description) lines.push(`Description: ${p.meta.description}`);
    lines.push('');
    lines.push(stripImages(p.body).trim());
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const blogPosts = await loadCollection(blogDir);
  const books = await loadCollection(booksDir);
  await mkdir(outDir, { recursive: true });

  const indexContent = formatIndex(blogPosts, books);
  await writeFile(indexPath, indexContent, 'utf8');
  console.log(`Wrote ${indexPath} (${indexContent.length} chars, ${blogPosts.length} articles + ${books.length} books)`);

  const fullContent = formatFull(blogPosts);
  await writeFile(fullPath, fullContent, 'utf8');
  console.log(`Wrote ${fullPath} (${fullContent.length} chars)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
