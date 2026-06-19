---
title: "40% dos projetos de agente de IA vão ser cancelados até 2027. A culpa quase nunca é do modelo."
description: "A Gartner projeta que mais de 40% dos projetos de IA agêntica serão cancelados até 2027. Passei meses achando que projeto de agente que quebra é problema de modelo fraco ou prompt ruim. Não é. É a harness que ninguém desenhou: o ambiente onde o agente roda. Demo funciona, produção quebra, e o motivo é estrutural."
date: 2026-06-20
lang: pt
tags: [ia, agentes, harness, producao]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/agentes-ia-40-falham-harness/"
og_image: "https://kenimoto.dev/images/blog/agentes-ia-40-falham-harness/og-pt.png"
---

Todo mundo no LinkedIn já viu o número, mas vou repetir porque ele merece: a Gartner projeta que **mais de 40% dos projetos de IA agêntica serão cancelados até o fim de 2027** ([Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)). Quarenta por cento. Isso não é "acontece com os outros": é uma probabilidade alta o suficiente pra você olhar pro projeto de agente que está rodando aí na sua empresa e fazer a conta de quem vai ficar de pé.

Por uns bons meses eu li esse tipo de notícia e tirei a conclusão errada. Achei que projeto de agente que quebra é problema de modelo. Modelo fraco, escolha errada entre Sonnet e Opus, prompt mal escrito. Quando os meus quebravam, eu trocava de modelo e mexia no prompt. Às vezes melhorava um pouco. Nunca resolvia de verdade.

A conclusão certa demorou pra chegar, e ela é meio chata: na maioria dos casos a culpa não é do modelo. É da **harness**, o ambiente em que o agente opera, e que quase ninguém senta pra desenhar.

