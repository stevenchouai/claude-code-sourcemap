# Claude Code Source Map & AI Coding Agent Architecture Tutorial

[![Tutorial Site](https://img.shields.io/badge/教程网站-在线阅读-blue?style=for-the-badge)](https://stevenchouai.github.io/claude-code-sourcemap/)
[![GitHub Stars](https://img.shields.io/github/stars/stevenchouai/claude-code-sourcemap?style=for-the-badge)](https://github.com/stevenchouai/claude-code-sourcemap)

> [!WARNING]
> This repository is **unofficial** and is reconstructed from the public npm package and source map analysis, **for research purposes only**.
> It does **not** represent the original internal development repository structure.
>
> 本仓库为**非官方**整理版，基于公开 npm 发布包与 source map 分析还原，**仅供研究使用**。
> **不代表**官方原始内部开发仓库结构。

## 互动教程网站

**不想读源码？直接看教程：[https://stevenchouai.github.io/claude-code-sourcemap/](https://stevenchouai.github.io/claude-code-sourcemap/)**

This project is not just a source-code restoration archive. It is a **Claude Code architecture source-map research project** and an **AI coding agent architecture tutorial**.

本项目不只是源码还原存档，而是一份面向学习者的 **Claude Code 架构 source map 研究**与 **AI Coding Agent Architecture 教程**。它把公开 npm 包和 source map 中可观察到的复杂工程实现，整理成可以学习、讨论、复现思想的架构课程。

我把 Claude Code 的架构拆解成 8 章教程，并新增研究札记入口，用自然语言 + 图表讲清楚每个核心概念。中英双语，免费开源。

| 章节 | 内容 |
|------|------|
| 1. 这是什么？ | 仓库来源、Claude Code 简介 |
| 2. 核心理念 | 为什么一个 while 循环就够了 |
| 3. 启动流程 | CLI 的分层加载设计 |
| 4. Agent 循环 | QueryEngine 的流式多轮架构 |
| 5. 工具系统 | 8 个核心工具 + 并发优化 |
| 6. 安全模型 | 五层权限的分层防御 |
| 7. 上下文管理 | 压缩策略 + grep vs RAG |
| 8. 自己动手 | 50 行 Python 写出 Agent 核心 |
| Research Note | Why Claude Code is an agent loop, not just RAG |

## 研究定位 / Research Positioning

AI coding agents are moving from chat plugins toward **local agent runtimes**: systems that run near your repository, inspect files on demand, execute shell commands with permission checks, stream multi-turn progress, and compact context when the conversation becomes long.

AI 编程工具正在从“聊天框插件”走向“本地 Agent Runtime”：它们不只回答问题，还会在你的真实项目目录中搜索、读写文件、运行命令、请求权限、保留上下文并持续多轮执行。

This repository's value is to turn that complexity into a readable architecture map:

- **Tool loop**: how model responses, tool calls, tool results, and follow-up model calls form one execution loop
- **Permission model**: why local execution needs explicit safety gates
- **File context over generic RAG**: why grep/glob/read workflows matter for coding agents
- **Streaming multi-turn architecture**: why the UI can show progress while the agent is still working
- **Context compaction**: how long-running sessions stay under token limits

The goal is architectural education, not cloning or redistributing a commercial product.

## 概述

本仓库通过 npm 发布包（`@anthropic-ai/claude-code`）内附带的 source map（`cli.js.map`）分析并还原 TypeScript 源码，版本为 `2.1.88`。文档中的架构判断均基于本仓库已有材料、公开包产物与可观察代码路径，不声称代表 Anthropic 官方内部仓库、开发流程或未公开实现。

- npm 包：[@anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- 还原版本：`2.1.88`
- 还原文件数：**4756 个**（含 1884 个 `.ts`/`.tsx` 源文件）
- 还原方式：提取 `cli.js.map` 中的 `sourcesContent` 字段

## 目录结构

```
claude-code-sourcemap/
├── docs/                    # 教程网站源码（VitePress）
├── restored-src/src/        # 还原的 TypeScript 源码
│   ├── main.tsx             # CLI 入口
│   ├── QueryEngine.ts       # 核心查询引擎
│   ├── Tool.ts              # 工具接口定义
│   ├── tools/               # 工具实现（Bash、Read、Edit、Grep 等 30+）
│   ├── commands/            # CLI 子命令（40+）
│   ├── services/            # API、MCP、compacting 等服务
│   ├── utils/               # 工具函数
│   ├── components/          # React + Ink 终端 UI 组件
│   ├── coordinator/         # 多 Agent 协调
│   ├── plugins/             # 插件系统
│   ├── skills/              # 技能系统
│   └── voice/               # 语音交互
├── package/                 # npm 包原始产物
│   ├── cli.js               # 13MB 打包后可执行文件
│   └── cli.js.map           # 60MB source map
└── .github/workflows/       # GitHub Pages 自动部署
```

## 本地开发

```bash
# 启动教程网站本地预览
npm install
npm run docs:dev
```

## 声明

- 源码版权归 [Anthropic](https://www.anthropic.com) 所有
- 本仓库为非官方研究与学习材料，不是 Anthropic 官方文档或官方源码发布
- 还原源码来自公开 npm 包 source map，可读性整理不等于官方仓库结构
- 请勿将本仓库用于商业用途，亦不要把文档中的推断表述为官方实现承诺
- 如有侵权，请联系删除
- 情报来源：L站 "飘然与我同"

## 作者

**[Steven Chou](https://stevenchouai.github.io)** · Software Engineer

- GitHub: [@stevenchouai](https://github.com/stevenchouai)
- X: [@StevenChouAI](https://x.com/StevenChouAI)
- Email: stevenchou.ai@gmail.com

如果这个项目对你有帮助，欢迎点个 Star 支持一下。
