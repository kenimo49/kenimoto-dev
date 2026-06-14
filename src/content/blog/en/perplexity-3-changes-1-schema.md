---
title: "Perplexity Citations Exploded After I Changed 3 Things. Only 1 Was Schema."
description: "I made three changes to my blog and watched my Perplexity citations roughly triple over six weeks. Everyone assumes the win was structured data. It wasn't even close. Here's what actually moved the needle on one engine."
date: 2026-06-09
lang: en
tags: [llmo, perplexity, ai-search, geo, measurement]
featured: false
canonical_url: "https://kenimoto.dev/blog/perplexity-3-changes-1-schema/"
og_image: "https://kenimoto.dev/images/blog/perplexity-3-changes-1-schema/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/perplexity-citations-exploded-after-i-changed-3-things-only-1-was-schema-3n8f
---

For about a year I have been the guy who tells people structured data is the secret to getting cited by AI. I have written JSON-LD into more `<head>` tags than I have written thank-you notes, which is its own small tragedy. So when I decided to actually run an experiment on a single engine instead of waving my hands at "AI search" in general, I assumed the verdict would confirm the sermon I had been preaching. Schema wins. Roll credits.

I picked Perplexity because it is the one engine where I can actually see the scoreboard. Every answer comes with numbered citations, so I am not guessing whether I got pulled into a model's training soup. Either my URL has a little number next to it or it doesn't. I changed three things over six weeks, kept a weekly log, and waited. My citation rate roughly tripled. And the change I was most proud of, the schema, turned out to be the one I could have skipped and barely noticed.

![Three changes ranked by their contribution to Perplexity citations: answer-first structure and brand consistency are large, schema is small](/images/blog/perplexity-3-changes-1-schema/contribution.png)

## What I actually changed, and how I measured it

Let me be precise about the setup, because "my citations tripled" is the kind of sentence that should make you suspicious. It makes me suspicious and I ran the thing.

I had a cluster of eight articles on overlapping topics. I built a set of 25 Perplexity prompts that a real person might type to land on those pages, ran each prompt three times a week, and counted how many returned one of my eight URLs as a clickable citation. Baseline, before I touched anything, was a sad and steady 6 to 8 citations per weekly run. Not zero, but the kind of number you don't put on a slide.

Then I made three changes, staggered so I could see which one moved what:

1. **Answer-first structure.** I rewrote the opening of every section so the first 40-ish words were a complete, standalone answer to the question in the heading. No throat-clearing, no "in this section we'll explore."
2. **Brand and entity consistency.** I made "ken imoto" and "kenimoto.dev" identical everywhere: author bylines, my about page, my llms.txt, the bios on the three other sites where I show up. Same name, same spelling, same one-line description of what I do.
3. **Schema.** I added clean `TechArticle` and `FAQPage` JSON-LD to every page, server-rendered so the crawler actually sees it. The thing I had been telling everyone to do.

By week six the same 25-prompt run was returning 19 to 23 citations. Call it a 3x. The whole point of staggering the changes was to find out which of the three I should send a fruit basket to. It was not the one I expected.

## The schema did something. It just did the least

Here is the deflating part, and I am going to be honest because the smug version of this post would pretend I planned it.

I shipped the schema first, in week one, because it was the change I believed in and the one I knew how to do in my sleep. Two weeks of clean JSON-LD on every page moved my weekly citation count from about 7 to about 9. A real bump. Not nothing. If you had stopped me there I would have written a triumphant post titled "I Added Schema and My Perplexity Citations Went Up 30%" and you would have clapped politely.

