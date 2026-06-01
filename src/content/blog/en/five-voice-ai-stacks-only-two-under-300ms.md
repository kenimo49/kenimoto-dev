---
title: "I Benchmarked 5 Voice AI Stacks. Only 2 Stayed Under 300ms."
description: "I kept reading that voice agents respond under 300ms. I measured 5 stacks against the same 1-minute conversation. Three of them missed the cliff entirely. Here is the P95 latency table for May 2026."
date: 2026-05-13
lang: en
tags: [voice-ai, latency, realtime-api, webrtc, benchmarks]
featured: false
canonical_url: "https://kenimoto.dev/blog/five-voice-ai-stacks-only-two-under-300ms"
og_image: "https://kenimoto.dev/images/blog/five-voice-ai-stacks-only-two-under-300ms/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/i-benchmarked-5-voice-ai-stacks-only-2-stayed-under-300ms-27df
---

I kept reading that voice AI agents respond in under 300ms. AssemblyAI says it, Vapi says it, every Realtime API launch post says it. So I built five stacks, dropped a stopwatch into each pipeline, and ran the same one-minute conversation through all of them.

Three of the five never came close.

The other two were the ones I had quietly assumed were "marketing numbers." Turns out the marketing was right and my hand-stitched pipelines were the problem.

![Five voice AI stacks measured against the 300ms latency cliff. Only OpenAI Realtime and LiveKit + Gemini Live stayed under.](/images/blog/five-voice-ai-stacks-only-two-under-300ms/p95-chart.png)

## The three cliffs nobody puts on the slide

Before the numbers, the perception model. Voice latency does not degrade smoothly. It falls off cliffs. AssemblyAI, Vapi, and Retell all converge on roughly the same three thresholds, and after a week of user testing I now believe them.

| Latency | What the user does |
|---|---|
| 0-300ms | Talks normally, never thinks about the AI |
| 300-500ms | Senses a pause, tolerates it |
| 500-800ms | Talks over the AI ("can you hear me?") |
| 800-1500ms | Repeats the question |
| 1500ms+ | Treats the call like an international line, gives up |

300ms is the first cliff. Above it, the user starts noticing a machine. Above 500ms they start fighting the turn-taking model and your STT keeps resetting because they keep talking over. By 800ms, half my testers said "hello? hello?" — the universal "is this thing on" sound. I have not lived a more humbling week of code review than watching that on playback.

## Where the 300ms budget goes

If you want to know why three of my five stacks failed, look at the budget math. A cascaded pipeline has to fit four serial things into 300ms:

- **STT** (speech-to-text): 80-300ms depending on model and VAD design
- **LLM TTFT** (time to first token): 100-500ms depending on model size, context length, and cold-start
- **TTS TTFB** (time to first byte of audio): 75-300ms depending on the vocoder
- **Network round-trip**: 50-200ms, capped by the speed of light and your colo choice

Add the *fastest* number in every row and you get 305ms. Add the typical number and you get over a second. The book this benchmark grew out of calls this the "anatomy of latency," and the punchline is that a cascade is mathematically allergic to 300ms unless every component lives next to every other component.

Voice-to-voice end-to-end models cheat by collapsing STT + LLM + TTS into a single forward pass over an audio token stream. There is no second hop. There is no TTS warmup. There is no inter-service hand-off. That is the whole game, and it is also why the two stacks that won are the two stacks I wrote the least code for.

## The five stacks

I wanted a real comparison, not a "look at my favorite vendor" post. Same one-minute customer-support script. Same WebRTC ingress (Daily.co for everything except OpenAI Realtime, which uses its own). Same prompt. Same client machine, US-East. Ten turns per stack, 50 measurements per stack. I report P50, P95, and P99 because averages lie in a way that voice users physically feel.

**Stack 1 — OpenAI Realtime API.** `gpt-4o-realtime` over the official WebRTC endpoint. Voice-in, voice-out, no glue.

**Stack 2 — Deepgram + Claude + ElevenLabs cascade.** Deepgram Nova-3 for STT, Claude Sonnet 4.6 for the LLM, ElevenLabs Turbo v2.5 for TTS. The "best-of-breed" cascade you would draw on a whiteboard.

**Stack 3 — Local Edge (Whisper + Llama + Coqui).** Whisper Large v3 Turbo, Llama 3.3 70B local on a single H100, Coqui XTTS for TTS. Network round-trip: 0ms. This is the "privacy and sovereignty" answer that Hacker News loves.

**Stack 4 — LiveKit Agents + Gemini 2.0 Flash Live.** LiveKit's agents framework as the media plane, Google's native-audio Gemini Live for the brain. Also voice-to-voice end-to-end, but through a different SDK.

**Stack 5 — Pipecat + Claude + Cartesia.** Pipecat as the orchestrator, Claude Sonnet 4.6 for the LLM, Cartesia Sonic for the TTS. A more opinionated cascade with a faster TTS than ElevenLabs.

## The results

