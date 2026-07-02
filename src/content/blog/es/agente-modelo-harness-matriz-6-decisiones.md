---
title: "Agente = Modelo + Harness: la matriz de 6 decisiones para elegir donde invertir tu tiempo"
description: "Seis decisiones técnicas separan un agente productivo de uno lento. En cuatro de las seis, el harness pesa más que el modelo. Matriz práctica para saber dónde invertir horas de ingeniería."
date: 2026-07-02
lang: es
tags: [agentes-ia, claude-code, harness, langchain, arquitectura]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/agente-modelo-harness-matriz-6-decisiones/"
og_image: "https://kenimoto.dev/images/blog/agente-modelo-harness-matriz-6-decisiones/og-es.png"
cross_posted_to: []
---

En 2024, cuando alguien decía "mi agente de IA no funciona bien", la primera pregunta era "¿qué modelo usas?". En 2026 la primera pregunta es otra: "¿qué harness le pusiste?".

El cambio de pregunta refleja una ecuación que la comunidad de agentes empezó a repetir a principios de 2026:

> **Agente = Modelo + Harness**

Yo la vi por primera vez en un [artículo de LangChain](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness) donde muestran que cambiar el harness dejando el modelo igual mueve a un agente de resultados promedio a resultados de primer nivel. Anthropic llegó a la misma conclusión en su documento sobre [harnesses efectivos para agentes de larga duración](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). Dos empresas que compiten en modelos, coincidiendo en que el modelo no es lo decisivo.

Si lo tomas en serio, cambia la manera en que gastas tu tiempo. La mayoría de las horas de ingeniería que yo veía dedicar a "afinar el prompt" en realidad iban al lugar equivocado. Este post es la matriz que uso yo, con seis decisiones técnicas y una respuesta simple para cada una: **¿el modelo pesa más aquí, o pesa más el harness?**.

## Qué llamo Modelo y qué llamo Harness

Antes de la matriz, dos definiciones para que no discutamos por vocabulario.

**Modelo** es el LLM. Claude 4.6 Sonnet, GPT-5, Gemini 2.5 Pro. Lo que Anthropic, OpenAI o Google entrenaron. Tú no lo cambias por dentro. Lo eliges y ya.

**Harness** es todo lo demás: el bucle que llama al modelo, la memoria que le pasas, las herramientas que expones, los prompts del sistema, los hooks que interceptan sus acciones, los sub-agentes que coordinas, el presupuesto de tokens que impones. En palabras del [artículo de LangChain](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness), el harness es "toda la infraestructura de software que envuelve al LLM: el bucle de orquestación, las herramientas, la memoria, el manejo de contexto, la persistencia de estado, el manejo de errores y los guardrails".

Con esas dos definiciones, ahora la matriz.

## La matriz de 6 decisiones

| # | Decisión | ¿Modelo o Harness manda? | Por qué |
|---|---|---|---|
| 1 | Elección de herramientas (tools) | **Harness** | Tú decides qué expones. El modelo solo puede usar lo que tú permitas. |
| 2 | Gestión de memoria | **Harness** | El modelo tiene ventana de contexto. Qué le entra y qué le sale es decisión del harness. |
| 3 | Prompt del sistema | **Modelo + Harness (empate)** | El texto lo escribes tú, pero cómo lo interpreta depende del modelo. |
| 4 | Hooks y validaciones | **Harness** | El modelo no sabe qué es "aceptable" en tu proyecto. El hook sí. |
| 5 | Coordinación de sub-agentes | **Harness** | Un modelo no decide "ahora llamo a otro modelo". Ese loop es tuyo. |
| 6 | Presupuesto de tokens | **Modelo + Harness (matizado)** | El costo por token lo pone el modelo, pero cuántos gastas lo gobiernas tú. |

**Cuatro de las seis decisiones son de harness. Una empatada. Solo una tiene al modelo con voz completa**. Si estás gastando el 80% de tu tiempo probando modelos distintos y el 20% en el harness, tienes la proporción invertida.

Vamos una por una.

## Decisión 1: qué herramientas expones (Harness)

Es la decisión más subestimada. Yo veo equipos que enchufan Claude Code o Cursor con "todas las herramientas disponibles" y después se preguntan por qué el agente se distrae ejecutando cosas irrelevantes.

Cada herramienta que expones es una tentación para el modelo. Un modelo bueno tiene 30 herramientas y elige la correcta el 80% de las veces. Un modelo excelente con 5 herramientas curadas elige la correcta el 98% de las veces. La diferencia no vino del modelo, vino de cortar la lista.

Regla práctica que uso: **empieza con 3 herramientas, agrega solo cuando fallas por falta de una**. No al revés.

## Decisión 2: qué le entra a la ventana de contexto (Harness)

Los modelos modernos tienen ventanas grandes (200k tokens en Claude 4.6 Sonnet, 1M en Gemini 2.5 Pro). Eso invita a llenarlas. Es una invitación a perder.

Un agente con 180k tokens de contexto responde peor que el mismo agente con 40k tokens curados. El fenómeno tiene nombre: *context rot*. El modelo pierde precisión cuando la señal se diluye en ruido. Con más de 100k tokens de conversación, la precisión de recuperación cae entre 15% y 30% en la mayoría de los benchmarks que he visto.

