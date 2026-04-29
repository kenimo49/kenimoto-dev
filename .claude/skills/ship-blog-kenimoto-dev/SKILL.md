---
name: ship-blog-kenimoto-dev
description: kenimoto.devエンジニアブログの記事作成オーケストレーション。ネタ探索→構成→執筆→品質チェック→公開→クロスポスト連携の7フェーズ対話フロー。EN/JAバイリンガル対応。
argument-hint: [--lang en|ja|both] [--theme "テーマ"] [--draft path] [--source qiita-path|devto-path] [--publish]
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, WebSearch, WebFetch
---

# /ship-blog-kenimoto-dev — kenimoto.dev エンジニアブログ記事オーケストレーション

kenimoto.dev ブログ記事を **ネタ探索 → 構成提案 → 執筆 → 品質チェック → 公開 → クロスポスト連携 → 記録** まで一本の対話フローで流すスキル。

kenimoto.dev をcanonicalハブとし、Qiita/Dev.to/Zennへのクロスポスト戦略を前提とする。

## 全体像

```
Phase 1: ネタ探索     → context-forge / Zenn Book章 / 直近の作業
Phase 2: 構成提案     → アウトラインをユーザーと合意
Phase 3: 執筆         → 合意アウトラインに沿って初稿作成
Phase 4: 品質チェック → AI Slop + コード検証 + 読みやすさ
Phase 5: 公開         → git push でデプロイ
Phase 6: クロスポスト → 難易度調整してQiita/Dev.to/Zennに展開
Phase 7: 記録         → カレンダー + 活動ログ
```

各Phase末尾で **チェックポイント** を設ける。飛ばさない。

## 引数モード

| 引数 | 動作 |
|---|---|
| 引数なし | Phase 1 から対話モード |
| `--lang en` | 英語記事のみ作成 |
| `--lang ja` | 日本語記事のみ作成 |
| `--lang both` | EN/JA両方を作成（デフォルト） |
| `--theme "..."` | Phase 1 の絞り込みキーワード |
| `--draft <path>` | Phase 3 から開始（既存下書きを使う） |
| `--source <path>` | 既存Qiita/Dev.to記事をkenimoto.dev用に変換 |
| `--publish` | Phase 5 で自動push（確認をスキップ） |

## 前提

- ブログリポジトリ: `~/repos/kenimoto-dev/`
- 記事格納先: `src/content/blog/{en,ja}/{slug}.md`
- Content Collections スキーマ: `src/content.config.ts`
- ペルソナ: `~/repos/sns-operations/accounts/kenimo49-x/strategy.md` の発信軸を参照
- 品質チェック: `~/repos/sns-operations/.claude/skills/avoid-ai-writing-{en,ja}/SKILL.md`
- context-forge: `~/repos/context-forge/`（ネタDB）
- Zenn Books: `~/repos/zenn-content/books/`（知見ストック）
- 環境変数: `.env` の `GA4_PROPERTY_ID` 等

---

## Phase 1: ネタ探索

**目的**: kenimoto.dev の発信軸に合う記事候補を3-5件生成する。

### 発信軸（strategy.md準拠）

- **メイン**: AIエージェント設計、Claude Code実践、Context Engineering
- **サブ1**: LLMO / AI Search Optimization
- **サブ2**: ハーネスエンジニアリング

### 3つのソースから並行収集

#### ソース1: context-forge（知見DB）

```bash
cd ~/repos/context-forge
python3 tools/db/manager.py search "<テーマ>"
```

`--theme` があればそのテーマで検索。なければ未使用の高credibility知見を取得。

#### ソース2: Zenn Book の章（30冊+の知見ストック）

```bash
for dir in ~/repos/zenn-content/books/*/; do
  slug=$(basename "$dir")
  echo "=== $slug ==="
  grep "^title:" "${dir}config.yaml" 2>/dev/null | head -1
  grep "^title:" "${dir}"ch*.md 2>/dev/null | sed 's/.*title: */  /'
done
```

特に有力な本:
- `claude-code-mastery` — Claude Code実践Tips
- `context-engineering` — Context Engineering実践
- `harness-engineering-guide` — ハーネスエンジニアリング
- `x-branding-strategy-for-engineers` — X運用の知見

章の内容をReadして「この章の一番の発見は何か」を1文に凝縮する。それが記事の核になる。

