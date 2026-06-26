---
title: "Las 5 preguntas que separan Prompt Engineering de Context Engineering (con ejemplos en Claude Code)"
description: "Si no sabes responder estas 5 preguntas antes de mandar el prompt, el modelo va a inventar y te va a sonar convincente. Aquí están las 5, con ejemplos reproducibles en Claude Code y un benchmark interno con diferencia 2,2x de calidad."
date: 2026-06-26
lang: es
tags: ["context-engineering", "prompt-engineering", "claude-code", "agentes-ia"]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/5-preguntas-context-vs-prompt-engineering-claude-code"
og_image: "https://kenimoto.dev/images/blog/5-preguntas-context-vs-prompt-engineering-claude-code/og-es.png"
cross_posted_to: []
---

Hace un año, cuando alguien me pedía consejo sobre cómo sacarle más a Claude o a Cursor, mi respuesta era "escribe mejor los prompts." Hoy, esa respuesta me da un poco de vergüenza. No porque estuviera mal, sino porque era incompleta de una manera importante. El prompt es la cosa más visible del problema, pero casi nunca es la cosa que más mueve la aguja.

Lo que mueve la aguja es lo que el modelo ve **antes** de tu prompt: el archivo CLAUDE.md, los ejemplos en la carpeta, el historial de commits, las definiciones de tool, los documentos que pegaste, la memoria de la sesión anterior. A todo eso junto se le llama context, y diseñarlo es un trabajo distinto de redactar un prompt. Esa diferencia tiene un nombre en 2026: **context engineering**.

Este post es la versión que me hubiera gustado leer hace un año. Cinco preguntas que te ayudan a saber, antes de apretar enter, si lo que estás haciendo es prompt engineering o context engineering, y por qué eso importa cuando el modelo te devuelve algo que suena bien pero está mal.

![Comparación lado a lado del mismo prompt enviado con cinco estrategias distintas de contexto, con la puntuación total subiendo de 5,3 a 11,4 sobre 20](/images/blog/5-preguntas-context-vs-prompt-engineering-claude-code/og-es.png)

## El benchmark interno que me hizo cambiar de opinión

En 2025 corrí un experimento sencillo en mi blog. Hice una herramienta interna ficticia llamada PropelAuth (no existe, es un nombre inventado a propósito para que el modelo no la conozca por entrenamiento) y le pregunté a Claude Sonnet 4 la misma pregunta cinco veces, cambiando solo cómo le pasaba el contexto.

Evalué cuatro ejes con escala de 0 a 5: precisión factual, resistencia a alucinaciones, especificidad, honestidad. Total sobre 20.

| Estrategia de contexto | Precisión | Anti-alucinación | Especificidad | Honestidad | Total |
|---|---|---|---|---|---|
| Sin contexto | 0,6 | 0,3 | 4,2 | 0,2 | **5,3** |
| Solo system prompt | 0,0 | 3,5 | 1,7 | 3,7 | **8,8** |
| System + few-shot | 0,0 | 5,0 | 0,0 | 5,0 | **10,0** |
| System + RAG | 4,6 | 0,8 | 4,5 | 0,3 | **10,2** |
| Contexto completo | 4,8 | 1,0 | 4,8 | 0,8 | **11,4** |

Diferencia 2,2x entre el peor y el mejor, con el mismo modelo y la misma pregunta. Cuando lo repetí con Claude Haiku 3, la diferencia fue **4,6x**. El modelo "barato" con buen contexto le ganó al modelo "caro" sin contexto. Eso me cambió la cabeza.

La fila de "sin contexto" es la que más me incomoda. El modelo da una respuesta detallada, con pasos numerados, con plazos específicos ("invitaciones por email con validez de 24 horas"), y todo es inventado porque PropelAuth no existe. La especificidad sube cuando la honestidad baja. Es lo opuesto de lo que queremos.

Las 5 preguntas que siguen están diseñadas para que puedas evitar la fila de arriba.

## Pregunta 1: ¿Quién es la audiencia y cuál es el rol?

Si tu prompt empieza con "explica" o "escribe," el modelo va a elegir un nivel de detalle por defecto que probablemente no sea el tuyo. Eso casi nunca es lo que quieres.

Mal:

```text
Explica cómo funciona la autenticación con JWT.
```

Mejor:

```text
Vas a ser un mentor que explica a un desarrollador junior con 6 meses
de Node.js. La explicación tiene que asumir que entiende async/await
pero no sabe qué es una firma criptográfica. Máximo 200 palabras y
tiene que terminar con un ejemplo de código que el junior pueda pegar
en un proyecto Express existente.
```

La diferencia no es la cantidad de palabras del prompt. Es que en el segundo definiste audiencia, nivel previo de conocimiento, formato y límite. El modelo deja de adivinar.

