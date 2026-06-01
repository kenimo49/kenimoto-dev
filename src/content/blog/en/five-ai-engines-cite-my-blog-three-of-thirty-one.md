---
title: "I Asked 5 AI Search Engines to Cite My Own Blog. Only 3 of 31 Articles Showed Up."
description: "I run a blog with 31 English articles. I asked ChatGPT, Claude, Gemini, Perplexity, and Brave AI to cite it. Three articles did all the work."
date: 2026-05-26
lang: en
tags: [llmo, ai-search, geo, measurement, blog-analytics]
featured: false
canonical_url: "https://kenimoto.dev/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/"
og_image: "https://kenimoto.dev/images/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-asked-5-ai-search-engines-to-cite-my-own-blog-only-3-of-31-articles-showed-up-5e6j
---

I write about LLMO almost every week. KPIs, llms.txt, JSON-LD, the whole liturgy. So a couple of weeks ago I decided to do the one thing I had somehow never done: ask the AI search engines to cite my own blog.

Not "is my site indexed." Not "do crawlers hit my domain." That stuff I already track. I mean the thing your reader actually does: open ChatGPT, type a question, and see if a blog post of mine shows up in the answer.

My English blog has 31 published posts. After pointing five AI engines at it, three of them did the work for all 31. The other 28 might as well have not existed.

![Five AI engines pointed at thirty-one articles, only three cited](/images/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/og.png)

## The setup

I picked the five engines that show up in my GA4 referral filter often enough to matter:

1. ChatGPT (with web search on)
2. Claude (with web search on)
3. Gemini
4. Perplexity
5. Brave AI

Then I built 30 prompts in three buckets, ten each, because LLM answers are stochastic and one prompt per engine is just vibes:

- **Branded** — `kenimoto.dev about page`, `ken imoto LLMO articles`, `ken imoto Claude Code blog`. The easy mode. If your domain name plus an article topic does not bring you up, something is broken.
- **Topical** — `safe autonomous coding agents`, `llms.txt anti patterns`, `how to measure AI citations`. The realistic mode. This is what a stranger types.
- **Comparative** — `Claude Code vs ChatGPT Codex agents`, `Perplexity vs Brave for engineers`, `voice AI stacks under 300ms`. The vanity mode. I have articles on all of these, and they should compete.

Three runs per prompt per engine, so 30 prompts × 5 engines × 3 = 450 turns. I logged whether `kenimoto.dev` appeared as a citation chip, an inline link, or in a "sources" footer. Mere mentions without a link did not count: the LLMO scoreboard only credits something a human can click.

That last detail matters more than it looks. A lot of the "AI is talking about you!" celebration online is people screenshotting their brand name showing up in plain text. That is a polite mention, not a citation. Citations move traffic. Mentions move egos.

## The result

Out of 31 articles, exactly three showed up as citations across all five engines:

- `measure-ai-citations-llmo-kpi`
- `11-json-ld-3-cited-by-ai`
- `geo-princeton-study-9-ways-ai-cites-you`

That is a 9.7% citation breadth, under one in ten articles. The other 28 either did not appear, or appeared once across the entire 450 turns and never reproduced. By the "run it three times" rule from the LLMO Quickstart playbook, those one-offs do not count.

Engine by engine it was even more lopsided. Perplexity and ChatGPT pulled in all three. Claude pulled in two of the three (it missed the Princeton GEO post entirely and substituted the original Princeton paper, which is technically the correct move). Gemini cited one, the JSON-LD post, and otherwise preferred the original sources the post was citing. Brave AI cited zero. It would describe the topic correctly and then send the reader to a competitor.

I had spent six months mentally treating my blog as a 31-piece corpus. The AI engines were treating it as a 3-piece corpus with 28 pieces of background noise.

## What the three winners have in common

I went back and read the three citation magnets next to five of the 28 ghosts to look for a pattern. The pattern is not subtle.

**They have a number or a measurement verb in the title.** "9 ways", "11 JSON-LD schemas, 3 cited", "measure". Every winner. The losers tend to have evocative titles — `cheap-model-won-context-beats-parameters`, `claude-hid-my-bug-three-times` — which read well but have no count an answer engine can latch onto.

