---
title: "Traduzi o blog pra 4 idiomas. O português pegou quase 4× o tráfego do inglês."
description: "Em 22 dias: PT 748 PV, EN 195 PV, JA 27 PV, ES 7 PV. Achei que o ES ia dominar. Errado em todos os eixos. O que descobri sobre LLMO multilíngue."
date: 2026-05-21
lang: pt
tags: [llmo, multi-idioma, ga4, tabnews, comunidade]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/traduzi-blog-4-idiomas-portugues-4x-trafego/"
og_image: "https://kenimoto.dev/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/og-pt.png"
cross_posted_to: []
---

Quando decidi traduzir esse blog pra 4 idiomas, eu tinha uma ordem clara na cabeça. Inglês ia ganhar no volume. Espanhol ia ser vice por causa do número de falantes. Japonês ia ficar estável porque é a minha língua nativa. Português eu botei meio que por completismo, achando que seria o último colocado.

22 dias depois, o snapshot do GA4 discorda de cada um desses chutes.

![PV por idioma em 22 dias. PT: 748, EN: 195, JA: 27, ES: 7](/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/pv-by-language.png)

- **PT: 748 pageviews**, 709 sessões
- **EN: 195 pageviews**, 176 sessões
- **JA: 27 pageviews**, 29 sessões
- **ES: 7 pageviews**, 7 sessões

Isso é o PT puxando uns 3,8× o inglês, 28× o japonês e 107× o espanhol no mesmo blog, mesma cadência de publicação, mesma pessoa escrevendo. Um artigo em PT sozinho (o do agente autônomo de 24 horas, 375 PV) fez mais pageview que todo o blog em inglês somado.

Eu escrevi o post esperando o ES me surpreender. Quem apareceu pra me surpreender foi o PT, e o ES seguiu silenciosamente não existindo.

Antes de seguir: muito obrigado pra galera daqui do Brasil que tá lendo. Vocês são literalmente a razão desse texto existir, e a planilha embaixo prova isso de um jeito que dói no ego dos outros três idiomas.

## O contexto, pra você poder descontar meus números honestamente

