---
title: "Pedí a 3 sub-agentes de Claude Code que revisaran el mismo PR. Estuvieron en desacuerdo en el 41% de los comentarios."
description: "Tres sub-agentes de Claude Code, un PR de 500 líneas, 41% de desacuerdo y una hora gastada decidiendo qué hallazgos conservar. La Ley de Brooks sigue viva en 2026, y baja hasta el nivel de los agentes."
date: 2026-05-12
lang: es
tags: [claude-code, sub-agents, revision-de-codigo, ia]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/tres-sub-agentes-revisaron-mismo-pr-40-desacuerdo"
og_image: "https://kenimoto.dev/images/blog/tres-sub-agentes-revisaron-mismo-pr-40-desacuerdo/og-es.png"
cross_posted_to: []
---

Pensé que la revisión de código con múltiples agentes era una mejora gratis. Tres sub-agentes mirando el mismo PR sonaban como tres pares de ojos al precio del café de un ingeniero.

Luego puse a tres sub-agentes de Claude Code a revisar el mismo PR de refactorización de 500 líneas y los vi estar en desacuerdo en el 41% de los comentarios. El merge tomó una hora que yo había estimado en quince minutos. La Ley de Brooks sigue viva en 2026, y al parecer baja hasta el nivel de los agentes.

