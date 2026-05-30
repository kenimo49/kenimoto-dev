---
title: "Turning LLMs from Liars into Experts"
subtitle: "Context Engineering in Practice"
description: "Why does the same question give wildly different answers? Not your prompt — your context. Original benchmarks show up to 4.6x quality gain. The complete Context Engineering system: 5-stage strategy, RAG, MCP, CLAUDE.md, Agentic RAG."
lang: "en"

kindle_url: "https://amzn.asia/d/04OYOGkH"

published_date: 2026-02-15
updated_date: 2026-04-10

cover_image: "/images/books/context-engineering-en.png"

topics:
  - "Context Engineering"
  - "RAG"
  - "MCP"
  - "LLM"
  - "Benchmarks"

keywords:
  - "Context Engineering"
  - "Context Engineering tutorial"
  - "Context Engineering in practice"
  - "RAG implementation"
  - "RAG benchmark"
  - "MCP server"
  - "Model Context Protocol"
  - "LLM hallucination"
  - "Agentic RAG"
  - "CLAUDE.md design"

tagline: "Context Engineering in Practice | RAG · MCP · CLAUDE.md · Agentic RAG, benchmarked end to end"
hero_message: "Larger models just lie more convincingly. RAG raises answer quality by 4.6x. This book proves Context Engineering with original benchmarks — not vibes."
series_role: "Standalone — the Context Engineering discipline (separate axis from the Harness Trilogy)"

outcomes:
  - "Master a 5-stage context strategy that lifts answer quality by 2.2x or more"
  - "Understand why RAG accounts for 80% of the gain — and where the breakthrough point lives"
  - "Design and operate an MCP (Model Context Protocol) server"
  - "Apply staged CLAUDE.md design patterns to optimize project context"
  - "Implement Agentic RAG in Python end to end"

target_readers:
  - "[Intermediate engineer] Looking for the next step beyond prompt engineering"
  - "[LLM evaluator] Trying to choose between RAG and MCP with confidence"
  - "[Hallucination wrangler] Frustrated that even large models still get things wrong"
  - "[Claude Code user] Want to learn staged CLAUDE.md design"
  - "[AI agent builder] Need to implement Agentic RAG in production"
  - "[Benchmark-driven] Want quantitative comparisons between context strategies"

position_statement:
  - "Benchmark-first (a 4.6x quality gap proven by original experiments)"
  - "Context Engineering specialist (a separate axis from prompts and harnesses)"
  - "Intermediate level (assumes you've used an LLM before — not an RAG primer)"
  - "Code-included (96 production-quality Python files published on GitHub)"

differentiation:
  - "Original benchmarks prove that context strategy moves quality by 4.6x"
  - "Shows experimentally that larger models lie more convincingly, and that small model + RAG beats a large model alone"
  - "Covers RAG, MCP, CLAUDE.md, and Agentic RAG in a single coherent volume"
  - "96 production-quality code files on GitHub, fully reproducible"
  - "Connects directly to Claude Code via staged CLAUDE.md design"

pain_points:
  - "Prompts are tuned but answer quality still swings"
  - "RAG is implemented but it's unclear whether it's actually working"
  - "Can't tell when to reach for MCP servers vs plain RAG"
  - "CLAUDE.md is in the repo but it's unclear what to put in it"
  - "Heard of Agentic RAG but unsure how it differs from regular RAG"
  - "Switching LLMs keeps changing answer quality unpredictably"

competitor_comparison:
  - book: "Prompt engineering books"
    difference: "Focuses on the layer below prompts — context design. Picks up where prompt engineering ends."
  - book: "RAG primers"
    difference: "Goes beyond RAG alone, integrating RAG, MCP, CLAUDE.md, and Agentic RAG into one Context Engineering system."
  - book: "Vendor official documentation (OpenAI, Anthropic, etc.)"
    difference: "Original benchmarks show how much things actually change — quantitatively, not qualitatively."

related_books:
  - "claude-code-mastery"
  - "harness-engineering-guide"

related_articles:
  - slug: "cheap-model-won-context-beats-parameters"
    title: "The Cheap Model That Won — Why Context Beats Parameters"

chapters:
  - title: "Cover"
    free: true
  - title: "Introduction"
    free: true
    sub_chapters:
      - "To you, the reader who picked up this book"
      - "What the experiment turned up"
      - "How this book is organized"
      - "About \"AI Practice Series for Engineers\""
      - "Who this book is for"
      - "How to read this"
  - title: "Five Answers — the same question, five patterns"
    free: true
    sub_chapters:
      - "A 2.2× quality gap, from one experiment"
      - "PropelAuth: asking a fictional internal tool"
      - "Why a fictional tool"
      - "What the four-axis evaluation means"
      - "Why the same LLM produces 2.2× different quality"
      - "What this means for production"
      - "How this book is structured, and your learning path"
  - title: "LLMs Lie — the anatomy of hallucination"
  - title: "How Context Engineering Began"
  - title: "First Steps — from zero-shot to strategy"
  - title: "Few-Shot — examples that lift quality"
  - title: "RAG — the technique that owns 80% of the gain"
  - title: "Full Context Engineering — integrating the 5 stages"
  - title: "MCP — Model Context Protocol server design"
  - title: "Memory — context that persists"
  - title: "(continues — 22 chapters plus Appendix A)"

cta_label: "Read on Kindle"
---

The same question keeps giving you wildly different answers. The cause isn't your prompt. It's your **context**.

This book runs original benchmarks across three fictional internal tools and shows that the way you supply context can swing answer quality by up to **4.6x**. Larger models, it turns out, just lie more convincingly. A small model with RAG can outperform a large model on its own. From those findings the book builds the full Context Engineering picture.

Five context strategies, RAG (the technique that owns 80% of the gain), MCP server design, staged CLAUDE.md design, and Agentic RAG implementation. The next move beyond prompt engineering — grounded in experimental data and 96 production-quality code files.

> "Larger models just lie more convincingly. So feed them the truth through context."
