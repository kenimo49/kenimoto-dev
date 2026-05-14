---
title: "Chapter 2: The Philosophy of Bugs and Failure"
---

# Chapter 2: The Philosophy of Bugs and Failure


Anyone who thinks software has no bugs has never written software. The words in this chapter don't teach you to fear failure -- they teach you how to live with it.

---

## 11. "Testing shows the presence, not the absence of bugs."

-- Edsger W. Dijkstra, NATO Software Engineering Conference (1969)

### Background

The 1968-69 NATO Software Engineering Conferences were a historic forum where the "software crisis" was debated. Dijkstra used a single sentence to capture the fundamental limitation of testing. Even if tests pass a hundred times, you can't claim there are zero bugs. This recognition laid the theoretical groundwork for why test-driven development and formal verification matter.

### SUCCESs Analysis

- **U (Unexpected)**: A surprising truth for anyone who assumed testing "guarantees safety"
- **S (Simple)**: The presence/absence contrast makes it instantly understandable
- **Cr (Credible)**: The historical weight of Dijkstra, a pioneer of formal verification, pointing out testing's limits in 1969
- **C (Concrete)**: The logically precise contrast between "presence" and "absence" grounds what could be an abstract discussion about testing

### Takeaway

Don't let 100% test coverage make you complacent. Tests are tools for reducing risk, not certificates that guarantee quality. Instead of "the tests pass, so we're fine," think "what problems can't these tests catch?" That shift in thinking is the first step toward building solid systems. (-> Chapter 7 #61 "The only way to go fast is to go well.")


---

## 12. "Beware of bugs in the above code; I have only proved it correct, not tried it."

-- Donald Knuth, Notes on the van Emde Boas construction of priority deques (1977)

### Background

Knuth appended this sentence to the end of a memo, showing self-aware humor about the limits of formal proof. Even if you can mathematically prove something correct, you won't find implementation bugs until you actually run it. The world's greatest computer scientist acknowledging the gap between theory and practice.

### SUCCESs Analysis

- **U (Unexpected)**: The contradiction of "proved it" yet "haven't tried it" is funny
- **Cr (Credible)**: It carries weight precisely because Knuth said it about his own code

### Takeaway

Confirming theoretical correctness during code review is important. But it's no substitute for actually running the code. If you've ever said "the logic should be right, though..." remember that even Knuth acknowledged falling into the same trap.

---

## 13. "It's easier to ask forgiveness than it is to get permission."

-- Grace Hopper

### Background

These words come from Grace Hopper, a rear admiral in the U.S. Navy who contributed to the development of COBOL. She's also known for the anecdote of discovering "the first bug" (a moth caught in a relay that she documented). Originally, this quote was a survival tactic for driving change within bureaucratic organizations. In a technical context, it's widely cited to justify the approach of "try first, deal with problems later."

### SUCCESs Analysis

- **U (Unexpected)**: A military rear admiral saying "it's okay to break the rules"
- **E (Emotional)**: Resonates with the universal frustration of "I want to do something but can't get approval"

### Takeaway

Introducing a new tool, proposing test automation, improving architecture -- waiting for the approval process means nothing gets started. Building a small prototype and showing results is more persuasive than writing a hundred-page proposal. That said, doing this in production is a different story.

---

## 14. "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."

-- Brian Kernighan, *The Elements of Programming Style* (1978)

### Background

Kernighan is known as the co-author of *The C Programming Language* (K&R). This quote comes from his book with Plauger, *The Elements of Programming Style*. It cautions against writing clever code and logically derives the case that simpler code is easier to maintain.

### SUCCESs Analysis

- **S (Simple)**: "Writing = difficulty X, debugging = 2X, therefore..." -- arithmetic structure
- **U (Unexpected)**: The paradox that "the ability to write clever code" works against you
- **C (Concrete)**: The specific multiplier "twice" aids intuitive understanding
- **Cr (Credible)**: A claim grounded in practice, from the co-author of the C language bible known as K&R

### Takeaway

If someone says "I can't figure out what this does" in a code review, that's not a failure of the reviewer's skill. Code that its own author can't debug is a ticking time bomb for the team.

When I was starting out, a senior colleague had a one-liner combining nested ternary operators with bitwise operations. I assumed there was a performance reason. When a production bug hit that line, I investigated and found the only motivation was "I wanted to write it short." Debugging took a full day. The fix was five straightforward if-statements. The moment both readability and correctness improved, I felt the meaning of Kernighan's "twice" in my bones. (-> Chapter 1 #03 "Good programmers write code that humans can understand.")


> **Note:** Every bug has something to teach you -- but only if you stop and listen.

---

## 15. "The most dangerous phrase in the language is, 'We've always done it this way.'"

-- Grace Hopper (attributed; similar statements confirmed, but the exact wording lacks a verified primary source)

### Background

