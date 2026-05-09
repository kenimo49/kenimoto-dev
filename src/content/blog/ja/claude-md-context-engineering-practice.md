---
title: "CLAUDE.md は結局 Context Engineering を1ファイルに凝縮したものだった"
description: "「CLAUDE.md? READMEで十分でしょ」と思っていました。3週間後、CLAUDE.mdなしのプロジェクトに戻れなくなりました。3階層運用と4段階の設計で、Claude Codeに毎回同じ説明をする時間を消した話です。"
date: 2026-05-09
lang: ja
tags: [Claude, ContextEngineering, ClaudeCode, AI]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/claude-md-context-engineering-practice/"
og_image: "https://kenimoto.dev/images/blog/claude-md-context-engineering-practice/og-ja.png"
cross_posted_to: []
---

私も最初は「CLAUDE.md? READMEで十分でしょ」と思っていました。3週間後、CLAUDE.mdなしのプロジェクトに戻れなくなりました。

前回の記事では、[Context Engineering の5戦略](/ja/blog/context-engineering-introduction-five-strategies/)を見ました。同じ質問でも回答品質が4.6倍ぶれる原因はプロンプトではなくコンテキストにある、という話です。今回はその第3戦略、Context Engineering の設計を Claude Code でどう実装するか、つまり CLAUDE.md の話をします。

結論から書きます。**CLAUDE.md は設定ファイルではなく、Context Engineering の哲学を1ファイルに凝縮したものです**。

## CLAUDE.md は新人社員への引き継ぎ資料

新人がチームに入った日のことを思い出してください。前任者が「このプロジェクトで知っておくべきこと全部」を残してくれていれば、初日から動けます。技術選定の経緯、設計パターン、注意点、コーディング規約。新人はそれを読むだけでプロジェクトの全体像を把握できます。

CLAUDE.md はそれの AI 版です。Claude Code がセッション開始時に読み込むファイルで、毎回同じ説明を繰り返す必要をなくします。

従来のプロンプトはこうなりがちでした。

```text
このプロジェクトはNext.jsを使い、TypeScriptで書かれており、
APIはtRPCで実装され、データベースはPrismaでアクセスし、
認証はNextAuth.jsを使い、UIはTailwind CSSで構築され、
テストはJestとCypressで行い、デプロイはVercelで…
```

これを毎セッション貼り付けていた頃、私は中間管理職のような気持ちになっていました。同じ説明を3回したのに、4回目で「はじめまして」と言われる感覚です。

CLAUDE.md は一度書けば常に効きます。Claude Code はセッション開始時に自動で読み込みます。同じ説明をする時間が消えます。

## 3階層運用: User、Project、Local

CLAUDE.md は1ファイルではなく3階層で運用します。

```text
~/.claude/CLAUDE.md       # User: 全プロジェクト横断の指示
./CLAUDE.md               # Project: プロジェクト固有のガイドライン
./CLAUDE.local.md         # Local: マシン固有の上書き (gitignored)
```

それぞれの役割は次の通りです。

| 階層 | 用途 | 共有範囲 |
|---|---|---|
| User | 個人の開発スタイル、好みのワークフロー | 自分だけ |
| Project | チーム標準、アーキテクチャ方針 | チーム (Git管理) |
| Local | 開発環境固有の設定、APIキーの場所 | このマシンだけ |

![CLAUDE.mdの3階層運用](/images/blog/claude-md-context-engineering-practice/three-layers.png)

Local を `.gitignore` に入れる作業を最初に必ずやってください。これを忘れると、チームメンバーに「君のマシンの開発用パスワードは `dev123` なんだね」と告げられる日が来ます。私は来ました。

3階層にした初日、私は別の問題に当たりました。`~/.claude/CLAUDE.md` に「Pythonが好き」と書いただけで、Goプロジェクトでも勝手にPythonの話を始めるClaudeに困りました。User-level の刃は両方向に切れます。「全プロジェクトで効く」は「全プロジェクトに副作用が出る」と同じ意味です。

User-level には**プロジェクトに依存しないこと**だけを書きます。「テストを書くときは関数名を `test_<対象>_<条件>_<期待>` にする」「コミットメッセージは Conventional Commits」みたいな普遍的なものです。「Python が好き」は嗜好であって規約ではないので、書くなら Project-level です。

## 段階的設計: 空、初期、成熟、大規模

CLAUDE.md を最初から完璧に書こうとすると失敗します。プロジェクトの段階に合わせて育てるのが正解です。

### 段階1: 空のプロジェクト

新規プロジェクトでは、最小限から始めます。

```markdown
# CLAUDE.md

## プロジェクト概要
製品名: TaskFlow (仮称)
目的: チーム向けタスク管理

## 技術スタック
- フロントエンド: React + TypeScript
- バックエンド: Node.js + Express
- データベース: PostgreSQL

## 開発方針
- TypeScript strictモード必須
- コミットメッセージは Conventional Commits
```

この段階では、技術選択の理由よりも**現在の状況**を記録するほうが大事です。理由は後付けで書けます。

### 段階2: 初期開発 (MVP)

機能開発が進んだら、設計判断と制約を追加します。

```markdown
## アーキテクチャ
### フロントエンド
- React 18 + TypeScript 5.0
- 状態管理: Zustand (Redux は過剰と判断)
- UI: Material-UI (カスタムデザイン最小化)

### バックエンド
- Node.js 18 + Express 4
- API: RESTful (GraphQL は将来検討)
- 認証: JWT + refresh token

## 設計原則
- シンプルさ優先: 複雑なパターンより可読性
- 段階的改善: 完璧を目指すより動作優先
```

