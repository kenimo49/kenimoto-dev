---
title: "Coloquei 3 sub-agentes do Claude Code para revisar o mesmo PR. Discordaram em 41% dos comentários."
description: "Três sub-agentes do Claude Code, um PR de 500 linhas, 41% de discordância e uma hora gasta decidindo quais achados manter. A Lei de Brooks segue viva em 2026, e parece que ela desce até o nível dos agentes."
date: 2026-05-12
lang: pt
tags: [claude-code, sub-agents, code-review, ia]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/tres-sub-agentes-revisaram-mesmo-pr-40-discordancia"
og_image: "https://kenimoto.dev/images/blog/tres-sub-agentes-revisaram-mesmo-pr-40-discordancia/og-pt.png"
cross_posted_to: []
---

Achei que revisão de código com múltiplos agentes fosse upgrade grátis. Três sub-agentes olhando o mesmo PR pareciam três pares de olhos pelo preço do café de um engenheiro.

Aí coloquei três sub-agentes do Claude Code para revisar o mesmo PR de refatoração de 500 linhas e fiquei vendo eles discordarem em 41% dos comentários. O merge levou uma hora que eu tinha orçado em quinze minutos. A Lei de Brooks segue viva em 2026, e parece que ela desce até o nível dos agentes.

A Anthropic [anunciou em março](https://claude.com/blog/code-review) que menos de 1% dos achados internos do Code Review são marcados como incorretos pelos engenheiros. O número é real, e também é uma estatística de gente rodando um pipeline finamente ajustado na própria base de código. Assim que subi meus próprios três sub-agentes no meu próprio repositório, "concordar" deixou de significar o que eu imaginava.

Esse é o experimento. O que eu montei, o que eu medi e o que eu de fato acredito agora sobre revisão paralela com sub-agentes.

## A configuração

O PR era uma refatoração de 500 linhas na camada de signaling WebRTC de um projeto paralelo. Oito arquivos, quase tudo TypeScript, dois ajustes de configuração e um novo tipo de erro. Chato o suficiente para não ser um PR de palco, complexo o suficiente para um único revisor deixar coisas passarem.

Três sub-agentes, todos definidos em `.claude/agents/`, todos usando Sonnet 4.6, todos restritos a ferramentas de leitura:

```markdown
---
name: explore-reviewer
description: Rastrear chamadores, dependentes e caminhos de código morto.
model: sonnet
allowed-tools: Read Grep Glob
---

Você é um arqueólogo de código. Para cada arquivo alterado, encontre todos
os chamadores, todos os testes que referenciam o arquivo e qualquer caminho
que fique em silêncio depois da mudança. Reporte citações concretas no
formato file:line. Sem opiniões de estilo.
```

```markdown
---
name: security-reviewer
description: Procurar regressões em auth, validação e tratamento de segredos.
model: sonnet
allowed-tools: Read Grep Glob WebSearch
---

Você é um revisor de segurança. Foque só em fluxos de auth, validação de
entrada, manuseio de segredos e riscos de dependências. Estime o CVSS para
cada achado. Ignore estilo e arquitetura.
```

```markdown
---
name: plan-architect
description: Avaliar decisões de design contra as convenções existentes.
model: sonnet
allowed-tools: Read Grep Glob
---

Você é um arquiteto de software. Compare as decisões de design do PR com as
convenções existentes nessa base de código. Aponte drift, costuras faltantes
e abstrações que vão machucar a próxima pessoa.
```

Cada sub-agente recebeu o mesmo prompt: "Revise o PR #482 linha por linha e liste os achados como bullets com citações file:line." Cada um rodou no próprio contexto. Nenhum viu a saída do outro. Eu era o único costurando os resultados no final.

![Três sub-agentes do Claude Code revisando o mesmo PR](/images/blog/tres-sub-agentes-revisaram-mesmo-pr-40-discordancia/sub-agents-matrix-pt.png)

## Como ficou 41% de discordância

Quando os três terminaram, eu tinha 78 comentários brutos no total. Abri uma planilha e taguei cada um como "levantado pelos 3", "levantado por 2 de 3" ou "levantado por 1 de 3".

| Cobertura | Quantidade | Fatia |
|---|---|---|
| Os 3 agentes apontaram | 14 | 18% |
| 2 de 3 agentes apontaram | 32 | 41% |
| Só 1 agente apontou | 32 | 41% |

O balde "levantado por 1" é o que eu chamo de discordância. Os outros dois sub-agentes tiveram exatamente a mesma chance de apontar a mesma linha, com as mesmas ferramentas, no mesmo diff. Passaram batido. Isso significa **41% de chance de qualquer achado individual ser a opinião particular de um único sub-agente**.

O número de manchete da Anthropic, menos de 1% marcado como incorreto, é medido de outro jeito. Eles contam achados que o engenheiro fecha explicitamente sem corrigir. Eu estou contando achados que dois de três agentes olhando o mesmo código nem se deram ao trabalho de mencionar. São perguntas diferentes, e a segunda é a que custa o meu tempo no teclado.

## Os quatro padrões de discordância

Depois de classificar cada discordância, quatro padrões cobriam quase tudo.

**Drift de severidade.** O plan-architect marcou uma falta de null check como "critical". O security-reviewer viu a mesma linha e classificou como "low: o chamador já valida lá em cima". Os dois estavam certos, mais ou menos. O arquiteto leu a função em isolamento. O revisor de segurança tinha andado com grep pelos chamadores e visto a validação anterior. Mesma linha, veredictos opostos.

**Drift de escopo.** Pedido para revisar o PR, o explore-reviewer alegremente me contou sobre três bugs pré-existentes em arquivos que o PR sequer tocava. O plan-architect se recusou a comentar qualquer coisa fora do diff. Eu não tinha como saber de antemão qual comportamento ia receber. Estritamente falando, as duas interpretações são defensáveis. Na prática, uma delas explodiu a minha contagem de comentários.

**Drift de concretude.** O plan-architect escreveu: "Considere extrair a lógica de retry para um helper compartilhado." O security-reviewer escreveu: "Substitua as linhas 184-201 por `retry(opts, () => fetchToken(opts.url))` e adicione um teto de 30s, senão o caminho de auth-refresh pode travar o worker." Mesma ideia. Uma eu aplico em trinta segundos, a outra exige uma reunião. Concretude é um eixo de variância bem maior do que eu esperava.

**Drift de orçamento de ferramentas.** O explore-reviewer tinha grep e glob, e percebeu que a função renomeada ainda era referenciada num script de CI que ninguém atualizou. O plan-architect, com exatamente as mesmas ferramentas, nunca foi olhar lá. Mesma lista de allowed-tools, mesmo prompt sobre "ache dependentes". Um andou pela superfície, o outro andou pelo prédio. O drift aqui veio de quanto cada prompt de sistema incentivava o agente a vagar.

Se você já usou [sub-agents do Claude Code](https://code.claude.com/docs/en/sub-agents) para algo além de uma chamada Explore pontual, nada disso é chocante. O que me chocou foi como esses quatro baldes recortaram quase todas as discordâncias que taguei.

## O bug que ninguém pegou

Dois dias depois do merge, um colega achou uma race condition no novo caminho de tratamento de erro. O PR abria uma janela de um frame em que duas tentativas de reconnect podiam disparar no mesmo socket. Nenhum dos três sub-agentes mencionou isso. A descrição do PR, que eu escrevi à mão, mencionava "lógica de reconnect movida", e foi isso que fez o colega ir investigar.

"Com olhos suficientes, todos os bugs são rasos", escreveu Eric Raymond em 1999. Ele acertou sobre os olhos. Ele não especificou que três deles precisariam estar mirando na mesma janela. Os meus estavam todos focados no diff. Nenhum deu um passo atrás para perguntar: o que mudou no timing?

## A hora que perdi fazendo merge

A parte de costurar os três relatórios foi exatamente a que eu não tinha orçado.

Para cada achado "2 de 3" ou "1 de 3", eu tinha que decidir:

1. É real, ou é uma lacuna de contexto que se fecha com um grep?
2. Se é real, a severidade do agente A está certa, ou a do agente B?
3. Se há proposta de fix, dá para aplicar a versão concreta com segurança, ou eu preciso voltar para a versão abstrata?

Só a terceira pergunta consumiu três cafés. Dois sub-agentes mandaram "extraia um helper compartilhado". Um me deu um helper específico. Eu tive que ler o diff uma terceira vez, no braço, para descobrir se o helper específico tinha o formato certo. Não tinha. Acabei escrevendo uma quarta versão.

A Lei de Brooks era sobre custo de comunicação entre humanos num projeto atrasado. Estou convencido de que ela generaliza assim: **toda vez que você joga N perspectivas independentes sobre o mesmo artefato, o seu revisor N+1 é o integrador, e a hora do integrador cresce mais ou menos linearmente em N**. Três sub-agentes pareciam 3x os olhos. Eram também 3x o custo de integração.

Se você rodou o Claude Code [autonomamente por 24 horas](/pt/blog/agente-ia-24-horas-incidentes-seguranca/) e sobreviveu para contar, já sabe disso pelo outro lado: o gargalo migra para quem está lendo a saída do agente.

## Qual é o número certo de sub-agentes

Não acho que a resposta seja um. Na mesma semana eu rodei o experimento com N=1 num PR menor, só uma passada de revisão geral. Ele deixou passar o tipo de dependência entre arquivos que o explore-reviewer teria pego. Um par de olhos é genuinamente pior que dois.

Minha heurística atual, depois de uns doze PRs nessa pegada:

- PR pequeno (menos de 100 linhas, sem arquivos novos): um sub-agente. Mais que isso é overhead.
- PR médio (100 a 500 linhas, mexe em um subsistema): dois sub-agentes com ângulos distintos, em geral explore + security ou explore + architect. Escolha o segundo pelo que o PR está arriscando de fato.
- PR grande ou transversal (mais de 500 linhas, vários subsistemas): três. Planeje o tempo de integração antes. Não é de graça.

Acima de três, eu não vi valor. A montagem de [nove agentes do HAMY](https://hamy.xyz/blog/2026-02_code-reviews-claude-subagents) é interessante, mas eu ia precisar de uma segunda ferramenta só para mesclar os relatórios, e ela precisaria ser mais barata do que eu.

O outro botão é concretude. Hoje eu peço a cada sub-agente "achados com a menor mudança concreta que resolve o problema, ou marcados como no-fix se você não souber". Essa linha sozinha no prompt de sistema derrubou cerca de metade do meu drift de concretude.

## No que eu de fato acredito agora

Revisão de código multi-agente não é grátis. É mais parecida com "três revisores juniores lendo em salas diferentes, e você é o sênior que tem que mesclar as notas". O número de olhos sobe, mas o custo de integração também, e o custo de integração é a parte que mora no seu calendário.

O bug que ninguém pegou foi o que mais me deixou humilde. Três agentes, três ângulos, todos read-only, todos mirando o mesmo diff. Nenhum percebeu a mudança de timing porque nenhum foi solicitado a perceber. **Sub-agentes são excelentes nas perguntas que você coloca no system prompt. São medianos nas perguntas que você esqueceu de fazer.** O limite real é esse, não o modelo.

Se você levar uma coisa daqui: escreva um quarto prompt de sub-agente chamado `what-am-i-not-asking`, entregue o diff e peça para ele nomear as categorias que os outros agentes vão deixar passar. Aí leia a resposta. Aí escreva os prompts de revisão de verdade. Eu não fiz isso no experimento desse post, e foi exatamente por isso que perdi uma hora no merge e um colega achou a minha race condition.

O número de menos de 1% da Anthropic é real. Também é medido num pipeline que alguém ficou meses ajustando, não em três sub-agentes que você escreveu entre reuniões. Ajuste os seus. Até lá, conte com 40%.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
