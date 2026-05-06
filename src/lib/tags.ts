// Display-side tag normalization for blog tag filters.
// Source frontmatter tags vary in case/spelling/plurality (claudecode vs claude-code,
// AI vs ai, harness vs harness-engineering). Normalize at render time so the filter UI
// shows a tight set of meaningful categories instead of 40+ singletons.

const TAG_ALIAS: Record<string, string> = {
  // case-only variants normalize via toLowerCase()
  // explicit consolidations:
  'claudecode': 'claude-code',
  'claude-codes': 'claude-code',
  'harness': 'harness-engineering',
  'ai-agents': 'ai-agent',
  'agents': 'ai-agent',
  'ai': 'ai-agent',
  'llm': 'llmo',
  'llms': 'llmo',
};

export function normalizeTag(t: string): string {
  const lower = t.toLowerCase();
  return TAG_ALIAS[lower] || lower;
}

export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tags) {
    const n = normalizeTag(t);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

export interface TagsConfig {
  minCount?: number;
  maxTags?: number;
}

/**
 * Build the displayed tag list from a collection of post tag arrays.
 * Defaults: only show tags with >=2 posts, cap at 10.
 * Falls back to all tags if no tag meets the threshold (so an empty UI is avoided).
 */
export function topTags(
  postTagArrays: string[][],
  { minCount = 2, maxTags = 10 }: TagsConfig = {}
): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const tags of postTagArrays) {
    for (const t of normalizeTags(tags)) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const filtered = entries.filter(([, c]) => c >= minCount);
  const list = filtered.length > 0 ? filtered : entries;
  return list.slice(0, maxTags);
}
