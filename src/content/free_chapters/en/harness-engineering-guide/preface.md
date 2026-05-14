---
free: true
title: "Preface — Why 'Harness,' and Why Now"
---

![A harness — the tack that controls the power of AI](/images/books/harness-engineering-guide/harness-horse.jpg)

## A Tuesday at 3 a.m.

3 a.m. on a Tuesday. The on-call engineer at one team gets jolted awake by a PagerDuty alert.

API costs have spiked. They check the dashboard: over $400 burned in the past hour. Digging in, they find that an AI agent deployed the day before has been hammering an unstable API with retries. Every error sends it back into the "let me try again" loop, and it ran like that until morning.

The agent wasn't the problem. The model was fine. The prompt was carefully written. What was missing was a **harness**. They told the agent "run," but never gave it brakes or a steering wheel.

This story isn't unusual. There's a phrase that gets passed around the field:

> **"The model is commodity. The harness is moat."**

When an agent that worked perfectly in a demo breaks in production, it's almost always a harness problem.

In February 2026, OpenAI published a blog post: "Harness engineering: leveraging Codex in an agent-first world."

Here's what it said: for five months, an engineering team didn't write a single line of code by hand. They built a production application of over a million lines using Codex agents alone. Build time: one-tenth of writing it manually.

"Humans steer. Agents execute."

Engineers didn't get their jobs taken. The definition of the job changed.

That post lit the fuse. Then came the "$47,000 retry storm" report from a weekend in February 2026. A data-enrichment agent misinterpreted an API error code as "retry with different parameters" and made 2.3 million API calls. Monday morning, engineers came back to a $47,000 bill. Nice that the agent worked over the weekend, but not great when the deliverable is zero and the invoice still arrives. A few days later Anthropic published two harness-design guides. LangChain defined "Agent = Model + Harness." Martin Fowler wrote a commentary. An academic paper went up on arXiv.

2024 was the year of Prompt Engineering. The era of polishing "what to ask AI."

2025 was the year of Context Engineering. Andrej Karpathy said "The hottest new programming language is English," and the work shifted to designing "what to show the AI."

In 2026, the scope widens to Harness Engineering. "How do you design the entire environment the agent operates in?"

But the term gets interpreted slightly differently depending on who's writing. OpenAI and Anthropic emphasize different things. LangChain and Martin Fowler approach it from different angles. The academic papers come at it from yet another direction.

This book gives a structured overview of Harness Engineering.

- The relationship between the three engineering practices (Prompt / Context / Harness)
- How the major players (OpenAI / Anthropic / LangChain / Martin Fowler / academics) interpret it differently
- The anatomy of the six building blocks
- How it sits next to related ideas (Vibe Coding / Spec Coding / Agent Frameworks)
- Practical case studies from the Japanese-speaking community
- Where it's all going

It's both a concept-organization book and a hands-on guide you can use tomorrow. My goal is simple: when someone asks "okay, but what *is* a harness?", you can hand them this book as a clear answer.

## Who this book is for

- Engineers who have started using AI agents (Claude Code, GitHub Copilot, Cursor, etc.)
- People who have written an AGENTS.md or CLAUDE.md but aren't sure if they got it right
- People who know Prompt Engineering but are hearing "Harness Engineering" for the first time
- Managers and tech leads who want to bring AI agents into their team

The only prerequisite is the basics of Prompt Engineering. Having heard of Few-shot and Chain-of-Thought is enough.

## How to read this book

You can read it cover to cover, or jump to the chapters you find interesting. That said, three chapters are worth reading no matter what:

- **Chapter 1**: understand how the three engineering practices relate (the map of the territory)
- **Chapter 8**: learn the six building blocks (the skeleton of practice)
- **Chapter 11**: learn how to write AGENTS.md (something you can use tomorrow)
