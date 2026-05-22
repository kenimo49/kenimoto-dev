---
title: "Capítulo 2: Sistema 1 e Sistema 2, o pensamento duplo do programador"
free: true
---

![Capa do capítulo 2](/images/books/engineer-psychology-tricks/psychology-tricks-ch02-hero.png)

"Quanto é 2 + 2?"

A resposta vem na hora.

"Quanto é 17 × 24?"

Aqui já é preciso calcular na cabeça ou pegar papel.

Os dois problemas usam o cérebro de formas completamente diferentes. O primeiro é automático, instantâneo, inconsciente. O segundo é consciente, exige esforço, é sequencial. Daniel Kahneman batizou esses dois modos de "Sistema 1" e "Sistema 2".

![Sistema 1 vs Sistema 2](/images/books/engineer-psychology-tricks/psychology-tricks-ch02-system1-vs-system2.png)
*Comparação entre Sistema 1 (intuição) e Sistema 2 (deliberação)*

## Os dois sistemas

### Sistema 1: rápido, automático, intuitivo

O Sistema 1 está sempre ligado. É bom em reconhecimento de padrões e julga em frações de segundo com base em experiência passada. Consome pouca energia e não exige esforço consciente.

Situações em que o Sistema 1 do engenheiro está trabalhando:

- Bater o olho no código e sentir "isso está difícil de ler"
- Ver um stack trace de `NullPointerException` e adivinhar imediatamente onde está o problema
- Perceber pelo tom de uma mensagem no Slack que "a pessoa está irritada"
- Julgar intuitivamente "esse design de API não é RESTful"

As respostas do Sistema 1 estão certas na maior parte do tempo. Quanto mais experiente o engenheiro, mais preciso fica o instinto. O problema é que o Sistema 1 **não percebe quando erra**.

### Sistema 2: lento, consciente, lógico

O Sistema 2 precisa ser acionado de propósito. Ele cuida de raciocínio complexo, cálculo e comparação. Consome muitos recursos do cérebro, então se cansa rápido e é preguiçoso.

Situações em que o Sistema 2 do engenheiro entra em ação:

- Analisar a complexidade computacional de um algoritmo
- Comparar prós e contras de várias arquiteturas
- Levantar tarefas similares do passado para estimar uma nova
- Apontar de forma sistemática problemas de design em uma revisão de código

## O que acontece no cérebro do programador

No livro "The Programmer's Brain", Felienne Hermans explica os processos cognitivos da programação por três sistemas de memória: memória de longo prazo (acúmulo de conhecimento), memória de curto prazo (retenção temporária) e memória de trabalho (processamento ativo).

Combinando isso com Sistema 1/2, fica visível como a cognição do engenheiro opera.

**Lendo código**: primeiro o Sistema 1 faz pattern matching. Loops `for`, ramos `if-else`, design patterns familiares, estruturas conhecidas são interpretadas automaticamente. Mas, ao encontrar um padrão estranho ou lógica complexa, o Sistema 2 acorda e começa a analisar passo a passo.

**Escrevendo código**: programadores experientes fazem boa parte da codificação com Sistema 1. Dar nome a variáveis, montar estruturas básicas, escrever o tratamento de erro de sempre. Já o desenho de um algoritmo novo ou a implementação preocupada com performance é trabalho do Sistema 2.

**Bugs costumam vir de troca errada de sistema.** Situações que pediam reflexão do Sistema 2 acabam respondidas pelo Sistema 1 com um "achei que entendi". Ao contrário, usar o Sistema 2 em situações que o Sistema 1 daria conta gera cansaço, e o erro aparece em outro lugar.

## Quatro padrões em que o Sistema 1 sai do controle

Situações comuns no trabalho do engenheiro em que o Sistema 1 dispara sozinho:

### Padrão 1: julgamento sob fadiga

Há relatos de que a taxa de aprovação em revisões de código sobe nas tardes de sexta-feira. O Sistema 2 está exausto e o Sistema 1 conclui "deve estar bom". A qualidade do código não melhorou, só o recurso cognitivo do revisor secou.

### Padrão 2: julgamento sob pressão de tempo

Sob a pressão de "tenho que entregar hoje", o engenheiro pula testes ou empurra "vou refatorar depois". Não sobra espaço para o Sistema 2 e o "tudo bem assim" do Sistema 1 vence.

### Padrão 3: julgamento sob emoção

Crítica ao próprio código, contra-argumento em discussão técnica, insatisfação com avaliação de performance. Quando a emoção entra, o Sistema 1 toma a frente e a resposta vira reação emocional em vez de réplica lógica.

### Padrão 4: julgamento fora da especialidade

Mesmo engenheiros com intuição precisa no domínio técnico veem a precisão do Sistema 1 despencar em áreas como estimativa, avaliação de pessoas, gestão de projeto. Mas a autoimagem de "sou uma pessoa lógica" faz com que confie no instinto também fora do território conhecido.

## Como acionar o Sistema 2 propositalmente

Para impedir o disparo descontrolado do Sistema 1, vale instalar gatilhos que acordam o Sistema 2 de propósito.

**Adiar a decisão.** Não emitir veredito importante "agora". Responder estimativa com "te dou amanhã". Comentário grande de design na revisão? Deixar dormir uma noite antes de enviar.

**Usar checklist.** Como o piloto faz a checklist pré-voo, decisões importantes pedem checklist. Verificação pré-deploy, planilha de critérios para seleção tecnológica, itens de confirmação na estimativa, todos são mecanismos que forçam o Sistema 2 a acordar.

**Verbalizar.** Colocar a razão da decisão em palavras aciona o Sistema 2. Em vez de "sei lá, esse parece melhor", tentar "A é melhor porque: primeiro..., segundo...". Intuição que não se deixa verbalizar provavelmente tem viés dentro.

**Inserir outra perspectiva.** Pair programming e revisão de código funcionam porque o ponto de vista alheio cumpre o papel de Sistema 2. Quando outra pessoa pergunta "por que você decidiu assim?", a crença inconsciente vem à superfície.

Nenhuma dessas técnicas "elimina" o viés. Viés cognitivo está enraizado na estrutura do cérebro, não dá para apagar. Dá para conhecer as situações em que ele aparece com mais força, e ali instalar de propósito um gatilho que acorde o Sistema 2.
