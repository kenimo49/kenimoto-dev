---
title: "US$ 47.000 num fim de semana: a tempestade de 2,3 milhões de retries que o harness teria parado em 4 linhas"
description: "Fevereiro de 2026, sexta a domingo: um agente sem guardrail virou uma fatura de carro popular. Anatomia do incidente, conta no PTAX da época, e o patch de 4 linhas de YAML que teria parado a hemorragia no minuto 10."
date: 2026-06-26
lang: pt
tags: ["harness", "agentes-ia", "post-mortem", "guardrail"]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/47000-fim-de-semana-tempestade-retries-harness-4-linhas"
og_image: "https://kenimoto.dev/images/blog/47000-fim-de-semana-tempestade-retries-harness-4-linhas/og-pt.png"
cross_posted_to: []
---

Fevereiro de 2026, uma sexta à noite. Um time sobe um agente de enriquecimento de dados que faz uma coisa só: pega uma linha do CRM, chama uma API externa, escreve o resultado de volta. Eles dão início ao job, fecham o laptop, vão tomar uma cerveja. Segunda de manhã chega a primeira pessoa no escritório, abre o painel de billing e fica olhando para um número que não fecha. **US$ 47.000**. Quarenta e sete mil dólares. No PTAX do BCB de 25 de junho de 2026 (R$ 5,2082 por dólar), isso dá **R$ 244.785**. Um Onix zero saindo da concessionária.

O agente não estava com bug. A API externa não estava fora. O modelo escolheu certo. O problema era que ninguém pôs freio no agente, e ele decidiu que "retry" era a resposta para tudo.

O patch que teria parado isso eram **4 linhas de YAML**. Vou colar elas no fim.

![Curva de 2,3 milhões de chamadas em 52 horas, com a linha vermelha de US$ 47.000 cortando em zero quando o guardrail de orçamento entra](/images/blog/47000-fim-de-semana-tempestade-retries-harness-4-linhas/og-pt.png)

## A anatomia da tempestade

