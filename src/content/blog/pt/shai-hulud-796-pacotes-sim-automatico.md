---
title: "796 pacotes npm comprometidos por gente que apertou 'Sim' no automático — a anatomia do Shai-Hulud"
description: "O worm Shai-Hulud 2.0 sequestrou 796 pacotes npm e mais de 25 mil repositórios em poucos dias, transformando cada vítima no próximo atacante. Eu apertava 'Sim' no Claude Code sem ler. A anatomia do ataque, o que o npm mudou em 2026 e o checklist que uso hoje."
date: 2026-06-13
lang: pt
tags: [seguranca, npm, claudecode, supply-chain, ia]
featured: false
canonical_url: "https://kenimoto.dev/pt/blog/shai-hulud-796-pacotes-sim-automatico/"
og_image: "https://kenimoto.dev/images/blog/shai-hulud-796-pacotes-sim-automatico/og-pt.png"
cross_posted_to: []
---

Você confia no Claude. O Claude confia no registro npm. E o registro npm confia em qualquer pessoa com um e-mail válido. Em algum ponto dessa cadeia de confiança, alguém colocou um worm.

Eu sei como é o ritmo: o agente sugere `npm install alguma-coisa`, o prompt de permissão aparece, e a sua mão já apertou "Y" antes do seu cérebro terminar de ler o nome do pacote. Eu fazia isso dezenas de vezes por dia. Cheguei a me orgulhar da velocidade, o que, em retrospecto, é como se orgulhar de assinar contratos sem ler porque a caneta é rápida.

Aí fui estudar o Shai-Hulud em detalhe, e a velocidade perdeu a graça.

## O que aconteceu, com datas e números verificáveis

Shai-Hulud é o nome dos vermes de areia de *Duna*: ficam embaixo da superfície, sentem a vibração e engolem o que estiver em cima. O worm de npm batizado com esse nome funciona igual. Ele dorme dentro de um pacote e acorda no seu `npm install`.

A linha do tempo real, segundo as análises da Unit 42, Check Point, Wiz e Microsoft:

- **Setembro de 2025**: primeira onda. O worm compromete centenas de pacotes npm usando tokens roubados de mantenedores.
- **21 a 23 de novembro de 2025**: a segunda onda, "Shai-Hulud 2.0", sequestra **796 pacotes npm únicos** e expõe mais de **25 mil repositórios** no GitHub em poucos dias. Entre as vítimas: pacotes do Zapier, PostHog, Postman e ENS Domains, somando mais de 20 milhões de downloads semanais.
- **2026**: o modelo virou franquia. "The Third Coming" em abril, e o "Mini Shai-Hulud" em maio comprometendo pacotes do TanStack, da Mistral AI e do AntV. Numa das ondas de maio, o grupo TeamPCP publicou 323 pacotes maliciosos em uma rajada automatizada de **22 minutos**.

![Fluxo do ataque Shai-Hulud em quatro etapas: infectar via npm install, roubar credenciais, se auto-propagar com os tokens npm da vítima, e destruir o diretório home se a exfiltração falhar](/images/blog/shai-hulud-796-pacotes-sim-automatico/fluxo-ataque.png)

A mecânica tem quatro etapas, e a terceira é a que justifica o nome de worm:

1. **Infectar.** O código malicioso roda no `preinstall`, antes de qualquer coisa aparecer na sua tela.
2. **Roubar.** Ele varre o ambiente atrás de chaves de API, tokens do GitHub, credenciais de nuvem e tokens npm.
3. **Auto-propagar.** Com os tokens npm roubados, ele injeta o malware nos pacotes que **a vítima** mantém e os republica. O desenvolvedor infectado vira o próximo atacante, sem saber.
4. **Destruir.** Na versão 2.0, se o malware não consegue roubar nada nem abrir canal de exfiltração, ele tenta sobrescrever e apagar todos os arquivos graváveis do seu diretório home. Nem dá para chamar de chantagem: o ransomware pelo menos manda um boleto antes de destruir alguma coisa.

## Por que o "Sim automático" é exatamente a porta de entrada

O ponto que me incomoda: nenhuma dessas etapas explora uma vulnerabilidade técnica sofisticada do seu sistema. Elas exploram um hábito.

