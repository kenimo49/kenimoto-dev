---
title: "A las 3 de la tarde tu tasa de aprobación en code review cae casi a 0%: la ciencia de la fatiga de decisión"
description: "No es la calidad del código sino la hora a la que lo revisaste lo que decide aprobar o rechazar. Lo que un estudio sobre jueces, la polémica del agotamiento del yo y la avalancha de sugerencias de IA me enseñaron sobre cuándo revisar."
date: 2026-06-02
lang: es
tags: ["ciencia cognitiva", "code review", "agentes IA"]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/fatiga-decision-3pm-code-review-aprobacion"
og_image: "https://kenimoto.dev/images/blog/fatiga-decision-3pm-code-review-aprobacion/og-es.png"
cross_posted_to: []
---

Te lo digo primero, porque es lo único que necesitas recordar: si un pull request te llega a las 3 de la tarde, tiene muchas menos probabilidades de que lo apruebes que si te llega a las 9 de la mañana. Y casi no importa qué tan bueno sea el código.

Yo no quería creerlo. Soy ingeniero, me gusta pensar que mi juicio sobre un PR depende del PR. Pero después de mirar mis propios patrones de aprobación y de leer la literatura, me toca admitir algo incómodo: buena parte de mi rigor como revisor no es rigor, es la hora del reloj.

![Tasa de aprobación a lo largo del día: mañana 65 por ciento, antes del descanso casi 0 por ciento, después del descanso 65 por ciento](/images/blog/fatiga-decision-3pm-code-review-aprobacion/aprobacion-curva-es.png)

## El estudio de los jueces que todo el mundo cita

En 2011, Shai Danziger y sus colegas publicaron en PNAS un análisis de un comité de libertad condicional en Israel. Ocho jueces con experiencia, más de 1,000 decisiones, repartidas en 50 días. La pregunta era simple: ¿el preso sale o se queda?

El resultado se volvió famoso por una razón. Al inicio de cada sesión, la tasa de fallos favorables al preso rondaba el 65%. A medida que avanzaba la sesión, esa tasa bajaba de forma sostenida hasta acercarse a casi 0% justo antes de un descanso. Y después de que los jueces comían, volvía a subir a cerca del 65%.

Dicho de otro modo: dos presos con casos casi idénticos podían recibir veredictos opuestos según les tocara aparecer a las 9:10 o a las 11:50. Lo que pesaba en el veredicto no era el delito, era la hora a la que el juez los escuchó.

La explicación que se propuso fue la fatiga de decisión. Tomar una decisión tras otra desgasta tu capacidad de seguir decidiendo, y cuando estás desgastado eliges la opción por defecto, la que menos compromete. Para un juez, la opción por defecto es no soltar al preso. Para mí frente a un PR, la opción por defecto cambia según el día: a veces es rechazar sin pensarlo, a veces es aprobar para quitármelo de encima. Ninguna de las dos es juicio.

## Aquí es donde tengo que ser honesto contigo

Si cierro el artículo en el párrafo anterior, te estaría vendiendo ciencia popular y no ciencia. Y este blog no va de eso.

El estudio de los jueces tuvo réplica crítica. Ese mismo año, Weinshall-Margel y Shapard señalaron que el orden de los casos no era aleatorio: los presos sin abogado tendían a quedar al final de cada bloque, y eso solo ya podía explicar buena parte de la caída. O sea, quizá no era el cerebro cansado del juez, sino cómo estaban ordenados los expedientes.

Y el concepto que da nombre a todo esto, el agotamiento del yo (*ego depletion*), la idea de que el autocontrol es un combustible que se gasta, está hoy en plena crisis de replicación. Una replicación registrada con 23 laboratorios y más de 2,000 participantes no encontró el efecto que esperaba. Michael Inzlicht, uno de los investigadores que más trabajó el tema, llegó a escribir sobre el colapso del agotamiento del yo. No es un detalle menor: es uno de los pilares de la psicología social de los 2000 tambaleándose.

Así que aquí va mi versión prudente, la única que estoy dispuesto a defender: una serie larga de decisiones parece degradar la calidad de tus decisiones posteriores. Eso es todo. No te digo que tienes un tanque de gasolina mental que se vacía a las 3 de la tarde. Te digo que decidir mucho, seguido, sin pausa, te empeora como revisor. La forma fuerte de la teoría está en duda; la forma débil sigue siendo razonable y, sobre todo, sigue siendo útil para alguien que revisa código todo el día.

Que la ciencia esté en debate no me da menos confianza para escribir esto. Me da más. Porque significa que no te estoy pidiendo fe, te estoy pidiendo que pruebes el horario y midas tu propia tasa.

## Por qué los que trabajamos con IA estamos peor

Ahora viene la parte que me hizo escribir todo esto.

