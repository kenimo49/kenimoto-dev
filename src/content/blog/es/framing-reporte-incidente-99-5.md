---
title: "\"99,5% de disponibilidad\" y \"5.000 pagos fallidos\" son el mismo hecho: el framing del reporte cambia la urgencia"
description: "El mismo incidente escrito como \"mantenemos 99,5%\" o como \"5.000 pagos están fallando\". El número no cambia ni un decimal, pero la urgencia que percibe tu equipo pasa de la calma al pánico. Mi falla en una guardia y tres reglas para diseñar el reporte."
date: 2026-06-03
lang: es
tags: [sre, gestion-de-incidentes, sesgos-cognitivos, guardia, on-call]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/framing-reporte-incidente-99-5/"
og_image: "https://kenimoto.dev/images/blog/framing-reporte-incidente-99-5/og-es.png"
cross_posted_to: []
---

Te lo digo de entrada: la idea de que "si reporto números exactos soy neutral" es un mito. El mismo número exacto, escrito como "tasa de impacto" o como "contenido del impacto", mueve la urgencia que percibe el que lo lee entre la calma y la crisis. Por eso dejé de pensar el reporte de incidentes como algo que se escribe, y empecé a pensarlo como algo que se diseña.

Lo aprendí fallando en una de mis guardias.

## Con "mantenemos 99,5%" dejé a mi equipo tranquilo de más

Una noche, la tasa de error en el flujo de pagos empezó a subir. Abrí el dashboard, miré el número y escribí en el canal del equipo:

> "La tasa de éxito de pagos está en 99,5%. Parece un pico puntual, lo dejo en observación."

Ni una palabra de mentira. Era 99,5% de verdad. Todos respondieron "dale, en observación" y yo volví tranquilo a revisar logs.

El problema estaba del otro lado del número. Ese servicio recibía cerca de un millón de solicitudes por día. **99,5% significa que 0,5% falla. Es decir, 5.000 pagos cayendo.** Si yo hubiera escrito el mismo dato así, el clima habría sido otro:

> "Hay 5.000 pagos fallando ahora mismo."

El primero da "lo observamos"; el segundo da "todos a la sala de guerra". Y el número es el mismo 99,5%. Esa noche elegí sin darme cuenta el framing tranquilizador, y con eso retrasé la reacción de mi propio equipo.

![El mismo hecho en tres framings: 99,5% de éxito = 5.000 pagos fallidos = 100 usuarios sin poder pagar. El número no cambia, la urgencia sí.](/images/blog/framing-reporte-incidente-99-5/framing-tres-formas.png)

## Por qué pasa esto: el efecto de framing

El fenómeno tiene nombre: **efecto de framing (encuadre)**. La misma información, según cómo se presenta, cambia el juicio de quien la recibe. Tversky y Kahneman lo demostraron en su artículo clásico de 1981.

El experimento famoso: ante una enfermedad que mataría a 600 personas, presentan "el plan A salva a 200" frente a "el plan B deja morir a 400". A y B son matemáticamente idénticos, pero mucha gente elige A porque está enmarcado en "salvar". El framing de supervivencia y el de muerte dan vuelta la decisión.

El reporte de incidentes es justo donde esto pega. Como trabajamos con números, creemos que somos cuantitativos y neutrales. Pero en el momento en que eliges **sobre qué framing montas ese número**, ya dejaste de ser neutral.

## "Tasa de impacto" y "contenido del impacto" no tienen la misma urgencia

Lo que más confusión genera en la práctica es confundir estos dos framings.

- **Framing de tasa**: "100 de 100.000 usuarios afectados (0,1%)"
- **Framing de contenido**: "100 usuarios no pueden pagar"

Son los mismos 100 usuarios. Pero el primero suena a "0,1%, algo menor" y el segundo suena a "100 personas no pueden pagar, esto es grave". El porcentaje diluye el hecho; la cantidad de personas y el "qué no funciona" lo concentran.

Ahí conviven el framing **involuntario** y el **intencional**.

