---
title: "JSON-LDを11スキーマ入れた。3ヶ月測ったら、AIが拾っていたのは3つだけだった"
description: "3ヶ月前にJSON-LDを11スキーマ束ねて<head>に入れました。AI引用を3ヶ月追跡したら、効いていたのは3つだけ。残り8つはHTMLコメントと同等の存在感でした。どれが効いてどれが死んでいたか、実測の話です。"
date: 2026-05-25
lang: ja
translation_key: json-ld-11-only-3-cited
tags: [LLMO, JSON-LD, SchemaOrg, AI]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/json-ld-11-only-3-cited/"
og_image: "https://kenimoto.dev/images/blog/json-ld-11-only-3-cited/og-ja.png"
cross_posted_to: []
---

3ヶ月前、私はサイトの`<head>`にJSON-LDを11スキーマ束ねました。Organization、WebSite、Person、Service 4個、Book 2個、MusicGroup、FAQPage。実装した瞬間は満足でした。

そのあと、AIエンジンが実際にどれを拾っているかを測りました。

11個のうち、3ヶ月の引用ログに姿を見せたのは3つだけ。残り8個は、HTMLコメントとほぼ同等の存在感でした。

これは測定の記録です。どの3つが仕事をして、どの8つが死んでいて、それでも私が同じ実装を選び直すなら何を残すか、という話です。

![11スキーマの引用率実測ランキング。3つだけが姿を見せた](/images/blog/json-ld-11-only-3-cited/schemas-ranking.png)

## 何を入れて、なぜ効くと思っていたか

