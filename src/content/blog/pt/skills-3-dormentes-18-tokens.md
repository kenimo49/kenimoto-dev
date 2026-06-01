---
title: "Skills do Claude Code consomem tokens mesmo sem disparar. Medi 5 Skills em 7 horas — os 3 que nunca rodaram comeram 11% da conta."
description: "Carreguei 5 Skills no Claude Code por 7 horas. 3 nunca dispararam, mas levaram 11% dos meus tokens (R$ 121/mês equivalentes na conta Max). A medição completa, o JSON do usage e a auditoria que derrubou esse número."
date: 2026-05-30
lang: pt
tags: [claudecode, ia, skills, tokens, custo]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/skills-3-dormentes-18-tokens/"
og_image: "https://kenimoto.dev/images/blog/skills-3-dormentes-18-tokens/og-pt.png"
cross_posted_to: []
---

Eu achava que Skill do Claude Code era um upgrade grátis em cima dos meus custom commands. Não é grátis. É aluguel.

Essa frase é o artigo inteiro em quinze palavras. O resto é eu mostrando os comprovantes.

Numa terça-feira eu rodei uma sessão única do Claude Code por 7 horas seguidas com 5 Skills carregadas: revisor de PR, helper de migração TypeScript, validador de migração de banco, rastreador de log e limpador de CSV. Três delas **nunca dispararam uma única vez** no dia. Eu revisei o log de invocação duas vezes porque não acreditei. Mesmo assim, essas três sozinhas levaram cerca de **11% do total de tokens da sessão**. Somando com as duas que de fato rodaram, Skills ficou com **18%** da conta.

Antes desse dia eu vinha dizendo pros colegas que "Skill só custa quando dispara, então pode deixar tudo carregado". Estava errado. E errado de um jeito que dá pra medir em reais.

## Como Skills carregam de verdade

Tá tudo na documentação. Eu tinha lido por cima.

Quando a sessão começa, o Claude Code lê todas as Skills no escopo. O que entra no contexto nesse momento é só o `name` e o `description` do frontmatter do `SKILL.md`. O corpo da Skill **ainda não** entra. O corpo só carrega quando o Claude decide que o `description` casa com o seu prompt, ou quando você digita `/nome-da-skill` na mão. Uma vez carregado, o corpo fica no contexto até a sessão acabar ou a compaction rodar.

A parte que eu não tinha internalizado: **o `description` está no contexto a cada turno**. Não só na abertura da sessão. Cada mensagem sua, cada resposta do Claude, o `description` de toda Skill carregada continua ali, como parte do prompt. Cinco Skills com `description` de ~300 tokens dá ~1.500 tokens de "olha o que essas Skills sabem fazer" sendo recobrados em cada turno.

Numa sessão de 80 turnos, esse mesmo bloco de texto é pago 160 vezes. Cada um é pequeno. Mas é constante. É a Skill cobrando aluguel.

## A sessão que medi

Eu uso Claude Code como ferramenta principal de trabalho. No dia da medição foi uma terça normal: triagem de PR de manhã, refactor longo de tarde, shell exploratório no fim do dia. Sessão única, mantida aberta o tempo todo, com `--output-format json --verbose` passando por um wrapper de log que gravava o campo `usage` de cada resposta.

As 5 Skills que estavam em `~/.claude/skills/`:

| Skill | tamanho do description | função | disparou? |
|-------|---:|--------|:---:|
| `review-pr` | ~310 tokens | fluxo de revisão de PR | sim (11 vezes) |
| `migrate-ts` | ~290 tokens | helper de migração TS | sim (2 vezes) |
| `migrate-db` | ~340 tokens | validador de migração DB | não |
| `trace-logs` | ~270 tokens | rastreio de padrões em log | não |
| `clean-csv` | ~280 tokens | receitas de limpeza de CSV | não |

Total de description carregado por turno: ~1.490 tokens de metadado de Skill, sentado em cima do CLAUDE.md, do contexto do projeto e da conversa viva.

A sessão durou 7h12, 84 turnos, ~2,1 milhões de tokens de entrada e saída no total (prompt caching ligado quase o tempo todo).

## O comprovante

Quebrei o consumo em três categorias: total, "o que teria sido sem Skills" (estimativa subtraindo o overhead de description e o corpo dos dois que rodaram) e a diferença. Os números reais:

| Categoria | Tokens | Fatia |
|-----------|------:|------:|
| Conversa, CLAUDE.md, leitura de código | 1.720K | 82% |
| Skills ativas (`review-pr` + `migrate-ts`) | 147K | 7% |
| Skills dormentes (descriptions, 3 nunca dispararam) | 231K | 11% |
| **Total** | **2.098K** | **100%** |

As duas Skills que trabalharam custaram 7%. Tudo bem. Elas me pouparam pelo menos esse mesmo tanto em prompt que eu não tive que redigitar.

As três que nunca casaram com nada custaram 11%. Retorno: zero. Com prompt caching ativo, o custo de description por turno é parcialmente absorvido, mas só parcialmente: cada vez que o meu prompt muda, a fronteira do cache se move, o description é re-tokenizado e entra no `input_tokens` do billing. Onze por cento.

