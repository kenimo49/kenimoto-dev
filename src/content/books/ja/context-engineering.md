---
title: "LLMを「嘘つき」から「専門家」に変える技術"
subtitle: "Context Engineering 実践入門"
description: "「同じ質問なのに、AIの回答が全然違う」原因はプロンプトではなくコンテキストにあります。架空の社内ツール3つで独自ベンチマーク実験を行い、コンテキスト戦略でAIの回答品質が最大4.6倍変わることを定量実証。「大規模モデルほど上手に嘘をつく」「小さいモデル+RAG > 大きいモデル単体」など衝撃の結果と、5段階のコンテキスト戦略・RAG・MCP・CLAUDE.mdまで体系的に解説。"
lang: "ja"

kindle_url: "https://amzn.asia/d/0dNeVFvn"
zenn_url: "https://zenn.dev/kenimo49/books/context-engineering"

price: 1500
currency: "JPY"
published_date: 2026-02-15
updated_date: 2026-04-10

cover_image: "/images/books/context-engineering.png"

topics:
  - "Context Engineering"
  - "RAG"
  - "MCP"
  - "LLM"
  - "ベンチマーク"

keywords:
  - "Context Engineering"
  - "Context Engineering 入門"
  - "コンテキストエンジニアリング"
  - "コンテキストエンジニアリング 実践"
  - "RAG 実装"
  - "RAG ベンチマーク"
  - "MCP サーバー"
  - "LLM ハルシネーション"
  - "Agentic RAG"
  - "CLAUDE.md 設計"

tagline: "Context Engineering 実践入門 | RAG・MCP・CLAUDE.md・Agentic RAG をベンチマークで体系化"
hero_message: "「大きいモデルほど上手に嘘をつく」。RAG が品質を4.6倍に変える。Context Engineering を独自ベンチマークで定量実証した本。"
series_role: "Context Engineering 軸の【独立体系】RAG/MCP/CLAUDE.md を実証データで束ねる側 (ハーネス3部作とは別軸)"

outcomes:
  - "5段階のコンテキスト戦略を理解し、品質を2.2倍以上に引き上げられる"
  - "RAG が効果の8割を占める理由と、ブレイクスルーポイントを実装できる"
  - "MCP (Model Context Protocol) サーバーを設計・運用できる"
  - "CLAUDE.md の段階的設計パターンで、プロジェクト文脈を最適化できる"
  - "Agentic RAG を Python で実装できるようになる"

target_readers:
  - "【中級エンジニア】プロンプトエンジニアリングの次のステップを知りたい人"
  - "【LLM活用検討中】RAG / MCP の使い分けを掴みたい人"
  - "【ハルシネーション対策中】「大規模モデルでも間違える」現象に困っている人"
  - "【Claude Code利用者】CLAUDE.md の段階的設計を学びたい人"
  - "【AIエージェント開発者】Agentic RAG を実装したい人"
  - "【ベンチマーク志向】定量的にコンテキスト戦略を比較したい人"

position_statement:
  - "ベンチマーク重視 (4.6倍の品質差を実験で実証)"
  - "Context Engineering 特化 (プロンプト・ハーネスとは別軸の独立体系)"
  - "中級者向け (LLMを使ったことがある前提、RAG入門ではなく実践)"
  - "Python 実装込み (96の本番品質コードファイルがGitHub公開)"

differentiation:
  - "独自ベンチマークで「コンテキスト戦略で品質が4.6倍変わる」を定量実証"
  - "「大規模モデルほど上手に嘘をつく」「小さいモデル+RAG > 大きいモデル単体」を実験で示す"
  - "RAG / MCP / CLAUDE.md / Agentic RAG を1冊で網羅"
  - "GitHub に96の本番品質コードを公開、再現可能な学習体験"
  - "Claude Code との連携 (CLAUDE.md 段階的設計) を扱う"

