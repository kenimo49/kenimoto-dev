---
title: "The og:type Bug Three of My Astro Sites Quietly Shipped"
description: "I run four Astro sites. Three of them shipped the same SEO bug for months — every blog post told Twitter, Facebook, and LinkedIn it was a website, not an article. Here is what happened, why I did not catch it sooner, and the build-time check that would have caught it on day one."
date: 2026-05-08
lang: en
og_image: "https://kenimoto.dev/images/blog/og-type-double-emit-three-astro-sites/og.png"
tags: [astro, seo, webdev, ai]
featured: false
canonical_url: "https://kenimoto.dev/blog/og-type-double-emit-three-astro-sites/"
---

I run four Astro sites. Three of them shipped the same SEO bug for months. Every blog post on those sites told Twitter, Facebook, and LinkedIn that it was a *website* — not an *article*.

Here is what happened, why I did not catch it sooner, and the one-line build check that would have caught it on day one.

## What "og:type" actually does

When you paste a URL into Twitter or LinkedIn, the platform fetches the page and reads the Open Graph meta tags to decide what card to show. The most consequential of those tags is `og:type`. It tells the platform whether the URL is a website, an article, a book, a video, or a profile.

Twitter shows different rich cards for `article` than for `website`. Facebook surfaces published date and author for `article`. LinkedIn formats the snippet differently. Search engines also consume `og:type` as a hint about content classification.

The contract is simple: emit it once per page, with the correct value for the page.

## The bug

In a typical Astro project, the meta tags live in a `BaseLayout.astro` that wraps every page. My `BaseLayout` had this line:

```astro
<meta property="og:type" content="website" />
```

That was correct for the home page, the about page, the blog index. Fine.

For blog posts I had a `BlogLayout.astro` that wrapped `BaseLayout` and added article-specific tags through Astro's named slot:

```astro
<BaseLayout {title} {description} {ogUrl}>
  <Fragment slot="head">
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={date.toISOString()} />
  </Fragment>
  <slot />
</BaseLayout>
```

Both pieces in isolation look right. The blog layout adds the `article` tag for blog posts. Run a blog post through the build and inspect the rendered HTML:

```html
<meta property="og:type" content="website" />
<!-- ...other meta from BaseLayout... -->
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2026-04-30T00:00:00.000Z" />
```

Two `og:type` tags. The first one, `website`, is the one social platforms read. The article tag is silently ignored.

## Why this is invisible without checking

You will never see this bug in normal use:

- The page renders fine. Visitors do not notice.
- The build succeeds. No warnings.
- Astro does not flag duplicate meta tags. They are valid HTML.
- Open Graph parsers do not throw an error for duplicates -- they just take the first match.
- Even when you share the URL on Twitter, the card *kind of* works because the title, description, and image are still correct.

The only thing that breaks is the *type signal*. Your articles look like landing pages to every machine that consumes them, including Google's structured-data understanding.

I caught this on the third site only because I started running a small validation script during my SEO audit. The first two sites had been running for weeks.

## How three sites all got it

The mechanism is identical across the three repos. Two cooperating layouts each emit one `og:type`, neither one knows about the other, and the result is two emissions. Once you build a site this way, every variant you start later from the same template inherits the bug.

I copied the layout structure from `kenimoto.dev` to a PC selection site, then to a whisky media site, then to the LLMO Framework documentation site. The bug rode along every time.

The same shape shows up in other meta tags people layer the same way — `meta[name=description]`, `link[rel=canonical]`, `og:url`. Anywhere two layouts can both emit a tag that should appear once, this class of bug will eventually appear.

## The fix: lift `og:type` into a prop

The right shape is for `BaseLayout` to own `og:type` exclusively, with a default of `website` and a prop override for pages that need a different value.

`BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  ogUrl: string;
  ogType?: 'website' | 'article' | 'book' | 'profile' | 'video.other';
}

const { title, description, ogUrl, ogType = 'website' } = Astro.props;
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:url" content={ogUrl} />
  <meta property="og:type" content={ogType} />
</head>
```

`BlogLayout.astro` then passes `ogType="article"` and removes its own emission:

```astro
---
import BaseLayout from './BaseLayout.astro';
const { title, description, canonicalUrl, date, tags } = Astro.props;
---

<BaseLayout
  title={title}
  description={description}
  ogUrl={canonicalUrl}
  ogType="article"
>
  <Fragment slot="head">
    <meta property="article:published_time" content={date.toISOString()} />
    {tags.map(tag => <meta property="article:tag" content={tag} />)}
  </Fragment>
  <slot />
</BaseLayout>
```

A `BookLayout.astro` does the same with `ogType="book"`.

Now `og:type` is emitted exactly once, and the value matches the page subject.

## The build-time check that would have caught it

After the fix I added a small script to the build pipeline that walks every generated HTML file in `dist/` and counts how many `og:type` tags each has.

```js
// scripts/verify-meta.mjs
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const failures = [];
for await (const file of walk('dist')) {
  const html = await readFile(file, 'utf8');
  const count = (html.match(/property="og:type"/g) || []).length;
  if (count !== 1) failures.push(`${file}: ${count} og:type tags`);
}

if (failures.length > 0) {
  console.error('og:type duplication detected:');
  failures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log('og:type check passed.');
```

Hook it into the build:

```json
{
  "scripts": {
    "build": "astro build && node scripts/verify-meta.mjs"
  }
}
```

This runs in well under a second on a 70-page site. If a future layout change re-introduces a second `og:type`, the build fails with the offending file paths. No more silent emissions.

You can extend the same idea to other meta tags that should appear exactly once: `title`, `meta[name=description]`, `link[rel=canonical]`, `meta[property="og:url"]`. Two-on-one duplication is a common shape for this class of bug.

## What I would do differently

A few things, looking back:

The bug existed because two layouts both *could* emit `og:type`. The convention should be that exactly one layer in the stack owns each meta tag. Lift each tag to the layer that knows the right value, and forbid the lower layers from touching it. In Astro that means BaseLayout takes a typed prop, and there is no override path through the `head` slot for that specific tag.

I should have written the build check at the same time as the layout, not weeks later as part of an audit. Verifying that *N* of something appears in the output is a tiny script. Doing it later means living with whatever drift accumulated in between.

Sharing layout code between sites was the right call. Sharing the bug across sites was the cost. Centralized templates work for me only if I have automated checks that run on every site that uses them — otherwise the next site I spin up inherits whatever defects are sitting in the template.

## What to do next

If you have an Astro site (or any SSG site with layered layouts), run this in your `dist/` after your next build:

```bash
grep -c 'property="og:type"' dist/blog/*/index.html | grep -v ':1$'
```

Anything that comes back is a page emitting two or more `og:type` tags. If the list is empty, you are clean. If not, you just found three sites' worth of silent SEO drift in your own repo.

The pattern this article describes — one layer owns each meta tag, and a build-time count check enforces it — is part of what I think of as *Structural Formatting* in the [LLMO Framework](https://llmoframework.com/framework/structural-formatting/): not just emitting JSON-LD and meta, but *verifying* that what you emitted is what actually shows up in the served HTML.

Until you measure the output, you do not know what you ship.
