---
title: "I Audited 30 llms.txt Files in the Wild. 5 Anti-Patterns Are Already Forming."
description: "I shipped my third llms.txt this month and felt productive. Then I opened 30 production llms.txt files from companies like Stripe, Vercel, and Anthropic. Most of them are already broken in the same five ways."
date: 2026-05-11
lang: en
tags: [llmo, llms-txt, ai-search, anti-patterns, audit]
featured: false
canonical_url: "https://kenimoto.dev/blog/30-llms-txt-files-5-anti-patterns-already-forming/"
og_image: "https://kenimoto.dev/images/blog/30-llms-txt-files-5-anti-patterns-already-forming/og.png"
cross_posted_to: []
---

I shipped my third llms.txt this month and felt extremely productive. The kind of productive where you close the laptop, pour a coffee, and feel like the entire AI-search problem is now solved on a personal level.

Then I opened 30 production llms.txt files from the companies the rest of us are supposed to be learning from. Anthropic. Stripe. Vercel. Cloudflare. Hugging Face. Mintlify. Astro. Linear. The names you cite when you tell someone "look, the serious players are doing it."

24 of the 30 files had at least one of five problems. Three of those problems were in my own files.

That coffee got cold.

## How I Ran the Audit

The setup was embarrassingly simple. I picked 30 domains that have public llms.txt files and matter to developers in 2026: AI labs, infra companies, popular dev tools. I `curl`ed each one. I read each one with the eyes of an LLM trying to use it. I logged what was wrong.

This isn't science. It's a Monday evening with a terminal open. But the patterns showed up so fast that I stopped at 30 — the next ten would have been more of the same.

