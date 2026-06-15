---
title: "Por qué los crawlers de IA no ven tu sitio en JavaScript (y cómo arreglarlo con SSR o prerender)"
description: "Googlebot renderiza tu JavaScript. Los crawlers de IA no. Descargué mis propias páginas como GPTBot y las que se renderizan en el cliente volvieron como un div vacío. Aquí está la prueba y el arreglo."
date: 2026-06-16
lang: es
tags: [llmo, busqueda-ia, ssr, javascript, react]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/crawlers-ia-no-ven-javascript-ssr-prerender/"
og_image: "https://kenimoto.dev/images/blog/crawlers-ia-no-ven-javascript-ssr-prerender/og-es.png"
cross_posted_to: []
---

Voy a empezar por la parte incómoda: esa landing tan linda que armaste en React, con todo en el cliente y un Lighthouse en verde, probablemente es una página en blanco para los crawlers de IA. No "mal posicionada". En blanco. GPTBot llega a tu URL, recibe un HTML, y la parte donde vive tu contenido se ve así:

```html
<body>
  <div id="root"></div>
  <script src="/app.js"></script>
</body>
```

Eso es todo. Para la IA, la página entera es un div vacío y la promesa de que algo va a aparecer después. Yo lo descubrí del modo vergonzoso, sintiéndome listo: había armado una SPA prolija, inyectado todas las meta tags y el JSON-LD con `react-helmet`, validado en el Rich Results Test de Google, y me sentía un adulto responsable. Después descargué mi propia página como la descarga un crawler de IA. Volvió el div vacío.

Este es un artículo práctico. Vamos por las tres preguntas en orden: por qué pasa, cómo lo verificas en treinta segundos, y cómo lo arreglas.

## La causa: los crawlers de IA no ejecutan JavaScript

Ese es el hecho entero. Googlebot sí lo ejecuta: carga la página en un Chromium headless, espera a que el JS corra, e indexa lo que el navegador dibujó. Pasamos casi diez años creyendo que "un crawler funciona así", porque para SEO funciona así. Los crawlers de IA se saltaron ese paso completo. GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot: descargan el HTML crudo que manda tu servidor, leen el texto que ya está ahí, y se van. Sin navegador. Sin renderizado. Sin segundo intento.

No es una corazonada mía. Vercel, junto con MERJ, instrumentó más de **1.300 millones de fetches de crawlers de IA** en su red y no encontró *ninguna* evidencia de ejecución de JavaScript ([Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)). Los bots a veces *descargan* archivos JS: GPTBot bajó JavaScript en el 11,5% de las solicitudes, ClaudeBot en el 23,84%. Pero descargar no es ejecutar. Agarran el archivo y nunca lo corren. Es comprar el libro de recetas y comerse la tapa.

La razón es aburrida y económica: renderizar JavaScript a escala de crawler cuesta caro, y estos bots corren con timeouts cortos. Así que no lo hacen. Googlebot paga ese costo porque la búsqueda es todo el negocio de Google. Para una empresa de IA, tu página es una entre mil millones, y el camino barato gana.

![Lo que GPTBot descarga en una SPA de React frente a una página con SSR: la del cliente es un div vacío, la del servidor trae todo el contenido y el JSON-LD](/images/blog/crawlers-ia-no-ven-javascript-ssr-prerender/csr-vs-ssg-es.png)

## Cómo verificarlo en treinta segundos

No tienes que creerme a mí ni a Vercel. Haz de cuenta que eres el bot. `curl`, sin motor de JavaScript, es un doble bastante fiel de lo que hacen estos crawlers: baja el HTML crudo y lo mira.

```bash
curl -A "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" https://tu-sitio.com/ \
  | grep -o '<div id="root">.*</div>'
```

