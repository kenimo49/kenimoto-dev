/**
 * 表紙画像のパスを、軽量サムネイル (320px webp) のパスに変換する。
 * scripts/generate-book-thumbs.mjs が public/images/books/thumbs/<name>.webp を生成する。
 *
 * /images/books/<name>.{png,jpg,jpeg} → /images/books/thumbs/<name>.webp
 * それ以外 (サブディレクトリ・別形式・外部URL) はそのまま返す。
 * 一覧・グリッド表示でのみ使う。LP の hero 表紙は原寸のままで良い。
 */
export function coverThumb(src: string | undefined): string | undefined {
  if (!src) return src;
  const m = src.match(/^\/images\/books\/([^/]+)\.(png|jpe?g)$/i);
  if (!m) return src;
  return `/images/books/thumbs/${m[1]}.webp`;
}
