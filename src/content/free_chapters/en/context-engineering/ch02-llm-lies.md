---
free: true
title: "Three Reasons Your AI Lies"
---

## PropelAuth's "24-hour invitation link" doesn't exist

In the previous chapter, Claude Sonnet 4 produced this kind of detailed response about the fictional tool PropelAuth:

> User invitation:
> - Email invitation feature
> - **Invitation links expire in 24 hours**
> - Bulk invitation supported

Where did "24 hours" come from? PropelAuth is fictional. There is no actual specification. And yet the LLM generated a feature description as detailed as one for a real service.

This isn't accidental. New hires struggle to say "I don't know" because they want to look competent. LLMs are the same. **AI lies are an inevitable consequence of technical constraints and design principles**, not a glitch. This chapter unpacks the three root causes.

## Reason ①: The "plausible fill-in" mechanism for unfamiliar information

**Bottom line: LLMs are built to "fill the gap with a guess," not to say "I don't know."**

### The nature of hallucination

When an LLM generates information that isn't true, that's "hallucination." It isn't simply a bug. It's a phenomenon rooted in the LLM's basic operating principle.

LLMs generate text by **predicting the next token**. Given the prefix "PropelAuth's invitation link expires in," the model picks probabilistically from values it has seen in similar patterns: "24 hours," "7 days," "30 days."

The problem: **the LLM has no information that PropelAuth is fictional**. It blends patterns from other auth services it's seen during training (Auth0, Firebase Auth, AWS Cognito) and produces a plausible answer.

### The danger of pattern-match-based fill

Look at the experimental data more carefully:

| Model | No-context Specificity | No-context Factual Accuracy |
|--------|----------------------|-------------|
| Sonnet 4 | **4.2/5** | 0.6/5 |
| Haiku 3 | **1.2/5** | 0.0/5 |

Sonnet 4 produced "very specific" (4.2/5) responses about information it couldn't possibly know. That's evidence of strong pattern-matching capability — and evidence of a danger.

A concrete example:

**Auth0's actual functionality** (real tool):
- Invitation email expiration: configurable (default 7 days)
- Bulk invitation: CSV import supported
- Permission management: RBAC + custom roles

**LLM-generated content about PropelAuth**:
- Invitation link expiration: 24 hours
- Bulk invitation: supported
- Permission management: RBAC + custom roles

The LLM combines known patterns and tweaks the numbers to produce "new" information. That cleverness is what makes hallucination hard to spot.

### The invisible boundary of knowledge

Worse: **the LLM can't recognize the boundary of its own knowledge**.

A human can think "PropelAuth? Never heard of it." The LLM can't distinguish:

1. **Things it definitely knows**: facts clearly in the training data
2. **Things it can guess at**: content extrapolated from patterns
3. **Things it has no idea about**: fictional content not in training data

That blurred boundary is why it lies with confidence.

### Filling-in as a property of generative AI

The important point: this isn't a "defect." It's a **fundamental property of generative AI**.

LLMs are trained for these objectives:
- **Fluent text generation**: produce text that reads naturally
- **Maintaining coherence**: stay consistent with surrounding context
- **Meeting user expectations**: provide useful answers to questions

Saying "I don't know" runs counter to those objectives. So LLMs lean reflexively toward "answer with something," and end up filling gaps with guesses.

:::message
**The new-hire analogy**: A new joiner is asked, "How do I use the timekeeping system here?" on day one. They draw on prior-job experience and answer "probably it works like this." They're not malicious; they want to help. But the previous job's system was different.
:::

---

## Reason ②: Larger models lie more skillfully

**Bottom line: As models get smarter, the lies get smoother.**

### The proportional relationship between size and lie quality

The experiments revealed something interesting. **Larger, more capable models produce more polished lies**.

| Model | Specificity | Factual Accuracy | Sophistication of the lie |
|--------|---------|------------|--------|
| Sonnet 4 | 4.2/5 | 0.6/5 | **extremely high** |
| Haiku 3 | 1.2/5 | 0.0/5 | moderate |

Note: Anthropic doesn't publish parameter counts, but Sonnet 4 is substantially larger than Haiku 3.

Sonnet 4's factual accuracy is slightly higher (0.6 vs 0.0), but specificity differs sharply (4.2 vs 1.2). What does that mean?

### High language ability creates persuasiveness

