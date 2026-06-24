---
title: "MCP no soporta subir archivos: probé 7 servidores y cada uno se inventó un workaround. 5 de los 7 abren un hueco de seguridad medible"
description: "La spec de MCP eligió JSON-RPC como transporte. Esa decisión, tomada por elegancia, dejó fuera del estándar algo básico: subir un archivo binario. Probé 7 servidores MCP en producción, incluido uno mío de automatización tributaria, y cada uno inventó un workaround distinto: base64 inline, URL firmada, presigned upload, multipart fuera del canal. Cinco de los siete tienen un hueco de seguridad medible."
date: 2026-06-24
lang: es
tags: [mcp, seguridad, base64, owasp, claude]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/mcp-no-soporta-archivos-7-servidores"
og_image: "https://kenimoto.dev/images/blog/mcp-no-soporta-archivos-7-servidores/og-es.png"
cross_posted_to: []
---

La spec de MCP eligió JSON-RPC como transporte. Es una decisión limpia, elegante, fácil de parsear. Y dejó fuera del estándar algo que cualquier integración real necesita el primer día: subir un archivo binario.

Cuando descubrí esto fue trabajando en una integración con freee para automatizar mi declaración tributaria. Quería que Claude leyera la foto de un comprobante, sacara el monto y registrara el gasto en la categoría correcta. Tres líneas en lenguaje natural, todo encadenado. Salvo por un detalle: **MCP no tiene un tipo `FileContent`.** Los tipos válidos para resultado de tool son `TextContent`, `ImageContent` (con base64 obligatorio) y `EmbeddedResource` (solo URI). PDF de comprobante no entra en ninguno.

La discusión oficial en GitHub Issue [SEP-1306](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1306) lleva más de un año pidiendo soporte binario nativo. Sigue abierta a junio de 2026. Mientras tanto, cada equipo que necesita subir un archivo se inventa su propio parche.

Yo probé 7 servidores MCP que en algún momento tocan archivos. Anoté cómo cada uno resuelve el problema. **Cinco de los siete abren un hueco de seguridad medible**, casi siempre por el mismo error de fondo: tratar al archivo como "datos confiables" porque MCP los empaqueta en JSON.

![Tabla mental: los 7 workarounds que probé para subir archivo por MCP, con la vulnerabilidad de cada uno](/images/blog/mcp-no-soporta-archivos-7-servidores/7-workarounds-vulnerabilidad.png)

## Por qué MCP no soporta archivos (y nunca lo va a soportar sin SEP-1306)

JSON-RPC 2.0 es un protocolo textual. Todo el mensaje es JSON serializado. Esto trae ventajas reales: parser único en cualquier lenguaje, fácil de debuggear, fácil de loggear, perfecto para que un LLM lo lea y razone sobre la respuesta.

El precio es que **los bytes no caben en JSON**. Para meter un binario tenés que codificarlo en base64, lo que infla el tamaño en un factor de 4/3 (33% más bytes), y además convierte el binario en una cadena de texto que el LLM va a tener que procesar como contenido. Un PDF de 500 KB se convierte en una cadena de ~666 KB que, dependiendo del tokenizer, consume **alrededor de 166 mil tokens**. Solo en transporte, antes de que Claude lea una sola palabra del PDF.

Pero el problema no termina en el costo. El problema empieza en lo que cada servidor hace para no pagar ese costo. Las opciones que probé:

| Workaround | Tamaño viable | Vulnerabilidad típica |
|---|---|---|
| base64 inline | < 100 KB en práctica | OOM si no hay límite duro |
| URL firmada (signed URL) | Cualquiera | Expira o no expira, depende |
| Presigned upload (cliente → S3) | Cualquiera | El servidor confía en el path devuelto |
| Multipart fuera del canal | Cualquiera | Autenticación se desincroniza |
| Resource URI (`file://`) | Cualquiera | Path traversal si no valida |
| EmbeddedResource (ref) | Cualquiera | TOCTOU entre validación y uso |
| Tool que devuelve URL pública | Cualquiera | Sin caducidad, archivo queda expuesto |