「Reduxは過剰と判断」のような選択しなかった理由を書くのが効きます。これがないと、3ヶ月後にClaudeが「Reduxを導入しましょう」と毎週提案してきます。同じ議論を毎週するのは中間管理職っぽくて私は嫌でした。

### 段階3: 成熟プロジェクト

チームが拡大したら、コーディング規約を明文化します。命名規則、コンポーネント設計、API設計の3つは最低限書いておきます。

```markdown
## コーディング規約
### TypeScript
- インターフェース名は PascalCase、先頭の I は不要
- null/undefined: undefined を優先
- 型定義: 共有型は types/ 配下、個別型は同ファイル内

### API設計
- エンドポイント: RESTful、複数形 (/users, /tasks)
- エラー: 統一形式 { error: { code, message, details } }
- バージョニング: URL parameter (/api/v1/)
```

### 段階4: 大規模プロジェクト

複数チーム、複数サービスになったら、CLAUDE.md は2,000字以内に収め、詳細は `docs/` と `.claude/agents/` に分離します。これは Sub-agent 設計の話で、別記事の領域です。詳細は[Sub-agent 設計の記事](/ja/blog/claude-code-sub-agent-design/)を参照してください。

## 「やってはいけないこと」が一番効く

CLAUDE.md で最も効くのは「やってはいけないこと」セクションです。私の経験では、これが書いてあるかどうかで Claude Code の出力品質が体感3割変わります。

```markdown
## やってはいけないこと
### セキュリティ
- JWT を localStorage に保存禁止 → httpOnly Cookie 使用
- API キーのフロントエンド埋め込み禁止
- SQL クエリの文字列結合禁止 → prepared statement 必須

### パフォーマンス
- useEffect での無限ループ (dependency 配列忘れ)
- 大量データの map で key={index}
- 画像最適化なしの表示 (next/image 必須)
```

「やる」より「やらない」を書くのが効く理由は、AIの初期値が「Stack Overflow の最頻パターン」だからです。Stack Overflow の最頻パターンは、しばしば現代のベストプラクティスではありません。「やってはいけない」を書かないと、Claude Code は2018年のJWT記事を参考に `localStorage.setItem('token', jwt)` を書いてきます。書きました。私のプロジェクトで。

## CLAUDE.md は Hooks と Sub-agent の基盤

ここで Claude Code 上級運用の構図が見えてきます。

| 層 | 役割 | 制御の質 |
|---|---|---|
| CLAUDE.md | コンテキスト基盤 | お願い (柔らかい) |
| [Sub-agent](/ja/blog/claude-code-sub-agent-design/) | 役割分担 | 専門性の分離 |
| [Hooks v2](/ja/blog/claude-code-hooks-v2-25-events/) | 自動化 | プログラム (硬い) |

CLAUDE.md は「お願い」のレイヤーです。Claude は読んで理解しますが、忘れることもあります。100回中95回は守りますが、本番障害は残りの5回で起きます。

それを補うのが Hooks と Sub-agent です。Hooks は CLAUDE.md の「お願い」をプログラムに変えます。Sub-agent は1つのCLAUDE.md に詰め込みすぎたコンテキストを役割ごとに分離します。3層が揃って Claude Code 上級運用が機能します。

CLAUDE.md がない Hooks は、定義されていないルールを強制するスクリプトです。CLAUDE.md がない Sub-agent は、共通基盤のない専門家集団です。土台は CLAUDE.md です。

## prompt caching との関係

2026年5月時点で、Anthropic API の prompt caching は5分のTTLが標準です。CLAUDE.md は毎セッション同じ内容を読み込むので、cache hit が効きやすい部類のテキストです。

3,000字の CLAUDE.md を毎セッション読み込んだとして、初回はトークン課金されますが、5分以内の連続セッションは cache hit で90%引きになります。CLAUDE.md を「コストになるからケチって書く」必要はありません。むしろ書き込むほうが、長期的にはトークン効率が良いです。

ただし、5分間隔でしか使わないプロジェクトでは cache がコールドになります。その場合は CLAUDE.md を200行以内に保つのが現実的です。

## まとめ: CLAUDE.md = Context Engineering の凝縮

CLAUDE.md は単なる設定ファイルではありません。プロジェクトの**なぜ**と**どう**を AI に渡す Context Engineering の凝縮です。

3階層運用 (User/Project/Local) で関心を分離し、4段階 (空→初期→成熟→大規模) で育て、「やってはいけないこと」を明文化する。これが Claude Code を「賢いコピペマシン」から「プロジェクトの新人」に変える設計です。

次回は few-shot prompting の限界、または Agentic RAG の実装あたりを予定しています。CLAUDE.md で基礎を固めた後の、動的なコンテキスト戦略の話です。

<aside class="book-callout">

**この記事は書籍『LLMを「嘘つき」から「専門家」に変える技術 (Context Engineering 実践入門)』の第10章を再編集したものです。**

書籍では本記事の内容に加え、5段階のコンテキスト戦略、RAG設計、MCPサーバー設計、Agentic RAG までを体系的に扱っています。

[書籍ページ: LLMを「嘘つき」から「専門家」に変える技術](https://kenimoto.dev/ja/books/context-engineering?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=claude-md-ce-practice)

</aside>