Widely attributed to Hopper, though Wikiquote notes it as an "unsourced variant." It is confirmed that she made statements of similar intent, and there are records of her saying in interviews: "Go ahead and do it. You can always apologize later." This quote also serves as a textbook example of attribution problems with famous sayings.

### SUCCESs Analysis

- **E (Emotional)**: Hits directly at the feelings of anyone who has felt trapped by old ways
- **S (Simple)**: The impact of the flat-out declaration "the most dangerous phrase"

### Takeaway

When you ask "why is it this way?" while maintaining legacy code and the answer is "it's always been this way," that's not really an answer. Designs that persist without reason are breeding grounds for technical debt. At the same time, the fact that this quote's own attribution is uncertain teaches us the importance of verifying sources when citing famous words.

---

## 16. "Shipping first time code is like going into debt."

-- Ward Cunningham

### Background

Ward Cunningham coined the metaphor of "technical debt." He's also the inventor of the wiki (WikiWikiWeb). By comparing code quality to financial debt, he made it possible to explain technical problems to non-engineer executives. Debt itself isn't bad. The problem is when you never pay it back and only the interest keeps growing.

### SUCCESs Analysis

- **C (Concrete)**: Maps the abstract concept of "code quality" to the familiar concept of "debt"
- **Cr (Credible)**: Cunningham's track record as a pioneer of wiki and XP

### Takeaway

Getting technical debt to zero isn't realistic. What matters is being aware that you're deliberately carrying debt, and having a repayment plan. Teams that put "which debts do we pay down this sprint?" on their retrospective agenda are strong teams.

I once proposed "technical debt paydown" during a sprint planning meeting, and the product owner asked, "Is this an improvement users can see?" I used Cunningham's debt metaphor directly: "Our current codebase is carrying debt at about 20% annual interest. Every new feature we add increases the interest, and in three months, our feature development velocity will be cut in half." The numbers were rough estimates, but the words "debt" and "interest" translated a technical problem into business language on the spot. That week, two days of engineering time were allocated to refactoring. (-> Chapter 7 #68 "We will meet our schedules by knowing that the only way to go fast is to go well.")

---

## 17. "Move fast and break things."

-- Mark Zuckerberg, Facebook internal motto (circa 2009-2014)

### Background

Famous as Facebook's early internal motto. It spread widely as a symbol of startup speed, but Facebook itself changed it to "Move fast with stable infrastructure" in 2014. In other words, this quote is instructive precisely because its limitations are part of the lesson.

### SUCCESs Analysis

- **S (Simple)**: Four words. You can't make it shorter
- **U (Unexpected)**: The boldness of affirming "breaking things"

### Takeaway

What's interesting about this quote is that its validity depends on the phase. During prototyping, it's correct. But for a product with hundreds of millions of users, the cost of breaking things is catastrophic. The fact that Facebook itself revised the motto is perhaps the biggest lesson. (-> Chapter 5 #46 "Move fast with stable infrastructure.")


---

## 18. "Fail fast, fail often, fail forward."

-- Silicon Valley maxim (difficult to attribute to a specific individual)

### Background

A phrase that epitomizes Silicon Valley culture, though attributing it to a specific person is difficult. It's also known as the title of a John C. Maxwell book (2007). It expresses the core of startup culture -- "failure is a learning opportunity" -- but is sometimes misused to justify reckless failure.

### SUCCESs Analysis

- **S (Simple)**: The refrain of three "fails" (with alliteration) makes it stick

### Takeaway

Failure itself has no value -- the value is in what you learn from failure. The "fail forward" part matters most. Repeating the same failure is "fail backward." In teams without a postmortem culture, this quote remains an empty slogan.

---

## 19. "First, solve the problem. Then, write the code."

-- John Johnson

### Background

Widely quoted among programmers, though the detailed biography of John Johnson is unclear. But this quote's value lies in its content, not its attribution. Understand the problem before reaching for the keyboard. Design the solution in your head. Only then write code. One sentence captures that process.

### SUCCESs Analysis

- **C (Concrete)**: The contrast between the specific verbs "solve" and "write"

### Takeaway

Stand at the whiteboard before opening your IDE. Confirm the requirements before writing tests. If you start implementing while what you're building is still vague, the cost of rework grows exponentially.

---

## 20. "The amateur software engineer is always in search of magic."

-- Grady Booch

### Background

These words come from Grady Booch, one of the creators of UML (Unified Modeling Language). A new framework, a new language, a new methodology -- the illusion that one "silver bullet" will solve everything is what Booch calls "magic." It's in the same lineage as Fred Brooks' "No Silver Bullet." (-> Chapter 4 #35 "No Silver Bullet.")

### SUCCESs Analysis

- **C (Concrete)**: The vivid image of "magic"
- **Cr (Credible)**: The authority of a UML designer and software engineering leader

### Takeaway

Jumping on every new technology that comes along is fun, but silver bullets don't exist. It's not the tool that solves the problem -- it's the judgment of the person using the tool. What matters in technology selection is not "what can it do?" but "does it fit our problem?"
