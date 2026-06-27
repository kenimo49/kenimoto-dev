/**
 * Estimate reading time from raw markdown body, weighted for JP/EN mixed text.
 * Speeds: JP ~450 chars/min, EN ~230 words/min. We convert English words into
 * "character-equivalents" so a single integer divisor works for blended text.
 */
export function estimateReadingTime(body: string, lang: string): { minutes: number; label: string; shortLabel: string } {
  // strip code fences, inline code, markdown links/images, html tags
  const stripped = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_~\-]/g, ' ');

  // CJK chars (kanji + hiragana + katakana)
  const cjkChars = (stripped.match(/[぀-ヿ㐀-䶿一-鿿]/g) || []).length;
  // Latin words
  const latinWords = (stripped.match(/[A-Za-z][A-Za-z0-9'-]*/g) || []).length;

  // 1 EN word ≈ 5 CJK chars in reading time terms (450/min vs ~230 wpm).
  // Tune the multiplier so EN-heavy and JP-heavy posts both feel right.
  const equiv = cjkChars + latinWords * 5;
  const minutes = Math.max(1, Math.round(equiv / 450));

  const labels: Record<string, (m: number) => string> = {
    en: (m) => `${m} min read`,
    ja: (m) => `${m}分で読めます`,
    pt: (m) => `${m} min de leitura`,
    es: (m) => `${m} min de lectura`,
  };
  const shortLabels: Record<string, (m: number) => string> = {
    en: (m) => `${m} min`,
    ja: (m) => `${m}分`,
    pt: (m) => `${m} min`,
    es: (m) => `${m} min`,
  };
  const fn = labels[lang] ?? labels.en;
  const shortFn = shortLabels[lang] ?? shortLabels.en;
  return { minutes, label: fn(minutes), shortLabel: shortFn(minutes) };
}
