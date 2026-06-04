---
title: "I Stacked 4 More Context Layers on Top of RAG. The Improvement Was 12%."
description: "I read about Full Context Engineering and immediately added structured output, hierarchical layout, role definition, and few-shot examples to my RAG pipeline. Sonnet got 12% better. Haiku got 14% worse. Here is what the numbers actually mean for your AI architecture in 2026."
date: 2026-05-07
lang: en
tags: [context-engineering, rag, llm, ai-architecture]
featured: false
og_image: "https://kenimoto.dev/images/blog/full-context-engineering-rag-80-percent/og.png"
canonical_url: "https://kenimoto.dev/blog/full-context-engineering-rag-80-percent/"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-stacked-4-more-context-layers-on-top-of-rag-sonnet-got-12-better-haiku-got-14-worse-2lfg-temp-slug-1489718
---

I read a post about "Full Context Engineering" and immediately added four more layers to my RAG pipeline. Structured output instructions. Hierarchical document layout. Role definition. Few-shot examples. The whole buffet.

The improvement on Claude Sonnet was 12%.

The improvement on Claude Haiku was minus 14%.

I had just spent two weeks building scaffolding to make my smaller model worse at its job. If you have ever wallpapered a room and stepped back to discover you covered up the light switch, you know the feeling.

This post is about what those numbers actually mean for the way you spend your context engineering effort in 2026.

## What I was measuring

