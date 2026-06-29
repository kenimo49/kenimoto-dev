---
title: "RAG vs GraphRAG: cuándo los grafos de conocimiento ganan (y cuándo son sobreingeniería)"
description: "GraphRAG no siempre es mejor que RAG vectorial. Esta es la matriz de decisión de 4 preguntas que te dice cuál usar antes de gastar dos semanas construyendo el grafo equivocado."
date: 2026-06-29
lang: es
tags: [graphrag, rag, knowledge-graph, neo4j, llm]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/rag-vs-graphrag-matriz-decision"
og_image: "https://kenimoto.dev/images/blog/rag-vs-graphrag-matriz-decision/og-es.png"
cross_posted_to: []
---

Hace seis meses recibí dos consultas en la misma semana. Las dos empezaban casi igual: "estamos pensando en migrar de RAG a GraphRAG, ¿qué opinas?". Una empresa fintech latinoamericana con cuatro mil contratos legales en repositorio. Una startup de e-commerce con un catálogo de productos y reseñas. La pregunta era la misma. La respuesta correcta era opuesta.

A la fintech le dije: háganlo, GraphRAG les va a ahorrar dos meses de trabajo manual de auditoría. A la startup le dije: no lo hagan, su RAG vectorial actual está bien, lo que les falta es reranking. La diferencia entre las dos no era el tamaño de la empresa ni el presupuesto. Era la **forma de las preguntas** que sus usuarios hacían al sistema.

Este artículo es la matriz de cuatro preguntas que uso para evitar que un equipo se gaste dos semanas construyendo un grafo de conocimiento que no necesita. O peor: que se quede con RAG vectorial cuando GraphRAG sí le habría dado el salto de calidad que estaba buscando.

![Matriz de decisión RAG vs GraphRAG con cuatro preguntas](/images/blog/rag-vs-graphrag-matriz-decision/matriz-rag-vs-graphrag-es.png)

## Primero, el malentendido más común

Antes de entrar a la matriz, conviene desactivar un malentendido que escucho seguido en LatAm: "GraphRAG es la nueva versión de RAG, debería ser mejor en todo".

No lo es. RAG vectorial y GraphRAG resuelven problemas **estructuralmente distintos**. RAG vectorial responde "encontrame el documento más parecido a esta pregunta". GraphRAG responde "encontrame cómo se conectan estas entidades, y reportá el camino". Las dos cosas son útiles. No son la misma cosa.

Si los usuarios de tu sistema hacen preguntas que se pueden contestar leyendo un párrafo del manual, RAG vectorial te alcanza. Si hacen preguntas que requieren entender cómo tres entidades distintas se relacionan a través de varias fuentes, ahí GraphRAG empieza a tener sentido. La matriz que sigue son cuatro preguntas que separan los dos casos.

## Pregunta 1: ¿Las preguntas requieren agregación sobre todo el corpus?

Esta es la pregunta más decisiva. Si los usuarios hacen consultas del tipo:

- "¿Cuál es el riesgo más recurrente en los contratos firmados este trimestre?"
- "¿Qué fallas de infraestructura aparecen en más del 30% de los incidentes del último año?"
- "¿Qué temas dominan los reclamos de clientes en la región andina?"

Estas preguntas son **query-focused summarization**. RAG vectorial no las puede contestar bien por una razón simple: solo te devuelve los top-k fragmentos más parecidos a la consulta, no calcula nada sobre el corpus completo. Si Redis aparece en 12 reportes de incidente pero ninguno de esos textos está en los top-5 por similitud, RAG no se entera de la frecuencia.

