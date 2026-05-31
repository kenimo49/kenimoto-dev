---
title: "同じ質問なのに、LLMから5つの違う回答が返ってきた — Context Engineering 入門"
description: "プロンプトを工夫すれば賢くなる、と私も信じていました。Haikuで4.6倍の品質差を見るまでは。同じLLMに同じ質問をしただけで結果が2.2倍〜4.6倍ぶれる理由を、5つのコンテキスト戦略の実験データで読み解きます。"
date: 2026-05-08
lang: ja
tags: [AI, ContextEngineering, Claude, LLM]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/context-engineering-introduction-five-strategies/"
og_image: "https://kenimoto.dev/images/blog/context-engineering-introduction-five-strategies/og-ja.png"
---

同じLLMに、同じ質問をしました。それなのに、5つの全く違う回答が返ってきました。

私が試したのは、架空の社内ツール「PropelAuth」の組織管理機能について教えて、というシンプルな質問です。Claude Sonnet 4で5回。Claude Haiku 3で5回。1問ずつコンテキストの渡し方だけを変えて、回答品質を採点しました。

結果は、Sonnet で **2.2倍**、Haiku で **4.6倍** の差でした。プロンプトの言い回しを変えたわけではありません。質問の本文は1文字も触っていません。違ったのはモデルが「見ていた周辺情報」だけです。

私も最初は「プロンプトを工夫すれば賢くなる」と信じていました。Haikuで4.6倍を見るまでは。

この記事は、その実験の話です。そしてなぜ今「Prompt Engineering」ではなく「Context Engineering」と呼ぶべきなのかという話です。

## 結論: LLMの品質はコンテキストで決まる

先に全体像を見てください。

![5つのコンテキスト戦略と総合スコア比較(Sonnet/Haiku)](/images/blog/context-engineering-introduction-five-strategies/five-strategies.png)

評価軸は4つで、各0〜5点の合計20点満点です。

- **事実正確性**: 回答が実際の仕様と合致しているか
- **幻覚抑制**: 根拠のない情報を作らずに済んでいるか
- **具体性**: 実用的な詳細情報を含むか
- **誠実性**: 不確実さや限界を伝えているか

5つの戦略は次の通りです。

| 戦略 | 概要 | Sonnet 4 総合 | Haiku 3 総合 |
|---|---|---|---|
| 戦略1: コンテキストなし | 質問だけを渡す | 5.3 | 2.2 |
| 戦略2: System Promptのみ | 役割と禁則だけ与える | 8.8 | 3.7 |
| 戦略3: System + Few-shot | 良い回答例を見せる | 10.0 | 8.2 |
| 戦略4: System + RAG | 関連ドキュメントを検索注入 | 10.2 | 11.8 |
| 戦略5: フルコンテキスト | 上記を全部組み合わせる | 11.4 | 10.1 |

Haiku で戦略4が最高点になっているのは、たまたまではありません。後で詳しく書きます。

## 5つの戦略を1問ずつ見る

### 戦略1: コンテキストなし(Sonnet 5.3 / Haiku 2.2)

質問だけを丸投げした場合、Sonnet はこう返します。

```text
PropelAuthは認証サービスとして、組織管理機能を提供しています。

組織の作成:
- 管理者がダッシュボードから新しい組織を作成
- 組織名とドメインを設定
- 初期設定でSSO連携も可能

ユーザーの招待:
- メール招待機能を使用
- 招待リンクの有効期限は24時間
- 一括招待にも対応
```

一見、的確な答えに見えます。問題は、PropelAuth が **架空のツール** だということです。実在しません。LLMは「知らないはずの製品」について、堂々と具体的な機能を作り上げて回答していました。

具体性は4.2点と高いのに、事実正確性は0.6点です。私はこれを「自信たっぷりの嘘」と呼んでいます。新人社員が、入社初日に引き継ぎ資料ゼロで「弊社の顧客管理システムを説明してください」と振られて、それらしいことを口走っている状態です。

### 戦略2: System Promptのみ(Sonnet 8.8 / Haiku 3.7)

