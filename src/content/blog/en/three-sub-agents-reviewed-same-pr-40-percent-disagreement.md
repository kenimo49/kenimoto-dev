---
title: "I Asked 3 Claude Code Sub-agents to Review the Same PR. They Disagreed on 40% of the Comments."
description: "Three Claude Code sub-agents, one 500-line PR, 41% disagreement, and one hour spent figuring out which findings to keep. Brooks's Law is alive in 2026."
date: 2026-05-12
lang: en
tags: [claude-code, sub-agents, code-review, agents]
featured: false
canonical_url: "https://kenimoto.dev/blog/three-sub-agents-reviewed-same-pr-40-percent-disagreement"
og_image: "https://kenimoto.dev/images/blog/three-sub-agents-reviewed-same-pr-40-percent-disagreement/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-asked-3-claude-code-sub-agents-to-review-the-same-pr-they-disagreed-on-41-of-the-comments-1751-temp-slug-4861615
---

I thought multi-agent code review was a free upgrade. Three sub-agents looking at the same PR sounded like three pairs of eyes for the cost of one engineer's coffee.

Then I ran three Claude Code sub-agents on the same 500-line refactor PR and watched them disagree on 41% of the comments. The merge took an hour I had budgeted for fifteen minutes. Brooks's Law is alive in 2026, and apparently it scales down to agents.

