---
title: "The 5 AI Crawlers That Hit My Sites Most in 30 Days — What Their Logs Told Me About LLMO"
description: "I thought robots.txt was the boundary. Then I started reading my server logs. Thirty days, three sites, 14,300 AI crawler hits. Here's what the User-Agent column actually told me about LLMO visibility."
date: 2026-05-17
lang: en
tags: [llmo, ai-search, server-logs, crawlers, cloudflare]
featured: false
canonical_url: "https://kenimoto.dev/blog/five-ai-crawlers-hit-my-site-30-days/"
og_image: "https://kenimoto.dev/images/blog/five-ai-crawlers-hit-my-site-30-days/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/5-ai-crawlers-hit-my-sites-14300-times-in-30-days-heres-what-their-user-agents-told-me-about-2kfc
---

I thought `robots.txt` was the boundary. Three lines of `Disallow:` and I'd told the AI bots where they could and couldn't go. Done. I went back to writing posts about LLMO measurement, citation rates, and AI referral traffic in GA4.

Then I opened the access logs for three of my sites and the picture I had in my head collapsed.

This is what I learned reading thirty days of raw server logs from `kenimoto.dev`, `kaoriq.com`, and `llmoframework.com`. Five User-Agent strings dominated everything. The traffic patterns each one created told me more about my LLMO standing than any GA4 dashboard had.

![The 5 AI crawlers hit ranking: GPTBot 4,212 / ClaudeBot 3,108 / PerplexityBot 2,790 / OAI-SearchBot 2,043 / Google-Extended 1,387 hits over 30 days](/images/blog/five-ai-crawlers-hit-my-site-30-days/crawler-ranking.png)

## Why I started reading logs in the first place

Most LLMO measurement advice tells you to track the *outbound* side: did ChatGPT cite me, did Perplexity link to me, did Google AI Overviews show me. That's the citation side.

The other side, where AI services actually pull HTML from my server, is invisible in GA4. AI crawlers don't fire JavaScript. They don't trigger gtag. They show up in raw HTTP access logs and nowhere else.

I'd been writing LLMO posts for months and had never once looked at the side of the funnel I could actually control. So I exported 30 days of logs from Cloudflare (`kenimoto.dev`, `kaoriq.com`) and Vercel (`llmoframework.com`), grepped for known AI User-Agents, and started counting.

The total: **14,300 AI crawler hits across three sites in 30 days.** Roughly 477 hits per day per site. More than I expected. Less than I think it should be in another six months.

## The 5 crawlers that hit me most

Here's the ranked list. Hits are deduplicated by `(timestamp, path, IP)` so cache retries don't inflate the count.

| Rank | User-Agent | 30-day hits | Operator | Purpose |
|------|------------|-------------|----------|---------|
| 1 | `GPTBot` | 4,212 | OpenAI | Training data |
| 2 | `ClaudeBot` | 3,108 | Anthropic | Training + retrieval |
| 3 | `PerplexityBot` | 2,790 | Perplexity | Answer index |
| 4 | `OAI-SearchBot` | 2,043 | OpenAI | ChatGPT search citations |
| 5 | `Google-Extended` | 1,387 | Google | Gemini training |

Five User-Agents. 13,540 hits. That's 94.7% of all AI traffic. The remaining 5.3% was a long tail: `Bytespider`, `Applebot-Extended`, `Meta-ExternalAgent`, `Amazonbot`, `cohere-ai`, a smattering of `Claude-User`, and two hits from something that called itself `anthropic-ai` (the old UA Anthropic supposedly retired).

Before you read too much into the order: this is *my* data, three small sites, mostly English/Japanese tech content. Your ranking will look different. The shape of it (a handful of bots accounting for most hits, OpenAI and Anthropic at the top) is probably the same.

## What each one is actually doing

The reason rank order matters less than the *purpose* of each bot is that the three buckets behave completely differently in LLMO terms.

**Training crawlers** read your content to potentially update model weights. They show up consistently, follow `robots.txt` (usually), and don't care about your content being "fresh." `GPTBot`, `Google-Extended`, `Bytespider`, `Applebot-Extended`, and `anthropic-ai` (legacy) fall here.

**Retrieval crawlers** index your content so it can be cited in real-time answers. They re-fetch popular pages, follow `Last-Modified`, and have a measurable crawl-to-refer ratio. `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot` (newer, independently controllable from `ClaudeBot`), and `GoogleOther` belong here.

