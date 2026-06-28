---
title: "I Made Claude Code Review Only the Blast Radius — Token Bill Dropped 8-49x"
description: "Stop feeding the agent your whole repo. A Tree-sitter code knowledge graph cuts review tokens 8-49x by loading only the nodes within Hop ≤ 2 of the diff. Review less, not more."
date: 2026-06-28
lang: en
tags: [claude-code, code-review, knowledge-graph, tree-sitter, tokens]
featured: false
canonical_url: "https://kenimoto.dev/blog/claude-code-blast-radius-review-tokens-8-49x"
og_image: "https://kenimoto.dev/images/blog/claude-code-blast-radius-review-tokens-8-49x/og.png"
cross_posted_to: []
---

The first time I checked the token bill for a month of Claude Code reviews, I thought the invoice had a typo. It did not. I was paying to re-read a forty-thousand-file monorepo on every pull request, the same way a junior engineer might re-read the whole rulebook before answering a Slack thread.

The funny part is that I had been telling myself this was "context engineering." It was not. It was bulk loading.

I rebuilt the review path around a single rule: only show the agent what is within two hops of the diff. The token bill dropped between **8x and 49x** depending on the repo. The review quality went up, not down. This post is the mental model and the cheap version of the implementation that produced those numbers.

![Hop-based blast radius cuts review tokens](/images/blog/claude-code-blast-radius-review-tokens-8-49x/blast-radius-hops.png)

## The bill problem nobody wants to admit

Most Claude Code review setups I see fall into one of two buckets.

Bucket one is "give it the whole repo." This is the lazy default. It is also the bucket where, on a typical 300k LOC repo, you spend roughly 80% of your tokens loading files that the diff does not touch. The agent reads `utils/format_date.ts` for the four hundredth time. The agent reads three years of test fixtures. The agent reads your old auth middleware that you deleted last quarter and somehow still has a `.bak` in tree.

Bucket two is "let RAG decide." This is better, but the embeddings have no idea what calls what. A vector store will happily hand the agent a `UserService` snippet because the query had the word "user" in it, while missing the actual caller two files away because the caller used `u` as a variable name.

Both buckets are doing the same thing wrong: they treat the codebase as a bag of text. A codebase is not a bag of text. It is a graph.

## What "blast radius" actually means

I borrowed the term from security. There it means the area of damage if an exploit lands. In code review it means: if I change function F, which other functions could behave differently as a result?

That is a question with a precise answer. On a call graph it is a BFS:

```python
def blast_radius(graph, start, max_hops=2):
    visited = {start}
    by_hop = {0: {start}}
    frontier = {start}
    for hop in range(1, max_hops + 1):
        callers = set()
        for node in frontier:
            callers |= graph.callers_of(node) - visited
        if not callers:
            break
        visited |= callers
        by_hop[hop] = callers
        frontier = callers
    return by_hop
```

That is the entire idea. Walk backward from the diff, hop by hop, along call edges. Stop at hop 2. Hand the agent only the nodes in that set.

The "hop 2" cap is not arbitrary. It is the line where signal flips to noise on every codebase I have measured.

| Hop | Meaning | Review treatment |
|-----|---------|------------------|
| 0 | The change itself | Required reading |
| 1 | Direct callers | Required reading |
| 2 | Indirect callers | Skim for contract drift |
| 3 | Further callers | Reference only |
| 4+ | Far transitive | Default-hidden |

Stop at hop 2 and the agent reads ten to fifty nodes on a typical refactor. Let it run to hop 4 and you are back to hundreds of nodes, which is to say back to bucket one.

## The Tree-sitter step, in one paragraph

To compute that BFS you need the call graph. To get the call graph you need to parse the code. To parse the code across twelve languages without writing twelve parsers, you use Tree-sitter. The library is `tree-sitter-languages` on PyPI; the node types you care about are `function_definition`, `call_expression`, `import_statement`, and the class equivalents. Walk every file once, emit nodes for each function and class, emit edges for each call and import, store the whole thing in SQLite. On a 2,900-file project this indexes in under two seconds, and re-indexes incrementally on every save by hashing what changed. That is the entire prep cost.

