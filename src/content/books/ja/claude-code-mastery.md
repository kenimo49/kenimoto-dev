---
title: "実践Claude Code"
subtitle: "コンテキストエンジニアリングで開発が変わる"
tagline: "Claude Code 使い方ガイド | CLAUDE.md 書き方・Plan Mode 設計・チーム開発の実践書"
hero_message: "AIに毎回ちがう指示を出してませんか? CLAUDE.md と Context Engineering で、Claude Code を「指示出し」から「協働」に変える。"
series_role: "ハーネス3部作の【実装担当】Claude Code を実務で使い倒す側"
description: "Claude Code を1年以上、実務で使い込んだ。CLAUDE.md の書き方、Plan Mode 起点の1日の開発フロー、チーム展開、セキュリティ。19章で、現場で得た知見を1冊にまとめた。"
lang: "ja"

kindle_url: "https://amzn.asia/d/03Qnb8QT"
zenn_url: "https://zenn.dev/kenimo49/books/claude-code-mastery"

price: 1000
currency: "JPY"
published_date: 2025-09-01
updated_date: 2026-04-15

cover_image: "/images/books/claude-code-mastery.png"

topics:
  - "Claude Code"
  - "コンテキストエンジニアリング"
  - "CLAUDE.md"
  - "AI開発"
  - "開発効率化"

keywords:
  - "Claude Code 使い方"
  - "Claude Code 設計"
  - "Claude Code 実践"
  - "CLAUDE.md 書き方"
  - "CLAUDE.md 設計"
  - "Plan Mode"
  - "コンテキストエンジニアリング"
  - "AIコーディング"
  - "AIエージェント開発"

outcomes:
  - "CLAUDE.mdを「2行から100行まで」用途別に書き分けられるようになる"
  - "Plan Modeを起点にした1日の開発フローを設計し、生産性を体系的に上げられる"
  - "個人版・プロジェクト版・チーム版でCLAUDE.mdを使い分け、複数人開発でブレを抑えられる"
  - "テスト自動化・MCP連携・GitHub Actions統合まで、Claude Codeを単体ツールでなくエコシステムとして運用できる"
  - "確定申告・プレゼン作成・契約書レビューなど非コーディング業務にもAIを応用できる"

position_statement:
  - "実務寄り (理論書ではなく、1年以上の運用知見ベース)"
  - "Claude Code 特化 (Cursor/Copilot系ではなく単一ツール深掘り)"
  - "中級者向け (入門書ではなく「使えるけどもう一段」レベル対象)"
  - "横断型 (個人開発・チーム開発・AIエージェント設計まで網羅)"

target_readers:
  - "【初心者】Claude Codeを使い始めたばかりで、何から学ぶか迷っている人"
  - "【中級者】Claude Codeで基本的な開発はできるが、もう一段使いこなしたい人"
  - "【チーム開発者】複数人開発でCLAUDE.mdの運用に課題を感じているリーダー・マネージャー"
  - "【AIエージェント開発者】Claude Code単体ではなく、AIエージェント設計の文脈で使いたい人"
  - "【ツール比較中】CursorやGitHub CopilotとClaude Codeの違いを掴みたい人"
  - "【非エンジニア活用検討中】確定申告・プレゼン作成など非コーディング業務にもAIを応用したい人"

differentiation:
  - "著者が実務で1年以上使い込んだ一次体験ベース。机上論ではない"
  - "Boris Chernyの設計思想からCLAUDE.mdの肥大化問題まで、表層と本質を両方カバー"
  - "成功例だけでなく失敗から学んだことも正直に記載"
  - "個人開発・チーム開発・非エンジニア活用まで19章で網羅"
  - "AIエージェント時代のエンジニア像と未来予測まで踏み込む"

pain_points:
  - "Claude Codeに指示を出してもイマイチ結果がブレる"
  - "CLAUDE.mdに何を書けば良いか分からず、毎回手探りになる"
  - "チームで使い始めたが、メンバー間で運用がバラバラ"
  - "プロンプトエンジニアリングとコンテキストエンジニアリングの違いが曖昧"
  - "AIに任せると品質が下がる気がして、結局自分で書き直してしまう"
  - "ツール乱立時代、Claude Codeに賭けて良いのか判断できない"

competitor_comparison:
  - book: "Claude Code 公式ドキュメント"
    difference: "公式は機能解説中心。本書は「実務でどう使うか」「失敗パターン」「チーム展開」など運用知見に踏み込む"
  - book: "プロンプトエンジニアリング系の書籍"
    difference: "プロンプト術ではなく、プロジェクト全体の文脈設計（Context Engineering）の方法論を扱う"
  - book: "CursorやGitHub Copilot解説本"
    difference: "Claude Codeのターミナル設計思想を起点に、CLAUDE.mdによる「ドキュメントファースト開発」の体系を提示"

