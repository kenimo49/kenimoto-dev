---
title: "El nacimiento de Claude Code: el comienzo accidental, contado por Boris Cherny"
free: true
---
> **"Y bien, ¿qué música estás escuchando ahora?" Esa única pregunta lo empezó todo.**

![Diagrama conceptual del nacimiento de Claude Code: escribir "¿qué música estoy escuchando?" en un terminal dispara un AppleScript, con cuatro tarjetas FACT que muestran la elección de CLI, la adopción de bash, la orientación tool-first y "construye para el modelo de dentro de seis meses"](images/claude-code-mastery-es-ch01-claude-code-birth.png)
*El momento icónico en que nació Claude Code: un prototipo accidental que cristalizó cuatro decisiones de diseño.*

## "¿Qué música estoy escuchando?"

:::message
 **Lo que aprenderás en este capítulo**
- Cómo nació Claude Code como un "producto accidental"
- La filosofía de diseño de Boris Cherny y sus paralelos con TypeScript
- El descubrimiento clave de que "los modelos quieren usar herramientas"
- Cómo la cultura de seguridad de Anthropic moldeó el diseño de Claude Code
- El principio de desarrollo "construye para el modelo de dentro de seis meses"
:::

Una noche de septiembre de 2024, el ingeniero de Anthropic Boris Cherny escribía una sencilla app de chat de terminal para probar el comportamiento de la API de la empresa.

La primera herramienta fue solo `bash`: una única herramienta. Era un prototipo sin nada de especial, montado casi por completo a partir del código de ejemplo de la documentación oficial. Para verificar que funcionaba, escribió:

```
What music am I listening to?
```

El modelo escribió espontáneamente un AppleScript, controló el reproductor de música del Mac y devolvió el nombre de la canción que sonaba.

Boris ha dicho que ese fue el momento en que "sintió AGI por primera vez". Sin que nadie se lo indicara, el modelo **quiso usar herramientas**. "El modelo quiere usar herramientas. Es solo eso." Ese descubrimiento fue el comienzo mismo de Claude Code.

## ¿Quién es Boris Cherny?

Para contar la historia del nacimiento de Claude Code, primero necesitamos conocer a su creador, Boris Cherny.

Es conocido como autor de *Programming TypeScript*, publicado por O'Reilly, y es experto en sistemas de tipos y diseño de lenguajes de programación. TypeScript encarna una filosofía de "adaptar el sistema de tipos a la forma en que escriben los programadores, en lugar de obligar a los programadores a cambiar sus hábitos". Esa filosofía después influyó directamente en los principios de diseño de Claude Code.

Cuando Boris entró en Anthropic, no tenía planes de construir un producto como Claude Code. Lo que quería era entender más a fondo la API de la empresa. La pequeña app de terminal que construyó para eso terminó convirtiéndose en uno de los agentes de coding con IA más usados del mundo, algo que ni él mismo pudo predecir.

Esta historia me atrae porque resuena con mi propia experiencia. En la época en que trabajé en desarrollo de robótica, construí un pequeño prototipo con un ingeniero francés que creció en direcciones inesperadas. En lugar de dibujar un gran diseño desde el principio, hay una sensación de que **el descubrimiento llega cuando te ensucias las manos**, algo que creo que todo ingeniero ha sentido en algún momento.

## Nacido de un hackathon interno, por casualidad

Claude Code no fue resultado de un esfuerzo planeado de desarrollo de producto. La app de terminal que Boris construyó para probar el comportamiento de la API era puramente una herramienta de experimentación personal.

Sin embargo, dos coincidencias afortunadas se juntaron.

**Coincidencia #1: Elegir una CLI**

Boris eligió una CLI por una razón extremadamente práctica: **no tenía que construir UI**. Tomó el terminal como el prototipo más barato posible. Sin UI web, sin app de escritorio. Solo texto entrando, texto saliendo: la forma más simple posible.

Ese "atajo" resultó ser la mejor decisión de diseño. El terminal era el entorno con el que los desarrolladores estaban más familiarizados, y también el entorno más natural para que los modelos usen herramientas.

**Coincidencia #2: Hacer de bash la primera herramienta**

