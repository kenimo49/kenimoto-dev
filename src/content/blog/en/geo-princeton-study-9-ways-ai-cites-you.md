---
title: "Princeton Tested 9 Ways to Get Cited by AI. Only 3 Worked."
description: "The GEO paper benchmarked 10,000 queries and found that statistics, citations, and technical terms beat every SEO trick in the book. Here's what actually moves the needle for AI visibility."
date: 2026-05-01
lang: en
tags: [llmo, geo, ai-search, seo, content-optimization]
featured: false
canonical_url: "https://kenimoto.dev/blog/geo-princeton-study-9-ways-ai-cites-you"
og_image: "https://kenimoto.dev/images/blog/geo-princeton-study-9-ways-ai-cites-you/og.png"
cross_posted_to: []
---

I've been writing about LLMO for weeks now, and I keep catching myself doing the same thing: guessing. "I think AI likes structured content." "Citations probably help." "Maybe shorter paragraphs?" It's all vibes. Educated vibes, sure, but vibes.

Then I found a paper where six researchers at Princeton decided to actually *measure* this stuff. 10,000 queries. 9 optimization methods. Controlled experiments. Peer-reviewed at ACM SIGKDD, the top data mining conference. No vibes — just numbers.

The results wrecked several of my assumptions. Turns out the thing I spent the most time on (making my prose sound nice) barely moved the needle. And the thing I kept putting off (digging up statistics) was the single most powerful lever by a factor of two.

## The Paper: GEO (Generative Engine Optimization)

In 2024, Pranjal Aggarwal and five colleagues from Princeton, Georgia Tech, the Allen Institute for AI, and IIT Delhi published "GEO: Generative Engine Optimization." The paper has since accumulated 76 citations and over 9,000 downloads. Not bad for a topic most marketers still file under "too early to care about."

The core insight is simple: traditional SEO optimizes for *ranking*. GEO optimizes for *citation*. In the old world, you wanted to be link #1 on a results page. In the new world, you want your content woven into the AI's answer.

These are different games. Being the best blue link and being the most citable passage require different strategies. The GEO paper set out to find which strategies actually work.

## Why This Matters More in 2026 Than in 2024

When the paper first dropped, AI search was a curiosity. Now it's infrastructure. The numbers have shifted dramatically:

- ChatGPT Search processes **250-500 million queries per week** and ranks among the top five search properties globally
- AI search engines now influence **12-18% of total web referral traffic**, up from 5-8% in late 2024
- AI referral traffic converts at **14.2%** — five times Google's 2.8% conversion rate
- 810 million people use ChatGPT daily. Google AI Overviews reach 1.5 billion monthly users

That 14.2% conversion rate is the number that should make you sit up. People who find you through AI search are five times more likely to take action than people who find you through Google. Getting cited by AI isn't just a visibility play — it's a conversion play.

And yet, most content strategy advice still focuses on "10 blue links" SEO. It's like optimizing your Yellow Pages ad in 2005.

## GEO-bench: The 10,000-Query Experiment

The researchers built a benchmark dataset called GEO-bench: 10,000 diverse user queries across science, technology, general knowledge, and niche topics, each paired with relevant web sources.

They then tested nine optimization methods by applying each one to the source content and measuring whether it changed the AI's citation behavior. The metric was *visibility* — how much of the AI's response referenced the optimized content.

### The 9 Methods

1. **Statistics Addition** — inject concrete numbers and data points
2. **Cite Sources** — add references to authoritative sources
3. **Quotation Addition** — include direct quotes from experts
4. **Technical Terms** — use domain-appropriate jargon precisely
5. **Fluency Optimization** — improve prose readability
6. **Authoritative Claims** — assert expertise
7. **Keyword Stuffing** — increase keyword density
8. **Summary Addition** — add section summaries
9. **Readability Improvement** — simplify language

Before reading the results, I would have bet on fluency and readability. I'm a "good writing wins" person. I was wrong.

## The Results: Three Winners, Six Also-Rans

![GEO study results — 9 optimization methods ranked by visibility impact](/images/blog/geo-princeton-study-9-ways-ai-cites-you/geo-9-methods-results.png)

The top three methods demolished everything else:

| Method | Visibility Improvement |
|--------|----------------------|
| Statistics Addition | **+115.1%** |
| Cite Sources | **+77.8%** |
| Technical Terms | **+47.3%** |

The bottom of the ranking:

| Method | Visibility Improvement |
|--------|----------------------|
| Fluency Optimization | +15.1% |
| Keyword Stuffing | ~0% (sometimes negative) |
| Readability Improvement | Marginal |

Statistics addition *doubled* visibility. Adding a concrete number to your content — "32% of engineers" instead of "many engineers" — made AI twice as likely to cite you. Meanwhile, the thing SEO consultants have been preaching for a decade (keyword optimization) scored a flat zero. In some cases it actually *hurt* visibility.

I spent my weekend rewriting paragraphs to flow better. I should have spent it looking up statistics. This is the content equivalent of cleaning your house before a date while forgetting to, you know, make a reservation.

## Why Statistics Win

When an AI generates a response, it needs to decide which sources are worth quoting. The decision isn't "which one reads nicely" — it's "which one has something I can't paraphrase away."

A vague claim is easy to paraphrase:
> "Remote work has grown significantly in recent years."

