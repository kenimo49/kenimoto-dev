---
title: "Os 6 componentes de um harness de IA: o checklist de auditoria que cabe em uma página"
description: "Todo mundo fala em Harness Engineering, ninguém lista os componentes auditáveis. Aqui está o checklist de 6 itens, com a pergunta de auditoria e o sinal de perigo para cada um, que uso para revisar harnesses de times BR antes de assinar embaixo."
date: 2026-06-27
lang: pt
tags: [harness, ia, auditoria, claude-code, agentes]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/6-componentes-harness-checklist-auditoria-uma-pagina/"
og_image: "https://kenimoto.dev/images/blog/6-componentes-harness-checklist-auditoria-uma-pagina/og-pt.png"
cross_posted_to: []
---

Toda vez que entro em um time pra avaliar a operação de IA, recebo o mesmo discurso: "a gente fez Harness Engineering". Pergunto quais são os componentes. A sala silencia. Alguém abre o `AGENTS.md` e me mostra um arquivo de 400 linhas. Outro abre o LangSmith. Um terceiro abre o `.claude/skills/`. Tudo isso é parte de um harness. Nada disso é uma auditoria.

Auditoria precisa de checklist. Checklist precisa de itens nomeados, na mesma ordem, todo mundo lendo a mesma lista. Harness Engineering tem hoje uma definição razoavelmente estável, mas a divergência entre os fornecedores deixou os times BR sem uma página única pra escorar a revisão. Esse post é exatamente essa página.

São 6 componentes. Cada um vem com **uma pergunta de auditoria** e **um sinal de perigo**. Se o sinal acende, o harness não está auditado. Está só montado.

## A definição mínima que todos concordam (e onde divergem)

Antes do checklist: as três frases que importam, das fontes que estão movendo o vocabulário em 2026.

