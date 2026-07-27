import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPublishedPosts } from '@/lib/loadPosts'
import { searchPosts } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { Seo } from '@/components/seo/Seo'

/** Delay before writing the query into the URL (keeps typing smooth). */
const URL_SYNC_MS = 250

export function Search() {
  const [params, setParams] = useSearchParams()
  const qParam = params.get('q') ?? ''

  // Local draft for the input — URL is a delayed mirror, not the live source.
  const [query, setQuery] = useState(qParam)
  /** Last value we wrote (or adopted) so our own URL updates do not clobber typing. */
  const syncedRef = useRef(qParam)

  // External URL changes only: back/forward, “清空搜索”, header popover navigate.
  useEffect(() => {
    if (qParam === syncedRef.current) return
    syncedRef.current = qParam
    setQuery(qParam)
  }, [qParam])

  // Debounced URL write — avoids re-render + history churn on every keystroke.
  useEffect(() => {
    if (query === syncedRef.current) return

    const id = window.setTimeout(() => {
      syncedRef.current = query
      setParams(
        (prev) => {
          const current = prev.get('q') ?? ''
          if (query === current) return prev
          if (!query) return new URLSearchParams()
          const next = new URLSearchParams()
          next.set('q', query)
          return next
        },
        { replace: true },
      )
    }, URL_SYNC_MS)

    return () => window.clearTimeout(id)
  }, [query, setParams])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchPosts(getPublishedPosts(), query)
  }, [query])

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <Seo title="搜索" description="按标题、摘要或标签搜索文章。" path="/search" />
        <header className="space-y-4">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">搜索</h1>
          <SearchInput value={query} onChange={setQuery} autoFocus />
        </header>

        {!query.trim() ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            输入关键词，搜索标题、摘要与标签。
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            variant="search"
            title={`没有找到与「${query.trim()}」相关的内容`}
            actionLabel="清空搜索"
            actionTo="/search"
          />
        ) : (
          <>
            <p className="text-sm text-[var(--color-text-muted)]">
              共 {results.length} 条结果
            </p>
            <div className="posts-masonry">
              {results.map((post, i) => (
                <div
                  key={post.slug}
                  className="posts-masonry__item animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <PostCard post={post} variant="browse" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
