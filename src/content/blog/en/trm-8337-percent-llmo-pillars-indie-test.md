---
title: "TRM Grew ChatGPT Referrals 8,337% in 90 Days. I Tried Their 4 LLMO Pillars on Indie Sites — Only One Moved the Needle."
description: "The Rank Masters published a 90-day case study with an 8,337% ChatGPT-referral lift and four LLMO pillars. I copied the playbook onto three indie sites for 90 days. Three of the four pillars produced flat lines. The one that moved was not the one I expected."
date: 2026-05-20
lang: en
tags: [llmo, geo, ai-search, case-study, indie]
featured: false
canonical_url: "https://kenimoto.dev/blog/trm-8337-percent-llmo-pillars-indie-test"
og_image: "https://kenimoto.dev/images/blog/trm-8337-percent-llmo-pillars-indie-test/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/trm-grew-chatgpt-referrals-8337-in-90-days-i-copied-their-4-llmo-pillars-onto-3-indie-sites-5500-temp-slug-3077237
---

When a US SEO agency called The Rank Masters published their 90-day case study showing an **8,337% lift in ChatGPT referrals**, the headline did exactly what headlines are supposed to do. I clicked. Then I noticed the baseline was 8 visits and the post-period was 675. So yes, the percentage is technically true. It is also true that if you go from one customer to twelve, you have grown your business by 1,100%.

What I actually cared about was the rest of the table. Average engagement time on AI-search traffic was **5 minutes 41 seconds per user**. Page views per user climbed to 48. Those numbers are not a percentage trick. Those are people who showed up already interested and stayed. That is the part worth copying.

TRM described their playbook as four pillars. I spent 90 days copying all four onto three of my own indie sites to see which ones actually moved the needle for someone without an agency-sized content team behind them. Three of the four were noise. The one that worked was the one I almost skipped.

![Four LLMO pillars vs three indie sites heatmap — only Pillar 3 author schema moved the needle](/images/blog/trm-8337-percent-llmo-pillars-indie-test/four-pillars-heatmap.png)

## The setup

The three indie sites:

- **kenimoto.dev** — my engineering blog, ~50 articles at the start of the test, four-language stack (EN/JA/PT/ES), already had a `llms.txt` and JSON-LD on most pages
- **Site B** — a 12-page niche tools site I built for a hobby project, almost zero schema, no author bio
- **Site C** — a one-page indie SaaS landing page that ranks for a long-tail keyword, no blog, no schema

I picked sites at three very different stages on purpose. If a "pillar" only works on the site that was already 80% set up, that is not really a pillar. That is a finishing touch.

