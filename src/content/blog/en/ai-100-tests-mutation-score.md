---
title: "AI Wrote 100 Passing Tests. Mutation Testing Says They Caught 58% of Real Bugs."
description: "My AI agent generated a green test suite with 92% line coverage. Then I ran mutation testing and found it only caught 58% of injected bugs. This isn't about writing tests before or after the code. It's about tests that pass and verify almost nothing."
date: 2026-06-15
lang: en
tags: [testing, mutation-testing, claude-code, ai-coding, tdd]
featured: false
canonical_url: "https://kenimoto.dev/blog/ai-100-tests-mutation-score/"
og_image: "https://kenimoto.dev/images/blog/ai-100-tests-mutation-score/og.png"
cross_posted_to: []
---

For a few weeks I walked around telling people my test suite was "basically bulletproof." One hundred tests, all green, 92% line coverage on the module I cared about. I said this out loud, to actual humans, with a straight face. Then I ran mutation testing against the same suite and watched 42% of the bugs I deliberately injected stroll right past it. The suite caught 58%. Bulletproof was generous. It was more like a screen door.

Before anyone files this under the usual debate: this is not the "write tests before or after the code" argument. I know that one. It's about ordering, about whether you let the AI implement first and backfill tests later. Fine topic, different topic. The problem I hit is nastier, because it survives the ordering fix. You can have tests written at the perfect moment, all passing, decent coverage, and still verify almost nothing. Green does not mean checked.

## Correcting your own homework

Here's the line that reframed it for me. The New Stack put it cleanly, and it stuck: asking an LLM to write tests for code it just wrote is like letting a student grade their own exam. The model already knows what the implementation does. So the tests it produces tend to describe that behavior rather than challenge it. They assert that the code does what the code does. Tautology with a green checkmark.

This is the part people miss when they look at coverage. Line coverage answers "did a test touch this line?" It says nothing about whether the test would notice if that line were wrong. An assertion like `expect(result).toBeDefined()` executes the whole function and covers every line inside it. It also passes whether the function returns the correct total, a wrong total, or the number 7. Coverage: excellent. Verification: zero.

When an AI writes both the code and the tests in the same breath, it produces a lot of these. Not out of laziness. It's structural. The model optimizes for "make this pass," and the cheapest way to make an assertion pass is to assert something that's already true.

## What mutation testing actually does

Mutation testing is the only tool I've found that measures the thing coverage pretends to measure. The idea is almost rude in its simplicity: it breaks your code on purpose, then checks whether your tests notice.

A tool like [Stryker](https://stryker-mutator.io/) (for JS/TS; `mutmut` for Python, PIT for Java) takes your source and generates hundreds of small mutants. It flips a `>` to `>=`. It changes `+` to `-`. It replaces a boolean return with `true`. It deletes a function call. For each mutant, it reruns your suite. If a test fails, the mutant is "killed," which means your tests caught the sabotage. If every test still passes, the mutant "survived," which means you have a change to your logic that no test on earth objects to.

The mutation score is killed over total. Eighty percent and up is the bar people aim for in 2026 when they care about a module. My AI-generated suite, with its proud 92% coverage, scored 58.

That 34-point gap between coverage and mutation score is the whole story. Coverage said "I ran your code." Mutation testing said "I changed your code into something wrong and your tests clapped anyway."

![A bar comparison: line coverage at 92 percent next to mutation score at 58 percent, with the 34-point gap labeled as the bugs the tests never caught](/images/blog/ai-100-tests-mutation-score/og.png)

## I ran the numbers so you don't have to (but you should)

The setup was deliberately boring so the result wouldn't be a fluke. A TypeScript module, about 400 lines: pricing logic, a few date calculations, input validation, the kind of code that quietly ruins a Friday when it's wrong. I asked the agent to implement it and write a thorough test suite in the same session. It gave me 100 tests, all passing, 92% line coverage. I changed nothing about the tests.

Then `npx stryker run`. 214 mutants. 124 killed, 90 survived. Score: 58%.

I read the survivors one by one, which I recommend as a humbling experience. A surcharge calculation where flipping the comparison operator changed nobody's bill in the eyes of the suite. A validation branch that rejected negative quantities, except the test only ever passed it valid ones, so deleting the entire check killed nothing. The off-by-one in a date range that three "passing" tests sailed straight through. None of these would have shown up in coverage. All of them were real bugs the suite was structurally blind to.

Was the AI bad at writing tests? No. It was excellent at writing tests that pass. Those are different jobs, and I'd been grading it on the wrong one.

## The fix is older than the problem

The annoying answer is that TDD already solved this, and I'd half-abandoned it because the AI made test-writing feel optional.

The structural point of TDD isn't ceremony, and it isn't the red-green-refactor dance. It's where the quality gate lives. When a human writes the test first, from the spec, before the implementation exists, the test encodes intent the implementation can't yet pander to. The model then writes code to satisfy a target it didn't get to define. The gate stays on the human side. That's the entire value, and it's exactly what you forfeit when you let the same agent write code and tests together: the gate quietly migrates to the model, which is grading its own homework again.

So I've changed how I split the work. I write the test, or at minimum the assertions and the edge cases, before the agent implements. Negative numbers, empty inputs, the boundary that's always off by one. The AI is genuinely great at the implementation and at filling in mechanical test scaffolding around assertions I've defined. It's the *defining* part I stopped delegating. And once a quarter, on anything I'd be embarrassed to ship broken, I run mutation testing. Not as a daily ritual, just as a periodic reality check on whether my green is real green.

My suite is at 84% now. Still not bulletproof. But I've retired the screen door, and I've stopped saying "bulletproof" to humans. Progress comes in many shapes.

The takeaway isn't "AI writes bad tests." It's that a passing suite and a verifying suite are not the same artifact, coverage can't tell them apart, and mutation testing is the cheapest way to find out which one you actually have. Run it once on the module you're proudest of. Worst case, you were right. Best case, you find out before production does.

---

This is one slice of a much larger problem: how do you keep quality gates on the human side when the AI is fast enough to do everything? I worked through the full playbook in **[Practical Claude Code](https://kenimoto.dev/books/claude-code-mastery?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=ai-100-tests-mutation-score)**: CLAUDE.md patterns, multi-agent TDD that separates the test-writer from the implementer so neither can cheat, Playwright MCP, and CI integration.