#### ソース3: 直近の作業・発見

- `~/repos/iris-hub/memory/` の最新活動ログ
- 進行中のプロジェクト
- 最近のcontext-forge登録

### 候補の統合

3つのソースから集めた候補を以下の基準で優先度付け:
- 発信軸との適合度
- フックの強さ（数字・逆説・体験が含まれるか）
- 鮮度（最近の発見・トレンドに関連するか）
- 過去の記事との重複なし

### チェックポイント 1

3-5件の候補を提示。ユーザーが1件を選択。

---

## Phase 2: 構成提案

**目的**: 記事のアウトラインをユーザーと合意する。

### アウトラインのフォーマット

```markdown
# タイトル案

## フック（冒頭1-2文）
[読者の注意を引く導入]

## セクション構成
1. [セクション名] — [1文で内容説明]（見出し2）
2. [セクション名] — [1文で内容説明]（見出し2）
3. [セクション名] — [1文で内容説明]（見出し2）
4. [セクション名] — [1文で内容説明]（見出し2）

## 締め
[読者が持ち帰れる1つのメッセージ]

## メタ情報
- 想定文字数: EN 1,000-2,500 words / JA 2,000-5,000字
- タグ: [3-5個]
- featured: true/false
```

### 構成ルール

- セクション数: 3-5（多すぎると散漫、少なすぎると薄い）
- 各セクションに最低1つのコードブロック or 図解 or 具体例
- フックは5つの型から選ぶ:
  1. **「馬鹿だった」構文**: 「〇〇を知らずに3年間△△してた」
  2. **Before/After**: 「導入前と後で〇〇が1/3に」
  3. **数字フック**: 「8年やって気づいた3つのこと」
  4. **逆説**: 「AIを増やすほど性能が下がった話」
  5. **体験ベース一次情報**: 「実際に検証してみた」

### `--lang both` の場合

- まずメイン言語のアウトラインを確定
- もう一方の言語は同じ構成で、難易度・表現を調整する方針を提示
- 完全な逐語翻訳ではなく、読者層に合わせた調整を行う

### チェックポイント 2

アウトラインを提示。ユーザーが承認 or 修正指示。

---

## Phase 3: 執筆

**目的**: 合意アウトラインに沿って記事を作成する。

### 執筆前の必読ファイル

1. `~/repos/sns-operations/persona.yaml` — 人格・文体
2. `~/repos/sns-operations/writing-tips.md` — 執筆Tips（あれば）

### frontmatter テンプレート

```yaml
---
title: "記事タイトル"
description: "1-2文の概要。SEO・OGP用"
date: YYYY-MM-DD
lang: en  # or ja
tags: [tag1, tag2, tag3]
featured: false
canonical_url: "https://kenimoto.dev/blog/{slug}"  # or /ja/blog/{slug}
cross_posted_to: []  # Phase 6 で追記
---
```

### 文体ルール

#### 日本語記事
- 一人称は **「私」**（kenimo49名義の記事共通ルール）
- ですます調ベース、体験部分はだ・である調もOK
- 1文40字以内を目安、段落5文以内
- 専門用語は初出時に1行説明

#### 英語記事
- First person "I"、conversational tone
- Short paragraphs (3-5 sentences)
- Active voice preferred
- Code comments in English

### Wit（人間味）のルール

記事には最低3箇所のWit要素を入れる。AIが書いた「正しいが退屈な文章」を防ぐ最重要ルール。

| Wit の型 | 説明 | 例 |
|---------|------|-----|
| **自嘲** | 自分の失敗を笑える形で書く | 「この設計図を描いた時点では天才だと思っていた」 |
| **deflation** | 壮大な話の直後にツッコミを入れる | 「完全自律型AIパイプライン。6回壊れた。」 |
| **予想外のメタファー** | 技術を日常に例える | 「宿題を自分で採点して100点をつける小学生」 |
| **数字の対比** | 落差で笑わせる | 「プロンプト最適化に3時間。キッチン点検に0分。」 |

**執筆時の手順**:
1. まず内容を書き切る（Wit なしでOK）
2. 以下の3箇所に Wit を追加する:
   - **冒頭近く**: 読者の警戒を解く自嘲
   - **中盤の転換点**: 大きな失敗や発見の直後に deflation
   - **締め近く**: 自分がオチになる一文
