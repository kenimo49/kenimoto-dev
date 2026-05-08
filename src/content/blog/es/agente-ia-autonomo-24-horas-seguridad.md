---
title: "Dejé a mi agente Claude Code corriendo 24 horas. La cuenta de USD 400 fue lo de menos."
description: "Guía práctica de seguridad para agentes de IA autónomos: 4 incidentes reales mapeados al OWASP Agentic Top 10 2026, con checklist de mitigación basado en NemoClaw, sandbox y auto mode. Para equipos de LatAm que están adoptando Claude Code."
date: 2026-05-08
lang: es
tags: [ia, agentes, seguridad, claudecode]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/agente-ia-autonomo-24-horas-seguridad/"
og_image: "https://kenimoto.dev/images/blog/agente-ia-autonomo-24-horas-seguridad/og-es.png"
---

Los agentes de IA autónomos están en todas las charlas de tech LatAm en 2026. Cursor, Claude Code, v0, Replit Agents. La promesa es la misma: pásale una tarea, deja que la máquina trabaje, vuelve al rato y revisa el resultado.

Yo lo probé en serio. Activé el modo `--dangerously-skip-permissions` en Claude Code, le di una tarea real (limpiar el backlog de bugs de un proyecto personal, escribir tests, abrir PRs), instalé tres Skills del marketplace público y me fui a dormir.

Veinticuatro horas después, la factura de la API de Anthropic dio USD 400. Esa fue la línea que menos me preocupó.

Esta guía es lo que aprendí en esa misma noche, mapeado al [OWASP Top 10 para Aplicaciones Agénticas 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) que la OWASP publicó en diciembre de 2025. Si estás por dejar a tu primer agente correr sin supervisión, esto es lo que ojalá yo hubiera leído antes de hacerlo.

## Lo que tenía la computadora (importa para el resto)

No corrí el agente en un container limpio. Lo corrí en mi computadora de trabajo, que tenía:

- credenciales de GitHub en `~/.config/gh`
- un `.env` de otro proyecto en el que había entrado el mismo día
- una clave SSH que iba a mover de carpeta hace dos años

El agente estaba, en teoría, limitado al directorio del proyecto. Las Skills, en teoría, hacían solo lo que declaraba el manifiesto. Confié en la configuración de la misma manera que uno confía en el folleto de seguridad del avión.

## El OWASP Agentic Top 10 y por qué te importa

Antes del relato, conviene tener este mapa a mano. Los 10 riesgos del 2026 son:

| Código | Riesgo |
|---|---|
| ASI01 | Goal Hijacking (secuestro de objetivos) |
| ASI02 | Tool Misuse (mal uso de herramientas) |
| ASI03 | Identity & Privilege Abuse |
| ASI04 | Supply Chain Vulnerabilities |
| ASI05 | Unexpected Code Execution |
| ASI06 | Memory Poisoning |
| ASI07 | Insecure Inter-Agent Communication |
| ASI08 | Cascading Failures |
| ASI09 | Human-Agent Trust Exploitation |
| ASI10 | Rogue Agents |

Tres de estos diez se materializaron en mi noche. Vamos uno por uno.

## Incidente 1: la Skill con un nombre casi correcto (ASI04)

A los cuarenta minutos, el agente instaló una Skill llamada `@clawhub/docker-managr` para resolver un cambio en un Dockerfile. El mes anterior yo había usado `@clawhub/docker-manager`. Una letra de diferencia. La clase de error que tu ojo corrige sin avisarte.

La primera acción de la Skill fue leer "archivos de configuración" del proyecto. La segunda fue un POST HTTP a un servidor que no es mío. Las dos cosas estaban relacionadas.

Lo agarré porque tenía logging de tráfico saliente por otros motivos. El agente no lo agarró. El manifiesto declaraba la llamada de red como "telemetría".

En marzo de 2026, Koi Security publicó que **341 Skills typosquatadas** se subieron a ClawHub durante el evento bautizado **ClawHavoc**. Una auditoría de Snyk encontró que **el 36%** llevaba prompt injection o exfiltración. Yo había leído la noticia. La había archivado mentalmente como "algo que les pasa a otros".

Esto es **ASI04: Supply Chain Vulnerabilities**. La mitigación práctica:

- Fijar versiones de Skill, nunca usar `latest` en producción
- Leer el manifiesto antes de instalar (a mano, sí)
- Tratar cualquier nombre con una letra de diferencia respecto a uno popular como sospechoso hasta probar lo contrario
- No mirar las estrellas de GitHub. Las Skills de ClawHavoc también tenían estrellas

## Incidente 2: el rm -rf que casi pasa (ASI02 + ASI05)

Hora once de la corrida. El agente decidió que unos `node_modules` estaban viejos y ejecutó `rm -rf` sobre ellos. Concretamente sobre `$PROJECT_DIR/node_modules`. Concretamente con la variable `$PROJECT_DIR` que, por un resultado de herramienta que el agente leyó mal, había quedado vacía.

`rm -rf  /` (espacio extra, variable vacía) es exactamente el incidente documentado de diciembre de 2025, cuando Claude limpió la carpeta home de alguien por error. Anthropic [publicó su trabajo de sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) por eso. Era un patrón de falla conocido cuando yo corrí el experimento.

Lo agarré porque tenía `safe-rm` aliasado y el comando se trabó en la barra. Lo agarré yo. El agente no lo iba a agarrar. La Skill que ejecutó el comando ni siquiera validó la ruta.

Esto es **ASI02: Tool Misuse** combinado con **ASI05: Unexpected Code Execution**. La mitigación es sandbox, no confianza:

