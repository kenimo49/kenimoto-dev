---
title: "LLMO: The Field Guide to Getting Cited by AI Search"
description: "A 30-month field study compressed into one guide. How AI crawlers find your page, why JSON-LD beats backlinks, what 'passage rank' means in practice, and the eight things I measured before I trusted any of it."
date: 2026-06-29
lang: en
tags: [llmo, ai-search, pillar, guide, perplexity, geo]
featured: true
translation_key: pillar-llmo
canonical_url: "https://kenimoto.dev/blog/llmo/"
---

I spent twelve years optimizing for Google. Then I noticed my own AI agent had stopped using it.

That was the day SEO broke for me. Not in theory, not in some analyst's forecast, but on my own laptop. My agent was asking Brave Search. ChatGPT was asking Bing. Perplexity was asking itself. Meanwhile my carefully tuned Open Graph tags sat there, unread, like ceremonial silverware at a buffet where everyone eats with their hands.

LLMO, **L**arge **L**anguage **M**odel **O**ptimization, is what I started calling the discipline that took SEO's place. This guide is the map. Eight chapters, each linking to the field experiments that produced the numbers I now trust. If you have ninety seconds, skim the headers. If you have an afternoon, follow the links.

## 1. Why LLMO Is Not SEO With a New Coat of Paint

LLMO is not "SEO for ChatGPT." It is a different problem.

SEO assumes a patient librarian (Googlebot) with twenty-five years of practice. LLMO assumes an impatient generalist: an LLM that pulled your page into a retrieval pipeline, skimmed three paragraphs, and is about to decide, in one token of context, whether to quote you, paraphrase you, or skip you.

The retrieval funnel has three doors, and most SEO advice only covers the first one. I broke them down in [AI Finds Your Page Three Ways](/blog/ai-finds-your-page-three-ways/): crawl, index, and inference. The practical takeaway is that you can rank #1 on Google and still be invisible to AI, because AI never asked Google.

When I traced the funnel end-to-end in [LLMO: Three Paths Your Content Takes to Reach an AI](/blog/llmo-roi-23x-conversion/), the conversion ratio between "Google indexed me" and "AI quoted me" was small enough to be a rounding error on most sites I audited. Different funnel. Different metrics. Different work.

## 2. What AI Crawlers Are Actually Reading

The single most expensive mistake I see is building a React site, shipping it client-rendered, and assuming the AI bots will execute the JavaScript.