Al usar la herramienta bash directamente del código de ejemplo de la documentación, el modelo ganó un entorno donde podía ejecutar comandos libremente. No fue una elección intencional de diseño. Simplemente sucedió así. Pero ese grado de libertad encajó perfectamente con la tendencia del modelo de "querer usar herramientas".

Cuando Boris compartió este prototipo internamente, la reacción fue inesperada. Los ingenieros de Anthropic empezaron a **usar la herramienta en su trabajo del día a día**.

## "Nadie lo pidió, pero todo el mundo lo necesitaba"

A finales de 2024, el mercado de herramientas de coding con IA ya tenía players fuertes como Cursor y GitHub Copilot. Los asistentes de IA integrados en IDE eran lo dominante, y prácticamente no había demanda de "escribir código conversando con IA en el terminal".

Aun así, la rápida adopción interna de Claude Code reveló una verdad importante: **la gente no sabe lo que necesita hasta que lo tiene**.

Boris explica esto usando el concepto de **"Demanda Latente"**. Los ingenieros ya trabajaban en el terminal. Claude Code era una herramienta que se mezclaba naturalmente con su flujo de trabajo existente. Usas tu terminal de siempre, trabajas como siempre, salvo que ahora Claude está justo a tu lado.

Esta idea de "colocar el producto en la extensión de los patrones de comportamiento existentes" es uno de los factores más importantes detrás del éxito de Claude Code. Lo trataré en detalle en el Capítulo 3.

## Lo que produjo la cultura de Anthropic

No se puede contar la historia del nacimiento de Claude Code sin considerar la cultura de Anthropic como empresa.

Anthropic es única en el sector por colocar la "seguridad de la IA" en el centro de su misión corporativa. Persigue los objetivos aparentemente contradictorios de maximizar la capacidad de la IA mientras, al mismo tiempo, garantiza su seguridad.

Cómo influyó esta cultura en Claude Code se ve claramente en varias decisiones de diseño.

**Gestión de Permisos para la ejecución de herramientas**

Claude Code tiene un mecanismo integrado que pide aprobación al usuario cuando el modelo modifica archivos o ejecuta comandos. En lugar de "dejar que la IA haga lo que quiera", la filosofía de diseño es **dejar el control en manos del humano**.

```
Claude wants to run: rm -rf node_modules && npm install

Allow? (y/n)
```

Este prompt puede parecer pesado a primera vista. Pero es la implementación técnica del énfasis de Anthropic en la "supervisión humana".

**Diseñado para no enviar código al exterior**

Claude Code no almacena tu codebase en un vector DB ni construye índices en servidores externos. La arquitectura en la que el modelo busca directamente en archivos locales vía grep/glob es **también una elección excelente desde el punto de vista de seguridad**.

Esta decisión se tomó inicialmente por razones técnicas (Agentic Search era más preciso que RAG), pero se alineó hermosamente con la cultura safety-first de Anthropic.

**Conciencia del ASL (AI Safety Level)**

Boris habla abiertamente en entrevistas sobre riesgos como ASL4 (el nivel de riesgo para modelos que se auto-mejoran recursivamente), uso indebido para armas biológicas y exploits zero-day. El simple hecho de que un desarrollador de una herramienta de coding con IA discuta estos riesgos públicamente refleja la cultura de Anthropic.

Cuando empecé a usar Claude Code, lo primero que noté fue ese "cuidado por la seguridad". Comparado con otras herramientas de coding con IA, Claude Code **restringe intencionalmente lo que puede hacer** en ciertas áreas. Pero esto no es una limitación: es diseño. En lugar de soltar la rienda, está pensado para colaborar con humanos. Esa filosofía es lo que crea confianza en el uso real.

## Veinte pull requests al día

La evidencia más convincente de la efectividad de Claude Code viene de los propios resultados internos de Anthropic.

El estilo de trabajo de Boris cambió drásticamente antes y después de adoptar Claude Code:

- Desde Opus 4.5, escribe el **100%** de su código con Claude Code
- Desinstaló su IDE
- Manda **20** pull requests por día

El equipo en su conjunto reportó resultados como:

- **Aumento del 150%** en productividad por ingeniero
- La predicción del CEO Dario de que "el 90% del código será escrito por Claude" se hizo realidad
- Dependiendo del equipo, **el 70–90%** del código es generado por IA

