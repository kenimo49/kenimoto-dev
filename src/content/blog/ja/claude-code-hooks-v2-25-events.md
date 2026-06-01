---
title: "Claude Code Hooks v2 — 「お願い」を「プログラム」に変える25のイベント"
description: "CLAUDE.mdに書いたルールは「お願い」にすぎない。Hooks v2は25種のイベントと4種のハンドラーで、AIの動作にプログラム的に介入する仕組みです。settings.jsonに書くだけで今日から使えます。"
date: 2026-05-02
lang: ja
tags: [claude-code, hooks, ai-agent, automation, developer-tools]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/claude-code-hooks-v2-25-events/"
---

CLAUDE.mdに「ファイル編集後は必ずlintを走らせて」と書きました。3日間は守られていました。4日目、deadlineに追われたClaude Codeは見事にlintをスキップし、フォーマットが壊れたコードをそのままコミットしてくれました。

私は、部下への口頭指示が3日で蒸発する中間管理職の気持ちを、AIとの間で追体験していました。

CLAUDE.mdの指示は「お願い」です。Claudeはお願いを覚えていますが、忘れることもあります。100回中95回は守るかもしれない。でも残りの5回が本番障害を引き起こしたら?

Hooks v2は「お願い」を「プログラム」に変えます。

![CLAUDE.md vs Hooks v2の比較: 「お願い」から「プログラム」へ](/images/blog/claude-code-hooks-v2-25-events/claude-md-vs-hooks.png)

## CLAUDE.md vs Hooks: 何が違うのか

CLAUDE.mdはClaude Codeへのテキスト指示です。Claudeのコンテキストに読み込まれ、「こうしてほしい」と伝えます。ほとんどの場合は機能します。でも「ほとんど」では足りない場面があります。

Hooksはsettings.jsonに定義するプログラムです。Claude Codeの動作に介入し、条件に合致したときにシェルコマンドやWebhookを自動実行します。Exit code 2を返せば、ツールの実行そのものをブロックできます。

違いを一言で言うと、CLAUDE.mdは「守ってね」で、Hooksは「守らせる」です。

テストがバグの不在を証明できないように、CLAUDE.mdもルールの遵守を保証できません。Hooksはルールをコードにすることで、遵守しなければ先に進めない仕組みを作ります。

![Hooks v2: 6カテゴリ25+イベントの全体像](/images/blog/claude-code-hooks-v2-25-events/6-categories-25-events.png)

## 25のイベント、6つのカテゴリ

前作のHooksはPreToolUseとPostToolUseの2イベントだけでした。Hooks v2は25種類以上のイベントに対応しています。まったく別のシステムです。

6つのカテゴリに整理すると見通しが良くなります。

### セッションライフサイクル

| イベント | タイミング |
|---------|----------|
| **SessionStart** | セッション開始(起動/再開/クリア/コンパクション後) |
| **SessionEnd** | セッション終了 |
| **InstructionsLoaded** | CLAUDE.mdやrulesファイルの読み込み時 |

### ツール実行

| イベント | タイミング | ブロック可能 |
|---------|----------|:----------:|
| **PreToolUse** | ツール実行前 | Yes |
| **PostToolUse** | ツール実行成功後 | - |
| **PostToolUseFailure** | ツール実行失敗後 | - |
| **PermissionRequest** | 権限ダイアログ表示時 | - |
| **PermissionDenied** | 自動モードでツール拒否時 | - |

### エージェント

| イベント | タイミング |
|---------|----------|
| **SubagentStart** | Sub-agent起動時 |
| **SubagentStop** | Sub-agent終了時 |
| **TeammateIdle** | チームメイトがアイドル時 |
| **TaskCreated** | タスク作成時 |
| **TaskCompleted** | タスク完了時 |

### ファイル・環境

| イベント | タイミング |
|---------|----------|
| **FileChanged** | 監視対象ファイルの変更時 |
| **CwdChanged** | 作業ディレクトリ変更時 |
| **ConfigChange** | 設定ファイル変更時 |
| **WorktreeCreate** | Git worktree作成時 |
| **WorktreeRemove** | Git worktree削除時 |

### コンテキスト

| イベント | タイミング | ブロック可能 |
|---------|----------|:----------:|
| **PreCompact** | コンパクション前 | Yes |
| **PostCompact** | コンパクション後 | - |

### MCP・通知

| イベント | タイミング |
|---------|----------|
| **Elicitation** | MCPサーバーがユーザー入力を要求時 |
| **ElicitationResult** | ユーザーがMCP elicitationに応答後 |
| **Notification** | 通知送信時 |
| **StopFailure** | APIエラーでターン終了時 |
| **UserPromptSubmit** | ユーザー入力をClaude処理前 |

25のイベントを全部覚える必要はありません。実際に使うのは最初の数個です。ほとんどの開発者にとって、PreToolUse + PostToolUse + SessionStartの3つで用事の8割は片付きます。

残り22個は「いつか使うかもしれない引き出し」です。本棚の端にある辞書みたいなもので、存在を知っておくだけで十分です。

## settings.jsonの書き方

Hooksはsettings.jsonに定義します。構造は3層です。

```json
{
  "hooks": {
    "イベント名": [
      {
        "matcher": "マッチ対象",
        "hooks": [
          {
            "type": "command",
            "command": "実行するコマンド",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**イベント名** -> **マッチャー配列** -> **ハンドラー配列**。1つのイベントに複数のマッチャーを設定でき、1つのマッチャーに複数のハンドラーをチェインできます。

マッチャーはイベントの種類によって異なる対象にマッチします。ツールイベントならツール名(`"Bash"`、`"Edit|Write"`)、SessionStartなら起動理由(`"startup"`、`"resume"`)、SubagentStart/StopならSub-agentの名前です。`"*"` や空文字、またはmatcher自体の省略で全てにマッチします。

## 実践例3つ: 今日から使える設定

### 1. 破壊的コマンドをブロックする(PreToolUse)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(git push --force*)",
            "command": "echo 'force pushはブロックされています' >&2; exit 2"
          }
        ]
      }
    ]
  }
}
```

