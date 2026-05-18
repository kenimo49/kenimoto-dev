---
title: "OpenClaw Hit 250K Stars Faster Than React. I Spent a Day Switching From Claude Code"
description: "OpenClaw passed 250K GitHub stars in 60 days. I spent 24 hours moving my dev setup off Claude Code to find out what actually breaks. SOUL.md, Gateway, ClawHub, and a quiet 3pm where I almost gave up."
date: 2026-05-10
lang: en
tags: [ai, openclaw, claudecode, agents]
featured: false
canonical_url: "https://kenimoto.dev/blog/openclaw-vs-claude-code-24h/"
og_image: "https://kenimoto.dev/images/blog/openclaw-vs-claude-code-24h/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/openclaw-hit-250k-stars-faster-than-react-i-spent-24-hours-trying-to-like-it-379a
---

I switched my entire dev setup from Claude Code to OpenClaw on a Tuesday morning. By 11am I was googling "how to remove openclaw". By 6pm I had written a SOUL.md file longer than the actual feature I was shipping.

This post is about that day. About what broke, what didn't, and what 24 hours of working in the terminal agent that is now technically the most-starred open-source project in GitHub history bought me.

Yes, I am the engineer who [wrote about Claude Code Skills three weeks ago](/blog/claude-code-skills-reusable-workflow-pattern/) and called the workflow pattern "settled for at least a year". Then OpenClaw passed React's all-time star count in 60 days, Peter Steinberger announced he was joining OpenAI to ship agents to everyone, and the launch tweet went past 4 million views. Settled, apparently, was a one-month forecast.

## The numbers I had to verify before believing them

Let me get the facts out of the way, because half of what people quote on Twitter about OpenClaw is wrong by a factor of two.

- OpenClaw crossed 250,000 GitHub stars on March 3, 2026, surpassing React for the all-time most-starred software repository
- 60 days from launch to 250K. React took roughly a decade
- 60K stars in the first 72 hours. That part is the one nobody actually believes the first time
- Peter Steinberger announced on February 14, 2026 that he is joining OpenAI to work on agents, with OpenClaw moving to a foundation to stay open and independent
- One mid-sized refactor session in my test run consumed 920K tokens, which on Claude 4.5 Sonnet billing came out to about USD 8.30

The Hacker News thread when it crossed React was the most upvoted submission of the week. The top comment was "this is either the best thing that happened to dev tools in five years or the most expensive way to learn what `--yolo` does".

It is, somehow, both.

## The setup, and the part I underestimated

Installation took less than a minute.

```bash
curl -fsSL https://get.openclaw.dev | sh
export ANTHROPIC_API_KEY=sk-ant-...
openclaw
```

The first surprise: OpenClaw asked me which model I wanted as default. I had four serious choices, plus Ollama for local models.

```bash
openclaw --model claude-4.5-sonnet
openclaw --model gpt-4o
openclaw --model gemini-2.5-pro
openclaw --model ollama/devstral:24b
```

Claude Code has a backend model. OpenClaw has a backend model dropdown. That is not a small UX difference when you are trying to land a refactor for less than ten dollars.

The second surprise: when I ran my first command, the agent asked me where the SOUL.md file was. I did not have one. It happily generated a default. The default was generic enough that I closed the session, opened my editor, and started writing my own. That is when the day quietly stopped being a benchmark and started being a personality test.

## SOUL.md is the part nobody warned me about

Here is the SOUL.md I ended the day with, after rewriting it three times.

```markdown
# SOUL.md
You are a senior backend engineer with strong opinions and short patience for code
that talks more than it does.

- Prefer Python over TypeScript when both fit. We're not building a frontend here.
- Never add a feature without a test. If the test would take more than 10 minutes
  to write, ask first instead of writing it.
- Performance matters but readability matters more. We're a four-person team, not
  Google.
- Do not write conversational filler. "Sure, I'll do that" is not output. Output
  is the diff.
- When in doubt, ask. Don't guess. Guessing once cost us a weekend.
```

The thing the docs do not tell you: SOUL.md is not a config file. It is a contract. CLAUDE.md tells Claude Code what the project is. SOUL.md tells OpenClaw who the agent is. They are two different shapes of the same trust problem, and the day I figured that out was the day OpenClaw stopped feeling worse than Claude Code and started feeling different.

I had a Claude Code session open in another window all day for a sanity check. By 4pm I noticed my CLAUDE.md was 312 lines and my SOUL.md was 14. The SOUL.md was doing more work per line.

## The Gateway, and why my LGPD-anxious teammate cared

OpenClaw routes every LLM call through a local process called the Gateway.

![OpenClaw Gateway architecture: CLI sends requests to a local Gateway, which dispatches to LLM providers, the skill execution engine, and the host filesystem and shell](/images/blog/openclaw-vs-claude-code-24h/gateway-architecture.png)

The Gateway sits on your machine. Your prompts and code do not pass through an OpenClaw-operated cloud relay on the way to Anthropic, OpenAI, or whoever. They go straight from your laptop to the model provider you picked.

Claude Code does not have an equivalent intermediary, but it also does not need one because Anthropic is the only provider. The moment you have multi-provider support, you either need a relay (vendor lock-in risk) or a local gateway (the OpenClaw choice).

A teammate of mine who lives in Brazil and spends meaningful time worrying about LGPD compliance pinged me at lunch to ask what the network diagram looked like. He liked what I sent him. That conversation alone might be worth the day.

