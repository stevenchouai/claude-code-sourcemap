---
layout: home
hero:
  name: Claude Code Source Map
  text: AI Coding Agent Architecture 研究与教程
  tagline: 基于 Claude Code v2.1.88 公开 npm 包与 source map 分析，把复杂源码还原整理成可学习的本地 Agent Runtime 架构课程
  actions:
    - theme: brand
      text: 开始学习
      link: /zh/1-what-is-this
    - theme: alt
      text: 研究札记
      link: /zh/9-why-agent-loop-not-rag
    - theme: alt
      text: 🍉 吃瓜专区
      link: /zh/leak-story
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/stevenchouai/claude-code-sourcemap
features:
  - icon: 🔄
    title: Agent Loop
    details: 从 QueryEngine、工具调用、工具结果回填到下一轮模型调用，理解 coding agent 为什么是执行循环，而不是一次问答。
  - icon: 🛠️
    title: 42 个工具 + 懒加载
    details: 42 个工具按需注入，每个工具附带独立的 AI 使用手册。Prompt 不是写出来的，是"编译"出来的。
  - icon: 🛡️
    title: 安全设计
    details: 五层权限模型让 AI 既强大又可控。危险命令、文件修改和 hook 都需要经过明确的本地安全边界。
  - icon: 🧠
    title: AI 记忆系统
    details: 用另一个 AI 检索记忆，KAIROS 模式让 AI 在"夜间做梦"整理笔记。三层压缩让对话永不超限。
  - icon: 👥
    title: 多 Agent 蜂群
    details: Coordinator 模式下变身经理，只分配不干活。子 Agent 被注入"工人意识"，防止递归生成。
  - icon: 🚀
    title: 架构课程
    details: 本仓库的价值不是复制产品，而是把公开包分析和源码还原整理成 AI coding agent architecture 的学习路径。
---

## 研究定位

本项目是非官方研究材料，不是 Anthropic 官方源码发布。文档中的判断来自公开 npm 包、source map 还原结果和本仓库已有分析，目的是帮助开发者理解 AI coding agent 的架构边界。

## 市场背景：从 chat plugin 到 local agent runtime

AI 编程工具正在从“编辑器里的聊天插件”走向“贴近仓库和终端的本地 Agent Runtime”。真正可用的 coding agent 需要能搜索文件、读写代码、执行命令、请求权限、流式展示多轮进度，并在上下文变长时压缩历史。

本仓库的独创价值，是把复杂的 source-map 还原结果整理成可学习的架构课程：tool loop、permission model、grep/file context、streaming multi-turn architecture 和 context compaction。
