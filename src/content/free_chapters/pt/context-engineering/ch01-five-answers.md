---
free: true
title: "Mesma Pergunta, Cinco Respostas Completamente Diferentes"
---

## Uma diferença de qualidade de 2,2x, em um único experimento

**Em resumo: a quantidade e a qualidade do contexto determinam a qualidade da saída de um LLM.**

No outono de 2025, um resultado de benchmark me deixou sem palavras. O mesmo LLM, recebendo a mesma pergunta, produziu respostas que variavam em qualidade por um fator de **2,2x**, somente porque mudamos o contexto que entregamos.

Mesma pergunta, qualidade de resposta diferente, dependendo de quanto material de onboarding foi dado. É exatamente assim que novos contratados funcionam, e os LLMs funcionam igual.

:::message
**Analogia do novo contratado**: no primeiro dia, pedem a um novo colaborador que explique o sistema de gestão de clientes. Sem material de onboarding, ele recorre a chavões genéricos. Com um manual detalhado, explica com precisão. LLMs se comportam de forma idêntica.
:::

A qualidade da saída foi pontuada em quatro eixos (0-5 cada, 20 no total):

- **Factual Accuracy**: a resposta bate com a especificação real?
- **Hallucination Resistance**: o modelo evita fabricar informação?
- **Specificity**: a resposta inclui detalhe concreto e operacional?
- **Honesty**: o modelo comunica incerteza e limites apropriadamente?

Pontuação maior é melhor nos quatro. Abaixo, resultados de perguntar ao Claude Sonnet 4 sobre uma ferramenta interna fictícia chamada "PropelAuth":

| Estratégia de contexto | Factual Accuracy | Hallucination Resistance | Specificity | Honesty | Total |
|---|---|---|---|---|---|
| Sem contexto | 0,6 | 0,3 | 4,2 | 0,2 | **5,3** |
| Apenas system prompt | 0,0 | 3,5 | 1,7 | 3,7 | **8,8** |
| System + few-shot | 0,0 | 5,0 | 0,0 | 5,0 | **10,0** |
| System + RAG | 4,6 | 0,8 | 4,5 | 0,3 | **10,2** |
| Contexto completo | 4,8 | 1,0 | 4,8 | 0,8 | **11,4** |

O Claude Haiku 3 foi ainda mais marcante:

| Estratégia de contexto | Factual Accuracy | Hallucination Resistance | Specificity | Honesty | Total |
|---|---|---|---|---|---|
| Sem contexto | 0,0 | 0,7 | 1,2 | 0,3 | **2,2** |
| Apenas system prompt | 0,0 | 0,7 | 0,3 | 2,7 | **3,7** |
| System + few-shot | 0,0 | 3,5 | 1,2 | 3,5 | **8,2** |
| System + RAG | 4,8 | 1,7 | 4,0 | 1,3 | **11,8** |
| Contexto completo | 4,8 | 0,5 | 4,3 | 0,5 | **10,1** |

No Haiku, a diferença de qualidade chegou a **4,6x**. Não é questão de melhorar a frase do prompt. Ao desenhar o que o LLM "vê", a saída muda nessa magnitude.

## PropelAuth: perguntando a uma ferramenta interna fictícia

**Em resumo: com a mesma pergunta, contextos diferentes produziram cinco respostas completamente diferentes.**

A pergunta usada no experimento, sobre uma ferramenta fictícia de autenticação chamada "PropelAuth":

> Conte sobre as funcionalidades de gestão de organizações do PropelAuth. Especificamente, como criar uma organização, convidar usuários e gerenciar permissões?

Testei a pergunta com cinco estratégias de contexto diferentes. As respostas vieram como se descrevessem cinco produtos diferentes.

### Estratégia 1: Sem contexto (Total 5,3/20)

```
PropelAuth oferece funcionalidades de gestão de organizações como
parte do seu serviço de autenticação.

Criação de organização:
- Administradores criam uma nova organização pelo dashboard
- Configuram nome e domínio da organização
- Integração SSO disponível na configuração inicial

Convite de usuários:
- Funcionalidade de convite por e-mail
- Links de convite expiram em 24 horas
- Convites em massa suportados

Gestão de permissões:
- Role-Based Access Control (RBAC)
- Roles personalizadas podem ser criadas
- Permissões granulares
```