But 7 to 9 was the smallest of the three jumps by a wide margin, and it is roughly what the research would predict. When people put numbers on it, structured data lands somewhere around a [10% slice of Perplexity's citation weighting](https://www.stackmatix.com/blog/perplexity-ai-optimization-strategy), and Perplexity's own February 2026 publisher guidance reportedly described schema as lifting [citation weight by about 23%](https://www.successtechservices.com/perplexity-ai-optimization/) rather than multiplying it. Those are real numbers. They are also a tax rebate, not a lottery ticket. Schema makes a page Perplexity already likes a little easier to parse. It does not turn an invisible page into a cited one.

I had been selling a tax rebate as a jackpot. For a year. To anyone who would listen.

## Change #1 that actually mattered: answer-first structure

The biggest single jump came from the answer-first rewrite, and it was almost embarrassingly mechanical.

Perplexity does not cite pages. It cites passages. Underneath the friendly interface, its pipeline is a [multi-stage reranker](https://ziptie.dev/blog/how-perplexity-ai-answers-work/): a first-pass retrieval, then a cross-encoder that reads your candidate passage against the user's actual question, then a final rerank that folds in entity and authority signals. The page that wins is the one with a chunk of text that reads like a finished answer sitting right where the model expects to find it.

When my sections opened with "In this part, let's look at how llms.txt fits into the bigger picture," the model had to dig for the answer, and digging is exactly the work it is trying to avoid. When I changed that to a flat, self-contained "llms.txt is a Markdown file at your site root that tells LLMs which pages matter most," the model could lift the sentence whole and drop it into an answer with my number attached.

This matches what everyone measuring Perplexity keeps landing on. The common finding is that something like [90% of winning citations put a direct answer in the first 100 words](https://authoritytech.io/blog/how-to-get-cited-in-perplexity-ai-2026), and that the move with the highest leverage is opening each section with a 40-to-60-word answer before you expand. In my log, the answer-first rewrite alone took me from roughly 9 to roughly 15 citations a week. That is the one I would send the fruit basket to.

I want to flag the honest caveat here, because Perplexity's internals shift and I am one blog, not a lab. My weekly numbers wobble by two or three citations from run to run on identical prompts, so treat my "9 to 15" as a direction with a thick margin, not a measurement you could publish. The shape held across six weeks, which is the only reason I trust it at all.

## Change #2 that mattered more than schema: being the same "me" everywhere

The second-biggest jump was the weirdest one to accept, because it had nothing to do with my content and everything to do with my name.

That final reranker leans on entity and authority signals, which is a technical way of saying the model needs to be confident it knows who you are before it stakes an answer on you. If your byline says "Ken Imoto" on one site, "ken imoto" on another, and "K. Imoto, WebRTC Engineer" on a third, you are not one trusted source. You are three half-confident strangers who happen to write similarly. The data backs the boring version of this: Perplexity hands out about [1.26 citations per brand mention](https://www.stackmatix.com/blog/perplexity-ai-optimization-strategy), more than ChatGPT, and a name that shows up consistently across several independent sources gets cited far more reliably than one that only appears on its own domain.

So I did the least glamorous SEO work imaginable. I made my name byte-for-byte identical across my blog, my about page, my llms.txt, and three external profiles. Same spelling, same "WebRTC and Voice AI engineer" tag, same links pointing back to the same canonical home. It felt like updating my business cards. It was not a content strategy. It was a consistency chore.

It took my weekly citation count from about 15 to about 21. The chore beat the schema. The thing I did while mildly bored beat the thing I had built my professional identity around.

If you want the conceptual map for why this works, the [LLMO Framework](https://llmoframework.com/) splits the work into Retrieval Signals (can the engine find and parse you) and Authority Signals (does the engine trust you enough to stake an answer on you). Schema lives in Retrieval, which is the cheap, mechanical layer. Entity consistency lives in Authority, which is the layer that actually decides whether your number shows up. I had spent a year polishing the Retrieval layer and almost completely ignoring the one above it.

## The factor I didn't change, but should mention

There is a fourth thing in the room that I deliberately did not touch, and it would be dishonest to leave it out: freshness.

Perplexity is brutally biased toward recent content. One analysis of a couple hundred thousand pages put [temporal freshness at around 44% of the selection weighting](https://authoritytech.io/blog/content-freshness-seo-ai-2026), and reported that pages under 30 days old pull several times the citations of older ones. I did not run a freshness experiment here, because I had just spent nine weeks watching my citations decay with age in a separate test and I did not want to confound the two. But I will say this plainly: if freshness is genuinely 44% of the decision, it likely outweighs all three of my changes combined, and the only reason it didn't dominate this experiment is that all eight test pages were already reasonably recent. Freshness was a constant, not a variable. Do not read my "schema is small" conclusion as "freshness is small." They are not the same claim.

## What I'm telling people now

Three things rearranged in my head, and one of them was uncomfortable.

**Schema is table stakes, not a strategy.** Add it. Server-render it. Then stop talking about it like it's the main event. It is the tax rebate. It makes a page the engine already likes slightly easier to read. If your pages aren't getting cited at all, no amount of perfect JSON-LD is going to fix that, because the problem is upstream of parsing.

**Answer-first is the cheapest high-leverage move there is.** Rewriting the first sentence of every section to be a standalone answer cost me a few hours and was the single biggest jump in my whole experiment. It requires no new tooling, no schema validator, no framework. Just the discipline to put the answer first and your throat-clearing in the trash.

**Authority is mostly consistency, and consistency is boring.** The reason my name now gets cited is not that I wrote anything brilliant. It's that "ken imoto" means exactly one thing across every place a crawler can find me. That is unglamorous, it is a chore, and it beat the part of my work I was proudest of. I have made my peace with this. Mostly.

I am still pro-schema. I will still put JSON-LD in every `<head>`. I have just stopped pretending it is the lever. The lever was a 40-word sentence and a consistent byline, and I spent a year admiring the rebate instead of pulling it.

---

If you want the implementation loop behind all three changes, the answer-first section template, the entity-consistency checklist, and the JSON-LD I server-render, chapter 2 of [LLMO Quickstart](https://kenimoto.dev/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=perplexity-3-changes-1-schema) walks through the whole thing in about an hour of work. This post is what happened when I ran that loop against one engine and actually kept score.
