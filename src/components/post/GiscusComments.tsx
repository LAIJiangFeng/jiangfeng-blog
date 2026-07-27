import Giscus from '@giscus/react'
import { site } from '@/config/site'
import { useTheme } from '@/components/theme/ThemeProvider'

export function GiscusComments() {
  const { theme } = useTheme()
  const { repo, repoId, category, categoryId, mapping } = site.giscus

  if (!repo || !repoId) {
    return (
      <section className="mt-16 border-t border-[var(--color-border)] pt-10">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl tracking-tight">
          评论
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">评论功能即将开放。</p>
      </section>
    )
  }

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-10">
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl tracking-tight">
        评论
      </h2>
      <Giscus
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping={mapping}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'light' ? 'light' : 'dark'}
        lang="zh-CN"
        loading="lazy"
      />
    </section>
  )
}
