---
title: "Parallel Agents Went Negative at 340k Tokens: The Real Breakeven for Claude+Cursor+Codex"
description: "I ran Claude Code, Cursor Composer, and Codex CLI in parallel for a week and logged every token. The productivity math flipped from positive to negative at 340k input tokens/day. Here is where."
date: 2026-07-01
lang: en
tags: [claude-code, multi-agent, tokens, cost, cursor, codex]
featured: false
canonical_url: "https://kenimoto.dev/blog/parallel-agents-340k-tokens-breakeven-claude-cursor-codex"
og_image: "https://kenimoto.dev/images/blog/parallel-agents-340k-tokens-breakeven-claude-cursor-codex/og.png"
cross_posted_to: []
---

For seven days I ran three coding agents in parallel and pretended it was a productivity strategy. Claude Code on one terminal, Cursor Composer on another, Codex CLI in a third tmux pane. I told myself the tokens were an investment. Then I opened the invoice.

The bill was not the surprise. The shape of it was. Below a certain input-token threshold per day, parallel was strictly cheaper per completed task than any single-agent baseline I had. Above that threshold, parallel lost by a lot. The line was not fuzzy. It was **340k input tokens per developer per day**, and once I crossed it, every extra hour of parallel work took money out of my pocket.

This post is the token log and the four things that tilt the breakeven. If you are running three agents because you saw someone on X do it and it looked cool, please read this first.

![Parallel agents cost curve](/images/blog/parallel-agents-340k-tokens-breakeven-claude-cursor-codex/breakeven-curve.png)

## Where the 340k came from

Anthropic's engineering post on multi-agent research systems has one line that ruins the "just parallelize it" pitch: agents burn 4x the tokens of a chat, and multi-agent setups burn 15x ([Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)). Their number is for a research harness with a Planner and worker agents on Sonnet-class models. Mine is a scrappier version: three different coding surfaces run by the same human on the same repo.

Even so, the 15x is directionally right for me. When I logged input+output separately across the three tools for seven days, I averaged 13.8x more total tokens than my single-agent week from a month prior on comparable tasks. Not 2x. Not 5x. Almost fourteen.

