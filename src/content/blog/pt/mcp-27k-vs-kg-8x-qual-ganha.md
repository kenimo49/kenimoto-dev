---
title: "MCP me custou 27 mil tokens só pra dizer oi. Knowledge Graph cortou 150 mil pra 18 mil no code review (8,3x). Qual ferramenta ganha qual batalha"
description: "Mês passado reclamei aqui que 4 servidores MCP me cobravam 27 mil tokens de handshake só pra ligar. Daí descobri o experimento contrário: code review com Knowledge Graph caiu de 150 mil pra 18 mil tokens — 8,3x menos. O que separa MCP-desperdício de KG-economia é uma pergunta simples, e a resposta muda como eu desenho qualquer pipeline novo."
date: 2026-06-24
lang: pt
tags: [mcp, knowledge-graph, tokens, code-review, claude-code]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/mcp-27k-vs-kg-8x-qual-ganha"
og_image: "https://kenimoto.dev/images/blog/mcp-27k-vs-kg-8x-qual-ganha/og-pt.png"
cross_posted_to: []
---

Mês passado eu [reclamei aqui](https://kenimoto.dev/pt/blog/conectei-claude-4-servidores-mcp-27k-tokens-handshake/) que 4 servidores MCP me cobravam 27 mil tokens de handshake só pra dizer "oi, estes são os meus tools". Sábado de manhã, de pijama, descobri que estava pagando o equivalente a uma pizza por mês só pra ligar coisa que eu nem usava direito. O post foi catártico. Achei que tinha terminado o assunto.

Daí, semana retrasada, rodei o experimento contrário. Code review do mesmo projeto, **com** Knowledge Graph plugado via MCP. Contexto caiu de **150 mil pra 18 mil tokens — 8,3x menos**. Mesma ferramenta (MCP), mesmo projeto, mesma sessão. Um caso me arrancou tokens; o outro me devolveu de pilha.

Aí caiu a ficha: **MCP não é vilão nem herói. Depende do que você empurra por ele.** O handshake é caro porque carrega *descrição de ferramenta*. O code review com KG é barato porque carrega *só o subgrafo relevante*. A diferença não é a tecnologia, é o que viaja pelo cano. E essa distinção mudou como eu desenho pipeline.

![Gráfico: handshake MCP 27k tokens vs code review com KG cai de 150k pra 18k. Mesmo cano, cargas opostas](/images/blog/mcp-27k-vs-kg-8x-qual-ganha/mcp-vs-kg-token-flow.png)

## Por que o MCP cobrou 27k só de handshake

Recapitulando o post anterior, sem voltar lá. Quando o Claude Code inicia, ele chama `list_tools` em cada servidor MCP plugado. O retorno é a lista completa: nome, descrição, schema de entrada, schema de saída. **Tudo isso vira contexto de input antes da sua primeira pergunta.** É o cardápio sendo lido em voz alta antes de você pedir o prato.

Meu cardápio tinha 4 garçons:

| Servidor MCP | Tools expostas | Tokens de handshake |
|---|---|---|
| GitHub MCP | 24 | 5.800 |
| Filesystem MCP | 11 | 2.100 |
| Slack MCP | 18 | 6.400 |
| Google Drive MCP | 14 | 4.700 |
| **Total dos 4** | 67 | **~19.000** |
| + Claude Code base | — | ~8.000 |
| **Handshake total** | | **~27.000** |

Olhando friamente, eu uso GitHub MCP umas 30 vezes ao dia, Filesystem MCP umas 10, Slack umas 2, e Google Drive nenhuma (instalei "por garantia"). Os 4.700 tokens do Drive estavam queimando todo dia pra absolutamente nada. Foi exatamente esse tipo de gordura que o post anterior tirou: corte do Drive e simplificação do schema do Slack, e o handshake desceu pra ~9k.

Mas a lição que eu *tirei errado* desse primeiro experimento foi "MCP é caro". A lição certa, que só consegui formular agora, é diferente.

## Por que a mesma MCP economizou 132k no code review

O segundo experimento foi assim. Peguei um PR de uns 800 linhas mexendo em `auth.py` de um projeto Python de ~200 mil linhas. Pedi pro Claude Code revisar de dois jeitos:

**Jeito antigo (sem KG):** "olha esse diff, e pra ter contexto, leia o arquivo modificado mais uns 50 arquivos do entorno que podem estar relacionados." Era o que eu fazia há um ano. Resultado: **~150 mil tokens** de contexto, revisão diluída, três pontos relevantes perdidos no meio do barulho.

**Jeito novo (com KG via MCP):** plugar um servidor MCP de Knowledge Graph de código (no meu caso usei o `code-review-graph`, mas o ponto vale pra qualquer ferramenta que exponha `blast_radius` e `flow_trace` via MCP). O Claude chama `blast_radius("auth.py")` e o servidor devolve:

```text
Hop 0: auth.py (arquivo modificado)
Hop 1: middleware.py, api/login.py, api/register.py
Hop 2: tests/test_auth.py, tests/test_login.py
Hop 3: conftest.py
Risco: 7,2/10
```

Sete arquivos, escolhidos por estrutura do grafo de chamadas, não por palpite. O Claude lê os sete e só esses sete. Resultado: **~18 mil tokens** de contexto. A revisão sai limpa, com os três pontos relevantes destacados, e ainda sobrou contexto pra eu pedir refatoração na sequência.

```text
Sem KG:  arquivo modificado + 50 arquivos "por garantia" = ~150.000 tokens
Com KG:  arquivo modificado + 7 arquivos por blast radius =  ~18.000 tokens
Redução: 8,3x
```

Em real, na cotação de [junho/2026 da Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) (Sonnet 4.6 a $3.00 input / $15.00 output por 1M tokens, $1 ≈ R$ 5,40), 132k tokens de input por revisão são uns R$ 2,14 de economia *por PR*. Numa equipe que abre 30 PRs por semana, vira ~R$ 250/mês só de input — sem contar que o output também encolhe porque a revisão é mais enxuta. E o fato mais importante: o tempo de "garimpo" que eu gastava antes (uns 30 minutos por PR procurando "será que isso afeta o login?") virou 2 segundos de query no grafo. Acessar isso muda como o time trata o code review.

## O Tree-sitter faz o trabalho sujo, sem LLM

A parte que eu mais gosto desse arranjo é que o grafo é construído **sem LLM**. O Tree-sitter parseia o código em AST de forma determinística, em mais de 40 linguagens com parser oficial, e a [tree-sitter-language-pack](https://pypi.org/project/tree-sitter-language-pack/) empacota mais de 300 gramáticas da comunidade. Python, TypeScript, Go, Rust, PHP, Ruby, Kotlin: tudo coberto.

A pipeline de duas passadas funciona assim:

**Passada 1 — AST local:** Tree-sitter extrai funções, classes, imports, chamadas. Roda na sua máquina, sem mandar arquivo nenhum pra fora. A grafo bruto (nós, arestas) fica em SQLite ou em Neo4j local, dependendo do tamanho.

**Passada 2 — semântica via LLM (opcional):** se você quer enriquecer o grafo com intenção de design, comentários ou READMEs, aí sim entra LLM, mas só nos pedaços que precisam. A maior parte do valor já está na passada 1.

O ponto importante: a passada 1 transforma "código" em "grafo consultável". A passada 2 transforma "grafo" em "grafo enriquecido". O code review usa o resultado da passada 1 pra decidir *quais 7 arquivos importam*, e só aí o LLM (Claude) entra pra ler esses 7. Nenhum arquivo viaja pra fora antes de o grafo dizer que ele importa.

Detalhe que eu não tinha apreciado: o grafo é gerado uma vez e atualizado incrementalmente. Não é um custo recorrente por PR. É um one-shot do projeto inteiro, depois só os arquivos modificados re-parseiam. Pra um repositório de 200k linhas, o grafo inicial monta em uns 90 segundos numa máquina decente.

## A diferença estrutural: descrição de ferramenta vs subgrafo de dados

Voltando ao porquê os dois experimentos terminam tão diferentes apesar de usarem MCP, dá pra resumir em uma frase:

**MCP-handshake carrega *o cardápio inteiro*; KG-via-MCP carrega *só a parte do prato que você pediu*.**

O cardápio é fixo: 60 tools com schemas longos, todas descritas em texto natural pra LLM entender. Ele cresce com o número de tools e nunca encolhe sozinho. É por isso que o handshake fica caro: você paga proporcional ao tamanho do menu, não ao que vai pedir.

O subgrafo é dinâmico: a query `blast_radius("auth.py")` devolve 7 nós nessa sessão; na próxima, `blast_radius("payment.py")` pode devolver 12. Você paga proporcional ao escopo de *uma* pergunta, não ao tamanho do universo. E o grafo já filtrou o que não é relacionado antes de o LLM ver.

Isso me deu uma regra de bolso pra desenhar qualquer pipeline novo com MCP:

```text
MCP é caro quando a carga útil é DESCRIÇÃO (cardápio de tools, schemas grandes, list_resources volumoso).
MCP é barato quando a carga útil é RESULTADO (subgrafo, query result, blob endereçado).
```

Sabendo disso, o conserto do handshake caro é óbvio: corte tool desnecessária, encolha descrição, divida em servidores menores. E o ganho do KG-via-MCP é estrutural: você nunca empurrou o repositório inteiro pelo cano; só o pedaço que o grafo disse que importa.

## O que eu mudei depois desses dois experimentos

Três mudanças, em ordem do que doeu menos pra mais.

**Um, auditei meu `mcp.json` pelo critério "quantas tools desse servidor eu uso por semana".** Drive saiu. Slack ficou com `allowedTools` limitado a 4 das 18 originais. GitHub eu mantive inteiro porque uso quase tudo. Handshake desceu de 27k pra ~9k sem perder funcionalidade que eu de fato exercitava.

**Dois, plugei `code-review-graph` no Claude Code como MCP servidor.** Custo de plugar: ~600 tokens de handshake (8 tools de query enxutas, schemas pequenos). Economia por PR: 100-150k tokens. ROI em uma única revisão. Hoje todo PR não-trivial passa por `blast_radius` antes de eu chamar revisão.

**Três, comecei a pensar todo MCP server novo pelas duas categorias.** Se a tool expõe *uma operação ampla com schema grande*, eu vou pagar caro no handshake e o ganho precisa ser proporcional. Se a tool expõe *uma query que retorna subgrafo direcionado*, o custo fica no resultado, que eu controlo pela própria pergunta. Servidor "tipo cardápio" eu carrego com cuidado; servidor "tipo grafo" eu carrego à vontade.

O que me incomoda agora é que, quando o MCP saiu, todo mundo (eu incluído) tratou ele como uma tecnologia única com um único perfil de custo. "MCP é leve", "MCP é caro", essas frases não significam nada. **MCP é um cano. O que viaja no cano é o que decide se você está economizando ou queimando dinheiro.**

Faz sentido com o que vejo em projeto BR também. Tem fintech aqui em São Paulo que migrou a parte de revisão de PR pra esse padrão grafo + LLM e cortou conta de API quase pela metade — não pelo MCP em si, mas porque parou de jogar repositório inteiro pra modelo. A escolha de ferramenta foi o sintoma; a escolha de *o que mandar pro modelo* foi a causa.

O sábado de manhã onde eu reclamei do MCP de pijama agora parece, em retrospectiva, um diagnóstico parcial. Não era "MCP é caro". Era "eu estava usando MCP pra carregar cardápio quando devia estar usando pra carregar grafo". Mesmo cano, carga oposta, resultado oposto. Se eu tivesse parado no primeiro post, teria desligado uma ferramenta que, no segundo experimento, virou uma das que mais me economiza dinheiro.

Acho que essa é a moral toda. Desligar a ferramenta errada porque você usou ela pro propósito errado é o tipo de decisão que parece prudente e custa caro silenciosamente. Vale o esforço de separar a ferramenta do uso antes de declarar uma das duas culpada.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
