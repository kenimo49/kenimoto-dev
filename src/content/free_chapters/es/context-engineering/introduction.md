---
free: true
title: "Introducción"
---

# Introducción

## Para ti, que abriste este libro

**En resumen: este libro es una guía práctica para obtener la mejor calidad posible de un LLM mediante el diseño del contexto.**

"Le pregunté algo a ChatGPT y respondió con total seguridad. Después lo verifiqué y era todo mentira."

¿Te ha pasado?

El protagonista de este libro es el LLM. Imagínalo como un recién contratado brillante en su primer día. Cero conocimiento del sector, pero lleno de confianza. Dale el material de onboarding correcto y se vuelve un colaborador inmediato.

:::message
**Analogía del nuevo integrante**: imagina que un recién graduado de una universidad top aparece en su primer día. Le preguntas "¿puedes explicarme nuestros sistemas internos?" y responde con principios generales e intuición. Es agudo y aprende rápido. Solo que aún no sabe nada sobre *esta* empresa.
:::

Si empezaste a usar LLMs en el trabajo, seguramente te topaste con este problema. Ajustas el prompt, defines un rol, agregas "responde con precisión". Y la IA sigue mintiendo con confianza.

Este libro nació de un experimento que enfrentó ese problema de frente.

## Lo que reveló el experimento

**En resumen: lo que determina la calidad de las respuestas de un LLM es el diseño del contexto, no el tamaño del modelo.**

Para investigar cómo se comporta la IA frente a "información que no puede saber", construí tres herramientas internas ficticias y medí la calidad de las respuestas con cinco estrategias de contexto diferentes.

Los resultados fueron contundentes.

- Sin **ningún contexto**, la IA devolvió "respuestas plausibles pero totalmente fabricadas"
- Con **RAG (Retrieval-Augmented Generation)** al incorporar documentación, la precisión factual pasó de **cero a 4,8**
- El hallazgo más sorprendente: **un modelo más pequeño con buen contexto (puntaje 11,8) aplastó a un modelo más grande sin contexto (puntaje 5,3)**

Lo que decide la calidad de salida de un LLM no es el tamaño del modelo ni la astucia del prompt. Es **el diseño del contexto**.

La disciplina de diseñar ese contexto de forma sistemática es la **Ingeniería de Contexto**.

---

## Cómo está organizado este libro

El libro se divide en tres partes.

**Parte 1, "Lo que cambia cuando cambia el contexto" (Capítulos 1-4)**, recorre los resultados experimentales y explica por qué hace falta la Ingeniería de Contexto. El Capítulo 4 incluye un ejercicio práctico que mejora un System Prompt directamente. La idea es sentir el efecto con tus propias manos antes de profundizar en la teoría.

**Parte 2, "Cinco técnicas, en capas" (Capítulos 5-9)**, cubre una a una las técnicas que componen la Ingeniería de Contexto: few-shot, RAG, MCP, memoria, etc. Cada capítulo enlaza con los datos experimentales para que veas "si agrego esta técnica, ¿cómo cambia el puntaje?", así evalúas costo-beneficio mientras lees.

**Parte 3, "Ingeniería de Contexto en el campo" (Capítulos 10-15)**, presenta patrones del mundo real: diseño de CLAUDE.md para Claude Code, implementación de Agentic RAG, adopción en empresas y más.

Cada capítulo termina con una **🚀 Próxima acción**: algo concreto para hacer justo después de leer. El objetivo no es asentir y seguir adelante. Es dejarte con algo para probar mañana.

## Sobre la "Serie de Prácticas de IA para Ingenieros"

Este es el volumen 2 de la "Serie de Prácticas de IA para Ingenieros".

- **Volumen 1: *Practical Claude Code***. La práctica de la programación asistida por IA.
- **Volumen 2: *Ingeniería de Contexto*** (este libro). Cómo lograr que la IA piense correctamente.

Lo que comparten los libros: **todo está fundamentado en lo que el autor aprendió haciendo el trabajo de verdad**. Los datos experimentales aquí son datos primarios de llamadas reales a la API, no citas de teoría.

**Este libro es independiente. Puedes leerlo sin haber leído el volumen 1.**

## Para quién es este libro

- Ingenieros que empezaron a usar LLMs en el trabajo
- Equipos que implementaron RAG y no están satisfechos con la precisión
- Desarrolladores que construyen agentes de IA
- Quienes se pregunten "¿qué viene después del prompting?"

Los únicos requisitos previos son Python básico y conocimiento básico de APIs. No necesitas familiaridad profunda con el funcionamiento interno de los LLMs.

## Cómo leerlo

Recomiendo leerlo en orden, pero aquí van algunos atajos:

- **Solo quieres el resumen** → Capítulo 1 y Capítulo 13
- **Quieres mejorar RAG** → Capítulo 6 y Capítulo 7
- **Quieres usar Claude Code bien** → Capítulo 10
- **Estás considerando adopción empresarial** → Capítulo 12 (a y b)

Con eso, entremos al mundo de la Ingeniería de Contexto.
