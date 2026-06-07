---
title: "I Stopped Adding Context to My Agent and Pruned Tool Outputs Instead — My 3-Hour Task Stopped Forgetting Its Own Plan"
description: "I always believed more context made an agent smarter. Then a 3-hour migration task forgot a design rule it had set for itself in hour one. I pruned raw tool outputs and stale turns, dropped from 140K to 84K tokens, and the plan held to the end. This is about what not to put in."
date: 2026-06-05
lang: en
tags: [context-engineering, claude-code, llm, ai-agents]
featured: false
canonical_url: "https://kenimoto.dev/blog/stopped-adding-context-pruned-tool-outputs-accuracy-returned/"
og_image: "https://kenimoto.dev/images/blog/stopped-adding-context-pruned-tool-outputs-accuracy-returned/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-stopped-adding-context-to-my-agent-and-pruned-tool-outputs-instead-my-3-hour-task-stopped-5124-temp-slug-7232813
---

For a long time I treated context like savings: the more I put in, the richer I'd be. Thick CLAUDE.md, every file that might be relevant, the full output of every tool left sitting in the window. More information, smarter agent. That was the theory.

The theory fell apart three hours into a migration task. The agent had set itself a design rule in the first twenty minutes: don't touch the legacy adapters, wrap them. By hour three it had forgotten its own rule and edited two of them directly. It also wandered into a directory I had explicitly told it to leave alone. The prompt wasn't the problem. The context had gotten so fat that the one instruction that mattered was buried under everything else I'd helpfully shoveled in.

So I did the opposite of my instinct. I stopped adding and started pruning. Tokens dropped from about 140K to about 84K, roughly 40%, and the long task got *more* accurate, not less. This is the story of what I cut.

## The point where "more is smarter" turns into a lie

Context has a ceiling on how much of it actually works, and the ceiling sits well below the advertised number.

Claude Sonnet markets a 200K-token window. But Sourcegraph's Geoffrey Huntley [reported quality starting to slide somewhere around 147,000–152,000 tokens](https://ghuntley.com/redlining/), what he calls redlining. The capacity of the window and the capacity you can use are two different numbers.

This is not my anecdote talking. Chroma's research team ran the experiment properly: they tested [18 frontier models on how rising input length affects output quality](https://research.trychroma.com/context-rot), and every one degraded as the context grew. They named it **context rot**. A model with a 200K window can show measurable degradation long before it's full. And the kicker: *how* you fill the window matters. Padding it with tool operations that partly cancel each other out hurt performance more than padding it with neutral text. Raw tool dumps are close to the worst-case filler.

Picture a new hire. Hand them three pages and they're useful by lunch. Bury the same desk under three hundred pages and they'll spend the day just figuring out which page matters. Information and usefulness stop being friends at some point on that curve. My agent had hit that point, and I was the one stacking the pages.

## The three things I pruned

When I went looking for what to cut, it sorted into three buckets.

### 1. Raw tool outputs

This was the big one. The full log of `npm test`. The four hundred lines `grep` returned. The giant JSON body from an API call. The agent hoards all of it, verbatim. But the only thing that moves the next step forward is the conclusion: "three tests failed, here are the files." The rest is ballast.

Anthropic now ships this as an actual feature, which told me I hadn't invented anything; I'd just been doing it by hand. Their [context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing) clears old tool results past a token threshold and leaves a small placeholder so the model knows something was removed. In a 100-turn web-search eval, Anthropic measured context editing cutting token use by 84% while keeping workflows alive that would otherwise have run out of room. The mechanism I'd been hacking together with notes-on-the-side had a name and a measured number.

### 2. Irrelevant files

The "let me read this just in case" files. On a migration task I'd opened five components that had nothing to do with the migration. I'd told myself it was insurance. It was noise I paid for in tokens.

### 3. Stale conversation turns

The early flailing. Once "we're going with approach B" is decided, the three rejected approaches that got us there are dead weight. Keep the decision, drop the path to it. A `/compact` with a custom instruction does this without throwing away the parts you need.

## The numbers, before and after

Same migration task, run with the fat context and then with the pruned one.

| Metric | Before pruning | After pruning |
|---|---|---|
| Tokens used | ~140K | ~84K |
| Design rule held? | Drifted near the end | Held to the end |
| Times I had to re-instruct | 6 | 1 |
| Wrong files touched | 2 | 0 |

Tokens fell about 40%. But the number I actually cared about was the re-instruction count going from six to one. The agent kept its own hour-one decision all the way to the finish because it never climbed into the 147K–152K redline where the rot sets in. I didn't make it smarter. I stopped making it dumber.

![Before and after: token count and plan retention across the migration task](/images/blog/stopped-adding-context-pruned-tool-outputs-accuracy-returned/pruning-before-after.png)

And notice the direction here. A while back I ran the [opposite experiment, stacking four more context layers on top of RAG](https://kenimoto.dev/blog/full-context-engineering-rag-80-percent/) and measuring the gain. That was about adding structure and watching the curve rise (until it fell over on the smaller model). This is the mirror image: removing noise and watching accuracy come back. Same window, opposite vector. Both experiments point at the same uncomfortable truth: the window is not a bucket you should try to fill.

## Why "don't put it in" is harder than "put it in"

Honestly, pruning is the harder discipline.

Adding is free of judgment. Nervous about a file? Open it. No decision required. Pruning forces you to say "this isn't needed" and then sit with the fear that it was. Every cut is a small bet against your own anxiety.

My rule for the bet is one question: *does this directly help the single step in front of the agent right now?* If not, it stays out. If it turns out I was wrong, the agent can go read the file again; it's an agent, retrieval is its job. Pre-loading everything wasn't serving the model. It was sedating me.

Anthropic's newer models track how much of their own context is left, a kind of context self-awareness, so they can pace a long task instead of sprinting into the wall. But that only helps if there's headroom to track. Fill the window with raw logs on turn one and there's no runway left to be aware of.

## Takeaway

When a long task started losing accuracy, my first instinct was "it doesn't have enough information." Exactly backwards. It had too much, and the one instruction that mattered had been diluted to nothing.

What I actually did was three cuts: replace raw tool output with its conclusion, stop opening files "just in case," and throw away the trial-and-error once a decision is made. Forty percent fewer tokens, no trip into the rot valley, and a plan that survived three hours intact.

Context engineering sounds like a question of what to add and how to arrange it. On a long-running task, the move that paid off was the other one: deciding what never goes in. Clear the desk down to three pages. That's the moment the new hire becomes useful again.

---

The full map of context design (how System Prompt, few-shot, and RAG fit together, and where adding more crosses the 80-20 line into actively hurting you) is in my **[Context Engineering Practical Guide](https://kenimoto.dev/books/context-engineering?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=pruned-tool-outputs)**. This post is the subtraction side of that book, stress-tested on a task long enough to make context rot show up.
