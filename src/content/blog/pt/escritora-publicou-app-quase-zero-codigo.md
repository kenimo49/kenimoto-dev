---
title: "Uma escritora publicou um app inteiro escrevendo quase zero linha de código: 9.000 linhas, 20 horas"
description: "Uma escritora sem nenhuma experiência em programação publicou um web app completo: React, Firebase, PWA, autenticação Google. Cerca de 9.000 linhas, das quais ela escreveu quase nenhuma. A barreira pra construir software não é mais saber programar. É saber dizer o que você quer."
date: 2026-06-07
lang: pt
tags: [claude-code, vibe-coding, nao-engenheiros, ia, desenvolvimento]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/escritora-publicou-app-quase-zero-codigo/"
og_image: "https://kenimoto.dev/images/blog/escritora-publicou-app-quase-zero-codigo/og-pt.png"
cross_posted_to: []
---

Eu fui engenheiro por mais de oito anos e vou dizer uma coisa que talvez te incomode: a parte difícil de construir software nunca foi escrever código. Era descobrir o que construir. E essa parte acabou de ficar acessível pra quem nunca abriu uma IDE na vida.

Deixa eu te dar o caso concreto que me fez parar pra pensar.

## O número que não fecha com a história que a gente conta

Uma escritora, conhecida online como tiaroka, partiu do zero em programação e publicou um web app de gerenciamento de tarefas. Não um protótipo de fim de semana. Um app completo: React + Vite + TailwindCSS + Firebase, com suporte a PWA, autenticação via Google, operações CRUD, timeline e UI responsiva.

Olha os números, porque eles são o ponto inteiro:

| Item | Valor |
|------|------|
| Período de desenvolvimento | Cerca de 4 meses |
| Sessões de trabalho | 12 |
| Tempo total | Cerca de 20 horas |
| Linhas de código | Cerca de 9.000 |
| Linhas escritas por ela | Quase zero |
| Testes | 21 arquivos, cerca de 3.500 linhas |

Vinte horas de trabalho efetivo. Nove mil linhas. E a própria autora escreveu quase nada disso à mão. Quando eu vi isso pela primeira vez, minha reação de engenheiro foi a defensiva clássica: "tá, mas o código deve ser um lixo". Aí eu li o resto.

## A parte que me calou: ela documentou os limites da IA melhor que muito sênior

O que separa esse caso de mais um post de "olha o que a IA fez" são as limitações que ela mesma anotou durante o processo. Três frases que eu queria ter ouvido de alguns colegas:

> **Ela não pensa em design.** A IA escreve código que funciona, mas não escreve código bem desenhado desde o começo. Perguntar "essa função não tá grande demais?" é trabalho do humano.

> **Achar bug é trabalho do humano.** A IA não vai te avisar que tem um bug. Notar que "tem algo estranho" usando o app de verdade fica por sua conta.

> **IA revisando código de IA tem limite.** Existe a chance das duas compartilharem o mesmo ponto cego.

Repara que ela chegou nisso justamente *porque* não era engenheira. Bateu na parede com a cara e descreveu a parede. E a solução que ela inventou pra isso é genial na sua simplicidade: pediu pra IA gerar revisões no formato de "uma conversa entre dois engenheiros sêniores". Um focado em frontend, outro em arquitetura, debatendo. Ficou muito mais fácil entender *por que* algo deveria ser feito de um jeito do que com feedback estilo livro-texto. Eu, que sou da área, nunca tinha pensado nisso.

## O fluxo que faz isso funcionar não é mágica, é processo

Antes que alguém ache que ela só digitou "faz um app" e saiu fumaça, o caminho teve três fases bem definidas.

Primeiro, ela prototipou no Claude.ai, usando o recurso de Artifact. A cada pedido por chat, o protótipo era atualizado. Foram 22 versões. O valor disso é sutil: em vez de escrever requisito no papel, ela ia refinando olhando pra uma coisa que funcionava. "É isso que eu quero" fica muito mais fácil de dizer apontando pra uma tela do que descrevendo no abstrato.

Depois, ela entregou o protótipo e o documento de requisitos pro Claude Code com "constrói isso com Firebase". O MVP saiu nas primeiras 2 horas. As outras 18 horas foram 12 sessões de melhoria: um componente de 1.170 linhas refatorado pra 325 (redução de 72%), busca por IA, suporte offline.

A chave, e isso vale pra qualquer um começando: ela não tentou a perfeição de cara. As primeiras 2 horas entregaram um MVP meia-boca. O resto veio no ciclo, ao longo de 4 meses.

![Linha do tempo de três fases: protótipo no Claude.ai com 22 versões, MVP em 2 horas, e 12 sessões de melhoria somando 20 horas e 9.000 linhas](/images/blog/escritora-publicou-app-quase-zero-codigo/og-pt.png)

## A contramão: não, isso não mata a engenharia

Aqui vem a parte contraintuitiva, e é onde eu discordo do hype tanto quanto discordo do pânico.

O lado "a IA vai substituir programadores" está errado. O lado "isso é só brinquedo, nada sério" também está errado. A verdade desconfortável é uma terceira coisa: **a fronteira de quem pode construir desapareceu, mas a fronteira de quem pode operar com segurança continua firme.**

Repara nas decisões de design dela. O princípio foi "não assumir risco". Autenticação? Delegada pro Firebase Auth, sem gerenciar senha. Funcionalidade de pagamento? Nenhuma. Dado pessoal? O mínimo. Isso tem nome: sabedoria de engenharia. Em vez de tentar fazer o que não sabe, ela reduziu o próprio risco. Saber tomar essa decisão é exatamente a linha que separa "consegue construir" de "consegue colocar no ar sem se machucar".

E é por isso que eu, como ex-engenheiro, vejo isso como algo pra comemorar, não pra temer. O gargalo do desenvolvimento de software sempre foi articular requisito. O time de negócio não consegue dizer com precisão o que quer, o engenheiro constrói em cima do mal-entendido, e a rodada de "não era isso que eu quis dizer" se arrasta. Quando a pessoa que quer a coisa consegue construir o próprio protótipo, esse custo de comunicação despenca.

A habilidade que isso valoriza é a mais antiga e subestimada de todas: dizer, com clareza, o que você quer que exista no mundo. Digitar `git rebase` virou detalhe. Acontece que articular a intenção sempre foi a parte mais cara, e agora é a única que sobrou pra você.

Se você é não-engenheiro e tá lendo isso pensando "será que eu consigo": comece pequeno. Não vá direto pro app. Automatize um relatório, organize um e-mail. O caso da tiaroka não começou com 9.000 linhas. Começou com um MVP capenga de 2 horas e a teimosia de melhorar.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
