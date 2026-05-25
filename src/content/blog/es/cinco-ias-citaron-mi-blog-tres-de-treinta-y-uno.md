---
title: "Le pedí a 5 IAs que citaran mi propio blog. 31 artículos publicados, solo 3 aparecieron."
description: "Apunté ChatGPT, Claude, Gemini, Perplexity y Brave AI a los 31 artículos de mi blog en inglés. Tres artículos hicieron el trabajo de los 31."
date: 2026-05-26
lang: es
tags: [llmo, busqueda-ia, geo, medicion, blog]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/cinco-ias-citaron-mi-blog-tres-de-treinta-y-uno/"
og_image: "https://kenimoto.dev/images/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/og-es.png"
cross_posted_to: []
---

Escribo sobre LLMO casi todas las semanas. KPI, llms.txt, JSON-LD, toda la liturgia. Y aun así había una cosa que nunca había hecho: pedirle a las propias búsquedas con IA que citaran mi blog.

No estoy hablando de "mi sitio está indexado", ni de "los crawlers golpean mi dominio". Eso ya lo monitoreo en el log del servidor. Estoy hablando de lo que el lector hace de verdad: abrir ChatGPT, escribir una pregunta, y revisar si algún artículo mío aparece en la respuesta.

El blog en inglés tiene 31 artículos publicados. Cuando apunté cinco IAs hacia él, tres artículos hicieron el trabajo de los 31. Los otros 28 podrían no existir.

![Cinco IAs apuntadas a 31 artículos, solo 3 citados](/images/blog/five-ai-engines-cite-my-blog-three-of-thirty-one/og-es.png)

## El experimento

Elegí las cinco IAs que aparecen seguido en el filtro de referral de mi GA4:

1. ChatGPT (con búsqueda web activada)
2. Claude (con búsqueda web activada)
3. Gemini
4. Perplexity
5. Brave AI

Después armé 30 prompts divididos en tres grupos de diez, porque las respuestas de un LLM son estocásticas y lanzar un solo prompt por IA es pura sensación:

- **Branded** — `kenimoto.dev about`, `ken imoto artículos LLMO`, `ken imoto Claude Code blog`. Modo fácil. Si el nombre del dominio más el tema del artículo no trae el sitio, algo está roto.
- **Topical** — `safe autonomous coding agents`, `llms.txt anti patterns`, `how to measure AI citations`. Modo realista. Es lo que un desconocido teclea.
- **Comparativo** — `Claude Code vs ChatGPT Codex agents`, `Perplexity vs Brave for engineers`, `voice AI stacks under 300ms`. Modo vanidad. Tengo un artículo en cada uno, debería competir.

Tres ejecuciones por prompt por IA, así que 30 × 5 × 3 = 450 turnos. Registré cuándo `kenimoto.dev` apareció como chip de citación, enlace en el texto, o en el pie de fuentes. Mención sin enlace no cuenta: el tablero LLMO solo acredita lo que el lector puede cliquear.

Esa última regla parece menor pero pesa. Buena parte de las celebraciones de "¡la IA está hablando de mí!" en redes son personas mostrando el nombre de su marca apareciendo en el texto. Eso es cortesía, no cita. Las citas mueven tráfico. Las menciones mueven el ego.

## El resultado

De los 31 artículos, exactamente tres aparecieron como cita en las cinco IAs:

- `measure-ai-citations-llmo-kpi`
- `11-json-ld-3-cited-by-ai`
- `geo-princeton-study-9-ways-ai-cites-you`

Cobertura de citación del 9,7%, menos de uno de cada diez artículos. Los 28 restantes o no aparecieron, o aparecieron una sola vez entre los 450 turnos y no se repitieron. Por la regla de "tres turnos" del LLMO Quickstart, una aparición solitaria no suma.

Por IA el resultado es más desparejo todavía. Perplexity y ChatGPT trajeron los tres. Claude trajo dos (se saltó el post del estudio de Princeton y mandó directo al artículo original, que técnicamente es la jugada correcta). Gemini citó solo el post de JSON-LD, y en el resto prefirió mandar al lector a las fuentes originales que mi artículo estaba citando. Brave AI citó cero. Describía el tema correctamente y despachaba al lector a un competidor.

Yo venía tratando mentalmente mi blog como un corpus de 31 piezas. Para las IAs, era un corpus de 3 piezas con 28 piezas de ruido de fondo.

## Lo que tienen en común los tres ganadores

Releí los tres imanes de cita al lado de cinco de los 28 fantasmas. El patrón no es nada sutil.

**Tienen un número en el título.** "9 ways", "11 JSON-LD schemas, 3 cited", "measure". Los tres ganadores. Los perdedores tienden a títulos evocativos (`cheap-model-won-context-beats-parameters`, `claude-hid-my-bug-three-times`) que se leen bien para humanos pero no tienen un número que un motor de respuesta pueda agarrar.

