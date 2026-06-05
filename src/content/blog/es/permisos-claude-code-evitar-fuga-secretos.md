---
title: "Cómo blindar los permisos de Claude Code para que tu agente no filtre secretos"
description: "Por qué el modo permisivo de Claude Code puede filtrar tu .env al proveedor de IA, y las deny-rules en .claude/settings.json que lo evitan, paso a paso."
date: 2026-06-06
lang: es
tags: [claude-code, seguridad, ia, agentes]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/permisos-claude-code-evitar-fuga-secretos/"
og_image: "https://kenimoto.dev/images/blog/permisos-claude-code-evitar-fuga-secretos/og-es.png"
cross_posted_to: []
---

Esta es una guía para hacer, no para asustarse. Yo tuve Claude Code con permisos casi abiertos durante meses y dormía de maravilla, hasta que me pregunté qué pasaría si un comando imprimía mi `.env` en pantalla. Si usas Claude Code con permisos amplios, en los próximos diez minutos puedes cerrar la fuga de secretos más común. Abre tu `.claude/settings.json` y vamos paso a paso.

El problema, en una frase: cuando dejas que el agente apruebe casi todo, el contenido de tu archivo `.env` puede terminar en la salida de un comando, esa salida entra en el contexto, y el contexto se envía al proveedor de IA. Nadie quiso filtrar nada. Pasó solo.

## Paso 1: agrega las deny-rules básicas

Lo primero es decirle a Claude Code qué nunca debe tocar. Las reglas `deny` siempre tienen prioridad sobre las `allow`, así que aquí nombramos los archivos peligrosos de forma explícita. Copia este bloque a tu `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Bash(npm test *)",
      "Edit(src/**/*.ts)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Edit(*.env*)",
      "Write(*.env*)",
      "Read(*.pem)",
      "Read(*.key)",
      "Read(credentials.json)",
      "Bash(curl * | bash)"
    ]
  }
}
```

Las reglas aceptan patrones: `Edit(src/**/*.ts)` cubre todos los TypeScript bajo `src`, y `Read(.env.*)` cubre `.env.local`, `.env.production` y compañía. Empieza por aquí y ya redujiste la superficie de ataque.

![Bloque de configuración con allow y deny en .claude/settings.json, donde deny bloquea archivos .env, llaves y curl-pipe-bash](/images/blog/permisos-claude-code-evitar-fuga-secretos/deny-rules-es.png)

## Paso 2: no confíes solo en las deny-rules

Aquí va el dato incómodo que muchas guías omiten: en 2026 se reportaron varios casos en los que la regla `deny` de lectura no se aplicaba realmente a los archivos `.env` (el issue #24846 de anthropics/claude-code, entre otros). Es decir, el agente leía un archivo que supuestamente estaba bloqueado, sin aviso ni error.

La conclusión no es que las deny-rules no sirvan. Sirven, pero como primera pared, no como muralla final. Yo puse mi deny-rule de `.env`, me sentí blindado, y el agente igual lo leyó: mi blindaje era de cartón. La sensación de seguridad falsa es peor que no tener nada, porque bajas la guardia. Por eso conviene poner capas alrededor.

## Paso 3: saca los secretos reales del disco

La forma más segura de proteger un secreto es que no exista en texto plano en tu computadora. Si no está escrito en un archivo, no hay nada que ninguna herramienta pueda leer.

- Mueve los valores de producción a un gestor de secretos (AWS Secrets Manager, HashiCorp Vault) y que se inyecten en tiempo de ejecución.
- Deja en tu `.env` local solo valores de prueba. Si se filtran, no pasa nada, y un secreto que no duele al filtrarse es un problema resuelto.
- Confirma que `.env`, `*.pem`, `*.key` y `credentials.json` estén en tu `.gitignore`. Dos candados valen más que uno.

## Paso 4: cierra la salida con Hooks y red

Las deny-rules controlan qué archivos se tocan. Los Hooks controlan qué se ejecuta. Puedes agregar un Hook que revise el uso de herramientas peligrosas y lo bloquee con exit code 2, y con la opción `async` registrar cada acción en un log externo para auditar después.

Y si la tarea solo necesita archivos locales, corta la salida de raíz: levanta el contenedor de Docker con `--network none`. Sin red, no hay a dónde enviar nada.

```bash
docker run -it --rm \
  -v $(pwd):/workspace \
  --network none \
  claude-code-sandbox
```

![Diagrama de defensa en capas: deny-rules como pared interior, y gestor de secretos, gitignore, Hooks y red cortada como capas exteriores](/images/blog/permisos-claude-code-evitar-fuga-secretos/defensa-capas-es.png)

## Paso 5: lista de verificación de permisos mínimos

Antes de dejar al agente trabajar solo, repasa esto. Si marcas las cinco, estás en buena forma:

- [ ] Las deny-rules de `.env`, llaves y `curl | bash` están en `.claude/settings.json`.
- [ ] Los secretos reales viven en un gestor, no en archivos del proyecto.
- [ ] `.gitignore` cubre `.env`, `*.pem`, `*.key` y `credentials.json`.
- [ ] La clave de API del agente tiene permisos mínimos y un límite mensual de uso.
- [ ] Para tareas sensibles, lo ejecutas en un contenedor con la red cortada.

No necesitas las cinco hoy. Si solo haces los pasos 1 y 3 esta tarde, ya sacaste el secreto crítico del disco y le pusiste un candado al agente. El resto lo agregas cuando el proyecto lo pida.

## Para cerrar

La seguridad de los permisos no es algo que configuras una vez y olvidas. Las CVE cambian, las reglas a veces fallan (como vimos con las deny-rules de `.env`), y la comodidad del modo automático no significa que puedas dejar de mirar la salida. Pero con estas capas, la fuga de secretos en tiempo de ejecución se vuelve un caso raro en lugar de un accidente a punto de pasar. Configúralo bien una vez y podrás delegarle tareas al agente con tranquilidad. Eso sí, yo todavía le echo un ojo a la salida de vez en cuando; al agente ya lo entiendo, al yo de hace seis meses que le dio permiso a todo, todavía no.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
