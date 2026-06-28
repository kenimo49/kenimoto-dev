---
title: "Codex rodou em 1 milhão de linhas de código: e provou que trocar de modelo nunca conserta seu agente"
description: "A OpenAI deixou o Codex solto em 1M de linhas reais. O que decidiu o resultado não foi o modelo, foi o harness ao redor dele. E essa equação muda como você deveria gastar suas próximas 10 horas de ajuste."
date: 2026-06-28
lang: pt
tags: [openai-codex, harness-engineering, ai-agent, langchain]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/codex-1-milhao-linhas-trocar-modelo-nao-conserta-agente"
og_image: "https://kenimoto.dev/images/blog/codex-1-milhao-linhas-trocar-modelo-nao-conserta-agente/og-pt.png"
cross_posted_to: []
---

Toda vez que abro o TabNews na segunda de manhã, encontro pelo menos um post no formato "troquei o modelo X pelo Y e o agente continua errando." Já escrevi um desses. Funciona como terapia coletiva: a gente reclama do GPT, reclama do Claude, reclama do Gemini, e depois ninguém muda nada na arquitetura do agente.

Acontece que em fevereiro de 2026 a OpenAI publicou um experimento que joga uma luz desconfortável em cima desse hábito. Eles deixaram o Codex (o conjunto de agentes) escrever **um milhão de linhas de código em cinco meses**, sem nenhuma linha escrita por humanos, e o que decidiu o resultado **não foi o modelo**. Foi o harness ao redor dele.

Se você está prestes a gastar mais 10 horas trocando de provedor, leia isso antes.

![Codex 1M LOC: harness decide, não o modelo](/images/blog/codex-1-milhao-linhas-trocar-modelo-nao-conserta-agente/codex-harness-equacao.png)

## O experimento que ninguém comentou direito

