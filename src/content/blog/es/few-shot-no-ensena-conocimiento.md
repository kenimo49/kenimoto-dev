---
title: "Few-shot no le enseña conocimiento a tu LLM: le enseña a decir \"no lo sé\""
description: "El error más común con few-shot prompting es creer que le inyectas conocimiento al modelo. No es así. Few-shot controla el formato, el tono y la actitud frente a la incertidumbre. En un experimento, la honestidad subió de 3,7 a 5,0 y la precisión factual se quedó en cero. Te explico qué hace de verdad y cuándo usarlo."
date: 2026-06-07
lang: es
tags: [prompting, few-shot, llm, ingenieria-de-contexto, alucinaciones]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/few-shot-no-ensena-conocimiento/"
og_image: "https://kenimoto.dev/images/blog/few-shot-no-ensena-conocimiento/og-es.png"
cross_posted_to: []
---

Te lo digo de entrada para ahorrarte semanas de frustración: **few-shot prompting no le enseña hechos nuevos a tu modelo.** Si le pegas tres ejemplos con datos correctos esperando que "aprenda" ese conocimiento, vas a perder el tiempo. Lo que few-shot sí hace es otra cosa, más sutil y honestamente más útil: le enseña al modelo a comportarse, incluso a admitir cuando no sabe algo.

Yo tardé en entender esto. Durante un tiempo metía ejemplos en el prompt pensando que estaba "rellenando" la cabeza del modelo con información. El modelo seguía inventando datos con la misma seguridad de siempre. La diferencia es que ahora inventaba con un formato más bonito.

## Qué es few-shot, sin el malentendido

Few-shot prompting es simplemente mostrarle al modelo unos pocos ejemplos de "una buena respuesta" antes de hacerle tu pregunta real. Como cuando entrenas a alguien nuevo en el equipo: no le explicas con palabras cómo se escribe el reporte semanal, le muestras tres reportes anteriores y al cuarto ya lo copia solo. La estructura, el tono, el largo: todo lo absorbe del ejemplo.

El punto que casi nadie dice en voz alta es este: el modelo copia la *forma* del ejemplo, no su *contenido*. Si tus ejemplos son educados, el modelo será educado. Si tus ejemplos admiten cuando no saben algo, el modelo aprende a admitirlo. Pero el dato factual de tu ejemplo no se queda guardado como conocimiento. Few-shot le da forma a la actitud; la base de datos del modelo queda igual que antes.

## El experimento que me cambió la cabeza

En un experimento que documenté con Claude Sonnet 4, comparé el modelo con solo un system prompt contra el mismo modelo con ejemplos few-shot agregados. Mira lo que pasó con dos métricas:

| Métrica | Solo system | System + few-shot |
|------|-------------|-------------------|
| Honestidad | 3,7 | 5,0 |
| Precisión factual | 0,0 | 0,0 |

La honestidad subió de 3,7 a 5,0. Un salto enorme. ¿Y la precisión factual? Se quedó clavada en cero. Cero antes, cero después.

Eso es todo el argumento en dos filas. Los ejemplos no le agregaron ni un solo hecho correcto al modelo. Lo único que cambiaron fue su disposición a decir "no tengo esa información, te recomiendo verificar en la fuente oficial" en lugar de inventar una respuesta con cara de seguridad.

Hubo un detalle que me pareció hermoso: la métrica de "especificidad" *bajó* de 1,7 a 0,0. Al principio parece un empeoramiento. No lo es. El modelo dejó de dar detalles específicos inventados. Cuando no sabía, dejó de adornar. Bajar la especificidad falsa es exactamente lo que uno quiere.

![Comparación de dos métricas: honestidad sube de 3,7 a 5,0 con few-shot, mientras la precisión factual se queda en cero](/images/blog/few-shot-no-ensena-conocimiento/og-es.png)

## Por qué esto importa más en 2026

Esto no es un detalle de laboratorio. La investigación reciente apunta a que la tendencia a alucinar es una propiedad estructural del modelo, no algo que arreglas con mejores prompts. El entrenamiento premia adivinar con seguridad por encima de admitir incertidumbre, así que el modelo aprende a farolear. Ningún prompt, por más astuto, cambia el incentivo de fondo.

¿Qué significa esto en la práctica? Que tienes que separar dos problemas que la gente mezcla todo el tiempo:

- **¿Necesitas que el modelo sepa algo que no está en sus datos?** Eso es un problema de conocimiento. Se resuelve con RAG: le das los documentos en el momento, recuperados desde tu base. No con few-shot.
- **¿Necesitas que el modelo responda con cierto formato, tono, o que admita cuando no sabe?** Eso es un problema de comportamiento. Ahí few-shot brilla.

Confundir los dos es la causa número uno de prompts que no funcionan. Le pides a few-shot que haga el trabajo de RAG, y te frustras porque el modelo sigue sin saber lo que tú sí sabes.

## Cómo lo uso en la práctica

Algunas reglas que me sirvieron, todas aprendidas pisando el palito:

**Pocos ejemplos, bien elegidos.** Más no es mejor. Uno a tres ejemplos suelen alcanzar. Con tres ejemplos coherentes, el formato queda fijo. Pasar de ahí solo infla el contexto y te cuesta más tokens sin mejorar el resultado.

**Incluye un caso de "no sé".** Si quieres que el modelo admita ignorancia, tiene que ver un ejemplo donde la respuesta correcta es admitirla. Suena obvio, pero casi nadie lo hace. Algo así:

```text
P: ¿Cuál es la política de reembolso?
R: No tengo la información actualizada de la política de reembolso.
   Te recomiendo revisar los términos vigentes o contactar a soporte,
   para no darte un dato desactualizado.
```

Ese único ejemplo le enseña al modelo que "no lo sé" es una respuesta válida y deseable.

**Cuida la diversidad.** Si todos tus ejemplos son del mismo tipo, amplificas ese sesgo. Mezcla un caso normal, un caso de error, un caso límite. El modelo aprende el rango, no un solo punto.

**No metas datos sensibles en los ejemplos.** El modelo va a imitar el patrón. Si un ejemplo muestra una contraseña en texto plano, no te sorprendas cuando el modelo "ayude" filtrando una.

## Lo que me llevo

Para mí, few-shot se volvió una herramienta para *dirigir* al modelo, más que para enseñarle. El conocimiento lo pongo con RAG. El formato y la honestidad los pongo con few-shot. Esa división de tareas es, para mí, el primer paso real de la ingeniería de contexto.

Y la parte que más me gusta es la menos técnica: el mayor valor de few-shot no es que el modelo suene más inteligente, sino que aprenda a decir "no lo sé" cuando de verdad no sabe. En una era donde los modelos farolean con una sonrisa, enseñarles humildad resultó ser la habilidad más cara de todas.

Si manejas español y trabajas con LLMs, ese único cambio (mostrar un ejemplo de "no lo sé") probablemente sea la mejora con mejor relación esfuerzo-resultado que puedes hacer hoy.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
