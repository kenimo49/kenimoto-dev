---
title: "RAG só busca. GraphRAG raciocina. Como o LinkedIn cortou 28,6% do tempo de suporte"
description: "Vector RAG é ótimo para achar texto parecido, mas trava quando a resposta depende de relações. O caso do LinkedIn mostra o salto: tempo mediano de resolução -28,6% e MRR +77,6% em produção."
date: 2026-06-09
lang: pt
tags: [graphrag, knowledge-graph, rag, ia, enterprise]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/graphrag-raciocina-linkedin-suporte/"
og_image: "https://kenimoto.dev/images/blog/graphrag-raciocina-linkedin-suporte/og-pt.png"
cross_posted_to: []
---

Passei um bom tempo defendendo o Vector RAG como se fosse a resposta para tudo. Montei o pipeline, gerei os embeddings dos documentos, fiz a busca por similaridade funcionar e me senti um gênio. Aí veio a primeira pergunta de verdade do usuário: "esse erro de pagamento tem a ver com aquele bug de autenticação que vocês corrigiram mês passado?". O sistema me devolveu três trechos de FAQ que falavam de pagamento. Nenhum deles sabia que os dois problemas estavam ligados. O Vector RAG tinha achado texto parecido. Eu queria que ele tivesse raciocinado sobre uma relação. São coisas diferentes, e eu levei tempo demais para aceitar isso.

Esse artigo é sobre essa diferença, e sobre um caso do LinkedIn que coloca número em cima dela.

![Comparação entre Vector RAG (busca por similaridade) e GraphRAG (raciocínio sobre relações), com os números do LinkedIn: tempo mediano de resolução -28,6%, MRR +77,6%, 6 meses em produção](/images/blog/graphrag-raciocina-linkedin-suporte/graphrag-vs-vector-rag.png)

## Vector RAG busca. E busca muito bem.

Vou dar o crédito que o Vector RAG merece, porque ele merece bastante. Você pega seus documentos, transforma cada pedaço em um vetor, e na hora da pergunta você procura os pedaços mais próximos no espaço vetorial. É rápido, é barato de manter, e para "me ache os documentos que falam sobre o tema X" funciona quase sempre.

O modelo mental que ajuda: o Vector RAG mede **distância**. Pergunta e resposta ficam perto no espaço se as palavras e os conceitos forem parecidos. Quando a sua dúvida é semântica ("o que é GraphRAG?"), proximidade é exatamente o que você quer.

```python
# Vector RAG: similaridade pura
query_vec = embed("erro de pagamento recusado")
resultados = index.search(query_vec, top_k=3)
# devolve os 3 trechos mais "parecidos" com a pergunta
# e para no exato momento em que você precisa de uma relação
```

O problema não é o Vector RAG ser ruim. O problema é que metade das perguntas reais de uma empresa não pede proximidade, pede conexão.

## Onde a busca por similaridade trava

Pensa no ticket de suporte de verdade. O usuário abre um chamado descrevendo um sintoma. Você, atendente humano, não procura na sua cabeça o ticket com as palavras mais parecidas. Você lembra que esse sintoma costuma vir depois de uma mudança específica, que já apareceu em três clientes do mesmo segmento, e que a correção mexe num módulo que tem dependência com outro. Você está navegando **relações**, não medindo distância de texto.

O Vector RAG não tem essa estrutura. Cada trecho é uma ilha. "Problema A causa problema B", "ticket X é pré-requisito de Y", "essa falha encadeia naquela outra": nada disso vive no embedding. Ele foi recortado fora na hora em que você picou o documento em chunks.

