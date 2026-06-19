---
title: "AI Search Is Under 1% of My Traffic and 12% of My Signups. That's the LLMO Case I Actually Use."
description: "I kept deprioritizing LLMO because the traffic numbers were tiny. Then I split AI-sourced visitors out in GA4 and found they were converting at roughly 23 times my organic rate. Volume was the wrong metric the whole time."
date: 2026-06-20
lang: en
tags: [llmo, geo, ai-search, conversion, roi]
featured: false
canonical_url: "https://kenimoto.dev/blog/llmo-roi-23x-conversion/"
og_image: "https://kenimoto.dev/images/blog/llmo-roi-23x-conversion/og.png"
cross_posted_to: []
---

For about six months I had LLMO filed under "nice, later." The reasoning felt airtight: AI search was sending me a trickle of traffic too small to chart. Why pour engineering hours into Brave indexing and `llms.txt` and structured data for a channel that, on a good week, accounted for less than one percent of my visitors? I was busy being smart about prioritization. I was optimizing for the column in the dashboard that mattered least.

Then I actually split AI-sourced visitors into their own GA4 segment and looked at what they did after they arrived. That is when the "later" pile fell off the desk.

I want to be precise about what this post is and is not, because I have written about AI search before and I don't want to repeat myself. I have a [whole post on whether engines actually cite you](https://kenimoto.dev/blog/measure-ai-citations-llmo-kpi/) and another on how [your first week of GA4 data lies to you](https://kenimoto.dev/blog/new-domain-first-week-ga4-is-a-lie/). Those are measurement posts: how to count citations, how not to fool yourself with early numbers. This one is different. This is the argument I now use to justify the LLMO budget to a client, or to my own calendar, when someone asks the fair question: "why bother, when the traffic is so small?" The answer is that traffic is the wrong unit. The right unit is conversion, and on conversion the math is not close.

![AI search visitors were 0.5% of traffic but 12.1% of signups, roughly a 23x conversion rate](/images/blog/llmo-roi-23x-conversion/og.png)

## The number that reorganized my priorities

Here is the cleanest version of the data, and it is not mine originally — it is Ahrefs, measured on their own product. AI search visitors were **0.5% of their traffic but drove 12.1% of their signups** ([Ahrefs](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/)). Run that ratio out and AI-sourced visitors converted at roughly **23 times** the rate of everyone else.