`exit 2` が鍵です。Exit code 0は成功、exit code 1は非ブロックエラー(ログされるだけ)、**exit code 2だけがツール実行をブロック**します。

CLAUDE.mdに「force pushしないで」と書いても、急いでいるClaudeは忘れるかもしれません。このHookなら、物理的にforce pushできなくなります。

同じパターンで `.env` ファイルの編集防止もできます。

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    {
      "type": "command",
      "if": "Edit(*.env*)|Write(*.env*)",
      "command": "echo '.envファイルの編集は禁止です' >&2; exit 2"
    }
  ]
}
```

### 2. ファイル保存後に自動フォーマット(PostToolUse)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE_PATH\"",
            "timeout": 30,
            "statusMessage": "Prettierでフォーマット中..."
          }
        ]
      }
    ]
  }
}
```

CLAUDE.mdに「Prettierを走らせて」と書く代わりに、Hooksに書けば **毎回確実に** 走ります。忘れるのは人間もAIも同じ。仕組みで解決するほうが健全です。

### 3. セッション開始時に環境変数を設定(SessionStart)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'export NODE_ENV=development' >> \"$CLAUDE_ENV_FILE\""
          }
        ]
      }
    ]
  }
}
```

`$CLAUDE_ENV_FILE` はSessionStartイベント限定の特殊変数で、ここに書き込んだ環境変数はセッション全体で有効になります。「開発環境では必ず `NODE_ENV=development` にする」をプログラム的に保証します。

## 4種類のハンドラー

Hooks v2には4種類のハンドラーがあります。

**command**: シェルコマンドを実行します。もっとも基本的で、ほとんどのユースケースはこれでカバーできます。標準入力にイベント情報がJSONで渡されます。

**http**: Webhookとして外部サービスにPOSTリクエストを送信します。2026年2月に追加されたハンドラーで、SlackやDiscordへの通知、外部監視システムとの連携に使えます。

```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/pre-tool-use",
  "headers": { "Authorization": "Bearer $MY_TOKEN" },
  "allowedEnvVars": ["MY_TOKEN"],
  "timeout": 30
}
```

**prompt**: 別のLLMにイベント内容を評価させます。「このコマンドは安全ですか?」をAIに判断させるセキュリティゲートとして使えます。

**agent**: Sub-agentを起動して検証を行います。Read/Grep/Globなどのツールを使った複雑な検証ロジックに向いています。実験的機能です。

正直なところ、最初はcommandだけで十分です。httpは外部連携が必要になったとき、promptとagentは「人間の判断をAIに委譲したい」ときに検討すればよいです。全部使いこなそうとすると、道具に振り回される日曜大工みたいになります。

## 私が使っている設定

私の実際のsettings.jsonから、特に効果を感じている設定を紹介します。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(git push --force*)",
            "command": "echo 'force pushはブロック' >&2; exit 2"
          }
        ]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "if": "Edit(*.env*)|Write(*.env*)",
            "command": "echo '.env編集はブロック' >&2; exit 2"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE_PATH\"",
            "timeout": 30
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'export NODE_ENV=development' >> \"$CLAUDE_ENV_FILE\""
          }
        ]
      }
    ]
  }
}
```

この設定で実現していること:

- `git push --force` が物理的にブロックされる
- `.env` ファイルが編集不可になる
- ファイル保存のたびにPrettierが自動実行される
- セッション開始時にNODE_ENVが自動設定される

CLAUDE.mdには同じことが4行のテキストで書けます。でもテキストは忘れられる可能性があります。このsettings.jsonは忘れません。

## 始め方

Hooks v2を始めるのに25イベントを全部理解する必要はありません。

**Step 1**: 自分のCLAUDE.mdを開いて、「守られないと困るルール」を1つ見つける。

**Step 2**: そのルールをPreToolUseまたはPostToolUseのHookに変換する。

**Step 3**: settings.jsonに追加して動作確認する。

これだけです。1つのHookが動くのを見たら、「次はあのルールもHookにできるな」と自然に広がっていきます。

CLAUDE.mdを書くのをやめる必要はありません。ルールの中で「守られなくても困らないもの」はCLAUDE.mdに残し、「守られないと困るもの」だけをHooksに昇格させる。この使い分けが現実的です。

私はHooks v2を導入してから、lintのスキップが完全にゼロになりました。CLAUDE.mdに3回書き直しても直らなかったことが、settings.jsonの5行で解決した。テクノロジーの正しい使い方だと思います。もっとも、その5行を書くのに半日かかったのは内緒です。

## 参考リンク

- [Hooks reference - Claude Code Docs](https://code.claude.com/docs/en/hooks) - 公式リファレンス
- [Claude Code Hooks: Complete Guide](https://claudefa.st/blog/tools/hooks/hooks-guide) - 全12ライフサイクルイベント解説
- [Claude Code Hooks Tutorial](https://blakecrosley.com/blog/claude-code-hooks-tutorial) - 実践チュートリアル(5パターン)

---

## さらに深掘りしたい方へ

本記事で触れたのは一部です。CLAUDE.md の書き方を「2行から100行まで」、Plan Mode 起点の開発フロー、チーム運用、非コーディング業務への応用まで、19章で体系化した **[実践Claude Code — コンテキストエンジニアリングで開発が変わる](https://kenimoto.dev/ja/books/claude-code-mastery)** を参考にしてください。
