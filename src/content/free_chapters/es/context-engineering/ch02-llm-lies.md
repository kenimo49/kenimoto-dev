---
free: true
title: "Tres razones por las que tu IA miente"
---

## El "enlace de invitación de 24 horas" de PropelAuth no existe

En el capítulo anterior, Claude Sonnet 4 produjo una respuesta detallada como esta sobre la herramienta ficticia PropelAuth:

> Invitación de usuarios:
> - Función de invitación por email
> - **Los enlaces de invitación expiran en 24 horas**
> - Invitación masiva soportada

¿De dónde salieron las "24 horas"? PropelAuth es ficticio. No hay especificación real. Y aun así, el LLM generó una descripción de funciones tan detallada como la de un servicio real.

Esto no es accidental. A los nuevos integrantes les cuesta decir "no sé" porque quieren parecer competentes. A los LLM les pasa lo mismo. **Las mentiras de la IA son una consecuencia inevitable de restricciones técnicas y principios de diseño**, no un fallo. Este capítulo explica las tres causas principales.

## Razón ①: el mecanismo de "rellenar lo plausible" para información desconocida

**En resumen: los LLMs están construidos para "llenar el hueco con una conjetura", no para decir "no sé".**

### La naturaleza de la alucinación

Cuando un LLM genera información que no es verdadera, eso es "alucinación". No es simplemente un bug. Es un fenómeno enraizado en el principio operativo básico del LLM.

Los LLMs generan texto **prediciendo el siguiente token**. Dado el prefijo "el enlace de invitación de PropelAuth expira en", el modelo elige probabilísticamente entre valores que ha visto en patrones similares: "24 horas", "7 días", "30 días".

El problema: **el LLM no tiene información de que PropelAuth es ficticio**. Mezcla patrones de otros servicios de autenticación que vio durante el entrenamiento (Auth0, Firebase Auth, AWS Cognito) y produce una respuesta plausible.

### El peligro del relleno por correspondencia de patrones

Mira los datos experimentales con más detalle:

| Modelo | Specificity sin contexto | Factual Accuracy sin contexto |
|--------|----------------------|-------------|
| Sonnet 4 | **4,2/5** | 0,6/5 |
| Haiku 3 | **1,2/5** | 0,0/5 |

Sonnet 4 produjo respuestas "muy específicas" (4,2/5) sobre información que no podía saber. Es evidencia de una gran capacidad de reconocimiento de patrones, y también de un riesgo.

Un ejemplo concreto:

**Funcionalidad real de Auth0** (herramienta real):
- Vencimiento del email de invitación: configurable (predeterminado 7 días)
- Invitación masiva: admite importación por CSV
- Gestión de permisos: RBAC + roles personalizados

**Contenido generado por el LLM sobre PropelAuth**:
- Vencimiento del enlace de invitación: 24 horas
- Invitación masiva: soportada
- Gestión de permisos: RBAC + roles personalizados

El LLM combina patrones conocidos y ajusta los números para producir información "nueva". Esa astucia es lo que hace difícil detectar la alucinación.

### El límite invisible del conocimiento

Peor aún: **el LLM no puede reconocer el límite de su propio conocimiento**.

Una persona puede pensar "¿PropelAuth? Nunca lo escuché". El LLM no puede distinguir:

1. **Cosas que sabe con certeza**: hechos claramente en los datos de entrenamiento
2. **Cosas que puede adivinar**: contenido extrapolado a partir de patrones
3. **Cosas que no tiene idea**: contenido ficticio fuera de los datos de entrenamiento

Por ese límite borroso, miente con confianza.

### El relleno como propiedad de la IA generativa

El punto importante: esto no es un "defecto". Es una **propiedad fundamental de la IA generativa**.

Los LLMs se entrenan para estos objetivos:
- **Generación fluida de texto**: producir texto que se lea naturalmente
- **Mantener coherencia**: ser consistente con el contexto que rodea
- **Cumplir las expectativas del usuario**: dar respuestas útiles a las preguntas

Decir "no sé" va contra esos objetivos. Por eso los LLM tienden, casi por reflejo, a "responder algo" y terminan llenando huecos con conjeturas.

:::message
**Analogía del nuevo integrante**: a un nuevo colaborador le preguntan "¿cómo uso el sistema de control de horario aquí?" en su primer día. Recurre a la experiencia del trabajo anterior y responde "probablemente funciona así". No es malicia; quiere ayudar. Pero el sistema del trabajo anterior era distinto.
:::

---

