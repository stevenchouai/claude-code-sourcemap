# Claude Code 源码学习指南：从小白到理解 AI Agent 内核

> 写给完全没有 Agent 开发经验的人。假设你是一个开发者，但从来没做过 AI Agent。
>
> 本文档基于 claude-code-sourcemap 仓库（v2.1.88），结合网上社区的逆向分析和 Anthropic 官方工程博客编写。

---

## 目录

1. [这个仓库到底是什么？](#1-这个仓库到底是什么)
2. [Claude Code 的核心原理：极简但强大](#2-claude-code-的核心原理极简但强大)
3. [阅读顺序：从哪看起？](#3-阅读顺序从哪看起)
4. [第一站：入口 — 一个 CLI 工具的骨架](#4-第一站入口--一个-cli-工具的骨架)
5. [第二站：心脏 — Agent Loop 查询引擎](#5-第二站心脏--agent-loop-查询引擎)
6. [第三站：双手 — 工具系统](#6-第三站双手--工具系统)
7. [第四站：安全 — 权限模型](#7-第四站安全--权限模型)
8. [第五站：大脑优化 — 上下文管理与压缩](#8-第五站大脑优化--上下文管理与压缩)
9. [第六站：分身 — Sub-Agent 与并发](#9-第六站分身--sub-agent-与并发)
10. [第七站：门面 — React + Ink 终端 UI](#10-第七站门面--react--ink-终端-ui)
11. [我能自己搭一个类似的 Agent 吗？](#11-我能自己搭一个类似的-agent-吗)
12. [Claude Code vs Cursor vs Cline：区别到底在哪？](#12-claude-code-vs-cursor-vs-cline区别到底在哪)
13. [推荐学习路径与时间规划](#13-推荐学习路径与时间规划)
14. [延伸阅读](#14-延伸阅读)

---

## 1. 这个仓库到底是什么？

**一句话**：有人从 npm 发布的 Claude Code 包里，把 source map 中的源码全部提取出来了。

Claude Code 是 Anthropic 做的一个 **终端 AI 编程助手**（就是你在命令行里打 `claude`，然后用自然语言让它帮你写代码、跑命令、改文件的那个工具）。它发布到 npm 时，构建产物里意外包含了 `.map` 文件，社区就从中还原了约 **1884 个 TypeScript 源文件**。

**重要**：这个仓库**不能直接编译运行**。它没有 `tsconfig.json`、没有构建脚本、依赖也没声明全。你只能**读源码学习**，不能 `npm install && npm run build`。

```
claude-code-sourcemap/
├── README.md                  # 仓库说明
├── LEARNING_GUIDE.md          # ← 你正在看的这个
├── package/                   # npm 包原始产物
│   ├── cli.js                 # 13MB 打包后的可执行文件
│   ├── cli.js.map             # 60MB source map（源码就从这提取的）
│   └── package.json
└── restored-src/src/          # 还原出来的 TypeScript 源码
    ├── main.tsx               # CLI 入口
    ├── QueryEngine.ts         # 查询引擎（核心中的核心）
    ├── Tool.ts                # 工具类型定义
    ├── tools.ts               # 工具注册表
    ├── tools/                 # 30+ 个工具实现
    ├── commands/              # CLI 子命令
    ├── services/              # API、MCP、分析等服务
    └── ...                    # 还有很多
```

---

## 2. Claude Code 的核心原理：极简但强大

Anthropic 的工程哲学可以用一句话概括：**"Less scaffolding, more model"**（少搭框架，多信模型）。

Claude Code 的核心就是一个 **while 循环**：

```
while (模型的回复里包含工具调用):
    执行工具，拿到结果
    把结果喂回给模型
返回模型的最终文字回复
```

没有意图分类器、没有 RAG 向量检索、没有 DAG 任务编排、没有规划器/执行器分离。**全靠模型自己判断**下一步做什么。

这就像你雇了一个非常聪明的员工，你不给他流程图，只给他工具箱（文件读写、终端、搜索），然后说："这件事你自己想办法完成"。他会自己规划步骤、自己用工具、做完了告诉你结果。

### 为什么这样设计？

| 设计选择 | 原因 |
|----------|------|
| 不用意图分类器 | 模型的推理能力比手写规则强，加分类器反而限制了灵活性 |
| 不用 RAG/向量搜索 | 用 ripgrep 直接搜文件就够了，简单、安全、不需要维护索引 |
| 不用 DAG 编排 | 简单的 while 循环更容易调试，出了问题一眼能看出哪步错了 |
| 流式优先 | 模型的响应一边生成一边渲染，用户感知速度快 |

社区对此的评价是：**架构的"无聊"程度令人惊讶**。它确实就这么简单，但它确实能用。这说明当模型足够强时，复杂的编排框架可能是多余的。

---

## 3. 阅读顺序：从哪看起？

如果你把 Claude Code 想象成一个人：

```
  🧠 大脑 = QueryEngine.ts（决定做什么）
  👀 眼睛 = 工具系统 tools/（读文件、搜索）
  🤚 双手 = 工具系统 tools/（写文件、跑命令）
  🛡️ 盾牌 = 权限模型（哪些事可以做、哪些要问人）
  🗜️ 记忆 = 上下文管理 + compaction（记住什么、忘掉什么）
  👥 分身 = Sub-Agent / Task（分派子任务）
  🖥️ 脸面 = React + Ink UI（终端里你看到的界面）
```

**推荐阅读路线**（每站标注了对应文件和预计时间）：

| 站 | 主题 | 关键文件 | 预计时间 |
|----|------|----------|----------|
| 1 | 入口与启动 | `main.tsx`, `entrypoints/cli.tsx`, `entrypoints/init.ts` | 30 min |
| 2 | Agent Loop | `QueryEngine.ts`, `query.ts` | 1-2 hr |
| 3 | 工具系统 | `Tool.ts`, `tools.ts`, `tools/FileReadTool/`, `tools/BashTool/` | 1-2 hr |
| 4 | 权限模型 | `Tool.ts` 中的 `checkPermissions`, `utils/permissions/` | 30 min |
| 5 | 上下文压缩 | `services/compacting/` | 30 min |
| 6 | Sub-Agent | `tools/AgentTool/`, `services/tools/toolOrchestration.ts` | 1 hr |
| 7 | 终端 UI | `components/`, `screens/REPL.tsx` | 30 min |

**总计约 5-7 小时可以对架构有全面的理解。**

---

## 4. 第一站：入口 — 一个 CLI 工具的骨架

> 📂 读这些文件：`restored-src/src/main.tsx`, `restored-src/src/entrypoints/cli.tsx`

### 你在学什么

Claude Code 本质上就是一个 Node.js CLI 程序。你敲 `claude`，它启动，解析参数，初始化配置，然后进入交互模式或单次执行模式。

### 关键代码走读

**`entrypoints/cli.tsx`** 是最先执行的文件。它做的事很少：
- 处理 `--version` 等快速退出的参数
- 如果不是快速退出，动态 `import` 重量级模块（懒加载，加快启动速度）

**`main.tsx`** 是真正的 CLI 入口。它用 [Commander.js](https://github.com/tj/commander.js) 注册命令和选项：

```typescript
// 伪代码，简化版
const program = new Command('claude');
program.option('-p, --print', '非交互模式');
program.option('--model <model>', '指定模型');
// ... 更多选项

// 初始化：配置、信任检查、遥测、代理等
await init();

// 根据模式分支
if (isPrintMode) {
    // 非交互：执行一次就退出
    await runPrintMode(prompt);
} else {
    // 交互：启动 React + Ink 终端 UI
    await launchRepl(root, appProps, replProps);
}
```

### 思考

为什么要分 `cli.tsx` 和 `main.tsx` 两个文件？因为 `cli.js` 是一个 13MB 的 bundle，如果每次 `claude --version` 都加载全部代码会很慢。分层加载让快速命令秒退，复杂命令按需加载。

---

## 5. 第二站：心脏 — Agent Loop 查询引擎

> 📂 读这些文件：`restored-src/src/QueryEngine.ts`, `restored-src/src/query.ts`

### 你在学什么

这是 Claude Code 最核心的部分。理解了它，等于理解了 80% 的架构。

### 核心概念

**QueryEngine** = 一个对话的管理器。每次用户输入（一个 turn），它：

1. **组装 System Prompt** — 告诉模型它有哪些工具、在什么环境里、要遵守什么规则
2. **处理用户输入** — 解析 slash 命令、附件、模型切换
3. **调用 API** — 流式调用 Anthropic Messages API
4. **执行工具** — 模型返回 `tool_use` 块时，执行对应工具
5. **循环** — 把工具结果喂回去，模型继续，直到它返回纯文字（没有工具调用）

```typescript
// QueryEngine.ts 的核心模式（极度简化）
class QueryEngine {
    mutableMessages: Message[] = [];  // 对话历史，跨 turn 共享

    async *submitMessage(prompt) {
        // 1. 构建 system prompt
        const systemPrompt = await fetchSystemPromptParts(...);

        // 2. 处理用户输入
        const { messages, shouldQuery } = await processUserInput(prompt);
        this.mutableMessages.push(...messages);

        // 3. 进入查询循环
        for await (const message of query({
            messages: this.mutableMessages,
            systemPrompt,
            tools,
            model,
            ...
        })) {
            yield message;  // 流式返回给 UI
        }
    }
}
```

### `submitMessage` 是一个 AsyncGenerator

注意 `async *submitMessage` — 它是一个**异步生成器**。这意味着它一边接收模型的流式输出，一边 `yield` 给调用方（UI 层）。所以你在终端里看到模型的回复是一个字一个字蹦出来的，不是等全部生成完再显示。

### query.ts 的主循环

`query.ts` 里的 `query()` 函数是实际的 API 调用循环：

```
用户消息 → API 请求 → 流式响应 → 检测 tool_use
                                      ↓
                           有 tool_use → 执行工具 → 结果 → 回到 API 请求
                           无 tool_use → 完成，返回文字
```

每一轮会检查 token 预算、是否需要压缩（compaction）、是否超出 max turns。

### 关键洞察

- **没有"规划"步骤**：模型直接决定用什么工具，不需要先制定计划再执行
- **权限检查在工具执行前**：不是模型决定了就直接跑，中间有拦截层
- **会话状态是可变的**：`mutableMessages` 数组在整个对话中共享和修改

---

## 6. 第三站：双手 — 工具系统

> 📂 读这些文件：`restored-src/src/Tool.ts`, `restored-src/src/tools.ts`, `restored-src/src/tools/FileReadTool/`, `restored-src/src/tools/BashTool/`

### 你在学什么

工具是 Agent 和真实世界之间的桥梁。没有工具，模型只能说话；有了工具，它能**做事**。

### 工具的统一接口

每个工具都是同一个形状（`Tool.ts` 中定义）：

```typescript
// 简化版
interface Tool {
    name: string;                    // "Read", "Bash", "Edit" 等
    inputSchema: ZodSchema;          // 用 Zod 验证输入
    call(args, context): ToolResult; // 实际执行逻辑
    description(input): string;      // 给模型看的工具说明
    checkPermissions(input): PermissionResult; // 权限检查
    isConcurrencySafe(input): boolean;  // 能否并行执行？
    isReadOnly(input): boolean;         // 是否只读？
}
```

### buildTool — 带默认值的工厂

`buildTool()` 函数提供安全的默认值：**默认不允许并发、默认不是只读**。这是"fail-closed"设计——忘了设置并发标志的工具不会意外被并行执行。

### 8 个核心工具

| 工具 | 做什么 | 只读？ | 可并发？ |
|------|--------|--------|----------|
| **Bash** | 执行 shell 命令（万能工具） | ❌ | ❌ |
| **Read** | 读文件内容 | ✅ | ✅ |
| **Write** | 创建/覆写文件 | ❌ | ❌ |
| **Edit** | 精确替换文件内容（diff 模式） | ❌ | ❌ |
| **Grep** | 用 ripgrep 搜索文件内容 | ✅ | ✅ |
| **Glob** | 按文件名模式查找文件 | ✅ | ✅ |
| **Task** | 生成子 Agent | ❌ | ❌ |
| **TodoWrite** | 结构化任务追踪 | ❌ | ❌ |

### 看一个真实工具的实现

以 FileReadTool 为例（`tools/FileReadTool/FileReadTool.ts`）：

```typescript
export const FileReadTool = buildTool({
    name: 'Read',
    maxResultSizeChars: Infinity,  // 读取内容不需要截断
    strict: true,

    // 告诉模型这个工具是干什么的
    async description() { return DESCRIPTION; },

    // 这是一个只读、可并发的工具
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    // 实际执行：读文件，验证大小，返回内容
    async call(args, context) {
        const content = await readFile(args.file_path);
        return { data: content };
    },

    // 权限检查：是否有权限读这个路径
    async checkPermissions(input, ctx) {
        return checkReadPermissionForTool(input, ctx);
    },
});
```

### 工具注册流程

```
buildTool() 创建单个工具
    ↓
getAllBaseTools() 收集所有内置工具到数组
    ↓
getTools() 根据权限/模式过滤
    ↓
assembleToolPool() 合并内置工具 + MCP 外部工具
    ↓
传给 QueryEngine → 传给 API → 模型知道它能用哪些工具
```

### 关键洞察

- **Bash 是万能后门**：如果其他工具都没有，`bash` 一个就能干任何事。这就是为什么它的权限检查最严格
- **MCP 工具和内置工具平等**：通过 `assembleToolPool`，MCP 服务器贡献的工具和内置工具混在一起，模型不知道区别
- **Zod 验证在前**：工具执行前先验证输入合法性，防止模型传错参数

---

## 7. 第四站：安全 — 权限模型

> 📂 读这些文件：`Tool.ts` 中的权限相关类型，`utils/permissions/`

### 你在学什么

让 AI 访问你的文件系统和终端是很危险的。Claude Code 如何既强大又安全？答案是**五层权限检查**。

### 五层防线

```
工具调用请求
    ↓
[1] 工具自身的 checkPermissions() → Bash 检查是否有危险命令（rm -rf 等）
    ↓
[2] 用户设置的 allowlist/denylist → settings.json 中的 glob 规则
    ↓
[3] 沙箱策略 → 管理员限制的路径、命令、网络
    ↓
[4] 当前权限模式 → default/acceptEdits/plan/bypass/auto
    ↓
[5] Hook 覆盖 → PreToolUse hook 可以拦截/批准/修改
    ↓
执行 或 拒绝
```

### 五种权限模式

| 模式 | 行为 | 场景 |
|------|------|------|
| **default** | 什么都问 | 刚上手，最安全 |
| **acceptEdits** | 文件编辑自动批准，shell 命令仍然问 | 日常开发 |
| **plan** | 只读，不执行任何修改 | 研究代码时 |
| **bypass** | 全部自动批准 | 你完全信任模型时 |
| **auto** | 最小化确认（自动化场景） | CI/CD 管道 |

### 思考

大多数 AI 工具只有"允许/拒绝"两档。Claude Code 的分层设计让你可以在安全和效率之间精确调节。这对做自己的 Agent 工具时非常有参考价值。

---

## 8. 第五站：大脑优化 — 上下文管理与压缩

> 📂 读这些文件：`services/compacting/`

### 你在学什么

Claude 的上下文窗口是 200K tokens，听起来很大，但长对话中很快会用完。Claude Code 怎么处理这个问题？

### 上下文预算分配

```
200K tokens 总预算
├── System Prompt（工具描述、项目信息、规则）
├── 对话历史（用户消息 + 模型回复 + 工具结果）
├── 当前工具结果
└── 预留给模型生成的空间
```

### 自动压缩（Compaction）

当上下文占用达到 **75-92%** 时，Claude Code 自动触发压缩：
- 旧的对话轮次被**总结**而不是丢弃
- 关键信息保留，冗余信息被压缩
- 有 pre/post hooks 让你指定哪些信息不能被压缩

### "Search, Don't Index" 策略

Claude Code 早期尝试过 RAG（用向量嵌入搜索代码），但后来放弃了，改用 ripgrep 直接搜索。原因：
- 不需要维护向量索引
- 不需要外部嵌入服务（安全）
- ripgrep 搜索速度已经足够快
- 简单！

这是一个违反直觉但很实用的选择：**当模型够聪明时，暴力搜索 + 模型判断 > 精心设计的检索管道**。

---

## 9. 第六站：分身 — Sub-Agent 与并发

> 📂 读这些文件：`tools/AgentTool/`, `services/tools/toolOrchestration.ts`

### 你在学什么

当模型需要同时做几件事时（比如在一个目录搜索代码的同时在另一个目录改文件），怎么办？

### 工具并发分区

这是 Claude Code 最精妙的设计之一。`partitionToolCalls` 函数把一批工具调用分成两类：

```typescript
// 简化版逻辑
for (const batch of partitionToolCalls(toolCalls)) {
    if (batch.isConcurrencySafe) {
        // 只读工具：并行执行（最多 10 个同时）
        await runConcurrently(batch.blocks);
    } else {
        // 写入工具：逐个串行执行
        await runSerially(batch.blocks);
    }
}
```

**为什么这很聪明**：模型可能在一次回复中说"读文件 A、读文件 B、搜索关键字 C、然后编辑文件 D"。前三个是只读操作，可以同时执行；最后一个是写操作，必须等前面完成再执行。`partitionToolCalls` 自动识别这种模式并优化执行顺序。

### Task 子 Agent

`Task` 工具更强大：它**生成一个新的对话**，有自己独立的上下文窗口。

```
主 Agent（你的对话）
   │
   ├── Task: "在 src/utils/ 里搜索所有 API 调用"
   │     └── 子 Agent 独立运行，只返回摘要
   │
   └── 主 Agent 继续做其他事
```

限制：子 Agent **不能再生成子 Agent**（depth=1），防止失控。

---

## 10. 第七站：门面 — React + Ink 终端 UI

> 📂 读这些文件：`components/App.tsx`, `screens/REPL.tsx`

### 你在学什么

这可能是最让人意外的部分：**终端界面是用 React 写的**。

Claude Code 用 [Ink](https://github.com/vadimdemedes/ink)，一个把 React 渲染到终端的库。你在终端里看到的对话界面、权限弹窗、进度指示器——全是 React 组件。

```typescript
// replLauncher.tsx
await renderAndRun(root,
    <App {...appProps}>
        <REPL {...replProps} />
    </App>
);
```

### 为什么用 React 写终端？

- **组件化**：权限对话框、工具结果展示、输入框都是可复用组件
- **状态管理清晰**：React 的 state/context 模型天然适合管理对话状态
- **布局系统**：Ink 用 Yoga（CSS Flexbox）做布局，比手写 ANSI 转义码靠谱
- **团队熟悉度**：Anthropic 团队本身做 Web 开发，React 是最熟悉的

---

## 11. 我能自己搭一个类似的 Agent 吗？

**可以。而且比你想象的简单。**

Claude Code 的核心就是一个 while 循环 + 工具执行。你不需要复制它的全部代码，只需要理解核心模式。

### 最简版本（Python，约 50 行核心逻辑）

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "read_file",
        "description": "Read a file from disk",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"]
        }
    },
    {
        "name": "run_bash",
        "description": "Execute a bash command",
        "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string"}},
            "required": ["command"]
        }
    }
]

def execute_tool(name, args):
    if name == "read_file":
        return open(args["path"]).read()
    elif name == "run_bash":
        import subprocess
        return subprocess.run(args["command"], shell=True, capture_output=True, text=True).stdout

messages = [{"role": "user", "content": "帮我看看当前目录有什么文件"}]

# === 这就是 Claude Code 的核心 ===
while True:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )

    # 模型不再调用工具 → 结束
    if response.stop_reason == "end_turn":
        print(response.content[0].text)
        break

    # 模型要求调用工具 → 执行并把结果喂回去
    messages.append({"role": "assistant", "content": response.content})
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            messages.append({
                "role": "user",
                "content": [{"type": "tool_result", "tool_use_id": block.id, "content": result}]
            })
```

**这 50 行代码就是 Claude Code 的核心原理。** 剩下的几万行代码是：更多工具、权限、UI、上下文管理、MCP、Sub-Agent 等生产级功能。

### 用什么模型？

你可以用**任何支持 function calling / tool use 的模型**：

| 方案 | 模型 | 费用 | 适合 |
|------|------|------|------|
| Anthropic API | Claude Sonnet/Opus | 按 token 付费 | 最佳效果 |
| OpenAI API | GPT-4o | 按 token 付费 | 可用 |
| 本地模型 | Qwen、DeepSeek、Llama | 免费（需显卡） | 实验/学习 |
| 中转 API | 各种聚合平台 | 低价 | 省钱 |

**不一定要本地跑模型**。大多数人用 API 调用云端模型就行。本地模型目前在 tool use 能力上还弱一些。

---

## 12. Claude Code vs Cursor vs Cline：区别到底在哪？

你问得对——如果我自己搭一个调 API 的 Agent，跟现有工具有什么区别？

### 三种工具的本质区别

```
┌──────────────────────────────────────────────────────┐
│                    你 (开发者)                         │
├──────────┬─────────────┬─────────────────────────────┤
│  Cursor  │  Claude Code │  Cline / 自建 Agent          │
│          │              │                              │
│  IDE 模式 │  终端模式     │  IDE 插件 / 终端均可          │
│  你开车   │  AI 开车      │  取决于你怎么设计              │
│  AI 辅助  │  你监督       │  完全自由                     │
│          │              │                              │
│  闭源IDE  │  闭源CLI      │  开源 / 你自己写              │
│  多模型   │  只用 Claude  │  任意模型                     │
│  $20/月   │  $20/月      │  只付 API 费（$10-40/月）     │
└──────────┴─────────────┴─────────────────────────────┘
```

### 具体对比

| 维度 | Cursor | Claude Code | Cline / 自建 |
|------|--------|-------------|-------------|
| **交互方式** | 在 IDE 里，边写代码边问 AI | 在终端里，用自然语言指挥 AI 做事 | 灵活，可以是插件也可以是终端 |
| **自主性** | AI 建议，你决定采纳 | AI 自动执行多步操作，你审批关键步骤 | 你自己定义自主程度 |
| **模型选择** | 支持多个模型（Claude, GPT, etc.） | 只能用 Claude 系列 | 任何模型，包括本地部署的 |
| **可定制性** | 有限（Rules, MCP） | 中等（MCP, Hooks, CLAUDE.md） | 完全自由 |
| **适合场景** | 日常编码，边写边问 | 大规模重构、自动化任务、复杂调试 | 特定领域工具、学习、实验 |
| **数据隐私** | 代码发送到云端 | 代码发送到 Anthropic | 自己控制，可以纯本地 |

### 自建 Agent 的意义

自建不是为了"做一个更好的 Cursor"，而是：

1. **学习**：理解 AI Agent 的核心原理，这是目前最热的技术方向
2. **定制**：做一个专注于你特定领域的工具（比如只做数据分析、只做 DevOps）
3. **控制**：完全掌握数据流向、模型选择、成本控制
4. **产品**：把它做成一个产品，服务特定用户群

---

## 13. 推荐学习路径与时间规划

### 第一周：理解原理（只读代码）

- [ ] 通读本文档
- [ ] 读 `main.tsx` 理解启动流程（1 小时）
- [ ] 读 `QueryEngine.ts` 前 200 行理解查询引擎（2 小时）
- [ ] 读 `Tool.ts` 理解工具接口（1 小时）
- [ ] 读 `FileReadTool` 和 `BashTool` 各一个工具实现（1 小时）
- [ ] 读 `toolOrchestration.ts` 理解并发模型（1 小时）

### 第二周：动手实践

- [ ] 用 Python 实现 50 行核心 Agent（参考上面的代码）
- [ ] 给它加 2-3 个工具（read_file, write_file, bash）
- [ ] 尝试让它完成一个简单任务（比如"创建一个 hello world 项目"）
- [ ] 加入基本的权限检查（bash 命令前确认）

### 第三周：进阶

- [ ] 加入上下文管理（对话太长时截断/总结）
- [ ] 加入流式输出
- [ ] 尝试接入 MCP 服务器
- [ ] 研究 `services/compacting/` 的压缩策略

### 第四周：做自己的工具

- [ ] 确定你想做什么领域的 Agent
- [ ] 设计工具集（需要什么能力？）
- [ ] 参考 Claude Code 的权限模型设计安全策略
- [ ] 搭建 MVP

---

## 14. 延伸阅读

### 官方资料
- [Anthropic Engineering Blog: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — 官方架构理念
- [Claude Code 官方文档](https://code.claude.com/docs) — 使用文档

### 社区分析
- [Inside Claude Code's Architecture](https://dev.to/oldeucryptoboi/inside-claude-codes-architecture-the-agentic-loop-that-codes-for-you-cmk) — 英文深度架构分析
- [How Claude Code Works: Architecture & Internals](https://cc.bruniaux.com/guide/architecture/) — 最全面的架构文档，含信心度标注
- [Claude Code 逆向工程](https://yuyz0112.github.io/claude-code-reverse/README.zh_CN.html) — 中文，运行时行为分析
- [Claude Code 源码解析](https://claudecoding.dev/) — 中文系列教程

### 动手做
- [Build Your Own Claude Code from Scratch in Python (250 Lines)](https://www.heyuan110.com/posts/ai/2026-02-24-build-magic-code/) — 从零搭建
- [Claude Agent SDK: Build Your Own AI Terminal in 10 Minutes](https://www.mager.co/blog/2026-03-14-claude-agent-sdk-tui/) — 用官方 SDK 快速搭建
- [OpenCode](https://opencode.ubitools.com/) — 开源的终端 AI Agent，可以参考

### 相关仓库
- [claude-code-sourcemap](https://github.com/anthropics/claude-code-sourcemap) — 你正在看的这个
- [Prajwalsrinvas/claude-code-reverse-engineering](https://github.com/Prajwalsrinvas/claude-code-reverse-engineering) — 逆向工程分析
- [Yuyz0112/claude-code-reverse](https://github.com/Yuyz0112/claude-code-reverse) — 中文逆向分析项目

---

> **最后一句话**：Claude Code 的架构告诉我们一个反直觉的道理——当 AI 模型足够强大时，最好的"框架"就是**没有框架**。一个 while 循环 + 好的工具 + 好的提示词，就足以构建生产级的 AI Agent。
