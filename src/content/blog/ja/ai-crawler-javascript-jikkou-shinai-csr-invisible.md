---
title: "GPTBotに私のJSレンダリングページを見せたら、中身は空の`<div>`だった"
description: "GooglebotはJavaScriptをレンダリングします。でもAIクローラーはしません。自分のページをGPTBotとして取得したら、クライアントレンダリングのページは空のdivで返ってきました。検証方法と直し方をまとめます。"
date: 2026-06-16
lang: ja
tags: [llmo, ai検索, ssr, javascript, レンダリング]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/ai-crawler-javascript-jikkou-shinai-csr-invisible/"
og_image: "https://kenimoto.dev/images/blog/ai-crawler-javascript-jikkou-shinai-csr-invisible/og-ja.png"
cross_posted_to: []
---

私はこれまで「AIに引用されない理由」をいくつか書いてきました。`.md` ツインの話はAIに専用のクリーンなコピーを渡す話でした。JSON-LDの話は、書いたスキーマのうち何個が実際に使われるかの話でした。どれも前提として「クローラーがあなたの本文を読んだ上で、どう扱うか」を論じていました。

今回はその一歩手前の話です。**クローラーが本文を読む**、その段階の話です。多くのサイトでは、ここが成立していません。「読んだけど無視した」ではありません。読んでいないのです。空のページを受け取って、そのまま帰っていきます。

私はこれを、いちばん恥ずかしい形で知りました。きれいな小さなSPAを作り、`react-helmet` で必要なメタタグとJSON-LDを全部注入し、Googleのリッチリザルトテストで検証し、合格を確認して、いっぱしの大人になった気でいたのです。そして気まぐれに、AIクローラーと同じやり方で自分のページを取得してみました。返ってきた本文の場所は、こうなっていました。

```html
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>
```

これだけです。GPTBotにとっては、これがページの全部でした。空の `<div>` と、これから中身が入るという約束だけ。

## たった1つの事実で全部説明がつく

AIクローラーはJavaScriptを実行しません。

話はこれで終わりです。Googlebotは実行します。ヘッドレスChromiumでページを読み込み、JSの実行を待ち、ブラウザが描画した結果をインデックスします。私たちは10年近く「クローラーとはそういうもの」と思い込んできました。SEOの世界ではそれが正解だったからです。AIクローラーは、その工程をまるごと飛ばしました。

GPTBot、OAI-SearchBot、ChatGPT-User、ClaudeBot、PerplexityBot。これらはサーバーが返す生のHTMLを取得し、その中にすでにあるテキストを読み、立ち去ります。ブラウザなし。レンダリングなし。二度目の取得もなし。

これは私の勘ではありません。VercelとMERJは、自社ネットワーク上の **13億回を超えるAIクローラーのフェッチ** を計測し、JavaScript実行の痕跡が **ゼロ** だったと報告しています([Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler))。ボットはJSファイルを *ダウンロードする* ことはあります。GPTBotはリクエストの11.5%で、ClaudeBotは23.84%でJSを取得していました。でもダウンロードと実行は別物です。ファイルを掴むだけで、実行はしません。料理本を買って表紙だけ食べるようなものです。

理由は退屈で、経済的です。クロール規模でJavaScriptをレンダリングするのは高くつき、これらのボットは短いタイムアウトで動いています。だからやりません。Googlebotがレンダリングコストを払えるのは、検索がGoogleの本業そのものだからです。AI企業にとって、あなたのページは10億分の1で、安い経路が勝ちます。

![GPTBotがReact SPAとSSRページから受け取る生HTMLの比較。クライアントレンダリングは空のdiv、サーバーレンダリングは本文とJSON-LDが入っている](/images/blog/ai-crawler-javascript-jikkou-shinai-csr-invisible/csr-vs-ssg-ja.png)

## 30秒でできる検証

私やVercelを信じる必要はありません。ボットになりきってみればいいのです。JavaScriptエンジンを持たない `curl` は、これらのクローラーがやっていることのかなり正確な代役になります。生HTMLを取得して、それを眺める。それだけです。

```bash
curl -A "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" https://your-site.com/ \
  | grep -o '<div id="root">.*</div>'
```

これが `<div id="root"></div>` と、中身なしで表示されたら、あなたの本文はJavaScriptの中にあり、AIクローラーには同じ空っぽが見えています。私は感覚を掴むために、いくつかのサイトで同じことを試しました。あるよく知られたクライアントレンダリングのWebアプリは、生HTMLの実テキストが **79文字** で返ってきました。実質 `<title>` と空のルートだけです。一方、Astroで作りビルド時にレンダリングしている私のサイトは、**6,098文字** の本文と、マークアップにそのまま置かれたJSON-LDが返ってきました。同じ `curl`、同じユーザーエージェント、まったく違う現実です。