Em conta de Claude Code Max ($200/mês ≈ R$ 1.100/mês), 18% é **R$ 198/mês**. Desses, R$ 121/mês são as três dormentes. Eu estava pagando esse valor para manter três arquivos de texto no contexto. Eu nem tenho coragem de comentar isso na padaria.

![Timeline de 5 Skills em 7 horas: ativas vs dormentes](/images/blog/skills-3-dormentes-18-tokens/timeline-pt.png)

## A auditoria do dia seguinte

Na manhã seguinte rodei a mesma carga de trabalho (mesmo conjunto de PRs, mesmos tipos de prompt) com apenas as duas Skills que tinham disparado no dia anterior. Consumo total: ~1.872K tokens. Queda de ~11% em relação à véspera. Dentro do ruído de "dois dias nunca são iguais", o número bate com o aluguel que as três dormentes vinham cobrando.

Se você quer fazer essa mesma medição na sua máquina, basta envelopar o `claude` num wrapper que lê o JSON do `usage`:

```bash
claude -p "$SEU_PROMPT" --output-format json --verbose \
  | jq '{input: .usage.input_tokens, cached: .usage.cache_read_input_tokens, output: .usage.output_tokens}'
```

A linha que importa é `input_tokens`. Se ela tem uma deriva pra cima depois que você adiciona uma Skill nova, você está pagando aluguel de description.

## Por que isso me pegou de surpresa

Eu tratava Skill como `import` em linguagem de programação: custo zero até ser chamada. `import` é grátis porque o compilador descarta o que não foi referenciado. O Claude Code não pode descartar. O `description` é justamente o material que ele usa pra decidir se chama ou não. Se o `description` fosse lazy-loaded, ele nem teria como decidir disparar a Skill em primeiro lugar.

É uma escolha de design coerente. É a escolha certa, inclusive. Mas a consequência é que o custo marginal de "ter uma Skill instalada e nunca usada" não é zero. É um imposto por turno que vai se somando ao longo da sessão.

Não confunda isso com Hook. Hook é disparado de propósito pelo Claude Code em resposta a eventos: pre-tool, post-tool, session-end. Hook não fica descrito no system prompt pra matching nenhum, fica configurado no `settings.json` e o harness chama quando precisa. **Hook que nunca dispara custa zero de verdade. Skill que nunca dispara custa description × cada turno.** São mecanismos diferentes que ficam encostados no mesmo Claude Code.

Também não é a mesma coisa que MCP server inativo. Um MCP server inscreve a lista completa de ferramentas no system prompt na abertura da sessão (um único estudo público mediu ~27.000 tokens por servidor), mas isso é custo fixo por servidor, não por turno. Skill é menor por item, mas tende a ser em maior quantidade, e o "× cada turno" multiplica.

## Checklist: auditar suas Skills em 5 passos

Virou rotina mensal aqui. 10 minutos.

1. **Lista todas as Skills no escopo.** `ls ~/.claude/skills/`, mais o `.claude/skills/` do projeto, mais qualquer Plugin. Anota num arquivo.
2. **Pra cada Skill, descobre a última vez que ela disparou.** Se você loga sessões com `--output-format json`, basta um `grep` pelo nome da Skill nas entradas de tool-use. Se você não loga, vai depender da memória, e a memória mente.
3. **Marca como "candidata" toda Skill sem disparo nos últimos 30 dias.** Não deleta ainda. Só sinaliza.
4. **Move a candidata pro sótão por uma semana.** Aqui eu literalmente faço `mv ~/.claude/skills/<name>/ ~/.claude/skills-atico/`. Trabalha uma semana sem ela. Se não fez falta, era aluguel.
5. **Re-mede o `input_tokens` na linha de base.** Mesmo tipo de carga, sem as candidatas carregadas. Se a linha caiu de forma visível, você acabou de descobrir a economia.

A armadilha que dá pra evitar: **não delete a candidata na hora**. Tem Skill que não dispara há 30 dias porque você usa só num fechamento trimestral que você esquece. "Pro sótão" é o meio-termo seguro.

## O que mudei aqui

Três Skills foram pro sótão. Uma volta no mês que vem porque tenho migração de banco programada. As outras duas, provavelmente ficam por lá. As duas ativas continuam.

A sessão que estou rodando agora pra escrever este artigo também tá só com duas Skills. A linha do `input_tokens` por turno ficou plana de um jeito que ela não era antes (vinha subindo de leve). 11% parece pouco quando você fala em voz alta. R$ 121/mês só com três arquivos de texto sentados no contexto sem disparar tem outra cara. Em conta de API metered, depende do uso, mas é a mesma história em formato diferente.

Quem mantém muitas Skills carregadas não tá errado de gostar da praticidade. Só precisa saber que essa praticidade tem um imposto por turno, e que o imposto é invisível até você decidir ir conferir.

A frase que vou colar no monitor: **carregada ≠ ativa ≠ paga só quando usa.**

Roda o `claude -p` com `--output-format json` uma vez e olha o `usage.input_tokens`. O número está ali há um tempão, contando essa história. Eu é que não estava prestando atenção.

A camada de design de Skills, allow-list por papel, e os padrões de operação do Claude Code que mantém o overhead de token sob controle estão em **[Practical Claude Code](https://kenimoto.dev/pt/books/claude-code-mastery)** — o capítulo de Skills é o que mais releio antes de adicionar uma nova.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
