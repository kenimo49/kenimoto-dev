---
title: "Por que toda code review vira briga: 5 vieses psicológicos que sabotam seu PR"
description: "Eu fazia review em 30 segundos e achava que estava ajudando. Aí medi os meus próprios comentários por 30 dias e descobri que eu estava sendo o gatilho de metade das brigas. Aqui estão os 5 vieses psicológicos que aparecem em toda code review, com um número em reais por PR para cada um."
date: 2026-05-23
lang: pt
tags: [code-review, psicologia, engenharia, time, pull-request]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/code-review-vira-briga-5-vieses-psicologicos/"
og_image: "https://kenimoto.dev/images/blog/code-review-vira-briga-5-vieses-psicologicos/og-pt.png"
cross_posted_to: []
---

Eu fazia code review em 30 segundos. Lia o diff, comentava "lgtm" ou "vamos discutir isso aqui", apertava aprovar, voltava para o que eu estava fazendo. Achava que estava ajudando. Aí passei 30 dias salvando todos os comentários que eu deixava nos PRs do meu time, classifiquei cada um por categoria psicológica, e descobri que eu era o gatilho de pelo menos metade das brigas que aconteciam depois.

Esse post não é sobre como fazer review melhor em geral. É sobre os 5 vieses psicológicos específicos que aparecem em toda code review entre engenheiros, com um número em reais por PR para cada um. Os números são estimativas do meu próprio time, mas a estrutura é genérica o suficiente para você fazer a sua conta.

![5 vieses psicológicos em code review, com cena de PR típica e técnica de mitigação para cada um](/images/blog/code-review-vira-briga-5-vieses-psicologicos/5-vieses-grid.png)

Aviso: esse texto trata de comportamento entre pessoas em um contexto de trabalho. Os exemplos são tipificados, não são apontamentos a colegas específicos. Se você se reconhece em mais de um dos 5, parabéns, somos dois.

## Viés 1: confirmação — você encontra o que veio procurar

Viés de confirmação na code review é quando o revisor abre o PR já com uma hipótese do tipo de erro que vai encontrar, e encontra. Não porque o erro está lá, mas porque ele filtrou o diff inteiro pela lente de "onde está o erro que eu esperava".

A cena típica: o tech lead avisa no daily que "estamos com problemas de performance esta semana". Aí o PR de qualquer pessoa que mexer em uma query no resto do dia vai ser revisado pela ótica de performance. Outros problemas, segurança, legibilidade, cobertura de teste, passam batidos. O revisor acha que fez uma boa review porque encontrou o que veio procurar.

Como sair: usar um checklist antes de abrir o PR. Não um checklist exaustivo de 40 itens (esse ninguém usa), um checklist de 4 a 5 categorias. Performance, segurança, legibilidade, cobertura. Forçar o seu olho a passar por cada categoria pelo menos uma vez antes de comentar qualquer coisa. Isso te custa uns 90 segundos a mais por PR. No meu time, com 30 PRs por semana e o salário médio do dev em R$ 80/hora, esse 90 segundos extra equivale a uns R$ 60/semana de tempo investido. Em troca, o número de bugs achados em produção que "passaram pelo review" cai pela metade. A conta fecha rapidinho.

## Viés 2: ancoragem — o primeiro comentário define a review inteira

Ancoragem é o fenômeno em que o primeiro número (ou primeira frase) que entra na conversa puxa todo o resto da conversa naquela direção. Na code review, o primeiro comentário do primeiro revisor ancora toda a thread.

Se o primeiro comentário é "esse nome de variável está estranho", os próximos 4 comentários vão ser sobre naming. Se o primeiro comentário é "essa função está fazendo coisas demais", os próximos 4 vão ser sobre design. O conteúdo real do PR fica em segundo plano. O primeiro comentarista determinou o tom.

A diferença prática: na minha experiência, leva uns 4 minutos para um PR pequeno sair da fase "todo mundo está comentando sobre a primeira coisa que apareceu" e voltar a olhar o diff inteiro. Esses 4 minutos vezes 30 PRs por semana, vezes R$ 80/hora, é R$ 160/semana de tempo que sumiu por ancoragem. Por mês, R$ 640.

Como mitigar do lado do revisor: se você é o primeiro a abrir o PR para review, gaste 30 segundos lendo o diff inteiro antes de comentar a primeira coisa. O comentário de abertura deve ser sobre o ponto mais importante, não sobre o primeiro ponto que você notou.

Como mitigar do lado de quem abriu o PR: na descrição do PR, escreva 2 linhas dizendo onde você quer atenção dos revisores. "Estou preocupado com o tratamento de erro do método X. Não me preocupo com naming nessa rodada, vou ajustar depois se precisar." Isso pré-ancora a conversa nos pontos que importam.

## Viés 3: heurística da disponibilidade — o último bug vira o próximo bug

Heurística da disponibilidade é a tendência de avaliar a probabilidade de um evento pela facilidade com que você lembra de exemplos dele. Aplicado a code review: o bug mais recente que aconteceu na sua codebase vira o tipo de bug que você vai procurar nos próximos 10 PRs.

A semana que tivemos um incidente de connection pool, todo PR que tocou em código de banco recebeu pelo menos um comentário sobre pool. Boa parte desses comentários eram desnecessários, o código nem chegava perto do pool. Mas o pool estava "disponível" na minha cabeça, então eu via pool em todo lugar.