A specific statistic is hard to paraphrase without losing the point:
> "Japan's telework adoption rate reached 32.2% in 2024, up from 9.8% in 2019."

The AI keeps the second version because the numbers *are* the value. Remove them and you lose the information. The same logic applies to citations (removing the source weakens credibility) and technical terms (substituting a layman's term loses precision).

Fluency, by contrast, is the thing the AI is already good at. It can rephrase your awkward sentence into a smooth one on its own. Your beautiful prose isn't a competitive advantage when your reader is a language model.

## Domain Matters: One Strategy Doesn't Fit All

The paper found significant variation across domains:

**Science and technology**: Statistics and citations dominated. When someone asks about quantum computing or API design patterns, the AI wants hard data and credible references.

**General topics**: Structure and directness mattered more. For "best cities for remote work" or "how to start a garden," clear organization and direct answers outperformed raw data.

**Niche topics**: Original data and firsthand experience won. When sources are scarce, the AI values anyone who has actually *done the thing* over someone summarizing others who did.

This means a tech blogger and a travel blogger need different GEO strategies. The tech blogger should load up on benchmarks and paper citations. The travel blogger should lead with personal experience and original photography data. A one-size-fits-all approach is the fastest way to optimize for nothing.

## From Lab to Reality: The 37% Gap

Here's where the skeptic in me perks up. GEO-bench is a controlled environment. Real-world AI search has competitors, algorithm updates, and unpredictable queries.

The researchers addressed this by testing on Perplexity.ai, an actual production search engine. Result: **up to 37% visibility improvement** in the wild. That's less than the +115% from the benchmark, but it's statistically significant and practically meaningful.

A 2026 follow-up study by ConvertMate — 12,500 queries across 8,000 domains — corroborated the Princeton findings. Statistics and citations consistently outperformed stylistic optimizations. This isn't one lab's quirky result. It's a pattern.

That said, the paper has real limitations. It was primarily validated on Perplexity. Google AI Overviews, ChatGPT Search, and Gemini each have different citation algorithms. What works on Perplexity might underperform on Google's system, which weighs E-E-A-T signals differently. And since all these systems are black boxes that update constantly, today's best practice could be tomorrow's noise.

GEO is science, not scripture.

## Five Things I Changed After Reading the Paper

Here's what I actually did with my content after digesting the study. No theory — just the diffs.

**1. I added a number to every major claim.** Not "AI search is growing" but "AI search referrals grew 527% between January and May 2025." If I couldn't find a number, I noted the absence: "No public benchmark exists for this yet."

**2. I started citing primary sources.** Not "studies show" but "Aggarwal et al. (KDD 2024) found." Not "experts say" but "BrightEdge's 2025 analysis confirmed." Every citation is a credibility signal to the AI.

**3. I use technical terms without apology.** Instead of dancing around "Generative Engine" with "AI-powered search tool that generates answers," I write "Generative Engine" and define it once. LLMs reward precision.

**4. I stopped over-polishing prose.** Good writing still matters for human readers. But spending an hour making a paragraph 10% smoother? That hour is better spent finding a statistic. The GEO data is clear: +15% for fluency versus +115% for statistics. The ROI isn't close.

**5. I optimize by passage, not by page.** GEO research, combined with SurferSEO's analysis, shows that LLMs cite at the *passage* level — individual paragraphs and sections. Each section needs to stand alone as citation-worthy. A great intro doesn't save a data-free middle section.

## The Practical Playbook

If you want a framework for applying GEO to your content, [the LLMO Framework](https://llmoframework.com) breaks the process into concrete steps. But here's the quick version:

**For every piece of content you publish, ask three questions:**

1. **Does this section contain a specific number?** If not, find one.
2. **Does this section cite an authoritative source?** If not, add one.
3. **Does this section use the correct technical terms?** If not, swap in the precise terminology.

That's it. Three questions. If you can answer "yes" to all three for most of your sections, you're ahead of 95% of content on the web — because most creators are still optimizing for keywords and readability, the two methods that scored lowest in the GEO study.

## The Bigger Picture

The GEO paper is a snapshot — 2024 data, specific models, specific benchmarks. AI search will evolve. Citation algorithms will change. New studies will refine or contradict these findings.

But the underlying principle is durable: **AI cites content that's hard to paraphrase.** Statistics, references, and precise terminology create passages that lose value when reworded. That makes them citation-worthy by construction, not by algorithm.

Make your content so specific that an AI can't summarize it without losing the point. That's the strategy that survives algorithm updates — because it's not gaming a system. It's being genuinely useful.

I started this piece by admitting I was guessing about LLMO. Now I have a benchmark. I still don't know everything, and the field will keep moving. But at least I'm measuring. And according to Princeton, measuring is the one thing that works best.

## References

- [GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735) — Aggarwal et al., ACM SIGKDD 2024
- [GEO-bench and research site](https://generative-engines.com/) — Princeton University
- [ConvertMate GEO Benchmark 2026](https://www.convertmate.io/research/geo-benchmark-2026) — 12,500-query follow-up study
- [AI Search Statistics 2026](https://www.superlines.io/articles/ai-search-statistics/) — 60+ data points on visibility and traffic
- [LLMO Framework](https://llmoframework.com) — Practical implementation guide for GEO strategies
