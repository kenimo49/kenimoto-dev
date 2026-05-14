---
free: true
title: "Prefacio — Por qué 'Harness' y por qué ahora"
---

![Un harness — los aparejos que controlan la fuerza de la IA](/images/books/harness-engineering-guide/harness-horse.jpg)

## Un martes a las 3 a. m.

Las 3 a. m. de un martes. Al ingeniero on-call de un equipo lo despierta sobresaltado una alerta de PagerDuty.

Los costos de API se dispararon. Revisa el panel: más de $400 gastados en la última hora. Al investigar, encuentra que un agente de IA implementado el día anterior estuvo machacando una API inestable con reintentos. Cada error lo manda de vuelta al ciclo de "déjame intentar otra vez", y siguió así hasta la mañana.

El agente no era el problema. El modelo estaba bien. El prompt estaba escrito con cuidado. Lo que faltaba era un **harness**. Le dijeron al agente "ejecuta", pero nunca le dieron frenos ni volante.

Esta historia no es rara. Hay una frase que circula en el sector:

> **"The model is commodity. The harness is moat."**

Cuando un agente que funcionaba perfecto en una demo se rompe en producción, casi siempre es un problema de harness.

En febrero de 2026, OpenAI publicó una publicación en su blog: "Harness engineering: leveraging Codex in an agent-first world".

Esto fue lo que decía: durante cinco meses, un equipo de ingeniería no escribió una sola línea de código a mano. Construyeron una aplicación en producción de más de un millón de líneas usando solo agentes Codex. Tiempo de construcción: una décima parte de hacerlo a mano.

"Humans steer. Agents execute."

Los ingenieros no perdieron su trabajo. La definición del trabajo cambió.

Esa publicación encendió la mecha. Después vino el reporte de la "tormenta de reintentos de $47.000" de un fin de semana de febrero de 2026. Un agente de enriquecimiento de datos malinterpretó un código de error de API como "reintenta con parámetros diferentes" e hizo 2,3 millones de llamadas a la API. El lunes por la mañana, los ingenieros volvieron a una factura de $47.000. Está bien que el agente haya trabajado el fin de semana, pero no tanto cuando el entregable es cero y la factura llega igual. Unos días después, Anthropic publicó dos guías de diseño de harness. LangChain definió "Agent = Model + Harness". Martin Fowler escribió un comentario. Un artículo académico apareció en arXiv.

2024 fue el año de la Ingeniería de Prompt. La era de pulir "qué preguntarle a la IA".

2025 fue el año de la Ingeniería de Contexto. Andrej Karpathy dijo "The hottest new programming language is English", y el trabajo se movió a diseñar "qué mostrarle a la IA".

En 2026, el alcance se amplía a Harness Engineering. "¿Cómo diseñas todo el entorno en el que opera el agente?"

Pero el término se interpreta un poco distinto según quién lo escriba. OpenAI y Anthropic enfatizan cosas distintas. LangChain y Martin Fowler lo abordan desde ángulos distintos. Los artículos académicos vienen desde otra dirección.

Este libro da una visión estructurada de Harness Engineering.

- La relación entre las tres prácticas de ingeniería (Prompt / Contexto / Harness)
- Cómo los actores principales (OpenAI / Anthropic / LangChain / Martin Fowler / académicos) lo interpretan distinto
- La anatomía de los seis componentes
- Cómo se sitúa junto a ideas relacionadas (Vibe Coding / Spec Coding / Agent Frameworks)
- Estudios de caso prácticos de la comunidad de habla japonesa
- Hacia dónde va todo esto

Es a la vez un libro de organización conceptual y una guía práctica que puedes usar mañana. Mi objetivo es simple: cuando alguien pregunte "ok, pero ¿qué *es* un harness?", puedas darle este libro como una respuesta clara.

## Para quién es este libro

- Ingenieros que empezaron a usar agentes de IA (Claude Code, GitHub Copilot, Cursor, etc.)
- Personas que escribieron un AGENTS.md o CLAUDE.md y no están seguras de haberlo hecho bien
- Personas que conocen la Ingeniería de Prompt y escuchan "Harness Engineering" por primera vez
- Líderes técnicos y gerentes que quieren llevar agentes de IA a su equipo

El único prerrequisito es lo básico de Ingeniería de Prompt. Haber oído hablar de Few-shot y Chain-of-Thought es suficiente.

## Cómo leer este libro

Puedes leerlo de tapa a tapa, o saltar a los capítulos que te interesen. Aun así, hay tres capítulos que vale la pena leer pase lo que pase:

- **Capítulo 1**: entender cómo se relacionan las tres prácticas de ingeniería (el mapa del territorio)
- **Capítulo 8**: aprender los seis componentes (el esqueleto de la práctica)
- **Capítulo 11**: aprender a escribir AGENTS.md (algo que puedes usar mañana)
