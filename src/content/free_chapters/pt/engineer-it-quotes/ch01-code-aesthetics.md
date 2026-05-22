---
title: "Capítulo 1: A Estética do Código"
---

![Capítulo 1: A Estética do Código](/images/books/engineer-it-quotes/engineer-it-quotes-opener-ch01.png)

O que é código bonito? A resposta a essa pergunta tem sido notavelmente consistente por mais de meio século. É simples. Leva em conta a pessoa que vai ler. E sua intenção transparece mesmo quando o autor já se foi há tempos. Este capítulo apresenta dez frases sobre a beleza do código.

---

## 01. "Simplicity is prerequisite for reliability."

-- Edsger W. Dijkstra, EWD498 "How do we tell truths that might hurt?" (1975)

### Contexto

Num memorando de 1975, Dijkstra apontou de forma direta os problemas no ensino de programação e na indústria. Nele, condensou o que é necessário pra construir software confiável nessa única frase. Foi também a pessoa que propôs o conceito de "the humble programmer" na palestra do Turing Award (1972).

### Análise SUCCESs

- **S (Simple)**: Comprime a cadeia causal "simplicidade leva a confiabilidade" em uma frase
- **Cr (Credible)**: Sustentado pelo histórico de Dijkstra de estabelecer programação estruturada
- **C (Concrete)**: A palavra "prerequisite" deixa claro que simplicidade é condição necessária pra confiabilidade -- não opcional

### Aplicação Prática

