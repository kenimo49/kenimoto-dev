---
title: "Pare de mandar o Claude Code codar direto: desenhei o dia no Plan Mode e o retrabalho despencou"
description: "Passei semanas usando o Claude Code com uma mentalidade simples: é só dar instrução que o código sai. E saía. O problema é que eu reescrevia metade no dia seguinte. Mudei uma coisa só: parei de codar de manhã e passei a desenhar o dia no Plan Mode antes. Conta o que isso fez com o meu retrabalho, em horas e em reais."
date: 2026-06-23
lang: pt
tags: [ia, claudecode, planmode, produtividade]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/plan-mode-projetar-dia-retrabalho/"
og_image: "https://kenimoto.dev/images/blog/plan-mode-projetar-dia-retrabalho/og-pt.png"
cross_posted_to: []
---

Todo dev que pega o Claude Code pela primeira vez faz a mesma coisa que eu fiz: senta, abre o terminal e manda implementar. "É só dar instrução que o código sai." E sai mesmo. Esse é o problema. O código sai tão fácil que você não percebe quando ele está saindo errado.

Nas minhas primeiras semanas, eu terminava o dia com uma sensação esquisita: produzi muita coisa, mas não avancei tanto quanto parecia. No dia seguinte eu reabria o que tinha feito e reescrevia um pedaço considerável por conta própria. Eu estava gerando código e retrabalho na mesma proporção, e chamando isso de produtividade.

Aviso logo: este post não é sobre escrever spec, nem sobre `/clear` e contexto que apodrece. São outros assuntos. Aqui é uma coisa só, contrária ao instinto de todo mundo: **pare de mandar o Claude Code codar direto de manhã. Desenhe o dia primeiro, no Plan Mode.** Eu não mudei como uso a ferramenta. Mudei como projeto o meu dia.

## A primeira coisa que faço de manhã não é escrever código

Antes, eu chegava e já mandava "implementa a autenticação". Hoje, os primeiros 30 minutos não têm uma linha de código. Eu uso o **Plan Mode** para projetar o trabalho do dia.

O Plan Mode entra com `Shift+Tab`. Nele, o Claude não mexe em arquivo nenhum: ele foca em formular e alinhar o plano. A conversa da manhã é mais ou menos assim:

```text
> (Plan Mode) Hoje quero implementar autenticação de usuário.
> Três partes: e-mail/senha, Google OAuth e reset de senha.
> Sugira a prioridade e a ordem de implementação.

Claude: Sugiro a seguinte ordem:

1. Auth e-mail/senha (base; o resto depende disso)
2. Reset de senha (extensão do auth por e-mail)
3. Google OAuth (bem independente)

Quer que eu mostre estimativa de cada parte e as decisões de design?
```

O detalhe que importa: aqui ainda não tem implementação. Ordem, dependências, direção de design. Eu gasto os 30 minutos só alinhando essas três coisas. Parece perda de tempo. Eu também achava.

## Por que de manhã, antes de codar

Tem três motivos, e todos são "coisa que dá pra matar antes de virar código".

**Primeiro: evitar desalinhamento no começo.** Quando você pula direto para a implementação, o Claude escolhe uma abordagem de design achando que está ajudando, e às vezes ela não é a sua. Você descobre isso quando o código já está pela metade. Alinhar a direção no Plan Mode antes faz esse retrabalho simplesmente não acontecer. A maior parte das minhas reescritas era exatamente esse caso.

**Segundo: decomposição melhor das tarefas.** Quando você faz o Claude montar o plano, ele expõe dependências que você não tinha visto. "Ah, preciso rodar essa migration primeiro" aparece na fase de planejamento, e não às 15h quando você trava. Cada dependência exposta de manhã é um travamento a menos à tarde.

**Terceiro: o código gerado sai melhor.** Implementar depois de planejar eleva a qualidade da saída, porque o contexto já contém o que construir e como. É a diferença entre um colega com quem você alinhou o desenho e um colega que só ouviu "faz aí".

![Comparação de dois fluxos do dia: codar direto, com retrabalho explodindo no meio da implementação, contra Plan Mode de manhã, com o retrabalho antecipado e resolvido no alinhamento](/images/blog/plan-mode-projetar-dia-retrabalho/fluxo-plan-mode.png)

## Quebre por funcionalidade, não por camada

O truque que mais rende no planejamento da manhã é como você corta as tarefas. Corte por **funcionalidade** voltada ao usuário: a menor fatia que você consegue testar de ponta a ponta.

```text
❌ Divisão por stack (quebra na hora de integrar)
- Tarefa 1: todas as migrations
- Tarefa 2: todos os endpoints
- Tarefa 3: todas as telas

✅ Divisão por funcionalidade (menor unidade testável ponta a ponta)
- Tarefa 1: listagem de produtos (DB + API + tela)
- Tarefa 2: adicionar ao carrinho (DB + API + tela)
- Tarefa 3: checkout (DB + API + tela + integração externa)
```

Cortando por funcionalidade, dá para verificar o funcionamento ponta a ponta quando cada tarefa termina. Cortando por camada, todo o desalinhamento se acumula e estoura junto na integração, no fim. É tipo deixar a contabilidade do mês inteiro para a última noite: o que dava para resolver aos poucos vira uma dor só.

## A conta em reais, que é onde dói

Agora a parte que o pessoal do TabNews vai querer ver, porque "minha produtividade melhorou" não significa nada sem número.

Antes, eu perdia com facilidade umas 2 horas por dia reescrevendo coisa que o Claude tinha gerado na direção errada. O código rodava, inclusive. Só estava certo para o problema errado, porque eu nunca tinha alinhado qual era o problema. Duas horas por dia, cinco dias, dá 10 horas por semana só de retrabalho evitável.

Eu, como dev freela/PJ no Brasil, coloco minha hora a R$ 150 (use a sua, a conta é a mesma). Dez horas semanais de retrabalho a R$ 150 é **R$ 1.500 por semana** jogados fora. Por mês, beira R$ 6.000. Não em dinheiro saindo da conta, mas em hora faturável que eu estava queimando para refazer o que eu mesmo tinha mandado fazer torto.

Depois que comecei os 30 minutos de Plan Mode pela manhã, esse retrabalho caiu para algo perto de 1 hora por semana. Os 30 minutos diários custam 2,5 horas por semana. Eu gasto 2,5 horas planejando e recupero perto de 9 horas de reescrita. Não preciso de planilha bonita para ver que essa troca vale a pena: é a melhor taxa de retorno que eu consegui sem trocar de ferramenta nem decorar prompt mágico.

## A regra que mantém o ritmo: alinhar antes de executar

Quando o plano fecha, eu volto ao modo normal e implemento. Aí separo as sessões por tarefa e dou `/clear` entre elas, para o contexto de uma funcionalidade não vazar para a outra. Em sessão longa, uso `/compact` quando uma subtarefa termina, quando a tentativa e erro passou de 5 rodadas, ou quando começa a "pesar".

No fim do dia, antes de fechar, deixo uma nota de passagem: o que terminei, o que falta, o que ficou em aberto. Essa nota vira a entrada do Plan Mode da manhã seguinte. O eu de ontem deixa o briefing pronto para o eu de hoje, e o aquecimento da manhã cai para quase zero.

No fundo é só isso: parei de tratar o Claude Code como uma máquina de cuspir código sob comando e passei a tratar o dia como uma coisa que precisa ser projetada antes de começar. A ferramenta é a mesma. O que mudou foi a ordem: desenhar primeiro, codar depois. E o retrabalho, que era o imposto invisível que eu pagava todo dia, virou meia hora de planejamento que eu faço de olhos abertos.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
