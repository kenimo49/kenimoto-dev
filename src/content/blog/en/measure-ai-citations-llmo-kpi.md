---
title: "Is AI Actually Citing Your Site? How to Measure What Google Rankings Can't"
description: "Nothing tracks whether AI is citing your site. Here's how to measure LLMO visibility with GA4, Python scripts, and a 30-minute monthly protocol."
date: 2026-05-02
lang: en
tags: [llmo, ai-search, seo, measurement, analytics]
featured: false
canonical_url: "https://kenimoto.dev/blog/measure-ai-citations-llmo-kpi"
cross_posted_to: []
---

I've spent the past few weeks writing about LLMO — how to get cited by AI search engines, which content structures work, what Princeton's GEO study says about visibility. All useful stuff. One problem: I had no idea whether any of it was actually working.

I was like a chef who obsesses over recipes but never tastes the food. My Google Search Console was immaculate. My LLMO measurement setup? I was literally typing "does ChatGPT know about my site" into ChatGPT and refreshing the page like a teenager checking if their crush liked their post.

Measuring LLMO is a genuinely hard problem, and most people aren't doing it at all. Here's what I've built: three measurement layers, from "costs nothing" to "costs you a Saturday afternoon of Python."

![SEO KPIs vs LLMO KPIs — ranking position disappears, citation becomes the metric](/images/blog/measure-ai-citations-llmo-kpi/seo-vs-llmo-kpis.png)

## The Measurement Gap

In SEO, measurement is a solved problem. Google Search Console shows rankings, impressions, clicks, and CTR for free, updated daily. Ahrefs adds backlink data. SEMrush gives you keyword tracking. Everything is visible.

In LLMO, almost nothing is visible out of the box.

There's no "AI Search Console." ChatGPT doesn't send a weekly email saying "You were cited 47 times!" Perplexity has no creator dashboard. The fundamental shift: SEO had rankings (1st through 100th position). LLMO has a binary outcome — you're either cited or you're not. And nobody's telling you which.

This gap isn't just inconvenient. It's strategic poison. You can't improve what you can't measure. Right now, most content creators are optimizing for AI visibility while flying blind.

![Three layers of LLMO measurement — GA4, manual protocol, Python automation](/images/blog/measure-ai-citations-llmo-kpi/three-measurement-layers.png)

## Layer 1: GA4 AI Referral Traffic (Free, 5 Minutes)

The easiest measurement you can set up today is tracking AI referral traffic in Google Analytics 4. When an AI search engine cites your site with a clickable link and someone clicks it, GA4 records the source.

Here's the regex pattern I use in a custom channel group:

```regex
chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|deepseek\.com|you\.com|meta\.ai|poe\.com
```

Go to **Admin -> Channel Groups -> Create**, add a new channel with this regex as the session source filter, and name it "AI Search." You'll immediately see aggregated traffic from all AI platforms in one view.

A few things to know:

**ChatGPT plays nicely.** Since late 2025, ChatGPT appends `utm_source=chatgpt.com` to outbound links. ChatGPT traffic shows up cleanly as `chatgpt.com / referral` in GA4.

**Perplexity is decent.** Traffic appears as `perplexity.ai / referral`, though without UTM tags. Still trackable.

**Free-tier ChatGPT is a black hole.** Free users often don't send referrer data due to privacy settings. Their clicks show up as "Direct" — indistinguishable from someone typing your URL manually. Your GA4 numbers are a floor, not a ceiling.

The conversion story is where this gets interesting. Industry data from 2026 shows AI referral traffic converts at 8-12%, compared to 2-3% for traditional Google organic. People who arrive via AI search have already done their research — the AI did it for them. They're further along in the decision process.

I started tracking three weeks ago. My AI referral traffic is still small (single digits daily), but the conversion rate is 3x my organic average. Small sample, but a signal worth watching.

## Layer 2: The "Ask Five AIs" Protocol (Free, 30 Min/Month)

GA4 tells you who clicked through. It doesn't tell you whether AI is *mentioning* you without linking, or whether it's mentioning you at all.

For that, you need to ask directly. I run this on the first Monday of every month:

**Step 1:** Write 10-15 prompts related to your niche. Mine include "What are the best resources for AI search optimization?", "How do I get my site cited by ChatGPT?", and "LLMO vs SEO differences."

**Step 2:** Run each prompt on five platforms — ChatGPT, Perplexity, Gemini, Claude, and Copilot.

**Step 3:** Record four things per prompt per platform:
- Mentioned? (Yes / No)
- Context (recommendation / comparison / neutral / negative)
- Accuracy of information
- URL provided?

**Step 4:** Calculate your citation rate. 15 prompts x 5 platforms = 75 checks. Mentioned 20 times? That's 26.7%.

This takes about 30 minutes with a spreadsheet. It's manual, it's tedious, and it's the most reliable method that exists today. Automated tools can approximate this, but they can't replicate the nuance of "was that mention positive or just a passing reference?"

One caveat: LLM responses are non-deterministic. The same prompt can produce different answers on different days. A single check isn't statistically significant. That's why I track the monthly trend, not individual data points. Three months of data starts showing real patterns.