Antes que pareça mais um texto genérico sobre "agentes em produção": eu já escrevi aqui sobre [um agente que rodou 24h sozinho e quase vazou um `.env`](https://kenimoto.dev/pt/blog/agente-ia-24-horas-incidentes-seguranca/), e aquilo era um relato de incidentes específicos numa noite. Esse texto aqui é outra coisa. É a vista de cima: por que 40% falham, e por que a raiz comum é a mesma.

## "Funciona na demo, quebra em produção"

Você já viveu isso. A demo do agente é linda. Input limpo, usuário cooperativo, o caminho feliz inteiro. Aí vai pra produção e despenca.

Os números do salto PoC → produção são brutais: estima-se que **80 a 90%** dos pilotos de agente falhem ao virar produção, e que **88% dos PoCs nunca cheguem lá** ([Composio](https://composio.dev/blog/why-ai-agent-pilots-fail-2026-integration-roadmap)). A parte que muda a forma de pensar é o diagnóstico: a diferença entre o que dá certo e o que falha não está na tecnologia. Está em volta dela.

Faz sentido quando você lembra que toda demo roda em cima de input limpo, e produção nunca tem input limpo. Demo é o agente correndo na pista vazia. Produção é a mesma corrida no trânsito de São Paulo às 18h, com obras na pista e alguém parando no meio do cruzamento. O carro é o mesmo. O ambiente é que decide.

E ambiente é exatamente o que a palavra harness descreve.

## O que é harness, sem enrolação

Engenharia de Prompt é "o que você pergunta pra IA." Engenharia de Contexto é "tudo o que você manda pro modelo" — system prompt, RAG, definições de ferramenta, memória. Harness Engineering é "como o todo funciona": o contexto mais as restrições, as ferramentas, o ciclo de vida, o loop de feedback e o monitoramento.

Se a cozinha é a analogia, o prompt é a receita, o contexto são os ingredientes, e a harness é a cozinha em si. Dá pra ter a melhor receita e o melhor ingrediente do mercado. Se a cozinha não tem pia, fogão nem exaustor, você não janta.

Os três se aninham um dentro do outro: harness contém contexto, que contém prompt. Quando alguém me diz que o projeto de agente falhou por causa do modelo, quase sempre o que aconteceu foi que mexeram só na receita enquanto a cozinha pegava fogo.

![A harness como cozinha que contém contexto e prompt: receita, ingredientes e a cozinha em si](/images/blog/agentes-ia-40-falham-harness/og-pt.png)

## A causa raiz não é o modelo (e os dados concordam)

Olha a pilha de evidência apontando pra fora do modelo.

O MIT, no relatório "The GenAI Divide", encontrou que **95% dos pilotos corporativos de GenAI não geram impacto mensurável no resultado financeiro** ([via Fortune](https://finance.yahoo.com/news/mit-report-95-generative-ai-105412686.html)). A causa apontada não foi qualidade de modelo: foi o "learning gap", a incapacidade de encaixar a IA no fluxo de trabalho real. (Esse número viralizou e foi contestado por alguns analistas, então trato ele como contexto macro, não como lei da física. Mas a direção bate com tudo o mais.)

A Gartner ainda cutuca outra ferida: do mar de fornecedores que se dizem "IA agêntica", só cerca de **130 são reais** — o resto é "agent washing", rótulo de agente colado em automação velha. Parte do 40% que vai morrer nunca foi agente de verdade pra começar.

Repare no padrão. MIT diz que a falha é organizacional. Gartner diz que parte é rótulo mentiroso e parte é falta de controle de risco e valor de negócio pouco claro. Composio diz que a diferença não é tecnologia. Nenhum deles está apontando pro modelo. Todos estão apontando pro que cerca o modelo: a definição de harness.

## Por que isso pega forte no Brasil agora

Dois motivos bem práticos pra quem trabalha aqui.

Primeiro, a hora é essa. O mercado de IA agêntica deve sair de US$ 7,9 bi em 2025 pra US$ 196 bi em 2030, e o Brasil aparece como líder de adoção na América Latina ([TI Inside](https://tiinside.com.br/28/04/2026/mercado-de-ia-agentica-deve-crescer-25-vezes-ate-2030-brasil-lidera-adocao-na-america-latina)). Tem muita consultoria e muita startup brasileira colocando agente em produção neste exato momento, no meio da curva onde o 40% mora.

Segundo, o nosso ponto de dor é específico. No PoC, custo de token é desprezível. Em produção, com milhares de execuções por dia, aquele agente baratinho vira uma conta que assusta — e aí o projeto é cancelado não porque não funciona, mas porque ninguém desenhou a parte da harness que controla custo (caching, limite de passos, parada antecipada). Some isso a governança e auditabilidade em setor regulado (financeiro, saúde, seguro), e você tem o roteiro exato de como um agente que "funcionava" vira estatística da Gartner.

E não é hype distante: em março de 2026 a Linear declarou que "issue tracking morreu", apontando que agentes de engenharia já estão em mais de 75% dos espaços de trabalho corporativos dela e que 25% das issues já são criadas por agentes ([The Register](https://www.theregister.com/software/2026/03/26/linear-adopts-agentic-ai-as-ceo-declares-issue-tracking-dead/5227428)). O fluxo de trabalho está sendo redesenhado partindo do princípio de que o agente é o padrão. Entrar nessa curva sem desenhar a harness é pegar a estrada em alta velocidade sem cinto. Dá pra ir rápido, até a primeira curva.

## O que eu mudei (a parte chata que funciona)

Parei de tratar projeto de agente como problema de modelo. Quando um agente meu quebra agora, a primeira pergunta deixou de ser "troco de modelo?" e passou a ser "qual pedaço do ambiente eu não desenhei?".

Na prática isso virou três perguntas que eu faço antes de chamar qualquer coisa de pronto pra produção:

- **Ciclo de vida**: o que acontece quando o agente roda por horas e a janela de contexto enche? Tem reset, tem arquivo de progresso, ou ele só vai degradando até falar besteira?
- **Restrições**: o agente tem permissão pra fazer o que ele não deveria? Sandbox, allowlist de rede, limite de custo por execução. Demo não precisa disso. Produção morre sem isso.
- **Feedback**: como eu sei que ele está funcionando sem eu olhando? Se a resposta é "eu olho", então não vai escalar, e não escalar é uma das formas de virar o 40%.

Nenhuma dessas perguntas é sobre o modelo. Todas são sobre o ambiente. E é por isso que trocar de modelo nunca resolvia: eu estava ajustando a receita enquanto o problema era a cozinha.

A boa notícia escondida no número da Gartner é o complemento dele: 40% são cancelados, o que quer dizer que **60% chegam lá**. A diferença entre os dois grupos não é quem pegou o modelo mais novo. É quem desenhou o ambiente em que o agente ia viver antes de soltar ele na rua.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
