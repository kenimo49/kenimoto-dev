---
title: "Testei 5 stacks de Voice AI. Apenas 2 ficaram abaixo de 300ms."
description: "Li mil vezes que agentes de voz com IA respondem em menos de 300ms. Medi 5 stacks na mesma conversa de 1 minuto e 3 deles nem chegaram perto. A tabela real de P95 latency em maio de 2026."
date: 2026-05-13
lang: pt
tags: [voice-ai, latencia, realtime-api, webrtc, benchmark]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/cinco-stacks-voice-ai-apenas-dois-abaixo-300ms"
og_image: "https://kenimoto.dev/images/blog/cinco-stacks-voice-ai-apenas-dois-abaixo-300ms/og-pt.png"
cross_posted_to: []
---

Li mil vezes que agentes de voz com IA respondem em menos de 300ms. AssemblyAI fala isso, Vapi fala isso, todo post de lançamento de Realtime API fala isso. Então eu montei cinco stacks, coloquei um cronômetro em cada pipeline e rodei a mesma conversa de 1 minuto em todos.

Três dos cinco nem chegaram perto do limite.

Os outros dois eram justamente os que eu, em silêncio, estava achando que eram "número de marketing". Acontece que o marketing tava certo e a culpa era do meu pipeline costurado à mão.

![Cinco stacks de Voice AI medidos contra o limite de 300ms. Só OpenAI Realtime e LiveKit + Gemini Live ficaram abaixo.](/images/blog/cinco-stacks-voice-ai-apenas-dois-abaixo-300ms/p95-chart-pt.png)

## Os três paredões que ninguém coloca no slide

Antes dos números, o modelo de percepção. Latência de voz não degrada suavemente. Ela cai em paredões. AssemblyAI, Vapi e Retell convergem todos para mais ou menos os mesmos três limites, e depois de uma semana de teste com usuário eu acredito neles.

| Latência | O que o usuário faz |
|---|---|
| 0-300ms | Conversa normalmente, não pensa na IA |
| 300-500ms | Sente uma pausa, tolera |
| 500-800ms | Atropela a IA falando ("você tá me ouvindo?") |
| 800-1500ms | Repete a pergunta |
| 1500ms+ | Trata a chamada como ligação internacional, desiste |

300ms é o primeiro paredão. Acima dele, o usuário começa a perceber que tem máquina do outro lado. Acima de 500ms, ele briga com o turn-taking e o seu STT fica resetando porque o usuário fala em cima. Aos 800ms, metade dos meus testadores falou "alô? alô?". Aquele som universal de "isso aqui tá ligado?". Não tive semana mais humilhante de code review do que assistir a playback disso.

## Para onde vai o orçamento de 300ms

Se você quer entender por que três stacks meus quebraram, olha a matemática do orçamento. Um pipeline em cascata precisa encaixar quatro coisas em série dentro de 300ms.

- **STT** (speech-to-text): 80-300ms dependendo do modelo e do VAD
- **LLM TTFT** (tempo até o primeiro token): 100-500ms dependendo do tamanho do modelo, do contexto e do cold start
- **TTS TTFB** (primeiro byte de áudio): 75-300ms dependendo do vocoder
- **Round-trip de rede**: 50-200ms, limitado pela velocidade da luz e pela escolha de região

Soma o número mais rápido de cada linha e dá 305ms. Soma o número típico e passa de 1 segundo. O livro de onde esse benchmark saiu chama isso de "anatomia da latência", e a piada é que cascata é matematicamente alérgica a 300ms, a não ser que cada componente esteja literalmente do lado do outro.

Os modelos voice-to-voice end-to-end driblam essa regra colapsando STT + LLM + TTS em um único forward pass sobre um stream de tokens de áudio. Não tem segundo hop. Não tem warmup do TTS. Não tem hand-off entre serviços. É isso, e é também por isso que os dois stacks que ganharam foram os dois stacks onde eu escrevi menos código.

## Os cinco stacks

Eu queria comparação de verdade, não um post tipo "olha o meu vendor favorito". Mesmo script de atendimento de 1 minuto. Mesmo ingress WebRTC (Daily.co para tudo, menos OpenAI Realtime, que usa o endpoint próprio). Mesmo prompt. Mesma máquina cliente, US-East. Dez turnos por stack, 50 medições por stack. Reporto P50, P95 e P99 porque média mente de um jeito que o usuário de voz sente fisicamente.

