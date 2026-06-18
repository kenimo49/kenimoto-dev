---
title: "95% do conhecimento da sua empresa mora na cabeça de um veterano: como a Meta transformou o tácito em grafo"
description: "Dizem que conhecimento tácito não dá para estruturar, que o 'feeling' do veterano é insubstituível. A Meta provou o contrário: pegou pipelines de dado espalhados em 4.100 arquivos, onde a IA enxergava só 5% do contexto, e subiu essa cobertura para 100% com um enxame de mais de 50 agentes. Eu li o caso inteiro e trago os números, o que dá para copiar e onde mora a pegadinha."
date: 2026-06-19
lang: pt
tags: [knowledge-graph, agentes-ia, conhecimento-tacito, meta, engenharia]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/conhecimento-tacito-grafo-meta/"
og_image: "https://kenimoto.dev/images/blog/conhecimento-tacito-grafo-meta/og-pt.png"
cross_posted_to: []
---

Vou começar pela frase que todo mundo repete e na qual eu também acreditava: "conhecimento tácito não dá para estruturar". O feeling do veterano, o "por que esse valor de config é 42", a intuição de saber qual serviço cai primeiro quando a API engasga. Isso, dizem, mora na cabeça da pessoa e morre com a saída dela. Eu defendi essa ideia em reunião com cara de quem entende. Estava errado, e a Meta acabou de mostrar o quanto.

Antes de chegar nos números, deixa eu descrever a cena que todo time já viveu. O engenheiro mais antigo pede demissão. No último dia, ele sobe no compartilhamento um PDF de 50 páginas de "handover" com a frase mágica "ver a implementação para mais detalhes". Você abre o arquivo: a última atualização é de três anos atrás. O conhecimento que mantinha o sistema de pé acabou de sair pela porta com um crachá devolvido. A gente sempre tratou isso como uma lei da natureza. A Meta tratou como um problema de engenharia.

![Uma cabeça de veterano representando 95% do conhecimento de um lado, e do outro um grafo estruturado com 50 agentes preenchendo de 5% para 100% a cobertura de contexto](/images/blog/conhecimento-tacito-grafo-meta/og-pt.png)

## O número que muda a conversa: 5% para 100%

