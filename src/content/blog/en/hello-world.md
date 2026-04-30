---
title: "Building an Autonomous Content Pipeline with Claude Code"
description: "I tested my AI article pipeline 6 times and found 9 bugs. None were the model's fault."
date: 2026-04-29
lang: en
tags: [harness-engineering, claude-code, ai-agent]
featured: true
og_image: "https://kenimoto.dev/images/blog/hello-world/og.png"
---

## The Pipeline

I built an autonomous content pipeline using Claude Code. The system runs three phases in sequence: Observer, Strategist, and Marketer.

Each phase is an independent Claude session that reads the previous phase's output and generates the next step.

## What Broke

After 6 rounds of testing, I found 9 bugs:

- **Parallel execution conflicts**: Cron jobs fired all 3 phases simultaneously. The Strategist hadn't finished when the Marketer started.
- **Theme duplication**: Without an exclusion list, the pipeline kept picking the same topic.
- **Self-reported quality checks**: The AI was checking its own work and always passing itself.

Every single bug was in the **harness** — the environment around the model — not in the model itself.

## The Fix

I switched from time-based cron to event-driven chaining with `after` dependencies. Each phase only starts when the previous one completes.

```yaml
# Before: all fired at the same time
observer: "0 7 * * 1"
strategist: "0 7 * * 1"
marketer: "0 7 * * 1"

# After: event-driven chain
observer: "0 7 * * 1"
strategist:
  after: observer
marketer:
  after: strategist
```

## Takeaway

AI agent quality is determined outside the AI. The model is the chef — but if the kitchen is broken, no chef can cook.
