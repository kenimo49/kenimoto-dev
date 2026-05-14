---
free: true
title: "Introdução"
---

# Introdução

## Para você que escolheu este livro

**Em resumo: este livro é um guia prático para extrair a maior qualidade possível das respostas de um LLM por meio do desenho do contexto.**

"Perguntei algo ao ChatGPT e recebi uma resposta superconfiante. Aí eu fui checar e era tudo mentira."

Já passou por isso?

O protagonista deste livro é o LLM. Pense nele como um novo contratado brilhante no primeiro dia. Conhecimento zero do setor, mas cheio de confiança. Entregue o material de onboarding certo e ele vira um colaborador imediato.

:::message
**Analogia do novo contratado**: imagine que um recém-formado de uma universidade top aparece no primeiro dia. Você pergunta "consegue me explicar nossos sistemas internos?" e ele responde com princípios gerais e intuição. É afiado e aprende rápido. Só não sabe ainda nada sobre *esta* empresa.
:::

Quem começou a usar LLMs no trabalho provavelmente bateu nesse problema. Você ajusta o prompt, define um papel, adiciona "responda com precisão". E a IA continua mentindo com confiança.

Este livro nasceu de um experimento que enfrentou esse problema de frente.

## O que o experimento revelou

**Em resumo: o que decide a qualidade da saída de um LLM é o desenho do contexto, não o tamanho do modelo.**

Para investigar como a IA se comporta diante de "informação que ela não pode saber", construí três ferramentas internas fictícias e medi a qualidade das respostas em cinco estratégias de contexto diferentes.

Os resultados foram contundentes.

- Sem **nenhum contexto**, a IA devolveu "respostas plausíveis, mas totalmente fabricadas"
- Com **RAG (Retrieval-Augmented Generation)** injetando documentação, a precisão factual saltou de **zero para 4,8**
- O achado mais surpreendente: **um modelo menor com bom contexto (pontuação 11,8) esmagou um modelo maior sem contexto (pontuação 5,3)**

O que decide a qualidade da saída de um LLM não é o tamanho do modelo nem a sagacidade do prompt. É **o desenho do contexto**.

A disciplina de desenhar esse contexto sistematicamente é a **Engenharia de Contexto**.

---

## Como este livro está organizado

O livro tem três partes.

**Parte 1, "O que muda quando o contexto muda" (Capítulos 1-4)**, percorre os resultados experimentais e explica por que a Engenharia de Contexto é necessária. O Capítulo 4 inclui um exercício prático que melhora um System Prompt diretamente. A ideia é sentir o efeito com as próprias mãos antes de aprofundar a teoria.

**Parte 2, "Cinco técnicas, em camadas" (Capítulos 5-9)**, cobre uma a uma as técnicas que compõem a Engenharia de Contexto: few-shot, RAG, MCP, memória, etc. Cada capítulo amarra os dados experimentais para você ver "se eu adicionar essa técnica, como muda a pontuação?" — assim você avalia custo-benefício enquanto lê.

**Parte 3, "Engenharia de Contexto no campo" (Capítulos 10-15)**, apresenta padrões do mundo real: desenho de CLAUDE.md para Claude Code, implementação de Agentic RAG, adoção em empresas e mais.

Cada capítulo termina com uma **🚀 Próxima Ação**: uma coisa concreta para fazer logo depois da leitura. O objetivo não é concordar e seguir adiante. É deixar você com algo para experimentar amanhã.

## Sobre a "Série de Práticas de IA para Engenheiros"

Este é o volume 2 da "Série de Práticas de IA para Engenheiros".

- **Volume 1: *Practical Claude Code***. A prática da codificação assistida por IA.
- **Volume 2: *Engenharia de Contexto*** (este livro). Fazendo a IA pensar corretamente.

O que os livros compartilham: **tudo é fundamentado no que o autor aprendeu fazendo o trabalho de fato**. Os dados experimentais aqui são dados primários de chamadas de API reais, não citações de teoria.

**Este livro é independente. Você pode ler sem ter lido o volume 1.**

## Para quem é este livro

- Engenheiros que começaram a usar LLMs no trabalho
- Equipes que implantaram RAG e não estão satisfeitas com a precisão
- Desenvolvedores construindo agentes de IA
- Quem se pergunta "o que vem depois de prompting?"

Os únicos pré-requisitos são Python básico e API básica. Você não precisa conhecer a fundo o funcionamento interno dos LLMs.

## Como ler

Recomendo ler na ordem, mas há atalhos:

- **Quer só o resumo** → Capítulo 1 e Capítulo 13
- **Quer melhorar RAG** → Capítulo 6 e Capítulo 7
- **Quer usar Claude Code bem** → Capítulo 10
- **Considera adoção enterprise** → Capítulo 12 (a e b)

Com isso, vamos entrar no mundo da Engenharia de Contexto.
