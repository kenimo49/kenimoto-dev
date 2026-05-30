---
title: "Convirtiendo LLMs de Mentirosos en Expertos"
subtitle: "Ingeniería de Contexto en la Práctica"
tagline: "Ingeniería de Contexto desde cero — RAG, MCP, CLAUDE.md y Agentic RAG, con benchmarks que muestran hasta 4,6× de mejora"
description: "¿Tu IA miente con seguridad? El problema no es el modelo — es el contexto. En tres herramientas internas ficticias, este libro mide la calidad de respuesta con cinco estrategias de contexto y demuestra que un modelo pequeño con RAG bien diseñado supera a un modelo más grande operando solo. A partir de esos datos construye el sistema completo de Ingeniería de Contexto: estrategia en 5 etapas, RAG, MCP, CLAUDE.md y Agentic RAG."
lang: "es"

kindle_url: "https://www.amazon.com.mx/dp/B0H12JR228"

price: 4.99
currency: "USD"
published_date: 2026-05-09
updated_date: 2026-05-09

cover_image: "/images/books/context-engineering-es.jpg"

topics:
  - "Ingeniería de Contexto"
  - "RAG"
  - "MCP"
  - "LLM"
  - "Benchmarks"

keywords:
  - "Ingeniería de Contexto"
  - "Ingeniería de Contexto en la práctica"
  - "implementación de RAG"
  - "benchmark de RAG"
  - "servidor MCP"
  - "Model Context Protocol"
  - "alucinación de LLM"
  - "Agentic RAG"
  - "diseño de CLAUDE.md"
  - "Claude Haiku"

hero_message: "Los modelos más grandes solo mienten con más seguridad. RAG eleva la calidad de respuesta hasta 4,6x. Este libro demuestra la Ingeniería de Contexto con benchmarks originales — no con suposiciones."
series_role: "Volumen 2 de la Serie de Prácticas de IA para Ingenieros (LatAm) — entre claude-code-mastery (Vol 1) y harness-engineering-guide (Vol 3)"

outcomes:
  - "Dominar una estrategia de contexto en 5 etapas que eleva la calidad de respuesta 2,2x o más"
  - "Entender por qué RAG aporta el 80% de la mejora — y dónde está el punto de quiebre"
  - "Diseñar y operar un servidor MCP (Model Context Protocol)"
  - "Aplicar patrones de CLAUDE.md en etapas para optimizar el contexto del proyecto"
  - "Implementar Agentic RAG en Python de punta a punta"

position_statement:
  - "Benchmark-first (una diferencia de calidad de 4,6x demostrada con experimentos originales)"
  - "Especialista en Ingeniería de Contexto (eje aparte de prompts y harnesses)"
  - "Nivel intermedio (asume que ya usaste un LLM — no es cartilla de RAG)"
  - "Con código (96 archivos Python listos para producción, publicados en GitHub)"

target_readers:
  - "[Ingeniero intermedio] Buscando el paso siguiente al prompt engineering"
  - "[Evaluador de LLM] Decidiendo entre RAG y MCP con confianza"
  - "[Domador de alucinaciones] Frustrado porque incluso los modelos grandes siguen fallando"
  - "[Usuario de Claude Code] Quiere aprender el diseño de CLAUDE.md en etapas"
  - "[Constructor de agentes] Necesita implementar Agentic RAG en producción"
  - "[Movido por benchmarks] Quiere comparaciones cuantitativas entre estrategias de contexto"

differentiation:
  - "Benchmarks originales demuestran que la estrategia de contexto mueve la calidad 4,6x"
  - "Demuestra experimentalmente que los modelos más grandes mienten con más convicción, y que modelo pequeño + RAG le gana al modelo grande solo"
  - "Cubre RAG, MCP, CLAUDE.md y Agentic RAG en un único volumen coherente"
  - "96 archivos de código de calidad de producción en GitHub, totalmente reproducibles"
  - "Conecta directo con Claude Code vía diseño en etapas del CLAUDE.md"

pain_points:
  - "Los prompts están afinados, pero la calidad de respuesta sigue oscilando"
  - "El RAG está implementado, pero no se sabe si está funcionando de verdad"
  - "No puedo decidir cuándo usar servidor MCP en vez de RAG simple"
  - "Tengo CLAUDE.md en el repo, pero no está claro qué meterle dentro"
  - "Escuché de Agentic RAG, pero no sé en qué se diferencia del RAG común"
  - "Cambiar de LLM sigue moviendo la calidad de respuesta de forma impredecible"

