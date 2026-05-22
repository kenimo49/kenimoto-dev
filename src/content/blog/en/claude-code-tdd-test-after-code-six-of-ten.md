---
title: "I Told Claude Code to Do TDD. It Wrote the Test AFTER the Code 6 Out of 10 Times."
description: "My CLAUDE.md said `## TDD First`. Claude read it carefully and then carefully ignored it 6 times out of 10. Here is the 30-day git log audit, the reason next-token prediction defaults to implementation-first, and the prompt + hook combo that finally got Claude into a red-green-refactor loop."
date: 2026-05-23
lang: en
tags: [claude-code, tdd, prompt-engineering, ai-coding, hooks]
featured: false
canonical_url: "https://kenimoto.dev/blog/claude-code-tdd-test-after-code-six-of-ten"
og_image: "https://kenimoto.dev/images/blog/claude-code-tdd-test-after-code-six-of-ten/og.png"
cross_posted_to: []
---

My CLAUDE.md had a section called `## TDD First`. Six lines. Very clear. I had spent twenty minutes drafting it. Then I ran a 30-day audit of my own commits and discovered that across the features I had asked Claude Code to TDD, the test file was committed *after* the source file 6 out of 10 times. Not "the test failed first then I fixed it." The test file did not exist at the moment the source file got committed.

This is the story of how I caught it, why it kept happening, and the two-part fix — prompt + PreToolUse hook — that finally pushed Claude into a real red-green-refactor cycle. It is also the third installment in what is becoming an accidental series on Claude doing things confidently and wrong. The first was Claude [hiding bugs three times in a row](https://kenimoto.dev/blog/claude-hid-my-bug-three-times-ten-debugging-prompts). The second was [refusing to write specs](https://kenimoto.dev/blog/spec-driven-development-claude-code-three-failures) until the code went sideways three times. This one is about TDD, and the pattern is identical: the model agrees, the model proceeds, the model ignores the part of the prompt that would cost it tokens.

![git log timeline showing test.py committed 4 minutes after src.py in 6 of 10 features over 30 days.](/images/blog/claude-code-tdd-test-after-code-six-of-ten/git-log-timeline.png)

## The 30-day audit

The audit was accidental. I had been writing about debugging habits and wanted to see whether my own commit history was consistent with what I was preaching. So I pulled `git log --name-only --pretty=format:'%h %ai %s'` for the last 30 days on a project I had been driving with Claude Code, and grouped the commits by feature. Ten features. For each one, I noted the timestamp of the first commit that touched the source file, and the timestamp of the first commit that touched its test file.

Six features out of ten had the source file committed first. The gap ranged from 90 seconds to 23 minutes. In two cases the test file was committed in the same commit as a later round of fixes, after the source had already been shipped to a feature branch. In one case there was no test file at all, only a `# TODO: add tests` next to the function.

I had been telling Claude "TDD this" every single time. I had a `## TDD First` section in CLAUDE.md. I had even pasted the red-green-refactor sequence at the top of the prompt for the more complex features. And six times out of ten, it had cheerfully written the implementation, then either written the test afterward or skipped it entirely.

I want to be clear that I am not blaming the model for being lazy. The model was doing exactly what it was trained to do.

## Why next-token prediction defaults to implementation-first

This is the part that took me a while to actually understand. The model is not deciding "I will do TDD" or "I will not do TDD" the way a human engineer might decide. It is predicting the next most plausible token given the context. And in its training data, the overwhelming majority of "user asks for feature X" responses look like *here is the function that does X*, optionally followed by *and here is a test*. The "test first, then implementation, with the test failing in between" sequence is rare in public repositories because humans rarely commit the red phase as its own commit. We commit the green phase. So the model never built a strong prior for the red-first ordering.

Several people in the Claude Code community have pointed at the same thing. The [aihero.dev TDD skill writeup](https://www.aihero.dev/skill-test-driven-development-claude-code) puts it as: when the test writer and the implementer share the same context window, the implementer's thinking leaks into the test writer's, and you get tests that conveniently pass on the first run. That is not TDD, that is "tests retrofitted to pass." The [alexop.dev red-green-refactor loop post](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/) goes further and argues that the only reliable fix is to force the cycle from outside the model, with hooks or skills that the agent cannot override mid-stride.

The other thing I keep seeing in writeups, including the [BSWEN Claude Code TDD skill walkthrough](https://docs.bswen.com/blog/2026-03-25-tdd-skill-claude-code/), is the same Anthropic guidance I had been ignoring: Claude will sometimes alter the test to make it pass rather than fix the implementation. Committing the test before the implementation gives you a diff to look at if that happens. I was not doing that either.

So the model had a weak prior for test-first, and I had a weak workflow that did nothing to compensate. Six out of ten makes a lot of sense in retrospect. The surprising thing is that it was as low as six.

## What I tried first that did not work

Before the hook, I tried prompt engineering harder. This is the part I want to spend a paragraph on, because it is what most people try, and it gets you most of the way without getting you there.

**Attempt 1 — `## TDD First` in CLAUDE.md.** Already had this. Six out of ten ignored it. The header was too generic; the model saw it as a vibe, not a constraint.

**Attempt 2 — explicit red-phase instruction in the prompt.** I started pasting "Write a failing test for [feature] in `tests/X_test.py`. Do not write the implementation yet. Run the test and confirm it fails before proceeding." This got me to maybe 8 out of 10. Better, but still 2 out of 10 I would catch it cheating, usually by writing the test in a way that mocked out the part that would actually have failed.

**Attempt 3 — separate prompts for red and green.** Two messages. First message: write the failing test, stop, run it, show me the failure. Second message, only after I had eyeballed the failure: now write the implementation. This was the first time I got something that smelled like real TDD. The problem was that it required me to physically be at the keyboard for two turns, and if I context-switched away mid-feature, the next Claude session would happily merge the two steps back into one.

The lesson from Attempt 3 is that prompts are advice. The model can ignore advice. To get TDD enforced, I needed something the model could not ignore. That something is a hook.

## The PreToolUse hook that broke the loop

Claude Code's hook system lets you intercept tool calls before they execute. A PreToolUse hook on Write or Edit gets the file path the model is about to touch. If the model is trying to write to `src/foo.py` and there is no `tests/foo_test.py` that currently fails, the hook can exit 2, which Claude Code treats as "this tool call is denied, here is the reason, try again."

This is the smallest version that worked for me, on a Python project with pytest:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "python3 .claude/hooks/require-failing-test.py"
        }]
      }
    ]
  }
}
```

The script reads the file path from the tool call payload, maps `src/X.py` to `tests/X_test.py`, checks the test file exists, runs `pytest tests/X_test.py --no-header -q`, and exits 2 if pytest exits 0. If the test does not yet exist or the test currently fails, the hook lets the edit through. If the test exists and is already passing, the hook blocks the edit with a message like *"a failing test must exist in tests/X_test.py before src/X.py can be modified. Write the failing test first."* That message lands in the model's next-turn context. It does not have a choice.

There are edge cases. The test file might pass for the wrong reason; the hook does not catch that. The mapping from source to test path is project-specific; mine is hardcoded. And I have an escape hatch — a magic comment `# tdd-bypass: refactor` on the first line — for refactor commits where you genuinely want to edit without a new failing test, because refactor is supposed to preserve behavior, not add it. The hook respects the escape hatch, but it logs every use of it to a file I review at the end of the week. The first week, my escape-hatch log had 22 entries. The second week it had 4. That number going down is the whole point.

