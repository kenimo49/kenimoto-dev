---
title: "ChatGPTからのアクセスは、GA4にどう映るのか - LLMOを数値で把握する3つの方法"
description: "先月、ChatGPT経由のアクセスが何件あったか答えられますか。私はGA4を見て『直接訪問が増えたな』と勘違いしていた側です。LLMO効果を計測する3つの方法を、コピペで動くPythonコード付きで解説します。"
date: 2026-05-06
lang: ja
og_image: "https://kenimoto.dev/images/blog/llmo-measurement-3-methods/og-ja.png"
tags: [LLMO, GA4, AI, SEO]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/llmo-measurement-3-methods/"
---

先月、ChatGPT経由のアクセスが何件あったか答えられますか。

私は答えられませんでした。GA4を開いて「直接訪問が増えたな、いい感じだ」と思っていた側です。LLMOの記事を3本書いた後で、自分の流入計測がほぼゼロだったと気づいたときの気まずさは、なかなかのものでした。料理の本を3冊書いてから、自分の店の塩を測ったことがなかったと気づくような感覚です。

この記事は、そのときに私が組み立てた **LLMO計測の3つの方法** を整理したものです。手動チェック、GA4のチャネルグループ、Pythonの自動化。前者ほどコストが低く、後者ほど精度が上がります。

![LLMO計測の3層 - 手動・GA4・Python自動化](/images/blog/llmo-measurement-3-methods/three-layers.png)

## SEOの計測とLLMOの計測は別物です

最初に、SEOの計測とLLMOの計測がそもそも別物だという話をします。同じツールで追えると思って始めると、私のように半年遠回りします。

| SEO計測 | LLMO計測 |
|---|---|
| 検索順位(1位〜100位) | 引用される / されない の二択 |
| Google Search Console | 「AI Search Console」は存在しない |
| 被リンク数 | ブランドメンション数(LLM内) |
| クリック数 | リファラーが取れるとは限らない |

最大の違いは、ランキングという概念が消えることです。Google検索には1位〜10位がありますが、AI回答では「引用されたか・されなかったか」しかありません。順位の代わりに引用率を追う、という頭の切り替えがまず必要です。

