---
title: "Estimei 47 tarefas em 6 meses: a regra do x2 que eu parei de negar"
description: "Minha estimativa errava sempre para o mesmo lado. Anotei 47 tarefas durante 6 meses e o número saiu feio: na mediana, o real foi quase o dobro do estimado. Não é falta de competência. É como o cérebro foi montado."
date: 2026-06-08
lang: pt
tags: [estimativa, produtividade, engenharia-de-software, carreira, planning-fallacy]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/estimativa-x2-47-tarefas"
og_image: "https://kenimoto.dev/images/blog/estimativa-x2-47-tarefas/og-pt.png"
cross_posted_to: []
---

Por anos eu acreditei que minha estimativa ia melhorar com experiência. A lógica parecia óbvia: errei feio no projeto passado, então no próximo eu já sei o tamanho da roubada e ajusto. Seis meses depois, com 47 tarefas anotadas numa planilha boba, eu tive que encarar o número. Não melhorou. Eu só fiquei mais confiante errando na mesma direção.

A direção é sempre a mesma: para baixo. E o tamanho do erro também tem um padrão. Na mediana das minhas 47 tarefas, o tempo real foi quase o **dobro** do que eu tinha falado em voz alta. Eu resisti a essa conclusão por muito tempo, porque ela parece desculpa de quem é ruim de estimar. Mas a real é que o cérebro humano foi montado assim mesmo para prever tempo e custo. E tem pesquisa séria atrás disso.

## O dado que me obrigou a parar de negar

Deixa eu mostrar o formato. Eu anotava três colunas: o que eu falei na daily, o que eu de fato gastei, e a razão entre os dois.

| Tipo de tarefa | Estimei | Gastei | Razão |
|----------------|---------|--------|-------|
| Bug "simples" em prod | 2h | 5h | 2,5x |
| Endpoint CRUD novo | 1 dia | 2 dias | 2,0x |
| Subir versão de uma lib | 30min | 3h | 6,0x |
| Refactor "que não mexe em nada" | 3 dias | 4 dias | 1,3x |
| Integração com API de terceiro | 2 dias | 5 dias | 2,5x |

![Estimado contra real: a regra do x2 e os números do estudo de Buehler](/images/blog/estimativa-x2-47-tarefas/estimado-vs-real-pt.png)

A coluna que dói é a última. A mediana das 47 ficou colada em **2x**. E os piores casos não eram os bugs cabeludos que eu já sabia que eram difíceis. Eram as tarefas que eu chamei de "rapidinho". O upgrade de lib que ia levar 30 minutos e levou três horas porque quebrou um teste que ninguém olhava desde 2024. O "rapidinho" é onde o cérebro mais mente.

## O verdadeiro culpado é um viés cognitivo

O nome disso tem dono. Kahneman e Tversky batizaram em 1979: **falácia do planejamento**. A gente estima sempre pelo caminho em que tudo dá certo, e o cérebro é péssimo em somar a probabilidade de várias coisas pequenas darem errado. Cada uma é improvável sozinha. Mas o PR voltar da review, o CI cair, o requisito mudar no meio, o colega tirar folga: junta tudo e a chance de **alguma** delas acontecer é alta.

O experimento que me convenceu não foi com engenheiro, foi com estudante. Buehler, Griffin e Ross (1994) pediram para 37 alunos estimarem quando terminariam a monografia. A média do palpite foi **33,9 dias**. Pedindo o cenário "se tudo der errado", eles falaram **48,6 dias**. O tempo real médio? **55,5 dias**. Repara: o real passou até do próprio pior cenário deles. E só **30%** entregaram dentro do prazo que eles mesmos chutaram. Isso não é gente ruim de estimar. É gente normal, com cérebro normal.

E não melhora com o tamanho do projeto. Flyvbjerg, de Oxford, olhou **1.471 projetos de TI**. O estouro médio de custo foi 27%, o que até parece controlável. O problema está na cauda: **1 em cada 6 projetos** virou o que ele chama de "cisne negro", com **mais de 200% de estouro**. Ou seja, na média você erra um pouco, mas de vez em quando você erra MUITO, e é esse "de vez em quando" que detona o cronograma da equipe inteira.

## A parte honesta sobre o "x2"

Agora eu preciso ser justo, porque tem muita gente vendendo o "multiplique por 2" como se fosse lei da física. Não é. Não existe estudo revisado por pares dizendo que o multiplicador certo é exatamente 2 (tem gente que jura que é π, outros que é √2). O **x2 é folclore de bar de programador**.

Mas o folclore acerta no espírito, mesmo errando na casa decimal. O que a pesquisa séria mostra é que o erro é **sistemático e para baixo**, e que ele não diminuiu em décadas de estudo. Revisões de trabalhos entre 2014 e 2024 apontam que 59% a 76% dos projetos estouraram o esforço planejado. O "x2" não é um número sagrado. É uma forma grosseira e útil de lembrar o cérebro de que ele mente sempre na mesma direção. Eu uso o x2 do jeito que uso o cinto de segurança: não porque eu vou bater toda vez, mas porque o custo de esquecer é assimétrico.

## O que eu faço hoje (e não é "estimar melhor")

A solução que o próprio Kahneman recomenda é trocar de método. Chama-se **previsão por classe de referência**: em vez de olhar para dentro da tarefa ("ah, isso aqui é só um endpoint"), você olha para fora, para o histórico de tarefas parecidas que você já fez.

Na prática, é o que minha planilha boba virou:

1. Antes de estimar, eu puxo as 5 ou 6 tarefas mais parecidas dos últimos 6 meses.
2. Pego a **mediana** do tempo real delas. Mediana, não média: um único projeto-monstro empurra a média para cima e estraga a conta.
3. Ajuste por "dessa vez é diferente" eu limito a uns 20%. Quase sempre não é tão diferente quanto eu acho.

Repara que isso não exige que eu fique mais inteligente. Exige que eu pare de confiar no meu chute e comece a confiar nos meus próprios dados. O `git log` e o board de tickets já são o seu dataset. Você só não estava olhando para ele.

Tem ainda um truque mental que funciona melhor do que parece, o **pre-mortem**: antes de começar, eu finjo que o projeto já fracassou e listo os motivos. Pensar "no que isso vai dar errado" é difícil quando você está otimista. Mas "isso já deu errado, por quê?" o cérebro responde rapidinho, com uma lista enorme. É o mesmo cérebro, só que enganado na direção certa.

## Por que isso pesa mais para quem é PJ

Tem um detalhe que muda tudo dependendo do seu contrato. Se você é CLT, estimar errado é uma métrica chata na retro. Se você é **PJ em contrato fechado**, estimar errado é hora extra que você não vai receber. O x2 deixa de ser teoria de gestão de projeto e vira economia de sobrevivência. Quando eu falo "duas semanas" e gasto quatro num escopo fechado, eu literalmente trabalhei de graça a metade do mês.

Por isso eu paro de tratar estimativa como adivinhação e passo a tratar como gestão de risco. Não dá para zerar o viés. Mas dá para saber para que lado ele te empurra. E aí, como bem disse Hofstadter, "sempre leva mais tempo do que você espera, mesmo levando em conta a Lei de Hofstadter".

Eu finalmente parei de brigar com essa frase. Agora eu só multiplico por dois e sigo.

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