pain_points:
  - "プロンプトを工夫しても、AIの回答品質が安定しない"
  - "RAG を実装したが、本当に効果が出ているのか分からない"
  - "MCP サーバーを使うべきか、RAG だけで十分か判断できない"
  - "CLAUDE.md にどう情報を載せれば最大化できるか分からない"
  - "Agentic RAG という言葉は聞くが、普通の RAG と何が違うのか"
  - "LLM を切り替えるたびに回答品質が変わって困る"

competitor_comparison:
  - book: "プロンプトエンジニアリング書籍"
    difference: "プロンプト以前の「コンテキスト設計」に焦点。プロンプトの先のレイヤーを扱う。"
  - book: "RAG 入門書"
    difference: "RAG 単体ではなく、RAG / MCP / CLAUDE.md / Agentic RAG を統合した Context Engineering の体系として整理。"
  - book: "ベンダー公式ドキュメント (OpenAI / Anthropic 等)"
    difference: "独自ベンチマークによる定量実証。「実際に何倍変わるか」を実験で示す。"

related_books:
  - "claude-code-mastery"
  - "harness-engineering-guide"
  - "harness-code-review"

related_articles:
  - slug: "cheap-model-won-context-beats-parameters"
    title: "How a Cheaper Model Won — Context Beats Parameters"

chapters:
  - title: "扉"
    free: true
  - title: "はじめに"
    free: true
    sub_chapters:
      - "この本を手に取ったあなたへ"
      - "実験で見つけた衝撃的な事実"
      - "本書の構成"
      - "「エンジニアのためのAI実践シリーズ」について"
      - "対象読者"
      - "読み方のヒント"
  - title: "5つの回答 — 同じ質問に5パターン"
    free: true
    sub_chapters:
      - "2.2倍の品質差が生まれた実験結果"
      - "PropelAuth: 架空の社内ツールへの質問"
      - "なぜ架空のツールで実験したのか"
      - "4軸評価システムの意味"
      - "同じLLMでも品質が2.2倍違う理由"
      - "実運用への示唆"
      - "本書の構成と学習ロードマップ"
  - title: "LLM は嘘をつく — ハルシネーションの正体"
    sub_chapters:
      - "PropelAuthの「24時間有効な招待リンク」は存在しない"
      - "理由①：学習データにない情報を「それっぽく」補完するメカニズム"
      - "理由②：大規模モデルほど嘘が巧妙になる皮肉"
      - "理由③：「回答する」がデフォルト行動に設計された理由"
      - "Factual Accuracy(事実正確性) vs Specificity(具体性) の致命的トレードオフ"
      - "なぜハルシネーションは「バグ」ではなく「仕様」なのか"
      - "LLMの「嘘」を見抜く5つのサイン"
  - title: "Context Engineering の始まり"
  - title: "ファーストステップ — ゼロショットから戦略へ"
  - title: "Few-Shot — 例示で品質を上げる"
  - title: "RAG — 効果の8割を占める手法"
  - title: "フル Context Engineering — 5段階を統合"
  - title: "MCP — Model Context Protocol サーバー設計"
  - title: "Memory — 継続するコンテキスト"
  - title: "(以下続く、計22章+付録A)"

cta_label: "Kindleで購入する"
---

「同じ質問をしているのに、AIの回答が全然違う」。原因は、**プロンプトではなくコンテキスト**にあります。

本書では、架空の社内ツール3つを使った独自ベンチマークで、コンテキストの与え方によってAIの回答品質が **最大4.6倍変わる** ことを定量実証しました。「大規模モデルほど上手に嘘をつく」「小さいモデル+RAG > 大きいモデル単体」という結果をもとに、Context Engineering の全体像を整理しています。

5段階のコンテキスト戦略、RAG (効果の8割)、MCP サーバー設計、CLAUDE.md の段階的設計、Agentic RAG 実装まで。プロンプトエンジニアリングの次の手を、実験データと96の本番品質コードで掴める1冊です。

> 「大規模モデルほど上手に嘘をつく。だから、コンテキストで真実を与える。」