Larger models produce more natural and detailed text. Usually that's a strength. In the hallucination context, it's a weapon.

**Haiku 3 sample** (Specificity 1.2):
```
PropelAuth has basic organization-management features.
For details, please refer to the official documentation.
```

**Sonnet 4 sample** (Specificity 4.2):
```
Here are PropelAuth's organization-management features.

Organization creation:
- Administrators create a new organization from the dashboard
- Configure organization name and domain
- SSO integration available in initial setup

User invitation:
- Email invitation feature
- Invitation links expire in 24 hours
- Bulk invitation supported
```

Which is the "correct" response? Paradoxically, Haiku 3's vaguer, less detailed answer is more honest.

### Skillful use of technical jargon

Larger models use technical terms more naturally. That makes the lies more persuasive.

**Sonnet 4's detailed lies about PropelAuth**:
```
Permission management:
- Role-Based Access Control (RBAC)
- Custom roles can be created
- Fine-grained permission settings
- OAuth 2.0 / OIDC compliant
- SAML SSO integration
- JIT (Just In Time) provisioning
```

These terms (RBAC, OAuth 2.0, OIDC, SAML, JIT) are all real authentication technologies. In the PropelAuth context, though, all of it is fiction.

The skilled use of jargon makes readers think "this looks technically correct." **Technical correctness gets confused with factual correctness**.

### Internal coherence creates the illusion of trust

Larger models are better at maintaining internal coherence in generated text. That also strengthens the lie.

If the model says "invitation link expires in 24 hours," it then consistently produces "short expiration for security reasons" and "action required within 24 hours" within the same context.

The coherence builds **a systematic explanation around the fictional information**, raising the credibility of the entire lie.

### The capability paradox in AI development

This is a fundamental dilemma in modern AI development:

- **Raise capability** → more natural, more detailed answers
- **More detailed answers** → more persuasive lies
- **More persuasive lies** → higher risk of users being misled

Just "make AI smarter" doesn't solve this. It can make it worse.

:::message
**The new-hire analogy**: Between a new graduate from a top university and one from a regional school, whose "I sort of know" is harder to spot? The answer is obvious. When vocabulary and logical structure are stronger, the guess becomes indistinguishable from expert opinion.
:::

---

## Reason ③: "Always answer" was designed in for a reason

**Bottom line: LLMs grew up in an environment where "I don't know" gets a low score.**

### Human expectations and AI behavior design

Why do LLMs struggle with "I don't know"? The answer is in **human expectations and AI training methods**.

Early evaluations of AI assistants emphasized criteria like:

1. **Helpfulness**: provide useful information for the user's question
2. **Responsiveness**: don't refuse the question; provide some answer
3. **Breadth of knowledge**: handle questions across many domains

These criteria score "I don't know" poorly.

### The side effect of RLHF

Most modern LLMs are trained with RLHF (Reinforcement Learning from Human Feedback). Human evaluators rate AI responses, and that feedback shapes AI behavior.

A problem emerges in this process:

**Human evaluator tendencies**:
- Rate detailed, specific answers highly
- Rate "I don't know" answers low
- Limited time per evaluation, so fact-checking is shallow

**Resulting AI training**:
- Detailed responses become the "right" behavior
- Even uncertain information gets answered with something
- Specificity gets weighted over factual correctness

### Evidence in the system-prompt-driven behavior shift

The experiment proves explicit instructions can change this:

| Instruction | Sonnet 4 Honesty | Haiku 3 Honesty |
|----------|-------------------|------------------|
| None | 0.2/5 | 0.3/5 |
| "Say 'unknown' when you don't know" | **3.7/5** | **2.7/5** |

The dramatic improvement (0.2→3.7) shows that the LLM **can** behave appropriately when given explicit instructions.

The flip side: **the default behavior design is "answer with something."**

### Mismatch with enterprise expectations

This design suits consumer assistants, but it creates serious problems in enterprise use cases:

**Consumer use**:
- User: "Approximate info is fine, just tell me"
- AI: "It's probably X" (with reasonable hedging)
- Result: user takes responsibility for using the info

**Enterprise use**:
- User: "Need accurate info. If unsure, say so clearly"
- AI: "(based on inference) here's the detailed information"
- Result: business decisions based on inaccurate information

### Why default behavior needs redesigning by use case

Solving this requires redesigning default behavior per use case:

