---
title: "Your New Domain's First Week of GA4 Is a Lie: 4 Days of Raw Data from kaoriq.com's Launch"
description: "Four days after registering a new domain, GA4 showed 65 PV / 34 users across 9 countries. Before celebrating, I beat the data with 5 signals. What survived: a handful of humans, and a tireless army of crawlers."
date: 2026-05-05
lang: en
og_image: "https://kenimoto.dev/images/blog/new-domain-first-week-ga4-is-a-lie/og.png"
tags: [ga4, analytics, llmo, build-in-public, bot-traffic]
featured: false
canonical_url: "https://kenimoto.dev/blog/new-domain-first-week-ga4-is-a-lie/"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/your-new-domains-first-week-of-ga4-is-a-lie-4-days-of-raw-data-from-a-launch-c5
---

Four days after registering a new domain, I opened GA4 and saw **65 page views / 34 users / 9 countries**.

For a brief, build-in-public moment, I almost cheered. Then I looked at the breakdown. The US had 17 sessions averaging **4.9 seconds** of session duration. France, Poland, South Korea, India, Singapore: each between **0 and 1.4 seconds**. Japan alone sat at **751 seconds (over 12 minutes)** -- an outlier so loud it should be illegal.

The domain is [kaoriq.com](https://kaoriq.com), registered on 2026-05-02 -- a personality-quiz × fragrance e-commerce site I'm building. As of today (May 5), it has fewer than 20 articles. Doing the back-of-envelope math, that page-view distribution is physically impossible to come from real humans.

This post walks through how I read the first week of GA4 data on a new domain as **"me + a crawler army"** -- with the actual numbers exposed. For anyone running GA4 on a new project, or anyone who registered a domain this weekend.

## The Raw Data: Past 14 Days (4 Days of Real Activity)

Numbers first, no spin.

**Overall**

| Metric | Value |
|---|---:|
| Sessions | 37 |
| Page Views | 65 |
| Total Users | 34 |
| New Users | 34 |
| Avg Session Duration | 104.1 s |
| Bounce Rate | **80%** |

**By Country**

| Country | Sessions | PV | Avg Duration (s) |
|---|---:|---:|---:|
| 🇯🇵 Japan | 5 | 33 | **751.0** |
| 🇺🇸 United States | 17 | 17 | 4.9 |
| 🇨🇦 Canada | 4 | 4 | 1.3 |
| 🇫🇷 France | 4 | 4 | 1.4 |
| 🇵🇱 Poland | 2 | 2 | 0.0 |
| 🇰🇷 South Korea | 2 | 2 | 0.0 |
| (not set) | 1 | 1 | 0.1 |
| 🇮🇳 India | 1 | 1 | 0.0 |
| 🇸🇬 Singapore | 1 | 1 | 0.0 |

**Daily**

| Date | Sessions | PV | Users |
|---|---:|---:|---:|
| 2026-05-02 (registration day) | 17 | 40 | 14 |
| 2026-05-03 | 6 | 11 | 6 |
| 2026-05-04 | 12 | 12 | 12 |
| 2026-05-05 | 2 | 2 | 2 |

At a glance, "not bad for week one" is a tempting read. But this dataset contains a **751-second Japanese reader** living next door to **9 countries averaging zero seconds**. The middle is missing. That gap is the whole tell.

## Five Signals, Beaten in Parallel

I never call bot traffic on a single signal. To avoid false positives, I always cross-check five axes at once.

| Signal | Bot pattern | Human pattern | kaoriq actual | Verdict |
|---|---|---|---|---|
| Session duration | 0–5 s | 30 s – several min | US 4.9s, FR 1.4s, KR 0s | 🤖 |
| Bounce rate | 90–100% | 40–70% | 80% | 🤖 |
| PV / Session | 1.0 (one page, gone) | 1.5–3.0 | US: 17/17 = 1.0 | 🤖 |
| Geographic anomaly | Random countries unrelated to content | Concentrated in target geo | EN/JA only, yet PL/IN/SG | 🤖 |
| Time-series spike | Massive day-one for new domains | Gradual ramp | 40 PV on day of registration | 🤖 |

### Why a Single Signal Lies

"80% bounce — must all be bots, right?" Not so fast.

- **Duration alone**: A reader who tabs your post and walks away for lunch racks up 30+ minutes. Indistinguishable from "deeply engaged" or "abandoned tab."
- **Bounce rate alone**: A landing page that perfectly answers the question gets a 100% bounce from satisfied humans. Excellence and bots both score the same.
- **Geography alone**: A viral overseas tweet legitimately produces multi-country traffic. Weak on its own.

You only get to call "bot" with confidence when **all five signals lean the same direction simultaneously**.

## The Bimodal Distribution Was the Smoking Gun

The real reason this verdict held in kaoriq's case is the **shape of the duration distribution**.

- Japan: 5 sessions / **751 s** average
- Everywhere else: **0–5 s**

If the traffic were genuinely human, session duration should spread **more evenly across the 20–120 second band**: "bounced after the title (10s)," "read the lede (40s)," "made it to the end (180s)" forming a gradient.

But kaoriq's distribution is **bimodal** with the middle scooped out. The honest reading: only "me (long sessions, testing the site)" and "crawlers (instant exits)" exist. Nothing in between.

Conversely, a healthy distribution would look like "Japan 100 sessions / 60s, US 50 sessions / 45s, Canada 20 sessions / 30s": durations spread normally. That'd be a real human traffic signature.

## So How Many Real Humans Were There?

After all that beating, my estimate breaks down as:

| Category | Estimated sessions | Notes |
|---|---:|---|
| Me, testing the site | 4–5 | Most of Japan's 5 sessions, source of the 751s average |
| Crawlers (Googlebot / Bingbot / GPTBot / ClaudeBot / AhrefsBot, etc.) | 27–30 | US 17, plus the zero-second Europe & Asia rows |
| Actual organic human traffic | 2–5 | The remainder of Japan + a couple of US sessions |

Of 37 sessions, **at most 5 were real humans**. That's the reality of week one for a new domain.

## Why GA4 Doesn't Filter This For You

GA4 has a **"known bots and spiders" auto-exclusion** based on the [IAB/ABC Spiders & Bots list](https://www.iab.com/guidelines/iab-abc-international-spiders-bots-list/). It catches classical crawlers but misses:

- **JavaScript-executing crawlers**: GPTBot, ClaudeBot, PerplexityBot. These new generative-AI crawlers run JS, so the GA4 tag fires.
- **SEO-tool crawlers**: AhrefsBot, SemrushBot, MozBot. High frequency, and they swarm new domains the moment they're discovered.
- **Headless-browser scrapers**: Custom Puppeteer or Playwright bots are indistinguishable from a real Chrome session.

**The week after a new domain registration is when this crawler army discovers the new IP.** It calms down within 7–10 days as DNS propagates. But if you take week-one GA4 at face value, you'll make bad decisions.

## Three Annotations Every New-Project Dashboard Needs

1. **Use "Engaged Sessions" as your primary metric.** GA4 defines an engaged session as: ≥10s duration OR ≥2 PV OR a conversion event. Most of the bot army gets filtered here.
2. **Always view session duration *split by country*.** Looking at any single metric (sessions, PV) without the geo filter lets the crawler army masquerade as success.
3. **Treat the first 30 days as a "noise phase."** Real numbers only appear after social funnels, SEO, and content depth all line up.

## Closing: Look at Your Own GA4 With This Lens

A new domain's GA4 lies for the first 1–2 weeks. If your country breakdown is full of zero-second sessions from the US, Eastern Europe, and Southeast Asia: that's the crawler parade, not humans falling in love with your content.

The procedure is simple: **beat with five signals → suspect bimodal distributions → swap the primary metric to Engaged Sessions**. Doing this saves you from being whipsawed by early data.

Doubting GA4 is, in the end, a discipline for not making expensive mistakes. Beat the data before the data beats you.

---

**This post is based on real data**

- Site: [kaoriq.com](https://kaoriq.com) (domain registered 2026-05-02, built with Astro v6 + Tailwind v4)
- Period analyzed: 2026-04-22 → 2026-05-05 (4 days of actual activity)
- Data source: GA4 Data API v1beta via Service Account
- Tooling: my own `harness-ops/tools/ga4/analyze.py` (open-sourcing soon)