## Layer 3: Automate It With Python (One Saturday)

If you're an engineer, you can automate the manual protocol with API calls. Hit the OpenAI and Anthropic APIs with your query set, check whether your brand appears in the response, and log results as a time series.

The core logic is simple:

```python
BRAND_VARIANTS = ["your-site.com", "Your Brand", "yourbrand"]
CHECK_QUERIES = [
    "Best tools for [your category]",
    "How to solve [problem you address]",
    "[Your brand] vs [competitor]",
]

def check_openai(query: str) -> dict:
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": query}],
        temperature=0.0,
    )
    answer = response.choices[0].message.content
    mentioned = any(v.lower() in answer.lower() for v in BRAND_VARIANTS)
    return {"platform": "ChatGPT", "query": query, "mentioned": mentioned}
```

Extend this for Claude and Perplexity, run weekly via cron, dump to CSV. You get a time series of your AI visibility score for about $0.50/week.

The payoff: instead of "I think LLMO is working," you can say "my visibility went from 12% to 28% after I added structured data." Numbers beat feelings.

## What's Available in May 2026

If building your own tools isn't your thing, several commercial platforms now track AI citations:

**Otterly.ai** is the fastest-growing option, with 10,000+ users since launching in October 2024. It monitors your brand across ChatGPT, Perplexity, Google AI Overviews, and Copilot. Keyword-level citation tracking, competitor benchmarking, and clean dashboards. Pricing is accessible for small teams.

**Profound** sits at the enterprise end. Their published case study with Ramp — going from 3.2% to 22.2% AI visibility in one month — is the kind of result that gets budget approved. If you're a larger organization, this is where you'll probably land.

**Peec AI** focuses on brand mention analysis across LLM outputs: not just *if* you're cited but *how*. What sentiment surrounds your mentions, which prompt patterns trigger citations.

These tools return four core data types: whether you were cited, which URL was cited, the sentiment of the mention, and share-of-voice benchmarks against competitors.

My honest take: for individual creators and small teams, the manual protocol plus a basic Python script gives you 80% of the insight at 0% of the cost. Commercial tools become worthwhile when you're tracking dozens of keywords across multiple brands and need team dashboards.

## The Crawler Signal You're Probably Ignoring

Here's a measurement angle most people miss: AI crawler logs.

Your server access logs already record which AI systems are visiting your content. GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot, Google-Extended — they all identify themselves in the User-Agent string.

```bash
grep -E "GPTBot|ClaudeBot|PerplexityBot|Google-Extended" \
  /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn
```

Pages that get crawled frequently are more likely to appear in AI responses. Pages that never get crawled are invisible. It's an indirect signal, but useful for finding content that AI systems are skipping entirely.

I checked my own logs and found that `/blog/` pages get crawled 15x more than my `/about/` page. Not shocking, but the gap was wider than I expected.

## Building a Measurement Habit

Measurement without action is just data hoarding. Here's the cycle I run:

**Weekly (10 min):** Check GA4 AI referral dashboard. Note spikes or drops. Compare week-over-week.

**Monthly (30 min):** Run the five-platform manual protocol. Calculate citation rate. Scan crawler logs for new patterns.

**Quarterly (1 hour):** Full review. Update query set. Compare citation rate trends. Check whether content changes produced measurable results.

The [LLMO Framework](https://llmoframework.com) provides a structured approach to KPI design if you want a more formal methodology. I reference it when deciding which metrics matter most at different growth stages.

## The Punchline

I started measuring my LLMO visibility three weeks ago. My citation rate across five platforms is 14%. Not great. Not terrible. But the important part is that I *know* the number, and three months from now I'll know whether it went up or down.

The SEO world figured out measurement twenty years ago. The LLMO world is still in its "checking rankings by Googling yourself" era. The people who build measurement infrastructure now will have a compounding advantage over those who keep guessing.

If you're still typing your brand name into ChatGPT and squinting at the output, I get it. I was doing the same thing last month. But now I have a spreadsheet, a cron job, and a regex filter in GA4. Less romantic, more informative. I'll take that trade.

## References

- [How to Track AI Traffic in GA4](https://www.1clickreport.com/blog/track-ai-traffic-ga4-chatgpt-perplexity-claude) — 1ClickReport
- [Best LLMO Tools in 2026](https://ziptie.dev/blog/best-llmo-tools/) — ZipTie.dev
- [AI Citation Tracking Tools](https://www.stackmatix.com/blog/ai-citation-tracking-tools) — Stackmatix
- [Peec AI](https://peec.ai/) — AI Search Analytics for brand mention analysis
- [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735) — Aggarwal et al., Princeton / ACM SIGKDD 2024
- [LLMO Framework](https://llmoframework.com) — KPI design and implementation guide

---

## Want to go deeper?

For the full LLMO playbook — llms.txt patterns, JSON-LD examples, citation-rate KPIs, and ChatGPT/Perplexity/Brave comparison — see **[LLMO Practical Guide: Why ChatGPT Ignores Your Website](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=measure-ai-citations-llmo-kpi)**.