The recent reference implementation, [`code-review-graph`](https://github.com/tirth8205/code-review-graph), runs the graph as an MCP server and reports **6.8x fewer tokens on average for code reviews and up to 49x fewer on monorepos** ([source](https://tirthkanani18.medium.com/i-built-a-knowledge-graph-that-cuts-claude-codes-token-usage-by-49x-ca73ef078981)). Those numbers line up with what I see on my own repos, with one caveat I will get to.

## The three traps that quietly destroy the savings

Most teams I have helped wire this up hit the same three traps. They all look reasonable. They all blow the blast radius back up to bucket-one size.

**Trap one: utility functions.** If `format_date()` is called from 400 sites and you treat it as a normal node, every change to it pulls in 400 files. The agent then "reviews" 400 files of irrelevant context and produces nothing useful. Fix: mark functions with caller counts above a threshold (twenty is the boundary I use) as utility nodes and default-exclude them from the BFS. You can always opt back in for the specific PR that does change `format_date`.

**Trap two: base class methods.** `BaseRepository.save` has fifteen subclasses. Without a cap on inheritance traversal, changing it pulls every `*Repository` plus their callers, which is half the repo. Fix: cap inheritance depth at one, or tag base classes the same way you tag utility nodes.

**Trap three: tests as callers.** `test_user_service.py` calls `UserService.create`. Of course it does, that is its job. Including test files as callers in the blast radius adds noise without adding information for an implementation review. Fix: keep a separate edge type for test-to-implementation calls and exclude it from the default BFS. Re-include it only when reviewing the tests themselves.

If you skip any one of these, the numbers degrade fast. With all three caps off, on the largest repo I tested, the "blast radius" of a one-line change was 1,200 files. With all three caps on, it was 23.

## "Reached" vs "behavior-changed" — the second axis

There is one more distinction that matters for review quality, separate from the token argument.

Walking the call graph tells you which functions are **reached** by a change. It does not tell you which functions will **behave differently**. Those are two different sets.

Change the internal logic of `UserService.create` without touching its signature or side effects, and the call graph says "everything that calls create is reached." But the callers see the same signature, the same return shape, the same exceptions. Their behavior does not change. You should review them with a much lighter touch than callers of a function whose return type just got tightened.

The cleanest implementation I have seen splits the output into two scored sets: a **reach blast radius** that is mechanically true, and a **behavior-change blast radius** that is an LLM estimate based on what actually changed in the diff. Show the user both, label them differently, let them decide where to spend attention. Anthropic's recent guidance on selective context loading lands in roughly the same place ([Claude platform docs](https://platform.claude.com/docs/en/managed-agents/overview)) — the harness, not the model, is where the money is.

## The caveat: when blast radius is the wrong frame

A few cases where this approach makes the bill worse, not better.

- **Cross-cutting concerns.** Logging, auth, feature flags. Changes here actually do ripple across the repo, and an artificially small blast radius will hide real risks. Tag these modules explicitly and bypass the BFS for them.
- **Configuration-driven dispatch.** If your codebase routes calls through a config file or a registry pattern, the static call graph misses the real edges. A second pass with dynamic-call completion is the fix (the knowledge-graph guide linked at the end covers this in Ch11).
- **First review of a new repo.** The agent has no model of the codebase yet. Skipping the wider read on the first pass means the agent has to learn the system one PR at a time. I let the first three PRs run with a wider hop cap, then tighten.

So no, this is not magic. It is just stopping the agent from reading the rulebook before every Slack thread.

## The recipe in five lines

If you want to try this tomorrow on one repo:

1. Pick a single language to start with. Python or TypeScript are the lowest-friction.
2. Build the graph once with `tree-sitter-languages`. Function and class nodes, call and import edges. Store as SQLite.
3. Wrap it as an MCP server (or just a CLI the agent shells out to) that takes a list of changed files and returns the hop-2 set.
4. Add the three caps: utility threshold, inheritance depth, test exclusion. Without these the numbers will lie to you.
5. Diff your token bill for the next thirty days against the previous thirty.

The number you should see is between **6x and 50x lower**, and the quality of the comments should be *higher*, because the agent is finally reading the right files instead of all of them.

Stop feeding the rulebook. Hand over the diff and what touches it. Let the agent do the actual work.

---

Building the graph, the MCP wrapper, the hop walker, and the three traps in detail is the spine of [The Practical Knowledge Graph Guide](https://kenimoto.dev/books/knowledge-graph-practical-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=claude-code-blast-radius), with reference code and the schema decisions written down so you do not have to re-derive them.
