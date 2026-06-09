---
title: "Etiquetar nit vs must en cada PR: cómo bajé el merge de 48h a 24h"
description: "Poner una etiqueta de prioridad (nit no bloquea / must bloquea) al inicio de cada comentario de review le ahorra al autor el tiempo de adivinar. Aquí está el método completo, con plantilla de AGENTS.md, check de CI y métricas."
date: 2026-06-10
lang: es
tags: [code-review, conventional-comments, pull-request, equipo, productividad]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/conventional-comments-nit-must-48h-24h/"
og_image: "https://kenimoto.dev/images/blog/conventional-comments-nit-must-48h-24h/og-es.png"
cross_posted_to: []
---

Durante años, lo primero que hacía al abrir un comentario de review era un ejercicio de adivinación. "¿Esto hay que arreglarlo antes del merge, o es una opinión del revisor que puedo dejar para después?" Leía el tono, contaba los signos de exclamación, calculaba el rango del revisor en la empresa. Un trabajo de detective que nadie me había pedido y por el que nadie me pagaba.

El problema no era el comentario. Era que yo tenía que decidir su prioridad. Y mientras decidía, el PR se quedaba ahí, abierto, juntando polvo.

La solución resultó ser ridícula de simple: que el revisor ponga la prioridad. No yo. Desde que adopté Conventional Comments en mi equipo, el tiempo de PR a merge bajó de 48 horas a 24. No porque escribiéramos mejor código, sino porque dejé de hacer de detective.

Te cuento cómo funciona y cómo lo armé, paso a paso.

## El comentario que nadie sabe cómo tratar

Imagina que recibes esto en un PR:

> Quizás convendría usar `users` en vez de `userList` aquí.

¿Qué haces? Si lo arreglas, tal vez era un detalle sin importancia y frenaste el merge por nada. Si no lo arreglas, tal vez el revisor lo consideraba obligatorio y te devuelve el PR. Sin más información, la jugada segura es preguntar: "¿esto es bloqueante?". Y ahí se va medio día esperando la respuesta.

Multiplica esa pregunta por cada comentario, por cada PR, por cada persona del equipo. Eso es el peaje invisible que pagas cuando los comentarios no dicen su prioridad.

![Tabla de etiquetas de Conventional Comments con su decoración blocking o non-blocking](/images/blog/conventional-comments-nit-must-48h-24h/etiquetas-tabla.png)

## Conventional Comments: la etiqueta va primero

