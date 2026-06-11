---
title: "Disseram que 'inglês é a nova linguagem de programação'. Passei 3 meses programando assim, e ainda preciso saber programar."
description: "Karpathy diz que o inglês é a nova linguagem de programação. Andrew Ng discorda. Passei três meses programando assim e tenho números pra dizer quem está certo."
date: 2026-06-12
lang: pt
tags: [ia, carreira, vibecoding, programacao]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/ingles-nao-e-a-nova-linguagem-de-programacao/"
og_image: "https://kenimoto.dev/images/blog/ingles-nao-e-a-nova-linguagem-de-programacao/og-pt.png"
cross_posted_to: []
---

Tem uma frase do Andrej Karpathy que virou bordão: ["The hottest new programming language is English"](https://x.com/karpathy/status/1617979122625712128). A linguagem de programação mais quente agora é o inglês. Eu li isso umas trinta vezes no feed, sempre com alguém abaixo comemorando que não precisa mais aprender a programar. Resolvi levar a sério e testar: passei três meses programando quase só dando ordens em inglês para a IA.

Spoiler: a frase do Karpathy é meia-verdade. E a metade que sobra é justamente a parte que ninguém quer ouvir.

## O teste, com número de verdade

Não dá pra discutir isso no campo da vibe. Então eu anotei. Durante três meses, num projeto pessoal real (um stack de voice AI, com testes e PRs de verdade), eu marcava cada tarefa: ela terminou só com instrução em inglês, ou em algum momento eu precisei abrir o código e meter a mão?

O resultado, arredondado pra eu não fingir precisão que não tenho:

- Cerca de **70% das tarefas** terminaram só na conversa. Descrevi o que queria em inglês, a IA escreveu, os testes passaram, fim.
- Os outros **30%** me obrigaram a abrir o arquivo e ler o código linha por linha.

Setenta por cento parece uma vitória esmagadora pro time do "inglês é a nova linguagem". Até você olhar **quais** 30% sobraram.

![Em 3 meses de desenvolvimento por instrução em inglês, 70% das tarefas terminaram só na conversa, mas os 30% restantes eram justamente os bugs sutis, decisões de arquitetura e integrações frágeis](/images/blog/ingles-nao-e-a-nova-linguagem-de-programacao/70-30-tarefas.png)

## Os 30% eram os 30% que importavam

Os 70% fáceis eram CRUD, scaffolding, um endpoint novo igual aos outros dez, ajustar um teste. Trabalho que eu faria de olho fechado, só que mais rápido. Maravilha.

Os 30% que me forçaram a ler código eram: um bug de concorrência que só aparecia sob carga, uma decisão de arquitetura onde a IA propôs três caminhos e todos os três tinham uma armadilha diferente, uma latência de 40ms que vazava de um lugar que nenhuma descrição em inglês ia adivinhar. Ou seja: exatamente as tarefas pelas quais alguém me paga.

A IA escreve o trecho chato. Mas decidir **qual** trecho ela deveria escrever, e perceber quando o que ela escreveu está sutilmente errado, continua sendo trabalho de quem sabe ler código. Karpathy mesmo deu nome a esse problema: ["jagged intelligence"](https://en.wikipedia.org/wiki/Vibe_coding), a inteligência serrilhada. O modelo resume um paper como um PhD e na linha seguinte erra uma conta de criança. Você só percebe o erro de criança se souber a conta.

## O outro lado da frase: Andrew Ng

Aí entra a contra-frase. O Andrew Ng, que dirigiu IA no Google e no Baidu e fundou a DeepLearning.AI, disse que afirmar que aprender a programar é desnecessário por causa da IA é [um dos piores conselhos de carreira já dados](https://www.deeplearning.ai/the-batch/coding-skill-is-more-valuable-than-ever/).

E ele não está sendo nostálgico. O argumento é matemático: quanto mais a IA derruba a barreira de entrada da programação, mais valioso fica quem sabe programar, porque o teto de produtividade de quem sabe sobe junto com a ferramenta. A imagem dele é boa demais pra eu não roubar: quem é bilíngue, fala inglês como primeira língua e Python como segunda, faz muito mais do que quem só sabe dar prompt.

Repara que os dois não estão se contradizendo de verdade. Karpathy diz que a interface mudou. Ng diz que a competência por baixo da interface continua valendo. Os meus três meses concordam com os dois ao mesmo tempo: o inglês virou a **interface**, mas ler e escrever código virou a **habilidade de revisão**, e revisar ficou mais importante, não menos.

## Vibe coding é ótimo até a segunda-feira

Teve uma fase em que eu me empolguei e fui de vibe coding puro: aceitava tudo que a IA sugeria, sem ler o diff. Em duas horas tinha um protótipo rodando. Me senti um gênio.

Na segunda-feira seguinte fui adicionar uma funcionalidade e descobri que eu não fazia a menor ideia de como aquela base de código funcionava, porque, tecnicamente, eu não tinha escrito nenhuma linha dela. Gastei meio dia lendo o que eu mesmo (a IA) tinha feito. O próprio Ng já alfinetou o termo "vibe coding" por passar a impressão errada de que engenheiro de verdade trabalha no feeling. Protótipo? Pode ir na vibe. Código que vai ter continuação na semana seguinte? Aí a conta chega.

## Um parêntese pra quem está começando agora no Brasil

Eu sei o efeito que essa frase do Karpathy tem em quem está tentando entrar na área agora, com o mercado júnior do jeito que está, cheio de vaga pedindo sênior e thread no LinkedIn dizendo que a IA vai substituir o estágio. Dá um frio na barriga ler que "não precisa mais aprender a programar".

Pela minha experiência de três meses, o conselho é o oposto: aprenda a programar justamente pra poder revisar a IA. O profissional que a IA torna obsoleto não é o que sabe código, é o que só sabe dar prompt e não consegue julgar se a resposta presta. Saber ler código deixou de ser o trabalho inteiro e virou o seu superpoder de controle de qualidade.

## Resumo

- O inglês virou a interface de programação, isso é real. Uns 70% das minhas tarefas terminaram só na conversa.
- Mas os 30% que sobraram eram os difíceis, os que pagam a conta, e exigiram ler código de verdade.
- Karpathy e Ng não se contradizem: a interface mudou, a competência por baixo dela ficou mais valiosa.
- Vibe coding é excelente pra protótipo e perigoso pra qualquer coisa que tenha segunda-feira.
- Se você está começando agora: aprenda a programar pra revisar a máquina, não pra competir com ela na digitação.

"Inglês é a nova linguagem de programação" é uma frase boa demais pra ser inteira verdade. A linguagem mudou. Saber programar, não.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
