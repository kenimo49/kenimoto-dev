---
title: "I Translated My Blog Into 4 Languages. Portuguese Got Nearly 4× the Traffic of English."
description: "Over 22 days, PT got 748 pageviews. EN got 195. JA got 27. ES got 7. I shipped 4 languages thinking ES would dominate. Here's what actually happened, and what it taught me about multi-language LLMO."
date: 2026-05-21
lang: en
translation_key: 4-languages-portuguese-4x
tags: [llmo, multi-language, ga4, build-in-public, tabnews]
featured: false
canonical_url: "https://kenimoto.dev/blog/four-languages-thirty-days-portuguese-four-x-traffic/"
og_image: "https://kenimoto.dev/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-translated-my-blog-into-4-languages-portuguese-got-nearly-4x-the-traffic-of-english-3b5h-temp-slug-428306
---

When I decided to ship this blog in 4 languages, I had a clear mental ranking. English would win on volume. Spanish would be runner-up because of the sheer speaker count. Japanese would be steady because it's my native language. Portuguese, I figured, was the long tail. I added it mostly out of completism.

22 days later, the GA4 snapshot disagrees with every part of that ranking.

![Pageviews by language over 22 days. PT: 748, EN: 195, JA: 27, ES: 7](/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/pv-by-language.png)

- **PT: 748 pageviews**, 709 sessions
- **EN: 195 pageviews**, 176 sessions
- **JA: 27 pageviews**, 29 sessions
- **ES: 7 pageviews**, 7 sessions

That is PT pulling roughly 3.8× English, 28× Japanese, and 107× Spanish on the same blog, same publishing cadence, same author. One Portuguese article on its own (the 24-hour security agent post: 375 PV) got more pageviews than my entire English blog combined.

I wrote the article hoping ES would surprise me. Instead PT surprised me, and ES quietly continued to not exist.

## The Setup, So You Can Discount My Numbers Properly

