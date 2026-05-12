---
title: "Medí 5 stacks de Voice AI. Solo 2 se mantuvieron bajo los 300ms."
description: "Leí mil veces que los agentes de voz con IA responden en menos de 300ms. Medí 5 stacks contra la misma conversación de 1 minuto y 3 ni se acercaron. La tabla real de latencia P95 en mayo de 2026, con guía práctica para elegir."
date: 2026-05-13
lang: es
tags: [voice-ai, latencia, realtime-api, webrtc, benchmark]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/cinco-stacks-voice-ai-solo-dos-bajo-300ms"
og_image: "https://kenimoto.dev/images/blog/cinco-stacks-voice-ai-solo-dos-bajo-300ms/og-es.png"
cross_posted_to: []
---

Leí mil veces que los agentes de voz con IA responden en menos de 300ms. Lo dice AssemblyAI, lo dice Vapi, lo dice cada post de lanzamiento de Realtime API. Así que armé cinco stacks, le puse un cronómetro a cada pipeline y corrí la misma conversación de 1 minuto en todos.

Tres de cinco ni se acercaron al límite.

Los otros dos eran los que yo daba por sentado que eran "números de marketing". Resulta que el marketing tenía razón y la culpa era de mi pipeline hecho a mano.

![Cinco stacks de Voice AI medidos contra el umbral de 300ms. Solo OpenAI Realtime y LiveKit + Gemini Live se mantuvieron debajo.](/images/blog/cinco-stacks-voice-ai-solo-dos-bajo-300ms/p95-chart-es.png)

## Los tres acantilados que nadie pone en el slide

Antes de los números, el modelo de percepción. La latencia de voz no se degrada de forma suave. Se cae por acantilados. AssemblyAI, Vapi y Retell convergen en aproximadamente los mismos tres umbrales, y después de una semana de tests con usuarios yo también les creo.

| Latencia | Qué hace la persona |
|---|---|
| 0-300ms | Habla normal, no piensa en la IA |
| 300-500ms | Siente una pausa, la tolera |
| 500-800ms | Habla encima de la IA ("¿me escuchás?") |
| 800-1500ms | Repite la pregunta |
| 1500ms+ | Trata la llamada como una internacional, abandona |

300ms es el primer acantilado. Por encima, la persona empieza a notar que hay una máquina. Por encima de 500ms, pelea por el turno y tu STT se resetea porque la persona se superpone. A los 800ms, la mitad de mi panel dijo "¿hola? ¿hola?". Ese sonido universal de "¿esto está encendido?". No tuve semana de code review más humillante que mirar la grabación de eso.

## Marco de decisión: cómo elegir tu stack

Antes de mostrar los números, dejo el marco de decisión. Cinco preguntas que tu equipo debería contestar antes de elegir vendor.

1. **¿Cuál es tu presupuesto real de latencia P95?** Si tu producto es soporte por WhatsApp y aceptás 800ms, no necesitás voice-to-voice. Si es atención telefónica en tiempo real, necesitás bajar de 300ms o diseñar un filler explícito.
2. **¿Necesitás un modelo específico en el cerebro?** Si la respuesta es "tiene que ser Claude" o "tiene que ser nuestro modelo local fine-tuned", no podés usar Realtime API directa. Estás en una cascada por contrato.
3. **¿Cuál es tu región física?** Si tus usuarios están en LatAm y tu Realtime API en US-East, ya partís 110-140ms abajo. Eso cambia cuál stack es viable.
4. **¿Tenés requisito de privacidad o air-gap?** Si los datos no pueden salir del país, descartá cloud Realtime. Vas a edge sí o sí.
5. **¿Cuántos minutos/mes de tráfico vas a tener?** Realtime API se cobra por minuto y escala feo después de los 100k minutos. Las cascadas dejan más espacio para optimizar costo por componente.

Estas cinco preguntas eliminan 3 de los 5 stacks antes de que toques una línea de código.

## Adónde se va el presupuesto de 300ms

Si querés entender por qué tres de mis stacks fallaron, mirá la matemática del presupuesto. Un pipeline en cascada tiene que meter cuatro cosas en serie dentro de 300ms.

- **STT** (speech-to-text): 80-300ms según modelo y diseño de VAD
- **LLM TTFT** (tiempo al primer token): 100-500ms según tamaño del modelo, contexto y cold start
- **TTS TTFB** (primer byte de audio): 75-300ms según el vocoder
- **Round-trip de red**: 50-200ms, limitado por la velocidad de la luz y tu elección de región

