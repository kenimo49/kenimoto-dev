---
title: "AI Citations Have a Half-Life. I Tracked Mine for 9 Weeks and Watched Them Decay."
description: "I logged my blog's AI citations every week for two months. They peaked around week three, then fell by more than half. Google search traffic never moved. SEO and AI citation run on two different clocks."
date: 2026-06-04
lang: en
tags: [llmo, ai-search, geo, citation-decay, measurement]
featured: false
canonical_url: "https://kenimoto.dev/blog/ai-citations-half-life-decay/"
og_image: "https://kenimoto.dev/images/blog/ai-citations-half-life-decay/og.png"
cross_posted_to: []
---

I have written about measuring AI citations more times than I have written about my own family, which says something I would rather not examine. KPIs, tracker comparisons, the breadth of my corpus. All of it was a snapshot: how many engines cite me *today*. It took me an embarrassingly long time to ask the obvious follow-up question. Not "how many," but "how long."

So I started logging citations weekly instead of once. Same prompts, same five engines, every Monday morning, for nine weeks. The result is the thing nobody screenshots on LinkedIn: a citation is not a trophy you win and keep. It is a perishable good. Mine peaked around week three and then lost more than half its value, and the strangest part is that my Google search traffic for the exact same pages did not budge.

![A citation curve rising to a week-three peak then decaying, next to a flat Google traffic line](/images/blog/ai-citations-half-life-decay/og.png)

## What I actually measured

I had three articles that consistently got cited across ChatGPT, Perplexity, Gemini, Claude, and Brave AI. I picked those three because a citation that only fires once is noise, and I wanted signal I could track over time.

Every Monday I ran the same 30 prompts, three times each, and logged how many returned one of my three pages as a clickable citation. I also pulled the weekly Google Search Console clicks for those exact URLs, so I had two curves drawn on the same calendar.

One curve is AI citations. The other is plain old search traffic. I expected them to roughly track each other. They did not even rhyme.

## The decay curve

Here is what nine weeks looked like, normalized so the peak week is 100.

```text
Week:        1    2    3    4    5    6    7    8    9
AI cites:   48   82  100   91   70   54   47   44   46
GSC clicks: 88   92   95  100   97   99   96   98   97
```

The AI citation line climbs for three weeks, tops out, and then slides down a ramp until it settles at roughly half its peak. The Google line is a heartbeat monitor on a calm patient: it wanders inside a narrow band and never does anything dramatic.

If I fit a half-life to the decay portion, my citations lost 50% of their peak rate in about four to five weeks. That lined up unnervingly well with what other people are measuring out loud right now. One platform-by-platform study put the median AI citation [half-life at 4.5 weeks](https://authoritytech.io/curated/ai-citation-half-life-platform-refresh-playbook-2026), with ChatGPT churning fastest and Perplexity holding longest. Another found that [AI-cited domains turn over 40 to 60 percent every month](https://machinerelations.ai/research/ai-citation-decay-how-brands-lose-visibility-over-time). I was not looking at a quirk of my tiny blog. I was looking at the weather.

## Why the two clocks disagree

The reason the curves diverge is that they are pulling from different places.

Google's organic ranking for an established page is sticky. The page earned its position over months, the ranking signals are slow-moving, and one week of nothing-in-particular does not dislodge it. That is the heartbeat line.

AI citations are pulled from a live index at answer time, and that index is biased toward fresh material. Industry measurements in 2026 keep landing on the same shape: roughly [half of all AI-cited content is under 13 weeks old](https://salespeak.ai/aeo-news/content-freshness-ai-search), and pages updated within the last 30 days earn several times more citations than older ones. My three pages were great answers in March. By May they were still great answers, but the engine had three newer "great answers" to choose from, and it is graded on recency, not on loyalty to me.

So the decay is not a quality problem. My pages did not get worse. The pool they compete in got younger.

## The part where I tried to fight it

Naturally, my first instinct was to refresh the pages and reset the clock. The freshness research says a substantive update — a new stat, a corrected claim, a visible timestamp change — is enough to [re-trigger the freshness signal](https://authoritytech.io/curated/ai-citation-half-life-platform-refresh-playbook-2026). So in week seven I rewrote the intro of my best-performing page, added a 2026 data point, and bumped the dateline.

You can see the result in the table. Week eight ticked from 47 to 44, then week nine recovered to 46. Within the noise. A genuine nothing.

I want to be honest about that, because the tidy version of this post would have the refresh save the day in a triumphant week-nine spike. It didn't. One refresh of one page over two weeks is not enough signal to conclude the tactic failed, but it is enough to stop me from promising you it works. What I changed was small, and the engines treated it as small. The lesson I am taking is that a cosmetic timestamp bump is not a refresh. The studies that show refreshes working describe *substantive* rewrites, and "I added one sentence" is the SEO equivalent of changing your shirt and calling it a new wardrobe.

## What this means if you write about LLMO

Three things rearranged in my head.

**A citation count is a flow, not a stock.** I had been treating "I am cited by five engines" like money in a bank account. It is closer to water in a leaky bucket. If you measure once and frame it, you are reading the level at one instant and assuming it holds. It does not hold. The only honest version of the metric is a rate over time, which means you have to measure on a cadence or you are measuring nothing.

**The refresh cadence is the actual job.** If half your citation value evaporates in roughly a month, then the maintenance schedule matters more than the next new post. I spent six months optimizing the title and schema of pages at the moment of publication, which is the one moment the freshness clock is on my side anyway. The hard part is week six, when the clock has turned against me and the only move is real work on an old page.

**SEO and AEO are not the same investment.** They feel adjacent because they both start with a URL and a query. But my data shows them moving on different timescales for the same pages, which means a single content calendar optimized for one is probably mistimed for the other. Search rewards the durable asset. AI citation rewards the recently-touched asset. Those are not the same content strategy wearing two hats.

For the framework side of this, the [LLMO Framework](https://llmoframework.com/) splits its pillars into Citability (do you get cited at all) and the Authority and Coherence signals (do you stay cited). Nine weeks of staring at a decay curve made me realize I had spent all my effort on the first pillar and almost none on the rest. Getting cited is a launch problem. Staying cited is a retention problem, and retention is where the freshness clock lives.

## What I'm doing now

I turned the weekly log into a standing job instead of a one-time experiment. Every Monday the same 30 prompts run, the same three URLs get checked, and the number goes into a spreadsheet next to the GSC clicks. When a page's citation rate drops below half its peak, it goes on a refresh list — and "refresh" now means a real new section or a new dataset, not a dateline nudge.

I am also going to stop reporting my citation breadth as a single proud number. "Five engines cite me" is true on a Monday and a lie by the next month. The number I trust now is the trend line, and the trend line only exists if you keep measuring after the launch-week dopamine wears off.

The blog never stopped being a measurement target. I just learned that the measurement has a time axis, and the time axis is where all the interesting bad news lives.

I will re-run the full nine-week log on a different set of pages next quarter to see if the half-life holds at four-to-five weeks or if it varies by topic. My guess is that evergreen how-to pages decay slower than my "here's what broke this week" experience reports, because the how-to answers a stable question and the experience report answers a question nobody will type again. We'll see. The nice thing about a leaky bucket is that it makes a very honest dashboard.

---

If you want the measurement loop I keep referring to — the five-prompt, three-retry, monthly-cadence setup with the GA4 segment regex and the Python visibility script — chapter 3 of [LLMO Quickstart](https://kenimoto.dev/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=ai-citations-half-life-decay) walks through it. This post is what happened when I added a time axis to that loop and watched the numbers fall.
