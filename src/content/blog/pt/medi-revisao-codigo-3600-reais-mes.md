---
title: "Medi quanto o time gasta apontando indentação no PR. R$ 3.600 por mês."
description: "Cronometrei uma semana inteira de code review com 5 devs. 30 minutos por dev por dia saíram em 'ajusta a indentação' e 'ordem de import'. A conta veio em R$ 3.600 por mês, e isso foi só o começo do problema."
date: 2026-05-21
lang: pt
tags: [revisaodecodigo, ia, claudecode, harness]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/medi-revisao-codigo-3600-reais-mes/"
og_image: "https://kenimoto.dev/images/blog/medi-revisao-codigo-3600-reais-mes/og-pt.png"
---

Code review nasceu pra discutir design. Se você abrir 10 PRs do seu time agora, quantos comentários vão ser sobre arquitetura e quantos vão ser "ajusta a indentação"?

Eu fiz essa conta no meu time. Cronometrei tudo por uma semana, fechei a planilha numa sexta e levei um susto. O time não era ruim em revisar código. O problema é que a maior parte do que a gente apontava nem precisava ter chegado num humano.

Esse texto é o relato dessa semana, dos três incidentes que travaram o ROI e do sistema de três camadas que cortou a conta em 80%. No final eu reduzi o tempo médio de revisão por dev de 30 minutos pra 5 minutos por dia, e a aba de comentários do PR começou a ter mais `praise:` do que `issue:`.

## A semana que cronometrei

Cinco devs sêniores, fintech BR média (R$ 100 a 150 por hora, vou puxar R$ 120 como média do time pra conta), uma semana corrida sem feriado.

Eu pedi pra cada dev anotar três coisas a cada PR que revisou:

1. Tempo total da revisão (do "abri o PR" até "cliquei em Approve")
2. Quantos comentários eram sobre formato, lint ou tipo
3. Quantos comentários eram sobre design, regra de negócio ou direção

Cinco PRs por dev na média da semana. Vinte e cinco PRs no total. Eu nem precisei rodar uma análise estatística pra ver a forma do gráfico.

## Os números brutos

Em uma semana cheia:

- **30 minutos por dev por dia** com revisão (média)
- **70% desse tempo** em comentários do tipo "ajusta a indentação", "ordem de import errada", "isso aqui não está com `unknown`, está com `any`"
- **20% em pergunta de regra de negócio** ("esse if cobre o caso de cliente premium?")
- **10% em design e direção** ("essa lógica devia estar no Service, não na Controller")

A conta de mês fica assim:

| Item | Valor |
|---|---|
| Tempo de revisão por dev | 30 min/dia |
| Dias úteis no mês | 20 |
| Time | 5 devs |
| Custo-hora médio (BR sênior fintech) | R$ 120 |
| **Custo total de revisão por mês** | **R$ 6.000** |
| **Parcela em formato/lint/tipo (70%)** | **R$ 4.200** |
| **Parcela útil (design + negócio, 30%)** | **R$ 1.800** |

Eu cheguei a R$ 4.200 numa primeira passada, depois ajustei pra R$ 3.600 considerando que parte do tempo "de formato" também envolvia leitura de contexto (não é 100% perdido). De qualquer forma a ordem de grandeza é essa: três a quatro mil reais por mês caem num buraco que nem deveria existir.

![Custo mensal de revisão manual: time BR fintech com 5 devs sêniores. R$ 6.000 totais, com R$ 3.600 em formato/lint e R$ 1.800 em design.](/images/blog/medi-revisao-codigo-3600-reais-mes/custo-revisao.png)