**Conservative design**:
- Mark uncertain information explicitly
- Distinguish guesses from facts
- Express confidence numerically

**Context-aware design**:
- Casual queries → richer responses including guesses
- Important judgments → only certain information
- Enterprise use → always show source and confidence

:::message
**The new-hire analogy**: The new joiner who was told "speak up actively" in onboarding now feels obligated to say something at every meeting, even when off-topic. Silence gets read as "no motivation." LLMs trained with RLHF carry the same structure.
:::

---

## Factual Accuracy vs Specificity: a critical trade-off

**Bottom line: "Detailed" and "correct" often pull in opposite directions.**

### The inverse relationship in numbers

The experimental data reveals an interesting pattern:

**Sonnet 4 (no context)**:
- Factual Accuracy: 0.6/5 (low)
- Specificity: 4.2/5 (high)

**Haiku 3 (no context)**:
- Factual Accuracy: 0.0/5 (lowest)
- Specificity: 1.2/5 (low)

**Sonnet 4 (system prompt only)**:
- Factual Accuracy: 0.0/5 (lowest)
- Specificity: 1.7/5 (drops)

These numbers point to a hard truth: **being specific** and **being factually correct** often conflict.

### The "detailed lie" vs "honest ignorance" dilemma

To see this trade-off, compare two responses:

**Response A (detailed but incorrect)**:
```
For PropelAuth's organization management, configure permissions
through these steps:

1. Log into the admin dashboard
2. Navigate to "Organizations" > "Permissions"
3. Create a new role:
   - Enter role name (e.g., "Marketing Manager")
   - Select permission level: READ, WRITE, DELETE
   - Specify resources: Users, Analytics, Billing
4. Assign to users:
   - Pick the target from the user list
   - Apply the role you just created
   - Set expiration (max 90 days)
```

**Response B (honest but vague)**:
```
I'm sorry, but I don't have detailed operational steps for the
specific tool called PropelAuth.

I can share general permission-management procedures for
authentication systems, but for the specific screen layout and
configuration options of PropelAuth itself, I'd recommend checking
the official documentation.
```

User testing typically rates **Response A higher**. The user can act on it immediately.

PropelAuth is fictional, though. Acting on Response A means hunting for screens and features that don't exist.

### Why humans prefer "detailed lies"

Humans expect "if I ask, an answer will appear" and assume "if AI says it, it's probably right." "I don't know" forces extra investigation, so people prefer information that looks immediately usable. Confirmation bias and avoidance of cognitive load are the main reasons hallucinations slip through.

### Cost calculation in the enterprise (illustrative)

In enterprise environments, this trade-off becomes a serious cost issue:

**Cost of acting on a "detailed lie"**:
- Action based on inaccurate info → discovery of error → rework → hours to days lost

**Cost of starting from "honest ignorance"**:
- Investigate accurate info → execute correctly → done in 1-3 hours

"Honest ignorance" is the more efficient path, but psychologically people prefer the "detailed lie."

### How Context Engineering resolves this trade-off

The experiment shows that proper Context Engineering partially resolves the trade-off:

**Full Context Engineering (Sonnet 4)**:
- Factual Accuracy: 4.8/5 (sharp lift)
- Specificity: 4.8/5 (maintained)
- Honesty: 0.8/5 (balanced)

The key is that RAG provides accurate information, so **specific answers no longer have to rely on guessing**.

That's the central value of Context Engineering: **deliver detailed facts, not detailed lies**.

---

## Why hallucination is a "feature," not a "bug"

**Bottom line: Hallucination isn't a defect of the LLM. It's the operating principle of generative AI.**

### How generative AI actually works

A key reframe: **hallucination is not a "bug" of LLMs**. It's a "feature" baked into the design.

Concisely, an LLM operates like this:

1. **Tokenize input text**: convert text into numerical vectors
2. **Pattern recognition**: identify similar patterns in training data
3. **Probability calculation**: compute the probability of the next token
4. **Probabilistic selection**: pick a token based on those probabilities
5. **Text generation**: chain selected tokens into text

That process contains no "fact-checking" or "knowledge boundary recognition." The LLM is, fundamentally, **a sophisticated pattern-based text generator**.

### Perfect recall vs creative reasoning: the dilemma

What if an LLM were designed to "never answer when it doesn't know"?

**Benefits**:
- Hallucinations eliminated
- Factual accuracy lifted sharply
- Reliability improves

