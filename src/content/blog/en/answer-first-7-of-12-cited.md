---
title: "I Rewrote 12 Pages to Answer the Question in the First Sentence. AI Started Quoting 7 of Them."
description: "I took 12 of my own pages, deleted the throat-clearing, and made the first sentence the actual answer. Then I watched which ones AI engines started citing. Seven moved. Five didn't. Here's what separated them."
date: 2026-06-11
lang: en
tags: [llmo, aeo, ai-search, answer-first, measurement]
featured: false
canonical_url: "https://kenimoto.dev/blog/answer-first-7-of-12-cited/"
og_image: "https://kenimoto.dev/images/blog/answer-first-7-of-12-cited/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/answer-first-writing-i-rewrote-12-pages-to-lead-with-the-answer-and-ai-quoted-7-3n66
---

I have spent more of my life optimizing for machines that can't laugh than I'd like to admit, and last month I added a new entry to that ledger: I rewrote the opening sentence of 12 of my own pages so that the very first line answered the question in the heading, instead of warming up to it like a man clearing his throat before a toast.

The hypothesis was almost insultingly simple. If AI engines lift the first sentence or two of a section to build their answers, then burying the answer under a paragraph of context is the writing equivalent of hiding the punchline behind the napkin. So I stopped doing that on 12 pages and watched what the engines did. Seven of them started getting cited more. Five did not move at all. The gap between those two groups turned out to be the actual lesson, and it was not the lesson I expected to write down.

![A before/after of a section: a context-first paragraph crossed out, an answer-first sentence promoted to the top](/images/blog/answer-first-7-of-12-cited/og.png)

## What "answer-first" actually means

Answer-first means the first sentence of a section is the answer to the question that section's heading implies, with the explanation coming after instead of before. That's the whole tactic. No schema markup, no freshness signals, no passage selection at the retrieval layer. Just the order in which you put your own words.

I want to be precise here because "write for AI" has become a phrase people say to mean nothing. I did not touch JSON-LD on these pages. I did not change publish dates. I did not add headings or rewire internal links. I changed exactly one thing per section: I moved the sentence that actually answered the heading to the front, and I cut whatever ran ahead of it. If a section started with "There are many factors to consider when choosing a tracker, and the landscape has shifted a lot recently," that sentence died, and the line that named the answer took its place.

The reason this matters lines up with what citation studies keep finding. One analysis of where LLM citations land inside a page reported that [44.2% of citations come from the first 30% of the text](https://writesonic.com/blog/how-to-structure-content-for-llms-citation-and-retrieval), with the middle and the conclusion splitting the rest. If almost half the citations are harvested from the top third of your page, then the top of each section is the most expensive real estate you own. I had been renting it out to throat-clearing.

## How I measured it

I ran the same 30 prompts across ChatGPT, Perplexity, Gemini, Claude, and Brave AI every Monday for six weeks: three weeks before the rewrite, three weeks after, same prompts, same engines, same Monday-morning ritual. I logged how often each of the 12 pages showed up as a clickable citation. I kept the prompts frozen so the only thing changing was the writing.

Two caveats, because I have been burned by my own optimism before. Six weeks is short, and AI citations decay on their own schedule, so some of this is noise wearing a lab coat. And n=12 is a sample size that would make a statistician politely change the subject. This is one engineer's measurement on one small blog, not a study. Treat it as a field note, not a law.

## The 7 that moved

Here is the rewrite that worked, stripped down to the bones. Same facts in both versions. Only the order changed.

```text
BEFORE (context-first):
  "When teams ask me how to track AI citations, I usually start by
   explaining that the tooling space is young and the numbers vary
   wildly between tools, which is itself a finding worth sitting with."

AFTER (answer-first):
  "Track AI citations by running the same prompts on a fixed schedule
   and logging which pages get cited. The tooling is immature, so a
   fixed-prompt manual run beats most trackers for accuracy right now."
```

The seven pages that gained citations all shared one trait: each had a section whose heading was a real question a person might type, and whose answer fit cleanly into one or two front-loaded sentences. "How do I track AI citations." "What is the difference between page rank and passage rank." "Why did my traffic stay flat while citations dropped." Concrete questions with concrete, liftable answers. Once the answer sat at the top, the engines could grab it without having to understand my paragraph structure, and grab it they did.

The passages that did best landed in the 40-to-75-word range, which is roughly [the length of passage that ChatGPT, Perplexity, and Google AI Overviews tend to quote](https://kime.ai/blog/how-to-structure-content-for-llm-extraction-geo-guide-2026). Short enough to lift whole, long enough to stand on its own. I did not engineer that length on purpose at first. The pages that happened to hit it were the ones that won, which is how I learned to aim for it on the rest.

## The 5 that didn't, and why that's the real finding

The five pages that ignored my efforts taught me more than the seven that obliged. They had one thing in common: their headings weren't questions anyone would ask, so there was no question for the first sentence to answer.

A heading like "On the philosophy of measurement" is not a query. Nobody types it. When I "fixed" the first sentence under it, I was answer-firsting a question that didn't exist, which is a bit like leaving the porch light on for a guest who was never invited. The mechanics of the rewrite were fine. The target was imaginary.

So the finding underneath the finding is this: answer-first is not a writing trick you apply to sentences. It only works when the heading above the sentence is a question someone actually asks. Two of those five pages I later rewrote at the heading level, turning a vibe into a question, and two of them then started getting cited. The fifth is about my feelings on a deprecated framework and deserves its obscurity.

## What I'd tell you to do on Monday

Pick your ten most important pages and read only the first sentence of each section, out loud, ignoring everything after it. If that one sentence doesn't answer the heading, you have found a section that is invisible to AI extraction no matter how good the paragraph below it is. Promote the answer. Delete the run-up. For the structural side of this, on how to make passages snippable and self-contained rather than context-dependent, the implementation guide at [llmoframework.com](https://llmoframework.com) is the reference I point people to, because the order of your sentences is only half the job and the shape of your passages is the other half.

And if you want the version of this argument with the retrieval mechanics underneath it, I wrote about [why passages get cited instead of pages](/blog/passage-rank-beats-page-rank-ai-citations/) separately. That piece is the "why." This one is the "I tried it and five of them laughed at me."

## The takeaway

Front-loading the answer moved 7 of my 12 pages and left 5 untouched, and the 5 failures clarified the rule better than the wins did: answer-first only pays off when there is a real question for the answer to answer. The tactic is one sentence. The discipline is making sure that sentence has a job. I spent six weeks proving something a good editor would have told me for free, but at least now I have the citation logs to make it look like science.

---

If you want the full system behind this, including structured data, freshness, and passage design, I wrote a book on it: [LLMO: AI Search Optimization](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=answer-first-7-of-12-cited).
