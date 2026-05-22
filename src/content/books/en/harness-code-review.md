---
title: "Systematizing AI Code Review"
subtitle: "The 3-Layer Model for 60% Faster Reviews"
description: "Code review time keeps inflating because humans are doing the mechanical work. This book splits the job across three layers — hooks (machines), AI (first pass), and humans (architectural judgment) — and shows the actual implementation that cut review time by 60%. Includes integrated operation of CodeRabbit, GitHub Copilot, and Claude review, AGENTS.md policy design, GitHub Actions pipelines, and an autoFixable feedback loop, all backed by a Next.js + TypeScript reference project."
lang: "en"

kindle_url: "https://www.amazon.com/Systematizing-AI-Code-Review-Propel-Lab-ebook/dp/B0GX71K2BV"

published_date: 2026-04-21
updated_date: 2026-04-21

cover_image: "/images/books/harness-code-review.png"  # TODO: replace with -en variant when generated

topics:
  - "Code Review Automation"
  - "Harness Engineering"
  - "CodeRabbit"
  - "GitHub Actions"
  - "Team Development"

keywords:
  - "AI code review"
  - "code review automation"
  - "CodeRabbit GitHub Copilot"
  - "AI developer tools"
  - "AGENTS.md review policy"
  - "GitHub Actions CI pipeline"
  - "Conventional Comments"
  - "pull request workflow optimization"
  - "Claude review"
  - "software engineering best practices"

tagline: "AI code review automation | hooks design · CodeRabbit setup · Conventional Comments · GitHub Actions pipeline"
hero_message: "Who reviews the code that AI just wrote? Split the work into three layers — hooks (machines), AI (first pass), humans (design judgment) — and review time drops 60%."
series_role: "Harness Trilogy [Quality] — turning review into a system"

outcomes:
  - "Split review across hooks, AI, and humans with a clear role for each"
  - "Encode review policies in AGENTS.md and operate CodeRabbit/Copilot/Claude as a unit"
  - "Embed Conventional Comments into the harness so comment intent becomes machine-readable"
  - "Build an AI review pipeline on GitHub Actions"
  - "Design an autoFixable loop that feeds review findings back into AGENTS.md"

target_readers:
  - "[Tech lead] Review time is ballooning and you want to cut it"
  - "[Mid-size team developer] Trying to balance review quality and speed"
  - "[AGENTS.md author] Want to encode review policies into your harness"
  - "[CI/CD maintainer] Looking to plug AI review into GitHub Actions"
  - "[Tool selector] Trying to map out CodeRabbit / Copilot / Claude responsibilities"
  - "[Startup CTO] Need to maintain quality and velocity with a small team"

position_statement:
  - "Implementation-first (Next.js + TypeScript reference project, end to end)"
  - "Mid-size team focus (5–30 people — not solo, not enterprise review culture)"
  - "Harness-aware (treats AGENTS.md and review design as one system)"
  - "Tool-agnostic (integrated operation of CodeRabbit, Copilot, and Claude)"

differentiation:
  - "First book to systematize review around the '3-Layer Model' framework"
  - "Concrete patterns for running CodeRabbit, Copilot, and Claude together"
  - "Combines AGENTS.md with Conventional Comments for machine-readable intent"
  - "autoFixable loop returns review findings back into the harness itself"
  - "Publishes a full review pipeline for a real Next.js + TypeScript project"

pain_points:
  - "Reviews keep stalling on formatting and naming nits"
  - "Tried AI review tools but the human/AI split never feels right"
  - "Can't tell what CodeRabbit, Copilot, and Claude are each best at"
  - "Want a concrete example of review policies inside AGENTS.md"
  - "Don't have a working blueprint for AI review on GitHub Actions"
  - "AI review accuracy is too low so humans end up doing it again anyway"

competitor_comparison:
  - book: "General code review books (e.g., Code Review Best Practices)"
    difference: "Focused on operating with AI in the loop. Systematizes the hooks/AI/human split rather than treating them as separate concerns."
  - book: "Tool docs (CodeRabbit, Copilot, etc.)"
    difference: "Not single-tool. Provides patterns for running three tools together with concrete implementation."
  - book: "General Harness Engineering books"
    difference: "Zooms in on the quality-verification layer of the harness. Goes deep on AGENTS.md integration specifically."

related_books:
  - "harness-engineering-guide"
  - "claude-code-mastery"
  - "context-engineering"

related_articles:
  - slug: "claude-code-skills-reusable-workflow-pattern"
    title: "Claude Code Skills as a Reusable Workflow Pattern"

chapters:
  - title: "Introduction — turning review into a system"
    free: true
  - title: "Embedding code review in the harness's quality-verification layer"
    free: true
  - title: "The 3-Layer Review Model — automated / AI / human"
    free: true
  - title: "Layer 1: gates enforced by hooks and CI"
  - title: "Layer 2: introducing AI review by design"
  - title: "Layer 3: narrowing human review to design and direction"
  - title: "Writing review policy into AGENTS.md"
  - title: "Embedding Conventional Comments in the harness"
  - title: "Automating PR templates and review checklists"
  - title: "Setting up CodeRabbit"
  - title: "Adding more AI reviewers: Copilot and Claude"
  - title: "Building a review pipeline on GitHub Actions"
  - title: "The autoFixable pattern — automating mechanical fixes"
  - title: "Feedback loops — returning review findings to AGENTS.md"
  - title: "Measuring and improving review metrics"
  - title: "Reference implementation: harness review for a Next.js + TypeScript project"
  - title: "Closing — review is the heart of the harness"
  - title: "References"
  - title: "About the Author"
  - title: "Colophon"

cta_label: "Read on Kindle"
---

Spending review time on formatting issues is like a chef washing dishes. Reviews stall because humans are doing the mechanical work.

This book splits the job across three layers: **hooks (machines) → AI review (first pass) → humans (design judgment)**. The same split, in a real production project, dropped review time by 60%.

Run CodeRabbit, GitHub Copilot, and Claude as a coordinated team. Encode the policy in AGENTS.md. Wire the pipeline through GitHub Actions. And let the autoFixable loop feed review findings back into AGENTS.md so the harness itself keeps getting sharper.

> "Humans focus on design and direction. Everything else, the machines handle."
