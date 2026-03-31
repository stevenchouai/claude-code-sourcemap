# 这是什么？

## 30 秒了解 Claude Code

Claude Code 是 Anthropic 做的一个**终端 AI 编程助手**。你在命令行里敲 `claude`，用自然语言告诉它你想做什么，它就会自动帮你读代码、改文件、跑命令，直到任务完成。

它不是一个聊天机器人——它是一个**能动手干活的 AI Agent**。

## 这个网站讲什么？

2026 年 3 月，有人发现 Claude Code 的 npm 发布包里意外包含了 source map 文件。通过这个 source map，社区还原了约 **1884 个 TypeScript 源文件**，也就是 Claude Code 的完整内部实现。

这个网站基于还原出的源码，用**通俗的语言**给你讲清楚：

- Claude Code 的核心原理是什么？（比你想象的简单得多）
- 它是怎么让 AI 操作你的电脑的？（工具系统）
- 它怎么保证安全的？（五层权限模型）
- 它的上下文是怎么管理的？（压缩策略）
- 你能从中学到什么？能自己做一个吗？（当然可以）

## 你不需要会什么

- **不需要**读过 Claude Code 的源码
- **不需要**有 AI Agent 开发经验
- **不需要**懂 TypeScript（我们用伪代码和图表讲解）
- **只需要**你是一个开发者，有基本的编程知识

## 这个仓库里有什么？

```
claude-code-sourcemap/
├── package/                   ← npm 包原始产物
│   ├── cli.js                 ← 13MB 的打包后可执行文件
│   └── cli.js.map             ← 60MB 的 source map（源码从这提取）
├── restored-src/src/          ← 还原出的 TypeScript 源码
│   ├── main.tsx               ← 程序入口
│   ├── QueryEngine.ts         ← 查询引擎（核心）
│   ├── Tool.ts                ← 工具类型定义
│   ├── tools/                 ← 30+ 个工具的实现
│   └── services/              ← API、MCP 等服务层
└── docs/                      ← 你正在看的这个网站
```

::: warning 重要提示
这个仓库**不能直接编译运行**。它没有构建配置，依赖也不全。你只能读源码学习，不能 build 出一个可运行的程序。
:::

## 开始旅程

我们把 Claude Code 的架构拆成了 8 个章节，像导游一样带你走一遍。每章聚焦一个核心概念，用图表和类比让你理解，而不是让你硬看代码。

准备好了？让我们从最重要的问题开始——[Claude Code 的核心思想到底是什么？](/zh/2-core-idea)
