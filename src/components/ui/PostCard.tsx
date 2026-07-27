import { Link } from 'react-router-dom'
import type { PostMeta } from '@/lib/posts'
import { DEFAULT_COVER, site } from '@/config/site'
import { CoverFill } from './CoverFill'
import { categoryLabel } from './CategoryBadge'

/** Cover-top card used on list pages (browse / search). */
export function PostCard({
  post,
  variant = 'full',
}: {
  post: PostMeta
  /** full: title/summary/meta/tags; browse: cover + title + date (reference style) */
  variant?: 'full' | 'browse'
}) {
  if (variant === 'browse') {
    return <PostBrowseCard post={post} />
  }

  const author = site.author.englishName
  const cover = post.cover || DEFAULT_COVER

  return (
    <article className="post-card-grid group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <Link
        to={`/posts/${post.slug}`}
        className="post-card-cover relative block aspect-[16/9] w-full overflow-hidden"
        aria-label={`阅读：${post.title}`}
      >
        <CoverFill src={cover} />
        <span className="post-card-read-chip pointer-events-none absolute right-3 top-3 inline-flex items-center rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
          阅读
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-70" />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-[1.3] tracking-[-0.025em] sm:text-xl">
          <Link
            to={`/posts/${post.slug}`}
            className="text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2.5 line-clamp-2 flex-1 text-[0.925rem] leading-[1.65] tracking-[0.01em] text-[var(--color-text-muted)]">
          {post.summary}
        </p>
        <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.02em] text-[var(--color-text-muted)]">
          <time dateTime={post.date}>{formatCardDate(post.date)}</time>
          <span className="opacity-40">·</span>
          <span className="tracking-wide">{author}</span>
          <span className="opacity-40">·</span>
          <Link
            to={`/posts?category=${post.category}`}
            className="text-[var(--color-accent)]/90 transition hover:text-[var(--color-accent)]"
          >
            {categoryLabel(post.category)}
          </Link>
        </div>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <Link
                  to={`/posts?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex rounded-full bg-[var(--color-bg)] px-2.5 py-0.5 text-[11px] text-[var(--color-text-muted)] ring-1 ring-inset ring-[var(--color-border)] transition hover:text-[var(--color-accent)] hover:ring-[var(--color-accent)]/40"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

/** Cover + title / summary / author / date / tags */
function PostBrowseCard({ post }: { post: PostMeta }) {
  const cover = post.cover || DEFAULT_COVER
  const author = site.author.englishName

  return (
    <article className="post-browse-card group">
      <div className="post-browse-card__media">
        <Link to={`/posts/${post.slug}`} className="post-browse-card__media-link" aria-label={post.title}>
          <CoverFill src={cover} />
        </Link>
      </div>
      <div className="post-browse-card__body">
        <h2 className="post-browse-card__title">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="post-browse-card__summary">{post.summary}</p>
        <div className="post-browse-card__meta">
          <time dateTime={post.date}>{formatCardDate(post.date)}</time>
          <span className="post-browse-card__dot" aria-hidden>
            ·
          </span>
          <span>{author}</span>
          <span className="post-browse-card__dot" aria-hidden>
            ·
          </span>
          <Link to={`/posts?category=${post.category}`} className="post-browse-card__cat">
            {categoryLabel(post.category)}
          </Link>
        </div>
        {post.tags.length > 0 && (
          <ul className="post-browse-card__tags">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <Link to={`/posts?tag=${encodeURIComponent(tag)}`} className="post-browse-card__tag">
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

function formatCardDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${Number(y)}/${Number(m)}/${Number(d)}`
}
