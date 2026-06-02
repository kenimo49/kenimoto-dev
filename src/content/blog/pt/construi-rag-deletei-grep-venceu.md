---
title: "Construí o RAG que mandaram fazer (Voyage + vector DB + busca semântica). Depois deletei tudo: o grep venceu."
description: "Montei o pipeline de RAG de manual pra dar conhecimento de código pra um agente. Embeddings, vector DB, busca semântica. Funcionou pior que rodar grep. A equipe do Claude Code chegou na mesma conclusão antes de mim — e bateu US$ 1 bi de ARR fazendo isso."
date: 2026-06-03
lang: pt
tags: [rag, agentic-search, claude-code, vector-db, busca-de-codigo]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/construi-rag-deletei-grep-venceu/"
og_image: "https://kenimoto.dev/images/blog/construi-rag-deletei-grep-venceu/og-pt.png"
cross_posted_to: []
---

Em 2024 eu sabia exatamente como dar a um modelo conhecimento de uma base de código: RAG. Todo mundo sabia. Era o padrão da indústria. Você vetoriza o código, joga num vector DB, e na hora da pergunta injeta os trechos mais parecidos no prompt. Eu li os mesmos posts que você leu.

Então construí o pipeline inteiro. E ele perdeu pra um comando que existe desde 1973.

Vou contar como, porque a parte interessante não é "RAG é ruim". É que a coisa que eu achava ser engenharia séria estava me atrapalhando, e a solução era literalmente deixar o modelo rodar `grep`.

## Antes de tudo: não é busca de documento, é busca de código

Um aviso rápido pra não confundir. Quando eu falo "abandonei o RAG", não estou falando de RAG pra documentos, FAQ, base de conhecimento. Pra texto não estruturado, busca semântica ainda faz sentido em muito caso.

Estou falando de uma coisa específica: **dar a um agente a capacidade de achar o código certo dentro do seu repositório.** É um problema diferente, e nesse problema o RAG não só é desnecessário como atrapalha. Guarda essa distinção, porque ela é o ponto inteiro.

## O que eu montei (e por que parecia certo)

O cenário era um agente que precisava entender meu backend pra responder e mexer no código. Fui no manual:

- **embeddings da Voyage** pra vetorizar cada arquivo
- um **vector DB** pra guardar os vetores
- **busca semântica** por similaridade na hora da pergunta

No papel, lindo. Pergunta sobre autenticação, o vector DB devolve os trechos "semanticamente próximos" de autenticação, eu injeto no prompt, o modelo responde com contexto. Engenharia de verdade.

A conta começou a não fechar quando eu vi *o que* ele devolvia.

## Por que perdeu pro grep

O problema da busca vetorial é que ela devolve código **semanticamente parecido**, e não necessariamente o código **certo pra tarefa**. São coisas diferentes, e em código a diferença dói.

Eu pedia "corrige o bug de autenticação" e o vector DB me trazia uma pilha de trechos que falavam de autenticação: o handler, um helper antigo, dois testes, um comentário grande explicando o fluxo. Tudo "próximo". Quase nada útil. O trecho que importava era uma função de refresh de token cujo nome nem tinha a palavra "auth" — então a similaridade semântica passou batido por ela.

Aí eu joguei a mesma tarefa pra um agente que só sabia rodar `grep` e `glob`, sem índice nenhum. E ele fez o que eu faria:

```bash
# Sem RAG, sem índice. O modelo decide a estratégia.
$ grep -rn "authenticate" src/
$ glob "**/auth/*.ts"
$ grep -rn "refreshToken" src/auth/
```

Olhou o log de erro, procurou os testes relacionados, seguiu a cadeia até a função de refresh. O **mesmo raciocínio de um dev**, não um ranking de similaridade. Achou o bug que o RAG tinha enterrado no meio do "parecido".

A esse processo de o próprio modelo montar a estratégia de busca e rodar os comandos dá-se o nome de **Agentic Search** (busca agêntica). Em vez de um pipeline de busca desenhado por humanos, você delega o *como buscar* pro modelo.

![RAG vs Agentic Search: o pipeline vetorizado devolve trechos parecidos; o modelo rodando grep/glob acha o arquivo certo seguindo a cadeia de raciocínio.](/images/blog/construi-rag-deletei-grep-venceu/rag-vs-agentic.png)

## A equipe do Claude Code chegou lá antes — e apostou US$ 1 bi nisso

Eu achei que tinha descoberto uma gambiarra esperta. Na real, eu tinha repetido um caminho que a equipe do Claude Code já tinha trilhado.

As primeiras versões do Claude Code usavam RAG com vector DB local. Eles testaram, viram que não valia, e jogaram fora. O Boris Cherny, criador da ferramenta, foi direto sobre isso num post no X:

> "As primeiras versões do Claude Code usavam RAG + um vector db local, mas percebemos rápido que a busca agêntica geralmente funciona melhor. Também é mais simples e não tem os mesmos problemas de segurança, privacidade, defasagem e confiabilidade."

E aqui entra o número que fecha o argumento. O Claude Code **bateu US$ 1 bilhão de ARR em seis meses** depois do lançamento, e passou de US$ 2,5 bilhões em fevereiro de 2026. A Milvus, empresa de vector DB, publicou uma réplica dizendo que o agentic search "consome tokens demais". E tem razão: rodar grep várias vezes gasta mais token que uma consulta vetorial.

Só que o mercado respondeu com a carteira. Os usuários claramente preferem **precisão e UX** a economizar token. E token só fica mais barato com o tempo, enquanto a dor do índice defasado fica pra sempre.

## A conta que ninguém coloca: o custo operacional

Aqui no Brasil esse ponto pesa ainda mais, porque a gente sente o custo de infra em real, não em dólar de venture capital. O RAG cobra um pedágio que não aparece no tutorial bonitinho:

- construir o índice inicial, e reconstruir
- re-indexar **a cada mudança no código** (e código muda todo dia)
- gerenciar e escalar o vector DB
- mandar seu código pra um serviço externo pra vetorizar, e aí já era a privacidade

O agentic search não tem nada disso. Arquivo novo é pesquisável no segundo em que você salva. Nada sai da máquina. Aquela tarde que passei configurando re-indexação era dívida pura que eu mesmo tinha contratado.

Tem uma armadilha de "vibe coding" embutida nisso: a gente cola o stack que os influencers de IA estão mostrando — Voyage, vector DB, semantic search — porque parece o jeito sério de fazer. E às vezes o jeito sério é deixar o modelo rodar `grep`, que é exatamente o tipo de resposta que não rende thread bonita no Twitter.

## O que eu faço hoje

Deletei o vector DB. O agente acha o que precisa com grep e glob, decidindo a estratégia na hora. É mais simples, é mais preciso pra código, e meu código não viaja pra lugar nenhum.

A lição que ficou não é "RAG morreu": pra documento ele ainda tem lugar. A lição é que eu tinha confundido **complexidade com competência**. Montei um pipeline elaborado porque pipeline elaborado parece engenharia, quando a coisa que resolvia o problema cabia numa linha de shell.

Da próxima vez que você for vetorizar seu repositório, faz um teste antes: deixa o modelo rodar grep e vê quem acha o arquivo certo primeiro. Aposto numa cerveja que não é o vector DB.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