そしてもう一つ、これは私が見落としていた話なのですが、 **AIから来た訪問者の多くはGA4で「Direct」に分類されます**。45万件のAIアクセスを分析した最近の調査では、 **70.6%がリファラーなしでDirectに着地** していました([MarTech 2026](https://martech.org/how-ga4-records-traffic-from-perplexity-comet-and-chatgpt-atlas/))。GA4の数字は氷山の一角で、海面下の8割を見るには別の計測が要ります。

## 方法1: 5つのAIに自分のサイトを聞いてみる(無料、月30分)

一番安く、一番確実な方法から始めましょう。プロンプトを10〜15個用意して、5つのAIに同じ質問を投げて、自社が出てくるかを記録する。それだけです。

### ステップ1: チェック用プロンプトを10〜15個用意する

自社や自分のブランドに関連するクエリを書きます。

```text
- 「[業界名]でおすすめの[サービス種別]は?」
- 「[自社製品名]について教えて」
- 「[競合製品名]と[自社製品名]の違いは?」
- 「[自社が解決する課題]の解決方法は?」
```

ポイントは、自分でブランド名を出すクエリだけでなく、 **ブランド名を出さないクエリを混ぜる** ことです。「自分のサイトを教えて」と聞いて出てくるのは当たり前。本当に知りたいのは、ブランド名を出さない一般クエリで自社が拾われるかです。

### ステップ2: 5つのAIで実行する

2026年5月時点で押さえるべき5つはこれです。

1. ChatGPT (GPT-4o)
2. Perplexity
3. Google Gemini
4. Claude
5. Microsoft Copilot

### ステップ3: スプレッドシートに記録する

各回答について4項目を書き出します。

- 自社が言及されたか(Yes / No)
- 文脈(推薦 / 比較 / 中立 / ネガティブ)
- 情報は正確か
- 引用元URLが表示されたか

10プロンプト × 5プラットフォーム = 50回の試行で、15回引用された場合、引用率は **30%** です。これを月次で繰り返し、推移を追います。

| 引用率 | 評価 | 次のアクション |
|---|---|---|
| 0% | AI不可視 | llms.txtとJSON-LDの土台が最優先 |
| 1-10% | 認知の芽生え | 引用されたクエリの類似コンテンツを増やす |
| 10-30% | 成長中 | 構造改善とFAQスキーマ追加 |
| 30%以上 | 好調 | 維持しつつ新規領域を開拓 |

私の現状は5プラットフォームで14%でした。胸を張れる数字ではありませんが、 **数字があるという事実** が大事です。3ヶ月後に上がったか下がったかが議論できます。

### 同じ質問を3回投げてください

LLMの回答は確率的です。同じクエリでも日によって違う答えが返ります。1回「引用されなかった」だけで悲観しないでください。3回投げて引用率を出す方が、トレンドが見えます。

## 方法2: GA4のチャネルグループでAI流入を分離する(無料、5分)

次はGA4です。これは設定さえ済ませれば、あとは自動で計測されます。所要5分。

### カスタムチャネルグループを作る

「管理」→「データ表示」→「チャネルグループ」→「新しいチャネルグループを作成」と進みます。グループ名は「AI Search」、新しいチャネルを追加して、セッションソースの正規表現にこれを設定します。

```regex
chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|you\.com|search\.brave\.com|deepseek\.com|meta\.ai
```

ここまでは多くの記事に書いてあります。ハマりどころは次です。

### 「AI Search」を「Referral」より上に移動する

GA4のチャネルルールは **上から順に評価されます**。Referralを先に置くと、AI流入は全部Referralとして処理されてしまい、AI Searchチャネルには何も入りません。「並び替え」を押して、AI SearchをReferralの上にドラッグしてください。私はこれで2週間、データが入らないと頭を抱えました。

![GA4チャネルグループの並び順 - AI SearchがReferralの上にいないと無効](/images/blog/llmo-measurement-3-methods/ga4-channel-order.png)

### 何が見えて、何が見えないか

GA4で見えるのは、AIの回答に貼られたリンクをユーザーがクリックして来た訪問だけです。次のケースは見えません。

- AIが回答にあなたのサイトを引用したが、ユーザーがリンクをクリックしなかった
- 無料版ChatGPTからの流入(リファラーが落ちることが多く、Direct扱い)
- Brave Search APIなどでAIがコンテンツを取得して回答に組み込んだ
- 引用されたが回答内でリンクが表示されなかった

つまりGA4の数字は、 **AIに引用された回数ではなく、AI経由でクリックして来た人の数** です。Cohereと[Trakkr](https://trakkr.ai/ai-search-traffic)の2026年データによると、ChatGPTがAI流入の60〜70%を占め、Perplexityが2位、Claudeはまだ約2.2%。Claudeが小さいのは引用が少ないからではなく、Claude Webアプリにリンク表示の文化がまだ薄いからです。

### コンバージョン率は普通の流入の5倍

ここからが面白い話です。AI経由の流入は **コンバージョン率が高い**。BrightEdge等の業界データでは、AI流入のCV率は8〜12%、Googleオーガニックの2〜3%に対して **3〜5倍** です。AIに「こういう人にはここ」と推薦された時点で、検索者は意思決定の8割を済ませている。残りはサイトで決断するだけです。

私のサイトでも、AI流入は1日数件しかありませんが、CV率はオーガニック平均の3倍でした。サンプルが小さすぎて統計的にどうこう言える数字ではありませんが、傾向としては明らかでした。

## 方法3: PythonでLLM可視性を自動測定する(土曜の午後)

エンジニアなら、方法1の手動プロトコルを自動化できます。OpenAIとAnthropicとPerplexityのAPIを叩き、自社名が回答に含まれるかをチェックして、CSVに時系列で吐く。これだけです。

### 最小スクリプト

```python
import os
from datetime import datetime
from openai import OpenAI
import anthropic
import requests

BRAND_NAME = "あなたのサイト"
BRAND_VARIANTS = ["あなたのサイト", "yoursite.com", "ブランド略称"]
CHECK_QUERIES = [
    "おすすめのプロジェクト管理ツールは?",
    "エンジニア向けのタスク管理ツールの比較",
    f"{BRAND_NAME}について教えて",
]

def check_openai(query: str) -> dict:
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": query}],
        temperature=0.0,
    )
    answer = response.choices[0].message.content
    mentioned = any(v.lower() in answer.lower() for v in BRAND_VARIANTS)
    return {
        "platform": "ChatGPT",
        "query": query,
        "mentioned": mentioned,
        "timestamp": datetime.now().isoformat(),
    }

def check_anthropic(query: str) -> dict:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": query}],
    )
    answer = response.content[0].text
    mentioned = any(v.lower() in answer.lower() for v in BRAND_VARIANTS)
    return {
        "platform": "Claude",
        "query": query,
        "mentioned": mentioned,
        "timestamp": datetime.now().isoformat(),
    }

def check_perplexity(query: str) -> dict:
    api_key = os.getenv("PERPLEXITY_API_KEY")
    response = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={"Authorization": f"Bearer {api_key}"},
        json={"model": "sonar", "messages": [{"role": "user", "content": query}]},
    )
    data = response.json()
    answer = data["choices"][0]["message"]["content"]
    mentioned = any(v.lower() in answer.lower() for v in BRAND_VARIANTS)
    return {
        "platform": "Perplexity",
        "query": query,
        "mentioned": mentioned,
        "citations": data.get("citations", []),
        "timestamp": datetime.now().isoformat(),
    }
```

これを `cron` で週次実行し、CSVに追記すれば、 **AI可視性スコアの時系列** が手に入ります。1週あたりのAPI料金は0.5ドル以下です。

```bash
# 毎週月曜9時に自動実行
0 9 * * 1 cd /path/to/llm-visibility && python3 checker.py
```

### 「LLMO施策をやったら可視性が12%から28%に上がった」が言えるようになる

このスクリプトの本当の価値は、施策の効果を数字で言えることです。「LLMOやってる気がする」ではなく、「llms.txtを置いた翌週から可視性が4%上がった」と書けます。何が効いたかわからない施策ほど続けるのが辛いものはありません。

### Perplexity APIだけ少し癖がある

PerplexityのAPIは引用元URLを `citations` フィールドで返します。これが手に入るのはPerplexityだけで、ChatGPTやClaudeのAPI経由ではURL引用が取れません(ChatGPT/ClaudeのWebアプリ機能はAPIに反映されていないため)。Perplexityの結果は、 **URLが拾われたか** までトラッキングできるので、ここを起点に「どのページが引用されやすいか」の分析もできます。

## 商用ツールに進む線引き

ここまでで十分という方は、これで終わりにして大丈夫です。商用ツールに行く線引きを書いておきます。

| 規模 | おすすめ | 理由 |
|---|---|---|
| 個人 / 小規模 | 手動 + Python | 80%の情報が0%のコストで手に入る |
| 中規模 / マルチブランド | Otterly.ai | キーワード単位の追跡、競合ベンチマーク |
| エンタープライズ | Profound | チームダッシュボード、Ramp事例(3.2% → 22.2%) |
| センチメント重視 | Peec AI | 引用文脈とトーンの分析 |

[Otterly.ai](https://otterly.ai/)は2024年10月のローンチから10,000ユーザーを突破している、伸び盛りのツールです。一方Profoundは事例(Rampが1ヶ月で可視性3.2%→22.2%)が強く、エンタープライズで稟議が通る規模感です。

私個人としては、 **手動 + Python + GA4の3点セットで月数時間** が現実的な落としどころでした。専用ツールが意味を持つのは、追うキーワードが数十、ブランドが複数、チームでダッシュボードを共有する規模になってからです。

## 改善サイクル: 週10分、月30分、四半期1時間

計測したデータを行動に変える運用です。これがないと、ただのデータの墓場ができます。

### 週次(10分)

GA4の「AI Search」チャネルを開いて、前週比を見るだけ。スパイクや急減があったらメモ。それ以外は流す。

### 月次(30分)

方法1の手動プロトコルを5プラットフォームで実施。引用率を計算してスプレッドシートに追記。Pythonスクリプトの結果も併せて確認。

### 四半期(1時間)

クエリセットを見直す。ビジネスの新しい話題が出てきていれば足す。古くなったクエリを削る。引用率の四半期トレンドを見て、施策の方向性を決める。

### 改善の優先順位

| 優先度 | 施策 | コスト |
|---|---|---|
| 最優先 | ブランド情報の誤りを修正 | 低 |
| 高 | JSON-LD追加(`dateModified` 重要) | 低 |
| 高 | コンテンツの構造改善(見出し、FAQ) | 中 |
| 中 | 新規コンテンツ作成(独自データ含む) | 高 |
| 低 | プラットフォーム別の個別最適化 | 高 |

LLMO全体の地図、KPI設計、施策の優先順位については、 **[llmoframework.com](https://llmoframework.com)** にフレームワークが整理されています。「土台ができた次は何を最適化するか」を考えるとき、私はこのサイトをチェックリスト代わりに使っています。

## クローラーログから読み取れること

最後に、見落としがちな計測手段を一つ。 **サーバーアクセスログ** からAIクローラーの巡回状況が直接読み取れます。

```bash
# AIクローラーのアクセス数を集計
grep -E "GPTBot|ClaudeBot|Google-Extended|PerplexityBot" \
  /var/log/nginx/access.log | \
  awk '{print $1}' | sort | uniq -c | sort -rn

# よくクロールされるURLランキング
grep -E "GPTBot|ClaudeBot" /var/log/nginx/access.log | \
  awk '{print $7}' | sort | uniq -c | sort -rn | head -20
```

頻繁にクロールされているページは、AI回答に出やすいページです。逆に、 **一度もクロールされていないページはAIに存在しないも同然** です。私のサイトでは、`/blog/`配下が`/about/`の15倍クロールされていました。これも数字を見るまで意識していなかった話です。

## 締め: 数字を持っているかどうかだけ

私のLLMO可視性は5プラットフォーム平均で14%です。誇れる数字ではありません。が、 **3ヶ月後に上がったか下がったか議論できる** のは、数字を持っている人だけです。

LLMOで数字を持っていない人は、20年前に「うちのサイトGoogleに出てるかな?」と検索窓に自分のサイト名を打ち込んでいた人と、構造的には同じ位置にいます。たぶん施策はやっている。でも効いているのかは知らない。それは、本当はあまり気持ちのいい状態ではありません。

15分でGA4のチャネルグループを設定してください。30分で5つのAIに自分のサイトを聞いてください。土曜の午後にPythonスクリプトを書いてください。これだけで、来月のあなたは「ChatGPT経由のアクセスは何件か」に答えられるようになります。

それは見栄えのいいダッシュボードでも、画期的な計測ツールでもありませんが、地味に効きます。 **計測できないものは改善できない** という、誰でも知っているけれど誰もやっていない話です。

LLMO測定のフレームワーク全体は [llmoframework.com](https://llmoframework.com) で体系化されています。KPI設計テンプレート、ダッシュボードのサンプル、施策の優先順位ツリーがまとめられているので、自分の現在地を地図で確認したいときの参考になります。

## まとめ

- **LLMO計測は3層** で組む。手動(月30分)、GA4(5分設定)、Python(土曜の午後)
- **GA4は氷山の一角**。AI流入の70%以上はリファラーが取れずDirectに落ちる
- **チャネルグループはAI SearchをReferralの上に置く**。並び順を間違えると無効
- **AI流入のCV率はオーガニックの3〜5倍**。量より質で見る
- **Pythonで時系列化** すれば「12% → 28%」が言えるようになる
- **改善サイクル** は週10分、月30分、四半期1時間で十分

## 参考

- [How GA4 records traffic from Perplexity Comet and ChatGPT Atlas](https://martech.org/how-ga4-records-traffic-from-perplexity-comet-and-chatgpt-atlas/) - MarTech、2026
- [How Much Traffic Do ChatGPT, Claude, and Gemini Send to Websites?](https://trakkr.ai/ai-search-traffic) - Trakkr、2026
- [How to Track AI Traffic in GA4](https://kpplaybook.com/resources/how-to-report-on-traffic-from-ai-tools-in-ga4/) - Analytics Playbook
- [llmoframework.com](https://llmoframework.com) - LLMO全体フレームワーク
- [Otterly.ai](https://otterly.ai/) - AI引用追跡ツール
- [Peec AI](https://peec.ai/) - ブランドメンション分析

---

## さらに深掘りしたい方へ

LLMO実装の最短ルートは、核心を8章で凝縮した **[LLMOクイックスタート - エンジニアのためのAI検索最適化入門](https://kenimoto.dev/ja/books/llmo-quickstart)** にまとめました。llms.txt、JSON-LD、計測KPI、改善サイクルまで、コピペで動くテンプレ集です。