related_books:
  - "harness-engineering-guide"
  - "harness-code-review"
  - "context-engineering"
  - "claude-code-quickstart"

related_articles:
  - slug: "claude-code-hooks-v2-25-events"
    title: "Claude Code Hooks v2 — 「お願い」を「プログラム」に変える25のイベント"
  - slug: "claude-code-sub-agent-design"
    title: "Claude CodeのSub-agent設計 — 1セッションで専門家チームを使い分ける"

chapters:
  - title: "はじめに"
    free: true
    summary: "なぜこの本を書いたか、Claude Codeとの出会い、本書の読み方ガイド"
  - title: "Claude Codeの誕生：Boris Chernyが語る偶然の始まり"
    free: true
    summary: "「今、何の音楽を聴いてる？」という一言から始まったプロトタイプ。CLI選択・bash採用など4つの設計判断"
  - title: "ターミナルベースという選択：CLI vs IDE論争を超えて"
    summary: "なぜClaude CodeはIDE統合ではなくCLIを選んだのか。設計思想の核心"
  - title: "AIネイティブ開発の潜在需要：なぜ今Claude Codeなのか"
    summary: "Cursor、Copilotとの比較。AIネイティブ開発の要件とClaude Codeの位置付け"
  - title: "CLAUDE.mdの本質：開発者は2行、実践者は100行"
    free: true
    summary: "Boris Chernyの2行CLAUDE.mdの真意。肥大化問題と7つの運用原則"
  - title: "ドキュメントファースト開発：仕様より先に文脈を書く"
    summary: "コードよりも先にCLAUDE.mdを書く逆転発想。ドキュメント駆動の利点と落とし穴"
  - title: "CLAUDE.md実践パターン10選"
    summary: "現場で使える具体的なテンプレートと書き分けパターン"
  - title: "チームCLAUDE.md：複数人開発での運用設計"
    summary: "個人とチームでCLAUDE.mdをどう分けるか。レビューフロー、merge戦略"
  - title: "1日の開発フロー：朝のPlan Modeから夜のレビューまで"
    summary: "朝の計画→実装→テスト→レビュー→引き継ぎ。1日のリズムが翌日の精度を決める"
  - title: "設計統合：Claude Codeでアーキテクチャを描く"
    summary: "システム設計、ER図、シーケンス図をAIと一緒に描くワークフロー"
  - title: "テスト自動化：AIに書かせて、AIにレビューさせる"
    summary: "テストファースト+AI協働。カバレッジと品質を両立させる方法"
  - title: "マルチツール連携：MCP、GitHub Actions、外部API"
    summary: "Claude Code単体ではなくエコシステムとして使う"
  - title: "非エンジニアとの協働：仕様書・スライド・データ整理"
    summary: "コードを書かないメンバーがAIネイティブ組織にどう参加するか"
  - title: "ナレッジ自動化：社内ドキュメントをAIで育てる"
    summary: "CLAUDE.mdを起点に組織のナレッジベースを成長させる仕組み"
  - title: "ビジネスと財務：契約書レビューから経営判断まで"
    summary: "コーディング以外の経営判断にもClaude Codeを活用する事例集"
  - title: "個人の生産性革命：確定申告からプレゼンまで"
    summary: "Claude Codeの非コーディング用途12カテゴリと「錯覚生産性」への対策"
  - title: "Shai-Huludアタック：依存パッケージ経由の侵入リスク"
    summary: "AIネイティブ時代のサプライチェーン攻撃と対策"
  - title: "ポリシーとリスク：機密情報、ライセンス、社内規定"
    summary: "Claude Code導入時に企業が直面する法務・セキュリティ論点"
  - title: "エンジニアという肩書きが消える日"
    summary: "AIエージェント時代の役割再定義。プログラマーの未来"
  - title: "未来編：これからのClaude Codeとエンジニアリング"
    summary: "今後3年の展望、Anthropicのロードマップ、エコシステム予測"
  - title: "おわりに"
    summary: "Context Engineeringの世界へようこそ"
  - title: "参考文献"
  - title: "著者について"
  - title: "奥付"

