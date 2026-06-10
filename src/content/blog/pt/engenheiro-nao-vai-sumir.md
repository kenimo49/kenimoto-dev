---
title: "O cargo de 'engenheiro' não vai sumir — vira 80% decisão, 20% código"
description: "Todo mundo diz que a IA vai apagar o engenheiro de software. Eu acho que some o percentual, não a profissão: o trabalho vira 80% decisão e 20% código. E tem uma equipe que provou isso abrindo 4x mais PRs sem perder qualidade."
date: 2026-06-11
lang: pt
tags: [carreira, claude-code, ia, engenharia-de-software, produtividade]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/engenheiro-nao-vai-sumir/"
og_image: "https://kenimoto.dev/images/blog/engenheiro-nao-vai-sumir/og-pt.png"
cross_posted_to: []
---

Toda semana aparece um post novo dizendo que o engenheiro de software vai desaparecer, e toda semana eu fecho a aba com a mesma cara de quem já ouviu essa música antes. Em 2024 era "o ChatGPT escreve tudo". Em 2026 é "o agente faz o PR sozinho". A manchete muda, o pânico é o mesmo.

Eu vou discordar, mas não da forma confortável. Não vou dizer que está tudo bem e que nada muda. Muda, e muda bastante. Só que o que some é o percentual, e o cargo continua de pé. O trabalho de engenheiro está virando 80% decisão e 20% código. E eu tenho um número concreto, de uma equipe de verdade, para mostrar que isso não é frase de palestra.

![Gráfico mostrando a inversão: de 80% código / 20% decisão para 20% código / 80% decisão](/images/blog/engenheiro-nao-vai-sumir/og-pt.png)

## A frase que todo mundo cita errado

Boris Cherny, o criador do Claude Code, falou num podcast da Y Combinator que "o cargo de engenheiro de software, uma hora, some". Essa é a parte que viraliza. A parte que ninguém termina de ler é o contexto: nos dados internos da Anthropic, a produtividade dos engenheiros subiu **150%**, e em alguns projetos **100% do código** já é gerado por IA.

Repara no detalhe. O que ele anuncia é a mudança da definição do cargo, não o fim do engenheiro. Antigamente "engenheiro" era "a pessoa que escreve o código". Quando 100% do código sai da máquina, escrever código deixa de ser a definição do cargo. Sobra o resto. E o resto é justamente a parte que sempre valeu mais.

## O número que importa: 4x mais PRs, mesma qualidade

A teoria é bonita, mas eu desconfio de teoria sem placar. Então vou no caso que me convenceu de fato.

A GMO Pepabo, uma empresa japonesa de tecnologia, soltou em 2026 um manifesto chamado "Agent Ready" e botou os agentes de IA para trabalhar como primeira linha. O resultado que me fez parar foi este: a equipe passou a abrir **4x mais PRs** mantendo a qualidade. Não é "mais código com mais bug". É quatro vezes mais entrega de mudança, com o mesmo padrão de revisão.

Isso só fecha a conta se o gargalo deixou de ser digitar e virou decidir. Se a pessoa tivesse que ler e entender cada linha como antes, 4x mais PRs seria 4x mais retrabalho. O que mudou foi onde o humano gasta o tempo: menos no "como escrevo isso", mais no "isso devia existir, e está certo do jeito que está?".

E não é só a Pepabo. Os agentes de código de 2026 já batem em torno de **77%** no SWE-bench Verified, o benchmark que mede resolver issue real de GitHub de ponta a ponta ([os números públicos](https://www.programming-helper.com/tech/swe-bench-coding-agent-benchmarks-2026-software-engineering-ai-evaluation) ficam entre 75 e 77% nos modelos do topo). Em 2024 isso estava em 30-40%. A curva é claríssima, e ela não aponta para "o humano escreve mais código".

## 80/20 não é número novo na minha vida

Aqui entra a parte pessoal, porque eu não cheguei nesse 80/20 lendo benchmark. Eu já vivia ele antes da IA.

Quando eu trabalhava com desenvolvimento de robôs, e depois quando passei a tocar a gestão de uma empresa, o tempo que eu de fato passava escrevendo código era uns 20%. Os outros 80% eram pensar, discutir, decidir o que valia a pena construir e o que era melhor não construir. O código sempre foi a ponta visível de um iceberg de decisão.

A IA não inverteu essa proporção. Ela só tirou de mim os 20% mecânicos e devolveu esse tempo para os 80% que sempre foram o trabalho de verdade. Para quem já encarava a engenharia como decisão, isso soa como alívio. Para quem se definia só pela velocidade de digitar, aí dói. Mas o golpe acerta a definição antiga e deixa a carreira de pé.

## E o mercado brasileiro nisso?

Vale aterrissar isso na nossa realidade, porque "o futuro da engenharia" tende a ser escrito pensando no Vale do Silício, e o mercado daqui tem outra física.

No Brasil, a conversa sobre júnior é a mais tensa. Se o agente faz o trabalho repetitivo que antes era a escada de entrada da galera nova, de onde vem o próximo sênior? Eu não tenho resposta fechada, mas tenho um palpite incômodo: o júnior que vai se dar bem é o que aprende a decidir cedo. Velocidade de digitação virou commodity. Ler um PR de agente e saber dizer "isso aqui está errado e o motivo é esse" é uma habilidade de sênior que agora dá para treinar no primeiro ano.

O cargo na vaga vai continuar dizendo "engenheiro". O que muda é o que o gerente espera de você na review da sexta-feira: menos linhas escritas, mais decisões defendidas.

## O que eu faria se estivesse começando hoje

Se eu fosse júnior em 2026, eu pararia de competir com o agente naquilo que ele faz melhor que eu, que é cuspir código padrão rápido. Eu treinaria a parte que ele não faz: julgar. Por que essa arquitetura em vez da outra. Por que esse trade-off agora e o outro depois. O que não construir, que costuma valer mais que o que construir.

A IA gera opções numa velocidade absurda. Mas ela gera opções. Escolher entre elas continua sendo trabalho humano, e escolher bem é a coisa mais difícil e mais bem paga que existe nessa profissão. A Pepabo só conseguiu botar agente como primeira linha porque um humano, o CTO, decidiu que aquela infraestrutura precisava existir. Essa decisão nenhum agente tomou.

## Fechando

O engenheiro de software não vai sumir. O que some é o "20%" virar a definição do cargo. Vira 80% decisão, 20% código, e quem prova isso é uma equipe real abrindo 4x mais PRs sem largar a qualidade, num mundo onde o agente já resolve 77% das issues reais sozinho.

Se isso te assusta, repara em quem leva a pior na história: não é o engenheiro, é a definição antiga de engenheiro. A boa notícia é que a parte que sobra para o humano é justamente a parte que sempre foi a mais interessante. Eu passei a carreira inteira gastando 80% do tempo decidindo. Pela primeira vez, isso virou a descrição oficial do cargo, em vez da parte que eu fazia escondido entre dois deploys.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