Antes de mais nada, o setup é caseiro: um blog só, [kenimoto.dev](https://kenimoto.dev), com 4 diretórios de idioma (`/en/`, `/ja/`, `/pt/`, `/es/`). Os artigos passam por um pipeline de tradução com LLM e depois eu reviso à mão pra ajustar registro e localização (PT-BR vs PT de Portugal, espanhol LatAm-neutro vs espanhol da Espanha). A janela: 2026-04-30 até 2026-05-21, 22 dias de snapshot.

EN tem 26 artigos, JA tem 25, PT tem 17 e ES tem 10. Ou seja, o PT tem menos artigo que o EN e ainda assim ganha quase 4 a 1.

Se você parar de ler aqui, leva isso: **a assimetria de idioma engole a assimetria de quantidade de artigo**. Adicionar um post num idioma saturado é mais lento que adicionar um post num idioma vazio.

## Por que o PT disparou

Não é que o leitor brasileiro goste mais de mim, infelizmente. São três assimetrias empilhadas.

![Três assimetrias: TabNews, SOV em AI-search, llms.txt early-mover](/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/why-pt-won.png)

### 1. O TabNews é uma porta de entrada real que o inglês não tem

O [TabNews](https://www.tabnews.com.br/) é uma comunidade de dev BR onde você pode postar um artigo técnico e ser efetivamente lido por humanos no mesmo dia, sem já ter audiência. Não existe equivalente limpo em inglês. O Hacker News existe, mas a barreira pra você sem nome aparecer lá é absurdamente mais alta, e a superfície de tema é mais estreita.

Quando eu faço cross-post do mesmo artigo no TabNews (PT) e no Dev.to (EN), o TabNews entrega tráfego de referral consistente. O Dev.to entrega grilo, a não ser que você já tenha seguidor. Essa diferença aparece direto no GA4.

E pra ser claro: o mérito todo é do design da comunidade. Eu só apareci. O TabNews resolveu o problema do "descoberta de conteúdo de qualidade pra dev BR" de um jeito que ninguém resolveu pra dev de língua inglesa.

### 2. SERP de AI-search em português é mais fino

Conteúdo de LLMO em inglês é um mercado saturado. Tem milhares de artigos decentes brigando pelos mesmos prompts no ChatGPT, no Perplexity, no Gemini. O share of voice de um site pequeno é proporcionalmente pequeno.

Em português isso é bem mais fino. Quando uma engine de AI-search precisa de uma fonte em PT pra responder "spec-driven development com Claude Code", tem bem menos candidato pra escolher. A primeira resposta razoável em PT ganha. A primeira resposta razoável em EN fica enterrada.

Isso bate com o que ferramentas de visibilidade de AI multilíngues como o [Peec AI](https://llmpulse.ai/blog/best-ai-visibility-tools/) reportam: cobertura de idioma virou diferencial competitivo, porque a maioria das marcas otimiza inglês primeiro e nunca chega nos outros 114 idiomas.

### 3. Eu sou early-mover no `/pt/llms.txt`

A maioria dos sites grandes de dev BR ainda não publica llms.txt. Vários sites grandes de dev em espanhol LatAm também não. Eu publico `/pt/llms.txt`, `/es/llms.txt`, `/ja/llms.txt`, `/en/llms.txt` desde o dia zero. Em inglês isso é só higiene básica, todo mundo tem. Em português, ainda dá uma vantagenzinha.

Já escrevi antes sobre o caso da TRM que cresceu referrals do ChatGPT em 8.337% fazendo o básico de LLMO consistentemente. A versão multilíngue dessa lição é: o básico compõe mais rápido nos idiomas onde o básico ainda é raro.

## Por que o JA pegou 1/27 do PT (escrever isso doeu)

Japonês é minha língua nativa. Eu escrevo a versão JA do zero, sem tradução, então o texto é o mais limpo dos quatro. E o blog em JA pegou 27 pageviews. Vinte. E sete.

O motivo honesto é que o dev japonês majoritariamente lê [Qiita](https://qiita.com) e [Zenn](https://zenn.dev), não blog independente. Publicar no meu domínio em japonês é pedir pro leitor sair do habitat normal dele. Publicar o mesmo artigo no Zenn rende dezenas de leitura no dia 1.

Então a estratégia JA precisa mudar. O blog não vai brigar com Qiita/Zenn por tráfego humano JA; ele serve de arquivo canônico pra crawler de AI indexar, enquanto Zenn e Qiita fazem o trabalho de tráfego humano. É o oposto do lado PT, e tudo bem assim. Idioma diferente, distribuição diferente.

## Por que o ES tá em 7 pageviews e eu mereço a maior parte disso

O ES tem 10 artigos, traduções limpas em LatAm-neutro. O problema é a porta de entrada. Eu não tenho equivalente de TabNews pra postar. Stack Overflow en español existe mas o formato de comunidade não é o mesmo. [Platzi](https://platzi.com) e [Código Facilito](https://codigofacilito.com) são ótimos, mas não são plataformas abertas de publicação.

O ES tá num meio-termo estranho: a competição em AI-search também é mais fina que em EN (vento a favor), mas a porta de entrada da comunidade tá faltando (vento contra). Resultado: pageviews de um dígito. Ainda não tenho solução pronta. Os próximos 30 dias de experimento ES são pra achar um hub de publicação que não seja a plataforma fechada de uma empresa gigante.

## Checklist de LLMO multilíngue que eu queria ter no dia 1

Se você tá prestes a traduzir seu blog pra N idiomas, esse é o playbook que eu daria pro eu do passado:

1. **Pra cada idioma alvo, identifique a porta de entrada da comunidade antes de qualquer outra coisa.** Não o tamanho da audiência. A porta. Brasil tem TabNews. Japão tem Qiita/Zenn. Inglês tem Hacker News mas a barreira é brutal. Espanhol LatAm: eu ainda tô procurando.
2. **Publique `/{idioma}/llms.txt` no dia zero.** São 15 minutos por idioma. A maioria dos sites não-inglês não tem. É o moat mais barato que você vai construir, e o [llmoframework.com](https://llmoframework.com) inclusive trata isso como item central do playbook multilíngue.
3. **Configure os filtros de prefixo de idioma no GA4 antes de publicar.** Senão você passa o mês 2 fazendo retrofit de analytics em vez de escrever.
4. **Resista à vontade de traduzir tudo.** Traduz os 20% de artigos que mais provavelmente caem na porta de entrada da comunidade. O resto pode esperar até você validar o canal de distribuição.
5. **Trate o share of voice de AI-search de cada idioma como KPI separado.** Roda os mesmos prompts relevantes pra sua marca no ChatGPT, no Perplexity, no Claude.ai em cada idioma, mensal. As assimetrias são enormes, e só dá pra gerir o que você mede.

## O que vou fazer agora

- Dobrar a cadência de publicação em PT, de 1/semana pra 2/semana, pra medir se o referral do TabNews escala linearmente ou satura.
- Reenquadrar o JA: blog como arquivo pra crawler de AI, Zenn/Qiita como superfície de distribuição humana.
- Achar a porta de entrada de comunidade em ES que tá faltando, mesmo que pra isso eu tenha que experimentar em 3 hubs LatAm ao mesmo tempo.
- Deixar a cadência EN como tá. O mercado em inglês tá saturado; meu artigo marginal lá vale menos que meu artigo marginal em PT.

Se você tava resistindo a multi-idioma porque "não tenho tempo", considera o seguinte: o idioma com maior ROI no seu tempo pode não ser o de maior número de falantes. Pode ser o de menor competição na camada de AI-search e com a comunidade mais aberta de receber gente nova.

No meu blog, foi o português. No seu, pode ser indonésio, coreano, polonês. O único jeito de descobrir é publicar 1 artigo em cada, plugar o GA4 e ver qual é o primeiro que as engines de AI começam a citar.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