En Claude Code, esta pregunta se resuelve principalmente en **CLAUDE.md**. Si tu CLAUDE.md dice "este proyecto lo mantienen 3 personas, todas con experiencia en TypeScript pero ninguna en Rust," cada sesión de Claude arranca sabiendo a quién le está hablando, y no tienes que repetirlo en cada prompt.

## Pregunta 2: ¿Cuál es el criterio de éxito?

Esta es la que más se salta la gente, incluido yo. "Hazlo bien" no es un criterio. El modelo necesita saber qué validas tú después.

Mal:

```text
Refactoriza esta función para que sea más limpia.
```

Mejor:

```text
Refactoriza esta función con estos criterios, en este orden:
1. La función pública mantiene la misma firma.
2. Las pruebas existentes en tests/auth.test.ts siguen pasando.
3. Cada función interna tiene una sola responsabilidad y máximo 20 líneas.
4. No agregar dependencias nuevas.
Si no puedes cumplir alguno, dímelo antes de tocar el código.
```

Aquí pasaron tres cosas. Definiste el éxito en pasos verificables. Pediste explícitamente que el modelo te avise si no puede cumplirlos en vez de hacer algo a medias. Y le diste un orden de prioridad, que es lo que el modelo necesita para resolver conflictos por sí mismo.

En Claude Code, este criterio suele ir en el **system prompt de la skill** que estás usando. Si tienes una skill `/refactor`, su descripción debería incluir estos criterios para que no los tengas que escribir cada vez.

## Pregunta 3: ¿Qué restricciones tiene que respetar?

El modelo no sabe qué cosas en tu proyecto son inocentes y cuáles son trampas explosivas. Las restricciones son tu forma de marcar el campo minado.

Las que más uso:

- **Archivos que no se tocan.** Migraciones SQL ya ejecutadas, archivos de configuración con secretos, archivos generados.
- **APIs que no se cambian.** Funciones exportadas que otros equipos consumen.
- **Patrones que no se usan.** "No agregar `any` en TypeScript," "no agregar comentarios excepto en funciones públicas," "no escribir try/catch que solo loguea y re-lanza."
- **Dependencias que no se agregan.** Si tu equipo decidió no usar Lodash, el modelo necesita saberlo.

En Claude Code, las restricciones van en **CLAUDE.md y en la sección "no toques" de tu AGENTS.md**. Mi regla es: cada vez que el agente hace algo que me hace decir "no, no era eso," voy y agrego una línea de restricción para que la próxima sesión no repita el error. La calidad de mi AGENTS.md es básicamente un registro de las cosas que el modelo arruinó antes.

Una restricción concreta que cambió mi vida: "Si el cambio toca más de 3 archivos, muéstrame el plan antes de modificar nada." Eso solo bajó mis sesiones de "espera, qué hiciste" a casi cero.

## Pregunta 4: ¿Cuáles son los ejemplos correctos del estilo que quieres?

El modelo aprende mucho más rápido por ejemplo que por descripción. Si dices "escríbelo al estilo de mi código," el modelo no tiene idea de cuál es tu estilo. Si pegas 2 ejemplos de funciones que ya escribiste, lo aprende en segundos.

El benchmark de arriba lo mostró numéricamente: agregar **few-shot examples** llevó la resistencia a alucinaciones de 3,5 a 5,0 y la honestidad de 3,7 a 5,0. El precio fue que la especificidad cayó porque sin información factual real, el modelo se volvió ultracauteloso. Por eso few-shot sin RAG es la mitad de la receta.

En Claude Code, los ejemplos viven en tres lugares:

- **Archivos referenciados desde CLAUDE.md**: "Para el estilo de los handlers, mira `src/handlers/auth.ts`."
- **La carpeta que el modelo está editando**: si la mitad de los archivos siguen un patrón, el modelo lo imita. Esto es a favor y en contra: si tu repo tiene un estilo viejo abandonado, el modelo lo va a copiar.
- **Tu skill markdown**: las skills de Claude Code tienen un campo donde puedes poner ejemplos de input/output que se inyectan automáticamente.

Una pauta útil: si vas a escribir una skill o un CLAUDE.md, dedica la mitad del espacio a ejemplos concretos y la otra mitad a reglas. El balance entre "qué hacer" y "cómo se ve cuando está bien hecho" es lo que separa una skill buena de una que solo agrega ruido.

## Pregunta 5: ¿Qué información factual tiene que tener disponible?

Esta es la que cambia el juego cuando el dominio es específico. Si la pregunta involucra algo que el modelo no aprendió por entrenamiento (un producto interno, una API privada, datos de tus usuarios), y no se lo das, va a inventar. Va a sonar bien y va a estar mal.

En mi benchmark, agregar **RAG** (recuperación de documentación real) subió la precisión factual de 0,6 a 4,6. Casi 8x. Esa es la diferencia entre un asistente que te ayuda y uno que te crea trabajo extra de verificación.

En Claude Code la información factual entra por:

