import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Claude Code Source Map',
    description: 'Claude Code source-map research and AI coding agent architecture tutorial',
    base: '/claude-code-sourcemap/',
    sitemap: {
      hostname: 'https://stevenchouai.github.io/claude-code-sourcemap/',
    },
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/claude-code-sourcemap/logo.svg' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'Claude Code Internals' }],
      [
        'meta',
        {
          property: 'og:description',
          content: 'A beginner-friendly bilingual guide to how Claude Code works under the hood',
        },
      ],
      ['meta', { property: 'og:url', content: 'https://stevenchouai.github.io/claude-code-sourcemap/' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
    ],
    cleanUrls: true,
    mermaid: {
      theme: 'default',
      flowchart: {
        nodeSpacing: 30,
        rankSpacing: 50,
        padding: 15,
        useMaxWidth: true,
      },
      themeVariables: {
        fontSize: '16px',
      },
    },
    locales: {
      zh: {
        label: '中文',
        lang: 'zh-CN',
        link: '/zh/',
        themeConfig: {
          nav: [
            { text: '首页', link: '/zh/' },
            { text: '开始学习', link: '/zh/1-what-is-this' },
            { text: '🍉 吃瓜专区', link: '/zh/leak-story' },
          ],
          sidebar: [
            {
              text: '教程',
              items: [
                { text: '1. 这是什么？', link: '/zh/1-what-is-this' },
                { text: '2. 核心理念：一个循环统治一切', link: '/zh/2-core-idea' },
                { text: '3. 启动流程：CLI 的骨架', link: '/zh/3-how-it-starts' },
                { text: '4. Agent 循环：心脏', link: '/zh/4-agent-loop' },
                { text: '5. 工具系统：给 AI 双手', link: '/zh/5-tool-system' },
                { text: '6. 安全模型：五层护盾', link: '/zh/6-security' },
                { text: '7. 智能记忆：上下文管理', link: '/zh/7-context' },
                { text: '8. 自己动手：从读者到构建者', link: '/zh/8-build-your-own' },
                { text: '9. 研究札记：不只是 RAG', link: '/zh/9-why-agent-loop-not-rag' },
              ],
            },
            {
              text: '番外',
              items: [
                { text: '🍉 吃瓜：源码泄露全记录', link: '/zh/leak-story' },
              ],
            },
          ],
          outline: { label: '本页目录' },
          docFooter: { prev: '上一章', next: '下一章' },
        },
      },
      en: {
        label: 'English',
        lang: 'en-US',
        link: '/en/',
        themeConfig: {
          nav: [
            { text: 'Home', link: '/en/' },
            { text: 'Start Learning', link: '/en/1-what-is-this' },
          ],
          sidebar: [
            {
              text: 'Tutorial',
              items: [
                { text: '1. What Is This?', link: '/en/1-what-is-this' },
                { text: '2. Core Idea: One Loop to Rule Them All', link: '/en/2-core-idea' },
                { text: '3. How It Starts: Anatomy of a CLI', link: '/en/3-how-it-starts' },
                { text: '4. The Agent Loop: The Heart', link: '/en/4-agent-loop' },
                { text: '5. Tool System: Giving AI Hands', link: '/en/5-tool-system' },
                { text: '6. Security: The Five-Layer Shield', link: '/en/6-security' },
                { text: '7. Smart Memory: Context Management', link: '/en/7-context' },
                { text: '8. Build Your Own: From Reader to Builder', link: '/en/8-build-your-own' },
                { text: '9. Research Note: Not Just RAG', link: '/en/9-why-agent-loop-not-rag' },
              ],
            },
          ],
        },
      },
    },
    themeConfig: {
      socialLinks: [
        { icon: 'github', link: 'https://github.com/stevenchouai/claude-code-sourcemap' },
      ],
      search: {
        provider: 'local',
      },
    },
  })
)