Em 13 de fevereiro de 2026 a OpenAI publicou *"Harness engineering: leveraging Codex in an agent-first world"* ([fonte oficial](https://openai.com/index/harness-engineering/)).

Os números:

- **Cinco meses** de execução
- **~1 milhão de linhas** de código (lógica de aplicação, testes, CI, observabilidade, ferramentas internas, documentação)
- **Zero linhas** escritas à mão
- **~1.500 pull requests** abertos e merged
- **Apenas 3 engenheiros** dirigindo Codex → média de **3,5 PRs por engenheiro por dia** ([InfoQ cobertura](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/))
- Tempo de build: **um décimo** do método manual

A leitura preguiçosa é "ah, é porque o modelo da OpenAI é melhor." A leitura honesta, que aparece tanto no post da OpenAI quanto na análise do Adithya Giridharan (Medium), é:

> "O segredo não foi um modelo melhor nem um prompt mais esperto. Foi o sistema construído ao redor do agente: o harness."

Reescreva isso 5 vezes num post-it e cole no monitor antes de abrir o próximo "comparativo Claude vs GPT vs Gemini."

## A equação que a LangChain colocou em uma linha

Quase no mesmo período, a LangChain publicou *"The Anatomy of an Agent Harness"* com a definição mais limpa que existe hoje:

> **Agent = Model + Harness**
>
> O modelo tem a inteligência. O harness torna essa inteligência útil.

A LangChain veio com prova quantitativa. No mesmo benchmark, **com o mesmo modelo**, melhorando apenas o harness eles subiram de **52,8% para 66,5% de precisão**. Ganho de 13,7 pontos sem trocar uma linha do modelo.

Pare e processe isso por 5 segundos.

Se você está gastando suas próximas 10 horas tentando decidir entre Claude Sonnet 4.6 e GPT-5, e seu harness é um `system_prompt` de 8 linhas mais um `try/except`, esse benchmark diz que você está otimizando a peça errada.

## Por que trocar de modelo parece resolver (mas não resolve)

Existe uma armadilha psicológica aqui que é interessante.

Quando você troca de modelo e o agente "fica melhor por dois dias," você está vendo três coisas ao mesmo tempo, e atribuindo o ganho à errada:

1. O novo modelo realmente é um pouco melhor em alguns eixos
2. Você revisou seus prompts ao migrar (porque novo modelo, novo formato esperado)
3. Você ajustou tools/permissões silenciosamente no caminho

O ganho que você sentiu veio de **(2) e (3)**, ou seja, do harness. Você só acreditou que veio de **(1)** porque foi a parte que ficou mais visível na sua memória — "instalei o GPT-5 segunda de manhã e na quinta o agente acertou aquele bug."

Duas semanas depois o agente volta a errar, porque (2) e (3) não foram tratados como mudanças estruturais. Foram ajustes incidentais. E você abre o navegador para procurar o próximo modelo. Bem-vindo ao loop.

A InfoQ resume bem o ponto da OpenAI:

> O trabalho humano migrou de "escrever código" para "escrever o ambiente em que os agentes rodam corretamente."

Esse "ambiente" é o harness. É onde está a alavanca real.

## O que a OpenAI considera "harness," concretamente

Não é uma palavra abstrata. A OpenAI lista cinco peças no post original:

| Peça | O que significa na prática |
|------|---------------------------|
| Prompts declarativos | "Endpoints precisam ter tratamento de erros + cobertura 90%+" em vez de "edite users.ts linha 47" |
| Execução em sandbox | O agente roda em ambientes isolados, não na sua máquina de dev |
| Definições de ferramentas | Permissões de acesso a arquivos e comandos explicitamente declaradas |
| Garantia de qualidade | Geração de testes + execução automatizada de CI no loop |
| Escala | Execução paralela controlada além dos rate limits |

Repare que **nenhuma delas é sobre qual modelo usar**. Todas são sobre o que está em volta.

A VibeSparking.com fez uma observação que ficou na minha cabeça: "Reescrever a saída do linter para que um agente de IA consiga entender. Esse é o aspecto da engenharia em 2026." Não é mais "escrever código." É **escrever o ambiente onde código é escrito**.

## As próximas 10 horas: onde gastar

Se você acabou de fechar mais um comparativo de modelos sem ter mexido em uma linha do seu setup, aqui está uma redistribuição de tempo que tem retorno mensurável:

- **3 horas** — escrever um `AGENTS.md` ou `CLAUDE.md` que diz "qual é o objetivo," "quais são as regras invioláveis," "o que tem que rodar antes de cada commit." Sem isso, qualquer modelo vai inventar regras na hora.
- **2 horas** — definir explicitamente as `tools` permitidas. Cada ferramenta a mais é uma superfície de erro a mais. Cada ferramenta de menos é uma desculpa para o agente alucinar.
- **2 horas** — colocar uma camada de verificação obrigatória entre a saída do agente e o merge (linter + tipos + testes mínimos). Sem isso você está pedindo para o agente se auto-avaliar, o que é como pedir para o motorista bêbado se auto-bafometrar.
- **2 horas** — instrumentar tracing básico (qual tool foi chamada, quantos tokens, qual erro). Sem isso você não sabe o que falhou, e você vai voltar a achar que é "o modelo."
- **1 hora** — escrever o "loop de retry" com timeout. Sem isso um erro transitório fica girando até quebrar a conta.

Note que **zero das 10 horas vão para escolher modelo**. Use o modelo que você já tem. As 10 horas acima sobem precisão mais que qualquer troca de provedor, e a LangChain provou isso com 13,7 pontos.

## Onde dá para empacar nessa mudança

Honestamente, três armadilhas previsíveis:

**1. "Mas meu CLAUDE.md vai virar uma bíblia de 800 linhas."** Não. Mantenha 5 a 7 restrições duras no máximo. O resto vai para arquivos de skill referenciáveis. Se vira bíblia, o próprio agente para de ler.

**2. "Os engenheiros vão reclamar que o harness está engessando o trabalho."** Vão mesmo, na primeira semana. Na quarta semana vão reclamar quando alguém tentar tirar. Métrica: taxa de retrabalho. Antes/depois. Mostre o gráfico.

**3. "Não temos tempo para isso, temos prazo."** Esse é exatamente o ponto. O prazo vai estourar de novo no próximo trimestre exatamente pela mesma razão pela qual estourou neste. As 10 horas acima compram tempo composto. Trocar de modelo compra dois dias de placebo.

## Resumo

- OpenAI provou em **1M de linhas / 5 meses / 3 engenheiros / 1.500 PRs** que harness > modelo
- LangChain quantificou: **mesmo modelo + harness melhor = +13,7 pontos** (52,8% → 66,5%)
- Trocar de modelo parece resolver porque ao migrar você ajusta prompts/tools sem perceber, e atribui o ganho ao modelo
- As próximas 10 horas de ajuste rendem mais em `AGENTS.md` + tools + verificação + tracing + retry do que em comparativo de provedor
- Agent = Model + Harness. Se você só mexe no Model, está atuando em metade da equação

Se você vai abrir um navegador agora, abre o seu repositório, não o blog de comparativo. O ganho está lá.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
