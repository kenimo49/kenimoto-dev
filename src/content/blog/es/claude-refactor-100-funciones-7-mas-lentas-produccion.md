---
title: "Le pedí a Claude que refactorizara 100 funciones. 7 quedaron más lentas en producción"
description: "Claude Code refactorizó 100 funciones de mi servicio en Python. CI verde, mutation testing también. Dos semanas después, on-call me llamó porque p95 había crecido en 7 endpoints. Esta es la guía LatAm con los 4 pasos que ahora aplico antes de mergear cualquier refactor hecho por IA, con un checklist concreto."
date: 2026-05-24
lang: es
tags: [claudecode, refactoring, performance, ia]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/claude-refactor-100-funciones-7-mas-lentas-produccion/"
og_image: "https://kenimoto.dev/images/blog/claude-refactor-100-funciones-7-mas-lentas-produccion/og-es.png"
cross_posted_to: []
---

Le pedí a Claude Code que refactorizara 100 funciones de un servicio en Python que mantengo. Lo hizo en dos pasadas. CI quedó en verde en ambas. La descripción del PR estaba tan ordenada que casi me sentí mal mergeando un viernes por la tarde.

Dos semanas después, on-call me despertó porque el p95 de un endpoint había subido de 180 ms a 240 ms. Empecé a hacer bisect. El bisect cayó en el PR del refactor. Empecé a leer el PR del refactor. 7 de las 100 funciones eran más lentas en producción. CI nunca lo detectó porque CI no mide "más lento". Mide "devuelve el mismo valor".

Este artículo es una guía práctica para LatAm. No es "no uses Claude para refactorizar", porque después de los 7 problemas refactoricé otras 240 funciones con el flujo nuevo y no tuve regresiones. Es la lista concreta de 4 pasos que ahora aplico antes de mergear cualquier refactor hecho por IA, con los patrones específicos que CI no ve.

## El contexto, para que sepas si esto te sirve

El servicio: Python 3.12, unos 18 mil líneas de lógica de negocio, FastAPI en el borde, asyncpg contra Postgres, cache en Redis y un módulo de scoring CPU-bound que se ejecuta en cada request. Las 100 funciones eran un lote curado: chicas a medianas, puras donde se podía, todas con tests unitarios.

Le pedí a Claude Code que aplicara un conjunto estándar de mejoras: early returns, variables extraídas para números mágicos, comprensiones donde el loop hacía una sola cosa, conversión a dataclass para tuplas ad hoc. Sin reescrituras. Sin cambios arquitectónicos. Sin tocar nada que no estuviera en el alcance del refactor.

Dos lotes de 50, cada uno como un PR aparte, cada uno con su propio run de CI en una máquina de 8 cores. Los tests unitarios pasaron. Una corrida de mutation testing con `mutmut` quedó limpia, la tasa de kill subió de 78% a 81%. Por todas las señales que tenía, el código era equivalente y un poco mejor.

Que es exactamente el tipo de confianza que termina con una llamada a las 7:42 pm del viernes durante la cena de cumpleaños de mi pareja.

![Línea de tiempo: día 0 refactor de 100 funciones, día 0 CI verde, día 14 alerta de on-call con 7 funciones más lentas en producción](/images/blog/claude-refactor-100-funciones-7-mas-lentas-produccion/timeline.png)

## Los 3 patrones que aparecieron en las 7 funciones lentas

Cuando me senté a leer las 7 funciones lentas en paralelo, aparecieron tres patrones. Ninguno es obvio. Los tres son del tipo que CI no puede detectar por su forma de funcionar.

**Patrón 1: comprensiones que recorren dos veces.** Cuatro de las 7 eran loops que Claude convirtió en list comprehension. La comprehension estaba correcta. También estaba recorriendo el input dos veces, una para filtrar y otra para mapear, porque Claude había separado el predicado y la proyección para que se lea mejor. El loop original hacía las dos cosas en una sola pasada con un `if` y un `continue`. En una lista de 50 elementos que se procesa una vez por request, la diferencia era 1,4 ms. En el hot path, multiplicado a lo largo del request, eran unos 12 ms de p95.

Lo habría detectado en code review si hubiera leído el código viejo y nuevo línea por línea. No lo hice, porque el diff parecía un cleanup de manual y el test pasaba.

**Patrón 2: early returns que rompían un cache.** Dos de las 7 usaban `@functools.lru_cache` en la función externa. Claude agregó un guard clause que devolvía `None` con input inválido antes de la consulta al cache. La intención era defensiva. El efecto fue que el cache dejó de poblarse para todo el camino de input válido, porque la función ahora retornaba por una ruta que no estaba memoizada. La tasa de hit cayó de 91% a 6% en esa función. La función en sí era rápida. La caída de 85 puntos de hit rate no lo era.

Esto no lo detectas en un test unitario. Lo detectas en un load test, o en producción, o leyendo la función con la pregunta "¿cuál era el rol de esta función en el sistema, no solo cuál es su contrato?".

**Patrón 3: conversión a dataclass que rompió el fast path de asyncpg.** Una función devolvía una tupla que asyncpg podía desempaquetar directamente en su decoder de filas. Claude convirtió la tupla a un dataclass con los mismos campos, que estructuralmente es más limpio y semánticamente idéntico. También forzó una allocation adicional y un llamado a `__init__` por fila. Con 800 filas por request y 30 requests por segundo, suma unos 8 ms de p95.