GraphRAG sí. El [paper original de GraphRAG de Microsoft Research](https://arxiv.org/abs/2404.16130) muestra que en este tipo de preguntas, GraphRAG gana al baseline RAG entre el 70% y el 80% de las veces evaluadas por humanos. La razón es que el grafo permite hacer consultas como esta sobre el corpus entero:

```cypher
MATCH (i:Incident)-[:CAUSED_BY]->(m:Middleware)
WHERE i.date >= date('2025-01-01')
RETURN m.name, count(i) AS total
ORDER BY total DESC LIMIT 5
```

**Si las preguntas reales de tus usuarios son de este tipo, sumá un punto a favor de GraphRAG.** Si las preguntas son "¿cómo configuro el feature X?", restá un punto: ahí RAG vectorial sigue siendo mejor.

## Pregunta 2: ¿Hace falta seguir relaciones de varios saltos?

Algunas preguntas requieren saltar de una entidad a otra para llegar a la respuesta. Por ejemplo:

- "¿Qué personas que trabajaron en el incidente A participaron antes en proyectos donde aparecieron problemas similares?"
- "¿Qué proveedores tienen contratos con cláusulas similares a las de este contrato problemático?"
- "¿Qué papers citan a este paper y a la vez fueron escritos por autores que también colaboraron con este otro investigador?"

Esto se llama **multi-hop reasoning**. RAG vectorial no lo puede hacer por construcción: cada búsqueda es una operación de similitud aislada, sin estado, sin memoria de las búsquedas anteriores. Aunque el modelo de lenguaje termine generando una respuesta, la base de información que recibe no permite verificar la cadena.

GraphRAG lo resuelve con consultas de varios saltos directamente en el grafo. Empresas como [BBVA AI Factory documentaron](https://www.bbva.com/en/innovation/bbva-ai-factory-the-key-to-the-success-of-data-projects/) cómo usan grafos de conocimiento para correlacionar clientes, productos y eventos de riesgo, justamente porque las preguntas regulatorias en banca exigen este tipo de trazabilidad. La misma necesidad la vi en una mutual de Bogotá: tres consultas internas de cumplimiento requerían tres saltos cada una, y RAG vectorial las contestaba mal el 100% de las veces.

**Si tu dominio tiene preguntas multi-hop reales, sumá otro punto a GraphRAG.**

## Pregunta 3: ¿La respuesta necesita evidencia trazable?

En dominios regulados, no alcanza con que la respuesta sea correcta. Hace falta poder **mostrar cómo se llegó a ella**. Auditoría financiera, cumplimiento legal, diagnóstico médico, contratos comerciales: en todos estos casos, una respuesta sin camino de evidencia es una respuesta inservible para el caso de uso real.

RAG vectorial te da, como mucho, una lista de los fragmentos que se usaron. GraphRAG te da el camino del grafo:

```text
Respuesta: el desarrollador de GraphRAG es Microsoft Research,
y el OSS principal que lo implementa es Microsoft GraphRAG.

Evidencia:
  (GraphRAG) --[developed_by]--> (Microsoft Research)
  (Microsoft Research) --[part_of]--> (Microsoft)
  (Microsoft GraphRAG) --[implements]--> (GraphRAG)
```

Esa lista de aristas no es decoración. Es lo que un auditor puede revisar, lo que un revisor humano puede validar, y lo que un sistema externo puede consumir programáticamente. Para sistemas que viven en industrias auditadas, **esto solo ya puede justificar GraphRAG**.

**Si tu sistema necesita trazabilidad estricta, otro punto a GraphRAG.**

## Pregunta 4: ¿Tu volumen de datos justifica el costo de construir el grafo?

Acá viene la pregunta donde GraphRAG empieza a perder. Construir el grafo cuesta tiempo de cómputo y de modelo. Cada documento pasa por extracción de entidades y relaciones, y eso normalmente significa una o más llamadas a un LLM por chunk. Para mil documentos, hablamos de unas cuantas horas y un par de cientos de dólares de API. Para cien mil documentos, ya estamos hablando de varios miles de dólares y un proceso de batch que toma días.

El informe de [NTT Data sobre GraphRAG](https://www.nttdata.com/jp/ja/trends/data-insight/2024/0830/) identifica el costo de construcción como el principal obstáculo operativo de la tecnología, no la calidad. La startup de e-commerce que mencioné al principio tenía menos de mil documentos, dudas mayormente fácticas, y un equipo de dos personas. Construir y mantener el grafo les habría costado más en tiempo de ingeniería que el beneficio en calidad de respuesta. La recomendación correcta era no migrar.

**Si tu corpus es chico (menos de mil documentos) y el equipo no tiene tiempo para mantener un pipeline de extracción, restá un punto.** Si es grande (más de diez mil) y tenés capacidad de batch, sumá uno.

## La matriz, en una tabla

Cada pregunta vale un voto a favor o en contra:

| Pregunta | +1 GraphRAG si... | -1 GraphRAG si... |
|---|---|---|
| 1. ¿Agregación sobre todo el corpus? | Sí, frecuente | No, casi nunca |
| 2. ¿Multi-hop reasoning? | Sí, central al uso | No, las preguntas son fácticas |
| 3. ¿Trazabilidad de evidencia? | Sí, requisito regulatorio | No, basta con citar fragmentos |
| 4. ¿Volumen y equipo? | >10k docs y equipo dedicado | <1k docs o equipo chico |

**Resultado +2 o más**: vale construir GraphRAG. El retorno operativo va a justificar las dos semanas de pipeline y los costos de extracción.

**Resultado entre -1 y +1**: zona gris. Probá primero con un piloto pequeño (200 documentos, una sola pregunta tipo) antes de comprometerte. Acá entran muchos casos de uso reales y la respuesta correcta depende de detalles del negocio.

**Resultado -2 o menos**: quedate con RAG vectorial. Si tu RAG actual está dando respuestas malas, la solución es **mejor RAG**, no GraphRAG. Mejorá el chunking, agregá reranking con un modelo cross-encoder, ajustá el tamaño del top-k. Casi siempre te alcanza.

## El error más caro

El error que veo repetir en varios equipos de la región es construir el grafo primero y después preguntarse para qué sirve. Pasan dos semanas escribiendo prompts de extracción de entidades, definiendo ontologías, eligiendo entre Neo4j y Amazon Neptune, y al final tienen un grafo de cuatro mil nodos que nadie consulta porque las preguntas reales del producto siempre fueron fácticas.

El orden correcto es al revés: primero llevás un mes anotando las preguntas reales que los usuarios le hacen al sistema. Después clasificás cada pregunta por las cuatro categorías de arriba. Si la mayoría cae en pregunta 1, 2 o 3, GraphRAG tiene sentido. Si la mayoría son fácticas, GraphRAG no va a mover la aguja por más que el grafo esté bien construido.

Es la diferencia entre "tener el martillo más nuevo" y "tener el martillo que la tarea necesita". GraphRAG es una herramienta excelente para los problemas correctos. Aplicada al problema equivocado, es solo dos semanas perdidas que tu equipo podría haber gastado mejorando el RAG que ya tenían.

## Lo que conviene recordar

- RAG vectorial y GraphRAG no son versiones del mismo problema, son herramientas para problemas estructurales distintos
- Las cuatro preguntas (agregación, multi-hop, trazabilidad, volumen) son el filtro práctico
- Si tu RAG vectorial responde mal, primero mejorá el RAG: reranking, chunking, top-k
- Construí GraphRAG solo si las preguntas reales del producto lo justifican, no porque la tecnología esté de moda
- En zona gris, hacé un piloto pequeño antes de comprometerte a las dos semanas de pipeline

La decisión correcta entre RAG y GraphRAG no se toma leyendo un benchmark genérico. Se toma observando qué preguntas hace tu producto y eligiendo la herramienta que esas preguntas necesitan.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
