---
title: "Los 6 componentes de un harness de agente IA: audita tu CLAUDE.md en 10 minutos"
description: "Si tu agente falla y solo cambias el modelo, estás tocando 1 de 6 piezas. Te muestro la lista completa y cómo revisar tu CLAUDE.md/AGENTS.md hoy mismo sin reescribirlo."
date: 2026-06-28
lang: es
tags: [claude-code, harness-engineering, ai-agent, agents-md]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/6-componentes-harness-auditar-claude-md-10-minutos"
og_image: "https://kenimoto.dev/images/blog/6-componentes-harness-auditar-claude-md-10-minutos/og-es.png"
cross_posted_to: []
---

La primera vez que un colega me pidió ayuda con su agente que "no funcionaba bien," abrí su repositorio y encontré exactamente un archivo de configuración: el `system_prompt`. Cuando le pregunté por el `AGENTS.md` o el `CLAUDE.md`, me miró como si le hubiera hablado en japonés (que es lo que le pasa siempre, en realidad).

El problema no era el modelo. Tampoco era el prompt. El problema era que su agente tenía **1 de 6 componentes** que debería tener un harness mínimamente serio, y los otros 5 estaban funcionando "por defecto" — que es otra forma de decir "por accidente."

Si tu agente está fallando y tu primera reacción es cambiar de modelo, este artículo es para ti. Te paso la lista completa y un checklist de 10 minutos para auditar tu propio `CLAUDE.md`/`AGENTS.md` hoy mismo, sin necesidad de reescribir nada.

![Los 6 componentes del harness de un agente](/images/blog/6-componentes-harness-auditar-claude-md-10-minutos/6-componentes-harness.png)

## Qué es realmente un "harness"

El término viene del mundo de los agentes IA y se popularizó en 2026 cuando OpenAI publicó su experimento de **1 millón de líneas de código en 5 meses con Codex**. La conclusión del post: lo que decidió el resultado no fue el modelo, fue el sistema construido a su alrededor — el **harness**.

La fórmula que LangChain dejó en una línea:

> **Agent = Model + Harness**

El modelo aporta la inteligencia. El harness convierte esa inteligencia en algo útil. Y aquí está el dato incómodo que muchas veces ignoramos: LangChain demostró que **con el mismo modelo, mejorando solo el harness, la precisión subió de 52,8% a 66,5%**. Trece puntos sin tocar el modelo.

Si solo cambias el modelo cuando tu agente falla, estás operando en una de las 2 variables de la ecuación.

## Los 6 componentes (taxonomía Next Signal Prediction)

La organización más limpia que he visto del harness es la taxonomía de 6 módulos publicada por Next Signal Prediction en su artículo "Decode the Buzzword."

### ① Gestión de información

La capa que controla **qué sabe el agente**.

- `AGENTS.md` / `CLAUDE.md` — el índice del proyecto
- Archivos de skills — pasos concretos para cada tarea
- RAG — búsqueda e inyección de conocimiento externo
- Memoria — lo que el agente aprendió en sesiones anteriores

Aquí vive el principio de Anthropic: "usa un prompt diferente para la primera ventana de contexto."

### ② Ejecución

La capa que conduce las acciones del agente.

- Descomposición de tareas (dividir trabajo grande en pasos)
- Orquestación (controlar el orden de ejecución)
- Ejecución paralela (lanzar tareas independientes en paralelo)
- Retry (lógica de reintento ante fallos)
- Timeout (prevenir bucles infinitos)

LangGraph de LangChain opera en esta capa.

### ③ Verificación de calidad

La capa que **revisa la salida** del agente antes de aceptarla.

- Linters / formatters (forzar estilo de código)
- Verificación de tipos (TypeScript strict y similares)
- Ejecución de pruebas
- LLM-as-judge (otro LLM evalúa la calidad)
- autoFix (reparación automática de problemas mecánicos)

Sin esta capa estás pidiéndole al agente que se evalúe a sí mismo, que es básicamente igual a pedirle al conductor borracho que se aplique a sí mismo el alcoholímetro.

### ④ Trazabilidad y observabilidad

La capa que hace **visible el comportamiento** del agente.

- Logs de ejecución (qué se hizo y en qué orden)
- Uso de tokens (rastrear el costo de API)
- Tiempo de ejecución de cada paso
- Logs de error (registrar fallos y trazar causas)
- LangSmith / Arize AI como herramientas dedicadas

Si no tienes esto, vas a seguir creyendo que el problema es "el modelo," porque no tienes evidencia de qué falló realmente.

### ⑤ Frontera de seguridad

La capa que **confina las acciones** del agente a un rango seguro.

- `allowedTools` (restringe qué herramientas puede usar)
- Límites de acceso al filesystem (qué directorios puede leer/escribir)
- Límites de acceso a red (qué APIs externas puede llamar)
- Ejecución en sandbox (entorno de ejecución aislado)
- Puertas de aprobación humana (para operaciones críticas)

QubitTool llama a esto "frontera de seguridad del agente." Si no la defines, la frontera es "lo que sea que el modelo decida hoy."

### ⑥ Definiciones de herramientas

La capa que **da capacidades** al agente.