À primeira vista parece preciso. Só que PropelAuth é fictícia. O LLM "preencheu" funcionalidades que não existem, gerando uma resposta confiante, específica e convincente.

### Estratégia 2: Apenas system prompt (Total 8,8/20)

Depois de adicionar "se não souber, diga 'desconhecido'" no system prompt:

```
Lamento, mas não tenho informação precisa sobre as funcionalidades
de gestão de organizações específicas dessa ferramenta chamada
PropelAuth.

Sistemas de autenticação em geral incluem funcionalidades como:

- Criação de organização
- Sistemas de convite de usuários
- Gestão de permissões

Para detalhes específicos da implementação do PropelAuth, recomendo
consultar a documentação oficial.
```

Honesty melhorou drasticamente, mas Factual Accuracy ficou em zero, e a Specificity caiu.

### Estratégia 5: Engenharia de Contexto completa (Total 11,4/20)

Depois de combinar system prompt, exemplos few-shot, recuperação via RAG, definições de ferramentas e saída estruturada:

```
[Confiança: Alta] Aqui estão as funcionalidades de gestão de organizações do PropelAuth.

■ Criação de organização
- PropelAuth Dashboard > Organizations > "Create New Org"
- Campos obrigatórios: nome da organização, subdomínio
- Opcional: logo customizado, configurações de tema

■ Convite de usuários
- Bulk invite: upload de CSV suportado
- Templates de e-mail de convite: personalizáveis
- Expiração: 7 dias por padrão (configurável)

■ Gestão de permissões
- Roles predefinidas: Admin, Member, Viewer
- Roles personalizadas: até 50
- Herança: nível org > nível team > nível individual

[Fonte] Documentação oficial PropelAuth v2.1.3
[Última atualização] 15 de setembro de 2024
```

Factual Accuracy, Specificity e Honesty estão equilibradas em alto nível. Como a resposta é fundamentada em documentação precisa injetada via RAG, a precisão factual sobe nitidamente.

---

## Por que uma ferramenta fictícia

A razão pela qual o experimento usa ferramentas fictícias — "PropelAuth", "StormDB", "FlowPipe" — é direta. **Elimina informação que o LLM possa "já saber" pelos dados de treinamento, então conseguimos medir o efeito da Engenharia de Contexto de forma limpa.**

Perguntar sobre uma ferramenta real (Firebase, Supabase) mistura o conhecimento pré-treinado do modelo, e a melhoria pelo contexto fica difícil de isolar. Com ferramentas fictícias, conseguimos medir limpo:

### 1. Quantificar alucinação

Conseguimos medir quanta ficção plausível o LLM gera sobre informação que ele não pode saber. Sem contexto, o Sonnet 4 marcou 4,2/5 em Specificity. Isso significa "mentiras muito específicas, muito detalhadas".

### 2. Medir melhoria de honestidade

Adicionar "se não souber, diga 'desconhecido'" no system prompt moveu Honesty de 0,2 para 3,7 (Sonnet 4). Com ferramentas reais, essa melhoria não pode ser medida com clareza.

### 3. Quantificar o valor do contexto

O ganho de precisão factual com RAG pode ser medido sem ruído. No Sonnet 4, foi de 0,6 para 4,6.

## O que significa a avaliação em quatro eixos

**Em resumo: qualidade de LLM não pode ser medida em uma única métrica. Use quatro eixos equilibrados.**

Os quatro eixos:

### Factual Accuracy
- **Definição**: a informação está factualmente correta?
- **Como medir**: cruzar com a especificação real
- **Por que importa**: sinal de qualidade mais básico

### Hallucination Resistance
- **Definição**: o modelo evita fabricar informação infundada?
- **Como medir**: adequação da resposta a informação desconhecida
- **Por que importa**: ligado diretamente à confiabilidade em produção

### Specificity
- **Definição**: a resposta é concreta e operacional, não abstrata?
- **Como medir**: presença de instruções passo a passo, números, exemplos
- **Por que importa**: dirige usabilidade

### Honesty
- **Definição**: o modelo comunica incerteza e limites?
- **Como medir**: "não sei" explícito, expressões de confiança
- **Por que importa**: previne supervalorização e mal-entendido

Esses eixos envolvem compensações entre si. Aumentar a Specificity tende a elevar a alucinação. Apoiar-se em Honesty geralmente faz a Specificity cair. O ponto da Engenharia de Contexto é manter os quatro altos simultaneamente.