実装そのものは単純でした。Astroのレイアウトに11スキーマを配列で1本にまとめて、`<script type="application/ld+json">`でサーバーレンダリングする。詳細は[JSON-LD 11スキーマ統合実装ガイド](https://kenimoto.dev/ja/blog/json-ld-11-schemas-llm-understanding/)に書いた通りです。

3ヶ月前の私の理屈はこうでした。

- 構造化シグナルは多いほど引用機会が増える
- LLMは`knowsAbout`を好む、だからPersonが切り札になる
- Serviceで「何を売っているか」を伝える
- Bookで出版物を浮上させる
- MusicGroupまで入れた、副業プロジェクトがあるので、入れない手はない

LLMOにおける「多ければ多いほど良い」の典型的な発想です。私はその典型でした。

## 測り方

2026年2月末から5月末まで、3ヶ月のトラッキング実験を回しました。ルールは次の通り。

- 50個のブランド・トピッククエリを最初に書いて、毎週使い回す
- AIエンジンは4種類: ChatGPT (Search), Perplexity, Claude (検索有効), Brave Leo
- 毎週、50問×4エンジンを実行
- 引用が出たら、その引用断片に含まれる情報が **特定のJSON-LDスキーマにしか存在しない** ものかを確認
- スキーマ固有のフィールド（name、foundingDate、knowsAbout、FAQ Q&A、書籍タイトル、サービス記述）に紐づく場合、そのスキーマの貢献としてカウント

最後のルールが肝です。「Articleスキーマが効いた」は誰でも主張できます。Articleは`<title>`や`<h1>`、`<meta description>`と内容が重なるからです。本当に興味があるのは「JSON-LDにしか書かれていない事実」を引用に運んだのはどのスキーマか、という問いでした。

3ヶ月、600クエリ（50×4×3ヶ月）、私のサイトの引用は合計約180件。全件追跡しました。

## 仕事をした3スキーマ

### 1. Organization

`Organization`は、AIエンジンが実際にパースして記憶しているスキーマです。「kenimoto.devは何を扱うサイトか」「誰が運営しているか」と聞かれたとき、答えが寄りかかっているのはOrganizationブロックの中のフィールドでした。

- `name`と`alternateName`（表記揺れや略称の吸収）
- `description`（AIが「サイト概要」として使う1行）
- `foundingDate`（これが唯一書かれている構造化された場所）
- `sameAs`（GitHub、LinkedIn、Xへのクロス参照。AIはこれでエンティティを統合する）

引用断片の約40%がOrganizationに辿れる情報を含んでいました。[BrightEdgeが2026年初頭に出した分析](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/)とも一致します。OrganizationはTier 1です。

1つだけ実装するならこれです。比較対象すらありません。

### 2. Article（記事ごとのTechArticle）

これは厳密には、トップページの`<head>`に束ねた11個には入っていません。Astroが各ブログ記事に個別出力するスキーマです。それでもここに含めた理由は単純で、個別記事へのAI引用ほぼ全てが、Articleの`headline`、`datePublished`、`dateModified`、`author`に寄りかかっていたからです。

特に`dateModified`が想像以上に重要でした。Perplexityはフレッシュネスを強く重みづけしていて、業界分析では[Perplexityのランキング要素の約40%](https://www.stackmatix.com/blog/structured-data-ai-search)が新鮮さに関わるとされています。実際、記事を更新して`dateModified`を打ち直すと、その記事の引用率がその後2週間で目に見えて上がりました。

### 3. FAQPage

引用パターンが一番はっきりしていたスキーマです。AIエンジンはFAQPageの`mainEntity[].name`と`acceptedAnswer.text`をほぼそのまま抽出してきます。業界調査では、FAQPageは[AI関連クエリで67%の引用率](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)、別の分析でも[Google AI Overviewsに3.2倍出やすい](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/)とされています。

私の手元の数字は控えめです。FAQPageは1ブロックしか入れていないので。それでも引用の **質** が違いました。ChatGPTは私のFAQ回答を言い換えませんでした。引用しました。

ただし条件があります。FAQPageは、画面に実際にFAQコンテンツが表示されているページにしか効きません。空のFAQPageスキーマだけ置く（やる人がたまにいます）のは、ペナルティ対象として明確に定義されている挙動です。

## 何もしなかった8スキーマ

ここから書くのが少し痛い部分です。

### Person（knowsAbout付き）

`knowsAbout`が切り札になるはず、と本気で思っていました。多くのLLMOガイドが「個人の権威性を立てる秘密兵器」として扱っています。「LLMOの専門家は誰?」とAIに聞けば、私の名前が返ってくるはずでした。

返ってきませんでした。600クエリのうち、`knowsAbout`の値にしか書かれていない情報が引用に運ばれたケースは、1件も見つかりませんでした。1件もです。

仮説: AIエンジンは、GoogleのKnowledge Panelのように構造化ナレッジグラフを照会していません。ドキュメントを引き出して、そこを読むだけです。`knowsAbout: ["LLMO"]`がJSON-LDの中に存在しても、それはドキュメントではなく、誰かについてのメタデータでしかありません。今の検索パイプラインがそこを拾う設計にはなっていない、ということです。

これが今回一番悲しい発見で、一番役に立った発見でもありました。`knowsAbout`を入れること自体は害ではありません。コストがゼロなので、入れるのは構いません。ただ、LLMO戦略の中心にこれを据えるのは、まだ存在しないパイプラインに賭けることになります。

### Service ×4

私の事業を説明する4ブロック。引用ゼロ件。AIが「このサイトは何のサービスを提供しているか」を答えるとき、根拠にしていたのは構造化データではなくトップページの本文でした。

### Book ×2

私の書籍を説明する2ブロック。「Bookスキーマでしか取れない情報」が引用に運ばれたケースはゼロ。AIが書籍に言及するときの根拠は、書籍LPページの本文とAmazon上のリスティングです。どちらもBookスキーマと独立して存在します。

### MusicGroup

これは正直に書きます。入れた時点で「たぶん引用には効かないだろう」と思っていました。それでも入れたのは、自分のプロジェクトを構造化データで宣言しておきたいという自己表現でした。実際、効きませんでした。LLMOではなく自己表現だったということです。

### WebSite

`WebSite`スキーマと`SearchAction`は、Googleのサイトリンク検索ボックスのためには有名なほど有効です。これはSEOの機能で、AIの機能ではありません。3ヶ月の間、WebSiteブロックにしか書かれていない情報を引用に運んだAI回答は1件もありませんでした。

## 業界研究も同じ方向を指している

3ヶ月実測の結果は、2026年の業界研究と整合しています。

[Ahrefsが2026年5月に出した1,885ページの研究](https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7)では、スキーマを追加しても引用率はほとんど動きませんでした。引用が増えたのは、強いコンテンツと外部からの言及がついていたページであって、スキーマだけでは指標は動いていません。

[BrightEdgeの2026年初頭の研究](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/)では、Article + FAQPage + HowTo + Organizationの組み合わせを実装したページが、スキーマなしのページに比べて2.5〜2.7倍引用されていました。注目すべきは、リストに含まれていないのは Person、Service、Book、MusicGroup、WebSite。私が拾われなかったセットそのままです。

注意点も1つ。中身が薄いスキーマ（`name`と`url`だけのOrganization、質問1個だけのFAQPage、`knowsAbout`なしのPerson）は、[スキーマなしと比較して18ポイントの引用ペナルティ](https://www.stackmatix.com/blog/structured-data-ai-search)を負うという報告があります。AIエンジンは中身の薄いスキーマを「低品質シグナル」として扱っているようです。

実測の含意も同じです。中身が詰まった少数のスキーマは、中身が薄い大量のスキーマに勝ちます。

## 既存の「優先順位」と実測の対比

[実装ガイドの記事](https://kenimoto.dev/ja/blog/json-ld-11-schemas-llm-understanding/)で私が書いた優先順位は、Organization → WebSite → Person → Article → FAQPage → Book/Service → Breadcrumb → HowTo、でした。

3ヶ月測った後の優先順位は、Organization → Article → FAQPage、で打ち切りです。WebSiteとPersonを上位に置いたのは私の理屈であって、AIの実際の挙動とは別軸でした。

「実装時の優先順位」と「3ヶ月後の引用率順位」は別物だったということです。書いている時はそれが分かりません。測ってから分かります。

## 今、同じ実装をやり直すなら

Organization、Article、FAQPageの3つは残します。残り8つを実装する時間を、この3つを濃くする方に投資します。

- Organization: `sameAs`を増やす、`address`、`email`、`foundingDate`を本物にする、`description`を具体的に書く
- Article: 本当に改訂したときは必ず`dateModified`を更新する、`author`をPersonと正しく紐付ける
- FAQPage: Q&Aセクションがあるページは全部FAQPage化、回答は2〜3文で引用可能な単位に整える

Person/knowsAbout、Service、Book、MusicGroup、WebSiteは外します。害があるからではなく、実装コストはゼロではないし、リターンが誤差レベルだからです。

2026年にこれから始める人へのルール: **AIが読んでいるコンテンツに紐づく3スキーマ** を選んでください。Organization（企業アイデンティティ）、Article（記事本文）、FAQPage（Q&Aブロック）。ページに対応する本文がない抽象属性スキーマは、ほぼ無視されます。

「サイトの目的別にどのスキーマを選ぶか」をより体系的に決めたい方は、[llmoframework.com](https://llmoframework.com)が用途別（コーポレート / メディア / EC）に評価指標つきで整理しています。3ヶ月前の私が「多い方が良い」と並べる前に、これで判断するべきでした。

## 11スキーマは戦略ではなくゴミ捨て場だった

LLMOのアドバイスでよく目にするパターンが、私が3ヶ月前にハマったのと同じです。「全部入れろ、多い方が良い、AIが勝手に判断する」。AIは勝手には判断してくれません。渡したドキュメントを読んで、自分の検索パイプラインに紐づくフィールドだけを拾います。私の11個のうち8個は、そのマップに最初から載っていませんでした。

3つは載っていました。今その3つは、8つと同居していた頃より中身が濃くなっています。ブログのランクは変わらず、ChatGPTからの引用は2月比で約20%増え、Astroのレイアウトファイルは短くなりました。

11スキーマはゴミ捨て場でした。3スキーマはサイトです。

## 参考

- [JSON-LD 11スキーマ統合実装ガイド](https://kenimoto.dev/ja/blog/json-ld-11-schemas-llm-understanding/): この記事の前編、実装の話
- [llmoframework.com](https://llmoframework.com): サイト目的別のスキーマ選定フレームワーク
- [BrightEdgeのスキーマ引用率調査（Digital Strategy Force要約）](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/)
- [Ahrefs 2026年5月スキーマ研究（Medium要約）](https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7)

---

## 本でまとめて読む

「SEOがどう壊れたか」「LLMOで何を置き換えるか」「どう測るか」を8章に凝縮した [**LLMOクイックスタート: エンジニアのためのAI検索最適化入門**](https://kenimoto.dev/ja/books/llmo-quickstart) が、3ヶ月の測定作業を週末で読める形にまとめてあります。JSON-LDの章はこの記事よりも深く踏み込んでいます。