They will not. I caught five distinct AI crawlers on my server logs over thirty days and watched what they fetched. The result: [AI Crawlers Don't Execute JavaScript — Your Pages Are Invisible](/blog/ai-crawlers-dont-execute-javascript-invisible-pages/). If your content only exists after a `useEffect`, it doesn't exist at all to the bot that decides whether to quote you.

The bots that *do* show up arrive with very different rules of engagement. [Five AI Crawlers Hit My Site in 30 Days](/blog/five-ai-crawlers-hit-my-site-30-days/) maps which crawler honors what, and where the surprises hide.

Then there is the file that decides whether they even bother knocking: `llms.txt`. I wrote [llms.txt: The File That Decides Whether AI Can Find Your Site](/blog/llms-txt-ai-find-your-site/) after my first month of measurement. After auditing thirty live `llms.txt` files in the wild, I followed up with [30 llms.txt Files in the Wild — Five Anti-Patterns Already Forming](/blog/30-llms-txt-files-5-anti-patterns-already-forming/). The patterns are forming fast. Some of them will age badly. A few are quietly correct.

## 3. JSON-LD: The Cheapest Lever You Have

Structured data has been the LLMO move that paid back fastest, by a wide margin.

In [11 JSON-LD Schemas, 3 Cited by AI](/blog/11-json-ld-3-cited-by-ai/) I shipped eleven schemas (Article, Person, Book, FAQPage, BreadcrumbList, and so on) and tracked which ones actually surfaced in citations over the next quarter. Three pulled their weight. Most of the rest were polite noise.

The richer story is that schema doesn't help your *page* get ranked. It helps a specific *passage inside your page* get pulled into an answer. That distinction sounds academic until you measure it, which I did in [Passage Rank Beats Page Rank in AI Citations](/blog/passage-rank-beats-page-rank-ai-citations/). The implication is that one well-marked paragraph can do more for you than the strongest backlink in your archive.

That, too, I measured: [Mentions Beat Backlinks for AI](/blog/mentions-beat-backlinks-ai/). The link economy that powered the last twenty years of SEO does not transfer cleanly to AI. The new currency is *being mentioned in the right places, in the right form*, with enough surrounding context that the LLM can lift you without ambiguity.

## 4. Content Design: Three Rules That Survived the Audit

Most "write for AI" advice is either too vague to act on or too specific to generalize. After thirty months of trial and error, three rules survived.

**Answer first.** When I rewrote my evergreen posts so the answer landed in the first 120 words, citations climbed from a baseline I'd assumed was a ceiling. The case study is [Answer-First Format: 7 of 12 Cited](/blog/answer-first-7-of-12-cited/). Seven out of twelve cited in a single quarter is not a publishing strategy. It is a structural finding.

**Write in chunks, not in pages.** LLMs do not read your post; they read whatever chunk their retriever pulled. I broke this down in [AI Reads Chunks, Not Pages](/blog/ai-reads-chunks-not-pages/). The practical move: each H2 needs to stand on its own without context from the H2 above it. If a reader (or a retriever) starts cold in section 4, they should still get a complete thought.

**Stay fresh.** [AI Search Rewards Freshness](/blog/ai-search-rewards-freshness/), measurably, not vaguely. Citation half-life is shorter than most editors plan for, which leads us to chapter 5.

## 5. Measurement: KPIs for a Discipline Without Standards

You cannot tune what you cannot measure, and AI citation measurement is still in its analog-instrument phase. I'm publishing my methodology as I go because the alternative is a shrug.

[Measuring AI Citations as an LLMO KPI](/blog/measure-ai-citations-llmo-kpi/) walks through what I count, what I deliberately don't count, and where the noise is. The follow-up [Measuring AI Citation Half-Life — a 90-Day Methodology](/blog/measuring-ai-citation-half-life-90-day-methodology/) puts a real number on how long a citation persists, and [AI Citations Have a Half-Life](/blog/ai-citations-half-life-decay/) shows the decay curve I actually observed.

If you are tempted to subscribe to a citation tracker, save your money for a few months: [Seven AI Citation Trackers, Seven Different Numbers](/blog/seven-ai-citation-trackers-seven-different-numbers/). They disagree by an order of magnitude on the same site. Build a small internal log first, then graduate to a tool.

## 6. AI Engines Are Not Interchangeable

Treating "AI search" as a monolith is the single biggest tactical error I made early on. Perplexity, ChatGPT Search, Gemini, Claude with web access, and Brave's LLM-context API behave like distinct platforms. They have their own quirks.

[Perplexity Cited Me on 3 Numbers in 11 Days](/blog/perplexity-cited-3-numbers-11d/) is the cleanest signal I caught from one engine. The shape of what got cited was specific: numbers, with provenance, in close paragraphs. That shape repeated. The pattern is real.

I also watched what happened when I made small surgical changes targeting Perplexity specifically: [Perplexity — 3 Changes, 1 Schema Won](/blog/perplexity-3-changes-1-schema/). One schema change moved the needle. The other two were placebos.

Princeton put out the most useful academic study I've seen in this space: [GEO — Princeton Study, 9 Ways AI Cites You](/blog/geo-princeton-study-9-ways-ai-cites-you/). The nine techniques they measured are a good baseline. But the headline finding from my own replication, [GEO Stats Are Domain-Dependent](/blog/geo-stats-domain-dependent/), is that what works on a SaaS landing page does not transfer to a developer blog or a local business page.

Two more engine-level notes worth flagging. [Brave Is Invisible to AI Agents Pretending to Be Helpful](/blog/brave-invisible-to-ai-agents/) covers a corner case that took me a while to diagnose. And for anyone building for the next billion users of AI search: [AI Mode Hits a Billion Users — Local Business LLMO Is the Next Frontier](/blog/ai-mode-billion-users-local-business-llmo/).

The architectural overview, if you want the whole map on one page, is [Five AI Search Engines, Five Architectures](/blog/five-ai-search-engines-architecture-llmo/).

## 7. Multilingual LLMO: Where Most Sites Quietly Bleed Traffic

Translation is the LLMO frontier where the dollars are largest and the practitioners are fewest.

I translated my blog into four languages over thirty days and measured what happened: [Four Languages, Thirty Days, Portuguese 4× Traffic](/blog/four-languages-thirty-days-portuguese-four-x-traffic/). Portuguese was the surprise. Spanish was the slow burn. Neither would have come from English alone.

But translation has a specific failure mode that nobody warned me about. AIs will cheerfully cite the wrong language version of your page back to a user who asked in their own language. I caught it in the wild and wrote it up in [AI Cites the Wrong Language Version — Multilingual LLMO Has a Specific Bug](/blog/ai-cites-wrong-language-version-multilingual-llmo/). The fix involves `hreflang`, canonical hygiene, and accepting that the bots are not as polyglot as the marketing pretends.

Crossposting has a related, sharper edge: when the same article lives on three platforms, the AI picks the copy. I lost a citation to Dev.to that I thought was mine. The post-mortem is in [Crosspost Canonical: AI Picks the Copy](/blog/crosspost-canonical-ai-picks-the-copy/).

## 8. Case Studies: What 23× and 83% Actually Look Like

The hardest thing about LLMO is showing the work. Most case studies are vibes. I've tried to publish two with real numbers.

[LLMO ROI: 23× Conversion](/blog/llmo-roi-23x-conversion/) is the conversion-side story: what happened downstream when the citations started flowing. The number is large enough to be embarrassing if it were wrong; it is also large enough to be worth replicating before you believe me.

[TRM Hit 83.37% — The LLMO Pillars Indie Test](/blog/trm-8337-percent-llmo-pillars-indie-test/) is the citation-side story: the percentage of test queries that returned the right page from the right LLM, after a specific stack of changes. Both posts are written so you could run the same audit on your own site in an afternoon.

## What to Read Next

Most readers fall into one of three modes, so here is the cheap routing:

- **You haven't shipped a single LLMO change yet.** Start with chapter 2 → chapter 3 → chapter 4 in that order. That is the implementation order I'd repeat if I were starting over.
- **You've shipped things, but nothing is moving.** Skip to chapter 5. The measurement problem is almost always the bottleneck, not the changes themselves.
- **You're ready to scale across markets.** Chapter 7 is the highest-leverage section in this guide. The English-language ceiling is lower than you think; the non-English floor is higher than most sites believe.

If you want the long-form version of any of this, with the failures, the dead ends, and the diff-level changes I made on real production sites, I wrote two books:

- **[LLMO Practice Guide](/books/llmo-ai-search-optimization/)**: the full-length treatment, six months of audits compressed into a 200-page playbook.
- **[LLMO Quickstart](/books/llmo-quickstart/)**: the 90-minute version, designed to give one team one weekend of work that ships measurable changes by Monday.

This pillar will update as I publish more field experiments. The articles below it will not. If something here looks out of date, check the linked posts. They have the timestamps. The map gets revised; the territory keeps changing.