Si eso imprime `<div id="root"></div>` sin nada adentro, tu contenido vive en el JavaScript, y el crawler de IA ve el mismo vacío. Yo corrí el equivalente en varios sitios para calibrar. Una app web conocida, renderizada en el cliente, volvió con **79 caracteres** de texto real en el HTML crudo: básicamente un `<title>` y una raíz vacía. Mi propio sitio, hecho con Astro y renderizado en tiempo de build, volvió con **6.098 caracteres** de texto más el JSON-LD ahí en el marcado. Mismo `curl`, mismo user-agent, dos realidades distintas.

Y acá está lo traicionero: abre esa misma página renderizada en el cliente en tu navegador y se ve perfecta. Títulos, precios, preguntas frecuentes, todo. Abre el Rich Results Test de Google y pasa, porque Google ejecuta el JavaScript. **Toda herramienta que usas para revisar tu trabajo ejecuta JavaScript.** El único público que no lo hace es justo el que querías alcanzar.

## Cómo arreglarlo, de menos a más esfuerzo

### Opción 1: sitio estático (SSG)

Astro, Next con `output: 'export'`, Hugo, HTML plano. El contenido queda en el marcado en tiempo de build. Es la victoria fácil, y por eso mi sitio pasó la prueba del `curl` sin que yo hiciera nada raro. Si tu sitio es mayormente contenido (blog, docs, landing), empieza por aquí.

### Opción 2: renderizado en el servidor (SSR)

Server components del App Router de Next, Nuxt, Remix, SvelteKit. El servidor corre el renderizado y entrega HTML de verdad. El truco clave está en *dónde* generas el JSON-LD. Si lo inyectas en el cliente, escribiste un schema que solo aparece después de que el JavaScript corre:

```jsx
// El crawler de IA nunca ve esto. Corre en un navegador, y el bot no es uno.
useEffect(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}, [])
```

`react-helmet`, inyección dinámica de `<Head>`, cualquier cosa que arma la etiqueta en tiempo de ejecución: para GPTBot, nada de eso existe. La corrección es emitir el mismo JSON-LD en el HTML que manda el servidor:

```jsx
// Renderizado en el servidor, presente en el HTML crudo, visible para todos.
export default function Page({ jsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

El schema es idéntico. La única diferencia es *cuándo* se crea, y "cuándo" es el partido entero cuando tu lector nunca arranca un runtime de JavaScript.

### Opción 3: prerender / renderizado dinámico

Si estás atrapado en una app CSR grande que no puedes reescribir este trimestre, una capa de prerender (Prerender.io, o tu propio caché de Chrome headless) detecta el user-agent del bot y le sirve un snapshot ya renderizado. Es un parche, no una cura, pero saca la página del blanco.

## SEO y LLMO por fin están en desacuerdo

Durante años la respuesta honesta a "¿mi SPA perjudica el SEO?" era "no tanto, Google la renderiza". Para Google, sigue siendo cierto. Para la búsqueda de IA, ahora es falso, y esa división es la noticia. Puedes tener una página que posiciona bien en Google y es completamente invisible para ChatGPT, Perplexity y Claude, por el único motivo de que Google trajo un navegador y ellos no.

Así que la decisión de renderizado que tomaste por SEO (o sin motivo, porque `create-react-app` venía por defecto) ahora es también una decisión de LLMO, y es la que condiciona todo lo demás. No tiene sentido optimizar tu `llms.txt`, tus encabezados o tus citas si el crawler está mirando un `<div>` vacío. La checklist completa de legibilidad para crawlers, con el comportamiento de renderizado de cada bot, la mantengo en [llmoframework.com](https://llmoframework.com).

## El resumen

La lección no fue "el JSON-LD es inútil" ni "React es malo". Es más angosta y más tonta: **el crawler de IA lee lo que manda tu servidor, no lo que arma tu navegador.** Si el contenido solo aparece después de que el JavaScript corre, para los lectores que más te importan no aparece nunca.

Ve y hazle un `curl` a tu home como GPTBot. En el peor caso, confirmas que está todo bien y perdiste treinta segundos. En el mejor, encuentras un div vacío donde debería estar tu mejor contenido, y lo arreglas antes de que alguien importante le pregunte a ChatGPT sobre ti.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