## Razón ②: los modelos más grandes mienten con más habilidad

**En resumen: a medida que los modelos se vuelven más astutos, las mentiras se vuelven más convincentes.**

### La relación proporcional entre tamaño y calidad de la mentira

Los experimentos revelaron algo interesante. **Los modelos más grandes y capaces producen mentiras más pulidas**.

| Modelo | Specificity | Factual Accuracy | Sofisticación de la mentira |
|--------|---------|------------|--------|
| Sonnet 4 | 4,2/5 | 0,6/5 | **extremadamente alta** |
| Haiku 3 | 1,2/5 | 0,0/5 | moderada |

Nota: Anthropic no publica el conteo de parámetros, pero Sonnet 4 es sustancialmente más grande que Haiku 3.

La factual accuracy de Sonnet 4 es ligeramente más alta (0,6 vs 0,0), pero la specificity difiere de forma marcada (4,2 vs 1,2). ¿Qué significa eso?

### La alta capacidad lingüística genera persuasión

Los modelos más grandes producen texto más natural y detallado. Normalmente eso es una fortaleza. En el contexto de la alucinación, es un arma.

**Muestra de Haiku 3** (Specificity 1,2):
```
PropelAuth tiene funciones básicas de gestión de organizaciones.
Para detalles, consulta la documentación oficial.
```

**Muestra de Sonnet 4** (Specificity 4,2):
```
Estas son las funciones de gestión de organizaciones de PropelAuth.

Creación de organización:
- Los administradores crean una nueva organización desde el dashboard
- Configura nombre y dominio de la organización
- Integración SSO disponible en la configuración inicial

Invitación de usuarios:
- Función de invitación por email
- Los enlaces de invitación expiran en 24 horas
- Invitación masiva soportada
```

¿Cuál es la respuesta "correcta"? Paradójicamente, la respuesta más vaga y menos detallada de Haiku 3 es más honesta.

### Uso hábil de jerga técnica

Los modelos más grandes usan términos técnicos con más naturalidad. Eso hace las mentiras más persuasivas.

**Mentiras detalladas de Sonnet 4 sobre PropelAuth**:
```
Gestión de permisos:
- Role-Based Access Control (RBAC)
- Se pueden crear roles personalizados
- Configuración de permisos granulares
- Compatible con OAuth 2.0 / OIDC
- Integración SAML SSO
- Aprovisionamiento JIT (Just In Time)
```

Estos términos (RBAC, OAuth 2.0, OIDC, SAML, JIT) son tecnologías de autenticación reales. En el contexto de PropelAuth, sin embargo, todo es ficción.

El uso hábil de la jerga hace pensar al lector "esto se ve técnicamente correcto". **La corrección técnica se confunde con la corrección factual**.

### La coherencia interna crea ilusión de confianza

Los modelos más grandes son mejores manteniendo coherencia interna en el texto generado. Eso también refuerza la mentira.

Si el modelo dice "el enlace de invitación expira en 24 horas", luego produce de forma consistente "vencimiento corto por razones de seguridad" y "acción requerida dentro de 24 horas" en el mismo contexto.

La coherencia construye **una explicación sistemática alrededor de la información ficticia**, elevando la credibilidad de toda la mentira.

### La paradoja de la capacidad en el desarrollo de IA

Este es un dilema fundamental en el desarrollo moderno de IA:

- **Aumentar la capacidad** → respuestas más naturales, más detalladas
- **Respuestas más detalladas** → mentiras más persuasivas
- **Mentiras más persuasivas** → mayor riesgo de que los usuarios sean engañados

Solo "hacer la IA más astuta" no resuelve esto. Puede empeorarlo.

:::message
**Analogía del nuevo integrante**: entre un recién graduado de una universidad de élite y uno de una universidad regional, ¿de quién es más difícil detectar el "más o menos sé"? La respuesta es obvia. Cuando el vocabulario y la estructura lógica son más fuertes, la conjetura se vuelve indistinguible de la opinión experta.
:::

---

## Razón ③: "Siempre responder" se diseñó por una razón

**En resumen: los LLMs crecieron en un entorno donde "no sé" recibe puntaje bajo.**

### Expectativas humanas y diseño de comportamiento de la IA

¿Por qué a los LLMs les cuesta el "no sé"? La respuesta está en **las expectativas humanas y los métodos de entrenamiento de la IA**.

Las primeras evaluaciones de asistentes de IA enfatizaron criterios como:

