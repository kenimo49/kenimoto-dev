---
title: "O criador do CLAUDE.md escreve 2 linhas. A comunidade escreve 100. Quem está errado?"
description: "Boris Cherny, criador do Claude Code, mantém um CLAUDE.md de duas linhas. A comunidade escreve arquivos de 100, 300, 500 linhas e jura que funciona melhor. Testei os dois extremos em três projetos reais. O vencedor não é quem você pensa, e os números têm um detalhe que ninguém conta."
date: 2026-06-30
lang: pt
tags: [claude-code, context-engineering, dx, produtividade]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/claude-md-2-vs-100-linhas-quem-erra/"
og_image: "https://kenimoto.dev/images/blog/claude-md-2-vs-100-linhas-quem-erra/og-pt.png"
cross_posted_to: []
---

Boris Cherny, criador do Claude Code, mantém um CLAUDE.md pessoal de **duas linhas**. Você lê isso em uma entrevista e pensa: "ah, então o segredo é ser minimalista". Aí abre o seu repositório, encontra um CLAUDE.md de 187 linhas escrito por você mesmo, e fica com aquela sensação desconfortável de quem foi pego fazendo cosplay de engenheiro sênior.

A minha primeira reação foi apagar tudo e copiar o estilo do Boris. Testei em três projetos reais, com a versão de duas linhas e com a versão inchada. O resultado não foi nenhum dos dois extremos vencer limpo. Foi um detalhe sobre **onde** o contexto fica, que a leitura preguiçosa da entrevista do Boris esconde, e que a comunidade ignora quando posta print de CLAUDE.md gigante no X.

Esse post é o relato dos três experimentos e o que sobrou de regra no fim.

![Duas barras: CLAUDE.md de 2 linhas e CLAUDE.md de 100 linhas, com setas mostrando onde cada um falha](/images/blog/claude-md-2-vs-100-linhas-quem-erra/og-pt.png)

## As duas linhas do Boris, na íntegra

Antes de qualquer coisa, vou colocar o arquivo de duas linhas para você ver com seus próprios olhos. Não é folclore, é o que está publicado em entrevista.

```markdown
# CLAUDE.md
- Habilitar automerge ao abrir um PR
- Postar no canal interno do Slack ao abrir um PR
```

Isso é tudo. Sem stack do projeto, sem convenções de código, sem estratégia de testes, sem comandos. Olha de novo. Duas linhas. E a pessoa que escreveu esse arquivo é a mesma que **construiu o Claude Code**.

A primeira leitura é: "ok, então CLAUDE.md deve ser pequeno". A leitura correta é mais chata: o CLAUDE.md pessoal do Boris é pequeno **porque o CLAUDE.md compartilhado do time, na raiz do repositório do Claude Code, é atualizado várias vezes por semana e cobre todo o contexto do projeto**. As duas linhas são as preferências individuais dele sobre uma base de conhecimento de time que já existe.

Quem copia o tamanho sem copiar a estrutura está copiando o sintoma, não a causa. Esse foi o erro do meu Experimento 1.

## Experimento 1: 2 linhas em projeto solo

Peguei um projeto Next.js + TypeScript + Prisma que eu mantenho sozinho. Tinha um CLAUDE.md de 142 linhas. Apaguei tudo, deixei estas duas:

```markdown
# CLAUDE.md
- Sempre rode `npm test` antes de PR
- Comente o código em português
```

A primeira semana foi uma série pequena de constrangimentos. O Claude reinventou as convenções de teste do projeto (Vitest, que ele teria sabido se o arquivo dissesse). Tentou abrir conexões diretas ao Prisma sem passar pelo client compartilhado. Sugeriu um middleware de auth no padrão de outro projeto meu. Tudo isso eu corrigia manualmente, e cada correção custava 30-60 segundos.

A média de "tempo perdido por sessão consertando o Claude" subiu para uns 4 minutos. Não parece muito, mas eu rodo umas 8 sessões por dia. Faz a conta: meia hora perdida por dia. **Multiplicado por 30 dias úteis, é um dia de trabalho jogado fora por mês**, em troca de um arquivo bonito de duas linhas.

Conclusão do Experimento 1: copiar o tamanho do Boris em projeto solo, sem ter o "CLAUDE.md compartilhado do time" que cobre o resto, é otimização performática. O arquivo fica bonito, o trabalho fica feio.

## Experimento 2: 100+ linhas em projeto solo

Voltei para a versão inchada e levei o experimento ao extremo oposto. Subi o CLAUDE.md para 247 linhas. Coloquei convenções de código, padrões de teste, regras de migração de banco, política de tratamento de erros, exemplos de uso de cada lib do projeto, lista de pegadinhas que eu lembrei na hora.

