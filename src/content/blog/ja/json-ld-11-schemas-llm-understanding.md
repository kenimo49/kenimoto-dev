---
title: "JSON-LDで LLM にサイトを「説明」する: 11スキーマ統合実装ガイド"
description: "ChatGPTに「この会社の専門は何ですか」と聞いて的外れな返答が来た経験ありませんか。それ、JSON-LDが無いからです。Organization から FAQPage まで11スキーマを1ページに統合した実装記録と、優先順位付け。"
date: 2026-05-07
lang: ja
tags: [LLMO, JSON-LD, SchemaOrg, AI]
featured: false
og_image: "https://kenimoto.dev/images/blog/json-ld-11-schemas-llm-understanding/og.png"
canonical_url: "https://kenimoto.dev/ja/blog/json-ld-11-schemas-llm-understanding"
cross_posted_to: []
---

ChatGPTに「この会社の専門は何ですか」と聞いて、的外れな返答が来たことありませんか。

私のサイトは1年それでした。記事もあるしSNSもある。なのにLLMは「不明です」と返してくる。原因はシンプルで、 **LLMが読みやすい形でサイト情報を書いていなかった** だけでした。それを直すのがJSON-LDです。

私も最初は「JSON-LDはSEOの小手先」だと思っていました。LLM時代に意味が変わりました。今は「AIに自社を理解させる唯一の確実なチャネル」になっています。

この記事は、自分のサイトに **11個のJSON-LDスキーマを1ページに統合配置** した実装記録です。Organization、Person、Bookなど、どれを最初に置くべきかの優先順位付きで書きます。

## 前提: この記事は誰向けか

すでに [llms.txt + JSON-LD 最小実装の記事](https://kenimoto.dev/ja/blog/llmo-minimum-implementation-llms-txt-json-ld) を読んだ方の続編です。あちらは「ファイル2つ置いて15分で終わる土台」の話。

本記事は土台の上にもう一段階積みたい人向けです。「Articleスキーマだけだと足りない」と気づいた段階で、次に何を入れるべきか。実装の本格編、と捉えてください。

## 結論: 1ページに11スキーマを束ねる

私が実装したスキーマ一覧です。

![1ページに統合した11スキーマ](/images/blog/json-ld-11-schemas-llm-understanding/11-schemas-overview.png)

| スキーマ | 用途 | 個数 | 優先度 |
|---------|------|------|------|
| Organization | 会社情報 | 1 | ★★★ |
| WebSite | サイト情報 | 1 | ★★★ |
| Person | 代表者情報 | 1 | ★★★ |
| Service | 事業情報 | 4 | ★★ |
| Book | 書籍情報 | 2 | ★★ |
| MusicGroup | 音楽プロジェクト | 1 | ★ |
| FAQPage | よくある質問 | 1 | ★★ |

**合計11スキーマ** を1ページの`<head>`に配列として束ねます。Astroなら`set:html`で一括出力できます。

ここで「11個も入れる必要あるのか」と思うはずです。私もそう思いました。実装してみて分かったのは、 **LLMは情報の冗長性を冗長と見なさない** ということです。むしろ「このサイトは自社を多角的に説明している」と評価する材料になります。

## 1つだけ置くなら Organization

スコープを絞り込まれた状況、つまり **1つだけ実装するなら何か** という問いには、迷わずOrganizationと答えます。

LLMが「この会社は何屋か」「どこにあるか」「いつ設立されたか」を判断する根拠は、ほぼOrganizationスキーマに集約されているからです。

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "株式会社サンプルテック",
  "alternateName": "SampleTech Inc.",
  "url": "https://example.co.jp/",
  "email": "info@example.co.jp",
  "foundingDate": "2025-04-01",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "渋谷区",
    "addressRegion": "東京都",
    "addressCountry": "JP"
  },
  "sameAs": [
    "https://linkedin.com/in/your-account",
    "https://github.com/your-account"
  ]
}
```

3箇所に注目してください。

**1. `alternateName`**: 日本語の正式名称、カタカナ表記、英語名を全部入れます。LLMは表記ゆれをまとめる作業が苦手です。「サンプルテック」「SampleTech」「株式会社サンプルテック」が同じ会社だと教えるのは、こちら側の仕事です。

**2. `sameAs`**: SNSアカウントや GitHubアカウントへのURLを並べます。「同じ主体である」という宣言なので、AIがクロスドメインで情報を統合する材料になります。LinkedIn、X、GitHub、Qiita、Zennあたりは全部入れて損はありません。

**3. `foundingDate`**: 設立日です。地味ですが、LLMが「いつ設立された会社か」と聞かれた時に答える根拠になります。日付フォーマットはISO 8601(YYYY-MM-DD)固定です。

私はこれを書く前、「会社情報なんてフッターに書いてあるじゃん」と思っていました。LLMはフッターを読まないわけではありませんが、 **構造化された情報を最優先で読みます** 。Bingのクローラーが [JSON-LDをナレッジグラフに直接格納していること](https://www.searchviu.com/en/schema-markup-and-ai-in-2025-what-chatgpt-claude-perplexity-gemini-really-see/) は実証済みで、ChatGPTはBingの索引を経由します。

## Personスキーマの knowsAbout が地味に効く

代表者情報を書くPersonスキーマで、私が一番驚いたのが`knowsAbout`フィールドです。

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "山田 太郎",
  "alternateName": "Taro Yamada",
  "jobTitle": "代表取締役",
  "worksFor": {
    "@type": "Organization",
    "name": "株式会社サンプルテック"
  },
  "knowsAbout": [
    "AIエージェント設計",
    "コンテキストエンジニアリング",
    "LLM活用",
    "LLMO"
  ]
}
```