Esse viés tem um efeito colateral perverso: você fica bom em prevenir o último bug e cego para o próximo. Ele já aconteceu, então não vai acontecer de novo na mesma forma. O próximo bug vai vir de uma classe diferente, que você não está procurando.

Como mitigar: no checklist do viés 1, incluir uma linha "o último incidente foi sobre X. Vou conferir X, mas vou também olhar 2 outras categorias que NÃO são X". Forçar a si mesmo a sair do trilho mental do bug mais recente.

## Viés 4: viés de status (autoridade) — o sênior pesa 3x mais

Viés de status é quando o nome de quem escreve o comentário pesa mais do que o conteúdo do comentário. Na code review: um comentário do tech lead é aceito praticamente sem discussão, e um comentário equivalente de um dev pleno gera contra-argumento de 4 trocas.

No meu time, fiz uma medição informal por 30 dias. Comentário do sênior: tempo médio até "ok, vou mudar" = 90 segundos. Comentário do pleno apontando exatamente a mesma coisa: tempo médio até "ok, vou mudar" = 4 minutos e meio, com 2 a 3 trocas no meio. Empiricamente, um comentário de sênior pesa cerca de 3x mais do que um equivalente de pleno.

A pesquisa do Meta de 2023 já tinha registrado um efeito parecido em larga escala: quando há uma pessoa com autoridade entre os revisores, os outros revisores aprofundam menos a própria revisão. "Se o sênior já olhou, deve estar bom". É o efeito espectador (bystander) aplicado a PR.

O custo disso é duplo. Por um lado, o time aceita rapidamente o que o sênior diz, mesmo quando o sênior está cansado e errado. Por outro, o pleno desiste de apontar coisas porque sabe que o esforço de defender o argumento é alto.

Como mitigar do lado do sênior: comentar em forma de pergunta, não de afirmação. "Aqui é intencional?" abre diálogo, "isso está errado" fecha. Como mitigar do lado do time: criar uma regra de que comentários de QUALQUER revisor precisam ser endereçados antes do merge, e que "o sênior já aprovou" não substitui revisão própria.

## Viés 5: retrospectivo — depois do merge, "eu sabia"

Viés retrospectivo é o "eu sabia que ia dar problema" que aparece sempre depois que o bug é encontrado, mas nunca antes. Aplicado a code review: depois que o PR causa um incidente, todo mundo na thread original "lembra" que tinha um sinal de alerta. Antes do incidente, ninguém comentou nada.

Esse é o viés mais traiçoeiro dos cinco porque ele apaga o aprendizado real. Se "eu sabia desde o começo", então não houve falha no processo de review, foi falha individual de quem escreveu o código. Aí o time não muda nada estruturalmente, e o mesmo tipo de bug aparece em outro PR em 3 semanas.

Como mitigar: depois de qualquer incidente que tenha origem em um PR mergeado, voltar ao PR e contar literalmente quantos comentários haviam sido feitos sobre a área que causou o incidente. Se a resposta for zero, o aprendizado é "nosso review não cobre essa área". Se a resposta for 2 e foram resolvidos com "tá bom, depois eu ajusto", o aprendizado é "nosso processo deixa comentários importantes virarem to-do". Em nenhuma das duas opções a conclusão é "eu sabia".

Eu uso um pequeno ritual: na retro do sprint que teve incidente, abrir o PR causador na frente do time e ler os comentários em voz alta. Faz a memória reconstruída ("eu sabia") ceder lugar à memória real ("ninguém comentou nada sobre isso").

## A conta total

Somando os 5 vieses no meu time, com 30 PRs por semana, salário médio R$ 80/hora, e os tempos perdidos que medi por 30 dias:

| Viés | Custo semanal estimado |
|------|------------------------|
| Confirmação (ausência de checklist) | R$ 60 |
| Ancoragem (4 min/PR em conversa errada) | R$ 160 |
| Disponibilidade (PRs com comentários irrelevantes) | R$ 80 |
| Status/autoridade (re-discussão até pleno ser ouvido) | R$ 200 |
| Retrospectivo (não-aprendizado por incidente) | R$ 100/incidente |

A soma é da ordem de **R$ 500 a R$ 600 por semana** em tempo de equipe perdido para vieses psicológicos em code review. Por mês, mais de R$ 2.000. Por ano, R$ 24.000+. E essa é só a parte mensurável em tempo; não conta as brigas, o desgaste de confiança entre sênior e pleno, ou os bugs que passaram porque o checklist não foi seguido.

Eu fazia review em 30 segundos e achava que estava ajudando. Depois de medir os 5 vieses no meu próprio histórico, descobri que era eu o causador de metade das brigas. Os 30 dias que passei medindo deram um número, e o número doeu o suficiente para eu mudar o jeito de comentar. Não é mais 30 segundos, é uns 4 minutos. E os PRs param de virar briga.

Esse capítulo é parte de um livro maior em PT-BR sobre psicologia aplicada à engenharia: **[Manual completo dos truques psicológicos para engenheiros](https://kenimoto.dev/pt/books/engineer-psychology-tricks?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=code-review-vira-briga-5-vieses)**. O capítulo 8 é especificamente sobre code review. Aqui eu peguei só os 5 vieses, do meu jeito, com os números do meu time.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
