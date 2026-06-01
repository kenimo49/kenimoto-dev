---
title: "Claude Code Skills を10個書いたら、4個に統合された — Reusable Pattern が回り始める瞬間と回らない瞬間"
description: "Claude Code Skills を10個書きました。3か月運用した結果、4個に統合され、6個は消えました。残った4個と消えた6個の境界線、Skill 設計で繰り返した6種類の失敗、そして「Skill にする / しない」を分ける1つの基準について書きます。"
date: 2026-05-20
lang: ja
tags: [claude-code, skills, harness, workflow]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/claude-code-skills-10-to-4-integration-pattern"
og_image: "https://kenimoto.dev/images/blog/claude-code-skills-10-to-4-integration-pattern/og-ja.png"
cross_posted_to: []
---

Claude Code Skills が公式に降りてきた最初の週、私は10個書きました。「これで作業が全部自動化されるはずだ」と思ったからです。月単位の確定申告から、Zenn の記事公開、Telegram 通知、画像生成、PR レビューまで、思いついた手順を片っ端から SKILL.md にしました。最初は Skill 1個 = アシスタントを1人雇った気分でした。実態は **1個 = 起動時にカタログ展開で数百〜数千トークン分の脳のスペースが減る** だけだったんですけど、それに気づくのは2週間後です。

3か月運用した結果、10個のうち6個は消えました。残った4個は、起動の仕方も書き方も最初の10個とはまったく違うものに変わっています。この記事は、その10→4の境界線を共有する記事です。

なお、先週 Zenn で「Claude Code 拡張47→5絞り込み」という記事を書きました。あちらは Skills / MCP / Hooks / Plugins の **4種類全体を含めた絞り込み体験談** です。本記事は **Skills 単体に絞った設計の話** なので、ご了承ください。Sub-agent や Hooks v2 の話は別の場所で書いています。

![10個の Skills が4個に統合された fan-in 図](/images/blog/claude-code-skills-10-to-4-integration-pattern/skills-10-to-4-fanin.png)

## 残った4個

先に結論を書きます。3か月生き残った4個はこれです。

1. **`kenimoto-dev-cycle`** — kenimoto.dev のブログ運用 PDCA。Observer → Strategist → Marketer の3層を1日1回回す
2. **`zenn-cycle`** — Zenn 記事の同じ PDCA。日本語、24時間ルールあり
3. **`generate-image`** — HTML + Puppeteer で navy-mono の図解画像を生成
4. **`avoid-ai-writing-ja`** + 兄弟3言語 — AI Slop 検出と書き換え

4個の共通点は2つあります。

- **入力が決まっている**: cron か、特定のファイルパス、特定のフェーズからしか呼ばれない
- **出力が他の流れにつながる**: 画像は記事に、AI Slop チェックは公開ゲートに、cycle は cron 通知に

逆に消えた6個は、入力も出力も曖昧でした。「便利そうだから書いた」だったんです。

## 消えた6個と、消えた理由

消した順に並べます。

### 1. `morning-summary` — 重複起動で消えた

朝の活動ログをまとめてくれる Skill でした。しかし `kenimoto-dev-cycle` の Observer フェーズと、`zenn-cycle` の Observer フェーズと、`harness-admin` の status check と内容が8割重なっていました。3つの Skill から「朝の状況を見たい」シーンが派生して、それぞれが個別に書かれていただけだったんです。

統合先: 各 cycle Skill の Observer フェーズに吸収。`morning-summary` 単体は不要。

### 2. `tg-notify-rich` — 使用頻度が低くて消えた

Telegram 通知をリッチな書式で送る Skill。月に1回くらいしか呼ばれませんでした。それなら3行のシェルスクリプトで十分です。Skill 化する基準を満たしていません。

教訓: **月に2回未満しか呼ばれない手順は Skill にしない**。記憶を圧迫するだけです。

### 3. `gitignore-check` — Hook で代替できて消えた

ファイル追加時に `.env` などの秘密ファイルを誤って commit していないかを確認する Skill。これは Hook (`PostToolUse` の Edit / Write) で十分でした。Skill にすると「呼ばれて初めて動く」ですが、Hook なら「ファイル編集のたびに自動で動く」です。