That number alone does not tell you where the breakeven is. You also need the price. As of this week ([Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing), [OpenAI pricing](https://developers.openai.com/api/docs/pricing)):

| Model | Input $/M | Cached input $/M | Output $/M |
|---|---|---|---|
| Claude Sonnet 4.6 | $3.00 | $0.30 | $15.00 |
| Claude Haiku 4.5 | $1.00 | $0.10 | $5.00 |
| GPT-5.5 | $5.00 | $0.50 | $30.00 |

I run Sonnet 4.6 through Claude Code, GPT-5.5 through Codex CLI, and a mix of Sonnet 4.6 / GPT-5.5 through Cursor Composer depending on what I click. Cache hit rate on the Anthropic side landed around 62% on my repo, which is what saves parallel from being an obvious loss.

The 340k figure is the crossover in a simple model:

```text
per-day cost (parallel)  =  13.8 × single_agent_cost(N_tokens)
per-day cost (single)    =  1.0  × single_agent_cost(N_tokens)
tasks-per-day (parallel) =  k(N) × tasks-per-day (single)
```

Where `k(N)` is the parallel speedup factor. Below ~340k input tokens per developer per day, `k(N)` sits around 2.3-2.8x on my logs. Above 340k, `k(N)` collapses toward 1.1x because I run out of independent work to hand out and I start eating verification time on the merges. Multiply that shrinking speedup by the 13.8x cost and the productivity ratio drops below 1.0. Parallel is now *worse* per dollar than doing it alone.

That is the whole reason for this post. The token bill has a threshold, and the threshold is not "when you run out of context." It is when the coordination overhead grows faster than the speedup.

## The four things that move the line

If your 340k is different from mine, it is because one of these four levers is different. All four are visible in the log.

**1. Prompt caching hit rate.** Anthropic caches at $0.30/M on Sonnet 4.6 for a 5-minute TTL, which is 90% off the input rate. My repo lives in the cache all day, so the parallel tax on read-heavy work is a lot smaller than it looks on paper. Cut my hit rate from 62% to 20% and the breakeven drops from 340k to about 190k. If you are hopping between repos, your parallel breakeven is much lower than mine and I would run one agent, not three.

**2. Independent-task pool depth.** Parallel only pays if you have three truly independent things for three agents to do. On refactor days I have maybe five. On "wire up this new feature" days I have one, cut into steps that all depend on the previous one. The strategist Claude that used to plan for me kept splitting a serial task into three parallel ones and then merging them at the end with a bigger verification bill than the original task. If you find yourself synthesizing three agent outputs into one PR, you probably did not have three tasks.

**3. Verification load per hand-off.** Every time one agent hands work to me for review, the review itself is a token spend on my brain that I do not usually count. Three agents producing three PRs is three review passes. On my log the verification tax runs about 12 minutes per hand-off. That is not free. Call it $30/hr of my time, so ~$6/hand-off, and at 8 hand-offs/day that is $48 of unlogged cost. It looks like nothing next to the API bill until you notice that above 340k tokens the hand-offs cluster and I start reviewing things I forgot I asked for.

**4. Persona drift.** Long parallel sessions let each agent drift from its CLAUDE.md. In my week, agents that started with tight, on-instruction outputs at hour 1 were producing verbose, off-instruction diffs by hour 6. Every drift is a re-instruction cost. On single-agent days I noticed drift and fixed it. On parallel days I did not notice until two agents had already committed the drifted style, and undoing it cost more tokens than the original ask.

None of these show up in a single-day log. They show up in the *shape* of the week: front-loaded productivity, back-loaded cleanup, and a bill that arrives on Saturday.

## What actually still works above 340k

I am not making the "never parallelize" case. That would be dumb; there are workloads where parallel keeps winning past 500k. Here is the honest list.

**Exploratory search.** "Find every place we handle stale sessions" across a large repo, run in three angles simultaneously. Parallel wins because the work is independent, the outputs merge cleanly, and there is nothing to verify. You either found something or you did not.

**Independent-file refactors.** "Rename `Foo` to `Bar` in these 20 files, no cross-file logic changes." Three agents on disjoint file sets is the pure case. Verification is a diff review, not a design review.

**Redundant checks.** One agent writes, another reviews, a third writes a test. This is not really parallel — it is a pipeline with a barrier. But it does buy you an independent eye, and I have caught real bugs this way that a single-agent verify pass missed.

## What breaks above 340k

**Anything with state.** Two agents editing the same module, even in different functions, will fight over imports and formatting. Merging their outputs costs more tokens than either would have alone.

**Serial reasoning.** "Design the schema, then implement, then wire up the API" is not three parallel tasks. It is one task with three steps and a coordinator overhead you did not budget for.

**Novel domains.** If you do not yet know what "done" looks like, three agents give you three visions of "done" and now you are picking. Verification load spikes. Do one agent on a scout task first, then parallelize when you know the shape.

The rule I ended the week with was cheap and easy: budget your day at ~300k input tokens per developer, allocate them to *at most* two parallel agents on independent work, and reserve the third slot for verification or a single follow-up. When my planning agent tries to fan out past that, I make it justify each extra agent with a specific independence claim I can verify.

## The unglamorous conclusion

Parallel agents are not magic. They are a lever with a shape, and the shape has a knee. On my logs the knee is at 340k input tokens per developer per day, and your number is probably within 30% of that if you use similar models with normal cache hit rates.

The trap is not "parallelizing." The trap is not measuring, then defending the parallel setup with vibes because the terminal windows look impressive. Three tmux panes do not make you 3x faster. They make you 13.8x more expensive, and only sometimes 2.3x faster.

Log the tokens. Log the hand-offs. Look at the shape at the end of the week. If your breakeven is above 340k, I want to hear how. If it is below, you already know what to change.

---

The CLAUDE.md patterns, sub-agent design, and per-repo token accounting that this post assumes as background are the spine of [Practical Claude Code](https://kenimoto.dev/books/claude-code-mastery?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=parallel-340k-breakeven), which has the whole workflow written down.

Sources:
- [How we built our multi-agent research system — Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic Claude Pricing — platform.claude.com](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