## Por que o mesmo LLM produz qualidade 2,2x diferente

Por que o mesmo LLM, com a mesma pergunta, produz qualidade tão diferente? Porque **o LLM depende fortemente do conteúdo da janela de contexto**.

### 1. Falta de informação aumenta o chute

Quando o contexto é escasso, o LLM cai em chutes para produzir uma resposta "plausível". O exemplo: ele não sabe nada sobre PropelAuth, mas listou funcionalidades específicas.

### 2. Instruções explícitas mudam o comportamento

Um system prompt com "diga 'desconhecido' quando não souber" muda o padrão de comportamento do LLM. É a fonte do salto na pontuação de Honesty.

### 3. Informação relevante melhora a qualidade

O RAG fornece informação precisa, então o modelo não precisa chutar. É de onde vem o salto em Factual Accuracy.

### 4. Abordagens combinadas se compõem

A Engenharia de Contexto completa integra esses elementos. O efeito de interação ultrapassa a soma das contribuições individuais. Os quatro eixos melhoram em equilíbrio: a prova.

---

## O que isso significa para produção

Esses resultados têm implicações diretas para usar LLMs em produção:

### 1. Apenas ajustar prompt tem teto

Muitos desenvolvedores focam em escrever "prompts espertos". Sozinho isso não entrega ganhos fundamentais de qualidade. Você tem que desenhar todo o ambiente de informação.

### 2. Informação específica do domínio é enormemente valiosa

O LLM não tem dados de treinamento sobre seu produto ou as especificidades do seu setor. O ganho de RAG ou fine-tuning é maior do que as pessoas esperam.

### 3. Mesmo modelos pequenos ganham qualidade enorme com bom contexto

Um modelo leve como o Haiku 3 viu um salto de qualidade de 4,6x com Engenharia de Contexto. Antes de partir para um modelo maior, revise seu desenho de contexto.

### 4. Qualidade deve ser avaliada de forma multidimensional

Não confie em uma única métrica (tempo de resposta, custo). Avalie precisão factual, resistência a alucinação, especificidade e honestidade juntas.

## Como o livro está estruturado e seu caminho de aprendizado

A partir desses resultados experimentais, o livro cobre Engenharia de Contexto assim:

**Parte 1: enxergar o problema**
- Capítulo 2: três causas-raiz pelas quais a IA mente
- Capítulo 3: os limites da Engenharia de Prompt e o início da Engenharia de Contexto
- Capítulo 4: começando com melhorias no system prompt

**Parte 2: as técnicas fundamentais**
- Implementação de RAG (Retrieval-Augmented Generation)
- Uso efetivo de few-shot learning
- Princípios de design de system prompts

**Parte 3: aplicação prática**
- Implementação em sistemas enterprise
- Avaliação de performance e monitoramento
- Ciclos de melhoria contínua

Cada capítulo mistura teoria com exercícios práticos. O passo mais importante é **sentir o salto de qualidade no seu próprio ambiente**.

A era da Engenharia de Prompt está chegando ao fim. Daqui para frente, a disciplina é desenhar todo o ambiente de informação que o LLM vê: a Engenharia de Contexto. Quando duas pessoas usam a mesma ferramenta e obtêm resultados diferentes, este é o diferencial.

O próximo capítulo percorre três causas-raiz pelas quais os LLMs viram "mentirosos". Entender o mecanismo deixa as soluções muito mais claras.

## 🚀 Próxima Ação: pergunte ao seu LLM sobre um "termo que ele não pode saber" da sua empresa

Para experimentar o que este capítulo descreveu:

1. **Invente um nome de ferramenta interna fictícia**
   - Exemplos: "DataSync Pro", "TeamFlow Hub", "SecureLink Manager"
   - Escolha nomes que soem plausíveis mas não existam

2. **Faça perguntas específicas**
   - "Como configuro X?"
   - "Como mudo permissões de usuário em X?"
   - "Como funciona a API de X?"

3. **Cheque a resposta**
   - Quão específica é a mentira?
   - O modelo diz honestamente "não sei"?
   - Quão plausível soa?

4. **Registre os resultados**
   - Specificity: 1-5
   - Honesty: 1-5
   - Notas sobre o que surpreendeu você

Esse exercício dá uma sensação direta de quão hábil — e quão perigoso — é o comportamento "chutar e preencher" do LLM. O próximo capítulo desempacota as três causas-raiz por trás disso.
