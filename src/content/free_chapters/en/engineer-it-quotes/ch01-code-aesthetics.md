---
title: "Chapter 1: The Aesthetics of Code"
---

# Chapter 1: The Aesthetics of Code


What is beautiful code? The answer to this question has been remarkably consistent for over half a century. It is simple. It considers the person reading it. And its intent comes through even when the author is long gone. This chapter presents ten quotes about the beauty of code.

---

## 01. "Simplicity is prerequisite for reliability."

-- Edsger W. Dijkstra, EWD498 "How do we tell truths that might hurt?" (1975)

### Background

In a 1975 memo, Dijkstra bluntly pointed out problems in programming education and the industry. In it, he condensed what's needed to build reliable software into this single sentence. He was also the person who proposed the concept of "the humble programmer" in his Turing Award lecture (1972).

### SUCCESs Analysis

- **S (Simple)**: Compresses the causal chain "simplicity leads to reliability" into one sentence
- **Cr (Credible)**: Backed by Dijkstra's track record of establishing structured programming
- **C (Concrete)**: The word "prerequisite" makes clear that simplicity is a necessary condition for reliability -- not optional

### Takeaway

The habit of asking "is this really necessary?" every time you add a feature is captured in this one sentence. Complexity is not a feature; it's debt. Being able to say in a code review, "Can we make this simpler?" is the first step toward reliability. (-> Chapter 3 #23 "Keep it simple, stupid.", #24 "You aren't gonna need it.")


---

## 02. "Programs are meant to be read by humans and only incidentally for computers to execute."

-- Harold Abelson & Gerald Jay Sussman, *Structure and Interpretation of Computer Programs* (1985)

### Background

These words appear near the beginning of SICP (nicknamed "the wizard book"), a legendary textbook for computer science at MIT. The book uses LISP to teach the fundamentals of programming and put forward the idea that code is not instructions to a machine but a means of communication between humans.

### SUCCESs Analysis

- **U (Unexpected)**: Overturns the assumption that a program's primary audience is the computer
- **C (Concrete)**: Contrasts with the specific verbs "read" and "execute"
- **Cr (Credible)**: From a textbook that served as MIT's introduction to computer science for decades
- **E (Emotional)**: The word "incidentally" acts as a quiet provocation against the everyday priorities of programmers

### Takeaway

