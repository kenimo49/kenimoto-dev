---
title: "Neo4jで個人ナレッジグラフを組んだら、Notionを解約できた ― 3か月・300ファイルの実測"
description: "Notion Plusの月$10を止めるために、Neo4j AuraDB Freeで個人ナレッジグラフを組みました。RDFではなくProperty Graphを選んだ理由と、300ファイル取り込みで詰まった3つの罠、そして解約を決めた瞬間の話です。"
date: 2026-07-01
lang: ja
tags: [neo4j, knowledge-graph, personal-kg, notion, cypher]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/neo4j-personal-kg-notion-cancel-3-months-300-files"
og_image: "https://kenimoto.dev/images/blog/neo4j-personal-kg-notion-cancel-3-months-300-files/og-ja.png"
cross_posted_to: []
---

Notion Plusの月$10、年で$120です。3年払い続けて$360。並べて見ると、缶コーヒー1本分の判断ミスをずっと積み立てているような気分になりました。使っている機能は「ページとページをリンクで繋ぐ」だけ。データベース機能はほぼ触っていない。それでこの金額を払い続けるのは、私の中では通らなかったのです。

3か月前、私は「Notionを解約するなら、代わりの仕組みを自前で持たないと戻ってこれない」と自分に言い聞かせて、Neo4jで個人ナレッジグラフ(PKG)を組み始めました。300ファイルを取り込み、Cypherで検索できる状態にして、そして先週、実際に解約ボタンを押しました。

この記事は、その3か月分の実測記録です。RDFではなくProperty Graphを選んだ理由、AuraDB Freeの枠に収まるか、そして「取り込みで確実に詰まる3つの罠」を書きます。

![Neo4j個人KGの全体像](/images/blog/neo4j-personal-kg-notion-cancel-3-months-300-files/pkg-overview-ja.png)

## なぜProperty Graphだったのか

最初はRDF (Resource Description Framework) で組もうとしました。「セマンティックWebで標準化されているし、正しそう」と思ったのです。ここで1週間溶かしました。

RDFは主語-述語-目的語のトリプルで世界を書き記します。厳密で美しいのですが、個人のメモ用途では**厳しすぎる**。「このメモに感想を追加したい」と思っただけで、reificationやRDF*の書き方をどれにするか毎回悩みました。個人の記憶は、そもそもそんなに整っていないのです。

一方Property Graphは、ノードとエッジそれぞれに任意のプロパティを直接付けられます。Neo4jが採用しているモデルです。

```cypher
CREATE (n:Note {
  title: "ハーネスとエージェントの分離",
  created: date("2026-04-12"),
  tags: ["harness", "agent"],
  mood: "整理中"
})
```

`mood: "整理中"`のような、あとから思いついたプロパティを気軽に足せます。厳密性を捨てて、書き手の脳内に近い柔らかさを取りました。私がやりたかったのは「未来の自分が探せる状態にしておく」ことであって、W3Cのvocabulary審査ではなかった、というのが1週間後の結論です。

## Neo4j AuraDB Freeの枠に、300ファイルは入るのか

