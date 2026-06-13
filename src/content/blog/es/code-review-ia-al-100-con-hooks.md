---
title: "‘Casi siempre’ y ‘siempre sin excepción’ no son lo mismo: cómo hacer que tu code review con IA corra al 100%"
description: "Una revisión que se ejecuta el 90% de las veces deja pasar bugs justo en el 10% restante. La diferencia entre recomendar y forzar es un git hook. Acá está cómo convertir tu code review con IA de un pedido a un programa."
date: 2026-06-14
lang: es
tags: [code-review, git-hooks, ci, harness, ia]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/code-review-ia-al-100-con-hooks/"
og_image: "https://kenimoto.dev/images/blog/code-review-ia-al-100-con-hooks/og-es.png"
cross_posted_to: []
---

Durante meses tuve una regla de equipo que sonaba muy bien: "antes de cada commit, pasa tu cambio por la revisión con IA". La escribí en el README, la dije en las reuniones, hasta la puse en un canal fijado de Slack. Y funcionaba. Casi siempre.

Ese "casi" me costó un bug en producción.

El problema no era la herramienta ni la gente. El problema era la palabra. "Recomendado" y "obligatorio" no son sinónimos, y en software esa diferencia no es de grado: es de categoría. Una revisión que corre el 90% de las veces no es "casi perfecta". Es una revisión con un agujero del 10%, y los bugs tienen una puntería sorprendente para encontrar justo ese agujero.

## Por qué "casi siempre" falla

Piensa en lo que significa el 90% en la práctica. Un desarrollador con prisa el viernes a las seis. Un hotfix urgente. Alguien nuevo que todavía no leyó el README. Un commit "rapidito" que total es solo un cambio de texto. Cada una de esas excepciones es razonable por separado. Juntas, son tu tasa de fallo.

