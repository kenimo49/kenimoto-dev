---
title: "SEOが壊れる日 — 私のAIエージェントは、もうGoogleを見ていなかった"
description: "ある日、私のAIエージェントが情報を探すときGoogleではなくBrave Searchを使っていることに気づきました。3ヶ月積み上げたmeta tagsはClaudeに1秒も読まれていませんでした。LLMOがコンテンツに届く3つの経路を、実装の角度から整理した入門編です。"
date: 2026-05-10
lang: ja
tags: [LLMO, AI, SEO, BraveSearch]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/llmo-three-paths-introduction/"
og_image: "https://kenimoto.dev/images/blog/llmo-three-paths-introduction/og-ja.png"
cross_posted_to: []
---

ある日のことでした。私が運用しているAIエージェントのログを眺めていて、ふと違和感を覚えました。

エージェントが情報を検索するとき、Googleを使っていなかったのです。代わりに使っていたのは **Brave Search** でした。

これは小さな衝撃でした。私がSEO対策で12年最適化してきた検索エンジンと、自分のAIエージェントが実際に見ている検索エンジンが、まったく別物だったのです。

## ChatGPTはBing、ClaudeはBrave、GeminiはGoogle

調べてみると、これは私のエージェントだけの話ではありませんでした。

主要なLLMサービスは、それぞれ別の検索バックエンドを使っています。

| LLMサービス | 検索バックエンド | 備考 |
|---|---|---|
| ChatGPT | Bing | 一部 SearchGPT も併用 |
| Claude | Brave Search | Anthropic 採用後、Brave への流量が急増 |
| Gemini | Google Search | Google 自社のインデックス |
| Perplexity | 独自 + 外部API混在 | Brave / Bing を併用する局面あり |
| Cursor などコーディング系 | Brave Search が主流 | Bing API の外部提供廃止が背景 |

Brave Search は2026年5月時点で1日あたり約4,300万クエリを処理しています。米国検索シェアは2.45%。グローバルでは0.6%程度ですが、AI経由のクエリが乗ったことで成長カーブが急になっています。

つまり、私のSEO対策は、Googleで上位を取るための12年でした。AIに引用されるための12年ではなかったのです。

## SEOは死なない、でもSEOだけでは負ける

「SEOは死んだ」と書きたいわけではありません。それは見出しのために魂を売る人の表現です。

Google の検索シェアは依然として約90%です。10本の青いリンクからの流入は、私のサイトの主たる収益源として変わらず動いています。SEO対策のmeta tagsを外す日は来ません。

しかし、AI経由の訪問者の質は別物でした。手元の数字で確認してみます。

- AI経由のリファラル訪問のコンバージョン率は **11.4%** に対し、オーガニック検索は5.3% (SimilarWeb調査)
- LLM経由訪問者のコンバージョン率は、ケースによってはオーガニック検索の **最大23倍** に達する (Ahrefs調査)
- AI経由のリファラルトラフィックは前年比 **357%増加** (SimilarWeb調査)
- AI Overviews の表示で、Google検索1位ページのCTRは **34.5%低下** (Ahrefs調査)

量が少ないが質が桁違いに高い。これがAI経由トラフィックの特徴です。そしてこの量も、毎年数百パーセントの勢いで増えています。

3ヶ月かけて積み上げたmeta tagsが、Claude Sonnetには1秒も読まれていない事実は、人を多少打ちのめします。打ちのめされたあとに、SEOの上にもう1段積むものがある、と気づくのが正しい順序でした。

それが **LLMO (Large Language Model Optimization)** です。

## LLMOの定義と、似た言葉の整理

LLMO とは、ChatGPT・Claude・Gemini・Perplexity といった大規模言語モデルの回答において、自分のコンテンツが参照・引用されるように最適化する技術のことです。

似た言葉がいくつかあります。混乱するのも当然です。整理しておきます。

| 用語 | 意味 | 普及度 |
|---|---|---|
| LLMO | 大規模言語モデルへの最適化 | 実務で増えている |
| GEO | Generative Engine Optimization | 学術的には標準 |
| AIO | AI 全般への最適化 | 日本で比較的使用 |
| AEO | Answer Engine Optimization | やや狭い概念 |

どの用語も本質は同じです。「AIの回答で自分のコンテンツが引用されるための最適化」を指しています。本記事では LLMO を使います。

## LLMにコンテンツが届く3つの経路

LLMO を理解する上で最初に押さえたい問いは、「LLM はどうやってあなたのコンテンツを知るのか」です。経路は大きく3つあります。

