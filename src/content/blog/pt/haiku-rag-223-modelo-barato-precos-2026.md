---
title: "O modelo barato + RAG bateu o caro em 223% nos meus testes. Refiz a conta com os preços de 2026."
description: "Haiku + RAG (11,8) bateu o Sonnet sozinho (5,3) em 223% no meu benchmark. A economia era de 82% ao mês. Aí fui refazer a conta com os preços de maio de 2026 e tomei um susto: o número bonito encolheu, mas a conclusão ficou mais forte."
date: 2026-05-31
lang: pt
tags: ["context-engineering", "rag", "custo-llm", "claude", "haiku"]
featured: false
og_image: "https://kenimoto.dev/images/blog/haiku-rag-223-modelo-barato-precos-2026/og-pt.png"
cross_posted_to: []
---

Eu achava que modelo maior sempre ganhava. Achei isso por mais ou menos um ano, com a confiança de quem nunca mediu. "Tem dúvida? Sobe pro Sonnet. Ainda tem dúvida? Sobe pro Opus." Era assim que eu resolvia qualquer queda de qualidade: jogando dinheiro e parâmetros no problema.

Aí eu medi. E o resultado virou minha cabeça do avesso.

No benchmark que rodei, o **Claude Haiku 3 com RAG marcou 11,8. O Claude Sonnet 4 sozinho, sem contexto, marcou 5,3.** O modelo pequeno e barato, com o contexto certo, bateu o modelo grande em 223%: ou seja, entregou mais que o dobro da pontuação. Não foi empate técnico. Foi atropelamento.

E o mais engraçado: o Haiku com RAG (11,8) também bateu o próprio Haiku com Engenharia de Contexto completa (10,1). Empilhar técnica demais piorou. RAG sozinho extraiu mais do modelo do que RAG + tudo mais junto. Guarde essa, porque ela contraria outra crença que eu também tinha.

## A conta que me convenceu (preços de 2025)

Performance é metade da história. A outra metade é a fatura.

Com a tabela da Anthropic de 2025, o Haiku 3 custava US$ 0,25 de input e US$ 1,25 de output por 1M de tokens. O Sonnet 4 custava US$ 3 e US$ 15. Fazendo a média numa razão 1:1, dava US$ 0,75 contra US$ 9 por 1M de tokens. **O Sonnet custava 12x mais que o Haiku.**

RAG tem custo extra (vetorização, busca, tokens a mais no contexto). Mesmo somando uns 50% de overhead, o Haiku + RAG ficava em US$ 1,125 por 1M de tokens, ainda 1/8 do Sonnet, com performance maior.

Traduzindo pra fatura mensal, com 1.000 queries por dia:

- Sonnet 4 sozinho: **US$ 405/mês**
- Haiku 3 + RAG: **US$ 71,25/mês**

Uma queda de 82%. O ROI (performance dividido por custo) do Haiku + RAG era de 17,8x o do Sonnet. Eu tinha o número bonito na mão, pronto pra estampar no título. Era isso que o livro por trás desses testes registrou, em 2025.

## Aí refiz a conta em maio de 2026

Antes de publicar, fui conferir os preços atuais. Boa prática chata, dessas que você faz reclamando. Tomei um susto.

