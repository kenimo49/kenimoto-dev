---
title: "Coloquei 11 schemas JSON-LD. Em 3 meses, só 3 foram citados por IA"
description: "Coloquei 11 schemas JSON-LD no <head> do meu site e medi 3 meses de citações por IA. Oito viraram peso morto. Conto quais três carregaram o caminhão."
date: 2026-05-25
lang: pt
tags: [llmo, json-ld, schema-org, ai-search, geo]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/11-json-ld-apenas-3-citados/"
og_image: "https://kenimoto.dev/images/blog/11-json-ld-apenas-3-citados/og-pt.png"
cross_posted_to: []
---

Há 3 meses passei uma tarde colocando 11 schemas JSON-LD no `<head>` do meu site. Organization, WebSite, Person, quatro blocos de Service, dois de Book, MusicGroup, FAQPage. Saí satisfeito.

Depois fui medir o que os motores de IA faziam com aquilo.

Três dos onze apareceram nas citações. Os outros oito poderiam ser comentários HTML que daria no mesmo.

Aqui vai a história de medição. Quais três schemas ganharam o lugar, quais oito foram peso morto, e por que eu faria de novo, mas menor.

![Os 11 schemas que implementei, com os 3 que realmente apareceram nas citações por IA destacados](/images/blog/11-json-ld-apenas-3-citados/schemas-ranking.png)

## O que eu coloquei e por que achei que ia funcionar

A implementação em si foi simples. Empacotei os 11 schemas num único array dentro de `<script type="application/ld+json">` no layout Astro, com renderização no servidor em toda página. A motivação na época parecia coerente:

- Mais sinais estruturados = mais chances de ser citado
- LLMs supostamente adoram `knowsAbout`, então Person ia ser a arma secreta
- Service ia dizer à IA exatamente o que eu vendo
- Book ia trazer minhas publicações
- Até MusicGroup ganhou um espaço, porque tenho um projeto paralelo e por que não

Eu estava operando na teoria do acumulador para LLMO: se um é bom, onze é melhor.

Spoiler: não é.

## Como medi

Rodei um experimento de tracking de 3 meses, do fim de fevereiro até o fim de maio de 2026. As regras:

- 50 queries de marca e tema, escritas uma vez e reusadas toda semana
- 4 motores de IA: ChatGPT (modo Search), Perplexity, Claude (com busca habilitada), Brave Leo
- Toda semana eu fazia as 50 perguntas nos 4 motores
- Para cada citação, eu verificava se o trecho citado continha informação que **só** existia em um schema JSON-LD específico (name, foundingDate, knowsAbout, Q&A de FAQ, títulos de livro, descrições de serviço)
- Se o trecho dependesse de um campo único de um schema, eu creditava esse schema

Essa última regra é a que importa. Qualquer um pode dizer "meu schema Article está funcionando" porque Article se sobrepõe a `<title>`, `<h1>` e `<meta description>`. A pergunta interessante é: quando a IA cita um fato que **só existe no JSON-LD**, qual schema produziu o fato?

Três meses, 600 queries (50 × 4 × 3 meses), cerca de 180 citações do meu site no total. Acompanhei todas.

## Os três schemas que ganharam o lugar

### 1. Organization

`Organization` é o schema que os motores de IA realmente parseiam e guardam. Quando alguém pergunta ao ChatGPT "o que faz o kenimoto.dev" ou ao Perplexity "quem roda esse site", a resposta se apoia em campos que vivem dentro do bloco Organization:

- `name` e `alternateName` (cuida de transliteração e abreviações)
- `description` (a frase que a IA usa como resumo do site)
- `foundingDate` (o único lugar estruturado onde a IA acha isso)
- `sameAs` (referências cruzadas para GitHub, LinkedIn, X — a IA usa para juntar entidades)

Cerca de 40% dos trechos citados continham informação rastreável até Organization. O padrão bate com o que [a BrightEdge reportou no começo de 2026](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/): Organization é Tier 1.

Se você for implementar só um schema, é esse. Sem competição.

### 2. Article (TechArticle por post)

Esse aqui não fazia parte dos 11 empacotados no `<head>` da home — o Astro emite por post de blog. Conto ele porque o experimento me forçou a perceber: toda citação de IA de um post individual se apoiava em `headline`, `datePublished`, `dateModified` e `author` do Article.