Anthropic [announced in March](https://claude.com/blog/code-review) that fewer than 1% of their internal code-review findings get marked incorrect by engineers. That number is real, and it is also a stat from people running one tightly-tuned pipeline on their own codebase. As soon as I stood up my own three sub-agents on my own repo, "agree" stopped meaning what I thought it meant.

This is the experiment. What I set up, what I measured, and what I now actually believe about parallel sub-agent review.

## The setup

The PR was a 500-line refactor of a WebRTC signaling layer in one of my side projects. Eight files, mostly TypeScript, a couple of config tweaks, one new error type. Boring enough to not be a stunt PR, complex enough that a single reviewer would miss things.

Three sub-agents, all defined under `.claude/agents/`, all using Sonnet 4.6, each restricted to read-only tools:

```markdown
---
name: explore-reviewer
description: Trace callers, dependents, and dead code paths.
model: sonnet
allowed-tools: Read Grep Glob
---

You are a code archaeologist. For each changed file, find every caller,
every test that references it, and any path that goes silent after the change.
Report concrete file:line citations. No style opinions.
```

```markdown
---
name: security-reviewer
description: Look for auth, validation, and secret-handling regressions.
model: sonnet
allowed-tools: Read Grep Glob WebSearch
---

You are a security reviewer. Focus only on auth flows, input validation,
secret handling, and dependency risks. Estimate CVSS for each finding.
Ignore style and architecture.
```

```markdown
---
name: plan-architect
description: Assess design decisions against existing conventions.
model: sonnet
allowed-tools: Read Grep Glob
---

You are a software architect. Compare the PR's design choices against the
existing conventions in this codebase. Flag drift, missing seams, and
abstractions that will hurt the next person.
```

Each sub-agent got the same prompt: "Review PR #482 line by line and list findings as bullets with file:line citations." Each ran in its own context. None of them saw each other's output. I was the only one stitching results together at the end.

![Three Claude Code sub-agents reviewing the same PR](/images/blog/three-sub-agents-reviewed-same-pr-40-percent-disagreement/sub-agents-matrix.png)

## What 41% disagreement actually looked like

After all three finished, I had 78 raw comments total. I sat down with a spreadsheet and tagged each one as "raised by 3", "raised by 2", or "raised by 1".

| Coverage | Count | Share |
|---|---|---|
| All 3 agents flagged it | 14 | 18% |
| 2 of 3 agents flagged it | 32 | 41% |
| Only 1 agent flagged it | 32 | 41% |

The "raised by 1" bucket is what I'm calling disagreement. Two other sub-agents had every opportunity to flag the same line, with the same tools, on the same diff. They walked past it. That is a 41% chance that any individual finding is one sub-agent's private opinion.

The headline Anthropic number — <1% marked incorrect — is measured differently. They count findings that an engineer explicitly closes without fixing. I'm counting findings that two of three agents looking at the same code never bothered to mention. Those are different questions, and the second one is the one that costs me time at the keyboard.

## The four disagreement patterns

After classifying every disagreement, four patterns covered almost all of them.

**Severity drift.** The plan-architect flagged a missing null check as "critical". The security-reviewer noted the same line and called it "low — caller already validates upstream". Both were right, sort of. The architect was reading the function in isolation. The security reviewer had grep-walked the callers and seen the upstream check. Same line, opposite verdicts.

**Scope drift.** Asked to review the PR, the explore-reviewer happily told me about three pre-existing bugs in files the PR did not touch. The plan-architect refused to comment on anything outside the diff. I had no way to know in advance which behavior I would get. Strictly speaking, both interpretations are defensible. Practically speaking, one of them blew up my comment count.

**Concreteness drift.** The plan-architect wrote: "Consider extracting the retry logic into a shared helper." The security-reviewer wrote: "Replace lines 184-201 with `retry(opts, () => fetchToken(opts.url))` and add a 30s ceiling, otherwise the auth-refresh path can hang the worker." Same idea. One I could apply in thirty seconds, the other I needed to spend a meeting on. Concreteness is a wildly larger axis of variance than I expected.

**Tool-budget drift.** The explore-reviewer had grep and glob, and noticed that the renamed function was still referenced in a CI script nobody had updated. The plan-architect, with the same tools, never looked there. Same allowed-tools list, same prompt about "find dependents". One walked the surface, one walked the building. Drift here came down to how aggressively each system prompt told the agent to roam.

If you have used Claude Code [sub-agents](https://code.claude.com/docs/en/sub-agents) for anything beyond a one-off Explore call, none of this is shocking. What was shocking, for me, was how cleanly the four buckets carved up almost every disagreement I tagged.

## The bug nobody caught

Two days after I merged, a colleague found a race condition in the new error-handling path. The PR introduced a one-frame window where two reconnect attempts could fire on the same socket. None of the three sub-agents mentioned it. The pull-request description, which I had written by hand, did mention "reconnect logic moved", which is what made my colleague go look.

"Given enough eyeballs, all bugs are shallow," Eric Raymond wrote in 1999. He was right about eyeballs. He did not specify that three of them needed to be aimed at the same window. Mine were all squinting at the diff. None of them stepped back and asked: what changed about timing?

## The hour I lost to merging

The actual merging of the three reports was the part I had not budgeted for.

For each "2 of 3" or "1 of 3" finding, I had to decide:

1. Is this real or is it a context gap I can close with one grep?
2. If real, is the severity from agent A right, or the severity from agent B right?
3. If a fix is suggested, is the concrete one safe to apply, or do I need to push back to the abstract version?

That last question alone took me three coffee refills. Two sub-agents had told me to "extract a shared helper". One had given me a specific helper. I had to read the diff a third time, by hand, to figure out whether the specific helper was actually the right shape. It wasn't. I ended up writing a fourth version.

Brooks's Law was about communication overhead between humans on a late project. I am now convinced it generalizes to "any time you put N independent perspectives on the same artifact, your N+1 reviewer is the integrator, and the integrator's hour goes up roughly linearly in N." Three sub-agents felt like 3x the eyes. They were also 3x the integration cost.

If you ran Claude Code [autonomously for a day](/blog/autonomous-agent-24-hours-security-lessons) and lived to tell about it, you already know this from the other direction: the bottleneck moves to whoever is reading the agent's output.

## How many sub-agents is the right number

I do not think the answer is one. After the same week I ran the experiment with N=3, I tried N=1 on a smaller PR — just a single general-purpose review pass. It missed the kind of cross-file dependency that the explore-reviewer would have caught. One pair of eyes is genuinely worse than two.

My current heuristic, after maybe a dozen PRs of this:

- Tiny PR (<100 lines, no new files): one sub-agent. Anything more is overhead.
- Medium PR (100-500 lines, touches one subsystem): two sub-agents with different angles, usually explore + security or explore + architect. Pick the second to match what the PR is actually risking.
- Large or cross-cutting PR (500+ lines, multiple subsystems): three. Plan the integration time in advance. It is not free.

Above three, I have not seen the value. HAMY's [nine-agent setup](https://hamy.xyz/blog/2026-02_code-reviews-claude-subagents) is interesting, but I would want a second tool just to merge the reports, and I would want it to be cheaper than me.

The other knob is concreteness. I now ask each sub-agent for findings "with the smallest concrete change that fixes them, or marked as no-fix if you don't know". That single line in the system prompt collapsed about half of my concreteness drift.

## What I actually believe now

Multi-agent code review is not free. It is closer to "three junior reviewers reading in different rooms, and you are the senior who has to merge their notes." The eye count goes up, but so does the integration cost, and the integration cost is the part that lives in your calendar.

The bug nobody caught is the part that humbled me most. Three agents, three angles, all read-only, all aimed at the same diff. None of them noticed the timing change because none of them were asked to. Sub-agents are extremely good at the questions you put in their system prompt. They are mediocre at the questions you forgot to ask. That is the actual limit, not the model.

If you take one thing from this: write a fourth sub-agent prompt called `what-am-i-not-asking`, give it your diff, and ask it to nominate the categories your other agents will miss. Then read its answer. Then write the real review prompts. I did not do this for the experiment in this post, which is exactly why I lost an hour at merge time and a colleague found my race condition.

Anthropic's <1% number is real. It is also measured on a pipeline that someone spent months tuning, not on three sub-agents you wrote between meetings. Tune yours. Until then, expect 40%.

---

**Want the deeper version of this?** I cover sub-agent design, custom agent patterns, and the full Claude Code workflow in [Practical Claude Code](https://kenimoto.dev/books/claude-code-mastery) — the field guide for engineers who want to run Claude Code seriously.

Related on this blog:

- [Claude Code Skills: The Reusable Workflow Pattern](/blog/claude-code-skills-reusable-workflow-pattern/)
- [I Let My Claude Code Agent Run for 24 Hours](/blog/autonomous-agent-24-hours-security-lessons/)
- [Natural-Language Agent Harnesses: An arXiv Reading](/blog/natural-language-agent-harnesses-arxiv/)