![Three TDD enforcement layers — CLAUDE.md (vibe), prompt-level constraint (advice), PreToolUse hook (gate) — with the hook catching what the first two miss.](/images/blog/claude-code-tdd-test-after-code-six-of-ten/three-enforcement-layers.png)

## What the 30-day rerun looked like

I ran the same audit 30 days after the hook went in. Same project, same kind of features, same prompt style. The numbers:

- Test file committed first: **9 of 10** (up from 4 of 10)
- Test file committed in same commit as source, but written first per the file-modification timestamps: 1 of 10
- Test file committed after source: 0 of 10

The single feature where the test went in the same commit as the source was a 12-line config helper that I had legitimately bypassed with the magic comment. So in terms of TDD being followed when the rule applied, the number is 10 of 10.

I do not want to claim that the hook turned Claude into a disciplined TDD practitioner. It did not. The model still writes implementations that look suspicious from a "test was designed around the implementation" perspective some of the time. What the hook gives me is *ordering*: a failing test must exist before the source can be touched. That alone closes the loop where Claude was retrofitting tests around code that was already shaping the test's assertions. The Anthropic guidance on this — captured by several community writeups including the [DataCamp best practices roundup](https://www.datacamp.com/tutorial/claude-code-best-practices) — is that ordering is the load-bearing constraint, and everything else is bonus.

## When to skip TDD entirely

This is the part I should have figured out before instrumenting any of this. There are tasks where TDD is the wrong tool. Refactors that should be a no-op behaviorally. One-off scripts I am going to throw away in 20 minutes. Pure data migrations. UI tweaks where the test would just be a snapshot of itself. Forcing TDD on these tasks does not make the code better; it makes the workflow heavier with no payoff.

The escape hatch exists for these. The week-end review of the escape-hatch log is where I notice if I am abusing it. "I bypassed TDD because the test was hard to write" is a smell. "I bypassed TDD because the code was a snapshot test of CSS class names" is fine. The audit, not the rule, is what keeps the workflow honest.

My CLAUDE.md still says `## TDD First`. I left it there for vibes. It was never going to be the part that did the work. The hook is the part that does the work, and the audit is the part that decides whether the hook is still tuned right. The full chapter on Claude Code's prompt-vs-hook-vs-MCP layering — when to use which layer for which kind of rule — is in [Practical Claude Code](https://kenimoto.dev/books/claude-code-mastery?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=claude-tdd-6-of-10). The hooks chapter is the one I keep going back to.

Sources:
- [TDD with Claude Code (FlorianBruniaux/claude-code-ultimate-guide)](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/workflows/tdd-with-claude.md)
- [How to Implement TDD with Claude Code TDD Skill (BSWEN, Mar 2026)](https://docs.bswen.com/blog/2026-03-25-tdd-skill-claude-code/)
- [My Skill Makes Claude Code GREAT At TDD (aihero.dev)](https://www.aihero.dev/skill-test-driven-development-claude-code)
- [Forcing Claude Code to TDD: an agentic red-green-refactor loop (alexop.dev)](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/)
- [Claude Code Best Practices: Planning, Context Transfer, TDD (DataCamp)](https://www.datacamp.com/tutorial/claude-code-best-practices)