[Conventional Comments](https://conventionalcomments.org/) es una convención que estructura cada comentario con un formato fijo:

```
<etiqueta> [decoración]: <asunto>

[discusión]
```

La etiqueta y el asunto son obligatorios. La decoración y la discusión, opcionales. La idea es que en el primer segundo de leer el comentario ya sepas de qué tipo es.

Las etiquetas estándar son nueve:

| Etiqueta | Qué significa |
|---|---|
| **praise** | Algo que quedó bien y vale la pena decirlo |
| **nitpick** (nit) | Detalle menor, aplicarlo es opcional |
| **suggestion** | Propuesta de mejora, conviene aplicarla |
| **issue** | Un problema concreto que hay que resolver |
| **question** | Una duda, no un pedido de cambio |
| **thought** | Una idea que surgió al revisar, para conversar |
| **chore** | Tarea mecánica (un typo, un orden de imports) |
| **todo** | Algo que queda como tarea posterior |
| **note** | Apunte o información de referencia |

Y las decoraciones le suben o bajan el volumen a la etiqueta:

| Decoración | Qué significa |
|---|---|
| **(non-blocking)** | No frena el merge |
| **(blocking)** | Frena el merge hasta resolverse |
| **(if-minor)** | Aplícalo a tu criterio si el cambio es chico |

El par que más uso, y el que carga con casi todo el ahorro de tiempo, es este:

```
nitpick (non-blocking): el nombre `users` es más idiomático que `userList`.
```

```
issue (blocking): este proceso se conecta directo a la base de datos de producción. Pásalo por el proxy antes del merge.
```

Mira el primero. Ya sé que no frena el merge. Lo aplico si tengo dos minutos, o lo dejo como tarea aparte y mergeo igual. Mira el segundo. Sé que hasta no arreglarlo, no se mergea. Cero adivinación en ambos casos.

![Comparación del flujo de review: comentario sin etiqueta tarda 48 horas, comentario etiquetado tarda 24 horas](/images/blog/conventional-comments-nit-must-48h-24h/flujo-antes-despues.png)

Con la etiqueta, el contenido del comentario sigue siendo el mismo; lo que cambia es cuánto tarda el autor en decidir qué hacer con él. Y resulta que ese tiempo de decisión era la mitad de mi tiempo de review.

## Métela en AGENTS.md y los revisores IA la usan solos

Acá viene la parte que convierte una buena costumbre en un sistema que se sostiene.

Si solo le pides a tu equipo que use estas etiquetas "por las buenas", a la tercera semana la mitad se olvida. Lo que hice fue escribir la lista de etiquetas en el archivo `AGENTS.md` del repositorio. Ese archivo lo leen los revisores de IA (CodeRabbit, Copilot, Claude), así que adoptan la convención sin que yo configure nada extra.

Esto es lo que tengo en mi `AGENTS.md`:

```markdown
## Convención de comentarios de review (Conventional Comments)

Todo comentario de review empieza con una de estas etiquetas:

- praise: reconocer algo bien hecho
- nitpick (non-blocking): detalle menor, aplicar es opcional
- suggestion (if-minor): aplícalo a criterio del autor si el cambio es chico
- issue (blocking): problema concreto, hay que resolverlo antes del merge
- question: una duda, no un pedido de cambio
- thought: idea para conversar

Ejemplos:
- "nitpick (non-blocking): el nombre `users` es más idiomático"
- "issue (blocking): falta la verificación de null acá"
- "question: ¿por qué `useLayoutEffect` y no `useEffect`?"
```

Con eso en el repositorio, el revisor de IA empieza a devolver comentarios con el mismo formato exacto. Las personas del equipo usan la misma lista. De golpe, todos los comentarios del PR (de humanos y de máquinas) hablan el mismo idioma. La consistencia deja de depender de la memoria de cada quien.

Un detalle de 2026 que vale tener presente: las herramientas de review con IA ya distinguen solas entre lo accionable y lo menor. En una prueba reciente sobre 30 PRs, [CodeRabbit dejó 89 comentarios, de los cuales 52 eran accionables y correctos](https://www.morphllm.com/comparisons/coderabbit-vs-copilot). Si tu `AGENTS.md` les da el vocabulario de etiquetas, esa distinción que ya hacen queda anotada con tu convención en vez de en su propio formato.

## La plantilla de PR, más un portero en el CI

El cuerpo del PR también se automatiza. Pongo un `.github/pull_request_template.md` con las secciones obligatorias:

```markdown
## Resumen

(El objetivo del cambio en 1-2 líneas)

## Cambios

(Los puntos principales, en lista)

## Verificación

### GIF / capturas
(Evidencia de que funciona)

### URL de preview
(El deploy de preview de Vercel / Netlify)

### Pasos para verificar
(Cómo lo comprueba el revisor a mano)

## Alcance del impacto

(Qué otras partes podría tocar este cambio)

## Cómo revertir

(El plan de rollback si algo sale mal)

## Checklist

- [ ] Adjunté el GIF / la URL de preview
- [ ] Agregué o actualicé las pruebas relacionadas
- [ ] AGENTS.md no necesita cambios, o ya los hice
- [ ] Revisé el alcance del impacto
```

Y acá viene mi parte favorita, porque va contra la intuición. Esta plantilla la podrías borrar al abrir el PR. Para que no pase, pongo un portero en el CI que rechaza el PR si faltan las secciones clave:

```yaml
name: PR Body Check
on:
  pull_request:
    types: [opened, edited]

jobs:
  check-pr-body:
    runs-on: ubuntu-latest
    steps:
      - name: Verificar secciones obligatorias
        run: |
          BODY="${{ github.event.pull_request.body }}"
          for section in "## Verificación" "## Alcance del impacto" "## Cómo revertir"; do
            if ! echo "$BODY" | grep -q "$section"; then
              echo "Falta la sección: $section"
              exit 1
            fi
          done
```

Sé lo que estás pensando: "¿no es molesto obligar a llenar una plantilla?". Sí, lo es. Y esa molestia es justo el punto. La fricción de escribir el plan de rollback es la que te hace pensar el plan de rollback. Si lo dejara opcional, nadie lo escribiría, y el día del incidente nadie sabría cómo revertir. La fricción acá no es un defecto: es la que sostiene la calidad.

## Lo que es mecánico, que lo arregle la máquina

Hay una categoría de comentarios de review que ni siquiera deberían existir como comentarios. Los llamo **autoFixable**: cosas que se arreglan de forma mecánica, sin criterio humano.

- Formato roto (lo endereza Prettier o Biome)
- Lint simple (un import sin usar, un `console.log` que quedó)
- Typos
- Errores de tipo triviales (un tipo de retorno que falta, un `any` implícito)

Para nada de esto vale la pena que un humano escriba un comentario y otro humano lo lea. Lo paso a un comando que ejecuta el equipo de IA:

```
/auto-fix
```

Adentro hace tres cosas: ejecuta el lint y el formateo con autocorrección, detecta los errores de tipo simples y propone el arreglo, y deja el commit con el push hecho.

Las herramientas de review ya traen esto de fábrica. El [Autofix de CodeRabbit](https://www.buildmvpfast.com/blog/best-ai-code-review-tools-anthropic-2026) (acceso temprano, abril de 2026) lanza su propio agente, escribe el arreglo y lo commitea a la rama, aunque por diseño no hace auto-merge. Copilot puede pasarle la sugerencia a un agente en la nube que abre un PR con el arreglo.

El reparto queda claro: lo mecánico lo hace la máquina, y los humanos junto con los revisores de IA se concentran en lo que sí pide criterio, las decisiones de diseño y los problemas de patrón. Tu cerebro de senior no debería gastarse en mover una coma.

## Mide, porque "se siente más rápido" no es un dato

Armar todo esto sin medir sería confiar en mi propia sensación, y mi sensación es pésima jueza. Estas son las cuatro métricas que miro cada semana:

| Métrica | Cómo se calcula | Objetivo |
|---|---|---|
| **time-to-first-review** | De abrir el PR al primer comentario | Menos de 1 día hábil |
| **time-to-merge** | De abrir el PR al merge | Menos de 3 días hábiles |
| **blocking-comment-rate** | Comentarios issue (blocking) / total de comentarios | 20% o menos |
| **first-pass-merge-rate** | PRs que se mergean sin devolución | 50% o más |

Cada número apunta a una causa distinta cuando se mueve.

Si baja el **first-pass-merge-rate**, casi siempre es que se saltó alguna automatización: los hooks locales están flojos, falta la review de IA, o nadie usó el self-review antes de abrir el PR.

Si sube el **time-to-first-review**, o los revisores están saturados, o los PRs vienen demasiado grandes. Cuando es lo segundo, vuelvo a insistir con la cultura de PRs chicos.

La review no es un trámite de "ya lo miré, dale": es el proceso donde se fabrica la calidad. Las cuatro piezas (las etiquetas, el `AGENTS.md`, la automatización del CI y las métricas) recién juntas convierten la review de una costumbre en un sistema.

## Por dónde empezar mañana

Si tuviera que rehacer todo desde cero, este es el orden que seguiría:

1. **Mañana mismo:** empieza a poner `nit:` y `must:` (o `issue (blocking):`) en tus propios comentarios de review. Una persona sola ya nota la diferencia.
2. **Esta semana:** copia la lista de etiquetas a `AGENTS.md`. Los revisores de IA empiezan a usarla de inmediato.
3. **Este mes:** suma la plantilla de PR con el check de CI, y pasa lo mecánico a un comando de auto-fix.
4. **A partir de ahí:** mide las cuatro métricas cada semana y ajusta donde duela.

Lo único que de verdad cambió mi flujo no fue una herramienta cara ni un proceso elaborado. Fueron seis caracteres al inicio de un comentario: `nit: ` y `must: `. Dejé de hacer de detective, y el PR dejó de juntar polvo. Cada quien hace su parte, y la máquina la suya. Vamos con todo.

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