![LLMにコンテンツが届く3つの経路: 学習データ、RAG、エージェント検索の比較](/images/blog/llmo-three-paths-introduction/three-paths.png)

### 経路1: 学習データ (長期戦・効果6ヶ月から2年)

GPT-4 や Claude は膨大なテキストデータで事前学習されています。この学習データに含まれた情報が、モデルの「記憶」になります。

ここで押さえておきたいのは、すべてのWebページが平等に扱われているわけではない、という点です。

GPT-3 の学習データでは、Wikipedia と WebText2 (Reddit で3つ以上の upvote を受けた投稿に含まれるリンク先) に **5から6倍の学習ウェイト** が与えられていました。Reddit コミュニティが「価値がある」と判断したコンテンツは、LLM の記憶に強く刻まれるのです。

ただし、学習データにはカットオフ日があります。今日公開した記事がClaudeのモデルに反映されるのは、早くても数ヶ月後。次のモデルの学習が回るタイミングを待つ、いわば長期戦です。

「Anthropic の次のモデルに私のブログを覚えていてもらう」のは、3ヶ月の戦いではなく、3年の戦いです。

### 経路2: RAG (中期戦・効果1から3ヶ月)

RAG (Retrieval-Augmented Generation) は、LLM が「記憶」にない情報を補完するために、リアルタイムでWeb検索を行い、取得した情報をもとに回答を生成する仕組みです。

ChatGPT の Browse with Bing、Perplexity の Web 検索、Google AI Overviews。これらはすべて RAG です。

**AI の回答に引用URLが付くのは、主にこの RAG 経由です**。これが LLMO の中で最も即効性のある経路です。

RAG で重要な概念が **Query Fan-out** です。ユーザーが1つの質問をすると、RAG システムは内部で複数のサブクエリに分解して検索します。

たとえば「HubSpot をスタートアップで使うべきか」という質問は、内部でこのように展開されます。

- 「HubSpot スタートアップ 料金」
- 「HubSpot 代替ツール 比較」
- 「スタートアップ CRM おすすめ」

SurferSEO の分析によると、サブクエリでランクインしたコンテンツは、メインクエリのみよりも **49%引用されやすい** という結果が出ています。

もう一つ覚えておきたいのは、**LLM はページ全体ではなくパッセージ単位でコンテンツを評価する** という事実です。SEO で1位のページでも、回答が長文に埋もれていれば AI に引用されません。

逆に、SEO ランキングが低くても、特定の段落が質問に的確に答えていれば引用される可能性があります。これは [JSON-LD 11スキーマで AI に意味を渡す実装](/ja/blog/json-ld-11-schemas-llm-understanding/) や [llms.txt と JSON-LD の最小実装](/ja/blog/llmo-minimum-implementation-llms-txt-json-ld/) で扱った話と直結しています。

### 経路3: AIエージェント検索 (即効性・1から3ヶ月)

3つ目の経路は、AIエージェントが独自に行うWeb検索です。

2025年に Microsoft が Bing Search API の外部提供を実質的に廃止したことで、独立系の検索 API は **Brave Search が事実上唯一の選択肢** になりました。

Claude、Perplexity、多くの AI コーディングアシスタントが Brave Search API を利用しています。Cursor、Claude Code、OpenClaw のいずれも、内部のWeb検索層は Brave に寄っています。

見落としやすい論点が一つあります。**Google のインデックスと Brave のインデックスは別物** だという事実です。Google で1位のページが Brave では見つからないこともあります。

私が冒頭で書いた「私のAIエージェントが Google を見ていなかった」というのは、この経路の話でした。

AI エージェント経由のトラフィックを獲得するには、Brave Search での可視性も意識する必要があります。`robots.txt` で Brave のクローラーをブロックしていないか、サイトマップが Brave のインデックスに登録されているか。これは実装の問題です。

## 3経路の優先順位

どの経路から手を付けるべきか、判断軸を整理します。

| 状況 | 優先経路 | 効果が出るまで |
|---|---|---|
| 既存コンテンツが豊富 | 経路2 (RAG最適化) | 1から3ヶ月 |
| 新規コンテンツ計画中 | 経路2 + 経路3 | 3から6ヶ月 |
| ブランド認知を高めたい | 経路1 (学習データ) | 6ヶ月から2年 |
| 技術ツール・OSS を運営 | 経路3 (エージェント検索) | 1から3ヶ月 |

最も効率的なのは、**経路2 (RAG) の最適化を起点に、経路3と経路1に波及させる** アプローチです。コンテンツ構造を改善すれば、それは全経路に効きます。

