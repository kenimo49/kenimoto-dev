---
title: "Chapter 2: Why Knowledge Graphs Now?"
---

# Chapter 2: Why Knowledge Graphs Now?

![Chapter 2: Why Knowledge Graphs Now?](/images/books/knowledge-graph-practical-guide/knowledge-graph-practical-guide-opener-ch02.png)

## The "Connection" Problem in the Age of Generative AI

In Chapter 1, we learned the basic structure of knowledge graphs -- nodes, edges, and triples -- and saw that they handle relationship traversal better than RDBs. So why has this technology, with over 60 years of history, attracted a surge of renewed attention **since 2024**?

The answer lies in the rise of generative AI. LLMs (Large Language Models) generate remarkably fluent text, but they have a fundamental weakness: they **fabricate facts that aren't in their training data while sounding perfectly confident**. This is known as hallucination.

RAG (Retrieval-Augmented Generation) is an effective approach to this problem, but traditional RAG has its own limits. Vector search is good at retrieving "conceptually similar documents," but it struggles with "connecting the dots."

For example, answering "What do the technologies used in Project A and the root cause of the outage in Project B have in common?" requires cross-document understanding. This is where knowledge graphs come into play.

> **Note:** Vector search and graph search are not in opposition -- they are complementary. Most production systems use both. GraphRAG (Chapter 5) is the prime example of this combination.

## Breaking Down Data Silos

Enterprise data is fragmented across departments and systems.

- Sales keeps data in the CRM
- Engineering keeps data in Jira and GitHub
- Finance keeps data in the ERP

Ask all three departments for "the full picture on that deal" and you get three different spreadsheets -- each with slightly different numbers. If this sounds familiar, you are not alone.

Integrating these data sources into a knowledge graph lets you trace, end to end, "which developer's commit relates to the bug this customer reported, and how did it affect revenue."

## Three Reasons Knowledge Graphs Are Back in the Spotlight

### 1. The Arrival of GraphRAG

In February 2024, Microsoft Research published GraphRAG: a method that uses LLMs to automatically generate a knowledge graph from text, then uses that graph as the knowledge source for RAG. It was shown to produce dramatically better answers for "questions about the dataset as a whole" -- questions that traditional RAG simply could not handle.

### 2. LLM-Powered KG Construction

Building a knowledge graph used to require manual work by domain experts: entity extraction, relationship definition, ontology design. All of it took enormous amounts of time.

With LLMs, entity and relationship extraction from text has been automated. NTT Data's validation achieved 73% accuracy in extracting corporate relationships from news articles. Not perfect, but orders of magnitude more efficient than building from scratch by hand.

### 3. Integration with Developer Tools

The spread of MCP (Model Context Protocol) has made it possible to integrate knowledge graphs directly into AI development tools. Tools like GitNexus, code-review-graph, and CodeGraphContext convert codebases into knowledge graphs and let you query them via MCP servers from Claude Code or Cursor.

## Historical Background

The term "knowledge graph" became widely known through Google's 2012 announcement. The information panel that appears on the right side of search results (the "333 m" answer when you search "How tall is Tokyo Tower?") was powered by the Google Knowledge Graph.

But the concept itself is much older, stretching back to semantic networks in the 1960s.

![Knowledge graph history -- five milestones from the 1960s to GraphRAG in 2024](/images/books/knowledge-graph-practical-guide/knowledge-graph-practical-guide-ch02-fig1-timeline.png)
*Sixty years of history met LLMs and started moving again*

| Era | Milestone |
|-----|-----------|
| 1960s | Research on semantic networks |
| 2001 | W3C publishes the RDF standard |
| 2012 | Google Knowledge Graph announced |
| 2020s | NTT Data applies KGs to contract risk assessment |
| 2024 | Microsoft Research publishes GraphRAG |
| 2025- | Code KG tools (GitNexus, etc.) proliferate |

A technology that matured over 60 years has gained its "missing piece" in LLMs and entered the practical deployment phase. That is where we are now.

## No-Code / Low-Code Democratization

Platforms like Altair offer no-code tools for building and visualizing knowledge graphs. This lets data scientists and business analysts work with knowledge graphs without writing code.

Even more noteworthy is the maturation of managed services like Neo4j AuraDB and Amazon Neptune. Lower operational costs for graph databases mean the barrier to "just trying it" has dropped significantly. Work that required a dedicated graph DB engineer five years ago can now be started with a few clicks in a cloud console.

## Summary

- Hallucination mitigation and data silo elimination are the forces behind the renewed interest in knowledge graphs
- GraphRAG breaks through the limits of traditional RAG (cross-document reasoning)
- LLM-powered KG construction has cut costs by orders of magnitude
- MCP integration embeds knowledge graphs directly into developer workflows
- No-code tools have opened the door to non-engineers

So, to ride this wave, there is a first decision you need to make: should the data model be RDF or a property graph?
