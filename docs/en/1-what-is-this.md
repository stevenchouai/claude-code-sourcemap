# What is this?

## Claude Code in 30 seconds

Claude Code is Anthropic’s **terminal-based AI coding assistant**. You run `claude` in your shell, describe what you want in plain language, and it reads your code, edits files, and runs commands until the job is done.

It is not a chatbot you only talk to—it is an **AI agent that can actually do work**.

## What this site covers

In March 2026, people noticed that Claude Code’s npm package accidentally shipped **source map** files. Using those maps, the community reconstructed roughly **1,884 TypeScript source files**—essentially the full internal implementation.

This site uses that reconstructed code to explain, in **plain language**:

- What is the core idea behind Claude Code? (Simpler than you might think.)
- How does it let the AI operate your machine? (The tool system.)
- How does it stay safe? (A five-layer permission model.)
- How is context managed? (Compaction and related strategies.)
- What can you learn—and can you build something like it yourself? (Yes.)

## What you do *not* need

- You **do not** need to have read Claude Code’s source before.
- You **do not** need prior experience building AI agents.
- You **do not** need to know TypeScript (we use pseudocode and diagrams).
- You **do** need to be a developer with basic programming literacy.

## What is in this repo?

```
claude-code-sourcemap/
├── package/                   ← Raw npm package output
│   ├── cli.js                 ← ~13MB bundled executable
│   └── cli.js.map             ← ~60MB source map (where the TS came from)
├── restored-src/src/          ← Reconstructed TypeScript sources
│   ├── main.tsx               ← Program entry
│   ├── QueryEngine.ts         ← Query engine (core)
│   ├── Tool.ts                ← Tool type definitions
│   ├── tools/                 ← 30+ tool implementations
│   └── services/              ← API, MCP, and other services
└── docs/                      ← This tutorial site
```

::: warning Important
This repository **does not build or run** as a full product. There is no complete build setup and dependencies are incomplete. Treat it as **read-only learning material**, not something you can compile into a working Claude Code binary.
:::

## Start here

We split Claude Code’s architecture into eight chapters and walk through them like a tour—one main idea per chapter, with diagrams and analogies instead of dumping raw code on you.

Ready? Let’s start with the big question—[what is the core idea behind Claude Code?](/en/2-core-idea)
