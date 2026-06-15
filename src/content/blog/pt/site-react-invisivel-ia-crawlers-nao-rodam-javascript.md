---
title: "Seu site em React é invisível pra IA: os crawlers não rodam o seu JavaScript"
description: "O Googlebot renderiza o seu JavaScript. Os crawlers de IA não. Busquei minhas próprias páginas como GPTBot e as que renderizam no cliente voltaram como uma div vazia. Tem o teste e o conserto aqui."
date: 2026-06-16
lang: pt
tags: [llmo, busca-ia, ssr, javascript, react]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/site-react-invisivel-ia-crawlers-nao-rodam-javascript/"
og_image: "https://kenimoto.dev/images/blog/site-react-invisivel-ia-crawlers-nao-rodam-javascript/og-pt.png"
cross_posted_to: []
---

Vou começar pela parte que machuca: aquela landing page linda que o seu time fez em React, com `'use client'` em tudo, animação suave e Lighthouse no verde, provavelmente é uma página em branco pros crawlers de IA. Não "mal posicionada". Em branco. O GPTBot bate na sua URL, recebe um HTML, e a parte onde mora o seu conteúdo está assim:

```html
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>
```

É isso. Pra IA, a página inteira é uma div vazia e a promessa de que algo vai aparecer depois. Eu descobri isso do jeito constrangedor, me achando esperto. Tinha montado uma SPA caprichada, injetado todas as meta tags e o JSON-LD certinho via `react-helmet`, validado no Rich Results Test do Google, visto passar, e me sentido um adulto responsável. Aí busquei a minha própria página do jeito que um crawler de IA busca. Voltou a div vazia.

## Um fato só explica tudo

Os crawlers de IA não executam JavaScript.

Acabou. O Googlebot executa: carrega a página num Chromium headless, espera o JS rodar, e indexa o que o navegador desenhou. A gente passou quase dez anos achando que "crawler é assim", porque pra SEO é assim mesmo. Os crawlers de IA pularam essa etapa inteira. GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot: eles buscam o HTML cru que o seu servidor manda, leem o texto que já está ali, e vão embora. Sem navegador. Sem renderização. Sem segunda tentativa.

Isso não é achismo meu. A Vercel, junto com a MERJ, instrumentou mais de **1,3 bilhão de fetches de crawlers de IA** na rede deles e não achou *nenhum* indício de execução de JavaScript ([Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)). Os bots até *baixam* arquivos JS às vezes: o GPTBot baixou JavaScript em 11,5% das requisições, o ClaudeBot em 23,84%. Mas baixar não é rodar. Eles pegam o arquivo e nunca executam. É comprar o livro de receitas e comer a capa.

O motivo é chato e econômico: renderizar JavaScript na escala de um crawler custa caro, e esses bots rodam com timeout curto. Então não renderizam. O Googlebot paga esse custo porque busca é o negócio inteiro do Google. Pra uma empresa de IA, a sua página é uma entre um bilhão, e o caminho barato ganha.

![O que o GPTBot busca numa SPA React versus uma página com SSR: a renderizada no cliente é uma div vazia, a renderizada no servidor tem o conteúdo todo e o JSON-LD](/images/blog/site-react-invisivel-ia-crawlers-nao-rodam-javascript/csr-vs-ssg-pt.png)

## O teste que você faz em trinta segundos

Não precisa acreditar em mim nem na Vercel. Finja ser o bot. O `curl`, sem motor de JavaScript, é um dublê bem fiel do que esses crawlers fazem: puxa o HTML cru e olha pra ele.

```bash
curl -A "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" https://seu-site.com/ \
  | grep -o '<div id="root">.*</div>'
```

Se isso imprimir `<div id="root"></div>` sem nada dentro, o seu conteúdo vive no JavaScript, e o crawler de IA enxerga o mesmo vazio. Eu rodei o equivalente em alguns sites pra calibrar. Um app web conhecido, renderizado no cliente, voltou com **79 caracteres** de texto de verdade no HTML cru: basicamente um `<title>` e uma raiz vazia. O meu próprio site, feito com Astro e renderizado em tempo de build, voltou com **6.098 caracteres** de texto mais o JSON-LD ali na marcação. Mesmo `curl`, mesmo user-agent, duas realidades bem diferentes.