Name your variable `elapsedDays` instead of `d`. Write comments about "why" instead of "what." Everything starts from this principle. The question when writing code is not "can the computer understand this?" but "will I understand this six months from now?" (-> Chapter 9 #81 "The hottest new programming language is English.")

> **Note:** Code readability is not a luxury -- it is the very foundation of reliable software.

---

## 03. "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."

-- Martin Fowler (Kent Beck), *Refactoring: Improving the Design of Existing Code* (1999)

### Background

This quote appears in Martin Fowler's classic *Refactoring* and emerged from his collaboration with Kent Beck. Refactoring means improving a program's internal structure without changing its external behavior. This sentence declares that its purpose is to improve readability for humans.

### SUCCESs Analysis

- **S (Simple)**: The contrast between "fool" and "good programmer" makes the structure crisp
- **U (Unexpected)**: A provocation that dismisses "code a computer can understand" as something anyone can do

### Takeaway

The moment working code compiles is not the finish line -- it's the starting line. Before submitting a pull request, ask yourself: "Could someone seeing this code for the first time understand it?" That one extra step changes the productivity of an entire team.

I felt this quote viscerally during a code review. I'd thought my data-transformation logic was "cleanly written," but a reviewer commented: "It took me 15 minutes to figure out what this does." The logic was correct. The tests passed. But if it takes 15 minutes to understand, it's a liability for the team. From that day on, I started closing my screen before submitting a PR, then re-reading my own code with fresh eyes five minutes later. (-> Chapter 7 #66 "Code is like humor.")

---

## 04. "UNIX is simple. It just takes a genius to understand its simplicity."

-- Dennis Ritchie

### Background

These words come from Ritchie, co-creator of C and UNIX. The UNIX design philosophy is "combine small programs that each do one thing well." Behind what looks like a straightforward approach lies layer upon layer of deep design decisions. Ritchie calls that design "simple" while acknowledging that truly understanding it is not easy.

### SUCCESs Analysis

- **U (Unexpected)**: The contradictory pairing of "simple" and "takes a genius" sticks in your memory
- **Cr (Credible)**: Spoken by someone who actually built UNIX

### Takeaway

Simple design is not "cutting corners" -- it is the result of the most advanced design judgment. Implementing a complex problem in a complex way is easy. The truly hard part is stripping away the complexity.

---

## 05. "One of my most productive days was throwing away 1000 lines of code."

-- Ken Thompson

### Background

These words come from Thompson, co-creator of UNIX. They're a quiet rebuttal to the culture of measuring programmer productivity by lines written. Thompson is a Turing Award recipient who later contributed to the design of Go. Throughout his career, the stance of "cut what's unnecessary" has been consistent.

### SUCCESs Analysis

- **U (Unexpected)**: The paradox of "productive" and "threw away." Normally, a productive day means you wrote a lot
- **C (Concrete)**: The specific number "1000 lines"

### Takeaway

The amount of code is not the value. If you can achieve the same functionality with less code, that's a better solution. If a refactoring reduces the line count, that's progress.

I once owned an authentication utility module on a project. After three weeks of implementation -- about 800 lines -- a teammate noticed the whole thing could be replaced by a config change in an existing library. Honestly, I resisted at first. Throwing away three weeks of effort felt painful. But the moment I deleted it, test complexity dropped by half and CI build times got shorter. I understood firsthand what Thompson means by a "productive day." (-> Chapter 3 #29 "The best code is no code at all.")


---

## 06. "Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it."

-- Edsger W. Dijkstra, EWD896 "On the nature of Computing Science" (1984)

### Background

Dijkstra repeatedly championed the value of simplicity, but in this 1984 memo he went further into "the difficulty of simplicity itself." It's not just hard to write simple code -- recognizing the value of simple code itself requires education. A double-edged observation.

### SUCCESs Analysis

- **U (Unexpected)**: Confronts you with the fact that "simplicity" is not a synonym for "easy"
- **E (Emotional)**: Resonates with anyone who has felt their effort toward simple code went unappreciated

### Takeaway

You submitted simple code and were told to "try harder." You explained a complex design and got praised. If you've had those experiences, remember Dijkstra's words. If a culture rewards complexity, that's an education problem within the team.

---

## 07. "I hope to see Ruby help every programmer in the world to be productive, and to enjoy programming, and to be happy."

-- Yukihiro Matsumoto (Matz)

### Background

Matz, the creator of Ruby, has consistently placed "programmer happiness" at the center of his design principles. Before Ruby, mainstream programming languages prioritized execution speed or type safety. A language that used "is the programmer happy?" as a design criterion was heretical at the time.

### SUCCESs Analysis

- **E (Emotional)**: Sets "happy" as the goal rather than technical efficiency. Speaks directly to the hearts of engineers

### Takeaway

When choosing tools, it's perfectly fine to factor in "is this tool enjoyable to use?" alongside benchmark scores. Developer experience (DX) is not a luxury -- it directly affects long-term productivity.

---

## 08. "The principle of least surprise means principle of least MY surprise."

-- Yukihiro Matsumoto (Matz), Artima Developer (2003)

### Background

The "Principle of Least Surprise" (POLS) is often cited as a Ruby design principle. In an interview, Matz clarified that this principle doesn't mean "least surprise for everyone" but "least surprise for me, the language designer." In other words, Ruby aims to be intuitive for people who have learned it well -- it doesn't need to be intuitive for every newcomer.

### SUCCESs Analysis

- **Cr (Credible)**: A design decision from the person who actually designed Ruby

### Takeaway

When designing APIs or libraries, it's important to be clear about "intuitive for whom." No interface is intuitive for everyone. Deciding on a target user and pursuing consistency for that group tends to produce better design in the end.

---

## 09. "Elegance is not a dispensable luxury but a quality that decides between success and failure."

-- Edsger W. Dijkstra

### Background

For Dijkstra, elegance was not about visual beauty but structural clarity. Elegant code is easier to understand, easier to debug, and easier to extend. It directly affects development speed and maintenance cost -- it is a practical quality.

### SUCCESs Analysis

- **U (Unexpected)**: Redefines "elegance" from a "luxury" to "the factor that decides success or failure"
- **S (Simple)**: Binary contrasts (luxury vs. necessity, success vs. failure) make the structure clear

### Takeaway

Code that "just works" looks fast in the short term. But the pain of every subsequent change is the price of neglecting elegance. Saying "let's make this cleaner" in a code review isn't pushing aesthetic taste -- it's raising the project's odds of success.


---

## 10. "Science is what we understand well enough to explain to a computer. Art is everything else we do."

-- Donald Knuth, Foreword to *A=B* (1996)

### Background

As the title of *The Art of Computer Programming (TAOCP)* suggests, Knuth has positioned programming as an "art" (a craft). This quote draws the boundary between science and art at "whether you can explain it to a computer." In other words, there is always a domain of programming that resists formalization. That domain is the "art."

### SUCCESs Analysis

- **S (Simple)**: Compresses a complex debate into a science/art dichotomy
- **C (Concrete)**: "Can you explain it to a computer?" is a clear test

### Takeaway

Many design decisions fall in the domain of "art," not "science." There are qualities of good and bad that no benchmark can measure. Gaining experience means improving your accuracy in this "art" side of things. (-> Chapter 9 #82 "I'm mostly programming in English now")
