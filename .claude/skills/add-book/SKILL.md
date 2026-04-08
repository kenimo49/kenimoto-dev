---
name: add-book
description: kenimoto.devに新しい書籍を追加する。Kindle URL・タイトル・カテゴリを受け取り、publications.md、ja.astro、index.astro、llms.txtを一括更新する。
---

# Add Book Skill

kenimoto.devに新しい書籍エントリを追加する。

## 入力情報の確認

ユーザーから以下を確認する（不明な場合は質問する）:

| 項目 | 必須 | 例 |
|------|------|-----|
| 日本語タイトル | Yes | AIコードレビューを仕組み化する技術 |
| サブタイトル | Yes | レビュー時間60%削減の3層モデル |
| Kindle JP URL | Yes | https://amzn.asia/d/0hgvOnOi |
| カテゴリ | Yes | AI開発 / LLMO / セキュリティ・品質 |
| 英語版の有無 | Yes | あり/なし |
| 英語タイトル | 英語版ありの場合 | AI Code Review Engineering |
| Kindle EN URL | 英語版ありの場合 | - |
| Zenn URL | あれば | https://zenn.dev/kenimo49/books/xxx |
| Zenn価格 | Zennありの場合 | ¥1,000 / Free |
| Topics/Keywords | Yes | AI Code Review, 3-Layer Model |
| カバー画像パス | Yes | sns-operations内のパスを確認 |

## カテゴリとマッピング

| カテゴリ | publications.mdセクション | index.astro色 | ja.astro色 |
|---------|------------------------|--------------|-----------|
| AI開発 | `## Books — AI Development Series` | `#60a5fa`(青) | `#60a5fa`(青) |
| LLMO | `## Books — LLMO / AI Search Optimization Series` | `#f59e0b`(黄) | `#f59e0b`(黄) |
| セキュリティ・品質 | `## Books — Security & Quality Series` | `#10b981`(緑) | `#10b981`(緑) |

## 編集対象ファイル

### 1. `public/ai/publications.md` — 常に編集

該当カテゴリセクションの**先頭**にエントリを追加:

```markdown
### [日本語タイトル] — [サブタイトル]
- Topics: [keyword1], [keyword2], ...
- Kindle JP: [URL]
- Kindle EN: [URL]  ← 英語版ありの場合のみ
- Zenn: [URL] ([価格])  ← Zennありの場合のみ
```

### 2. `src/pages/ja.astro` — 常に編集

#### JSON-LD（`<script type="application/ld+json">` 内の配列先頭に追加）

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "[日本語タイトル] — [サブタイトル]",
  "author": { "@type": "Person", "name": "井本 賢" },
  "bookFormat": "EBook",
  "inLanguage": "ja",
  "url": "[Kindle JP URL]",
  "about": ["キーワード1", "キーワード2"]
}
```

#### Book Card（該当カテゴリのgrid先頭に追加）

新刊には `border: 1px solid #60a5fa;` と NEWタグを付与。**既存のNEWタグは削除**する。

```html
<div class="book-card" style="background: #1e293b; border-radius: 8px; padding: 1rem; display: flex; gap: 0.75rem; border: 1px solid #60a5fa;">
  <img src="/images/books/[slug].png" alt="[タイトル]" style="width: 60px; height: auto; border-radius: 4px; flex-shrink: 0;" />
  <div style="flex: 1;">
    <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem;">[タイトル] <span style="font-size: 0.65rem; color: #60a5fa; font-weight: 400;">NEW</span></p>
    <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem;">[サブタイトル]</p>
    <div style="display: flex; gap: 0.75rem; font-size: 0.75rem;">
      <a href="[Kindle JP URL]">Kindle</a>
      <!-- Zennありの場合 -->
      <a href="[Zenn URL]">Zenn ([価格])</a>
    </div>
  </div>
</div>
```

#### 冊数カウント更新

`Kindle N冊` の数字を +1 する。

### 3. `src/pages/index.astro` — 英語版ありの場合のみ編集

日本語のみの書籍は**英語版サイトには追加しない**。

英語版ありの場合:
- JSON-LD配列先頭にBookオブジェクト追加（`inLanguage: ["ja", "en"]`）
- Book Card追加（英語タイトル・サブタイトルを使用）
- `N Kindle Books` の数字を +1
- NEWタグを新刊に移動、既存NEWを削除

### 4. `public/llms.txt` — 常に編集

該当セクションにエントリを追加し、**全番号をリナンバリング**:

```
N. [タイトル] — [サブタイトル]
   - Kindle JP: [URL]
   - Kindle EN: [URL]  ← 英語版ありの場合のみ
   - Zenn: [URL]  ← Zennありの場合のみ
```

### 5. カバー画像 — 常にコピー

sns-operationsからカバー画像を探してコピー:

```
検索パス: /home/iris/repos/sns-operations/accounts/kenimo49-kindle/books/[slug]/cover-zenn.png
コピー先: /home/iris/repos/kenimoto-dev/public/images/books/[slug].png
```

見つからない場合は `books-common/covers/[slug]/` も確認。

## NEWタグのルール

- 新刊に `NEW` タグを付与
- 同じカテゴリ内の既存NEWタグは削除
- NEWタグ付きのbook-cardには `border: 1px solid #60a5fa;` を追加
- NEWタグを外したbook-cardからは border を削除

## チェックリスト

編集完了後に確認:

- [ ] publications.md にエントリ追加済み
- [ ] ja.astro にJSON-LD追加済み
- [ ] ja.astro にbook card追加済み
- [ ] ja.astro の冊数更新済み
- [ ] 英語版あり → index.astro にも追加済み
- [ ] 英語版なし → index.astro は未編集
- [ ] llms.txt にエントリ追加・番号リナンバリング済み
- [ ] カバー画像コピー済み
- [ ] NEWタグが新刊のみに付与されている
- [ ] 既存NEWタグのborderが削除されている
