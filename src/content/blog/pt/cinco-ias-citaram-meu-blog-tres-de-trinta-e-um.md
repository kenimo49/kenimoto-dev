---
title: "Pedi a 5 IAs que citassem meu próprio blog. 31 artigos publicados, só 3 apareceram."
description: "Apontei ChatGPT, Claude, Gemini, Perplexity e Brave AI para os 31 artigos do meu blog em inglês. Três artigos fizeram o trabalho dos 31."
date: 2026-05-26
lang: pt
tags: [llmo, busca-por-ia, geo, medicao, blog]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/cinco-ias-citaram-meu-blog-tres-de-trinta-e-um/"
og_image: "https://kenimoto.dev/images/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/og-pt.png"
cross_posted_to: []
---

Escrevo sobre LLMO toda semana. KPI, llms.txt, JSON-LD, a liturgia inteira. E mesmo assim tinha uma coisa que eu nunca tinha feito: pedir para as próprias buscas por IA citarem o meu blog.

Não estou falando de "meu site está indexado", nem de "os crawlers estão batendo no meu domínio". Isso eu já acompanho pelo log do servidor. Estou falando do que o leitor faz de verdade: abre o ChatGPT, digita uma pergunta, e vê se algum artigo meu aparece na resposta.

O blog em inglês tem 31 artigos publicados. Quando apontei cinco IAs para ele, três artigos fizeram o trabalho dos 31. Os outros 28 podiam não existir.

![Cinco IAs apontadas para 31 artigos, só 3 citados](/images/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/og-pt.png)

## O setup

Escolhi as cinco IAs que aparecem com frequência no filtro de referral do meu GA4:

1. ChatGPT (com busca na web ativada)
2. Claude (com busca na web ativada)
3. Gemini
4. Perplexity
5. Brave AI

Depois montei 30 prompts divididos em três grupos de dez, porque resposta de LLM é estocástica e rodar um prompt por IA é só achismo:

- **Branded** — `kenimoto.dev about`, `ken imoto LLMO artigos`, `ken imoto Claude Code blog`. Modo fácil. Se o nome do domínio mais o tema do artigo não trazem o site, alguma coisa está quebrada.
- **Topical** — `safe autonomous coding agents`, `llms.txt anti patterns`, `how to measure AI citations`. Modo realista. É o que um estranho digita.
- **Comparativo** — `Claude Code vs ChatGPT Codex agents`, `Perplexity vs Brave for engineers`, `voice AI stacks under 300ms`. Modo vaidade. Tenho artigo em cada um desses, era para competir.

Três execuções por prompt por IA, então 30 × 5 × 3 = 450 turnos. Registrei quando `kenimoto.dev` apareceu como citation chip, link inline, ou no rodapé de fontes. Menção sem link não conta. O placar do LLMO só credita o que o leitor consegue clicar.

Essa última regra parece pequena mas pesa. Boa parte das comemorações de "a IA está falando de mim!" no Twitter é gente capturando o nome da marca aparecendo no texto. Aquilo é cortesia, não citação. Citação move tráfego. Menção move ego.

## O resultado

Dos 31 artigos, exatamente três apareceram como citação nas cinco IAs:

- `measure-ai-citations-llmo-kpi`
- `11-json-ld-3-cited-by-ai`
- `geo-princeton-study-9-ways-ai-cites-you`

Citation breadth de 9,7%, menos de um em cada dez artigos. Os 28 restantes ou não apareceram, ou apareceram uma única vez no meio dos 450 turnos sem se repetir. Pela regra dos "três turnos" do LLMO Quickstart, uma aparição solitária não vale ponto.

Por IA o resultado é ainda mais torto. Perplexity e ChatGPT trouxeram os três. Claude trouxe dois (errou o post do estudo de Princeton e mandou direto o paper original, o que tecnicamente é a jogada certa). Gemini citou só o post de JSON-LD, e nos outros casos preferiu mandar o leitor para as fontes originais que o meu artigo estava citando. Brave AI citou zero. Descrevia o tema corretamente e despachava o leitor para um concorrente.

Na minha cabeça, o blog era um corpus de 31 peças. Para as IAs, era um corpus de 3 peças com 28 peças de ruído de fundo.

## O que os três vencedores têm em comum

Reli os três imãs de citação ao lado de cinco dos 28 fantasmas. O padrão não é nada sutil.

**Têm número no título.** "9 ways", "11 JSON-LD schemas, 3 cited", "measure". Todos os vencedores. Os perdedores tendem para títulos evocativos (`cheap-model-won-context-beats-parameters`, `claude-hid-my-bug-three-times`) que ficam bem para humanos mas não têm contagem que uma engine de resposta consiga agarrar.

