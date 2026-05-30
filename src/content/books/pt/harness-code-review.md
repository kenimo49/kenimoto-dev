---
title: "Revisão de Código com Harness Engineering"
subtitle: "Automação de revisão na era dos agentes de IA"
description: "Transforme a revisão de código de pedido em sistema. Modelo de três camadas (portão automático / revisão por IA / revisão humana) usando hooks, CodeRabbit, GitHub Actions e AGENTS.md. 15 capítulos práticos com exemplos copia-e-cola em Next.js + TypeScript + Prisma."
lang: "pt"

kindle_url: "https://www.amazon.com.br/dp/B0H2DB9YXD"

price: 24.99
currency: "BRL"
published_date: 2026-05-20
updated_date: 2026-05-20

cover_image: "/images/books/harness-code-review-pt.jpg"

topics:
  - "Revisão de Código"
  - "CodeRabbit"
  - "GitHub Actions"
  - "AGENTS.md"
  - "Conventional Comments"

keywords:
  - "revisão de código com IA"
  - "code review automático"
  - "CodeRabbit configuração"
  - "GitHub Actions code review"
  - "AGENTS.md exemplos"
  - "Conventional Comments labels"
  - "pre-commit hooks"
  - "pull request template"
  - "revisão humana vs IA"
  - "loop de feedback de revisão"

tagline: "Revisão de código em três camadas | hooks + IA + humano · AGENTS.md · CodeRabbit · GitHub Actions"
hero_message: "Pedido se esquece. Regra se quebra. Mas sistema continua funcionando. Pare de gastar 30 minutos escrevendo 'ajusta a indentação' toda segunda de manhã."
series_role: "Trilogia Harness [Operação]: o livro que aplica o harness à parte mais cansativa do dia a dia, a revisão de código."

outcomes:
  - "Construir o portão automático (hooks + CI) que elimina 100% dos problemas mecânicos antes do PR"
  - "Configurar CodeRabbit + Copilot ou Claude Code Action conectados ao AGENTS.md"
  - "Definir o que cabe ao humano: design, regra de negócio e edição de direção"
  - "Integrar Conventional Comments nas ferramentas e nos GitHub Saved Replies"
  - "Criar o loop de feedback que devolve o resultado da revisão ao AGENTS.md"
  - "Medir Time to First Review, Time to Merge e ciclos de correção, e converter em ação"

position_statement:
  - "Foco em sistema, não em técnica de revisão individual"
  - "Concreto: 15 capítulos com .coderabbit.yaml, .github/workflows e templates prontos para copiar"
  - "Específico do harness: integra com AGENTS.md / Code Direction / loops de feedback"
  - "Aplicado: exemplo final em Next.js + TypeScript + Prisma, do zero ao pipeline completo"

target_readers:
  - "[Tech Lead] cansado de PRs com 'ajusta a indentação' como único comentário"
  - "[Engenheiro de plataforma] desenhando a operação de revisão para um time inteiro"
  - "[Dev individual] que quer terminar de revisar em 10 minutos em vez de 1 hora"
  - "[Adotante de IA] usando CodeRabbit/Copilot mas sem método para integrar"
  - "[Curioso por harness] que já leu 'Harness Engineering' e quer o lado de operação"
  - "[Crítico de revisão por IA] que duvida do valor real e quer ver o trade-off concreto"

differentiation:
  - "Modelo de três camadas (portão automático / revisão por IA / revisão humana) como espinha dorsal do livro"
  - "Integração explícita com AGENTS.md e Code Direction (a maior parte dos guias trata isso isoladamente)"
  - "Não é só CodeRabbit: cobre Copilot PR Review e Claude Code Action, com tabela de escolha"
  - "Padrão autoFixable separa o que dá para corrigir sozinho do que precisa de humano"
  - "Loop de feedback documentado: como o resultado da revisão volta ao AGENTS.md mensalmente"

