---
title: "I Added a 4th Agent That Audits My Other Agents. It Caught My Strategist Procrastinating for 3 Weeks."
description: "Observer / Strategist / Marketer were following the rules. My Strategist had been writing 'we will evaluate next week' for three weeks straight, and none of the three layers could catch it. The 4th layer caught it on its first run."
date: 2026-05-22
lang: en
tags: [harness-engineering, ai-agent, claude-code, self-evolving, multi-agent]
featured: false
canonical_url: "https://kenimoto.dev/blog/evolver-fourth-agent-caught-strategist-procrastinating"
og_image: "https://kenimoto.dev/images/blog/evolver-fourth-agent-caught-strategist-procrastinating/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-added-a-4th-agent-that-audits-my-other-agents-it-caught-my-strategist-procrastinating-for-3-29hd
---

I built a three-layer agent harness and called it "autonomous." Observer collected the data. Strategist picked the theme. Marketer wrote the article. They all followed `strategy.md`, the file that holds my rules. The cron fired every Monday at 09:00 and the articles showed up by lunch. I felt very clever about it.

Then I read my own Strategist logs across three weeks and noticed something. The same retreat criterion — "if Reaction rate stays under 1% for four consecutive weeks, revise the strategy" — had been deferred three weeks in a row. Each week the Strategist wrote "data insufficient, observe next week" and moved on. The rule existed. The data existed. The rule never fired.

The three-layer harness couldn't catch this because the three layers were doing exactly what `strategy.md` told them to do. The bug wasn't in the agents. The bug was in the rules themselves, and nothing in the harness was paid to look at the rules.

I added a 4th layer called Evolver. On its first real proposal it filed a diff against the exact rule my Strategist had been hiding behind.

![The 4th layer audits the other three. Observer/Strategist/Marketer follow strategy.md. Evolver rewrites strategy.md itself.](/images/blog/evolver-fourth-agent-caught-strategist-procrastinating/four-layer-harness.png)

## The three layers were not the autonomous part

The architecture I had been calling autonomous looked like this. Observer ran daily and dumped GA4 numbers into `article-performance.jsonl`. Strategist ran every Monday morning, read `strategy.md`, and picked five themes for the week. Marketer turned each theme into an article and queued it for publishing. Three roles, three cron jobs, predictable behavior.

The trick that made this fast was that I had taken WebSearch away from Strategist on purpose. A Strategist with WebSearch wandered for twenty minutes per run and started picking themes that matched recent news instead of themes that matched my actual content library. Stripping WebSearch dropped the cycle from twenty minutes to three. I wrote about that separately. That post was about making Strategist faster. This one is about making it accountable.

The thing none of those three layers could do was rewrite `strategy.md`. They read it every Monday and obeyed it. If the rule was wrong, they obeyed a wrong rule. The only way to change the rule was for me, the human, to notice during weekly review that a rule needed updating. And I was the bottleneck. I had not been paying attention to the retreat criteria for at least three weeks.

## What the procrastination looked like in the logs

I am going to quote my own Strategist logs because the pattern is more honest when you see it in the original.

From the log dated three weeks before I added the Evolver:

> Reaction rate continues at 0% for the majority of articles. Title strategy has shifted to first-person and numerical framing. Four consecutive weeks under 1% would warrant a strategy review (currently three consecutive weeks, will determine next week).

The next week:

> Reaction rate has not yet reached four consecutive weeks under 1%, but weekly trend data is insufficient. Observe next week.

This is the entire failure mode in two sentences. The rule said "four consecutive weeks." The Strategist had three consecutive weeks of data under 1%. Instead of treating week four as the decision week, the Strategist kept describing the situation as "still observing" and the clock never advanced. The retreat criterion was structured in a way the agent could indefinitely defer.

