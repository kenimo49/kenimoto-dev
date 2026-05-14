---
title: "Preface: The 300-Millisecond Wall"
---

# Preface: The 300-Millisecond Wall

![The silence after speaking to an AI device in a dark office -- the discomfort created by the 300ms wall](/images/books/voice-ai-300ms-ux/voice-ai-300ms-ux-preface-silence.png)

"Hello."

Yu tried to sound as natural as possible. It was the first demo of their voice AI product. After six months of development, the day had finally come to present it to investors.

Silence.

One second. Two seconds.

"Did it freeze?"

Yu will never forget the moment the investor's expression changed.

The AI did respond. "Hello, how can I help you?" The speech synthesis sounded natural. The content of the response was flawless. But it was too late.

That night, Yu sat alone in the office, staring at the MacBook screen. Google Sheets displayed the measurement results.

1.8 seconds. 2.1 seconds. 1.9 seconds.

Every single test case exceeded 1.5 seconds.

"This is not a conversation."

The words echoed through the quiet office.

That moment marked the beginning of Yu's quest for **300ms**.

---

This book is the story of Yu, a voice AI engineer, and Misaki, a UX designer, and their battle to make human-like conversation a reality. The problem they faced was simple on the surface but deeply rooted.

The technical insights throughout this book draw on my years of experience building real-time communication products with WebRTC, as well as firsthand lessons from designing and developing conversational AI products. The technical details and vendor comparisons reflect the state of the art as of March 2026, covering the rapidly evolving ecosystem of voice AI: OpenAI Realtime API, Gemini Live API, Pipecat, LiveKit, and more.

In human conversation, the silence between one person finishing and the other starting to speak averages just 200 milliseconds. Current voice AI agents, on the other hand, insert 700 to 1,000 milliseconds of silence -- three to five times longer. That gap is the source of the uncanny feeling.

This book follows Yu and Misaki's journey while weaving in practical experience and the latest technical developments to provide a systematic treatment of latency in voice AI:

- **How fast does human conversation actually move?** (Chapter 1)
- **At what point does the experience fall apart?** (Chapters 2-4)
- **Where does the delay come from?** (Chapters 5-6)
- **How do you make it faster?** (Chapter 7)
- **When you can't make it faster, how do you fake it?** (Chapter 8)
- **How do you balance "don't interrupt" with "don't be late"?** (Chapter 9)
- **What can we learn from existing voice assistants?** (Chapter 10)
- **How does edge AI break through the 300ms wall?** (Chapter 11)

Here are the key numbers that appear throughout this book:

| Threshold | Meaning |
|-----------|---------|
| 200ms | Average silence between turns in human conversation |
| 300ms | Upper limit for "natural conversation" in voice AI |
| 400ms | Doherty threshold: the limit where action and response feel continuous |
| 500ms | The point where users start talking over the AI |
| 800ms | The point where conversation breaks down |
| 1.5s | The point where experience quality drops sharply |
| 4s | The point where the entire experience collapses |

0.3 seconds. That tiny sliver of time is the dividing line between "talking with" an AI and "operating" one.

Yu and Misaki's story is both a technical challenge and a journey to redefine what it means to feel human.

I hope this book helps you break through that wall. And above all, I hope it saves those of you venturing into voice AI from taking the same detours we did.
