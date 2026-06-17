---
title: "El modelo no cambió, pero la precisión subió de 52.8% a 66.5%: qué es la ingeniería de harness y por qué invertir en el andamiaje le gana a cambiar de modelo"
description: "El rendimiento de un agente de IA depende menos del modelo que eliges y más del harness que lo rodea: las herramientas, los límites, la memoria y la orquestación. Con el mismo modelo, LangChain pasó de 52.8% a 66.5%. Te explico la fórmula Agent = Model + Harness y sus 5 componentes."
date: 2026-06-18
lang: es
tags: [agentes-ia, harness, langchain, ingenieria, llm]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/harness-52-a-66-mismo-modelo/"
og_image: "https://kenimoto.dev/images/blog/harness-52-a-66-mismo-modelo/og-es.png"
cross_posted_to: []
---

Te confieso un vicio que tuve durante meses: cada vez que mi agente de IA fallaba, mi primer impulso era cambiar de modelo. ¿Salió uno nuevo? A probarlo. ¿El benchmark dice que este es mejor? A migrar. Gastaba más tiempo eligiendo el motor que arreglando el auto. Hasta que vi un número que me hizo dejar el vicio: el mismo modelo, sin tocar una sola línea de sus pesos, subió de 52.8% a 66.5% de precisión. Lo único que cambió fue el harness.

Ese salto de 13.7 puntos es la mejor evidencia que conozco de una idea simple y que casi nadie aplica: la mayor parte del rendimiento de tu agente no vive dentro del modelo, vive en el andamiaje que lo rodea. Hoy te quiero explicar qué es ese harness, por qué la fórmula `Agent = Model + Harness` cambia dónde conviene invertir tu tiempo, y cuáles son las cinco piezas que de verdad marcan la diferencia.

![Dos columnas con el mismo modelo: una con harness pobre marcando 52.8% y otra con harness bien diseñado marcando 66.5%, conectadas por una flecha de +13.7 puntos](/images/blog/harness-52-a-66-mismo-modelo/og-es.png)

## La fórmula más simple: Agent = Model + Harness

La definición más limpia que encontré viene del blog de LangChain, "The Anatomy of an Agent Harness", y cabe en cuatro palabras: `Agent = Model + Harness`. El modelo aporta la inteligencia; el harness es lo que hace que esa inteligencia sirva para algo. Un cerebro brillante encerrado en un cuarto sin manos ni ojos no resuelve nada. El harness son las manos, los ojos y las reglas del cuarto.

Lo potente de plantearlo así es lo que implica para tu trabajo diario. Si el agente es modelo más harness, entonces tienes dos perillas para girar, no una. Puedes esperar a que salga un modelo mejor, cosa que no controlas y que pasa cuando los laboratorios deciden. O puedes mejorar el harness, que está enteramente en tus manos hoy. La mayoría de la gente solo gira la primera perilla y se olvida de que existe la segunda, que además es la única que depende de ella.

## El número que lo prueba: 52.8% a 66.5%

