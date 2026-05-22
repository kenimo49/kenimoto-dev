---
title: "Le dije a Claude Code que hiciera TDD. Escribió el test DESPUÉS del código 6 de 10 veces"
description: "Mi CLAUDE.md decía `## TDD Primero`. Claude lo leyó con cuidado y lo ignoró con cuidado, 6 de 10 veces. Aquí está la auditoría de 30 días de mi propio git log, los 4 pasos de verificación que uso ahora, y el hook PreToolUse que finalmente cerró la grieta."
date: 2026-05-23
lang: es
tags: [claude-code, tdd, ai-coding, pruebas, hooks]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/claude-code-tdd-test-despues-codigo-6-de-10/"
og_image: "https://kenimoto.dev/images/blog/claude-code-tdd-test-despues-codigo-6-de-10/og-es.png"
cross_posted_to: []
---

Mi CLAUDE.md tenía una sección que decía `## TDD Primero`. Seis líneas, muy claras. Después de pasar veinte minutos redactándola, hice una auditoría de 30 días de mis propios commits y descubrí que, en las funcionalidades que le pedí a Claude Code que implementara con TDD, el archivo de test se commiteó *después* del archivo fuente 6 de 10 veces. No "el test falló primero y luego lo arreglé". El archivo de test no existía en el momento en que el archivo fuente se commiteó.

Este es el procedimiento de verificación de 4 pasos que armé después de esa auditoría, y el hook PreToolUse que cerró la grieta. Lo escribí pensando en el equipo LatAm que usa Claude Code en su día a día, porque los 4 pasos no requieren herramientas pagas, no dependen de qué editor uses, y funcionan tanto en mi computadora como en la tuya. Ustedes pueden adoptarlos hoy sin pedir aprobación a nadie.

![Línea de tiempo de git log: archivo test.py commiteado 4 minutos después de src.py, en 6 de 10 funcionalidades durante 30 días.](/images/blog/claude-code-tdd-test-despues-codigo-6-de-10/git-log-linea-tiempo.png)

## La auditoría de 30 días: cómo la hice

Recomiendo replicar esta auditoría en su propio repositorio antes de seguir leyendo. Toma unos 15 minutos y los números que salen son su propia evidencia.

**Paso 1: Extraer el log de commits con archivos.** En la raíz del repositorio:

```bash
git log --since="30 days ago" --name-only --pretty=format:'%h %ai %s' > audit.txt
```

Esto te da, por cada commit, la fecha y hora exacta, y la lista de archivos modificados.

**Paso 2: Agrupar por funcionalidad.** En mi caso, una "funcionalidad" es un conjunto de commits con la misma rama de feature o el mismo issue. Si no etiquetas tus commits con un identificador de issue, puedes agrupar manualmente leyendo los mensajes.

**Paso 3: Para cada funcionalidad, anotar la marca de tiempo del primer commit que toca el archivo fuente, y la marca de tiempo del primer commit que toca el archivo de test correspondiente.** Si el archivo de test no existe, anotar "ausente".

**Paso 4: Contar.** Para cada funcionalidad, marcar si el test fue antes, después, o en el mismo commit. La proporción es tu número.

En mi auditoría salieron estos resultados de las 10 funcionalidades del último mes:

| Funcionalidad | Test commiteado | Diferencia |
|---------------|------------------|------------|
| 1 | Después del código | +4 min |
| 2 | Antes del código | -1 min |
| 3 | Después del código | +12 min |
| 4 | No existe (`# TODO: tests`) | — |
| 5 | Antes del código | -3 min |
| 6 | Después del código | +90 seg |
| 7 | Antes del código | -2 min |
| 8 | Después del código | +23 min |
| 9 | Antes del código | -1 min |
| 10 | Después del código | +8 min |

Seis de diez con el test después del código. Yo le pedía TDD a Claude en cada uno. Tenía la sección `## TDD Primero` en CLAUDE.md. En las funcionalidades más complejas pegaba la secuencia red-green-refactor en el prompt. Y aún así, seis de diez veces, Claude escribía la implementación primero y luego (o nunca) el test.

## Por qué pasa esto: predicción de siguiente token

No es que Claude sea perezoso. Es que está haciendo exactamente lo que fue entrenado para hacer. Una predicción de siguiente token, dado el contexto.