System Prompt に「知らない情報については『不明』と答えてください」と1行加えました。回答はこう変わります。

```text
申し訳ございませんが、PropelAuthという特定のツールについての
詳細な組織管理機能については、正確な情報を持っておりません。

一般的な認証サービスの組織管理機能としては以下のような要素が
考えられますが、PropelAuth固有の実装については不明です。
```

誠実性は0.2点から3.7点へ大幅に改善しました。一方、事実正確性は0点のままで、具体性も4.2点から1.7点へ落ちました。

これがコンテキスト設計の最初のトレードオフです。「知らないなら知らないと言え」と命じた瞬間、モデルは賢く謙虚になります。同時に、何の役にも立たなくなります。

### 戦略3: System + Few-shot(Sonnet 10.0 / Haiku 8.2)

System Prompt に加えて、別ツールの良い回答例を2件 Few-shot として見せました。

これだけで Haiku は **3.7点から8.2点へ2.2倍** にジャンプします。Sonnet も10.0点に到達しました。

なぜ効くのか。LLM は「お手本に近い形式で答える」傾向が強いからです。誠実性と幻覚抑制が同時に上がるのは、お手本が「分からないことは正直に書く」型だったからです。形式を見せるだけで、行動が変わります。

### 戦略4: System + RAG(Sonnet 10.2 / Haiku 11.8)

PropelAuth の(架空の)公式ドキュメントを検索インデックスに入れて、質問に関連する2チャンクをコンテキストに注入しました。

ここで Haiku の総合スコアが **11.8点** まで跳ね上がります。Sonnet (10.2点)を超えました。これが今回の実験で一番面白かった結果です。

つまり「Sonnet < Haiku」という逆転が起きています。同じプロンプトなら Sonnet のほうが賢い、というのは半分しか正しくありません。**Haiku に正しいコンテキストを渡したほうが、Sonnet に何も渡さないより事実正確に答える**。これが Context Engineering を学ぶ価値の核心です。

