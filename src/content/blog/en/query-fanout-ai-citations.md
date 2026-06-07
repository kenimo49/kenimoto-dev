---
title: "AI Search Splits Your One Question Into Six. My Pages Answered None of Them."
description: "Query fan-out means an AI breaks a single question into a handful of sub-queries before it answers. Pages that rank for those sub-queries get cited 161% more often. Here is how I rebuilt my sections to actually answer them."
date: 2026-06-06
lang: en
tags: [llmo, geo, ai-search, content-design]
featured: false
canonical_url: "https://kenimoto.dev/blog/query-fanout-ai-citations/"
og_image: "https://kenimoto.dev/images/blog/query-fanout-ai-citations/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/ai-search-splits-your-one-question-into-six-my-pages-answered-none-of-them-p56-temp-slug-4772810
---

I spent a year writing pages that answered exactly the question in the title, and then wondered why the AI never quoted me.

Here is the thing nobody told me: when you ask an AI a real question, it does not go looking for "the page about X." It quietly rewrites your one question into a fistful of smaller ones, searches all of them at once, and stitches the answers back together. This is called query fan-out, and once I understood it, my old pages looked like a student who studied for the wrong exam. Confidently. In detail. For the wrong test.

This is not another "make your content AI-friendly" listicle. I want to dig into one single technique: how to answer the sub-queries that fan-out generates, with section structure, and why that one move moved my citation rate more than anything else I tried.

## What is query fan-out?

Query fan-out is when an AI search engine breaks your single question into 8 to 12 parallel sub-queries, searches each one, and synthesizes a single answer from the results. Google confirmed the mechanism at I/O 2025, and since January 22, 2026, Gemini 3 has been the model running it inside AI Mode.

The decomposition step is the part worth understanding. The model parses your prompt into entities, constraints, and time references, then writes a sub-prompt for each piece. Ask "Is Next.js or Nuxt better for a small team in 2026?" and it does not run that string. It runs something closer to this:

- "Next.js pros and cons 2026"
- "Nuxt pros and cons 2026"
- "Next.js vs Nuxt performance benchmark"
- "Next.js learning curve small team"
- "Nuxt TypeScript support"
- "Next.js vs Nuxt hosting cost"

Six searches from one question. Then it grades the passages it pulls back and builds an answer. Your page never needed to "rank for Next.js vs Nuxt." It needed to be the best passage for one of those six side doors.

![A single user question fanning out into six parallel sub-queries, each retrieved separately and synthesized into one AI answer](/images/blog/query-fanout-ai-citations/fanout-diagram.png)

## Why does fan-out coverage matter for citations?

Pages that also rank for fan-out queries are 161% more likely to be cited in Google's AI Overviews. That number comes from a Surfer SEO study published in December 2025, which found a Spearman correlation of 0.77 between fan-out coverage and AIO citations: a strong, boring, reliable relationship.

The detail that reframed everything for me was this: 51.2% of AI Overview citations ranked for both the main query and at least one fan-out query. Not the main query alone. The cited pages were the ones that happened to answer a side question too. My single-purpose pages were structurally incapable of doing that, no matter how good the prose was.

So the goal stops being "rank for my keyword" and becomes "cover the cluster of questions the AI is about to invent." Same topic, wider net.

## How do I structure sections to answer sub-queries?

Make each H2 a specific question and answer it in the first sentence. That is the whole technique, and it is almost insultingly simple to write down and surprisingly hard to do consistently.

The pattern I now use for every section:

1. **H2 = a likely sub-query**, phrased the way a person would ask it. Not "Performance" but "Is Next.js faster than Nuxt?"
2. **First 40 to 60 characters = the answer.** Lead with the conclusion so a passage extractor can lift it whole.
3. **Then the evidence.** Numbers, a source, a caveat. This is where the page earns trust.
4. **Self-contained.** No "as I mentioned above." The AI grabs passages out of order, so a section that leans on context above it is a section that gets dropped.

That last rule is the one I keep breaking. Writers love callbacks. AI extractors treat a callback like a sentence with a missing puzzle piece, so they leave it on the table. Every "as we saw earlier" is a tiny act of self-sabotage.

![Two section layouts compared: a context-dependent paragraph that an extractor skips, versus a self-contained question-answer-evidence block that gets cited](/images/blog/query-fanout-ai-citations/section-structure.png)

## How do I predict the sub-queries before I write?

List the entities, constraints, and comparisons in your topic, then turn each into a question. Fan-out decomposes along exactly those axes, so if you map them first, you are designing against the same skeleton the model uses.

For a "Next.js vs Nuxt" page, the axes are the two entities (Next, Nuxt) crossed with the constraints a reader actually carries: performance, learning curve, hosting cost, team size, TypeScript, ecosystem. Each cell is a section. Each section is a self-contained answer. You are not guessing; you are reverse-engineering the decomposition.

If you would rather not do this by hand, there is a structured way to think about it. I leaned on the [LLMO Framework](https://llmoframework.com)'s query decomposition model, which lays out the sub-query expansion patterns and a topic-cluster template, when I was rebuilding my own pages. It turned "intuitively scatter some H2s" into something closer to a checklist, which is the only form in which I reliably follow my own advice.

The cluster idea matters here. A single page can hold maybe six to eight self-contained sections before it sprawls. Past that, you split into a pillar page plus cluster pages, each owning a slice of the fan-out, internally linked. The AI reassembles your cluster the same way it reassembles six search results: one coherent answer from many small, citable pieces.

## What does this look like in practice?

Here is the before and after of one of my own sections, lightly disguised.

Before, written for a human skimming top to bottom:

> Performance is obviously a key consideration, and as we touched on earlier, both frameworks have made significant strides here. Ultimately it depends on your use case.

That answers nothing. It ranks for nothing. An extractor reads it and moves on, and honestly, so would I.

After, written for fan-out:

> **Is Next.js faster than Nuxt?** For server-rendered pages, the two are within a few milliseconds of each other on equivalent hardware. Next.js pulls ahead on large static sites because of its more mature partial-prerendering pipeline; Nuxt closes the gap on smaller apps. Benchmark your own routes before deciding: framework-level differences are usually smaller than your data-fetching choices.

Same knowledge. The difference is that the second version answers a question someone actually fanned out, in the first sentence, without depending on a single word above it. That is the entire game.

## The part where I admit the catch

None of this works if the underlying section is empty. Fan-out coverage gets your passage considered; it does not get it chosen. I went through a phase of bolting question-shaped H2s onto thin paragraphs and got exactly what I deserved, which was nothing. The structure is a delivery mechanism for a real answer, and a beautifully addressed envelope with no letter inside still goes in the bin.

So the honest version of the advice is two-handed. Map the fan-out so the AI can find your passage. Then put something in the passage worth finding: a number, a benchmark you actually ran, a caveat that only someone who did the work would know. Structure is what makes you eligible. Substance is what makes you cited.

I rewrote about thirty sections this way over a couple of weekends. Not a heroic effort, just tedious. The citations did not explode overnight, but they showed up, on the side doors, for questions I never put in a title. Which, it turns out, is where the AI was knocking the whole time.

---

If you want the full version of this: the structured-data layer, the measurement setup, and the case studies behind the 161% number, I wrote a book on it.

[LLMO: AI Search Optimization](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=query-fanout-ai-citations)
