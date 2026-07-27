import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { SiteStatsData } from '@/lib/stats'
import { formatWordCount } from '@/lib/stats'

type Row = {
  key: string
  label: string
  value: string
  icon: ReactNode
}

export function SiteStats({
  stats,
  variant = 'stack',
}: {
  stats: SiteStatsData
  /** stack: list; band: compact 2-col metric grid for home bottom */
  variant?: 'stack' | 'band'
}) {
  const rows: Row[] = [
    {
      key: 'posts',
      label: '文章',
      value: String(stats.postCount),
      icon: <DocIcon />,
    },
    {
      key: 'categories',
      label: '分类',
      value: String(stats.categoryCount),
      icon: <FolderIcon />,
    },
    {
      key: 'tags',
      label: '标签',
      value: String(stats.tagCount),
      icon: <TagIcon />,
    },
    {
      key: 'words',
      label: '总字数',
      value: formatWordCount(stats.wordCount),
      icon: <WordsIcon />,
    },
    {
      key: 'run',
      label: '运行天数',
      value: `${stats.runDays} 天`,
      icon: <DaysIcon />,
    },
    {
      key: 'activity',
      label: '最后活动',
      value: stats.lastActivityLabel,
      icon: <PulseIcon />,
    },
  ]

  return (
    <section className={['sidebar-card p-4', variant === 'band' ? 'h-full' : ''].join(' ')}>
      <header className="sidebar-card__title">
        <span className="sidebar-card__bar" aria-hidden />
        <h2>站点统计</h2>
      </header>

      {variant === 'band' ? (
        <ul className="site-stats-grid mt-3">
          {rows.map((row) => (
            <li key={row.key} className="site-stats-grid__item">
              <span className="site-stats-grid__icon" aria-hidden>
                {row.icon}
              </span>
              <span className="site-stats-grid__label">{row.label}</span>
              <span className="site-stats-grid__value">{row.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 space-y-0.5">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 rounded-lg px-1 py-2 text-sm"
            >
              <span className="flex items-center gap-2.5 text-[var(--color-text)]">
                <span className="text-[var(--color-accent-soft)]">{row.icon}</span>
                {row.label}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-[var(--color-text-muted)]">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 border-t border-[var(--color-border)] pt-3">
        <Link
          to="/archive"
          className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          浏览归档
        </Link>
      </div>
    </section>
  )
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M20 10.5 11.5 2H4v7.5L12.5 18a1.5 1.5 0 0 0 2.1 0L20 12.6a1.5 1.5 0 0 0 0-2.1z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WordsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 6h16M4 12h10M4 18h14" />
    </svg>
  )
}

function DaysIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  )
}
