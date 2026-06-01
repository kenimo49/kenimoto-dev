---
title: "Reuniões de tech selection levavam 90 min no meu time. 5 min de silêncio cortaram pra 35."
description: "Toda reunião de seleção tecnológica do meu time durava 90 minutos e terminava com a opção que o tech lead falou primeiro. Coloquei 5 minutos de silêncio no início para cada um escrever a própria preferência antes de qualquer fala. As reuniões caíram para 35 minutos e o resultado mudou em 4 das 6 últimas decisões. Esse post é sobre o porquê e o como, com a conta em R$ por reunião."
date: 2026-05-24
lang: pt
tags: [reuniao, psicologia, time, ancoragem, engenharia]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/reunioes-tech-selection-90-para-35-minutos-brainstorm-silencioso/"
og_image: "https://kenimoto.dev/images/blog/reunioes-tech-selection-90-para-35-minutos-brainstorm-silencioso/og-pt.png"
cross_posted_to: []
---

Nossa reunião de seleção tecnológica começava assim: "então, qual framework a gente vai usar?". Aí o tech lead falava "eu prefiro o Spring". E pronto, 89 minutos para confirmar Spring.

Isso aconteceu o suficiente para eu começar a contar. Em seis meses, tivemos 11 reuniões desse tipo, com 8 a 10 pessoas cada, duração média de 90 minutos, e em 9 das 11 a opção escolhida foi a primeira que o tech lead mencionou. Resultado tecnicamente ruim, eu não sei. Resultado psicologicamente previsível, com certeza.

Em janeiro eu mudei uma coisa só. Cinco minutos de silêncio no começo da reunião. Cada um escreve a própria preferência em um post-it digital, sem ver o que os outros estão escrevendo, e revela tudo ao mesmo tempo. Depois disso, discute.

As próximas seis reuniões duraram em média 35 minutos. E em 4 das 6 a decisão foi diferente da preferência inicial do tech lead. Esse post é sobre por que isso funciona, qual é a estrutura mínima, e o quanto custava o jeito antigo em R$.

## O que o tech lead estava fazendo (sem saber)

Efeito de ancoragem é o nome psicológico do que estava acontecendo na minha reunião. A primeira pessoa a falar define um número, uma opção, uma direção, e a discussão seguinte fica girando em torno disso. Mesmo que essa primeira opção seja a errada, sair dela exige que alguém defenda ativamente uma alternativa, e defender ativamente uma alternativa contra a posição do tech lead é caro psicologicamente.

A cena típica do meu time: design review de um serviço novo. O tech lead abre com "vamos de microsserviços, é mais escalável". A discussão seguinte assume microsserviços. As 87 perguntas que vêm depois são todas do tipo "qual orquestrador?", "como vai ser o service mesh?", "quem vai cuidar do tracing distribuído?". Ninguém volta e pergunta "espera, monolito modular não resolveria com 1/4 do esforço?". Não porque a resposta seria não. Porque para fazer a pergunta você precisaria sentir que tem espaço para questionar a âncora, e a âncora veio do tech lead.

Eu mesmo fiz isso várias vezes do outro lado. Tinha opinião diferente, ficava pensando "será que vale interromper?", e quando finalmente decidia que valia, a discussão já tinha pulado três tópicos pra frente. Aí calava.

Não é falta de coragem. É como o cérebro de grupo funciona em uma sala de reunião. O experimento de Asch (1951) mostrou que mesmo diante de uma resposta visualmente errada, se todo mundo ao redor concorda, a pessoa também concorda. Em reunião de tech selection, ninguém precisa nem concordar explicitamente, só precisa não discordar. E o silêncio do "não discordar" é interpretado como consenso.

## A intervenção: 5 minutos de silêncio

O que eu coloquei foi simples. Cinco minutos no início de toda reunião de seleção tecnológica, com a regra "cada um escreve em silêncio a sua preferência, com 2 ou 3 linhas de justificativa, antes de qualquer pessoa falar".

Ferramentas que funcionam: Miro com post-its escondidos até o reveal, ou um documento compartilhado onde cada um escreve em uma seção própria sem ler as outras, ou no caso mais low-tech, post-it físico com tampa de papel. O que **não** funciona é "todo mundo escreve em silêncio no Slack do time". Slack é público em tempo real, então a primeira pessoa que escreve ancora todos os outros antes do reveal. Quebra a intervenção inteira.

A regra do reveal é "todos mostram ao mesmo tempo". Depois disso, abre a discussão. Quem está em minoria fala primeiro. Esse último detalhe importa: se a maioria fala primeiro, a pressão de conformidade volta a pressionar a minoria a recuar, e a intervenção do silêncio inicial é desperdiçada.

![Linha do tempo de uma reunião de 35 min: 0min escrita silenciosa, 5min reveal simultâneo, 10min discussão, 30min voto, 35min decisão](/images/blog/reunioes-tech-selection-90-para-35-minutos-brainstorm-silencioso/timeline.png)

## O que mudou em 6 reuniões

As seis reuniões depois da mudança tinham assuntos parecidos com as anteriores: escolha de framework backend, escolha de ferramenta de observabilidade, decisão sobre adotar Kubernetes ou ficar em ECS, escolha de message queue, e duas decisões de migração de banco. Time praticamente o mesmo, salas iguais, tech lead igual.