A história foi bem documentada na época. Um relato bom é o do Ravoid sobre [o gap de US$ 47.000 entre dashboards e controle](https://ravoid.com/blog/ai-agent-budget-enforcement), que descreve esse cenário e variações: agentes que entram em loop de retry, dashboards que mostram o custo com algumas horas de atraso, e o time descobrindo a fatura no horário comercial de segunda. O caso clássico que circulou é o [loop de 4 agentes do LangChain que queimou 47 mil dólares em 11 dias](https://leanopstech.com/blog/agentic-ai-cost-runaway-token-budget-2026/), mas a versão "fim de semana de 52 horas" é a que dói mais porque cabe inteira numa janela em que ninguém vai olhar.

Pela reconstrução pública e pelo que vi acontecer com clientes meus em escala menor, o esquema é mais ou menos esse:

```text
Sexta 20:00  Job inicia. 1ª chamada à API externa.
Sexta 20:01  API retorna 429 (rate limit).
Sexta 20:01  Agente interpreta: "tente com outros parâmetros."
Sexta 20:01  Segunda chamada. 429.
Sexta 20:02  Terceira chamada. 429.
...
Domingo 23:50  2.300.000ª chamada. Ainda 429.
Segunda 08:30  Engenheiro abre billing. Café cai no chão.
```

Cada chamada custava centavos. Em 52 horas, com paralelismo modesto, dá pra chegar a 2,3 milhões. A matemática é cruel: US$ 0,02 × 2.300.000 = US$ 46.000, e mais o overhead de contexto que cresce a cada step. Não foi 1 chamada idiota, foram 2,3 milhões de chamadas individualmente razoáveis. Esse é o ponto que machuca.

## O bug não estava no modelo

A primeira coisa que aprendi olhando casos assim é que o instinto de procurar o erro no modelo está errado.

O modelo escolheu retry porque um humano provavelmente teria feito o mesmo na primeira chamada. O system prompt dizia "garanta que o usuário receba a resposta." Quando a primeira tentativa falhou, retry com parâmetros levemente diferentes era literalmente o que tinha sido instruído.

O bug estava no **ambiente**. Concretamente:

- Nenhum orçamento por hora.
- Nenhum cap por execução do job.
- Nenhum circuit breaker depois de N falhas seguidas com o mesmo código de erro.
- Nenhum alerta em tempo real. O dashboard atualizava a cada 4 horas e ninguém estava olhando à noite.
- Nenhum kill switch acessível pelo plantão.

Cada um desses é uma linha de configuração. Nenhum deles tem a ver com o modelo. É o que o pessoal de harness engineering chama de "model is commodity, harness is moat": o modelo é mercadoria, o harness é o fosso. O caso de US$ 47.000 é o exemplo mais caro dessa frase que conheço.

## O patch de 4 linhas

A correção que esse time aplicou na segunda de manhã, depois do choque inicial, era ridiculamente curta. Algo assim:

```yaml
agent:
  budget_usd_per_hour: 5      # corta o agente em US$ 5/h
  max_consecutive_errors: 20  # circuit breaker em 20 erros seguidos
  alert_webhook: "..."        # PagerDuty + Slack em tempo real
  kill_switch_path: "/ops/kill" # endpoint para o plantão derrubar
```

Quatro linhas. US$ 5 por hora de teto significa que mesmo se nada mais funcionasse, o estrago máximo até alguém ver seria de US$ 260 em 52 horas, e não US$ 47.000. O circuit breaker teria cortado no minuto 10, porque 20 erros consecutivos com o mesmo 429 é claramente o agente não entendendo a mensagem. O webhook teria chamado o plantão antes da meia-noite de sexta. E o kill switch é a coisa mais barata que existe: um endpoint que seta uma flag no Redis e o agente checa antes de cada step.

Isso é o mínimo. A versão mais robusta inclui rate limiting com [token bucket no gateway](https://www.truefoundry.com/blog/rate-limiting-ai-agents-preventing-llm-api-exhaustion) e classificação de erros (transient vs permanent), mas para parar uma sangria de fim de semana, as 4 linhas chegam.

## Mas a Anthropic e a OpenAI não fazem isso nativo agora?

Olhei isso de novo essa semana porque o cenário mudou em 2026. A resposta curta é: **sim, em parte, e ainda assim não é suficiente.**

A Anthropic em maio de 2026 documentou o [Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode), que tem classificação em duas fases para decidir se um tool call precisa de aprovação humana. Faz sentido para coding agents: protege contra "rm -rf" e push em main. Não protege contra o cenário de retry storm, porque cada chamada individual passa no filtro (é "só uma chamada de API válida"), e o problema é o acumulado. A categoria de risco não cobre "1 milhão dessas chamadas, juntas, custam um carro."

A OpenAI tem budget caps no nível da conta. Bom para o limite superior. Inútil para o caso em que sua conta serve 4 produtos diferentes e você quer parar 1 agente específico no fim de semana sem derrubar os outros 3.

Conclusão honesta: as plataformas estão se mexendo na direção certa, mas em 2026 ainda é o **seu** harness que tem que ter budget por agente, circuit breaker por classe de erro, e kill switch operacional. As 4 linhas continuam sendo sua responsabilidade. A coisa boa é que o trabalho é claro e barato. A coisa ruim é que ninguém faz até a primeira fatura.

## O que isso ensina para quem está montando agente esta semana

Três regras que tirei do incidente e que tento seguir religiosamente.

**Regra 1: o orçamento por hora é negociável, sua existência não é.** US$ 5/h, US$ 50/h, US$ 500/h: escolha. Mas tem que existir. A pergunta no design review não é "qual o teto correto," é "qual é o teto." Se a resposta é "não tem," o agente não sobe para produção. Pronto.

**Regra 2: o que conta como erro repetido é específico do agente.** O retry storm acontece porque "erro" é tratado como um único conceito. Na prática, 429 é "espera mais," 500 é "tenta de novo," 401 é "para imediatamente," 422 é "muda o input." Misturar tudo num retry genérico é a receita do bug. Classifique antes de retry-ar.

**Regra 3: o dashboard de billing nunca é em tempo real.** Os painéis das plataformas atualizam com atraso de minutos a horas. Se você confia no painel para te avisar, vai descobrir o problema horas depois do começo. O alerta precisa morar no seu webhook, não no portal da plataforma. Esse foi o detalhe que separou os times que pararam o sangramento em 30 minutos dos times que descobriram na segunda de manhã.

## A parte que me incomoda na história

Tem uma coisa que pouca gente comenta. Se o job tivesse rodado num dia de semana, o time teria pegado no minuto 30. Em horário comercial, alguém vê o billing subindo, alguém comenta no Slack, alguém entra na máquina. O Sentry pinga. O alerta de "API gastando muito" chega numa janela em que tem gente olhando.

A tempestade só vira US$ 47.000 porque **o trabalho do agente é continuar funcionando quando o humano não está olhando**. Esse é o ponto inteiro de ter agente. Se você só liga agente quando tem humano em cima, você não tem agente, tem um copiloto caro.

Então a pergunta de design não é "o agente funciona bem na sexta à tarde com 5 engenheiros olhando o terminal." É "o agente funciona bem no domingo às 3h da manhã com ninguém em cima." Se a resposta para a segunda é a mesma para a primeira, o harness está pronto. Se não, falta as 4 linhas.

O incidente de fevereiro de 2026 não foi sobre IA. Foi sobre o que acontece quando você dá autonomia para um sistema e esquece de pôr o freio. A IA só tornou a curva mais íngreme: em vez de 1 erro humano de US$ 200 que demora 4 horas para acontecer, você tem 2,3 milhões de erros razoáveis que somam US$ 47.000 em 52 horas.

A boa notícia é que o freio é gratuito. A má notícia é que ninguém compra freio até bater o carro.

E o pior é que a fatura chega segunda às 8:30 da manhã, junto com o café que você ia tomar feliz porque tinha conseguido um fim de semana sem oncall.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
