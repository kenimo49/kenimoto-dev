---
title: "今日から実装できるLLMO — llms.txtと構造化データ入門"
---

# 第2章: 今日から実装できるLLMO: llms.txtと構造化データ入門

> **理論は十分です。ここからは手を動かしましょう。**

前章で、LLMに情報が届く3つの経路を理解しました。本章では、今日から実装できる2つの具体的なテクニックを紹介します。

1. **llms.txt**: AIに「ここが重要です」と伝えるガイダンスファイル
2. **構造化データ(JSON-LD)**: AIがコンテンツの意味を正確に理解するためのメタデータ

どちらも実装コストが低く、デメリットがゼロで、即日効果が期待できるものです。

---

## llms.txt: AIへの「コンシェルジュ」

### llms.txt とは何か

llms.txtは、Webサイトのルートパス(`yoursite.com/llms.txt`)に配置するMarkdownファイルです。LLMにサイトの目的・構造・重要コンテンツを効率的に伝える「チートシート」として機能します。

Answer.AIのJeremy Howard氏が2024年に提案した新しい標準で、急速に普及が進んでいます。

robots.txtとの違いを押さえておきましょう。

| 特徴 | robots.txt | llms.txt |
|------|-----------|----------|
| 役割 | 「何をクロールしないか」を指示 | 「何に注目すべきか」を指示 |
| 性質 | ゲートキーパー(制限) | コンシェルジュ(案内) |
| 対象 | すべてのクローラー | 主にLLM |
| 形式 | 独自テキスト形式 | Markdown |

### なぜllms.txtが必要なのか

LLMがWebサイトを利用するとき、いくつかの問題があります。

- **コンテキストウィンドウの制約**: LLMが一度に処理できるテキスト量には限界がある
- **HTMLのノイズ**: ナビゲーション、広告、JavaScriptなどコンテンツ以外の要素が多い
- **重要ページの特定が困難**: サイトマップには全ページが並ぶが、どれが重要かわからない

llms.txtは、サイト運営者自身が「うちのサイトで重要なのはこれです」とキュレーションすることで、これらの問題を解決します。

### 実装手順(所要時間: 15分)

**ステップ1: ファイルの基本構造を作る**

```markdown
# サイト名

> サイトの目的と主要コンテンツの説明(1〜2文)

## 人気記事

- [記事タイトル](URL): 簡潔な説明
- [記事タイトル](URL): 簡潔な説明

## ドキュメント

- [ページタイトル](URL): 簡潔な説明

## Optional

- [補足リソース](URL): コンテキストに余裕がある場合に参照
```

必須要素は2つだけです。
- **H1タイトル**: `# サイト名`(1つだけ)
- **ブロッククオートサマリー**: `> サイトの説明`(1〜2文)

**ステップ2: 重要ページを10〜20件選ぶ**

すべてのページを列挙する必要はありません。AIに「特に読んでほしいページ」を厳選します。アクセス数が多い記事、独自データを含む記事、FAQなどが候補です。

**ステップ3: サイトルートに配置する**

作成したファイルを `yoursite.com/llms.txt` として配置します。

- エンコーディング: UTF-8
- MIMEタイプ: text/plain
- HTTPS必須
- 推奨サイズ: 10KB以下

**具体例: 技術ブログの場合**

```markdown
# Tech Blog — 田中太郎

> フルスタックエンジニアの技術ブログ。Next.js、TypeScript、
> AI/MLに関する実践的な記事を週1回公開しています。

## 人気記事

- [Next.js App Router完全ガイド](https://example.com/blog/nextjs-app-router): App Routerの設計パターンとベストプラクティス
- [Docker ComposeからKubernetesへの移行](https://example.com/blog/docker-to-k8s): ステップバイステップの移行手順

## チュートリアル

- [JSON-LD実装ガイド](https://example.com/blog/jsonld-guide): AI検索最適化のための構造化データ実装

## 著者について

- [プロフィール](https://example.com/about): 経歴、スキル、連絡先
```

### llms.txtの効果に関する現実的な期待値

正直にお伝えすると、llms.txtの効果についてはまだ議論があります。Googleのジョン・ミュラー氏は「どのAIサービスもllms.txtを使用しているとは言っていない」と発言しています。

しかし、私の見解は明確です。

- 実装コストが極めて低い(15分)
- デメリットがゼロ(既存のSEOに影響しない)
- AI検索の進化に伴い重要度が増す可能性が高い
- 早期採用者のアドバンテージがある

保険に似ています。火事が起きてから火災保険に入ることはできません。llms.txtも、AI検索が本格化してから慌てて設置するより、今のうちに仕込んでおく方が賢明です。 **やらない理由がほとんどない** のであれば、実装すべきです。

---

## 構造化データ(JSON-LD): AIにコンテンツの「意味」を伝える

### 構造化データとは何か

構造化データとは、HTMLにメタデータを埋め込んで、機械がコンテンツの意味を理解できるようにする仕組みです。schema.orgというボキャブラリーに基づいたJSON-LD形式で実装します。

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

このコードをHTMLの`<head>`に配置するだけです。

### なぜJSON-LDがAI検索に効くのか

SEOの世界では「構造化データを入れてもランキングに直接影響しない」と言われてきました。しかしAI検索では話が変わります。