Funcionou melhor que as três linhas. Não foi nem perto. Mas apareceu um efeito que eu não esperava: **o Claude começou a ignorar instruções enterradas no meio do arquivo**. Sabe a parte sobre "sempre passar pelo `db-client.ts`"? Estava na linha 138. O Claude voltou a fazer conexões diretas ao Prisma.

LLMs dão mais peso ao começo e ao fim da entrada. Uma instrução crítica enterrada no meio de um CLAUDE.md de 247 linhas tem chance real de ser ignorada. Não é bug, é como o modelo funciona.

Outra coisa: instruções contraditórias começaram a se acumular. Eu tinha uma linha antiga que dizia "use Jest" (do tempo em que era Jest) e uma linha nova "migramos para Vitest". As duas estavam no arquivo. O Claude às vezes seguia uma, às vezes a outra. **CLAUDE.md inchado vira sedimento geológico**: cada erro vira uma camada nova, ninguém limpa as camadas velhas.

Conclusão do Experimento 2: 247 linhas funciona melhor que 3, mas começa a ter custos próprios: instruções enterradas, contradições acumuladas, janela de contexto comida.

## Experimento 3: o que de fato sobrou

A versão que ficou rodando no meu projeto solo tem 67 linhas. Não escolhi esse número por estética; foi o ponto onde parei de adicionar e comecei a podar. A estrutura é esta:

```markdown
# CLAUDE.md

## ⚠️ Regras críticas (topo, sempre lidas)
- Nunca conectar direto ao Prisma. Use `lib/db-client.ts`
- Nunca commitar `.env`. Sempre atualizar `.env.example`
- Migrações destrutivas: pedir confirmação antes

## Visão Geral
E-commerce Next.js 14 App Router + TypeScript + Prisma + PostgreSQL.

## Comandos
- `npm run dev`, `npm test`, `npm run build`
- `npx prisma generate` quando schema mudar

## Pegadinhas (Se → Então)
- Se: nova rota API → Então: atualizar tipos em `src/lib/api-client.ts`
- Se: nova variável env → Então: atualizar `.env.example` + README

## Referências
- Spec API detalhada: `docs/api-spec.md`
- Estratégia de testes: `docs/testing.md`
- Procedimentos deploy: `docs/deploy.md`
```

Três coisas mudaram em relação à versão de 247 linhas. As regras críticas subiram para o topo, onde o modelo presta mais atenção. Os detalhes saíram do CLAUDE.md e foram para arquivos em `docs/`, referenciados por nome. E o estilo de código (indentação, ponto e vírgula, aspas) saiu do CLAUDE.md inteiro porque **isso é trabalho do prettier**, não do CLAUDE.md.

Esse último ponto é o que o Boris diria se você perguntasse: "não brigue com o modelo, e não escreva no CLAUDE.md o que o linter já garante". Estilo de código é regra determinística, joga no `.prettierrc`. CLAUDE.md é para o que precisa de **julgamento**.

## Os três CLAUDE.md públicos que eu li

Antes de fechar, fiz a tarefa que faltava: olhei CLAUDE.md de repositórios públicos sérios para ver os números reais. Não vou postar diff por respeito a quem mantém, mas o resumo serve.

| Repositório | Linhas do CLAUDE.md raiz | Estilo |
|---|---:|---|
| Repositório do próprio Claude Code (time interno) | atualizado várias vezes/semana | grande, vivo |
| Repositórios de framework AI populares | 80-200 | médio, estruturado |
| Repositórios indie pequenos no GitHub | 20-80 | enxuto |

O padrão não é "minimalismo vence" nem "completude vence". O padrão é que **o tamanho corresponde à quantidade de contexto que o time precisa compartilhar**. Time interno do Claude Code: muito contexto, arquivo grande e vivo. Framework popular: contexto médio, arquivo médio. Projeto indie: pouco contexto, arquivo pequeno.

As duas linhas do Boris não são o padrão do time dele. São o **delta pessoal** dele sobre um padrão de time muito maior. Quem mostra o screenshot das duas linhas sem mostrar o resto está mostrando a ponta do iceberg como se fosse o iceberg.

## A regra que sobrou

Depois dos três experimentos, a regra que ficou rodando é simples e nada glamorosa:

- **Em projeto solo**: 50-80 linhas. Regras críticas no topo. Detalhes em `docs/`.
- **Em projeto de time**: o CLAUDE.md da raiz cresce com o time. CLAUDE.md pessoal (em `claude.local.md`, no gitignore) fica pequeno como o do Boris.
- **Sempre**: estilo de código sai do CLAUDE.md. Vai para o linter. Você só escreve o que precisa de julgamento.

Ninguém está errado entre "2 linhas" e "100 linhas". As duas estão respondendo perguntas diferentes. A pergunta certa é "qual é o contexto que precisa estar em algum lugar para o Claude trabalhar bem no meu projeto?". Esse contexto existe; a questão é se você o escreveu, e onde.

O CLAUDE.md de duas linhas é uma boa provocação. Não é um template.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
