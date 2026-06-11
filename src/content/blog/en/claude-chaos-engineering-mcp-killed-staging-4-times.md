---
title: "I Plugged Claude into a Chaos Engineering MCP Server. It Killed Staging 4 Times Before Finding a Bug We'd Missed for 6 Months."
description: "Steadybit shipped the industry's first chaos engineering MCP server in mid-2025. I plugged Claude Code into it and asked for resilience experiments on payment-service. Claude proposed 4 of them. Three came back green. The fourth took staging down completely, and surfaced a real production bug we'd been missing for half a year. Here's the run, the bug, and the 3 guardrails I now require before letting any AI design chaos experiments."
date: 2026-05-16
lang: en
translation_key: chaos-mcp-killed-staging
tags: [chaos-engineering, claude-code, mcp, sre, ai-coding]
featured: false
canonical_url: "https://kenimoto.dev/blog/claude-chaos-engineering-mcp-killed-staging-4-times"
og_image: "https://kenimoto.dev/images/blog/claude-chaos-engineering-mcp-killed-staging-4-times/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-let-claude-design-4-chaos-experiments-via-mcp-the-4th-took-down-staging-and-found-a-6-month-old-4fel
---

Every experiment in this post ran in staging. Production was double-locked: a `## Chaos Rules` block in CLAUDE.md forbidding production targets, and a `PreToolUse` hook that exits 2 if `--env=production` shows up in any chaos command. I'll show both at the end. The point of saying this upfront is that "I let Claude design chaos experiments" is the kind of sentence people read sideways. The TL;DR is: staging only, twice-locked, and the whole exercise was supervised end to end.

With that out of the way: Steadybit released what is widely described as the first chaos engineering MCP server in mid-2025. I plugged Claude Code into it and asked, in a single sentence, to design experiments that test `payment-service`'s resilience under connection-pool stress. Claude proposed four of them. Three came back without an SLO breach. The fourth took staging down completely. When I traced the failure, it wasn't a contrived test bug. It was a real production pattern that had been flickering in our logs for 6 months and that we had never been able to reproduce: pool exhaustion → retry storm → rate limiter self-DoS. Here is the run, the bug, and the three guardrails I now require before letting any AI design chaos experiments.

