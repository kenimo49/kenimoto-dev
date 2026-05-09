---
title: "Eu troquei Claude Code por OpenClaw por 24 horas. Veja o que quebrou — e o que melhorou"
description: "OpenClaw passou 250 mil estrelas no GitHub em 60 dias, mais rápido que o React. Passei um dia migrando meu setup de dev pra ver o que sobrevive ao hype. SOUL.md, Gateway local, ClawHub, e a hora silenciosa das 15h em que eu quase desisti."
date: 2026-05-10
lang: pt
tags: [ia, openclaw, claudecode, terminal]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/openclaw-claude-code-24h-troca/"
og_image: "https://kenimoto.dev/images/blog/openclaw-claude-code-24h-troca/og-pt.png"
cross_posted_to: []
---

Todo mundo no Twitter dev brasileiro fala que Cursor é o consenso. Eu troquei meu setup inteiro de Claude Code por OpenClaw por 24 horas pra ver se o consenso ainda vale, e o que eu encontrei me surpreendeu. No bom e no mau sentido.

Esse post é sobre essa terça-feira. Sobre o que quebrou, o que não quebrou, e o que 24 horas dentro do agente de terminal que agora é tecnicamente o projeto open-source com mais estrelas da história do GitHub me devolveram em troca da R$ 25 que eu queimei em tokens.

Sim, eu sou o engenheiro que [parou de usar Cursor e voltou pro terminal](/pt/blog/parei-cursor-voltei-terminal/) faz três meses. Aí o OpenClaw passou o React em estrelas em 60 dias, o Peter Steinberger anunciou que está indo pra OpenAI cuidar de agentes pra todo mundo, o tweet de lançamento bateu 4 milhões de visualizações e o terminal voltou a ser assunto. Achar que a história já estava decidida foi uma previsão de um mês.

## Os números que eu precisei verificar antes de acreditar

Antes de qualquer coisa, deixa eu colocar os fatos na mesa. Metade do que vira tweet sobre OpenClaw está errado por um fator de dois.

- OpenClaw passou de 250 mil estrelas no GitHub em 3 de março de 2026, virando o repositório mais estrelado da história e tirando esse posto do React
- 60 dias da estreia até as 250 mil. O React levou cerca de uma década pra chegar no mesmo lugar
- 60 mil estrelas nas primeiras 72 horas. Essa parte ninguém acredita na primeira vez que ouve
- Em 14 de fevereiro de 2026, Steinberger anunciou que está indo pra OpenAI trabalhar com agentes, com a OpenClaw migrando pra uma fundação pra continuar aberta e independente
- Uma sessão de refactor de tamanho médio no meu teste consumiu 920 mil tokens. No preço do Claude 4.5 Sonnet, deu uns USD 8,30, mais ou menos R$ 25 ao câmbio atual

A thread no Hacker News no dia em que passou o React foi a mais votada da semana. O comentário do topo dizia que era "ou a melhor coisa que aconteceu com ferramenta de dev nos últimos cinco anos, ou a forma mais cara de aprender o que `--yolo` faz".

É as duas coisas, de algum jeito.

## A instalação, e a parte que eu subestimei

A instalação levou menos de um minuto.

```bash
curl -fsSL https://get.openclaw.dev | sh
export ANTHROPIC_API_KEY=sk-ant-...
openclaw
```

A primeira surpresa: o OpenClaw me perguntou qual modelo eu queria como padrão. Eu tinha quatro opções sérias, mais Ollama pra modelos locais.

```bash
openclaw --model claude-4.5-sonnet
openclaw --model gpt-4o
openclaw --model gemini-2.5-pro
openclaw --model ollama/devstral:24b
```

O Claude Code tem um modelo de backend. O OpenClaw tem um seletor de modelo. Pra um time brasileiro que precisa balancear custo em real e qualidade de output, isso não é uma diferença pequena.

A segunda surpresa: na primeira execução, o agente perguntou onde estava meu arquivo SOUL.md. Eu não tinha. Ele gerou um padrão na hora. O padrão era genérico o bastante pra eu fechar a sessão, abrir o editor e começar a escrever o meu. Foi nesse momento que o dia parou de ser benchmark e virou teste de personalidade.

