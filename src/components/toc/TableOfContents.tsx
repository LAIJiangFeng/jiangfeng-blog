import type { TocItem } from '@/lib/toc'

export function TableOfContents({
  items,
  activeId,
  onNavigate,
  className = '',
}: {
  items: TocItem[]
  activeId: string | null
  onNavigate?: (id: string) => void
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <nav className={['toc', className].filter(Boolean).join(' ')} aria-label="文章目录">
      <p className="toc__heading">目录</p>
      <ol className="toc__list">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <li
              key={item.id}
              className={[
                'toc__item',
                item.level === 3 ? 'toc__item--h3' : 'toc__item--h2',
                active ? 'is-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <a
                href={`#${item.id}`}
                aria-current={active ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  // Parent may own a custom scroller (reading pane); otherwise default to viewport.
                  if (onNavigate) {
                    onNavigate(item.id)
                    return
                  }
                  const el = document.getElementById(item.id)
                  if (el) {
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
                    history.replaceState(null, '', `#${item.id}`)
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