Este es mi favorito, porque es el ejemplo más limpio de "el refactor está bien y el refactor está mal". El código lee mejor. El sistema va más lento.

## Por qué CI y mutation testing dijeron que sí

Un párrafo sobre esto, porque me llevó un tiempo internalizarlo.

Los tests unitarios verifican que la función devuelva el mismo valor para el mismo input. No verifican que lo devuelva más o menos en el mismo tiempo, con más o menos el mismo patrón de allocations, sosteniendo más o menos los mismos locks. El mutation testing verifica que tus tests noten si la lógica del código cambia. Tampoco notaría "esta función ahora hace allocation de un dataclass por fila en vez de desempaquetar una tupla", porque los mutators del mutation testing no incluyen "cambia la estructura de datos".

Dicho de otra forma: todas las herramientas que tenía en mi pipeline de CI respondían a la pregunta "¿este código es correcto?". Ninguna respondía a "¿este código sigue siendo igual de rápido?". Esa brecha es exactamente donde aterrizaron los refactors de Claude. Los cleanups estaban bien. Solo que eran más lentos de maneras que solo aparecen con tráfico real.

Mi CI estaba en verde. Mis funciones simplemente eran más lentas. CI no mide "más lento".

## Los 4 pasos que ahora aplico antes de mergear

Después del llamado de on-call armé un flujo de cuatro pasos para todo refactor que toque el hot path. Tres son automatizados. El cuarto es una lectura de 10 minutos. Lo comparto porque leí todos los artículos del estilo "deja que la IA refactorice tu código" del trimestre, y ninguno menciona verificación de performance.

### Paso 1: benchmark base antes del refactor

Ejecuto `pyinstrument` sobre los top 20 endpoints con una traza grabada que reproduce la forma del tráfico de producción, y guardo el reporte. El reporte nombra cada función del hot path con su p50, p95 y conteo de allocations. Antes del refactor, tienes que saber cuáles funciones importan. Sin esta base no puedes decir "esta función se puso más lenta", solo puedes decir "el servicio se siente más lento", que es justo lo que me trajo hasta aquí.

### Paso 2: el mismo benchmark después del refactor, con diff

Misma traza, mismo script, diff entre los dos reportes. Un desvío de más de 5% en cualquier función del top 50 por self-time es una alerta. No un bloqueo. Una alerta, vas e investigas.

### Paso 3: un soak con forma de carga real

Ejecuto `locust` por 10 minutos al 80% del pico de carga de producción contra el build refactorizado, y miro la tasa de hit del cache, la tasa de allocations y el tiempo de adquisición de conexiones a la base de datos. Esto es lo que habría detectado la regresión del `lru_cache`. Una caída de hit rate de 91% a 6% grita en un soak de cinco minutos. En tests unitarios queda en silencio para siempre.

### Paso 4: leer el diff buscando "cambios estructurales que pedí vs los que recibí"

Abro el diff, busco cada función modificada y me hago una sola pregunta: "¿este cambio tocó la estructura de datos, el patrón de iteración, el límite del cache o la adquisición de locks?". Si la respuesta es sí, va a una segunda lista para lectura lenta. La lectura lenta lleva unos 10 minutos por cada 100 funciones. Habría detectado 5 de mis 7 casos.

Ahora trato los refactors hechos por IA como un PR de un junior: confío en el estilo, verifico la sustancia, y nunca mergeo sin un load test si tocó el hot path. Suena duro. Es el mismo estándar que usaría para una persona del equipo. La diferencia es que con una persona puedes preguntar "¿por qué cambiaste esto?" y te da una razón. Con Claude obtienes un diff estructuralmente limpio y un campo de comentarios vacío.

## Lo que no hago

No evito a Claude para refactorizar. Después de las 7 regresiones, mergeé otros 240 refactors con el flujo de cuatro pasos y no hubo más regresiones en producción. El flujo agrega unos 20 minutos por lote de 50 funciones. Son 20 minutos contra semanas de bisect y un llamado de viernes.

Tampoco mezclo refactor con feature. Los PRs de refactor son de refactor. Los PRs de feature son de feature. Cuando se mezclan no puedes bisectar una regresión a una sola causa, y los refactors hechos por IA son máquinas de detectar patrones, lo que significa que el tipo de regresión que causan aparece en grupo y no en un commit aislado. Mantener los PRs separados fue lo que hizo posible encontrar todo esto en un día y no en una semana.

La lección, si hay una, es chica: lo aburrido que CI no mide es justo donde los refactors hechos por IA dejan huella. Mídelo.

---

Si te sirvió, te puede gustar [Spec-Driven Development con asistentes de IA: la guía LatAm](https://kenimoto.dev/es/blog/spec-driven-development-asistentes-ia-guia-latam/) y [Claude escondió mi bug 3 veces: 10 hábitos de debugging que sí ayudan](https://kenimoto.dev/es/blog/claude-escondio-mi-bug-3-veces-10-habitos-debug/). Mismo tema de fondo: Claude se ve seguro, el diff se ve limpio, el sistema dice otra cosa. Diferentes formas de fallar.

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