**Stack 1 — OpenAI Realtime API.** `gpt-4o-realtime` no endpoint WebRTC oficial. Voz entra, voz sai, zero código de cola.

**Stack 2 — Cascata Deepgram + Claude + ElevenLabs.** Deepgram Nova-3 no STT, Claude Sonnet 4.6 como cérebro, ElevenLabs Turbo v2.5 no TTS. A cascata "melhor de cada categoria" que você desenha no quadro branco.

**Stack 3 — Edge local (Whisper + Llama + Coqui).** Whisper Large v3 Turbo, Llama 3.3 70B rodando local em uma H100, Coqui XTTS no TTS. Round-trip de rede: 0ms. A resposta de "privacidade e soberania" que o pessoal do TabNews ama.

**Stack 4 — LiveKit Agents + Gemini 2.0 Flash Live.** Framework de agents do LiveKit como plano de mídia, native-audio Gemini Live como cérebro. Também voice-to-voice end-to-end, mas em SDK diferente.

**Stack 5 — Pipecat + Claude + Cartesia.** Pipecat orquestrando, Claude Sonnet 4.6 no LLM, Cartesia Sonic no TTS. Cascata mais opinativa, com TTS mais rápido que ElevenLabs.

## Os resultados

| Stack | P50 | P95 | P99 | Abaixo de 300ms? |
|---|---|---|---|---|
| 1. OpenAI Realtime (voice-to-voice) | 232ms | 281ms | 320ms | ✅ |
| 2. Deepgram + Claude + ElevenLabs | 480ms | 624ms | 780ms | ❌ |
| 3. Whisper + Llama 70B + Coqui (local) | 870ms | 980ms | 1.210ms | ❌ |
| 4. LiveKit + Gemini Live (voice-to-voice) | 250ms | 295ms | 360ms | ✅ |
| 5. Pipecat + Claude + Cartesia | 410ms | 540ms | 670ms | ❌ |

Stack 1 e Stack 4 são os únicos abaixo de 300ms em P95. Ambos são voice-to-voice. Ambos entregam um único forward pass em vez de uma corrida de revezamento. Stack 5 mostra como é uma cascata bem cuidada (o TTS da Cartesia é genuinamente rápido — 90ms TTFB) e mesmo assim não vence o paredão, porque LLM TTFT mais os hops entre serviços comem o orçamento.

Stack 3 é o doloroso. Eu tinha esperança de que local pelo menos ganhasse da cascata pela ausência de rede. Ganha, às vezes. Mas Llama 3.3 70B não é pequeno, e "sem rede" não te salva quando o LLM TTFT sozinho dá 600ms em GPU comum. O capítulo de edge AI do livro é honesto sobre isso: o ganho realista de edge hoje é com **modelos menores** (classe Qwen2.5 1.5B), não com 70B local. 70B local é o pior dos dois mundos: você paga pela GPU e ainda não passa do paredão.

## No contexto brasileiro

Quem está construindo voz com IA no Brasil em 2026 esbarra em mais um problema antes mesmo de chegar nesses 300ms: latência de região. A maior parte dos endpoints de Realtime API vive em US-East ou EU-West. O round-trip de São Paulo até US-East-1 fica entre 110 e 140ms em condição decente, e isso já consome metade do seu orçamento antes do modelo ler o primeiro frame.

Empresas como Hotmart, RD Station e Stone investiram em voz com IA principalmente para SAC, IVR e onboarding por WhatsApp. O orçamento real de latência para essas equipes não é 300ms cloud puro, é mais perto de 450-600ms, e o caminho prático costuma ser: STT regional (Azure Speech pt-BR em São Paulo, Google Speech-to-Text pt-BR), LLM em US-East, TTS regional. Você não vai chegar abaixo de 300ms em maio de 2026 sem uma região local de Realtime API, então projete a UX para 500ms com filler estratégico em vez de prometer 300ms e decepcionar.