[LLMO 測定の3つの方法](/ja/blog/llmo-measurement-3-methods/) で書いた測定基盤を入れておくと、どの経路が機能しているのか追跡できます。

## なぜエンジニアがLLMOをやるべきなのか

「これはマーケターの仕事では」と思った方もいるかもしれません。違います。LLMO はエンジニアリングの問題です。

- LLM のアーキテクチャ理解
- RAG の Query Fan-out を意識したコンテンツ設計
- JSON-LD による構造化データの実装
- `llms.txt` や `robots.txt` による AI クローラー制御
- 計測パイプラインによるモニタリング自動化

これらはすべて、エンジニアのスキルセットに属する仕事です。マーケティング部門に「JSON-LD 11スキーマを設計してください」とお願いするのは、無茶です。

加えて、私たちエンジニアは LLMO の「当事者」でもあります。Claude Code で技術調査をするとき、Perplexity でライブラリを比較するとき、私たちは AI 検索のユーザーです。同時に、技術ブログや OSS ドキュメントを書くとき、AI 検索のコンテンツ提供者でもあります。

両方の立場を持つエンジニアこそが、LLMO を最もよく理解し、効果的に実践できるのです。

## Context Engineering と LLMO は表裏一体

[Context Engineering 入門の5戦略](/ja/blog/context-engineering-introduction-five-strategies/) と [CLAUDE.md = Context Engineering 凝縮](/ja/blog/claude-md-context-engineering-practice/) で扱った話と接続しておきます。

Context Engineering は、AI に「何を渡すか」を設計する技術です。LLMO は、AI が「何を見るか」を設計する技術です。

入力側の Context Engineering と、世界側の LLMO は、表裏一体です。AI に渡すコンテキストの設計だけでは、AI が世界を見る入口で自分のコンテンツが選ばれない限り、ユーザーには届きません。逆に、LLMO だけ頑張っても、AI が利用される文脈そのものが整理されていなければ、引用は短命です。

両方やる必要があります。これからのWebは、両輪設計の時代です。

## まとめ

- **AI エージェントは Google ではなく Brave Search で検索している**。SEO対策の前提が一部崩れている
- **LLM に情報が届く経路は3つ**: 学習データ (長期)、RAG (中期)、エージェント検索 (即効性)
- **SEO は死なないが、SEO だけでは負ける**。SEO の上に LLMO を積むハイブリッド戦略が必要
- **LLMO はエンジニアリングの問題**。技術的理解と実装が両方いる
- **最も効率的な起点は RAG 最適化**。コンテンツ構造を改善すれば全経路に効く
- **Context Engineering と LLMO は表裏一体**。両輪で設計する

## 次のアクション

- [ ] 自社サイトの `robots.txt` を開いて、AI クローラー (GPTBot、ClaudeBot、Bravebot) がブロックされていないか確認する
- [ ] ChatGPT か Perplexity で自社名を検索し、何が表示されるか確認する
- [ ] Brave Search で自社サイトが表示されるか確認する
- [ ] [LLMO 測定の3つの方法](/ja/blog/llmo-measurement-3-methods/) を読み、計測の仕組みを入れる

## もっと深く知る

LLMO の実装側、特に「今日から書ける llms.txt と JSON-LD 11スキーマ」を体系的に押さえたい方は、本書がおすすめです。

[LLMO クイックスタート: AI 検索時代のWeb最適化入門](https://kenimoto.dev/ja/books/llmo-quickstart)

本書は本記事の元になった第1章を含む、3経路の最適化を実装側まで落とし込んだ入門書です。第2章で今日から書ける実装、第3章で計測の仕組みを扱います。

## 関連記事

- [llms.txt と JSON-LD で実装するLLMO最小構成](/ja/blog/llmo-minimum-implementation-llms-txt-json-ld/) — 経路2/3 の最小実装
- [JSON-LD 11スキーマで AI に意味を渡す](/ja/blog/json-ld-11-schemas-llm-understanding/) — 構造化データ実装
- [LLMO 測定の3つの方法](/ja/blog/llmo-measurement-3-methods/) — 効果計測パイプライン
- [TRMケーススタディ 8337%の流入増加](/ja/blog/llmo-case-studies-trm-8337-percent/) — 実例ベースの分析
- [Microsoft 3原則: LLMが引用したくなるコンテンツ](/ja/blog/llm-content-design-microsoft-3-principles/) — コンテンツ設計指針
- [Context Engineering 入門の5戦略](/ja/blog/context-engineering-introduction-five-strategies/) — 入力側の設計