`knowsAbout`は「この人は何の専門家か」を直接宣言する場所です。LLMに「Aさんは何に詳しい人か」と聞くと、ここに書いた配列が答えの種になります。

ここで犯しがちなミス: **広いキーワードを書いてしまう** 。「プログラミング」「マーケティング」「ビジネス」みたいな広いワードは、LLMからすると「全員が言っている」のでシグナルになりません。

逆に、絞り込んだキーワードはそのまま専門家認定の入り口になります。「LLMO」「AIエージェント設計」「コンテキストエンジニアリング」のように、検索ボリュームは小さくても専門性が立つ語を選ぶのが筋です。

私はこれをやってから、AIが私の名前で「LLMOの実践者」と返してくる頻度が体感で増えました。検索結果ではなくAI回答の中身で。

## Bookスキーマで出版物をAIに認識させる

書籍を書いている人なら必ず入れるべきがBookスキーマです。

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "実践AIエージェント開発",
  "author": { "@type": "Person", "name": "山田 太郎" },
  "publisher": { "@type": "Organization", "name": "サンプルテック" },
  "bookFormat": "EBook",
  "about": ["AIエージェント", "コンテキストエンジニアリング"],
  "inLanguage": ["ja", "en"],
  "isPartOf": {
    "@type": "BookSeries",
    "name": "エンジニアのためのAI実践シリーズ"
  }
}
```

ポイントは`about`フィールドです。書籍のテーマを配列で書きます。「AIエージェント 本」「LLMO 書籍 おすすめ」のような検索クエリで、AIが回答候補に挙げる根拠になります。

`isPartOf` を使ってシリーズに紐付けるのも効きます。「シリーズで何冊出している人」という認識を作ると、信頼度のシグナルが立ちます。

## FAQPageは引用される側の最短ルート

LLMOで一番引用されやすいスキーマがFAQPageです。

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "LLMOとは何ですか",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LLMO (LLM Optimization) とは、大規模言語モデルがWebサイトの情報を正確に理解・引用できるよう最適化する手法です。"
      }
    }
  ]
}
```

FAQPageは「質問-回答の自己完結ペア」をAIに渡す最短ルートです。AIは引用を **段落単位** で行います。FAQPageのAnswerは最初から段落単位で完結しているので、引用がほぼコピペで済みます。

注意: 実際にFAQコンテンツが画面に表示されているページにだけ使ってください。空のFAQスキーマだけ置くとペナルティ対象です(リッチスニペット側で機能停止します)。

## Astroで11スキーマを1配列にまとめる

実装は意外と単純です。Layout.astroの`<head>`に配列を1つ書くだけ。

```astro
---
const schemas = [
  { "@context": "https://schema.org", "@type": "Organization", /* ... */ },
  { "@context": "https://schema.org", "@type": "WebSite", /* ... */ },
  { "@context": "https://schema.org", "@type": "Person", /* ... */ },
  { "@context": "https://schema.org", "@type": "Service", /* ... */ },
  { "@context": "https://schema.org", "@type": "Service", /* ... */ },
  { "@context": "https://schema.org", "@type": "Book", /* ... */ },
  { "@context": "https://schema.org", "@type": "FAQPage", /* ... */ },
];
---
<script type="application/ld+json" set:html={JSON.stringify(schemas)} />
```

`set:html` を使うのがコツです。Astroは普通に書くとJSON文字列をHTMLエスケープしてしまうので、構造化データとして無効になります。`set:html`で生のJSONとして出力する。

Next.jsなら `dangerouslySetInnerHTML` 、Nuxtなら `useHead({ script: ... })` で同じことができます。クライアントサイドJSで動的に挿入する方式は **絶対NG** です。多くのAIクローラーはJSを実行しません。SSRで出力する。これだけは譲れない一線です。

## 何から実装するか: スキーマ選定の優先順位

11個のうち、どれから実装すべきか。私が試行錯誤の末にたどり着いた優先順位はこうです。

