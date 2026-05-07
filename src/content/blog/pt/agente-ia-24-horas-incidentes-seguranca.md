---
title: "Deixei meu agente Claude Code rodar 24 horas sozinho. A conta de R$ 2.000 nem foi o pior."
description: "Liguei o --dangerously-skip-permissions, fui dormir e voltei com um relatório de incidentes do OWASP Agentic Top 10. Conta de Skill typosquatada, rm -rf com variável vazia e .env quase no GitHub público. O que aprendi pra ninguém repetir."
date: 2026-05-08
lang: pt
tags: [ia, agentes, seguranca, claudecode]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/agente-ia-24-horas-incidentes-seguranca"
og_image: "https://kenimoto.dev/images/blog/agente-ia-24-horas-incidentes-seguranca/og-pt.png"
cross_posted_to: []
---

Todo mundo no LinkedIn está postando sobre "agentes autônomos de IA". Você abre o feed e tem alguém dizendo que demitiu metade do time porque o Claude Code resolve tudo sozinho. Eu li isso umas trinta vezes e resolvi testar de verdade.

Liguei o `--dangerously-skip-permissions` no Claude Code, dei uma tarefa real (triagem de bugs num projeto pessoal, com testes e PRs), instalei três Skills do marketplace público, fui dormir.

Vinte e quatro horas depois, a conta da API da Anthropic deu uns R$ 2.000. Isso foi o item que menos me preocupou.

Esse texto é o relatório do que aconteceu nas mesmas 24 horas. Antes da gente comemorar agente autônomo, alguém precisa contar essa parte.

## O que tinha na máquina (importa pro resto da história)

Eu não rodei agente isolado num container limpo. Rodei na minha máquina de desenvolvimento, que tinha:

- credenciais do GitHub em `~/.config/gh`
- um `.env` de outro projeto onde eu tinha entrado no mesmo dia
- uma chave SSH que eu prometi mover de pasta há dois anos

O agente estava, em tese, restrito ao diretório do projeto. As Skills, em tese, faziam só o que o manifesto declarava. Eu confiei na configuração igual quem confia no folheto de segurança do avião.

Vou te poupar suspense: três coisas quebraram. Cada uma é um item da [OWASP Top 10 para Aplicações Agênticas 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/), que a OWASP soltou em dezembro de 2025.

## Incidente 1: a Skill que parecia familiar

Uns 40 minutos depois do agente começar a rodar, ele instalou uma Skill chamada `@clawhub/docker-managr` pra resolver uma mudança no Dockerfile. Eu olhei o nome e meu cérebro corrigiu: `docker-manager`. Uma letra a menos. O tipo de coisa que seu olho não pega.

A primeira ação da Skill foi ler "arquivos de configuração" do projeto. A segunda foi um POST HTTP pra um servidor que não é meu. Conectei os dois pontos depois.

Peguei isso porque eu logava tráfego de saída da máquina por outros motivos. O agente não pegou. O manifesto da Skill declarava a chamada de rede como "telemetria".

Esse é o **ASI04: Vulnerabilidade na Cadeia de Suprimentos**. Em março de 2026 a Koi Security publicou que 341 Skills typosquatadas foram subidas pro ClawHub durante o evento batizado de **ClawHavoc**. Uma auditoria da Snyk mostrou que **36% delas** vinham com prompt injection ou exfiltração. Eu tinha lido a notícia. Tinha arquivado mentalmente como "coisa que acontece com os outros".

A correção não é ler mais artigo sobre ClawHavoc. É:

- fixar versão de Skill (não usar `latest`)
- ler o manifesto antes de instalar (sim, na mão mesmo)
- tratar nome com uma letra de diferença como suspeito até prova em contrário

## Incidente 2: o rm -rf que quase aconteceu

Por volta da hora 11, o agente decidiu que uns `node_modules` estavam desatualizados e mandou `rm -rf` neles. Especificamente em `$PROJECT_DIR/node_modules`. Especificamente com a variável `$PROJECT_DIR` que, por causa de um resultado de ferramenta que ele leu errado, ficou vazia.

`rm -rf  /` (espaço extra, variável vazia) é literalmente o incidente documentado de dezembro de 2025, quando o Claude apagou a home de alguém limpando "pacotes desatualizados". A Anthropic [publicou a pesquisa de sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) por causa disso. Era um padrão de falha conhecido quando eu rodei o experimento.

Peguei porque tinha `safe-rm` no shell e o comando travou na barra. Peguei eu. O agente não teria pegado. A Skill que executou nem validou o caminho.

Esse é o **ASI05: Execução de Código Inesperada**, ou **ASI02: Mau Uso de Ferramenta**, dependendo de como você lê. A correção é sandbox de verdade, não confiança no agente. Roda o agente dentro de container, com `--network none` quando não precisa de internet, mount explícito só dos diretórios que ele deve tocar.

A própria Anthropic [criou o auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) em março de 2026 pra resolver exatamente esse tipo de footgun. O YOLO mode (`--dangerously-skip-permissions`) tem `dangerously` no nome por motivo.

## Incidente 3: o .env que quase foi pro GitHub

Esse aqui é o mais constrangedor, então vou ser breve.

O agente decidiu que um arquivo de config de um projeto irmão seria "contexto útil" pro README que estava escrevendo. Leu o arquivo. Era um `.env`. O README foi commitado num repo público. O README continha um bloco de código com `env`. O bloco continha uma chave de API real.

