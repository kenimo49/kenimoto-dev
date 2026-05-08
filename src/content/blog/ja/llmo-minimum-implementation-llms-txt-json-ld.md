---
title: "15分で終わるLLMO最小実装: llms.txt + JSON-LDで「AIに見つけられる土台」を作る"
description: "「LLMOで90日8,337%増」を読んで奮い立った私が、まず90分間ボーッとした話。実装は15分で済むのに。llms.txtと構造化データ(JSON-LD)で、AIに見つけられる最小実装を組む。コピペで動くコード付き。"
date: 2026-05-05
lang: ja
tags: [llmo, ai-search, llms-txt, json-ld, geo]
featured: false
og_image: "https://kenimoto.dev/images/blog/llmo-minimum-implementation-llms-txt-json-ld/og.png"
canonical_url: "https://kenimoto.dev/ja/blog/llmo-minimum-implementation-llms-txt-json-ld/"
---

「LLMOで90日8,337%増」を読んで奮い立った私が、まず90分間ボーッとした話を聞いてください。実装は15分で済むのに、私は「何から始めるべきか」を考え続けていました。

結論から書きます。土台に必要なのは2つだけです。 **llms.txt** と **JSON-LD**。どちらもファイルを置くだけで終わります。難しい設計判断はゼロ、デプロイパイプラインも変えません。早ければ15分、遅くても1時間です。

