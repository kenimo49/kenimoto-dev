---
title: "I Gave My Strategist Agent WebSearch. 5 Topics Took 20 Minutes. Splitting It Into 3 Made It 3."
description: "I had one agent doing observation, strategy, and execution. Picking 5 topics took 20 minutes and burned 120k tokens. Splitting it into Observer / Strategist / Marketer dropped it to 3 minutes and cut tokens by 60%. The architecture, the allow-list per role, and why WebSearch in the judgment loop is a trap."
date: 2026-05-14
lang: en
tags: [claude-code, agents, cron, harness-engineering, multi-agent]
featured: false
canonical_url: "https://kenimoto.dev/blog/three-role-separation-observer-strategist-marketer"
og_image: "https://kenimoto.dev/images/blog/three-role-separation-observer-strategist-marketer/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-gave-my-strategist-agent-websearch-5-topics-took-20-minutes-splitting-it-into-3-roles-made-it-3-4ibm-temp-slug-6102820
---

I thought one agent doing everything was elegant. One `claude -p` call, "pick today's topics and write the articles," done. It took 20 minutes to pick 5 topics.

Splitting it into three agents took the same job to 3 minutes and dropped token cost by about 60%. The agents are dumber individually. The pipeline is faster.

The trick is not "more agents." The trick is taking WebSearch out of the agent that does the judging.

![1-agent vs 3-role separation. Token cost down 60%, time from 20 minutes to 3 minutes.](/images/blog/three-role-separation-observer-strategist-marketer/one-agent-vs-three-roles.png)

## The 1-agent setup that took 20 minutes

The original setup was one prompt, one agent, one run:

> "Look at yesterday's GA4 data, pick 5 topics for today, and write the top one."

The agent was allowed `Bash, Read, Write, Edit, Grep, Glob, WebSearch, WebFetch`. Everything it could possibly need.

For each candidate topic, it did roughly the same thing: WebSearch to check "what's hot in this space right now," WebSearch again to confirm a trend, WebSearch a third time to cross-check a competitor. Five topics, three to four searches each, 15 to 20 searches per run. Each search dumped a few thousand tokens of result into the context.

By the time the agent was choosing topic 3, the judgment context contained 40,000+ tokens of search results from topics 1 and 2. The signal-to-noise ratio collapsed. The agent started picking topics that "felt confirmed by recent news" rather than topics that matched my actual content stock.

The visible symptom was time: about 20 minutes per run. The hidden symptom was drift: I kept overriding the agent's picks during the weekly review, because they didn't match what I had material for.

## Why WebSearch in the judgment loop is a trap

WebSearch is fine. WebSearch in a judgment loop is the trap.

Two things happen when you let the judge search:

**Time:** A WebSearch is 5-20 seconds. Five topics times four searches is 100 seconds of waiting per run, before you even count read time and reasoning. For a single human asking one question it's nothing. For a daily automated job it stacks up fast.

**Context pollution:** Each result adds 2,000-5,000 tokens of HTML-scraped page text into the judgment context. None of it was structured for "is this topic right for my content?" It was structured for SEO. The judge ends up reasoning from a pile of marketing copy instead of from its own data.

The fix is unglamorous. The judge should not have WebSearch. WebSearch belongs in the writer.

## Role 1: Observer — collect only

The Observer's job is "fetch yesterday's numbers, write them to a file." That is the whole job.

Inputs: GA4, the Zenn API, the Dev.to API, yesterday's logs. Output: `domains/<name>/data/snapshot-YYYY-MM-DD.json`.

Allowed tools:

```bash
claude -p "$(cat scripts/prompts/observer-prompt.txt)" \
  --allowed-tools "Bash,Read,Write"
```

No WebSearch. No WebFetch. No Edit. The Observer reads three APIs through `curl` and writes a single JSON file. If it tries to be clever and "interpret the data," the prompt tells it not to. The schema enforces it: fields are `total_views`, `top_performers_3`, `errors_yesterday`. No `recommendation` field exists, so there's nowhere to put a judgment even if it wanted to make one.

This sounds like a downgrade. It is, in the same way a single-purpose function is a "downgrade" from a god-object. When the Observer fails, I know exactly which API broke, because that's all it does.

## Role 2: Strategist — judge only, no WebSearch

The Strategist reads what the Observer wrote, reads `strategy.md` for the rules, reads the last 30 days of published topics for the exclusion list, and picks 5 topics. That's it.

```bash
claude -p "$(cat scripts/prompts/strategist-prompt.txt)" \
  --allowed-tools "Bash,Read,Write,Edit,Grep,Glob"
```

Notice what's missing: `WebSearch`, `WebFetch`. Physically gone from the allow-list. The Strategist literally cannot reach the internet.

This was the part I resisted. "How can it judge today's topics without checking what's trending?" That was the wrong question. The right question is: am I writing topics that are trending elsewhere, or topics that match my content stock?

The Strategist sees:

- Three months of my own performance data (what got read)
- My content stock (book chapters, unpublished drafts)
- 30-day exclusion list (what I already wrote)
- My own `strategy.md` rules

That is enough to pick 5 topics in about 90 seconds, not 20 minutes. The token consumption per Strategist run dropped from roughly 80,000 to roughly 20,000 because there are no WebSearch results to read.

