---
title: "¿Cuánto cuesta realmente un agente de IA al mes? API vs suscripción vs local — el punto de equilibrio en USD"
description: "Corrí el mismo agente Claude Code durante 30 días en tres modelos de pago: API por consumo, suscripción Claude Max, y Ollama local en una RTX 4070 Ti. Esta es la cuenta detallada en USD, con los tres puntos de equilibrio según volumen de tokens mensual."
date: 2026-05-20
lang: es
tags: [ia-agente, claude-code, costos, ollama]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/cuanto-cuesta-agente-ia-al-mes-api-suscripcion-local-punto-equilibrio"
og_image: "https://kenimoto.dev/images/blog/cuanto-cuesta-agente-ia-al-mes-api-suscripcion-local-punto-equilibrio/og-es.png"
cross_posted_to: []
---

Yo pagué Claude Max tres meses para hacer scripts de 200 líneas. La API me hubiera costado USD 4 al mes en lugar de USD 100. Cuando hice la cuenta, me dio risa primero y vergüenza después.

Este artículo es la cuenta detallada que me hubiera ahorrado esos USD 288. Corrí el mismo agente Claude Code durante 30 días en tres modelos de pago distintos: API por consumo, suscripción Claude Max, y Ollama local en una RTX 4070. Voy a mostrar los tres puntos de equilibrio según tu volumen mensual de tokens, en USD, sin entrar en impuestos locales porque cada país tiene reglas distintas.

![Gráfico de punto de equilibrio: API vs suscripción vs local según tokens mensuales](/images/blog/cuanto-cuesta-agente-ia-al-mes-api-suscripcion-local-punto-equilibrio/breakeven-usd.png)

## Las tres estructuras de costo

### 1. API por consumo (pago por token)

Pagas por cada token de entrada y salida. Claude Sonnet 4.6 está hoy en **USD 3,00 por millón de tokens de input** y **USD 15,00 por millón de tokens de output**. GPT-5 ronda valores parecidos.

La factura mensual se calcula así, sin sorpresas: `(input_tokens / 1M) × 3 + (output_tokens / 1M) × 15`. Si consumes 500K tokens al mes, pagas menos de USD 2. Si consumes 30 millones, pagas alrededor de USD 200.

Ventaja: no pagas si no usas. Desventaja: si te entusiasmas, la factura sube en línea recta sin techo.

### 2. Suscripción mensual fija

Pagas un monto fijo y obtienes acceso "ilimitado en la práctica" hasta cierto cap suave. Los planes más comunes en mayo 2026:

- **Claude Pro**: USD 20/mes
- **Claude Max**: USD 100 o USD 200/mes
- **ChatGPT Plus**: USD 20/mes
- **Cursor Pro**: USD 20/mes, Pro+ USD 60, Ultra USD 200

Ventaja: presupuesto fijo, sin estrés cuando trabajas mucho. Desventaja: si trabajas poco, pagas igual.

### 3. Modelo local (Ollama, LM Studio, vLLM)

Corres el modelo en tu propia computadora. Costo cero por token, pero pagas hardware más electricidad.

Mi setup de prueba: **RTX 4070 Ti**, alrededor de USD 600 nueva. Corre Llama 3.1 13B a 60-70 tokens por segundo. Consumo eléctrico bajo carga: cerca de 200W. Con 8 horas de uso por día y un precio típico de electricidad en LatAm de USD 0,10 a 0,15 por kWh, el consumo mensual ronda USD 5 a 7.

Amortizando la GPU a 24 meses, el costo mensual queda en **USD 25 a 27** (USD 25 de hardware + USD 5-7 de electricidad). Ventaja: no se mueve aunque la uses 100 horas o 10. Desventaja: la calidad de un modelo local 13B no es la misma que Sonnet 4.6 — los agentes complejos se equivocan más, especialmente cuando hay que llamar a tools encadenadas.

## Los tres perfiles de uso que probé

Configuré tres perfiles distintos durante el mes, todos con el mismo agente Claude Code corriendo tareas reales (no benchmarks artificiales):

### Perfil A: indie que hace 1 feature por semana

Trabajo nocturno y fines de semana. Cuatro sesiones de coding por semana, alrededor de 90 minutos cada una. Volumen mensual estimado: **1,5 millones de tokens** (mezcla input/output).

