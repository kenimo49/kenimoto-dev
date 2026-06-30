---
title: "Construí mi base de conocimiento personal: 300 fuentes en 3 meses (lo que sirvió y lo que perdió tiempo)"
description: "Los marcadores se vuelven cementerio, las notas manuales nadie las revisa. Aquí está el log mes a mes de cómo pasé de cero a 300 fuentes indexadas para mi agente: qué pipeline funcionó, qué desperdició tiempo, y cuándo grep simple le ganó a un RAG sofisticado."
date: 2026-06-30
lang: es
tags: [conocimiento, automatizacion, sqlite, claude-code, productividad]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/300-fuentes-3-meses-base-conocimiento-personal/"
og_image: "https://kenimoto.dev/images/blog/300-fuentes-3-meses-base-conocimiento-personal/og-es.png"
cross_posted_to: []
---

Aviso de honestidad antes de empezar: este es el mismo log que publiqué primero en portugués hace dos semanas, traducido al español y reorganizado mes a mes para que sea más fácil de seguir si vas a montar algo parecido. Los números son míos, medidos en mi máquina, en mi flujo real.

Tres meses atrás partí de cero. Hoy tengo 300 fuentes indexadas en una base de conocimiento que mi agente consulta solo. Tardé un día en armar la base, y luego unos 10 a 15 minutos por día en operación. Te voy a contar qué hice mes por mes, qué pipeline funcionó, qué fue pérdida de tiempo, y en qué momento descubrí que un `grep` simple le estaba ganando a un RAG armado con LangChain.

Si estás pensando "yo también tengo mil marcadores que nunca volví a abrir", esto te va a sonar familiar.

![Línea de tiempo de 3 meses con tres fases: armado, refinamiento, operación. El conteo de fuentes sube de 0 a 300](/images/blog/300-fuentes-3-meses-base-conocimiento-personal/og-es.png)

## Por qué los marcadores se vuelven cementerios

Antes de la línea de tiempo, una pregunta corta: ¿por qué tu Notion lindo, tu Obsidian con grafo de mil bolitas, y esa carpeta de 400 marcadores terminaron iguales? La razón es simple y nada satisfactoria: **guardar y recuperar son problemas distintos, y la mayoría de los sistemas solo resuelve el primero**.

Apretar `Ctrl+D` cuesta medio segundo. Encontrar de nuevo "ese post sobre aquella técnica de caché" tres semanas después cuesta quince minutos de búsqueda por palabras que ya no recuerdas. La cuenta no cierra, así que dejas de volver, y el acervo muere.

Yo tuve tres cementerios: Notion, Obsidian, una carpeta de marcadores del navegador. Los tres con el mismo final. El problema no era falta de disciplina. Era pedirle disciplina a una tarea que debería ser automática.

## Mes 1: armar la base (8 horas en un día)

El primer mes fue casi todo el día 1. Modelé el esquema de SQLite, escribí una CLI en Python, y monté el pipeline de registro automático. La mayor parte del código la escribió el propio Claude Code; yo daba las decisiones de diseño.

El esquema mínimo tiene cuatro tablas: `sources` (la fuente en sí), `summaries` (resumen generado por LLM), `categories`, y `reliability_scores` (la nota de 1 a 5 que explico abajo). La CLI tiene tres comandos: `add`, `list`, `search`. Nada más.

```bash
# registrar una fuente
python3 manager.py add \
  --path "knowledge/cache-strategy.md" \
  --title "Estrategia de caché sin servir dato viejo" \
  --source-type "zenn" \
  --categories "Backend,Cache"

# buscar por categoría
python3 manager.py list --category "Cache"
```

Por qué SQLite y no algo más grande: porque desarrollo solo, miro el costo de la nube de cerca, y un archivo `.db` en mi máquina vale más que cualquier servicio con suscripción mensual. Si en algún momento esto crece a 10.000 fuentes, migro. Hasta ahí, SQLite alcanza y sobra.

El resto del mes 1 fueron 30 fuentes registradas a mano, ajustando la CLI cada vez que algo no me gustaba. Ese día completo de armado fue la inversión más grande del proyecto. Después, todo bajó a 10-15 minutos diarios.

## Mes 2: la puntuación de confiabilidad cambió todo

En el mes 2 agregué la pieza que terminó siendo el corazón del sistema: una **puntuación de confiabilidad de 1 a 5** asignada automáticamente a cada fuente. Sin esto, el problema del "post viral de mil likes con cero sustancia" hubiera roto la base.

| Nota | Criterio | Ejemplo |
|------|----------|---------|
| 5 | Doc oficial, artículo revisado por pares | Blog oficial de Anthropic |
| 4 | Basado en experiencia práctica, alta interacción | Artículo técnico con autor que entrega |
| 3 | Artículo técnico común, blog personal | Post de tutorial promedio |
| 2 | Afirmación sin verificar, título sensacionalista | "Gané X al mes con Y" |
| 1 | Procedencia dudosa | Repost de fuente desconocida |