This is not a comparative experiment in any clean sense. It is a single blog, [kenimoto.dev](https://kenimoto.dev), running 4 language directories (`/en/`, `/ja/`, `/pt/`, `/es/`). Articles get translated through a cross-language LLM pipeline, then hand-edited for register and locale (BR Portuguese vs PT Portuguese, LatAm-neutral Spanish vs Spain Spanish). The window: 2026-04-30 to 2026-05-21, 22 daily snapshots.

EN has 26 articles. JA has 25. PT has 17. ES has 10. So PT has fewer articles than EN and still beats it almost 4 to 1.

If you stop reading here, take this one thing: **language asymmetry can swallow article-count asymmetry whole**. Adding articles in a saturated language is slower than adding articles in an underserved one.

## Why PT Pulled Ahead

I do not think the answer is "Portuguese readers like me more." I think there are three asymmetries stacking on top of each other.

![Three asymmetries: TabNews community, AI-search SOV, llms.txt early-mover](/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/why-pt-won.png)

### 1. TabNews is a real community door that English does not have

[TabNews](https://www.tabnews.com.br/) is a Brazilian developer community where you can post a technical article and have it actually read by humans, the same day, without already having an audience. There is no clean equivalent in English. Hacker News exists, but the floor for getting noticed there as a no-name is much higher, and the topic surface is much narrower.

When I cross-post the same article to TabNews (PT) and Dev.to (EN), TabNews delivers consistent referral traffic. Dev.to mostly delivers crickets unless I already have followers. That difference shows up directly in the GA4 numbers.

### 2. Portuguese AI-search SERPs are thinner

English LLMO content is a saturated market. There are thousands of decent articles competing for the same prompts in ChatGPT, Perplexity, Gemini. Your share of voice as a small site is correspondingly small.

In Portuguese, the field is much thinner. Fewer technical blogs are fighting for the same prompts, so when an AI engine needs a Portuguese source for "spec-driven development com Claude Code," there are far fewer candidates to pick from. The first reasonable answer in PT wins. The first reasonable answer in EN gets buried.

This matches what multilingual AI-visibility tooling like [Peec AI](https://llmpulse.ai/blog/best-ai-visibility-tools/) reports: language coverage is a genuine moat because most brands optimize for English first and then never get to the other 114 languages.

### 3. I'm an early-mover on `/pt/llms.txt`

Most major Brazilian developer sites do not ship an llms.txt yet. Some big LatAm Spanish sites do not either. By having `/pt/llms.txt`, `/es/llms.txt`, `/ja/llms.txt`, `/en/llms.txt` from day one, I give AI crawlers a clean menu in their target language. In English, this is just hygiene; everyone has one. In Portuguese, it is mildly differentiating.

The TRM 8,337% ChatGPT-referrals case I wrote about earlier suggested that LLMO advantages compound when you do the basics consistently. The multi-language version of that is: the basics compound much faster in the languages where the basics are still rare.

## Why JA Got 1/27th of PT (Painful for Me to Type)

Japanese is my native language. I write the JA versions myself, not via translation, so the prose is the cleanest of the four. And the JA blog got 27 pageviews. Twenty. Seven.

The honest reason: Japanese developers mostly read [Qiita](https://qiita.com) and [Zenn](https://zenn.dev), not standalone blogs. When I post to my own domain in Japanese, I am asking readers to leave their normal habitat. When I post the same article to Zenn instead, it gets dozens of reads on day one.

So the JA strategy needs to change. The blog shouldn't try to compete with Qiita/Zenn for the JA audience; it should serve as the canonical archive that AI crawlers index, while the Qiita/Zenn versions do the human-traffic work. That is the opposite of how the PT side works, and that is fine. Different language, different distribution.

## Why ES Is at 7 Pageviews and I Mostly Deserve It

ES has 10 articles. The translations are clean LatAm-neutral. The problem is distribution: I have no equivalent of TabNews to post to. Stack Overflow en español exists but is not the same shape of community. [Platzi](https://platzi.com) and [Código Facilito](https://codigofacilito.com) are great, but they are not open posting platforms.

So ES is in the weird middle: AI-search competition is also thinner than EN (a tailwind), but the community-door is missing (a headwind). The result is single-digit pageviews. I don't have a clever fix for this yet; the next 30 days of ES experiments are about finding a posting hub that isn't a giant company's gated platform.

## The Multi-Language LLMO Checklist I Wish I Had on Day One

If you are about to translate your blog into N languages, here is the playbook I would give past-me:

1. **For each target language, identify the community door first.** Not the audience size. The door. Brazil has TabNews. Japan has Qiita/Zenn. English-speaking Hacker News exists but the bar is brutal. Spanish LatAm: still searching.
2. **Ship `/{lang}/llms.txt` from day one.** It is 15 minutes per language. Most non-English sites don't have one. This is the cheapest moat you will ever build, and the [llmoframework.com](https://llmoframework.com) multi-language playbook is explicit about it.
3. **Set up GA4 with language-prefix filters before publishing.** Otherwise you will spend month two retrofitting analytics instead of writing.
4. **Resist the urge to translate everything.** Translate the 20% of articles most likely to land in the community door. The rest can wait until you've validated the distribution channel.
5. **Treat each language's AI-search share-of-voice as a separate KPI.** Run the same brand-relevant prompts in ChatGPT, Perplexity, Claude.ai in each language, monthly. The asymmetries are huge and you can only manage what you measure.

## What I'm Doing Next

- Doubling PT publishing cadence from 1/week to 2/week and measuring whether TabNews referral scales linearly or saturates.
- Reframing JA strategy: blog as AI-crawler archive, Zenn/Qiita as human-distribution surface.
- Finding the missing ES community door, even if it means experimenting in 3 different LatAm hubs at once.
- Leaving EN cadence alone. The English market is saturated; my marginal article there is worth less than my marginal article in PT.

If you have been resisting multi-language because "I don't have time," consider this: the language with the highest ROI on your time may not be the one with the most speakers. It may be the one with the fewest competitors in the AI-search layer, and the most welcoming open community.

For my blog, that was Portuguese. For yours, it might be Indonesian, or Korean, or Polish. The only way to find out is to ship one article in each, plug in GA4, and see which one the AI engines start citing first.

---

If you want the deeper playbook on measuring and improving your AI-search visibility across languages, I wrote a book on it: [LLMO: AI Search Optimization](https://kenimoto.dev/books/llmo-ai-search-optimization). The multi-language chapter is the one I rewrote three times after the numbers above came in.