En los datos de entrenamiento, la mayoría abrumadora de las respuestas a "implementa esta funcionalidad" tienen la forma *aquí está la función que hace X*, opcionalmente seguida de *y aquí está el test*. La secuencia "test primero, falla, luego implementación" es rara en repositorios públicos porque los humanos rara vez commiteamos la fase roja como un commit aparte. Commiteamos la fase verde. El modelo nunca construyó un prior fuerte para la secuencia red-first.

Varios escritos de la comunidad de Claude Code apuntan a lo mismo. El [análisis del red-green-refactor loop en alexop.dev](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/) argumenta que la única forma confiable de imponer TDD es desde fuera del modelo, con hooks o skills que el agente no pueda evadir a mitad de camino. El [walkthrough de la TDD Skill en BSWEN](https://docs.bswen.com/blog/2026-03-25-tdd-skill-claude-code/) y la [guía de aihero.dev](https://www.aihero.dev/skill-test-driven-development-claude-code) coinciden en otro punto importante: Claude a veces modifica el test para que pase en lugar de arreglar la implementación. Si commiteamos el test antes que la implementación, el diff revela el cambio. Si commiteamos los dos juntos, no hay diff que mirar.

Yo no estaba haciendo nada de eso. El modelo tenía un prior débil para test-first, y yo tenía un flujo de trabajo débil que no compensaba el prior débil. Seis de diez tiene mucho sentido en retrospectiva. Lo sorprendente es que no haya sido más alto.

## El procedimiento de 4 pasos para forzar TDD real

Ahora vienen los 4 pasos. Recomiendo aplicarlos en orden. Cada uno cierra una grieta diferente.

**Paso 1: Prompt explícito de fase roja.** En lugar de "implementa X con TDD", usar: *"Escribe un test que falle para [funcionalidad] en `tests/X_test.py`. NO escribas la implementación todavía. Ejecuta el test y confirma que falla antes de continuar."* La palabra "NO" es la que hace el trabajo. "Con TDD" es vibra. "NO escribas la implementación todavía" es restricción.

**Paso 2: Commitear el test antes de la implementación.** Una vez que Claude escribe el test que falla, hacer `git add tests/X_test.py && git commit -m "red: test failing for X"`. Solo eso. Sin la implementación. Esto te da un punto en la historia de git en el que existe el test y no existe la implementación. Si más tarde Claude modifica el test para "hacerlo pasar", el diff es visible y reversible.

**Paso 3: Pedir la implementación en un segundo turno (segundo mensaje).** Después de commitear el test, abrir un nuevo turno con: *"Ahora implementa la función necesaria para que el test en `tests/X_test.py` pase. No modifiques el test."* El "no modifiques el test" es importante porque, como mencioné arriba, Claude a veces toma el atajo de modificar el test.

**Paso 4: Confirmar que el test pasa por la razón correcta.** Antes de mergear, leer la implementación y el test lado a lado y preguntarse: *¿el test pasa porque la implementación es correcta, o pasa porque el test es laxo?* Si la implementación devuelve un valor hardcodeado y el test verifica exactamente ese valor hardcodeado, el test no está verificando nada útil.

Estos 4 pasos te llevan de "le pedí TDD y se lo saltó" a "le pedí TDD y lo hizo, pero podría haber tomado un atajo". Para cerrar también esa última grieta, hace falta un hook.

## El hook PreToolUse que cierra la grieta

Los 4 pasos requieren que ustedes estén al teclado y presten atención. Si el equipo se distrae, o si alguien hace los 4 pasos en un solo turno por ahorrar tiempo, la grieta vuelve a abrirse.

Claude Code permite registrar hooks que interceptan llamadas a herramientas antes de que se ejecuten. Un hook PreToolUse sobre Write o Edit recibe la ruta del archivo que el modelo está por modificar. Si el modelo intenta escribir en `src/foo.py` y no existe un `tests/foo_test.py` que actualmente falle, el hook puede salir con código 2, lo que Claude Code interpreta como "esta llamada está denegada, aquí está la razón, intenta de nuevo".

Esta es la versión mínima que funciona en un proyecto Python con pytest:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "python3 .claude/hooks/require-failing-test.py"
        }]
      }
    ]
  }
}
```

El script lee la ruta del archivo desde el payload del tool call, mapea `src/X.py` a `tests/X_test.py`, verifica que el archivo de test exista, ejecuta `pytest tests/X_test.py --no-header -q`, y sale con código 2 si pytest sale con código 0. Si el test todavía no existe o si actualmente falla, el hook deja pasar la edición. Si el test existe y ya pasa, el hook bloquea la edición con un mensaje del tipo *"debe existir un test que falle en tests/X_test.py antes de modificar src/X.py. Escribe primero el test que falle."* Ese mensaje aparece en el contexto del próximo turno del modelo. El modelo no tiene opción.

Hay casos de borde. El test puede pasar por una razón equivocada; el hook no detecta eso, para eso está el paso 4 del procedimiento manual. El mapeo de archivo fuente a archivo de test es específico de cada proyecto; el mío está hardcodeado. Y tengo una válvula de escape — un comentario mágico `# tdd-bypass: refactor` en la primera línea — para commits de refactor donde genuinamente quieres editar sin un test nuevo que falle, porque refactor se supone que preserva comportamiento, no que agregue. El hook respeta la válvula, pero la registra en un archivo que reviso al final de cada semana.

