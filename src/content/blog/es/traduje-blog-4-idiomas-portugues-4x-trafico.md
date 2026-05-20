---
title: "Traduje mi blog a 4 idiomas. El portugués recibió casi 4× más tráfico que el inglés."
description: "En 22 días: PT 748 PV, EN 195 PV, JA 27 PV, ES 7 PV. Pensé que el español iba a ganar por volumen de hablantes. Me equivoqué en cada eje. Esto es lo que aprendí sobre LLMO multilingüe, con los números en la mesa."
date: 2026-05-21
lang: es
tags: [llmo, multi-idioma, ga4, latam, tabnews]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/traduje-blog-4-idiomas-portugues-4x-trafico/"
og_image: "https://kenimoto.dev/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/og-es.png"
cross_posted_to: []
---

Cuando decidí traducir este blog a 4 idiomas, tenía un orden claro en la cabeza. El inglés iba a ganar por volumen. El español iba a quedar en segundo lugar por el número de hablantes. El japonés iba a mantenerse estable porque es mi idioma nativo. El portugués lo agregué casi por completismo, pensando que iba a quedar último.

22 días después, el snapshot de GA4 desmiente cada uno de esos pronósticos.

![PV por idioma en 22 días. PT: 748, EN: 195, JA: 27, ES: 7](/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/pv-by-language.png)

- **PT: 748 pageviews**, 709 sesiones
- **EN: 195 pageviews**, 176 sesiones
- **JA: 27 pageviews**, 29 sesiones
- **ES: 7 pageviews**, 7 sesiones

Eso significa que el PT está sacando casi 3,8× al inglés, 28× al japonés y 107× al español, en el mismo blog, con la misma cadencia de publicación y la misma persona escribiendo. Un solo artículo en PT (el del agente autónomo de 24 horas, 375 PV) tuvo más pageviews que todo mi blog en inglés sumado.

Escribí el artículo esperando que el ES me sorprendiera. El que vino a sorprenderme fue el PT, y el ES siguió silenciosamente sin existir.

Y antes de avanzar: este post tiene una sección concreta para ti, lector LatAm, sobre qué hace falta en español para que esto se invierta. Porque si la conclusión termina siendo "el portugués es mágico", entonces no aprendí nada.

## El contexto, para que puedas descontar mis números honestamente

