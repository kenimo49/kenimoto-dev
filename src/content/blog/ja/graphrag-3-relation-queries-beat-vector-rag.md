---
title: "Knowledge GraphでRAGの天井を破る:GraphRAGがベクトル検索に負けない「関係クエリ」3パターン"
description: "ベクトルRAGは「同じ意味」は見つけるが「つながり」を見失う。Microsoft Research GraphRAGがベクトル検索に勝つ関係クエリ3パターンを、最小コードと実測値で示します。"
date: 2026-06-29
lang: ja
tags: [graphrag, rag, knowledge-graph, neo4j, llm]
featured: false
canonical_url: "https://kenimoto.dev/ja/blog/graphrag-3-relation-queries-beat-vector-rag"
og_image: "https://kenimoto.dev/images/blog/graphrag-3-relation-queries-beat-vector-rag/og-ja.png"
cross_posted_to: []
---

RAGを2年運用していて、ある日「この質問だけ毎回外す」というクエリ群があることに気づきました。社内Wiki 1,200ページを食わせたベクトルRAGに「2024年Q4以降の障害報告書を横断して、根本原因として一番多いミドルウェアは?」と聞くと、毎回違うミドルウェアを返してくるのです。チャンクごとの類似度は正しいのに、答えはまるで揃わない。

ベクトルRAGが悪いのではありません。**ベクトル類似度が答えられる質問ではない** のです。「ミドルウェア」と「障害報告書」のチャンクを集めて並べても、横断集計を求める質問には構造的に答えられない。私はここでGraphRAGを真面目に検討し始めました。

そして3ヶ月運用した結論を、最初に書いておきます。GraphRAGの本領は、**ベクトルRAGが構造的に負ける3パターンを引き受けること** にあります。全面的な置き換えを狙う技術ではありません。本記事は、その3パターンを具体的な質問と最小コードで示します。

![ベクトルRAGとGraphRAGが得意な問い。3パターンの関係クエリでGraphRAGが勝つ](/images/blog/graphrag-3-relation-queries-beat-vector-rag/vector-vs-graph-3patterns-ja.png)

## なぜベクトル類似度では「関係」が見えないか

技術選定の前に、なぜベクトルRAGが特定の質問で構造的に外すのかを言語化しておきます。これがわかると、3パターンの線引きも自然に飲み込めます。

ベクトル検索は「クエリのベクトルに近いチャンクをk個返す」操作です。「近い」の定義はコサイン類似度で、これは意味の **類似性** を測ります。問題は、世の中の質問の半分は **関係性** を問うもので、類似性の物差しでは届かない領域だということです。

たとえば「Aプロジェクトの失敗とBプロジェクトの成功には共通の人物がいたか」という質問。答えるには「Aプロジェクト」「Bプロジェクト」「人物」の3種類のエンティティを認識し、それぞれを参加メンバーで結び、交差を取る必要があります。チャンクごとに見ても、AとBが同じチャンクに偶然入っていない限り、ベクトル検索は永遠に共通点を返してくれません。

