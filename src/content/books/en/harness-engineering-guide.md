---
title: "Harness Engineering"
subtitle: "From Using AI to Controlling AI"
description: "Harness Engineering, mapped across the 5 interpretations from OpenAI, Anthropic, LangChain, Martin Fowler, and academia. The first systematic guide that distills the 6 building blocks, the AGENTS.md/CLAUDE.md/hooks implementation patterns, and Self-Evolving Agents — the practical reference for the 2026 keyword."
lang: "en"

kindle_url: "https://a.co/d/0hD6MvVu"

published_date: 2026-03-15
updated_date: 2026-04-20

cover_image: "/images/books/harness-engineering-guide-en.jpg"

topics:
  - "Harness Engineering"
  - "AI Agent"
  - "AGENTS.md"
  - "CLAUDE.md"
  - "Self-Evolving Agent"

keywords:
  - "Harness Engineering"
  - "Harness Engineering tutorial"
  - "what is Harness Engineering"
  - "AGENTS.md examples"
  - "AGENTS.md best practices"
  - "CLAUDE.md hooks"
  - "Self-Evolving Agent"
  - "AI agent design"
  - "OpenAI Codex"
  - "Agent Framework comparison"

tagline: "Five interpretations from OpenAI, Anthropic, LangChain, Martin Fowler, and academia — merged into one system for engineers running AI agents in production"
hero_message: "Your AI agent runs. Does it obey? OpenAI, Anthropic, and LangChain each define harness differently. This book merges all 5 interpretations into one system."
series_role: "Harness Trilogy [Architecture]. Defining what a harness is, across 5 interpretations."

outcomes:
  - "Decompose any harness into the 6 building blocks framework"
  - "Choose between AGENTS.md, CLAUDE.md, and hooks for each task"
  - "Compare interpretations from OpenAI Codex, Anthropic, LangChain, Martin Fowler, and academia in one place"
  - "Implement Self-Evolving Agent patterns (self-improving harness)"
  - "Place tools like Vibe Coding, Spec Coding, and Agent Frameworks on a clear technology map"

target_readers:
  - "[AI Agent Developer] Want the systematic view of harness as the 2026 keyword"
  - "[Claude Code User] Ready for the layer above CLAUDE.md"
  - "[Tech Lead] Designing AI agent ops across an entire team"
  - "[Researcher] Comparing OpenAI, Anthropic, and LangChain interpretations side-by-side"
  - "[Self-Evolving Curious] Looking to build self-improving agents"
  - "[Tool Picker] Mapping Vibe Coding, Spec Coding, and Agent Frameworks"

position_statement:
  - "Cross-vendor (5 interpretations compared in one book — first of its kind)"
  - "Implementation-focused (not just theory — concrete AGENTS.md / hooks examples)"
  - "Intermediate to advanced (Claude Code / CLAUDE.md basics assumed)"
  - "Harness-specific (single topic, 19 chapters of depth)"

differentiation:
  - "First book to integrate the 5 interpretations from OpenAI, Anthropic, LangChain, Martin Fowler, and academia"
  - "Six-building-block framework for systematizing 'what is harness?'"
  - "Goes all the way to Self-Evolving Agents (self-improving harness) and future predictions"
  - "Real implementation patterns for AGENTS.md / CLAUDE.md / hooks with concrete examples"
  - "Built on a Zenn article that drew 12,000 views — this is the full-fledged version"

pain_points:
  - "I hear 'Harness Engineering' a lot but can't actually explain what it is"
  - "OpenAI and Anthropic seem to define it differently"
  - "The line between AGENTS.md and CLAUDE.md feels blurry"
  - "I don't know when to reach for hooks"
  - "Self-Evolving Agent design patterns aren't clear to me"
  - "The boundary between harness and Agent Frameworks (LangChain etc.) is murky"

competitor_comparison:
  - book: "Vendor docs (OpenAI / Anthropic / LangChain)"
    difference: "Not single-vendor view. This integrates 5 interpretations and explains why they disagree."
  - book: "Prompt / Context Engineering books"
    difference: "Tackles the layer above prompt and context — the third tier of the stack."
  - book: "Agent Framework guides (LangChain Agents etc.)"
    difference: "Not framework-specific. Maps the boundary between harness and Agent Frameworks."

related_books:
  - "claude-code-mastery"
  - "harness-code-review"

related_articles:
  - slug: "cheap-model-won-context-beats-parameters"
    title: "How a Cheaper Model Won — Context Beats Parameters"

chapters:
  - title: "Preface — Why 'Harness' now"
    free: true
    sub_chapters:
      - "A Tuesday at 3 a.m."
      - "Who this book is for"
      - "How to read this book"
  - title: "The Three Engineerings (Prompt → Context → Harness)"
    free: true
    sub_chapters:
      - "Why 40% fail"
      - "Timeline"
      - "What makes the three different"
      - "A nesting structure"
      - "\"Replaced\" or \"layered\"?"
      - "Why now?"
  - title: "Harness Engineering: Definition and Big Picture"
    free: true
    sub_chapters:
      - "What \"works in the demo, breaks in production\" really means"
      - "Where the word \"harness\" comes from"
      - "Distinguishing it from \"test harness\""
      - "Comparing the definitions"
      - "What they all agree on"
      - "This book's working definition of Harness Engineering"
      - "What goes wrong without a harness"
      - "The decisive difference from Prompt Engineering"
  - title: "OpenAI's Take — Codex and the million-line experiment"
  - title: "Anthropic's Take — Harness for long-running agents"
  - title: "LangChain's Take — Agent = Model + Harness"
  - title: "Martin Fowler's View — The implicit harness in every codebase"
  - title: "The Academic View — arXiv papers and formal specification"
  - title: "The Six Building Blocks — Anatomy of a harness"
    free: true
  - title: "Technology Map — Vibe Coding / Spec Coding / Agent Framework"
  - title: "Reconciling the Differences — What everyone agrees and disagrees on"
  - title: "AGENTS.md / CLAUDE.md Practical Design"
  - title: "Hooks / Lifecycle / Feedback Loops"
  - title: "Self-Evolving Agent — A harness that improves itself"
  - title: "The Future of Harness Engineering"
  - title: "Afterword"
  - title: "References"
    free: true
  - title: "About the Author"
    free: true
  - title: "Colophon"
    free: true

cta_label: "Read on Kindle"
---

The phrase *Harness Engineering* is everywhere, and means something different to everyone. OpenAI talks about scaling Codex. Anthropic talks about long-running agents. LangChain frames it as `Agent = Model + Harness`. Martin Fowler points out that every codebase already has an implicit harness.

Each of them is right. But until now, no book has stitched these views into a single system.

This book maps **what a harness is, how to design one, and how to operate it**. It synthesizes the 5 interpretations into 6 building blocks, then walks through implementation with AGENTS.md, CLAUDE.md, and hooks, all the way to Self-Evolving Agents.

> "Prompt was 2024. Context was 2025. Harness is 2026."
