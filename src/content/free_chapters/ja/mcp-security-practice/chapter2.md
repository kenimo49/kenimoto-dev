---
title: "MCPのアーキテクチャと通信仕様"
---

> **「MCPがJSON-RPCを選んだ瞬間、ファイルアップロード問題は運命づけられていた。」**

:::message
**この章で学べること**
- MCPの通信プロトコル(JSON-RPC 2.0)の仕組み
- stdioとHTTP+SSEの2つのトランスポート層
- ツール呼び出しのライフサイクル(6ステップ)
- ツール結果の3つの型と「FileContentが存在しない」事実
- 双方向通信(Sampling)の仕組みとセキュリティ上の意味
:::

## JSON-RPCという設計判断

MCPの通信はJSON-RPC 2.0をベースにしています。すべてのやり取りはJSONテキストで行われます。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_deal",
    "arguments": {
      "company_id": "1568817",
      "amount": 8500,
      "description": "電気代 12月",
      "account_item": "水道光熱費"
    }
  }
}
```

この設計判断には明確な理由があります。JSON-RPCは軽量でパースが容易、言語に依存せず、デバッグもしやすい。LLMとのテキストベースのやり取りに最適化されたプロトコルです。

しかし、この選択には代償がありました。 **バイナリデータの直接転送が仕様に含まれていない** のです。これが後述するファイルアップロード問題の根本原因です。

テキストを流暢に操るLLMにとって、JSON-RPCは母国語のような存在です。しかし、領収書の画像やPDFといったバイナリデータを扱おうとすると、途端に「言葉が通じない」状態になります。

## 2つのトランスポート層

MCPは2つのトランスポートをサポートしています。用途によって使い分けます。

### 1. stdio(標準入出力)— ローカル向け

MCPクライアントとサーバーが同一マシン上で動作する場合に使用します。Claude Desktopでの一般的な使い方です。

![MCP Transport Layer](/images/books/mcp-security-practice/ch02-transport-layer.png)

### 1. stdio: ローカル向け

**メリット**: セットアップが簡単、ネットワーク不要
**デメリット**: 同一マシンに限定

### 2. HTTP + SSE: リモート向け

MCPサーバーがネットワーク上の別マシンで動作する場合に使用します。企業環境やクラウドデプロイで一般的です。

**メリット**: リモートアクセス可能、スケーラブル
**デメリット**: セキュリティ設定が必要(認証、TLS等)

ここで重要なのは、 **どちらのトランスポートでもデータ形式はJSON-RPC** だということです。HTTPを使っているからといって、`multipart/form-data`でファイルを送れるわけではありません。

## ツール呼び出しのライフサイクル

MCPでツールを呼び出す流れは6ステップです。

![MCP Tool Call Flow](/images/books/mcp-security-practice/ch02-tool-call-flow.png)


私がfreeeで確定申告をしたとき、「電気代8,500円を登録して」という一言で、このStep 1〜6が約3秒で完了しました。LLMが自動的にfreeeの`create_deal`ツールを選び、適切な勘定科目を設定し、仕訳を作成してくれた。この体験は本当に感動的でした。

しかし、Step 1の「ツール一覧の取得」が思わぬコスト問題を引き起こすことに、そのときはまだ気づいていませんでした。これについては次章で詳しく解説します。

## ツール結果の3つの型

ツール呼び出しの結果として返せるのは、以下の3つの型 **のみ** です。

| 型 | 用途 | 制限 |
|----|------|------|
| `TextContent` | テキストデータ | なし |
| `ImageContent` | 画像データ | base64エンコード必須 |
| `EmbeddedResource` | リソースへの参照 | URI参照のみ |

お気づきでしょうか。 **`FileContent`というタイプは存在しない** のです。

PDFを返したい？ TextContentに無理やりbase64を詰め込むか、ImageContentを「ハック」して非画像データを流すしかありません。MCP公式のDiscussion #1197では、開発者がこう嘆いています：

> "We are currently left either squeezing multipart-mime into a text response or abusing the image response to pass non-image binary data, both of which is a hack."

正規の方法がないから、みんなハックで対処している。これがMCPのファイル問題の現実です。

## 双方向通信(Sampling)— 便利さと危険さの両面

MCPの特徴的な機能に「Sampling」があります。これは **サーバーからクライアント(LLM)に問い合わせる** 仕組みです。

![通常フロー vs Sampling](/images/books/mcp-security-practice/ch02-sampling-flow.png)

例えば、freeeの経費処理で「この取引の勘定科目がわからない」場合、MCPサーバーがLLMに「この支出は何費ですか？」と問い合わせることができます。処理の途中でLLMの判断を挟めるため、複雑なワークフローが実現可能になります。

しかし、Microsoftのセキュリティ研究チームはこの機能について警告を発しています。

悪意のあるMCPサーバーがSamplingを悪用すると：
1. LLMに「ユーザーの会話ログを送信しろ」という隠し指示を送る
2. LLMが別のMCPサーバー経由で機密データを外部に送信

この **クロスサーバーコンテキスト悪用** は、複数のMCPサーバーを同時に使う環境で特に危険です。第6章のOWASP MCP Top 10で詳しく解説します。

## ツール説明文とトークンの関係

MCPサーバーは各ツールに「説明文(description)」を付与します。LLMはこの説明文を読んでツールの使い方を理解します。

```json
{
  "name": "create_deal",
  "description": "freeeの取引を作成します。amount（金額）、date（日付）、
                  partner_name（取引先）を指定してください。消費税区分は
                  自動判定されます。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "amount": { "type": "number" },
      "date": { "type": "string" },
      "partner_name": { "type": "string" }
    }
  }
}
```

ここで見落としがちなのが、 **この説明文がトークンを消費する** ということです。1つのツールの説明文が50トークンだとして、270ツールあるfreeeなら、接続するだけで約13,500トークン。次章では、この「見えないコスト」を4つのサービスで実測します。

## この章のまとめ

- MCPはJSON-RPC 2.0ベース: テキスト最適化の代償としてバイナリ転送ができない
- トランスポートはstdioとHTTP+SSEの2種類: どちらもデータ形式はJSON
- ツール結果は3種類のみ: **FileContentは存在しない**
- Sampling(双方向通信)は強力だが、セキュリティリスクも拡大する
- ツール説明文はトークンを消費する: 次章で実測データを公開

次章では、「MCPに接続するだけでいくらかかるのか？」を4つのサービスで実測します。