- **Lectura directa de archivos**: el modelo lee tu código antes de modificarlo. Pero solo si se lo dices o si la skill lo automatiza.
- **MCP servers**: si conectas Claude a un servidor MCP que expone tu base de datos, tu Notion o tu Linear, el modelo puede traer la información factual al momento.
- **Pegado manual**: para cosas one-shot, copiar la documentación relevante al prompt sigue siendo lo más simple.

El error común aquí es asumir que el modelo "ya sabe" sobre tu producto porque te respondió convincentemente la última vez. No sabe. Solo estaba interpolando bien. Si quieres respuestas factualmente correctas, el modelo necesita ver los hechos en su contexto. Punto.

## Cómo se ve esto junto en Claude Code

Si las 5 preguntas se responden correctamente en un mismo proyecto, la sesión típica de Claude Code se ve así:

```text
~/proyecto $ claude
[lee CLAUDE.md → audiencia, criterio, restricciones]
[lee src/ → ejemplos de estilo]
[skill activa → criterios específicos de refactor]
[MCP conectado → puede consultar la DB]
```

Y tu prompt deja de tener que cargar todo. Pasa de:

```text
Eres un dev senior, refactoriza esta función con criterio X, Y, Z,
no toques los archivos A, B, C, sigue el estilo de auth.ts, y por
favor consulta la tabla users para entender los campos reales...
```

A:

```text
Refactoriza la función authenticate() en src/auth.ts.
```

Toda la carga de contexto que antes vivía en el prompt ahora vive en archivos. El prompt vuelve a ser la cosa simple que tiene que ser. Eso es context engineering en una frase: **mover el conocimiento del prompt al ambiente.**

La gente que en 2026 está [reemplazando prompt engineering por context engineering](https://www.aiforanything.io/blog/claude-prompt-engineering-context-engineering-guide-2026) en su flujo de Claude lo dice más o menos así: el prompt es lo que la sesión necesita en el momento, el contexto es lo que el proyecto necesita siempre. Si tu equipo escribe el mismo párrafo de instrucciones en cada prompt, ese párrafo debería vivir en CLAUDE.md, no en tu memoria muscular.

## Cuándo prompt engineering sigue siendo lo correcto

No quiero dar la impresión equivocada. Prompt engineering no está muerto. Hay tres casos donde sigue siendo lo apropiado:

**Uno**: estás haciendo una pregunta única, sin proyecto detrás. "¿Cuál es la diferencia entre debounce y throttle?" no necesita CLAUDE.md.

**Dos**: estás explorando, no ejecutando. Cuando el objetivo es ver opciones, un prompt bien escrito y abierto funciona mejor que un contexto cerrado.

**Tres**: estás escribiendo el prompt que va a vivir dentro de tu skill. Ahí estás escribiendo prompt engineering como entrada para context engineering. El prompt está dentro del archivo de skill, y la skill se carga en cada sesión. Es prompt engineering al servicio de context engineering.

La frase corta es: si lo que estás haciendo se repite, es contexto. Si es único, es prompt. La mayoría de los equipos que conozco tienen el balance al revés porque empezaron en 2023 cuando el contexto todavía no existía como práctica.

## La pregunta cero, que es la más incómoda

Hay una pregunta antes de las 5 que casi nadie hace en voz alta: **¿tienes idea de qué información existe en tu proyecto?**

La mitad de los problemas que veo cuando alguien me dice "Claude inventa cosas" se resuelven cuando descubrimos que tienen tres archivos de documentación contradictorios, dos READMEs que se desactualizaron en 2024, y un CLAUDE.md generado automáticamente que nadie revisó. El modelo está leyendo todo eso como si fuera la verdad y mezclándolo en cada respuesta.

Antes de optimizar prompts, mira qué hay en tu repo. Si hay 5 documentos que dicen cosas distintas sobre el mismo módulo, el problema no es el prompt. Es el contexto contaminado. Y el contexto contaminado se ve igual que un contexto bueno desde afuera. Esa es la trampa.

Una buena pregunta de control: si tú, persona, abres tu repo en cold start y tienes que entender qué hace un módulo, ¿en qué archivo miras primero? Si no puedes contestar eso, el modelo tampoco puede. Si lo tienes claro, ese archivo es el que CLAUDE.md tiene que referenciar.

Las 5 preguntas son útiles. La pregunta cero te dice si vale la pena hacerlas.

Yo todavía me equivoco con esto. La semana pasada perdí una hora pidiéndole a Claude que generara un test de integración y obtuve cuatro versiones razonables que no funcionaban con mi base. Cuando paré y miré, descubrí que mi `tests/setup.ts` tenía dos versiones contradictorias por un merge mal resuelto del mes anterior. El modelo no estaba siendo tonto. Estaba siendo coherente con un ambiente roto. Lo arreglé en `setup.ts`, repetí el prompt, salió bien al primer intento.

A veces el peor enemigo del modelo no es el modelo. Es lo que tú le pusiste alrededor sin querer.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
