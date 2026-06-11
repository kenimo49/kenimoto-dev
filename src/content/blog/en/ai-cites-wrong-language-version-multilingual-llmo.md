---
title: "My Blog Speaks 4 Languages. AI Search Cited the Wrong One to Most of My Readers."
description: "I translated kenimoto.dev into EN, JA, PT and ES. Then I watched ChatGPT and Perplexity hand my Brazilian readers the English version of pages that already exist in Portuguese. Here is what hreflang, canonical and llms.txt actually do (and don't do) for AI language selection in 2026."
date: 2026-06-12
lang: en
tags: [llmo, geo, multilingual, hreflang, ai-search]
featured: false
canonical_url: "https://kenimoto.dev/blog/ai-cites-wrong-language-version-multilingual-llmo/"
og_image: "https://kenimoto.dev/images/blog/ai-cites-wrong-language-version-multilingual-llmo/og.png"
cross_posted_to: []
---

I spent thirty days translating my blog into four languages so my readers could read me in their own. Then AI search quietly handed most of them the English version anyway. I built a polyglot. The robots gave everyone the same monolingual menu.

Here is the part that stung: my single biggest audience is Brazilian. Portuguese is my top traffic source by a wide margin. And Portuguese is exactly the language version that AI search is worst at picking.

![kenimoto.dev publishes every post in EN, JA, PT and ES, but AI search frequently cites the English version even to Portuguese and Spanish readers](/images/blog/ai-cites-wrong-language-version-multilingual-llmo/four-versions-one-cited.png)

## The thing I assumed, and the thing that was true

I assumed that if I published the same post at `/pt/blog/foo/` with a proper `hreflang` tag, an AI engine answering a Brazilian developer's Portuguese question would cite the Portuguese URL. That is what classic search does. Google has spent two decades learning to serve the right language version, and it is genuinely good at it.

AI search has spent about two years on this problem, and it shows.

I run kenimoto.dev in EN, JA, PT and ES. Every post exists in all four, same slug structure, same `hreflang` cluster, same canonical pointing at itself per language. By traffic, Portuguese is the front door: it pulls more page views and longer sessions than the English version. So I had a clean, slightly painful experiment sitting right in my own analytics, and I went looking for what the AI engines were actually doing with it.

## What the engines actually do with a four-language site

The most useful breakdown I found was a [test run by Glenn Gabe at GSQI](https://www.gsqi.com/marketing-blog/ai-search-hreflang-multilingual-queries/), who pushed the same multilingual query through ChatGPT, Perplexity, Gemini, Copilot and Claude and watched which language version each one cited. It lined up uncomfortably well with what I was seeing on my own pages:

- **Google AI Mode** ranked the correct localized URL, scroll-to-text highlight and all. The engines that lean on Google and Bing infrastructure (AI Overviews, AI Mode, Gemini, Copilot) inherit decades of `hreflang` handling and mostly get the language right.
- **Perplexity**, set to prefer French, returned the US English page anyway.
- **ChatGPT** wrote its answer in French, returned French videos, and then linked to the English version of the page. The answer spoke the reader's language. The citation did not.

That last one is the whole problem in one sentence. The model is perfectly happy to *talk* to your reader in Portuguese. It just sends them to the English door on the way out.

![Comparison of how five AI engines handle a non-English query against a multilingual site: Google-backed engines cite the localized URL, while ChatGPT and Perplexity often fall back to the English version](/images/blog/ai-cites-wrong-language-version-multilingual-llmo/engine-language-behavior.png)

## Why "the answer is in PT but the link is in EN" happens

Once you stop expecting AI search to behave like Google, the behavior makes sense.

A classic search engine resolves *which document* to serve, then serves it. `hreflang` is a ranking signal it has been tuned on for years: it sees the cluster, reads the user's language, picks the matching URL.

An LLM-backed engine does something closer to: retrieve a handful of documents, generate an answer in the user's language, then attach whatever source URLs the retrieval layer surfaced. The generation step is multilingual and fluent. The retrieval step is where language selection lives, and that step is frequently English-biased, for boring structural reasons:

- The English version of a page often has more inbound links and more crawl history, so it ranks higher in the retrieval index regardless of the reader's language.
- Many AI crawlers don't fully parse `hreflang` clusters the way Googlebot does. A weak or missing `hreflang`, thin machine translation, blocked crawlers, or inconsistent product names across languages all push the engine toward citing the English page, a competitor, or a stale third-party source for non-English queries.
- Translation quality matters more than people admit. If your PT page reads like it was run through a blender, the retrieval layer treats it as a low-confidence duplicate and reaches for the English original.

So the failure isn't "the AI can't speak Portuguese." It's "the AI's retrieval layer doesn't trust your Portuguese page enough to cite it."

## What I changed, ranked by whether it did anything

I treated this like a normal optimization problem: change one layer at a time, watch the citations. Here is the honest scoreboard.

**`hreflang` + `x-default` (did the most).** Making sure every language version declares the full cluster, with a sane `x-default`, is the single highest-impact move. It is the one signal the Google-backed engines actually read, and those engines are a big slice of AI search. If you do one thing, do this one properly.

**Self-referencing canonical per language (quietly important).** Each language version must canonical to *itself*, not to the English original. I had one early page where the PT version canonicaled back to EN, and I was effectively telling every crawler "the real page is the English one." That is a self-inflicted wound. Fix it and stop bleeding.

**Language-specific `llms.txt` (small, cheap, plausibly worth it).** I split my `llms.txt` so the curated links point at the correct localized URLs per section. There is no proof any major engine weights this heavily yet, but it costs fifteen minutes, has zero downside, and at minimum it documents to the crawlers which URL is the "real" one for each language. Early-adopter tax, paid in advance.

**Begging ChatGPT to link the PT version (did nothing).** There is no setting for this. You cannot configure your way out of a retrieval bias. You can only feed the retrieval layer cleaner signals and wait.

For the parts of this that genuinely don't have a settled answer yet, the multilingual and internationalization guidance over at [llmoframework.com](https://llmoframework.com/) is the closest thing I've found to a real framework, rather than another listicle telling me to "create quality content."

## The uncomfortable takeaway

Translating your content is necessary and not sufficient. In 2026, the gap between "I published a Portuguese version" and "AI search cites my Portuguese version" is real, measurable, and mostly outside your direct control. You can shrink it with `hreflang`, self-referencing canonicals, and clean translations. You cannot close it, because half the failure lives inside retrieval layers you don't own.

My plan is unglamorous: keep the four languages, make the localized signals as loud as I can, and accept that for now a chunk of my Brazilian readers will get routed to a page in a language they didn't ask for. I translated my blog four times. The least I can do is make the robots feel bad about ignoring three of them.

## More on this

If you want the full version of how I measure AI citations across languages, including the `hreflang` and `llms.txt` setup I use on kenimoto.dev, I wrote the whole thing up:

[Why ChatGPT Ignores Your Website: The LLMO Practical Guide](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=ai-cites-wrong-language)