De los 7 servidores que probé, cada uno eligió una opción distinta. **Ninguno es compatible con otro.** Si quería usar dos servidores en la misma sesión, era yo el que tenía que reconciliar.

## El recorrido por los 7 servidores

Los nombro de forma genérica porque algunos son cerrados y otros tienen issues abiertos sin parche; no quiero apuntar a proyectos individuales antes de que tengan tiempo de responder. Si vos identificás el tuyo en la descripción, mandame mensaje y coordinamos disclosure.

**Servidor 1 — el mío, freee tributario.** Workaround: base64 inline para imágenes de comprobantes. Bug que encontré (en mi propio código, después de medirlo): **no había límite duro de tamaño**. Un comprobante de 8 MB que un usuario subió por accidente me hizo consumir 2.6 millones de tokens en una sola tool call. Costó lo que un almuerzo. El parche fue una validación de tamaño previa a base64; debería haber sido la primera línea de la tool, no la última que agregué.

**Servidor 2 — uno público de filesystem.** Workaround: leer rutas locales con `file://` URI. Bug encontrado: **path traversal**. La tool aceptaba paths como `file:///etc/../etc/passwd` o `file:///home/usuario/../../etc/shadow` sin normalizar. La sandbox configurada era el directorio del proyecto; en la práctica, todo el filesystem accesible al proceso del servidor estaba accesible al LLM. Item OWASP MCP Top 10: **MCP-01 Tool Input Validation Failures**.

**Servidor 3 — uno de gestión de almacenamiento en la nube.** Workaround: signed URL pre-firmada que Claude descargaba. Bug: **la URL firmada no expiraba**. La firma duraba 7 días por configuración inicial que nadie revisó. Si un LLM (o cualquiera con acceso al log) capturaba esa URL, podía descargar el archivo durante una semana sin autenticarse. El issue se cerró con una expiración de 5 minutos, que es lo razonable.

**Servidor 4 — uno de presigned upload (cliente sube a bucket, MCP recibe path).** Workaround: el cliente sube el archivo directo al storage, le pasa al servidor el path resultante, el servidor "confía" en que el path corresponde al archivo recién subido. Bug: **el servidor no validaba que el path estuviera en el bucket esperado**. Un atacante con acceso al canal MCP podía mandar un path arbitrario al servidor y hacerlo leer cualquier cosa del bucket compartido. OWASP MCP Top 10: **MCP-03 Insecure Resource Handling**.

**Servidor 5 — uno propietario de procesamiento de documentos.** Workaround: multipart out-of-band, con un token de sesión que MCP pasaba al servicio HTTP por header. Bug: **el token de MCP y el token de la sesión HTTP se desincronizaban**. Si la sesión MCP se reiniciaba (cosa común), el token MCP rotaba, pero el servicio HTTP seguía aceptando el viejo por 30 minutos. Ventana de 30 minutos donde una credencial revocada todavía funcionaba. Item OWASP MCP Top 10: **MCP-05 Authentication & Session Management**.

**Servidor 6 — uno público que devolvía URLs en S3 público.** Workaround: subir el archivo a un bucket público y devolver la URL al LLM. Bug: **los archivos quedaban accesibles para siempre, indexables por crawlers**. Si subías un PDF con información personal por error, esa información podía aparecer en una búsqueda 6 meses después. No hay forma de medir el daño retroactivamente; sé que pasó porque encontré dos PDFs míos en Google que nunca había publicado.

**Servidor 7 — uno bien hecho.** Workaround: signed URL con expiración de 60 segundos, validación de mime type, validación de tamaño, scope estricto. Es el ejemplo de cómo se debería hacer. No lo voy a nombrar porque no quiero que se vuelva blanco de ataque, pero si tu servidor MCP de archivos hace todo eso, no te preocupes: estás en el 14%.

De los 7, **5 tienen problemas medibles**. No son bugs catastróficos individualmente; son la consecuencia previsible de que cada equipo resuelva por su cuenta un problema que la spec dejó sin estandarizar.

## La matemática del base64 que casi nadie hace