O hábito de se perguntar "isso é realmente necessário?" toda vez que você adiciona uma feature está capturado nessa única frase. Complexidade não é feature; é dívida. Conseguir dizer num code review, "Dá pra simplificar?" é o primeiro passo rumo à confiabilidade. (-> Capítulo 3 #23 "Keep it simple, stupid.", #24 "You aren't gonna need it.")

![#01 Simplicity is prerequisite for reliability](/images/books/engineer-it-quotes/engineer-it-quotes-q01.png)

---

## 02. "Programs are meant to be read by humans and only incidentally for computers to execute."

-- Harold Abelson & Gerald Jay Sussman, *Structure and Interpretation of Computer Programs* (1985)

### Contexto

Essas palavras aparecem perto do começo de SICP (apelidado de "o livro do mago"), um livro-texto lendário de ciência da computação no MIT. O livro usa LISP pra ensinar os fundamentos da programação e propôs a ideia de que código não é instrução pra máquina, é meio de comunicação entre humanos.

### Análise SUCCESs

- **U (Unexpected)**: Vira de cabeça pra baixo a suposição de que o público primário de um programa é o computador
- **C (Concrete)**: Contrasta com os verbos específicos "read" e "execute"
- **Cr (Credible)**: De um livro-texto que serviu como introdução à ciência da computação no MIT por décadas
- **E (Emotional)**: A palavra "incidentally" age como provocação silenciosa contra as prioridades cotidianas dos programadores

### Aplicação Prática

Nomeie sua variável como `elapsedDays` em vez de `d`. Escreva comentários sobre "por que" em vez de "o que." Tudo começa nesse princípio. A pergunta na hora de escrever código não é "o computador entende isso?" e sim "eu vou entender isso daqui a seis meses?" (-> Capítulo 9 #81 "The hottest new programming language is English.")

> **Nota:** A legibilidade do código não é luxo -- é o próprio alicerce de software confiável.

---

## 03. "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."

-- Martin Fowler (Kent Beck), *Refactoring: Improving the Design of Existing Code* (1999)

### Contexto

Essa frase aparece no clássico *Refactoring* de Martin Fowler e surgiu da colaboração dele com Kent Beck. Refatorar significa melhorar a estrutura interna de um programa sem mudar seu comportamento externo. Essa frase declara que o propósito é melhorar a legibilidade pra humanos.

### Análise SUCCESs

- **S (Simple)**: O contraste entre "fool" e "good programmer" deixa a estrutura nítida
- **U (Unexpected)**: Uma provocação que descarta "código que o computador entende" como algo que qualquer um faz

### Aplicação Prática

O momento em que o código que funciona compila não é a linha de chegada -- é a linha de partida. Antes de abrir um pull request, se pergunte: "Alguém vendo esse código pela primeira vez entenderia?" Esse passo a mais muda a produtividade do time inteiro.

Senti essa frase na pele num code review. Eu achava que minha lógica de transformação de dados estava "limpa," mas um revisor comentou: "Levei 15 minutos pra descobrir o que isso faz." A lógica estava certa. Os testes passavam. Mas se leva 15 minutos pra entender, é passivo pro time. A partir desse dia, comecei a fechar a tela antes de mandar o PR e reler meu próprio código com olhos novos cinco minutos depois. (-> Capítulo 7 #66 "Code is like humor.")

---

## 04. "UNIX is simple. It just takes a genius to understand its simplicity."

-- Dennis Ritchie

### Contexto

Essas palavras vêm de Ritchie, co-criador de C e UNIX. A filosofia de design do UNIX é "combine programas pequenos, cada um fazendo uma coisa bem feita." Por trás do que parece uma abordagem direta há camadas e camadas de decisões de design profundas. Ritchie chama esse design de "simple" enquanto reconhece que realmente entendê-lo não é fácil.

### Análise SUCCESs

- **U (Unexpected)**: O par contraditório de "simple" e "takes a genius" gruda na memória
- **Cr (Credible)**: Dito por quem realmente construiu o UNIX

### Aplicação Prática

Design simples não é "cortar caminho" -- é o resultado do julgamento de design mais avançado. Implementar um problema complexo de forma complexa é fácil. A parte realmente difícil é tirar a complexidade.

---

## 05. "One of my most productive days was throwing away 1000 lines of code."

-- Ken Thompson

### Contexto

Essas palavras vêm de Thompson, co-criador do UNIX. São uma refutação silenciosa à cultura de medir a produtividade do programador por linhas escritas. Thompson recebeu o Prêmio Turing e mais tarde contribuiu pro design do Go. Ao longo da carreira, a postura de "corte o que é desnecessário" foi consistente.

### Análise SUCCESs

- **U (Unexpected)**: O paradoxo de "produtivo" e "jogou fora." Normalmente, um dia produtivo é um dia em que você escreve muito
- **C (Concrete)**: O número específico "1000 linhas"

### Aplicação Prática

A quantidade de código não é o valor. Se você consegue alcançar a mesma funcionalidade com menos código, é uma solução melhor. Se uma refatoração reduz o número de linhas, isso é progresso.

Certa vez, fui responsável por um módulo utilitário de autenticação num projeto. Depois de três semanas de implementação -- cerca de 800 linhas -- um colega de time notou que dava pra substituir tudo por uma mudança de config numa biblioteca existente. Honestamente, eu resisti no começo. Jogar fora três semanas de esforço doía. Mas no momento em que deletei, a complexidade dos testes caiu pela metade e o tempo de build do CI ficou mais curto. Entendi na prática o que Thompson quer dizer com "dia produtivo." (-> Capítulo 3 #29 "The best code is no code at all.")

![#05 One of my most productive days was throwing away 1000 lines of code](/images/books/engineer-it-quotes/engineer-it-quotes-q05.png)

---

## 06. "Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it."

-- Edsger W. Dijkstra, EWD896 "On the nature of Computing Science" (1984)

### Contexto

Dijkstra defendeu repetidamente o valor da simplicidade, mas nesse memorando de 1984 foi além, pra "a dificuldade da própria simplicidade." Não é só difícil escrever código simples -- reconhecer o valor de código simples requer educação. Uma observação de dois gumes.

### Análise SUCCESs

- **U (Unexpected)**: Coloca você de frente com o fato de que "simplicity" não é sinônimo de "easy"
- **E (Emotional)**: Ressoa com qualquer um que já sentiu que o esforço pra escrever código simples não foi reconhecido

### Aplicação Prática

Você mandou código simples e ouviram "se esforce mais." Você explicou um design complexo e foi elogiado. Se você passou por isso, lembre da frase de Dijkstra. Se a cultura recompensa complexidade, isso é um problema de educação dentro do time.

---

## 07. "I hope to see Ruby help every programmer in the world to be productive, and to enjoy programming, and to be happy."

-- Yukihiro Matsumoto (Matz)

### Contexto

Matz, o criador do Ruby, colocou consistentemente a "felicidade do programador" no centro dos princípios de design. Antes do Ruby, as linguagens de programação mainstream priorizavam velocidade de execução ou segurança de tipos. Uma linguagem que usava "o programador está feliz?" como critério de design era heresia na época.

### Análise SUCCESs

- **E (Emotional)**: Define "happy" como meta em vez de eficiência técnica. Fala direto ao coração dos engenheiros

### Aplicação Prática

Na hora de escolher ferramenta, é perfeitamente OK considerar "essa ferramenta é gostosa de usar?" junto com pontuação em benchmark. Experiência de desenvolvimento (DX) não é luxo -- afeta diretamente a produtividade de longo prazo.

---

## 08. "The principle of least surprise means principle of least MY surprise."

-- Yukihiro Matsumoto (Matz), Artima Developer (2003)

### Contexto

O "Principle of Least Surprise" (POLS) é frequentemente citado como princípio de design do Ruby. Numa entrevista, Matz esclareceu que esse princípio não significa "menor surpresa pra todo mundo" e sim "menor surpresa pra mim, o designer da linguagem." Ou seja, o Ruby mira ser intuitivo pra quem aprendeu bem -- não precisa ser intuitivo pra todo novato.

### Análise SUCCESs

- **Cr (Credible)**: Uma decisão de design da pessoa que realmente desenhou o Ruby

### Aplicação Prática

Na hora de desenhar API ou biblioteca, é importante ser claro sobre "intuitivo pra quem." Nenhuma interface é intuitiva pra todos. Decidir um usuário-alvo e perseguir consistência pra esse grupo tende a produzir um design melhor no fim.

---

## 09. "Elegance is not a dispensable luxury but a quality that decides between success and failure."

-- Edsger W. Dijkstra

### Contexto

Pra Dijkstra, elegância não era sobre beleza visual e sim clareza estrutural. Código elegante é mais fácil de entender, mais fácil de debugar, mais fácil de estender. Afeta diretamente velocidade de desenvolvimento e custo de manutenção -- é uma qualidade prática.

### Análise SUCCESs

- **U (Unexpected)**: Redefine "elegance" de "luxury" pra "o fator que decide sucesso ou fracasso"
- **S (Simple)**: Contrastes binários (luxury vs. necessity, success vs. failure) deixam a estrutura clara

### Aplicação Prática

Código que "só funciona" parece rápido no curto prazo. Mas a dor de cada mudança seguinte é o preço de negligenciar a elegância. Dizer "vamos deixar isso mais limpo" num code review não é puxar gosto estético -- é aumentar as chances de sucesso do projeto.

![#09 Elegance is not a dispensable luxury](/images/books/engineer-it-quotes/engineer-it-quotes-q09.png)

---

## 10. "Science is what we understand well enough to explain to a computer. Art is everything else we do."

-- Donald Knuth, Foreword to *A=B* (1996)

### Contexto

Como o título de *The Art of Computer Programming (TAOCP)* sugere, Knuth posicionou programação como "art" (um ofício). Essa frase traça a fronteira entre ciência e arte em "se você consegue explicar isso pra um computador." Ou seja, sempre existe um domínio da programação que resiste à formalização. Esse domínio é a "art."

### Análise SUCCESs

- **S (Simple)**: Comprime um debate complexo numa dicotomia science/art
- **C (Concrete)**: "Você consegue explicar pra um computador?" é um teste claro

### Aplicação Prática

Muitas decisões de design caem no domínio de "art," não "science." Existem qualidades de bom e ruim que nenhum benchmark mede. Ganhar experiência significa melhorar sua precisão nesse lado "artístico" das coisas. (-> Capítulo 9 #82 "I'm mostly programming in English now")
