---
title: "Cómo darle memoria persistente a tu agente de IA: la arquitectura de 7 archivos (y por qué cargar todo es un error)"
description: "Tu agente de IA olvida todo cada mañana. Te muestro cómo darle memoria persistente con 7 archivos al arranque y selección dinámica con control de budget, sin reventar la ventana de contexto."
date: 2026-06-17
lang: es
tags: [agentes-ia, memoria, context-engineering, claude-code, arquitectura]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/memoria-persistente-agente-7-archivos"
og_image: "https://kenimoto.dev/images/blog/memoria-persistente-agente-7-archivos/og-es.png"
cross_posted_to: []
---

Te voy a confesar algo que me costó admitir: durante meses traté a mi agente de IA como si fuera un becario brillante con amnesia. Cada mañana le explicaba quién era yo, en qué proyecto estábamos, qué decisiones ya habíamos tomado. Y cada mañana él me respondía con el mismo entusiasmo de alguien que nunca me había visto. Brillante, sí. Útil, a medias. Porque un compañero que no recuerda nada de ayer no es un compañero: es una herramienta con buena dicción.

Hoy quiero mostrarte cómo le di memoria persistente a mi agente. No con magia, sino con una arquitectura concreta de siete archivos que se cargan al arranque, más una pieza que casi todo el mundo se salta: la selección dinámica de memoria con control de budget. Y de paso voy a defender una idea que suena contraintuitiva pero que me ahorró muchos dolores de cabeza: cargar toda la memoria siempre, en cada consulta, es un error.

## El problema del becario que pierde la memoria cada mañana

Imagina que contratas a alguien excelente, pero cada noche, al irse, olvida absolutamente todo lo del día. A la mañana siguiente entra fresco, capaz, listo para trabajar… y sin la menor idea de qué quedó pendiente. Tu solución natural sería pedirle que escriba un registro diario antes de irse y que lo lea apenas llegue. Eso es, en esencia, la memoria de un agente.

Si usas agentes de IA en trabajo real, ya conoces los síntomas:

- Te pregunta dos veces lo mismo en sesiones distintas.
- Te sugiere algo que contradice una decisión que ya habías cerrado.
- Sus respuestas no reflejan el contexto de la conversación anterior.

El origen es siempre el mismo: cada sesión arranca con una ventana de contexto en blanco. El modelo no "recuerda" nada por defecto; solo ve lo que tú le pones delante en ese momento. La memoria persistente es, justamente, la disciplina de decidir qué poner delante y cuándo.

## La arquitectura de 7 archivos: qué se carga al arranque

La forma más clara que encontré de estructurar esto viene de los agentes reales que componen su "personalidad" y su memoria cargando varios archivos en orden durante el arranque. En el patrón que adopté son siete, cada uno con un rol distinto:

1. **AGENTS.md** — Reglas de trabajo comunes para todos los agentes.
2. **SOUL.md** — Personalidad, carácter, forma de relacionarse.
3. **TOOLS.md** — Inventario de herramientas y configuración local del equipo.
4. **IDENTITY.md** — El perfil que el agente muestra hacia afuera.
5. **USER.md** — Información sobre ti, el usuario.
6. **HEARTBEAT.md** — Cosas que el agente debe revisar de forma periódica.
7. **MEMORY.md** — La memoria episódica: el diario de lo que pasó y el resumen de largo plazo.

En pseudocódigo, el arranque se ve así:

```python
# Pseudocódigo para ilustrar el patrón de diseño (no es ejecutable tal cual)

class ArquitecturaMemoriaAgente:
    def inicializar_memoria(self):
        """Carga de siete archivos al arranque"""
        self.memoria = {
            "reglas":        cargar("AGENTS.md"),    # 1. Reglas para todos
            "personalidad":  cargar("SOUL.md"),      # 2. Carácter y relaciones
            "herramientas":  cargar("TOOLS.md"),     # 3. Inventario + config local
            "identidad":     cargar("IDENTITY.md"),  # 4. Perfil externo
            "usuario":       cargar("USER.md"),      # 5. Quién es el usuario
            "monitoreo":     cargar("HEARTBEAT.md"), # 6. Revisiones periódicas
            "memoria_pasada": cargar_archivos_diario(), # 7. Diario + largo plazo
        }
```

La idea de fondo es que la "personalidad" de un agente no sale de un parámetro mágico del modelo. Sale de unos pocos archivos de texto que defines tú. Suena casi decepcionante de lo simple que es. Y lo es. Esa es justamente la buena noticia, porque significa que cualquiera puede empezar hoy con un editor de texto.