Sumá el número más rápido de cada fila y da 305ms. Sumá el típico y pasás del segundo. El libro del que salió este benchmark llama a esto "anatomía de la latencia", y el chiste es que la cascada es matemáticamente alérgica a los 300ms a menos que cada componente viva pegado al de al lado.

Los modelos voice-to-voice end-to-end esquivan esa regla colapsando STT + LLM + TTS en un único forward pass sobre un stream de tokens de audio. No hay segundo salto. No hay warmup de TTS. No hay handoff entre servicios. Eso es todo el juego, y es también por lo que los dos stacks que ganaron fueron los dos donde menos código escribí.

## Los cinco stacks

Quería una comparación real, no un post tipo "miren mi vendor favorito". Mismo script de soporte de 1 minuto. Mismo ingress WebRTC (Daily.co para todo menos OpenAI Realtime, que usa su propio endpoint). Mismo prompt. Misma computadora cliente, US-East. Diez turnos por stack, 50 mediciones por stack. Reporto P50, P95 y P99 porque el promedio miente de una forma que la persona que usa voz siente físicamente.

**Stack 1 — OpenAI Realtime API.** `gpt-4o-realtime` sobre el endpoint WebRTC oficial. Voz entra, voz sale, sin código pegamento.

**Stack 2 — Cascada Deepgram + Claude + ElevenLabs.** Deepgram Nova-3 para STT, Claude Sonnet 4.6 como cerebro, ElevenLabs Turbo v2.5 para TTS. La cascada "lo mejor de cada categoría" que dibujás en la pizarra.

**Stack 3 — Edge local (Whisper + Llama + Coqui).** Whisper Large v3 Turbo, Llama 3.3 70B corriendo local sobre una H100, Coqui XTTS para TTS. Round-trip de red: 0ms. La respuesta de "privacidad y soberanía" que se promociona mucho en LatAm fintech.

**Stack 4 — LiveKit Agents + Gemini 2.0 Flash Live.** Framework de agents de LiveKit como plano de medios, native-audio Gemini Live como cerebro. También voice-to-voice end-to-end, pero por un SDK distinto.

**Stack 5 — Pipecat + Claude + Cartesia.** Pipecat orquestando, Claude Sonnet 4.6 en el LLM, Cartesia Sonic en el TTS. Una cascada más opinada con un TTS más rápido que ElevenLabs.

## Los resultados

| Stack | P50 | P95 | P99 | ¿Bajo 300ms? |
|---|---|---|---|---|
| 1. OpenAI Realtime (voice-to-voice) | 232ms | 281ms | 320ms | ✅ |
| 2. Deepgram + Claude + ElevenLabs | 480ms | 624ms | 780ms | ❌ |
| 3. Whisper + Llama 70B + Coqui (local) | 870ms | 980ms | 1.210ms | ❌ |
| 4. LiveKit + Gemini Live (voice-to-voice) | 250ms | 295ms | 360ms | ✅ |
| 5. Pipecat + Claude + Cartesia | 410ms | 540ms | 670ms | ❌ |

Stack 1 y Stack 4 son los únicos que se mantuvieron bajo los 300ms en P95. Ambos son voice-to-voice. Ambos entregan un forward pass único en lugar de una carrera de postas. Stack 5 muestra cómo se ve una cascada bien hecha (el TTS de Cartesia es genuinamente rápido — 90ms TTFB) y aun así no le gana al acantilado, porque el LLM TTFT más los saltos entre servicios se comen el presupuesto.

Stack 3 es el doloroso. Tenía la esperanza de que local al menos le ganara a la cascada por ausencia de red. A veces gana. Pero Llama 3.3 70B no es chico, y "sin red" no te salva cuando el LLM TTFT solo da 600ms en una GPU commodity. El capítulo de edge AI del libro es honesto: la victoria realista de edge hoy es con **modelos más chicos** (clase Qwen2.5 1.5B), no con 70B local. 70B local es lo peor de los dos mundos: pagás la GPU y tampoco pasás el acantilado.

## Para LatAm: el problema de región

Quien construye voz con IA desde LatAm choca contra un problema adicional antes incluso de llegar a esos 300ms: la latencia regional. La mayoría de los endpoints de Realtime API viven en US-East o EU-West. El round-trip desde Buenos Aires, Bogotá o Ciudad de México hasta US-East-1 está entre 100 y 150ms en condiciones decentes, y eso ya se come la mitad del presupuesto antes de que el modelo lea el primer frame.