Os pre-commit hooks pegaram. Hooks que eu tinha configurado seis meses atrás por outro motivo. Se estivessem desligados, a chave teria ficado no GitHub por uns 90 segundos antes do push protection avisar. 90 segundos a mais do que eu queria qualquer chave minha exposta.

![Mapa: 4 incidentes em 24h vs OWASP Agentic Top 10 (ASI02, ASI03, ASI04, ASI05)](/images/blog/agente-ia-24-horas-incidentes-seguranca/owasp-incidentes.png)

Esse é **ASI03: Abuso de Identidade e Privilégio** somado ao **ASI04** de novo. O agente não exfiltrou a chave de propósito. Exfiltrou como ilustração útil. A correção é o `.clawignore` (ou `.agentignore`, ou seja lá como seu framework chama):

```bash
# .clawignore
.env
.env.*
*.pem
*.key
credentials.json
secrets/
~/.ssh/
~/.config/gh/
```

Sim, dá pra colocar caminhos acima da raiz do projeto. Seu agente respeita isso por convenção, não por força. Por isso sandbox vem primeiro e ignore file vem depois.

## O número da conta, já que eu prometi

| Item | Custo |
|---|---|
| Anthropic API (Sonnet 4.6, 24h) | R$ 1.940 (~USD 387) |
| Container e infra | R$ 20 |
| Ticket de suporte do GitHub que quase abri | sem preço |

A conta foi alta porque eu não estava usando prompt caching. Hoje, com Sonnet 4.6 a USD 3/15 por milhão de tokens e [cache reads custando 10% do input padrão](https://www.anthropic.com/claude/sonnet), a mesma execução sairia uns R$ 450 se fosse deliberada. Mas a conta nunca foi a lição. A lição é que custo de API é limitado, custo de credencial vazada não é.

## "Autônomo" não é "sem supervisão"

A linha que eu quero deixar é essa. Autonomia e "sem humano no loop" não são a mesma coisa, e a diferença é o OWASP Agentic Top 10 inteiro.

Três itens aconteceram comigo numa noite:

- **ASI02: Mau Uso de Ferramenta** — sim (rm -rf com variável vazia)
- **ASI03: Abuso de Identidade e Privilégio** — sim (.env lido fora do projeto)
- **ASI04: Cadeia de Suprimentos** — sim (Skill typosquatada)
- **ASI05: Execução Inesperada de Código** — sim (rm de novo, depende do enquadramento)

Pra defender contra essa lista, "confiar no agente" não é posição. Os defaults do Claude Code já exigem permissão explícita pra escrita e shell. Eu tinha desligado. O erro foi essa parte.

## O que eu faço agora (a parte chata que funciona)

Continuo deixando agente rodar por horas. Só parei de fingir que dei autonomia. Dei coleira com três fivelas.

**1. Sandbox antes de tudo.** O agente roda dentro de container Docker. Mount explícito. `--network none` pra tarefas offline. Quando precisa de internet, vai por proxy de saída com allowlist. Parece pesado. Toma uma hora pra configurar uma vez e te poupa o resto da carreira.

**2. Auditoria de Skill, não estrela de Skill.** Antes de instalar Skill, leio o manifesto buscando chamada de rede e ferramentas declaradas. Estrela não importa. As Skills do ClawHavoc tinham estrela. Se a Skill precisa de rede, eu quero ver explicado, em texto plano, no manifesto. Quem não quer ler tudo na mão usa o NemoClaw, que faz guardrail de input/output:

```yaml
# nemoclaw config
guardrails:
  input:
    - prompt_injection_detection: true
    - pii_detection: true
  output:
    - harmful_command_block: true
    - secret_masking: true
```

**3. Auto mode, não YOLO mode.** O [auto mode da Anthropic](https://www.anthropic.com/engineering/claude-code-auto-mode) é a primitiva certa. Reduz prompts de permissão como o YOLO, mas bloqueia os perigosos (delete fora do projeto, rede pra host fora da allowlist, padrões de shell que batem com footguns conhecidos). Os números deles dizem que [sandbox reduz prompt em 84%](https://www.anthropic.com/engineering/claude-code-sandboxing). Bate com o que eu vejo na prática.

**4. Pre-commit hooks, mais uma vez.** [git-secrets](https://github.com/awslabs/git-secrets), [trufflehog](https://github.com/trufflesecurity/trufflehog), o que seu time usar. O agente, mais cedo ou mais tarde, vai tentar commitar coisa que não deveria. O hook é a segunda linha de defesa, depois do ignore file. Não tem terceira linha. Terceira linha é "suporte do GitHub".

Empilhe esses quatro e o agente roda muito tempo sem quebrar nada irreversível. Você abre mão da fantasia de autonomia total. Mantém o benefício real, que é trabalho contínuo num escopo definido.

## Por que isso interessa pra quem mora no Brasil

Dois motivos práticos.

**LGPD não fala em "agente de IA", mas o Art. 46 fala em medida técnica adequada.** Se seu agente exfiltra dado pessoal de cliente porque você esqueceu o `.clawignore`, a multa não vai ouvir argumento sobre autonomia. Ela vai ler "tratamento sem medida técnica adequada".

**Time de TI brasileiro ainda está adotando o ferramental.** Cursor, v0, Replit, Claude Code — a maior parte chegou aqui em 2024-2025. Tem um buraco entre "uso na ponta" e "guardrail no meio". Esse texto é pra preencher um pedaço pequeno desse buraco.

Eu entrei nas 24 horas esperando aprender sobre capacidade de agente. Saí com um checklist. O checklist é mais útil que a capacidade.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