El ex-ingeniero de Google Steve Yegge ha dicho que "los ingenieros de Anthropic son 1000x más productivos que los ingenieros de Google en la época dorada de Google". Puede ser una exageración, pero la sensación de que la productividad cambió a una dimensión completamente diferente es algo que viví en carne propia usando Claude Code intensivamente.

En mi caso, llevo cinco proyectos en paralelo en una pequeña empresa mientras, al mismo tiempo, tomo cursos de extensión universitaria y preparo nuevos negocios. Este estilo de trabajo de "ponerse muchos sombreros" se hizo posible en gran medida gracias a Claude Code. La reducción dramática del tiempo dedicado a escribir código me permitió **enfocarme en la toma de decisiones y la revisión**.

## No queda ni una línea de código de hace seis meses

El propio equipo de desarrollo de Claude Code practica una metodología de desarrollo interesante.

Según Boris, **no queda ni una línea de código de hace seis meses** en el codebase de Claude Code. Agregan y quitan herramientas cada pocas semanas; el código tiene una expectativa de vida de unos pocos meses. Reescriben código constantemente para acompañar la evolución del modelo.

Esto refleja su filosofía de que "scaffolding (andamiaje) = deuda técnica".

> Puedes obtener ganancias de 10–20% en performance con código alrededor del modelo (scaffolding). Pero el siguiente modelo borra esas ganancias. Siempre es un tradeoff entre construir y esperar.

Boris, según se cuenta, tiene el ensayo de Rich Sutton **"The Bitter Lesson"** enmarcado en la pared de su oficina. La tesis central de ese ensayo es que "a largo plazo, escalar computación supera al ingenio humano". En otras palabras, en lugar de construir sistemas complejos alrededor del modelo, es mejor **apostar por la evolución del propio modelo**.

Este pensamiento lleva al principio central del desarrollo de Claude Code:

> Construye no para el modelo de hoy, sino para el modelo de dentro de seis meses.

Aunque encuentres PMF (Product Market Fit) optimizando para el modelo de hoy, el siguiente modelo dejará que los competidores te superen. Entonces percibes los límites de la capacidad del modelo y apuestas por la frontera que se resolverá en seis meses.

Este principio tiene implicaciones importantes para nosotros como usuarios de Claude Code. Ya sea cómo escribimos CLAUDE.md o cómo diseñamos flujos de trabajo, la clave no es "hackear alrededor de las debilidades del modelo actual", sino **mantener las cosas simples, asumiendo que el modelo va a evolucionar**.

## De la coincidencia a la inevitabilidad

El nacimiento de Claude Code fue coincidente. Una app de terminal para probar la API, la herramienta bash del código de ejemplo, elegir una CLI porque "construir UI daba demasiado trabajo". Nada de eso fue intencional.

Pero el resultado que apareció más allá de esas coincidencias fue inevitable:

- Los ingenieros ya trabajaban en el terminal → CLI
- Los modelos querían usar herramientas → bash
- Se necesitaba seguridad y simplicidad → Agentic Search
- Hacía falta control humano → gestión de permisos basada en aprobación

Todo era una respuesta a **demanda que ya estaba ahí**.

Lo que quiero transmitir en este libro no es solo cómo usar Claude Code. Al entender la filosofía detrás de su creación ("no pelees con el modelo", "descubre demanda latente", "construye para dentro de seis meses"), descubrirás **principios para desarrollar junto con la IA** que van más allá del mero uso de la herramienta.

En el próximo capítulo, vamos a ver con más detalle la pregunta "¿por qué el terminal?" y a llegar al corazón de la filosofía de diseño de Claude Code.


## ✅ Puntos clave

- Claude Code no fue un producto planeado: nació accidentalmente de una herramienta de prueba de API
- El descubrimiento de que "los modelos quieren usar herramientas" fue el comienzo de todo
- Las elecciones de terminal, bash y Agentic Search fueron todas respuestas a "demanda existente"
- La cultura de seguridad de Anthropic llevó a una filosofía de diseño que mantiene a los humanos en control
- "Construye no para el modelo de hoy, sino para el modelo de dentro de seis meses" es el principio central de desarrollo de Claude Code

---

**Referencias**

- Boris Cherny, "Inside Claude Code With Its Creator" — Y Combinator The Light Cone (2026-02-17)
