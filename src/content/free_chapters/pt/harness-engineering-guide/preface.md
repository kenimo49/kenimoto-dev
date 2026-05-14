---
free: true
title: "Prefácio — Por que 'harness', e por que agora"
---

![Um harness — o arreio que controla o poder da IA](/images/books/harness-engineering-guide/harness-horse.jpg)

## Uma terça-feira, 3 da manhã

3 da manhã de uma terça-feira. O engenheiro de plantão de uma equipe acorda com um alerta do PagerDuty.

O custo de API disparou. Olhando o painel: mais de US$ 400 queimados na última hora. Investigando, descobre-se que um agente de IA implantado no dia anterior vinha martelando uma API instável com retries. A cada erro, voltava ao loop "deixa eu tentar de novo," e ficou assim até de manhã.

O agente não era o problema. O modelo estava bem. O prompt estava bem escrito. O que faltava era um **harness**. Disseram ao agente "corra," mas nunca lhe deram freios nem volante.

Esta história não é incomum. Há uma frase que circula no campo:

> **"The model is commodity. The harness is moat."**

Quando um agente que funcionou perfeitamente na demo quebra em produção, quase sempre é problema de harness.

Em fevereiro de 2026, a OpenAI publicou um post no blog: "Harness engineering: leveraging Codex in an agent-first world."

A história é a seguinte: por cinco meses, uma equipe de engenharia não escreveu uma única linha de código à mão. Construiu uma aplicação em produção com mais de um milhão de linhas usando apenas agentes Codex. Tempo de build: um décimo do que seria escrever manualmente.

"Humanos guiam. Agentes executam."

Engenheiros não tiveram seus empregos roubados — a definição do trabalho mudou.

Esse post acendeu a chama. Depois veio o relatório da "tempestade de retries de US$ 47.000" de um fim de semana de fevereiro de 2026. Um agente de enriquecimento de dados interpretou um código de erro de API como "tente novamente com parâmetros diferentes" e disparou 2,3 milhões de chamadas. Segunda de manhã, os engenheiros voltaram a uma fatura de US$ 47.000. Bom que o agente trabalhou no fim de semana, mas nem tanto quando a entrega é zero e a fatura aparece. Dias depois, a Anthropic publicou dois guias de design de harness. A LangChain definiu "Agent = Model + Harness." Martin Fowler escreveu um comentário. Um artigo acadêmico foi para o arXiv.

2024 foi o ano da Engenharia de Prompt. A era de polir "o que perguntar à IA."

2025 foi o ano da Engenharia de Contexto. Andrej Karpathy disse "The hottest new programming language is English," e o trabalho passou a desenhar "o que mostrar à IA."

2026: o palco se amplia. Harness Engineering: "como projetar todo o ambiente em que o agente opera?"

Mas o termo é interpretado de forma um pouco diferente dependendo de quem escreve. OpenAI e Anthropic enfatizam coisas diferentes. LangChain e Martin Fowler atacam de ângulos diferentes. Os artigos acadêmicos vêm de outra direção ainda.

Este livro apresenta, de forma sistemática, uma visão geral de Harness Engineering.

- A relação entre as três práticas de engenharia (Prompt / Context / Harness)
- Como os principais players (OpenAI / Anthropic / LangChain / Martin Fowler / academia) divergem na interpretação
- A anatomia dos seis componentes
- Onde fica em relação a ideias próximas (Vibe Coding / Spec Coding / Agent Frameworks)
- Estudos de caso práticos da comunidade japonesa
- Para onde tudo isso está indo

É ao mesmo tempo um livro de organização conceitual e um guia prático que você pode usar amanhã. O objetivo: quando alguém perguntar "tá bom, mas o que *é* um harness?", você entrega este livro e considera a tarefa cumprida.

## Para quem é este livro

- Engenheiros que começaram a usar agentes de IA (Claude Code, GitHub Copilot, Cursor, etc.)
- Quem escreveu um AGENTS.md ou CLAUDE.md mas não tem certeza se acertou
- Quem conhece Engenharia de Prompt mas está ouvindo "Harness Engineering" pela primeira vez
- Gerentes e tech leads que querem trazer agentes de IA para o time

O único pré-requisito é o básico de Engenharia de Prompt — ter ouvido falar de Few-shot e Chain-of-Thought já é suficiente.

## Como ler este livro

Você pode ler de capa a capa, ou pular para os capítulos que interessarem. Dito isso, três capítulos valem a pena de qualquer forma:

- **Capítulo 1**: entender como as três práticas de engenharia se relacionam (o mapa do território)
- **Capítulo 8**: aprender os seis componentes (o esqueleto da prática)
- **Capítulo 11**: aprender a escrever AGENTS.md (algo que você usa amanhã)
