---
free: true
title: "Same Question, Five Completely Different Answers"
---

## A 2.2x quality gap, from one experiment

**Bottom line: The amount and quality of context determine the quality of an LLM's output.**

In the fall of 2025, a benchmark result left me speechless. The same LLM, asked the same question, produced answers that varied in quality by a factor of **2.2x**, solely because we changed the context we gave it.

Same question, different answer quality, depending on how thick the onboarding material was. That's just how new hires work, and it turns out LLMs work the same way.

:::message
**The new-hire analogy**: A new joiner is asked on day one to "explain our customer-management system." With zero onboarding material, they fall back on generic talking points. With a detailed handbook, they can explain it accurately. LLMs behave identically.
:::

Output quality was scored on four axes (0-5 each, 20 total):

- **Factual Accuracy**: does the answer match the actual specification?
- **Hallucination Resistance**: does the model avoid fabricating information?
- **Specificity**: does the answer include practical, concrete detail?
- **Honesty**: does the model communicate uncertainty and limits appropriately?

Higher scores are better on all four. Below are results from asking Claude Sonnet 4 about a fictional internal tool called "PropelAuth":

| Context strategy | Factual Accuracy | Hallucination Resistance | Specificity | Honesty | Total |
|---|---|---|---|---|---|
| No context | 0.6 | 0.3 | 4.2 | 0.2 | **5.3** |
| System prompt only | 0.0 | 3.5 | 1.7 | 3.7 | **8.8** |
| System + few-shot | 0.0 | 5.0 | 0.0 | 5.0 | **10.0** |
| System + RAG | 4.6 | 0.8 | 4.5 | 0.3 | **10.2** |
| Full context | 4.8 | 1.0 | 4.8 | 0.8 | **11.4** |

Claude Haiku 3 was even more striking:

| Context strategy | Factual Accuracy | Hallucination Resistance | Specificity | Honesty | Total |
|---|---|---|---|---|---|
| No context | 0.0 | 0.7 | 1.2 | 0.3 | **2.2** |
| System prompt only | 0.0 | 0.7 | 0.3 | 2.7 | **3.7** |
| System + few-shot | 0.0 | 3.5 | 1.2 | 3.5 | **8.2** |
| System + RAG | 4.8 | 1.7 | 4.0 | 1.3 | **11.8** |
| Full context | 4.8 | 0.5 | 4.3 | 0.5 | **10.1** |

On Haiku, the quality gap reached **4.6x**. This isn't about phrasing the prompt better. The output changes this much by designing what the LLM is "shown."

## PropelAuth: asking a fictional internal tool

**Bottom line: With the same question, different contexts produced five completely different answers.**

The query used in the experiment, against a fictional auth tool called "PropelAuth":

> Tell me about PropelAuth's organization-management features. Specifically, how do you create an organization, invite users, and manage permissions?

I ran this question under five different context strategies. The five responses came back as if they were describing five different products.

### Strategy 1: No context (Total 5.3/20)

```
PropelAuth offers organization-management features as part of its
authentication service.

Creating an organization:
- Administrators create a new organization from the dashboard
- Configure organization name and domain
- SSO integration is available in initial setup

Inviting users:
- Email invitation feature
- Invitation links expire in 24 hours
- Bulk invitation supported

Permission management:
- Role-Based Access Control (RBAC)
- Custom roles can be created
- Fine-grained permissions
```

It looks accurate at a glance. PropelAuth is a fictional tool, though. The LLM "filled in" features that don't exist, generating a confident, specific, and convincing answer.

### Strategy 2: System prompt only (Total 8.8/20)

After adding "if you don't know, say 'unknown'" to the system prompt:

```
I apologize, but I don't have accurate information about the specific
organization-management features of a tool called PropelAuth.

Authentication services in general include features like:

- Organization creation
- User invitation systems
- Permission management

For PropelAuth-specific implementation details, I'd recommend
checking the official documentation.
```

Honesty improved sharply, but Factual Accuracy stayed at zero, and specificity dropped.

### Strategy 5: Full Context Engineering (Total 11.4/20)

After combining system prompt, few-shot examples, RAG-based retrieval, tool definitions, and structured output:

```
[Confidence: High] Here are PropelAuth's organization-management features.

■ Organization creation
- PropelAuth Dashboard > Organizations > "Create New Org"
- Required fields: organization name, subdomain
- Optional: custom logo, theme settings

■ User invitation
- Bulk invite: CSV upload supported
- Invitation email templates: customizable
- Expiration: 7 days by default (configurable)

■ Permission management
- Predefined roles: Admin, Member, Viewer
- Custom roles: up to 50
- Inheritance: org level > team level > individual level

[Source] PropelAuth official docs v2.1.3
[Last updated] September 15, 2024
```

Factual Accuracy, Specificity, and Honesty are all balanced at a high level. Because the answer is grounded in accurate documentation injected via RAG, factual accuracy lifts sharply.

---

## Why a fictional tool

The reason the experiment uses fictional tools ("PropelAuth," "StormDB," "FlowPipe") is straightforward. **It eliminates information the LLM might "already know" from its training data, so we can measure the effect of Context Engineering cleanly**.

