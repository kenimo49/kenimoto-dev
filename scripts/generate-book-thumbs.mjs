#!/usr/bin/env node
/**
 * トップページ / 書籍一覧で使う表紙サムネイルを生成する。
 *
 * public/images/books/*.{png,jpg,jpeg} (トップレベルのみ) を
 * public/images/books/thumbs/<name>.webp (幅320px, q80) に縮小する。
 * 表示は最大160px幅程度なので 2x retina 相当。原寸 (1600x2560 等) の
 * eager 配信を避けるのが目的。生成物は git にコミットして静的配信する。
 *
 * 実行: node scripts/generate-book-thumbs.mjs
 * 既に最新の thumb があればスキップ (ソースより新しい場合)。
 */
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('public/images/books');
const OUT_DIR = path.join(SRC_DIR, 'thumbs');
const WIDTH = 320;
const QUALITY = 80;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  const images = entries.filter(
    (e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name),
  );

  let made = 0;
  let skipped = 0;
  for (const e of images) {
    const src = path.join(SRC_DIR, e.name);
    const out = path.join(OUT_DIR, e.name.replace(/\.(png|jpe?g)$/i, '.webp'));
    if (existsSync(out)) {
      const [s, o] = await Promise.all([stat(src), stat(out)]);
      if (o.mtimeMs >= s.mtimeMs) {
        skipped++;
        continue;
      }
    }
    await sharp(src)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out);
    made++;
  }
  console.log(`book-thumbs: generated ${made}, skipped ${skipped} (up-to-date), out=${path.relative(process.cwd(), OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
