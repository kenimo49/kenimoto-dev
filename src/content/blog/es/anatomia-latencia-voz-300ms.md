---
title: "Anatomía de la latencia en agentes de voz: dónde se te van los 300ms (STT → LLM → TTS)"
description: "Un agente de voz que responde lento no tiene un culpable único: tiene una suma. Te desarmo el pipeline STT → LLM → TTS milisegundo por milisegundo, para que veas exactamente en qué etapa se te escapa el presupuesto de 300ms."
date: 2026-06-11
lang: es
tags: [voice-ai, latencia, stt, llm, tts]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/anatomia-latencia-voz-300ms/"
og_image: "https://kenimoto.dev/images/blog/anatomia-latencia-voz-300ms/og-es.png"
cross_posted_to: []
---

La primera vez que medí la latencia de mi propio agente de voz, el cronómetro me devolvió 1,300ms y yo me quedé mirando la pantalla como quien revisa la cuenta del restaurante y no entiende de dónde salió el total. Ninguna etapa parecía cara por separado. El problema es que la latencia de voz se paga toda junta, sumada, y la suma es la que te deja sin propina.

Hoy quiero desarmar esa cuenta contigo, sin venderte ninguna solución mágica: para que la próxima vez que tu agente responda lento sepas exactamente a qué etapa apuntar con el cuchillo. El número que vamos a perseguir es 300ms, que es más o menos la pausa natural entre dos personas en una conversación. Pasado eso, el usuario siente que la máquina "está pensando", y ese es el momento en que se rompe la ilusión.

![Pipeline en cascada con las cuatro etapas STT, LLM, TTS y red, cada una con su rango de milisegundos](/images/blog/anatomia-latencia-voz-300ms/og-es.png)

## El pipeline en cascada, y por qué suma tanto

El agente de voz clásico es una fila india de cuatro etapas: STT (voz a texto) → LLM (razonamiento) → TTS (texto a voz) → red. Cada etapa espera a que la anterior termine antes de empezar. Es como un menú de degustación donde el chef no toca el plato principal hasta que retiran la entrada: cada paso es razonable, pero el comensal se desmaya de hambre antes del postre.

Esa estructura en cascada es la fuente del problema. Si una etapa tarda, las demás no pueden adelantarse: heredan el retraso completo. Por eso la suma honesta, sin optimizar nada, se va arriba de un segundo con una facilidad que asusta. Vamos etapa por etapa.

## STT: 100 a 300ms

El reconocimiento de voz convierte el audio en texto, y su latencia vive entre los 100 y 300ms. Pero el costo real no está solo en transcribir: está en darse cuenta de que terminaste de hablar.

Esa detección la hace el VAD (Voice Activity Detection), y es más sutil de lo que parece. Si el sistema corta muy rápido, te interrumpe a media frase. Si espera de más, suma silencio muerto al presupuesto. Los modelos de 2026 como Deepgram Nova-3 bajaron el STT a menos de 300ms y agregaron detección de fin de turno que considera el contexto semántico, no solo el silencio. Eso evita que tu "eeeh..." pensativo se confunda con "ya terminé". Una pausa para pensar ya no te cuesta una interrupción.

## LLM: 150 a 1,000ms (acá se te va la plata)

El modelo de lenguaje es la etapa más cara y la más variable: entre 150ms y un segundo entero. Y la métrica que importa es el TTFT (Time To First Token): cuánto tarda en escupir la primera palabra.

¿Por qué solo la primera? Porque una vez que el modelo arranca, los tokens salen a 50-100 por segundo, más rápido de lo que cualquiera habla. La voz puede empezar a sonar con la primera palabra mientras el resto todavía se está generando. Un buen modelo de 2026 logra [un TTFT de 150 a 300ms](https://www.retellai.com/blog/how-real-time-voice-ai-works-stt-llm-tts) para un prompt típico de agente de voz.

Acá hay una trampa que me costó caro entender: el primer turno de la conversación es más lento que los siguientes. Procesar el system prompt por primera vez suma unos 300ms extra que después desaparecen, porque la caché ya tiene ese trabajo hecho. Por eso conviene reforzar la estrategia de relleno (un "mmm, déjame ver" hablado) justo en el primer turno, que es cuando más se nota el silencio.

## TTS: 60 a 250ms

La síntesis de voz convierte el texto en audio, y su latencia va de 60 a 250ms. Igual que con el LLM, acá la métrica que manda es el TTFB (Time To First Byte): cuánto tarda en salir el primer pedacito de audio.

La clave está en que el audio sale por chunks, a medida que se sintetiza, no después de generar la frase completa. ElevenLabs Flash llega a 75ms de TTFB; otros motores rondan los 180-250ms. Mientras el primer chunk salga rápido, el usuario ya escucha algo, y eso compra una percepción de inmediatez que el reloj real no siempre justifica.

## Red: 50 a 200ms

La etapa que más gente olvida y la más tonta de perder. Si tu STT está en una región, tu LLM en otra y tu TTS en una tercera, cada salto suma ida y vuelta de red. Dentro de la misma región son unos 50ms; entre regiones se va fácil a 200ms o más.

Para América Latina esto pega doble. Si tu computadora habla con un servidor en Estados Unidos, el viaje físico de los paquetes ya te come una tajada del presupuesto antes de que ningún modelo piense nada. Acercar las etapas entre sí, y acercarlas al usuario, suele ser la optimización más barata y la que más rinde.

## La suma honesta

Pongamos todo en una tabla, porque el número junto golpea más que las partes sueltas.

| Etapa | Mejor caso | Caso típico | Peor caso |
|-------|-----------|-------------|-----------|
| STT | 100ms | 200ms | 300ms |
| LLM (TTFT) | 150ms | 500ms | 1,000ms |
| TTS (TTFB) | 60ms | 150ms | 250ms |
| Red | 50ms | 150ms | 300ms |
| **Total** | **~360ms** | **~1,000ms** | **~1,850ms** |

Ahí está la cuenta del restaurante que no entendía. En el mejor de los casos, optimizando todo, una cascada honesta ronda los 360ms. En configuración típica, un segundo. El "muro de los 300ms" no se cruza sumando etapas más rápidas: se cruza dejando de sumarlas en serie.

## Qué hacer con esto el lunes

El primer paso no es optimizar: es medir por etapa. Un total de 1,000ms no te dice nada; saber que 600 de esos mil son LLM te dice exactamente dónde pelear. Mide STT, LLM, TTS y red por separado, y mira percentiles (P50, P95, P99), no promedios. Un promedio de 400ms con un P99 de 3 segundos significa que una de cada cien llamadas se siente rota, y esas son las que el usuario recuerda.

Una vez que tienes el desglose, las tres palancas grandes son claras: streaming (empezar a hablar con el primer token y el primer chunk, no esperar la frase completa), paralelizar lo que se pueda en lugar de encadenarlo, y acercar los componentes entre sí para matar la latencia de red. Pero todas esas decisiones empiezan en el mismo lugar: saber dónde se te van los milisegundos. No puedes recortar un gasto que no mediste.

## Cierre

Un agente de voz lento casi nunca tiene un solo culpable: tiene una suma en cascada de STT, LLM, TTS y red, y cada etapa parece inocente hasta que ves el total. Los 300ms se ganan con un desglose: mide cada etapa, encuentra la que se come tu presupuesto (casi siempre el LLM), y atácala primero. La latencia, como la cuenta del restaurante, solo se entiende cuando la lees ítem por ítem.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
