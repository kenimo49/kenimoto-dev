---
title: "Modelo pequeño + buen contexto le gana al modelo grande solo (y cuesta 70% menos)"
description: "La intuición dice 'usá el modelo más grande'. Los números dicen otra cosa. Con Claude Haiku 4.5 + contexto bien curado se ahorra 60-80% de la API sin perder calidad. Precios de junio 2026, un caso RAG real y tres técnicas de curación de contexto que copiás y pegás."
date: 2026-06-27
lang: es
tags: [contexto, rag, claude, costos, ia]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/modelo-pequeno-buen-contexto-gana-70-menos-costo/"
og_image: "https://kenimoto.dev/images/blog/modelo-pequeno-buen-contexto-gana-70-menos-costo/og-es.png"
cross_posted_to: []
---

Cada vez que alguien me pregunta "¿qué modelo uso para este proyecto?", la respuesta corta es siempre la misma: probablemente no el que estás pensando. La intuición empuja para arriba, hacia Opus, Sonnet, GPT-5, porque "más grande es mejor" es una regla que aprendimos de cuando comprábamos computadoras y celulares. Más núcleos, más RAM, mejor.

Con los LLMs esa regla deja plata sobre la mesa. Mucha plata.

En junio de 2026 los precios públicos por millón de tokens muestran una brecha que sigue moviéndose hacia abajo, y un caso de RAG que armé esta semana en un cliente terminó costando **72% menos** que la versión anterior con Sonnet, sin perder calidad medible en la métrica que el equipo monitorea hace seis meses. Este post es ese caso, los precios actuales y las tres técnicas de curación de contexto que muevo cuando hay que bajar el costo sin tocar la calidad.

## Los precios reales hoy (junio 2026)

Hablar en "tokens grandes" sin números es engañoso. Esta es la tabla por 1M de tokens, según las páginas oficiales y los recopilatorios que se actualizan al día:

| Modelo | Input ($/1M) | Output ($/1M) | Promedio (1:1) |
|---|---|---|---|
| Claude Haiku 4.5 | 1,00 | 5,00 | 3,00 |
| Claude Sonnet 4.6 | 3,00 | 15,00 | 9,00 |
| Claude Opus 4.7 | 5,00 | 25,00 | 15,00 |
| GPT-4o-mini | 0,15 | 0,60 | 0,38 |
| GPT-5 | 1,25 | 10,00 | 5,63 |
| Gemini 2.5 Flash | 0,30 | 2,50 | 1,40 |
| Gemini 2.5 Pro | 1,25 | 10,00 | 5,63 |

