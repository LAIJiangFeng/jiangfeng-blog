/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import path from 'node:path'

/** @mdx-js/rollup otherwise intercepts `*.mdx?raw` and returns a component module. */
function mdxSkipRaw(): Plugin {
  const base = mdx({
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark-dimmed' }]],
  }) as Plugin

  const originalTransform = base.transform

  return {
    ...base,
    enforce: 'pre',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transform(this: any, code: string, id: string, options?: any) {
      if (id.includes('?raw') || id.includes('&raw')) {
        return null
      }
      if (typeof originalTransform === 'function') {
        return originalTransform.call(this, code, id, options)
      }
      if (
        originalTransform &&
        typeof originalTransform === 'object' &&
        'handler' in originalTransform &&
        typeof (originalTransform as { handler?: unknown }).handler === 'function'
      ) {
        return (
          originalTransform as {
            handler: (this: unknown, code: string, id: string, options?: unknown) => unknown
          }
        ).handler.call(this, code, id, options)
      }
      return null
    },
  } as Plugin
}

/**
 * GitHub project pages need e.g. `/jiangfeng-blog/`.
 * Set BASE_PATH in CI (workflow) or local `.env` — default `/` for local dev.
 */
const rawBase = process.env.BASE_PATH?.trim() || '/'
const base = rawBase === '/' ? '/' : rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export default defineConfig({
  base,
  plugins: [mdxSkipRaw(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@content': path.resolve(__dirname, 'content'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
  },
})

