---
title: "Não automatize tudo: os 4 níveis de delegação que decidem se o Claude Code te ajuda ou atrapalha"
description: "Passei a tratar a delegação ao Claude Code como um botão de volume, não um interruptor. Mudança de arquitetura fica no L1 (humano no comando), formatação no L4 (automático total). Sem desenhar a granularidade, o agente atrapalha em vez de ajudar."
date: 2026-06-04
lang: pt
tags: [claudecode, ia, agentes, produtividade]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/4-niveis-delegacao-claude-code"
og_image: "https://kenimoto.dev/images/blog/4-niveis-delegacao-claude-code/og-pt.png"
cross_posted_to: []
---

"Larga tudo na mão da IA que é mais rápido." Eu ouço essa frase no LinkedIn umas dez vezes por semana. Testei levar a sério, e o resultado foi um dia inteiro perdido desfazendo uma mudança de arquitetura que eu nunca pedi.

O Claude Code aceitou meu "refatora isso aí" e decidiu, sozinho, trocar a camada de acesso ao banco inteira. Tecnicamente o código rodava. Só que não era o que eu queria, e revisar a mudança levou mais tempo do que se eu tivesse feito na mão. Velocidade negativa.

Depois de algumas dessas, parei de pensar em delegação como um interruptor (ou faço eu, ou faz a IA) e comecei a tratar como um botão de volume. São quatro níveis. Quem não desenha em qual nível cada tarefa entra acaba com um agente que atrapalha em vez de ajudar.

## O problema de tratar delegação como liga-desliga

O erro que eu cometia era binário. Ou eu segurava tudo, ou soltava tudo. Os dois extremos custam caro: segurar tudo joga fora o ganho do agente, soltar tudo gera retrabalho de revisão.

A própria Anthropic enxergou isso. Em março de 2026 ela lançou o [auto mode do Claude Code](https://www.anthropic.com/engineering/claude-code-auto-mode), um meio-termo entre revisar cada passo na mão e o YOLO mode sem freio. Um classificador separado olha cada ação antes de rodar e bloqueia o que escapa do que você pediu. Ou seja: o próprio fabricante parou de tratar isso como liga-desliga.

O que faltava pra mim era um vocabulário pra decidir, por tarefa, quanto soltar. Acabei com quatro níveis.

![Os 4 níveis de delegação L1 a L4 e o tipo de tarefa de cada um](/images/blog/4-niveis-delegacao-claude-code/niveis-delegacao.png)

## Os 4 níveis

### L1 — Humano no comando, IA como consultora

A IA sugere, eu decido e executo. Nada vai pro código sem eu digitar.

**Onde uso:** mudança de arquitetura, escolha de biblioteca, design de schema de banco, qualquer decisão difícil de reverter. Aqui eu uso o plan mode do Claude Code, que monta a estratégia antes de tocar em qualquer arquivo. O agente pensa junto comigo, mas a mão é minha.

A refatoração que me custou um dia? Era tarefa de L1 que eu tratei como L4. O erro não foi da IA. Foi meu, de granularidade.

### L2 — IA executa, humano aprova cada passo

A IA escreve, mas cada gravação de arquivo e cada comando de shell para e pede minha confirmação. É o modo padrão do Claude Code, e continua sendo o mais seguro pra base de código que eu não conheço bem.

**Onde uso:** implementar uma funcionalidade nova num módulo que eu domino pouco, mexer em código de pagamento, qualquer coisa em produção. Eu leio cada diff antes de aprovar. É mais lento, e é de propósito.

### L3 — IA executa em lote, humano revisa o resultado

A IA toca vários arquivos sem parar a cada um, e eu reviso o conjunto no final, antes do commit. No Claude Code isso é o accept edits mode (passa direto nas edições de arquivo, mas ainda confirma comandos de shell) ou o auto mode com o classificador de guarda.

**Onde uso:** implementar uma funcionalidade bem especificada com testes, refatoração mecânica num módulo que eu conheço, escrever a bateria de testes de uma função pronta. O escopo é claro, então eu confio no lote e gasto minha atenção na revisão final, não em cada passo.

### L4 — Automático total, humano só confere depois

A IA faz e segue. Eu olho o resultado quando der, ou nem olho.

**Onde uso:** formatar código, ajustar import, atualizar changelog, renomear variável em escopo isolado, corrigir lint. Tarefa onde o pior caso é trivial de desfazer. Aqui o `--dangerously-skip-permissions` faz sentido, mas só dentro de um container descartável, nunca na minha máquina de trabalho.

## A regra que decide o nível: custo de reverter

O que decide o nível é uma pergunta só: quão caro sai desfazer se a IA errar. Repare que a dificuldade técnica não entra nessa conta.

| Nível | Quem aprova | Custo de reverter | Exemplo |
|---|---|---|---|
| L1 | Humano decide e executa | Altíssimo | Mudança de arquitetura |
| L2 | Humano aprova cada passo | Alto | Feature em produção |
| L3 | Humano revisa o lote | Médio | Feature com testes |
| L4 | Humano confere depois | Baixo | Formatação, lint |

Reescrever a camada de banco inteira é caríssimo de reverter, então é L1, por mais que a IA dê conta tecnicamente. Rodar o formatador é trivial de desfazer, então é L4, mesmo sendo "mexer no código". A dificuldade técnica não entra na conta. O que entra é o tamanho do estrago se der errado.

## A confiança sobe, mas o nível é por tarefa

Tem um padrão que bate com o que eu vivi: quanto mais a pessoa usa o agente, mais ela solta. A auto-aprovação vira hábito com o tempo de uso.

Faz sentido: a confiança cresce com a convivência. Mas tem uma armadilha aí. Confiança e custo de reverter são coisas diferentes. Eu posso confiar 100% no Claude e ainda assim segurar a mudança de arquitetura no L1, porque o problema nunca foi a competência dele. É o tamanho do tombo se algo escapar.

Então a confiança move o nível padrão das tarefas pequenas pra cima, com o tempo. Não move a mudança de arquitetura pra fora do L1. Esse continua sendo decisão humana, por mais sessões que você acumule.

## Antes e depois, no meu fluxo

Antes de desenhar os níveis, eu rodava quase tudo no mesmo modo e me decepcionava de formas opostas: ou perdia tempo aprovando formatação de import passo a passo (L4 tratado como L2), ou levava susto com refatoração grande (L1 tratada como L4).

Depois, mudou o seguinte:

- decisões de arquitetura passaram pro plan mode, e parei de descobrir mudança estrutural no diff
- funcionalidades com teste rodam em lote, e eu reviso o conjunto em vez de cada passo
- formatação e lint rodam sozinhos, e eu nem olho

O ganho não veio da IA ficar mais rápida. Veio de eu parar de gastar atenção no nível errado. A atenção é o recurso escasso, não os tokens.

## Pra quem trabalha em time no Brasil

Uma observação prática. Em time, o nível de delegação não pode morar só na cabeça de cada um. Se um dev trata migração de banco como L4 e outro como L1, o resultado é imprevisível por pessoa.

O que funcionou aqui foi escrever os níveis no `CLAUDE.md` do projeto: o que é sempre L1 (precisa de gente decidindo), o que pode ir pro L3 ou L4. Vira combinado de time, não preferência individual. Custa uma tarde pra escrever e poupa a discussão de "por que o agente mexeu nisso" no resto do trimestre.

"Não automatize tudo" não tem a ver com medo de IA. É a constatação de que delegação sem granularidade vira retrabalho. O botão de volume tem quatro marcas. Saber em qual girar é o trabalho de quem usa o agente, e é o que decide se ele ajuda ou atrapalha.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