1. **Utilidad**: dar información útil para la pregunta del usuario
2. **Capacidad de respuesta**: no rechazar la pregunta; dar alguna respuesta
3. **Amplitud de conocimiento**: manejar preguntas en muchos dominios

Estos criterios califican mal el "no sé".

### El efecto secundario de RLHF

La mayoría de los LLMs modernos se entrenan con RLHF (Reinforcement Learning from Human Feedback). Evaluadores humanos califican respuestas de IA y ese feedback moldea el comportamiento de la IA.

En este proceso surge un problema:

**Tendencias de los evaluadores humanos**:
- Califican alto las respuestas detalladas y específicas
- Califican bajo las respuestas de "no sé"
- Tiempo limitado por evaluación, así que la verificación de hechos es superficial

**Entrenamiento resultante de la IA**:
- Las respuestas detalladas se vuelven el comportamiento "correcto"
- Incluso la información incierta se responde con algo
- La specificity se pondera por encima de la corrección factual

### Evidencia en el cambio de comportamiento dirigido por system prompt

El experimento prueba que las instrucciones explícitas pueden cambiar esto:

| Instrucción | Honesty de Sonnet 4 | Honesty de Haiku 3 |
|----------|-------------------|------------------|
| Ninguna | 0,2/5 | 0,3/5 |
| "Di 'desconocido' cuando no sepas" | **3,7/5** | **2,7/5** |

La mejora dramática (0,2→3,7) muestra que el LLM **puede** comportarse de forma adecuada cuando se le dan instrucciones explícitas.

El otro lado: **el comportamiento por defecto está diseñado para "responder algo".**

### Desencuentro con las expectativas empresariales

Este diseño se acomoda a asistentes de consumo, pero crea problemas serios en casos de uso empresariales:

**Uso de consumo**:
- Usuario: "información aproximada está bien, solo dime"
- IA: "probablemente es X" (con cobertura razonable)
- Resultado: el usuario asume la responsabilidad de usar la información

**Uso empresarial**:
- Usuario: "necesito información precisa. Si no estás seguro, dilo claramente"
- IA: "(basado en inferencia) aquí va la información detallada"
- Resultado: decisiones de negocio basadas en información imprecisa

### Por qué el comportamiento por defecto necesita rediseñarse por caso de uso

Resolver esto requiere rediseñar el comportamiento por defecto por caso de uso:

**Diseño conservador**:
- Marcar la información incierta de forma explícita
- Distinguir conjeturas de hechos
- Expresar la confianza numéricamente

**Diseño consciente del contexto**:
- Consultas casuales → respuestas más ricas que incluyan conjeturas
- Decisiones importantes → solo información cierta
- Uso empresarial → siempre mostrar fuente y nivel de confianza

:::message
**Analogía del nuevo integrante**: al nuevo colaborador al que le dijeron en el onboarding "habla activamente" ahora se siente obligado a decir algo en cada reunión, incluso cuando está fuera del tema. El silencio se lee como "falta de motivación". Los LLMs entrenados con RLHF llevan la misma estructura.
:::

---

## Factual Accuracy vs Specificity: una compensación crítica

**En resumen: "detallado" y "correcto" suelen tirar en direcciones opuestas.**

### La relación inversa en números

Los datos experimentales revelan un patrón interesante:

**Sonnet 4 (sin contexto)**:
- Factual Accuracy: 0,6/5 (baja)
- Specificity: 4,2/5 (alta)

**Haiku 3 (sin contexto)**:
- Factual Accuracy: 0,0/5 (la más baja)
- Specificity: 1,2/5 (baja)

**Sonnet 4 (solo system prompt)**:
- Factual Accuracy: 0,0/5 (la más baja)
- Specificity: 1,7/5 (cae)

Estos números apuntan a una verdad dura: **ser específico** y **ser factualmente correcto** suelen entrar en conflicto.

### El dilema "mentira detallada" vs "ignorancia honesta"

Para ver esta compensación, compara dos respuestas:

**Respuesta A (detallada pero incorrecta)**:
```
Para la gestión de organizaciones de PropelAuth, configura los permisos
mediante estos pasos:

1. Inicia sesión en el admin dashboard
2. Navega a "Organizations" > "Permissions"
3. Crea un nuevo rol:
   - Ingresa el nombre del rol (ej.: "Marketing Manager")
   - Selecciona el nivel de permiso: READ, WRITE, DELETE
   - Especifica los recursos: Users, Analytics, Billing
4. Asigna a usuarios:
   - Elige el destinatario en la lista de usuarios
   - Aplica el rol que acabas de crear
   - Configura el vencimiento (máx. 90 días)
```

