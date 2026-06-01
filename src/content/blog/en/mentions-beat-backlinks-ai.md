---
title: "Link-less Brand Mentions Beat Backlinks for AI Visibility — I Read the Ahrefs 75,000-Brand Study So You Don't Have To"
description: "Ahrefs studied 75,000 brands and found unlinked web mentions correlate with AI visibility at 0.664 — three times stronger than backlinks at 0.218. I've spent this whole blog on on-page LLMO. Today I argue the off-page side that nobody optimizes."
date: 2026-06-02
lang: en
tags: ["LLMO", "GEO", "AEO", "AI search"]
featured: false
canonical_url: "https://kenimoto.dev/blog/mentions-beat-backlinks-ai"
og_image: "https://kenimoto.dev/images/blog/mentions-beat-backlinks-ai/og.png"
cross_posted_to: []
---

Here's the number that ruined my week: **0.664.** That's the correlation Ahrefs found between unlinked web mentions and a brand showing up in AI Overviews, across **75,000 brands**. Backlinks, the thing I and roughly the entire SEO industry spent a decade hoarding, scored **0.218**. Mentions beat links by roughly 3x, and the link didn't even need to exist.

I've written this blog for months as if LLMO were an on-page sport. JSON-LD, `llms.txt`, passage structure, snappable paragraphs. I have receipts. I [shipped 11 JSON-LD schemas and measured which 3 actually got cited](/blog/11-json-ld-3-cited-by-ai/). I argued that [your page rank is invisible to AI and only your passages get cited](/blog/passage-rank-beats-page-rank-ai-citations/). All of it true. All of it on-page. And all of it, it turns out, the smaller half of the story.

So today I'm arguing the opposite corner: **the strongest lever for AI visibility lives off your site entirely.** Answer first, then the receipts.

## The answer: be talked about, not linked to

If you want one sentence to take away, it's this. AI engines decide whether to mention your brand mostly by how often *other people* mention your brand, in plain text, with no link attached. Not how many backlinks point at you. Not how clever your schema is. How much of the open web already says your name.

The Ahrefs study (published via Virayo, run across 75,000 brands using Spearman correlation) ranks the off-page factors like this:

![Bar chart: brand web mentions 0.664, brand anchors 0.527, brand search volume 0.392, backlinks 0.218 — correlation with AI Overview visibility](/images/blog/mentions-beat-backlinks-ai/correlation-bars.png)

- **Brand web mentions: 0.664** — the strongest signal in the study.
- **Brand anchors: 0.527.**
- **Brand search volume: 0.392** — how many people Google your name.
- **Backlinks: 0.218** — the old king, now sitting in fourth.

The top three are all off-site. The thing I'd been optimizing, on-page everything, doesn't even appear at the top of this list. I'd been polishing the inside of a house nobody knew the address of.

A fair caveat before I get carried away: correlation isn't causation, and Ahrefs says so plainly. A brand that gets mentioned everywhere is probably also doing fifteen other things right. But the *direction* is loud and consistent, and it lines up with how these models actually work.

## Why a model cares what strangers say about you

This stopped feeling like astrology the moment I thought about what an LLM is actually doing.

A language model doesn't crawl a link graph and tally votes the way classic PageRank did. It learns associations from text. When the phrase "Ahrefs" sits next to "backlink data" ten thousand times across the training corpus, the model encodes that those two things belong together. The link is irrelevant to that process. The *co-occurrence* is everything.

So when someone asks ChatGPT "what tool shows me unlinked brand mentions," the model reaches for the names that statistically cluster around that question. Names it has seen described, compared, recommended, and complained about in prose. A brand mentioned in fifty forum threads with zero links is more legible to that model than a brand with fifty backlinks and no conversation around it. Links are plumbing. Mentions are reputation, and the model is built to absorb reputation.

This is also why **keyword-stuffed anchors backfire.** The same study found that over-optimized, keyword-jammed anchor text *correlated negatively* with AI visibility. It reads as manipulation, and it poisons the natural co-occurrence the model wants to learn. Turns out the move that worked in 2014 is now actively working against you. I'd laugh if I hadn't built a few of those links myself.

