---
title: "ハーネス・エンジニアリング"
subtitle: "AIを\"使う\"から\"操る\"へ"
description: "ハーネスエンジニアリングを、OpenAI・Anthropic・LangChain・Martin Fowler・学術の5つの解釈で横断的に整理した最初の体系書。6つの構成要素、AGENTS.md/CLAUDE.md/hooks の実装パターン、Self-Evolving Agentまで——2026年のキーワード「ハーネス」を実装レベルで掴む。"
lang: "ja"

kindle_url: "https://amzn.asia/d/0eE7m2BJ"
zenn_url: "https://zenn.dev/kenimo49/books/harness-engineering-guide"

price: 1500
currency: "JPY"
published_date: 2026-03-15
updated_date: 2026-04-20

cover_image: "/images/books/harness-engineering-guide.png"

topics:
  - "ハーネスエンジニアリング"
  - "AIエージェント"
  - "AGENTS.md"
  - "CLAUDE.md"
  - "Self-Evolving Agent"

keywords:
  - "ハーネスエンジニアリング"
  - "ハーネスエンジニアリング 入門"
  - "ハーネスエンジニアリング とは"
  - "AGENTS.md 設計"
  - "AGENTS.md 書き方"
  - "CLAUDE.md hooks"
  - "Self-Evolving Agent"
  - "AIエージェント設計"
  - "OpenAI Codex"
  - "Agent Framework 比較"

tagline: "ハーネスエンジニアリング 入門 | AGENTS.md 設計・hooks 実装・AIエージェント運用の体系書"
hero_message: 'AIエージェントは"動く"が、"操れる"とは限らない。OpenAI/Anthropic/LangChainで定義が違うハーネスを、1冊に統合した。'
series_role: "ハーネス3部作の【設計担当】ハーネスとは何かを5社の解釈で体系化する側"

outcomes:
  - "6つの構成要素フレームワークで、どんなハーネスも分解・設計できるようになる"
  - "AGENTS.md / CLAUDE.md / hooks の使い分けを判断できる"
  - "OpenAI Codex / Anthropic / LangChain / Martin Fowler / 学術 の解釈差を比較・整理できる"
  - "Self-Evolving Agent (自己改善するハーネス) のパターンを実装できる"
  - "Vibe Coding / Spec Coding / Agent Framework の位置関係を技術マップで把握できる"

target_readers:
  - "【AIエージェント開発者】2026年のキーワード「ハーネス」を体系として掴みたい人"
  - "【Claude Code利用者】CLAUDE.mdの先のレイヤーに進みたい人"
  - "【テックリード】チーム全体でAIエージェント運用を設計したい人"
  - "【リサーチ志向】OpenAI / Anthropic / LangChain の解釈を一気に比較したい人"
  - "【Self-Evolving興味】自己改善するハーネスを実装してみたい人"
  - "【ツール選定中】Vibe Coding / Spec Coding / Agent Framework の関係を知りたい人"

position_statement:
  - "横断比較 (5社の解釈を1冊で対比、業界初)"
  - "実装重視 (理論だけでなく AGENTS.md / hooks の具体例)"
  - "中級〜上級向け (Claude Code / CLAUDE.md の基礎は前提)"
  - "ハーネス特化 (1テーマを19章で深掘り)"

differentiation:
  - "OpenAI / Anthropic / LangChain / Martin Fowler / 学術 の5つの解釈を統合した最初の本"
  - "6構成要素のフレームワークで「ハーネスとは何か」を体系化"
  - "Self-Evolving Agent (自己進化するハーネス) まで踏み込み、未来予測まで含める"
  - "AGENTS.md / CLAUDE.md / hooks の実装パターンを Next.js 等の具体例で提示"
  - "Zenn 12,000PV の解釈比較記事を発展させた本格版"

pain_points:
  - "ハーネスエンジニアリングという言葉は聞くが、具体的に何か説明できない"
  - "OpenAIとAnthropicで言っていることが微妙に違うように感じる"
  - "AGENTS.md と CLAUDE.md の違い・使い分けが曖昧"
  - "hooks をいつ使うべきか判断できない"
  - "Self-Evolving Agent の設計パターンが分からない"
  - "ハーネスと Agent Framework (LangChain等) の境界が不明"