Aquí manda el harness. Tú decides qué archivos lees, qué resúmenes generas, qué historial descartas. El modelo no puede pedir "olvídate de los últimos 10 turnos". Tú tienes que hacer el olvido por él.

## Decisión 3: el prompt del sistema (empate)

Este es el único empate real. El texto lo escribes tú, pero **el mismo prompt no rinde igual en dos modelos distintos**.

Un prompt que le funciona a Claude 4.6 Sonnet le puede fallar a GPT-5, y viceversa. El modelo trae su sesgo de entrenamiento. Anthropic entrena con formato XML en las instrucciones. OpenAI entrena con formato JSON y listas numeradas. Pásale a Claude un prompt hiperestructurado en JSON y lo va a seguir menos que si le pasas el mismo contenido envuelto en tags XML.

Por eso digo empate. La estructura la eliges tú, pero la eficacia depende del modelo. Cuando cambies de modelo, no des por sentado que el prompt se transfiere igual. Yo mantengo prompts distintos para Claude y para Cursor (que usa Claude por defecto en el backend, pero encima le pone su propia capa) porque los dos digieren las instrucciones de forma diferente.

## Decisión 4: hooks y validaciones (Harness)

Un hook es código tuyo que se ejecuta antes o después de que el agente use una herramienta. El agente propone `git push --force`, tu hook lo intercepta y responde "no en main, elige otro comando".

El modelo no sabe qué es aceptable en tu repo. No conoce tu convención de commits, no sabe que tu equipo usa `staging` en vez de `develop`, no sabe que en tu proyecto los archivos `.env` no se leen nunca. Todo eso lo pone el harness.

Es aquí donde Claude Code y Cursor se separan más. Claude Code tiene un sistema de hooks documentado en `~/.claude/settings.json` que se ejecutan como comandos shell independientes. Cursor está evolucionando hacia algo parecido con sus reglas de proyecto, pero todavía no está tan cerrado.

Si tu equipo empieza con agentes en 2026 y no invierte en hooks, va a repetir todos los incidentes que ya ocurrieron en 2025. No hay atajo.

## Decisión 5: coordinación de sub-agentes (Harness)

Un solo modelo, por muy bueno que sea, tiene un contexto único. Cuando le pides que arregle un bug complejo, ese contexto se llena de código, logs, hipótesis, intentos fallidos. En algún punto, saturarlo cuesta más que dividirlo.

Aquí entra el patrón que Anthropic llama *multi-agent orchestration*: un agente principal delega tareas a sub-agentes, cada uno con su propio contexto limpio. En su [evaluación interna](https://www.anthropic.com/engineering/multi-agent-research-system) reportaron que el sistema multi-agente superó al agente único en 90.2%.

El punto: **decidir cuándo delegar y cuándo mantener el contexto único es una decisión que corresponde al harness**. El modelo no sabe cuándo está saturado. Tú tienes que medir, orquestar, terminar el sub-agente cuando devuelva algo útil, y consolidar el resultado.

## Decisión 6: presupuesto de tokens (Modelo + Harness matizado)

El precio por token lo fija el proveedor. Claude 4.6 Sonnet cuesta lo que cuesta. Ahí no hay palanca.

Lo que sí gobierna el harness es **cuántos tokens gastas por tarea**. Y las palancas son varias: prompt caching, ventanas contextuales cortas, resúmenes intermedios, sub-agentes con Haiku para tareas simples y Sonnet solo para las difíciles.

Un patrón que veo funcionar: **Supervisor con modelo grande (Sonnet/Opus), workers con modelo pequeño (Haiku)**. El supervisor decide qué hacer, los workers ejecutan. La calidad de la decisión final se mantiene y el costo baja entre 3 y 8 veces. Lo describen bien los equipos de LangChain con el patrón *supervisor* en LangGraph.

## Cómo aplicar la matriz esta semana

Si te llevas una cosa de este post, que sea esto: **audita en qué gastaste tu última semana de ingeniería agente**. Escribe en un papel qué porcentaje fue a probar modelos y qué porcentaje fue a las 6 decisiones de arriba.

Si probar modelos fue más del 20%, tienes espacio para reasignar. La mayoría de las mejoras que buscas en el modelo están en el harness, esperándote. Cambiar de Sonnet a Opus te da quizás 5% de mejora en calidad. Reducir el contexto de 180k a 40k curados te puede dar 20%. Añadir 3 hooks bien pensados te puede dar la diferencia entre un agente que funciona en demos y uno que funciona en producción.

Yo empecé a hacer esta auditoría cada dos semanas, con un simple `grep` de mi historial de commits: cuántos tocaron `settings.json`, `hooks/`, `agents/`, `CLAUDE.md`; cuántos tocaron la configuración del modelo. Cuando el segundo número crece mucho, sé que estoy perdiendo el foco.

La ecuación completa es "modelo + harness", con el harness llevando la voz mayor en cuatro de las seis decisiones importantes. Elegir bien dónde invertir tu tiempo empieza por saber cuál columna estás mirando.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