This is the 6th post in what's become an AI-harness series running since 5/12: sub-agents, voice AI, three-role separation, debugging gear, and now chaos. Each post is meant to stand on its own, so if you want only the chaos chapter, you don't have to read the previous five. The earlier autonomous-agent post belongs in the same family, since it's the other "I let AI run for X hours" experiment I've published: [autonomous agent, 24 hours, security lessons](https://kenimoto.dev/blog/autonomous-agent-24-hours-security-lessons).

![Four chaos experiments. Three completed within SLO. The fourth exhausted the connection pool, triggered a retry storm, and tripped the rate limiter, taking staging down completely.](/images/blog/claude-chaos-engineering-mcp-killed-staging-4-times/four-experiments.png)

## The Steadybit MCP hookup, in one paragraph

Steadybit announced what they describe as the first MCP server for chaos engineering on June 18, 2025 ([Steadybit news post](https://steadybit.com/news/steadybit-launches-the-first-mcp-server-for-chaos-engineering-bringing-experiment-insights-to-llm-workflows/), [BusinessWire 2025-06-30](https://www.businesswire.com/news/home/20250630606346/en/Steadybit-Launches-the-First-MCP-Server-for-Chaos-Engineering-Bringing-Experiment-Insights-to-LLM-Workflows)). MCP is the open Model Context Protocol Anthropic published in late 2024: a standard way for an LLM client (Claude, Gemini, ChatGPT) to call into an external tool with structured types instead of free-text scraping. The Steadybit MCP server exposes their experiment catalog, past experiment results, post-mortems, and a "design new experiment" tool. Plug Claude Code or Claude Desktop into it, point both at the same staging Kubernetes context, and you can write `"design a connection-pool stress experiment for payment-service"` in your terminal and get back a parameterized experiment spec, ready to approve.

The setup is plumbing. The interesting question is what happens when you actually run what comes out the other side.

## AI-driven chaos in 2026: the four players I actually compared

Before I trusted the run, I wanted to know what the rest of the field looked like. Four players currently matter and they each pick a different lever.

![AI-driven chaos engineering, four players: Krkn-AI (Red Hat + IBM, OSS, genetic algorithm), Steadybit (first chaos MCP server, 2025-06), Harness AI (Claude Desktop / Windsurf / Cursor / VS Code MCP), Dynatrace (observability-driven anomaly prediction).](/images/blog/claude-chaos-engineering-mcp-killed-staging-4-times/four-players.png)

**Krkn-AI** is the Red Hat + IBM Research open-source framework that puts a genetic algorithm in charge of the search. It generates experiment parameters, evaluates each one against your SLOs (latency, error rate, availability), scores them, evolves the best, and repeats. The point is to find the "barely-violating" combinations: the experiments that take a 99.9% SLO down to 99.85%, not the ones that obviously break everything. Those are the dangerous, hard-to-reproduce failures. Red Hat's writeup is on the [Red Hat Developer site](https://developers.redhat.com/articles/2025/10/21/krkn-ai-feedback-driven-approach-chaos-engineering), and the code lives at [krkn-chaos/krkn-ai](https://github.com/krkn-chaos/krkn-ai).

**Harness AI** shipped its GenAI-assisted chaos features in January 2025, then added [MCP tools](https://developer.harness.io/docs/chaos-engineering/guides/ai/mcp/) that work with Claude Desktop, Windsurf, Cursor, and VS Code. The pitch is "describe what you want in English, get a parameterized experiment, run it from the chat box." It's the path with the least learning curve if you're already in the Harness ecosystem.

**Steadybit** is the one I used here, first to ship a dedicated chaos MCP server in June 2025. The differentiator is access to the experiment history: the LLM doesn't just design new experiments, it can read your past runs and post-mortems and ground its suggestions in your specific incident history.

**Dynatrace** runs the play from the opposite direction. Its AI engine learns the system's normal behavior and predicts when a current pattern matches the lead-up to a past incident. Instead of you proposing a hypothesis to test, the platform tells you which subsystem deserves chaos attention next.

If you only run one experiment a quarter, Dynatrace's prediction angle is overkill. If you have a research team and Kubernetes, Krkn-AI's genetic search is the deepest. If you already live in Harness or Steadybit, the MCP angle removes the dashboard tax. The four don't really compete: they layer.

## The four experiments Claude proposed

Back to the actual run. The prompt was one sentence. The response was a numbered list of four experiments, each with a target service, a fault type, a magnitude, a duration, a rollback SLO, and a blast radius. I'll paraphrase rather than paste verbatim, because the real spec was YAML and the LLM-readable structure isn't the interesting part. The experiment design is.

**Experiment 1 — 30% pool reduction, 3 minutes, single pod.** Cut the connection-pool max from the configured 100 down to 70 on one `payment-service` replica. SLO gate: error rate must stay under 1%. Outcome: green. Latency rose ~12% but error rate stayed at 0.2%, well inside the gate. The other replicas absorbed traffic. This is the experiment a human SRE would have proposed first.

**Experiment 2 — 50% pool reduction with default retries, 3 minutes, two pods.** Same fault, deeper magnitude, two replicas instead of one, with the client library's default retry-on-failure behavior left enabled. SLO gate: error rate under 1%, p99 latency under 800 ms. Outcome: green again. Latency went to ~640 ms p99, error rate to 0.4%. Still inside the gate. The retry layer caught the pool pressure.

**Experiment 3 — 70% pool reduction with shortened request timeouts, 3 minutes, two pods.** Now the timeout dropped from 5 s to 1.5 s while the pool was cut to 30. The hypothesis was: under high pressure, do short timeouts actually help by freeing connections faster, or do they hurt by chopping requests mid-work. Outcome: still green, surprisingly. Error rate 0.7%, latency p99 down to ~520 ms because slow calls were dropped early. I almost stopped here. Three greens in a row felt like proof of resilience.

**Experiment 4 — 90% pool reduction with retries left unbounded, 5 minutes, three pods.** This is the one. Pool down to 10 connections per pod, retry budget effectively unlimited (the default on this client when not overridden in config), three replicas hit at once. SLO gate: error rate under 1%. Outcome: not green. Inside the first 90 seconds, error rate went vertical from 0.5% to 23%, p99 latency from 200 ms to 14 seconds, and the staging environment became unreachable from the upstream gateway. Steadybit auto-rolled back at the 1% SLO breach, but by then the damage was a fully wedged service.

The first three green results were not proof of resilience. They were proof that the blast radius was small enough to absorb the pressure. The fourth experiment widened the blast just past the point where the system could absorb, and the underlying pathology came out.

> I told Slack the staging incident was "planned." The on-call engineer didn't laugh. He pointed out that the post-mortem channel was still pinned to last quarter's outage. I let him pin a new one.

## The bug we'd been missing for 6 months

I expected the staging failure to be a staging quirk: wrong env var, weird sidecar, a timing thing that doesn't repro in prod. I traced it anyway. The chain was three pieces, each individually documented and individually fine, that compounded.

**Piece 1 — connection pool exhaustion.** With pool max at 10 and three pods under steady traffic, every incoming request that needed a fresh connection waited or failed. Standard. Nothing surprising.

**Piece 2 — unbounded retries on the calling service.** The upstream service that called `payment-service` had retries enabled with no upper bound on attempts, only on time-per-attempt. When `payment-service` started returning pool-exhausted errors, the caller retried. Each retry opened a new TCP connection, which queued behind the pool, which timed out, which triggered another retry. Three retries became nine, became twenty-seven. Within seconds, the caller's outbound concurrency was an order of magnitude above its normal baseline.

**Piece 3 — the caller's own rate limiter.** This is the part that took me half an hour to see. The caller had a self-protective rate limiter on the *outbound* path: "don't let this service issue more than N requests per second to any downstream." During normal operation, N was never close to being hit. During the retry storm, the caller exceeded its own outbound rate limiter and started rejecting its own retries, which the application code interpreted as a downstream failure, which triggered more retries. The caller was DoSing itself, using its own rate limiter as the weapon. The downstream `payment-service` couldn't recover, because new traffic couldn't get through the caller's self-DoS to know that the pool was free again.

When I went back through the production logs for the last 6 months and grepped for the rate-limiter rejection signature on outbound retries from this service, I found 11 events. Each one had been short, between 4 and 90 seconds. Each one had self-resolved before anyone could finish opening the Grafana board, and each one had ended up in our "transient, not actionable" bucket. The pattern was exactly what Krkn-AI's fitness function is designed to find: a failure that lives just past the SLO boundary, brief enough that humans give up looking, real enough to matter.

The fix wasn't glamorous. We capped retries at 2 with jitter, lowered the outbound rate limiter to behave as a circuit breaker rather than a hard reject, and added a metric for the specific sequence (pool-exhaust → retry-spike → outbound-rate-limit-rejection-on-retry) so the next occurrence pages someone instead of self-healing into invisibility.

## The 3 guardrails I now require

I am the person who wrote a post a year ago about [letting Claude run autonomously for 24 hours](https://kenimoto.dev/blog/autonomous-agent-24-hours-security-lessons). I am not anti-autonomy. But "AI designs chaos" without guardrails is the fastest way to kill staging I have personally found. Three things go on every project before I let the MCP server anywhere near a real environment.

**Guardrail 1 — CLAUDE.md owns the policy.** A short block, under twenty lines, that names the prohibitions and the SLO gates.

```markdown
## Chaos Rules

- Chaos experiments must target staging only. Production is forbidden as a target,
  including any cluster, namespace, or service flagged production=true.
- Every experiment must declare an SLO gate (error rate, latency, availability)
  that auto-rolls back the experiment if exceeded.
- Blast radius is staged: start at 10% of pods, escalate to 25%, then 50%.
  Skipping a stage requires human approval in the prompt.
- If three experiments in a row complete green, do not declare resilience.
  Propose a wider blast radius or a new fault type before stopping.

## Chaos Workflow

1. Confirm the target environment is staging. Refuse otherwise.
2. Propose the experiment with declared SLO gate, blast radius, and rollback condition.
3. Wait for human approval in the prompt before invoking the MCP run tool.
4. Stream metrics during the run. On SLO breach, invoke the rollback tool immediately.
5. After the run, write a one-paragraph post-mortem with the result.
```

The hard part of CLAUDE.md is keeping it short enough that it actually loads into context every turn. Anthropic's guidance is to stay under roughly 100–150 lines. Spending 16 of those on chaos rules is a fair trade for not killing staging on day one.

**Guardrail 2 — `PreToolUse` hooks enforce the policy.** CLAUDE.md is the brain. Hooks are the reflexes. The brain can be ignored under load. The reflex cannot.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__steadybit__run_experiment",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/block-prod-chaos.js"
          }
        ]
      }
    ]
  }
}
```

The blocking script checks the experiment spec for any production marker. If `env: production`, `cluster: prod`, or `namespace: prod-*` appears anywhere in the payload, it writes the reason to stderr and exits 2 to block the call. This is the bit that saved me at least once. The LLM, mid-conversation, helpfully suggested promoting an experiment "to confirm in prod." The hook said no before the MCP server saw it.

The same hook also confirms the SLO gate is declared with a numeric value and that the blast radius stage matches the previous run's stage plus one. Magic-number-only spec? Blocked. Skip stage 2 of the blast radius? Blocked. The reflex is shaped exactly like the rule.

**Guardrail 3 — the MCP server itself owns the SLO lock.** The third layer is platform-side. In Steadybit (and equivalently in Harness, Krkn, and friends), the experiment configuration takes a `rollback_on` predicate that the platform itself evaluates on metrics in real time. If error rate exceeds 1% for 30 seconds, the platform halts the experiment regardless of what the LLM or the local hook does. This is the only one of the three that survives the LLM and the local agent both being compromised. It's also the one most teams forget to set, because it requires opinions about your SLOs that nobody wants to type into a YAML file. Type them anyway.

A useful test: pick a random teammate, hand them the CLAUDE.md and the hooks file, and ask "could you, with malice, design an experiment that hits production?" If the answer is "yes, by editing CLAUDE.md," the platform SLO lock is what catches them. If the answer is "yes, by removing the hook," the platform SLO lock is what catches them. The three layers are not redundant; they fail in different ways.

The three-role separation pattern I described in an earlier post ([observer, strategist, marketer](https://kenimoto.dev/blog/three-role-separation-observer-strategist-marketer)) maps onto chaos cleanly: CLAUDE.md is the strategist (sets policy), hooks are the observer (catch what happens), and the MCP server is the actor under both. Keeping those layers separate is what stops the AI agent from accidentally being all three.

## Chaos Engineering 2.0: the four streams converging

Pulling back the camera, there's a 2024 review paper titled *Chaos Engineering 2.0: A Review of AI-Driven, Policy-Guided Resilience for Multi-Cloud Systems* ([journal page](https://journals.stecab.com/jcsp/article/view/846)) that argues the modern stack has three pillars: AI planners that design experiments, service-mesh-level injection that doesn't require app code changes, and policy-driven guardrails that enforce blast-radius and SLO discipline. The same paper notes that 89% of surveyed organizations now run multi-cloud, which is the environment where these failure modes (cross-cloud DNS drift, IAM-token-lifecycle mismatches, region-local rate limiters) actually live.

A more recent arxiv paper, [ChaosEater (2025)](https://arxiv.org/abs/2511.07865), takes the next step: a fully LLM-orchestrated chaos cycle, where the model owns experiment design, execution, and analysis subject to policy guardrails. It's the same direction the four products above are walking toward, just from the research side.

The four streams converging (chaos engineering, observability, AI/LLMs, platform engineering) aren't a marketing slide. They're the actual workflow my staging accident sat inside. The chaos engineering provided the experiment. The observability provided the metric stream that flagged the SLO breach in 90 seconds. The LLM provided the experiment design and, later, helped read the log chain that pinned the production bug. The platform engineering (Steadybit + the hooks + CLAUDE.md) kept the blast radius from including production.

Take any one of those four out and the same story ends differently. Without the LLM, no one on the team would have proposed experiment 4. It looked obviously reckless. Without observability, the SLO breach takes minutes to notice. Without policy guardrails, "let's verify in prod" actually happens. Without chaos as a deliberate practice, the bug stays invisible for another 6 months.

## What I'd tell anyone trying this next week

If you want to try the same thing without taking your own staging down at 11pm, here are the things I'd do differently with hindsight.

Start with experiment 1 only, in a single namespace, with the blast radius capped at 10% of pods. Treat the first green as a signal to widen the blast radius, not to declare victory. The interesting experiment is the one that comes just past where the system can absorb.

Write the CLAUDE.md and the hooks before you connect the MCP server. Not after, not in parallel, before. The temptation when you have a shiny new tool is to play with it for an hour and add the guardrails later. That hour is when staging dies. That same hour is also when you have the least patience for writing rules.

Keep the post-run prompts short. "Summarize what failed, the SLO that breached, and the most likely root cause" is enough. Long prompts after an SLO breach pull the LLM toward narrative explanations, which is the wrong mode. You want the LLM in evidence mode, not story mode.

Take the post-mortem habit from chaos and apply it to AI-coding more generally. The reason this post exists is that I had a single page of notes from the 90-second incident, kept in the same form as our normal incident docs. Without that page I'd be writing a vibe blog post. With it, I have a paragraph per piece of evidence and a fix that landed in prod the same week.

AI designs chaos faster than any SRE I've worked with. Without the three guardrails, it kills staging faster too. Strap them on, and you get the version where the LLM finds the bug you've been missing for half a year, and your on-call gets to keep their weekend.

---

The 14-chapter book this post draws from covers the full Krkn-AI / Harness / Steadybit / Dynatrace landscape, Chaos Engineering 2.0, and the operational practices around running chaos in production without making the news.

[Chaos Engineering: A Practical Guide for Modern Distributed Systems](https://kenimoto.dev/books/chaos-engineering-guide)

Related reading from the same harness series:

- [I let Claude run autonomously for 24 hours, then took 24 security lessons](https://kenimoto.dev/blog/autonomous-agent-24-hours-security-lessons)
- [I caught Claude hiding my bug 3 times: 10 debugging habits, as prompts](https://kenimoto.dev/blog/claude-hid-my-bug-three-times-ten-debugging-prompts)
- [9 bugs in my AI pipeline](https://kenimoto.dev/blog/9-bugs-in-my-ai-pipeline)