Um número ajuda a enxergar o tamanho do buraco. Em benchmarks de pergunta multi-salto (onde a resposta exige juntar dois ou três fatos ligados), levantamentos de 2026 mostram a recuperação baseada em grafo chegando perto de 86% de acerto enquanto o Vector RAG fica na casa dos 32%. Na busca semântica simples os dois empatam. A diferença aparece exatamente quando a pergunta deixa de ser "ache parecido" e vira "raciocine sobre a relação". ([SIGIR 2024, LinkedIn](https://arxiv.org/abs/2404.17723) traz o caso de produção; comparativos de multi-salto em [levantamentos de arquitetura RAG 2026](https://www.techment.com/blogs/rag-architectures-enterprise-use-cases-2026/).)

E aqui entra um detalhe brasileiro que dói: a gestão de conhecimento na maioria das empresas que eu vi é uma bagunça honesta. Tem Wiki, tem Confluence, tem aquela planilha que só a Camila entende, tem o canal do Slack que ninguém mais rola pra cima. O conhecimento existe. O que não existe é o mapa de como uma coisa puxa a outra. "Pergunta pro fulano que ele sabe" é o knowledge graph mais usado do país, e ele pede demissão sem dar deploy.

## GraphRAG: a estrutura que o embedding jogou fora

GraphRAG é Knowledge Graph mais RAG. A ideia, sem firula: em vez de só guardar pedaços de texto, você guarda **entidades** (problema, causa, solução, cliente, módulo) e as **arestas** entre elas (causa, depende de, é parecido com, é pré-requisito de). Na hora da pergunta, você não pega só os trechos parecidos. Você pega um pedaço do grafo: a entidade relevante e a vizinhança dela.

```python
# GraphRAG: recupera uma subestrutura, não trechos soltos
entidade = grafo.localizar("erro de pagamento recusado")
subgrafo = grafo.vizinhanca(entidade, profundidade=2)
# subgrafo agora carrega:
#  - a causa provável
#  - o bug de autenticação ligado por aresta "causa"
#  - os tickets que já encadearam essa falha
contexto = subgrafo.para_texto()
resposta = llm.gerar(pergunta, contexto)
```

A virada mental é essa: o Vector RAG entrega os documentos, e o LLM tem que adivinhar como eles se conectam. O GraphRAG entrega a conexão já montada, e o LLM só precisa redigir. A relação parou de ser um chute do modelo e virou um dado recuperável.

Não vou vender milagre, porque não é. Construir o grafo custa: você precisa extrair entidades e relações dos documentos, e isso normalmente passa por chamadas de LLM, que custam dinheiro e tempo. A primeira indexação de um corpus grande chegou a sair na faixa de dezenas de milhares de dólares nas abordagens iniciais. Em 2026 já tem variante que adia parte desse trabalho para a hora da consulta e derruba o custo para alguns dólares por corpus, mas o ponto continua: GraphRAG é mais caro de montar que Vector RAG. Você paga adiantado pela estrutura. A pergunta certa não é "qual é melhor", é "essa pergunta precisa de relação ou só de proximidade?".

## O caso LinkedIn: número, não opinião

Aqui está a parte que me fez parar de discutir e começar a medir.

O time de suporte ao cliente do LinkedIn construiu um sistema de KG mais RAG em cima do histórico de tickets. Em vez de tratar cada ticket passado como um chunk solto, eles montaram um grafo que preserva duas coisas: a **estrutura interna** de cada chamado (categoria do problema, passos de resolução, FAQ ligada) e as **relações entre chamados** (problemas parecidos, pré-requisitos, falhas que encadeiam). Na hora de um ticket novo, o sistema recupera o subgrafo relevante e entrega esse contexto para o LLM responder.

Os resultados, depois de cerca de 6 meses rodando em produção de verdade:

- **Tempo mediano de resolução por chamado: 28,6% menor.**
- **MRR (Mean Reciprocal Rank): 77,6% acima da linha de base.**
- Ganho também em BLEU na qualidade das respostas.

Vou traduzir o MRR, porque ele é o herói discreto dessa história. MRR mede o quão alto a resposta certa aparece na lista. Subir 77,6% quer dizer que o atendente para de rolar a tela atrás da solução: ela já chega lá em cima. E o tempo mediano cair 28,6% é o reflexo prático disso na vida de quem está do outro lado do chat esperando.

O dado vem do paper publicado pelos pesquisadores do LinkedIn na SIGIR 2024 ([arXiv:2404.17723](https://arxiv.org/abs/2404.17723)). Não é slide de fornecedor. É produção, com linha de base e com seis meses de chão.

O detalhe que eu mais gosto: o ganho não veio de um modelo maior nem de um embedding mais esperto. Veio de **parar de jogar fora a relação entre os tickets**. A informação sempre esteve lá. O Vector RAG só não tinha onde guardá-la.

## Como eu decido hoje

Depois de apanhar, minha régua ficou simples e quase decepcionante de tão direta:

- A pergunta é "ache o documento que fala sobre X"? Vector RAG. Não complica.
- A pergunta é "como X se conecta com Y, e isso já aconteceu antes em situação parecida"? Aí o grafo paga o próprio custo.
- Não sabe? A indústria em 2026 está convergindo para **híbrido**: Vector RAG para puxar o contexto narrativo, grafo para percorrer as relações estruturadas. Os dois no mesmo pipeline, cada um fazendo o que faz bem.

E tem o passo zero, que é o mais brasileiro de todos: antes de sonhar com grafo, alguém precisa decidir que "pergunta pro fulano" não é arquitetura de conhecimento. O GraphRAG não conserta uma base bagunçada sozinho. Ele dá estrutura para um conhecimento que a equipe topou estruturar. A ferramenta é boa. Mas ela continua precisando que você acesse o problema certo primeiro.

## Resumo

- Vector RAG mede proximidade de texto e é ótimo para busca semântica. Ele trava quando a resposta depende de uma relação, porque a relação foi recortada fora na hora do chunking.
- GraphRAG guarda entidades e as arestas entre elas, então recupera a conexão já montada em vez de deixar o LLM adivinhar.
- O LinkedIn provou em produção: 28,6% a menos no tempo mediano de resolução e MRR 77,6% acima da linha de base, em cerca de 6 meses, segundo o paper da SIGIR 2024.
- O custo de construir o grafo é real. A decisão certa é por pergunta: proximidade pede Vector RAG, relação pede grafo, e na dúvida o híbrido virou o padrão de 2026.

Comecei esse texto confessando que defendi o Vector RAG demais. Vou fechar admitindo o resto: eu não troquei de lado, eu só parei de pedir para uma ferramenta de busca fazer o trabalho de raciocínio. Buscar e raciocinar são verbos diferentes. O LinkedIn botou 28,6% em cima dessa frase, e eu finalmente parei de discutir.

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