E aqui está a parte traiçoeira: abra essa mesma página renderizada no cliente no navegador e ela está perfeita. Títulos, preços, FAQ, tudo. Abra o Rich Results Test do Google e ela passa, porque o Google roda o JavaScript. **Toda ferramenta que você usa pra conferir o seu trabalho roda JavaScript.** O único público que não roda é justamente o que você queria alcançar.

## Por que o seu truque de JSON-LD sai pela culatra

Essa é a parte que eu queria que todo dev guardasse, porque é o gol contra mais comum. O conselho padrão é "coloque JSON-LD pra IA entender o seu conteúdo". Conselho bom. Mas *como* você coloca decide se ele existe.

Se você injeta os dados estruturados no cliente, escreveu um schema que só aparece depois que o JavaScript roda:

```jsx
// O crawler de IA nunca vê isto. Roda num navegador, e o bot não é um.
useEffect(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}, [])
```

`react-helmet`, injeção dinâmica de `<Head>`, qualquer coisa que monta a tag em tempo de execução: pro GPTBot, nada disso existe. Você fez a lição de casa e deixou ela trancada no armário. O conserto é emitir o mesmo JSON-LD no HTML que o servidor manda:

```jsx
// Renderizado no servidor, presente no HTML cru, visível pra todo mundo.
export default function Page({ jsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

O schema é idêntico. A única diferença é *quando* ele é criado, e "quando" é o jogo inteiro quando o seu leitor nunca liga um runtime de JavaScript.

## SEO e LLMO finalmente discordam

Por anos a resposta honesta pra "minha SPA atrapalha o SEO?" era "nem tanto, o Google renderiza". Pro Google, continua verdade. Pra busca de IA, virou mentira, e é esse racha que é a novidade. Dá pra ter uma página que posiciona bem no Google e é totalmente invisível pro ChatGPT, pro Perplexity e pro Claude, pelo motivo único de que o Google trouxe um navegador e eles não.

No Brasil isso pesa de um jeito específico. Tem muita startup e muito time pequeno produzindo landing em Next CSR e SPA bonita em ritmo industrial, e contando com tráfego de busca. Quando o usuário pergunta pro Perplexity ou pega um AI Overview, esses sites simplesmente não estão lá. Não é penalidade. É ausência. O crawler chegou, viu uma div vazia, e foi embora.

## O conserto, do menor esforço pro maior

- **Site estático (SSG).** Astro, Next com `output: 'export'`, Hugo, HTML puro. O conteúdo está na marcação em tempo de build. É a vitória fácil, e foi por isso que o meu site passou no teste do `curl` sem eu fazer nada esperto.
- **Renderização no servidor (SSR).** Server components do App Router do Next, Nuxt, Remix, SvelteKit. O servidor roda a renderização e entrega HTML de verdade. Pro crawler, o resultado é o mesmo.
- **Prerender / renderização dinâmica.** Se você está preso num app CSR grande que não dá pra reescrever neste trimestre, uma camada de prerender (Prerender.io, ou um cache próprio de Chrome headless) detecta o user-agent do bot e serve um snapshot já renderizado. É um paliativo: tira a página do branco sem atacar a raiz do problema.

A conferência é a mesma nos três casos: dê um `curl` como o bot e olhe os bytes. Se o conteúdo está lá, acabou. Se é uma div vazia, nenhum schema te salva. A checklist completa de legibilidade pra crawler, com o comportamento de renderização de cada bot, eu mantenho em [llmoframework.com](https://llmoframework.com).

## O resumo honesto

Passei uma semana orgulhoso de um dado estruturado que nenhuma IA ia carregar. A lição que tirei é mais estreita e mais boba do que "JSON-LD é inútil" ou "React é ruim": **o crawler de IA lê o que o seu servidor manda, não o que o seu navegador monta.** Se o conteúdo só aparece depois que o JavaScript roda, pros leitores que você mais quer ele nunca aparece.

Vai lá e dê um `curl` na sua home como GPTBot. Pior caso, você confirma que está tudo certo e perdeu trinta segundos. Melhor caso, você acha uma div vazia onde devia estar o seu melhor conteúdo, e conserta antes de alguém importante perguntar pro ChatGPT sobre você.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
