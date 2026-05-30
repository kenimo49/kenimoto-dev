---
title: "Manual completo de Knowledge Graph"
subtitle: "Estruture os dados, torne a IA mais inteligente"
description: "O RAG sozinho não deixa sua IA inteligente. Relacionamentos só aparecem com estrutura — Knowledge Graph, GraphRAG, Neo4j, RDF, Property Graph, Tree-sitter, MCP e Emotion AI. O guia prático para dar à IA a inteligência estruturada que falta ao embedding."
lang: "pt"

kindle_url: "https://www.amazon.com.br/dp/B0H3FVPXZV"

price: 24.99
currency: "BRL"
published_date: 2026-05-30
updated_date: 2026-05-30

cover_image: "/images/books/knowledge-graph-pt.jpg"

topics:
  - "Knowledge Graph"
  - "GraphRAG"
  - "Neo4j"
  - "RDF"
  - "Property Graph"

keywords:
  - "Knowledge Graph"
  - "GraphRAG"
  - "Neo4j"
  - "RAG"
  - "RDF SPARQL"
  - "revisão de código por IA"
  - "LLM contexto"
  - "Tree-sitter"
  - "Knowledge Graph Brasil"
  - "Emotion AI"

tagline: "Manual completo de Knowledge Graph | GraphRAG · Neo4j · RDF · Tree-sitter · revisão de código por IA"
hero_message: "O RAG sozinho não deixa sua IA inteligente. Relacionamentos só aparecem com estrutura. O guia prático de GraphRAG, Neo4j e Property Graphs com código que roda."
series_role: "Knowledge & Data [Especialidade] — o grafo que dá inteligência estruturada à sua IA"

outcomes:
  - "Decidir entre RDF, Property Graph e GraphRAG para cada caso de uso"
  - "Construir um Knowledge Graph real em produção com Neo4j em 7 passos"
  - "Transformar a base de código em grafo com Tree-sitter e cortar até 49x os tokens da revisão de código por IA"
  - "Desenhar o acesso da IA ao grafo via MCP"
  - "Aplicar Knowledge Graph a domínios novos como Emotion AI e PKM pessoal"

target_readers:
  - "[Engenheiro de RAG] já bateu no teto da busca vetorial e procura o próximo passo"
  - "[Desenvolvedor de agente de IA] quer estruturar relacionamentos de contexto que o embedding não captura"
  - "[Engenheiro de dados] precisa operar Neo4j / Property Graph em produção"
  - "[Tech Lead] avaliando arquitetura de IA e quando GraphRAG ganha do RAG vetorial"
  - "[Equipe de plataforma] desenhando ontologia interna para conhecimento corporativo"
  - "[Curioso por Emotion AI / PKM] quer aplicar grafos a domínios menos explorados"

position_statement:
  - "Foco em implementação (Neo4j / RDF / Tree-sitter com código que roda, não pseudocódigo)"
  - "Integração entre domínios (GraphRAG + análise de código + Emotion AI em um único livro)"
  - "Nível intermediário (Python básico e familiaridade com LLMs; não pede background acadêmico em grafos)"
  - "Para quem se formou no RAG (o próximo passo depois que a busca vetorial encontra o limite)"

differentiation:
  - "Um dos poucos livros que explica GraphRAG no nível de implementação, com código Python e queries Cypher"
  - "Comparativo direto RDF × Property Graph com 9 critérios e guia de escolha"
  - "Pipeline aberto: AST de código → Knowledge Graph via Tree-sitter, comparando 6 ferramentas (GitNexus, code-review-graph, CGC, CodeLayers, Graphify, Understand Anything)"
  - "Integração com MCP para que a IA consulte o grafo como ferramenta de primeira classe"
  - "Lente original: abordagem estruturada para Emotion AI (ATOMIC, COMET, ECoK)"

pain_points:
  - "Implementei RAG e a informação fica espalhada — a IA não consegue sintetizar resposta relacional"
  - "Comecei com Neo4j, mas o guia de design é vago e o projeto trava"
  - "Ouço falar de GraphRAG, mas não sei o que muda em relação ao RAG vetorial"
  - "Quero transformar a base de código em grafo, mas as ferramentas se misturam e perco tempo na escolha"
  - "Não consigo decidir entre RDF e Property Graph"
  - "Quero usar grafo em Emotion AI / psicologia computacional, mas faltam casos práticos"

competitor_comparison:
  - book: "Tutoriais de Neo4j"
    difference: "Não é só Neo4j. Vai até GraphRAG, análise de código e integração com MCP — o ciclo completo em vez do tool isolado."
  - book: "Introduções a RAG"
    difference: "Foca em GraphRAG — o que fazer depois que a busca vetorial bate no teto. RAG é o pré-requisito, não o destino."
  - book: "Livros de Web Semântica / RDF"
    difference: "Não é apenas acadêmico. Trade-off prático RDF × Property Graph com critérios e guia de escolha para o engenheiro."

related_books:
  - "context-engineering"
  - "claude-code-mastery"
  - "harness-engineering-guide"

related_articles: []

