---
title: "Preface"
free: true
---

> **"Automating 90% of tasks while being forced to do manual work on the most critical 10%. That's the reality of MCP."**

## Why I Wrote This Book

In March 2026, with tax filing deadline approaching, I was trying to automate expense processing using freee's MCP server.

Creating transactions, setting account items, entering amounts. Everything worked perfectly. Just by instructing Claude Desktop with "Register December electricity bill for 8,500 yen under utilities," the journal entry was completed in seconds. I remember being moved by "This is the power of MCP."

However, the next step stopped me cold.

**Receipt attachment was impossible.**

```text
Tool: mcp_server__api_post
Parameters: path: /api/v1/receipts
            body: {"company_id": "xxx", "description": "Electricity bill July"}
Response: API Error: 400
          Detail: Content-Type must be "multipart/form-data"
```

Receipt attachment is not optional for expense processing. It's legally required. I ended up automating 90% of the task while being forced to do manual work on the most critical part.

CLI scripts could handle it from the outside. But then, what's the point of publishing MCP integration?

This experience led me to thoroughly investigate what MCP can and cannot do. I verified file uploads across 7 services, studied OWASP MCP Top 10 security risks, and measured token costs across 4 MCP servers. The more I investigated, the more I realized the MCP world is full of pitfalls that "hurt if you don't know them."

- **30 CVEs reported in 60 days**
- Scanning 500+ MCP servers revealed **38% without authentication**
- **Zero out of 7 services** fully support file uploads
- Just loading tool definitions costs approximately **¥1,000 annually in tokens**

There are plenty of articles saying "MCP is convenient!" However, there was almost no systematic information about practical problems (security, costs, file constraints) faced in production deployments.

So I decided to write it myself.

## Book Structure

This book is organized into three major parts.

**Part 1: Foundations and Practice** (Chapters 1-4)
From MCP's big picture to communication specifications, token cost measurements, and real experience with freee tax automation. If you're new to MCP, start here.

**Part 2: Constraints and Security** (Chapters 5-6)
The core of this book. File upload problem verification across 7 services and complete coverage of OWASP MCP Top 10. Essential reading before deploying MCP in production.

**Part 3: Practice and Outlook** (Chapters 7-8)
Production-ready workaround collections and MCP's future with SEP-1306 and FileContent. Practical tips for those already using MCP.

## Target Audience

- Engineers considering AI automation using MCP
- Those planning to deploy MCP servers in production environments
- Those who want to understand MCP security risks
- Those considering MCP integration with freee, Jira, Notion, GitHub, etc.

## What This Book Doesn't Cover

- MCP server development tutorials (SDK usage, etc.)
- Specific LLM usage instructions
- How to participate in MCP specification development

## About the Author

ken imoto. 8 years of engineering experience. Specializes in designing real-time systems combining AI/LLM with WebRTC. Actually conducted tax filing using freee's MCP server and experienced both MCP's possibilities and limitations.

This book contains all the insights gained from that experience. I've written honestly about not just successful methods, but also lessons learned from failures.

Welcome to the real world of MCP.
