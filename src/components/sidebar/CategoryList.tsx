import { Link } from 'react-router-dom'
import type { CategoryStat } from '@/lib/stats'

export function CategoryList({ items }: { items: CategoryStat[] }) {
  return (
    <section className="sidebar-card flex h-full flex-col p-4">
      <header className="sidebar-card__title">
        <span className="sidebar-card__bar" aria-hidden />
        <h2>分类</h2>
      </header>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">暂无分类</p>
      ) : (
        <ul className="mt-3 flex flex-1 flex-col justify-center gap-0.5">
          {items.map((item) => (
            <li key={item.category}>
              <Link
                to={`/posts?category=${item.category}`}
                className="group flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)]"
              >
                <span className="flex items-center gap-2 text-[var(--color-text)]">
                  <FolderIcon />
                  {item.label}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]">
                  {item.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-[var(--color-accent-soft)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  )
}