Una cosa que me sorprendió cuando me senté a calcular: el costo en tokens de base64 inline no es marginal, es lo principal cuando empezás a procesar archivos de tamaño real.

```text
tamaño_base64_bytes = tamaño_binario × 4/3
tokens_aprox        = tamaño_base64_bytes / 4
                    ≈ tamaño_binario / 3
```

Un PDF de 500 KB son ~166 mil tokens en transporte. Cinco PDFs pequeños en una sesión de freee y ya pasaste el millón de tokens solo en cargar archivos, antes de cualquier análisis. Con [Sonnet 4.6 a USD 3.00 por millón de tokens de input](https://platform.claude.com/docs/en/about-claude/pricing), son USD 3 por sesión de declaración. Multiplicalo por usuarios, por meses, y el costo de "MCP no soporta archivos" se vuelve concreto.

Y eso suponiendo que el LLM puede procesar el base64 directamente, cosa que no siempre es cierto. La mayoría de los modelos no entiende el contenido de un base64 sin decodificar primero, así que el "PDF como texto base64" termina pasando por una segunda llamada que decodifica y procesa. Más tokens, más latencia, más superficie de error.

## Lo que terminé recomendando a mi equipo

Después de las 7 pruebas, llegué a una regla que funciona en producción y que paso a cualquier persona que está armando integración con archivos en MCP:

**Regla 1 — MCP solo lleva metadata del archivo, nunca el archivo.** Nombre, tamaño, mime type, hash, y un identificador opaco. El archivo viaja por un canal HTTP normal, con signed URL de corta duración, fuera del JSON-RPC.

**Regla 2 — Signed URL con expiración de 60 segundos, no más.** Si la sesión MCP se cae y la URL expira, no es un problema: se pide otra. Lo que importa es que la ventana de ataque sea mínima. 60 segundos suelen ser suficientes para que el LLM descargue, procese y descarte.

**Regla 3 — Validá tamaño y mime type *antes* de codificar a base64**, no después. El error que tuve con el comprobante de 8 MB pasa porque la primera operación que hacés con el archivo es `base64.encode(read(file))`. Tiene que ser `validate(stat(file))` y solo después codificar.

**Regla 4 — Asumí que el path que te llega es hostil.** Normalizá, resolvé symlinks, chequeá que el resultado está adentro del directorio permitido. Path traversal es el bug más fácil de prevenir y el más común que vi.

**Regla 5 — Logueá el hash del archivo, no el contenido.** Si tenés que debuggear, lo que querés es saber "fue el mismo archivo", no tener el contenido en el log. Loguear contenido binario es cómo se filtran credenciales.

El flujo recomendado en cuatro cajas:

```text
[Cliente] ─POST archivo─> [Storage] (HTTP normal, multipart)
[Storage] ─signed URL──> [Cliente]
[Cliente] ─MCP tool call con URL─> [Servidor MCP]
[Servidor MCP] ─GET URL──> [Storage] (descarga, procesa, descarta)
```

MCP queda en su zona de confort: empujar JSON-RPC con metadata. El archivo viaja por el canal que sabe llevar archivos. Cada componente hace lo que sabe hacer.

## Lo que sigue

La spec de MCP va a tener que resolver esto en algún momento. SEP-1306 propone un modo binario explícito; otras propuestas hablan de un sub-protocolo HTTP paralelo. Lo que sea, vale más que el zoológico actual de workarounds incompatibles.

Mientras tanto, si vos estás armando un servidor MCP que toca archivos, tomate el tiempo de elegir el workaround a propósito y no por inercia. Cualquiera de las 7 opciones de la tabla puede funcionar si la validás. Ninguna funciona si la tratás como detalle de implementación.

Lo aprendí pagando con tiempo y con un susto en mi propio servidor de freee. Ahora se lo paso al lector: la próxima vez que tu LLM tenga que recibir un archivo, no preguntes "¿cómo lo meto en JSON?". Preguntá "¿por qué tendría que estar en JSON?". La respuesta casi siempre es: no tiene por qué.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