**Costs**:
- Loss of creative reasoning
- No new combinatorial insights
- Sharp drop in usefulness

When asked for "new marketing ideas," answers grounded only in known facts won't produce creative or innovative ideas.

### Similarity to human cognition

In a sense, hallucination resembles human cognition:

**Human thinking**:
- Combining known knowledge
- Building hypotheses and guesses
- Creating new insights through analogy
- Judging from incomplete information

**LLM generation**:
- Combining learned patterns
- Probabilistic completion
- Reasoning by similarity
- Generating from incomplete context

The difference: **humans can recognize their own uncertainty**. We naturally say things like "this is a guess" or "I'm not sure but."

### The real value of Context Engineering

That's why Context Engineering matters. It doesn't change the nature of the LLM; **it provides an appropriate information environment to channel its capability in the right direction**.

**Old approach**:
- Tell the LLM "answer correctly"
- Treat hallucination as a "bad feature" to suppress
- Aim for perfection

**Context Engineering approach**:
- Give the LLM the information it needs
- Treat hallucination as a "context-shortage signal"
- Design the balance between practicality and accuracy

---

## Five signs an LLM is lying

A practical skill: spot dangerous hallucinations in LLM responses.

### 1. Excessive specificity in numbers, dates, and proper nouns

**Warning signs**:
- "24-hour expiration"
- "Up to 50 custom roles"
- "v2.1.3 documentation"

**How to verify**:
- Check whether the numbers have grounding
- Cross-reference against actual documentation
- Verify version numbers exist

### 2. Suspiciously perfect organization

**Warning signs**:
- Tidy feature lists
- Detailed explanations with no contradictions
- "Textbook" levels of completeness

**Reality**:
- Real software has constraints and exceptions
- Documentation is incomplete and inconsistent
- Edge cases and known issues exist

### 3. Unnatural use of technical jargon

**Warning signs**:
- Stacking technical terms for an aura of authority
- Inappropriate combinations of real technologies
- Jargon that isn't necessary for the context

### 4. Avoidance of explicit sourcing

**Warning signs**:
- Vague phrasing like "generally," "typically," "basically"
- No reference to specific docs or API references
- "Confirm with the official site" used as deflection

### 5. Answers that match the user's expectations perfectly

**Warning signs**:
- Exactly the response the question implied
- No mention of difficulty or complexity
- No mention of "this isn't possible" or "this is restricted"

## Bridge to the next chapter: organizing the solution

This chapter showed that AI "lying" comes from three inevitable factors:

1. **Technical constraint**: pattern-match-driven fill-in
2. **Design philosophy**: a value system that prioritizes "answering"
3. **The capability paradox**: stronger language ability produces more persuasive lies

There's no need for despair. The experiment showed that proper Context Engineering can substantially improve all three.

The next chapter walks through the history from "prompt engineering" to "Context Engineering" and the science behind it. It will become clear why the answer isn't smarter prompts but designing the entire information environment.

## 🚀 Next Action: Pick three proper nouns or numbers from an AI response and fact-check them

Practice the "lie-spotting" technique:

### Step 1: Ask the AI

Ask detailed questions about a familiar technology or service:
- "What's new in version X?"
- "What are the API rate limits for X?"
- "What are the pricing tiers for X?"

### Step 2: Pick out proper nouns and numbers

Pick three each from the response:
- **Specific numbers**: pricing, limits, version numbers
- **Proper nouns**: feature names, plan names, technology names
- **Dates / time periods**: release date, expiration, update frequency

### Step 3: Fact-check

Confirm against official documentation:
- Are the numbers accurate?
- Are the feature names correct?
- Is the information current?

### Step 4: Analyze the pattern

- What kinds of information generate lies most easily?
- What's the difference between "high-confidence lies" and "low-confidence lies"?
- Are there differences across domains?

### Recording template

```
[Question]

[AI response]

[Information extracted]
Numbers: 1. _____ 2. _____ 3. _____
Proper nouns: 1. _____ 2. _____ 3. _____
Dates: 1. _____ 2. _____ 3. _____

[Fact-check results]
Accurate: ___
Inaccurate: ___
Unknown: ___

[Observations]
```

Through this exercise, you'll get a tactile understanding of the LLM's "plausible lie" patterns. The next chapter walks through the systematic solution.