El involuntario fue mi 99,5%. Cero mala intención: agarré el número que tenía a mano y lo escribí tal cual. El resultado igual fue dejar al equipo confiado de más.

El intencional sirve para el lado opuesto. Cuando quieres subir bien la prioridad pero dices "0,1%", se pierde. En ese caso no enmarcas por tasa sino por contenido: en vez de "0,1% de impacto", escribes "**el flujo de pagos, que toca la facturación directa, está caído para 100 usuarios**". El mismo hecho, montado en el framing que transmite la urgencia correcta.

## Aquí trazo una línea: esto no es "inflar los números"

Para que quede claro: no estoy diciendo "agranda los números para asustar". En el momento en que haces eso, fundes el activo más importante que tienes, que es la confianza.

Lo peligroso del framing es que está **a un paso de la manipulación**. Escribir "100 usuarios no pueden pagar" es un hecho. Pero si le sumas algo que no está, o eliges un denominador inflado para mover el porcentaje a gusto, eso ya no es un reporte: es una puesta en escena.

El criterio con el que trazo la línea es simple. **Entrega la misma verdad, en el framing que transmite la urgencia correcta.** La verdad no se toca ni un milímetro. Lo único que ajustas es si el que lee puede captar bien la gravedad. No es inflar; es no diluir. Son cosas distintas.

## Tres reglas para diseñar el reporte

Desde esa noche, tengo tres reglas para mí y para mi equipo. Ninguna depende de la atención individual; todas son del lado del sistema. Porque el cerebro durante un incidente es menos confiable justo cuando más te confías.

**1. Enmarca por contenido, no por tasa**

En el postmortem y en el primer aviso durante el incidente, no te quedes en "0,5% de falla". Bájalo siempre a lo concreto: "= 5.000 transacciones / X pagos caídos". Ten presente que la tasa empuja a diluir el impacto, y escribe la cantidad de personas, el número de casos y el "qué no funciona" juntos.

**2. Si dura 5 minutos, escala sin esperar el juicio humano**

El sesgo de normalidad ("todavía aguanta", "debe ser un falso positivo") se lleva pésimo con frases como mi 99,5%. Así que reduce el espacio para que una persona decida "lo observamos". Configura que, si una alerta dura más de 5 minutos, le llegue automáticamente al de guardia. Que mi exceso de confianza se frene por fuera de mi juicio.

**3. Si la tasa de error supera el umbral, publicación automática**

No dejes en manos de una persona "si reportar o no". Si la tasa de error pasa de N%, que los datos crudos, sin framing posible, caigan solos en el canal. Elimina de entrada el hueco por el que yo elegiría el framing tranquilizador.

Lo común a las tres es la misma idea: **cuando el sesgo está más fuerte, saca la decisión hacia el sistema.** Checklist, escalado automático, publicación automática. Todas son innecesarias "si estoy tranquilo", pero durante un incidente no estoy tranquilo. Aceptarlo con honestidad es el único punto desde donde arranca una defensa que sirve.

## En resumen

- "99,5% de éxito", "5.000 pagos fallidos" y "100 usuarios sin poder pagar" son exactamente el mismo hecho. Lo único que cambia es la urgencia
- Con números exactos, enmarcar por tasa o por contenido da vuelta el juicio del que lee entre calma y crisis (efecto de framing, Tversky y Kahneman, 1981)
- Esto no es "infla los números". **La verdad no se toca; eliges el framing que transmite la urgencia correcta.** Inflar y no diluir son cosas distintas
- No te apoyes en la atención individual, sino en el sistema: framing por contenido, escalado automático, publicación automática

Esto también sirve cuando eres tú el que recibe el reporte. Aprendes a frenar un segundo y verificar "¿en qué framing está escrito este aviso?". Si te dicen 99,5%, tradúcelo a 5.000 en tu cabeza antes de reaccionar. Solo con eso, las veces que me inclino hacia el lado confiado bajaron bastante.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
