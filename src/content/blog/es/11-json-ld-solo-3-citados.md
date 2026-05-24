---
title: "Agregué 11 schemas JSON-LD a mi blog. Tres meses después, solo 3 aparecieron en las citas de IA."
description: "Hace 3 meses metí 11 schemas JSON-LD en el <head> de mi sitio. Medí cada cita por IA desde entonces. Ocho de los once fueron peso muerto. Solo tres cargaron el camión. Cuáles funcionaron, cuáles no, y qué haría diferente."
date: 2026-05-25
lang: es
tags: [llmo, json-ld, schema-org, ai-search, geo]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/11-json-ld-solo-3-citados/"
og_image: "https://kenimoto.dev/images/blog/11-json-ld-solo-3-citados/og-es.png"
cross_posted_to: []
---

Hace tres meses pasé una tarde agregando 11 schemas JSON-LD al `<head>` de mi sitio. Organization, WebSite, Person, cuatro bloques de Service, dos de Book, MusicGroup, FAQPage. Me sentí muy bien conmigo mismo.

Después medí qué hacían los motores de IA con eso.

Tres de los once aparecieron en citas. Los otros ocho podrían haber sido comentarios HTML y daba lo mismo.

Esta es la historia de la medición. Cuáles tres schemas se ganaron su lugar, cuáles ocho fueron peso muerto, y por qué lo implementaría igual otra vez — pero más chico.

![Los 11 schemas que implementé, con los 3 que realmente aparecieron en las citas por IA destacados](/images/blog/11-json-ld-solo-3-citados/schemas-ranking.png)

## Qué implementé y por qué pensé que iba a funcionar

La implementación en sí fue directa. Empaqueté los 11 schemas en un solo array dentro de un `<script type="application/ld+json">` en mi layout de Astro, con render del lado del servidor en cada página. Mi razonamiento parecía sólido en su momento:

- Más señales estructuradas = más chances de ser citado
- Los LLMs supuestamente aman `knowsAbout`, así que Person iba a ser el arma secreta
- Los bloques Service le iban a decir a la IA exactamente qué vendo
- Los bloques Book iban a sacar a flote mis publicaciones
- Hasta MusicGroup se ganó un lugar, porque tengo un proyecto paralelo y por qué no

Operaba con la teoría del acumulador para LLMO: si poco es bueno, once es mejor.

Spoiler: no es así.

## Cómo medí

Corrí un experimento de tracking de tres meses, de fines de febrero a fines de mayo de 2026. Las reglas:

- 50 queries de marca y tema, escritas una vez y reutilizadas cada semana
- 4 motores de IA: ChatGPT (modo Search), Perplexity, Claude (con búsqueda habilitada), Brave Leo
- Cada semana le hacía las 50 preguntas a los 4 motores
- Para cada cita, verificaba si el fragmento citado contenía información que **solo** existía en un schema JSON-LD específico — name, foundingDate, knowsAbout, pares de Q&A de FAQ, títulos de libro, descripciones de servicio
- Si el fragmento dependía de un campo único de un schema, le acreditaba la cita a ese schema

Esa última regla es la que importa. Cualquiera puede afirmar "mi schema Article está funcionando" porque Article se superpone con `<title>`, `<h1>` y `<meta description>`. La pregunta interesante es: cuando la IA cita un hecho que **solo existe en JSON-LD**, ¿qué schema produjo ese hecho?

Tres meses, 600 queries (50 × 4 × 3 meses), unas 180 citas de mi sitio en total. Le hice seguimiento a todas.

## Los tres schemas que se ganaron su lugar

### 1. Organization

`Organization` es el schema que los motores de IA realmente parsean y guardan. Cuando alguien le pregunta a ChatGPT "¿en qué se enfoca kenimoto.dev?" o a Perplexity "¿quién lleva ese sitio?", la respuesta se apoya en campos que viven dentro del bloque Organization:

- `name` y `alternateName` (manejan transliteración y abreviaciones)
- `description` (la frase corta que la IA usa como resumen del sitio)
- `foundingDate` (el único lugar estructurado donde la IA encuentra esto)
- `sameAs` (referencias cruzadas a GitHub, LinkedIn, X — la IA las usa para fusionar entidades)

Cerca del 40% de los fragmentos citados contenían información rastreable hasta Organization. El patrón coincide con lo que [BrightEdge reportó a comienzos de 2026](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/): Organization es Tier 1.

