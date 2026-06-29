---
title: "Pare de pagar pelo modelo grande: Haiku + RAG fez 11,8 contra 5,3 do Sonnet sozinho"
description: "Cinco estratégias de contexto, uma pergunta sobre uma ferramenta fictícia, e um resultado contrarian: o modelo menor com contexto bem montado venceu o modelo maior sem contexto por mais de 2x. Os números e o porquê."
date: 2026-06-29
lang: pt
tags: [context-engineering, rag, claude, anthropic, llm]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/haiku-rag-vence-sonnet-sozinho-contexto"
og_image: "https://kenimoto.dev/images/blog/haiku-rag-vence-sonnet-sozinho-contexto/og-pt.png"
cross_posted_to: []
---

Toda vez que abro uma discussão de arquitetura LLM aqui no Brasil, alguém defende a mesma coisa: "se a qualidade está ruim, sobe pro Sonnet". Quase nunca alguém pergunta o que o modelo está vendo antes de responder. A culpa cai no modelo. A solução é trocar de modelo. A conta no fim do mês cai no time.

Rodei um experimento simples para conferir esse instinto, e o resultado me fez fechar duas issues que estavam abertas justamente para "upgradar pra Sonnet". O Haiku 3 (modelo menor, mais barato) **com RAG bem desenhado** marcou **11,8/20** numa avaliação de qualidade. O Sonnet 4 (modelo maior, mais caro) **sem contexto** marcou **5,3/20**. Mais de 2x de diferença, e a vitória foi do modelo que custa uma fração do outro.

Esse post conta o experimento, mostra de onde os números vêm, e termina com a parte que ninguém quer ouvir: quando essa lógica para de valer.

![Haiku 3 + RAG marcou 11,8/20 vs Sonnet 4 sem contexto 5,3/20](/images/blog/haiku-rag-vence-sonnet-sozinho-contexto/haiku-rag-vs-sonnet-sozinho-pt.png)

## O experimento — uma pergunta, cinco estratégias de contexto

A pergunta foi sobre uma ferramenta fictícia de autenticação chamada "PropelAuth":

> "Conte sobre as funcionalidades de gestão de organizações do PropelAuth. Especificamente, como criar uma organização, convidar usuários e gerenciar permissões?"

A ferramenta **não existe**. Isso é o ponto chave do experimento. Se você perguntar sobre Firebase ou Supabase, o modelo já tem conhecimento de pretreino sobre o produto e a melhoria do contexto vira impossível de isolar. Com uma ferramenta fictícia, qualquer resposta "específica" sem contexto adequado é alucinação pura, e dá pra medir quanto.

Cinco estratégias foram testadas, em ambos os modelos:

1. **Sem contexto** — só a pergunta
2. **Apenas system prompt** — "se não souber, diga 'desconhecido'"
3. **System + few-shot** — exemplos de respostas honestas
4. **System + RAG** — busca semântica na documentação fictícia
5. **Contexto completo** — toda a doc PropelAuth carregada

A avaliação usou quatro eixos (framework SHRR), cada um valendo 5 pontos, totalizando 20:

- **S**pecificity: a resposta inclui detalhe concreto e operacional?
- **H**allucination resistance: o modelo evita fabricar informação?
- **R**eliability (factual accuracy): bate com a especificação real?
- **R**esponsibility (honesty): o modelo comunica incerteza apropriadamente?

## Os números — Sonnet 4 vs Haiku 3

O que saiu da planilha:

**Claude Sonnet 4 (modelo maior):**

| Estratégia | Total /20 |
|---|---|
| Sem contexto | 5,3 |
| Apenas system prompt | 8,8 |
| System + few-shot | 9,2 |
| System + RAG | 10,8 |
| Contexto completo | 11,4 |

**Claude Haiku 3 (modelo menor):**

| Estratégia | Total /20 |
|---|---|
| Sem contexto | 2,2 |
| Apenas system prompt | 3,7 |
| System + few-shot | 8,2 |
| **System + RAG** | **11,8** |
| Contexto completo | 10,1 |

Compare a linha que importa: **Haiku 3 com RAG (11,8) ganhou de Sonnet 4 sem contexto (5,3) por 2,2x**. E pra deixar mais doloroso: Haiku com RAG até ganhou do Sonnet com RAG (10,8) por uma margem pequena, mas ganhou.

