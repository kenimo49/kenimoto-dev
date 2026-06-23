---
title: "Plan Mode de Claude Code: aprueba el plan antes de ejecutar (guía práctica)"
description: "Antes de pedirle código a Claude Code, conviene diseñar el día. El Plan Mode te deja formular y aprobar el plan antes de que la herramienta toque un solo archivo. Esta es la guía para LatAm: qué es, cómo se activa con Shift+Tab, cómo usarlo cada mañana y cuándo no usarlo."
date: 2026-06-23
lang: es
tags: [ia, claudecode, planmode, productividad]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/plan-mode-aprobar-antes-de-ejecutar/"
og_image: "https://kenimoto.dev/images/blog/plan-mode-aprobar-antes-de-ejecutar/og-es.png"
cross_posted_to: []
---

Cuando empecé con Claude Code lo usaba de la forma más obvia: abría la terminal y le pedía que implementara algo. "Le doy la instrucción y sale el código." Y salía. Ese era justamente el problema: salía tan fácil que no me daba cuenta cuando salía hacia el lado equivocado. Terminaba el día con mucho código y, a la mañana siguiente, reescribía buena parte por mi cuenta.

Lo que cambió eso no fue un truco de prompt ni una herramienta nueva. Fue empezar a usar una función que ya estaba ahí y que yo ignoraba: el **Plan Mode**. Esta es una guía práctica de cómo lo uso, pensada para quienes trabajan en LatAm y quieren algo concreto: qué es, cómo se activa, cómo se mete en el día y cuándo conviene no usarlo.

Aclaro de entrada: esto no es sobre escribir specs ni sobre el contexto que se degrada cuando no haces `/clear`. Son otros temas. Acá hablo de una sola cosa: **aprobar el plan antes de ejecutar.**

## Qué es el Plan Mode

El Plan Mode es un modo de Claude Code en el que la herramienta **no modifica ningún archivo**. En lugar de escribir código, se concentra en formular el plan y alinearlo contigo. Lo activas con `Shift+Tab`.

La idea es simple: separas el momento de pensar del momento de hacer. Primero acuerdas qué se va a construir, en qué orden y con qué decisiones de diseño. Recién cuando el plan está aprobado, sales del Plan Mode y dejas que escriba el código.

```text
> (Plan Mode) Hoy quiero implementar autenticación de usuario.
> Tres partes: correo/contraseña, Google OAuth y reseteo de contraseña.
> Propón la prioridad y el orden de implementación.

Claude: Propongo este orden:

1. Auth correo/contraseña (base; el resto depende de esto)
2. Reseteo de contraseña (extensión del auth por correo)
3. Google OAuth (es bastante independiente)

¿Quieres que muestre una estimación de cada parte y las decisiones de diseño?
```

Fíjate en lo que todavía no pasó: no se escribió código. Solo orden, dependencias y dirección de diseño.

## Por qué aprobar el plan antes reduce el retrabajo

Detenerte a planear parece un rodeo. En la práctica te ahorra tres tipos de retrabajo, y los tres se resuelven antes de que exista una sola línea de código.

**Evitas el desalineamiento desde el inicio.** Si saltas directo a implementar, Claude elige un enfoque de diseño creyendo que ayuda, y a veces no es el tuyo. Te enteras cuando el código ya está a medias. Alinear la dirección en Plan Mode hace que ese retrabajo simplemente no ocurra.

**Descompones mejor las tareas.** Cuando le pides a Claude que arme el plan, salen a la luz dependencias que no habías visto. "Ah, primero tengo que correr esta migración" aparece en la fase de planeación, no a las tres de la tarde cuando te trabas.

**El código sale mejor.** Implementar después de planear sube la calidad de la salida, porque el contexto ya contiene qué construir y cómo. Es la diferencia entre un colega con quien acordaste el diseño y uno al que solo le dijiste "hazlo".

![Comparación de dos flujos del día: pedir código directo, con el retrabajo estallando a mitad de la implementación, frente al Plan Mode en la mañana, donde el retrabajo se adelanta y se resuelve en el alineamiento](/images/blog/plan-mode-aprobar-antes-de-ejecutar/flujo-plan-mode.png)

## Cómo dividir las tareas: por funcionalidad, no por capa

Dentro del plan, la decisión que más rinde es cómo cortas las tareas. Córtalas por **funcionalidad** vista por el usuario, no por capa del stack técnico.

```text
❌ División por stack (se rompe al integrar)
- Tarea 1: todas las migraciones
- Tarea 2: todos los endpoints
- Tarea 3: todas las pantallas

✅ División por funcionalidad (la menor unidad que puedes probar de punta a punta)
- Tarea 1: listado de productos (BD + API + pantalla)
- Tarea 2: agregar al carrito (BD + API + pantalla)
- Tarea 3: pago (BD + API + pantalla + integración externa)
```

Cortando por funcionalidad, verificas el funcionamiento completo cada vez que terminas una tarea. Cortando por capa, todo el desajuste se acumula y revienta junto al final, en la integración. Es como dejar la contabilidad del mes entero para la última noche: lo que se resolvía de a poco se vuelve un solo dolor de cabeza.

## El día completo, paso a paso

Una vez aprobado el plan, sales del Plan Mode y empiezas a implementar. Este es el ritmo que sigo:

| Hora | Fase | Cómo uso Claude Code |
|------|------|----------------------|
| 9:00-9:30 | Planeación | Plan Mode: diseño y división de tareas |
| 9:30-12:00 | Implementación | Modo normal. `/clear` entre tareas |
| 13:00-15:00 | Pruebas y refactor | Agregar tests, pedir code review |
| 15:00-17:00 | Revisión y cierre | Revisar el diff, ordenar commits, dejar nota para mañana |

Durante la implementación separo las sesiones por tarea y uso `/clear` entre ellas, para que el contexto de una funcionalidad no se filtre a la otra. En sesiones largas uso `/compact` cuando termino una subtarea o cuando los intentos de arreglar un error ya pasaron de cinco. Al final del día dejo una nota: qué terminé, qué falta, qué quedó pendiente. Esa nota es la entrada del Plan Mode de la mañana siguiente, así que el calentamiento del día siguiente es casi cero.

## Cuándo usarlo y cuándo no

El Plan Mode no es para todo. Esta es mi regla práctica:

- **Úsalo** cuando la tarea toca varios archivos, tiene dependencias entre partes, o cuando todavía no tienes claro el orden. Ahí es donde el desalineamiento cuesta caro y planear lo previene.
- **No te molestes** con un cambio de una línea, un typo o algo que ya tienes clarísimo. Abrir el Plan Mode para arreglar un texto en un botón es ceremonia pura: te frena más de lo que te ayuda.

La señal de que lo necesitas es simple: si no puedes describir en una frase qué vas a construir y en qué orden, todavía no estás listo para ejecutar. Eso es exactamente lo que el Plan Mode te obliga a resolver primero.

La herramienta es la misma de siempre y no memoricé ningún prompt mágico. Lo único que cambié fue el orden: diseñar primero, ejecutar después. El retrabajo que se me iba en la tarde resultó ser, casi siempre, algo que podía haber resuelto en la mañana. El Plan Mode solo me obligó a adelantarlo.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
