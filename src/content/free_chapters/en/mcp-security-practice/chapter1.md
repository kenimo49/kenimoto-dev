---
title: "The Big Picture of MCP — A Protocol Connecting LLMs to External Tools"
free: true
---

> **"MCP is a protocol to create AI's 'hands.' However, those hands are still clumsy."**

## The Protocol That Solves LLM's "Cannot Do"

Before 2025, when you asked an LLM to "register expenses in freee," it would respond:

> "I apologize, but I cannot directly access external services. Please register manually on the freee website."

LLMs are intelligent. They can write text, write code, and analyze. However, **they couldn't touch the external world**.

MCP was born to break through this constraint.

MCP (Model Context Protocol) is an open protocol established by Anthropic that provides a standard for connecting LLMs with external tools and data sources. Simply put, it's **a protocol that gives LLMs "hands"**.

## Why Not Just Call APIs Directly?

You might wonder: "Why not just have LLMs call APIs directly?"

Indeed, having LLMs write Python scripts to call freee APIs has been possible for a long time. However, this approach had three problems.

**Problem 1: Different Authentication Methods per Service**
freee uses OAuth 2.0, GitHub uses Personal Access Tokens, Slack uses Bot Tokens. Each service requires implementing different authentication flows.

**Problem 2: No Dynamic Tool Discovery**
LLMs need to know "what can be done with this service" in advance. Making them read API documentation is inefficient and consumes massive tokens.

**Problem 3: No Safe Execution Environment**
Allowing unlimited execution of Python scripts written by LLMs is a security nightmare.

MCP attempts to solve all three problems with a standardized protocol.

## MCP's Three Components

MCP's architecture is simple. It consists of just three elements.

![MCP's Three Components](/images/books/mcp-security-practice/ch01-mcp-architecture.png)

### 1. MCP Host/Client

Claude Desktop, IDEs (VS Code, etc.), AI tools. Receives user's natural language requests and forwards them to MCP servers in standardized format.

The key point is that **hosts don't need to know service details**. What endpoints freee's API has, what parameters are needed - the MCP server knows all of this.

### 2. MCP Server

A lightweight program responsible for connecting to external services. One MCP server exists for each service.

An MCP server has three roles:
- **Tool Definition**: Publishes "what can be done" in standard format
- **Authentication Management**: Handles service-specific authentication like OAuth internally
- **API Calls**: Executes actual external API calls

### 3. External Services (Resources)

freee, GitHub, Slack, Google Drive, etc. Services that provide actual data and functionality. MCP servers call these APIs.

## Three Functions Provided by MCP

| Function | Description | Examples |
|----------|-------------|----------|
| **Tools** | Functions LLMs can call | Transaction creation, email sending, issue creation |
| **Resources** | Data LLMs can reference | File contents, DB, configuration values |
| **Prompts** | Reusable prompt templates | Code review prompts, etc. |

In practice, Tools are used most frequently. freee's MCP server publishes 270 tools because it defines all operations for accounting, HR, invoicing, attendance, and sales management as Tools.

## Differences Between MCP and Traditional Approaches

| Item | Traditional (Direct API Calls) | MCP |
|------|-------------------------------|-----|
| Authentication | Individual implementation per service | Unified management by MCP server |
| Tool Discovery | Feed API documentation | Dynamic retrieval via `tools/list` |
| Execution Environment | Execute LLM-generated code | MCP server mediates safely |
| Standardization | None (custom implementation) | Unified standard based on JSON-RPC 2.0 |

## Current State of the Ecosystem

As of March 2026, the MCP ecosystem is expanding rapidly.

- **Official MCP Servers**: GitHub, Slack, Notion, freee, Salesforce, etc.
- **Third Party**: Hundreds of MCP servers published on platforms like LobeHub, Composio, CData
- **Supporting Clients**: Claude Desktop, VS Code, Cursor, n8n, etc.

However, this rapid adoption has a dark side. A survey scanning 500+ MCP servers found **38% without authentication**. This problem will be detailed in Chapter 6.

## Chapter Summary

- MCP is a protocol for standardized connection between LLMs and external services
- Three-layer architecture: Host/Server/Resource
- Main benefits are unified authentication management and dynamic tool discovery
- The ecosystem is expanding rapidly, but security hasn't caught up

The next chapter will delve into MCP's communication specifications. We'll see why JSON-RPC-based design causes file upload problems and understand the root cause.
