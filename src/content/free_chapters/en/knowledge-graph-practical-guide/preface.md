---
title: "Preface"
---

# Preface

"We have plenty of data, but we can't see how it connects."

This is a problem engineers face every day. Codebase dependencies, links between internal documents, shifts in user sentiment: all of these exist as isolated data points, yet few organizations have managed to structure and use those **relationships** effectively.

Knowledge graphs are the technology that makes these connections explicit. Since Google introduced one into its search engine in 2012, knowledge graphs have been adopted across enterprise, academic research, and developer tooling. And from 2024 onward, their value has surged again thanks to the combination with LLMs (Large Language Models).

This book brings together the "why," "what," and "how" of knowledge graphs in a single volume.

## Why This Book, Why Now

In February 2024, Microsoft Research published GraphRAG. An LLM automatically builds a knowledge graph, then uses it as a retrieval backbone. The moment this technique appeared, it was clear that the era of hand-crafting KGs was over.

Around the same time, MCP gained traction, and tools that convert codebases into graphs (GitNexus, among others) started shipping one after another. GraphRAG, code KGs, and personal KGs -- three waves hitting at once make this the right time to put knowledge graph technology into one book.

That said, the tools and APIs covered here are in a fast-moving space. Specific versions and pricing reflect the time of writing (April 2026); always check each tool's official documentation for the latest information.

## How This Book Is Organized

**Part 1: Foundations** covers the core concepts of knowledge graphs, how to choose between RDF and property graphs, and a step-by-step build with Neo4j.

**Part 2: GraphRAG** explains the GraphRAG architecture published by Microsoft Research and how to deploy it in an enterprise setting. It is an evidence-based approach to curbing the "plausible lies" that LLMs produce.

**Part 3: Code Analysis** introduces the latest tools for converting codebases into knowledge graphs using Tree-sitter AST and MCP. These techniques can cut AI code review token consumption by up to 49x.

**Part 4: Emotion Reasoning** covers emotion reasoning during dialogue using Emotion Commonsense Knowledge Graphs (ECoK), ATOMIC, and COMET -- where psychology and computer science intersect.

**Part 5: Organizational Knowledge and Personal KGs** presents enterprise case studies from LinkedIn and Meta, along with personal knowledge management through Obsidian integration.

## Who This Book Is For

- Engineers and data architects interested in knowledge graphs
- Team leads evaluating GraphRAG adoption
- Developers looking to make AI code review more efficient
- Knowledge managers who want to structure tacit organizational knowledge

My hope is that "thinking in graphs" as a mental framework will bring a fresh perspective to your work.
