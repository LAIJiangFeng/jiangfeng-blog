import { Link } from 'react-router-dom'

export function TagCloud({
  tags,
  limit = 12,
}: {
  tags: { tag: string; count: number }[]
  limit?: number
}) {
  const shown = tags.slice(0, limit)

  return (
    <section className="sidebar-card flex h-full flex-col p-4">
      <header className="sidebar-card__title flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2">
          <span className="sidebar-card__bar" aria-hidden />
          <h2>标签</h2>
        </span>
      </header>

      {shown.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">暂无标签</p>
      ) : (
        <ul className="mt-3 flex flex-1 flex-wrap content-start gap-2">
          {shown.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                to={`/posts?tag=${encodeURIComponent(tag)}`}
                className="chip-glow inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-text-muted)]"
              >
                <span>#{tag}</span>
                <span className="text-[var(--color-accent)]/80">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