| Stack | P50 | P95 | P99 | Under 300ms? |
|---|---|---|---|---|
| 1. OpenAI Realtime (voice-to-voice) | 232ms | 281ms | 320ms | ✅ |
| 2. Deepgram + Claude + ElevenLabs | 480ms | 624ms | 780ms | ❌ |
| 3. Whisper + Llama 70B + Coqui (local) | 870ms | 980ms | 1,210ms | ❌ |
| 4. LiveKit + Gemini Live (voice-to-voice) | 250ms | 295ms | 360ms | ✅ |
| 5. Pipecat + Claude + Cartesia | 410ms | 540ms | 670ms | ❌ |

Stack 1 and Stack 4 are the only two that stayed under 300ms at P95. Both are voice-to-voice. Both ship a single forward pass instead of a relay race. Stack 5 is what a careful cascade looks like (Cartesia's TTS is genuinely fast — 90ms TTFB) and it still cannot beat the cliff because LLM TTFT plus inter-service hops eat the budget.

Stack 3 is the painful one. I had hoped local would at least beat the cascade because of zero network. It does, sometimes. But Llama 3.3 70B is not small, and "no network" does not save you when LLM TTFT alone is 600ms on commodity GPU. The book chapter on edge AI is honest about this: today's realistic edge win is *smaller* models — Qwen2.5 1.5B class — not full-fat 70B local. A 70B model on local hardware is the worst of both worlds: you pay for the GPU and still miss the cliff.

## Why voice-to-voice wins (today)

Three reasons, in decreasing order of how much they shocked me:

**One — no TTFT-then-TTFB stacking.** In a cascade, you wait for the LLM's first token, then start the TTS, which has its own first-byte latency. Voice-to-voice emits audio tokens directly. There is no second warmup.

**Two — no hand-off serialization.** Deepgram → Claude → ElevenLabs is three separate API endpoints. Even if each is fast, you pay TLS, connection pooling, and frame-buffer overhead three times. Pipecat helps but does not erase it.

**Three — VAD-aware turn-taking.** The voice-to-voice models do their own endpoint detection from the audio stream. Cascades have to wait for a VAD signal to commit the STT output, then send it. That commitment delay is invisible in benchmarks that start measuring from "user stops speaking" — but the user does not know when they "officially" stopped. They feel it as silence.

The cheap way to hit 300ms in May 2026 is to skip writing the pipeline. Most of my latency was my code.

## When edge AI catches up

Edge is the right answer for the right shape of problem — local-only privacy, no-network kiosks, offline robotics. It is not yet the right answer for "I want a sub-300ms cloud agent." Whisper v3 Turbo posts a real-time factor north of 1000x and 1.5B-class LLMs can return first tokens in 200ms on CPU. That combination — small model, fast STT, local TTS — can hit 300-350ms total. The 70B-on-H100 path I tested in Stack 3 cannot.

The other path is hybrid: edge STT, cloud LLM, cloud TTS. You skip the network round trip on the longest synchronous step (capturing audio frames) and you keep cloud-grade model quality for the brain. The book lays this out as a decision matrix and it lines up with what I measured: 350-500ms is realistic, sub-300ms cloud cascade is not.

For more on the perception side — how to make a 500ms agent *feel* like a 300ms agent — I wrote a companion piece on [perception hacks for voice AI](https://dev.to/kenimo49/voice-perception-hacks-i-kept-the-pipeline-at-540ms-and-users-still-said-instant-3oki) over on Dev.to. Filler audio, micro-confirmations, and progressive token playback can buy you a cliff's worth of perceived speed. They do not make the cliff move.

## What I would build today

If I were starting a voice agent in May 2026:

- **Greenfield consumer product** — OpenAI Realtime or Gemini Live, direct. Stop sooner than you think you should and just ship.
- **Need Claude in the loop** — Pipecat + Claude + Cartesia. You will live at 500-600ms P95. Plan your filler strategy now, not later.
- **Privacy or air-gap requirement** — Whisper Turbo + Qwen2.5 1.5B + local TTS. Aim for 350ms TTFB. Forget 70B local until the next GPU generation.
- **Enterprise telephony** — Hybrid: edge STT, cloud voice-to-voice for the brain. The PSTN codec layer already kills your latency advantage, so optimize for quality of turn-taking instead.

The deepest mistake I made was assuming "300ms" was a property of the *model* I picked. It is a property of the *architecture* I picked. The model just decides how comfortable the architecture is.

## Related reading

- [The cheap model that won: context beats parameters](https://kenimoto.dev/blog/cheap-model-won-context-beats-parameters) — same lesson in a different domain. Architecture eats model size for lunch.
- [Claude Code vs ChatGPT Codex: official AI agents in 2026](https://kenimoto.dev/blog/claude-code-vs-chatgpt-codex-official-agents) — what the LLM side looks like when latency stops mattering.

For the full latency anatomy, perception model, and the edge AI chapter that informed Stack 3 — I packaged the research into a Book.

[Voice AI 300ms UX: Design and Engineer the Conversation Cliff](https://kenimoto.dev/books/voice-ai-300ms-ux)
