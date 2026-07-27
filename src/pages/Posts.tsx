import { Link, useSearchParams } from 'react-router-dom'
import { getPublishedPosts } from '@/lib/loadPosts'
import { filterByCategory, filterByTag, type Category } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'
import { CategoryBadge, categoryLabel } from '@/components/ui/CategoryBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Seo } from '@/components/seo/Seo'

const categories: Category[] = ['tech', 'life', 'thoughts']

function isCategory(value: string | null): value is Category {
  return value === 'tech' || value === 'life' || value === 'thoughts'
}

export function Posts() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const category = isCategory(categoryParam) ? categoryParam : null
  const tag = searchParams.get('tag')?.trim() || null

  const all = getPublishedPosts()
  let posts = category ? filterByCategory(all, category) : all
  if (tag) {
    posts = filterByTag(posts, tag)
  }

  const seoTitle = tag
    ? `文章 · #${tag}`
    : category
      ? `文章 · ${categoryLabel(category)}`
      : '文章'
  const seoPath = tag
    ? `/posts?tag=${encodeURIComponent(tag)}`
    : category
      ? `/posts?category=${category}`
      : '/posts'

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div className="posts-browse space-y-5">
        <Seo title={seoTitle} description="全部已发布文章。" path={seoPath} />

        {/* Category chips only — no page title */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/posts"
            className={[
              'chip-glow inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wider transition-colors',
              category === null && !tag
                ? 'border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_14px_-4px_var(--color-glow)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
            ].join(' ')}
          >
            全部
          </Link>
          {categories.map((c) =>
            category === c && !tag ? (
              <CategoryBadge key={c} category={c} asLink={false} />
            ) : (
              <CategoryBadge key={c} category={c} />
            ),
          )}
        </div>

        {tag && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--color-text-muted)]">
              标签{' '}
              <span className="text-[var(--color-accent)]">#{tag}</span>
              <span className="mx-2 opacity-40">·</span>
              共 {posts.length} 篇
            </p>
            <Link
              to="/posts"
              className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              清除筛选
            </Link>
          </div>
        )}

        {category && !tag && (
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--color-text-muted)]">
            共 {posts.length} 篇 · {categoryLabel(category)}
          </p>
        )}

        {posts.length === 0 ? (
          <EmptyState
            variant="posts"
            title={
              tag
                ? `「#${tag}」下暂无文章`
                : category
                  ? `「${categoryLabel(category)}」下暂无文章`
                  : '暂无文章'
            }
            actionLabel={tag || category ? '查看全部' : undefined}
            actionTo={tag || category ? '/posts' : undefined}
          />
        ) : (
          <div className="posts-masonry">
            {posts.map((post, i) => (
              <div
                key={post.slug}
                className="posts-masonry__item animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <PostCard post={post} variant="browse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