Por cierto, esto no es teoría aislada. Las herramientas de agentes actuales ya van en esta dirección: Claude Code, por ejemplo, lee archivos `CLAUDE.md` al inicio de cada sesión para darle al agente instrucciones persistentes. Y en su versión 2.1.33 (febrero de 2026) sumó un campo `memory` para subagentes que, al arrancar, inyecta las primeras 200 líneas de un `MEMORY.md` directamente en el prompt de sistema. O sea: el patrón de "memoria en archivos que se cargan al arranque" ya es parte del mainstream, no un experimento de garaje.

![Diagrama de la arquitectura de 7 archivos: cuáles se cargan al arranque y cuáles se seleccionan dinámicamente](/images/blog/memoria-persistente-agente-7-archivos/memoria-persistente-agente-7-archivos-1.png)

## Por qué no todos los archivos viajan a todos lados

Acá viene un detalle de diseño que vale oro: no todos esos archivos deben compartirse con todos los agentes. Cuando tu agente principal delega tareas a subagentes, esos subagentes son básicamente "contratados temporales" para una tarea puntual. Y a un contratado temporal no le entregas el manual completo de tu vida.

| Archivo | Agente principal | Subagente | Por qué se restringe |
|---|:---:|:---:|---|
| AGENTS.md (reglas) | sí | sí | Reglas que todos necesitan |
| TOOLS.md (herramientas) | sí | sí | Hace falta para trabajar |
| SOUL.md (personalidad) | sí | no | El subagente no la necesita |
| USER.md (datos del usuario) | sí | no | Seguridad y privacidad |
| MEMORY.md (memoria pasada) | sí | no | Ahorro de tokens + evitar fugas |
| HEARTBEAT.md | sí | no | Función exclusiva del principal |
| IDENTITY.md | sí | no | El perfil externo es solo del principal |

Darle a cada subagente solo lo mínimo indispensable tiene dos beneficios al mismo tiempo: gastas menos tokens y proteges información sensible. Es la versión técnica de "información según necesidad". Un poco aburrido como principio de seguridad, lo sé, pero los principios aburridos son los que no te explotan en la cara un viernes a las seis de la tarde.

## El error de cargar todo siempre

Ahora la parte donde suelo discutir con quien recién empieza. La tentación, cuando descubres lo cómodo que es tener memoria, es cargar absolutamente todo en cada consulta. "Más contexto es mejor", piensas. Y es mentira.

La ventana de contexto es el recurso más escaso y más disputado de tu agente. Ahí compiten la memoria, las descripciones de herramientas, los esquemas, las instrucciones y el propio razonamiento del modelo. Si llenas ese espacio con cosas que no vienen al caso, no solo gastas dinero de más: degradas la calidad de las respuestas. La investigación reciente sobre conversaciones largas identifica varias formas en que un contexto inflado se vuelve en tu contra:

- **Distracción**: tanta información irrelevante que el foco se difumina.
- **Confusión**: varios temas mezclados, y el modelo cruza contextos que no debía.
- **Contradicción**: dos datos opuestos conviviendo, y las respuestas se vuelven inestables.
- **Contaminación**: un dato erróneo se cuela y distorsiona todo lo que viene después.

Dicho de otro modo: cargar todo siempre te deja con un agente de peor criterio, no de mejor memoria. Es como meter a tu becario brillante en una sala con cien archivadores abiertos y pedirle que se concentre. La solución no es más papel sobre la mesa. Es entregarle solo la carpeta que necesita para la pregunta de ahora.

![Comparación entre cargar todo siempre y selección dinámica con control de budget](/images/blog/memoria-persistente-agente-7-archivos/memoria-persistente-agente-7-archivos-2.png)

## Selección dinámica con control de budget

Acá está la pieza que separa una herramienta de un compañero confiable. Después de cargar al arranque lo que es estable (reglas, personalidad, identidad), la memoria episódica se selecciona **según la consulta**, no toda de golpe. Y se ajusta a un presupuesto de tokens.

```python
# Pseudocódigo para ilustrar el patrón de diseño (no es ejecutable tal cual)

def obtener_memoria_contextual(self, consulta, budget=8000):
    """Selección dinámica de memoria según la consulta"""
    relevantes = (
        buscar_largo_plazo(consulta)[:3]   # lo más relevante del histórico
        + buscar_reciente(consulta)[:5]    # lo más fresco
    )
    return optimizar_para_tokens(relevantes, budget)
```

La asignación de ese presupuesto no es uniforme. En la práctica reparto el budget con prioridades claras:

