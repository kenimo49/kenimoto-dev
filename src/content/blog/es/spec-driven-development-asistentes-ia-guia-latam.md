---
title: "Spec-Driven Development con asistentes de IA: la guía LatAm para escribir specs antes del primer prompt"
description: "Las herramientas de IA prometen que ya no necesitas escribir specs. Lo creí seis meses, hasta que Claude Code generó tres veces seguidas un sistema de cupones que se aplicaba descuento a sí mismo. Esta es la guía práctica que me hubiera ahorrado el rodeo."
date: 2026-05-09
lang: es
tags: [ia, claudecode, spec, openapi]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/spec-driven-development-asistentes-ia-guia-latam/"
og_image: "https://kenimoto.dev/images/blog/spec-driven-development-asistentes-ia-guia-latam/og-es.png"
cross_posted_to: []
---

Las herramientas de IA prometen que ya no necesitas escribir specs. Yo lo creí durante seis meses. Hasta que Claude Code generó tres veces seguidas un sistema de cupones que se aplicaba descuento a sí mismo.

La primera vez me reí. La segunda asumí que el prompt era el problema. La tercera cerré el editor, abrí un archivo YAML y empecé a escribir OpenAPI con la cara de quien acaba de perder una discusión con la realidad.

Este artículo es una guía práctica. Si tú también escuchaste que "el spec es overhead" y quieres saber por qué la onda de 2026 está volviendo al spec-first con asistentes de IA, acá tienes el flujo completo, los tres patrones que funcionan y las trampas en las que caí.

## Por qué el "solo escribir el prompt" ya no alcanza en 2026

El flujo que todo el mundo probó al menos una vez: abrir Claude Code, decir "haz un checkout con descuento de socio y campo de promo", mirar al agente generar 400 líneas de Flask con confianza, ejecutar, fallar, reescribir el prompt. Repetir hasta que pierdes la paciencia o subes algo que más o menos funciona.

El problema está en otro lado: tú mismo no aclaraste las reglas. Cuando le pides "10% de descuento de socio, promos sumables, máximo 30% del total" sin formalizar nada, el modelo adivina. Adivina distinto cada vez. Y un modelo confiado adivinando es exactamente cómo aparecen bugs como "el cupón se aplica a sí mismo".

Sí, soy el ingeniero que dijo "es solo prompt" en un hilo la semana pasada y después gastó cinco rondas de PR explicando qué quería decir "solo".

## Los 15 minutos que ahorran 5 rondas de PR

Por terquedad, hice lo que llamaba overhead. Escribí un OpenAPI. Endpoint, forma del request, forma del response, códigos de error, restricciones por campo. Quince minutos.

```yaml
paths:
  /api/orders:
    post:
      requestBody:
        application/json:
          schema:
            customer_id: string
            items: array of OrderItem
            promo_code: string | null
      responses:
        201:
          schema:
            order_id: string
            subtotal: integer (minimum 0)
            member_discount: integer (0..subtotal * 0.1, integer)
            promo_discount: integer
            total: integer
            applied_rules: array of string
        400:
          schema:
            error: { code, message }
```

Y un Gherkin con tres escenarios. Socio sin promo. No socio con promo. Socio con promo donde el tope del 30% activa.

```gherkin
Escenario: Socio con promo, limitado al 30% del total
  Dado un socio autenticado
  Y un carrito con subtotal de USD 100
  Cuando aplica el promo "OTOÑO5"
  Entonces member_discount es USD 10
  Y promo_discount es USD 20
  Y total es USD 70
  Y applied_rules contiene "socio" y "promo:OTOÑO5"
```

Le pasé los dos archivos a Claude Code con una sola frase: "implementa estas specs en Flask, con validación y manejo de errores". Generó alrededor del 80% de la implementación en tres minutos. El 20% restante era lógica de dominio real (qué cuenta como "sumable", qué pasa en el tope). Eso lo escribí yo. El spec hacía imposible confundirse al respecto.

