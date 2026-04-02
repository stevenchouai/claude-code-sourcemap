---
layout: home
hero:
  name: Claude Code 内部揭秘
  text: 这不是一个 AI 编程助手，这是一个操作系统
  tagline: 51 万行源码、42 个工具、五层安全护盾——基于 Claude Code v2.1.88 源码还原，8 章教程带你从小白到理解 Agent 内核
  actions:
    - theme: brand
      text: 开始学习
      link: /zh/1-what-is-this
    - theme: alt
      text: 🍉 吃瓜专区
      link: /zh/leak-story
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/anthropics/claude-code-sourcemap
features:
  - icon: 🔄
    title: 核心循环
    details: Claude Code 的架构核心就是一个 while 循环。没有复杂框架，没有向量检索——简单到令人惊讶。
  - icon: 🛠️
    title: 42 个工具 + 懒加载
    details: 42 个工具按需注入，每个工具附带独立的 AI 使用手册。Prompt 不是写出来的，是"编译"出来的。
  - icon: 🛡️
    title: 安全设计
    details: 五层权限模型让 AI 既强大又可控。想用 rm -rf？先过 9 层审查。18 个文件只为守住一个 Bash 工具。
  - icon: 🧠
    title: AI 记忆系统
    details: 用另一个 AI 检索记忆，KAIROS 模式让 AI 在"夜间做梦"整理笔记。三层压缩让对话永不超限。
  - icon: 👥
    title: 多 Agent 蜂群
    details: Coordinator 模式下变身经理，只分配不干活。子 Agent 被注入"工人意识"，防止递归生成。
  - icon: 🚀
    title: 自己动手
    details: 50 行 Python 就能写出 Agent 核心。但 51 万行代码告诉你——90% 的工作在"AI"之外。
---
