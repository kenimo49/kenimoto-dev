---
title: "The 300ms Threshold"
subtitle: "Why Talking to AI Feels Wrong"
description: "Voice AI experience is 90% latency. Human turn-taking happens at 200ms. Past 300ms, UX feels off. Past 800ms, conversation collapses. This book breaks the 525ms cascade pipeline barrier using Pipecat, LiveKit, and Deepgram — through streaming design, perceptual hacks, and edge AI."
lang: "en"

kindle_url: "https://www.amazon.co.jp/dp/B0GYQ4L2KP"

published_date: 2026-04-25

cover_image: "/images/books/voice-ai-300ms-ux-en.jpg"

topics:
  - "Voice AI"
  - "WebRTC"
  - "Latency UX"
  - "Streaming TTS"
  - "Edge AI"

keywords:
  - "Voice AI latency"
  - "Voice AI UX design"
  - "Pipecat tutorial"
  - "LiveKit voice AI"
  - "Deepgram streaming"
  - "WebRTC voice"
  - "Streaming TTS"
  - "Edge AI inference"
  - "Turn-taking detection"
  - "TTFB voice"

tagline: "Voice AI latency design | Pipecat · LiveKit · Deepgram — break the 525ms barrier"
hero_message: "Ever felt 'something's off' talking to AI? Human turn-taking happens at 200ms. Past 300ms, the UX collapses. This book explains why, and how to design around it."
series_role: "Human-AI Interaction [Specialty]. Latency UX for voice agents."

outcomes:
  - "Translate Nielsen's response time thresholds into voice UX design decisions"
  - "Decompose cascade pipeline (STT → LLM → TTS) and identify each ms"
  - "Combine Pipecat / LiveKit / Deepgram for sub-300ms responses"
  - "Use streaming TTS and perceptual hacks (filler words) to boost felt speed"
  - "Eliminate cloud round-trips with edge AI (Whisper Tiny / quantized LLMs)"

target_readers:
  - "[Voice AI Developer] Stuck on cascade pipeline latency"
  - "[WebRTC Engineer] Want to apply VoIP knowledge to AI voice"
  - "[UX Designer] Need to quantify conversational naturalness"
  - "[Startup CTO] Want speed as a competitive moat for voice AI products"
  - "[Researcher] Looking to fuse Nielsen thresholds, conversation analysis, and psychoacoustics"

position_statement:
  - "Implementation-focused (concrete Pipecat / LiveKit / Deepgram stacks)"
  - "Voice-specific (not chatbot — real-time spoken AI only)"
  - "Intermediate level (WebRTC / TTS basics assumed)"
  - "Cross-disciplinary (psychology + UX + implementation + edge AI in one book)"

differentiation:
  - "Quantifies 3 cliffs (300ms / 500ms / 800ms) using Nielsen's response time thresholds"
  - "First book comparing Pipecat / LiveKit / Deepgram side by side"
  - "Only resource covering streaming design + perceptual hacks together"
  - "Includes edge AI chapter (Whisper Tiny, quantized LLMs) for cloud-zero designs"

pain_points:
  - "Implemented voice AI but the conversational rhythm feels broken"
  - "Measured TTFB but can't pinpoint the bottleneck"
  - "Stuck choosing between Pipecat, LiveKit, and Deepgram"
  - "TTS latency dominates and ruins the whole pipeline"
  - "Want edge AI for voice but no clear architecture"
  - "Users say it feels 'robotic' — no clear path to fix it"

competitor_comparison:
  - book: "Generic AI implementation books"
    difference: "Voice-specific. Tackles a different latency layer than text chatbots."
  - book: "WebRTC / SIP guides"
    difference: "Not protocol-only. End-to-end latency including AI inference."
  - book: "Vendor docs (Pipecat / LiveKit / etc.)"
    difference: "Multi-vendor comparison and combination, not single-stack guidance."

related_books:
  - "claude-code-mastery"
  - "harness-engineering-guide"

chapters:
  - title: "Preface"
    free: true
  - title: "Why 300ms — Nielsen's Response Time Thresholds"
    free: true
    sub_chapters:
      - "A Universal Rhythm"
      - "What 200ms Means"
      - "The 600ms \"Thinking\" Impression"
      - "Implications for Voice AI"
  - title: "Three Cliffs — 300ms / 500ms / 800ms"
    free: true
    sub_chapters:
      - "Applying a GUI Classic to Voice"
      - "In Voice UI, the Thresholds Shrink"
      - "The Doherty Threshold — Another Baseline"
  - title: "Cascade Pipeline Decomposition — STT / LLM / TTS"
  - title: "Implementation with Pipecat"
  - title: "Implementation with LiveKit"
  - title: "Deepgram + Streaming"
  - title: "Turn-taking Detection"
  - title: "Filler Words and Perceptual Hacks"
  - title: "Streaming TTS"
  - title: "Edge AI to Reduce TTFB"
  - title: "Acoustic Synchronization and Psychology"
  - title: "Benchmark Design"
  - title: "Production Patterns"
  - title: "The Future"
  - title: "Afterword"
  - title: "References"

cta_label: "Read on Kindle"
---

When a person pauses half a second too long, you notice. With AI, you notice more sharply.

Human turn-taking happens at 200ms. Past 300ms, the UX feels off. Past 800ms, the conversation collapses. This book grounds those numbers in Nielsen's response time thresholds, then walks through the latest stacks (**Pipecat, LiveKit, Deepgram**) with concrete designs for streaming, perceptual hacks, and edge AI.

> "Speed isn't a feature. It's a precondition."