## ClawHub vs Claude Code Skills

Claude Code Skills are markdown files plus optional resources, distributed however you distribute markdown. ClawHub is an npm-style package marketplace for OpenClaw skills.

```bash
openclaw skills search "docker"
openclaw skills install @clawhub/docker-manager
openclaw skills list
```

ClawHub had several thousand skills the day I tried it. The numbers Steinberger throws around at conferences are higher and probably accurate, but the count moves fast enough that any specific figure is wrong by the time you publish it.

Two real differences I felt:

1. ClawHub skills are JavaScript. They run in a sandbox but can request shell exec privileges. That makes them more capable than Claude Code Skills and more dangerous. The ClawHavoc incident in March of 2026 saw 341 malicious skills caught, which is a real cost of an open marketplace
2. Claude Code Skills are simpler to author. I wrote a Skill in 20 minutes my first time. The equivalent ClawHub skill took me about 90 minutes because I had to learn the SDK conventions

If you are an individual developer wanting to share a workflow, Skills are easier. If you are a team wanting a versioned, packaged, audited tool, ClawHub is better. They are not competing for the same problem.

## The 3pm moment where I almost stopped

I asked OpenClaw to update some Python 3.8 code to 3.11 across a small repo, run the test suite, and report back.

It did. The session ate 920K tokens, took about 14 minutes, found three places where my colleague had used the walrus operator wrong, and quietly fixed them. I checked the diff. It was right.

Claude Code does the same thing. I have run the same prompt against it many times.

The difference was not the output. The difference was that Claude Code is in my muscle memory. I have typed `claude` three times a day for a year. When I typed `openclaw` and waited the extra 1.2 seconds for the cold start, my fingers reached for `claude` instead. Three times.

That is the part nobody writes about. Switching costs are not just config. They are reflexes. By 3pm I had written half a SOUL.md, almost given up, made coffee, and come back. By 6pm I was OK again.

## What I would actually use each one for

I built this matrix during the second coffee.

| Decision | OpenClaw | Claude Code |
|---|---|---|
| Locked into Anthropic models? | No, multi-provider | Yes, Anthropic only |
| Local model option | Ollama | None official |
| Skill distribution | ClawHub package marketplace | Markdown files |
| Personality file | SOUL.md (who is the agent) | CLAUDE.md (what is the project) |
| Network architecture | Local Gateway, no relay | Direct to Anthropic |
| Maturity | 60 days old, foundation forming | 18 months, Anthropic-stable |
| Best at | Multi-model teams, regulated environments | Anthropic-first dev shops, simplicity |

If your team is Anthropic-only and your CLAUDE.md is already 200 lines, do not switch. Claude Code is fine. The Skills you wrote are still fine. The pattern works.

If your team is multi-provider, or your compliance team has questions about where prompts travel, or you want a backend model dropdown, OpenClaw is worth a Tuesday.

I am still on Claude Code as my default. I have OpenClaw aliased to a separate command for the cases where I want to try a different model on the same prompt without paying for two SaaS subscriptions worth of context.

## Where this goes next

OpenClaw moving to a foundation while Steinberger joins OpenAI is the part I am watching most closely. Foundations are how open-source projects survive their founders. They are also how projects ossify. The first six months of governance under the OpenClaw Foundation will tell you whether the project is going to be Linux or Helm.

If you used to argue [Claude Code vs Codex](/blog/claude-code-vs-chatgpt-codex-official-agents/) was a binary, OpenClaw is the answer that was supposed to be impossible: a third option that is not produced by an LLM lab. The economics of that are interesting. The next twelve months are going to teach us whether neutral, cross-provider, foundation-governed AI tooling is sustainable, or whether it gets quietly absorbed.

I am betting on sustainable. I have also been wrong about agents in roughly all of the previous quarters, so adjust accordingly.

## What this all costs to know

If you take one thing from my Tuesday, take this. OpenClaw and Claude Code are not competitors. They are two answers to the same question: what should the AI inside your terminal be allowed to do without asking you first? SOUL.md and CLAUDE.md are different shapes of the same trust contract. The team that wrote each chose differently because they had different assumptions about who was sitting in front of the screen.

The right tool is the one whose assumptions match yours. Pick on assumptions, not stars.

If you want to go deeper on Claude Code itself, including the parts I did not change in my SOUL.md but kept in my CLAUDE.md, the practitioner reference I keep going back to is here:

[Claude Code Mastery: A Practitioner's Reference](https://kenimoto.dev/books/claude-code-mastery?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=openclaw-vs-claude-code-24h)

It covers Skills, hooks, sub-agents, and the CLAUDE.md three-tier pattern that I still use as my default contract regardless of which terminal agent I am running today.

## Related reading

- [Claude Code Skills: A Reusable Workflow Pattern](/blog/claude-code-skills-reusable-workflow-pattern/) — the original Skills piece this article assumes you have read
- [Claude Code vs ChatGPT Codex: Two Official Agents](/blog/claude-code-vs-chatgpt-codex-official-agents/) — when this was a two-horse race
- [Autonomous Agent for 24 Hours: Security Lessons](/blog/autonomous-agent-24-hours-security-lessons/) — what I learned letting an agent run unsupervised
- [I Refused to Write Specs Until Claude Code Generated Wrong Code Three Times](/blog/spec-driven-development-claude-code-three-failures/) — the spec-first piece from yesterday
