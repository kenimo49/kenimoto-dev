---
title: "I Gave Every Page on My Site a .md Twin. The AI Fetchers Stopped Guessing"
description: "llms.txt is one summary file at your root, and Google just called it the new keywords meta tag. So I went the other way: a Markdown twin for every page, served as text/markdown. Here's the Astro code and what actually changed."
date: 2026-06-08
lang: en
tags: [llmo, llms-txt, astro, ai-search, markdown, web-development]
featured: false
canonical_url: "https://kenimoto.dev/blog/every-page-md-twin-llmo/"
og_image: "https://kenimoto.dev/images/blog/every-page-md-twin-llmo/og.png"
cross_posted_to: []
---

A while back I added an `llms.txt` to my site because everyone said I should. One Markdown file at the root, a tidy table of contents for the robots, a little hopeful note that said "dear AI, here is my site, please be kind." Then I checked my logs a month later and the citation-driving crawlers had touched it almost zero times. I had written a letter and mailed it to a house nobody lived in.

Around the same time, Google's Gary Illyes confirmed at Search Central Live that Google does not support `llms.txt` and has no plans to. John Mueller went further and compared it to the **keywords meta tag**: a thing site owners controlled, therefore a thing search engines learned to ignore. That comparison stung, because it was correct.

So I stopped trying to summarize my whole site in one file the robots don't read. I did the opposite. I gave **every single page its own Markdown twin**, served at the same URL with `.md` glued on the end. And that one actually moved the needle.

## The pattern in one line

Take any page. Append `.md`. Get the same content as clean Markdown instead of HTML.

```text
/company       → HTML for humans
/company.md    → Markdown for machines
```

That's it. Same URL, same content, two costumes. A human hits `/company` and gets the full styled page with the nav bar, the cookie banner, the footer with my forty social links. An AI fetcher hits `/company.md` and gets the actual words, in Markdown, with none of the furniture.

The idea isn't mine. It's the logical extension of what Jeremy Howard proposed with `llms.txt` back in September 2024, except that instead of one summary file describing the site, you push the same "give them Markdown" thinking down to **every page**. And it turns out the people building the tools already do this. Anthropic's own docs serve it: take any page like `docs.claude.com/en/docs/claude-code/plugins`, slap `.md` on it, and you get the raw Markdown the rendered page was built from. Once I noticed that, I felt a little silly. The model providers are feeding their own crawlers clean Markdown, and I was out here making mine eat a div soup.

## Why HTML is a bad meal for a robot

When a crawler fetches your HTML page, it has to do surgery. Strip the `<nav>`. Strip the cookie consent. Figure out which `<div>` is content and which is a sidebar ad. Throw away the SVG icons, the analytics blob, the third-party widget that loads your "related posts." Only then does it have something resembling your actual writing, and it spent tokens and guesses getting there.

![How an AI fetcher reads HTML versus a .md twin](/images/blog/every-page-md-twin-llmo/html-vs-md-twin.png)

Markdown skips all of that. There's no nav to strip because you never put one in the `.md`. The structure (headings, lists, tables) is already semantic, already the thing a model wants. You're not asking the crawler to reverse-engineer your content out of your layout. You're just handing it the content.

Now, I want to be honest about the evidence here, because the LLMO space is full of people selling certainty they don't have. Do crawlers *officially* prefer Markdown? The big providers haven't published a guarantee. The "agents prefer the `.md` variant" claim is industry consensus, repeated in a hundred dev blogs, and not confirmed in writing by OpenAI or Anthropic. So treat it as a strong bet, not a law. But here's the part that *is* solid: a live agent fetching `/company.md` provably gets cleaner input than one parsing `/company`, for the same reason a sandwich is easier to eat than the ingredients plus the grocery bag. The mechanism is real even where the vendor confirmation is missing.

## The Astro implementation

My site runs on Astro, where any `.ts` file under `src/pages` becomes a route. So `/company.md` is just a file called `company.md.ts`. Here's the shape of it:

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const body = `# My Company — Overview

## Basics
| Field | Value |
|-------|-------|
| Name | Example Tech |
| Founded | 2025 |

## Mission
The one-paragraph version, in plain Markdown.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
```

The header is the part people get wrong. It has to be `text/markdown`, not `text/plain`. Serve it as plain text and you've told the machine "this is a wall of characters" instead of "this is structured Markdown" — you did the work and then hid the receipt. The `charset=utf-8` matters too the moment you have a single non-ASCII character, which, given my name, is always.

For the truly thorough version, the current best-practice writeup I keep going back to is nibzard's "Serve Markdown to Agents" (May 2026), which layers content negotiation on top: inspect the `Accept` header, fall back to User-Agent sniffing, and use `sec-fetch-dest` to tell a real browser apart from an agent. You can also advertise the twin with a `Link: <…/company.md>; rel="alternate"; type="text/markdown"` header so a crawler discovers it without guessing the URL scheme. I started with the dumb `.md.ts` files and added negotiation later. Start dumb. It works dumb.

## The one gotcha that cost me an evening

If you host on GitHub Pages like a lot of static sites do, there's a trap. GitHub Pages runs your `.md` files through Jekyll, which **compiles them to HTML**. So you drop a `company.md` in your repo expecting raw Markdown, and the server hands visitors a rendered HTML page instead — the exact thing you were trying to avoid, now wearing a `.md` URL as a disguise. The fix is to generate the `.md` as a real static asset Jekyll won't touch (Astro's build does this for you), and then (this is the part I skipped and regretted) actually verify it:

```bash
curl -I https://yoursite.com/company.md
# you want: Content-Type: text/markdown; charset=utf-8
# not:      Content-Type: text/html
```

I assumed mine was fine for two weeks. It was serving `text/html`. Two weeks of confidently shipping the wrong thing, undone by one `curl -I` I should have run on day one.

## Where this sits in the bigger LLMO picture

I don't want to oversell a file-naming trick as a growth strategy. The `.md` twin is one signal among several. It sits in the "structural formatting" and "retrieval signals" bucket of the framework over at [llmoframework.com](https://llmoframework.com/framework/overview/), which breaks LLMO into six components (knowledge clarity, structure, retrieval, authority, citation, coherence). The `.md` twin makes your content *easy to ingest*; it does nothing for *authority* or whether anyone wants to cite you in the first place. A clean Markdown page about a topic nobody trusts you on is still a clean page nobody quotes.

But of the six, this one is the cheapest to ship and the hardest to argue against. The skepticism aimed at `llms.txt` (that it's a self-declared summary the robots ignore) doesn't land here, because the `.md` twin isn't a claim about your site. It's the actual content, fetched live at the moment an agent needs it. There's nothing to distrust. It's just the same words, served politely.

## What I'd tell past me

If you have a static site and twenty minutes: pick your five most-cited pages, give each one a `.md` twin with the right Content-Type, `curl -I` to confirm, and link them from your `llms.txt` so there's at least a trail. Don't bother summarizing your whole site for crawlers that won't read the summary. Hand them the pages instead.

I spent a month writing a letter to an empty house. Then I just left the door open on every room. Turns out that's all anyone wanted.

---

If you want the full playbook that goes past the `.md` twin into JSON-LD, robots strategy, content design, and measuring whether AI actually cites you, I wrote a field guide for exactly that: [Why ChatGPT Ignores Your Website](https://kenimoto.dev/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=every-page-md-twin-llmo).