この記事は、すでに [Microsoftの3原則](https://kenimoto.dev/ja/blog/llm-content-design-microsoft-3-principles)(原理)と [TRMの8,337%事例](https://kenimoto.dev/ja/blog/llmo-case-studies-trm-8337-percent)(事例)を読んだ方の「で、明日から何書けばいいの」に答える3記事目です。

## 結論: 土台は「2つのファイル」で組める

先に全体像を見てください。

![llms.txtとJSON-LDの2本柱](/images/blog/llmo-minimum-implementation-llms-txt-json-ld/two-pillars.png)

| ファイル | 役割 | 配置先 | 所要時間 |
|---------|------|--------|---------|
| `llms.txt` | AIへの「コンシェルジュ」(サイト案内) | サイトルート | 5分 |
| JSON-LD `<script>` | AIへの「メタデータ」(意味の伝達) | 各ページの`<head>` | 10分 |

この2つだけで、AI検索クローラーが「あなたのサイトは何者で」「この記事は何の記事で」を理解する土台ができます。残りの「コンテンツの質」「権威性」「鮮度」は別の話。土台がないと、いくら良い記事を書いてもAIは見つけられません。

## llms.txt: AIに「ここを読んで」と渡す案内状

### llms.txtとは

llms.txtは、サイトのルートパス(`yoursite.com/llms.txt`)に置くMarkdownファイルです。Answer.AIのJeremy Howard氏が2024年に提案した規格で、2026年5月時点で **約10.13% の普及率** に達しています([SE Rankingの約30万ドメイン分析](https://seranking.com/blog/llms-txt/))。

robots.txtとの関係はこうなります。

| 観点 | robots.txt | llms.txt |
|------|-----------|----------|
| 役割 | 「ここに入るな」 | 「ここを読んで」 |
| 性格 | ゲートキーパー | コンシェルジュ |
| 対象 | 全クローラー | 主にAI |
| 形式 | 独自テキスト | Markdown |

llms.txtは「AIへのコンシェルジュ」、robots.txtは「AIへのゲートキーパー」。違いを覚えるより、両方置けばいい話です。

[llms.txtのディレクトリ](https://directory.llmstxt.cloud/) を見にいくと、Anthropic、Cloudflare、Vercel、Stripe、Supabase、Cursor、Mintlifyといった、AI周辺で意思決定している企業が軒並み採用しています。採用率は中・低トラフィックのサイトの方が高い、というのが面白いところです。

### 5分で書くllms.txt

最小構成は、 **H1のサイト名と、ブロッククオートのサマリー** だけです。残りは任意。

```markdown
# サイト名

> サイトの目的と主要コンテンツの説明(1〜2文)

## 人気記事

- [記事タイトル](URL): 簡潔な説明
- [記事タイトル](URL): 簡潔な説明

## ドキュメント

- [ページタイトル](URL): 簡潔な説明

## Optional

- [補足リソース](URL): 余裕があれば
```

ポイントは2つだけです。

**1. すべてのページを書かない。** sitemap.xmlがその役割です。llms.txtは「特に読んでほしいページを10〜20件」厳選します。アクセス数の多い記事、独自データを含む記事、FAQ、自己紹介ページ。

**2. `## Optional`セクションを使う。** 「コンテキストウィンドウに余裕があれば読んでほしい」というメタな指示が出せます。AIに自己申告で優先順位を渡すという、ちょっとSF味のある仕組みです。

### コピペで動く例

技術ブログの場合の例です。`public/llms.txt` に置けば動きます(Astro/Next.jsの場合)。

```markdown
# 田中太郎 / エンジニアリングブログ

> フルスタックエンジニアの技術ブログ。Next.js、TypeScript、AIに関する
> 実践的な記事を週1回公開しています。

## 人気記事

- [Next.js App Router完全ガイド](https://example.com/blog/nextjs-app-router): App Routerの設計パターン
- [Docker ComposeからKubernetesへの移行](https://example.com/blog/docker-to-k8s): 段階的移行手順

## チュートリアル

- [JSON-LD実装ガイド](https://example.com/blog/jsonld-guide): AI検索最適化のための構造化データ実装
```

配置時の注意点: UTF-8、MIMEタイプ text/plain、HTTPS必須、推奨10KB以下。

### 「llms.txtは効くのか」問題への答え

正直に書きます。llms.txtの効果については **まだ議論があります**。Googleのジョン・ミュラー氏は「どのAIサービスもllms.txtを使用しているとは言っていない」と発言していますし、9サイトを比較した研究で8サイトが効果を測定できなかった、という結果もあります。

それでも私は置きます。実装コスト15分、デメリットはゼロ(既存SEOに影響しない)、早期採用者のアドバンテージはある可能性。火事が起きてから火災保険には入れません。15分で済む保険なら、入っておいて損はない話です。

## JSON-LD: AIに「この記事は何か」を伝える

### 構造化データとは

JSON-LDは、HTMLにメタデータを埋め込んで、機械がコンテンツの意味を理解できるようにする仕組みです。schema.orgというボキャブラリーに基づきます。

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "LLMOの完全ガイド",
  "author": {
    "@type": "Person",
    "name": "田中太郎"
  },
  "datePublished": "2026-02-01",
  "dateModified": "2026-02-20"
}
</script>
```

このコードを各記事ページの`<head>`に配置するだけです。

### なぜJSON-LDがAI検索に効くのか

SEOの世界では「構造化データを入れてもランキングに直接影響しない」と長年言われてきました。AI検索では話が変わります。

決定的な根拠が一つあります。 **Brave LLM Context API** がページからデータを抽出する際、JSON-LDを最優先で読み取ることが [公式に明文化されています](https://api-dashboard.search.brave.com/api-reference/summarizer/llm_context/get)。Brave Searchは1日2,200万件以上のAI回答を生成しており、Tavily、Exa、Perplexityと並ぶ主要LLM検索APIの一つです。

抽出時の優先順位は次の通りです。

1. **構造化データ(JSON-LD)** ← 最優先
2. テーブルデータ
3. クエリ最適化スニペット
4. コードブロック
5. フォーラム議論

JSON-LDを実装しているページは、AIの回答生成に使われるデータとして優先的に選ばれます。SurferSEOの分析では、適切なスキーマ実装でPerplexityでの可視性が **最大10%向上** という数値も報告されています。

### 入れるべき3つのスキーマ

schema.orgには800以上のタイプがありますが、現実的に効くのは3つです。

#### 1. Article / TechArticle (ブログ記事に必須)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Next.jsでJSON-LDを実装する方法",
  "author": {
    "@type": "Person",
    "name": "田中太郎",
    "url": "https://example.com/about",
    "jobTitle": "シニアフロントエンドエンジニア"
  },
  "datePublished": "2026-01-15T09:00:00+09:00",
  "dateModified": "2026-02-20T14:30:00+09:00",
  "description": "AI検索での可視性を高めるJSON-LD実装方法を解説",
  "keywords": ["Next.js", "JSON-LD", "LLMO"]
}
</script>
```

ここで一番重要なのは `dateModified` です。LLMは新鮮なコンテンツを優先します。Perplexityでは新鮮さが約40%のランキング要因という分析もあります。記事を更新したら必ず `dateModified` も更新する。これだけで他サイトと差がつきます。

`author` にURLとjobTitleを書くのも忘れずに。E-E-A-Tの「専門性」シグナルとして機能します。

#### 2. FAQPage (Q&Aコンテンツ)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "LLMOとSEOの違いは何ですか?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEOは検索エンジンでのランキング向上を目的としますが、LLMOはAI生成回答での引用・可視性向上を目的とします。"
      }
    }
  ]
}
</script>
```

回答は2〜3文で完結させてください。AIが「抜き出してそのまま使える」自己完結的な文にする必要があります。LLMOにおける引用は、ページ単位ではなく **段落単位** で発生するからです。

注意点として、FAQスキーマは **実際にFAQコンテンツがあるページにのみ** 使ってください。空のFAQスキーマを置くとペナルティ対象になります。

#### 3. HowTo (チュートリアル記事)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "llms.txtの設置方法",
  "totalTime": "PT15M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "llms.txtファイルを作成",
      "text": "Markdown形式でllms.txtファイルを作成します。"
    },
    {
      "@type": "HowToStep",
      "name": "サイトルートに配置",
      "text": "yoursite.com/llms.txt として配置します。"
    }
  ]
}
</script>
```

