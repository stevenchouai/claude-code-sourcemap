---
layout: home
hero:
  name: Claude Code Internals
  text: How an AI coding agent actually works, explained in plain language
  tagline: Based on Claude Code v2.1.88 source reconstruction. 8 chapters from zero to understanding the agent core.
  actions:
    - theme: brand
      text: Start Learning
      link: /en/1-what-is-this
    - theme: alt
      text: GitHub Repo
      link: https://github.com/anthropics/claude-code-sourcemap
features:
  - icon: 🔄
    title: The Core Loop
    details: Claude Code's architecture is a single while loop. No complex frameworks, no vector search — surprisingly simple.
  - icon: 🛠️
    title: Tool System
    details: 8 core tools let AI read files, write code, and run commands. Learn how they're defined, registered, and invoked.
  - icon: 🛡️
    title: Security Design
    details: A five-layer permission model makes AI both powerful and controllable. From tool-level checks to user hooks.
  - icon: 🚀
    title: Build Your Own
    details: 50 lines of Python captures the agent core. Once you understand the principles, you can build your own AI coding tool.
---