I was running a benchmark against my own [Context Engineering book](https://kenimoto.dev/books/context-engineering) for a previous experiment ([the cheap-model post](https://kenimoto.dev/blog/cheap-model-won-context-beats-parameters)). The same scoring rubric: factual accuracy, hallucination rate, specificity, and honesty on a 0 to 15 scale.

The configurations were a ladder. Each rung adds one more thing on top of the previous one.

1. **System prompt only**: the bare baseline. No retrieval, nothing.
2. **System + RAG**: vector search over a curated corpus, top documents injected.
3. **Full Context Engineering**: RAG + structured output instructions + hierarchical layout + role definition + few-shot examples.

What I expected: a smooth upward curve. What I got was a curve that leaned forward and then fell over.

## The numbers

![Full CE vs RAG: Score deltas across Sonnet and Haiku](/images/blog/full-context-engineering-rag-80-percent/score-deltas.png)

**Claude Sonnet, total score (out of 15):**

| Configuration | Total | Delta from previous |
|---|---|---|
| System only | 8.8 | -- |
| System + RAG | 10.2 | +1.4 (+16%) |
| Full Context Engineering | 11.4 | +1.2 (+12%) |

**Claude Haiku, total score (out of 15):**

| Configuration | Total | Delta from previous |
|---|---|---|
| System only | 3.7 | -- |
| System + RAG | 11.8 | +8.1 (+219%) |
| Full Context Engineering | 10.1 | -1.7 (-14%) |

Two findings I did not expect.

First: RAG is doing almost all of the work. On Sonnet, RAG closed 88% of the gap between baseline and the fully tricked-out pipeline (1.4 of the total 2.6 point improvement). On Haiku, RAG over-shot the final number entirely.

Second: stacking more on top of RAG is not free. On Haiku, it actively made things worse. The hallucination score went from 1.7 to 0.5. The honesty score went from 1.3 to 0.5. The model started confidently making things up that it had previously hedged on.

## Why this happens

I have a hypothesis that I think survives contact with reality.

A small model has limited working memory. RAG hands it the right facts. Once those facts are in front of it, the marginal returns from extra structure are small. But the marginal cost of extra context is not small. Every paragraph of role definition, every few-shot example, every "here is how to format the output" block competes with the retrieved documents for the model's attention.

For Sonnet, the working memory is wide enough that the extras land in unused space. For Haiku, the extras shove the actually-useful retrieved context off to the edge of the window. The model still sees it. It just stops trusting it.

This is the same finding that recent research on long-context behavior keeps surfacing. [Studies on instruction-following at high context fill](https://www.meta-intelligence.tech/en/insight-context-engineering) report that for most frontier models in 2026, quality starts to degrade measurably at 60 to 70 percent context fill, and falls off a cliff around 90 percent. The cliff is steeper for smaller models.

The Pareto principle applies to context engineering with embarrassing accuracy. RAG is the 20 percent of effort that produces 80 percent of the result. Everything you stack on top of it is the long tail.

## The 2026 reality I almost forgot to mention

When I ran the original experiment, I was on Sonnet 4 and Haiku 3 with a 200K context window. As of this writing, Sonnet 4.6 has [a 1M token context window at standard pricing](https://www.anthropic.com/news/claude-sonnet-4-6) and prompt caching cuts the cost of repeated context by 90 percent.

This changes the math, but not in the direction you might think.

A 1M context window does not magically make stacked context cheaper to design. The model still has to pay attention to the right thing. The cliff at 60 to 70 percent fill is a percentage, not an absolute. A bigger window just means you can write more bad context before you fall off it.

Prompt caching helps if your stacked layers are static. The role definition, the few-shot examples, the structured output instructions: those parts cache cleanly. But that only saves money. It does not save quality. If your Haiku result was minus 14%, prompt caching makes minus 14% cheaper. That is not the win you wanted.

## The thing nobody told me about Skills

Anthropic's [Skills feature](https://kenimoto.dev/blog/claude-code-skills-reusable-workflow-pattern) is interesting in this light. Skills are reusable context bundles that load on demand. The right way to think about them is not "more context, all the time" but "the right context, just in time."

That is the failure mode my Full CE experiment ran into. I was packing every layer into every request. Skills point at the alternative: keep the system prompt small, retrieve the relevant skill, and let the rest stay out of the window. It is the same lesson as RAG, applied one level up. Selective beats throwing everything in.

The pattern shows up again in [agent harnesses described in arXiv papers](https://kenimoto.dev/blog/natural-language-agent-harnesses-arxiv). Successful agentic systems do not stuff everything into the prompt. They retrieve, scope, and inject context one tool call at a time.

## What I do now

If you take only one thing from this post, take this: the order of operations matters more than the number of operations.

1. Build the retrieval first. Get RAG working with a clean corpus, decent embeddings, and a relevance threshold. This is your 80%.
2. Run a benchmark. Real benchmark, on real questions, scored by a real rubric. Not vibes.
3. Add one layer at a time. Structured output, then hierarchical layout, then role definition. Re-benchmark after each.
4. If the score goes down, take that layer out. Do not assume the layer is good and your benchmark is bad. The benchmark is right more often than you think.
5. Try the same ladder on a smaller model. The thing that helps Sonnet may hurt Haiku. Knowing which side of the line you are on saves you money.

This sounds obvious. It is not what most teams do. Most teams read a blog post about Context Engineering, add four layers in one weekend, and never measure whether the layers actually helped.

## The chef and the kitchen, revisited

In the cheap-model post I wrote that the model is the chef and the context is the kitchen. I want to extend that.

Adding more context layers is like installing more kitchen equipment. A second oven. A pasta machine. A sous-vide. None of them make the chef worse at cooking pasta. But if the pasta machine takes up the counter space where the chef was chopping vegetables, the dinner gets worse anyway.

The chef does not need every appliance. The chef needs the right ingredients within reach.

Before you read the next breathless post about Full Context Engineering and start adding layers, run the experiment. Measure RAG alone. Measure RAG plus one thing. Find the layer that earns its keep, and leave the rest in the catalog.

The answer is almost always: do RAG well first. Everything else is decoration. Decoration that, on a small model, can flip the sign on your accuracy score and leave you wondering why.

The next time someone says "Context Engineering," what I want to say back is: please define which 20 percent of context you mean. The other 80 has a good chance of making things worse.

That second half has a mirror image worth reading: instead of stacking layers on, I later [pruned raw tool outputs off](https://kenimoto.dev/blog/stopped-adding-context-pruned-tool-outputs-accuracy-returned/) and watched a 3-hour task stop forgetting its own plan. Same window, opposite direction. Adding the right layer and removing the wrong noise are the two ends of the same lever.

---

## Want to go deeper?

The full Context Engineering system (five strategies, the RAG benchmarks behind these numbers, MCP server design, and the Agentic RAG implementation) is in **[Turning LLMs from Liars into Experts: Context Engineering in Practice](https://kenimoto.dev/books/context-engineering)**.
