---
title: "I Refused to Write Specs Until Claude Code Generated Wrong Code Three Times"
description: "I called spec-driven development 'overhead' for six months. Then Claude Code wrote a discount feature that applied coupons to itself, three times in a row. Here is what fifteen minutes of OpenAPI bought me."
date: 2026-05-09
lang: en
tags: [ai, claudecode, spec, openapi]
featured: false
canonical_url: "https://kenimoto.dev/blog/spec-driven-development-claude-code-three-failures/"
og_image: "https://kenimoto.dev/images/blog/spec-driven-development-claude-code-three-failures/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-refused-to-write-specs-until-claude-code-generated-wrong-code-three-times-56f1
---

I read the phrase "spec-driven development" and immediately decided it was for people without taste. Six months later, Claude Code generated a discount system that applied coupons to itself. Three times in a row.

The first time I laughed. The second time I assumed the prompt was the problem. The third time I closed the editor, opened a YAML file, and started writing OpenAPI like a person who had finally lost an argument with reality.

This post is about that argument. And about what fifteen minutes of spec-writing actually buys you in 2026, when half the developer Twittersphere is still telling you to "just prompt it."

## What I was doing wrong

My workflow was the one everyone has tried. Open Claude Code. Type "build me a checkout flow with member discount and a promo code field." Watch the agent confidently generate four hundred lines of Flask. Skim. Run. Fail. Re-prompt. Get a different four hundred lines. Repeat until I either ran out of patience or shipped something that mostly worked.

The discount feature was where the wheels came off. I asked for "10 percent member discount, stackable promo codes, max 30 percent total." Claude Code shipped a function that, when given a promo code on a member account, took 10 percent off, then took another 10 percent off the discounted total, then applied the promo. The promo code, as it turns out, was also a member-discount-eligible item in my schema, because I had not bothered to tell anyone that members are people and promos are line items. So the system politely gave my coupon a coupon.

Yes, I am the engineer who wrote "just prompt it" in a thread last week and then spent five PR rounds explaining what "just" meant.

## The fifteen-minute spec

Out of spite, I tried the thing I had been calling overhead. I wrote an OpenAPI document. Endpoint, request shape, response shape, error codes, the constraints on every field. It took fifteen minutes.

```yaml
paths:
  /api/orders:
    post:
      requestBody:
        application/json:
          schema:
            customer_id: string
            items: array of OrderItem
            promo_code: string | null
      responses:
        201:
          schema:
            order_id: string
            subtotal: integer (minimum 0)
            member_discount: integer (0..subtotal * 0.1, integer)
            promo_discount: integer
            total: integer
            applied_rules: array of string
        400:
          schema:
            error: { code, message }
```

Then I wrote a Gherkin file with three scenarios. Member buys without promo. Non-member uses promo. Member uses promo and the total cap kicks in.

```gherkin
Scenario: Member with promo, capped at 30% total
  Given a logged-in member
  And a cart with subtotal 10000 yen
  When they apply promo code "SPRING5"
  Then member_discount is 1000
  And promo_discount is 2000
  And total is 7000
  And applied_rules includes "member" and "promo:SPRING5"
```

I handed both files to Claude Code with one sentence: "implement these specs in Flask, including validation and error handling." It generated about 80 percent of the implementation in three minutes. The remaining 20 percent was real domain logic: what counts as "stackable," what happens at the cap. I wrote that. The spec made it impossible to be confused about it.

Fifteen minutes of YAML to delete five PR rounds of "what did you mean by stackable." I had been doing the loud version of saving fifteen minutes by spending two hours.

## Why it works (and why "just prompt it" doesn't)

The reason has nothing to do with Claude Code being smarter when you give it more text. It has to do with what you, the human, are forced to think about while writing the spec.

When I write `member_discount: integer (0..subtotal * 0.1, integer)`, I have committed to the idea that member discount is at most ten percent of the subtotal, in integer yen. I cannot generate a spec that "applies the coupon to itself" because the spec doesn't have a coupon-shaped recipient for that recursion. The ambiguity dies in YAML, before it can metastasize in Python.

This isn't original to me. The 2026 wave of spec-driven tooling ([OpenSpec](https://github.com/Fission-AI/OpenSpec), [cc-sdd](https://github.com/gotalab/cc-sdd), [amux](https://amux.io/guides/spec-driven-development/), [Kiro](https://kiro.dev)) is all built on the same observation. GitHub Copilot Workspace doesn't even let you skip the step: it generates an editable "proposed specification" before it touches code, because the team that built it figured out that the spec is the only artifact in the workflow that the human can actually review.