**Duração média: 35 minutos**, contra 90 antes. Não é mágica. É que metade do tempo das reuniões antigas era pessoas perguntando "mas e se a gente fizesse X?" quando X tinha sido escrito por elas mesmas no início mas não dito, e aí elas estavam tentando re-injetar a ideia depois que a âncora do tech lead já tinha desviado a conversa. Com a escrita silenciosa, X já está na mesa desde o minuto 5. Não precisa ser reinjetado.

**Decisão diferente da preferência inicial do tech lead em 4 das 6**. Foi o que me surpreendeu mais. O tech lead não mudou. Ele continuou tendo preferências fortes no minuto 5. Mas no minuto 5, quando ele revelava a preferência dele, três outros já tinham revelado preferências diferentes, e era ele quem tinha que defender ativamente a posição, não os juniores. A simetria muda tudo.

**Distribuição da fala mais plana**. Eu medi isso de forma rudimentar, contando minutos por pessoa em duas reuniões antes e duas depois. Antes, o tech lead falava 38% do tempo total. Depois, 22%. O que aumentou foi a fala dos plenos e juniores, que antes ficavam abaixo de 5% cada.

## A conta em R$

Vamos converter para reais, porque é assim que minha equipe entendeu por que valia a pena defender o ritual contra o "mas isso é estranho, ninguém faz" inicial.

| Item | Antes | Depois |
|------|-------|--------|
| Duração média | 90 min | 35 min |
| Pessoas por reunião | 8 | 8 |
| Tempo de time por reunião | 12 horas-pessoa | 4,7 horas-pessoa |
| Custo por hora-pessoa | R$ 80 | R$ 80 |
| Custo por reunião | R$ 960 | R$ 374 |
| **Economia por reunião** |  | **R$ 586** |

Onze reuniões em seis meses, com economia de R$ 586 cada, dá **R$ 6.446 de tempo de equipe economizado em meio ano**. Por ano, R$ 12.892. Não é fortuna, mas é mais do que paga uma licença de Miro para o time inteiro durante anos. E essa é só a parte mensurável em tempo. Não conta as decisões melhores, o desgaste evitado do júnior que falou e foi ignorado, e o tech lead que para de levar para casa a sensação ruim de "minha opinião é tratada como ordem mesmo quando eu não quero".

## O que dá errado

Eu seria desonesto se não falasse das vezes em que não funcionou.

**Reunião com pessoas que não escrevem rápido.** Cinco minutos é apertado para alguém pensar e escrever uma justificativa. Aumentei para sete em times mais distribuídos, com falantes não nativos da língua da reunião, e voltou a fluir.

**Tech lead que lê os post-its dos outros antes do reveal.** Aconteceu uma vez. A pessoa achou que "facilita a discussão" preparar a resposta de antemão. Não facilita, atropela a intervenção inteira. Tive que falar diretamente. Funciona quando todo mundo combinou que a regra é não-bisbilhotar, e isso depende de segurança psicológica, que é um pré-requisito que nem todo time tem.

**Discussões muito técnicas que precisam de demonstração.** Em design review com diagrama, a escrita inicial não é "qual a sua preferência", é "quais as três perguntas que você faria sobre esse diagrama". Adaptação pequena, funciona igual.

**Reunião urgente de incidente.** Não use. Em incidente, a estrutura precisa ser hierárquica e rápida, não democrática e lenta. A intervenção é para decisões de baixa urgência e alta reversibilidade.

## A versão Amazon do mesmo princípio

O memo de 6 páginas da Amazon é a versão extrema dessa mesma ideia. Em vez de cinco minutos de silêncio, a Amazon começa toda reunião importante com 30 minutos de leitura silenciosa de um documento de proposta. Mesmo princípio: garantir que cada pessoa formou a própria opinião antes de receber influência alheia.

Eu acho a versão de cinco minutos melhor para o dia a dia, porque escrever um memo de seis páginas para toda reunião é caro demais e o time vai parar de fazer. Cinco minutos de post-it é barato o suficiente para virar ritual.

Mas se você lê esse post e acha que cinco minutos é pouco demais para o time que você tem, sobe para 10. O que **não** dá pra fazer é zero. Zero é o que eu tinha. Zero é como 9 das 11 decisões serem o que o tech lead falou primeiro. Zero é o que faz uma reunião de 90 minutos servir para confirmar o que poderia ter ido pro Slack em 3 mensagens.

A intervenção é uma só, custa cinco minutos, funciona em quase todo time onde existe um mínimo de segurança psicológica. Tente uma vez. Mede a duração. Conta os post-its diferentes do que o tech lead escreveu. Aí você decide se vale.

Esse capítulo é parte de um livro maior em PT-BR sobre psicologia aplicada à engenharia: **[Manual completo dos truques psicológicos para engenheiros](https://kenimoto.dev/pt/books/engineer-psychology-tricks)**. O capítulo 11 é sobre reuniões e consenso. Aqui eu peguei só o ponto da ancoragem com o brainstorm silencioso, do meu jeito, com os números do meu time.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
