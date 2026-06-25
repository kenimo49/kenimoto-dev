---
title: "Agent = Model + Harness: Por Que Trocar GPT por Claude Nunca Resolve o Bug do Seu Agente"
description: "Troquei GPT-4o por Claude Opus 4.7 em produção esperando 'subir um nível'. O bug do meu agente continuou igual. Descobri da pior forma que 80% do comportamento mora no harness, não no modelo — e aqui está a tabela de quem é responsável pelo quê."
date: 2026-06-25
lang: pt
tags: [langchain, langgraph, agentes-ia, harness-engineering, claude, gpt]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/agent-equal-model-mais-harness-trocar-modelo-nao-resolve"
og_image: "https://kenimoto.dev/images/blog/agent-equal-model-mais-harness-trocar-modelo-nao-resolve/og-pt.png"
cross_posted_to: []
---

Eu fiz aquela coisa que parece esperteza e na verdade é fuga: troquei o modelo do meu agente em produção, esperando que o problema fosse embora.

O cliente reclamava que o agente entrava em loop com a mesma chamada de tool, perdia o contexto na terceira pergunta e devolvia respostas inconsistentes em sessões parecidas. Estava rodando em GPT-4o. Eu fiz a coisa esperta: troquei para Claude Opus 4.7, modelo mais novo, mais caro, supostamente melhor em raciocínio longo. Estava certo de que ia "subir um nível" o agente.

Subi a fatura. O bug continuou exatamente igual.

Não foi um pouco melhor. Não foi 30% pior. Foi o mesmo bug, na mesma posição, com o mesmo sintoma. A única diferença é que agora estava me custando mais por turno.

Esse foi o momento em que entendi a frase que o Harrison Chase, CEO da LangChain, repete há um ano e meio: **Agent = Model + Harness**. E que 80% do comportamento mora no segundo termo.

## A definição que eu deveria ter levado a sério