- **Anthropic** ([effective harnesses for long-running agents](https://www.anthropic.com/engineering/multi-agent-research-system)): "Agent = Model + Harness. A raw model is not an agent." O foco é estabilidade de execução prolongada, com reset de janela de contexto como peça central.
- **LangChain** ([The Anatomy of an Agent Harness](https://www.nxcode.io/resources/news/what-is-harness-engineering-complete-guide-2026)): "Agent = Model + Harness, e quem entrega ganho é o harness." Eles subiram a precisão de **52,8% → 66,5%** mexendo só no harness, sem trocar o modelo. Esse é o número que fecha qualquer discussão de "vale a pena investir em harness?".
- **Martin Fowler** ([guides-and-sensors taxonomy](https://atlan.com/know/what-is-harness-engineering/)): "o harness é a infraestrutura completa que governa como o agente opera." Foco em vocabulário e governança organizacional, herdeiro direto da tradição dos guides.

As três visões concordam em "o harness é tudo que envolve o modelo". Divergem em **qual camada é a alavanca**: Anthropic vota em gestão de contexto, LangChain em orquestração, Fowler em governança. A auditoria precisa cobrir as três. Por isso 6 itens, não 3.

A taxonomia de 6 módulos abaixo vem do trabalho de mapeamento da Next Signal Prediction. É a base mais limpa que vi pra rodar uma checklist em time externo.

![Os 6 componentes auditáveis de um harness de IA, com pergunta e sinal de perigo para cada um](/images/blog/6-componentes-harness-checklist-auditoria-uma-pagina/six-components-audit.png)

## ① Gestão de informação: o que o agente fica sabendo

A camada do `AGENTS.md`, `CLAUDE.md`, arquivos de skill, RAG, memória entre sessões. Sem essa camada o agente reaprende o seu projeto a cada turno e paga em token toda vez.

**Pergunta de auditoria:** "Quais são as três fontes de contexto que esse agente lê em toda primeira janela? Me mostre os arquivos."

**Sinal de perigo:** o time aponta para um `CLAUDE.md` de mais de 500 linhas como "a fonte". Isso não é gestão de informação, é despejo de lixo. Anthropic tem razão sobre context anxiety: quanto mais entra, pior o discernimento. É o estado de 300 e-mails não lidos numa segunda de manhã, traduzido pro agente.

## ② Execução: quem roda o quê, em que ordem

Decomposição de tarefa, orquestração, paralelismo, retry, timeout. Essa camada é onde os times BR mais empilham complexidade sem perceber. Cada novo sub-agente é uma promessa de paralelismo que normalmente termina virando serialização disfarçada.

**Pergunta de auditoria:** "Aponte no diagrama de execução o ponto exato onde uma falha de sub-agente vira retry, e o ponto onde vira escalada humana. Cite o nome do arquivo."

**Sinal de perigo:** a resposta é "isso a gente trata caso a caso". Caso a caso vira pager às 3 da manhã. O Cursor 1.0 ([release notes](https://cursor.com/changelog/1-0)) deixou explícito o Agent Loop com retry padrão de 8. Se o seu time não consegue citar o número correspondente, esse número está implícito em algum lugar, e implícito sempre é o número errado.

## ③ Verificação de qualidade: quem decide se o que saiu pode ser aceito

Linter, type-checker, suite de testes, LLM-as-judge, autoFix. Essa é a camada que substitui o "eu vou olhar com calma depois", porque "depois" tem custo de pager.

**Pergunta de auditoria:** "Qual é a regra que separa autoFixable de revisão humana? Quero ver o flag no código, não a regra de cabeça."

**Sinal de perigo:** todo PR passa pelo mesmo portão humano. Isso não é verificação, é gargalo. O padrão do `autoFixable: true/false` da GMO Developers existe há mais de um ano e ainda é o melhor ponto de partida que conheço: separa o que merece atenção humana do que pode ser absorvido pelo harness antes de chegar na tela.

## ④ Tracing e observabilidade: você consegue reproduzir o que aconteceu ontem?

Logs de execução, uso de tokens, tempo por passo, log de erro, LangSmith/Arize/equivalente caseiro. Sem essa camada, o post-mortem do incidente do mês passado é fanfic.

**Pergunta de auditoria:** "Me mostre o trace de uma execução de ontem. Não a métrica agregada, o trace."

**Sinal de perigo:** o trace não existe, ou existe mas dura 24 horas e o incidente foi há 3 dias. Anthropic publicou esse ano que a retenção de traces virou requisito de auditoria interna deles. Se um time grande mantém logs verbosos por meses pra debugar drift de agente, o seu de 5 pessoas precisa de pelo menos uma semana. "A gente nunca olha o log" não é desculpa: é o motivo pelo qual o bug está há 3 dias na produção.

## ⑤ Fronteira de segurança: o que o agente nunca pode tocar

`allowedTools`, limites de filesystem, limites de rede, sandbox, gates de aprovação humana. Essa camada é a única que protege você de um agente que decidiu, no meio da madrugada, fazer `rm -rf` num diretório que você "achava que estava fora do escopo".

**Pergunta de auditoria:** "Quais são os 3 comandos que esse agente está literalmente impedido de executar? Mostre o `allowedTools` ou equivalente."

**Sinal de perigo:** a resposta é "ele segue o `CLAUDE.md`". `CLAUDE.md` é instrução, não barreira. Instrução o agente pode ignorar; barreira não. Misturar os dois é o erro mais caro que vi em time BR esse ano: uma sandbox de homologação foi limpa porque o `CLAUDE.md` dizia "não rode rm em produção" e o agente, na lógica dele, estava em homologação.

## ⑥ Definições de ferramentas: o vocabulário que o agente realmente entende

Definições de função, schemas, integrações de API, MCP, permissões de arquivo. Essa camada determina não só **se** o agente consegue fazer uma coisa, mas **se ele acerta na primeira**.

**Pergunta de auditoria:** "Pegue uma ferramenta qualquer do seu harness. Leia o `description` em voz alta. Você passaria por um onboarding novo só com isso?"

**Sinal de perigo:** o `description` tem uma frase só, ou usa palavras que dependem do contexto interno do time ("o nosso pipeline padrão"). Descrição ruim vira chamada errada: o equivalente IA do "me passa aquela ferramenta". Era um martelo ou uma chave de fenda? Se a descrição é desleixada, o agente também escolhe desleixado, e o custo da escolha errada é seu.

## Como usar essa página em 35 minutos

Imprima. Sente com o time. Faça as 6 perguntas, na ordem. Para cada uma, anote uma de três coisas: o arquivo que responde, "não respondeu", ou "vou anotar e voltar depois".

Soma rápida no final:

- **0 ou 1 sinal de perigo aceso**: harness em estado auditado. Reabra a checklist em 90 dias.
- **2 ou 3 sinais acesos**: o harness funciona em dia bom. Em incidente, ele te abandona. Priorize o componente com o sinal mais escuro.
- **4+ sinais acesos**: ainda não é um harness. É uma colagem de boas intenções. Volta pro item ①, fecha a auditoria do contexto, e segue.

A peça que não cabe nessa página, e que vale lembrar: nenhum desses 6 componentes é binário. Cada um tem versão "bem feita" e versão "feita o suficiente pra parar a culpa". A diferença, na prática, é apenas se você consegue **citar o arquivo** quando o auditor pergunta. Se cita, está auditado. Se não cita, não está.

E é por isso que essa checklist cabe em uma página. Auditoria de harness não precisa ser longa. Precisa ser feita.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
