---
title: "Seu cérebro reconhece o bug antes de você ler o log (e erra mais do que você imagina)"
description: "No plantão, o cérebro faz pattern-matching instantâneo e te prende numa hipótese errada. A saída não é pensar mais rápido: é listar 3 hipóteses e caçar a evidência que refuta cada uma."
date: 2026-06-17
lang: pt
tags: [debugging, vies-cognitivo, incidentes, postmortem, psicologia]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/cerebro-reconhece-bug-antes-do-log"
og_image: "https://kenimoto.dev/images/blog/cerebro-reconhece-bug-antes-do-log/og-pt.png"
cross_posted_to: []
---

Eu gosto de me achar um engenheiro racional. Aí o alerta de produção dispara às 2h da manhã, eu abro o dashboard, bato o olho na primeira linha do log e já solto, em voz alta, sozinho no escritório de casa: "ah, isso aqui eu já vi". Nesse momento eu não estava raciocinando. Estava reconhecendo um padrão, do mesmo jeito que reconheço o rosto da minha mãe. E o problema é exatamente esse.

Sou engenheiro de WebRTC e Voice AI, ou seja, vivo num mundo onde latência e estados de conexão falham de formas criativas. Já perdi mais horas perseguindo a hipótese errada do que gostaria de admitir num post público. Então deixa eu te contar como eu aprendo isso de novo a cada plantão, e o truque ridiculamente simples que finalmente me tirou desse buraco.

## O cérebro responde antes de você ler

Quando você olha um log de erro, o cérebro não lê com calma e depois decide. Ele faz pattern-matching em alta velocidade e puxa uma resposta da memória antes de você processar conscientemente o que está na tela. Daniel Kahneman chamaria isso de Sistema 1: rápido, automático, e absolutamente convencido de si mesmo.

O detalhe cruel: essa resposta automática vem com uma sensação de certeza embutida. Você não sente "essa é uma hipótese entre várias". Você sente "é isso". E a partir desse instante dois vieses entram em ação para te manter preso.

O primeiro é o **viés de confirmação**: a tendência de buscar evidência que apoia a sua hipótese e descartar a que a contradiz. O segundo é a **heurística da disponibilidade**: a tendência de julgar como provável aquilo que vem fácil à memória. Juntos, eles formam uma armadilha quase perfeita. O incidente de memory leak do mês passado aparece primeiro, mesmo que os sintomas de hoje não tenham nada a ver. E aí você passa a investigar só os logs que confirmam o memory leak.

![Diagrama comparando o reflexo do Sistema 1, que leva a uma hipótese errada, com o mecanismo de listar 3 hipóteses e buscar evidência que refuta cada uma](/images/blog/cerebro-reconhece-bug-antes-do-log/cerebro-reconhece-bug-antes-do-log-1.png)

## Não é falta de experiência (e a pesquisa não é gentil com isso)

A parte que mais me incomoda é que dá pra documentar isso com números, e os números não me poupam.