No es un experimento limpio. Es un solo blog, [kenimoto.dev](https://kenimoto.dev), con 4 directorios de idioma (`/en/`, `/ja/`, `/pt/`, `/es/`). Los artículos pasan por un pipeline de traducción con LLM y después yo los reviso a mano para ajustar el registro y la localización (PT-BR vs PT de Portugal, español LatAm-neutro vs español de España). La ventana: del 2026-04-30 al 2026-05-21, 22 días de snapshot.

EN tiene 26 artículos, JA tiene 25, PT tiene 17 y ES tiene 10. O sea, el PT tiene menos artículos que el EN y aun así gana casi 4 a 1.

Si dejas de leer aquí, llévate esto: **la asimetría de idioma se come a la asimetría de cantidad de artículos**. Agregar un artículo en un idioma saturado es más lento que agregar un artículo en un idioma vacío.

## Por qué el PT se adelantó

No es que al lector brasileño le caiga mejor, lamentablemente. Son tres asimetrías apiladas.

![Tres asimetrías: TabNews, SOV en AI-search, llms.txt early-mover](/images/blog/four-languages-thirty-days-portuguese-four-x-traffic/why-pt-won.png)

### 1. TabNews es una puerta de entrada real que el inglés no tiene

[TabNews](https://www.tabnews.com.br/) es una comunidad de desarrolladores brasileños donde puedes publicar un artículo técnico y que lo lean humanos el mismo día, sin tener audiencia previa. No existe un equivalente limpio en inglés. Hacker News existe, pero la barrera para que un desconocido aparezca es muchísimo más alta, y la superficie temática es más angosta.

Cuando hago cross-post del mismo artículo en TabNews (PT) y en Dev.to (EN), TabNews entrega tráfico de referral consistente. Dev.to no entrega casi nada, a menos que ya tengas seguidores. Esa diferencia aparece directo en GA4.

### 2. Los SERP de AI-search en portugués están menos saturados

El contenido LLMO en inglés es un mercado saturado. Hay miles de artículos decentes peleando por los mismos prompts en ChatGPT, Perplexity, Gemini. El share of voice de un sitio chico es proporcionalmente cero.

En portugués el espacio está mucho más vacío. Cuando un motor de AI-search necesita una fuente en PT para responder "spec-driven development com Claude Code", hay muchos menos candidatos para elegir. La primera respuesta razonable en PT gana. La primera respuesta razonable en EN queda enterrada.

Esto coincide con lo que reportan herramientas de visibilidad multilingüe como [Peec AI](https://llmpulse.ai/blog/best-ai-visibility-tools/): la cobertura de idioma se volvió ventaja competitiva, porque la mayoría de las marcas optimiza inglés primero y nunca llega a los otros 114 idiomas.

### 3. Soy early-mover en `/pt/llms.txt`

La mayoría de los sitios grandes de devs BR todavía no publica llms.txt. Varios sitios grandes de devs en español LatAm tampoco. Yo publico `/pt/llms.txt`, `/es/llms.txt`, `/ja/llms.txt`, `/en/llms.txt` desde el día cero. En inglés esto es simple higiene, todo el mundo lo tiene. En portugués todavía da una ventaja chiquita.

Ya escribí antes sobre el caso de TRM, que creció los referrals desde ChatGPT en 8.337% haciendo lo básico de LLMO de manera consistente. La versión multilingüe de esa lección es: lo básico compone más rápido en los idiomas donde lo básico todavía es raro.

## Qué le falta al español LatAm para que esto se invierta

Acá viene la parte que importa para nosotros. El PT no ganó porque el idioma sea mágico. Ganó porque tuvo una puerta de entrada de comunidad. El español LatAm no la tiene, todavía.

Lo que hay:

- **Stack Overflow en español**: existe, pero el formato Q&A no funciona como discovery de artículos.
- **[Platzi](https://platzi.com), [Código Facilito](https://codigofacilito.com)**: excelentes, pero no son plataformas abiertas de publicación.
- **Comunidades hispanas en X/Twitter, LinkedIn**: distribuidas, sin un hub claro.
- **dev.to en español**: existe pero la masa crítica de lectores no acompaña.

Lo que haría falta: un equivalente de TabNews para LatAm. Un sitio donde un dev de Buenos Aires, Ciudad de México, Bogotá o Santiago pueda publicar un artículo técnico y que otros devs lo lean el mismo día sin algoritmo de por medio. Si sabes de algún hub así que esté funcionando ahora mismo, escríbeme, en serio.

Mientras tanto, mi blog en ES está en una zona rara: la competencia en AI-search también es menor que en EN (viento a favor), pero la puerta de entrada de comunidad no existe (viento en contra). Resultado: pageviews de un solo dígito.

## Por qué el JA recibió 1/27 del PT (escribir esto duele)

El japonés es mi idioma nativo. La versión JA la escribo yo, no es traducción, así que el texto es el más limpio de los cuatro. Y aun así el blog en JA recibió 27 pageviews. Veinte. Y siete.

La razón honesta es que el dev japonés lee mayoritariamente [Qiita](https://qiita.com) y [Zenn](https://zenn.dev), no blogs independientes. Publicar en mi dominio en japonés es pedirle al lector que salga de su hábitat. Publicar el mismo artículo en Zenn da decenas de lecturas el día uno.

Entonces la estrategia JA hay que cambiarla. El blog no compite con Qiita/Zenn por tráfico humano JA; queda como archivo canónico para que los crawlers de AI indexen, mientras Qiita/Zenn hacen el trabajo de tráfico humano. Es lo opuesto al lado PT, y está bien así. Idioma diferente, distribución diferente.

## Checklist de LLMO multilingüe que me hubiera servido el día uno

Si estás a punto de traducir tu blog a N idiomas, este es el playbook que le pasaría al yo del pasado:

1. **Para cada idioma objetivo, identifica la puerta de entrada de la comunidad antes que cualquier otra cosa.** No el tamaño de la audiencia. La puerta. Brasil tiene TabNews. Japón tiene Qiita/Zenn. Inglés tiene Hacker News pero la barrera es brutal. Español LatAm: lo estamos buscando juntos.
2. **Publica `/{idioma}/llms.txt` el día cero.** Son 15 minutos por idioma. La mayoría de los sitios no-inglés no lo tiene. Es el moat más barato que vas a construir, y el [llmoframework.com](https://llmoframework.com) lo trata como ítem central del playbook multilingüe.
3. **Configura los filtros de prefijo de idioma en GA4 antes de publicar.** Si no, te pasas el mes 2 haciendo retrofit de analytics en vez de escribir.
4. **Resiste la tentación de traducir todo.** Traduce el 20% de artículos con más chance de caer en la puerta de entrada de la comunidad. El resto puede esperar hasta que valides el canal de distribución.
5. **Trata el share of voice de AI-search de cada idioma como KPI separado.** Pasas los mismos prompts relevantes para tu marca por ChatGPT, Perplexity, Claude.ai en cada idioma, mensual. Las asimetrías son enormes y solo puedes gestionar lo que mides.

## Qué voy a hacer ahora

- Duplicar la cadencia PT, de 1/semana a 2/semana, para medir si el referral de TabNews escala linealmente o satura.
- Reencuadrar el JA: blog como archivo para crawlers de AI, Zenn/Qiita como superficie de distribución humana.
- Buscar la puerta de entrada de comunidad LatAm que falta, probablemente experimentando en 3 hubs distintos al mismo tiempo.
- Dejar la cadencia EN como está. El mercado en inglés está saturado; mi artículo marginal ahí vale menos que mi artículo marginal en PT.

Si te resistías al multi-idioma porque "no tengo tiempo", considera esto: el idioma con mayor ROI sobre tu tiempo puede no ser el de mayor número de hablantes. Puede ser el de menor competencia en la capa de AI-search y con la comunidad más abierta para recibir gente nueva.

En mi blog ese fue el portugués. En el tuyo puede ser indonesio, coreano, polaco, o incluso el español LatAm si entre todos armamos la puerta que ahora mismo no existe.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