When I went and computed the actual numbers from `article-performance.jsonl` myself, the picture was even uglier. Across 24 articles published in the last four weeks: 812 total views, 4 total reactions, 7 total comments. Reaction rate: 0.49%. Half the threshold. Engagement rate (reactions plus comments): 1.35%. The rule should have triggered weeks ago. It never did because there was no layer in the harness whose job was to ask "is this rule even doing anything."

## The 4th layer: what an Evolver is

So I added a 4th cron job. It runs on Saturdays at 09:00, separate from the Monday Observer/Strategist/Marketer chain. Unlike the other three, it has WebSearch enabled. Its job is not to write articles. Its job is to read the strategy file, read the last few weeks of decision logs, and propose diffs against `strategy.md`.

Each proposal is one file: `domains/<name>/data/evolution/EVO-NNNN.md`. The Evolver fills in five sections.

- Observation — what it saw in the data
- Proposal — the rule change in plain prose
- Rationale — internal data and external references that justify the change
- Expected impact — what should improve if applied
- Diff — a literal `diff` block against `strategy.md`

The diff block is the load-bearing part. The Evolver does not just write English suggestions. It writes the exact patch that would land in the repo. A small CLI called `harness-evolve.sh` knows how to extract the diff block, run `git apply --check`, and commit it with the proposal as the body. No LLM is involved in the apply step. The LLM proposes, the shell applies.

That separation is on purpose. The proposal is creative. The apply is mechanical. When the apply step is mechanical you can trust it to either succeed cleanly or fail loudly. There is no "the agent tried to apply the patch and something weird happened in the middle."

## EVO-0003 caught my Strategist procrastinating

The Evolver's third real proposal — `EVO-0003` — was the one I described above. The proposal is on disk and I am reading it back as I write this.

The observation section quoted both of my Strategist logs, the "three consecutive weeks, will determine next week" one and the "data insufficient, observe next week" one. Then it computed the engagement rate from `article-performance.jsonl` and showed that the threshold had been breached for at least four weeks. Then it argued that the original rule was bad in three ways:

1. The formula was not specified. Was "Reaction rate" per-article or aggregate? My Strategist could plausibly compute either, which is why it had been deferring.
2. The trigger condition "four consecutive weeks" was ambiguous when weekly data was thin.
3. The action on trigger — "propose a title and angle revision" — was abstract enough that the Strategist could fulfill it with a single sentence and move on.

The proposal replaced the rule with this:

> Engagement rate = (sum of reactions + comments over the last 4 weeks of articles) / sum of views. The Strategist must compute this every week and log it. If under 1.5% for four consecutive weeks, next week's 5 articles must be at least 4 titles in the "number + first person + failure narrative" form. Abstract titles are forbidden.

It is a 20-line patch. The diff is below the prose in the proposal file. I approved it via `/harness-evolve approve EVO-0003` at 14:04 on a Tuesday afternoon. The shell ran `git apply --index` against `strategy.md`, made the commit, updated the proposal's frontmatter to `status: applied`, and sent me a Telegram note. The next Monday's Strategist ran with the new rule and computed an engagement rate of 1.35% in the log without prompting. The "data insufficient" sentence stopped appearing.

The thing I want to be honest about is that the Strategist hadn't been malicious. It hadn't been broken either. It had been a perfectly competent agent following a rule that was structured to allow deferral. That is a failure of the rule. The Evolver's job is to detect rule failures, because nothing else in the harness was structured to.

## The Safety boundary, because Self-Evolving Agents are not toys

The minute you say "an agent that rewrites the harness," somebody in your head should be raising their hand and asking what stops it from rewriting itself into a paperclip optimizer. Several things, on purpose.

The Evolver cannot touch the kinds of decisions that have to remain mine. Adding or removing a domain. Switching languages. Changing the quality bar for writing. Anything involving licensing, author identity, or security. The `.env` file, the credentials directory, the publish triggers. If any of these were on the table I would not let the Evolver run unattended at all.

Inside the territory it can touch, three numeric limits keep it from running away.

