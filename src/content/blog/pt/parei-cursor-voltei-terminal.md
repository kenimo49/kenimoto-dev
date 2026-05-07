---
title: "Por que parei de usar Cursor e voltei para o terminal"
description: "Usei Cursor por 6 meses, voltei para Claude Code no terminal e dobrei minha produtividade. Conto por quê e o que mudou."
date: 2026-05-07
lang: pt
tags: ["claude-code", "cursor", "ide", "ai-development", "produtividade"]
featured: true
og_image: "https://kenimoto.dev/images/blog/parei-cursor-voltei-terminal/og-pt.png"
---

Usei Cursor por seis meses. Era o futuro: VSCode com IA embutida, chat na lateral, autocomplete inteligente, tudo num lugar. Pagava os $20/mês, recomendava para amigos.

Em outubro de 2025 abandonei o Cursor e voltei para o terminal com Claude Code. Minha produtividade dobrou nos primeiros 30 dias. Esse texto é sobre o que mudou.

## O problema que eu não enxergava no Cursor

Cursor é bom. O autocomplete é rápido, o chat é responsivo, e o encaixe com VSCode é praticamente perfeito. Eu não saí porque algo quebrou. Saí porque percebi um padrão que estava me sabotando sem eu ver.

O Cursor me convida a editar arquivo por arquivo. O cursor pisca, eu invoco a IA, ela sugere, eu aceito ou rejeito, e prossigo. É um workflow de microedição. Em uma hora eu fazia 30 microedições e tinha a sensação de produtividade. Mas no fim do dia, o que tinha sido entregue? Geralmente um arquivo modificado, talvez dois, com testes que eu mesmo precisava revisar e ajustar.

O terminal força um modo diferente. Eu mando um pedido como "implementa autenticação com JWT no padrão do projeto, escreve os testes, e me mostra o diff", e o modelo trabalha. Eu não vejo cada decisão. Vejo o resultado, faço review como se fosse PR de outro engenheiro, e aceito ou peço ajustes.

A mudança de granularidade muda tudo.

![Comparação Cursor vs Claude Code: microedição vs PR completo, 30 microedições/h vs 3-5 PRs/h](/images/blog/parei-cursor-voltei-terminal/cursor-vs-claude-code.png)

## O que muda na prática

**Sai a microedição, entra a tarefa.** No terminal eu não fico babá do cursor. Mando um pedido bem definido e o modelo entrega 4 arquivos modificados. Em uma hora, em vez de 30 microedições, eu produzo 3-5 PRs completos.

**Sai o lock-in no IDE, entra o controle do workflow.** Cursor te prende dentro do VSCode. Claude Code roda em qualquer terminal, dentro de tmux, junto com git, com seus scripts shell, com qualquer outra ferramenta. Composição livre.

**Sai o chat lateral, entra o CLAUDE.md.** No Cursor, o contexto vivia no chat. Cada sessão eu re-explicava o projeto. Com Claude Code, o `CLAUDE.md` no repositório é lido toda vez que abro o terminal. O modelo já sabe as convenções, os comandos de teste, as decisões. Eu paro de repetir.

**Sai a edição síncrona, entra o paralelismo.** Esse foi o ponto mais importante. No Cursor eu trabalhava em um projeto por vez (porque um VSCode = um projeto, e múltiplas janelas viravam confusão). No terminal eu rodo Claude Code em três projetos diferentes em três tabs do tmux. Cada um trabalha em uma tarefa enquanto eu reviso o resultado do anterior.

## A primeira semana doeu

Não vou mentir. A primeira semana fora do Cursor foi desagradável. Eu sentia falta do autocomplete inline, do "Tab Tab Tab" que me poupava digitar boilerplate. Tive que reescrever meu workflow do zero.

O que me fez aguentar foi o seguinte: o que eu achava que era "produtividade" no Cursor era, na verdade, **a sensação de movimento**. Editar texto rápido parece progresso, mas se o arquivo final ainda precisa de 3 rounds de revisão, o ganho líquido é pequeno.

No terminal, o ciclo é mais lento por interação (um pedido pode levar 90 segundos), mas o que sai já é executável. Em 8 horas, isso multiplica.

## Quando Cursor ainda é melhor

Para ser justo: Cursor ainda ganha em alguns cenários:

- **Exploração de código alheio:** abrir um repo desconhecido, ler arquivos sem objetivo claro. O chat lateral ajuda.
- **Tasks pequenas e visuais:** editar CSS, ajustar copy, mexer em um snippet React. Microedição faz sentido aqui.
- **Pareamento síncrono:** quando você está mostrando código para alguém em call, Cursor é mais visual.

Para o resto do que eu faço (criar features, refatoração, testes, automação), o terminal venceu.

## O setup mínimo

Se você quer testar, o setup é assim:

1. Instala o Claude Code (`npm install -g @anthropic-ai/claude-code` ou via Homebrew)
2. Cria um `CLAUDE.md` no root do projeto com 30 linhas: comandos de teste, padrão de erro, convenções de naming
3. Abre o terminal no projeto, roda `claude`
4. Pede o primeiro PR: "olha o issue #X e propõe um plano"

A partir daqui é treino. Levei 2 semanas para deixar de querer abrir o VSCode no meio da sessão. Hoje só abro IDE para review visual ou para mexer em arquivo HTML/CSS.

## O efeito colateral inesperado

Voltar para o terminal me reconectou com o Unix. Comecei a usar mais `grep`, `awk`, `find`, pipes. Comecei a escrever scripts shell pequenos para automatizar coisas repetitivas. Comecei a entender melhor o sistema operacional que estava abaixo de toda essa abstração.

Não esperava esse efeito. Mas faz sentido: o Cursor te dá uma camada de IDE em cima do código. O terminal te coloca diretamente na superfície. Você fica mais perto do metal.

## Onde aprofundar

Eu juntei o que aprendi nesses meses no livro [Practical Claude Code](https://kenimoto.dev/books/claude-code-mastery) (versão PT-BR no Kindle, está no Kindle Unlimited). Cobre CLAUDE.md em detalhe, padrões de Skills, multi-agente, e o "porquê" de cada decisão de design do Claude Code.

Mas você não precisa do livro para começar. Cria um CLAUDE.md, abre o terminal, manda o primeiro pedido. Em duas semanas você sabe se voltar para o IDE faz sentido para você.

Eu não voltei.

---

*Já fez essa transição? Conta como foi: [TabNews](https://www.tabnews.com.br/kenimo49) ou [GitHub](https://github.com/kenimo49).*
