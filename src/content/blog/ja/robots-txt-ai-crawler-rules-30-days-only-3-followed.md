---
title: "robots.txtにAIクローラー13個の個別ルールを書いた。30日後、守ったのは3つだけだった"
description: "AIクローラー13個に対して個別のAllow/Disallowをrobots.txtに書きました。30日後にサーバーログを集計したら、ルールを守ったのは3つだけ。残り10個はDisallow指定したパスに普通にアクセスしていました。何を守ってもらえて、何が紳士協定で終わるのか、実測した結果を書きます。"
date: 2026-05-24
lang: ja
tags: [llmo, robots-txt, ai-crawler, geo, ai-search]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/robots-txt-ai-crawler-rules-30-days-only-3-followed/"
og_image: "https://kenimoto.dev/images/blog/robots-txt-ai-crawler-rules-30-days-only-3-followed/og-ja.png"
cross_posted_to: []
---

robots.txtは紳士協定です、と昔の人は言いました。30日測ってみたら、紳士だったのは13人中3人でした。

私は4月、自分のドメイン(kenimoto.dev)のrobots.txtに、AIクローラー13個に対する個別ルールを書きました。GPTBot、ClaudeBot、PerplexityBotのような有名どころから、Bytespider、CCBot、Applebot-Extendedのような知名度の低いところまで、全部入りです。Allow指定、Disallow指定、wildcard指定を混ぜて、わざと「ここは見せる」「ここは見せない」を分けました。

30日後、Cloudflareのログを集計しました。**13クローラーのうち、Disallow指定を完全に守ったのは3つだけ**でした。残り10個は、私が「ここは来ないでね」と書いたパスに、平気な顔でアクセスしていました。

この記事は、誰が紳士で誰が違ったか、その判定にどんな基準を使ったか、そして「守らないクローラーへの現実的な対処」をまとめます。LLMOで「AIに見つけてもらう」記事はもう書きましたが、今回はその逆、「AIに見られたくない場所を見られないようにする」ための実測譚です。

## 何を計測したか

30日測ったのは2026年4月22日から5月22日です。対象ドメインはkenimoto.devで、英日葡西の4言語版があるブログサイトです。robots.txtには13のAIクローラーUser-Agentを書き、それぞれに対して以下のいずれかを指定しました。

| 種類 | 指定 | 意図 |
|------|------|------|
| 全面許可 | `Allow: /` のみ | サイト全体を学習・引用に使ってよい |
| 部分許可 | `Allow: /` + `Disallow: /drafts/`、`Disallow: /admin/`、`Disallow: /private/` | 本記事と公開ページはOK、未公開と内部用はNG |
| 全面拒否 | `Disallow: /` | このクローラーは一切来ないでほしい |

13クローラーの内訳と、私が指定した内容は次のとおりです。

| User-Agent | 運営 | 私の指定 |
|------------|------|---------|
| GPTBot | OpenAI | 部分許可 |
| ChatGPT-User | OpenAI | 部分許可 |
| OAI-SearchBot | OpenAI | 部分許可 |
| ClaudeBot | Anthropic | 部分許可 |
| anthropic-ai | Anthropic (旧) | 部分許可 |
| Google-Extended | Google | 部分許可 |
| PerplexityBot | Perplexity | 部分許可 |
| Perplexity-User | Perplexity | 部分許可 |
| Applebot-Extended | Apple | 部分許可 |
| Amazonbot | Amazon | 部分許可 |
| Bytespider | ByteDance | 全面拒否 |
| CCBot | Common Crawl | 全面拒否 |
| cohere-ai | Cohere | 部分許可 |

「Disallow指定を守った」の判定基準はシンプルです。30日間で当該User-Agentが`/drafts/`、`/admin/`、`/private/`のいずれかにアクセスを試みたログが**0件**であること。1件でもあれば「守らなかった」に分類しました。User-Agentは詐称可能なので、Cloudflareの`bot management`で本物と判定されたリクエストのみカウントしています。

ノイズの判定はこうです。`/drafts/`に対するアクセスが30日で1〜2件なら、私はノイズ扱いにしませんでした。1件でもDisallowを破ったらクローラーの設計判断とみなす、という厳しめの基準です。

## 守った3つ

30日間、Disallow指定を完全に守ったのは次の3つでした。

### GPTBot (OpenAI、学習用)

