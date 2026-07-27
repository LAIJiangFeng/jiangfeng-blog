import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from 'react'

const EDGE = 6
const EDGE_HINT_MS = 1800

export function HorizontalRail({
  children,
  itemCount,
  label,
  /** How many full cards fit in one view (desktop). */
  perView = 3,
}: {
  children: ReactNode
  itemCount: number
  label: string
  perView?: number
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const centeredOnceRef = useRef(false)
  const hintTimerRef = useRef<number | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)
  const [canScroll, setCanScroll] = useState(false)
  const [edgeHint, setEdgeHint] = useState<string | null>(null)

  const showEdgeHint = useCallback((message: string) => {
    setEdgeHint(message)
    if (hintTimerRef.current != null) {
      window.clearTimeout(hintTimerRef.current)
    }
    hintTimerRef.current = window.setTimeout(() => {
      setEdgeHint(null)
      hintTimerRef.current = null
    }, EDGE_HINT_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (hintTimerRef.current != null) {
        window.clearTimeout(hintTimerRef.current)
      }
    }
  }, [])

  const sync = useCallback(() => {
    const el = scrollerRef.current
    if (!el || itemCount === 0) {
      setPage(0)
      setPageCount(1)
      setAtStart(true)
      setAtEnd(true)
      setCanScroll(false)
      return
    }

    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    const scrollable = max > EDGE
    setCanScroll(scrollable)

    const start = el.scrollLeft <= EDGE
    const end = !scrollable || el.scrollLeft >= max - EDGE
    setAtStart(start)
    setAtEnd(end)

    // pages: each page advances by roughly one viewport
    const pages = !scrollable ? 1 : Math.max(1, Math.ceil(itemCount / perView))
    setPageCount(pages)

    if (!scrollable) {
      setPage(0)
      return
    }
    const ratio = el.scrollLeft / max
    setPage(Math.min(pages - 1, Math.round(ratio * (pages - 1))))
  }, [itemCount, perView])

  /** Start in the middle so both prev/next controls are available. */
  const centerInitial = useCallback(() => {
    const el = scrollerRef.current
    if (!el || itemCount === 0) return
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    if (max > EDGE) {
      el.scrollLeft = max / 2
    }
    sync()
  }, [itemCount, sync])

  useEffect(() => {
    centeredOnceRef.current = false
  }, [itemCount, children])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const run = () => {
      if (!centeredOnceRef.current) {
        centerInitial()
        centeredOnceRef.current = true
      } else {
        sync()
      }
    }

    run()
    const ro = new ResizeObserver(() => {
      // Re-center only if we still haven't locked, else just sync edges
      if (!centeredOnceRef.current) {
        centerInitial()
        centeredOnceRef.current = true
      } else {
        sync()
      }
    })
    ro.observe(el)
    window.addEventListener('resize', sync)
    // fonts / images may change scrollWidth after first paint
    const t = window.setTimeout(run, 50)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      window.clearTimeout(t)
    }
  }, [centerInitial, sync, children])

  function onScroll(_e: UIEvent<HTMLDivElement>) {
    sync()
  }

  function scrollByPage(dir: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return

    // At edges: keep capturing the click so it never falls through to the card link.
    if (dir < 0 && atStart) {
      showEdgeHint('没有更多了')
      return
    }
    if (dir > 0 && atEnd) {
      showEdgeHint('没有更多了')
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  function goToPage(index: number) {
    const el = scrollerRef.current
    if (!el || pageCount <= 1) return
    const max = el.scrollWidth - el.clientWidth
    const target = pageCount <= 1 ? 0 : (index / (pageCount - 1)) * max
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' })
  }

  if (itemCount === 0) return null

  return (
    <div className="h-rail" data-per-view={perView}>
      <div className="h-rail__frame">
        {canScroll && (
          <button
            type="button"
            className={['h-rail__nav', 'h-rail__nav--prev', atStart ? 'is-disabled' : '']
              .filter(Boolean)
              .join(' ')}
            aria-label={atStart ? `${label}：没有更多了` : `${label}：向左滚动`}
            aria-disabled={atStart}
            onClick={() => scrollByPage(-1)}
          >
            <Chevron dir="left" />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="h-rail__scroller"
          onScroll={onScroll}
          role="region"
          aria-label={label}
        >
          {children}
        </div>

        {canScroll && (
          <button
            type="button"
            className={['h-rail__nav', 'h-rail__nav--next', atEnd ? 'is-disabled' : '']
              .filter(Boolean)
              .join(' ')}
            aria-label={atEnd ? `${label}：没有更多了` : `${label}：向右滚动`}
            aria-disabled={atEnd}
            onClick={() => scrollByPage(1)}
          >
            <Chevron dir="right" />
          </button>
        )}

        {edgeHint && (
          <div className="h-rail__edge-hint" role="status" aria-live="polite">
            {edgeHint}
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="h-rail__dots" role="tablist" aria-label={`${label}分页`}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`第 ${i + 1} 页`}
              className={['h-rail__dot', i === page ? 'is-active' : ''].filter(Boolean).join(' ')}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
      {dir === 'left' ? (
        <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}