Si vas a implementar un solo schema, es este. Ni siquiera está cerca.

### 2. Article (TechArticle por post)

Este técnicamente no era parte de los 11 empacados en el `<head>` de la home — Astro lo emite por cada post de blog. Lo cuento porque el experimento me obligó a notarlo: cada cita de IA de un post individual se apoyaba en `headline`, `datePublished`, `dateModified` y `author` del Article.

El campo `dateModified` pesa más de lo que parece. Perplexity en particular favorece el contenido fresco como señal de ranking — análisis recientes del sector [estiman que el frescor pesa cerca del 40% en el ranking de Perplexity](https://www.stackmatix.com/blog/structured-data-ai-search). Cada vez que actualizaba un post y le movía el `dateModified`, la tasa de cita de ese post subía notoriamente en las dos semanas siguientes.

### 3. FAQPage

El schema con patrón de cita más inequívoco. Los motores de IA extraen `mainEntity[].name` y `acceptedAnswer.text` de FAQPage casi tal cual. Estudios del sector ubican la tasa de cita de FAQPage [alrededor del 67% en queries relevantes para IA](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo), y otro análisis encontró que las páginas con FAQPage tienen [3,2 veces más probabilidad de aparecer en Google AI Overviews](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/) que páginas sin él.

Mis números propios fueron más modestos — tengo un solo bloque FAQPage, no cien — pero la **calidad** de la cita era distinta. ChatGPT no parafraseó mis respuestas de FAQ. Las citó.

Hay una trampa: FAQPage solo funciona si el contenido del FAQ se renderiza visiblemente en la página. Schema FAQPage vacío (cosa que vi a varios intentar) es un patrón documentado de penalización, no un atajo.

## Los ocho que no hicieron nada

Aquí viene la parte que cuesta escribir.

### Person (con knowsAbout)

Realmente pensé que `knowsAbout` iba a cargar con el peso. Varias guías de LLMO lo tratan como el arma secreta para la autoridad personal. Cuando le pregunto a la IA "¿quién es experto en LLMO?", mi nombre debería estar en la respuesta, ¿no?

No lo está. En 600 queries no pude encontrar una sola cita donde el contenido citado se rastreara hasta un valor único de `knowsAbout`. Ni una.

Mi teoría actual: los motores de IA no consultan un knowledge graph estructurado como lo hace el Panel de Conocimiento de Google. Recuperan documentos y los leen. `knowsAbout: ["LLMO"]` parado en el JSON-LD no es un documento. Es metadato sobre una persona que ningún pipeline de retrieval pensó en sacar a la superficie.

Fue el hallazgo más decepcionante y el más útil. Incluir `knowsAbout` está bien — no cuesta nada — pero planear tu estrategia de LLMO basada en eso es planear para un pipeline que todavía no existe.

### Service ×4

Cuatro bloques describiendo qué hago. Cero citas rastreables hasta ellos. Los motores de IA que quisieron saber qué servicios ofrezco encontraron esa información en la prosa de mi home, no en los datos estructurados.

### Book ×2

Dos bloques describiendo mis libros publicados. Cero citas de queries sobre libros que solo pudieran haber salido del schema Book. Cuando la IA cita mis libros, es por la prosa de las páginas de LP de los libros y los listings en Amazon — ambos existen independientes del schema.

### MusicGroup

Este lo incluí por completitud. Ahora sospecho que debí incluirlo por honestidad: ya sabía en el momento que era poco probable que disparara, y no disparó. La presencia de un bloque MusicGroup en el `<head>` de mi sitio fue auto-expresión, no LLMO.

### WebSite

`WebSite` con `SearchAction` es famosamente útil para la sitelinks search box de Google, que es una feature de SEO, no de IA. En tres meses, ninguna cita de IA necesitó información que solo viviera en el bloque WebSite.

## Lo que dice la investigación más amplia

El hallazgo de tres meses coincide con lo que estoy viendo en la investigación de 2026.

[Ahrefs corrió un estudio en mayo de 2026](https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7) sobre 1.885 páginas que agregaron schema para ver si la tasa de cita se movía. Casi no se movió. Las páginas que ganaron citas fueron las que tenían contenido fuerte y cobertura mediática ganada; el schema por sí solo no movió la aguja.

[Investigación de BrightEdge de comienzos de 2026](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/) encontró que las páginas combinando Article, FAQPage, HowTo y Organization fueron 2,5 a 2,7 veces más citadas que páginas sin schema. Nota qué no está en esa lista: Person, Service, Book, MusicGroup, WebSite. Mi lista de fracasos, idéntica.

Incluso hay una advertencia. Schema genérico y a medio llenar (Organization solo con `name` y `url`, FAQPage con una pregunta, Person sin `knowsAbout`) carga una [penalización de citas de 18 puntos porcentuales](https://www.stackmatix.com/blog/structured-data-ai-search) comparado con no tener schema. Los motores de IA aparentemente tratan el schema hueco como una señal de baja calidad.

La conclusión alinea con mi medición: pocos schemas bien llenados le ganan a una colección grande de schemas a medio llenar.

## Contexto LatAm: por qué importa acá

Dos cosas cambiaron en español los últimos meses y amplifican el problema de los schemas muertos.

Primero, Google AI Overviews en español está expandiendo su cobertura — más búsquedas en español, incluidas las hechas desde México, Argentina, Colombia y Chile, empiezan a tener respuesta generada con citas. Cada cita es un espacio donde Article + FAQPage + Organization compiten por aparecer. Si no tienes esos tres, tu página simplemente no entra a la competencia.

Segundo, Perplexity ganó tracción en círculos técnicos en LatAm, en parte porque cita las fuentes de una forma que el SEO viejo no premiaba. El `dateModified` del Article pasa a ser más importante de lo que parecía: los posts técnicos en español envejecen rápido, y la señal de frescor es lo que hace la diferencia entre ser citado en mayo o ser olvidado en junio.

En otras palabras, el problema no es teórico. Aparece con más fuerza ahora para quienes escribimos en español técnico.

## Qué haría diferente

Mantendría Organization, Article y FAQPage. El tiempo ahorrado en los otros ocho lo invertiría en hacer estos tres más ricos:

- Organization: más entradas en `sameAs`, `address` real, `email` real, `foundingDate` real, `description` descriptiva
- Article: actualizaciones agresivas de `dateModified` cada vez que un post se revisa genuinamente, `author` correcto enlazado a un Person
- FAQPage: cada página con sección de Q&A debería exponerla como FAQPage con respuestas escritas para ser citables en dos o tres frases

Saltearía Person/knowsAbout, Service, Book, MusicGroup y WebSite. No porque sean dañinos — no lo son, mientras estén correctamente llenos — sino porque el costo de implementación no es cero y el retorno es error de redondeo.

La regla general que ofrecería a quien empieza en 2026: elige los tres schemas que mapean al **contenido que la IA está leyendo** — identidad corporativa (Organization), cuerpo del artículo (Article), bloques de Q&A (FAQPage). Los schemas que describen atributos abstractos de una persona o empresa sin un bloque de contenido correspondiente en la página tienden a ser ignorados.

Si quieres una forma más estructurada de decidir qué schemas le sirven a qué tipo de sitio (corporativo, medios, e-commerce), [llmoframework.com](https://llmoframework.com) organiza la elección de schema por propósito de sitio con métricas de evaluación. Es el framework que debería haber usado hace tres meses, en lugar de "más es más".

## Tres meses acumulando no fue estrategia de contenido

El patrón que veo repetirse en el consejo de LLMO es el mismo en el que caí: implementá todo, más es mejor, la IA se va a dar cuenta. La IA no se da cuenta. Lee los documentos que le entregás y busca campos que mapeen a su pipeline de retrieval. Ocho de mis 11 schemas nunca estuvieron en ese mapa.

Tres sí. Esos tres ahora están más ricos de lo que estaban cuando compartían la página con otros ocho. El blog rankea igual, ChatGPT me cita cerca del 20% más que en febrero, y mi layout de Astro está más corto.

Once schemas era un basural. Tres schemas es un sitio.

## Lectura adicional

- [llmoframework.com](https://llmoframework.com) — framework para elegir schemas por propósito de sitio
- [Investigación de citas de schema de BrightEdge (resumen Digital Strategy Force)](https://digitalstrategyforce.com/journal/what-schema-markup-gets-you-cited-by-chatgpt-and-google-ai-mode-in-2026/)
- [Estudio de schemas de Ahrefs de mayo 2026 (resumen Medium)](https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7)
- [Conecté el mismo sitio a 7 rastreadores de citas de IA](https://kenimoto.dev/es/blog/7-rastreadores-citas-ia-numeros-diferentes/)

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