Pra contexto, segundo o [Octoverse 2024 do GitHub](https://github.blog/news-insights/octoverse/octoverse-2024/) a média global de PRs por dev é menor, mas o padrão de "comentário humano resolvendo problema mecânico" aparece em todos os times que respondem a pesquisas de DevEx. A [pesquisa do Microsoft Research sobre code review](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/MS-CR-Tech-Report.pdf) já apontava isso em 2016: a maior fração dos comentários é o que eles chamam de "low cognitive load", e isso fica nas costas do humano por inércia.

## Incidente 1: a segunda-feira do "ajusta a indentação"

Toda segunda de manhã, eu sentava com o café e abria a fila de PRs do fim de semana. Em três deles tinha o mesmo comentário esperando: indentação em 4 espaços em vez de 2. Em dois, ordem de import errada (Prisma antes do React em vez do contrário). Em um, faltava ponto-e-vírgula porque o autor escreveu no celular.

Trinta minutos cada segunda só nisso. Quem revisava cansava. Quem era revisado também. Em um dos PRs, o autor respondeu "vou aplicar Prettier depois" e fez merge sem aplicar. Ninguém checou. Voltou na semana seguinte, em outro PR, no mesmo arquivo.

Esse é o ciclo que mata revisão de código: quem aponta cansa, quem recebe cansa, e no fim ninguém aplica.

Combinar de rodar Prettier antes do PR não cola. Combinado se esquece. O que resolve é colocar o Biome (ou Prettier + ESLint, mesmo efeito) num hook pre-commit do husky. Coisa de 15 minutos pra configurar, e dali em diante não dá mais pra fazer commit com formato errado.

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

E no `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["biome check --apply"]
  }
}
```

Pronto. O custo de R$ 4.200/mês cai em R$ 2.500/mês na primeira semana de uso.

## Incidente 2: o AGENTS.md combinado que ninguém aplica

Em algum momento do ano passado, o time decidiu adotar Conventional Comments. Eu escrevi a regra no AGENTS.md, mandei no Slack, fiz workshop. Uma semana depois, era só eu colocando `issue:` e `suggestion:` nos comentários. Os outros quatro devs voltaram pra revisão de texto livre, do tipo "isso aqui não está certo" sem marcação.

Pedido se esquece. Regra se quebra.

A diferença foi quando eu pluguei o [CodeRabbit](https://coderabbit.ai/) no repositório, configurei o `.coderabbit.yaml` pra usar a label de Conventional Comments e mandei a ferramenta ler o AGENTS.md do projeto antes de comentar.

A partir desse dia, todo PR já chegava no humano com comentários do CodeRabbit já marcados (`issue:` pra problema, `suggestion:` pra melhoria, `praise:` pra padrão bom). Os devs começaram a copiar o estilo. Em duas semanas o time inteiro estava usando a label sem ninguém pedir.

Regra vira cultura quando o sistema aplica em todo PR sem exceção. Workshop sozinho não dá conta.

## Incidente 3: o PR aberto há três dias

Esse é o pior dos três, e o mais comum.

PR aberto numa terça à noite. Ninguém comenta na quarta. Nem na quinta. Sexta de manhã alguém aperta Approve sem ler com cuidado. Merge. Sábado, segundo turno do plantão, alguém abre um issue no Sentry: o `if` que decidia se o cliente era premium estava invertido. Saiu prod.

Por que ninguém comentou? Porque os outros quatro devs já tinham olhado pra aquele PR, viram que tinha "alguns comentários do CodeRabbit ainda abertos", concluíram que outra pessoa ia revisar e fecharam a aba.

A diferença esse ano foi configurar o CodeRabbit pra emitir `Request Changes` automático quando tem comentário `issue:` sem resolver. Isso bloqueia o merge até o autor responder. Não dá mais pra apertar Approve "de fachada" se algum apontamento de `issue:` ainda está aberto.

Junto disso, o `auto-assign-action` do GitHub passou a sortear um revisor humano específico (em vez de pedir pro time inteiro), e o `pull_request` workflow comenta no PR quando ele passa de 300 linhas pedindo divisão.

Os três juntos cortaram o "PR fantasma" do time. Não tinha mais Approve cego em sexta de tarde.

## O sistema completo, em três camadas

Depois desses três meses, o desenho do que rodava na base ficou claro:

![Modelo de revisão em três camadas: portão automático (hooks/CI), revisão por IA (CodeRabbit/Copilot/Claude) e revisão humana (design, regra de negócio, direção).](/images/blog/medi-revisao-codigo-3600-reais-mes/tres-camadas.png)

- **Camada 1 — portão automático (hooks + CI):** Biome em pre-commit, type check em pre-push, testes em CI. Tudo que dá pra julgar mecanicamente nunca chega num humano.
- **Camada 2 — revisão por IA (CodeRabbit + Copilot):** A IA lê o AGENTS.md, aplica `issue:` em padrão N+1, SQL injection, `any` type, comentários sem teste. Bloqueia merge se tiver `issue:` aberto.
- **Camada 3 — revisão humana:** Sobra o que máquina não decide. Design, regra de negócio, edição de direção. O humano vira o chef-executivo, não o lava-louças.

A conta no final ficou assim:

| Item | Antes | Depois |
|---|---|---|
| Tempo de revisão por dev/dia | 30 min | 5 min |
| Comentários de formato/lint | 70% do total | ~0% (filtrados na camada 1) |
| Comentários de IA (`issue:`, `suggestion:`) | inexistente | 20-30% do total |
| Comentários humanos sobre design | 10% do total | 60-70% do total |
| Custo mensal de revisão | R$ 6.000 | R$ 1.000 |

A redução não foi mágica. Foi sistema. E o curioso é que a qualidade subiu junto, porque a parte "humana" finalmente discutia o que importava.

## A revisão por IA não é só CodeRabbit

Pra fechar: durante esse trabalho eu testei três ferramentas de revisão por IA. CodeRabbit (a referência), Copilot PR Review (incluso no contrato Copilot da empresa) e Claude Code Action (GitHub Action). Cada uma tem força em coisa diferente:

- CodeRabbit: combinação LLM + 40 linters de análise estática. Melhor pra detecção de padrões mecânicos com explicação contextual.
- Copilot PR Review: melhor pra gerar resumo do PR inteiro. Fraco em impor regras específicas do projeto.
- Claude Code Action: melhor pra dialogar pelo `@claude` no comentário. Funciona sem contrato Copilot.

Pra time menor (até 10 devs), CodeRabbit sozinho resolve. Pra time maior ou com requisitos de auditoria, CodeRabbit + uma das outras duas como segunda passada é o que eu rodaria.

## A pergunta que sobra

Você não precisa de mais comentário "ajusta a indentação". Precisa de um sistema que tira essa pergunta do humano. A IA está aí pra absorver a parte mecânica. O humano fica com a parte que valia a pena pagar R$ 120/h pra ter.

---

Eu escrevi um livro inteiro com o passo a passo desse sistema, com `.coderabbit.yaml`, workflows do GitHub Actions, templates de PR e o exemplo final em Next.js + TypeScript + Prisma. Saiu essa semana na Kindle BR.

**Revisão de Código com Harness Engineering** — R$ 24,99 → [amazon.com.br/dp/B0H2DB9YXD](https://www.amazon.com.br/dp/B0H2DB9YXD)
