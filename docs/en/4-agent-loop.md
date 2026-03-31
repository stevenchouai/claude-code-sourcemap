# Agent loop: the heart

## QueryEngine—the center of gravity

If Claude Code were a person, **`QueryEngine`** would be the heart. That class owns an entire conversation: what you said, what the model returned, which tools ran, and how many tokens you have burned.

Every line you type in the terminal is one **turn** for the QueryEngine.

```mermaid
flowchart TD
    subgraph QE ["QueryEngine（一场对话）"]
        direction TB
        T1["Turn 1: 你说了一句话"] --> T2["Turn 2: 你又说了一句话"]
        T2 --> T3["Turn 3: ..."]
    end
    
    subgraph Turn ["每个 Turn 的内部"]
        direction TB
        S1["组装 System Prompt"] --> S2["处理用户输入"]
        S2 --> S3["调 API（流式）"]
        S3 --> S4{"有工具调用？"}
        S4 -->|有| S5["执行工具"]
        S5 --> S6["结果喂回模型"]
        S6 --> S3
        S4 -->|没有| S7["返回文字回复"]
    end
```

## System prompt: who the model is here

Before each API call, QueryEngine builds a **system prompt**—background that tells the model where it is, what it can do, and what rules apply.

Typical contents:

| Piece | Role |
|-------|------|
| Tool catalog | Read, Bash, Edit, and the rest |
| Working directory | Which project tree it is in |
| Project context | Git state, layout, etc. |
| `CLAUDE.md` | Project-specific instructions when present |
| Permission rules | What needs confirmation vs auto-approve |
| MCP servers | Extra tools from connected servers |

::: tip About CLAUDE.md
Think of `CLAUDE.md` as the project’s **orientation doc**—e.g. “Python 3.12, pytest for tests, PostgreSQL in dev.” Claude Code reads it on relevant turns so the model **starts aligned** with your stack and conventions.
:::

## Streaming: why it feels snappy

The client uses a **Server-Sent Events (SSE)** streaming API. Tokens arrive **as they are generated**, not after the full answer is finished.

That means:

- The UI can show text as it streams in  
- Tool calls can be detected **before** the response ends  
- The experience feels faster than waiting for one big payload  

```mermaid
sequenceDiagram
    participant U as 你
    participant QE as QueryEngine
    participant API as Anthropic API
    participant T as 工具执行器
    
    U->>QE: "帮我看看 server.js 有没有 bug"
    QE->>API: 发送消息 + 系统提示 + 工具列表
    
    API-->>QE: 💭 "让我先读一下这个文件..."
    Note over QE: 流式渲染文字到终端
    API-->>QE: 🔧 tool_use: Read("server.js")
    
    QE->>T: 执行 Read("server.js")
    T-->>QE: 文件内容
    
    QE->>API: 这是文件内容：...
    API-->>QE: 💭 "我发现了几个问题..."
    API-->>QE: 🔧 tool_use: Edit("server.js", ...)
    
    QE->>T: 执行 Edit
    T-->>QE: 编辑成功
    
    QE->>API: 编辑完成
    API-->>QE: 💭 "已经帮你修复了，修改如下..."
    Note over QE: 没有更多工具调用 → 结束
    
    QE-->>U: 显示最终结果
```

## Token budget: the loop is not infinite

Context is capped around **200K tokens**. QueryEngine has to budget:

```
200K tokens
├── System Prompt    ～ 5-15K（取决于工具数量和项目信息）
├── 对话历史         ～ 大部分空间在这
├── 当前工具结果     ～ 可变
└── 预留生成空间     ～ 模型需要空间写回复
```

When usage climbs into roughly **75–92%**, **compaction** may run to shrink history. See [Chapter 7](/en/7-context) for detail.

## Other stop conditions

Besides the token ceiling:

- **maxTurns** — cap loop iterations against runaway tool cycles  
- **maxBudgetUsd** — spending guardrail for API cost  
- **User interrupt** — Ctrl+C anytime  
- **Model stops with text only** — no further tool calls, turn ends  

## AsyncGenerator: streaming without spaghetti

`submitMessage` on QueryEngine is an **AsyncGenerator**. Quick mental model:

::: info What is an AsyncGenerator?
**Normal function:** call once, one return value.  
**Generator:** call once, yield many values on demand.  
**AsyncGenerator:** same idea, but each step can **await** I/O (e.g. network).

Claude Code uses it because:

- The API is streamed (chunks arrive over time)  
- The UI should update incrementally  
- Tool runs **interrupt** the stream (see tool call → execute → resume)

Consumers can write: `for await (const msg of engine.submitMessage(input))` and handle every partial update in order.
:::

## One full interaction, end to end

Putting it together:

1. You type: “Fix the failing tests under `tests/`.”
2. QueryEngine assembles the system prompt (tools + project + rules).
3. Your input is processed (slash commands, model switches, etc.).
4. Anthropic API is called; the response streams back.
5. The model chooses Read on test files; results return.
6. It diagnoses failures, passes permission checks, runs Edit.
7. It runs Bash (`npm test`) to verify.
8. Tests pass; the model answers with plain text.
9. Session state is persisted; the turn completes.

All of that still lives inside the same **while**-style agent loop.

Next: what those “tools” actually are—[tool system: giving the AI hands](/en/5-tool-system).