La prueba concreta viene de Terminal-Bench 2.0, un benchmark para agentes de programación. El agente de LangChain estaba fuera del top 30 y, tras rediseñar el harness desde cero, [saltó al puesto 5, subiendo de 52.8% a 66.5%](https://medium.com/@richardhightower/langchains-harness-engineering-from-top-30-to-top-5-on-terminal-bench-2-0-8895dbab4932). El detalle que importa: usaron el mismo modelo y los mismos pesos. Lo único que tocaron fueron los prompts de sistema, las herramientas y el middleware.

Hay un hallazgo dentro del hallazgo que me pareció hermoso. Probaron cómo repartir el razonamiento del modelo y los resultados hablan solos: razonamiento máximo todo el tiempo dio 53.9%, razonamiento alto dio 63.6%, y una estrategia que ellos llaman "reasoning sandwich" llegó al 66.5%. El sándwich aplica razonamiento extendido en las fases de planificar y verificar, donde pensar mucho rinde, y razonamiento normal durante la implementación, donde lo que manda es ejecutar un plan que ya entendiste. O sea: la clave no fue pensar más, sino pensar en el momento correcto. Y eso no depende del modelo: es puro diseño de harness.

Para mí ese número cerró la discusión. No es que la diferencia entre modelos no importe; importa. Pero si el mismo modelo gana 13.7 puntos solo con mejor andamiaje, el tiempo que paso comparando modelos probablemente rinde más invertido en el andamiaje.

## Los 5 componentes del harness

LangChain descompone el harness en cinco piezas, y la trampa es creer que basta con reforzar una. Cada una es una preocupación independiente, y si solo pules una mientras las otras siguen flojas, el efecto es limitado. El equilibrio entre las cinco es lo que produce el salto.

Las piezas son, a grandes rasgos: el prompt de sistema que fija el comportamiento base, las herramientas que el agente puede usar para acceder al mundo, la gestión de contexto y memoria que decide qué información ve el modelo en cada paso, la orquestación que coordina los pasos y las fases, y los lazos de verificación que atrapan errores antes de que se acumulen. En el caso de LangChain, las mejoras concretas fueron justamente de este tipo: lazos de verificación, inyección de contexto, la programación del "reasoning sandwich" y detección de bucles para frenar los reintentos que se van en espiral.

Cuando lo veas así, te vas a dar cuenta de algo: ninguno de estos cinco depende de qué modelo uses. Son una capa que se sienta encima del modelo, y por eso el principio de diseño se mantiene aunque mañana cambies el motor por completo.

## Por qué OpenAI, Anthropic y LangChain lo cuentan distinto

Vale la pena notar que LangChain habla desde un lugar particular: el de quien construye un framework, no un modelo. OpenAI y Anthropic escriben sobre harness asumiendo sus propios modelos por debajo. LangChain, en cambio, define una capa de harness que no depende del modelo. Su postura es que, uses el motor que uses, los principios de diseño del andamiaje son los mismos.

Esa diferencia de origen no es trivial para ti. Significa que lo que aprendes sobre diseño de harness no caduca cuando sale el próximo modelo. Los modelos cambian cada pocos meses; los principios del andamiaje son bastante más estables. Invertir en diseñar buen harness es acumular un activo que sigue valiendo aunque el motor por debajo se renueve. Es, si me permites la comparación, como aprender a manejar bien en lugar de cambiar de auto cada vez que pierdes una carrera. El auto nuevo ayuda, pero si no sabes tomar las curvas, vas a perder igual.

## Cómo medir si tu harness mejora

Si el caso de LangChain demuestra algo práctico, es que la calidad del harness se puede medir con números, y eso te saca de discutir por sensaciones. ¿Qué conviene medir? Cuatro indicadores me funcionan bien.

| Indicador | Qué mide | Cómo calcularlo |
|-----------|----------|-----------------|
| Tasa de éxito | Tareas completadas correctamente | completadas / totales |
| Tasa de reproceso | Cuánto tuvo que corregir un humano | correcciones / completadas |
| Tokens por tarea | Costo de cada tarea | tokens totales / tareas |
| Paso de controles | Cuánto pasa lint y tests a la primera | primer intento OK / total |

Cada vez que cambies algo en el harness, estos números deberían moverse para bien. Si no se mueven, ese cambio no sirvió, por más elegante que se vea en el código. Decidir con datos y no con intuición es lo básico de la ingeniería, y acá aplica igual. Si ya mediste sistemas RAG alguna vez, esto te va a sonar familiar: es la misma idea de medir precisión, exactitud y costo, solo que ahora el objeto medido es todo el entorno de ejecución del agente, no únicamente la búsqueda.

## Cierre

Si tuviera que dejarte una sola frase, sería esta: antes de cambiar de modelo, mira tu harness. La fórmula `Agent = Model + Harness` no se queda en la teoría: te dice dónde poner tu esfuerzo. El salto de 52.8% a 66.5% se logró sin tocar el modelo, y eso debería cambiar tu orden de prioridades.

- El rendimiento del agente vive en buena parte fuera del modelo, en el harness
- Mismo modelo, mejor andamiaje: de 52.8% a 66.5%, +13.7 puntos
- El harness son 5 piezas independientes; reforzar una sola rinde poco
- Los principios de harness no caducan cuando sale el próximo modelo
- Mide tasa de éxito, reproceso, tokens y paso de controles para saber si mejoras

El próximo modelo va a salir igual, lo cambies o no. Lo que sí puedes mejorar hoy, con las manos, es el andamiaje. Ahí está la perilla que de verdad controlas.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