Neo4jのマネージドサービスAuraDBのFree tierは、公式ドキュメントによると**200,000ノード / 400,000リレーションシップ**まで無料で使えます([Neo4j AuraDB FAQ](https://neo4j.com/cloud/platform/aura-graph-database/faq/))。ただし製品ページ側では「50k/175k」表記が残っている箇所もあり、私が始めたときも表記の揺れがありました。実際に使ってみた枠は200k/400kで問題なく通ったので、以下はその前提で書きます。

私のObsidian Vaultは300ファイル、平均3,000字、内部リンク約2,800本。これをNeo4jに流し込むとどうなるか、事前に見積もりました。

| 要素 | 生成される数 |
|---|---|
| ノート(`Note`) | 300 |
| タグ(`Tag`)ノード | 42 |
| 概念(`Concept`)ノード | 実測 918 |
| `LINKS_TO` (Note→Note) | 2,800 |
| `HAS_TAG` (Note→Tag) | 1,240 |
| `MENTIONS` (Note→Concept) | 3,600 |

合計ノード ≈ 1,260、リレーションシップ ≈ 7,640。Free枠(200k/400k)に対して0.6% / 1.9%です。1,000倍まで余裕があります。Notionの容量制限を気にしなくてよくなった瞬間、体感で少し軽くなりました。

## 詰まった3つの罠

見積もりが甘くても実装で詰まらないとは限りません。取り込みで確実に詰まった3つを書きます。

### 罠1: Obsidianの内部リンクの表記揺れ

Obsidianでは`[[note-name]]`と書きますが、私のVaultには`[[note name|表示名]]`のalias付きも、`[[note-name#見出し]]`のアンカー付きも、`![[embed-note]]`の埋め込み参照も混在していました。3年分のメモは、その時々の自分の書き癖が混ざるのです。

雑な正規表現 (`\[\[([^\]]+)\]\]`) で吸って一気にリレーションを張ろうとしたところ、実在しないノードへのエッジが286本生まれてグラフが破綻しました。存在しないノードとのリンクは、Neo4jだと「片側だけあるエッジ」として保存されてしまうため、あとで探し出すのに丸1日かかります。

対処は、リンク解決を**必ず2パス**にしたことです。Pass 1でノードだけ全部作り、Pass 2でリンクを解決する。存在しないリンク先はログに落として、後日Vault側を直す。地味ですが、これで表記揺れの被害が閉じました。

### 罠2: 日付と時系列の統一

Obsidianの各ノートには`created`と`modified`のfrontmatterがあるものと、ファイルシステムのmtimeしかないものと、YAML内で`日付: 2024/04/12`のようにJST表記で入っているものが混在していました。3年間で、私の日付の書き方が5回くらい変わっていたのです。

Neo4jの`date()`関数はISO 8601しか受け付けません。取り込みスクリプトで統一しないまま流すと、Cypherの範囲検索が全滅します。「先月書いたメモを全部出して」が動かないPKGは、正直、価値がゼロです。

対処は、取り込み時に全メモを`date()`型に強制変換し、失敗したらそのメモに`:NeedsDateReview`ラベルを付けて別のリストに追い出したことです。42ファイル救出しました。

### 罠3: 概念ノードの粒度爆発

これが3つ中で一番厄介でした。テキストから固有表現(NER)で概念ノードを作ろうとしたところ、「Claude」「Claude Code」「claude code」「Anthropic Claude Code」の4つが別ノードとして生まれました。918個の概念ノードのうち、体感で4割が同義語の重複でした。

粒度が爆発すると、グラフ全体が「点の集まり」になり、繋がりが薄くなります。せっかくグラフにしたのに、リンクが張れていない状態です。

対処は、**取り込み後にaliasテーブルを1枚作って、正規化する**でした。手動で200エイリアスほど整備して、Cypherで一括MERGEし直しました。918→612ノード。ここでようやく、繋がりのある地図らしくなりました。

Property Graphを設計として学ぶには、[『実践ナレッジグラフ入門』](https://kenimoto.dev/ja/books/knowledge-graph-practical-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=neo4j-personal-kg-notion)の第3章と第4章に、私がこの3か月で踏んだ罠の背景理論が整理されています。Pass 1/Pass 2の話も、私は最初この本で読んで「あとで自分もこれで詰まるな」と思っていた通りに詰まりました。

## 解約を決めたのは、意外な瞬間だった

3か月動かして、Notionを解約したのは「Neo4jの機能が完成したから」ではありません。ある夜、`MATCH (n:Note)-[:LINKS_TO*2..3]-(m:Note) WHERE n.title CONTAINS "Voice AI" RETURN m.title LIMIT 20`と打ったら、**2ホップ先の忘れていたメモが3件出てきた**からです。

そのうちの1件は、半年前に書いた「Voice AIのlatency予算300ms」の話でした。当時、Voice AIとは別の文脈で書いていたので、Notionのバックリンク画面では絶対に辿れませんでした。Property Graphの2ホップ探索は、私の「忘れていた自分」を掘り出しました。

その瞬間に「これは月$10より価値がある」と決まり、翌日Notionを解約しました。

## Neo4jにあってNotionになかったもの、逆もある

正直に書くと、Notionの方が優れている点もあります。

- **モバイルからの雑書き**: NotionのiOSアプリの書き心地には勝てません。私はObsidianモバイル + iCloud syncで代替していますが、共有リンクとかチーム機能はゼロ。
- **画像・ファイル添付**: Neo4jに直接載せない設計にしたので、そこはObsidianに委ねています。
- **表とデータベース**: PropertyでもCypherでも書けますが、UIとしての快適さはNotionの圧勝。

私の判断は「個人の思考の地図が欲しくて、共同編集は要らない」だったので、この3点は諦めても解約する価値がありました。もしチームで使っているならNotion継続一択です。

## まとめ

- Notion Plus月$10を止めるためにNeo4jで個人KGを組んで、3か月後に解約できました
- Property GraphはRDFよりも「書き手の脳内に近い柔らかさ」を許すので、個人用途では素直な選択でした
- AuraDB Free枠(200k/400k)に対して、300ファイルは1%以下でおさまりました
- 取り込みで詰まったのは、リンク表記揺れ / 日付統一 / 概念ノード粒度爆発の3つ
- 「解約していい」と決まったのは、2ホップ探索で忘れていた自分のメモが出てきた瞬間でした

3年払い続けた月$10は、こうやって「毎晩Cypherを打つ楽しみ」に変わりました。缶コーヒーより、こっちの方が私の日常に馴染みます。

---

参考リンク:

- [Neo4j AuraDB FAQ](https://neo4j.com/cloud/platform/aura-graph-database/faq/) — Free tierのnode/relationship上限
- [Notion Pricing](https://www.notion.com/pricing) — 2026年の個人プラン料金
