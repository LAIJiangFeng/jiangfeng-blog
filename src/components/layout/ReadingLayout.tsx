import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { collectHeadings, type TocItem } from '@/lib/toc'
import { TableOfContents } from '@/components/toc/TableOfContents'
import { TocFloatingButton } from '@/components/toc/TocFloatingButton'

/** Sticky header height + breathing room — where a heading counts as "current". */
const ACTIVE_OFFSET = 96

/**
 * Article reading shell.
 *
 * Single scroll model: the document scrolls, and nothing else. The right rail
 * is a sticky table of contents that stays pinned under the header for the
 * whole article; everything else (author, related, comments) lives below the
 * body at full width.
 */
export function ReadingLayout({
  articleRef,
  children,
  below,
}: {
  articleRef: RefObject<HTMLElement | null>
  children: ReactNode
  /** Author / related posts / comments — full width under both columns. */
  below?: ReactNode
}) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const railRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    const root = articleRef.current
    if (!root) {
      setItems([])
      return
    }
    setItems(collectHeadings(root))
  }, [articleRef])

  useEffect(() => {
    refresh()
    const root = articleRef.current
    if (!root) return

    const mo = new MutationObserver(() => refresh())
    mo.observe(root, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, [articleRef, refresh])

  /** Marker for reading-specific chrome tweaks. */
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('reading-route')
    return () => {
      root.classList.remove('reading-route')
    }
  }, [])

  /** Active heading = last one whose top has passed under the header. */
  useEffect(() => {
    if (items.length === 0) {
      setActiveId(null)
      return
    }

    let ticking = false

    function read() {
      ticking = false
      const elements = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => Boolean(el))
      if (elements.length === 0) return

      let current = elements[0].id
      for (const el of elements) {
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET > 0) break
        current = el.id
      }
      setActiveId(current)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  /**
   * Keep the active entry in view when a long TOC overflows the rail.
   * `block: 'nearest'` is a no-op for the window while the rail is pinned.
   */
  useEffect(() => {
    if (!activeId) return
    const link = railRef.current?.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`)
    link?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  /** Flag an overflowing TOC so the rail can fade its cut edge. */
  useEffect(() => {
    const rail = railRef.current
    const list = rail?.querySelector<HTMLElement>('.toc__list')
    if (!rail || !list) return

    const sync = () => {
      rail.dataset.overflow = list.scrollHeight > list.clientHeight + 2 ? 'true' : 'false'
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(list)
    return () => ro.disconnect()
  }, [items])

  /** Headings carry `scroll-margin-top`, so the sticky header never covers them. */
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }, [])

  return (
    <div className="reading-page">
      <div className="reading-layout">
        <div className="reading-layout__grid">
          <div className="reading-layout__main">{children}</div>

          <aside className="reading-layout__aside" aria-label="文章目录">
            {items.length > 0 && (
              <div ref={railRef} className="reading-rail">
                <TableOfContents
                  items={items}
                  activeId={activeId}
                  onNavigate={scrollToHeading}
                  className="toc--rail"
                />
              </div>
            )}
          </aside>
        </div>

        {below ? <div className="reading-below">{below}</div> : null}

        <TocFloatingButton items={items} activeId={activeId} onNavigate={scrollToHeading} />
      </div>
    </div>
  )
}