A March 2026 [SE Ranking study of 300,000 domains](https://seranking.com/blog/llms-txt/) found roughly 10% adoption. The [codersera May 2026 guide](https://codersera.com/blog/llms-txt-complete-guide-2026/) puts the number around 844,000 sites with 500% YoY growth. The standard is winning the adoption race. It is losing the quality race.

![5 llms.txt anti-patterns at a glance](/images/blog/30-llms-txt-files-5-anti-patterns-already-forming/5-anti-patterns.png)

## The Five Anti-Patterns

### Anti-Pattern 1: "Dump Everything"

This is the most common failure and the one I am most guilty of. The author treats llms.txt as a second sitemap. 800 links. 1,200 links. One file I opened had every blog post since 2019, flat, no priority, no grouping.

The whole point of llms.txt is that sitemap.xml already exists. When the spec says "10KB recommended" it is not being cute about file size. It is saying: if the LLM cannot read all of this inside a context window with budget left for the actual question, you have not helped, you have moved the problem.

The fix is brutal: pick 10 to 20 links. Not 50. Not "key sections plus a few extras." Ten to twenty. Everything else goes in `## Optional` or stays in sitemap.xml.

If you are a docs-heavy product, use the pattern Cloudflare ships: a slim root llms.txt that links to per-product llms.txt files. Each one stays under the budget. An agent fetches only the one it needs. No one reads the entire encyclopedia to fix a faucet.

### Anti-Pattern 2: "Contradicts robots.txt"

Open the robots.txt. Open the llms.txt. Diff the paths. About a third of the files I audited list URLs in llms.txt that are explicitly `Disallow`ed in robots.txt for the very crawlers most likely to read llms.txt.

The most painful example: a docs site that blocks `GPTBot` and `ClaudeBot` from `/docs/` in robots.txt, then lists 40 `/docs/*` URLs in llms.txt. The file says "here is what matters." The robots.txt says "you cannot have it." The crawler obeys robots.txt. The llms.txt is decorative.

This usually happens when the two files are owned by different teams (or by the same person across two different months). The fix is a five-minute review with both files open: every URL in llms.txt must be allowed in robots.txt for every AI crawler you actually want reading it.

If you genuinely want to block AI crawlers, fine, but then do not also write them a polite directory of your favourite pages.

### Anti-Pattern 3: "HTML Links Only, No .md"

Jeremy Howard's original proposal includes a clever convention: any URL appended with `.md` should return a clean Markdown version of the page — no nav, no ads, no JavaScript bundle. The `.html.md` pattern.

Almost nobody does it. In my 30 files, only 6 served any `.md` companion at all. The other 24 hand the LLM a link to an HTML page that the LLM cannot parse cleanly because the crawler [does not execute JavaScript](https://kenimoto.dev/blog/llms-txt-ai-find-your-site/).

Stripe does this well: every docs URL has a `.md` twin and llms.txt points at the `.md` version. The [llmoframework.com reference templates section](https://llmoframework.com) calls this out as the single highest-leverage thing most teams are skipping, because it is the difference between "AI can find the page" and "AI can actually read what is on the page."

The fix depends on your stack. For Astro and Next.js, generating `.md` versions at build time is a 30-line change. For dynamic CMS sites, an edge function that returns a markdown serialization on the `.md` suffix is the move. Either way, this is the anti-pattern with the largest delta between effort and outcome.

### Anti-Pattern 4: "About Page Theatre"

Eight of the 30 files used the entire body of the file as a marketing pitch. Three paragraphs about the company's mission. A founder quote. The history of the brand. Then two links. Total content: "we are visionary leaders in the AI-native space."

LLMs do not buy your vibe. They need pointers to content. The H1 plus blockquote summary is the place for "what is this site." Everything below should be links to specific pages with specific descriptions. If your llms.txt reads like a homepage, you wrote a homepage.

Princeton's [GEO study of 9 ways to get cited by AI](https://kenimoto.dev/blog/geo-princeton-study-9-ways-ai-cites-you/) hammered the same point on the content side: vague claims do not get cited, specific claims with sources do. The same logic applies to llms.txt itself.

### Anti-Pattern 5: "Frozen in 2024"

Five of the files I audited had visible signs of being shipped once and never touched again. Links to pages that 404. Product names that no longer exist. Dates that put the file's last meaningful update in 2024 — back when llms.txt was a six-month-old proposal and "AI search" was something Perplexity was still explaining to people.

Sitemap.xml is auto-generated. robots.txt rarely changes. llms.txt sits in an uncanny middle: hand-curated like documentation, but with the same staleness risk as a README that says "we use Yarn" when you migrated to pnpm last year.

The fix is automation, not discipline. Add a CI check that flags 404s in the URLs your llms.txt lists. Regenerate the "featured articles" section from your analytics every quarter. Treat the file like a config artifact, not a one-off launch deliverable.

[Mintlify's analysis of real llms.txt examples](https://www.mintlify.com/blog/real-llms-txt-examples) flagged this as the second-biggest pattern they saw across the customer base. The first was Anti-Pattern 1. So those are the two to fix this week.

## The Three I Shipped Myself

Honesty section. Of my three llms.txt files:

- One had 47 links in it. Anti-pattern 1.
- One pointed at HTML-only URLs because I had not set up the `.md` companion yet. Anti-pattern 3.
- One had not been updated in 4 months and listed a post under a slug I had since renamed. Anti-patterns 5 and a 301-redirect chain for dessert.

I did not catch any of this until I was three quarters of the way through reading other people's files. The audit was supposed to be about them. It ended up being about me. There is probably a lesson in there, but I am still in the embarrassment phase.

## What Changed After I Fixed Two

I fixed two of them. The 47-link file went to 16 links plus an `## Optional` section. The HTML-only file got `.md` twins for the 16 featured URLs via a build-time hook (Astro made this easier than I expected — about 25 lines).

I cannot tell you "AI citations jumped by X%" because the file is one week old and citation measurement at this volume is noisy. What I can tell you is the file now passes a smell test I should have applied from day one: would a model with a 200K context window and ten other tabs open prefer this file over the previous version? Yes. Obviously yes. The previous version was unreadable.

[Measuring whether AI is actually citing your site](https://kenimoto.dev/blog/measure-ai-citations-llmo-kpi/) is its own problem and I have written about it separately. For llms.txt specifically, the test I now apply before shipping is: "if I gave this to a junior engineer with no context, could they figure out what this site is and what to read first, in under 60 seconds." If no, the file is wrong, regardless of what any AI search tool ends up doing with it.

## The Honest Position on llms.txt

The skeptics are partly right. SE Ranking's 300K-domain study did not find a measurable citation lift. The major LLMs do not publicly confirm they fetch the file. The standard has no W3C stamp.

The skeptics are also partly wrong. IDE agents (Cursor, Cline, Continue), the [five AI search engines I compared earlier](https://kenimoto.dev/blog/five-ai-search-engines-architecture-llmo/), and a growing list of MCP integrations read llms.txt today. The optionality is real and the cost is fifteen minutes.

The actual question for 2026 is not "should I ship an llms.txt." That question is settled by the cost-benefit math. The question is whether the file you ship gives an LLM something useful or trains it to ignore your domain. Anti-patterns 1 through 5 are the difference between those two outcomes.

## What to Do This Week

If you have not shipped one yet, my [llms.txt guide from April](https://kenimoto.dev/blog/llms-txt-ai-find-your-site/) walks through the basics. If you have shipped one, run it through the five-question audit:

1. Is it under 10KB and under 20 links (excluding `## Optional`)?
2. Do all listed URLs pass robots.txt for GPTBot and ClaudeBot?
3. Do at least the top 5 URLs have a `.md` companion?
4. Does the body link to specific pages, not generic marketing copy?
5. Was it updated in the last 90 days?

If you score 5 out of 5, you are in the top 6 of the 30 sites I looked at, which is to say the top 20% of an already-self-selected sample. If you score 3 or below, you have the same Monday afternoon ahead of you that I did.

I am writing my fourth llms.txt this week. I will run it through this list before I publish. I will not feel productive afterwards. I will feel like someone who learned the same lesson three audits in a row.

That, I am told, is how engineering works.

---

## Want to go deeper?

If you want the full LLMO playbook — beyond llms.txt and into JSON-LD, robots.txt strategy, content design, and measurement — **[LLMO: AI Search Optimization for Engineers](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=30-llms-txt-5-anti-patterns)** is the 12-chapter book that the 8-chapter Quickstart is excerpted from. Same author, deeper depth, more case studies.