Em abril de 2026, a engenharia da Meta publicou [como mapeou o conhecimento tribal de pipelines de dado em larga escala](https://engineering.fb.com/2026/04/06/developer-tools/how-meta-used-ai-to-map-tribal-knowledge-in-large-scale-data-pipelines/). A escala do problema é o tipo de coisa que dá um frio na barriga: pipelines de dado espalhados em mais de 4.100 arquivos, em três repositórios. E o detalhe que importa de verdade: os agentes de IA da empresa enxergavam cerca de **5%** do contexto necessário para mexer nesse código.

Pare um segundo nesse 5%. Ele quer dizer que 95% do que era preciso saber para operar aquilo não estava em nenhum documento, em nenhum comentário de código, em nenhum arquivo. Estava na cabeça de engenheiros veteranos, em forma de "ah, isso aí você não mexe porque quebra o job da madrugada". Esse é o conhecimento tácito, e o número dele aqui é brutal: 95% do total.

A Meta construiu um enxame de mais de **50 agentes de IA especializados**, cada um lendo cada arquivo e extraindo um pedaço do conhecimento. O resultado é o que faz esse caso valer a leitura.

| Indicador | Antes | Depois |
|-----------|-------|--------|
| Cobertura de contexto da IA | ~5% | **100%** |
| Chamadas de ferramenta por tarefa | linha de base | **40% menos** |
| Arquivos cobertos | parcial | 4.100+ (todos) |

Os agentes produziram 59 arquivos de contexto concisos, codificando o conhecimento que antes só existia na cabeça das pessoas, e ainda documentaram mais de 50 "padrões não óbvios", aquelas decisões de design que você não consegue deduzir lendo o código. A cobertura saiu de 5% para 100%. O tácito virou grafo.

## Por que isso não é "mais um caso de RAG"

Aqui eu preciso te parar, porque a tentação é encaixar isso na gaveta de RAG que você já conhece. Não é a mesma coisa, e a diferença é o ponto inteiro.

Quando eu escrevi por aqui sobre [GraphRAG e o suporte do LinkedIn](https://kenimoto.dev/pt/blog/graphrag-raciocina-linkedin-suporte/) ou sobre [como apaguei meu RAG e o grep venceu](https://kenimoto.dev/pt/blog/construi-rag-deletei-grep-venceu/), o assunto era **recuperação**: dado um ticket ou uma pergunta, achar o pedaço certo de informação que já estava escrito em algum lugar. RAG é um problema de busca sobre conhecimento explícito.

O caso da Meta é outro animal. Não se trata de buscar melhor o que já está documentado. Trata-se de **transformar em explícito um conhecimento que nunca foi escrito**. O input não é uma base de documentos: é o silêncio de 4.100 arquivos sobre os quais ninguém nunca anotou a intenção. Os agentes não estão recuperando, estão entrevistando o código e estruturando a resposta. É a diferença entre procurar uma chave num quarto bagunçado e desenhar a planta de uma casa que nunca teve planta.

## A receita, sem o marketing

Lendo o caso de perto, o que a Meta fez foi dividir o trabalho de extração por tipo de fonte, e isso é a parte copiável. Cada agente tinha uma especialidade:

- **Agente de código**: extrai a intenção de design a partir do código-fonte
- **Agente de documento**: mapeia a relação entre os documentos que já existem
- **Agente de log operacional**: estrutura o conhecimento tácito de resposta a incidente
- **Agente de entrevista**: extrai o conhecimento do veterano em formato de pergunta e resposta

Repara que nenhum agente tenta abraçar o problema inteiro. Cada um ataca uma fatia estreita, e o grafo nasce da soma. Essa é a lição de engenharia que vale mais que o número bonito: você não estrutura 95% de conhecimento tácito com um prompt gigante e um modelo esperto. Você estrutura com escopo limitado, várias passadas e revisão humana no meio. A própria Meta deixa o sistema se manter sozinho: a cada poucas semanas, jobs automáticos validam caminhos de arquivo, detectam lacunas de cobertura e corrigem referências que ficaram velhas.

E tem um detalhe que eu adorei pela honestidade: o ganho de 40% menos chamadas de ferramenta. Quando o agente já sabe onde as coisas estão, ele para de tatear. Menos tentativa e erro, menos token queimado. O conhecimento estruturado não serve só para o humano novo que entra; serve para a própria IA gastar menos para fazer mais.

## O que isso significa para a sua empresa (e a pegadinha)

Você não tem o orçamento da Meta para soltar 50 agentes no seu monorepo amanhã. Tudo bem, ninguém tem. Mas a parte transferível não é a escala, é a sequência. Comece por um departamento, um processo, um repositório. Faça o inventário do que existe espalhado no Slack, no Jira, no Confluence. Desenhe a ontologia junto com quem entende do domínio. Deixe o LLM extrair entidade e relação, e então revise à mão antes de confiar. O caminho é começar pequeno e crescer por iteração, não atacar a empresa toda de uma vez.

A pegadinha, porque sempre tem uma, é achar que isso elimina o veterano. Não elimina. O agente de entrevista só funciona porque existe um veterano para entrevistar. O que muda é que o conhecimento dele para de ser refém de uma única cabeça e de um único aviso prévio. No dia em que ele sair, o handover não vai ser um PDF de 50 páginas desatualizado. Vai ser um grafo que a IA já está usando para gastar 40% menos esforço. O veterano continua valioso; o que morre é a dependência de que ele esteja online às duas da manhã quando o job quebra.

A frase com que eu abri, de que conhecimento tácito não dá para estruturar, tem um problema: ela é confortável. Ela te dá uma desculpa para nunca tentar. O caso da Meta tira essa desculpa da mesa. Não é que o tácito seja impossível de estruturar; é que estruturar dá trabalho, e a gente preferia acreditar que era impossível. 5% para 100% é o tamanho do trabalho que a gente vinha empurrando com a barriga.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