私はこの結果を [安いモデルが勝った話](https://kenimoto.dev/blog/cheap-model-won-context-beats-parameters)(英語版) で詳しく書きました。同じ筋の話の、別の角度からの記録です。

### 戦略5: フルコンテキスト(Sonnet 11.4 / Haiku 10.1)

System Prompt + Few-shot + RAG + ツール定義 + 構造化出力。全部入りです。

Sonnet では総合11.4点と最高点になります。一方、Haiku は **10.1点** で、戦略4(11.8点)より下がりました。Haiku は「全部足したら下がった」のです。

ここに、もう一つ重要な学びがあります。**コンテキストは足せば足すほど良い、ではない**。詳しい話は [RAGに4層足したら12%だけ改善した話](https://kenimoto.dev/blog/full-context-engineering-rag-80-percent)(英語版) で書きました。一文で要約すると、小さなモデルは Working Memory が狭いので、過剰なコンテキストが本来の検索結果を端に押しやってしまいます。

## なぜ架空のツールで実験したのか

Firebase や Supabase のような実在ツールで実験すると、LLM の学習済み知識が混入してしまいます。そうなるとコンテキストの効果と、もともと知っていた知識との切り分けができません。

PropelAuth、StormDB、FlowPipe といった架空ツールを使った理由は、**LLM が「知らないはず」の情報を再現性高く扱う** ためです。新人社員に対して、自社にしかない専門用語の質問をするのと同じです。引き継ぎ資料があれば答えられる、無ければ堂々と嘘をつく。あの行動が、定量的に観察できます。

## 2026年5月時点で前提が変わった部分

この実験は元々 Claude Sonnet 4 / Haiku 3 + 200K コンテキストの時代に走らせたものです。読者から「2026年の今でも有効なのか」と問われそうな点をいくつか補足します。

**1M コンテキスト窓は数字を直接は変えません**。Anthropic は2026年2月に [Sonnet 4.6 で1Mコンテキストを標準価格で提供](https://signals.aktagon.com/articles/2026/03/claude-opus-4.6-and-sonnet-4.6-now-feature-1m-context-window-at-standard-pricing/) し始めました。窓が広くなっても、モデルが見るべきものは「正しい情報」のままです。窓が広いのは「悪いコンテキストを長く書いても落ちない余裕」が生まれただけで、品質を上げる本体はあくまで「何を入れるか」です。

**Prompt Caching はコストの話で、品質の話ではありません**。キャッシュヒット時にコストが90%減るので、Few-shot や System Prompt を毎回送っても支払いが激しく増えません。ただし、Haiku の戦略5が10.1点に落ちる現象はキャッシュとは無関係です。キャッシュは「下がったスコアを安くする」だけで、上げてはくれません。

**Context Engineering という言葉は2026年に定着しました**。Anthropic 公式ブログでも頻出するようになり、[Claude Sonnet 4.6 のコンテキスト窓を活かす考え方](https://www.aiforanything.io/blog/claude-sonnet-4-6-1m-context-window-guide) として広まっています。「Prompt Engineering の延長」ではなく「設計領域が違うもの」と扱うのが標準になりつつあります。

## 何が分かったか(まとめ)

5つの戦略を1問ずつ試した結果、私の中で線が引き直されました。

1. **品質はプロンプトの言い回しでは決まらない**。System Prompt 1行追加するだけで誠実性は18倍に変わる(Sonnet で0.2 → 3.7)。同じLLMに同じ質問をしても、コンテキストで挙動が別物になります
2. **小さいモデル + 良いコンテキスト > 大きいモデル + 雑なコンテキスト**。Haiku 3 + RAG (11.8点) が Sonnet 4 + フルコンテキスト (11.4点) を超えた事実が、Context Engineering の存在意義そのものです
3. **足せば足すほど良いわけではない**。Haiku では戦略5が戦略4を下回りました。「全部入り」は最強プリセットではない
4. **誠実性・幻覚抑制・具体性・事実正確性の4軸はトレードオフ**。具体性を上げると幻覚が増える。誠実性を上げると具体性が下がる。すべてを高いレベルで両立させるのが Context Engineering の本来の仕事です

Prompt Engineering を捨てる必要はありません。**Context** という、もう一段太い文脈設計を足すだけです。

## 次の一歩

この記事を読んだ直後にできる、5分の実験を1つ提案します。

1. 自分の使っている LLM に、**架空の社内ツール名** で質問してみてください。「DataSync Pro」「TeamFlow Hub」あたりで十分です
2. その回答の具体性と誠実性を、5段階で自分でメモする
3. 次に「あなたは知らないことについては『不明です』と答えてください」を System Prompt に1行加えて、同じ質問をする
4. 2つの回答を比べる

これだけで、戦略1と戦略2の差が、自分の手で再現できます。Few-shot まで足せば、Haiku が Sonnet を超える瞬間も自分で見られます。高級モデルが安いモデルに負ける気まずさ込みで、Context Engineering は5分で味見できる技術です。

---

## この記事の要点を、12枚のスライドに

「同じ質問なのに5つの違う回答」から、5戦略・RAG・MCPまで、Context Engineeringの全体像を12枚にまとめました。スライドだけでも流れがつかめます。

<script async class="docswell-embed" src="https://www.docswell.com/assets/libs/docswell-embed/docswell-embed.min.js" data-src="https://www.docswell.com/slide/KDM24D/embed" data-aspect="0.5625"></script><div class="docswell-link"><a href="https://www.docswell.com/s/kenimo49/KDM24D-context-engineering">LLMを"嘘つき"から"専門家"に変える ― Context Engineering 実践入門 by @kenimo49</a></div>

## もっと深く学びたい方へ

5戦略の詳細、RAG実装、MCPサーバー設計、Agentic RAG までを通しで扱った [LLM を「嘘つき」から「専門家」へ変える Context Engineering 実践ガイド](https://kenimoto.dev/ja/books/context-engineering?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=context-engineering-intro) を Zenn と Kindle で公開しています。本記事の実験データもすべて同書からの抜粋です。