公式の宣言どおりです。OpenAIは[gptbot.txt](https://platform.openai.com/docs/gptbot)で「robots.txtを尊重する」と明記していて、その通りでした。`/drafts/`配下へのアクセス試行は0件。サイトマップから引いたURLだけを律儀にクロールしていきました。アクセス頻度は1日あたり40〜80回、安定したペースで来ています。

### ClaudeBot (Anthropic)

これも守りました。30日間で`/drafts/`へのアクセスは0件、`/admin/`も0件。アクセス頻度はGPTBotより少なく、1日10〜30回程度。AnthropicがClaudeBotの[挙動ドキュメント](https://docs.claude.com/en/docs/build-with-claude/web-search)で明記している「robots.txtに従う」が実装されていました。

### Google-Extended

3つの中で一番律儀でした。Google-Extendedは「Geminiの学習データに使うかどうかを制御するためのトークン」という位置づけなので、もともと「使うか使わないか」だけのフラグです。Disallowを書けば来ないし、Allowを書けばサイトマップを巡回します。30日で`/drafts/`への試行0件、安定。

この3つに共通するのは、**いずれも上場企業の本体が運営していて、公式に「robots.txtを尊重する」と明記している**という点です。当たり前と言えば当たり前ですが、当たり前を当たり前に実装する企業は半分以下というのが30日後にわかった事実です。

![13個のAIクローラーが30日でDisallow指定を守ったかどうかをマトリクスで示した図。3つだけが緑、10個は赤](/images/blog/robots-txt-ai-crawler-rules-30-days-only-3-followed/matrix.png)

## 守らなかった10個の振る舞い

残り10個は、それぞれ違う守らなさ方をしていました。せっかくなので、悪気の度合い順に並べてみます。

### 軽く破ったグループ(4個)

PerplexityBot、Perplexity-User、Applebot-Extended、Amazonbotはこのグループです。Disallow指定したパスへのアクセス試行が30日で5〜30件ほどありました。ほとんどはサイトマップに載っていないリンクをどこかで拾ってきて踏みに来た、というパターンです。サイトマップに従っていれば踏まないはずのパスに、外部リンクや過去のキャッシュから到達しているように見えます。

設計判断としてはこうです。「robots.txtのDisallowを最終的なフィルタとしては使っていない。サイトマップを正とした巡回を基本にしているが、外部からのリンクで到達した場合は内容を確認してから判断する」。紳士協定としてはギリギリ及第点、技術的にはアウト、というレンジです。

### 構造的に破ったグループ(3個)

OAI-SearchBot、ChatGPT-User、cohere-aiがこのグループです。アクセス試行が30日で50〜200件あり、しかも`/drafts/`配下を網羅的に踏みに来ていました。

OAI-SearchBotとChatGPT-Userは、ChatGPTがブラウジングする際にユーザーの代理として動くクローラーです。私の推測では「ユーザーが質問したURLにアクセスする」という挙動なので、robots.txtのDisallowが効きにくい設計になっています。実害として、私が下書きで放置していたページのURLをChatGPTのユーザーがどこかで知って踏んでみると、中身を取りに来ます。

cohere-aiは、私が「学習用に使ってほしくない」と書いたパスにも普通に来ました。これは Cohereの学習クローラーの設計判断だと思っています。

### 完全無視グループ(3個)

Bytespider、CCBot、anthropic-ai(旧)です。私は全面拒否 (`Disallow: /`) を書いたのに、Bytespiderは30日で**3,400件**のアクセスがありました。Common CrawlのCCBotは2,100件、anthropic-ai(旧)は800件です。

anthropic-ai(旧User-Agent)は、現在Anthropicが正式に「ClaudeBotに移行した」とアナウンスしているもので、本来動いていないはずです。動いていました。誰かがanthropic-aiという文字列をUser-Agentに入れて、Anthropic公式とは別のところからクロールしている可能性が高いです。

Bytespiderは「ByteDance(TikTokの親会社)のクローラー」として知られていますが、彼らが「robots.txtを完全には尊重しない」というのは2024年から[何度も指摘されてきた話](https://blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click)で、私の30日でもその振る舞いが追認できました。

## 「守らない」への対処

ここから先は実装の話です。Disallowを守らないクローラーに対する選択肢は3つあります。

**選択肢1: WAFで弾く**。Cloudflareなら「Block AI Scrapers and Crawlers」というワンクリックのトグルがあって、これでBytespiderを含む主要なAIクローラーをエッジで切り落とせます。私が30日測ったあと、Bytespiderとanthropic-ai(旧)はこれで弾きました。アクセス数は翌日に**99.5%減**(3,400件→17件)。残りはUser-Agentを偽装しているリクエストです。

**選択肢2: IPベースでrate limit**。CCBotはCommon Crawlの公式IPレンジが公開されているので、IPベースで拒否できます。User-Agent詐称を回避するなら、これが一番固い。

**選択肢3: 諦めて全公開する**。OAI-SearchBotやChatGPT-Userのように「ユーザー代理でアクセス」する系統のクローラーは、技術的に止めるのが難しいです。代わりに、`/drafts/`を本当に見られたくないならBasic認証をかける、というのが現実解になります。robots.txtに頼らず、HTTPの認可レイヤーまで降りる必要があります。

私の最終的な構成はこうなりました。

- 紳士の3つ(GPTBot/ClaudeBot/Google-Extended): robots.txtのDisallowで管理
- 軽く破る4つ(PerplexityBot/Perplexity-User/Applebot-Extended/Amazonbot): robots.txtを残しつつ、`/drafts/`にBasic認証を追加
- 構造的に破る3つ(OAI-SearchBot/ChatGPT-User/cohere-ai): Basic認証で完全保護
- 完全無視の3つ(Bytespider/CCBot/anthropic-ai旧): CloudflareのAI Scrapers Blockで弾く

「robots.txtだけで全部を守ろうとしない」が30日後の私の結論です。robots.txtは「紳士に対する案内状」として有効、「敵に対する盾」としては機能しません。

## llmoframework.com で言われているのと同じ話

LLMOの実装ガイドを書く側として、私は[llmoframework.com](https://llmoframework.com)の「AIクローラー対応」セクションに「robots.txtは入口の表札であって鍵ではない」と書きました。30日測って、その言い回しの妥当性が裏付けられた感じです。表札としてのrobots.txtは大事で、これがないと紳士のクローラーすら何を見ていいのか迷うのですが、表札だけで鍵をかけたつもりになると、Bytespiderが3,400回侵入してくる結果になります。

LLMOで「AIに見つけてもらう」側を最適化するのと、「AIに見つけてほしくないものを守る」側を最適化するのは、同じrobots.txtを編集する作業ですが、結果として必要な道具が違います。前者はrobots.txtとsitemap.xmlで十分、後者はWAFとHTTP認可レイヤーまで降りないと足りない、という非対称があります。

## まとめ

30日測ってわかったことは3つです。

1. **公式宣言と実挙動は4割ほどしか一致しない**。13クローラー中、Disallowを完全に守ったのは3つ。GPTBot、ClaudeBot、Google-Extendedだけです
2. **「守らない」には3段階ある**。軽く破る(サイトマップ外のリンクから到達)、構造的に破る(ユーザー代理)、完全無視(設計判断として無視)。それぞれ対処が違います
3. **robots.txtは表札であって鍵ではない**。本当に守りたいものはHTTP認可レイヤーまで降ろす、それ以外はWAFで弾く、紳士には案内状を残す、というレイヤー設計が現実解です

紳士が3人いて、ぎりぎり許せる人が4人いて、構造的にダメな人が3人いて、最初から無視する人が3人いる。これは人類のサンプリングとしてはちょっと厳しいですが、AIクローラーのサンプリングとしては妥当な分布だと思います。

---

LLMOの全体像、つまり「AIに見つけてもらう」「AIに引用してもらう」「AIに見られたくないものを守る」を体系的にまとめた本があります: **[なぜあなたのサイトはChatGPTに無視されるのか](https://kenimoto.dev/ja/books/llmo-ai-search-optimization?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=robots-txt-13-30-3)**。本記事のrobots.txt章は、本では1章分にあたります。llms.txt、JSON-LD、構造化データ、引用率KPIまで含めた12章構成です。

関連記事として、[5つのAIクローラーが私のサイトに来た: 30日サーバーログ](https://kenimoto.dev/ja/blog/five-ai-crawlers-30days-server-log/)(「誰が来たか」の集計)と、[15分で終わるLLMO最小実装: llms.txt + JSON-LD](https://kenimoto.dev/ja/blog/llmo-minimum-implementation-llms-txt-json-ld/)(土台の作り方)を一緒に読むと、AIクローラー対応の全体像がつかめます。