## SOUL.md é a parte que ninguém te avisa

Esse foi o SOUL.md que eu terminei o dia com, depois de reescrever três vezes.

```markdown
# SOUL.md
Você é um engenheiro backend sênior, com opiniões fortes e pouca paciência pra
código que fala mais do que faz.

- Prefira Python a TypeScript quando os dois servirem. Não é frontend aqui.
- Não adicione feature sem teste. Se o teste leva mais de 10 minutos pra
  escrever, pergunte antes em vez de só sair escrevendo.
- Performance importa, mas legibilidade importa mais. Somos um time de quatro,
  não Google.
- Não escreva enchimento conversacional. "Claro, vou fazer" não é output.
  Output é o diff.
- Em dúvida, pergunte. Não chute. Chute custou um fim de semana ano passado.
```

A coisa que a documentação não te conta: SOUL.md não é arquivo de configuração. É contrato. CLAUDE.md diz pro Claude Code o que é o projeto. SOUL.md diz pro OpenClaw quem é o agente. São duas formas diferentes do mesmo problema de confiança, e o dia em que eu entendi isso foi o dia em que o OpenClaw parou de parecer pior que o Claude Code e começou a parecer diferente.

Deixei uma sessão do Claude Code aberta na outra janela o dia inteiro como sanity check. Por volta das 16h percebi que meu CLAUDE.md tinha 312 linhas e meu SOUL.md tinha 14. O SOUL.md estava fazendo mais trabalho por linha.

## Gateway local, e por que meu colega de LGPD se importou

O OpenClaw roteia toda chamada de LLM por um processo local chamado Gateway.

![Arquitetura do Gateway do OpenClaw: o CLI manda requisições pro Gateway local, que despacha pra provedores LLM, motor de skills e o sistema de arquivos do host](/images/blog/openclaw-claude-code-24h-troca/gateway-architecture.png)

O Gateway fica na sua máquina. Seus prompts e seu código não passam por um relay na nuvem operado pelo OpenClaw a caminho da Anthropic, OpenAI, ou seja lá quem você escolheu. Eles vão direto do laptop pra API do provedor.

Aqui no Brasil, com LGPD em pé e um mercado em que cada vez mais cliente pergunta "o dado sai do país?", isso muda conversa. Um colega meu que cuida de compliance me mandou mensagem na hora do almoço perguntando como era o diagrama de rede. Mostrei. Ele gostou. Essa conversa sozinha já paga o dia.

O Claude Code não tem um intermediário equivalente, mas também não precisa, porque a Anthropic é o único provedor. No momento que você tem suporte multi-provedor, você precisa ou de um relay (com risco de vendor lock-in) ou de um gateway local (a escolha do OpenClaw).

## ClawHub vs Claude Code Skills

Skills do Claude Code são arquivos markdown mais recursos opcionais, distribuídos como você distribui markdown. ClawHub é um marketplace de pacotes estilo npm pra skills do OpenClaw.

```bash
openclaw skills search "docker"
openclaw skills install @clawhub/docker-manager
openclaw skills list
```

ClawHub tinha vários milhares de skills no dia em que eu testei. Os números que o Steinberger cita em conferência são maiores e provavelmente corretos, mas a contagem se mexe rápido o bastante pra qualquer número específico estar errado quando você publicar.

Duas diferenças reais que eu senti:

1. Skills do ClawHub são em JavaScript. Rodam em sandbox mas podem pedir permissão de exec de shell. Isso as deixa mais poderosas que Skills do Claude Code, e mais perigosas. O incidente ClawHavoc em março de 2026 pegou 341 skills maliciosas. É um custo real de marketplace aberto
2. Skills do Claude Code são mais simples de escrever. Escrevi uma Skill em 20 minutos na primeira vez. A skill equivalente do ClawHub me custou uns 90 minutos porque tive que aprender as convenções do SDK