parts:
  - name: "第1部 基礎篇"
    summary: "哲学・Claude Codeの誕生・CLAUDE.mdの本質"
    chapters:
    - title: "はじめに"
      free: true
      summary: "なぜこの本を書いたか、Claude Codeとの出会い、本書の読み方ガイド"
    - title: "Claude Codeの誕生：Boris Chernyが語る偶然の始まり"
      free: true
      summary: "「今、何の音楽を聴いてる？」という一言から始まったプロトタイプ。CLI選択・bash採用など4つの設計判断"
    - title: "ターミナルベースという選択：CLI vs IDE論争を超えて"
      summary: "なぜClaude CodeはIDE統合ではなくCLIを選んだのか。設計思想の核心"
    - title: "AIネイティブ開発の潜在需要：なぜ今Claude Codeなのか"
      summary: "Cursor、Copilotとの比較。AIネイティブ開発の要件とClaude Codeの位置付け"
    - title: "CLAUDE.mdの本質：開発者は2行、実践者は100行"
      free: true
      summary: "Boris Chernyの2行CLAUDE.mdの真意。肥大化問題と7つの運用原則"
    - title: "ドキュメントファースト開発：仕様より先に文脈を書く"
      summary: "コードよりも先にCLAUDE.mdを書く逆転発想。ドキュメント駆動の利点と落とし穴"
  - name: "第2部 実践・チーム篇"
    summary: "日々のパターン・チーム運用・マルチツール統合"
    chapters:
    - title: "CLAUDE.md実践パターン10選"
      summary: "現場で使える具体的なテンプレートと書き分けパターン"
    - title: "チームCLAUDE.md：複数人開発での運用設計"
      summary: "個人とチームでCLAUDE.mdをどう分けるか。レビューフロー、merge戦略"
    - title: "1日の開発フロー：朝のPlan Modeから夜のレビューまで"
      summary: "朝の計画→実装→テスト→レビュー→引き継ぎ。1日のリズムが翌日の精度を決める"
    - title: "設計統合：Claude Codeでアーキテクチャを描く"
      summary: "システム設計、ER図、シーケンス図をAIと一緒に描くワークフロー"
    - title: "テスト自動化：AIに書かせて、AIにレビューさせる"
      summary: "テストファースト+AI協働。カバレッジと品質を両立させる方法"
    - title: "マルチツール連携：MCP、GitHub Actions、外部API"
      summary: "Claude Code単体ではなくエコシステムとして使う"
    - title: "非エンジニアとの協働：仕様書・スライド・データ整理"
      summary: "コードを書かないメンバーがAIネイティブ組織にどう参加するか"
  - name: "第3部 発展・参考篇"
    summary: "応用領域・未来・参考資料"
    chapters:
    - title: "ナレッジ自動化：社内ドキュメントをAIで育てる"
      summary: "CLAUDE.mdを起点に組織のナレッジベースを成長させる仕組み"
    - title: "ビジネスと財務：契約書レビューから経営判断まで"
      summary: "コーディング以外の経営判断にもClaude Codeを活用する事例集"
    - title: "個人の生産性革命：確定申告からプレゼンまで"
      summary: "Claude Codeの非コーディング用途12カテゴリと「錯覚生産性」への対策"
    - title: "Shai-Huludアタック：依存パッケージ経由の侵入リスク"
      summary: "AIネイティブ時代のサプライチェーン攻撃と対策"
    - title: "ポリシーとリスク：機密情報、ライセンス、社内規定"
      summary: "Claude Code導入時に企業が直面する法務・セキュリティ論点"
    - title: "エンジニアという肩書きが消える日"
      summary: "AIエージェント時代の役割再定義。プログラマーの未来"
    - title: "未来編：これからのClaude Codeとエンジニアリング"
      summary: "今後3年の展望、Anthropicのロードマップ、エコシステム予測"
    - title: "おわりに"
      summary: "Context Engineeringの世界へようこそ"
    - title: "参考文献"
    - title: "著者について"
    - title: "奥付"

cta_label: "Kindleで購入する"
---

この本を書いた理由は1つです。Claude Codeを実務で使い込むうちに、**「ツールの使い方」より「ツールとの協働の作法」のほうが効く**と分かってきたからです。

Boris Cherny（Anthropic）が公開しているCLAUDE.mdは、たった2行。その2行の裏に、コンテキスト設計の考え方が詰まっています。本書は、その考え方を私自身の1年以上の実務で検証して、運用パターンに落とし直したものです。

Claude Codeを「AI補助ツール」として扱っている限り、効果は限られます。**プロジェクト全体の文脈を設計する**側に回ったとき、AIとの協働は別物になる。この設計を私は「Context Engineering」と呼んでいます。

読み終える頃には、CLAUDE.mdの書き方、チーム開発での運用、非コーディング業務への応用が、自分の言葉で語れるはずです。

> 「これは単なるツールではない。開発そのものの作法を変える。」
