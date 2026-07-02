---
title: "Claude Code vs Cursor: 6 Tasks, Measured Latency, and Which One I Uninstalled"
description: "I ran a head-to-head between Claude Code and Cursor across 6 daily engineering tasks, stopwatch in hand. After two weeks I uninstalled one of them. Here are the raw seconds and why."
date: 2026-07-02
lang: en
tags: [claude-code, cursor, ai-coding, developer-tools, benchmark]
featured: false
canonical_url: "https://kenimoto.dev/blog/claude-code-vs-cursor-6-tasks-uninstalled/"
og_image: "https://kenimoto.dev/images/blog/claude-code-vs-cursor-6-tasks-uninstalled/og.png"
cross_posted_to: []
---

I paid for both Claude Code and Cursor for two weeks. I ran the same six tasks in each, stopwatch on the desk, one screen per tool. On day fifteen I opened the Cursor settings pane, clicked "sign out," dragged the icon to the trash, and did not miss it.

Skip the "which tool is objectively better" framing. That question is unanswerable because "better" is a function of your workflow. What I can tell you is which six tasks I do every day, how long each tool actually took, and why I kept only one.

I'll show the raw seconds first, because if I bury the number under 900 words of preamble you will scroll to the table anyway and I would too.

## The six tasks and the raw seconds

The measurement rules were simple. I ran each task once in Claude Code and once in Cursor Agent mode, on the same repo (a medium-sized TypeScript service, ~40k lines), same day, same machine. I used a wall-clock timer starting from "hit enter on the prompt" to "the change is committed and the tests pass." I did not cherry-pick. If a run failed, I logged the failure. I did not retry.

| Task | Claude Code | Cursor Agent | Notes |
|------|------------:|-------------:|-------|
| Refactor a 180-line function into three | 74s | 41s | Cursor wrote the split; I edited two names. Claude Code produced the same split but ran the tests unprompted. |
| Add a unit test for a bug I just filed | 52s | 63s | Claude Code read the issue, wrote the test, ran it red. Cursor asked me to paste the repro steps. |
| Fix a stack trace from a Sentry link | 118s | 210s | Claude Code fetched the trace, opened the file, patched it. Cursor needed me to explain what the stack meant. |
| Write a Postgres migration for a new column | 89s | 55s | Cursor was faster. Both produced the same SQL. Claude Code also added a rollback. |
| Review the diff on my current branch | 61s | 340s | Cursor tried to "help me improve" the diff. I wanted a review, not a rewrite. |
| Generate JSON-LD for a new blog post | 47s | 82s | Claude Code read the existing posts' schemas and matched them. Cursor guessed the shape. |

Total: **Claude Code 7 minutes 21 seconds. Cursor 13 minutes 11 seconds.**

Cursor won on two of six. It won on tasks where the shape of the answer was obvious and the win came from tab-speed edit application. Claude Code won on four, and those four were the ones where the tool had to *understand something* before typing.

## Why the seconds are misleading (in Cursor's favor)

If you read the table and think "so Cursor is 44% slower," you have misread it. Cursor is faster than that number suggests, and this is the honest bit.

Cursor's per-keystroke latency is genuinely sub-second. When I am inside a file and I know what I want, Cursor's tab completion is faster than any tool I have used, Claude Code included. Independent testing puts Cursor's tab completion in the sub-second band while Claude Code cycles run in the 30-to-90-second range for a full "read, patch, test" loop ([SitePoint benchmark, 2026](https://www.sitepoint.com/claude-code-vs-cursor-developer-benchmark-2026/)).

So Cursor wins on cadence and Claude Code wins on cycles. The reason Claude Code came out ahead on total wall-clock is that four of my six tasks are cycle-shaped, not cadence-shaped. Your mileage will differ if your day is mostly line-level edits. Mine isn't. That's the whole point of measuring it.

## The tokens told me what my stopwatch didn't

I also logged token consumption because I was already logging everything else and it felt rude not to.