Claude Code é bom, mas não detecta typosquatting em 100% dos casos, e não tem como saber que a versão 4.2.1 de um pacote legítimo, publicada ontem à noite, foi republicada por um worm com o token roubado do mantenedor. Quando o próprio agente sugere "vou instalar este pacote" e você aprova, o fluxo inteiro parece legítimo. A fronteira de confiança ficou borrada: você confia no agente, o agente confia no registro, e o registro aceita pacote de qualquer um.

E tem o atalho que transforma o problema em catástrofe: `--dangerously-skip-permissions`. O nome da flag é literalmente "perigosamente". Usar isso numa máquina com chaves SSH, `.npmrc` e credenciais de nuvem é remover a única etapa em que um humano poderia notar algo estranho.

No contexto brasileiro, vale fazer a conta com números locais. Boa parte das fintechs do país tem Node.js em produção, e os segredos que circulam num ambiente de desenvolvimento de pagamento incluem chaves de PSP e credenciais de integração Pix. Um token vazado nesse cenário significa acesso a movimentação financeira real, com prejuízo medido em reais e comunicação obrigatória ao Banco Central no caso de incidente relevante. Ler o nome do pacote por um segundo custa uma fração minúscula do que custa explicar isso para o seu compliance.

## A defesa que dá para montar hoje

### 1. Regras de segurança no CLAUDE.md

A primeira camada é dizer explicitamente ao agente como tratar instalação de pacotes:

```markdown
## Regras de npm install
- Antes de instalar pacote novo, reporte: nome, autor e downloads semanais
- Avise se os downloads semanais ficarem abaixo de 1.000
- Sinalize nomes que podem ser typosquatting
- Exiba o conteúdo de scripts postinstall/preinstall antes de executar

## Arquivos proibidos de ler
- .env*, *.pem, *.key, ~/.npmrc, ~/.ssh/*, ~/.aws/*
```

Pense nisso como a primeira camada de uma defesa em profundidade. CLAUDE.md sozinho não para um worm, mas combinado com permissões do sistema e os itens abaixo, derruba bastante a probabilidade de sucesso do ataque.

### 2. Aproveitar o que o npm mudou em 2026

Depois das ondas do Shai-Hulud, o GitHub endureceu o registro, e vale ativar tudo que ficou disponível:

- **Trusted publishing (OIDC)**: o pacote só aceita versões novas publicadas pelo CI/CD configurado. Token roubado do laptop do mantenedor deixa de servir para republicar.
- **Provenance attestation**: vínculo criptográfico entre a versão publicada, o commit de origem e o build que a gerou. `npm audit signatures` confere isso na sua máquina.
- **Tokens clássicos revogados**: tokens granulares com expiração de 7 dias para publicação, e 2FA baseado em FIDO no lugar de TOTP.

Se você mantém qualquer pacote público, migrar para trusted publishing é provavelmente a ação com melhor relação custo-benefício desta página inteira.

### 3. O checklist de um segundo

O que eu faço hoje, na prática:

```markdown
Antes de aprovar:
□ Li o nome do pacote inteiro (typo? escopo estranho?)
□ Pacote novo no projeto? Olhei downloads semanais e autor
□ O comando tem postinstall? Pedi para ver o conteúdo

Uma vez por semana:
□ npm audit / verificar alertas de dependências
□ Conferir tokens em ~/.npmrc e revogar os que não uso

Nunca:
□ --dangerously-skip-permissions em máquina com credenciais reais
```

## Confie, mas verifique

Reagan usava a expressão "confie, mas verifique" nas negociações de desarmamento. Serve perfeitamente para a relação com agentes de IA.

Eu continuo usando Claude Code todos os dias. Continuo instalando pacote npm sugerido por ele. A diferença é aquele um segundo entre a sugestão e o "Sim": ler o nome, imaginar o que o comando faz, decidir de verdade. 796 pacotes comprometidos, 25 mil repositórios expostos e um worm que ainda está gerando sequência em 2026 dizem que esse segundo é a linha de defesa mais barata que existe.

A piada pronta é que a IA ia roubar o nosso emprego. Por enquanto, o que ela fez foi me devolver um hábito que eu tinha perdido: ler antes de assinar.

Uma versão mais longa dessa análise, com os templates completos de CLAUDE.md e as políticas de retenção de dados por plano, está no capítulo 16 do livro que escrevi sobre Claude Code, em português.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/pt/) · [TabNews](https://www.tabnews.com.br/kenimo49)*