**They are the topical hub for a specific question.** "How do I measure AI citations" maps directly to one of my posts. "What JSON-LD schemas actually get cited" maps directly to another. The ghosts tend to be experience reports — "I tried X for a month and here's what broke" — which are great for humans, but no LLM is fielding a prompt that says "tell me about ken imoto's month of refactoring 100 functions."

**They were published more than 30 days ago.** Every one of the three is at least six weeks old. Half the 28 ghosts are newer than that. AI index lag is real, and the LLMO Quickstart book is not joking when it says citation rates need at least a month of cooking before you read them.

The JSON-LD count, by the way, is the same across all 31 articles. I ship the same Astro layout for everything. So whatever is happening, it is not "the winners have better schema." It is the title, the topic gravity, and time.

## What the 28 ghosts have in common

The boring news first. Most of the ghost posts have one of three problems:

- The title makes a claim that does not appear anywhere else on the web, so the engine has no anchor. "The cheap model won" is a great line, but no human types it as a query.
- The topic is so niche that no general-purpose prompt would ever route to it. A voice AI latency post is, frankly, going to lose to the AssemblyAI blog every time. Topical hubs beat indie depth.
- The post is good but was published into a wall of competing content. My "Claude refactor 100 functions" piece is fine, but search "Claude refactor regression" and the answer is going to come back with whatever Anthropic posted about it last week.

The interesting news is what *doesn't* matter. Length does not matter: I have 800-word posts that get cited and 3,000-word posts that do not. Backlinks do not matter at the scale I am operating at, since my biggest backlink targets are not the cited three. Cross-posting to Dev.to does not move the needle on AI citation, only on direct traffic.

## What I'm changing

Three weeks of staring at this data and the action items are smaller than I expected.

I am not going to chase the "make every post a citation magnet" dream. Twenty-eight pieces of background noise turn out to be load-bearing for *humans*: they are how a returning reader builds a model of who I am. The blog stops being a blog if I file the serial number off every personal post.

What I am changing is the planning step. Before I draft a new post, I now run the title past a "would any AI prompt route to this" gut check. If the answer is no, I either (a) reframe with a number or a question stem that maps to a search behavior, or (b) accept that this post is a human-only post and stop hoping for AI traffic. Hoping has not worked.

I am also building a `kenimoto.dev` hub page for each of the three winning topics. The reasoning is from the [LLMO Framework's](https://llmoframework.com/) Authority Signals and Coherence Signals pillars. If you want a citation to compound, the cited URL should sit at the top of a small content cluster, not be a lone post drifting in a sea of unrelated essays. The Citability pillar is what gets you a single citation. Authority is what gets you cited consistently across engines.

## Wider takeaway

If you write about LLMO, run this experiment on yourself this week. It will take an evening. The result will be more useful than the next three crawler-log posts you read.

Most of the LLMO conversation online is people checking whether *other people's* sites get cited: JSON-LD audits, llms.txt audits, GA4 segments. Those are fine for benchmarking strangers. They do not tell you whether your own corpus actually shows up.

The thing I underestimated is how concentrated the citations are. I expected 5-10% breadth and got 9.7%, so the number was about right. What surprised me was that the cited three were carrying every engine, every prompt bucket, every retry. LLMO turns out to be a tournament. You are not optimizing 31 posts. You are optimizing for which 2 or 3 win the bracket.

The other thing I underestimated is how much of the "winner" profile is set at the title stage. By the time you are tweaking JSON-LD on a live post, the routing has already happened. The prompt either lands on you or it doesn't, and the landing is mostly determined by whether the title looks like an answer.

I am going to re-run this in 60 days with the same 30 prompts and see if the cited three change, or if a fourth shows up. My guess is the cited three are sticky and the only way a fourth joins is if I write a new post specifically engineered to win a query I don't currently cover.

We'll see. The nice thing about turning your own blog into a measurement target is that the next post is the next experiment.

---

If you want a structured way to set up the measurement loop I described (five prompts, three retries, monthly cadence), chapter 3 of [LLMO Quickstart](https://kenimoto.dev/books/llmo-quickstart) walks through it with the GA4 segment regex, the Python visibility script, and the rubric I scored my 450 turns against. This post is what happened when I pointed that loop at myself.