The cheap-model lesson generalizes: AI assistants don't reduce the value of specs. They turn a fuzzy spec into an expensive mistake faster than humans ever could.

## The three patterns that paid off

The book version of this is three patterns, and after living with them for a quarter, all three pull weight.

![Spec-Driven Development with Claude Code: three patterns](/images/blog/spec-driven-development-claude-code-three-failures/three-patterns.png)

**Pattern 1: OpenAPI to implementation.** Write the endpoint shape. Hand it to Claude Code. Get a stub that handles 80 percent of CRUD plus serialization plus the obvious error cases. Add the domain logic by hand. This is the bread-and-butter case. It is also where the "80 percent" number comes from. The remaining 20 percent is what you're actually paid to think about.

**Pattern 2: Gherkin to step definitions.** Write scenarios in Given/When/Then. Hand them to Claude Code with `pytest-bdd` or `behave`. Get the step skeletons. The interesting move here is that the same scenarios drive both implementation prompts and test prompts, so the agent can't drift between "what the code does" and "what the test checks." Drift is where bugs ship.

**Pattern 3: Spec to property tests.** From the OpenAPI schema (`price: integer, minimum: 0, maximum: 1_000_000`), have Claude Code generate property-based tests with Hypothesis or fast-check. You get the boundary cases (`0`, `1_000_000`, `-1`, `null`, overflow) without having to remember every flavor of "what could go wrong with an integer." This is the one I underused for years and regret most.

## The traps

Three things will bite you if you don't watch for them.

**Ambiguity in specs scales linearly with the bugs in implementation.** If your OpenAPI says `discount: number` instead of `discount: integer (0..subtotal*0.1)`, the model will guess. It will guess differently every time. Vague specs aren't a head start; they're a paid-for hallucination factory. SDD only works as a forcing function on you.

**Never trust generated code unconditionally.** Sample of bugs I have shipped from generated code in the last three months: a SQL query built with string concatenation (injection waiting to happen), a JWT stored in `localStorage` (it should have been `httpOnly`), and a silent N+1 over a thousand-row table. The agent didn't write any of those out of malice. It wrote them because nothing in my spec said "no." Specs need a constraints section. Read [my 24-hour autonomous agent post](/blog/autonomous-agent-24-hours-security-lessons/) if you want to know how creative an agent gets when constraints aren't there.

**The agent will add requirements you didn't ask for.** I have watched Claude Code add an authentication check to an endpoint whose spec said "public, rate-limited only." The agent had read enough Stack Overflow to think every endpoint should be authenticated, and silently slipped a check in. Specs need to be explicit about what the system *doesn't* do, not just what it does.

## How I write specs now

The workflow that survived contact with reality is unromantic.

1. Sketch the endpoint in OpenAPI. Field types, ranges, required vs optional.
2. Write three Gherkin scenarios. Happy path, edge case, error case.
3. Add a `## Out of scope` section to the spec file. Auth model. Rate limit. Caching. Anything the agent might helpfully invent.
4. Hand all three to Claude Code with `CLAUDE.md` containing project conventions.
5. Generate. Review the diff against the spec, not against vibes.
6. Run the property tests the spec generated.

This is also where [Claude Code Skills](/blog/claude-code-skills-reusable-workflow-pattern/) earn their keep. I wrap the steps above into a single skill, `/spec-impl`, and the workflow stops being a discipline I have to remember and starts being one slash command. Versus [ChatGPT Codex](/blog/claude-code-vs-chatgpt-codex-official-agents/) on the same task, the spec-first version of either agent reaches "production-shaped" code faster than the prompt-first version of the better one. The agent matters less than the artifact in front of it.

## What I'd tell past-me

I would tell past-me that the fifteen minutes of OpenAPI he refused to write cost him an entire weekend of "just one more prompt." I would tell him that spec-driven development is not a methodology you adopt because some consultancy sold it to your CTO; it's the cheapest known mechanism for not arguing with a fast, confident, slightly drunk junior engineer.

And I would tell him this: in 2026, agents turn every fuzzy spec into an expensive mistake faster than any human ever could.

The specs are the brake pedal. Without them, you still go fast. You just go fast in whichever direction the agent's training data pointed last.

---

*If you're building this kind of workflow into your own team, the surface area is bigger than this post: DDD scoping, BDD test pyramids, microservice contract testing, the whole governance side. I'm working on a longer treatment of all of it; details to follow.*