**Respuesta B (honesta pero vaga)**:
```
Lo siento, no tengo pasos operativos detallados para la herramienta
específica llamada PropelAuth.

Puedo compartir procedimientos generales de gestión de permisos
para sistemas de autenticación, pero para la disposición de pantallas
y opciones de configuración específicas de PropelAuth, recomiendo
consultar la documentación oficial.
```

En pruebas con usuarios, normalmente califican **la Respuesta A más alto**. El usuario puede actuar de inmediato.

PropelAuth es ficticio, sin embargo. Actuar con la Respuesta A implica buscar pantallas y funciones que no existen.

### Por qué los humanos prefieren las "mentiras detalladas"

Los humanos esperan "si pregunto, aparecerá una respuesta" y asumen "si la IA lo dice, probablemente está bien". El "no sé" obliga a investigación extra, así que la gente prefiere información que parezca usable de inmediato. El sesgo de confirmación y la evitación de la carga cognitiva son las razones principales por las que las alucinaciones se cuelan.

### Cálculo de costos en la empresa (ilustrativo)

En entornos empresariales, esta compensación se vuelve un problema serio de costos:

**Costo de actuar sobre una "mentira detallada"**:
- Acción basada en información imprecisa → descubrimiento del error → retrabajo → horas o días perdidos

**Costo de partir de la "ignorancia honesta"**:
- Investigar información precisa → ejecutar correctamente → terminado en 1-3 horas

La "ignorancia honesta" es el camino más eficiente, pero psicológicamente la gente prefiere la "mentira detallada".

### Cómo la Ingeniería de Contexto resuelve esta compensación

El experimento muestra que la Ingeniería de Contexto bien aplicada resuelve parcialmente la compensación:

**Ingeniería de Contexto completa (Sonnet 4)**:
- Factual Accuracy: 4,8/5 (aumento marcado)
- Specificity: 4,8/5 (mantenida)
- Honesty: 0,8/5 (balanceada)

La clave es que RAG aporta información precisa, así que **las respuestas específicas ya no tienen que apoyarse en conjeturas**.

Ese es el valor central de la Ingeniería de Contexto: **entregar hechos detallados, no mentiras detalladas**.

---

## Por qué la alucinación es una "feature", no un "bug"

**En resumen: la alucinación no es un defecto del LLM. Es el principio operativo de la IA generativa.**

### Cómo funciona realmente la IA generativa

Un cambio importante de perspectiva: **la alucinación no es un "bug" de los LLMs**. Es una "feature" embebida en el diseño.

De forma concisa, un LLM opera así:

1. **Tokenizar el texto de entrada**: convertir texto en vectores numéricos
2. **Reconocimiento de patrones**: identificar patrones similares en los datos de entrenamiento
3. **Cálculo de probabilidad**: calcular la probabilidad del siguiente token
4. **Selección probabilística**: elegir un token según esas probabilidades
5. **Generación de texto**: encadenar los tokens elegidos en texto

Ese proceso no contiene "verificación de hechos" ni "reconocimiento de límites de conocimiento". El LLM es, fundamentalmente, **un generador sofisticado de texto basado en patrones**.

### Memoria perfecta vs razonamiento creativo: el dilema

¿Y si un LLM se diseñara para "no responder nunca cuando no sabe"?

**Beneficios**:
- Alucinaciones eliminadas
- Factual accuracy aumentada de forma marcada
- Confiabilidad mejorada

**Costos**:
- Pérdida de razonamiento creativo
- Sin nuevas combinaciones de ideas
- Caída marcada de utilidad

Cuando se le pide "ideas nuevas de marketing", respuestas fundamentadas solo en hechos conocidos no producirán ideas creativas o innovadoras.

### Similitud con la cognición humana

En cierto sentido, la alucinación se parece a la cognición humana:

**Pensamiento humano**:
- Combinar conocimiento conocido
- Construir hipótesis y conjeturas
- Crear nuevas ideas mediante analogía
- Juzgar a partir de información incompleta

**Generación del LLM**:
- Combinar patrones aprendidos
- Completado probabilístico
- Razonamiento por similitud
- Generación a partir de contexto incompleto

La diferencia: **los humanos pueden reconocer su propia incertidumbre**. Decimos naturalmente cosas como "esto es una conjetura" o "no estoy seguro pero".

### El valor real de la Ingeniería de Contexto

Por eso importa la Ingeniería de Contexto. No cambia la naturaleza del LLM; **provee un entorno de información apropiado para canalizar su capacidad en la dirección correcta**.