competitor_comparison:
  - book: "OpenAI / Anthropic / LangChain 各社のドキュメント"
    difference: "1社視点ではなく、5社の解釈を統合・比較。「みんな違うことを言っている」現象自体を整理する。"
  - book: "プロンプトエンジニアリング / コンテキストエンジニアリング 書籍"
    difference: "プロンプト・コンテキストの先にあるハーネス層に焦点。3層構造の最上層を扱う。"
  - book: "Agent Framework 解説書 (LangChain Agents等)"
    difference: "フレームワーク特化ではなく、ハーネスと Agent Framework の境界・関係を整理する。"

related_books:
  - "claude-code-mastery"
  - "harness-code-review"
  - "context-engineering"

related_articles:
  - slug: "claude-code-sub-agent-design"
    title: "Claude CodeのSub-agent設計 — 1セッションで専門家チームを使い分ける"
  - slug: "claude-code-hooks-v2-25-events"
    title: "Claude Code Hooks v2 — 「お願い」を「プログラム」に変える25のイベント"

chapters:
  - title: "はじめに — なぜ今「ハーネス」なのか"
    free: true
    sub_chapters:
      - "ある火曜日の午前3時"
      - "本書の対象読者"
      - "本書の読み方"
  - title: "3つのエンジニアリングの進化 (Prompt → Context → Harness)"
    free: true
    sub_chapters:
      - "40%が失敗する理由"
      - "タイムライン"
      - "3つは何が違うのか"
      - "入れ子構造"
      - "「置き換わる」のか「積み重なる」のか"
      - "なぜ今このタイミングなのか"
  - title: "ハーネスエンジニアリングの定義と全体像"
    free: true
    sub_chapters:
      - "「デモで動いて本番で壊れる」の正体"
      - "「ハーネス」という言葉の由来"
      - "テストハーネスとの区別"
      - "定義の比較"
      - "共通点を抽出する"
      - "ハーネスエンジニアリングの正式な定義（本書）"
      - "ハーネスがない場合に何が起きるか"
      - "プロンプトエンジニアリングとの決定的な違い"
  - title: "OpenAI の解釈 — Codexと100万行の実験"
  - title: "Anthropic の解釈 — 長時間実行エージェントのハーネス設計"
  - title: "LangChain の解釈 — Agent = Model + Harness"
  - title: "Martin Fowler の視点 — コードベースが持つ暗黙のハーネス"
  - title: "学術の視点 — arXiv論文と形式仕様化"
  - title: "6つの構成要素 — ハーネスの解剖学"
    free: true
  - title: "関連技術マップ — Vibe Coding / Spec Coding / Agent Framework"
  - title: "解釈の違いの整理 — 何が同じで、何が違うか"
  - title: "AGENTS.md / CLAUDE.md の実践設計"
  - title: "hooks / lifecycle / フィードバックループ"
  - title: "Self-Evolving Agent — 自己改善するハーネス"
  - title: "ハーネスエンジニアリングの未来"
  - title: "おわりに"
  - title: "参考文献"
    free: true
  - title: "著者紹介"
    free: true
  - title: "奥付"
    free: true

cta_label: "Kindleで購入する"
---

ハーネスエンジニアリングという言葉が独り歩きしています。OpenAIは「Codexのスケーラビリティ」、Anthropicは「長時間実行エージェント」、LangChainは「Agent = Model + Harness」、Martin Fowlerは「コードベースに既に存在する暗黙のハーネス」。

それぞれが正しい。しかし、これらをひとつの体系として整理した本は、これまでありませんでした。

本書は **ハーネスとは何か、どう設計し、どう運用するか** を、5社の解釈を6つの構成要素に統合し、AGENTS.md / CLAUDE.md / hooks の実装パターンまで一気通貫でまとめたものです。

> 「2024年はプロンプト。2025年はコンテキスト。2026年はハーネス。」
