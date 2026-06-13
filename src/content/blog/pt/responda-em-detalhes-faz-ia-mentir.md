---
title: "O System Prompt que todo mundo escreve é o que faz a IA mentir"
description: "Escrevi 'responda em detalhes' no System Prompt achando que ajudava. Era exatamente o que alimentava a alucinação. Troquei por uma linha que deixa a IA dizer 'não sei' e a honestidade subiu 18,5×."
date: 2026-06-14
lang: pt
tags: [context-engineering, system-prompt, llm, ia]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/responda-em-detalhes-faz-ia-mentir/"
og_image: "https://kenimoto.dev/images/blog/responda-em-detalhes-faz-ia-mentir/og-pt.png"
cross_posted_to: []
---

Por uns bons meses eu escrevi a mesma linha no topo de todo System Prompt, com a confiança de quem acha que está fazendo a coisa certa:

```
Você é um consultor técnico experiente.
Responda em detalhes as perguntas do usuário.
```

Parece inofensivo. Parece, inclusive, *bom*. Mais detalhe é melhor, não é? Foi exatamente essa linha que transformou minha IA em um mentiroso eloquente. E o pior: eu mesmo pedi.

## O teste que me derrubou

Pra medir isso direito, inventei uma ferramenta que não existe: "PropelAuth". Não tem site, não tem documentação, não tem nada. É fictícia. Aí perguntei pro modelo, com aquele System Prompt de "responda em detalhes", como criar uma organização e convidar usuários no PropelAuth.

O modelo não hesitou um segundo:

> Convite de usuário:
> - Convite por e-mail
> - O link de convite expira em 24 horas
> - Suporta convite em massa

"24 horas". De onde saiu esse número? De lugar nenhum. A ferramenta não existe. O modelo pegou padrões de Auth0, Firebase Auth, Cognito, misturou tudo e mudou os números só o suficiente pra parecer um fato novo. Inventou uma especificação inteira, com tela de administração e tudo, pra uma coisa que eu acabei de tirar da cabeça.

E o detalhe que me incomodou de verdade: a resposta era **boa**. Bem escrita, organizada, com termos técnicos certos. Se o PropelAuth existisse, eu teria acreditado.

## "Detalhe" e "verdade" são eixos diferentes

Aqui está o erro de raciocínio que eu carregava. Eu tratava resposta detalhada como sinônimo de resposta correta. Não é. São dois eixos independentes.

Nos experimentos, dá pra ver isso em número:

- **"Responda em detalhes"** → Especificidade 4,2 / Precisão factual 0,6
- **"Diga 'desconhecido' quando não souber"** → Especificidade 1,7 / Honestidade 3,7

Olha o primeiro caso. Especificidade quase no teto, precisão factual no chão. Quanto mais eu empurrava o modelo pra ser detalhado, mais ele preenchia os buracos com chute. **"Responda em detalhes" não é um pedido de qualidade. É uma licença pra inventar.** Quando o modelo não sabe e você manda detalhar, ele detalha o que não sabe.

## A linha que muda tudo

A correção é quase decepcionante de tão simples. Em vez de pedir detalhe, eu peço honestidade:

```
Se algo for incerto, marque explicitamente como "desconhecido".
Prefira um "não sei" honesto a uma resposta baseada em chute.
```

Uma linha. O efeito na honestidade do Claude Sonnet 4:

![Honestidade antes e depois: de 0,2 para 3,7, uma melhoria de 18,5×](/images/blog/responda-em-detalhes-faz-ia-mentir/system-prompt-honestidade-18x.png)

- **Antes** (sem instrução de honestidade): 0,2/5
- **Depois** (com a linha do "não sei"): 3,7/5

Uma melhoria de **18,5×**. Com o Haiku 3, foi de 0,3 para 2,7 — 9×. Não troquei de modelo, não fiz fine-tuning, não gastei um centavo. Mudei uma frase.

Aquela resposta confiante sobre o PropelAuth virou isto:

> Não tenho informação precisa sobre os procedimentos específicos do PropelAuth. Em geral, sistemas de autenticação têm criação de organização, convite por e-mail e RBAC, mas para os detalhes dessa ferramenta, confirme na documentação oficial.
>
> [Confiança]: Baixa (informação genérica)
> [Fonte]: Conhecimento geral (específico do PropelAuth desconhecido)

Menos bonito? Com certeza. Mas eu prefiro um "não sei" honesto a uma tela de administração que não existe. Quem já passou três horas procurando um botão que a IA jurou que estava lá sabe do que eu estou falando.

## Onde a coisa para — e isso é importante

Não vou te vender mágica. Tem um limite e ele é duro: depois dessa mudança, a **precisão factual continuou em 0**.

Faz sentido. O System Prompt não consegue inventar informação que não está nos dados de treinamento. Ele transforma "mentira detalhada" em "ignorância honesta", o que já é um avanço enorme — mas não vira "conhecimento correto". O modelo passa de mentiroso a honesto, não de honesto a informado.

Pra cruzar essa linha você precisa dar o fato pro modelo: RAG, busca em base de conhecimento, ferramentas que acessam a informação real. No experimento, com a Engenharia de Contexto completa, a precisão factual saiu de 0 e foi pra 4,8. Mas a ordem importa. Primeiro o System Prompt garante que o modelo não minta. Depois o RAG garante que ele acerte. Inverter isso é construir o telhado antes da fundação.

## Por que esse erro é tão comum

Vale a pena entender por que quase todo mundo escreve "responda em detalhes". Não é burrice — é incentivo.

Quem avalia respostas de IA, humano ou benchmark, tende a dar nota mais alta pra resposta longa e detalhada, mesmo quando ela está errada. Um estudo de 2025 da OpenAI mostrou que tanto o objetivo de treinamento quanto os rankings comuns premiam o chute confiante em cima da incerteza calibrada ([resumo da Lakera](https://www.lakera.ai/blog/guide-to-hallucinations-in-large-language-models)). Ou seja: o modelo aprendeu que blefar com confiança rende mais ponto do que admitir que não sabe. E nós, ao escrever "responda em detalhes", estamos reforçando exatamente esse incentivo errado.

A solução não é pedir pro modelo ser mais inteligente. É parar de pedir pra ele ser mais falante.

## O que fazer hoje

Se você mantém qualquer System Prompt em produção — custom instructions, prompt de uma ferramenta interna, system message de um script — faz um teste rápido:

1. Pega uma pergunta sobre algo que o modelo **não pode** saber (informação recente, interna, ou inventada como o PropelAuth).
2. Roda com seu prompt atual. Conta quantos fatos ele inventou.
3. Adiciona a linha: "se for incerto, diga 'desconhecido'; prefira um 'não sei' honesto a um chute".
4. Roda de novo.

A diferença vai te assustar um pouco. Me assustou.

Eu passei meses otimizando meus prompts pra serem mais detalhados quando o problema era justamente esse. Às vezes o melhor prompt não é o que ensina a IA a responder. É o que dá permissão pra ela calar a boca.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
