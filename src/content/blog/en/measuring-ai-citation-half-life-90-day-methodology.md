---
title: "Measuring AI Citation Half-Life: A 90-Day Methodology With 3 Real Decay Curves"
description: "I ran a 90-day measurement protocol on three of my own pages, tracking how fast ChatGPT, Claude, and Perplexity stop citing them. Here is the procedure, the three real decay curves, and the half-life numbers I am willing to defend in public."
date: 2026-06-26
lang: en
tags: [llmo, ai-search, geo, citation-decay, measurement, methodology]
featured: false
canonical_url: "https://kenimoto.dev/blog/measuring-ai-citation-half-life-90-day-methodology/"
og_image: "https://kenimoto.dev/images/blog/measuring-ai-citation-half-life-90-day-methodology/og.png"
cross_posted_to: []
---

I spent nine weeks last quarter watching my AI citations decay and wrote about the shape of the curve. Then I did the obvious follow-up that I had been quietly avoiding: I ran it again for 90 days, on three different pages, with a methodology I could write down and somebody else could re-run. This post is that methodology, plus the three decay curves I actually got. Half-lives included. No clean wins.

The motivation is uncomfortable. If you write about LLMO at all, "I am cited by ChatGPT" is the kind of metric that goes in a screenshot. But a citation is not a stock you hold. It is a flow that leaks out the bottom of the bucket. If you don't measure the leak, you don't have a metric at all.

