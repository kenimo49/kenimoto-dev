/**
 * Amazon Associates 用のアフィリエイトタグを URL に注入する。
 * 対応: amazon.co.jp / amazon.com / amazon.com.br / amazon.es 等の各国ドメイン (/dp/ または /gp/ パスを持つ場合)
 * 非対応: amzn.asia / amzn.to / a.co などの短縮 URL (リダイレクト先は別 URL なので、
 *         パラメータが伝搬しない可能性がある。手動で /dp/ASIN 形式に展開推奨)
 *
 * tag が空文字列なら何もしない (env 未設定時の no-op)。
 * 既に ?tag= があれば上書きしない。
 */
export function withAffiliateTag(url: string | undefined, tag: string): string | undefined {
  if (!url || !tag) return url;
  try {
    const u = new URL(url);
    const isAmazonDomain = /(^|\.)amazon\.(co\.jp|com|com\.br|es|de|fr|it|co\.uk|ca|com\.mx|com\.au|in)$/.test(u.hostname);
    if (!isAmazonDomain) return url;
    // 短縮URL系は /dp/ も /gp/ も持たない
    if (!/\/(dp|gp)\//.test(u.pathname)) return url;
    if (u.searchParams.has('tag')) return url;
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return url;
  }
}
