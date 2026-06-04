---
title: "Por qué Claude ignora tu CLAUDE.md 1 de cada 20 veces (y cómo lo arreglé con exit code 2)"
description: "Escribí tres veces en CLAUDE.md que no tocara el .env. Claude aceptó tres veces, con educación, y a la cuarta lo tocó. Una petición se cumple 95 de cada 100 veces. Para cerrar el 5 por ciento restante hay que convertir la petición en programa: un hook con matcher de argumentos y exit code 2."
date: 2026-06-05
lang: es
tags: [claude-code, hooks, automatizacion, ai-coding]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/claude-code-hooks-exit-code-2-reglas-deterministas/"
og_image: "https://kenimoto.dev/images/blog/claude-code-hooks-exit-code-2-reglas-deterministas/og-es.png"
cross_posted_to: []
---

Escribí en mi CLAUDE.md, tres veces, con tres redacciones distintas, que no tocara los archivos `.env`. Claude estuvo de acuerdo las tres veces, con mucha educación. A la cuarta sesión, abrió uno y lo editó.

No fue mala fe: fue lo que pasa siempre. Una instrucción en CLAUDE.md es una petición, y una petición se cumple casi siempre. "Casi" es la palabra cara. Si Claude respeta tu regla 95 de cada 100 veces, ese 5 por ciento restante es justo el que termina en un incidente de producción.

La forma de cerrar ese hueco no es escribir la regla más bonita. Es dejar de pedir y empezar a programar. Y la pieza que lo hace cabe en un dígito: la diferencia entre `exit 1` y `exit 2`.

## La diferencia entre pedir y obligar

CLAUDE.md le habla a Claude. Los hooks le hablan al runtime de Claude Code. Es una distinción que tardé en entender, pero lo cambia todo.

CLAUDE.md es una instrucción que el modelo interpreta, recuerda y, a veces, olvida. Un hook es código que se ejecuta cuando Claude intenta hacer algo, antes de que lo haga. No depende de que el modelo "se acuerde". Se dispara siempre, en cada intento, porque está programado para hacerlo.

Es como pegar un cartel de "no entrar" frente a una puerta abierta, contra ponerle una cerradura. El cartel funciona casi siempre. La cerradura funciona el 100 por ciento de las veces, incluso cuando nadie está mirando.

## El hook que de verdad bloquea

Los hooks se definen en `settings.json`. La estructura tiene tres capas: el nombre del evento, el matcher, y el handler que se ejecuta.

El evento clave para bloquear es `PreToolUse`: se dispara antes de que una herramienta se ejecute. Y aquí entra el detalle que casi nadie lee.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "if": "Edit(*.env*)|Write(*.env*)",
            "command": "echo 'Editar archivos .env esta bloqueado' >&2; exit 2"
          }
        ]
      }
    ]
  }
}
```

Dos piezas hacen el trabajo. La primera es el campo `if`, que filtra por los argumentos de la herramienta, no solo por su nombre. `Edit|Write` dispara con cualquier edición; `if: "Edit(*.env*)"` dispara solo cuando el archivo es un `.env`. Sin `if`, el hook se ejecutaría en cada edición y se volvería ruido. Con `if`, se ejecuta exactamente donde importa.

La segunda pieza es ese `exit 2` al final, y es donde se gana o se pierde todo.

## exit 1 contra exit 2: un dígito que lo decide

Cuando el comando de un hook `PreToolUse` termina, su código de salida define qué pasa:

| Código de salida | Qué hace |
|---|---|
| `0` | Todo bien, la herramienta se ejecuta |
| `1` | Error **no bloqueante**: se registra en el log y la herramienta se ejecuta igual |
| `2` | **Bloqueo**: la herramienta no se ejecuta, y el texto de stderr vuelve a Claude como mensaje de error |

Ahí está la trampa en la que yo caí. Mi primer hook terminaba con `exit 1`. Lo probé, vi el mensaje de error en el log, y di la regla por cerrada. No estaba cerrada: `exit 1` solo deja constancia del lamento. La herramienta se ejecutaba de todos modos. El `.env` se editaba, y el log decía, con calma, que algo había pasado.

`exit 2` es otra cosa. Bloquea de verdad, y además le devuelve a Claude el mensaje de stderr, así que el modelo entiende por qué se frenó y no se queda dando vueltas. Un dígito de diferencia separa "queda anotado en el log" de "hay una pared".

![exit 1 contra exit 2: uno solo registra, el otro bloquea de verdad](/images/blog/claude-code-hooks-exit-code-2-reglas-deterministas/exit1-vs-exit2.png)

## La forma explícita, para cuando quieres estar seguro

Hay una variante más declarativa para `PreToolUse`: en lugar de un código de salida, el hook devuelve un JSON que dice qué decisión tomar.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Comando destructivo bloqueado"
  }
}
```

El campo `permissionDecision` acepta cuatro valores: `allow` (saltar el prompt de permiso y permitir), `deny` (rechazar la llamada), `ask` (pedir confirmación al usuario) y `defer` (ceder el control a una UI externa en modo headless). Para una política de equipo, `deny` es el equivalente declarativo del `exit 2`: dice de forma explícita "esto no se ejecuta".

Un detalle que vale recordar, porque a más de uno le ha costado una tarde: `PreToolUse` usa `hookSpecificOutput.permissionDecision`, mientras que otros eventos usan un `decision` plano en la raíz. Si mezclas los dos esquemas, tu bloqueo no se dispara y vuelves a estar en el cartel de papel.

## De la petición a la política

Lo bonito de esto es que escala más allá del `.env`. La misma estructura convierte cualquier "por favor no hagas X" en una regla que no se puede saltar.

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "if": "Bash(git push --force*)",
      "command": "echo 'force push bloqueado' >&2; exit 2"
    }
  ]
}
```

`git push --force` en una rama compartida, `rm -rf` en el lugar equivocado, escrituras sobre archivos de credenciales: todo eso deja de depender de que el modelo recuerde la regla. Tu equipo (y tus compañeros van a agradecerlo) trabaja contra paredes, no contra carteles.

## Cierre

Le pedí a Claude tres veces que no tocara el `.env`. Lo aceptó con educación y lo tocó igual, porque una petición se olvida. No era un problema de redacción: era un problema de mecanismo.

La solución cabe en dos piezas y un dígito: el campo `if` para disparar solo donde importa, y `exit 2` (o `permissionDecision: "deny"`) para bloquear de verdad en lugar de solo dejar constancia. Las peticiones se olvidan; los programas no. Si tu equipo tiene una regla que "casi siempre" se cumple, escríbela en `exit 2` y deja de rezar para que se cumpla la próxima vez.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