```bash
# Container con red bloqueada para tareas offline
docker run -it --rm \
  -v $(pwd):/workspace \
  -e ANTHROPIC_API_KEY \
  --network none \
  claude-code-sandbox

# Cuando se necesita red, va por proxy con allowlist
docker run -it --rm \
  -v $(pwd):/workspace \
  -e ANTHROPIC_API_KEY \
  -e HTTP_PROXY=http://egress-proxy:8080 \
  claude-code-sandbox
```

Anthropic [introdujo el auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) en marzo de 2026 precisamente para resolver este tipo de footgun. Sus mediciones internas dicen que el sandbox reduce los prompts de permiso un 84%, y eso coincide con lo que veo en la práctica.

## Incidente 3: el .env que casi llega a GitHub (ASI03 + ASI04)

Esta es la más vergonzosa, así que voy a ser breve.

El agente decidió que un archivo de configuración de un proyecto vecino sería "contexto útil" para el README que estaba escribiendo. Leyó el archivo. Era un `.env`. El README terminó commiteado en un repositorio público. El README tenía un bloque de código marcado como `env`. El bloque tenía una clave de API real.

Los pre-commit hooks lo agarraron. Hooks que había configurado seis meses atrás por otro motivo. Si hubieran estado apagados, la clave habría estado en GitHub unos noventa segundos antes de que push protection avisara. Noventa segundos más de lo que yo quiero cualquier credencial mía expuesta.

![4 incidentes en 24h mapeados al OWASP Agentic Top 10 (ASI02, ASI03, ASI04, ASI05)](/images/blog/agente-ia-autonomo-24-horas-seguridad/owasp-incidentes.png)

Esto es **ASI03: Identity & Privilege Abuse** sumado a **ASI04** otra vez. El agente no exfiltró la clave a propósito. La exfiltró como una ilustración útil. La mitigación pasa por archivos de exclusión:

```bash
# .clawignore (también vale .agentignore)
.env
.env.*
*.pem
*.key
credentials.json
secrets/
~/.ssh/
~/.config/gh/
```

Sí, puedes poner rutas por encima de la raíz del proyecto. Tu agente las respeta por convención, no por la fuerza. Por eso el sandbox va primero y el ignore file va segundo.

## Checklist práctico: cuatro capas de defensa

Después de las 24 horas, dejé de fingir que le había dado autonomía al agente. Le di una correa con cuatro broches.

**Capa 1: Sandbox.** El agente corre dentro de un container. Los mounts son explícitos. `--network none` para tareas que no necesitan internet. Cuando necesita red, va por un proxy de salida con allowlist. Parece pesado. Tarda una hora en configurarse una vez y te ahorra el resto de tu carrera.

**Capa 2: Guardrails de input/output.** [NemoClaw](https://docs.nvidia.com/nemo-guardrails/) (NVIDIA) agrega una capa de detección de prompt injection y de PII en la entrada, y bloqueo de comandos peligrosos y enmascaramiento de secretos en la salida. Configuración mínima:

```yaml
# nemoclaw.yaml
guardrails:
  input:
    - prompt_injection_detection: true
    - pii_detection: true
  output:
    - harmful_command_block: true
    - secret_masking: true
```

[IronClaw](https://near.ai/ironclaw) (NEAR AI) hace algo parecido con un enfoque de zero-trust sandbox por Skill, donde cada Skill corre aislada y la comunicación entre Skills requiere permiso explícito.

**Capa 3: Auto mode, no YOLO mode.** El [auto mode de Anthropic](https://www.anthropic.com/engineering/claude-code-auto-mode) reduce los prompts de permiso pero bloquea los peligrosos (delete fuera del proyecto, red a hosts no permitidos, patrones de shell que coinciden con footguns conocidos). Es la primitiva correcta. El YOLO mode (`--dangerously-skip-permissions`) tiene `dangerously` en el nombre por una razón.

**Capa 4: Pre-commit hooks.** [git-secrets](https://github.com/awslabs/git-secrets), [trufflehog](https://github.com/trufflesecurity/trufflehog), [gitleaks](https://github.com/gitleaks/gitleaks). El que use tu equipo. El agente eventualmente va a intentar commitear algo que no debería. El hook es la segunda línea de defensa después del ignore file (que es la primera). No hay tercera línea. La tercera línea es "soporte de GitHub".

## Por qué importa especialmente en LatAm

Dos motivos prácticos para los equipos de la región.

**Adopción rápida, gobernanza más lenta.** Cursor, v0, Replit y Claude Code se adoptaron en LatAm con la misma velocidad que en EE. UU., pero el guardrail (NemoClaw, IronClaw, auto mode) llegó después. Hay un hueco entre el uso en la punta y el control en el medio. Esta guía es para tapar un pedacito de ese hueco.

**Regulación local emergente.** La LGPD en Brasil, la Ley 25.326 en Argentina, la Ley 21.719 en Chile (vigente desde diciembre 2026), la Ley Federal de Protección de Datos en México. Ninguna habla de "agente de IA" explícitamente, pero todas exigen "medida técnica adecuada" para tratar datos personales. Si tu agente exfiltra un `.env` con credenciales que dan acceso a datos de clientes, "el agente decidió solo" no es defensa.

## La conclusión que me llevo

La razón por la que la cuenta de USD 400 fue lo de menos es que esa cuenta es recuperable. La lees, la discutes, la pagas. Las credenciales no funcionan así. Una vez que salen de la computadora, no vuelven.

Yo entré a las 24 horas esperando aprender sobre capacidad de agente. Salí con una checklist. La checklist es más útil que la capacidad.

Si vas a correr tu primer agente sin supervisión, el encuadre correcto no es "qué tareas puede hacer el agente". El encuadre correcto es "cuál de los 10 riesgos de OWASP atrapa mi configuración actual". Si la respuesta es "no estoy seguro", primero el sandbox, después el experimento.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