教訓: **「特定の操作の後に毎回走るべき」処理は Hook、判断や対話が必要な処理は Skill**。境界線はここです。

### 4. `book-outline-gen` — context 汚染で消えた

書籍の章立てを提案する Skill。最初は便利でしたが、frontmatter ルール、構成テンプレート、avoid-ai-writing 連携など、ロードする情報が肥大化していき、起動時のコンテキスト負担が大きくなりました。同時に、書籍はそんなに頻繁に書かないので、必要なときに自然言語で指示するほうが軽かったです。

教訓: **「コンテキストを大量に持ち込む Skill」は、起動頻度が低いと割に合わない**。

### 5. `pr-review-light` — 書き換え頻度が高くて消えた

PR レビューを Skill にしたものの、レビュー観点が案件ごとに違いすぎて、SKILL.md の改訂が毎週入りました。3週連続で書き換えたところで「これは Skill ではなく、対話で都度方針を渡すべきだ」と判断しました。

教訓: **書き換え頻度の高い手順は Skill にしない**。判断ロジックがまだ固まっていない証拠です。

### 6. `email-triage` — generic化に失敗して消えた

Gmail の未読を分類する Skill。Pinterest 通知、KDP 通知、その他の取引先、と分類カテゴリーが増えるたびに条件分岐が膨れて、最終的に「個別の `check-gmail` 系 Skill のほうが軽い」ことに気づきました。

教訓: **無理に1つの Skill に詰め込もうとせず、3つに分ける**。

## 残った4個に共通する設計原則

3か月運用して気づいた、Skill が生き残るための条件を書きます。

### 条件1: 1日1回以上の頻度で起動される

毎日呼ばれない Skill は、たいてい次第に「あれ、これ何を書いた Skill だっけ？」になります。生き残った4個は、cron か手動か、形式は違えど **毎日呼ばれる Skill** でした。

「いつか役立つ」ために書いた Skill は、ほぼ全部消えました。

### 条件2: 入力の起点が1つに固定されている

`generate-image` は記事の図解、`avoid-ai-writing-ja` は記事完成後、`*-cycle` は cron。起点が決まっていると、Skill が呼ばれるたびに「ああ、いつものやつね」と context の準備ができます。

逆に「いろんな場面で便利」を狙った Skill は、毎回 context を再構築する羽目になります。

### 条件3: SKILL.md を3か月書き換えていない

これは結果論ですが、3か月運用して書き換えなかった Skill だけが残りました。書き換え頻度は、その Skill の判断ロジックが固まっているかどうかの指標です。

書き換えが多い Skill は、まだ Skill にする時期ではないと割り切るのが楽でした。

## Skill にする / しない を分ける1つの基準

10→4の統合を経て、いまの私が新しい Skill を書く前に自問するのは1つです。

**「この処理は cron か file watcher か特定のフェーズから自動で呼べるか?」**

Yes なら Skill 化に意味があります。No なら、たぶん対話で都度書くか、Hook にするか、シェルスクリプトで済ませるかの3択です。

最初の10個を書いていた頃の私は、「便利そうだから」を起点に Skill を作っていました。便利そう、は罠です。Claude Code Skills は便利になるための道具ではなく、 **同じことを何度も繰り返す手順をパッケージ化するための道具** です。何度も繰り返さない手順をパッケージ化しても、起動時のオーバーヘッドだけが残ります。

10個書いて6個消した経験から言うと、最初から4個を目指して書くより、思い切り10個書いてから消すほうが、自分にとってどの Skill が機能するかが見えやすいです。消す勇気のほうが、書く勇気より高くつきます。私は6個消すのに3か月かかりました。

最初から完璧な Skill セットを目指す必要はないです。雇って、合わなかったら静かに別れる、それを3回繰り返すうちに「ああ、私の作業はだいたいこの4種類だな」が見えてきます。

---

Claude Code Skills の設計、フォルダ構成、運用フローの詳細は『[Claude Code Mastery](https://kenimoto.dev/ja/books/claude-code-mastery)』にまとめています。
