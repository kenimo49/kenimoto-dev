---
title: "Construir ficou trivial com Claude Code — o gargalo agora é vender, e quase nenhum engenheiro percebeu"
description: "O Claude Code derrubou o custo de construir software para perto de zero. O problema é que a maioria dos engenheiros ainda acha que saber construir é o diferencial. Não é mais. O gargalo do negócio andou para vender."
date: 2026-06-23
lang: pt
tags: [claude-code, saas, negocio, distribuicao, indie-hacker]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/construir-ficou-trivial-gargalo-vender/"
og_image: "https://kenimoto.dev/images/blog/construir-ficou-trivial-gargalo-vender/og-pt.png"
cross_posted_to: []
---

Aviso antes de você continuar: isto não é mais um texto de "carreira na era da IA". Não vou falar de cargo, de competências nem de como não ser substituído. É um texto sobre receita de negócio, sobre por que o seu SaaS lindo não fatura nada. Se você veio buscar consolo profissional, fecha a aba; aqui o assunto é dinheiro entrando na conta, e a notícia é meio desconfortável.

Começa pela parte técnica, porque é dela que tudo decorre.

## O Claude Code matou o custo de construir

Eu passei a maior parte da minha carreira acreditando numa conta simples: construir software é caro, então quem constrói bem tem vantagem. Era verdade. Montar um SaaS razoável significava semanas de backend, autenticação, billing, deploy, e um humano que soubesse fazer tudo isso sem chorar no meio do caminho.

Essa conta quebrou. Com o Claude Code, eu construo num fim de semana o que antes levava um trimestre. Auth, fila, dashboard, integração com Stripe: o agente escreve, eu reviso, sobe. Não estou exagerando para o efeito dramático: o custo de desenvolvimento de um produto novo caiu para perto de zero. E quando uma coisa cara fica de graça, ela para de ser um diferencial. Saber construir virou o equivalente a saber usar Git: necessário, mas ninguém vai te pagar por isso sozinho.

Esse é o ponto técnico que quase nenhum engenheiro processou direito. A gente comemorou a velocidade ("olha que rápido eu entrego agora!") e não percebeu que a velocidade era pública. Se você consegue construir em um fim de semana, o cara ao lado também consegue. O fosso secou. E quando o fosso seca, o castelo fica exposto a quem souber atravessar o terreno, que, neste caso, é distribuição.

![Antes: 80% desenvolver / 15% marketing / 5% vendas. Era Claude Code: 20% desenvolver / 40% marketing / 40% vendas](/images/blog/construir-ficou-trivial-gargalo-vender/og-pt.png)

## A frase que provocou ondas

Um desenvolvedor chamado Meito jogou uma granada na comunidade de engenharia com esta frase:

> "Um engenheiro que consegue construir um ótimo serviço com Claude Code vai ganhar menos do que alguém que consegue construir um serviço razoável com Claude Code e vendê-lo agressivamente."

A primeira reação de todo engenheiro — a minha inclusive — é defensiva. "Que absurdo. Qualidade vence." Aí você olha o currículo técnico do Meito e a coisa fica engraçada de um jeito incômodo: as habilidades de desenvolvimento dele se resumem, segundo ele mesmo, a "concluí o curso de HTML & CSS do Progate". É isso. Nível "sei o que é uma `div`". E com esse arsenal ele fez um SaaS crescer até MRR de ¥ 6 milhões, algo como R$ 200 mil por mês.

Eu reli essa frase umas três vezes procurando a pegadinha. Não tem pegadinha. O cara não constrói melhor que você. Ele só descobriu antes que, no negócio, vender pesa mais do que construir. Enquanto metade da comunidade discutia se a frase era ofensiva, o Meito estava fechando o mês.

## O roteiro que engenheiro acredita (e o roteiro real)

Tem um filme que todo engenheiro projeta na cabeça:

**Construa um ótimo produto → os usuários chegam → a receita aparece.**

É um roteiro lindo. Tem três atos, um arco de herói e um final feliz. O problema é que ele quase nunca acontece. O roteiro real, o que estreia na vida da maioria, é outro:

**Construa um ótimo produto → ninguém fica sabendo → fecha as portas.**

Mesmo número de atos, final bem pior. Qualidade de produto é condição necessária, não suficiente. E essa distinção lógica, que a gente aprende em qualquer aula de matemática discreta, a gente esquece convenientemente na hora de empreender. Construir um produto que ninguém acessa é o equivalente comercial de gritar dentro de uma sala vazia com ótima dicção.

Os números do mercado de quem faz software sozinho confirmam isso de forma quase cruel: a esmagadora maioria dos projetos solo não morre por falta de produto, morre por falta de gente sabendo que o produto existe. O desenvolvedor médio gasta dezenas de horas automatizando o produto e umas poucas horas pensando em como achar cliente. Em 2026, com construir ficando trivial, esse desequilíbrio deixou de ser um detalhe e virou a causa da morte.