Quince minutos de YAML para borrar cinco rondas de PR. La versión ruidosa de ahorrar quince minutos gastando dos horas, salvo que esta vez los gasté del lado correcto.

## Por qué el spec funciona (no es magia, es un forcing function)

La razón no tiene que ver con que Claude Code se vuelva más inteligente cuando le das más texto. Tiene que ver con lo que tú, humano, te ves obligado a pensar mientras escribes el spec.

Cuando escribo `member_discount: integer (0..subtotal * 0.1, integer)`, me comprometí con la idea de que el descuento de socio es como máximo el 10% del subtotal, en centavos enteros. El spec no puede generar una versión que "aplica el cupón a sí mismo" porque el spec no tiene un destinatario con forma de cupón para esa recursión. La ambigüedad muere en el YAML antes de mutar a bug en Python.

Esto no es invento mío. La ola de herramientas spec-first de 2026 ([OpenSpec](https://github.com/Fission-AI/OpenSpec), [cc-sdd](https://github.com/gotalab/cc-sdd), [amux](https://amux.io/guides/spec-driven-development/), [Kiro](https://kiro.dev)) está construida sobre la misma observación. GitHub Copilot Workspace ni siquiera te deja saltar el paso: genera una "proposed specification" editable antes de tocar el código, porque el equipo que lo construyó descubrió que el spec es el único artefacto del flujo que un humano puede revisar de verdad.

## Los tres patrones que vale la pena adoptar

Después de un trimestre con este flujo, estos son los tres patrones que tiran del carro.

![Spec-Driven Development con Claude Code: tres patrones](/images/blog/spec-driven-development-asistentes-ia-guia-latam/three-patterns.png)

### Patrón 1: OpenAPI a implementación

**Flujo**:

1. La persona arquitecta escribe el OpenAPI completo del endpoint.
2. Le pide a Claude Code: "implementa este OpenAPI en Flask/FastAPI".
3. El agente genera el 80% del stub: serialización, deserialización, validación básica, manejo de errores HTTP.
4. La persona desarrolladora agrega la lógica de dominio.

**Cuándo aplica**: CRUD, endpoints REST estándar, integraciones con terceros.

**Cuándo no**: lógica de negocio donde el "qué" del spec todavía está en discusión.

### Patrón 2: Gherkin a step definitions

**Flujo**:

1. QA o producto escribe escenarios en Dado/Cuando/Entonces.
2. Le pide a Claude Code: "implementa los step definitions en `pytest-bdd`".
3. El agente genera los esqueletos de las steps.
4. La persona desarrolladora completa la lógica.

**Cuándo aplica**: features con reglas de negocio que tu QA o producto necesita revisar antes del código.

**El movimiento clave**: los mismos escenarios alimentan el prompt de implementación y el de tests. Así el agente no puede divergir entre "lo que el código hace" y "lo que el test verifica". La divergencia entre ambos es donde los bugs llegan a producción.

### Patrón 3: Spec a property tests

A partir del schema OpenAPI:

```yaml
price:
  type: integer
  minimum: 0
  maximum: 1000000
```

Le pides a Claude Code generar property-based tests con Hypothesis o fast-check. Salen automáticamente los boundary cases:

```python
def test_price_minimum(): ...
def test_price_maximum(): ...
def test_price_negative(): ...   # debe rechazar
def test_price_overflow(): ...
def test_price_null(): ...
```

**Cuándo aplica**: cualquier campo numérico, fechas, strings con regex. O sea, casi todos.

Es el patrón que más subutilicé los últimos años y del que más me arrepiento. Property tests cubren el espacio de errores que tu cerebro no recuerda enumerar a las 11 PM de un viernes.

## Las trampas que me costaron caro

Tres cosas te van a morder si no prestas atención.

### Trampa 1: specs vagos generan código vago

Si tu OpenAPI dice `discount: number` en lugar de `discount: integer (0..subtotal*0.1)`, el modelo adivina. Adivina distinto cada vez. Un spec vago es una fábrica de alucinaciones que pagas en horas-PR.

SDD funciona como forcing function sobre ti. Nada de hechizos mágicos.

### Trampa 2: nunca confíes en el código generado sin revisarlo

Bugs que subí a producción desde código generado en los últimos tres meses:

- Una query SQL armada con concatenación de strings (inyección esperando suceder).
- Un JWT guardado en `localStorage` (tenía que ser `httpOnly` cookie).
- Un N+1 silencioso sobre una tabla de mil filas.

El agente no escribió ninguno de esos por maldad. Los escribió porque nada en el spec decía "no". Los specs necesitan una sección de constraints explícitos. Si quieres ver lo creativo que se pone un agente cuando no hay constraints, mira [mi artículo sobre 24 horas de agente autónomo](/es/blog/agente-ia-autonomo-24-horas-seguridad/).

### Trampa 3: el agente agrega requisitos que no pediste

Vi a Claude Code agregar autenticación a un endpoint cuyo spec decía "público, solo rate-limited". El agente había leído suficiente Stack Overflow para creer que todo endpoint debería estar autenticado, y silenciosamente metió un check.

Los specs tienen que ser explícitos sobre lo que el sistema *no* hace, no solo sobre lo que sí hace. Una sección `## Out of scope` con "auth: ninguna en este endpoint" evita exactamente este caso.

## Checklist práctica para empezar mañana

Si quieres implementar este flujo en tu proyecto LatAm el próximo sprint, esta es la lista mínima:

- [ ] Escribe el OpenAPI del endpoint que vas a tocar (15 minutos máximo)
- [ ] Escribe tres escenarios Gherkin: camino feliz, edge case, error
- [ ] Agrega una sección `## Out of scope` con auth, rate limit, cache, lo que el agente pueda inventar
- [ ] Asegúrate de que tu `CLAUDE.md` describa convenciones del proyecto
- [ ] Pásale los tres archivos a Claude Code
- [ ] Genera. Revisa el diff contra el spec, no contra la "intuición"
- [ ] Ejecuta los property tests que el spec generó

Es un flujo que se siente burocrático los primeros tres usos y se siente liberador desde el cuarto. La trampa es no abandonarlo en el primer caso donde el spec parece "obvio". El spec es la red de seguridad para los casos donde el agente y tú van a estar en desacuerdo, no para los casos donde están de acuerdo.

## Contexto regional: por qué LatAm tiene una ventaja acá

Dos cosas juegan a favor de los equipos LatAm que adoptan spec-driven development con IA en 2026.

**Primera: la regulación todavía es maleable.** A diferencia de Europa con AI Act o Brasil con LGPD muy madura, los marcos regulatorios en México, Argentina, Colombia y Chile están en proceso. Adoptar specs auditables ahora te pone en posición de cumplir cuando llegue la normativa, en vez de tener que adaptar todo después.

**Segunda: el inglés del spec no es barrera.** OpenAPI y Gherkin se pueden escribir en inglés (estándar de la industria) o en español. Yo recomiendo Gherkin en español para que tu QA y producto puedan revisarlo, y OpenAPI en inglés para que las herramientas (Swagger UI, generadores de cliente) funcionen sin sorpresas.

## Conclusión: el spec es el pedal de freno

Spec-driven development no es una metodología que adoptas porque alguna consultora se la vendió a tu CTO. Es el mecanismo más barato que conozco para no estar en desacuerdo con un junior rápido, confiado y ligeramente borracho.

Los asistentes de IA no le bajan el valor al spec. Convierten specs ambiguos en bugs caros más rápido que cualquier humano. El spec es el pedal de freno. Sin pedal, igual vas rápido. Solo que vas rápido hacia donde apuntaba el training data del agente la última vez.

Quince minutos de YAML. Cinco rondas de PR borradas. Empieza por el próximo endpoint que toques.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
