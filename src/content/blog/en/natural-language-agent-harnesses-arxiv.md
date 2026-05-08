---
title: "I Was Calling It 'Setup' for Six Months. arXiv Has a Better Word: Harness"
description: "An arXiv paper renamed something I'd been building all year. Here's what 'Natural-Language Agent Harnesses' (2603.25723) gave me — and why the vocabulary upgrade made my team meetings 30% shorter."
date: 2026-05-06
lang: en
tags: [ai, claudecode, harness, agents]
featured: false
canonical_url: "https://kenimoto.dev/blog/natural-language-agent-harnesses-arxiv/"
---

I had a folder on my laptop called `agent-setup/`. Inside was a CLAUDE.md, a couple of YAML configs, three skills, and a bash script that wired them together. I'd been calling it "the setup" for about six months. When teammates asked what I was doing this quarter, I'd say things like "I'm rebuilding the setup" or "the setup ate my Tuesday." Nobody pushed back. Engineers tolerate vague language the way doctors tolerate handwriting.

Then in March, an arXiv paper landed with the title "Natural-Language Agent Harnesses." I read the abstract, looked at my `agent-setup/` folder, and felt the specific embarrassment of someone who's just learned the proper word for a thing they've been mispronouncing in public for a year.

The paper is [arXiv 2603.25723](https://arxiv.org/abs/2603.25723), submitted on March 26, 2026 by Linyue Pan and four colleagues. It's the first time I've seen the harness concept treated as a first-class research object — not a footnote in an agent-framework paper, not a blog post, but the actual subject of the study. And that turns out to matter more than I expected.

![Setup vs harness — the same thing, but one of them has a paper](/images/blog/natural-language-agent-harnesses-arxiv/setup-vs-harness.png)

## The thing I was actually building

If you've ever wired up Claude Code, Cursor, or Codex with a custom CLAUDE.md, a few hooks, some skills, and a runtime script that orchestrates them, you've built a harness. You may have called it "config," "scaffolding," "infra," "the harness around the model" if you read Anthropic's blog, or — like me — "the setup." We were all looking at the same thing. We just didn't agree on what to call it.

The Pan et al. paper makes the case that this thing has structure, properties, and a definition worth pinning down. From the abstract:

> Agent performance increasingly depends on harness engineering, yet harness design is usually buried in controller code and runtime-specific conventions, making it hard to transfer, compare, and study as a scientific object.

That second clause is the one that hit. *Hard to transfer, compare, and study.* Every agent project I've looked at has its own private dialect — its own way of expressing role, contract, verification, state. And when I move from project to project, none of it ports. I rebuild the same patterns from scratch every time, slightly differently, slightly worse.

The paper proposes a fix: write the harness in natural language, in a portable format, and run it through a shared runtime they call IHR (Intelligent Harness Runtime). The natural-language part isn't decorative. It means humans can read it, agents can read it, and it survives a model swap.

## Why this isn't just renaming

I'll be honest — when I first skimmed the paper, my reaction was "okay, they invented a word for the thing." A skeptic could fairly say this is academia's contribution to a problem industry already solved. Anthropic ships harness-design [blog posts](https://www.anthropic.com/engineering/harness-design-long-running-apps), the awesome-harness-engineering [GitHub repo](https://github.com/ai-boost/awesome-harness-engineering) lists 80+ tools, and Aakash Gupta's [widely-shared post](https://aakashgupta.medium.com/2025-was-agents-2026-is-agent-harnesses-heres-why-that-changes-everything-073e9877655e) declared 2026 "the year of the harness." Vocabulary alone isn't a contribution.

But two things in the paper do real work.

**First, it formalizes what counts as a harness.** Pan et al. give explicit primitives: roles, contracts, durable artifacts, verification gates, delegation boundaries. That sounds abstract until you try to map it onto your own project. I sat down with my `agent-setup/` folder and worked through it. Every primitive corresponded to something I had built — but I had built each one differently, and I had no name for any of them. My CLAUDE.md was four primitives mashed together. My skills were both contracts and roles depending on how you squinted. The mess was legible to me, and only me.

**Second, it argues that natural language is durable.** A reasonable concern about all of this is: "Won't models eventually be smart enough that we don't need the harness?" The paper's answer:

> A natural worry is that stronger foundation models reduce the value of natural-language control. Our results support a different reading: natural language remains valuable not for one-shot prompts but for harness-level control — roles, contracts, verification gates, durable state semantics, delegation boundaries.

Translation: the bits in your AGENTS.md and CLAUDE.md aren't prompts. They're a *spec* for how the agent operates. Specs don't go obsolete when the underlying engine improves; they go obsolete when requirements change. And requirements — what counts as "done," what gets verified, who has authority to commit code — don't get smarter just because the model does.

That argument changed how I think about my CLAUDE.md. I used to treat it as something I'd eventually "outgrow." Now I treat it as the part of the system most likely to outlive any specific model.

## What the paper made me rename

I went through my `agent-setup/` folder the weekend after I read the paper. Here's what changed.

**`agent-setup/` → `harness/`.** The whole folder. Took thirty seconds. Felt absurd. But within two weeks, three teammates had referenced "the harness" in our standup without me prompting it, which never happened with "the setup." Words have gravity.

**My CLAUDE.md got a new top-level section: `## Roles`.** Previously the file was a wall of mixed instructions — some were rules ("never run `git push --force`"), some were context ("we deploy to Cloudflare"), some were behavioral defaults ("prefer rg over grep"). Now I separate them. Roles describe what the agent is supposed to *be*. Contracts describe what it's supposed to *produce*. Verification gates describe what has to *pass* before something is considered done. The file got longer but easier to reason about, the way splitting a 500-line function into four 125-line ones makes the program easier to read even though the line count didn't drop.

**My orchestration script got a `verify/` directory.** Verification gates were the primitive I was weakest on. I had implicit checks scattered around — "if the test command fails, abort" — but no explicit notion of what a verification gate *was*. Now each gate is a small script: takes input, returns pass/fail with a reason, runs in CI as well as locally. This is the change I expected to be the most cosmetic and turned out to be the most useful.

**I deleted three "helper" skills.** The paper's notion of *delegation boundary* — what you actually let the agent decide vs. what you reserve for humans — surfaced that I had skills doing things that should have been hardcoded, and code doing things that should have been delegated. The cleanup wasn't dramatic, but it removed a category of bug I kept hitting: the agent making decisions I didn't realize I was authorizing.

![Harness primitives — roles, contracts, gates, state, boundaries](/images/blog/natural-language-agent-harnesses-arxiv/harness-primitives.png)

## The vocabulary effect on the team

The least-quantifiable thing in this post is also the most useful: my standup meetings got shorter. Not because we work faster, but because we stopped arguing about which thing we were talking about.

Before: "I'm working on the agent stuff. The…you know. The orchestration layer? The CLAUDE.md plus the skills plus the runner?"

After: "I'm refactoring the verification gates."

The first version is six seconds long and conveys roughly nothing. The second is two seconds long and tells you exactly what's happening. Multiply that by every meeting, every PR description, every Slack thread, and the savings become real. I have no scientific measurement of "30% shorter," I just made that up in the title — but the qualitative shift is undeniable. We picked up a shared word for a shared thing, and the friction dropped.

This is also the boring reason terminology in academia matters. The paper's contribution isn't only the runtime or the primitives. It's a stable name that gives people permission to talk about the thing without pre-negotiating what to call it. Hadley Wickham's "tidy data" did this for data analysis a decade ago. The same pattern works for any field that's been doing the work without a vocabulary.

## What I'd push back on

A few things in the paper I'm not yet sold on.

**The runtime requirement.** The paper bundles natural-language harnesses with a specific runtime, IHR. The argument is reasonable — without a shared runtime, "natural language" can mean anything — but in practice, every team will use whatever runtime they're already on (Claude Code, Cursor, custom). The natural-language *spec* is the portable part. The runtime requirement risks making the framework a thing you adopt as a whole or not at all, when actually you can adopt the primitives piecemeal and benefit immediately.

**The benchmarks.** The paper validates on coding and computer-use tasks, which is fine, but I'd love to see harness ablations on non-coding domains. My agents do plenty of writing, scheduling, and summarization, and I don't yet know whether the same primitives carry over. The paper would be more powerful if it tested its own portability claim.

**The implication that this is settled.** It's a v1 from March 2026. Anthropic's own [harness-design paper](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/) from April uses different vocabulary (planner / generator / evaluator). The [preprints.org survey](https://www.preprints.org/manuscript/202604.0428/v1) carves the field up differently again. We're at the stage where everyone agrees there's a thing, and disagrees on the carving. That's normal for a young field, but worth flagging — don't tattoo any of these primitives onto your team's process yet.

## What this changes for you

If you maintain a CLAUDE.md, AGENTS.md, or any kind of agent configuration, here's what I'd actually do with this paper.

**Skim the abstract and Table 2.** Don't bother with the full math. The abstract gives you the framing, Table 2 gives you the primitives, and that's the load-bearing part for practitioners. Twenty minutes, tops.

**Audit your config against the primitives.** Read your CLAUDE.md and ask: *which sentences are roles? which are contracts? which are verification gates?* If you can't sort them, your config is doing too many jobs at once. Rewriting it with explicit headers takes maybe an hour and pays off the next time you onboard a teammate or swap models.

**Adopt the word "harness."** Not because it's magical, but because it's now in arXiv and your colleagues might recognize it. Saying "let me check the harness" is more precise than "let me check my setup," and precision is free.

**Don't over-invest yet.** The vocabulary will move. Better to absorb the framing than to commit to one paper's specific runtime.

The whole reason I wrote this post is that the paper tipped over a useful thing for me — naming a category I'd been operating in for a year without realizing it. Sometimes the contribution of a paper isn't a method or a result. Sometimes it's just *here is what to call this*. That sounds modest. It is. It also made my code better the same week I read it, which is a higher hit rate than most of what I read.

I'll keep calling it the harness. If a better word shows up next year, I'll switch again. That's also fine.

## References

- [Natural-Language Agent Harnesses](https://arxiv.org/abs/2603.25723) — Pan et al., arXiv 2603.25723, March 2026
- [Agent Harness for Large Language Model Agents: A Survey](https://www.preprints.org/manuscript/202604.0428/v1) — preprints.org, April 2026
- [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Anthropic Engineering
- [Anthropic's Three-Agent Harness for Full-Stack AI Development](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/) — InfoQ, April 2026
- [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — community-curated list
- [2025 Was Agents. 2026 Is Agent Harnesses.](https://aakashgupta.medium.com/2025-was-agents-2026-is-agent-harnesses-heres-why-that-changes-everything-073e9877655e) — Aakash Gupta, Medium

---

## Want to go deeper?

For a complete walk-through of harness engineering — the six structural elements, formal patterns, AGENTS.md design, and how to wire CLAUDE.md, skills, and hooks into a coherent runtime — see **[Harness Engineering Guide: Designing the Layer Around the Model](https://kenimoto.dev/books/harness-engineering-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=harness-arxiv-paper)**.
