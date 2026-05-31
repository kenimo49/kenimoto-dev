---
title: "Confiei que a IA me deixava mais rápido. Os dados dizem que fiquei mais lento"
description: "Estimei 1 hora numa task e gastei 8. Achei que a IA tinha me acelerado. O estudo METR 2025 mostra que, para devs experientes, essa velocidade é ilusão."
date: 2026-06-01
lang: pt
tags: ["IA", "produtividade", "vieses cognitivos", "psicologia"]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/confiei-ia-mais-rapido-fiquei-mais-lento"
og_image: "https://kenimoto.dev/images/blog/confiei-ia-mais-rapido-fiquei-mais-lento/og-pt.png"
cross_posted_to: []
---

Numa terça-feira de manhã, abri uma task que parecia trivial: ajustar a lógica de retry de um cliente HTTP num projeto que eu conheço de cor. Estimei uma hora. Colei o contexto no assistente de IA, recebi uma solução bonita em trinta segundos e pensei "pronto, hoje saio cedo".

Saí às oito da noite. Foram oito horas. E o pior nem foi o tempo perdido: foi que, no fim do dia, minha sensação era de que a IA tinha me deixado **mais rápido**.

## A conta que eu não fiz

Aquela solução de trinta segundos estava 80% certa. Os outros 20% eram um caso de borda no backoff exponencial que só aparecia sob carga. Não dava pra ver lendo o código. Eu confiei, fiz o commit, e o problema voltou disfarçado três horas depois.

Aí começou o ciclo que todo mundo conhece e ninguém cronometra: pedir outra versão pra IA, ler, achar que entendi, testar, descobrir um detalhe novo, pedir de novo. Cada rodada parecia rápida. Cada rodada custava vinte minutos. Vinte vezes vinte minutos não é uma hora.

A IA errar era esperado. O que me pegou foi ter **terceirizado o ceticismo**. Eu reviso código de gente júnior linha por linha, mas a saída da IA eu tratei como se viesse com selo de qualidade. Isso tem nome.

## Viés de automação: terceirizar o cérebro

O viés de automação é a tendência de confiar demais em sistemas automatizados, mesmo quando há sinais de que eles estão errados. Estudos da Georgetown (CSET, 2024) mostram que desenvolvedores tendem a aceitar sugestões de IA sem verificação adequada, e que a pressão de tempo piora isso justamente quando a verificação mais importa.

Faz sentido evolutivo. Se uma máquina acerta nove vezes, seu cérebro para de checar na décima. O problema é que, em código, a décima é a que vai pra produção numa sexta às 18h.

E tem um agravante específico da nossa época: o viés de autoridade. "A IA disse, então deve estar certo." Quando a resposta vem com tom confiante, formatada, com até um comentário explicativo, ela *soa* como autoridade. Mas confiança de texto não é evidência de correção. É só confiança de texto.

## O dado que dói: METR 2025

Eu achava que esse era um problema meu, de disciplina. Aí apareceu o estudo da METR (2025) e me tirou o conforto de achar que era exceção.

A METR rodou um experimento controlado e randomizado com 16 desenvolvedores experientes, trabalhando em projetos open source maduros que eles mesmos mantinham, repositórios grandes com mais de um milhão de linhas. O resultado: usando ferramentas de IA, esses devs **levaram 19% mais tempo** para completar as tarefas.

O que assusta mesmo vem junto com ele:

![Estudo METR 2025: percepção contra realidade na produtividade com IA](/images/blog/confiei-ia-mais-rapido-fiquei-mais-lento/metr-percepcao-realidade-pt.png)

- **Antes** do experimento, os devs previram que a IA cortaria o tempo em 24%.
- **Depois** de terminar, já tendo sido mais lentos, eles ainda acreditavam que a IA tinha acelerado em 20%.
- **Na real**, ela atrasou em 19%.

A diferença entre o que a pessoa sente e o que o cronômetro registra chega a quase 40 pontos percentuais. A ilusão de produtividade não some nem depois que você vive o atraso na pele. Eu sou prova disso: terminei minha terça-feira de oito horas achando que tinha sido um dia eficiente.

## Por que justamente os experientes?

Esse é o detalhe contraintuitivo, e é importante não exagerar o estudo. A METR foi clara: o resultado vale para devs **experientes em código que eles conhecem bem**. Para quem está começando, ou mexendo num projeto desconhecido, a IA pode acelerar de verdade: escrever boilerplate, explicar uma API, navegar um repo estranho.

A armadilha aparece exatamente onde você é bom. Quando você conhece o código de cor, digitar a solução é a parte barata. A parte cara é decidir o que fazer. A IA é ótima em digitar e medíocre em decidir no seu contexto específico. Então ela acelera o que já era rápido e te empurra um custo novo: ler, entender e corrigir a sugestão dela. Esse custo é invisível enquanto acontece e óbvio só no fim do dia.

## O outro lado da conta: a falácia do planejamento

Tem uma segunda peça nesse quebra-cabeça, e ela é antiga: a falácia do planejamento, descrita por Kahneman e Tversky muito antes de existir Copilot. A gente sistematicamente subestima quanto tempo as coisas vão levar, mesmo tendo errado a mesma estimativa dezenas de vezes.

A IA não inventou esse viés. Ela colocou esteroides nele. Quando o assistente cospe uma solução em trinta segundos, a "hora" que eu tinha estimado encolhe na minha cabeça pra "uns vinte minutos". A velocidade da geração contamina a estimativa do trabalho inteiro, incluindo a descoberta, a verificação e o retrabalho, que são exatamente as partes que a IA não acelera.

Estimar "30 minutos" e gastar 4 horas tem pouco a ver com a IA falhar. A estimativa já nasce otimista, e a IA só reforça esse otimismo.

## O que eu mudei (sem virar lendário cético)

Não larguei a IA. Continuo usando todo dia. Mudei três coisas, todas baratas:

**Trato a saída da IA como PR de júnior.** Não como verdade, não como lixo: como código que precisa passar pela mesma revisão que qualquer outro. Se eu não revisaria sem ler, não faço merge.

**Estimo o tempo de verificação separado do tempo de geração.** "A IA escreve em 1 minuto" e "eu confio nisso em 1 minuto" são duas frases diferentes. A segunda quase nunca é verdade. Coloco o custo de checagem na estimativa, explícito.

**Cronometro de vez em quando.** Não sempre, seria neurótico. Mas algumas tasks por semana eu marco o relógio de verdade, porque minha sensação de velocidade já provou ser uma testemunha não confiável. O relógio não tem viés de autoridade.

A ironia final: o estudo que mais me ajudou a usar IA com juízo é um estudo sobre IA me deixando mais lento. Eu não fiquei mais lento por usar IA. Fiquei mais lento por **acreditar** na IA sem cronometrar. São coisas diferentes, e a diferença custa, no meu caso, sete horas numa terça-feira.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
