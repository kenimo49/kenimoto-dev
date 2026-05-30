---
title: "Context rot en agentes: 7 pasos para mantener limpia la ventana de contexto (empieza antes de lo que crees)"
description: "Mi agente se degradaba con las sesiones largas y yo le echaba la culpa al modelo. El problema era el contexto. Esta es la guía práctica de 7 pasos que uso para frenar el context rot antes de que arruine las respuestas."
date: 2026-05-31
lang: es
tags: ["context-engineering", "context-rot", "claude-code", "agentes-ia"]
featured: false
og_image: "https://kenimoto.dev/images/blog/context-rot-agentes-7-pasos-ventana-limpia/og-es.png"
cross_posted_to: []
---

Durante semanas le eché la culpa al modelo. Mi agente arrancaba la sesión afilado y terminaba torpe: ignoraba reglas que yo había dejado por escrito, revivía decisiones que ya habíamos descartado, releía el mismo archivo tres veces. "Hoy el modelo está raro", pensaba, y subía de tier esperando que el problema se arreglara con más parámetros.

No se arreglaba. Porque el problema no era el modelo. Era el contexto que yo le seguía pasando, sesión tras sesión, sin limpiarlo nunca.

Eso tiene nombre: **context rot**, la degradación de la ventana de contexto. Y la parte que más me costó aceptar es que empieza mucho antes de lo que uno cree.

## Qué es el context rot y por qué empieza temprano

El término lo formalizó una [investigación de Chroma en 2025](https://www.understandingai.org/p/context-rot) que probó 18 modelos de frontera de forma sistemática. El hallazgo no tiene matices: todos, sin excepción, empeoran a medida que crece el input. Y el dato que cambia tu forma de trabajar es este: **un modelo con ventana de 200K tokens ya muestra degradación notable alrededor de los 50K.** A una cuarta parte de llenar la ventana, la calidad ya está cayendo.

El origen de esto es un paper de 2023, [Lost in the Middle](https://arxiv.org/pdf/2307.03172): cuando el contexto se llena, el modelo le da peso a lo que está al principio y al final, y la información del medio se pierde. Si tomaste una decisión importante a mitad de una sesión larga, hay buenas chances de que el modelo ya no la "vea".

Esto no es un problema de laboratorio. Un análisis estimó que [cerca del 65% de las fallas de IA empresarial en 2025](https://www.morphllm.com/context-rot) se debieron a deriva de contexto o pérdida de memoria en mitad de un razonamiento de varios pasos. No porque el modelo fuera tonto, sino porque nadie limpiaba la ventana.

![El context rot empieza alrededor de los 50K tokens, pero el auto-compact de Claude Code espera hasta el 95%. Entre esos dos puntos hay una zona larga donde el agente ya está degradado y nadie hace nada.](/images/blog/context-rot-agentes-7-pasos-ventana-limpia/zona-degradacion.png)

## Cómo se ve cuando pasa

Antes de los pasos, conviene reconocer los síntomas. En la práctica, el context rot llega de cuatro formas:

- **Distracción:** entra tanta información irrelevante que el foco se diluye. El agente se obsesiona con un detalle que ya no importa.
- **Confusión:** mezclaste varios temas en una sesión y el modelo cruza los cables, te responde sobre la tarea A con el tono de la tarea B.
- **Conflicto:** dos instrucciones contradictorias conviven en la ventana ("borra esta función" y "conserva esta función") y las respuestas se vuelven inestables.
- **Envenenamiento:** un error que entró temprano contamina todo lo que viene después, y el modelo lo trata como hecho confirmado.

Si reconociste alguno, el problema está en una ventana sucia. Y eso, al contrario que un modelo, se limpia.

## Los 7 pasos que uso

### 1. Una sesión, un objetivo

El paso más simple y el que más me sirvió. Refactor, tests y documentación en sesiones separadas. Mezclar tareas distintas en una sola ventana es la receta directa para la confusión del punto anterior. Cuando empecé a cortar por tarea, la mitad de los síntomas desaparecieron solos.

### 2. Compacta al 50-60%, no esperes al 95%

Claude Code tiene auto-compact, pero se dispara recién cerca del 95% de la ventana (unos 25% restantes). El problema es obvio cuando lo ves dibujado: la degradación empieza a los 50K y la compactación automática llega a los 190K. En el medio hay una franja enorme donde el agente ya rinde mal y el sistema no hace nada.

[Thariq Shihipar, del equipo de Claude Code, recomienda compactar de forma proactiva al 50-60%](https://www.mindstudio.ai/blog/claude-code-compact-command-context-management) en vez de esperar el automático. La mayoría usa `/compact` mal, dejándolo para cuando la ventana ya está por explotar. Yo era de esa mayoría.

### 3. Usa /clear en los cortes reales

`/clear` y `/compact` no son lo mismo. `/compact` resume la conversación y precarga ese resumen como nuevo contexto: conserva los cambios de código y las decisiones, descarta el ruido intermedio. `/clear` borra todo y arranca de cero.

Regla práctica: `/compact` cuando sigues en la misma tarea y necesitas continuidad; `/clear` cuando cambias de tarea de verdad. El `/clear` es la única forma segura de cortar el envenenamiento: si un error se metió temprano, resumirlo lo conserva; borrarlo lo elimina.

### 4. Resume de forma periódica

En vez de arrastrar todo el historial, mantén un resumen vivo de lo importante: decisiones tomadas, tareas en curso, preferencias del usuario. Es la idea de la memoria por resumen: guardas un resumen comprimido del pasado más los últimos intercambios en detalle. El historial completo casi nunca aporta lo que cuesta en tokens.

### 5. Dale a cada cosa su presupuesto de tokens

No todo merece el mismo espacio. Un reparto que funciona bien como punto de partida: la conversación reciente se lleva la mayor parte, el resumen del pasado un poco menos, el conocimiento de referencia lo mínimo necesario. La conversación reciente siempre tiene prioridad, sin importar qué tan "relevante" parezca el resto. Cuando te pasas del presupuesto, recortas parejo, no a ojo.

### 6. Relee las reglas clave al final

Este es un truco directo contra el "perdido en el medio". Si el modelo prioriza el final del contexto, entonces vuelve a poner lo importante al final. En sesiones largas yo escribo, sin vergüenza, "relee el CLAUDE.md antes de seguir". Eso sube las reglas que se habían hundido en el medio y las trae de vuelta a la zona que el modelo sí mira.

### 7. Delega a subagentes

Las tareas pesadas de exploración o procesamiento en lote no tienen por qué ensuciar tu ventana principal. Delégalas a un subagente: hace el trabajo en su propia ventana y te devuelve solo el resultado. Tu contexto principal se queda limpio, con lo esencial, en vez de cargar con todo el material en crudo de una búsqueda.

## Lo que cambió

Junté estos siete pasos de a poco, cada uno después de tropezar con el síntoma que arregla. El más valioso sigue siendo el primero: una sesión, un objetivo. El más fácil de olvidar es el segundo, porque compactar al 50% se siente prematuro hasta que recuerdas que la degradación ya empezó.

La próxima vez que tu agente se ponga torpe a mitad de una sesión larga, antes de subir de modelo o de pelearte con el prompt, prueba algo más barato: sospecha del contexto antes que del modelo. Compacta, o directamente limpia y vuelve a entrar desde las reglas base. Es muy probable que el modelo "vuelva a ser inteligente". No es que mejoró: es que por fin está mirando algo limpio.

Lo que se pudre no es el modelo. Es la ventana que dejamos llenarse sin tocarla.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