pain_points:
  - "Escrevi 'use Conventional Comments' no AGENTS.md, mas o time não aplica"
  - "PRs ficam três dias parados, ninguém comenta, todo mundo aperta Approve no fim"
  - "30 minutos por semana só apontando indentação e ordem de import"
  - "Adotei CodeRabbit, mas não sei como conectar com a política do time"
  - "Tenho hooks, mas não sei o que vai em pre-commit, o que vai em pre-push, o que vai no CI"
  - "Não sei diferenciar 'a IA reclama disso, e agora?' de 'isso aqui é decisão de design'"

competitor_comparison:
  - book: "Google How to do a code review"
    difference: "Guia generalista de revisão humana. Este livro foca em sistema, com camadas automáticas + IA antes do humano."
  - book: "Documentação do CodeRabbit / Copilot"
    difference: "Documentação de tool isolada. Este livro mostra a integração: CodeRabbit + AGENTS.md + Conventional Comments + loop de feedback como um único sistema."
  - book: "Artigos sobre AI Code Review"
    difference: "Artigos cobrem a categoria. Este livro é o blueprint operacional, com YAML, workflows e exemplo end-to-end em Next.js."

related_books:
  - "harness-engineering-guide"
  - "claude-code-mastery"
  - "context-engineering"

chapters:
  - title: "Prefácio — Transformando revisão em sistema"
    free: true
  - title: "Integrando revisão de código à camada de verificação de qualidade do harness"
    free: true
    sub_chapters:
      - "O modelo de seis camadas do harness"
      - "As três subcamadas da verificação de qualidade"
      - "\"Quase sempre\" vs \"sem exceção, sempre\""
      - "Por que não impor tudo?"
      - "Visão geral da estrutura de arquivos"
  - title: "O modelo de revisão em três camadas — automática / IA / humana"
    free: true
    sub_chapters:
      - "Dividir papéis em três camadas"
      - "Primeira camada: portão automático (sem humano envolvido)"
      - "Segunda camada: revisão por IA (reconhecimento de padrões)"
      - "Terceira camada: revisão humana (julgamento e direção)"
      - "O efeito das três camadas"
      - "Fronteiras de responsabilidade entre as camadas"
      - "Quando a revisão humana não é necessária"
  - title: "Primeira camada: o portão imposto por hooks e CI"
  - title: "Segunda camada: projetando a adoção da revisão por IA"
  - title: "Terceira camada: estreitando o foco da revisão humana para design e direção"
  - title: "Escrevendo a política de revisão no AGENTS.md"
  - title: "Encaixando Conventional Comments no harness"
  - title: "Automatizando o template de PR e o checklist de revisão"
  - title: "Adoção e configuração do CodeRabbit"
  - title: "Adicionando ferramentas de revisão por IA: Copilot / Claude"
  - title: "Construindo o pipeline de revisão com GitHub Actions"
  - title: "Padrão autoFixable — automatizando correções mecânicas"
  - title: "Loop de feedback — devolvendo o resultado da revisão ao AGENTS.md"
  - title: "Medindo e melhorando as métricas de revisão"
  - title: "Exemplo de implementação: projeto de revisão com harness em Next.js + TypeScript"
  - title: "Encerramento — Revisão é o coração do harness"
  - title: "Referências"
    free: true
  - title: "Sobre o autor"
    free: true
  - title: "Colofão"
    free: true

cta_label: "Comprar no Kindle"
---

"Escreva testes antes de abrir o PR." Estava no AGENTS.md. Mesmo assim, PRs sem teste continuavam chegando.

Pedido se esquece. Regra se quebra. Mas **sistema** continua funcionando.

Este livro mostra como transformar revisão de código de "pedido" em "sistema" usando o modelo de três camadas do Harness Engineering. A primeira camada (hooks e CI) elimina 100% dos problemas mecânicos antes do PR. A segunda (CodeRabbit, Copilot ou Claude Code Action) detecta padrões. A terceira (humano) foca em design, regra de negócio e edição de direção.

São 15 capítulos práticos, com `.coderabbit.yaml`, workflows do GitHub Actions e templates prontos para copiar. O exemplo final monta a revisão com harness de um projeto Next.js + TypeScript + Prisma do zero.

> "Revisão de código é o coração do harness. Se o coração para, o corpo inteiro sente."
