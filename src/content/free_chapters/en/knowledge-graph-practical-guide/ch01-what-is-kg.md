---
title: "Chapter 1: What Is a Knowledge Graph?"
---

# Chapter 1: What Is a Knowledge Graph?

![Chapter 1: What Is a Knowledge Graph?](/images/books/knowledge-graph-practical-guide/knowledge-graph-practical-guide-opener-ch01.png)

![Knowledge graph structure overview](/images/books/knowledge-graph-practical-guide/kg-ch01-hero.png)

## Nodes, Edges, and Triples

The essence of a knowledge graph is representing knowledge through relationships.

The simplest unit is the **triple**: a three-part structure of Subject, Predicate, and Object that expresses a single fact.

```
(Neo4j) --[is_a]--> (GraphDatabase)
(GraphRAG) --[developed_by]--> (MicrosoftResearch)
(Python) --[used_in]--> (code-review-graph)
```

A collection of these triples forms a knowledge graph. Nodes (vertices) represent entities; edges represent relationships.

## How It Differs from Relational Databases

SQL databases join tables with JOIN operations. In a knowledge graph, edges are baked into the data structure from the start.

| Aspect | Relational DB | Knowledge Graph |
|--------|--------------|-----------------|
| Data model | Tables (rows and columns) | Nodes and edges |
| Expressing relationships | Foreign keys + JOIN | Edges (direct connections) |
| Schema | Must be defined upfront | Flexible (schema-optional) |
| Traversal depth | Slows proportionally with JOINs | Fast regardless of hop count |
| Best-fit question | "Get A's data" | "How are A and B connected?" |

For relationships three or more hops deep, a graph DB dominates an RDB. A query like "friends of friends of friends" requires three JOINs in an RDB, but in a graph DB you just walk the nodes. Writing a four-level JOIN in an RDB is like asking someone at a bar to introduce you to "my friend's ex-girlfriend's coworker's boss." By the third hop, nobody remembers who's who.

![Relational DB vs Knowledge Graph comparison](/images/books/knowledge-graph-practical-guide/kg-ch01-rdb-vs-graph.png)
*The structural difference between an RDB that crosses tables via JOINs and a knowledge graph that traverses nodes directly*

## How It Differs from Vector Databases

With the spread of RAG (Retrieval-Augmented Generation), many readers are already familiar with vector databases. Vector DBs and knowledge graphs are also fundamentally different technologies.

| Aspect | Relational DB | Vector DB | Knowledge Graph |
|--------|--------------|-----------|-----------------|
| Data structure | Tables (rows and columns) | High-dimensional vectors (embeddings) | Nodes and edges |
| Best-fit question | "Get data where ID=123" | "Find things similar to X" | "How are X and Y connected?" |
| Search method | WHERE clause + JOIN | Cosine similarity / ANN | Graph traversal (hops) |
| Weakness | Slow for deep relationship traversal | Cannot reason about "connections" | Cannot do similarity search |

Vector DBs excel at finding "conceptually similar documents," but they cannot answer "What paths exist between A and B?" or "If I change A, what gets affected?"

Conversely, knowledge graphs specialize in relationship traversal and struggle with the fuzzy "sort-of similar" style of similarity search.

![Strengths of the three database types](/images/books/knowledge-graph-practical-guide/kg-ch01-three-db-comparison.png)
*RDB, Vector DB, and Knowledge Graph each excel at different kinds of questions. GraphRAG combines vector search with graph search*

Vector search and graph search are not competing technologies -- they are **complementary**. In practice, GraphRAG (Chapter 5) combines these two approaches, enabling answers to cross-document questions that traditional RAG could not handle.

## Components of a Knowledge Graph

A knowledge graph is made up of the following elements.

### Entities (Nodes)

These represent "things" in the real world: people, organizations, concepts, files, functions -- anything goes. Each node can carry a label (type) and properties (attributes).

```
(:Tool {name: "GitNexus", stars: 24800, language: "TypeScript"})
(:Paper {title: "GraphRAG", year: 2024, venue: "Microsoft Research"})
```

### Relations (Edges)

These represent the relationship between two nodes. Edges have a direction and a type; in the property graph model, edges can also carry attributes.

```
(GitNexus)-[:USES {since: "v1.0"}]->(TreeSitter)
(GraphRAG)-[:IMPROVES {metric: "comprehensiveness"}]->(BaselineRAG)
```

### Ontology

This is the "blueprint" of a knowledge graph. It defines what node types and edge types exist and what constraints govern them. Ontology design determines the quality of the entire knowledge graph.

## The Cypher Query Language

Neo4j is the most widely used graph database (covered in detail in Chapters 3 and 4). Cypher, the query language used by Neo4j, lets you describe graph patterns intuitively.

```cypher
// Get all tools that GitNexus depends on
MATCH (g:Tool {name: "GitNexus"})-[:DEPENDS_ON]->(dep)
RETURN dep.name, dep.category

// Explore related nodes within 2 hops
MATCH path = (start:Concept {name: "GraphRAG"})-[*1..2]-(related)
RETURN path

// Find the most connected nodes (hubs)
MATCH (n)-[r]-()
RETURN n.name, COUNT(r) AS connections
ORDER BY connections DESC
LIMIT 10
```

Even engineers accustomed to SQL can write graph patterns intuitively using Cypher's ASCII-art-like syntax.

> **Note:** **"Walking the nodes" is the key concept that runs through this entire book.** Code dependencies (Chapter 8), emotional causality (Chapter 11), organizational tacit knowledge (Chapter 13) -- in every case, traversing relationships reveals connections that were previously invisible.

## Summary

- A knowledge graph is a technology for structuring the relationships between pieces of knowledge
- The triple (Subject-Predicate-Object) is the basic unit
- Compared to RDBs, graph DBs are fundamentally better at relationship traversal
- Knowledge graphs consist of three components: entities, relations, and ontology
- Cypher lets you query graph patterns intuitively

With that, you have the foundational concepts of knowledge graphs. Keep triples, Cypher, and ontology in mind, and nothing in the chapters ahead will trip you up.
