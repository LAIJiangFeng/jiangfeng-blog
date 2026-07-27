import type { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/format'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { TagChip } from '@/components/ui/TagChip'

/** Rough Chinese reading pace (chars / min). */
const CHARS_PER_MIN = 380

export function PostHeader({ post }: { post: PostMeta }) {
  const words = post.wordCount ?? Math.max(post.summary.trim().length, 1)
  const minutes = Math.max(1, Math.ceil(words / CHARS_PER_MIN))

  return (
    <header className="post-header">
      <div className="post-header__meta">
        <CategoryBadge category={post.category} />
        <time dateTime={post.date} className="post-header__date">
          {formatDate(post.date, 'long')}
        </time>
        {post.updated && post.updated !== post.date && (
          <span className="post-header__updated">
            · 更新于 {formatDate(post.updated, 'long')}
          </span>
        )}
        {/* Absorbed from the old sidebar "本文信息" card */}
        <span className="post-header__sep" aria-hidden>
          ·
        </span>
        <span className="post-header__stat">{words.toLocaleString('zh-CN')} 字</span>
        <span className="post-header__sep" aria-hidden>
          ·
        </span>
        <span className="post-header__stat">约 {minutes} 分钟</span>
      </div>
      <h1 className="post-header__title">{post.title}</h1>
      {post.summary ? <p className="post-header__summary">{post.summary}</p> : null}
      {post.tags.length > 0 && (
        <ul className="post-header__tags">
          {post.tags.map((tag) => (
            <li key={tag} className="post-header__tag-item">
              <TagChip tag={tag} />
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