chapters:
  - title: "Introdução"
    free: true
    sub_chapters:
      - "Por que publicar este livro agora"
      - "Como o livro está estruturado"
      - "Para quem este livro foi escrito"
  - title: "Capítulo 1: O que é Knowledge Graph"
    free: true
    sub_chapters:
      - "Nós, arestas e triplas"
      - "Diferença em relação ao banco de dados relacional"
      - "Diferença em relação ao banco vetorial"
      - "Componentes do Knowledge Graph"
      - "Linguagem de consulta Cypher"
  - title: "Capítulo 2: Por que Knowledge Graph agora"
    free: true
    sub_chapters:
      - "O problema das \"conexões\" na era da IA generativa"
      - "Acabando com os silos de dados"
      - "Três razões para o Knowledge Graph voltar a chamar atenção"
      - "Contexto histórico do Knowledge Graph"
      - "Democratização via no-code / low-code"
  - title: "Capítulo 3: RDF vs Property Graph"
    sub_chapters:
      - "Dois modelos de dado"
      - "RDF (Resource Description Framework)"
      - "Property graph"
      - "Comparação em 9 itens"
      - "Qual escolher"
  - title: "Capítulo 4: Construindo o Knowledge Graph em 7 passos"
    sub_chapters:
      - "Hands-on com Neo4j"
      - "Definir o caso de uso, identificar fontes e desenhar a ontologia"
      - "Modelagem, ingestão e transformação de dado"
      - "Consultas, API, operação e expansão"
  - title: "Capítulo 5: A mecânica do GraphRAG"
    sub_chapters:
      - "O limite do RAG tradicional"
      - "GraphRAG da Microsoft Research"
      - "Efeitos concretos"
      - "Os trade-offs do GraphRAG"
  - title: "Capítulo 6: Adoção do GraphRAG na empresa"
    sub_chapters:
      - "O problema do conhecimento corporativo"
      - "Framework de adoção em 4 passos da NTT East"
      - "Caso: avaliação de risco contratual na NTT Data"
      - "Caso: KG + RAG no suporte ao cliente do LinkedIn"
      - "Cuidados na adoção"
  - title: "Capítulo 7: Casos práticos de LLM × KG"
    sub_chapters:
      - "A complementaridade entre LLM e KG"
      - "Extração automática de relação empresarial"
      - "Mapeamento de conhecimento tácito na Meta"
      - "Conversão automática de texto para Cypher"
      - "Q&A baseada em evidência"
      - "Padrões de arquitetura LLM × KG"
  - title: "Capítulo 8: Entender código por grafo"
    sub_chapters:
      - "A base de código é um grafo gigante"
      - "Extração de estrutura com Tree-sitter AST"
      - "Análise de Blast Radius (escopo de impacto)"
      - "Design de nó e aresta do KG de código"
      - "Arquitetura de processamento em duas passadas"
  - title: "Capítulo 9: Comparativo de ferramentas de KG de código"
    sub_chapters:
      - "Comparando seis ferramentas"
      - "GitNexus / code-review-graph / CodeGraphContext"
      - "CodeLayers / Graphify / Understand Anything"
      - "Guia de escolha"
  - title: "Capítulo 10: Integração com MCP e revisão de código por IA"
    sub_chapters:
      - "O que é MCP"
      - "Fluxo de trabalho com KG de código + MCP"
      - "Lista das ferramentas MCP"
      - "Caso prático: otimizar a revisão de PR (corte de até 49x em tokens)"
      - "Integração com GitHub Action"
  - title: "Capítulo 11: Knowledge Graph de senso comum emocional"
    sub_chapters:
      - "Estruturar emoção como \"conhecimento\""
      - "ATOMIC: base da inferência de senso comum"
      - "COMET: o LLM que gera o conhecimento do ATOMIC"
      - "ECoK: o KG integrado de senso comum emocional"
      - "Áreas de aplicação do KG emocional"
  - title: "Capítulo 12: Inferência emocional em diálogo"
    sub_chapters:
      - "ERC: reconhecimento emocional dentro da conversa"
      - "Arquitetura do modelo CEICG"
      - "Resultado do benchmark"
      - "Predição versus reconhecimento emocional"
      - "O valor que o Knowledge Graph traz para a inferência emocional"
  - title: "Capítulo 13: Uso de Knowledge Graph na empresa"
  - title: "Capítulo 14: Knowledge Graph pessoal (PKM)"
  - title: "Capítulo 15: O futuro do Knowledge Graph"
  - title: "Epílogo — \"Pensar em grafo\" como nova arma"
    free: true

cta_label: "Comprar no Kindle"
---

Busca vetorial entrega à IA conhecimento, não relacionamento. "A Alice se reporta ao Bob, que toca o projeto C" é um fato de grafo, não um fato de vetor. Por isso o RAG sozinho responde "o quê" e trava em qualquer pergunta sobre "como se conecta".

Este livro é o guia de campo para dar à IA essa **inteligência estruturada**: Neo4j, RDF, Property Graphs, GraphRAG da Microsoft Research, Tree-sitter para AST de código, integração via MCP e até Emotion AI. Tudo convertido em padrões prontos para entrar em produção.

> "Dados ficam inteligentes não como vetores, mas como grafos."