Un juez israelí de 2011 tomaba sus decisiones leyendo expedientes en papel, a ritmo humano. Yo, en 2026, reviso código mientras un asistente de IA me escupe sugerencias. Y leer una sugerencia de IA se parece poco a leer una línea de código: es un acto de decisión completo. Tengo que reconstruir la lógica que el modelo propuso, revertirla mentalmente hasta entender por qué la escribió así, y volver a mapearla contra mi propio modelo del sistema. Decenas o cientos de veces al día.

El paper "Towards Decoding Developer Cognition in the Age of AI Assistants" (arXiv 2501.02684, 2025) apunta justo a eso: el costo cognitivo se desplazó. Antes el trabajo caro era escribir. Ahora el código sale barato y rápido, y el trabajo caro es verificar. Cada sugerencia plausible-pero-quizá-incorrecta es una microdecisión, y se acumulan.

La investigación de 2026 lo confirma con datos más duros. En CHI 2026, un trabajo titulado "When Help Hurts: Verification Load and Fatigue with AI Coding Assistants" construyó una medida compuesta de carga de verificación (fallos de compilación y de tests, churn, pausas, cambios de contexto) y mostró que predice de forma estable la trayectoria de estrés y fatiga del desarrollador a lo largo del uso repetido. La encuesta de Sonar de 2026 le pone el dedo en la llaga: el 96% de los desarrolladores desconfía del código generado por IA, y aun así el 46% del código nuevo es producido por IA sin una revisión consistente.

Junta las dos cosas. Un volumen de microdecisiones que un juez de 2011 jamás vio, más la desconfianza que te obliga a revisar todo dos veces, menos el tiempo real para hacerlo. Es la receta perfecta para que tu yo de las 3 de la tarde apruebe un PR que tu yo de las 9 de la mañana habría devuelto con tres comentarios.

No te miento: yo soy ese yo de las 3 de la tarde más seguido de lo que me gustaría.

## Lo que cambié en mi día (y lo que cambiarías tú)

Esto es lo práctico, que es para lo que viniste. Nada de esto requiere creer en el combustible mental. Solo requiere aceptar que decidir mucho, seguido, te empeora.

**Los juicios pesados van en la mañana.** El PR que toca el sistema de pagos, la decisión de arquitectura, el "¿mergeamos antes del fin de semana?": eso lo agendo temprano, antes de haber gastado mi cuota de decisiones en cosas chicas. Si me llega un PR grande a las 3 de la tarde y no es urgente, lo dejo para la mañana siguiente y lo digo sin culpa. Aquí ya escribí sobre lo caro que sale mergear un refactor de IA un viernes por la tarde: [Le pedí a Claude que refactorizara 100 funciones, 7 quedaron más lentas en producción](/es/blog/claude-refactor-100-funciones-7-mas-lentas-produccion/).

**Diseñen franjas de review.** Si en tu equipo cualquiera abre un PR a cualquier hora y espera review inmediato, todos revisan en estado de fatiga al azar. Una franja fija, por ejemplo de 9:30 a 11:00, concentra las revisiones en la ventana donde el equipo decide mejor. No es burocracia; es proteger el juicio colectivo.

**Agrupen las sugerencias de IA en lotes.** En vez de aceptar o rechazar cada sugerencia del asistente en tiempo real, dejo que se acumulen y las reviso en bloque, con la cabeza puesta en revisar y no en programar. Cambiar de contexto entre escribir y juzgar es justo lo que la medida de carga de verificación de CHI 2026 penaliza.

**Los descansos no son flojera, son mantenimiento.** Lo único que la curva de los jueces muestra con claridad, réplicas aparte, es que después de comer la tasa volvía a subir. No sé si fue la comida, la pausa o el cambio de orden de los casos. Me da igual el mecanismo. Si una pausa de 15 minutos me devuelve algo de mi criterio de la mañana, esa pausa es la mejor revisión de código que voy a hacer en todo el día.

Y si quieres ver qué pasa cuando varios revisores cansados miran lo mismo, te dejo este otro experimento mío: [pedí a 3 sub-agentes que revisaran el mismo PR y no se pusieron de acuerdo en el 41% de los comentarios](/es/blog/tres-sub-agentes-revisaron-mismo-pr-40-desacuerdo).

## El cierre

La parte rara de todo esto es que la solución no es esforzarme más. Si pudiera resolver la fatiga de decisión esforzándome, no sería fatiga. La solución es ordenar el día para que mis mejores decisiones caigan cuando yo estoy en mi mejor momento, y para que las horas malas reciban el trabajo que no decide nada.

El código que apruebas a las 3 de la tarde y el que apruebas a las 9 de la mañana se ven idénticos en el diff. La diferencia está en quién lo está leyendo, y a esa hora ese quién no eres del todo tú.

Así que la próxima vez que estés a punto de darle "Approve" a un PR pesado al final de la tarde, hazte una sola pregunta: ¿estoy aprobando el código, o estoy aprobando que ya no quiero seguir decidiendo? Yo me la hago. No siempre me gusta la respuesta.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
