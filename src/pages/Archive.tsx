import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedPosts } from '@/lib/loadPosts'
import { groupByArchive, type PostMeta } from '@/lib/posts'
import { formatMonth } from '@/lib/format'
import { BlogLayout } from '@/components/layout/BlogLayout'
import { Seo } from '@/components/seo/Seo'
import { EmptyState } from '@/components/ui/EmptyState'
import { categoryLabel } from '@/components/ui/CategoryBadge'
import { CoverFill } from '@/components/ui/CoverFill'
import { DEFAULT_COVER } from '@/config/site'

function countYearPosts(months: { posts: PostMeta[] }[]): number {
  return months.reduce((n, m) => n + m.posts.length, 0)
}

function formatDay(iso: string): string {
  const [, m, d] = iso.split('-')
  if (!m || !d) return iso
  return `${m}-${d}`
}

export function Archive() {
  const posts = getPublishedPosts()
  const groups = useMemo(() => groupByArchive(posts), [posts])

  return (
    <BlogLayout>
      <div className="archive-page">
        <Seo title="归档" description="按时间线浏览全部文章。" path="/archive" />

        {groups.length === 0 ? (
          <EmptyState variant="archive" title="暂无归档" />
        ) : (
          <div className="archive-body">
            <nav className="archive-year-nav" aria-label="按年份跳转">
              <p className="archive-year-nav__label">年份</p>
              <ul className="archive-year-nav__list">
                {groups.map(({ year, months }) => {
                  const count = countYearPosts(months)
                  return (
                    <li key={year}>
                      <a href={`#year-${year}`} className="archive-year-nav__link">
                        <span className="archive-year-nav__year">{year}</span>
                        <span className="archive-year-nav__count">{count}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="archive-timeline">
              {groups.map(({ year, months }, yearIndex) => {
                const yearCount = countYearPosts(months)
                const isLastYear = yearIndex === groups.length - 1

                return (
                  <section
                    key={year}
                    id={`year-${year}`}
                    className="archive-year scroll-mt-28"
                    style={{ ['--archive-i' as string]: yearIndex }}
                  >
                    <header className="archive-year__head animate-fade-up">
                      <div className="archive-year__marker" aria-hidden>
                        <span className="archive-year__node" />
                      </div>
                      <div className="archive-year__title-row">
                        <h2 className="archive-year__title">{year}</h2>
                        <span className="archive-year__badge">{yearCount} 篇</span>
                      </div>
                    </header>

                    <div
                      className={[
                        'archive-year__body',
                        isLastYear ? 'archive-year__body--last' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {months.map(({ month, posts: monthPosts }, monthIndex) => (
                        <div
                          key={month}
                          className="archive-month animate-fade-up"
                          style={{
                            ['--archive-i' as string]: yearIndex * 4 + monthIndex + 1,
                          }}
                        >
                          <h3 className="archive-month__title">
                            <span>{formatMonth(month)}</span>
                            <span className="archive-month__count">
                              {monthPosts.length}
                            </span>
                          </h3>

                          <ul className="archive-list">
                            {monthPosts.map((post, postIndex) => (
                              <li
                                key={post.slug}
                                className="archive-item"
                                style={{
                                  ['--item-i' as string]: postIndex,
                                }}
                              >
                                <Link
                                  to={`/posts/${post.slug}`}
                                  className="archive-item__link"
                                >
                                  <span className="archive-item__thumb" aria-hidden>
                                    <CoverFill src={post.cover || DEFAULT_COVER} />
                                  </span>
                                  <span className="archive-item__main">
                                    <span className="archive-item__meta">
                                      <time
                                        dateTime={post.date}
                                        className="archive-item__date"
                                      >
                                        {formatDay(post.date)}
                                      </time>
                                      <span className="archive-item__dot" aria-hidden>
                                        ·
                                      </span>
                                      <span className="archive-item__category">
                                        {categoryLabel(post.category)}
                                      </span>
                                    </span>
                                    <span className="archive-item__title">
                                      {post.title}
                                    </span>
                                    {post.summary ? (
                                      <span className="archive-item__summary">
                                        {post.summary}
                                      </span>
                                    ) : null}
                                    {post.tags.length > 0 ? (
                                      <span className="archive-item__tags">
                                        {post.tags.slice(0, 3).map((tag) => (
                                          <span key={tag} className="archive-item__tag">
                                            #{tag}
                                          </span>
                                        ))}
                                      </span>
                                    ) : null}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