**São o hub temático de uma pergunta específica.** "Como medir citações de IA" mapeia direto para um post. "Quais JSON-LD schemas realmente são citados" também. Os fantasmas tendem a ser relatos de experiência (tipo "tentei X por um mês e isso quebrou") que são ótimos para humano, mas nenhuma IA vai responder uma prompt do tipo "me conta sobre o mês do ken imoto refatorando 100 funções".

**Foram publicados há mais de 30 dias.** Os três têm pelo menos seis semanas de idade. Metade dos 28 fantasmas é mais nova. O lag de indexação de IA é real, e o LLMO Quickstart não está brincando quando diz que a taxa de citação precisa de pelo menos um mês de descanso antes de ser lida.

A contagem de JSON-LD, por sinal, é a mesma nos 31 artigos: eu uso o mesmo layout Astro em tudo. Então o que está acontecendo não é "o vencedor tem schema melhor". É o título, a gravidade da pergunta, e o tempo.

## O que os 28 fantasmas têm em comum

A notícia chata primeiro. A maior parte dos fantasmas cai em um destes três problemas:

- O título faz uma afirmação que não existe em nenhum outro lugar da web, então a engine não tem âncora. "The cheap model won" é uma frase boa, mas nenhum humano digita aquilo como query.
- O tema é tão de nicho que nenhum prompt genérico chega lá. Um post sobre latência em voice AI vai perder para o blog da AssemblyAI sempre. Hub temático ganha de profundidade indie.
- O post é decente mas foi publicado contra uma parede de conteúdo concorrente. Meu "Claude refactor 100 functions" é razoável, mas pesquise "Claude refactor regression" e a resposta vai voltar do blog da Anthropic da semana passada.

A notícia interessante é o que *não* importa. Tamanho não importa — tenho post de 800 palavras citado e post de 3 mil palavras ignorado. Backlink não importa na minha escala — os artigos com mais backlink não são os três citados. Cross-post no Dev.to também não muda o jogo de citação por IA, só puxa tráfego direto.

## O que estou mudando

Três semanas olhando para esses dados e as ações que sobraram são menores do que eu esperava.

Não vou perseguir o sonho de "transformar todo post em imã de citação". Os 28 ruídos de fundo são carregadores de peso para *humanos*: é assim que o leitor recorrente constrói o modelo de quem eu sou. Se eu apagar a marca pessoal de todo post, deixa de ser blog.

O que mudei foi a etapa de planejamento. Antes de rascunhar um post, agora passo o título por um teste rápido: "alguma prompt de IA rotearia para isso?". Se a resposta é não, ou (a) reformulo com número ou pergunta que mapeia para um comportamento de busca, ou (b) aceito que é post só para humano e desligo a expectativa de tráfego por IA. Esperar não funcionou.

Também estou montando uma página hub em `kenimoto.dev` para cada um dos três temas vencedores. O raciocínio vem dos pilares Authority Signals e Coherence Signals do [LLMO Framework](https://llmoframework.com/) — se você quer que uma citação componha juros, a URL citada precisa ficar no topo de um pequeno cluster de conteúdo, não solta no meio de um mar de ensaios sem relação. O pilar Citability é o que pega a primeira citação. Authority é o que mantém a citação consistente entre engines diferentes.

## Conclusão mais ampla

Quem escreve sobre LLMO, rode esse experimento em si mesmo essa semana. Leva uma noite. O resultado vai ser mais útil que os próximos três posts de log de crawler que você vai ler.

A maior parte do debate sobre LLMO é gente checando se *o site dos outros* é citado: auditoria de JSON-LD, auditoria de llms.txt, segmento no GA4. Isso é ótimo para benchmark de estranho. Não te diz se o seu próprio corpus aparece.

O que eu subestimei foi o quanto a citação se concentra. Esperava breadth de 5 a 10% e ficou em 9,7%, então o número estava certo. A surpresa foi que os três citados estavam carregando todas as engines, todos os baldes de prompt, todas as repetições. LLMO é um torneio. Você não está otimizando 31 posts. Está otimizando para quais 2 ou 3 ganham a chave.

A outra coisa que subestimei foi o quanto o perfil de "vencedor" já fica definido na etapa do título. Quando você está ajustando JSON-LD no post publicado, o roteamento já aconteceu. A prompt pousa em você ou não pousa, e o pouso é decidido em grande parte por se o título parece uma resposta.

Vou rodar de novo daqui a 60 dias com as mesmas 30 prompts e ver se os três citados mudam, ou se entra um quarto. Meu chute é que os três são pegajosos, e o quarto só entra se eu escrever um post novo desenhado especificamente para ganhar uma query que hoje eu não cubro.

Veremos. O lado bom de transformar o próprio blog em alvo de medição é que o próximo post vira o próximo experimento.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
