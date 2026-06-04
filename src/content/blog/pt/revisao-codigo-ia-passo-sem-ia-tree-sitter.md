---
title: "O passo mais valioso da revisão de código por IA não usa IA nenhuma"
description: "Por anos eu achei que revisão de código por IA era jogar o repositório inteiro no modelo e rezar. O passo que mais melhorou a qualidade não chama LLM: o Tree-sitter monta o grafo de chamadas local, o blast radius acha os 7 arquivos que importam, e o contexto cai de 150k pra 18k tokens. De graça e offline."
date: 2026-06-05
lang: pt
tags: [revisao-de-codigo, knowledge-graph, tree-sitter, claude-code, tokens]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/revisao-codigo-ia-passo-sem-ia-tree-sitter/"
og_image: "https://kenimoto.dev/images/blog/revisao-codigo-ia-passo-sem-ia-tree-sitter/og-pt.png"
cross_posted_to: []
---

Por anos eu achei que revisão de código por IA era basicamente um ritual: jogar o repositório inteiro no modelo e rezar pra ele achar o bug. Quanto mais arquivo eu empurrava "por garantia", mais seguro eu me sentia. A conta de API dizia outra coisa, mas eu ignorava.

Aí eu descobri uma coisa que me incomodou. O passo que mais melhorou a qualidade da minha revisão por IA é justamente o passo que **não chama IA nenhuma**.

Vou explicar, porque a parte interessante não é "use a ferramenta X". É que a engenharia de verdade estava acontecendo antes da IA entrar, num lugar que eu nem olhava.

## O que eu fazia antes (e por que doía no bolso)

O fluxo antigo era esse: abria o PR, pegava o diff, e pra "ter contexto" jogava no modelo o arquivo modificado mais uns 50 arquivos do entorno. Tudo que parecia relacionado ia junto. O modelo lia tudo, gastava um caminhão de token, e devolvia uma revisão mais ou menos.

O problema é que jogar mais arquivo não deixa a revisão melhor. Deixa pior. O modelo se distrai com código que não tem nada a ver com a mudança, e o ponto crítico se dilui no meio do barulho. Eu estava pagando, em dólar, pra piorar minha própria revisão.

## A base de código já é um grafo

A virada veio quando parei de tratar o código como um monte de texto e comecei a tratar como o que ele de fato é: um grafo.

Uma função **chama** outra. Uma classe **herda** de outra. Um módulo faz **import** de outro. Isso não é metáfora, é a estrutura real do seu repositório. E se você torna esse grafo explícito, a pergunta que todo revisor faz na cabeça ("se eu mexer aqui, o que mais quebra?") passa a ter resposta em segundos, não em meia hora de garimpo.

Quem monta esse grafo é o **Tree-sitter**: a biblioteca que faz parsing do código pra árvore sintática (AST). Ela roda 100% local, é determinística e (o ponto inteiro deste texto) **não usa LLM**. O ecossistema saiu das 19 linguagens iniciais pra mais de 40 com parser oficial, e os pacotes da comunidade já empacotam [mais de 300 gramáticas](https://pypi.org/project/tree-sitter-language-pack/). Dá saudade da época do grep no nome da função, adivinhando "deve ser por aqui que chamam". O Tree-sitter troca o "deve ser" por "é".

## O passo sem IA: blast radius

Com o grafo montado, a operação que faz a mágica chama **blast radius**: o escopo de impacto de uma mudança.

Você aponta pro arquivo que mudou (Hop 0), e o grafo colore o que é afetado pela distância em saltos: dependência direta (Hop 1), indireta (Hop 2), e por aí. O resultado é a lista enxuta dos arquivos que a sua mudança realmente toca: sete, em vez dos cinquenta que eu empurrava por medo.

```
Mudança: auth.py

Hop 0: auth.py
Hop 1: middleware.py, api/login.py, api/register.py
Hop 2: tests/test_auth.py, tests/test_login.py
Hop 3: conftest.py

Arquivos afetados: 7
```

Nada disso passou por um modelo. É AST determinístico rodando na sua máquina, de graça. A primeira vez que liguei isso, perguntei o escopo de impacto de um arquivo e em dois segundos voltaram 7 arquivos, praticamente o mesmo resultado que eu tinha levado 30 minutos pra montar no grep. Fiquei grato pela resposta e levemente ofendido pelos meus 30 minutos.

## O número que muda a conta

Aí sim a IA entra, mas só nos 7 arquivos que importam, e não nos 50 do começo.

```
Antes: arquivo modificado + 50 do entorno = 150.000 tokens
Com o grafo: arquivo modificado + 7 do blast radius = 18.000 tokens

Redução: 8,3x
```

![Revisão por IA: blast radius corta o contexto de 150k para 18k tokens, 8,3x](/images/blog/revisao-codigo-ia-passo-sem-ia-tree-sitter/blast-radius-150k-18k.png)

Pra quem paga API em dólar e fatura em real, essa diferença não é detalhe. Num PR grande, revisado várias vezes ao dia, a distância entre 150k e 18k por revisão é a distância entre alguns reais e alguns centavos por PR. E o trabalho pesado (montar o grafo, achar o escopo) sai zero, rodando offline. O caro virou barato porque a parte cara deixou de usar o recurso caro.

Vale separar uma coisa, porque já [troquei RAG por grep numa busca de código antes](https://kenimoto.dev/pt/blog/construi-rag-deletei-grep-venceu/) e não é a mesma história. Lá o assunto era achar o código certo. Aqui é entender o impacto de uma mudança que você já fez. Camadas diferentes do mesmo problema: deixar a IA focar no que importa em vez de ler tudo.

## Por que isso é meio contraintuitivo

A intuição diz que a inteligência da revisão mora no modelo. Quanto mais esperto o LLM, melhor a revisão. Faz sentido, e está errado.

O que mais melhorou a minha revisão não foi um modelo melhor. Foi um passo determinístico, gratuito e local, que decide **o que** o modelo vê. O LLM que eu achava ser o cérebro da operação é, na prática, o estagiário: bom no julgamento final, mas perdido se você entope a mesa dele de papel. Quem faz o trabalho braçal (separar os 7 arquivos certos dos 50) é o Tree-sitter, que trabalha de graça e não reclama.

A IA não vira dispensável. O ponto é que o passo mais valioso vem antes dela, e custa zero.

## Fechando

Eu passei anos achando que revisão por IA era sobre ter o modelo mais inteligente possível. Era sobre não fazer o modelo inteligente ler lixo.

O grafo de código resolve isso com um passo que não chama IA: Tree-sitter monta a estrutura, o blast radius acha os arquivos que a mudança toca, e só então a IA revisa esses. 150k vira 18k, 8,3x, offline e de graça. Da próxima vez que sua conta de API doer numa revisão de PR, lembra: a parte que mais pesa na qualidade é a parte que você pode rodar sem gastar um centavo de token.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