「〜のやり方」「〜の手順」というクエリでAI回答に出やすくなります。`totalTime` はISO 8601形式(`PT15M` = 15分)で書きます。

### 一番ハマるポイント: SSR必須

これは一度ハマると半日溶けます。

**AIクローラーの多くはJavaScriptを実行しません**。クライアントサイドJSでJSON-LDを動的挿入する方式は、AIには「ない」と扱われます。

```tsx
// NG: クライアントサイドで注入される
useEffect(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}, [])

// OK: サーバーコンポーネントで直接出力
export default function Page() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

私はこのミスでJSON-LDを2週間「実装したつもり」になっていました。Google Rich Results Testで赤いバツが出たのを見て、ようやく気づきました。

## robots.txtの確認も忘れずに

llms.txtとJSON-LDを完璧に実装しても、 **robots.txtでAIクローラーをブロックしていたら** すべて無駄になります。これも意外と見落とされがちな話です。

AIクローラーのリクエスト数は、すでにGooglebotの約20%に相当する規模になっています。最低限、次の設定を確認してください。

```text
# AI検索最適化重視

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# 管理画面は除外
User-agent: *
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml
```

「うちはAIに学習されたくない」という考え方も尊重します。ただ、 **AI回答に出てこなくなる** という意味でもあります。両方は両立しません。

## 15分実装タイムライン

整理します。新しい知識ゼロからでも、次の順番で進めれば15分で終わります。

![15分実装タイムライン](/images/blog/llmo-minimum-implementation-llms-txt-json-ld/15min-timeline.png)

| 経過時間 | やること |
|---------|---------|
| 0-5分 | `llms.txt` を書いてサイトルートに配置 |
| 5-10分 | トップ記事1本にArticle/TechArticleのJSON-LDを追加 |
| 10-13分 | robots.txtでAIクローラー(GPTBot、ClaudeBotなど)が許可されているか確認 |
| 13-15分 | [Google Rich Results Test](https://search.google.com/test/rich-results) でJSON-LDをバリデーション |

これで最小実装は完成です。残りの記事への展開、FAQページへのFAQPageスキーマ追加、HowTo記事への追加は、暇な日に少しずつやれば十分です。

## ここから先のステップ

llms.txt + JSON-LDは「LLMOの土台」であって、LLMO全体ではありません。本格的にやるなら、次の3軸を並行して動かすことになります。

1. **コンテンツ設計**(原理): [Microsoftの3原則](https://kenimoto.dev/ja/blog/llm-content-design-microsoft-3-principles)。構造・明確さ・スニッパビリティ。
2. **配信戦略**(事例): [TRMの90日8,337%増](https://kenimoto.dev/ja/blog/llmo-case-studies-trm-8337-percent)。4戦略柱の分解。
3. **効果測定**: ChatGPT流入、Perplexity経由のリファラ追跡、引用カウント。

この全体像のフレームワークは [llmoframework.com](https://llmoframework.com) に体系化されています。「土台ができたら次は何を最適化すべきか」を考えるときの地図として使ってください。

## 締め

15分で土台ができたら、次の14日と23時間45分で何書くか考えましょう。土台がない状態でいい記事を書いても、AIには「存在しないサイト」のままです。逆に、土台さえあれば、書いた記事は確実にAIの目に入る場所には届きます。

LLMOの一番つまらない真実は、こういうことです。 **派手な施策の前に、地味な土台を15分で作るのが一番効く。** 私はそれに気づくのに90分かかりました。あなたはこの記事を読み終えた瞬間から始められます。

## 参考

- [Brave LLM Context API ドキュメント](https://api-dashboard.search.brave.com/api-reference/summarizer/llm_context/get): JSON-LD優先抽出の公式仕様
- [llms.txt directory](https://directory.llmstxt.cloud/): 採用済みサイトの一覧
- [llms.txt 規格(Answer.AI)](https://llmstxt.org/): Jeremy Howard氏のオリジナル提案
- [llmoframework.com](https://llmoframework.com): LLMO全体フレームワーク
- [Google Rich Results Test](https://search.google.com/test/rich-results): JSON-LDのバリデーション

---

## さらに深掘りしたい方へ

LLMO を30分で始めたい方は、核心を8章で凝縮したコピペで使えるテンプレ集 **[LLMOクイックスタート — エンジニアのためのAI検索最適化入門](https://kenimoto.dev/ja/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=llmo-minimum-implementation-llms-txt-json-ld)** が最短ルートです。