- Definiciones de funciones (schemas de funciones invocables)
- Acceso a APIs (integraciones con servicios externos)
- MCP (Model Context Protocol) como estándar de tooling
- Operaciones de archivo (permisos de lectura/escritura/creación/borrado)

La calidad de tus definiciones de herramientas determina directamente la precisión de las invocaciones del agente. Descripciones vagas causan invocaciones erradas. "Pásame esa herramienta" — ¿era un martillo o un destornillador? Si la descripción es descuidada, el agente también elige descuidado.

## El checklist de 10 minutos para tu CLAUDE.md/AGENTS.md

Abre tu archivo y responde estas preguntas con **sí / no / no aplica**. No reescribas nada todavía. Solo audita.

**Minuto 1-2 — Gestión de información (①)**

- [ ] ¿Hay un objetivo claro del proyecto en las primeras 10 líneas?
- [ ] ¿Las restricciones duras están limitadas a 5-7 máximo? (Si tienes 30, el agente deja de leer)
- [ ] ¿Está claro qué archivos NO debe tocar el agente?

**Minuto 3-4 — Ejecución (②)**

- [ ] ¿Hay instrucciones sobre cómo descomponer una tarea grande?
- [ ] ¿Hay timeout configurado en algún lugar (o al menos mencionado)?
- [ ] ¿Hay reglas sobre cuándo reintentar y cuándo abandonar?

**Minuto 5-6 — Verificación de calidad (③)**

- [ ] ¿Dice qué comandos ejecutar antes de cada commit? (linter, tipos, pruebas)
- [ ] ¿Está prohibido el `--no-verify` explícitamente?
- [ ] ¿Hay alguna mención a auto-revisar la salida antes de mostrarla?

**Minuto 7 — Trazabilidad (④)**

- [ ] ¿Hay instrucciones sobre qué loguear?
- [ ] ¿Está claro dónde van los logs / cómo verlos después?

**Minuto 8 — Frontera de seguridad (⑤)**

- [ ] ¿Está la lista de herramientas permitidas explícita? (no asumida)
- [ ] ¿Hay operaciones que requieren confirmación humana?

**Minuto 9 — Definiciones de herramientas (⑥)**

- [ ] ¿Cada herramienta importante tiene descripción de cuándo usarla?
- [ ] ¿Está claro qué NO hace cada herramienta?

**Minuto 10 — Síntesis**

Cuenta los **sí**. Si tienes menos de 8 sobre 14, no es un problema de modelo. Es un problema de harness. Antes de pagar por el próximo upgrade de Claude o GPT, llena los huecos.

## Trampas comunes al rellenar los huecos

Una vez que tienes el resultado del checklist, lo más común es querer escribir un `CLAUDE.md` de 800 líneas para cubrir todo. **No lo hagas.** Tres errores que veo siempre:

1. **Inflar el archivo.** Mantén 5-7 restricciones duras en el archivo principal. El resto va a archivos de skill referenciables. Un `CLAUDE.md` que parece biblia, el agente lo deja de leer (irónicamente, lo trata como contexto de bajo valor).

2. **Asumir simetría entre `AGENTS.md` y `CLAUDE.md`.** No son lo mismo. `AGENTS.md` es el estándar emergente cross-harness; `CLAUDE.md` es la versión específica de Claude Code. La recomendación que se está consolidando: **`AGENTS.md` como archivo canónico, `CLAUDE.md` como espejo de compatibilidad** cuando ambos existen. Mantener los dos sincronizados a mano es una fuente de bugs.

3. **Pensar que el harness es un evento, no un proceso.** Lo escribes una vez y lo dejas ahí. Mal. Cada vez que actualices el modelo del agente, hay que re-auditar este checklist. MindStudio publicó hace poco una checklist específica de "5 preguntas antes de cada actualización de modelo" — exactamente porque cambiar el modelo sin re-validar el harness es la fuente número uno de regresiones silenciosas.

## El cierre incómodo

Si tu reacción al ver este checklist es "uf, voy a guardarlo para más tarde," es exactamente la reacción que tu equipo tendrá ante el harness en general. Y tres meses después seguirás cambiando de modelo cada vez que el agente falle.

10 minutos. Esa es la inversión. Después de eso ya sabes si tu agente está fallando por el modelo o por el otro 5/6 del sistema. Es una diferencia que cambia dónde gastas las siguientes 10 horas — y las siguientes 10 horas suelen valer más que el upgrade de modelo del trimestre.

## Resumen

- Agent = Model + Harness. Tocar solo el modelo es operar 1 de 2 variables
- El harness se descompone en 6 componentes: información / ejecución / calidad / trazabilidad / seguridad / herramientas
- LangChain demostró: mismo modelo + mejor harness = +13,7 puntos de precisión
- El checklist de 10 minutos audita tu `CLAUDE.md`/`AGENTS.md` sin reescribir nada
- Mantén 5-7 restricciones duras máximo; usa `AGENTS.md` como canónico y `CLAUDE.md` como espejo
- Re-audita el harness cada vez que cambies de modelo, no solo cuando algo se rompa

Audita primero. Reescribe después. Cambia de modelo al final, no al principio.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
