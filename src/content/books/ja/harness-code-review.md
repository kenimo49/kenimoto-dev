---
title: "AIコードレビューを仕組み化する技術"
subtitle: "hooks・AI・人間の3層モデル"
description: "AIコードレビューを仕組み化する3層モデル。フォーマット指摘は hooks で機械的に強制、CodeRabbit/Copilot/Claude が一次レビューを担い、人間は設計判断と方向性だけに集中する。AGENTS.md にレビュー方針を書き、フィードバックループで仕組み自体が進化する設計を、Next.js + TypeScript の実装例とともに解説。"
lang: "ja"

kindle_url: "https://amzn.asia/d/0hgvOnOi"
zenn_url: "https://zenn.dev/kenimo49/books/harness-code-review"

price: 1000
currency: "JPY"
published_date: 2026-04-01
updated_date: 2026-04-21

cover_image: "/images/books/harness-code-review.png"

topics:
  - "AIコードレビュー"
  - "ハーネスエンジニアリング"
  - "CodeRabbit"
  - "GitHub Actions"
  - "チーム開発"

keywords:
  - "AIコードレビュー"
  - "AIコードレビュー 自動化"
  - "AIコードレビュー 比較"
  - "CodeRabbit 使い方"
  - "GitHub Actions レビュー"
  - "AGENTS.md"
  - "コードレビュー 自動化"
  - "Conventional Comments"
  - "Copilot レビュー"
  - "Claude レビュー"

tagline: "AIコードレビュー 自動化 | hooks 設計・CodeRabbit 導入・Conventional Comments・GitHub Actions パイプライン"
hero_message: "「フォーマット指摘でレビュー時間が溶ける」と感じている人へ — hooks で機械的、AIで一次、人間は設計判断。3層に分けると、レビュー時間は60%減る。"

outcomes:
  - "hooks・AI・人間の3層モデルでレビューを役割分担できるようになる"
  - "AGENTS.md にレビュー方針を書き、CodeRabbit/Copilot/Claude を運用に組み込める"
  - "Conventional Comments をハーネスに組み込み、コメントの意図を機械可読にできる"
  - "GitHub Actions でAIレビューパイプラインを構築できる"
  - "レビュー結果を AGENTS.md にフィードバックする autoFixable ループを設計できる"

target_readers:
  - "【テックリード】チームのレビュー時間が肥大化していて削減したい人"
  - "【中規模チーム開発者】レビュー品質と速度を両立させたい人"
  - "【AGENTS.md設計者】レビュー方針をハーネスに書きたい人"
  - "【CI/CD担当】GitHub Actions に AI レビューを組み込みたい人"
  - "【AIツール選定中】CodeRabbit / Copilot / Claude の使い分けを知りたい人"
  - "【スタートアップCTO】少人数で品質と速度を担保する仕組みを作りたい人"

position_statement:
  - "実装重視 (Next.js + TypeScript の具体実装まで提示)"
  - "中規模チーム向け (個人開発でも、大企業のレビュー文化でもない、5-30人スケール)"
  - "ハーネス連携 (AGENTS.md とレビュー設計を一体で扱う)"
  - "ツール横断 (CodeRabbit / Copilot / Claude の3つを統合運用)"

differentiation:
  - "「3層モデル」というフレームワークでレビュー設計を体系化した最初の本"
  - "CodeRabbit / Copilot / Claude の3つを統合運用する具体パターン"
  - "AGENTS.md と Conventional Comments の組み合わせを実装"
  - "autoFixable ループでレビュー結果が仕組みに還流する設計"
  - "実プロジェクト (Next.js + TypeScript) のレビューパイプライン全体を公開"

pain_points:
  - "フォーマット指摘・命名指摘でレビューに時間がかかりすぎる"
  - "AIレビューツールを試したが、人間のレビューと役割分担できていない"
  - "CodeRabbit と Copilot と Claude、何が違うのか分からない"
  - "AGENTS.md にレビュー方針を書く具体例が知りたい"
  - "GitHub Actions で AI レビューを動かす設計が分からない"
  - "AI レビューの精度が低くて結局人間が見直している"

competitor_comparison:
  - book: "コードレビュー一般書 (Code Review Best Practices等)"
    difference: "AI を組み込んだ運用設計に特化。hooks・AI・人間の役割分担を体系化する。"
  - book: "CodeRabbit / Copilot 等のツール公式ドキュメント"
    difference: "1ツールではなく、3ツールを統合運用するパターンを実装例とともに提示。"
  - book: "ハーネスエンジニアリング全般書"
    difference: "ハーネスのうち品質検証層(コードレビュー)に絞って深掘り。AGENTS.mdとの連携を具体化。"

related_books:
  - "harness-engineering-guide"
  - "harness-claudemd"
  - "claude-code-mastery"

related_articles:
  - slug: "claude-code-hooks-v2-25-events"
    title: "Claude Code Hooks v2 — 「お願い」を「プログラム」に変える25のイベント"

chapters:
  - title: "はじめに — レビューを「仕組み」にする"
    free: true
  - title: "ハーネスの品質検証層にコードレビューを組み込む"
    free: true
  - title: "レビューの3層モデル — 自動 / AI / 人間"
    free: true
  - title: "第1層: hooks と CI で強制するゲート"
  - title: "第2層: AI レビューの導入設計"
  - title: "第3層: 人間レビューの焦点を設計と方向性に絞る"
  - title: "AGENTS.md にレビュー方針を書く"
  - title: "Conventional Comments をハーネスに組み込む"
  - title: "PR テンプレートとレビューチェックリストの自動化"
  - title: "CodeRabbit の導入と設定"
  - title: "AI レビューツールの追加: Copilot / Claude"
  - title: "GitHub Actions でレビューパイプラインを構築する"
  - title: "autoFixable パターン — 機械的修正の自動化"
  - title: "フィードバックループ — レビュー結果を AGENTS.md に還元する"
  - title: "レビューメトリクスの計測と改善"
  - title: "実装例: Next.js + TypeScript プロジェクトのハーネスレビュー設計"
  - title: "おわりに — レビューはハーネスの心臓部"
  - title: "参考文献"
  - title: "著者紹介"
  - title: "奥付"

cta_label: "Kindleで購入する"
redirect_delay_seconds: 5
redirect_destination: "kindle"
---

「フォーマット指摘に時間を使うのは、料理人が皿洗いに時間を使うようなもの。」

レビュー時間が肥大化する原因は、人間が機械的なチェックを担当しているからです。本書では、**hooks (機械) → AI レビュー (一次) → 人間 (設計判断)** の3層モデルで役割を分け、レビュー時間を60%削減した実プロジェクトの設計を解説します。

CodeRabbit / Copilot / Claude を統合運用し、AGENTS.md にレビュー方針を書き、GitHub Actions でパイプラインを組む。レビュー結果は autoFixable ループで AGENTS.md に還流し、仕組み自体が進化していく。

> 「人間は設計判断と方向性だけに集中する。それ以外は機械に任せる。」