ここがいやらしいところです。その同じクライアントレンダリングのページを、ブラウザで開けば完璧に見えます。見出しも価格表もFAQも全部。Googleのリッチリザルトテストでも合格します。Googleがレンダリングするからです。**あなたが品質を確認するために使う道具は、全部JavaScriptを実行します。** 実行しない唯一の相手が、あなたが届けたかった相手なのです。

## あなたのJSON-LD施策が、むしろ裏目に出る理由

ここはエンジニアの皆さんに腹落ちしてほしい部分です。いちばんよくある自滅パターンだからです。定番のアドバイスは「AIに理解してもらうためにJSON-LDを入れよう」です。良いアドバイスです。でも、*どう* 入れるかが、それが存在するかどうかを決めます。

構造化データをクライアント側で注入すると、JavaScriptが実行されて初めて現れるスキーマを書いたことになります。

```jsx
// AIクローラーはこれを見ません。これはブラウザで動きますが、ボットはブラウザではありません。
useEffect(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}, [])
```

`react-helmet`、動的な `<Head>` 注入、実行時にタグを組み立てる手法。GPTBotにとって、これらは存在しません。宿題をやって、ロッカーに置いてきたようなものです。直し方は、同じJSON-LDをサーバーが返すHTMLに出力することです。

```jsx
// サーバーでレンダリングされ、生HTMLに存在し、誰の目にも見える。
export default function Page({ jsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

スキーマは同一です。違いは *いつ* 作られるかだけ。そして読者がJavaScriptランタイムを一度も起動しないとき、その「いつ」が勝負の全部になります。

## SEOとLLMOが、ついに食い違う

長いあいだ「SPAはSEOに不利ですか?」への誠実な答えは「そうでもない、Googleがレンダリングするから」でした。Googleについては、今もそれが正しいです。でもAI検索については、もう間違いです。そして、この分岐こそが今回の本題です。Googleでは普通に順位がつくのに、ChatGPT・Perplexity・Claudeにはまったく見えないページが成立します。理由はただ1つ。Googleはブラウザを持ってきて、彼らは持ってこなかった。

つまり、あなたがSEOの理由で(あるいは `create-react-app` がデフォルトだったというだけの無理由で)決めたレンダリング方式は、いまやLLMOの意思決定でもあり、しかも他の全部を左右する一番上流のものです。クローラーが空の `<div>` を見つめているなら、`llms.txt` も見出しも引用最適化も、最適化する意味がありません。

## 直し方を、労力の少ない順に

- **静的サイト(SSG)**。Astro、Nextの `output: 'export'`、Hugo、素のHTML。本文がビルド時点でマークアップに入ります。これが簡単な勝ちで、私のサイトが何の小細工もなしに `curl` テストを通った理由です。
- **サーバーサイドレンダリング(SSR)**。NextのApp Routerサーバーコンポーネント、Nuxt、Remix、SvelteKit。サーバーがレンダリングを実行し、本物のHTMLを送ります。クローラーから見た結果は同じです。
- **プリレンダリング / ダイナミックレンダリング**。今期は書き直せない大きなCSRアプリを抱えているなら、プリレンダ層(Prerender.io や自前のヘッドレスChromeキャッシュ)がボットのユーザーエージェントを検知し、レンダリング済みのスナップショットを返します。治療ではなく対症療法ですが、空白ページは解消できます。

確認方法はどの場合も同じです。ボットとして `curl` し、バイト列を見る。本文が入っていれば完了。空のdivなら、どれだけスキーマを足しても助かりません。クローラー可読性のチェックリスト(と主要ボットごとのレンダリング挙動)が欲しい方は、[llmoframework.com](https://llmoframework.com) にまとめています。

## まとめ

私は1週間、どのAIも決して読み込まない構造化データを誇らしく眺めていました。教訓は「JSON-LDは無意味」でも「Reactが悪い」でもありません。もっと狭くて、もっと間抜けな話です。**AIクローラーは、ブラウザが組み立てたものではなく、サーバーが送ったものを読む。** 本文がJavaScript実行のあとにしか現れないなら、あなたが一番届けたい読者には、それは一度も現れません。

自分のトップページを、GPTBotとして `curl` してみてください。最悪の場合、問題なしと確認できて30秒を失うだけ。最良の場合、一番いい本文があるはずの場所に空の `<div>` を見つけ、誰か大事な人があなたについてChatGPTに尋ねる前に、直せます。

---

「どのボットが何をレンダリングするか」「実際に生き残る最小のJSON-LD」「llms.txt」「AI引用率の測り方」まで一通りの実装手順は、短い書籍にまとめています: [LLMOクイックスタート](https://kenimoto.dev/ja/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=ai-crawlers-no-js-ja)。

参考:
- [The rise of the AI crawler — Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