Compañías como Mercado Libre, Rappi, Despegar o Banco Galicia que están explorando voz con IA para soporte y onboarding viven con esta realidad: el presupuesto real de latencia para equipos LatAm no es 300ms cloud puro, está más cerca de 400-600ms, y el camino práctico suele ser STT regional (Azure Speech es-MX o es-AR en regiones cercanas, Google Speech-to-Text es-LA), LLM en US-East, TTS regional. No vas a bajar de 300ms cloud en mayo de 2026 sin una región local de Realtime API, así que diseñá la UX para 500ms con filler estratégico en vez de prometer 300ms y decepcionar.

Costo aproximado para correr Stack 2 24/7 con tráfico medio: USD 350-500/mes. Stack 1 sale más caro por minuto pero elimina tres contratos con vendors y saca el pipeline de tus manos. Para equipos chicos, suele ser mejor negocio del que parece a primera vista.

## Por qué voice-to-voice gana (hoy)

Tres motivos, en orden decreciente de cuánto me sorprendieron:

**Uno — no hay apilamiento de TTFT-luego-TTFB.** En cascada, esperás el primer token del LLM y recién ahí disparás el TTS, que tiene su propio first-byte. Voice-to-voice emite tokens de audio directo. No hay segundo warmup.

**Dos — sin serialización de handoff.** Deepgram → Claude → ElevenLabs son tres endpoints distintos. Aunque cada uno sea rápido, pagás TLS, connection pool y buffer de frames tres veces. Pipecat ayuda, pero no lo borra.

**Tres — turn-taking VAD-aware.** Los modelos voice-to-voice hacen detección de endpoint directamente sobre el stream de audio. Las cascadas tienen que esperar una señal de VAD para cerrar la salida del STT antes de mandarla. Ese delay de cierre es invisible en benchmarks que empiezan a contar desde "la persona dejó de hablar", pero la persona no sabe cuándo "oficialmente" dejó. Lo siente como silencio.

La manera más barata de bajar de 300ms en mayo de 2026 es no escribir el pipeline. La mayor parte de mi latencia era mi código.

## Cuándo edge AI nos va a alcanzar

Edge es la respuesta correcta para la forma correcta de problema: privacidad local-only, kioscos sin red, robótica offline. No es, hoy, la respuesta para "quiero un agente cloud bajo 300ms". Whisper v3 Turbo marca Real-Time Factor por encima de 1000x y los modelos clase 1.5B devuelven el primer token en 200ms sobre CPU. Esa combinación — modelo chico, STT rápido, TTS local — cierra en 300-350ms. El camino de 70B-en-H100 que probé en Stack 3 no cierra.

El otro camino es híbrido: STT en el edge, LLM y TTS en cloud. Te salteás el round-trip de red en el paso síncrono más largo (capturar audio) y mantenés calidad de cloud en el cerebro. El libro lo organiza como una matriz de decisión y coincide con lo que medí: 350-500ms es realista; cascada cloud bajo 300ms no lo es.

Para profundizar en el lado de la percepción — cómo hacer que un agente de 500ms **se sienta** como uno de 300ms — escribí un complemento sobre [perception hacks de voice AI](https://dev.to/kenimo49/voice-perception-hacks-i-kept-the-pipeline-at-540ms-and-users-still-said-instant-3oki) en Dev.to. Filler, micro-confirmaciones y playback progresivo de tokens te compran todo un acantilado de velocidad percibida. No mueven el acantilado real.

## Qué construiría hoy

Mayo 2026, empezando desde cero:

- **Producto consumer nuevo** — OpenAI Realtime o Gemini Live, directo. Parás antes de lo que pensás que necesitás y publicás
- **Necesitás Claude en el loop** — Pipecat + Claude + Cartesia. Vas a vivir en P95 de 500-600ms. Diseñá filler ahora, no después
- **Requisito de privacidad o air-gap** — Whisper Turbo + Qwen2.5 1.5B + TTS local. Apuntá a 350ms TTFB. Olvidate de 70B local hasta la próxima generación de GPU
- **Telefonía empresarial (LatAm)** — Híbrido: STT regional, cerebro voice-to-voice en cloud. El codec PSTN ya mata tu ventaja de latencia, así que optimizá calidad de turn-taking en vez del número absoluto

El error más profundo que cometí fue creer que "300ms" es una propiedad del **modelo** que elegí. Es una propiedad de la **arquitectura** que elegí. El modelo solo decide qué tan cómoda es esa arquitectura.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