3. Wit は1文で完結させる。説明しない。笑いの解説は笑いを殺す

**禁止パターン**:
- 全体がふざけたトーンになる（Witは真面目な文章の中に点で入れる）
- 他人を揶揄する（自嘲のみ。読者や他のエンジニアを笑わない）
- 「（笑）」「w」の多用（文章で笑わせる。記号に頼らない）

### コードブロックのルール

- 必ず言語指定子を付ける（```python, ```yaml 等）
- コメントで何をしているか説明
- 動作するコードを心がける（擬似コードの場合は明記）
- 長すぎるコードは省略して要点のみ

### 文字数の目安

| 言語 | 最小 | 推奨 | 最大 |
|------|------|------|------|
| EN | 800 words | 1,500 words | 2,500 words |
| JA | 1,500字 | 3,000字 | 5,000字 |

### 出力先

```
~/repos/kenimoto-dev/src/content/blog/en/{slug}.md  # 英語
~/repos/kenimoto-dev/src/content/blog/ja/{slug}.md  # 日本語
```

### `--source` モード（既存記事の変換）

Qiita/Dev.to/Zennの既存記事をkenimoto.dev用に変換する場合:
1. 元記事をReadで読み込む
2. frontmatterをkenimoto.devスキーマに変換
3. 内容は難易度調整・加筆（単純コピーではない）
4. canonical_url は kenimoto.dev のURLに設定

### チェックポイント 3

初稿を提示。ユーザーが承認 or 修正指示。

---

## Phase 4: 品質チェック

**目的**: 公開前の品質保証。

### 4.1 AI Slop チェック

言語に応じて該当スキルを実行:

- **日本語**: `/avoid-ai-writing-ja` を実行
- **英語**: `/avoid-ai-writing-en` を実行

Tier 1 語彙が1つでもあれば修正必須。Tier 2 は2個以上で修正。

### 4.2 コードブロック検証

- [ ] 全コードブロックに言語指定子があるか
- [ ] コード内のコメントが正確か
- [ ] インデントが統一されているか
- [ ] コピーして実行可能か（擬似コードは明記されているか）

### 4.3 読みやすさチェック

| 項目 | 閾値 |
|------|------|
| JA: 1文の長さ | 40字以内（目安） |
| JA: 段落の文数 | 5文以内 |
| EN: Sentence length | 25 words max（目安） |
| EN: Paragraph | 5 sentences max |
| セクション数 | 3-5 |
| 冒頭3文以内に固有名詞 | 3つ以下 |

### 4.4 frontmatter 検証

- [ ] `title` が存在し、50-80文字以内
- [ ] `description` が存在し、80-160文字以内
- [ ] `date` が正しい日付形式
- [ ] `lang` が `en` or `ja`
- [ ] `tags` が3-5個
- [ ] `canonical_url` が正しいURL形式

### 4.5 Wit チェック

- [ ] 最低3箇所のWit要素があるか
- [ ] 冒頭近くに自嘲 or deflation があるか
- [ ] 中盤に予想外のメタファー or 数字の対比があるか
- [ ] 締め近くに「自分がオチ」になる一文があるか
- [ ] Witが1文で完結しているか（長い説明になっていないか）
- [ ] 他人を揶揄していないか（自嘲のみ）

**3箇所未満の場合は修正必須。** Witのない技術記事はAI生成と区別がつかない。

### 4.6 リンク・帰属チェック

- [ ] 外部リンクが有効か（WebFetchで確認）
- [ ] 引用元の帰属が明記されているか
- [ ] 自著の本に言及する場合、正しいURLか

### チェック結果の出力

```
✅ AI Slop: なし
✅ コード: 全ブロック言語指定済み、3ブロック
✅ 読みやすさ: 平均文長 32字、段落平均 3.5文
✅ frontmatter: 全項目OK
✅ Wit: 4箇所（自嘲×2, deflation×1, メタファー×1）
⚠️ リンク: 1件未確認（確認推奨）
```

### チェックポイント 4

チェック結果を提示。問題なければPhase 5へ。

---

## Phase 5: 公開

**目的**: kenimoto.dev にブログ記事をデプロイする。

### 手順

1. ビルド確認:
```bash
cd ~/repos/kenimoto-dev
npm run build
```

2. ビルド成功を確認（Content Collections エラーがないこと）