## "Great, so I just buy 10,000 mentions"

No. Sit down.

The deflating part of this finding is that mentions are precisely the thing you can't directly purchase or automate at scale without it smelling like fraud, to both the model and the humans you're trying to reach. There's no Ahrefs export button labeled "earn 500 organic conversations about your brand this week." If there were, everyone would press it, the signal would saturate, and we'd be right back to square one inventing a new metric. The reason mentions correlate so well is *because* they're hard to fake. Strip away the difficulty and you strip away the value.

Which is annoyingly old-fashioned advice dressed up in 2026 clothes: the way to get mentioned is to be worth mentioning. Ship a thing people argue about. Publish a number nobody else has. Show up in the comparison posts, the "X vs Y" threads, the Reddit answers, the podcast where someone says your name out loud. Boring. Effective. Unpatchable.

## What actually moves the off-page needle

So I rebuilt my checklist around things that *generate* mentions rather than links. The shape that's working:

**Build the entity, not just the page.** The model needs to know you're a distinct, consistent thing: a person or brand with stable attributes across the web. Same name, same description, same `sameAs` profiles pointing everywhere you exist. Co-occurring consistently with your topic is the whole game. I organize this off-page work (entity establishment, mention-building, the authority signals that sit *outside* your domain) using the framework at [llmoframework.com](https://llmoframework.com), because doing it ad hoc is how you end up with three slightly different bios and a confused model.

**Get into the lists and comparisons.** Industry roundups, "best tools for X," head-to-head comparisons, review communities. These are mention factories, and they're where models go shopping for candidates to cite. One unlinked appearance in a well-trafficked comparison post can do more than a month of guest-post link begging.

**Make something quotable enough to repeat.** A specific statistic, a contrarian take, a clean phrase. People mention what's easy to mention. "Mentions beat backlinks 3-to-1 for AI visibility" travels; "we offer best-in-class solutions" dies on contact.

**Earn the branded search.** Search volume for your name was the #3 signal (0.392). Talks, newsletters, a real audience: the offline-ish stuff that makes people type your name into a box later. It compounds slowly and then all at once.

**Then do the on-page work I've already covered.** Schema and passages aren't dead. They're table stakes that help the model parse you once it already knows you exist. They're the second half of the job, not the first.

## The part where this actually pays

If you're wondering whether off-page mentions translate into anything you can put on an invoice: they do, and the conversion math is what surprised me most.

Virayo reported a SaaS client pulling **20+ free-trial signups a month directly from ChatGPT citations**, not from clicks they paid for, but from being the brand the model named. Go Fish Digital documented something even harder to ignore: traffic arriving from ChatGPT and AI sources converted at roughly **25x the rate** of their traditional search traffic. Twenty-five times. The AI had already done the qualifying. By the time someone clicks through from an AI answer that named you, they've been pre-sold by the most trusted salesperson in the room, which is a machine with no commission.

That's the quiet upside of off-page LLMO. A backlink sends you a stranger. A mention inside an AI answer sends you someone who already heard your name from something they trust, and trust is the one input you genuinely cannot buy in bulk.

## What I'm doing differently now

I'm not deleting my JSON-LD. I'm not torching the passage structure. That work still earns its keep. It's how the model reads you once it's decided to look. But I've stopped treating it as the main event.

The new ratio in my head: on-page LLMO gets you *parsed*; off-page mentions get you *picked*. For months I optimized the first and ignored the second, which is a bit like rehearsing a flawless speech and never leaving the house. The Ahrefs number reorganized my whole to-do list. Less time in the `<head>` tag. More time being worth a sentence in someone else's.

And if an AI ends up quoting *this* post to someone asking whether mentions beat backlinks, well, that'd be the most on-brand way possible to find out I was right.

---

If you want the full system, the on-page passage and schema layers I've written about here plus the off-page entity and mention work that the Ahrefs data says matters more, I put the whole thing in a book: [Why ChatGPT Ignores Your Website](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=mentions-beat-backlinks-ai).