- Diff size cap: 20 lines per proposal. A proposal larger than that has to be split or escalated.
- Two proposals per week per domain. If the Evolver wants to propose more, the third is held until next Saturday.
- Three consecutive rejects on the same theme triggers an automatic mute. The Evolver stops re-pitching the same idea after I have said no three times.

The last one is the part I think is undersold in the broader "self-improving agent" literature. The interesting signal in a `reject` log is not the proposal, it is the reason. "MCP is still the main revenue genre, we cannot drop it" is the kind of business context that has never been written into `strategy.md`. After three weeks of rejecting MCP-cut proposals with that reason, the Evolver stops proposing them. Implicit founder context becomes explicit harness behavior, just by accumulating reasons-for-reject.

## What you need before adding a 4th layer

I think there are three real prerequisites before adding an Evolver-style layer to your own setup. Without them, the 4th layer is just noise.

First, the three existing layers have to produce decision logs that another agent can read. If your Strategist's output is "ran successfully, picked themes," there is nothing for the Evolver to find. The procrastination only showed up because my Strategist had been writing structured logs with phrases like "currently three consecutive weeks, will determine next week." Logs that include the agent's reasoning in prose are what make audit possible.

Second, the rules themselves have to be in version control as text. `strategy.md` is a checked-in markdown file because the Evolver needs to produce a diff block that `git apply` can land. If your rules live in a database, a SaaS dashboard, or a thousand-line JSON config, the patch model breaks down. Plain markdown in git is the cheap path.

Third, you need a human approval channel that does not require the human to read the whole proposal every time. My Telegram notification has the EVO-ID, the title, and a one-line link to the file. I open the file only when the title makes me curious. Most of the time I either approve fast or reject with a short reason. If approval costs me ten minutes per proposal, I will stop running the Evolver. If it costs me thirty seconds, I will run it indefinitely.

## What about not adding a 4th layer

If you do not want a 4th layer, you can absolutely get most of the benefit by running a weekly human review with a specific question. Not "how are the agents doing." That is what I had been doing, and it did not catch the procrastination. The specific question is: "did any retreat criterion in `strategy.md` actually fire this week, and if not, why not."

Sit with that question for ten minutes per Friday. You will catch what I was missing for three weeks. The Evolver is, more than anything else, a forcing function for that question. It does not have to be an agent. It can be a calendar reminder.

I happen to like running it as an agent because the proposal artifacts pile up in version control and become a record of how my rules have evolved. `EVO-0001` through `EVO-0004` form a small history of "things ken thought were good ideas, things ken thought were bad ideas, and why." That history is useful when I am writing next year's `strategy.md` from scratch.

## What I have not built yet

The current Evolver only audits one domain at a time. Across my four domains (devto, qiita, zenn, kenimoto-dev) I have written different versions of `strategy.md` for each, and most of them have similarly structured retreat criteria. A cross-domain Evolver could notice that the same rule structure has been failing in two domains and propose a unified fix. I have not built it. It is on the list.

The other thing on the list is the obvious recursion question. Who audits the Evolver. The current answer is "I do, every approve/reject is a human signal." The longer answer is "I do not know yet." If the Evolver's proposals start looking systematically biased — say, always proposing tighter thresholds, or always proposing to drop the same genre — that bias is real and I should add a 5th layer that watches the 4th. I have not seen it yet. I might not until EVO-0050 or so. I want the bias to be obvious before I add another layer just to feel safer.

For now: three agents that follow rules, one agent that audits the rules, and one human who approves the audit. That is the smallest harness I have found that catches its own procrastination.

---

If you want the full Harness Engineering picture — the 6 building blocks, the AGENTS.md/CLAUDE.md/hooks patterns, and the Self-Evolving Agent chapter that grounds this article — that is in the book.

**[Harness Engineering: From Using AI to Controlling AI](https://kenimoto.dev/books/harness-engineering-guide)**