competitor_comparison:
  - book: "Libros de prompt engineering"
    difference: "Se enfoca en la capa debajo del prompt — el diseño del contexto. Toma donde el prompt engineering termina."
  - book: "Cartillas de RAG"
    difference: "Va más allá de RAG aislado e integra RAG, MCP, CLAUDE.md y Agentic RAG en un único sistema de Ingeniería de Contexto."
  - book: "Documentación oficial de los vendors (OpenAI, Anthropic, etc.)"
    difference: "Benchmarks originales muestran cuánto cambian las cosas en realidad — cuantitativamente, no cualitativamente."

related_books:
  - "claude-code-mastery"
  - "harness-engineering-guide"

chapters:
  - title: "Introducción"
    free: true
    sub_chapters:
      - "Para ti, que abriste este libro"
      - "Lo que reveló el experimento"
      - "Cómo está organizado este libro"
      - "Sobre la \"Serie de Prácticas de IA para Ingenieros\""
      - "Para quién es este libro"
      - "Cómo leerlo"
  - title: "La misma pregunta, cinco respuestas completamente distintas"
    free: true
    sub_chapters:
      - "Una brecha de calidad de 2,2× en un experimento"
      - "PropelAuth: preguntarle a una herramienta interna ficticia"
      - "Por qué una herramienta ficticia"
      - "Lo que significa la evaluación de cuatro ejes"
      - "Por qué el mismo LLM produce 2,2× de calidad distinta"
      - "Lo que esto significa para producción"
      - "Cómo está estructurado este libro y tu ruta de aprendizaje"
  - title: "Tres razones por las que tu IA miente"
    free: true
    sub_chapters:
      - "El \"enlace de invitación de 24 horas\" de PropelAuth no existe"
      - "Razón ①: el mecanismo de \"rellenar lo plausible\" para información desconocida"
      - "Razón ②: los modelos más grandes mienten con más habilidad"
      - "Razón ③: \"Siempre responder\" se diseñó por una razón"
      - "Factual Accuracy vs Specificity: una compensación crítica"
      - "Por qué la alucinación es una \"feature\", no un \"bug\""
      - "Cinco señales de que un LLM está mintiendo"
  - title: "Los límites de la Ingeniería de Prompt, el comienzo de la Ingeniería de Contexto"
  - title: "Primer paso — Mejorando el System Prompt"
  - title: "Few-shot Examples — Mostrándole a la IA 'cómo se hace'"
  - title: "Retrieved Knowledge — Inyectando conocimiento externo con RAG [El núcleo de este libro]"
    free: true
  - title: "Ingeniería de Contexto Completa — Integrando todos los elementos"
  - title: "Tools & APIs — Conectando al mundo externo con MCP"
  - title: "State & Memory — Memoria de largo plazo y continuidad de conversación"
  - title: "Claude Code en la práctica — Diseñando contexto de proyecto con CLAUDE.md"
  - title: "Agentic RAG — Concepto y arquitectura"
  - title: "Agentic RAG — Comparación de APIs de búsqueda e implementación"
  - title: "RAG Empresarial — Casos de estudio y diseño de pipeline"
  - title: "RAG Empresarial — Evaluación, seguridad y selección de Vector DB"
  - title: "La filosofía de diseño 'modelo pequeño + buen contexto'"
  - title: "Posfacio"
  - title: "Apéndice A: Checklist de Ingeniería de Contexto"
    free: true
  - title: "Apéndice B: Cómo reproducir el experimento"
    free: true
  - title: "Referencias"
    free: true
  - title: "Sobre el autor"
    free: true

cta_label: "Comprar en Kindle"
---

La misma pregunta sigue dando respuestas completamente distintas. La causa no es tu prompt. Es tu **contexto**.

Este libro corre benchmarks originales en tres herramientas internas ficticias y muestra que la forma en que entregas contexto puede mover la calidad de respuesta hasta **4,6x**. Los modelos más grandes, al final, solo mienten con más convicción. Un modelo pequeño con RAG puede superar a un modelo grande operando solo. A partir de esos hallazgos, el libro construye el cuadro completo de la Ingeniería de Contexto.

Cinco estrategias de contexto, RAG (la técnica que aporta el 80% de la mejora), diseño de servidor MCP, diseño en etapas del CLAUDE.md e implementación de Agentic RAG. El siguiente paso después del prompt engineering — fundamentado en datos experimentales y 96 archivos de código listos para producción.

> "Los modelos más grandes solo mienten con más seguridad. Aliméntalos con la verdad a través del contexto."
