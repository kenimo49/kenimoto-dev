---
title: "Transformando LLMs de Mentirosos em Especialistas"
subtitle: "Engenharia de Contexto na Prática"
description: "A mesma pergunta dá respostas diferentes — o problema é o contexto, não o prompt. Benchmarks originais mostram ganho de até 4,6× em qualidade. O sistema completo de Engenharia de Contexto: 5 estágios, RAG, MCP, CLAUDE.md, Agentic RAG."
lang: "pt"

kindle_url: "https://www.amazon.com.br/dp/B0H12378CJ"

price: 19.99
currency: "BRL"
published_date: 2026-05-08
updated_date: 2026-05-08

cover_image: "/images/books/context-engineering-pt.jpg"

topics:
  - "Engenharia de Contexto"
  - "RAG"
  - "MCP"
  - "LLM"
  - "Benchmarks"

keywords:
  - "Engenharia de Contexto"
  - "Engenharia de Contexto na prática"
  - "implementação de RAG"
  - "benchmark de RAG"
  - "servidor MCP"
  - "Model Context Protocol"
  - "alucinação de LLM"
  - "Agentic RAG"
  - "design de CLAUDE.md"
  - "Claude Haiku"

tagline: "Engenharia de Contexto na Prática | RAG · MCP · CLAUDE.md · Agentic RAG, com benchmarks de ponta a ponta"
hero_message: "Modelos maiores apenas mentem com mais confiança. RAG eleva a qualidade da resposta em até 4,6x. Este livro prova a Engenharia de Contexto com benchmarks originais — não com achismo."
series_role: "Volume 2 da Série de Práticas de IA para Engenheiros (BR) — entre claude-code-mastery (Vol 1) e harness-engineering-guide (Vol 3)"

outcomes:
  - "Dominar uma estratégia de contexto em 5 estágios que eleva a qualidade da resposta em 2,2x ou mais"
  - "Entender por que o RAG responde por 80% do ganho — e onde fica o ponto de virada"
  - "Desenhar e operar um servidor MCP (Model Context Protocol)"
  - "Aplicar padrões de CLAUDE.md em estágios para otimizar o contexto do projeto"
  - "Implementar Agentic RAG em Python de ponta a ponta"

position_statement:
  - "Benchmark-first (uma diferença de qualidade de 4,6x comprovada por experimentos originais)"
  - "Especialista em Engenharia de Contexto (eixo separado de prompts e harnesses)"
  - "Nível intermediário (assume que você já usou um LLM — não é cartilha de RAG)"
  - "Com código (96 arquivos Python prontos para produção, publicados no GitHub)"

target_readers:
  - "[Engenheiro intermediário] Procurando o passo seguinte ao prompt engineering"
  - "[Avaliador de LLM] Tentando escolher entre RAG e MCP com confiança"
  - "[Domador de alucinações] Frustrado porque mesmo modelos grandes ainda erram"
  - "[Usuário de Claude Code] Quer aprender o design de CLAUDE.md em estágios"
  - "[Construtor de agentes] Precisa implementar Agentic RAG em produção"
  - "[Movido a benchmark] Quer comparações quantitativas entre estratégias de contexto"

differentiation:
  - "Benchmarks originais provam que a estratégia de contexto move a qualidade em 4,6x"
  - "Demonstra experimentalmente que modelos maiores mentem com mais convicção, e que modelo pequeno + RAG bate modelo grande sozinho"
  - "Cobre RAG, MCP, CLAUDE.md e Agentic RAG em um único volume coerente"
  - "96 arquivos de código de qualidade de produção no GitHub, totalmente reproduzíveis"
  - "Conecta diretamente com o Claude Code via design em estágios do CLAUDE.md"

pain_points:
  - "Os prompts estão afinados, mas a qualidade da resposta ainda balança"
  - "O RAG está implementado, mas não dá para saber se está funcionando de verdade"
  - "Não consigo decidir quando usar servidor MCP em vez de RAG simples"
  - "O CLAUDE.md está no repositório, mas não está claro o que colocar dentro"
  - "Já ouvi falar de Agentic RAG, mas não sei como difere do RAG comum"
  - "Trocar de LLM continua mudando a qualidade da resposta de forma imprevisível"

competitor_comparison:
  - book: "Livros de prompt engineering"
    difference: "Foca a camada abaixo do prompt — o desenho do contexto. Pega onde o prompt engineering termina."
  - book: "Cartilhas de RAG"
    difference: "Vai além do RAG isolado e integra RAG, MCP, CLAUDE.md e Agentic RAG em um único sistema de Engenharia de Contexto."
  - book: "Documentação oficial dos vendors (OpenAI, Anthropic, etc.)"
    difference: "Benchmarks originais mostram quanto as coisas realmente mudam — quantitativamente, não qualitativamente."

related_books:
  - "claude-code-mastery"
  - "harness-engineering-guide"

chapters:
  - title: "Introdução"
    free: true
  - title: "Mesma Pergunta, Cinco Respostas Completamente Diferentes"
    free: true
  - title: "Três Razões Pelas Quais sua IA Mente"
    free: true
  - title: "Os Limites da Engenharia de Prompt, o Início da Engenharia de Contexto"
  - title: "Primeiro Passo — Melhorando o System Prompt"
  - title: "Few-shot Examples — Mostrando à IA 'Como se Faz'"
  - title: "Retrieved Knowledge — Injetando Conhecimento Externo com RAG [O Núcleo Deste Livro]"
    free: true
  - title: "Engenharia de Contexto Completa — Integrando Todos os Elementos"
  - title: "Tools & APIs — Conectando ao Mundo Externo com MCP"
  - title: "State & Memory — Memória de Longo Prazo e Continuidade da Conversa"
  - title: "Claude Code na Prática — Desenhando Contexto de Projeto com CLAUDE.md"
  - title: "Agentic RAG — Conceito e Arquitetura"
  - title: "Agentic RAG — Comparação de APIs de busca e Implementação"
  - title: "RAG Enterprise — Estudos de Caso e Design de Pipeline"
  - title: "RAG Enterprise — Avaliação, Segurança e Seleção de Vector DB"
  - title: "A Filosofia de Design 'Modelo Pequeno + Bom Contexto'"
  - title: "Posfácio"
  - title: "Apêndice A: Checklist de Engenharia de Contexto"
    free: true
  - title: "Apêndice B: Como Reproduzir o Experimento"
    free: true
  - title: "Referências"
    free: true
  - title: "Sobre o autor"
    free: true

cta_label: "Comprar no Kindle"
---

A mesma pergunta segue dando respostas completamente diferentes. A causa não é o seu prompt. É o seu **contexto**.

Este livro roda benchmarks originais em três ferramentas internas fictícias e mostra que a forma como você fornece contexto pode mover a qualidade da resposta em até **4,6x**. Modelos maiores, no fim das contas, apenas mentem com mais convicção. Um modelo pequeno com RAG pode superar um modelo grande operando sozinho. A partir desses achados, o livro constrói o quadro completo da Engenharia de Contexto.

Cinco estratégias de contexto, RAG (a técnica que responde por 80% do ganho), design de servidor MCP, design em estágios do CLAUDE.md e implementação de Agentic RAG. O próximo passo depois do prompt engineering — fundamentado em dados experimentais e em 96 arquivos de código prontos para produção.

> "Modelos maiores apenas mentem com mais confiança. Então alimente-os com a verdade através do contexto."