```python
# Pseudocódigo: asignación de presupuesto de tokens

budget = {
    "buffer_reciente":     0.4,  # 40% - lo más nuevo, siempre prioritario
    "resumen_conversacion": 0.3, # 30% - el resumen del pasado
    "entidades_relevantes": 0.2, # 20% - personas y conceptos relacionados
    "grafo_conocimiento":   0.1, # 10% - relaciones detalladas, solo si hace falta
}
# El reparto real se ajusta por "relevancia x prioridad".
# Si una consulta toca mucho una entidad, ese espacio se expande.
```

Tres reglas que sigo siempre:

- Lo más reciente recibe presupuesto alto, sin importar la relevancia. El "ahora" casi nunca sobra.
- Lo más caro de armar (las relaciones detalladas) se usa solo cuando es claramente necesario.
- Cuando me paso del presupuesto, reduzco todos los bloques de forma pareja en lugar de cortar uno entero.

Una técnica concreta que paga muy bien: el resumen. Un buen prompt de resumen logra preservar más del 90% de la información accionable usando apenas el 10-20% de los tokens originales. Comprimes la conversación vieja, mantienes los últimos turnos en detalle, y el agente sigue "recordando" lo importante sin arrastrar cada palabra dicha. Es lo más cercano a tener memoria de largo plazo sin pagar el precio de cargarla entera.

## Implementación mínima primero, expansión después

Si algo aprendí en estos años es que no hace falta construir el sistema completo el primer día. La mejora por etapas casi siempre gana. Te dejo el camino que yo seguiría hoy.

**Etapa 1 — La corrección de cinco minutos.** Antes de tocar nada de arquitectura, agrega esto al prompt de sistema. Solo con esto ya vas a notar un salto:

```text
## Contexto de la conversación en curso
[2-3 líneas con las decisiones importantes y el avance hasta ahora]

## Preferencias y contexto del usuario
[1-2 líneas con rasgos y preferencias del usuario]

## Foco de trabajo actual
[1 línea con la tarea principal en la que estamos]
```

**Etapa 2 — Resumen diario y MEMORY.md.** Después de cada sesión importante, generas un resumen y empiezas a llenar tu `MEMORY.md`. Piénsalo así: si el diario (`memoria/AAAA-MM-DD.md`) es lo que pasó día a día, `MEMORY.md` es tu manual de operación. La disciplina está en revisar el diario cada cierto tiempo y subir a la memoria de largo plazo solo lo que de verdad importa.

**Etapa 3 — Sistema de memoria por niveles.** Recién aquí construyes la selección dinámica de verdad: buffer de lo reciente, resumen del pasado, y si tu dominio lo pide, entidades. No empieces por lo complejo. El grafo de conocimiento es poderoso, pero también es lo más caro de mantener; déjalo para cuando tengas evidencia de que lo necesitas.

**Etapa 4 — Medir.** Compara antes y después dos cosas simples: con qué frecuencia tienes que repetir la misma explicación, y qué tan bien el agente entiende el contexto sin que se lo recuerdes. Si esos dos números mejoran, vas bien.

Un `MEMORY.md` no tiene por qué ser sofisticado. Mira lo mínimo que sirve:

```markdown
# MEMORY.md — memoria de largo plazo del agente

## Perfil del usuario
- Ocupación: ingeniero de software
- Stack: Python, JavaScript, WebRTC
- Estilo de trabajo: prefiere implementación por etapas y explicaciones con código

## Proyectos en curso
- Pipeline de voz en tiempo real — meta de latencia bajo 300 ms

## Decisiones importantes
- Resumir todo lo anterior a 6 meses
- Prioridad de budget: 40% reciente / 30% resumen / 20% entidades / 10% grafo

## Reglas de actualización de memoria
- Decisión importante -> registrar de inmediato
- Cambio de preferencia -> actualizar tras ver el mismo patrón 3+ veces
- Detalle más viejo que 6 meses -> resumir o borrar
```

## De herramienta a compañero confiable

El día que mi agente dejó de preguntarme quién era yo cada mañana, algo cambió en cómo trabajábamos. Dejé de sentir que arrancaba de cero y empecé a sentir que retomábamos. Esa es la diferencia real entre una herramienta y un compañero: la herramienta responde, el compañero recuerda por qué le preguntaste.

Y la receta, al final, es menos espectacular de lo que parece. Carga al arranque lo que es estable. Selecciona dinámicamente lo que depende de la consulta. Cuídale el presupuesto de contexto como si fuera lo más escaso que tiene, porque lo es. No le des cien archivadores: dale la carpeta correcta. Resulta que el secreto para que tu agente recuerde mejor es, sobre todo, enseñarle a olvidar lo que no toca.

Empieza por la corrección de cinco minutos. El resto se construye solo, una etapa a la vez.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
