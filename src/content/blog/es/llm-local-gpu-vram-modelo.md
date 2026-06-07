---
title: "Corrí un LLM local en mi GPU sin pagar API: la regla VRAM-a-modelo que evita el OOM"
description: "Lo local no es solo para ahorrar. Con datos médicos o de clientes, a veces es la única opción legal. El cuello de botella real no es la API: es tu VRAM. Aquí va la regla para elegir entre 24B, 32B y 70B sin reventar la memoria."
date: 2026-06-08
lang: es
tags: [ollama, llm-local, gpu, vram, privacidad]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/llm-local-gpu-vram-modelo"
og_image: "https://kenimoto.dev/images/blog/llm-local-gpu-vram-modelo/og-es.png"
cross_posted_to: []
---

La primera vez que intenté ejecutar un modelo de 70B en mi GPU, la terminal me devolvió un `CUDA out of memory` tan rápido que ni alcancé a quitar la mano del teclado. Yo tenía la idea romántica de "voy a tener mi propio ChatGPT en casa, gratis". Lo que tenía en realidad era una tarjeta de 24 GB y un modelo que pedía 40. El cuello de botella nunca fue la API. Era mi VRAM, y yo no la estaba mirando.

Quiero contar dos cosas. Primero, por qué correr un LLM local vale la pena aunque tengas API a mano. Y segundo, la regla aburrida que te dice qué tamaño de modelo entra en tu tarjeta antes de que te estrelles contra el OOM.

## Lo local no es solo por tacañería

El primer reflejo es pensar que esto es para ahorrar dólares, y sí, ahorra. Pero el ahorro es solo el principio. Lo que de verdad inclina la balanza es que a veces lo local es **la única opción que la ley te deja**.

Si tu proyecto toca datos médicos, financieros o información personal de clientes, mandar eso a la API de un proveedor en otro país deja de ser un detalle técnico y pasa a ser un problema legal. En Brasil la LGPD se endureció en 2026: la Ley 15.352/2026 convirtió a la ANPD en un regulador plenamente independiente, y la inteligencia artificial quedó como prioridad explícita de fiscalización para 2026-2027. México, Argentina, Colombia y Chile tienen sus propios regímenes de protección de datos, y la presión por residencia de datos es real en toda la región. La LGPD no te obliga a tener todo en servidores locales, pero sí exige "salvaguardas adecuadas". Y no hay salvaguarda más simple de defender ante un auditor que: "los datos nunca salieron de esta máquina".

Después está el costo, que en LatAm pega distinto. La API se cobra en dólares por millón de tokens. Cuando tu sueldo está en pesos o reales y el dólar hace lo que hace, cada experimento de prompt es una pequeña sangría en una moneda que no es la tuya. Correr local tiene costo marginal cero en dólares: pagas el hardware una vez y después el único gasto es la luz.

Y por último, lo obvio que se nos olvida: lo local funciona sin internet. En un avión, en una oficina de cliente con la red capada, en cualquier lado donde la conexión sea un lujo, tu modelo sigue ahí.

## Ollama: una línea para empezar

Ollama es la herramienta que vuelve todo esto simple. Descarga, cuantización y motor de inferencia, todo con un comando. Instalarlo es literalmente una línea:

```bash
# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# arrancar el servidor
ollama serve

# descargar y ejecutar un modelo de código
ollama pull devstral:24b
ollama run devstral:24b
```

Y como expone una API compatible con OpenAI, puedes apuntar tu código existente al modelo local sin reescribir nada:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # cualquier string sirve
)
```

Hasta acá es la parte de marketing, donde todo funciona y todos somos felices. Ahora viene la parte donde te estrellas si no haces la cuenta.

## La regla VRAM-a-modelo

El número que importa antes de bajar cualquier modelo es cuánta VRAM necesita. La regla de bolsillo es esta:

> **VRAM (GB) ≈ parámetros (en miles de millones) × bytes por parámetro × 1,2**

Ese 1,2 del final no es decoración: es el espacio extra que se come la caché KV mientras el contexto crece. Y los "bytes por parámetro" dependen de la cuantización, que es lo que más confunde a la gente. En fp16 cada parámetro pesa 2 bytes; cuantizado a Q4_K_M baja a más o menos 0,55. Esa es toda la magia de poder ejecutar modelos grandes en tarjetas chicas.

![Tabla de VRAM por tamaño de modelo y cuantización](/images/blog/llm-local-gpu-vram-modelo/vram-tabla-es.png)

| Modelo | Q4_K_M | Q8 | fp16 |
|--------|--------|----|----|
| Devstral 24B (código) | ~14 GB | — | ~48 GB |
| Qwen3-Coder 32B | ~22 GB | — | ~64 GB |
| Llama 3.3 70B | ~40 GB | ~74 GB | ~140 GB |

Mira la columna Q4_K_M, que es el punto dulce. Un modelo de 24B entra cómodo en una tarjeta de 24 GB. Uno de 32B entra **justo**: ocupa 22 GB de los 24, y te deja apenas un par de gigas para el contexto antes de que el OOM te salude. Y el 70B simplemente no cabe en una sola tarjeta de consumo: necesitas 40 GB, o sea una de servidor, o dos de 24 GB pegadas. Por eso mi error del principio: pedí un 70B a una tarjeta que físicamente no podía sostenerlo.

La cuantización es el botón que ajusta todo. Q4_K_M es el equilibrio que casi siempre quieres: la mejor calidad por gigabyte. Q5 mejora un pelo a cambio de un 15-20% más de memoria. Q8 es casi sin pérdida pero pesado, y fp16 rara vez vale la pena en local. Si tu modelo no entra, no compres GPU todavía: primero baja la cuantización.

## En qué tarjeta corre cada cosa

Para aterrizarlo en hardware real: una RTX 3090 usada de 24 GB (ronda los 700 dólares) ya te corre cómodamente cualquier modelo de 24B en Q4. La RTX 5090, con sus 32 GB, te da aire para un 32B con contexto decente. Y para el 70B, o te vas a una tarjeta de servidor o armas un setup de dos GPU. La cuenta de cuándo conviene comprar hardware en vez de pagar API es simple aunque la gente la cita mal: el punto de equilibrio anda por los **2 millones de tokens al día**, no al mes. Si tu uso es de hobby, la API sigue siendo más barata. Si estás iterando sobre código todo el día, el fierro se paga solo en unos meses.

## Lo honesto: local no le gana a la nube en todo

No te voy a vender humo. Un modelo local de 32B no alcanza a Claude Sonnet ni a GPT en las tareas difíciles. Refactors que tocan muchos archivos, decisiones de arquitectura, razonamiento sobre contextos largos: ahí la nube gana y gana claro. Los benchmarks de frontera siguen liderados por los modelos grandes en la nube, y quien te diga lo contrario probablemente está mirando un benchmark saturado como HumanEval, que ya no distingue bien a nadie.

Pero acá está el punto: el 70-80% de tu día como programador no son tareas difíciles. Es CRUD, boilerplate, completar una función, escribir un test, generar la documentación de un módulo. Para todo eso, un 24B o 32B local rinde de sobra, y rinde sin cobrarte un centavo en dólares ni mandar tu código a ningún lado.

La estrategia que yo terminé usando combina las dos: lo rutinario y de alto volumen lo manejo local, y los problemas espinosos se los paso a la API. Elegir local fue la decisión correcta; el error estuvo en pedirle a 24 GB que cargaran un modelo de 40. Haz la cuenta primero, elige la cuantización, y la terminal deja de gritarte.

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