Não é o modelo que estava errado. É o que o modelo estava vendo.

## Por que o "Contexto completo" perdeu pro RAG no Haiku

Tem uma pegadinha nesses números que vale destacar, porque ela contraria o instinto. No Haiku 3, **Contexto completo (10,1)** ficou abaixo de **System + RAG (11,8)**. Mais informação rendeu pior resposta.

A explicação é o famoso "lost in the middle" — quando você joga toda a documentação no prompt, a atenção do modelo se dilui, e detalhes importantes no meio do contexto começam a ser ignorados. O RAG, por escolher só 3-5 trechos relevantes, mantém a relação sinal/ruído alta. O modelo menor sofre mais com diluição de contexto, então o RAG ajuda mais ele do que o modelo grande.

Isso bate com o [guia de engenharia de contexto eficaz da Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), publicado em 2026, que documenta exatamente esse padrão: **modelos menores são mais sensíveis a contexto ruim, e mais beneficiados por contexto bem desenhado**.

## A matemática de custo que ninguém faz

Vamos colocar o custo na conta. Preços da Anthropic em junho de 2026 (valores reais — confira no [pricing oficial](https://www.anthropic.com/pricing)):

| Modelo | Input (US$/1M tokens) | Output (US$/1M tokens) |
|---|---|---|
| Claude Haiku 3 | 0,25 | 1,25 |
| Claude Sonnet 4 | 3,00 | 15,00 |

O Sonnet custa **12x mais no input e output**. Suponha 100 mil consultas por mês, com 800 tokens de input médio e 400 de output:

- **Haiku 3 + RAG**: ~US$ 70/mês (R$ 378 a R$ 5,40/US$)
- **Sonnet 4 sem contexto**: ~US$ 840/mês (R$ 4.536)

Vejam o que está acontecendo aqui: a configuração que dá resposta **melhor** custa **12x menos**. O time que "subiu pro Sonnet pra resolver qualidade" está pagando 12x mais por uma resposta pior do que poderia ter tido com Haiku + RAG. Eu sou um deles, três projetos atrás. Não foi orgulho que me fez consertar, foi a fatura.

## Quando essa lógica para de valer

Pra não virar fanboy de RAG (já vi gente jurar que RAG resolve tudo, igual quem jurava blockchain em 2017), vale falar quando o padrão **não** funciona:

**1. Tarefas de raciocínio multi-step complexo.** Resolver problemas matemáticos complicados, debugar arquitetura distribuída, planejar uma migração com 30 dependências. Aqui o modelo maior ganha mesmo com contexto bom, porque a capacidade de raciocínio domina sobre a qualidade da informação.

**2. Quando o conteúdo é o conhecimento do modelo.** Pedir explicação de algoritmos clássicos, padrões de design conhecidos, conceitos de ciência da computação. O Sonnet já tem isso bem mapeado no pretreino. RAG vai só atrapalhar.

**3. Quando o RAG é mal montado.** RAG com chunks ruins, embeddings velhos, sem reranking — vira pior do que sem contexto. O experimento testa RAG **bem montado** (chunks de tamanho razoável, top-3 relevantes, prompt template enxuto). Se sua infra de RAG é capenga, troque o RAG antes de trocar o modelo.

## O reflexo errado que custa caro

Tem um reflexo que se repete em todo time: latência alta → cache; bug → mais testes; resposta ruim → modelo maior. Os dois primeiros geralmente funcionam. O terceiro, **geralmente não**.

O experimento PropelAuth mostra com número o que muitos perceberam na fatura: a maior alavanca de qualidade não é o tamanho do modelo, é o desenho do contexto. Não custa nada testar a inversão antes de migrar pra Sonnet:

1. Pegue a sua query que está dando resposta ruim
2. Rode no Haiku 3 com RAG bem montado (3-5 docs relevantes)
3. Compare com Sonnet sem contexto na mesma query
4. Olhe o custo dos dois cenários numa janela de 30 dias

Se Haiku + RAG ganhar de Sonnet sozinho, e em muitos casos vai ganhar, o roadmap muda. Em vez de "trocar de modelo", você melhora o pipeline de contexto. Mais barato, melhor qualidade, e o time fica obrigado a entender a própria base de conhecimento — coisa que terceirizar para Sonnet pretende evitar.

A lição, em uma linha: **antes de subir o modelo, conserte o que ele vê**.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
