---
title: "Deixei a IA escrever 100 testes verdes. Mutation testing diz que pegaram só 58% dos bugs."
description: "Meu agente de IA gerou uma suíte de testes toda verde, com 92% de cobertura de linha. Aí rodei mutation testing e descobri que ela só pegava 58% dos bugs que injetei de propósito. O problema não é escrever teste antes ou depois do código."
date: 2026-06-15
lang: pt
tags: [testes, mutation-testing, ia, claude-code, tdd]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/ia-100-testes-verdes-mutation/"
og_image: "https://kenimoto.dev/images/blog/ia-100-testes-verdes-mutation/og-pt.png"
cross_posted_to: []
---

Durante umas semanas eu saí por aí dizendo que minha suíte de testes estava "basicamente blindada". Cem testes, todos verdes, 92% de cobertura de linha no módulo que me importava. Eu falei isso em voz alta, para pessoas de verdade, com cara séria. Depois rodei mutation testing na mesma suíte e vi 42% dos bugs que injetei de propósito passarem reto por ela. A suíte pegou 58%. Blindada foi otimismo. Estava mais para porta de tela.

Antes que alguém jogue isso na velha discussão: não é o papo de "escrever teste antes ou depois do código". Esse eu conheço. É sobre ordem, sobre deixar a IA implementar primeiro e escrever os testes depois. Discussão válida, outra discussão. O problema que eu peguei é pior, porque sobrevive ao conserto da ordem. Você pode ter testes escritos no momento perfeito, todos passando, cobertura decente, e ainda assim verificando quase nada. Verde não quer dizer verificado.

## Corrigindo a própria prova

Tem uma frase que reorganizou isso na minha cabeça. Pedir para um LLM escrever testes do código que ele mesmo acabou de escrever é como deixar o aluno corrigir a própria prova. O modelo já sabe o que a implementação faz. Então os testes que ele produz tendem a descrever esse comportamento em vez de desafiá-lo. Eles afirmam que o código faz o que o código faz. Tautologia com um check verde do lado.

É a parte que some quando você olha só para a cobertura. Cobertura de linha responde "algum teste passou por esta linha?". Não diz nada sobre se o teste perceberia caso aquela linha estivesse errada. Uma asserção tipo `expect(resultado).toBeDefined()` executa a função inteira e cobre cada linha de dentro dela. E passa do mesmo jeito se a função devolver o total certo, um total errado, ou o número 7. Cobertura: ótima. Verificação: zero.

Quando a IA escreve o código e os testes na mesma tacada, ela produz um monte desses. Não por preguiça. É estrutural. O modelo otimiza para "fazer passar", e o jeito mais barato de fazer uma asserção passar é afirmar algo que já é verdade.

## O que mutation testing faz de verdade

Mutation testing é a única ferramenta que eu achei que mede o que a cobertura finge medir. A ideia é quase rude de tão simples: ela quebra seu código de propósito e checa se seus testes percebem.

Uma ferramenta como o [Stryker](https://stryker-mutator.io/) (para JS/TS; `mutmut` no Python, PIT no Java) pega seu código-fonte e gera centenas de pequenos mutantes. Troca um `>` por `>=`. Muda `+` para `-`. Substitui um retorno booleano por `true`. Apaga uma chamada de função. Para cada mutante, ela roda sua suíte de novo. Se um teste falha, o mutante é "morto", ótimo, seus testes pegaram a sabotagem. Se todos os testes continuam passando, o mutante "sobrevive", o que significa que existe uma mudança na sua lógica que nenhum teste do mundo questiona.

O mutation score é mortos sobre o total. Oitenta por cento para cima é a meta que o pessoal busca em 2026 quando se importa com um módulo. Minha suíte gerada por IA, com seus orgulhosos 92% de cobertura, tirou 58.

Essa distância de 34 pontos entre cobertura e mutation score é a história inteira. A cobertura disse "eu rodei seu código". O mutation testing disse "eu transformei seu código em algo errado e seus testes bateram palma".

![Comparação em barras: cobertura de linha em 92 por cento ao lado de mutation score em 58 por cento, com a distância de 34 pontos marcada como os bugs que os testes nunca pegaram](/images/blog/ia-100-testes-verdes-mutation/og-pt.png)

## Rodei os números para você não precisar (mas você devia)

Montei o teste de propósito sem graça nenhuma para o resultado não ser sorte. Um módulo em TypeScript, umas 400 linhas: lógica de preço, alguns cálculos de data, validação de entrada, esse tipo de código que estraga uma sexta-feira em silêncio quando está errado. Pedi para o agente implementar e escrever uma suíte completa na mesma sessão. Ele me deu 100 testes, todos passando, 92% de cobertura. Não mexi em nada nos testes.

Depois, `npx stryker run`. 214 mutantes. 124 mortos, 90 sobreviventes. Score: 58%.

Li os sobreviventes um por um, e recomendo a experiência como exercício de humildade. Um cálculo de taxa em que inverter o operador de comparação não mudava a conta de ninguém aos olhos da suíte. Um ramo de validação que rejeitava quantidade negativa, só que o teste sempre passava valores válidos, então apagar a checagem inteira não matava nada. O erro de um a mais num intervalo de datas que três testes "passando" atravessaram tranquilos. Nenhum desses apareceria na cobertura. Todos eram bugs reais para os quais a suíte era cega por construção.

A IA é ruim de escrever teste? Não. Ela é excelente em escrever testes que passam. São trabalhos diferentes, e eu estava avaliando ela no errado.

## O conserto é mais velho que o problema

A resposta chata é que o TDD já tinha resolvido isso, e eu tinha meio que abandonado porque a IA fez a escrita de testes parecer opcional.

O ponto estrutural do TDD nunca foi a cerimônia nem a dancinha red-green-refactor. Ele mora em outro lugar: no portão de qualidade. Quando um humano escreve o teste primeiro, a partir da spec, antes de a implementação existir, o teste registra uma intenção à qual a implementação ainda não tem como se ajustar. O modelo então escreve código para satisfazer um alvo que ele não definiu. O portão fica do lado humano. É esse o valor inteiro, e é exatamente o que você perde quando deixa o mesmo agente escrever código e teste juntos: o portão migra de mansinho para o modelo, que volta a corrigir a própria prova.

Então mudei como divido o trabalho. Eu escrevo o teste, ou no mínimo as asserções e os casos de borda, antes de o agente implementar. Número negativo, entrada vazia, o limite que está sempre errado por um. A IA é ótima de verdade na implementação e em preencher o andaime mecânico de testes em volta das asserções que eu defini. A parte de *definir* foi a que parei de delegar. E uma vez por trimestre, em qualquer coisa que eu teria vergonha de subir quebrada, rodo mutation testing, não como ritual diário, só como um teste de realidade sobre se meu verde é verde de verdade.

Minha suíte está em 84% agora. Ainda não é blindada. Mas aposentei a porta de tela, e parei de dizer "blindada" para humanos. O progresso vem em vários formatos.

A moral aqui não tem a ver com "IA escreve teste ruim". Tem a ver com isto: uma suíte que passa e uma suíte que verifica não são o mesmo artefato, a cobertura não consegue distinguir as duas, e mutation testing é a forma mais barata de descobrir qual delas você realmente tem. Rode uma vez no módulo do qual você mais se orgulha. Na pior das hipóteses, você estava certo. Na melhor, você descobre antes da produção descobrir.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
