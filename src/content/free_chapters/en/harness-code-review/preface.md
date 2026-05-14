---
title: "Preface -- Turning Reviews into a System"
free: true
---


"Write tests before opening a PR."

I wrote that in AGENTS.md. A PR showed up without tests anyway.

"Use Conventional Comments labels."

I shared the convention with the team. A week later, I was the only one using labels.

Requests get forgotten. Rules get broken.

But **systems** keep running.

---

I have failed multiple times at making review culture stick.

I wrote documentation. Nobody read it. I ran a workshop. Forgotten by the following week. I sent Slack reminders. People muted the channel.

Yet every Monday, I kept writing review comments like "fix the formatting" and "reorder the imports." Thirty minutes, every week.

The person writing those comments felt productive. But what about the person on the receiving end?

"Flagged again." "Another round of fixes." Formatting comments are pure friction for the recipient. A design discussion teaches you something. "Your indentation isn't 2 spaces" teaches you nothing. You just fix it. The reviewer gets tired. The reviewee gets tired.

And when both sides are tired, what happens?

Reviews get ignored.

PRs sit open for three days. Nobody comments. Someone clicks Approve and merges. Review becomes a formality. This is the reality for many teams.

The turning point came when I introduced an AI review tool.

The moment CodeRabbit caught every formatting and linter violation, the review thread changed completely. Instead of "fix the indent," the conversations became "what about this design?" and "should we keep adding this pattern?" Something shifted.

It felt like installing a traffic light so the officer directing traffic could go back to actual police work.

---

This book is about turning code review from a "request" into a "system."

Hooks enforce linting. AI handles first-pass review. Humans focus on design and direction.

The approach is straightforward. File structures, configurations, and pipelines are explained at copy-paste granularity.

Some familiarity with harness engineering fundamentals (AGENTS.md, hooks, feedback loops) and basic code review concepts will make the book easier to follow.

Code review is the heartbeat of the harness. When the heart stops, everything else is affected.
