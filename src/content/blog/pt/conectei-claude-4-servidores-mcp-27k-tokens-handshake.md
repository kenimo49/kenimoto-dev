---
title: "Conectei o Claude Code a 4 servidores MCP. Só o handshake queimou 27.000 tokens — e nem foi o pior."
description: "Plugei 4 servidores MCP no Claude Code e medi cada etapa do startup. Antes da primeira pergunta, já tinha 27 mil tokens de input consumidos. Aqui está o detalhamento por servidor, o cálculo em real, e o ajuste que reduziu o desperdício para 9 mil."
date: 2026-05-20
lang: pt
tags: [mcp, claude-code, tokens, custos]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/conectei-claude-4-servidores-mcp-27k-tokens-handshake"
og_image: "https://kenimoto.dev/images/blog/conectei-claude-4-servidores-mcp-27k-tokens-handshake/og-pt.png"
cross_posted_to: []
---

Eu achei que MCP era de graça. Tipo, "plugue e use", sem custo escondido. Daí abri o Claude Code com 4 servidores MCP configurados, fiz a primeira pergunta e o console mostrou: tokens de input consumidos antes da minha pergunta = **27.143**. Eu nem tinha pedido nada ainda. O Claude basicamente me cobrou 27 mil tokens só para dizer "oi, estes são os meus tools."

Era um sábado de manhã. Eu estava de pijama. E aí passei o resto do dia medindo o que cada servidor estava me custando.

Este post é o resultado. Vou mostrar o detalhamento por servidor, o cálculo em real, e o ajuste simples que reduziu o desperdício para 9 mil tokens por sessão.

![Distribuição de 27.000 tokens no handshake MCP — 4 servidores comparados](/images/blog/conectei-claude-4-servidores-mcp-27k-tokens-handshake/handshake-breakdown.png)

## O setup

Os 4 servidores que eu tinha plugados no meu `~/.claude/mcp.json`:

- **GitHub MCP** — para ler issues, PRs e criar branches do terminal
- **Filesystem MCP** — para ler diretórios fora do projeto atual
- **Slack MCP** — para postar atualizações no canal de trabalho
- **Google Drive MCP** — para abrir docs sem trocar de janela

Nenhum exótico. É a combinação que muita gente em equipe pequena usa. Eu instalei os 4 com a sensação confortável de "tenho tudo à mão." Era exatamente esse o problema.

## O que acontece no handshake

Quando o Claude Code inicia, ele faz uma negociação com cada servidor MCP plugado. A negociação tem 4 etapas, mais ou menos nesta ordem:

1. **initialize** — versão do protocolo, capabilities suportadas
2. **list_tools** — lista de todas as tools que o servidor expõe, com schema JSON completo (nome, descrição, input schema, output schema)
3. **list_resources** — lista de resources expostos
4. **list_prompts** — lista de prompts pré-definidos

Os 4 conjuntos viram contexto de input antes do seu primeiro prompt. O custo varia muito por servidor, porque uns expõem 5 tools enxutas e outros despejam 60 tools com schemas longos.

Medi cada um separadamente, ligando um servidor de cada vez e observando os tokens consumidos no relatório de sessão do Claude Code:

| Servidor MCP | Tools expostas | Tokens de handshake |
|---|---|---|
| Claude Code base (sem MCP) | — | ~18.000 (system prompt + tools nativas) |
| GitHub MCP | 24 | 5.800 |
| Filesystem MCP | 11 | 2.100 |
| Slack MCP | 18 | 6.400 |
| Google Drive MCP | 12 | 4.500 |
| **Total acima do baseline** | **65** | **~18.800** |
| **Sessão completa antes do prompt** | — | **~27.000** (e tinha dia que dava 28.500) |

Para fazer a conta em real: Claude Sonnet 4.6 está em **USD 3,00 por milhão de tokens de input** no momento em que escrevo. 27.000 tokens dão USD 0,081. Com o dólar a aproximadamente R$ 5,00, cada sessão aberta me custa **R$ 0,40** só para começar. Parece pouco. Eu abro de 15 a 25 sessões por dia. São R$ 6 a R$ 10 por dia, todo dia, antes de eu escrever uma única pergunta. R$ 200 por mês de "oi, estes são meus tools."

E o pior é que eu nem usava 60 das 65 tools por dia.

## Por que o Slack MCP é o mais caro

Olhando o detalhamento, o Slack MCP me chamou atenção. 18 tools, 6.400 tokens — quase o dobro do tamanho médio por tool. Quando li o schema, entendi: cada tool do Slack tem descrições verbosas sobre canais, threads, replies, mentions, files, reactions, e um input schema com 5 a 12 propriedades cada. Algumas tools incluem exemplos de uso dentro da própria descrição.

Servidores MCP feitos para uso em LLM tendem a ter **descrições detalhadas de propósito**, porque o modelo precisa entender quando escolher cada tool. Faz sentido do ponto de vista de design. Não faz sentido se você abre 25 sessões por dia e a maioria delas nem toca o Slack.

## O ajuste que reduziu para 9.000

Fiz três mudanças simples ao longo do fim de semana:

**1. Tirei o Filesystem MCP do startup.** Quase nunca leio diretórios fora do projeto atual. Quando preciso, ativo o servidor com um comando manual. Economia: 2.100 tokens por sessão que eu não preciso dele (a maioria).

**2. Substituí o Slack MCP por um script CLI.** Postar no Slack é sempre a mesma chamada de webhook. Não precisa de 18 tools nem de schema JSON. Um `bash post-to-slack.sh "mensagem"` resolve. Economia: 6.400 tokens.

**3. Mantive GitHub e Google Drive, mas usei a opção `--mcp-tools` para filtrar.** No GitHub MCP eu só uso 5 das 24 tools (read_issue, list_prs, create_branch, comment_on_pr, search_code). No Drive, 3 das 12. Filtrar reduziu para mais ou menos 60% do schema. Economia: cerca de 4.000 tokens.

Resultado: o handshake caiu de **27.000 para aproximadamente 9.300 tokens**. Custo por sessão: de R$ 0,40 para R$ 0,14. No mês, de R$ 200 para R$ 70.

Não é uma economia revolucionária. É só dinheiro que eu queimava sem perceber.

## O cálculo que ninguém me avisou

Se você tem o Claude Code rodando e nunca olhou o startup overhead, sugiro abrir o relatório de sessão (o Claude Code mostra "Context: X tokens" no canto) logo após iniciar, **antes** de digitar qualquer prompt. Esse número é o seu custo fixo por sessão. Multiplique por quantas sessões você abre por dia, multiplique por 30. Esse é o seu MCP tax mensal.

O MCP em si é maravilhoso. A capacidade de plugar serviços externos no Claude com schema padronizado é algo que faltava há anos. O problema não é o protocolo. O problema é a tentação de plugar tudo "por garantia" e esquecer que cada servidor cobra um aluguel de tokens no startup.

Para mim, a regra ficou: **MCP server só fica plugado se eu usar pelo menos 3 vezes por semana**. O resto vira CLI script ou fica desligado até ser necessário.

Eu testei. Funciona. E continuo de pijama no sábado, só que com menos R$ 130 saindo da conta da Anthropic todo mês.

A regra "MCP server só fica plugado se eu usar 3x na semana" virou o eixo do capítulo de hooks/MCP de **[Harness Engineering: De Usar IA a Controlar IA](https://kenimoto.dev/pt/books/harness-engineering-guide)** — token cost, autenticação, e quando o MCP é realmente necessário vs CLI script.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
