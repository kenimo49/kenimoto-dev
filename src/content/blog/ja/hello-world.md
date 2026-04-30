---
title: "Claude Codeで自律型コンテンツパイプラインを構築した話"
description: "AIパイプラインを6回テストして9個バグを見つけた。モデル起因は0個だった。"
date: 2026-04-29
lang: ja
tags: [harness-engineering, claude-code, ai-agent]
featured: true
og_image: "https://kenimoto.dev/images/blog/hello-world/og-ja.png"
---

## パイプラインの構成

Claude Codeを使って、記事の自動生成パイプラインを構築しました。Observer、Strategist、Marketerの3フェーズを順番に実行する仕組みです。

各フェーズは独立したClaudeセッションとして動き、前フェーズの出力を読んで次のステップを生成します。

## 壊れたところ

6回のテストで9個のバグを発見しました。

- **並列実行の競合**: cronが3フェーズを同時に起動。Strategistが未完了のままMarketerが動き出した
- **テーマの重複**: 除外リストがないと、パイプラインが毎回同じテーマを選んでしまう
- **品質チェックの自己申告**: AIが自分の成果物を自分でチェックして、常にパスしていた

9個全てが**ハーネス**（モデルの周りの環境）のバグで、モデル自体の問題はゼロでした。

## 修正方法

時間ベースのcronからイベント駆動チェーンに切り替えました。前フェーズが完了してから次が起動する`after`依存を導入。

```yaml
# Before: 全部同時に発火
observer: "0 7 * * 1"
strategist: "0 7 * * 1"
marketer: "0 7 * * 1"

# After: イベント駆動チェーン
observer: "0 7 * * 1"
strategist:
  after: observer
marketer:
  after: strategist
```

## 学び

AIエージェントの品質は、AIの外側で決まる。モデルはシェフだが、キッチンが壊れていたらどんなシェフも料理できない。
