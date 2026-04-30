#!/usr/bin/env node
/**
 * Generate OG images for all blog posts using Puppeteer.
 *
 * Usage:
 *   node tools/generate-og-images.mjs            # all posts
 *   node tools/generate-og-images.mjs <slug>      # single post
 */
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = join(ROOT, 'public', 'images', 'blog');
const TEMPLATE_PATH = join(__dirname, 'og-template.html');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)/);
    if (m) {
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      fm[m[1]] = val;
    }
  }
  const tagsMatch = content.match(/tags:\s*\[([^\]]*)\]/);
  if (tagsMatch) {
    fm.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
  }
  return fm;
}

function findPosts(targetSlug) {
  const posts = [];
  for (const lang of ['en', 'ja']) {
    const dir = join(CONTENT_DIR, lang);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const slug = file.replace('.md', '');
      if (targetSlug && slug !== targetSlug) continue;
      const content = readFileSync(join(dir, file), 'utf-8');
      const fm = parseFrontmatter(content);
      if (fm) {
        posts.push({ lang, slug, title: fm.title, tags: fm.tags || [] });
      }
    }
  }
  return posts;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function generateOgImage(browser, templateHtml, post) {
  const outDir = join(PUBLIC_DIR, post.slug);
  mkdirSync(outDir, { recursive: true });
  const suffix = post.lang === 'en' ? 'og.png' : `og-${post.lang}.png`;
  const outPath = join(outDir, suffix);

  let html = templateHtml;
  html = html.replace('TITLE', escapeHtml(post.title));

  const tagsHtml = post.tags.slice(0, 4)
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');
  html = html.replace('<div class="tags" id="tags"></div>',
    `<div class="tags" id="tags">${tagsHtml}</div>`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: outPath, type: 'png' });
  await page.close();

  console.log(`  ${post.lang}/${post.slug} -> og.png`);
  return outPath;
}

async function main() {
  const targetSlug = process.argv[2] || null;
  const posts = findPosts(targetSlug);

  if (posts.length === 0) {
    console.log('No posts found.');
    process.exit(1);
  }

  console.log(`Generating OG images for ${posts.length} posts...`);
  const templateHtml = readFileSync(TEMPLATE_PATH, 'utf-8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const post of posts) {
    await generateOgImage(browser, templateHtml, post);
  }

  await browser.close();
  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