A LangChain publicou no início de 2025 um post chamado "Agent Frameworks, Runtimes, and Harnesses — oh my!" onde o Chase separa três coisas que a maioria de nós (eu incluído) tratava como uma só ([LangChain blog](https://www.langchain.com/blog/agent-frameworks-runtimes-and-harnesses-oh-my)):

> O modelo é o LLM — tokens, messages in, messages out. O harness é o que vem em volta: planejamento, memória, subagentes, file system, prompts iniciais. "Batteries included."

A frase que ele martela em entrevistas é mais direta: **"Harness design alone creates up to 6x performance variation on the same underlying model"** ([Sequoia podcast](https://sequoiacap.com/podcast/context-engineering-our-way-to-long-horizon-agents-langchains-harrison-chase/)). Seis vezes. No mesmo modelo. Só mudando o harness.

Quando eu li isso pela primeira vez achei que era marketing. "Claro que o CEO de uma empresa de harness vai dizer que harness importa." Mas o número saiu de benchmarks internos da LangChain que comparam o mesmo modelo rodando em runtimes diferentes — não é figura de estilo, é medição.

Em 2026, com a empresa empilhada em LangChain (framework) + LangGraph (runtime) + Deep Agents (harness) ([LinkedIn Chase](https://www.linkedin.com/posts/harrison-chase-961287118_agent-framework-vs-runtime-vs-harness-activity-7387885717261078529-_Mn_)), a tese deixou de ser opinião e virou arquitetura assumida.

## Os bugs que sobrevivem à troca de modelo

Vamos ao concreto. O que faz um bug **não se resolver** quando você troca o LLM? Eu peguei alguns exemplos reais dos issues abertos do LangGraph em 2025-2026:

**Loop infinito no LangGraph 1.0.6** — um agente Text-to-SQL ficava rodando indefinidamente, mesmo com prompt claro de parada. O mesmo agente em LangGraph 0.6.x parava normalmente ([issue #6731](https://github.com/langchain-ai/langgraph/issues/6731)). O modelo era o mesmo. O bug estava no runtime.

**Tool node parou de tratar erro automaticamente** — depois do upgrade pra langgraph-prebuilt 1.0.1, tool nodes deixaram de capturar exceções de tools que antes capturavam silenciosamente ([issue #6486](https://github.com/langchain-ai/langgraph/issues/6486)). Trocar o modelo não resolveria esse comportamento: o tratamento de erro estava no nó da grafo, não na resposta do LLM.

**Serialização de tool quebrada após LangChain 1.0** — depois do upgrade, tools deixaram de ser serializadas no formato esperado por adaptadores downstream (LangSmith, Langfuse), e a UI de tracing parou de reconhecê-las ([issue Langfuse #11850](https://github.com/langfuse/langfuse/issues/11850)). Outra vez: o bug não está no LLM, está na camada de orquestração.

**Tentativa repetida de tool após edição humana** — o agente, depois que um humano editava a chamada de tool via Human-in-the-loop middleware, repetia a chamada original em vez de usar a editada ([issue #33787](https://github.com/langchain-ai/langchain/issues/33787)). O modelo "obedeceu" o seu state, e o state estava estragado pelo middleware.

Os quatro são bugs reais, reportados em produção, em 2025-2026. Os quatro continuariam idênticos se você trocasse GPT-4o por Claude Opus 4.7 ou por Gemini 2.5 Pro. Nenhum mora no modelo.

## A tabela de quem é responsável pelo quê

Eu sou visual. Depois do meu incidente, sentei e escrevi uma tabela colando categoria de bug → onde ele realmente mora. Foi a única coisa que mudou minha intuição sobre quando trocar o modelo é racional e quando é fuga.

![Tabela de responsabilidade entre modelo e harness. 80% dos bugs sobrevivem à troca de GPT por Claude porque moram no runtime ou no harness, não no modelo](/images/blog/agent-equal-model-mais-harness-trocar-modelo-nao-resolve/onde-mora-bug-tabela-pt.png)

| Sintoma | Onde mora | Trocar o modelo resolve? |
|---------|-----------|--------------------------|
| Agente entra em loop com a mesma tool | Runtime (loop detection) | Não |
| Agente esquece o que disse 3 turnos atrás | Harness (memória, summarização) | Não |
| Agente chama tool errada com argumentos certos | Harness (tool selection prompt) | Talvez parcialmente |
| Agente chama tool certa com argumentos errados | Modelo (structured output) | Sim, geralmente |
| Resposta soa "burra" pra perguntas abertas | Modelo (raw reasoning) | Sim |
| Latência por turno alta demais | Runtime + modelo | Parcialmente |
| Resultado inconsistente entre sessões parecidas | Harness (context engineering) | Não |
| Custo por tarefa alto demais | Harness (token efficiency) | Indiretamente |

Tudo que termina com "Não" na coluna da direita é o que vai sobreviver à sua troca de modelo. E, na minha experiência, isso cobre o grosso dos bugs que chegam até produção. Os bugs onde "trocar o modelo resolve" são os bugs que você descobre na primeira semana de prototipagem. Em produção, você está reconciliando memória, decidindo quando comprimir contexto, e capturando exceções de tool. Nada disso o LLM faz por você.

## O que eu acabei consertando (e não foi o modelo)

Voltei ao GPT-4o. Não por nostalgia: porque a fatura era menor e o bug era o mesmo. Aí olhei pro harness com os olhos certos.

O agente perdia contexto na terceira pergunta porque a janela de summarização cortava a parte que ele precisava reler. Era uma única linha de prompt mandando ele "resumir as últimas 10 mensagens em até 200 tokens", e essa instrução estava destruindo o nome do recurso que o usuário tinha mencionado na pergunta 1.

O loop com a mesma tool acontecia porque o agente não tinha um detector de "não estou progredindo" — o LangChain abriu uma issue exatamente sobre isso, "Progress-aware termination" ([issue #36139](https://github.com/langchain-ai/langchain/issues/36139)), e até essa feature aterrissar oficialmente eu escrevi um guard simples: se a última chamada de tool é igual à anterior e devolveu o mesmo erro, aborta com mensagem específica. Quinze linhas.

Inconsistência entre sessões parecidas vinha de prompt não-determinístico no system message — eu tinha deixado um `{{current_time}}` que mudava a temperatura efetiva da resposta. Fixei o prompt, problema sumiu.

O modelo não tocou em nenhuma dessas três correções. Nenhuma exigia o "modelo mais novo". Todas exigiam olhar pro harness em vez de pro provedor.

## Por que o instinto é trocar o modelo

Eu acho que tem uma razão psicológica genuína por trás dessa armadilha, e vale nomear pra não cair de novo.

Trocar modelo é **legível**. Você troca uma string em uma config, ou um campo num dashboard, e pronto. O cliente vê. O time vê. Você consegue dizer "subimos pra Opus 4.7" numa standup e parecer competente.

Mexer no harness é **invisível**. Você escreve quinze linhas de guard, reescreve um prompt de summarização, fixa um placeholder. Ninguém na standup entende, e o resultado vai aparecer só na próxima semana quando o bug não voltar.

A indústria inteira, do lado da comunicação, reforça o instinto errado. Anthropic anuncia Opus 4.7. OpenAI anuncia GPT-5.5. Cada release é um headline. Quase ninguém escreve headline sobre "consertei o detector de loop do meu runtime".

O Harrison Chase tem uma frase boa sobre isso numa entrevista da VentureBeat ([VentureBeat sobre LangChain](https://venturebeat.com/orchestration/langchains-ceo-argues-that-better-models-alone-wont-get-your-ai-agent-to)): "modelos melhores sozinhos não vão levar seu agente para produção." Eu li essa frase em 2024 e achei genérica. Em 2026, depois do meu incidente, ela é a coisa mais específica que existe.

## A regra que eu uso agora antes de trocar modelo

Eu não digo que trocar modelo nunca vale. Quando o usuário pergunta algo aberto e a qualidade do raciocínio aparece na resposta, modelo importa. O ponto é que esse é um caso pequeno do total.

Antes de aprovar uma troca de modelo agora, eu pergunto três coisas pro time:

1. **O bug aparece na primeira mensagem ou só depois de N turnos?** Se aparece depois, é harness — memória, summarização, ou loss-of-context. Trocar modelo não vai consertar.

2. **O bug é determinístico (mesmo input, mesmo bug) ou não?** Se é determinístico, é quase certo que está no runtime ou no prompt. Modelos novos ainda são modelos, eles continuam tendo variação. Determinismo vem do harness.

3. **A gente já mediu a diferença no benchmark interno do agente, ou só no benchmark público do provedor?** Diferença em MMLU não te diz nada sobre seu agente específico. Diferença no seu benchmark interno te diz.

Se as três respostas justificam, troco. Quase nunca justificam. Hoje, o tempo que eu economizo não fazendo essa troca eu gasto melhorando o harness. E a fatura caiu.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