| 優先度 | スキーマ | 理由 |
|------|--------|------|
| 1 | Organization | LLMが「何屋か」を判断する起点 |
| 2 | WebSite | サイト全体の入り口情報 |
| 3 | Person | 著者の専門性シグナル(knowsAbout) |
| 4 | Article / TechArticle | 各記事の意味付け |
| 5 | FAQPage | 引用されやすさNo.1 |
| 6 | Book / Service | 提供物の明示 |
| 7 | BreadcrumbList | サイト構造の理解補助 |
| 8 | HowTo | チュートリアル記事のみ |

スキーマ選定の判断軸を全体として体系化したい方は、[llmoframework.com](https://llmoframework.com) の構造化データ章を参照してください。「どのスキーマから何個入れるか」を、サイト目的別(コーポレート/メディア/ECなど)に整理してあります。

私が雑に並べた優先順位より、用途別フレームワークで判断した方が早道だと思います。

## 2026年にChatGPTやPerplexityがJSON-LDをどう扱っているか

実態調査です。2026年5月時点で、各AI検索の挙動はおおむね次のようになっています。

- **ChatGPT Search**: Bingのインデックスを参照。BingのパーサーがJSON-LDをナレッジグラフに格納するため、構造化データはほぼそのまま読まれる
- **Perplexity**: Chromiumレンダラーで取得するが、 **静的HTML優先** 。ページのスキーマタイプ(FAQPage/Articleなど)で扱いを変える
- **Claude search (Anthropic)**: 公式仕様は非公開。観測上、Organization と Article の重みは大きい
- **Brave LLM Context API**: JSON-LDを **最優先で抽出** することを公式に明記

つまり、4大AI検索のうち少なくとも3つはJSON-LDを読んでいます。「LLMはJSON-LDを読まない」という言説もありますが、 **「全LLMが等しく読む」と「全く読まない」の中間が現実** です。重みづけは検索エンジンによって違うが、ゼロではない。それなら入れない理由がありません。

## 効果測定をセットでやる

JSON-LDを11個置いた後、効くかどうかは結局測定でしか分かりません。

3軸で見るのが王道です。

1. **AI回答での引用カウント**: ChatGPT、Perplexity、Claudeに自社関連の質問を投げ、回答に引用されているかをチェック
2. **AI経由のリファラ**: GA4で referrer に `chat.openai.com` `perplexity.ai` などが含まれるアクセスを集計
3. **ナレッジグラフ反映**: Google検索で自社名を検索したときの右側パネル、もしくはBing AIの初動回答

具体的な測定手順は [LLMO測定の3つの方法](https://kenimoto.dev/ja/blog/llmo-measurement-3-methods) にまとめてあります。実装と測定は両輪です。

スキーマ選定から効果測定までの全体フレームワークは [llmoframework.com](https://llmoframework.com) に評価指標つきで体系化されています。「どのスキーマがどの指標を改善するか」のマトリクスとして使えます。

## 締め: 11スキーマで「説明し切る」

LLMOで一番見落とされがちな話を最後に書きます。 **AIに自分のことを説明するチャンスは、JSON-LDしかありません。**

ブログを書けば内容は読まれます。SNSで発信すれば話題は拾われます。でも「あなたの会社は何屋ですか」「専門は何ですか」「どこにありますか」を直接答える場所は、JSON-LD以外にないんです。

llms.txtは「ここを読んで」のコンシェルジュ。JSON-LDは「私はこういう者です」の自己紹介。両方揃えると、AIから見たときのプロフィールが完成します。

11スキーマは多いと感じるかもしれません。でも一度書いてしまえば、変更頻度はほぼゼロです。Astroなら設定ファイルに1回書くだけ。1時間の投資で、AIからの認識が永続的に整います。

火事が起きてから消火器は買えません。AIに見つけてもらってから自己紹介を書いても遅い。私は1年遅れました。あなたはこの記事を読み終えた今から始められます。

## 参考

- [JSON-LD最小実装(llms.txt + Article)](https://kenimoto.dev/ja/blog/llmo-minimum-implementation-llms-txt-json-ld): 土台の話
- [LLMO測定 3つの方法](https://kenimoto.dev/ja/blog/llmo-measurement-3-methods): 効果測定の手順
- [llmoframework.com](https://llmoframework.com): LLMO全体フレームワーク
- [Brave LLM Context API ドキュメント](https://api-dashboard.search.brave.com/api-reference/summarizer/llm_context/get): JSON-LD優先抽出の仕様
- [Google Rich Results Test](https://search.google.com/test/rich-results): JSON-LDのバリデーション

---

## さらに深掘りしたい方へ

LLMOの全体像を30分で押さえたい方は、核心を8章で凝縮した **[LLMOクイックスタート: エンジニアのためのAI検索最適化入門](https://kenimoto.dev/ja/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=json-ld-11-schemas)** が最短ルートです。
