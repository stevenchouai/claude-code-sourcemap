---
layout: home
hero:
  name: Claude Code Source Map
  text: AI coding agent architecture research and tutorial
  tagline: Based on Claude Code v2.1.88 public npm package and source-map analysis. A bilingual course on local agent runtime architecture.
  actions:
    - theme: brand
      text: Start Learning
      link: /en/1-what-is-this
    - theme: alt
      text: Research Note
      link: /en/9-why-agent-loop-not-rag
    - theme: alt
      text: GitHub Repo
      link: https://github.com/stevenchouai/claude-code-sourcemap
features:
  - icon: 🔄
    title: Agent Loop
    details: Follow QueryEngine, tool calls, tool results, and follow-up model turns to see why a coding agent is an execution loop, not one answer.
  - icon: 🛠️
    title: Tool System
    details: 8 core tools let AI read files, write code, and run commands. Learn how they're defined, registered, and invoked.
  - icon: 🛡️
    title: Security Design
    details: A five-layer permission model makes AI both powerful and controllable. From tool-level checks to user hooks.
  - icon: 🚀
    title: Architecture Course
    details: The value is not cloning a product. It is turning public package analysis and source-map reconstruction into a learnable AI coding agent architecture path.
---

## Research Positioning

This project is unofficial research material, not an Anthropic source release. Its architectural readings are based on public npm package artifacts, source-map reconstruction, and analysis already present in this repository.

## Market Context: From Chat Plugin to Local Agent Runtime

AI coding agents are moving from "chat plugin inside an editor" toward "local runtime near the repository and terminal." A useful coding agent needs file search, code edits, command execution, permission checks, streaming multi-turn progress, and context compaction when sessions get long.

This repository's original value is turning a complex source-map reconstruction into a learnable architecture course: tool loop, permission model, grep/file context, streaming multi-turn architecture, and context compaction.
