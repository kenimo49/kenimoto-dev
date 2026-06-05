---
title: "Construí tudo no Claude Code. Aí o preço dobrou da noite pro dia"
description: "Montei meu fluxo inteiro no Claude Code. O custo que quase ninguém calcula é o risco de dependência: como eu estimo esse risco e que Plano B mantenho no radar."
date: 2026-06-06
lang: pt
tags: [ia, claude-code, ferramentas, carreira]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/dependencia-ferramenta-ia-plano-b/"
og_image: "https://kenimoto.dev/images/blog/dependencia-ferramenta-ia-plano-b/og-pt.png"
cross_posted_to: []
---

Antes que você comente "mais um texto de troca de ferramenta", deixa eu marcar a diferença. Isto não é sobre eu ter [largado o Cursor e voltado pro terminal](https://kenimoto.dev/pt/blog/parei-cursor-voltei-terminal/) por preferência, nem sobre [os 4 níveis de delegação](https://kenimoto.dev/pt/blog/4-niveis-delegacao-claude-code/) de tarefa. É sobre uma coisa que você não escolhe: o dia em que a ferramenta muda embaixo de você, e o seu trabalho para junto.

Eu construí praticamente todo o meu fluxo em cima do Claude Code. Skills, comandos, automações. Funcionava lindamente. E foi exatamente por estar tão confortável que eu não vi o risco mais óbvio chegando.

## O custo que ninguém coloca na planilha

Quando você escolhe uma ferramenta de IA, calcula o preço da assinatura, o tempo que economiza, a curva de aprendizado. O que quase ninguém calcula é o custo de a ferramenta deixar de existir do jeito que você conhece. Esse é o risco de dependência, e em 2026 ele saiu do campo teórico.

Veja o que aconteceu só nos últimos meses:

- Em 15 de abril de 2026, a Anthropic trocou o preço fixo da edição enterprise por um modelo dinâmico baseado em uso. Para quem usa pesado, especialistas estimam que o custo pode dobrar ou triplicar.
- O GitHub Copilot tirou os planos individuais do ar, passou a cobrar por token a partir de junho de 2026 e cortou o acesso aos modelos Opus.
- O DALL-E 3 foi descontinuado em maio de 2026, no calendário do próprio fornecedor, não no seu.

Nenhuma dessas mudanças pediu sua permissão. E é esse o ponto: você está alugando o chão onde construiu a casa.

![Linha do tempo de 2026 mostrando reajuste de preço da Anthropic, cobrança por token do Copilot e descontinuação do DALL-E 3, com o desenvolvedor sem voz nas decisões](/images/blog/dependencia-ferramenta-ia-plano-b/timeline-pt.png)

## Por que a conta dói mais no Brasil

Para quem desenvolve no Brasil, o risco vem dobrado, e o motivo é chato de tão concreto: o faturamento é em dólar. Um reajuste de 30% lá fora chega aqui somado à variação do câmbio e ao IOF do cartão internacional. Uma assinatura que cabia no orçamento em janeiro pode virar uma decisão difícil em junho, sem você ter mudado nada no seu uso.

Faça a conta da migração antes de precisar dela. Se a sua ferramenta principal dobrar de preço, quantas horas você gastaria reescrevendo skills, refazendo automações, retreinando a equipe? Eu fiz essa estimativa para o meu caso e cheguei a algo entre R$ 8 mil e R$ 15 mil em horas de trabalho, fora a assinatura nova. Não é o fim do mundo. Mas é dinheiro que eu preferia não descobrir que devia no pior momento possível.

## O Plano B não é abandonar a ferramenta

Aqui mora a parte contraintuitiva: ter um Plano B não significa parar de usar o Claude Code. Significa usar como ferramenta principal, mantendo as saídas de emergência destrancadas. A meta é simples: poder dormir tranquilo sabendo que uma mudança de política não para a sua semana.

Foi assim que eu reorganizei a casa:

1. **Abstração de modelo.** O MCP (Model Context Protocol) deixa a troca de provedor bem menos dolorosa. Desenhe os fluxos críticos de um jeito que funcione com modelos além do Claude, em vez de amarrar tudo a recursos proprietários.
2. **Fallback local.** Mantenho o Ollama configurado com um modelo aberto rodando na máquina. Não é tão capaz quanto o Claude, mas no dia em que a nuvem me deixar na mão, eu continuo entregando. Um para-quedas não precisa ser confortável, precisa abrir.
3. **Portabilidade de dados.** Prompts, contexto e configuração ficam em arquivos versionados no Git, não presos dentro da ferramenta. O que é seu sai com você.
4. **Ferramenta reserva no radar.** Cursor, Cline, Aider. Eu não uso todo dia, mas testo de vez em quando para não estar enferrujado quando precisar. Estratégia comum nas equipes hoje: principal no Claude Code, reserva no Cursor.

![Diagrama mostrando o Claude Code como ferramenta principal cercado por quatro saídas de emergência: abstração via MCP, fallback local com Ollama, dados portáveis no Git e ferramenta reserva](/images/blog/dependencia-ferramenta-ia-plano-b/plano-b-pt.png)

## Políticas mudam. A sua arquitetura, não precisa

A lição que eu tiro de tudo isso é simples de falar e chata de praticar: desenhe partindo do princípio de que as coisas vão mudar. Os termos de uso vão mudar. Os preços vão subir. Os modelos vão ser aposentados. Apostar tudo numa ferramenta só é uma estratégia arriscada do ponto de vista de política, por mais que ela seja a melhor do mercado hoje.

Isso é só bom senso, a mesma lógica de não deixar todo o dinheiro num único investimento. Você não desconfia do banco; você só não quer que a sua vida dependa de uma única decisão que outra pessoa toma sem te consultar.

Continuo usando o Claude Code todo dia, e continuo gostando. A diferença é que agora, se ele dobrar de preço de novo amanhã, eu já sei exatamente o que faço na quinta-feira. E isso, sinceramente, vale mais que qualquer recurso novo.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
