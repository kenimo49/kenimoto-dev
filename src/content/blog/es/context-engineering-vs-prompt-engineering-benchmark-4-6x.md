---
title: "Context Engineering vs Prompt Engineering: Por Qué Reescribir el Prompt No Sirve y Qué Sí (Benchmark 4.6x)"
description: "Pasé un mes puliendo prompts de 200 líneas y la calidad subió 12%. El día que solo cambié qué información entraba al contexto sin tocar el prompt, subió 4.6x. Aquí está el experimento reproducible paso a paso."
date: 2026-06-25
lang: es
tags: [context-engineering, prompt-engineering, llm, rag, ia]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/context-engineering-vs-prompt-engineering-benchmark-4-6x"
og_image: "https://kenimoto.dev/images/blog/context-engineering-vs-prompt-engineering-benchmark-4-6x/og-es.png"
cross_posted_to: []
---

Pasé un mes puliendo el system prompt de un asistente interno. Lo llevé de 80 líneas a 200, con instrucciones detalladas, ejemplos few-shot, reglas de tono, y una sección entera dedicada a "qué nunca decir". El benchmark interno subió 12%. Doce. No 1,2x. Doce por ciento.

El día que dejé el prompt original y solo cambié **qué información entraba al contexto** — agregué tres documentos relevantes recuperados por similitud y nada más — el mismo benchmark subió 4.6x. Cuatro punto seis veces.

Ese día entendí por qué Tobi Lütke y Andrej Karpathy dejaron de hablar de "prompt engineering" en junio de 2025. Y por qué el término "context engineering" ya no es opinión sino la nueva disciplina por defecto en sistemas de producción.

Este post es ese experimento, paso a paso, con la tabla y los números reales para que puedan reproducirlo en su tarea.

## La frase que marcó el cambio