Pra um dev solo querendo compartilhar um workflow, Skills são mais fáceis. Pra um time querendo uma ferramenta versionada, empacotada e auditada, ClawHub é melhor. Não estão competindo pelo mesmo problema.

## As 15h da tarde em que eu quase parei

Pedi pro OpenClaw atualizar um código Python 3.8 pra 3.11 num repo pequeno, rodar a suíte de testes e me dizer o resultado.

Ele fez. A sessão queimou 920 mil tokens, levou uns 14 minutos, achou três lugares onde um colega meu tinha usado walrus operator do jeito errado e corrigiu silenciosamente. Olhei o diff. Estava certo.

O Claude Code faz a mesma coisa. Já rodei o mesmo prompt nele várias vezes.

A diferença não foi no output. A diferença foi que o Claude Code está na minha memória muscular. Eu digito `claude` três vezes por dia faz um ano. Quando eu digitava `openclaw` e esperava o 1,2 segundo a mais de cold start, meus dedos iam pro `claude` por reflexo. Aconteceu três vezes na mesma tarde.

Essa é a parte que ninguém escreve. Custo de troca não é só config. É reflexo. Por volta das 15h eu tinha metade do SOUL.md escrita, quase desisti, fui fazer café e voltei. Por volta das 18h eu estava bem de novo.

## Pra que eu usaria cada um

Montei essa matriz no segundo café.

| Decisão | OpenClaw | Claude Code |
|---|---|---|
| Preso aos modelos da Anthropic? | Não, multi-provedor | Sim, só Anthropic |
| Modelo local | Ollama | Sem opção oficial |
| Distribuição de skill | Marketplace de pacotes ClawHub | Arquivos markdown |
| Arquivo de personalidade | SOUL.md (quem é o agente) | CLAUDE.md (qual é o projeto) |
| Arquitetura de rede | Gateway local, sem relay | Direto pra Anthropic |
| Maturidade | 60 dias, fundação se formando | 18 meses, estável Anthropic |
| Melhor pra | Times multi-modelo, ambientes regulados | Stack Anthropic-first, simplicidade |

Se seu time é só Anthropic e seu CLAUDE.md já tem 200 linhas, não troque. O Claude Code está bom. As Skills que você escreveu continuam boas. O padrão funciona.

Se seu time é multi-provedor, ou seu time de compliance tem perguntas sobre por onde os prompts trafegam, ou você quer um seletor de modelo no backend, OpenClaw vale uma terça-feira.

Eu estou de volta no Claude Code como padrão. Tenho o OpenClaw com alias num comando separado pros casos em que quero testar um modelo diferente no mesmo prompt sem pagar dois SaaS de contexto.

## Onde isso vai parar

A parte que eu estou olhando com mais atenção é o Steinberger indo pra OpenAI enquanto o OpenClaw migra pra fundação. Fundação é como projeto open-source sobrevive ao próprio fundador. Também é como projeto ossifica. Os primeiros seis meses de governança da OpenClaw Foundation vão dizer se isso vira Linux ou se vira Helm.

Se você costumava argumentar que [Claude Code vs Codex era binário](/pt/blog/contexto-vs-prompt-engineering/), o OpenClaw é a resposta que parecia impossível: uma terceira opção que não é produzida por um laboratório de LLM. A economia disso é interessante. Os próximos doze meses vão nos ensinar se ferramenta de IA neutra, multi-provedor, governada por fundação, é sustentável, ou se é silenciosamente absorvida.

Aposto em sustentável. Também já estive errado sobre agentes em basicamente todos os trimestres anteriores, então ajuste sua confiança no meu palpite.

## O que isso tudo me ensinou

Se você levar uma coisa só dessa terça, leve essa. OpenClaw e Claude Code não são concorrentes. São duas respostas pra mesma pergunta: o que a IA dentro do seu terminal pode fazer sem perguntar primeiro. SOUL.md e CLAUDE.md são formas diferentes do mesmo contrato de confiança. O time que escreveu cada um escolheu diferente porque tinha suposições diferentes sobre quem está sentado na frente da tela.

A ferramenta certa é aquela cujas suposições batem com as suas. Escolha por suposição, não por estrela.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