Anthropic [anunció en marzo](https://claude.com/blog/code-review) que menos del 1% de los hallazgos internos de su Code Review son marcados como incorrectos por los ingenieros. El número es real, y también es una estadística de gente operando un pipeline finamente ajustado sobre su propio código. Apenas levanté mis propios tres sub-agentes en mi propio repositorio, "estar de acuerdo" dejó de significar lo que yo pensaba.

Esta es la guía del experimento: qué configuré, qué medí y cómo se resuelven los desacuerdos. Si ustedes están pensando en montar un esquema parecido en su equipo, esta es la versión paso a paso, no la versión de marketing.

## La configuración

El PR era una refactorización de 500 líneas en la capa de señalización WebRTC de un proyecto paralelo mío. Ocho archivos, casi todo TypeScript, un par de ajustes de configuración y un nuevo tipo de error. Lo bastante aburrido como para no ser un PR de exhibición, lo bastante complejo como para que un solo revisor dejara cosas pasar.

Tres sub-agentes definidos en `.claude/agents/`, todos con Sonnet 4.6, todos restringidos a herramientas de solo lectura:

```markdown
---
name: explore-reviewer
description: Rastrear llamadores, dependientes y rutas de codigo muerto.
model: sonnet
allowed-tools: Read Grep Glob
---

Eres un arqueologo de codigo. Para cada archivo modificado, encuentra cada
llamador, cada test que lo referencie y cualquier ruta que quede en silencio
despues del cambio. Reporta citas concretas en formato file:line.
Sin opiniones de estilo.
```

```markdown
---
name: security-reviewer
description: Buscar regresiones en auth, validacion y manejo de secretos.
model: sonnet
allowed-tools: Read Grep Glob WebSearch
---

Eres un revisor de seguridad. Concentrate solo en flujos de auth, validacion
de entrada, manejo de secretos y riesgos de dependencias. Estima CVSS para
cada hallazgo. Ignora estilo y arquitectura.
```

```markdown
---
name: plan-architect
description: Evaluar decisiones de diseño contra las convenciones existentes.
model: sonnet
allowed-tools: Read Grep Glob
---

Eres un arquitecto de software. Compara las decisiones de diseño del PR con
las convenciones existentes en este codebase. Señala desviaciones, costuras
faltantes y abstracciones que van a perjudicar a la proxima persona.
```

Cada sub-agente recibió el mismo prompt: "Revisa el PR #482 línea por línea y lista hallazgos como bullets con citas file:line." Cada uno se ejecutó en su propio contexto. Ninguno vio la salida del otro. El único que ensamblaba los resultados al final era yo.

![Tres sub-agentes de Claude Code revisando el mismo PR](/images/blog/tres-sub-agentes-revisaron-mismo-pr-40-desacuerdo/sub-agents-matrix-es.png)

## Cómo se vio el 41% de desacuerdo

Cuando los tres terminaron, tenía 78 comentarios crudos en total. Abrí una hoja de cálculo y etiqueté cada uno como "lo plantearon los 3", "lo plantearon 2 de 3" o "solo 1 de 3 lo planteó".

| Cobertura | Cantidad | Porcentaje |
|---|---|---|
| Los 3 agentes lo marcaron | 14 | 18% |
| 2 de 3 agentes lo marcaron | 32 | 41% |
| Solo 1 agente lo marcó | 32 | 41% |

El balde "lo planteó 1" es lo que yo llamo desacuerdo. Los otros dos sub-agentes tenían exactamente la misma oportunidad de marcar la misma línea, con las mismas herramientas, sobre el mismo diff. Pasaron de largo. Es decir, **hay un 41% de probabilidad de que cualquier hallazgo individual sea la opinión privada de un solo sub-agente**.

El número titular de Anthropic, menos del 1% marcado como incorrecto, se mide de otra forma. Ellos cuentan los hallazgos que un ingeniero cierra explícitamente sin corregir. Yo cuento los hallazgos que dos de tres agentes mirando el mismo código no se molestaron en mencionar. Son preguntas distintas, y la segunda es la que me cuesta tiempo frente a la computadora.

## Los cuatro patrones de desacuerdo

Después de clasificar cada desacuerdo, cuatro patrones cubrían casi todo.

**Deriva de severidad.** El plan-architect marcó una falta de null check como "critical". El security-reviewer vio la misma línea y la clasificó como "low: el llamador ya valida más arriba". Ambos estaban en lo cierto, más o menos. El arquitecto leyó la función aislada. El revisor de seguridad había caminado los llamadores con grep y visto la validación previa. Misma línea, veredictos opuestos.

**Deriva de alcance.** Cuando le pedí revisar el PR, el explore-reviewer me contó alegremente sobre tres bugs preexistentes en archivos que el PR ni tocaba. El plan-architect se rehusó a comentar nada fuera del diff. No tenía forma de saber de antemano cuál comportamiento iba a recibir. Estrictamente, ambas interpretaciones son defendibles. En la práctica, una de ellas me explotó la cantidad de comentarios.

**Deriva de concreción.** El plan-architect escribió: "Considera extraer la lógica de retry a un helper compartido." El security-reviewer escribió: "Reemplaza las líneas 184-201 por `retry(opts, () => fetchToken(opts.url))` y agrega un techo de 30s, si no, la ruta de auth-refresh puede colgar el worker." Misma idea. Una la aplico en treinta segundos, la otra requiere una reunión. La concreción es un eje de varianza mucho más grande de lo que yo esperaba.

**Deriva de presupuesto de herramientas.** El explore-reviewer tenía grep y glob, y notó que la función renombrada todavía era referenciada en un script de CI que nadie había actualizado. El plan-architect, con exactamente las mismas herramientas, nunca fue a mirar allá. Misma lista de allowed-tools, mismo prompt sobre "encuentra dependientes". Uno caminó por la superficie, el otro caminó por el edificio. Acá la deriva vino de cuánto cada prompt de sistema empujaba al agente a vagar.

Si ustedes ya usaron [sub-agents de Claude Code](https://code.claude.com/docs/en/sub-agents) para algo más que una llamada Explore puntual, nada de esto sorprende. Lo que sí me sorprendió fue cómo estos cuatro baldes cubrían casi todo lo que etiqueté como desacuerdo.

## El bug que nadie atrapó

Dos días después del merge, un colega encontró una condición de carrera en la nueva ruta de manejo de errores. El PR abría una ventana de un frame donde dos intentos de reconnect podían dispararse sobre el mismo socket. Ninguno de los tres sub-agentes lo mencionó. La descripción del PR, que yo escribí a mano, sí decía "lógica de reconnect movida", y eso fue lo que hizo que el colega fuera a revisar.

"Con suficientes ojos, todos los bugs son superficiales", escribió Eric Raymond en 1999. Tuvo razón sobre los ojos. No especificó que tres de ellos tuvieran que apuntar a la misma ventana. Los míos estaban entrecerrados sobre el diff. Ninguno dio un paso atrás para preguntar: ¿qué cambió en el timing?

## Cómo resolver los desacuerdos: tres métodos

Esto es lo que aprendí después de pasar la hora extra haciendo merge. Tres formas prácticas de resolver un hallazgo donde los agentes no coinciden.

**Consenso por mayoría.** Si 2 de 3 agentes lo levantan, lo tratas como confirmado y revisas. Si solo 1 lo levanta, le bajas la prioridad por defecto. Es la regla más simple y resuelve la mayor parte de los casos "lo planteó 1" que en realidad eran ruido. Funciona bien para drift de alcance: si solo el explore-reviewer trajo un bug fuera del diff, lo registras como deuda técnica, no como bloqueante del PR.

**Override por contexto.** Cuando dos agentes disienten en la severidad, el que tiene más contexto gana. Si el security-reviewer caminó con grep a los llamadores y vio la validación previa, su "low" pesa más que el "critical" del plan-architect que leyó la función aislada. La regla operacional es simple: ¿qué agente tuvo más ventanas abiertas para decidir? Ese es el que prevalece.

**Agente extra para el desempate.** Cuando los tres están en desacuerdo o cuando un hallazgo crítico viene de un solo agente, levantas un cuarto sub-agente específico para esa pregunta. Le das las dos posturas y le pides un veredicto. Sí, es otro turno de ida y vuelta. Pero es mucho más barato que tomar la decisión equivocada y volver a tocar el PR la próxima semana.

Si ejecutaron Claude Code [autónomamente por 24 horas](/es/blog/agente-ia-autonomo-24-horas-seguridad/) y vivieron para contarlo, ya saben este patrón desde el otro lado: el cuello de botella se mueve hacia quien lee la salida del agente.

## Cuántos sub-agentes son los correctos

No creo que la respuesta sea uno. La misma semana corrí el experimento con N=1 en un PR más chico, solo una pasada de revisión general. Se le escapó el tipo de dependencia entre archivos que el explore-reviewer habría atrapado. Un par de ojos es genuinamente peor que dos.

Mi heurística actual, después de unos doce PRs en esta línea:

- PR pequeño (menos de 100 líneas, sin archivos nuevos): un sub-agente. Más que eso es overhead.
- PR mediano (100 a 500 líneas, toca un subsistema): dos sub-agentes con ángulos distintos, en general explore + security o explore + architect. Eligen el segundo según lo que el PR esté arriesgando de verdad.
- PR grande o transversal (más de 500 líneas, varios subsistemas): tres. Planeen el tiempo de integración por adelantado. No es gratis.

Por encima de tres, no he visto valor. La configuración de [nueve agentes de HAMY](https://hamy.xyz/blog/2026-02_code-reviews-claude-subagents) es interesante, pero necesitaría una segunda herramienta solo para fusionar los reportes, y tendría que ser más barata que yo.

La otra perilla es la concreción. Hoy le pido a cada sub-agente "hallazgos con el cambio concreto más pequeño que los resuelva, o marcados como no-fix si no lo sabes". Esa única línea en el prompt de sistema redujo casi a la mitad mi deriva de concreción.

## Lo que de verdad creo ahora

La revisión de código multi-agente no es gratis. Se parece más a "tres revisores junior leyendo en cuartos distintos, y tú eres el senior que tiene que fusionar sus notas". El número de ojos sube, pero el costo de integración también, y el costo de integración es la parte que vive en tu calendario.

El bug que nadie atrapó es lo que más humilde me dejó. Tres agentes, tres ángulos, todos read-only, todos apuntando al mismo diff. Ninguno notó el cambio de timing porque a ninguno se lo pidieron. **Los sub-agentes son extremadamente buenos en las preguntas que ustedes ponen en el system prompt. Son mediocres en las preguntas que ustedes olvidaron hacer.** El límite real está ahí, no en el modelo.

Si se llevan una sola cosa de esta guía: escriban un cuarto prompt de sub-agente llamado `what-am-i-not-asking`, entréguenle el diff y pídanle que nombre las categorías que los demás agentes van a dejar pasar. Lean la respuesta. Luego escriban los prompts de revisión reales. Yo no lo hice en el experimento de este post, y por eso perdí una hora en el merge y un colega encontró mi condición de carrera.

El número de menos del 1% de Anthropic es real. También está medido sobre un pipeline que alguien estuvo meses afinando, no sobre tres sub-agentes que escribieron entre reuniones. Afinen los suyos. Hasta entonces, calculen con 40%.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