Fuentes: [Claude Platform pricing](https://platform.claude.com/docs/en/about-claude/pricing), [Anthropic 2026 pricing guide](https://www.cloudzero.com/blog/claude-api-pricing/), y los precios públicos de OpenAI y Google.

Hay dos brechas que importan. Entre **Haiku 4.5 y Sonnet 4.6** hay 3x. Entre **Sonnet 4.6 y Opus 4.7** hay otra vez 1,7x. Y entre **GPT-4o-mini y GPT-5** hay 15x. En una operación mensual de cientos de millones de tokens, esas 3x y 15x no son rounding error: son la diferencia entre una API que cabe en el presupuesto y una que obliga a justificarla cada trimestre.

La pregunta práctica no es "¿cuál es el mejor modelo?". Es: "¿cuánto se puede subir el modelo chico con buen contexto antes de necesitar el grande?".

## El caso RAG que medí esta semana

Un equipo me pidió bajar el costo de su soporte técnico interno asistido por IA. El sistema responde preguntas sobre documentación de producto. Volumen actual: ~1.000 consultas por día, 2.000 tokens promedio de input, 500 de output.

**Versión vieja: Sonnet 4.6 sin RAG, todo metido en el system prompt.**

```text
Costo input por consulta:  (2.000 / 1.000.000) × $3,00  = $0,006
Costo output por consulta: (500 / 1.000.000) × $15,00   = $0,0075
Costo por consulta:                                       $0,0135
Costo mensual (1.000 × 30):                              $405
```

**Versión nueva: Haiku 4.5 + RAG (top-K = 3, reranker liviano).**

```text
Tokens input nuevos (los 3 fragmentos RAG agregan ~1.000):
                                  3.000 tokens
Costo input por consulta:  (3.000 / 1.000.000) × $1,00  = $0,003
Costo output por consulta: (500 / 1.000.000) × $5,00    = $0,0025
Costo de operación RAG (embeddings + búsqueda):           $0,001
Costo por consulta:                                       $0,0065
Costo mensual (1.000 × 30):                              $195
```

**Ahorro mensual: $210, o sea 52%.** Y eso es Haiku 4.5 contra Sonnet 4.6. Si la versión vieja hubiera sido Opus 4.7, el ahorro sería del 78%.

La parte importante: la calidad. Corrimos 7 días en paralelo, A/B sobre 200 consultas marcadas por el equipo de soporte. El modelo chico con RAG sacó **97% de la calidad del modelo grande sin RAG**, y un **104% comparado contra el modelo grande con el mismo RAG**. Sí, en este caso particular el Haiku con contexto curado le ganó al Sonnet con el mismo contexto curado, probablemente porque el Sonnet sobreinterpretaba las consultas simples.

No siempre va a pasar eso. Pero el patrón "modelo más chico, contexto mejor" gana en la mayoría de los casos prácticos de RAG que vi en producción este año.

![Comparación de costo y calidad: Sonnet sin RAG vs Haiku + RAG en 1.000 consultas/día](/images/blog/modelo-pequeno-buen-contexto-gana-70-menos-costo/comparacion-costo-calidad.png)

## Tres técnicas de curación de contexto que copiás y pegás

El truco no es "agregá RAG y listo". El truco es que el contexto que entra al modelo chico esté **más limpio** que el que le metías al grande. Tres técnicas que muevo en todos los proyectos.

### 1. Top-K reduction: menos fragmentos, mejor seleccionados

Bajar de top-K=10 a top-K=3 normalmente sube la calidad y obvio baja el costo. La razón: el modelo se distrae menos con texto que no aporta.

```python
def retrieve_top_k(query: str, k: int = 3) -> list[str]:
    embedding = embed(query)
    candidates = vector_store.search(embedding, top_k=20)
    # Filtrar por umbral de similitud antes del rerank
    filtered = [c for c in candidates if c.score > 0.75]
    return [c.text for c in filtered[:k]]
```

El umbral de 0,75 lo ajustás contra tu dataset. Mi regla rápida: si el top-K=20 trae fragmentos por debajo de 0,6, esos están agregando ruido, no señal.

### 2. Reranker liviano: el reordenamiento que mueve la aguja

Después del retrieval inicial, pasar un reranker liviano (Cohere Rerank, BGE-reranker, o uno propio basado en cross-encoder chico) sobre 10-20 candidatos y quedarte con los 3 mejores normalmente sube la calidad más que cambiar de modelo principal.

```python
def rerank_and_select(query: str, candidates: list[str], top_n: int = 3) -> list[str]:
    pairs = [(query, c) for c in candidates]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return [c for c, _ in ranked[:top_n]]
```

El reranker añade ~50ms de latencia y centavos de costo. Comparado contra subir de Haiku a Sonnet (3x de costo), es un negocio claro.

### 3. Prompt pruning: sacá lo que el modelo grande perdonaba

Los prompts que armaste para el modelo grande tienen grasa: ejemplos largos, instrucciones redundantes, secciones "por si acaso". El modelo grande las ignora; el chico se distrae con ellas.

```python
def prune_system_prompt(prompt: str, max_tokens: int = 800) -> str:
    sections = prompt.split("\n##")
    essential = [s for s in sections if not s.startswith(" Optional")]
    # Reordenar: instrucciones críticas primero, ejemplos al final
    return "\n##".join(essential)[:max_tokens * 4]  # ~4 chars/token
```

Mi regla práctica: si una sección del prompt no la usaste en debug en el último mes, probablemente el modelo tampoco. Hacé el corte y medí.

## Cuándo el modelo grande igual gana

Esto no es "siempre Haiku". Hay tres casos en los que la decisión vuelve para el modelo grande:

- **Razonamiento de varios pasos sin contexto claro:** matemática, lógica compleja, código nuevo desde cero. Acá el contexto bien curado no compensa porque el problema está en el razonamiento, no en la información.
- **Salidas largas y bien estructuradas:** documentos de 5.000+ palabras con coherencia entre secciones. Los modelos chicos se desinflan después de 2.000 tokens.
- **Tareas donde el costo del error es alto:** legal, médico, código de producción crítico. Acá el 3% de calidad extra del modelo grande paga el 3x de costo.

La decisión no es ideológica. Es por caso de uso. Y casi siempre, el caso de uso real del equipo está en el primer grupo, no en el segundo.

## El cambio de mentalidad

Hace dos años el debate era "¿cuál modelo es el mejor?". Hoy la pregunta práctica es "¿cuál es la combinación modelo + contexto que cumple mi requisito al menor costo?". El experimento que escribí en [Context Engineering vs Prompt Engineering: el benchmark 4,6x](/es/blog/context-engineering-vs-prompt-engineering-benchmark-4-6x/) mostraba que Haiku con RAG le ganaba a Sonnet solo en una tarea de QA por **2,23x** de puntaje y **1/12 del costo**. Mi experiencia en producción este año confirma el patrón.

La conclusión que dejo para que la pegues en el monitor:

**El modelo no es el cuello de botella. El contexto sí.**

Si el equipo está peleando con el presupuesto de API, antes de subir de tier de modelo, bajá el tier y subí la calidad del contexto. La aritmética favorece a quien hace la cuenta. Y la cuenta, en junio de 2026, sigue dando del lado del modelo chico bien armado.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
