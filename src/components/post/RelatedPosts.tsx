import type { CSSProperties } from 'react'
import type { PostMeta } from '@/lib/posts'
import { PostCard } from '@/components/ui/PostCard'

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null

  const row = posts.slice(0, 3)
  const gridStyle = {
    ['--related-count' as string]: String(row.length),
  } as CSSProperties

  return (
    <section className="related-posts" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="related-posts__title">
        相关文章
      </h2>
      {/* One row; same card proportion as /posts browse cards */}
      <ul className="related-posts__grid" style={gridStyle}>
        {row.map((post) => (
          <li key={post.slug} className="related-posts__item">
            <PostCard post={post} variant="browse" />
          </li>
        ))}
      </ul>
    </section>
  )
}