最大の理由は、**Brave LLM Context APIがJSON-LDを優先的に抽出する** ことが公式に確認されているからです。

Braveの検索APIがページからデータを抽出する際の優先順位は以下の通りです。

1. **構造化データ(JSON-LD)** ← 最優先
2. テーブルデータ
3. クエリ最適化スニペット
4. コードブロック
5. フォーラム議論

つまり、JSON-LDを実装しているページは、AIの回答生成に使われるデータとして優先的に選ばれるのです。

SurferSEOの分析では、適切なスキーマ実装でPerplexityでの可視性が最大 **10%向上** するデータが報告されています。

### 今すぐ実装すべき3つのスキーマタイプ

schema.orgには800以上のタイプがありますが、まず押さえるべきは3つだけです。

#### 1. Article / TechArticle(ブログ記事に必須)

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

**ポイント:**
- `dateModified`は最重要フィールドです。LLMは新鮮なコンテンツを優先します(Perplexityでは新鮮さが約40%のランキング要因)
- `author`にはURLとjobTitleを含めて専門性をアピールしましょう

#### 2. FAQPage(Q&Aコンテンツに最適)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "LLMOとSEOの違いは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEOは検索エンジンでのランキング向上を目的としますが、LLMOはAI生成回答での引用・可視性向上を目的とします。"
      }
    }
  ]
}
</script>
```

**ポイント:**
- 各回答は2〜3文で完結させましょう。AIが「抜き出してそのまま使える」自己完結的な文にします
- FAQスキーマは実際にFAQコンテンツがあるページにのみ使ってください

#### 3. HowTo(チュートリアル記事に最適)

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

### フレームワーク別の実装例

#### Next.js(App Router)

```tsx
// app/blog/[slug]/page.tsx
function JsonLd({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

#### 静的HTML

```html
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "LLMO実装ガイド",
    "author": { "@type": "Person", "name": "田中太郎" },
    "datePublished": "2026-02-01",
    "dateModified": "2026-02-20"
  }
  </script>
</head>
```

### 重要な注意点: サーバーサイドレンダリング必須

ここでよくあるミスをお伝えします。AIクローラーの多くは **JavaScriptを実行しません**。そのため、クライアントサイドJavaScriptでJSON-LDを動的に挿入する方式は避けてください。せっかくJSON-LDを書いても、AIには見えていないことになります。必ずサーバーサイドレンダリング(SSR)またはビルド時に生成しましょう。

```tsx
// ❌ NG: クライアントサイドで注入
useEffect(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}, [])

// ✅ OK: サーバーコンポーネントで直接出力
export default function Page() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

---

## robots.txt でAIクローラーを歓迎する

llms.txtとJSON-LDに加えて、もう一つ確認すべきファイルがあります。`robots.txt`です。意外と見落とされますが、ここでAIクローラーをブロックしていると、他の施策が全て無駄になります。

AIクローラーのリクエスト数は **Googlebotの20%** に相当するまで成長しています。robots.txtでAIクローラーをブロックしてしまうと、AI回答から完全に消えてしまいます。

### 推奨設定

```
# robots.txt: AI検索最適化重視

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

有料コンテンツがある場合は、公開コンテンツのみ許可する「選択的許可」も可能です。

---

## コンテンツ構造のベストプラクティス

llms.txt、JSON-LD、robots.txtを設定したら、コンテンツ自体の構造も見直しましょう。AIに引用されやすいコンテンツには共通パターンがあります。

### 見出しを質問形式にする

```markdown
<!-- ❌ 曖昧な見出し -->
## まとめ
## 詳しくはこちら

<!-- ✅ 具体的な見出し -->
## llms.txtの設置に必要な3つのステップ
## JSON-LDはAI検索にどう影響するのか
```

AIは見出しをセクションの要約として利用します。見出しが質問形式なら、AIがQ&Aとして引用しやすくなります。

### 各セクションを自己完結的にする

```markdown
<!-- ❌ 文脈依存 -->
前述の通り、これは非常に重要です。

<!-- ✅ 自己完結 -->
llms.txtはWebサイトのルートに配置するMarkdownファイルで、
LLMにサイトの重要コンテンツを構造的に伝えるための標準規格です。
```

LLMはページ全体ではなくパッセージ単位で引用します。各段落が「抜き出してもそのまま回答として使える」形にしましょう。

### ファクト密度を上げる

GEO論文によると、統計データの追加でAI引用率が **+115.1%向上** します。

```markdown
<!-- ❌ 曖昧 -->
LLMOは効果的です。

<!-- ✅ 具体的 -->
SurferSEOの分析によると、適切なスキーマ実装で
Perplexityでの可視性が最大10%向上します。
```

「便利」「すごい」ではなく、具体的な数値とデータソースを示しましょう。

---

## 今日やることチェックリスト

- [ ] `llms.txt`を作成してサイトルートに配置する(15分)
- [ ] 主要記事にArticle/TechArticleのJSON-LDを追加する(30分)
- [ ] FAQコンテンツがあるページにFAQPageスキーマを追加する
- [ ] `robots.txt`でAIクローラー(GPTBot、ClaudeBot等)が許可されているか確認する
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)でJSON-LDをバリデーションする

これだけで、AI検索での可視性が大きく変わります。**所要時間は合計1時間程度です。**


