import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    if (typeof window === 'undefined') return

    const setupZoom = () => {
      document.querySelectorAll('.mermaid').forEach((el) => {
        if (el.getAttribute('data-zoom-ready')) return
        el.setAttribute('data-zoom-ready', 'true')

        el.addEventListener('click', () => {
          const svg = el.querySelector('svg')
          if (!svg) return

          const overlay = document.createElement('div')
          overlay.className = 'mermaid-overlay'
          overlay.innerHTML = `
            <div class="mermaid-overlay-hint">点击任意位置关闭 / Click anywhere to close</div>
            <div class="mermaid-overlay-content">${svg.outerHTML}</div>
          `
          overlay.addEventListener('click', () => overlay.remove())
          document.body.appendChild(overlay)
        })
      })
    }

    if (typeof window !== 'undefined') {
      const observer = new MutationObserver(() => setTimeout(setupZoom, 500))
      router.onAfterRouteChanged = () => {
        setTimeout(setupZoom, 800)
        observer.observe(document.body, { childList: true, subtree: true })
      }
      if (document.readyState === 'complete') {
        setTimeout(setupZoom, 1000)
      } else {
        window.addEventListener('load', () => setTimeout(setupZoom, 1000))
      }
    }
  },
} satisfies Theme