Custo: rodar Stack 2 24/7 com tráfego médio dá uns US$ 350-500/mês (R$ 1.750 a R$ 2.500 com câmbio de hoje). Stack 1 sai mais caro por minuto, mas elimina três contratos com vendors e tira o pipeline da sua mão. Pra equipe pequena, costuma ser melhor negócio do que parece.

## Por que voice-to-voice ganha (hoje)

Três motivos, em ordem decrescente de o quanto eu fiquei chocado:

**Um — não tem empilhamento de TTFT-depois-TTFB.** Em cascata, você espera o primeiro token do LLM e só aí dispara o TTS, que tem o próprio first-byte. Voice-to-voice emite token de áudio direto. Sem segundo warmup.

**Dois — sem serialização de hand-off.** Deepgram → Claude → ElevenLabs são três endpoints diferentes. Mesmo que cada um seja rápido, você paga TLS, connection pool e buffer de frame três vezes. Pipecat ajuda, mas não apaga.

**Três — turn-taking VAD-aware.** Os modelos voice-to-voice fazem detecção de endpoint diretamente no stream de áudio. Cascatas precisam esperar um sinal de VAD para fechar a saída do STT antes de enviar. Esse delay de fechamento é invisível em benchmark que começa a contar a partir de "usuário parou de falar", mas o usuário não sabe quando "oficialmente" parou. Ele sente como silêncio.

O jeito mais barato de bater 300ms em maio de 2026 é não escrever o pipeline. A maior parte da minha latência era código meu.

## Quando edge AI vai alcançar

Edge é a resposta certa para o formato certo de problema: privacidade local-only, totem sem rede, robótica offline. Não é, hoje, a resposta para "quero um agente cloud abaixo de 300ms". Whisper v3 Turbo bate Real-Time Factor acima de 1000x e modelos classe 1.5B retornam o primeiro token em 200ms no CPU. Essa combinação — modelo pequeno, STT rápido, TTS local — fecha em 300-350ms. O caminho de 70B-no-H100 que testei no Stack 3 não fecha.

O outro caminho é híbrido: STT no edge, LLM e TTS na cloud. Você pula o round-trip de rede no passo síncrono mais longo (capturar áudio) e mantém qualidade de cloud no cérebro. O livro organiza isso em uma matriz de decisão e bate com o que eu medi: 350-500ms é realista; cascata cloud abaixo de 300ms não é.

Pra quem quer aprofundar no lado da percepção — como fazer um agente de 500ms **parecer** de 300ms — escrevi um companheiro sobre [perception hacks de voice AI](https://dev.to/kenimo49/voice-perception-hacks-i-kept-the-pipeline-at-540ms-and-users-still-said-instant-3oki) lá no Dev.to. Filler, micro-confirmações e playback progressivo de token compram um paredão inteiro de velocidade percebida. Não movem o paredão de verdade.

## O que eu construiria hoje

Maio de 2026, começando do zero:

- **Produto consumer novo** — OpenAI Realtime ou Gemini Live, direto. Para antes do que você acha que precisa e lança
- **Tem que ter Claude no loop** — Pipecat + Claude + Cartesia. Você vai viver em P95 de 500-600ms. Desenha filler agora, não depois
- **Requisito de privacidade ou air-gap** — Whisper Turbo + Qwen2.5 1.5B + TTS local. Mira em 350ms TTFB. Esquece 70B local até a próxima geração de GPU
- **Telefonia corporativa (Brasil)** — Híbrido: STT regional, cérebro voice-to-voice na cloud. O codec PSTN já mata sua vantagem de latência, então otimiza qualidade de turn-taking em vez de número absoluto

O erro mais profundo que cometi foi achar que "300ms" é propriedade do **modelo** que escolhi. É propriedade da **arquitetura** que escolhi. O modelo só decide o quão confortável aquela arquitetura é.

A arquitetura completa de latência (turn-taking de 200ms, por que 300ms quebra a UX, Pipecat / LiveKit / Deepgram, quebrando a barreira dos 525ms) está em **[The 300ms Threshold — Why Talking to AI Feels Wrong](https://kenimoto.dev/books/voice-ai-300ms-ux?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=cinco-stacks-voice-ai-300ms)** (em inglês — a versão PT-BR está em planejamento).

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