## Se a Anthropic precisa vender, você também precisa

Aqui vai o argumento que mais me convenceu, porque vem do lugar menos suspeito: a própria fabricante do Claude Code.

A Anthropic está numa receita anual na casa de US$ 14 bilhões, e a parte de **enterprise + API representa 80% disso**. Quem sustenta a empresa não é o consumidor final clicando no Claude.ai: é a oferta de API e os contratos corporativos. O produto voltado ao usuário comum é uma fração do todo.

E o Claude Code em si? Sozinho, ele chegou a um run rate anual de US$ 2,5 bilhões. Número de respeito. Só que esse número não brotou da genialidade técnica isolada. Ele foi construído em cima de **conquistas de venda corporativa**: a expansão de uso em empresas como a Palo Alto Networks, a integração com a Salesforce, parcerias e equipe comercial. A "capacidade de vender", essa coisa que a tecnologia sozinha não explica, é o que segura a receita de pé.

Sacou a ironia? A ferramenta que tornou construir trivial é vendida por uma empresa que monta rede de parceiros, certifica arquitetos e escala time comercial agressivamente. Quem fabrica a picareta sabe que a picareta não vende a mina sozinha. Se a empresa que está deixando você construir de graça precisa de uma máquina de vendas para faturar, qual é exatamente o seu plano para o seu SaaS de fim de semana? "Construí, agora torço"?

## Quatro jogadas para quem está sozinho

Não vou só apontar o problema e ir embora; isso seria o equivalente a fazer um `throw` sem `catch`. Eis quatro estratégias para a era em que uma pessoa só constrói um SaaS num fim de semana.

**1. Mire em nichos que os grandes ignoram.** Gestão de agendamento de clínica odontológica. Controle de envio para gráfica de fanzine. Registro de tarefa de quem trabalha no campo. Mercados pequenos demais para uma grande equipe se importar. Com Claude Code você lança em uma semana, então o gargalo nunca é construir o produto: é achar o mercado. Inverta a sua energia de acordo com isso.

**2. Gaste o seu tempo "vendendo".** O desenvolvimento tradicional de um SaaS por um engenheiro era 80% desenvolvimento, 15% marketing, 5% vendas. Na era do Claude Code, vira 20% desenvolvimento, 40% marketing, 40% vendas. Reler essa linha dói, eu sei. Você não estudou estrutura de dados para passar 80% do dia escrevendo post e respondendo cliente. Eu também não. Mas a conta não liga para o nosso orgulho.

**3. Diferencie-se com conhecimento de domínio.** A tecnologia está acessível para todo mundo, e esse é justamente o problema. O que a IA não replica fácil é o conhecimento de quem viveu o problema por dentro. Quando trabalhei com robótica, mesmo conseguindo implementar SLAM, eu não conseguia construir um produto útil sem entender como o robô é realmente usado numa casa de cuidado de idosos. Esse tipo de saber é fosso de verdade, porque não cabe num prompt.

**4. Comece a partir de uma comunidade.** Ache um grupo com um problema específico, entenda a dor a fundo, construa um MVP com Claude Code dentro de uma semana e recrute os primeiros usuários de teste ali mesmo. Esse ritmo — comunidade primeiro, código depois — é a linha de vida de quem está sozinho.

## Um banho de água fria nos números

Seria desonesto encerrar com fogos de artifício, então deixa eu jogar a água fria que eu gostaria que alguém tivesse jogado em mim.

Aquele MRR de ¥ 6 milhões do Meito é **top-tier**. É o teto, não o ponto de partida. Mirar nele de saída é como abrir o terminal pela primeira vez querendo reescrever o kernel do Linux.

A meta realista para o primeiro ano de um SaaS solo é bem mais modesta: MRR entre ¥ 100K e ¥ 500K (algo entre US$ 700 e US$ 3.500 por mês), de 20 a 100 clientes, com churn de 3 a 8% ao mês. Não é manchete. É um negócio pequeno e real, que paga uma parte das contas e cresce devagar se você não desistir antes do fim do ano (e a maioria desiste).

A boa notícia esconde-se exatamente no ponto onde a gente começou: como o Claude Code leva o custo de desenvolvimento para perto de zero, a margem de lucro fica mais alta do que era na geração anterior de fundadores solo. Você fatura modesto, mas gasta quase nada para construir. O dinheiro que sobra é o que sobra de verdade.

## O que mudou, em uma frase

Construir era o gargalo. O Claude Code dissolveu esse gargalo, e ele não evaporou: ele andou. Foi parar em distribuição e venda, justo o terreno onde o engenheiro médio é mais fraco e mais teimoso. A vantagem competitiva migrou de "eu consigo construir isto" para "eu consigo fazer as pessoas certas usarem isto".

Eu ainda passo fim de semana construindo, porque eu gosto. Mas parei de fingir que o código é a parte difícil. A parte difícil é a outra — a que não tem syntax highlighting, não dá erro de compilação e não tem um agente que faça por mim. Ainda.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
