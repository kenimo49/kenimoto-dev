---
title: "My Best Page Went Stale in a Month: Why AI Search Rewards Freshness, Not Just Schema"
description: "I shipped clean JSON-LD and a tidy llms.txt, then watched my top-cited page lose more than half its AI citations in about a month. Freshness is a ranking input, not a one-time setup. Here is what actually moved the needle, and why changing the date alone made it worse."
date: 2026-06-07
lang: en
tags: [llmo, ai-search, geo, content-freshness, citation]
featured: false
canonical_url: "https://kenimoto.dev/blog/ai-search-rewards-freshness/"
og_image: "https://kenimoto.dev/images/blog/ai-search-rewards-freshness/og.png"
cross_posted_to: []
---

I did everything the LLMO checklists told me to. JSON-LD on every page, a hand-curated llms.txt, question-shaped headings, self-contained passages an AI could lift without context. The page that came out of that work got cited by ChatGPT, Perplexity, and Gemini within two weeks. I screenshotted it. I felt like I had solved a thing.

About a month later, the same page was barely cited at all. I had not deleted it. I had not changed the URL. Google still sent it the same trickle of search traffic it always had. But the AI engines had quietly moved on to fresher sources, and my carefully structured page was now the equivalent of a restaurant nobody walks into anymore.

That is the lesson I want to save you a month on: **schema gets you in the door, but freshness decides whether you stay in the room.**

![A structured page cited at week two, then losing more than half its AI citations by week six while Google traffic stays flat](/images/blog/ai-search-rewards-freshness/og.png)

## Schema is the table. Freshness is whether the food is still warm

Here is the mental model I wish I had started with. Structured data, llms.txt, clean headings: those build the table and set the silverware. They make your content legible to a machine that parses pages into fragments. But a set table does not make anyone eat. The AI engine still chooses *which* dish to serve, and when two dishes answer the same question, it reaches for the one that came out of the kitchen most recently.

This is not a vibe. The retrieval step in front of every AI answer treats recency as a filter. Across ChatGPT, Perplexity, and Google AI Overviews, content updated in the last 30 to 90 days gets cited at meaningfully higher rates than older pages, and roughly half of all AI-cited content is [less than 13 weeks old](https://authoritytech.io/blog/content-freshness-seo-ai-2026). Pages under 30 days old earn an estimated 3.2x more citations than older ones. Perplexity is the strictest: one analysis found it cited content from the [last 30 days at an 82% rate](https://www.demandlocal.com/blog/content-freshness-ai-rankings/), and a six-month-old post loses to a fresh one on the same topic almost every time.

ChatGPT mixes recency with authority: 76% of its top-cited pages are under 30 days old when freshness is relevant, but it still pulls from 2022 or earlier when authority outweighs recency. Google AI Overviews has the weakest freshness bias of the three, which tracks with the fact that it leans on traditional ranking signals. So the leverage is uneven, but the direction is the same everywhere: **old loses to new when the answer is otherwise a tie.**

## The part that actually stung: the date trick backfired

My first instinct was the lazy one. If freshness is a signal, I will just bump the `dateModified` field, redeploy, and reclaim my citations without rewriting anything. I genuinely believed this would work for about an afternoon.

It did not. Worse, it seemed to do active harm. The engines can tell when the body text has not changed. If the timestamp says "updated yesterday" but the actual words are identical to last quarter, the page reads as stale *and* dishonest. You get the worst of both: no freshness credit, and a small ding to the trust that made you citable in the first place. Changing the date without changing the content is the SEO equivalent of putting a new "best before" sticker on the same old milk. The carton knows.

What actually moved the needle was boring and real: I rewrote 10 to 15 percent of the page. New 2026 numbers replacing the 2025 ones. A fresh example I had actually run. A paragraph cut because the tool it described no longer existed. Adobe's LLM Optimizer recommends exactly this cadence, [refreshing 10 to 15 percent of page content on a schedule](https://www.quattr.com/blog/content-freshness), and SurferSEO's data backs the threshold: below it, the engines detect no real change and keep treating the page as old.

## A refresh cadence I can actually keep

The trap in all of this is turning your blog into a treadmill where you re-edit everything forever. That is not sustainable, and most of your pages do not need it. So I stopped treating freshness as a sitewide chore and started treating it as a triage problem. Different pages run on different clocks:

- **Commercial and high-traffic pages**: every 60 to 90 days. These are the ones competing in crowded answer spaces where a tie goes to the freshest source.
- **Evergreen guides and pillar content**: roughly every 6 months. Substantial, not cosmetic.
- **Reference and definition pages**: once a year is fine. "What is a webhook" does not change, and the engines know it.

This tiering comes straight out of the freshness research, and it is the single thing that made the workload survivable. I keep a tiny spreadsheet: page, tier, last *real* update. When a page is overdue, it goes on the list. When I refresh it, I am refreshing content, not the clock.

If you want the larger operating model this fits into, I lean on the continuous-operation framing in the [LLMO Framework](https://llmoframework.com), which treats refresh cadence as a maintenance phase rather than a launch-day task. The setup work (structured data, llms.txt) is phase one and you do it once. The freshness loop is the phase nobody warns you about, and it never ends.

## What I would tell my one-month-ago self

Three things, in order of how much regret they saved me.

First, **freshness is an input, not a vanity metric.** It sits upstream in the retrieval filter, deciding what even gets considered. All the snippability in the world does not help a page that never makes the shortlist because three newer sources answered the same question.

Second, **never touch the date without touching the words.** It does not fault gracefully. The downside is real and the upside is zero.

Third, **the thing AI cannot fake is the thing worth refreshing.** When I update a page, the highest-value addition is almost always a result I personally measured: a number from my own logs, an experiment that broke in an interesting way. Generic prose ages into noise. First-hand experience is the part an engine keeps coming back for, because it cannot generate it from anywhere else.

I still ship the schema. I still maintain the llms.txt. But I stopped thinking of LLMO as a thing you finish. It is a thing you keep warm. My once-stale page is back in rotation now, not because I out-clevered the algorithm, but because I fed it something it had not seen before.

If you want the full playbook for getting cited in the first place, from llms.txt and JSON-LD to citation-rate KPIs, I wrote a field guide for exactly that: [Why ChatGPT Ignores Your Website](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=ai-search-rewards-freshness).