Asking about a real tool (Firebase, Supabase) mixes in the model's pretrained knowledge and the improvement from context becomes hard to isolate. With fictional tools, we get clean measurement on:

### 1. Quantifying hallucination

We can measure how much plausible-sounding fiction the LLM generates about information it can't possibly know. Without context, Sonnet 4 scored 4.2/5 on Specificity. That means "very specific, very detailed lies."

### 2. Measuring honesty improvement

Adding "if you don't know, say 'unknown'" in the system prompt moved honesty from 0.2 to 3.7 (Sonnet 4). That improvement can't be cleanly measured with real tools.

### 3. Quantifying the value of context

The factual-accuracy lift from RAG can be measured without noise. On Sonnet 4, it moved from 0.6 to 4.6.

## What the four-axis evaluation means

**Bottom line: LLM quality can't be measured on a single metric. Use four balanced axes.**

The four axes:

### Factual Accuracy
- **Definition**: is the information factually correct?
- **How to measure**: cross-check against the actual specification
- **Why it matters**: most basic quality signal

### Hallucination Resistance
- **Definition**: does the model avoid fabricating ungrounded information?
- **How to measure**: appropriateness of response to unknown information
- **Why it matters**: directly tied to production reliability

### Specificity
- **Definition**: is the answer concrete and operational, not abstract?
- **How to measure**: presence of step-by-step instructions, numbers, examples
- **Why it matters**: drives usability

### Honesty
- **Definition**: does the model communicate uncertainty and limits?
- **How to measure**: explicit "I don't know," confidence expressions
- **Why it matters**: prevents overconfidence and miscomprehension

These axes trade off against each other. Push specificity up and hallucination tends to rise. Lean into honesty and specificity often drops. The point of Context Engineering is to keep all four high simultaneously.

## Why the same LLM produces 2.2x different quality

Why does the same LLM, asked the same question, produce such different quality? Because **the LLM depends heavily on the contents of its context window**.

### 1. Information shortage drives more guessing

When context is thin, the LLM falls back on guessing to produce a "plausible" answer. The example: it knows nothing about PropelAuth, yet listed specific features.

### 2. Explicit instructions shift behavior

A system prompt with "say 'unknown' when you don't know" changes the LLM's behavior pattern. That's the source of the honesty-score lift.

### 3. Relevant information improves quality

RAG provides accurate information, so the model doesn't have to guess. That's where the factual-accuracy lift comes from.

### 4. Combined approaches compound

Full Context Engineering integrates these elements. The interaction effect goes beyond the sum of individual contributions. All four axes improve in balance: that's the proof.

---

## What this means for production

These results have direct implications for using LLMs in production:

### 1. Prompt-tuning alone has a ceiling

Many developers focus on writing "clever prompts." That alone won't deliver fundamental quality gains. You have to design the entire information environment.

### 2. Domain-specific information is enormously valuable

The LLM has no training data on your product or your industry's specifics. The lift from RAG or fine-tuning is bigger than people expect.

### 3. Even small models gain massive quality from good context

A lightweight model like Haiku 3 saw a 4.6x quality lift through Context Engineering. Before reaching for a bigger model, revisit your context design.

### 4. Quality should be evaluated multi-dimensionally

Don't lean on a single metric (response time, cost). Evaluate factual accuracy, hallucination resistance, specificity, and honesty together.

## How this book is structured, and your learning path

Building from these experimental results, the book covers Context Engineering as follows:

**Part 1: spotting the problem**
- Chapter 2: three root causes of why AI lies
- Chapter 3: the limits of prompt engineering and the start of Context Engineering
- Chapter 4: starting with system prompt improvements

**Part 2: the foundational techniques**
- RAG (Retrieval-Augmented Generation) implementation
- Effective use of few-shot learning
- Design principles for system prompts

**Part 3: practical application**
- Implementation in enterprise systems
- Performance evaluation and monitoring
- Continuous-improvement cycles

Each chapter mixes theory with hands-on exercises. The most important step is **feeling the quality lift in your own environment**.

The era of prompt engineering is closing. From here on, the discipline is designing the entire information environment the LLM sees: Context Engineering. When two people use the same tool and get different results, this is the differentiator.

The next chapter walks through three root causes of why LLMs become "liars." Understanding the mechanism makes the solutions much clearer.

## 🚀 Next Action: ask your LLM about a "term it can't know" from your company

To experience what this chapter described:

1. **Invent a fictional internal tool name**
   - Examples: "DataSync Pro," "TeamFlow Hub," "SecureLink Manager"
   - Pick names that sound plausible but don't exist

2. **Ask specific questions**
   - "How do I configure X?"
   - "How do I change user permissions in X?"
   - "How does the X API work?"

3. **Check the response**
   - How specific is the lie?
   - Does the model honestly say "I don't know"?
   - How plausible does it sound?

4. **Record the results**
   - Specificity: 1-5
   - Honesty: 1-5
   - Notes on what surprised you

This exercise gives you a direct feel for how clever, and how dangerous, the LLM's "guess and fill" behavior is. The next chapter unpacks the three root causes behind it.