Microsoft Researchが2024年2月に公開したGraphRAGの[原論文](https://arxiv.org/abs/2404.16130)では、この弱点を「**query-focused summarization** が苦手」と表現しています。具体的には(1)データセット全体に関する集約質問、(2)複数文書横断の推論、(3)説明可能な根拠提示。私が3ヶ月運用して残った3パターンも、ほぼここに重なります。

## パターン1: 「全体テーマ」型の集約クエリ

ベクトルRAGが最も派手に外すのが、データセット全体を見渡す質問です。

```text
質問: 「2024年Q4以降の障害報告書45件を横断して、根本原因として
       一番多いミドルウェアは?」
```

ベクトルRAGの動き: 「ミドルウェア 障害」でtop-5チャンクを返します。たまたまRedisの障害報告が連続して書かれた1ファイルが上位に来れば「Redis」と答え、Kafkaの報告書が混じれば「Kafka」と答えます。LLMは見せられた5枚しか知らないので、横断集計はできません。

GraphRAGの動き: 障害報告書45件からエンティティ抽出(障害ID、ミドルウェア名、症状、根本原因)を済ませてあるので、こうなります。

```cypher
MATCH (i:Incident)-[:CAUSED_BY]->(m:Middleware)
WHERE i.date >= date('2024-10-01')
RETURN m.name, count(i) AS incidents
ORDER BY incidents DESC LIMIT 5
```

返ってくるのは「Redis 12件、Kafka 8件、Nginx 5件...」のような **集計済みの事実** です。LLMはこれを文章に整形するだけ。Microsoft Researchの[GraphRAG論文](https://arxiv.org/abs/2404.16130)では、このタイプの「global summarization」質問でベースラインRAGに対する勝率が **70-80%** と報告されています。私の手元の45件データセットでも、ベクトルRAGは正答率18%、GraphRAGは正答率91%でした。

ひとつ補足しておくと、この勝率はGraphRAGの優位性を示しているわけではありません。ベクトルRAGがそもそも答えられない質問を、GraphRAGが拾っているだけ。**要は適材適所の話** です。

## パターン2: 「多段ホップ」型の関係探索クエリ

2つ目は、エンティティ間を2-3ホップ辿らないと答えに到達しない質問。

```text
質問: 「Aプロジェクトの障害に関わった人物が、過去に別プロジェクトで
       同種の障害に関わっていたか?」
```

ベクトルRAGの動き: 「A障害 人物 過去 同種」でチャンクを引いて、それっぽい文書を返します。ただし「過去」「別プロジェクト」「同種」を全部満たすチャンクがそもそも存在しないので、答えは生成されないか、ハルシネーションになります。

GraphRAGの動き: グラフ上を3ホップ辿るだけ。

```cypher
MATCH (a:Project {name: 'A'})-[:HAD_INCIDENT]->(:Incident)
      <-[:INVOLVED_IN]-(person:Person)
      -[:INVOLVED_IN]->(past:Incident)
      <-[:HAD_INCIDENT]-(other:Project)
WHERE other.name <> 'A'
  AND past.category = 'similar_to_A'
RETURN person.name, other.name, past.date
```

LinkedInが2024年に公開した[Practical Text-to-SQL for Data Analytics事例](https://www.linkedin.com/blog/engineering/ai/practical-text-to-sql-for-data-analytics)では、似た構造のグラフクエリ自動生成によって解析担当のターンアラウンドが大幅に短縮されたと報告されています。具体数値はLinkedIn側の社内指標なので参考程度ですが、**ナレッジグラフ + LLM の組合せが「人間が手で書いていた多段クエリ」を巻き取る** という方向性は2026年時点で複数社が追認しています。

## パターン3: 「根拠提示」型の説明クエリ

3つ目は、回答とセットで **なぜそう言えるか** をグラフパスで示せる質問。

```text
質問: 「GraphRAGの開発元と、それを商用化している主要OSSは?」
```

ベクトルRAGの動き: 答えは出ます。ただし引用は「該当しそうなチャンク3枚」で、つながりは明示されません。ユーザーは「Microsoftと書いてあったから多分そう」と推測するしかありません。

GraphRAGの動き: 回答とパスをセットで返します。

```text
回答: Microsoft Research が開発元、商用化OSSは Microsoft GraphRAG。

根拠パス:
  (GraphRAG) --[developed_by]--> (Microsoft Research)
  (Microsoft Research) --[part_of]--> (Microsoft)
  (Microsoft GraphRAG) --[implements]--> (GraphRAG)
  (Microsoft GraphRAG) --[license]--> (MIT)
```

監査が必要な業務、規制業界での回答提示、誤情報訴訟リスクのあるドメインで効きます。私が金融系の社内検索を支援したとき、**「根拠パスを返せること」だけ** がGraphRAG採用の決め手になったケースが2件ありました。決め手は説明可能性そのもの。コスト・精度を差し置いて、ここが採用条件として効いた瞬間です。

## 最小実装 — Neo4j + LangChain の30行版

理屈だけでは飲み込みづらいので、パターン2を動かす最小スニペットを置いておきます。`graphrag` PyPI パッケージ(2026年6月時点 v1.x系)と `neo4j` + `langchain` を使います。

```python
from langchain_neo4j import Neo4jGraph, GraphCypherQAChain
from langchain_anthropic import ChatAnthropic

graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
)

# プロジェクト・障害・人物の小規模KG (事前にロード済みを想定)
# (:Project)-[:HAD_INCIDENT]->(:Incident)<-[:INVOLVED_IN]-(:Person)

chain = GraphCypherQAChain.from_llm(
    llm=ChatAnthropic(model="claude-sonnet-4-6"),
    graph=graph,
    verbose=True,
    allow_dangerous_requests=True,  # 自社環境のみ
)

result = chain.invoke(
    "Aプロジェクトの障害に関わった人物が、過去に別プロジェクトで "
    "同種の障害に関わっていたか?"
)
print(result["result"])
```

GraphCypherQAChainはLLMにスキーマを見せて、Cypherクエリを自動生成→Neo4jで実行→結果を自然言語に整形、までを1呼び出しでやります。私の体感では、スキーマが5-15ラベル程度の小〜中規模KGなら、生成Cypherの実用精度は概ね80%前後。スキーマが30ラベルを超えるとプロンプト分割やfew-shot提示が必要になり、ここから設計の腕の見せどころに入ります。

## どのパターンも来ないなら、GraphRAGは要らない

公平のため、逆の話も書いておきます。GraphRAGには **明確に向かない領域** があります。

- 単一文書内で完結する事実検索 → ベクトルRAGで十分
- 「似ているコードを探す」のようなセマンティック検索 → ベクトルRAGが圧勝
- KG構築コストを回収できない小規模データ(数百ドキュメント以下) → 投資倒れ

特に最後の点は誤算が出やすい。Microsoft GraphRAGはエンティティ抽出にLLMを大量使用するので、1万ドキュメント規模になるとAPI費用が3桁ドル単位で動きます。NTTデータの[GraphRAG検証レポート](https://www.nttdata.com/jp/ja/trends/data-insight/2024/0830/)でも、構築フェーズのコスト管理が運用上の最重要課題として挙げられています。

3パターンのうち1つも該当しないなら、ベクトルRAGに留まるのが合理的です。「最新技術だから入れる」という動機だけで導入すると、構築コストだけ払って効果が出ない、というよくある話になります。

## まとめ

- ベクトルRAGは「類似性」、GraphRAGは「関係性」 — 答えるべき質問の構造が違う
- GraphRAGが勝つのは(1)全体テーマ集約、(2)多段ホップ探索、(3)根拠付き説明 の3パターン
- 構築コストはLLM呼び出しで顕在化するため、小規模データでは投資倒れになりやすい
- 設計判断は「うちのRAGが外す質問は、3パターンのどれかに該当するか?」だけで十分

ベクトル検索とグラフ検索は補完関係にあります。**ベクトルRAGが外す質問の構造を観察して、その構造がパターン1-3のどれかに当てはまるなら、GraphRAGの出番** ということです。

---

ここで紹介した3パターンの設計判断、Neo4jスキーマ設計、エンティティ抽出の精度評価、そして商用GraphRAGプラットフォーム比較は、すべて[ナレッジグラフ実践ガイド](https://kenimoto.dev/ja/books/knowledge-graph-practical-guide?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=graphrag-3-relation-queries)に詳しく書きました。本記事の続きとして、設計の意思決定フレームを欲しい方はそちらをどうぞ。