O campo `dateModified` pesa mais do que parece. O Perplexity em particular favorece conteúdo fresco como sinal de ranking — análises do setor [estimam que o frescor pesa em torno de 40% do ranking do Perplexity](https://www.stackmatix.com/blog/structured-data-ai-search). Toda vez que eu atualizava um post e mexia no `dateModified`, a taxa de citação daquele post subia nas duas semanas seguintes.

### 3. FAQPage

O schema com padrão de citação mais inequívoco. Os motores de IA extraem `mainEntity[].name` e `acceptedAnswer.text` de FAQPage quase literalmente. Estudos do setor colocam a taxa de citação de FAQPage [em torno de 67% em queries relevantes para IA](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo), e outra análise achou páginas com FAQPage [3,2x mais prováveis de aparecer em Google AI Overviews](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/) que páginas sem.

Meus números próprios foram mais modestos: tenho apenas um bloco FAQPage. Mas a **qualidade** da citação era diferente. O ChatGPT não parafraseou minhas respostas de FAQ. Citou direto.

Tem um detalhe: FAQPage só funciona se o conteúdo de FAQ aparece renderizado na página. Schema FAQPage vazio (coisa que vi gente tentando) é padrão documentado de penalidade, não atalho.

## Os oito que não fizeram nada

Aqui dói um pouco escrever.

### Person (com knowsAbout)

Eu apostei que `knowsAbout` ia carregar o caminhão. Vários guias de LLMO tratam isso como arma secreta para autoridade pessoal. Quando eu pergunto à IA "quem é especialista em LLMO?" meu nome deveria estar na resposta, certo?

Não está. Em 600 queries, não achei uma única citação onde o conteúdo citado se rastreasse até um valor único de `knowsAbout`. Nenhuma.

Minha teoria atual: os motores de IA não consultam um knowledge graph estruturado do jeito que o Painel de Conhecimento do Google faz. Eles recuperam documentos e leem. `knowsAbout: ["LLMO"]` parado no JSON-LD não é um documento. É metadado sobre uma pessoa que nenhum pipeline de retrieval pensou em puxar.

Foi o achado mais decepcionante e o mais útil. Incluir `knowsAbout` não tem custo — pode deixar — mas planejar sua estratégia de LLMO em cima disso é apostar num pipeline que ainda não existe.

### Service ×4

Quatro blocos descrevendo o que eu faço. Zero citações rastreáveis até eles. Os motores de IA que quiseram saber quais serviços ofereço acharam a informação no texto da minha home. Os dados estruturados ficaram de fora.

### Book ×2

Dois blocos descrevendo meus livros publicados. Zero citações de queries sobre livros que só pudessem ter vindo do schema Book. Quando a IA cita meus livros, é por causa da prosa nas LPs dos livros e dos listings na Amazon — ambos existem independente do schema.

### MusicGroup

Esse eu coloquei por completude. Hoje suspeito que devia ter colocado por honestidade: eu sabia na época que era improvável disparar, e não disparou. Ter um MusicGroup no `<head>` do meu site foi auto-expressão, não LLMO.

### WebSite

`WebSite` com `SearchAction` é famosamente útil para a sitelinks search box do Google. É feature de SEO, sem efeito em IA. Em três meses, nenhuma citação de IA precisou de informação que só vivesse no bloco WebSite.

## A pesquisa mais ampla aponta na mesma direção

O achado de 3 meses bate com o que estou vendo na pesquisa de 2026.

[A Ahrefs rodou um estudo em maio de 2026](https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7) em 1.885 páginas que adicionaram schema para ver se a taxa de citação mexia. Praticamente não mexeu. As páginas que ganharam citações foram as que tinham conteúdo forte e menções de terceiros; o schema sozinho não empurrou o ponteiro.

[Pesquisa da BrightEdge do começo de 2026](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/) achou que páginas combinando Article, FAQPage, HowTo e Organization foram 2,5 a 2,7x mais citadas que páginas sem schema. Repare no que não está nessa lista: Person, Service, Book, MusicGroup, WebSite. A minha lista de fracassos, literal.

Ainda tem um aviso de downside. Schema genérico e preenchido pela metade (Organization só com `name` e `url`, FAQPage com uma pergunta, Person sem `knowsAbout`) carrega uma [penalidade de 18 pontos percentuais de citação](https://www.stackmatix.com/blog/structured-data-ai-search) comparado a não ter schema nenhum. Aparentemente os motores de IA tratam schema vazio como sinal de baixa qualidade.

A conclusão alinhou com a medição: poucos schemas bem preenchidos batem uma coleção grande de schemas pela metade.

## Contexto Brasil: por que isso importa aqui

Duas coisas mudaram em PT-BR nos últimos meses e amplificam o problema dos schemas mortos.

Primeiro, o Google AI Overviews em PT-BR está expandindo a cobertura — mais buscas em português começam a ter resposta gerada com citações. Cada citação é um espaço onde Article + FAQPage + Organization brigam para aparecer. Se você não tem esses três, sua página simplesmente não entra na competição.

Segundo, o Perplexity ganhou tração em circuitos de tech no Brasil, em parte porque cita as fontes de um jeito que SEO antigo não premiava. O `dateModified` do Article passa a ser mais importante do que parecia: posts brasileiros sobre tema técnico envelhecem rápido, e o sinal de frescor é o que faz a diferença entre ser citado em maio ou ser esquecido em junho.

Na prática, é um problema concreto que aparece com mais força para quem escreve em PT-BR agora.

## O que eu faria diferente

Manteria Organization, Article e FAQPage. O tempo economizado nos outros oito eu investiria em deixar esses três mais ricos:

- Organization: mais entradas em `sameAs`, `address` de verdade, `email` de verdade, `foundingDate` de verdade, `description` descritiva
- Article: atualizar `dateModified` toda vez que o post for genuinamente revisado, `author` correto ligado a um Person
- FAQPage: toda página que tem seção de Q&A devia expor como FAQPage com respostas escritas para serem citáveis em duas ou três frases

Pularia Person/knowsAbout, Service, Book, MusicGroup e WebSite. Não porque são prejudiciais — não são, se preenchidos corretamente — mas porque o custo de implementação não é zero e o retorno é erro de arredondamento.

A regra geral que eu ofereceria a quem está começando em 2026: pegue os três schemas que mapeiam para o **conteúdo que a IA está lendo** — identidade corporativa (Organization), corpo do artigo (Article), blocos de Q&A (FAQPage). Schemas que descrevem atributos abstratos de uma pessoa ou empresa sem bloco de conteúdo correspondente na página tendem a ser ignorados.

Se quiser uma forma mais estruturada de decidir quais schemas servem a qual tipo de site (corporativo, mídia, e-commerce), o [llmoframework.com](https://llmoframework.com) organiza a escolha de schema por propósito de site com métricas de avaliação. É o framework que eu deveria ter usado há 3 meses no lugar de "mais é mais".

## Três meses acumulando não foi estratégia de conteúdo

O padrão que vejo se repetir em conselho de LLMO é o mesmo em que caí: implemente tudo, mais é melhor, a IA vai sacar. A IA não saca. Ela lê os documentos que você entrega e procura campos que mapeiam ao pipeline de retrieval dela. Oito dos meus 11 schemas nunca estiveram nesse mapa.

Três estão. Esses três agora estão mais ricos do que estavam quando dividiam a página com outros oito. O blog rankeia igual, o ChatGPT me cita uns 20% mais que em fevereiro, e meu layout Astro está mais curto.

Onze schemas era um aterro. Três schemas é um site.

## Leitura adicional

- [llmoframework.com](https://llmoframework.com) — framework para escolha de schema por propósito de site
- [Pesquisa de citação de schema da BrightEdge (resumo Digital Strategy Force)](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/)
- [Estudo de schema da Ahrefs de maio 2026 (resumo Medium)](https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7)
- [Por que o ChatGPT ignora o seu site (LLMO intro)](https://kenimoto.dev/pt/blog/chatgpt-ignora-seu-site-llmo/)

A versão de 8 capítulos de "como SEO quebrou, o que LLMO substitui, e como medir tudo isso" — incluindo o capítulo de JSON-LD que aprofunda esse post — está em **[LLMO Quickstart: Otimização para Busca por IA para Engenheiros](https://kenimoto.dev/pt/books/llmo-quickstart?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=11-json-ld-apenas-3-citados)**. 3 meses de medição condensados em leitura de fim de semana.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