"Adding evidence with WebSearch" sounded like a good idea. In practice it added 8 redundant searches and 40,000 tokens of noise.

## Role 3: Marketer — execute, WebSearch allowed

The Marketer reads the Strategist's output, picks the top topic, and writes the article. This is where WebSearch shows up:

```bash
claude -p "$(cat scripts/prompts/marketer-prompt.txt)" \
  --allowed-tools "Bash,Read,Write,Edit,Grep,Glob,WebSearch,WebFetch"
```

The Marketer uses WebSearch for execution research:

- "Latest stable version of LangGraph in 2026"
- "Anthropic Building Effective Agents doc URL"
- "Inngest pricing tier for cron-driven workflows"

These are citations and version checks, not judgments. "Should I write this topic?" is already decided. The Marketer's WebSearch is bounded by the article in front of it.

Two consequences fall out of this:

1. Cost localizes. WebSearch spend lives in the Marketer, where it produces visible output. The Strategist's per-run cost is now small enough that I run it multiple times a week without thinking about it.
2. Failure localizes. When WebSearch is flaky or down, only the writer breaks. The Strategist still produces today's picks. The Observer still records yesterday's numbers. The pipeline degrades, it doesn't halt.

## The cron chain: how the three roles connect

The three agents do not share a conversation. They share files.

```text
07:00  Observer    → writes snapshot-2026-05-14.json
09:00  Strategist  → reads snapshot, writes strategist-2026-05-14.md
10:00  Marketer    → reads strategist.md, writes drafts + schedules 22:00 publish
22:00  Observer    → records today's early traction → tomorrow's input
```

I run this as plain `cron` on a small VPS. The full crontab is in [chapter 11 of the harness book](https://kenimoto.dev/books/harness-engineering-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=three-role-separation); the short version is one line per job with `set -euo pipefail`, `trap ... ERR`, a Telegram failure ping, and a lock file. About 30 lines of shell per role.

If you want managed durability instead of cron, [Temporal's Schedules](https://temporal.io/blog/orchestrating-ambient-agents-with-temporal), [Inngest's cron triggers](https://www.inngest.com/), and [GitHub Actions cron](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) all hit the same shape. The architecture doesn't care which one carries it. I use cron because the failure mode is "the server is off," and I notice that quickly.

The handoff is always a file on disk. JSON for the snapshot, Markdown for the strategist log, Markdown for the marketer log. Human-readable, dated, replayable. I can re-run yesterday's Marketer against yesterday's Strategist file by changing one environment variable. That's `backfill` for free, without inheriting Airflow.

## Sub-agent vs role separation — don't confuse them

I have a separate post about [running three Claude Code sub-agents on the same PR and watching them disagree 41% of the time](https://kenimoto.dev/blog/three-sub-agents-reviewed-same-pr-40-percent-disagreement). People sometimes ask if that's the same thing as what I'm describing here.

It is not. They look similar on a slide and behave nothing alike in practice.

| | Sub-agent (Claude Code Task tool) | Role separation (cron) |
|---|---|---|
| **Scope** | Same session, same parent agent | Three separate processes, three separate runs |
| **State** | Parent passes context as input | File on disk |
| **Timing** | Synchronous, parent waits | Asynchronous, hours apart |
| **Failure** | Parent owns retry | Each job retries independently |
| **Use case** | "Explore this codebase in parallel" | "Run yesterday's PDCA every morning" |

Sub-agents are great for *parallelism inside one task*. Role separation is for *time-shifted pipelines*. Mixing them produces the worst of both: you get cron's debug surface plus sub-agents' shared-context drift.

The rule I use: if the answer has to come back in the same conversation, it's a sub-agent. If the answer has to survive a server reboot, it's a separate cron job.

## What changed, measured

These are my numbers from running both setups on the same content stack:

| Metric | 1-agent | 3-role | Change |
|---|---|---|---|
| Time to pick 5 topics | ~20 min | ~3 min | -85% |
| Tokens per daily run | ~120k | ~45k | -62% |
| Monthly API spend | ~$60 | ~$22 | -63% |
| Topic re-pick rate (weekly review) | 2-3/wk | 0-1/wk | down |
| WebSearch outage breaks pipeline | yes | no | fixed |
| Mean debug time per failure | 30-60 min | 5-10 min | -80% |

The token math is the one that surprised me. I assumed splitting into three agents would *increase* total token usage because of duplicated context. It didn't, because the deleted WebSearch traffic was bigger than the new per-role overhead.

The debug time is the one that matters daily. With one agent, "the job failed at 09:14" tells me nothing. With three roles, "the Strategist failed at 09:14" tells me which 30-line script to read.

"Adding agents made it faster" sounds wrong on its face. It's only faster because I removed WebSearch from the judgment loop. The split is what made the removal feasible — once Observer and Strategist couldn't reach the internet, the temptation to "just search one more thing" was gone.

---

**Related**: I've been writing about agent harnesses for a while — [Natural-language agent harnesses (arxiv)](https://kenimoto.dev/blog/natural-language-agent-harnesses-arxiv) covers the concept; this post is the implementation. The deep version, with full crontab, prompt files, and role allow-lists, is in [Harness Engineering: From Using AI to Controlling AI](https://kenimoto.dev/books/harness-engineering-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=three-role-separation).
