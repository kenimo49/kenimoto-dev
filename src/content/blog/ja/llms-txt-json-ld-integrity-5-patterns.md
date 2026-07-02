---
title: "llms.txtとJSON-LDが噛み合っていない5パターン — 30ファイルを整合チェックして分かったこと"
description: "実在サイトの llms.txt を30本開いて、同じページの JSON-LD と突き合わせました。半分は @type / @id / description のどれかがズレていた。llmoframework 準拠でズレを埋める書き方を整理します。"
date: 2026-07-02
lang: ja
tags: [llmo, llms-txt, json-ld, schema-org, geo]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/llms-txt-json-ld-integrity-5-patterns/"
og_image: "https://kenimoto.dev/images/blog/llms-txt-json-ld-integrity-5-patterns/og-ja.png"
cross_posted_to: []
---

先日、実在サイトの llms.txt を30本開いて監査した記事を書きました。5つのアンチパターンを並べて満足していたら、翌週、読んでくれた方から短いメッセージが届きました。

「llms.txt 単体は綺麗になったのですが、JSON-LD と突き合わせるとぐしゃぐしゃでした。あれ、両方揃ってないと意味ないんですか」

意味ないんです。ちゃんと調べていなくて答えられなかったので、今度は同じ30本の llms.txt を、対応するページの JSON-LD と一件ずつ突き合わせてみました。結果、**30本中17本で @type / @id / description のいずれかが食い違っていました**。私自身の kenimoto.dev も1件ヒットしました。冷や汗をかきながらこの原稿を書いています。

