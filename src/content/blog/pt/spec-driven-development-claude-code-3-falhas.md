---
title: "Eu me recusei a escrever spec até o Claude gerar o código errado 3 vezes"
description: "Passei 6 meses chamando spec-driven development de 'overhead'. Aí o Claude Code escreveu três vezes seguidas um sistema de cupom que aplicava desconto em si mesmo. Conta o que esses 15 minutos de OpenAPI me devolveram."
date: 2026-05-09
lang: pt
tags: [ia, claudecode, spec, openapi]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/spec-driven-development-claude-code-3-falhas/"
og_image: "https://kenimoto.dev/images/blog/spec-driven-development-claude-code-3-falhas/og-pt.png"
cross_posted_to: []
---

Todo mundo no Twitter dev brasileiro diz que spec é overhead. Eu fui um deles, durante seis meses. Aí o Claude Code gerou três vezes seguidas um sistema de cupom que aplicava desconto em si mesmo, e eu fui calado para um arquivo YAML como quem perde uma discussão para a realidade.

Esse post é sobre essa discussão. E sobre o que 15 minutos de OpenAPI me compraram em 2026, num momento em que metade da bolha "vibe coding" ainda fala "é só promptar".

## O que eu estava fazendo errado

O fluxo era o que todo mundo já tentou. Abrir o Claude Code. Digitar "monta um checkout com desconto de membro e campo de promo". Olhar o agente gerar 400 linhas de Flask com confiança. Rodar. Falhar. Repromptar. Receber outras 400 linhas. Repetir até eu perder a paciência ou subir alguma coisa que mais ou menos funcionava.

O sistema de desconto foi onde a roda saiu. Pedi "10% de desconto de membro, promo code somável, máximo 30% no total". O Claude Code entregou uma função que, num pedido de membro com promo, tirava 10%, depois tirava mais 10% sobre o total já com desconto, e aí aplicava o promo. O promo, no meu schema, era também elegível para desconto de membro, porque eu não tinha falado para ninguém que membros são pessoas e promo é item. O sistema, educado, deu cupom para o cupom.

Aqui no Brasil a gente tem uma palavra para isso: gambiarra. A diferença é que essa gambiarra foi escrita em três minutos por uma IA que estava convicta de estar acertando.

Sim, eu sou o engenheiro que postou "é só promptar" semana passada e gastou 5 idas e voltas de PR explicando o que "só" queria dizer.

## Os 15 minutos de spec

Por teimosia, fui fazer aquilo que eu chamava de overhead. Escrevi um OpenAPI. Endpoint, formato do request, formato do response, códigos de erro, restrições em cada campo. Levou 15 minutos.

```yaml
paths:
  /api/orders:
    post:
      requestBody:
        application/json:
          schema:
            customer_id: string
            items: array of OrderItem
            promo_code: string | null
      responses:
        201:
          schema:
            order_id: string
            subtotal: integer (minimum 0)
            member_discount: integer (0..subtotal * 0.1, integer)
            promo_discount: integer
            total: integer
            applied_rules: array of string
        400:
          schema:
            error: { code, message }
```

Depois escrevi um Gherkin com três cenários. Membro sem promo. Não-membro com promo. Membro com promo onde o teto de 30% trava.

```gherkin
Cenário: Membro com promo, limitado a 30% do total
  Dado um membro logado
  E um carrinho com subtotal de R$ 100
  Quando aplica o promo "OUTONO5"
  Então member_discount é R$ 10
  E promo_discount é R$ 20
  E total é R$ 70
  E applied_rules contém "membro" e "promo:OUTONO5"
```

Entreguei os dois arquivos para o Claude Code com uma frase: "implementa essas specs em Flask, com validação e tratamento de erro". Ele gerou uns 80% da implementação em 3 minutos. Os 20% restantes era lógica de domínio de verdade: o que conta como "somável", o que acontece no teto. Eu escrevi isso. E o spec deixou impossível me confundir sobre o assunto.

15 minutos de YAML para apagar 5 idas e voltas no PR. Eu tava economizando 15 minutos gastando 2 horas, na versão alta dessa bobagem.

## Por que funciona (e por que "é só promptar" não funciona)

Não é porque o Claude Code fica mais inteligente quando você dá mais texto. É porque você, ser humano, é forçado a pensar em coisas enquanto escreve o spec.

Quando eu escrevo `member_discount: integer (0..subtotal * 0.1, integer)`, eu me comprometi com a ideia de que o desconto de membro é no máximo 10% do subtotal, em centavos inteiros. O spec não consegue gerar uma versão que "aplica o cupom em si mesmo" porque o spec não tem um destinatário em forma de cupom para essa recursão. A ambiguidade morre no YAML, antes de virar um bug em Python.