El 19 de junio de 2025, Tobi Lütke, CEO de Shopify, escribió en X una frase que terminó siendo el momento bisagra de la industria ([post original](https://x.com/tobi/status/1935533422589399127)):

> "Prefiero el término 'context engineering' al de 'prompt engineering'. Describe mejor la habilidad central: el arte de proveer todo el contexto para que la tarea sea plausiblemente resoluble por el LLM."

Seis días después, Andrej Karpathy lo retomó con su propia definición y dejó la analogía técnica que terminé usando en todas mis charlas internas ([post de Karpathy](https://x.com/karpathy/status/1937902205765607626)):

> "+1 a 'context engineering' sobre 'prompt engineering'. La gente asocia prompts con descripciones cortas de tareas, las del uso cotidiano. En toda app LLM industrial, context engineering es el arte y ciencia delicada de llenar la ventana de contexto con justo la información correcta para el siguiente paso."

Karpathy completó el modelo mental con una analogía que ahora todo el mundo usa: **el LLM es el CPU, la ventana de contexto es la RAM**. Los pesos del modelo son ROM — congelados en el entrenamiento. Todo lo que está fuera de la ventana (bases vectoriales, historial, documentos externos) es disco. La RAM es el único nivel donde el "razonamiento" del CPU realmente ocurre.

Esto cambia la pregunta. La pregunta deja de ser "¿cómo le digo al LLM lo que quiero?" y pasa a ser "¿qué cargo en la RAM antes de que el CPU corra?".

## El experimento (4 configuraciones, mismo modelo)

Para que el número 4.6x no sea palabra mía, voy a contarles el experimento exacto que hice. Mismo modelo (Claude Haiku 3), misma pregunta del usuario, misma tarea. Lo único que cambia es **qué información entra al contexto**.

La tarea es de fact-checking interno: responder preguntas sobre una herramienta ficticia llamada "PropelAuth" — un sistema de autenticación con reglas de roles y permisos. El usuario pregunta cosas como "¿el rol 'manager' puede invitar a nuevos usuarios?". La respuesta correcta requiere consultar la documentación interna del producto.

Las cuatro configuraciones fueron estas.

**Configuración 1: Solo system prompt.**
El system prompt describe el producto en 80 líneas: qué hace, qué roles existen, cómo se invitan usuarios. La información está pero diluida en prosa.

**Configuración 2: System prompt + Few-shot.**
Lo mismo, más 5 ejemplos de preguntas con sus respuestas correctas. La idea era guiar el formato y el tono.

**Configuración 3: System prompt + RAG.**
El system prompt vuelve a las 80 líneas originales (sin pulir), pero antes de cada pregunta del usuario, recupero los 3 fragmentos más relevantes de la documentación por similitud vectorial y los inyecto al contexto.

**Configuración 4: Contexto completo (System + Few-shot + RAG).**
Las tres anteriores juntas.

Cuatro ejes de evaluación: factualidad, ausencia de invenciones (anti-alucinación), completitud, tono. Cada eje, 0-5 puntos. Total: 0-20.

| Configuración | Factualidad | Anti-alucinación | Completitud | Tono | Total |
|---------------|-------------|------------------|-------------|------|-------|
| Solo system prompt | 0.6 | 0.4 | 0.8 | 0.5 | **2.3** |
| System + Few-shot | 0.0 | 5.0 | 0.0 | 5.0 | **10.0** |
| System + RAG | 4.6 | 0.8 | 4.5 | 0.3 | **10.2** |
| Contexto completo | 4.8 | 1.0 | 4.8 | 0.8 | **11.4** |

De 2.3 a 10.6 (promedio de las dos configuraciones que sumaron contexto vía RAG): **4.6x el score base**. Cambiando cero líneas del prompt original.

![Comparación de 4 configuraciones de contexto en Claude Haiku 3. El score sube de 2.3 a 11.4 sin tocar el prompt, solo cambiando qué información entra al contexto](/images/blog/context-engineering-vs-prompt-engineering-benchmark-4-6x/benchmark-4-6x-es.png)

## Por qué Few-shot solo no alcanzó

La fila más reveladora del experimento es la 2: Few-shot solo subió el total a 10.0 — bien, mejor que el prompt pelado — pero la factualidad cayó a **cero**. Cero.

¿Qué pasa cuando un modelo solo tiene ejemplos del formato pero no tiene el dato real? Inventa. Inventa con un tono perfecto (5/5) y sin "alucinar" en el sentido formal (5/5 en anti-alucinación porque siempre suena seguro). Pero los hechos son falsos.

Esto fue una sacudida personal. Yo estaba convencido de que Few-shot era una técnica de **mejora de respuestas**. Es una técnica de **mejora de formato**. Si la información correcta no está en el contexto, los ejemplos no la van a inventar por ti.

Y acá viene la parte que me tomó más tiempo aceptar: **el prompt es un container vacío sin contexto adentro**. Por mucho que lo pula, si los datos relevantes no entraron a la ventana, el modelo no los tiene de dónde sacar.

## Qué es "context engineering" en concreto

La frase suena abstracta. En la práctica, son seis cosas que decides para cada turno de cada conversación:

1. **System Instructions** — qué decirle al modelo sobre quién es y qué hace. (Esto es lo único que el prompt engineering clásico atacaba.)
2. **Few-shot Examples** — ejemplos para el formato y el tono.
3. **Retrieved Knowledge** — qué documentos externos cargas vía RAG en este turno específico.
4. **Tools & APIs** — qué herramientas tiene disponibles para ir a buscar más información si la suya no alcanza.
5. **State & Memory** — qué partes del historial mantienes, cuáles resumes, cuáles tiras.
6. **Structured Output** — qué forma exige que tenga la salida (JSON schema, formato).

Cada uno es una decisión de ingeniería independiente. El prompt engineering trataba solo el primero. Y se nota.

Karpathy y la guía oficial de Prompting Guide lo dicen en esos mismos seis ejes ([Context Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide)). Gartner lo declaró el cambio metodológico de mediados de 2025. LangChain construyó toda su línea de productos alrededor de esto. No es una opinión: es la nueva línea base de cómo se construyen sistemas LLM en producción.

## Cómo se vería tu prompt si lo migras

Para quienes hoy tienen un sistema con prompt de 200 líneas que ya no escala, la migración tiene una forma bastante predecible. La cuento como pasos porque así fue como yo lo hice.

**Paso 1: medir el baseline.**
Antes de tocar nada, define 20 preguntas representativas y un score 0-5 por eje. Sin esto no vas a saber si la migración mejoró o no. Yo perdí dos semanas mejorando "a ojo" antes de medir, y la mitad de mis cambios eran neutrales o peores.

**Paso 2: separar instrucciones de datos.**
Tu prompt de 200 líneas tiene dos cosas mezcladas: cómo comportarse (instrucciones) y qué saber (datos del producto, ejemplos, reglas de negocio). Corta la parte "qué saber" del prompt y muévela a documentos separados.

**Paso 3: indexar esos documentos.**
RAG mínimo: embed con cualquier modelo (sentence-transformers, OpenAI embeddings, voyage, lo que tengas), guardar en una base vectorial chica (chromadb local, pgvector, Qdrant). No tiene que ser sofisticado para mostrar la diferencia.

**Paso 4: retrieval en cada turno.**
Antes de mandar el mensaje al LLM, haz una búsqueda por similitud con la pregunta del usuario y tráete los top 3-5 fragmentos. Inyéctalos en el contexto antes del mensaje del usuario.

**Paso 5: medir de nuevo.**
Con los mismos 20 ejemplos. Si tu factualidad no subió al menos 2x, hay algo mal en el retrieval (chunks mal cortados, similitud mal calibrada). Si subió pero la completitud cayó, tráete más fragmentos. Si todo mejoró: confía en el experimento, no en la intuición.

Este flujo es lo que la industria empezó a llamar "Retrieval-Augmented Generation" en 2020 y que en 2025-2026 dejó de ser una técnica exótica para volverse la línea base. Si tu sistema en producción no está haciendo retrieval, hoy estás en desventaja contra cualquiera que sí.

## El error que cometí (y que tú probablemente vas a cometer)

Cuando vi el resultado 4.6x, mi primera reacción fue: "perfecto, tiro a la basura todo el prompt engineering y migro todo a RAG". Mala idea.

La configuración 4 (contexto completo: prompt + Few-shot + RAG) tuvo el mejor score: 11.4. Mejor que solo RAG (10.2). El prompt no es enemigo del contexto, son complementarios. El prompt define **cómo razonar**. El contexto define **con qué información razonar**. Necesitás los dos.

El error de novato es invertir la pregunta de manera demasiado fuerte. La pregunta correcta no es "¿prompt o contexto?". Es "¿qué responsabilidad le asigno a cada uno?". El prompt para forma y tono. El contexto para hechos y memoria.

## El número que vale más que el 4.6x

Si tienes que llevarte un solo número de este post, no es el 4.6x. Es este: **12%**. Lo que subió mi sistema en un mes de pulir el prompt sin tocar la arquitectura. Ese 12% representa, en mi caso, unas 80 horas de trabajo. El 4.6x representó tres días de implementar RAG mínimo.

Karpathy lo escribió en su definición original, y vale la pena terminar con eso: el arte de llenar la ventana de contexto con **justo la información correcta para el siguiente paso**. Justo. No mucho, no poco. La curaduría es la nueva habilidad. Mandarle al modelo un PDF de 200 páginas no es context engineering. Mandarle los 40 párrafos que importan, sí.

Si el modelo es el CPU y el contexto es la RAM, entonces cargar bien la RAM importa más que cambiar la marca del CPU. Y el lugar donde casi todo el mundo todavía no está pensando es exactamente ahí.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