Cursor's advertised context is 200k tokens. Independent measurement puts the *effective* usable window closer to 70k-to-120k after Cursor's internal summarization and truncation kick in ([WaveSpeed comparison, 2026](https://wavespeed.ai/blog/posts/claude-code-vs-cursor-2026/)). Claude Code, running against Anthropic's API directly, gives you the full 200k without the compression layer.

The compression is why Cursor feels fast in short sessions and starts hallucinating in long ones. It is trading precision for latency. That is a defensible trade for a tab-completion tool. It is a bad trade for an agent that is supposed to hold a whole task in its head.

On the six tasks above, Cursor burned roughly 5.7x more tokens than Claude Code for the same work ([SitePoint benchmark, 2026](https://www.sitepoint.com/claude-code-vs-cursor-developer-benchmark-2026/)). Some of that is the compression layer paying its bill. Some is the Agent mode being chatty by design.

## Six tasks, three shapes

If I strip the six tasks down, they cluster into three shapes.

**Shape A: cadence tasks.** Refactor, write migration. You know what you want. The tool's job is to type it fast. Cursor wins these because tab completion beats round-trip prompting.

**Shape B: cycle tasks.** Fix a stack trace, generate JSON-LD matching existing posts, review a diff. The tool needs to read something, understand it, and produce a shaped answer. Claude Code wins these because the agent will actually *finish* the reading before it starts typing. Cursor tends to start typing early and course-correct.

**Shape C: honest work.** Add a unit test for a real bug. This is the interesting case. Claude Code won by 11 seconds because Cursor asked me to paste the repro steps that Claude Code just went and read from the issue tracker. Cursor is faster when the input is already in front of you. Claude Code is faster when the input is somewhere else and someone has to go get it.

Most of my day is Shape B and Shape C. Almost none of it is pure Shape A, because if I am doing pure Shape A I probably don't need an AI, I need a scaffolder.

## The uninstall moment

Two weeks in, on a Wednesday, I was reviewing a PR from a coworker. I opened it in Cursor and asked it to review the diff. Cursor spent five minutes trying to rewrite the diff into what it thought I wanted, then presented me with a "polished version" I had not asked for. I closed it, opened Claude Code, and got a two-paragraph review that named three actual bugs and one style nit in 61 seconds.

That was a taste mismatch, and it went past the stopwatch. Cursor's agent believes its job is to make code, and it will make code even when you ask it to look at code. Claude Code's agent believes its job is to do what you asked, and it will read for a full minute before writing a line.

I like the second one. I use "review this" and "explain this" more often than "write this from scratch," and Cursor treats those as invitations to write from scratch anyway.

So I uninstalled Cursor. It is genuinely fast at what it is fast at, and I bear it no ill will. I uninstalled it because on my particular workload it was losing to Claude Code on four of six tasks *and* on the taste dimension I care about, which is: **when I say "look," look. Don't rewrite.**

## What I did not measure

Three caveats before you send me an angry email.

I did not measure long-lived sessions. Both tools behave differently after four hours of use. Cursor's context compression starts eating things you needed. Claude Code's cost curve gets steep. Two weeks is not enough to catch either.

I did not measure team workflows. If your team lives in Cursor Composer with shared prompts, or if your team has a Claude Code Skills repo, that changes the calculus in ways a solo dev benchmark cannot see.

I did not measure the models under the hood. Both tools were running Claude 4.6 Sonnet during the test window. If Cursor is routing you to a cheaper model on your plan, the seconds change. Read your billing dashboard.

## The tool I kept and what I'd tell someone starting

I kept Claude Code. My workflow is agent-heavy: I hand it a task, it goes, I come back to review. Cursor's IDE-first model does not fit that. It fits people who type code all day and want the typing to be faster.

If you are trying to pick one, here is the honest heuristic: **do you spend more time telling the machine what to do, or watching the machine do it?** If the former, Cursor. If the latter, Claude Code. Most engineers I know overestimate how much of their day is the former.

I also kept a shortcut to Cursor's downloads page. Two weeks from now the numbers might swap. Cursor shipped a CLI in January 2026, and Claude Code shipped Managed Agents in April. Both are moving fast, and the "which one" answer has a shelf life of about a quarter. What I would not change is the method: pick six tasks you actually do, run them both, log the seconds. The right tool for you is the one your stopwatch says it is, not the one Twitter says it is.

Now if you'll excuse me, I have a stack trace to fix. My stopwatch is already running.