When I first read "23x" I assumed it was a single vendor's lucky quarter. It isn't an outlier so much as the loud end of a consistent range. Semrush data puts LLM-referred visitors at about **4.4x** the conversion rate of traditional search traffic, and a separate analysis lands around **5x** ([Pixis](https://www.pixis.ai/blog/why-ai-search-traffic-converts-at-4-5x-what-the-data-actually-shows/)). On global e-commerce numbers, AI-referred conversion sits near **11.4%** against organic search's **5.3%**. Pick your study and the multiplier moves between roughly 4x and 23x, but it never once comes back as "about the same." That is the part that should bother anyone who's been ranking channels by traffic.

So the right framing isn't "AI sends me a tenth of the traffic." It sends me far less than that — a sliver, under one percent. But it is a sliver made almost entirely of people who are about to do the thing I want them to do.

## Why the AI sliver converts so hard

Once I stopped being annoyed at the volume, the mechanism was obvious in hindsight.

A Google visitor lands mid-research. They typed three words, got ten blue links, clicked mine, and are now comparison-shopping with eleven tabs open. They might be a buyer. They are at least as likely to be a student, a competitor, or someone who misread the title. The intent is smeared across the whole funnel.

An AI-sourced visitor arrives at the *end* of a conversation. They asked an assistant a real question, the assistant compared options, weighed tradeoffs, and named me as part of the answer. By the time they click through, the evaluation already happened — somewhere I can't see, in a chat I'll never read. They are not arriving to start their research. They are arriving to confirm a decision. Ahrefs noted exactly this in their traffic-quality work: AI visitors bounce less on the dimensions that matter because they are further down the journey ([Ahrefs](https://ahrefs.com/blog/ai-traffic-quality-study/)).

I'll add the honest asterisk, because the same study found AI visitors also browse fewer pages — the "higher quality" story is real but not unqualified. They don't wander. They came for one answer and they leave once they have it. For a signup or a sale, that's a feature. For ad-impression-based metrics, it would look like apathy. Which is yet another reason traffic volume is a bad lens here: the channel that converts best is also the channel that looks laziest if you only count pageviews.

## The volume is small *and* growing several hundred percent a year

The other half of the argument is that the tiny sliver is not staying tiny. Gemini's referral traffic grew about **388% year over year** into early 2026, while ChatGPT web visits climbed roughly **84%** since late 2024 ([Similarweb](https://www.similarweb.com/blog/marketing/geo/gen-ai-stats/)). When ChatGPT shipped clickable source links in May 2026, referral traffic to publishers jumped **157% week over week** ([Similarweb](https://www.similarweb.com/blog/insights/ai-news/chatgpt-referral-traffic-triples/)).

So you are not choosing whether to optimize for a channel that's 0.7% of traffic. You are choosing whether to be already indexed and already cited when that 0.7% becomes 3%, then 7%, made of the highest-intent visitors you will ever get. The cost of showing up late to LLMO is not "you missed some clicks." It's that the freshness-and-authority signals these engines reward take months to accrue, and you can't backdate them. Optimizing now is buying an asset that compounds; optimizing in 2027 is paying retail.

## How I actually justify the spend now

The framing I use is boring on purpose: don't budget LLMO against traffic, budget it against conversions, and treat citation visibility as a leading indicator of both.

This is also where I lean on an external scaffold instead of my own gut, because "I have a feeling AI traffic is good" is not a business case. The [LLMO Framework](https://llmoframework.com/) breaks the problem into measurable pillars — Citability and the Authority, Coherence, and Citation signals that decide whether you *stay* cited. I use it as the checklist for where the money goes: it turns "do some LLMO" into "raise these specific signals," which is the difference between a budget line and a vibe. For deciding how much to invest per channel, that pillar breakdown is the closest thing I've found to an ROI rubric for a channel whose attribution is still genuinely hard.

And attribution *is* still hard — I won't pretend otherwise. You often can't see the chat that sent the visitor, so last-click models undercount AI's contribution badly. The 2026 consensus among marketers reflects this: GEO success is increasingly measured by citations, mentions, and share of AI answers rather than raw sessions, precisely because the sessions undercount the influence ([Conductor](https://www.conductor.com/academy/state-of-aeo-geo-report/)). That same report is why I stopped feeling like a contrarian: US enterprises put around 12% of digital marketing budget into GEO in 2025, and the large majority planned to increase it in 2026. The "nice, later" crowd is shrinking, and I'd rather not be the last one in it.

## What I changed on the actual site

Concretely, after the GA4 segment scared me straight, here is what moved from the "later" pile to the "this week" pile:

- A persistent **AI-source GA4 segment** so AI conversions never hide inside "organic / other" again. This was the whole unlock — I couldn't value the channel because I'd never isolated it.
- **Citability work first** — answer-first sections, semantic headings, JSON-LD — because the Framework is right that getting cited is the launch problem you solve before anything else matters.
- A **freshness cadence** on my best-converting pages, because staying cited is a retention problem and the engines grade on recency.

None of this is exotic. It's the same structured-data-and-content hygiene I'd have done for SEO, pointed at a different consumer. The shift wasn't technical. It was admitting that I'd been ranking my own to-do list by the metric that made AI search look skippable, when the metric that pays rent said the opposite.

I still think SEO is the bigger channel by volume, and it will be for a while. But "bigger by volume" and "where the next conversion comes from" stopped being the same sentence around the time I built that segment. I spent six months treating the highest-converting traffic I had like a rounding error. The traffic really was that small. The revenue wasn't.

---

If you want the measurement scaffolding behind this — the GA4 segment regex, the five-engine citation tracker, and the Python visibility script I use to tell whether any of the LLMO work is landing — that's the practical core of [LLMO: AI Search Optimization](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=llmo-roi-23x-conversion). This post is the business case I bolt onto the front of it when someone asks why the small channel deserves the budget.
