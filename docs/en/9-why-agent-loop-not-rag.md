# Why Claude Code Is an Agent Loop, Not Just RAG

::: warning Research boundary
This note is an architectural reading based on this repository's reconstructed source, public npm package artifacts, and existing tutorial chapters. It is not an official Anthropic implementation note and does not claim to describe unreleased internal versions.
:::

## Start with the right question

If you describe Claude Code as "RAG over a codebase," you miss the part that makes it a coding agent.

RAG asks: **which context should be retrieved and placed in the prompt?**

An agent loop asks: **should the model act next, which tool should it call, with what parameters, under which permissions, and how should the result feed the next turn?**

Claude Code is much closer to the second model. It is not one retrieval step plus one answer. It is a local execution loop.

## RAG is a retrieval pipeline. Agent loop is an execution system.

| Dimension | Typical RAG | Claude Code-style coding agent loop |
|-----------|-------------|-------------------------------------|
| Context source | Prebuilt index or vector retrieval | Model calls Grep, Glob, Read, and related tools on demand |
| Main action | Retrieve snippets and answer | Search, read, edit, run commands, then decide again |
| State | Mostly request-level context | Session history, tool results, permission state, compaction summaries |
| Risk | Bad retrieval or context pollution | File edits, shell execution, cost, runaway loops |
| Engineering center | Embeddings, indexing, reranking | Tool loop, permission, streaming, compaction |

This does not mean RAG is useless. It means the coding-agent problem is wider than RAG. If an assistant actually changes a project, execution and safety become first-class architecture concerns.

## 1. Tool loop: the model does not only emit text

The tutorial frames `QueryEngine` as the center of the loop. After a user request enters the system, the model may emit text and then request a tool call:

- Use `Grep` to find a function or error string
- Use `Read` to open a specific file
- Use `Edit` to modify code
- Use `Bash` to run tests or builds

The tool result is fed back into the conversation, and the model decides the next step. That "model -> tool -> result -> model" loop is the core of the coding agent.

## 2. Permission model: local runtime needs gates

A RAG system usually reads context. Its risks are mostly leakage or poor retrieval. A local agent runtime faces harder questions: it may write files, delete files, run shell commands, touch the network, or trigger git operations.

That makes the permission model an architectural concern:

- Which tools can run automatically
- Which commands must ask the user first
- Which paths or operations should be blocked
- Whether hooks can run before or after tools
- Whether the user can interrupt long-running work

"Can call tools" is not the same as "can safely operate as a local coding agent."

## 3. Grep/file context: context is gathered at the scene

Chapter 7 covers a key tradeoff: Claude Code emphasizes local file tools such as `Grep`, `Glob`, and `Read` instead of first turning the codebase into a vector index.

The point is not "no retrieval." The point is that retrieval is controlled inside the agent loop:

1. The model decides what to search for
2. Local tools return exact matches or file contents
3. The model adjusts the next search or edit based on results
4. More files are read only when needed

For a coding agent, this file-context-on-demand workflow is closer to how developers debug real projects.

## 4. Streaming multi-turn: the user sees execution, not just an answer

Claude Code's experience is not "wait for the final answer." Model output, tool calls, tool results, and follow-up decisions can advance as a stream.

That implies a multi-turn architecture:

- API responses can be processed while they are still arriving
- Tool calls interrupt the plain-text generation path
- Tool results trigger follow-up model calls
- The UI keeps rendering progress instead of waiting for one final payload

This is why it feels like the system is working, not merely responding.

## 5. Context compaction: long tasks need memory maintenance

Once an agent loop runs for a while, tool outputs, logs, file contents, and chat history consume tokens quickly. RAG alone does not solve that, because the agent's own execution history is also state.

Compaction is therefore local-agent-runtime infrastructure:

- Clear old tool results while preserving the main thread
- Replace early conversation turns with summaries
- Preserve critical constraints before and after compression
- Let long sessions continue instead of restarting when context fills up

A coding agent's memory is not just a static index. It is an execution trace that has to be maintained.

## Market context: from chat plugin to local agent runtime

AI coding agents are moving from "chat plugin in an editor" toward "local runtime near the repository." A useful agent needs to sit close to the repo, terminal, permission model, and developer workflow:

- It searches and reads files in the current repo
- It safely edits code and executes commands
- It shows multi-turn progress to the user
- It preserves task continuity when context gets long

This repository's original value is not cloning Claude Code. It is turning a complex source-map reconstruction into a readable AI coding agent architecture course. Readers can study the boundaries of the agent loop and apply those ideas to their own tools.

## Conclusion

Claude Code does retrieve context, but the core is not "RAG Q&A." The core is an agent loop built around local tools, permissions, safety, streaming multi-turn execution, and context compaction.

Explaining it only as RAG is like explaining an IDE only as file search. Search matters, but the product shape comes from the whole runtime.
