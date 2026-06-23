---
title: "I Wired My Pages Into Topic Hubs, Not a Flat List: AI Citations Consolidated Onto 4 of Them"
description: "I had perfect llms.txt, perfect JSON-LD, answer-first sections, and my AI citations were still scattered across random orphan pages. The fix was not another on-page tweak. It was the structure between my pages: I hub-and-spoked my internal links, and the citations consolidated onto four hubs."
date: 2026-06-23
lang: en
tags: [llmo, geo, ai-search, internal-linking]
featured: false
canonical_url: "https://kenimoto.dev/blog/topic-hubs-ai-citations/"
og_image: "https://kenimoto.dev/images/blog/topic-hubs-ai-citations/og.png"
cross_posted_to: []
---

I did everything the on-page checklists told me to do. Answer-first sections. JSON-LD that validated on the first try. An llms.txt I was quietly proud of. And then I watched an AI assistant cite me by pulling a single paragraph from a two-year-old page I had basically forgotten existed, while the polished pillar post I actually wanted cited sat there untouched. I felt like a chef who plated every dish perfectly and then watched the guest eat the garnish.

This is not another "make your content AI-friendly" post. Those exist, I have written a couple, and they are all about the inside of a single page: passages, chunks, author entities, the way an AI splits one question into six. This one is about the layer *above* the page: the structure *between* your pages, and what happened when I stopped publishing a flat pile of articles and started wiring them into topic hubs.

## The thing none of the on-page checklists fix

Here is the gap I kept tripping over. Every on-page technique assumes the engine has already decided *which* of your pages is the authority on a topic. Passage-rank optimization makes a paragraph quotable. A clean author entity tells the engine who wrote it. Query fan-out optimization makes one page answer six sub-questions. All useful. None of them answer the prior question the engine is actually asking: *out of this whole site, who owns this subject?*

When your pages are a flat list (forty articles, each a self-contained island, cross-linking more or less at random), the engine has no signal for that. So it picks whatever single passage scored highest in the moment. That is why my citations were scattered: I had forty decent answers and zero declared authorities. The engine was citing me almost by accident, one orphan at a time.

The [LLMO Framework](https://llmoframework.com/) splits this work into Retrieval Signals (can the engine find and parse you) and Authority Signals (does it trust you enough to stake an answer on you). I had spent a year sanding down Retrieval: the schema, the llms.txt, the snippable sections. Internal link structure sits in Authority, and I had treated it like a navigation afterthought. Turns out it is one of the few Authority levers you fully control without waiting for someone else to mention you.

## Hub-and-spoke, in plain terms

The fix has a boring name from the SEO world: topic clusters, or hub-and-spoke. One hub page that gives the broad overview of a subject, and a set of spoke pages that each go deep on one sub-topic. The part that matters for AI search is the *linking discipline*, not the page count:

- Every spoke links **up** to its hub, with link text that names the topic ("how AI search reads passages"), not "click here" or the bare title.
- The hub links **down** to every spoke, and frames each one in a sentence so the relationship is explicit.
- Spokes in the same cluster link **sideways** to each other where it genuinely helps, and basically never link across clusters.

That last rule was the one I had been violating for two years. My "internal linking" was just me dropping a link wherever a word happened to match. It read fine to humans and told the engine nothing about which pages belonged together.

![Two internal-link structures compared: a flat web of pages with citations scattered randomly, versus four hub-and-spoke clusters where citations consolidate onto the hub pages](/images/blog/topic-hubs-ai-citations/hub-vs-flat.png)

The LLMO content-design literature backs the *why* here. AI search engines reason over topical depth: they reward the site that goes deep and narrow on a subject over the one that goes shallow and wide. A cluster is just topical depth made legible. When fan-out fires and the engine searches six sub-queries at once, a tight cluster means six of your spokes show up, all pointing at one hub, all clearly part of one body of work. The engine stops seeing six lucky orphans and starts seeing an authority.

## What I actually changed

I had something like forty pages and no real structure. I did not write a single new article. I spent a weekend doing three unglamorous things:

1. **Grouped the existing pages into four topics.** Mine landed as LLMO/AI-search, Claude Code workflow, voice/WebRTC, and harness engineering. If a page did not fit a cluster, that was a signal it was an orphan, and orphans were exactly the pages getting the accidental citations.
2. **Named one hub per cluster** (usually the most complete existing page, promoted and expanded slightly) and rewired every spoke to link up to it with descriptive anchor text.
3. **Cut the cross-cluster links** that existed only because a word matched. A voice-AI page does not need to link to an LLMO page just because both say "latency" once.

No new content. No schema changes. Just the wiring between pages.

## What happened

I want to be careful here, because this is the part where blog posts usually start inventing decimal points. I track which of my pages get cited by AI assistants by sampling a fixed set of queries weekly and logging which URL gets pulled. It is a rough instrument, not an analytics dashboard, so I am giving you the shape of the change, not a lab result.

Before the rewrite, over a given month my citations landed on **eleven different URLs**, and the most-cited single page accounted for maybe a fifth of them. Scattered, exactly as described. Roughly six weeks after the rewrite, the same weekly sampling showed citations consolidating onto **four pages, and all four were the hubs.** The orphan citations did not vanish overnight, but they faded as the engines re-crawled and, I assume, re-weighed which pages I was actually asserting authority on.

The crawl side shifted too. The hub pages started getting hit noticeably more often by the AI crawlers than the spokes, which is the opposite of what you would expect if the engine treated every page as equal. It was treating the hubs as entry points. Which is the entire idea.

## The honest caveats

A few things I will not pretend away. This is one site's experience, not a controlled study, and my sampling method has all the rigor of a guy with a spreadsheet, because that is what it is. The consolidation took weeks, not days, so if you do this expecting Monday-morning fireworks you will be disappointed and probably undo it on Tuesday. And it only works if you have genuine depth in a cluster: three thin posts linked in a triangle is not a hub, it is a triangle. The structure amplifies authority you already have. It cannot manufacture authority you don't.

But the core move held up, and it is the one I had been missing for a year while I polished individual pages: AI search does not just cite passages, it cites the *site that owns the topic*. On-page work makes a passage quotable. Link structure is how you tell the engine which of your pages is allowed to speak for the subject. I had been writing very good answers and never once saying who was in charge.

If you want the full map of how on-page Retrieval signals and site-level Authority signals fit together, I wrote down the whole system, including the measurement loop I use to track citations, in [Why ChatGPT Ignores Your Website](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=topic-hubs-ai-citations). This post is what happened when I finally stopped optimizing pages one at a time and started optimizing the shape they make together.
