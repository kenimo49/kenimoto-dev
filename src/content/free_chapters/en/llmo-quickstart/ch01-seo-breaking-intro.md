---
title: "The Day SEO Breaks — Three Paths for AI to Find Your Content"
---

> **Your SEO efforts: AI isn't watching.**

## Introduction: Why LLMO Now?

I'm a software engineer with 8 years of experience, currently working on AI agent development and operations. One day, I noticed that when my AI agent searched for information, it was using **Brave Search**, not Google.

This was shocking. The search engine I had been optimizing for with SEO measures was completely different from the search engine AI was actually using.

Upon investigation, this wasn't just a story about my agent. Anthropic's Claude uses Brave Search, ChatGPT uses Bing, and Gemini uses Google Search as their search backends. Different AI tools use different search infrastructure.

More importantly, user behavior itself is changing.

- **52%** of American adults use AI LLMs like ChatGPT (Elon University March 2025 survey)
- Gartner predicts **traditional search engine traffic will decrease by 25% by 2026** (announced February 2024)
- CTR for Google search #1 results **dropped 34.5%** with AI Overviews display (Ahrefs survey)

From "10 blue links" to "1 AI answer." This change is irreversible. Once users experience "AI gives you an instant answer," they don't go back.

The optimization technique for this new era is **LLMO (Large Language Model Optimization)**.

## What is LLMO?

LLMO is a technique for optimizing your content to be referenced and cited in the responses of large language models like ChatGPT, Claude, Gemini, and Perplexity.

While traditional SEO aimed to "rank high on Google search result pages," LLMO aims to "be cited as an information source in AI answers."

Let me clarify some similar terms:

- **LLMO**: Large Language Model Optimization. This book uses this term.
- **GEO (Generative Engine Optimization)**: Optimization for generative AI engines overall. Academically, this is the standard.
- **AIO (AI Optimization)**: Optimization for AI in general. Relatively used in Japan.
- **AEO (Answer Engine Optimization)**: Answer engine optimization. A slightly narrower concept than GEO.

All these terms essentially mean the same thing: "optimization to get your content cited in AI answers."

## SEO Doesn't Die, But SEO Alone Isn't Enough

Let me share something important first: **SEO doesn't die.**

Google still holds about 90% search market share. However, traffic via AI is orders of magnitude higher in quality.

- LLM-sourced visitors can have conversion rates up to **23 times higher** than organic search (Ahrefs survey)
- AI-sourced conversion rate is **11.4%** vs organic search's **5.3%** (SimilarWeb)
- AI-sourced referral traffic increased **357% year-over-year** (SimilarWeb)

Low volume but overwhelmingly high quality. This is the characteristic of AI search traffic. And this "volume" is increasing at hundreds of percent annually.

**Stack LLMO on top of SEO.** This is the basic strategy for information dissemination on the web from now on.

## Three Paths for Information to Reach LLMs

The most important thing in understanding LLMO is "how LLMs learn about your content." There are three main paths.

### Path 1: Training Data (Long-term: 6 months to 2 years for effects)

LLMs like GPT-4 and Claude are pre-trained on massive text datasets. Information included in this training data becomes the model's "memory."

The important point is that **not all web pages are treated equally**. In GPT-3's training data, Wikipedia and WebText2 (links from Reddit posts with 3+ upvotes) were given **5-6 times the training weight**.

This means content that Reddit communities deem "valuable" is strongly etched into LLM memory.

However, training data has cutoff dates. Content published today will be reflected at the earliest in several months. That's why this is "long-term."

### Path 2: RAG (Medium-term: 1-3 months for effects)

RAG (Retrieval-Augmented Generation) is a mechanism where LLMs perform real-time web searches to supplement information not in their "memory," then generate answers based on retrieved information.

ChatGPT's "Browse with Bing," Perplexity's web search, Google AI Overviews: these are all RAG. **Citation URLs in AI answers mainly come through this RAG path.**

A particularly important concept in RAG is **Query Fan-out**. When a user asks one question, RAG systems internally break it down into multiple sub-queries for searching.

For example, "Should startups use HubSpot?" expands into sub-queries like:

- "HubSpot startup pricing"
- "HubSpot alternatives comparison"
- "startup CRM recommendations"

SurferSEO analysis shows content ranking for sub-queries is **49% more likely to be cited** than content only ranking for main queries. This means creating content structure that catches peripheral keywords like "HubSpot pricing" and "HubSpot alternatives" significantly increases the probability of being selected for AI answers.

Another important point is that LLMs evaluate content **by passages (paragraphs), not entire pages**. Even if an SEO #1 page has answers buried in long text, AI won't cite it. Conversely, pages with low SEO rankings can be cited if specific paragraphs accurately answer questions.

### Path 3: Real-time Search by AI Agents (Immediate: 1-3 months)

The third path is independent web searches performed by AI agents.

Microsoft's discontinuation of external Bing Search API access in 2025 made **Brave Search effectively the only choice** for independent search APIs. Claude, Perplexity, and many AI coding assistants use Brave Search API.

What's important here is that **Google's index differs from Brave's index**. Pages ranking #1 on Google sometimes can't be found on Brave. To capture traffic via AI agents, you need to consider visibility on Brave Search as well.

## Optimization Priority for the Three Paths

Which path should you start with? I recommend the following priority:

| Condition | Priority Path | Time to Effect |
|-----------|---------------|----------------|
| Rich existing content | Path 2 (RAG optimization) | 1-3 months |
| Planning new content | Path 2 + Path 3 | 3-6 months |
| Want to increase brand awareness | Path 1 (training data) | 6 months-2 years |
| Operating tech tools/OSS | Path 3 (agent search) | 1-3 months |

The most efficient approach is **starting with Path 2 (RAG) optimization, then spreading to Paths 3 and 1**. Improving content structure affects all paths.

## Why Engineers Should Do LLMO

You might think "Isn't this a marketer's job?" No. LLMO is fundamentally an engineering problem.

- Understanding LLM architecture
- Content design considering RAG's Query Fan-out
- JSON-LD structured data implementation
- AI crawler control via `llms.txt` and `robots.txt`
- Python script monitoring automation

All of these belong to engineers' skill sets.

Furthermore, we engineers are also "stakeholders" in LLMO. When doing technical research with Claude Code, comparing libraries with Perplexity, we're AI search users. Simultaneously, when writing technical blogs or OSS documentation, we're also AI search content providers.

Engineers with both perspectives can best understand and effectively practice LLMO.

## Chapter Summary

- **AI agents search with Brave Search, not Google**. SEO premises are collapsing
- **Three paths for information to reach LLMs**: training data (long-term), RAG (medium-term), AI agent search (immediate)
- **SEO doesn't die, but SEO alone isn't enough**. Need hybrid strategy stacking LLMO on SEO
- **LLMO is fundamentally an engineering problem**. Technical understanding is essential
- **Most efficient starting point is RAG optimization**. Begin with content structure improvement

## Next Actions

- [ ] Check your company website's `robots.txt` to ensure AI crawlers (GPTBot, ClaudeBot, etc.) aren't blocked
- [ ] Search your company name on ChatGPT or Perplexity to see what appears
- [ ] Check if your company website appears on Brave Search

In the next Chapter 2, I'll explain specific LLMO techniques you can implement today: setting up `llms.txt` and implementing structured data (JSON-LD).
