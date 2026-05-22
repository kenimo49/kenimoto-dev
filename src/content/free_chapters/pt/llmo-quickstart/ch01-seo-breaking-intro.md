---
title: "O Dia em que o SEO Quebra — Três Caminhos para a IA Encontrar Seu Conteúdo"
---

> **Seus esforços de SEO: a IA não está olhando.**

## Introdução: Por que LLMO Agora?

Sou engenheiro de software com 8 anos de experiência e hoje trabalho com desenvolvimento e operação de agentes de IA. Um dia percebi que, quando meu agente de IA buscava informação, ele estava usando o **Brave Search**, não o Google.

Foi um choque. O buscador para o qual eu vinha otimizando com SEO era completamente diferente do buscador que a IA realmente usava.

Investigando mais a fundo, vi que isso não era exclusividade do meu agente. O Claude da Anthropic usa Brave Search, o ChatGPT usa Bing e o Gemini usa Google Search como backends de busca. Cada ferramenta de IA roda em cima de uma infraestrutura de busca diferente.

Mais importante ainda, o próprio comportamento do usuário está mudando.

- **52%** dos adultos americanos usam LLMs de IA como ChatGPT (pesquisa Elon University, março/2025)
- O Gartner prevê que **o tráfego de buscadores tradicionais vai cair 25% até 2026** (anúncio de fevereiro/2024)
- O CTR do primeiro resultado do Google **caiu 34,5%** quando a AI Overview é exibida (pesquisa Ahrefs)

De "10 links azuis" para "1 resposta da IA". Essa mudança não tem volta. Quando o usuário experimenta "a IA me dá a resposta na hora", ele não regride.

A técnica de otimização para essa nova era é o **LLMO (Large Language Model Optimization)**.

## O que é LLMO?

LLMO é a técnica de otimizar seu conteúdo para ser referenciado e citado nas respostas de grandes modelos de linguagem como ChatGPT, Claude, Gemini e Perplexity.

Enquanto o SEO tradicional buscava "rankear no topo das páginas de resultado do Google", o LLMO busca "ser citado como fonte de informação dentro das respostas da IA".

Vou esclarecer alguns termos parecidos:

- **LLMO**: Large Language Model Optimization. É o termo que este livro adota.
- **GEO (Generative Engine Optimization)**: otimização para engines de IA generativa em geral. No meio acadêmico, é a forma padrão.
- **AIO (AI Optimization)**: otimização para IA de modo geral. Relativamente comum no Japão.
- **AEO (Answer Engine Optimization)**: otimização para motores de resposta. Conceito um pouco mais restrito que o GEO.

Na prática, todos esses termos querem dizer a mesma coisa: "otimizar para que seu conteúdo seja citado dentro das respostas da IA".

## SEO Não Morre, mas SEO Sozinho Não Basta

![SEO vs LLMO: diferença fundamental](/images/books/llmo-quickstart/llmo-quickstart-pt-ch01-fig1-seo-vs-llmo.png)

Antes de tudo, uma coisa importante: **SEO não morre**.

O Google ainda tem cerca de 90% da participação de mercado em busca. Acontece que o tráfego que chega via IA é de uma qualidade várias ordens de magnitude maior.

- Visitantes vindos de LLM podem ter taxa de conversão até **23 vezes maior** que a busca orgânica (pesquisa Ahrefs)
- Taxa de conversão via IA é de **11,4%**, contra **5,3%** da busca orgânica (SimilarWeb)
- O tráfego de referência vindo de IA cresceu **357% ano a ano** (SimilarWeb)

Volume baixo, qualidade altíssima. Esse é o perfil do tráfego de busca por IA. E esse "volume" vem crescendo na casa de centenas de porcento ao ano.

**Some LLMO ao SEO**. Essa é a estratégia básica para difusão de informação na web daqui para frente.

## Os Três Caminhos para a Informação Chegar até os LLMs

![Os três caminhos pelos quais a IA encontra seu conteúdo](/images/books/llmo-quickstart/llmo-quickstart-pt-ch01-fig2-tres-caminhos.png)

O mais importante para entender LLMO é "como os LLMs ficam sabendo do seu conteúdo". Existem três caminhos principais.

### Caminho 1: Dados de Treinamento (Longo prazo: 6 meses a 2 anos para surtir efeito)

LLMs como GPT-4 e Claude são pré-treinados em datasets massivos de texto. A informação incluída nesses dados de treinamento vira a "memória" do modelo.

O ponto importante é que **nem toda página web recebe o mesmo peso**. Nos dados de treinamento do GPT-3, Wikipedia e WebText2 (links de posts do Reddit com 3 ou mais upvotes) receberam **peso de treinamento 5 a 6 vezes maior**.

Ou seja, conteúdo que as comunidades do Reddit consideram "valioso" fica gravado com força na memória do LLM.

Por outro lado, dados de treinamento têm data de corte. Conteúdo publicado hoje só será refletido, no melhor cenário, daqui a vários meses. Por isso esse caminho é "longo prazo".

### Caminho 2: RAG (Médio prazo: 1 a 3 meses para surtir efeito)

RAG (Retrieval-Augmented Generation) é o mecanismo em que o LLM faz buscas web em tempo real para complementar informação que não está na sua "memória" e, em cima do que recuperou, gera a resposta.