Existe uma linha de pesquisa sobre o que se chama de **positive test bias** em testes de software: programadores tendem a testar o programa com dados consistentes com "a forma como ele deveria funcionar", e não com dados que poderiam quebrá-lo. Um mapeamento sistemático sobre vieses cognitivos na engenharia de software ([arXiv:1707.03869](https://arxiv.org/pdf/1707.03869)) consolida vários estudos mostrando que esse viés é real e mensurável.

E o detalhe que me derrubou: o que **modera** esse viés são fatores como a completude da especificação, o conhecimento do domínio e a presença de erros no código. O nível de experiência em programação, segundo essa literatura, praticamente **não** ajuda. Traduzindo: ser sênior não te protege. Eu, com mais de uma década de carreira, caio na mesma cilada que um júnior no segundo dia. A diferença é que eu caio com mais confiança, o que é pior.

A heurística da disponibilidade tem o mesmo problema. O que reforça ela não é a frequência real da causa, é o quão vívida ela está na sua cabeça:

- O incidente que você varou a noite resolvendo fica mais marcado que o que se resolveu sozinho
- A causa da semana passada vence a de um mês atrás
- O incidente em que o cliente ligou irritado é mais fácil de lembrar que o silencioso

Nada disso tem relação com qual causa é tecnicamente mais provável hoje.

## O incidente em que eu queimei 3 horas numa hipótese

Vou ser concreto, porque a essa altura você merece um número e não só teoria.

Plantão de quinta, home office, café já frio. Um serviço de sinalização WebRTC começou a derrubar conexões. Primeira linha do log: `TimeoutException`. Meu Sistema 1 não hesitou: "rede". Na semana anterior a gente tinha tido um problema de rede de verdade, então essa causa estava fresquinha, disponível, brilhando na minha memória.

Passei as três horas seguintes mergulhado em métricas de rede. Latência entre regiões, retransmissões TCP, configuração de timeout do load balancer. Cada gráfico que mostrava a rede saudável eu tratava como "coincidência" ou "deve ter normalizado". Olha o viés de confirmação funcionando: a evidência que me refutava estava na tela, e eu a li como ruído.

O bug real era um pool de conexões do banco esgotado. As conexões ficavam presas, a aplicação estourava o timeout esperando uma conexão livre, e cuspia `TimeoutException`. A palavra "timeout" no log não significava timeout de rede. Significava timeout de recurso. Três horas. Um colega que entrou de manhã, sem o meu incidente da semana anterior na cabeça, olhou e perguntou em dois minutos: "isso não é o pool?".

Ele não era mais inteligente que eu naquela manhã. Ele só não tinha o memory leak da disponibilidade me cochichando no ouvido.

## O truque: 3 hipóteses, e a evidência que REFUTA cada uma

A solução não é "pense mais rápido" nem "seja mais cuidadoso". Esses conselhos são inúteis exatamente no momento do incidente, quando você está estressado, com pouco tempo e informação incompleta, ou seja, o momento em que o Sistema 2 funciona pior. Conselho que depende de força de vontade falha justo quando o viés está mais forte.

O que funciona é um mecanismo. E o meu é embaraçosamente simples:

**Antes de investigar qualquer coisa, eu escrevo três hipóteses. Para cada uma, eu anoto não a evidência que a apoia, e sim a evidência que a refutaria.**

```text
Sintoma: TimeoutException em massa no serviço de sinalização

H1: problema de rede entre regiões
    refuta se -> métricas de rede estão dentro do normal  [CHECAR]

H2: pool de conexões do banco esgotado
    refuta se -> conexões ativas bem abaixo do limite do pool  [CHECAR]

H3: deadlock / lock no banco
    refuta se -> nenhuma query travada em pg_stat_activity  [CHECAR]
```

![Tabela de 3 hipóteses para o sintoma TimeoutException, cada uma com a coluna refuta se ao lado: rede, pool do banco e deadlock](/images/blog/cerebro-reconhece-bug-antes-do-log/cerebro-reconhece-bug-antes-do-log-2.png)

Por que anotar o que refuta, e não o que confirma? Porque confirmar é o que o seu cérebro já está fazendo sozinho, de graça e contra você. Buscar ativamente a evidência refutadora é o antídoto direto do viés de confirmação. No meu caso, dois minutos olhando o pool já teriam derrubado o H1 e iluminado o H2.

No dia a dia da equipe, isso vira uma regra de plantão: quando o incidente abre, a primeira mensagem no canal não é "acho que é a rede". É "listem três causas possíveis". Tornar as três hipóteses explícitas antes de afunilar para uma dispersa o viés sobre uma só. E sim, no calor do incidente parece burocracia. Leva noventa segundos. Eu já paguei três horas pela alternativa.

Um complemento que mata a heurística da disponibilidade: apoiar em registro, não em memória. Um catálogo de incidentes no formato "sintoma → lista de causas possíveis", alimentado pelos seus postmortems, faz aparecer na tela aquela causa que nunca te ocorre porque você nunca a viveu. A falha de DNS que você nunca enfrentou não vem fácil à memória; ela vem fácil ao `grep` num arquivo.

## E o postmortem entra aqui

Tudo isso só compõe se o seu time conseguir falar a verdade sobre o incidente depois. Por isso o postmortem blameless deixou de ser modinha e virou prática de base. A ideia central, do jeito que a [cultura de postmortem do Google SRE](https://sre.google/workbook/postmortem-culture/) define, é assumir que todo mundo envolvido agiu com boa intenção e com a melhor informação disponível **naquele momento**.

Repare como isso conversa direto com o viés. Se eu sou crucificado por ter queimado três horas na rede, a lição que eu aprendo é "da próxima vez escondo melhor o meu erro". Se o time trata aquilo como o que de fato foi, um Sistema 1 fazendo seu trabalho de pattern-matching com a informação errada, a lição vira um item de ação: "vamos colocar timeout de pool e timeout de rede em métricas separadas, com nomes diferentes no log". O blameless não é gentileza corporativa. É a condição para o aprendizado existir.

E o ponto que costuma escapar nas discussões de postmortem: o objetivo não é caçar a causa raiz e parar ali. É transformar o apuro de uma equipe numa melhoria compartilhada que reduz a chance do mesmo padrão de falha atingir outro serviço no mês seguinte.

## Fechando

Eu não consigo desligar o meu Sistema 1. Você também não, e qualquer pessoa que te disser que é racional demais para cair nisso provavelmente acabou de cair. O cérebro vai continuar reconhecendo o bug antes de você ler o log, e vai continuar errando com uma confiança constrangedora.

O que dá pra fazer é montar um corrimão. Três hipóteses, evidência que refuta cada uma, catálogo no lugar da memória, postmortem que deixa as pessoas falarem a verdade. Não é sobre ser mais esperto no plantão. É sobre construir o sistema que funciona quando você está cansado, com café frio e absolutamente certo de algo que está errado.

Se esse tema de viés cognitivo na engenharia te pegou, é mais ou menos o assunto inteiro do meu livro *engineer-psychology-tricks* — mas isso é conversa para outro dia, e sem link de venda enfiado no meio do texto.

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