El juicio pesa cuatro cosas: autoridad de la fuente (oficial o personal, historial de quien escribe), interacción (likes y sobre todo tasa de guardado, que miente menos que los likes), verificabilidad (¿hay código, demo, se puede reproducir?), y sesgo (¿es link de afiliado? ¿es discurso de quien vende eso?).

Un ejemplo concreto de cómo me salvó. Apareció un post diciendo que se podía armar "un modelo financiero nivel Goldman Sachs" con 12 prompts. Los números eran lindos: 906 likes, 887 guardados, 160 mil impresiones. El pipeline miró eso, vio que la reproducibilidad era cero y que ninguna demo sostenía la promesa, y le puso nota 2. Del otro lado, un artículo sobre principios de diseño de skills, con 170 likes y 196 guardados, números modestos, pero basado en uso real, se llevó nota 4.

Hoy, cuando consulto un tema, leo primero las notas 4 y 5, y trato las 2 como "alguien afirma esto, pero no verifiqué". Ese juicio quedó automático y me ahorra el trabajo de re-evaluar fuentes que ya pasaron por el filtro.

A fin del mes 2 había 130 fuentes. La operación estaba en ritmo de 10 minutos por día.

## Mes 3: cuándo grep le ganó al RAG sofisticado

En el mes 3 cometí el error clásico: pensar que más sofisticación era mejor. Monté un RAG con embeddings sobre las 130 fuentes existentes, usando una librería popular de las que dan buena impresión en demos.

Funcionó peor que un `grep`.

No exagero. Mi agente buscaba "cache LRU implementación" y el RAG le devolvía tres fuentes de "concepto de caché en general" porque la similitud semántica las acercaba. Un `grep -r "LRU" knowledge/` me devolvía las dos fuentes que de verdad tenían implementación de LRU, en menos de un segundo y sin llamada a API.

La razón es estructural. Con 130 fuentes, todas en mi dominio (engineering, AI, productividad), la **densidad semántica es alta**. Casi todo se parece a casi todo cuando lo mides con embeddings. El `grep` por palabra exacta tiene la ventaja de que las palabras técnicas (LRU, MoE, KV-cache) son tan específicas que coinciden o no coinciden, sin ambigüedad.

Lección del mes 3: el RAG sofisticado **vale la pena cuando tu base es grande y diversa**. Para 100-500 fuentes técnicas concentradas en un dominio, `grep` + filtros por categoría es más rápido y más preciso. Saqué el RAG y volví a comandos simples. La velocidad de consulta subió, y la cuenta de API bajó a cero.

A fin del mes 3 había 300 fuentes. La velocidad para escribir artículos y tomar decisiones técnicas subió, en mi percepción, 3 a 5 veces. Ese "3 a 5 veces" es sensación medida a ojo, no cronómetro de laboratorio, así que tómalo como reporte de campo, no como ley de la física.

## Los números honestos del costo total

Antes de cerrar, voy a abrir la cuenta completa para que no haya magia.

| Concepto | Tiempo |
|---|---:|
| Día 1: armado de la base | 8 horas |
| Operación (90 días × 12 min promedio) | ~18 horas |
| Errores y rehacer (RAG fallido, etc.) | ~4 horas |
| **Total inversión** | **~30 horas** |

A cambio, 300 fuentes con metadatos, resumen, categorías y nota de confiabilidad. Y un agente que las consulta solo cuando le pido escribir sobre un tema. **No vuelvo a investigar lo que ya investigué una vez**. Ese es el premio real, no las 300 entradas.

¿Vale la pena? Para mí valió, porque la ganancia no está en ninguna fuente aislada, está en lo acumulado. Cuando voy a escribir sobre un tema y consulto la base, lo confiable ya viene separado del ruido, con la nota al lado. Si investigas los mismos temas más de una vez al mes, probablemente también te valga.

## Cómo empezar sin copiar mi complicación

No copies nada de esto para empezar. Aquí te dejo la versión que ojalá hubiera empezado yo: **una carpeta con archivos Markdown y un `CLAUDE.md` que diga "esta carpeta es mi base de conocimiento"**. Nada más. Ni SQLite, ni CLI, ni puntuación.

```text
mi-base/
├── CLAUDE.md          # "esta carpeta es la base de conocimiento"
├── conocimiento/      # pon los .md aquí
└── README.md          # lista de categorías
```

El Claude Code encuentra cosas con `grep` y `find` perfectamente mientras la base es chica. Cuando pases las 50-100 entradas y la búsqueda empiece a fallar, ahí migras a SQLite. La puntuación de confiabilidad la puedes empezar a mano, marcando un número arriba de cada archivo. Lo importante es **empezar pequeño y dejar que lo acumulado te empuje**.

Cuando llegues a la décima entrada y pienses "ah, esto ya lo había estudiado" y lo encuentres en dos segundos, esa sensación es el combustible para seguir. Yo perdí dos años con sistemas de notas elegantes que no usaba. La diferencia esta vez fue **quitarle el registro aburrido a mis manos y dejarle solo la parte de pensar**.

El problema nunca fue tu falta de disciplina. Fue pedirle disciplina a una tarea que debería ser automática.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
