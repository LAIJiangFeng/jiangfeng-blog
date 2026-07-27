import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPublishedPosts } from '@/lib/loadPosts'
import { searchPosts } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { Seo } from '@/components/seo/Seo'

export function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''

  const results = useMemo(() => {
    if (!q.trim()) return []
    return searchPosts(getPublishedPosts(), q)
  }, [q])

  function handleChange(value: string) {
    if (value) {
      setParams({ q: value }, { replace: true })
    } else {
      setParams({}, { replace: true })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <Seo title="搜索" description="按标题、摘要或标签搜索文章。" path="/search" />
        <header className="space-y-4">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">搜索</h1>
          <SearchInput value={q} onChange={handleChange} autoFocus />
        </header>

        {!q.trim() ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            输入关键词，搜索标题、摘要与标签。
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            variant="search"
            title={`没有找到与「${q.trim()}」相关的内容`}
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
