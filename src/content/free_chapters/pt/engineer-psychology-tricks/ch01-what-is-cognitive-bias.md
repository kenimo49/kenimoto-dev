---
title: "Capítulo 1: O que é viés cognitivo"
free: true
---

![Capa do capítulo 1](/images/books/engineer-psychology-tricks/psychology-tricks-ch01-hero.png)

Imagine que está comparando duas abordagens técnicas. Olhou as especificações, conferiu os benchmarks, leu o que a comunidade diz. Acha que decidiu de forma racional. Mas, olhando para trás, não acabou se prendendo ao primeiro número que apareceu? Ou colecionou só os argumentos que favoreciam a tecnologia que já gostava?

Isso é viés cognitivo. Mesmo achando que está pensando racionalmente, o cérebro distorce o julgamento sozinho.

## A natureza do viés cognitivo

Viés cognitivo é um desvio sistemático de julgamento causado pelos "atalhos" que o cérebro humano usa para processar informação de forma eficiente. Daniel Kahneman e Amos Tversky sistematizaram o conceito na década de 1970 no artigo "Judgment under Uncertainty: Heuristics and Biases".

A palavra-chave é "sistemático". Viés cognitivo não é erro aleatório. Distorce o julgamento em uma direção previsível. Por isso mesmo, conhecer o padrão permite criar contramedidas.

Hoje a literatura de psicologia registra mais de 200 vieses cognitivos. Não é preciso decorar todos. Este livro recorta cerca de 20 que estão ligados diretamente ao trabalho do engenheiro.

## Por que engenheiros são especialmente vulneráveis

"Mas engenheiros pensam logicamente, não deveriam estar mais protegidos contra vieses?"

Infelizmente é o contrário. Um estudo empírico publicado em 2022 na Communications of the ACM (Chattopadhyay et al.) observou o cotidiano de desenvolvedores de software e analisou de forma sistemática a influência dos vieses cognitivos. Segundo essa pesquisa, há três condições que tornam o engenheiro particularmente suscetível.

**Decisões com alta incerteza são frequentes.** Estimativas, escolhas de design, seleção tecnológica, situações em que a resposta não é conhecida de antemão fazem parte do dia. Quanto maior a incerteza, mais o cérebro recorre à heurística (o atalho intuitivo).

**Pressão de tempo é constante.** Prazo da sprint, data de release, resposta a incidente. Quando não há tempo para deliberar, o cérebro alterna automaticamente para o Sistema 1 (modo intuitivo).

**Excesso de confiança na própria racionalidade.** Justamente por ter treinamento em pensamento lógico, o engenheiro acredita que "não vai cair em viés". Essa crença é, em si, um viés cognitivo chamado bias blind spot (a incapacidade de perceber os próprios vieses).

## Cinco vieses do dia a dia a dia da engenharia

Vamos apresentar cinco vieses representativos entre os que este livro aborda. A explicação detalhada vem nos capítulos posteriores.

### Efeito de ancoragem

A tendência de ficar preso ao primeiro número apresentado. Ouvir "a última vez levou duas semanas" faz a estimativa atual convergir em torno de duas semanas, mesmo que as condições técnicas sejam totalmente diferentes.

### Viés de confirmação

A tendência de coletar só as evidências que apoiam a própria hipótese e ignorar as contrárias. Ao supor "a causa do bug é cache", o engenheiro olha só os logs de cache e perde a anomalia no banco de dados.

### Efeito manada

A tendência de julgar correto aquilo que muitos adotaram. Escolher uma biblioteca por causa do número de estrelas no GitHub é diferente de verificar se ela realmente atende aos requisitos do projeto.

### Efeito Dunning-Kruger

A tendência de quem tem pouca capacidade superestimá-la, enquanto quem tem mais a subestima. Quem nunca terminou um tutorial de linguagem nova achando "já entendi mais ou menos"?

### Falácia do custo afundado

A tendência de ficar preso ao tempo e dinheiro já investidos, perdendo a capacidade de recuar racionalmente. "Esse framework levou três meses, descartar agora é desperdício" baseia a decisão nos custos passados, não nos custos futuros.

![Cinco vieses representativos](/images/books/engineer-psychology-tricks/psychology-tricks-ch01-five-biases.png)
*Cinco vieses representativos abordados neste livro, detalhados na Parte 2 em diante*

## Lado ativo e lado defensivo

Cada capítulo deste livro discute o "ataque" e a "defesa" de vieses cognitivos e técnicas psicológicas.

- **Lado ativo**: ao querer aprovar uma proposta, usar deliberadamente o efeito de ancoragem para apresentar primeiro um número favorável
- **Lado defensivo**: na reunião de estimativa, verificar se o próprio julgamento não está sendo arrastado pelo primeiro número que apareceu

O conhecimento de técnicas psicológicas serve à comunicação melhor, não à manipulação. O objetivo não é explorar o viés alheio, mas reconhecer os vieses dos dois lados, e com isso elevar a qualidade da decisão da equipe como um todo.

## Como ler este livro

Os capítulos foram escritos para que cada um possa ser lido independentemente. Pode começar pelo sumário, pulando para a situação que interessar.

Mesmo assim, recomendamos ler a Parte 1 (capítulos 1 a 3) primeiro, pois ela serve de base para o resto. O quadro Sistema 1 / Sistema 2 em especial é referenciado várias vezes nos capítulos seguintes.