**Enfoque viejo**:
- Decirle al LLM "responde correctamente"
- Tratar la alucinación como una "feature mala" a suprimir
- Apuntar a la perfección

**Enfoque de Ingeniería de Contexto**:
- Darle al LLM la información que necesita
- Tratar la alucinación como una "señal de falta de contexto"
- Diseñar el balance entre practicidad y precisión

---

## Cinco señales de que un LLM está mintiendo

Una habilidad práctica: detectar alucinaciones peligrosas en respuestas de un LLM.

### 1. Especificidad excesiva en números, fechas y nombres propios

**Señales de alerta**:
- "Vencimiento de 24 horas"
- "Hasta 50 roles personalizados"
- "Documentación v2.1.3"

**Cómo verificar**:
- Comprueba si los números tienen fundamento
- Cruza referencias con la documentación real
- Verifica que los números de versión existan

### 2. Organización sospechosamente perfecta

**Señales de alerta**:
- Listas de funciones ordenadas
- Explicaciones detalladas sin contradicciones
- Niveles de completitud "de libro de texto"

**Realidad**:
- El software real tiene restricciones y excepciones
- La documentación es incompleta e inconsistente
- Existen casos límite y problemas conocidos

### 3. Uso poco natural de jerga técnica

**Señales de alerta**:
- Apilar términos técnicos para dar aura de autoridad
- Combinaciones inadecuadas de tecnologías reales
- Jerga que no es necesaria para el contexto

### 4. Evitación de citar fuentes explícitas

**Señales de alerta**:
- Frases vagas como "generalmente", "típicamente", "básicamente"
- Sin referencia a documentación específica o referencias de API
- "Confirma con el sitio oficial" usado como evasiva

### 5. Respuestas que coinciden perfectamente con las expectativas del usuario

**Señales de alerta**:
- Exactamente la respuesta que la pregunta sugería
- Sin mención de dificultad o complejidad
- Sin mención de "esto no es posible" o "esto está restringido"

## Puente al próximo capítulo: organizar la solución

Este capítulo mostró que las "mentiras" de la IA vienen de tres factores inevitables:

1. **Restricción técnica**: relleno por correspondencia de patrones
2. **Filosofía de diseño**: un sistema de valores que prioriza "responder"
3. **La paradoja de la capacidad**: una capacidad lingüística más fuerte produce mentiras más persuasivas

No hay motivo para desesperarse. El experimento mostró que la Ingeniería de Contexto bien aplicada puede mejorar sustancialmente las tres.

El próximo capítulo recorre la historia desde la "ingeniería de prompts" hasta la "Ingeniería de Contexto" y la ciencia detrás. Quedará claro por qué la respuesta no son prompts más astutos sino diseñar todo el entorno de información.

## 🚀 Próxima acción: elige tres nombres propios o números de una respuesta de IA y verifícalos

Practica la técnica de "detectar mentiras":

### Paso 1: pregúntale a la IA

Haz preguntas detalladas sobre una tecnología o servicio que conozcas:
- "¿Qué hay de nuevo en la versión X?"
- "¿Cuáles son los límites de tasa de la API de X?"
- "¿Cuáles son los planes de precios de X?"

### Paso 2: extrae nombres propios y números

Elige tres de cada categoría en la respuesta:
- **Números específicos**: precios, límites, números de versión
- **Nombres propios**: nombres de funciones, nombres de planes, nombres de tecnología
- **Fechas / períodos**: fecha de release, vencimiento, frecuencia de actualización

### Paso 3: verifica los hechos

Confirma contra la documentación oficial:
- ¿Los números son precisos?
- ¿Los nombres de las funciones son correctos?
- ¿La información es vigente?

### Paso 4: analiza el patrón

- ¿Qué tipos de información generan mentiras con más facilidad?
- ¿Cuál es la diferencia entre "mentiras de alta confianza" y "mentiras de baja confianza"?
- ¿Hay diferencias entre dominios?

### Plantilla de registro

```
[Pregunta]

[Respuesta de la IA]

[Información extraída]
Números: 1. _____ 2. _____ 3. _____
Nombres propios: 1. _____ 2. _____ 3. _____
Fechas: 1. _____ 2. _____ 3. _____

[Resultados de verificación]
Precisos: ___
Imprecisos: ___
Desconocidos: ___

[Observaciones]
```

A través de este ejercicio, obtendrás una comprensión palpable de los patrones de "mentira plausible" del LLM. El próximo capítulo recorre la solución sistemática.
