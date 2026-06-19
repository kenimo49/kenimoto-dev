---
title: "Tu backend dice p99=50ms y el usuario ve 3 segundos: la asimetría que solo el trace_id resuelve"
description: "El backend reporta todo en verde y los usuarios siguen quejándose de lentitud. Nadie miente: cada lado mide una realidad distinta. Esta asimetría de observabilidad entre frontend y backend solo se cierra cuando un mismo trace_id conecta toda la ruta de una petición, desde el clic en el navegador hasta la query a la base de datos."
date: 2026-06-20
lang: es
tags: [observabilidad, opentelemetry, trazas, frontend, backend]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/asimetria-observabilidad-trace-id/"
og_image: "https://kenimoto.dev/images/blog/asimetria-observabilidad-trace-id/og-es.png"
---

Hay una escena que se repite en casi todos los equipos: soporte recibe quejas de que la aplicación va lentísima, el equipo de backend abre su dashboard, ve todo en verde y responde "por nuestro lado está todo bien". Las dos cosas son ciertas al mismo tiempo. Y ahí empieza el problema.

Nadie está mintiendo. Es como un juicio donde todos los testigos son honestos pero sus testimonios no coinciden: cada uno reporta con precisión lo que ve desde su posición. El backend ve la latencia de su propio servidor. El frontend ve lo que sufre el usuario en su navegador. Son dos realidades distintas medidas con dos relojes distintos. A esa brecha estructural la llamo **asimetría de observabilidad**, y es la razón por la que tantos incidentes terminan en "no se reproduce".

