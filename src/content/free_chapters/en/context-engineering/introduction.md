---
free: true
title: "Introduction"
---

# Introduction

## To you, the reader who picked up this book

**Bottom line: This book is a hands-on guide for getting the highest-quality output from an LLM by designing its context.**

"I asked ChatGPT something and got a confident answer back. Then I checked, and the whole thing was a lie."

Has that happened to you?

The protagonist of this book is the LLM. Picture it as a brilliant new hire on day one. Zero industry knowledge, but full of confidence. Hand it the right onboarding material and it becomes an immediate contributor.

:::message
**The new-hire analogy**: A top-tier graduate shows up on day one. You ask, "Can you tell me about our internal systems?" and they answer with general principles and intuition. They're sharp and learn fast. They just don't know anything about *this* company yet.
:::

If you've started using LLMs at work, you've probably hit this. You tweak the prompt. You assign a role. You add "please be accurate." And the AI keeps lying with confidence.

This book grew out of an experiment that took that problem head-on.

## What the experiment turned up

**Bottom line: What determines an LLM's output quality is the design of the context, not the size of the model.**

To investigate how AI behaves around "information it can't possibly know," I built three fictional internal tools and measured response quality across five context strategies.

The results were striking.

- With **no context**, the AI returned "plausible but completely fabricated answers"
- With **RAG (Retrieval-Augmented Generation)** injecting documentation, factual accuracy jumped from **zero to 4.8**
- The most surprising finding: **a smaller model with good context (score 11.8) crushed a larger model with no context (score 5.3)**

What determines an LLM's output quality isn't the size of the model or the cleverness of the prompt. It's **the design of the context**.

The discipline of designing that context systematically is **Context Engineering**.

---

## How this book is organized

The book is in three parts.

**Part 1, "What changes when context changes" (Chapters 1-4)**, walks through the experimental results and explains why Context Engineering is needed. Chapter 4 includes a hands-on exercise that improves a System Prompt directly. The point is to feel the effect with your hands before going deeper into theory.

**Part 2, "Five techniques, layered" (Chapters 5-9)**, covers the techniques that make up Context Engineering one by one: few-shot, RAG, MCP, memory, and so on. Each chapter ties back to the experimental data so you can see "if I add this technique, here's how the score changes," letting you reason about cost vs. benefit as you read.

**Part 3, "Context Engineering in the field" (Chapters 10-15)**, presents real-world patterns: CLAUDE.md design for Claude Code, Agentic RAG implementation, enterprise rollouts, and more.

Each chapter ends with a **🚀 Next Action**: one concrete thing you can do right after reading. The goal isn't to nod and move on. It's to leave you with something to try tomorrow.

## About "AI Practice Series for Engineers"

This is volume 2 of the "AI Practice Series for Engineers."

- **Volume 1: *Practical Claude Code***. The practice of AI-assisted coding.
- **Volume 2: *Context Engineering*** (this book). Getting AI to think correctly.

What the books share: **everything is grounded in what the author learned by actually doing the work**. The experimental data here is first-party data from real API calls, not citations of theory.

**This book stands alone. You can read it without having read volume 1.**

## Who this book is for

- Engineers who've started using LLMs at work
- Teams who deployed RAG and aren't satisfied with the accuracy
- Developers building AI agents
- Anyone wondering "what's the next thing to learn after prompting?"

The only prerequisites are basic Python and basic API knowledge. You don't need deep familiarity with LLM internals.

## How to read this

Reading straight through is recommended, but here are some shortcuts:

- **Just want the punchline** → Chapter 1 and Chapter 13
- **Want to improve RAG** → Chapter 6 and Chapter 7
- **Want to use Claude Code well** → Chapter 10
- **Considering enterprise adoption** → Chapter 12 (a and b)

With that, let's step into the world of Context Engineering.