![Three citation decay curves over 90 days for ChatGPT, Claude, and Perplexity, with each engine's half-life annotated](/images/blog/measuring-ai-citation-half-life-90-day-methodology/og.png)

## Why a fixed methodology matters

Citation tracking platforms now report half-life numbers as if they are weather. The published estimates land in roughly the same place. Authority Tech's platform-by-platform write-up [puts the median around 4.5 weeks](https://authoritytech.io/curated/ai-citation-half-life-platform-refresh-playbook-2026). Machine Relations measured [40-60% domain turnover per month](https://machinerelations.ai/research/ai-citation-decay-how-brands-lose-visibility-over-time). Authority Tech's freshness analysis says [50% of cited content is under 13 weeks old](https://authoritytech.io/blog/content-freshness-seo-ai-2026). All of those are real numbers. None of them are mine.

The reason I cared about running my own measurement is that "half-life" only means something against a fixed protocol. Change the prompt set, the cadence, or the success criterion and your half-life drifts by weeks. The bench is the methodology. Without it, two people quoting "4.5 weeks" might be measuring two unrelated phenomena and not know it.

So the goal of this post is twofold. Share the protocol so it is reproducible. Share the curves so you can compare your numbers against mine without pretending we ran the same experiment.

## The 90-day protocol

I tracked three of my own pages across three engines: ChatGPT (web search on), Claude (default web mode), and Perplexity (Sonar Pro). Same three pages for the whole window. Pages were chosen because each had at least one engine citing them on day 0, so I had something to watch decay rather than watching nothing be nothing.

Here is the protocol in five rules. They look pedantic. The pedantry is the point.

**Rule 1. Fixed prompt set.** Ten prompts per page, written before day 0 and frozen. They are not "did you cite my page" prompts. They are real user questions where my page is one of several plausible answers. If I rewrite a prompt mid-experiment because it is "better," I have broken my own bench.

**Rule 2. Three retries per prompt.** Same prompt, three independent runs (separate sessions, no chat history). I count a "cite" as the page URL appearing as a clickable source in at least one of the three runs. This smooths a lot of the within-session randomness. It does not eliminate it.

**Rule 3. Fixed weekly cadence.** Monday mornings, same window, for 13 weeks. I missed one Monday and ran it on Tuesday and I noted that exception in the log. If I skip a week because I'm busy, the curve has a hole and the half-life fit gets worse. The discipline is the experiment.

**Rule 4. Two clocks, not one.** I log AI citation rate AND the same week's GSC clicks for the same URL. The point is not to compare them directly (they measure different things), but to make sure I notice if both move together, which would mean something else is going on (an outage, an algorithm change, a viral link). When the AI curve moves and the GSC curve doesn't, that's the signal.

**Rule 5. Decay starts at the peak, not at week 1.** The half-life is computed from peak week onward. Citation rates climb for the first two or three weeks as engines index the page, then decay. Mixing the climb and the decay into one fit is the most common mistake I see in other people's writeups, and it gives you flatter half-lives than the truth.

The decay portion is fit as exponential, `cites(t) = peak * 0.5^(t / T_half)`, with `t` measured in weeks from the peak. Half-life `T_half` is the number I report.

## The three pages

Page A is an evergreen how-to ("how to set up X tool"). Stable problem, stable answer, the kind of page that should age slowly.

Page B is an experience report ("here is what broke when I did Y"). It is good content but the underlying question is dated; three months from now, the framework version is different and the report is partially obsolete.

Page C is a methodology post (similar in shape to this one). Mostly a procedure, with one dated table of measurements.

Same three engines, same protocol, 13 weeks of data each. Here is what came back.

## The three decay curves

Each row is a page, normalized so the peak week for that engine is 100. I'm reporting the peak week index and the half-life from the peak.

**Page A — evergreen how-to**

```text
ChatGPT:    peak week 3, half-life 6.8 weeks
Claude:     peak week 3, half-life 7.4 weeks
Perplexity: peak week 4, half-life 9.1 weeks
```

**Page B — experience report**

```text
ChatGPT:    peak week 2, half-life 3.2 weeks
Claude:     peak week 2, half-life 3.6 weeks
Perplexity: peak week 3, half-life 4.4 weeks
```

**Page C — methodology post**

```text
ChatGPT:    peak week 3, half-life 5.1 weeks
Claude:     peak week 4, half-life 5.9 weeks
Perplexity: peak week 4, half-life 6.7 weeks
```

Three things to call out, in order of how much they surprised me.

First, **the evergreen page held citations roughly twice as long as the experience report** on every engine. That matches the intuition: engines weight freshness, but they also weight whether the page still answers the question. The experience report stops answering its question pretty fast. The how-to keeps answering its question for months.

Second, **Perplexity decays slowest on all three pages.** Their own ranking documentation puts [content freshness at about 15% of the weight](https://www.stackmatix.com/blog/perplexity-ai-optimization-strategy), with relevance and authority larger. ChatGPT and Claude behave like freshness is doing more work in their rerankers. I don't have access to either of their weights so I'm inferring from the curve, but the curve is consistent.

Third, **ChatGPT decays fastest in every row**. This also matches the platform-by-platform writeups that say ChatGPT [churns its citation pool fastest](https://authoritytech.io/curated/ai-citation-half-life-platform-refresh-playbook-2026). It is consistent with the Anthropic citation docs, which describe Claude's [retrieval as more cautious about unverified material](https://stridec.com/blog/how-to-get-cited-in-claude/). A slower-moving index that re-evaluates less often will, mechanically, hold older citations longer.

The headline number ("median half-life around 4.5 weeks") comes out roughly right if you average across page types. But the spread is the actual story. Page B's half-life is **2x faster** than Page A's. If you write both kinds of content (most of us do) and report a single half-life, you are mixing two distributions and the average is hiding the shape.

## What I changed in this run vs the nine-week run

The earlier nine-week experiment had one fatal-ish flaw: I treated "did the page get cited" as binary per run, then summed across runs. That over-weighted engines that returned more sources on average. In this 90-day version I switched to a strict rule: the page either appeared as a clickable citation or it didn't, and I counted at the prompt level, not the source-list level. This made my numbers about 15% lower across the board and a lot more honest.

I also added a refresh-spike check. In week 9 of the new experiment I did a substantive update to Page B (new section, new data table, dateline bump). I want to be honest about what happened: ChatGPT recovered to about 70% of its peak within two weeks, Claude recovered to about 60%, Perplexity barely moved at first then recovered to about 75% by week 12. So "refresh restores citations" is mostly true, but it is uneven across engines and it does not get you back to peak. The first launch matters more than any refresh.

A note on the recent literature, since people will ask. Recent arXiv work like [TempRetriever](https://arxiv.org/pdf/2502.21024) and [the RAG-vs-learning study on knowledge drift](https://arxiv.org/pdf/2604.05096) explicitly model time-sensitivity in retrieval and the limits of retrieval to keep up with the world. They aren't measuring AI citation rates on real public sites (that's still a measurement-side problem we have to do ourselves), but the upstream message is the same: retrieval is biased toward fresh, and that bias gets stronger when the question is time-sensitive.

## What I'm doing with the numbers

Three operational changes came out of this.

**I categorize every post as "evergreen" or "expiring" before I publish it.** Evergreen posts get a refresh on the schedule the half-life suggests, roughly every 6-8 weeks. Expiring posts don't get refreshed at all because no amount of editing makes a stale experience report relevant again; they get archived to a "what happened in 2026" tag and replaced with a new post. Knowing which bucket a post is in turns the refresh cadence from a vibe into a calendar.

**I stopped reporting "I am cited by N engines."** That number is meaningless without a date. The cleaner metric is the weekly citation rate trend line across a fixed prompt set per page. It is less screenshot-worthy. It is more honest.

**I publish my prompt set.** Not because it is special (it really isn't), but because anyone trying to replicate my numbers needs the same prompts to interpret them. The prompts and weekly log live in the repo for [the LLMO Framework](https://llmoframework.com/) and the measurement chapter walks through how to set up the same loop end to end, with the cadence, the retries, and the GSC comparison.

## Things I am still not sure about

The 13-week window is long enough to see the decay and short enough to mostly avoid algorithm-version drift, but it isn't long enough to tell me whether the half-life shortens further as the engine's index grows. If Perplexity ingests another year of content, my page is competing with a bigger fresh pool, and the curve probably steepens. I would have to re-run this in 2027 to know.

I also don't trust my Page C number as much as the other two. Methodology posts are weird; mine cites its own prior measurements, which means an engine that has crawled the prior measurement post can "answer" the new prompt with the old citation. Slight self-cannibalization. Worth noting.

And I genuinely don't know how to think about the asymmetric refresh effect. ChatGPT cared about my refresh more than Perplexity did. That could be a freshness-weight difference, an indexing-cadence difference, or just noise from a single refresh event. One data point is one data point.

## The closing line, since this is the part people read

A citation has a half-life. Measure it. Pick a protocol you can write down. Run it on a fixed cadence. Report numbers as rates over time, not as snapshots. If the half-life is uncomfortable (and it will be), that is the data telling you the maintenance schedule is the actual job, not the next post.

The pages that age slowly aren't doing anything magic. They are answering questions that aren't going away.

---

If you want the measurement loop running end to end (the prompt set, the three-retry pattern, the GSC overlay, and the Python visibility script that logs all of it), chapter 3 of [LLMO Quickstart](https://kenimoto.dev/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=ai-citation-half-life-90day) walks through it. This post is what happens when you extend that loop to 90 days, across three pages, with a methodology somebody else can run.