3. ユーザーに公開確認:
   - 記事タイトル
   - URL（`/blog/{slug}` or `/ja/blog/{slug}`）
   - `--publish` 指定時はこの確認をスキップ

4. git push:
```bash
cd ~/repos/kenimoto-dev
git add src/content/blog/{lang}/{slug}.md
git commit -m "blog: {slug} — {短いタイトル}"
git push origin main
```

5. GitHub Actions が自動デプロイ（約30秒）

### チェックポイント 5

公開URLを提示。ブラウザで確認を促す。

---

## Phase 6: クロスポスト連携

**目的**: kenimoto.dev をcanonicalとして、各プラットフォームにクロスポストする。

### クロスポスト戦略

| プラットフォーム | 言語 | 難易度調整 | canonical_url |
|-----------------|------|-----------|---------------|
| **Qiita** | JA | 入門〜中級向けに調整。冒頭に導入を追加 | kenimoto.dev/ja/blog/{slug} |
| **Dev.to** | EN | そのまま or 英語圏向けに文脈追加 | kenimoto.dev/blog/{slug} |
| **Zenn** | JA | Book連携。深い技術解説寄り | kenimoto.dev/ja/blog/{slug} |

### 手順

1. ユーザーにクロスポスト先を確認（全部 / 選択 / なし）
2. 選択されたプラットフォームごとに:
   - kenimoto.dev記事をベースに難易度調整
   - canonical_url を kenimoto.dev に設定
   - 各プラットフォームのスキルで投稿（`/ship-qiita`, `/ship-devto` 等）
   - または手動投稿用のMarkdownを出力
3. 投稿後、kenimoto.dev記事のfrontmatterに `cross_posted_to` を追記:

```yaml
cross_posted_to:
  - platform: Qiita
    url: "https://qiita.com/kenimo49/items/xxxxx"
  - platform: Dev.to
    url: "https://dev.to/kenimo49/xxxxx"
```

4. 追記をcommit & push

### チェックポイント 6

クロスポスト先と結果を提示。

---

## Phase 7: 記録

**目的**: 投稿を追跡可能にする。

### 記録先

1. **活動ログ**: `~/repos/iris-hub/memory/YYYY-MM-DD.md` に記録
```markdown
## HH:MM - kenimoto.dev ブログ記事公開
- タイトル: {title}
- URL: https://kenimoto.dev/{lang}/blog/{slug}
- 言語: {lang}
- クロスポスト: {platforms}
- ステータス: ✅ 公開完了
```

2. **カレンダー**: Iris カレンダーに登録（【Blog】タイトル）

### チェックポイント 7（最終）

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
公開完了サマリー
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

記事: {title}
URL:  https://kenimoto.dev/blog/{slug}
クロスポスト:
  - Qiita: {url or "なし"}
  - Dev.to: {url or "なし"}
  - Zenn:   {url or "なし"}

次のアクション:
  - X投稿（/ship-x --type promo）を検討
  - GA4でPV追跡開始（データ反映まで24-48h）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## コミットメッセージ規約

```
blog: {slug} — {短いタイトル}
```

例: `blog: autonomous-content-pipeline — AIパイプライン6回テストの学び`

---

## よくある失敗と対策

| 失敗 | 対策 |
|------|------|
| frontmatter不備でビルド失敗 | Phase 4.4 で全項目検証 |
| AI Slop語彙の混入 | Phase 4.1 で avoid-ai-writing-* を必ず実行 |
| コードブロック言語指定漏れ | Phase 4.2 で全ブロックチェック |
| canonical_url の設定ミス | kenimoto.dev のURLを正とし、クロスポスト先に設定 |
| 翻訳が機械的 | `--lang both` でも逐語翻訳せず、読者層に合わせて調整 |
| 記事が長すぎる | 推奨文字数を守る。長くなる場合はシリーズ化を検討 |
| クロスポストの重複 | cross_posted_to フィールドで管理。同じ記事を二重投稿しない |

## 注意事項

- このスキルは **kenimoto.dev ブログ専用**
- 各Phaseのチェックポイントは **スキップしない**
- 一人称は日本語「私」、英語「I」
- コードは動作するものを書く。擬似コードは明記する
- クロスポストは必ず canonical_url を kenimoto.dev に設定
- `--source` モードでも単純コピーではなく、加筆・調整を行う