Y acá hay algo que cambió con la IA generando código. Un agente puede producir código sintácticamente correcto, que pasa su propia revisión, y aun así violar los estándares de tu proyecto ([DEV Community](https://dev.to/jonesrussell/git-hooks-are-your-best-defense-against-ai-generated-mess-5h1a)). El volumen de código sin revisar humana creció. La revisión dejó de ser un lujo y pasó a ser la compuerta entre la salida de un agente y tu repositorio. Una compuerta que se abre el 90% de las veces no es una compuerta.

![Recomendación 50-90% versus hook obligatorio 100%: dónde entran los bugs](/images/blog/code-review-ia-al-100-con-hooks/recomendacion-vs-hook.png)

La diferencia entre recomendar y forzar se ve mejor en números:

- **Recomendación** (un pedido en el README, una norma de equipo): se cumple entre el 50% y el 90% de las veces, según la presión del día.
- **Hook obligatorio** (un programa que bloquea el commit): se cumple el 100% de las veces, porque ya no depende de la memoria ni de la buena voluntad de nadie.

La meta de este artículo es simple: mover tu code review con IA de la primera fila a la segunda.

## La idea central: convertir el pedido en un programa

Un pedido vive en la cabeza de las personas. Un programa vive en el repositorio. La forma de hacer que algo pase "siempre, sin excepción" es sacarlo de la voluntad humana y meterlo en una máquina que no tiene viernes a la tarde.

En Git, esa máquina son los hooks. Un hook es un script que Git ejecuta automáticamente en cierto momento — antes de un commit, antes de un push — y que puede **bloquear** la operación si algo no pasa. No es un recordatorio. Es un portón.

La regla práctica que uso para repartir el trabajo viene de pensar en cuánto tarda cada cosa:

- **pre-commit**: lo rápido (formato, lint, escaneo de secretos, y una revisión con IA acotada al diff). Tiene que correr en menos de 10 segundos.
- **pre-push**: lo mediano (typecheck, tests). Menos de 2 minutos.
- **CI**: todo lo demás, y la red de seguridad final.

## Paso 1: la revisión con IA como hook de pre-commit

La pieza nueva es meter la revisión con IA en el pre-commit, acotada solo a lo que cambió. No revisas todo el repositorio en cada commit — eso sería lentísimo. Revisas el diff.

```bash
#!/bin/bash
# .githooks/pre-commit

set -e

# Solo los archivos staged, no todo el repo
DIFF=$(git diff --cached --diff-filter=ACM)

if [ -z "$DIFF" ]; then
  exit 0
fi

echo "🔍 Revisión con IA sobre el diff..."

# Tu herramienta de review (CLI de IA) recibe el diff y
# devuelve exit code 2 si encuentra un problema bloqueante
echo "$DIFF" | tu-revisor-ia --fail-on=blocking
if [ $? -ne 0 ]; then
  echo "❌ La revisión encontró un problema. Commit bloqueado."
  exit 1
fi

echo "✅ Revisión pasada."
```

La clave está en el `exit 1` (o `exit 2`). Mientras el script termine con un código distinto de cero, Git rechaza el commit. Ahí es donde "casi siempre" se vuelve "siempre". El desarrollador ya no decide si corre la revisión; la revisión corre sola y decide si lo deja pasar.

## Paso 2: que el hook viva en el repositorio

Un hook que cada quien tiene que instalar a mano vuelve al problema de "casi siempre". La solución es que el hook se active solo al clonar e instalar dependencias. Acá hay dos caminos comunes en 2026:

**Husky** (estándar de la industria en proyectos Node): los hooks viven en `.husky/` y se activan cuando alguien corre `npm install`.

```bash
npx husky init
echo "npx lint-staged && ./.githooks/pre-commit" > .husky/pre-commit
```

**Lefthook** (más rápido, agnóstico al lenguaje, con ejecución en paralelo y filtrado por archivo de fábrica): ideal si tu equipo no es solo JavaScript o si el repositorio es grande.

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    ai-review:
      run: git diff --cached | tu-revisor-ia --fail-on=blocking
    lint:
      run: npx eslint {staged_files}
```

¿Cuál elegir? Si ya estás en Node y quieres lo conocido, Husky + lint-staged. Si quieres velocidad y varios lenguajes, Lefthook. Las dos resuelven lo mismo: el portón viaja con el repositorio, no con la memoria de cada persona.

## Paso 3: CI como red de seguridad (porque los hooks se pueden saltar)

Acá viene la parte que mucha gente olvida, y es justo la que separa un sistema serio de uno con un agujero. **Los hooks locales se pueden saltar.** Cualquiera puede hacer `git commit --no-verify` y pasar por encima de todo. Y alguien externo que clona el repositorio quizás ni tenga el runner de hooks instalado ([pkgpulse](https://www.pkgpulse.com/guides/husky-vs-lefthook-vs-lint-staged-git-hooks-nodejs-2026)).

Por eso el hook local no es la última línea. Es la primera. La última es CI, que corre en un servidor que nadie puede saltar con un flag.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  review-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Revisión con IA sobre el diff del PR
        run: git diff origin/main...HEAD | tu-revisor-ia --fail-on=blocking
```

El hook es el control en el aeropuerto; CI es migraciones. Dos etapas, porque das por sentado que alguien va a intentar el atajo. Con las dos capas juntas, el "siempre sin excepción" deja de ser una frase del README y se vuelve una propiedad real del sistema.

## Adopción gradual: no prendas todo de golpe

Un consejo práctico para que el equipo no te odie. Si mañana pones un hook que bloquea cualquier hallazgo de la IA, vas a tener una rebelión para el almuerzo. La IA encuentra cosas menores (nits) y cosas graves (must-fix) por igual, y bloquear por un nit es la forma más rápida de que alguien escriba `--no-verify` para siempre.

Una rampa que funciona:

1. **Semana 1**: el hook corre y muestra los hallazgos, pero **no bloquea** (siempre `exit 0`). El equipo se acostumbra a verlo.
2. **Semana 2**: bloquea solo por hallazgos graves (`--fail-on=blocking`). Los nits siguen siendo informativos.
3. **Semana 3**: CI replica la misma compuerta para los que se saltan el hook local.

Así el 100% no llega como un golpe, sino como un piso que vas subiendo sin que nadie se caiga.

## El cambio de mentalidad

Lo que más me costó entender no fue técnico. Fue aceptar que la disciplina no escala y los programas sí. Yo confiaba en que el equipo "se acordara" de revisar. Y el equipo se acordaba — casi siempre. Pero la calidad no vive en el promedio; vive en el peor día. El commit que rompe producción no es el del martes tranquilo. Es el del viernes apurado, el del hotfix, el del "total es solo texto".

Un hook no tiene viernes apurado. Esa es toda la diferencia entre el 90% y el 100%, y resulta que ese 10% era donde vivían los bugs.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
