---
title: "AI Mode Just Hit 1 Billion Users, and Opened a Local-Business LLMO Market Most Engineers Are Ignoring"
description: "Google AI Mode crossed a billion monthly users in May 2026. While I was polishing my own site's llms.txt, an entirely separate LLMO market for local businesses was opening up next door. Here's the size of it, and why engineers keep missing it."
date: 2026-06-23
lang: en
tags: [llmo, geo, local-seo, ai-search, market]
featured: false
canonical_url: "https://kenimoto.dev/blog/ai-mode-billion-users-local-business-llmo/"
og_image: "https://kenimoto.dev/images/blog/ai-mode-billion-users-local-business-llmo/og.png"
cross_posted_to: []
---

In May 2026, Google AI Mode passed one billion monthly active users. One billion. That is one in eight people alive, opening an AI box every month and typing questions into it.

I read that number and my first thought was about my own blog. How do I get cited more? Then I went back to tuning my `llms.txt`, like the hobbyist I am.

It took me embarrassingly long to notice what a billion people were actually asking.

![A new search market opens as AI Mode crosses 1 billion users: 1B users to local search shift to a growing local-business optimization market](/images/blog/ai-mode-billion-users-local-business-llmo/og.png)

## What this post is not about

If you read my blog you have already seen me write about LLMO for your own site: JSON-LD schemas, answer-first content, getting your articles cited. You may also have seen the store-owner tactics version, the GBP-grinding, review-replying, photo-uploading playbook for a single shop.

This post is neither. I am not here to argue about the SEO tradeoffs of optimizing your personal site for AI. I want to talk about a market: local-business LLMO as a category that is currently spinning up, measured by user volume and growth rate. The opportunity, not the tactics.

Because that is the part I missed for about a year.

## A billion people are asking AI where to eat

Here is the thing about that billion-user number. People do not type "explain transformer attention" into Google AI Mode. A huge share of those queries are the most ordinary requests imaginable: "good ramen near Shinjuku," "back-pain clinic in Umeda," "a quiet cafe near Hakata station with strong Wi-Fi where I can sit alone."

Those are local-business queries. And the answer the AI gives comes, in most cases, straight from a Google Business Profile (GBP): the photos, the category, the reviews, the attributes someone filled in.

The local search base was already enormous before AI touched it. Roughly 70% of people looking for a restaurant use Google Maps. The local pack, those top three shops in the results, takes a 76% tap rate on mobile. Whether your shop sits in that top three or not changes new-customer volume by a multiple.

Now route that demand through a billion-user AI front door, and you have a behavior shift, not a feature update.

## The market nobody put on my radar

In Japan this discipline has a name and a price tag. It is called MEO (Map Engine Optimization, the local label for what the rest of the world calls Local SEO). The market was worth 21.4 billion yen in 2024, with a forecast of 30.6 billion yen by 2028, per a joint study by GMO TECH and Digital InFact. That is roughly $140M growing toward $200M.

The number wobbles depending on who is counting. Yano Research Institute puts it at 12.7 billion yen, because they measure a narrower slice (agency revenue rather than total spend by shop owners). Take either figure and the shape holds: this is a market growing somewhere around 10 to 18% a year.

I want to sit with how dumb I felt reading that. I have spent months on the citation mechanics of one blog: mine. The audience for that work is, generously, a few thousand engineers. Meanwhile a market measured in tens of billions of yen was compounding at double digits one tab over, serving every restaurant, clinic, and salon in the country, and I had filed it under "marketing, not my problem."

The big market was not hiding. It just was not shaped like code, so I walked past it.

## Why engineers keep walking past it

A few reasons, and I plead guilty to all of them.

We optimize what we can measure in a terminal. Your own site's LLMO has logs, structured data, a `curl` you can run. A shop's AI visibility lives in someone else's GBP dashboard and in answers an AI generates differently every time. It feels squishy. So we avoid it.

We assume the GBP work is trivial and therefore not for us. It is mostly not trivial in the way we expect. It is data hygiene at scale: keeping name, address, and phone consistent across listings, mapping attributes to the natural-language queries an AI will actually ask, writing review replies that read like a real human ran the place. That is exactly the kind of structured, repeatable, automatable problem engineers are good at. We just do not see it because it wears an apron.

And we conflate two different LLMOs. Optimizing your own site to get cited is one job. Making a local business legible to AI search is a separate one with a separate buyer, a separate market size, and far less competition. Same three letters, different economy.

## The visibility gap is the opportunity

The fresh 2026 data makes the gap concrete. Consumer adoption went from 6% of people using AI to find local businesses in 2025 to 45% in the past year, which puts AI third as a local-discovery channel, behind only Google and Facebook, ahead of Yelp and TripAdvisor.

Now the supply side. One report this year found that ChatGPT surfaces only about 1.2% of local business locations, and that 83% of restaurants do not show up at all in AI-generated local recommendations. So you have demand at 45% and climbing, and a supply side where the overwhelming majority of businesses are simply absent from the answer.

That spread is the whole pitch. Demand has arrived, the inventory has not been optimized, and the people who could fix it are over in the corner polishing their own `llms.txt`. Hi.

## The mechanism is reassuringly boring

Here is the part that should make engineers comfortable. MEO and LLMO for local businesses are not two separate optimization stacks. They run on the same fuel: the Google Business Profile.

Google ranks local results on three factors it states publicly, relevance, distance, and prominence. The same complete, accurate, well-attributed GBP that lifts those factors is also the primary fact source AI engines pull from when they answer a local query. Tune the profile once and you move both the map pack and the AI answer. They are two wheels on one axle.

So "local-business LLMO" is not a mystical new skill. It is GBP done with the same rigor you already apply to your own pipelines, pointed at a market that will pay for it. If you want a structured way to think about which industries are worth the investment and how AI-search optimization maps onto local discovery, the framework I use lives at [llmoframework.com](https://llmoframework.com), built from running this across nine languages.

## What I actually changed

I stopped treating "AI search optimization" as a single thing I do for my own site. It is at least two markets, and the bigger one was the one I was ignoring because it did not compile.

The fix was not technical. It was looking up from the terminal long enough to notice that a billion people walked through a new door, and most of the businesses they were looking for had not bothered to put up a sign the AI could read.

I had a beautiful sign. On a blog three thousand engineers read. Pointed at no one who was hungry.