**Son el hub temático de una pregunta específica.** "Cómo medir citas de IA" mapea directo a un post. "Qué JSON-LD schemas realmente se citan" también. Los fantasmas tienden a ser relatos de experiencia ("probé X durante un mes y esto se rompió") que son buenísimos para humanos, pero ninguna IA va a contestar un prompt del tipo "cuéntame del mes de ken imoto refactorizando 100 funciones".

**Fueron publicados hace más de 30 días.** Los tres tienen al menos seis semanas. La mitad de los 28 fantasmas es más nueva. El retraso de indexación de IA es real, y el LLMO Quickstart no bromea cuando dice que la tasa de cita necesita al menos un mes de reposo antes de leerla.

La cantidad de JSON-LD, dicho sea de paso, es la misma en los 31 artículos: uso el mismo layout Astro para todo. Así que lo que está pasando no es "el ganador tiene mejor schema". Es el título, la gravedad temática, y el tiempo.

## Lo que tienen en común los 28 fantasmas

Primero la noticia aburrida. La mayoría de los fantasmas cae en uno de tres problemas:

- El título hace una afirmación que no existe en ningún otro lugar de la web, así que la engine no tiene ancla. "The cheap model won" es una frase buena, pero ningún humano la teclea como query.
- El tema es tan de nicho que ningún prompt genérico llega ahí. Un post sobre latencia en voice AI le va a perder al blog de AssemblyAI siempre. Hub temático le gana a profundidad indie.
- El post es decente pero se publicó contra una pared de contenido competidor. Mi "Claude refactor 100 functions" es razonable, pero busca "Claude refactor regression" y la respuesta va a volver del blog de Anthropic de la semana pasada.

La noticia interesante es lo que *no* importa. La extensión no importa: tengo post de 800 palabras citado y post de 3.000 palabras ignorado. Los backlinks no importan a mi escala: los artículos con más backlinks no son los tres citados. La publicación cruzada en Dev.to tampoco mueve la aguja de cita por IA, solo la de tráfico directo.

## Cómo reproducir el experimento

Quien escribe sobre LLMO debería hacer esta prueba en su propio sitio. La receta cabe en una tarde:

1. Lista las 5 IAs con búsqueda web (ChatGPT, Claude, Gemini, Perplexity, Brave AI). Si vives en LatAm, agrega Perplexity en español y Gemini en español como variantes; cambian de respuesta.
2. Escribe 30 prompts: 10 con tu nombre de dominio, 10 con los temas que cubres, 10 con comparaciones donde tienes contenido.
3. Ejecuta cada prompt 3 veces en cada IA. Sí, son 450 turnos. Toma una tarde con café.
4. Registra solo las apariciones con enlace clicable. Las menciones de texto plano no cuentan.
5. Identifica qué URLs aparecen con regularidad: esos son tus ganadores reales. El resto es ruido para el algoritmo, aunque sea contenido valioso para humanos.

Mi recomendación para lectores en México, Argentina, Colombia y Chile: prueba la mitad de los prompts en español. Las respuestas no son las mismas y vas a descubrir qué artículos tuyos tienen tracción en español puro, que muchas veces no coincide con la versión en inglés.

## Conclusión más amplia

Lo que subestimé fue cuánto se concentra la cita. Esperaba breadth del 5 al 10% y quedó en 9,7%, así que el número estaba bien. La sorpresa fue que los tres citados estaban cargando todos los motores, todos los grupos de prompts, todas las repeticiones. LLMO es un torneo. No estás optimizando 31 posts. Estás optimizando para cuáles 2 o 3 ganan la llave.

Lo otro que subestimé fue cuánto del perfil de "ganador" queda definido en la etapa del título. Cuando estás retocando JSON-LD en el post publicado, el ruteo ya pasó. El prompt aterriza en tu sitio o no, y el aterrizaje se decide en buena parte por si el título parece una respuesta.

El razonamiento técnico para construir hubs temáticos viene de los pilares Authority Signals y Coherence Signals del [LLMO Framework](https://llmoframework.com/). Si quieres que una cita componga interés, la URL citada tiene que estar en la cima de un pequeño cluster de contenido, no suelta en un mar de ensayos sin relación. El pilar Citability es el que captura la primera cita. Authority es el que mantiene la cita consistente entre motores diferentes.

Voy a repetir esto en 60 días con los mismos 30 prompts y ver si cambian los tres citados, o si entra un cuarto. Mi apuesta es que los tres son pegajosos y el cuarto solo entra si escribo un post nuevo diseñado específicamente para ganar una query que hoy no cubro.

Veremos. El lado bueno de convertir el propio blog en un blanco de medición es que el próximo post se vuelve el próximo experimento.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