| Modelo | Costo del mes |
|---|---|
| API por consumo | **USD 6** |
| Suscripción Claude Pro | USD 20 |
| Suscripción Claude Max | USD 100 |
| Local Ollama (RTX 4070 Ti) | USD 27 |

Veredicto: **API gana por mucho**. Pagar suscripción para este volumen es regalar dinero. Yo hice exactamente eso durante tres meses.

### Perfil B: harness automatizado 8 horas diarias

Es mi escenario actual. Cron jobs que corren agentes Observer / Strategist / Marketer en ciclo, durante toda la jornada laboral. Volumen mensual real: **alrededor de 32 millones de tokens**.

| Modelo | Costo del mes |
|---|---|
| API por consumo | **USD 280** (estimado con mezcla 70/30 input/output) |
| Suscripción Claude Max USD 100 | USD 100 (pero llegué al rate limit varias veces) |
| Suscripción Claude Max USD 200 | **USD 200** |
| Local Ollama (no sirve) | n/a — la calidad cae demasiado para tools encadenadas |

Veredicto: **Claude Max USD 200 gana** para volumen alto continuo. El plan de USD 100 alcanza para usuarios intensivos pero se topa con límites cuando hay automatización 24/7.

### Perfil C: prioridad privacidad, sin datos hacia el exterior

Algunos trabajos donde mover datos a una API externa no es opción (cliente con NDA estricto, datos personales sensibles, requisitos legales locales). Volumen mensual variable, pero supongamos **5 millones de tokens** durante el mes.

| Modelo | Costo del mes |
|---|---|
| API por consumo | USD 30 (pero los datos salen) |
| Suscripción | USD 20-100 (los datos también salen) |
| **Local Ollama (RTX 4070 Ti)** | **USD 27** (datos quedan en tu computadora) |

Veredicto: **local gana por requisitos, no por costo**. La diferencia económica es pequeña; la diferencia operativa es enorme.

## Los puntos de equilibrio

Si ordenas los tres modelos por volumen mensual de tokens, los puntos de cruce quedan así:

- **0 a 6 millones de tokens**: la API por consumo es la más barata. No te compliques con suscripción.
- **6 a 25 millones de tokens**: Claude Pro USD 20 o Claude Max USD 100 te conviene. La API se pone cara.
- **Más de 25 millones de tokens**: Claude Max USD 200 gana, o complementas con un servidor local para tareas repetitivas y dejas la API premium para lo importante.
- **Privacidad estricta o sin internet**: local desde el día uno, sin importar el volumen.

## Tres cosas que aprendí en el camino

**Primera**: mide tu volumen antes de elegir plan. Yo no medí nada durante tres meses, y por eso pagué USD 100 por mes para hacer USD 4 de trabajo. La API tiene un dashboard simple que te dice tokens consumidos por día; mira ese gráfico antes de suscribirte a nada.

**Segunda**: la estrategia híbrida funciona mejor que una sola estructura. Hoy yo uso **Claude Max USD 200 para la automatización del harness**, y **Ollama local para tareas de procesamiento masivo** (clasificación de archivos, conversiones de formato, resúmenes en batch) donde la calidad de un 13B alcanza. La factura combinada me sale más barata que un plan único equivalente.

**Tercera**: los USD del precio oficial no son lo único que pagas. La API tiene picos de uso impredecibles cuando un agente entra en un loop. La suscripción tiene límites suaves que te frenan en el peor momento. El local tiene tiempo perdido configurando drivers, modelos, prompts. Todos los modelos cobran algo que no aparece en el precio listado. Ese costo lo asumes en tiempo, no en USD.

Antes de elegir, pregúntate **cuánto tiempo tienes para pelear con la cuenta**. Si la respuesta es "ninguno", paga la suscripción y duerme tranquilo. Si la respuesta es "los fines de semana", la API con monitoreo te sale mejor. Si la respuesta es "me gusta jugar con hardware", el local te dará la sensación más satisfactoria de control, aunque la cuenta económica sea pareja.

A mí me llevó tres meses de USD 300 desperdiciados aprender esto. Espero que a ti te tome menos.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