Isso não é original. A onda de ferramentas spec-first de 2026 ([OpenSpec](https://github.com/Fission-AI/OpenSpec), [cc-sdd](https://github.com/gotalab/cc-sdd), [amux](https://amux.io/guides/spec-driven-development/), [Kiro](https://kiro.dev)) está toda construída em cima dessa observação. O GitHub Copilot Workspace nem deixa você pular o passo: ele gera uma "proposed specification" editável antes de tocar no código, porque o time que construiu descobriu que o spec é o único artefato do fluxo que humano consegue revisar de verdade.

Os AI assistants não diminuem o valor do spec. Eles convertem specs ruins em bugs caros mais rápido do que humanos jamais conseguiram.

## Os três padrões que valeram a pena

A versão livro disso são três padrões. Depois de viver com eles um trimestre, todos os três puxam carga.

![Spec-Driven Development com Claude Code: três padrões](/images/blog/spec-driven-development-claude-code-3-falhas/three-patterns.png)

**Padrão 1: OpenAPI para implementação.** Escreve o formato do endpoint. Entrega ao Claude Code. Recebe um stub que cobre 80% de CRUD, serialização, e os erros óbvios. Você adiciona a lógica de domínio na mão. É o caso pão-com-manteiga. É de onde vem o número "80%". Os 20% restantes são justamente o que te pagam para pensar.

**Padrão 2: Gherkin para step definitions.** Escreve cenários em Dado/Quando/Então. Entrega ao Claude Code com `pytest-bdd` ou `behave`. Recebe os esqueletos das steps. O movimento interessante aqui é que os mesmos cenários alimentam tanto o prompt de implementação quanto o de teste, então o agente não consegue divergir entre "o que o código faz" e "o que o teste verifica". Divergência é onde os bugs vão para a produção.

**Padrão 3: Spec para property tests.** A partir do schema OpenAPI (`price: integer, minimum: 0, maximum: 1.000.000`), pede ao Claude Code para gerar property-based tests com Hypothesis ou fast-check. Você ganha os boundary cases (`0`, `1_000_000`, `-1`, `null`, overflow) sem precisar lembrar de cada sabor de "o que pode dar errado com um inteiro". Esse é o que eu mais subutilizei nos últimos anos e do qual mais me arrependo.

## As armadilhas

Três coisas vão te morder se você não prestar atenção.

**Ambiguidade no spec escala linear com bugs na implementação.** Se seu OpenAPI diz `discount: number` em vez de `discount: integer (0..subtotal*0.1)`, o modelo vai chutar. Vai chutar diferente cada vez. Spec vago não é cabeça de vantagem; é uma fábrica de alucinação paga em horas-PR. SDD não é mágica. É uma forcing function sobre você.

**Nunca confie em código gerado sem revisar.** Bugs que eu subi em produção a partir de código gerado nos últimos três meses: uma SQL feita com concatenação de string (injection esperando acontecer), um JWT no `localStorage` (tinha que ser `httpOnly`), e um N+1 silencioso sobre uma tabela de mil linhas. O agente não escreveu nenhum desses por maldade. Escreveu porque nada no spec dizia "não". Specs precisam de uma seção de constraints. Se você quer ver o quão criativo um agente fica quando os constraints não estão lá, leia [meu post sobre 24 horas de agente autônomo](/pt/blog/agente-ia-24-horas-incidentes-seguranca/).

**O agente vai adicionar requisitos que você não pediu.** Vi o Claude Code adicionar autenticação num endpoint cujo spec dizia "público, só rate-limited". O agente leu Stack Overflow suficiente para achar que todo endpoint deveria ser autenticado, e silenciosamente meteu uma checagem. Specs precisam ser explícitas sobre o que o sistema *não* faz, não só sobre o que faz.

## LGPD e a explicabilidade da implementação

Aqui no contexto brasileiro tem um motivo extra para escrever spec, e é jurídico.

A LGPD exige que você consiga explicar como dados pessoais são tratados. Se o seu sistema de checkout calcula desconto baseado em "se é membro", esse fato é uma decisão automatizada sobre dados pessoais. Quando algum dia chega uma solicitação do titular perguntando "por que o desconto saiu R$ 30 e não R$ 50", você não vai querer responder "porque o Claude Code chutou".

Spec-first te dá um artefato auditável que diz, em texto: dados de entrada, regras aplicadas, saída esperada. Isso vale para ANPD, vale para auditoria interna, e vale para o seu sucessor no cargo daqui a 2 anos.

## Como eu escrevo specs hoje

O fluxo que sobreviveu ao contato com a realidade é desromantizado.

1. Esboço o endpoint em OpenAPI. Tipos de campo, ranges, obrigatório vs opcional.
2. Escrevo três cenários em Gherkin. Caminho feliz, edge case, caso de erro.
3. Adiciono uma seção `## Out of scope` no arquivo do spec. Modelo de auth. Rate limit. Cache. Qualquer coisa que o agente possa "ajudar" inventando.
4. Entrego os três para o Claude Code, com `CLAUDE.md` contendo as convenções do projeto.
5. Gero. Reviso o diff contra o spec, não contra a vibe.
6. Rodo os property tests que o spec gerou.

O resultado prático: PRs de 5 idas e voltas viraram PR de 1 ou 2. No nosso time, isso liberou meio dia por sprint que antes era gasto em "espera, o que você queria dizer com X". Meio dia por sprint, meses, soma rápido.

## O que eu falaria pro meu eu de seis meses atrás

Eu falaria pro meu eu de seis meses atrás que os 15 minutos de OpenAPI que ele se recusou a escrever custaram um fim de semana inteiro de "só mais um prompt". Falaria que spec-driven development não é metodologia que você adota porque alguma consultoria vendeu para o seu CTO; é o mecanismo mais barato conhecido para não brigar com um engenheiro júnior rápido, confiante e levemente bêbado.

E falaria: AI assistants não diminuem o valor do spec. Eles convertem specs ruins em bugs caros mais rápido do que humanos jamais conseguiram.

O spec é o pedal do freio. Sem ele, você ainda vai rápido. Você só vai rápido na direção que o training data do agente apontava por último.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