Antes de seguir, una aclaración para no repetirme: ya escribí sobre [los 300ms de latencia en agentes de voz](https://kenimoto.dev/es/blog/anatomia-latencia-voz-300ms/), pero aquello era sobre el desglose interno de un pipeline de audio. Esto es otra cosa. Esto es la brecha entre lo que mide el frontend y lo que mide el backend de la *misma* petición, y cómo cerrarla.

## El mismo número, dos significados

Tomemos la latencia, que es donde más duele.

Cuando el backend dice "la latencia está bien", normalmente habla de su tiempo de procesamiento: desde que recibe la petición hasta que envía la respuesta. Lo reporta en percentiles como p50, p95 o p99. Un p99 de 50ms suena impecable.

Cuando el usuario dice "esto va lento", habla de tiempo percibido: desde que tocó el botón hasta que la pantalla cambió. Eso se mide con Core Web Vitals — LCP para la carga, INP para la respuesta a la interacción. Y aquí está el detalle que casi nadie cruza: Google evalúa Core Web Vitals en el **percentil 75 de usuarios reales**, sobre una ventana móvil de 28 días, en dispositivos y redes reales ([web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)). El umbral de LCP "bueno" es menos de 2.5 segundos; el de INP, menos de 200ms.

Fíjate en la trampa. El backend mide p99 sobre el tiempo del servidor. El frontend mide p75 sobre el tiempo percibido. Son percentiles distintos, ventanas distintas y tramos distintos. Por eso el p99 de 50ms y los 3 segundos que ve el usuario pueden ser verdad a la vez: entre los dos hay un ida y vuelta de red, resolución de DNS, handshake TLS, descarga y ejecución de JavaScript, y el renderizado del DOM. Nada de eso entra en el tramo que mide el backend.

(El par "50ms contra 3 segundos" es mi ilustración, no un dato de un estudio. Pero el mecanismo está documentado: un caso típico es un p50 de 200ms que esconde un p95 de 4 segundos concentrado solo en el flujo de checkout o solo en usuarios móviles de cierta región — [middleware.io](https://middleware.io/blog/frontend-performance-metrics-rum-real-user-impact/).)

## La trampa de la agregación

¿Por qué el backend no ve esos 4 segundos? Por el promedio.

Cuando promedias la latencia sobre miles de peticiones, los outliers desaparecen. Un p50 de 200ms se ve aceptable aunque el p95 sea de 4 segundos, y el dashboard estándar no te dice que esas peticiones lentas ocurren exclusivamente en el carrito de compras, o solo en cierto dispositivo. El monitoreo de backend te avisa si la API se cae o devuelve errores, pero no puede decirte si el usuario está sufriendo cargas lentas por scripts de terceros, imágenes pesadas o renderizado del lado del cliente ([KloudMate](https://blog.kloudmate.com/frontend-observability-why-backend-monitoring-alone-isnt-enough)). Todo verde en el servidor, y el usuario igual ahogándose.

Aquí está el mapa de la asimetría, señal por señal:

| Señal | Backend mide | Frontend mide | Dónde se rompe |
|---|---|---|---|
| Error | Fallo del sistema | Experiencia rota del usuario | El backend devuelve 200 y el frontend igual falla |
| Latencia | Tiempo de servidor (p99) | Tiempo percibido (LCP, INP, p75) | p99=50ms y el usuario espera 3s |
| Logs | Estructurados, automáticos | Hay que enviarlos, explotan en volumen | Los logs del frontend pueden no llegar nunca |
| Trazas | Maduras, estables | Aún experimentales | El navegador es el tramo ciego |

![Matriz de la asimetría de observabilidad: backend mide tiempo de servidor y frontend mide tiempo percibido, conectados por un trace_id](/images/blog/asimetria-observabilidad-trace-id/og-es.png)

## La asimetría no se elimina, se conecta

Aquí viene la parte importante, y es contraintuitiva: la asimetría no se puede eliminar. El frontend y el backend se ejecutan en entornos distintos y observan cosas distintas; eso no va a cambiar. Lo que sí puedes hacer es **conectar las dos vistas con un mismo identificador de petición**: el trace_id.

La idea es que el mismo trace_id viaje desde el clic en el navegador hasta la query a la base de datos. Cuando el usuario reporta "tardó 3 segundos" y el backend dice "lo procesé en 50ms", en vez de discutir, los dos abren la misma traza y ven el cuadro completo: 50ms de servidor, 200ms de red ida y vuelta, 2.5 segundos de ejecución de JavaScript y renderizado. La discusión sobre quién tiene razón se acaba, porque los dos están viendo la misma película.

El mecanismo concreto es el W3C Trace Context: el SDK de navegador de OpenTelemetry inyecta cabeceras de contexto de traza (`traceparent`, `tracestate`) en cada petición HTTP, y el backend las extrae y continúa la traza ([OpenTelemetry](https://opentelemetry.io/docs/concepts/context-propagation/)). Es el mismo estándar que ya usas entre servicios de backend, extendido hasta el navegador. Hoy el estándar va por su Level 2, en fase de Candidate Recommendation en el W3C ([W3C](https://www.w3.org/blog/news/archives/9885)).

## Dos cosas que te van a morder al implementarlo

Como esto es una guía y no un folleto de marketing, te ahorro los dos golpes que casi todos nos llevamos.

**Primero: el preflight de CORS.** Para que la propagación funcione, el backend tiene que aceptar explícitamente las cabeceras `traceparent` y `tracestate` en su política de CORS (en `Access-Control-Allow-Headers`). Si no lo haces, el preflight de CORS bloquea la petición antes de que el trace_id llegue siquiera al servidor, y te quedas mirando un trace que se corta justo en la frontera. Es el error más común y el más silencioso.

**Segundo: la instrumentación de navegador sigue siendo experimental.** En OpenTelemetry, el SDK de JavaScript tiene soporte estable para métricas y trazas, pero la instrumentación del lado del navegador todavía está marcada como experimental en 2026 ([oneuptime](https://oneuptime.com/blog/post/2026-02-06-opentelemetry-stability-levels-stable-beta-alpha/view)). Traducción práctica: el tramo del backend es terreno firme, el del navegador todavía se mueve. Planifica para cambios, fija versiones y no asumas que la API de hoy es la de dentro de seis meses.

Si no quieres montar todo a mano, las plataformas de RUM y APM ya ofrecen correlación automática de dos vías entre la sesión del usuario y las trazas del backend; por ejemplo, Datadog admite tanto su propagador propio como el estándar W3C `traceparent`, y solo te pide declarar las URLs a instrumentar y agregar la cabecera al CORS ([Datadog](https://docs.datadoghq.com/opentelemetry/correlate/rum_and_traces/)). El estándar abierto debajo es el mismo; cambia quién te arma el dashboard.

## Por dónde empezar

No hace falta instrumentar todo el sistema el primer día. El punto de partida es más barato y más útil de lo que parece: piensa en el último incidente donde "el backend estaba bien pero el usuario estaba mal", e identifica a qué fila de la tabla de arriba correspondía. ¿Era latencia (p99 contra percibido)? ¿Era un error que el backend nunca vio? Esa clasificación sola ya te dice qué tramo te falta observar.

Después, elige un solo flujo crítico — el checkout, el login, lo que más duela cuando se rompe — y haz que un mismo trace_id lo recorra de punta a punta. Un flujo bien trazado enseña más que cien dashboards a medias. Y la próxima vez que soporte traiga una queja y el backend muestre todo en verde, en lugar de discutir quién tiene razón, vas a abrir una traza y ver la verdad completa de los dos lados a la vez.

La asimetría va a seguir ahí. Lo que cambia es que dejas de pelearte con ella y empiezas a leerla.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