**User-initiated fetches** happen when a human pastes your URL into ChatGPT or asks Claude to read it. These are `ChatGPT-User`, `Perplexity-User`, and `Claude-User`. They don't follow `robots.txt` (per [OpenAI's revised crawler docs](https://developers.openai.com/api/docs/bots), because they're user actions, not crawls).

I had been treating all of these as the same animal. They are not. If your goal is "get cited in ChatGPT Search," `OAI-SearchBot` hits matter and `GPTBot` hits are basically noise. If your goal is "be in the training set of the next Claude," it's exactly inverted.

![Three categories of AI crawler: training (slow, robots.txt-respecting) vs retrieval (frequent, freshness-driven) vs user-initiated (sporadic, ignores robots.txt)](/images/blog/five-ai-crawlers-hit-my-site-30-days/three-categories.png)

## Who actually obeys robots.txt

Here's the part that flipped my view of `robots.txt`.

On `kenimoto.dev`, I had a `Disallow: /api/` rule. Over 30 days:

- `GPTBot`: 0 hits to `/api/`. Compliant.
- `Google-Extended`: 0 hits to `/api/`. Compliant.
- `ClaudeBot`: 0 hits to `/api/`. Compliant.
- `OAI-SearchBot`: 3 hits to `/api/`. Borderline. Possibly cached before the rule, possibly the [revised compliance language](https://ppc.land/openai-revises-chatgpt-crawler-documentation-with-significant-policy-changes/) is doing something subtle.
- `PerplexityBot`: 41 hits to `/api/` in one 90-second burst. Not compliant on this run.

Forty-one hits is not a sample of one. The 90-second burst pattern matched a [public report](https://www.appearonai.com/insights/ai-crawler-configuration-robots-txt-guide) where Perplexity was observed ignoring `User-agent: PerplexityBot` blocks when answering an active user query. The behavior makes more sense if you think of `PerplexityBot` as straddling the retrieval/user-initiated line: it acts like a retrieval crawler on the calm days, and a user-initiated fetch when somebody is waiting on an answer.

The takeaway I wrote down: **`robots.txt` is a self-reported boundary**. Three of five top crawlers honored it cleanly on my data. One was iffy. One did whatever it wanted when a human was on the other end. Plan accordingly.

## Three LLMO signals you can derive from this

The reason I'm writing this down is that crawler hit data is a measurable LLMO signal, and I haven't seen it discussed much next to the usual citation-rate metrics. Three things I now look at every week:

**1. Crawler diversity.** If only `GPTBot` hits your site and nothing else, your retrieval surface is OpenAI-only. You're invisible to Claude, Perplexity, and Gemini's retrieval paths even if you're cited in ChatGPT. A healthy crawler-diversity score is at least three of the five top User-Agents hitting you regularly.

**2. Retrieval-to-training ratio.** If you sum retrieval-side hits (`OAI-SearchBot` + `PerplexityBot` + `Claude-SearchBot` + `GoogleOther`) and divide by training-side hits (`GPTBot` + `Google-Extended` + `anthropic-ai`), you get a number that tells you whether the AI ecosystem thinks of you as "content to be learned from" or "content to be cited right now." Mine sits at 0.81. Anything below 0.5 means your content isn't fresh enough to be retrieved in real time. Anything above 1.5 means you're being actively used in answers (good) but probably plateauing as training material (worth noticing).

**3. `llms.txt` fetch rate.** Of the five top crawlers, only `PerplexityBot` and `ClaudeBot` fetched `/llms.txt` on my sites during the 30-day window. `GPTBot`, `OAI-SearchBot`, and `Google-Extended` never did. This roughly matches what other operators have observed and is a load-bearing detail when you're deciding whether `llms.txt` is worth maintaining. (Short answer: yes, but mostly for the two crawlers that read it.) The `llmoframework.com` write-up I keep returning to for [retrieval signals](https://llmoframework.com/retrieval-signals/) goes deeper on this.

## How to actually pull this data

This is the part I always wanted to read and never quite found, so:

**Cloudflare (free plan).** The AI Crawl Control dashboard (formerly AI Audit, [docs here](https://developers.cloudflare.com/ai-crawl-control/)) shows top AI crawler User-Agents out of the box. For raw logs, you need Logpush, which is paid. On free, the easiest substitute is enabling "AI Audit" + filtering Analytics by known AI User-Agents. Free won't give you per-request paths but it gives you counts and trends.

**Vercel.** Project → Logs → filter by `User-Agent contains "Bot"`. Vercel keeps 30 days of edge logs on the Pro plan. On Hobby, you get less, and you'll want to forward to a log drain if you're serious.

**Netlify / self-hosted Nginx.** Just `grep` the access log:

```bash
grep -E "GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|Google-Extended" \
  /var/log/nginx/access.log \
  | awk '{print $14}' \
  | sort | uniq -c | sort -rn
```

This gives you crawler counts. Add `awk '{print $7}'` instead of `$14` to get the URL ranking. The exact field number depends on your log format; check with `awk '{print NF}'` on one line to count.

## What I changed after looking at all this

Three concrete changes after the 30-day window:

1. I split my `robots.txt` to allow `OAI-SearchBot` and `Claude-SearchBot` (retrieval, good for citations) while keeping `Disallow: /api/` strict for `GPTBot` (training, no upside for me on those endpoints).
2. I added a `Last-Modified` header to every blog post route, because retrieval crawlers use it to decide re-fetch frequency and Vercel wasn't sending one by default.
3. I started tracking the retrieval-to-training ratio weekly in a spreadsheet. Two weeks in, the only useful insight is that the number is stable. That just means my crawler diet isn't lurching around week to week, but it's a baseline I didn't have before.

I expected the logs to confirm what I already believed about LLMO. They mostly didn't. Citation isn't the only signal worth watching. Who's pulling your pages is a separate question, and the answer is written in plain text in a log file you probably already have.

If you want the full measurement frame (citation tracking, GA4 referrals, and server-log crawler analysis as parts of one system) I wrote a book on exactly this: [LLMO: AI Search Optimization](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=five-ai-crawlers-30-days). Chapter 10 is the measurement chapter; this post is basically the missing seventh KPI it didn't have room for.

---

**Related on kenimoto.dev**: [Is AI Actually Citing Your Site?](https://kenimoto.dev/blog/measure-ai-citations-llmo-kpi/) (the citation side of the same measurement problem) · [llms.txt: The File That Decides Whether AI Can Find Your Site](https://kenimoto.dev/blog/llms-txt-ai-find-your-site/)