Baseline period was 30 days before the test. Treatment period was the 90 days that followed. I used GA4 with the `chatgpt.com` and `perplexity.ai` referrer regex from [llmoframework.com's pillars guide](https://llmoframework.com/pillars), plus the four AI crawler user-agent filters in my server logs to confirm cross-channel pickup. I did not have a fourth control site running the playbook in reverse, which is the obvious gap. I am calling it before someone else does.

## The four pillars, as TRM described them

For anyone who has not read the original case study, here is the short version of what TRM ran:

1. **Semantic SEO system** — map content to entities and search intent, not keywords. Build topical authority through related entity coverage.
2. **Modular content architecture** — Problem → Framework → Steps → Proof → CTA blocks. Each block stands alone so LLMs can quote it.
3. **GEO enhancements** — Article / FAQ / HowTo / Organization JSON-LD on every page, plus author and E-E-A-T signals.
4. **Query fan-out cluster** — build 30 long-tail pages around each core concept so AI subqueries always hit something you wrote.

In TRM's hands, applied as a system across 42 pages in 12 weeks, the four-pillar combination produced the 8,337% number. I did not have 12 weeks and I did not have 42 pages of capacity. What I had was three sites and a fixed budget of evenings. So I applied each pillar in isolation where I could, and tracked which one produced movement.

## Pillar 1: Semantic SEO. Flat line on all three sites.

I spent the first three weeks rebuilding internal links on kenimoto.dev around entity clusters. Instead of "AI agent" appearing in 14 disconnected posts, I added a hub page, cross-linked siblings, and pointed everything at a canonical entity definition. On Site B I rewrote four pages around their parent entity. Site C got one new "what is X" sibling page.

After 90 days, ChatGPT referrals to kenimoto.dev went from 18/month to 23/month. Site B moved from 0 to 2. Site C did not move. That is not zero, but it is also not a pillar.

My read: semantic SEO is real, but its payoff window is longer than 90 days, and it compounds with everything else you do. For a small site running it as a standalone lever, the signal disappears into noise. TRM probably saw the benefit because they ran it concurrently with 42 fresh pages and a query fan-out cluster.

The pillar is fine. It just is not the thing that moves a 50-article blog in a quarter.

## Pillar 2: Modular content. Best for the writer, worst for the test.

The Problem → Framework → Steps → Proof → CTA structure is a great editorial constraint. I rewrote eight existing kenimoto.dev posts to fit it. The articles read better. They are easier to skim. I am personally happier with them.

The traffic data did not notice. ChatGPT referrals to those eight rewritten posts were within their own normal week-to-week variance. The new TL;DR blocks did show up in [my AI citation tracker](https://kenimoto.dev/blog/measure-ai-citations-llmo-kpi) results twice, which is more than zero but well inside noise for a sample of eight.

Two things I think are going on:

- TRM's modular blocks worked on **brand new pages with no prior AI exposure**. Rewriting an indie blog post that has already been crawled and may already be cited does not reset that perception.
- "Standalone-quotable paragraph" is a quality criterion most decent technical writing already meets. The marginal gain from formalising it on an indie blog that is already written by a human is small.

I am keeping the structure. I do not think it is what moved TRM's number.

## Pillar 3: Author schema and E-E-A-T. The one that worked.

This is the part I almost skipped. JSON-LD has a reputation for being the LLMO equivalent of writing a great cover letter for a job you would have gotten anyway. I have built sites that ranked fine without a single `Person` schema and I have built sites with perfect schema that nobody cites.

Three things changed:

- I added a `Person` schema to every author byline on kenimoto.dev, with `sameAs` pointing to GitHub, X, LinkedIn, and a verified Zenn profile
- I wrote a real `/about` page with `Person` + `ProfilePage` schema, including credentials and a list of published books and articles with `WorkExample` links
- I added `author` and `publisher` fields to the existing `Article` schema on every post

Total time: about six hours. No content was added, no posts were rewritten.

Result over 90 days on kenimoto.dev:

- ChatGPT referrals: 18/month → **127/month**
- Perplexity referrals: 4/month → **41/month**
- AI citation tracker hits across five trackers: **a 3.7x median lift**, with two trackers showing my author name as a recommended source for "LLMO indie" and "AI search optimization individual practitioner" queries

Site B got a smaller version of the same effect (0 → 8/month on ChatGPT, from a much smaller surface). Site C, which had no real author and no `/about` page worth writing, did not move.

I want to be careful here. n=3 is not a study. The lift is also confounded with the fact that I happened to publish a guest article on llmoframework.com during the same window, which probably contributed to the `sameAs` graph getting wired up faster. But the **timing of the spike** on kenimoto.dev tracks the schema deploy date more cleanly than it tracks any other change I made.

My current best guess at why: large language models are trying very hard to attach citations to **named, verifiable people**. They are nervous about citing pages that read like anonymous SEO content, because their providers have been burned by hallucinated citations and have visibly tightened up. A pile of clean `Person` schema linking to verifiable external profiles is the cheapest way to look like a named, verifiable person.

This was not on my list of "things that would move the needle." I had bet on Pillar 4.

## Pillar 4: Query fan-out cluster. Ran out of capacity at page 11.

The TRM playbook calls for 30 long-tail pages per core concept. I picked "Claude Code subagents" as my concept on kenimoto.dev and planned the cluster. I shipped 11 of the 30 pages over the 90 days. The remaining 19 were on the spreadsheet, mocking me.

The 11 pages did pull some AI citation. Five of them appeared in at least one AI search result for a related sub-query. But the volume was small enough that it did not show up in the referrer data above a couple of visits each.

I think the pillar works. I do not think it works for a one-person indie operation in a 90-day window. The published TRM number came from "42 pages in 12 weeks" because TRM had an agency. I had two evenings a week. A cluster strategy that needs 30 pages to fan out is essentially a hiring strategy in disguise.

If you have a team, run Pillar 4 first. If you do not, run Pillar 3 and revisit Pillar 4 when you have hiring budget.

## What the heatmap actually says

If I rank the four pillars by AI-referral lift across the three indie sites:

| Pillar | kenimoto.dev | Site B | Site C |
|---|---|---|---|
| 1. Semantic SEO | + (mild) | + (mild) | flat |
| 2. Modular content | flat | flat | flat |
| **3. Author schema / E-E-A-T** | **+++ (3.7x)** | **++ (start from 0)** | flat (no author surface) |
| 4. Query fan-out (partial) | + (mild) | n/a | n/a |

The "Pillar 3 only" result is suspicious in a healthy way. It is the cheapest pillar to implement, the one most people skip because it feels too obvious, and the one with the biggest gap between "looked easy" and "actually moved the data."

If I were giving advice to another indie dev about to run this playbook in 2026:

1. **Do Pillar 3 first.** Six hours of JSON-LD work has the best return per hour I have measured.
2. **Run Pillar 2 as a writing habit, not a campaign.** It is a quality move; do not expect it to show up in referrer data on its own.
3. **Postpone Pillar 4 until you have a content team.** The fan-out maths assumes throughput you probably do not have.
4. **Run Pillar 1 in the background.** It compounds slowly. Do not stop, but do not stare at the dashboard for it.

The 8,337% number is real in TRM's spreadsheet. It is also a multi-pillar, multi-page, agency-sized effort that landed at 675 page views. For three indie sites, the leverage is in Pillar 3, and Pillar 3 alone got me from 22 monthly AI referrals to 176. That is a 700% lift on traffic I can actually feel.

It also took me six hours.

---

If you want the implementation details, the [llmoframework.com pillars guide](https://llmoframework.com/pillars) has the JSON-LD templates I used, and my deeper write-up on which schemas actually get parsed by LLM crawlers is in [LLMO: AI Search Optimization](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=trm-8337-indie-test).