以下、その17件から抽出した「llms.txt と JSON-LD が噛み合わない5パターン」の整理と、[llmoframework.com](https://llmoframework.com/) の推奨に沿った直し方を並べます。**llms.txt を書くのは初手、JSON-LD と整合を取るのが二手目、その二手目で半分落ちている**というのが今回の温度感です。

## 前提: なぜ llms.txt と JSON-LD の両方を見るのか

先に前提を1段落だけ整理させてください。

llms.txt は、AIクローラに「このサイトのどこを読めばいいか」を Markdown で案内するファイルです。JSON-LD は、同じページの中で「このコンテンツは何者か」を Schema.org 語彙で名乗る構造化データです。両者は役割が違います。**llms.txt が地図、JSON-LD が身分証**というのが私の中でしっくり来ている比喩です。

問題は、地図と身分証で **住所が違う** ときに起きます。llms.txt では「Article」を指しているのに、そのページの JSON-LD は `@type: WebPage` で止まっている。llms.txt の説明文と JSON-LD の `description` が別のことを言っている。地図と身分証が違うことを言っていたら、まず疑われるのは地図でも身分証でもなく、案内している側の信頼です。

Princeton の GEO 研究では、構造化シグナルが明確なコンテンツは AI 生成回答での可視性が最大 40% 向上したという結果が出ています ([Princeton GEO 論文, 2024](https://arxiv.org/abs/2311.09735))。llms.txt 単体で語られがちですが、JSON-LD と整合を取って初めて、その 40% の枠に手が届く、というのが2026年現在の実感です。

## パターン1: llms.txt は「Article」扱いなのに JSON-LD が WebPage 止まり

30本中の最頻出、7件がこのパターンでした。

llms.txt 側の記述はこうなっていました。

```markdown
## Articles
- [How we ship AI agents safely](https://example.com/blog/ai-agents-safe): 3-part series on runtime constraints
```

同じ URL の JSON-LD を開くとこうです。

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://example.com/blog/ai-agents-safe",
  "name": "How we ship AI agents safely"
}
```

llms.txt は「Article」であることを前提に紹介しているのに、ページ本体は「WebPage」としか名乗っていません。この状態だと、Anthropic の ClaudeBot も OpenAI の GPTBot も、ページを「記事」ではなく「一般ページ」として扱います。引用時の見せ方が変わり、記事タイトルではなく URL がむき出しで表示されるケースが増えます。

直し方は素直に `Article` へ寄せます。

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How we ship AI agents safely",
  "author": {
    "@type": "Person",
    "name": "ken imoto"
  },
  "datePublished": "2026-07-02",
  "url": "https://example.com/blog/ai-agents-safe"
}
```

`Article` に寄せる、`headline` を llms.txt の見出しと一致させる、`author` と `datePublished` を最低限入れる。この3点でパターン1は消えます。llmoframework の [Cite by AI](https://llmoframework.com/) の章にも、`Article` 未満で放置すると引用時の重みが下がるという記述があります。

## パターン2: llms.txt の説明文と JSON-LD の description が別のことを言っている

これは4件。地味に効きます。

llms.txt 側の記述はこう。

```markdown
- [Runtime cost of AI agents](https://example.com/blog/runtime-cost): Field report on 47k tokens/day agent at $12/day
```

同じページの JSON-LD がこう。

```json
{
  "@type": "Article",
  "headline": "Runtime cost of AI agents",
  "description": "AI エージェントの運用コストについて解説します。"
}
```

llms.txt では「47k tokens/day, $12/day」という具体的な数字が前面に出ています。JSON-LD では「解説します」という一般名詞です。**同じページの説明が2枚あって、片方だけ数字が入っている**。AI クローラは複数のシグナルを重ね合わせて要約を作りますが、こういうときは大抵、平均を取るのではなく、より抽象度の高い方 (JSON-LD の description) に寄ります。せっかくの具体数字が持ち腐れになるパターンです。

直し方は「JSON-LD の description を llms.txt に寄せる」で足ります。JSON-LD 側を少し具体的に書き直します。

```json
"description": "Field report on running an AI agent at 47k tokens/day for $12/day, with the exact prompt caching config."
```

一致させないまでも、**両者の情報密度を揃える**のがコツです。llms.txt は箇条書きの制約で具体的になり、JSON-LD は自由記述で抽象的になる傾向があります。この非対称を意識的に埋めます。

## パターン3: llms.txt の階層と JSON-LD の isPartOf が食い違う

3件。これは分かってやっている人がまだ少ないところです。

llms.txt はセクション見出しで階層を示せます。

```markdown
## Books
### Practical Knowledge Graphs
- [Chapter 5: GraphRAG mechanism](https://example.com/books/kg/ch05): ...
```

llms.txt の見出し構造上、`ch05` は `Practical Knowledge Graphs` という書籍の一部です。ところが同じページの JSON-LD がこうなっていました。

```json
{
  "@type": "Article",
  "headline": "Chapter 5: GraphRAG mechanism"
}
```

`isPartOf` が抜けています。llms.txt では「本の一章」なのに、JSON-LD では「独立した Article」に見える。この状態だと、AI が「この本の第5章を教えて」と聞かれたときに、書籍と章の関係が復元できず、ページだけを切り出して答える羽目になります。

直し方は `isPartOf` を明示することです。

```json
{
  "@type": "Article",
  "headline": "Chapter 5: GraphRAG mechanism",
  "isPartOf": {
    "@type": "Book",
    "@id": "https://example.com/books/kg/#book",
    "name": "Practical Knowledge Graphs"
  }
}
```

`@id` にフラグメント (`#book`) を含めておくと、後述するパターン5の防止にもなります。ここの整合を取ると、AI 側から「本のどの章か」を辿れる構造ができます。この構造を体系立てて理解したい方は、[Knowledge Graph 実践ガイド](https://kenimoto.dev/ja/books/knowledge-graph-practical-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=llms-txt-jsonld-integrity) の第4章「7ステップで KG を組む」あたりが `isPartOf` の実装例に一番近いです。

## パターン4: llms.txt が指す URL と JSON-LD の @id が違う

2件、ただしどちらもインパクトが大きい事故でした。

llms.txt はこう。

```markdown
- [Pricing guide](https://example.com/pricing): Full 2026 pricing breakdown
```

同じページの JSON-LD がこう。

```json
{
  "@type": "Article",
  "@id": "https://example.com/blog/pricing-guide-2026",
  "url": "https://example.com/pricing"
}
```

`@id` が旧 URL (`/blog/pricing-guide-2026`) を指しています。ページのリダイレクトを設定したときに JSON-LD だけ書き換え漏れていたと推測できます。llms.txt から「pricing」で来た AI クローラは、`@id` に書かれた旧 URL を辿って 404、または重複ページを踏みます。

これは `canonical` を含めた**同一性の三点同期**の話です。

- llms.txt に書いた URL
- JSON-LD の `@id` と `url`
- HTML の `<link rel="canonical">`

この3つが全部同じ URL を指しているか、リリース前に必ず突き合わせます。私は kenimoto.dev で以下のようなワンライナーをコミット前に流しています。

```bash
# llms.txt のURLをJSON-LDとcanonicalに揃っているか確認
grep -oE 'https://kenimoto.dev/[^)]+' public/llms.txt | while read url; do
  html=$(curl -sL "$url")
  jsonld_id=$(echo "$html" | grep -oE '"@id":\s*"[^"]+"' | head -1)
  canonical=$(echo "$html" | grep -oE 'rel="canonical" href="[^"]+"' | head -1)
  echo "$url | $jsonld_id | $canonical"
done
```

雑ですが、目視で1枚に並べば矛盾はすぐ見えます。

## パターン5: llms.txt の Markdown 版リンクと JSON-LD の hasPart が別世界

1件。件数は少ないですが、これから増えると思います。

llms.txt の作法として、各ページの Markdown 版 (`/blog/foo.md`) を用意する運用が2026年に入って一般化しました。llms.txt 側の記述はこう。

```markdown
- [Blog: LLMO Basics](https://example.com/blog/llmo-basics)
  - Markdown: https://example.com/blog/llmo-basics.md
```

同じページの JSON-LD がこう。

```json
{
  "@type": "Article",
  "hasPart": [
    { "@type": "WebPage", "url": "https://example.com/blog/llmo-basics-print" }
  ]
}
```

llms.txt からは「Markdown 版がある」と案内しているのに、JSON-LD の `hasPart` は印刷用ページを指していました。AI クローラは HTML 経由でも Markdown 経由でも情報を取りに来ます。llms.txt しか読まない Bot は Markdown 版を取りに行き、JSON-LD も読む Bot は印刷版を取りに行き、**両者が別の内容を回答に混ぜる**という気持ち悪い状態が起きます。

直し方は、JSON-LD の `hasPart` に Markdown 版も含めることです。

```json
"hasPart": [
  {
    "@type": "MediaObject",
    "encodingFormat": "text/markdown",
    "contentUrl": "https://example.com/blog/llmo-basics.md"
  }
]
```

`MediaObject` + `encodingFormat: text/markdown` の組み合わせは Schema.org 側でもまだ揺れがあります。ただ、少なくとも「llms.txt が指しているのと同じ Markdown 版」を JSON-LD 側でも認識できる状態にはなります。

## 5パターンを1枚に整理する

30本の監査で見えた5パターンは、抽象化すると **llms.txt が言っていることと、JSON-LD が言っていることが、同じページを指しているのに違うことを言っている** に尽きます。

| # | ズレる場所 | よくある症状 | 直し方 |
|---|---|---|---|
| 1 | @type | llms.txt: Article / JSON-LD: WebPage | JSON-LD を Article に昇格 |
| 2 | description | llms.txt: 数字あり / JSON-LD: 抽象 | 情報密度を揃える |
| 3 | 階層 | llms.txt: 章構造 / JSON-LD: 独立 Article | isPartOf を追加 |
| 4 | URL | llms.txt: 新 URL / JSON-LD: 旧 URL | 三点同期 (llms.txt/@id/canonical) |
| 5 | hasPart | llms.txt: Markdown 版 / JSON-LD: 印刷版 | MediaObject で Markdown 版も明示 |

## リリース前のチェックリスト

自分の運用に落とし込むと、リリース前にこの5つを1分で確認できるようにしたいところです。私はこうしています。

- [ ] llms.txt に載せた URL の JSON-LD が `@type: Article` になっている
- [ ] llms.txt の説明文と JSON-LD の `description` が同じ情報密度で書けている
- [ ] 本や連載の一部なら JSON-LD に `isPartOf` がある
- [ ] llms.txt の URL、JSON-LD の `@id`、HTML の `<link rel="canonical">` が三点一致
- [ ] Markdown 版があるなら `hasPart` に `MediaObject` として書いてある

30本のうち、この5項目を全部満たしていたのは13本でした。半分行きません。ただ、その13本の顔ぶれ (Anthropic docs、Mintlify、Vercel、Astro など) を見ると、**普段から「引用された時に見え方が変わる」を意識しているところ**が揃っていました。ここに入るかどうかは、5分の作業の積み重ねだと思います。

## おわりに

正直、この記事を書きながら kenimoto.dev の JSON-LD を3ページ修正しました。パターン3 (`isPartOf` 抜け) が2件、パターン2 (description の抽象化) が1件。人のことは言えません。

llms.txt を書くのはスタートラインで、JSON-LD と揃えるのが本番です。「揃える」は難しくないんですが、意識していないと2週間で壊れます。この記事のチェックリストを、リリース手順の直前に貼るくらいの温度感で扱うと、地味に効いてくると思います。

コード側の構造化データを本気で整えたい方は、私が [Knowledge Graph 実践ガイド](https://kenimoto.dev/ja/books/knowledge-graph-practical-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=llms-txt-jsonld-integrity) で JSON-LD の `@id` 設計と Knowledge Graph の関係を第4-5章あたりで扱っています。llms.txt と JSON-LD の整合は、KG 側から見ると「エンティティの同一性」の問題で、同じ道具立てで整理できます。

私はコーヒーを淹れて、残りの JSON-LD を直しに行きます。