A [tabela da Anthropic de 2026](https://platform.claude.com/docs/en/about-claude/pricing) mudou de figura. O Haiku 4.5 agora custa **US$ 1 de input e US$ 5 de output** por 1M de tokens. O Sonnet 4.6 seguiu em US$ 3 e US$ 15. Faça a conta: o gap que era de 12x virou **5x**. A Anthropic encareceu o modelo pequeno e, de quebra, derrubou meu número bonito.

Refiz a fatura mensal com os preços de hoje, mesmo cenário de 1.000 queries/dia:

- Sonnet 4.6 sozinho: ainda **US$ 405/mês** (o preço dele não mudou)
- Haiku 4.5 + RAG: input US$ 0,003 + output US$ 0,0025 + uns US$ 0,001 de operação de RAG por query = **US$ 195/mês**

Economia de 52%, não de 82%. O ROI despencou de 17,8x pra algo na casa de 4x. Na cotação de maio de 2026 (uns R$ 5,50 por dólar, varia toda hora), isso é mais ou menos R$ 1.150/mês que paravam de sair da conta, bem menos que os R$ 1.800 que a versão antiga prometia.

Eu poderia ter publicado o "-82%" e ninguém ia conferir. Conferiram menos do que isso na internet. Mas o número honesto eu confio mais que o bonito, então é esse que vai no título.

![Comparação: a performance de 223% se manteve; o gap de preço caiu de 12x para 5x e a economia mensal caiu de 82% para 52% entre 2025 e 2026.](/images/blog/haiku-rag-223-modelo-barato-precos-2026/2025-vs-2026.png)

## Por que a conclusão ficou MAIS forte, não mais fraca

Aqui está a parte contraintuitiva. O número encolheu, mas o argumento engordou.

Pensa comigo: em 2025, o modelo pequeno que ganhava era o Haiku 3. Em 2026, por US$ 1/US$ 5, você não está mais comprando o Haiku 3: está comprando o Haiku 4.5, que é uma geração inteira mais capaz. O gap de preço caiu de 12x pra 5x, é verdade. Mas o gap de *capacidade* entre o modelo pequeno e o grande caiu junto, e a favor do pequeno.

Eu não vou inventar um número novo de benchmark aqui, porque não re-rodei o experimento com o Haiku 4.5 (e desconfie de quem te dá número de cabeça). Mas a direção é clara: quando o modelo barato fica mais esperto e o caro fica no mesmo lugar, "subir pro Sonnet por reflexo" fica cada vez mais difícil de justificar na planilha.

A tese do livro nunca foi "Haiku é mágico". Foi "performance = modelo × contexto, e contexto é mais barato que parâmetro". Essa equação não depende da tabela de preços de um mês específico.

## O playbook que eu uso antes de trocar de modelo

Trocar de tier tem método. Quem só aperta um botão e reza paga por isso depois. Esse é o roteiro que sigo:

**1. Meça o custo atual de verdade.** Pegue queries/dia, tokens médios de input e output, e multiplique pela tabela atual. Quase ninguém sabe quanto gasta por query antes de medir. Eu não sabia.

**2. Calcule a alternativa com RAG embutido.** Modelo de baixo + os tokens extras do contexto recuperado. Some o overhead de embeddings e busca vetorial. Se você está na nuvem, não esqueça o custo do banco vetorial.

**3. Rode A/B por 7 dias.** Modelo atual e configuração nova em paralelo, nas mesmas tarefas. Critério de corte que eu uso: a pontuação de qualidade tem que ficar em 95%+ da atual, e a taxa de erro não pode subir mais que 10%. Economia que derruba qualidade não é economia, é dívida.

**4. Migre em estágios.** 10% do tráfego na semana 1, 30% na 2, 70% na 3, 100% na 4. Monitore em cada degrau e faça rollback na hora se algo torcer o nariz.

## "Mas e a janela de 1M tokens?"

Já ouço a objeção, porque eu mesmo levantei ela. Com janelas de 1M de tokens em produção, por que se dar ao trabalho de RAG? É só jogar tudo no contexto.

Dois motivos. Primeiro, contexto longo não é de graça: o custo de processamento cresce mais que linearmente, e você paga por cada token que enfia ali. Segundo, e mais sério, jogar tudo no contexto não significa que o modelo usa tudo: é o velho problema do "perdido no meio", onde a informação no miolo do contexto é solenemente ignorada. RAG não é só economia de token. É curadoria. Você está escolhendo o que o modelo vê, em vez de despejar e torcer.

A janela de 1M muda o ponto de equilíbrio, sim. Não apaga ele.

## O que eu tirei de tudo isso

Duas coisas. A primeira: medir antes de subir de tier. O reflexo de "tá ruim, sobe pro modelo caro" me custou dinheiro por meses, e na maioria das vezes o problema era contexto, não tamanho de modelo. Um modelo pequeno bem-alimentado ganha de um modelo grande faminto.

A segunda, mais incômoda: confira os números antes de publicar, principalmente os que te favorecem. Meu "-82%" virou "-52%" numa tarde, só porque fui olhar a tabela de preços atual em vez de confiar na do ano passado. O número bonito quase me pegou. O número honesto é menos vistoso e dorme melhor.

O modelo barato ainda venceu o caro nos meus testes. Só que agora eu sei por quanto de verdade.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