O "Browse with Bing" do ChatGPT, a busca web do Perplexity, o Google AI Overviews: todos esses são RAG. **As URLs citadas nas respostas da IA chegam principalmente por esse caminho RAG.**

Um conceito particularmente importante dentro do RAG é o **Query Fan-out**. Quando o usuário faz uma única pergunta, o sistema de RAG internamente quebra essa pergunta em várias sub-queries para buscar.

Por exemplo, "Startups devem usar HubSpot?" se expande em sub-queries como:

- "preço do HubSpot para startup"
- "comparativo de alternativas ao HubSpot"
- "CRM recomendado para startup"

A análise do SurferSEO mostra que conteúdo que rankeia para sub-queries tem **49% mais chance de ser citado** do que conteúdo que rankeia só para a query principal. Ou seja, montar uma estrutura de conteúdo que pegue palavras-chave periféricas como "preço do HubSpot" e "alternativas ao HubSpot" aumenta bastante a probabilidade de ser escolhido para entrar na resposta da IA.

Outro ponto importante: os LLMs avaliam o conteúdo **por trechos (parágrafos), não por página inteira**. Mesmo que uma página rankeie em primeiro no SEO, se a resposta estiver enterrada no meio de um texto longo, a IA não vai citá-la. O contrário também vale: páginas com ranking SEO baixo podem ser citadas se algum parágrafo específico responder com precisão à pergunta.

### Caminho 3: Busca em Tempo Real por Agentes de IA (Imediato: 1 a 3 meses)

O terceiro caminho são as buscas independentes na web feitas pelos próprios agentes de IA.

A Microsoft descontinuou o acesso externo à Bing Search API em 2025, o que fez do **Brave Search praticamente a única opção** de API de busca independente. Claude, Perplexity e muitos assistentes de IA voltados a código usam a API do Brave Search.

O que importa aqui é que **o índice do Google é diferente do índice do Brave**. Páginas que estão em primeiro lugar no Google às vezes nem aparecem no Brave. Para capturar tráfego que vem via agente de IA, você precisa pensar também na visibilidade dentro do Brave Search.

## Prioridade de Otimização dos Três Caminhos

![Prioridade de otimização: custo vs velocidade vs impacto](/images/books/llmo-quickstart/llmo-quickstart-pt-ch01-fig3-priority-matrix.png)

Por onde começar? Eu recomendo a seguinte ordem de prioridade:

| Situação | Caminho prioritário | Tempo até surtir efeito |
|-----------|---------------|----------------|
| Já tenho bastante conteúdo | Caminho 2 (otimização para RAG) | 1 a 3 meses |
| Vou planejar conteúdo novo | Caminho 2 + Caminho 3 | 3 a 6 meses |
| Quero aumentar o reconhecimento de marca | Caminho 1 (dados de treinamento) | 6 meses a 2 anos |
| Opero ferramentas técnicas / OSS | Caminho 3 (busca por agente) | 1 a 3 meses |

A abordagem mais eficiente é **começar pela otimização do Caminho 2 (RAG) e ir expandindo para os Caminhos 3 e 1**. Melhorar a estrutura do conteúdo afeta todos os caminhos ao mesmo tempo.

## Por que Engenheiros Devem Fazer LLMO

Você pode pensar "Isso não é trabalho de marketing?". Não é. LLMO é, no fundo, um problema de engenharia.

- Entender a arquitetura dos LLMs
- Desenhar conteúdo levando em conta o Query Fan-out do RAG
- Implementar dados estruturados em JSON-LD
- Controlar crawlers de IA via `llms.txt` e `robots.txt`
- Automatizar monitoramento com script Python

Tudo isso pertence ao conjunto de habilidades de quem é engenheiro.

Além disso, nós engenheiros também somos partes interessadas no LLMO. Quando fazemos pesquisa técnica com o Claude Code ou comparamos bibliotecas no Perplexity, somos usuários de busca por IA. Ao mesmo tempo, quando escrevemos blogs técnicos ou documentação de OSS, somos também provedores de conteúdo para a busca por IA.

Engenheiros com essas duas perspectivas conseguem entender o LLMO e praticá-lo de forma mais eficaz.

## Resumo do Capítulo

- **Os agentes de IA fazem busca pelo Brave Search, não pelo Google**. As premissas do SEO estão ruindo
- **Três caminhos para a informação chegar até os LLMs**: dados de treinamento (longo prazo), RAG (médio prazo) e busca por agente de IA (imediato)
- **SEO não morre, mas SEO sozinho não basta**. Você precisa de uma estratégia híbrida que some LLMO ao SEO
- **LLMO é, no fundo, um problema de engenharia**. Entendimento técnico é indispensável
- **O ponto de partida mais eficiente é a otimização para RAG**. Comece melhorando a estrutura do conteúdo

## Próximas Ações

- [ ] Cheque o `robots.txt` do site da sua empresa e garanta que crawlers de IA (GPTBot, ClaudeBot, etc.) não estão bloqueados
- [ ] Pesquise o nome da sua empresa no ChatGPT ou no Perplexity e veja o que aparece
- [ ] Verifique se o site da sua empresa aparece no Brave Search

No próximo Capítulo 2, vou explicar técnicas de LLMO que você consegue implementar hoje: configuração do `llms.txt` e implementação de dados estruturados (JSON-LD).