La primera semana, el registro tenía 22 usos de la válvula. La segunda semana, 4. Ese número bajando es el objetivo entero.

![Tres capas de control TDD: CLAUDE.md (vibra), prompt explícito (advertencia), hook PreToolUse (puerta). El hook atrapa lo que las dos capas anteriores dejan pasar.](/images/blog/claude-code-tdd-test-despues-codigo-6-de-10/tres-capas-control.png)

## La auditoría 30 días después

Reauditeé el repositorio 30 días después de instalar el hook. Mismo proyecto, mismo tipo de funcionalidades, mismo estilo de prompt. Los números:

- Test commiteado antes que el código: **9 de 10** (subió de 4 de 10)
- Test commiteado en el mismo commit que el código, pero escrito antes según las marcas de modificación del archivo: 1 de 10
- Test commiteado después del código: 0 de 10

La única funcionalidad con test en el mismo commit fue un helper de configuración de 12 líneas que bypassé legítimamente con el comentario mágico. En términos de TDD cumplido cuando la regla aplica, 10 de 10.

No quiero declarar que el hook convirtió a Claude en un practicante disciplinado de TDD. No lo hizo. El modelo todavía a veces escribe implementaciones que se ven sospechosas desde la perspectiva de "el test parece diseñado en función de la implementación". Lo que el hook da es *orden*: un test que falla debe existir antes de que el código fuente pueda ser modificado. Eso solo cierra el círculo en el que Claude estaba retrofiteando tests sobre código que ya estaba moldeando las aserciones del test.

## Cuándo NO usar TDD

Antes de instrumentar nada de esto, vale la pena identificar las tareas donde TDD es la herramienta equivocada. Refactors que deberían ser un no-op a nivel de comportamiento. Scripts de un solo uso que voy a tirar en 20 minutos. Migraciones de datos puras. Ajustes de UI donde el test sería un snapshot de sí mismo.

Forzar TDD en estas tareas no mejora el código, solo pesa el flujo de trabajo sin retorno. La válvula de escape existe para estos casos. La revisión semanal del registro de la válvula es donde noto si estoy abusando.

"Bypassé TDD porque el test era difícil de escribir" es un mal olor. "Bypassé TDD porque el código era un snapshot de nombres de clases CSS" está bien. La auditoría, no la regla, es lo que mantiene el flujo honesto.

Mi CLAUDE.md sigue diciendo `## TDD Primero`. Lo dejé ahí por vibra. Nunca iba a ser la parte que hiciera el trabajo. El hook es la parte que hace el trabajo, y la auditoría es la parte que decide si el hook sigue afinado.

## Fuentes

- [TDD with Claude Code (FlorianBruniaux/claude-code-ultimate-guide)](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/workflows/tdd-with-claude.md)
- [How to Implement TDD with Claude Code TDD Skill (BSWEN, Mar 2026)](https://docs.bswen.com/blog/2026-03-25-tdd-skill-claude-code/)
- [My Skill Makes Claude Code GREAT At TDD (aihero.dev)](https://www.aihero.dev/skill-test-driven-development-claude-code)
- [Forcing Claude Code to TDD: an agentic red-green-refactor loop (alexop.dev)](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/)

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
