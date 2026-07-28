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
  /** How many full cards fit in one view (desktop). CSS may override on smaller breakpoints. */
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

  const getItems = useCallback((): HTMLElement[] => {
    const el = scrollerRef.current
    if (!el) return []
    return Array.from(el.querySelectorAll<HTMLElement>('[data-rail-item]'))
  }, [])

  /** CSS --rail-per-view is authoritative; prop is only a desktop fallback. */
  const measurePerView = useCallback((): number => {
    const el = scrollerRef.current
    if (!el) return Math.max(1, perView)
    const raw = getComputedStyle(el).getPropertyValue('--rail-per-view').trim()
    const fromCss = Number.parseFloat(raw)
    if (Number.isFinite(fromCss) && fromCss > 0) return Math.max(1, Math.round(fromCss))

    const items = getItems()
    if (items.length === 0) return Math.max(1, perView)
    const first = items[0]
    const w = first.offsetWidth
    if (w <= 0) return Math.max(1, perView)
    // Derive gap from second item when present
    let gap = 0
    if (items.length > 1) {
      gap = Math.max(0, items[1].offsetLeft - first.offsetLeft - w)
    }
    return Math.max(1, Math.round(el.clientWidth / (w + gap)))
  }, [getItems, perView])

  /** Max scrollLeft that still shows a full “page” of cards (no trailing blank). */
  const maxStartLeft = useCallback((): number => {
    const el = scrollerRef.current
    if (!el) return 0
    return Math.max(0, el.scrollWidth - el.clientWidth)
  }, [])

  const nearestIndex = useCallback((): number => {
    const el = scrollerRef.current
    const items = getItems()
    if (!el || items.length === 0) return 0

    const left = el.scrollLeft
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < items.length; i++) {
      const dist = Math.abs(items[i].offsetLeft - left)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    }
    return best
  }, [getItems])

  const scrollToItem = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const el = scrollerRef.current
      const items = getItems()
      if (!el || items.length === 0) return

      const visible = measurePerView()
      // Last valid start index so the final page is still full of cards
      const maxIdx = Math.max(0, items.length - visible)
      const clamped = Math.max(0, Math.min(maxIdx, index))
      const targetLeft = Math.min(items[clamped].offsetLeft, maxStartLeft())
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollTo({
        left: targetLeft,
        behavior: behavior ?? (reduce ? 'auto' : 'smooth'),
      })
    },
    [getItems, maxStartLeft, measurePerView],
  )

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

    const max = maxStartLeft()
    const scrollable = max > EDGE
    setCanScroll(scrollable)

    const start = el.scrollLeft <= EDGE
    const end = !scrollable || el.scrollLeft >= max - EDGE
    setAtStart(start)
    setAtEnd(end)

    const visible = measurePerView()
    const pages = !scrollable ? 1 : Math.max(1, Math.ceil(itemCount / visible))
    setPageCount(pages)

    if (!scrollable) {
      setPage(0)
      return
    }

    // Page from nearest item index (stable vs ratio math that drifts into blank)
    const idx = nearestIndex()
    const pageFromIdx = Math.min(pages - 1, Math.floor(idx / visible))
    setPage(pageFromIdx)
  }, [itemCount, maxStartLeft, measurePerView, nearestIndex])

  /**
   * Desktop: start mid-rail so prev/next both work.
   * Mobile (1 card / view): stay at start — mid jump feels like a layout jolt
   * when images finish loading and scrollWidth changes.
   */
  const centerInitial = useCallback(() => {
    const el = scrollerRef.current
    if (!el || itemCount === 0) return
    const max = maxStartLeft()
    const mobile = window.matchMedia('(max-width: 639px)').matches
    if (max > EDGE && !mobile) {
      const items = getItems()
      const visible = measurePerView()
      const maxIdx = Math.max(0, items.length - visible)
      const mid = Math.floor(maxIdx / 2)
      if (items[mid]) {
        el.scrollLeft = Math.min(items[mid].offsetLeft, max)
      } else {
        el.scrollLeft = max / 2
      }
    }
    sync()
  }, [getItems, itemCount, maxStartLeft, measurePerView, sync])

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
        // Images/fonts can grow scrollWidth after first paint — clamp out of blank zone
        const max = maxStartLeft()
        if (el.scrollLeft > max) {
          el.scrollLeft = max
        }
        sync()
      }
    }

    run()
    const ro = new ResizeObserver(() => {
      if (!centeredOnceRef.current) {
        centerInitial()
        centeredOnceRef.current = true
      } else {
        const max = maxStartLeft()
        if (el.scrollLeft > max) {
          el.scrollLeft = max
        }
        sync()
      }
    })
    ro.observe(el)
    window.addEventListener('resize', sync)
    // fonts / images may change scrollWidth after first paint
    const t = window.setTimeout(run, 50)
    const t2 = window.setTimeout(run, 300)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
  }, [centerInitial, maxStartLeft, sync, children])

  function onScroll(_e: UIEvent<HTMLDivElement>) {
    sync()
  }

  function scrollByPage(dir: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return

    if (dir < 0 && atStart) {
      showEdgeHint('没有更多了')
      return
    }
    if (dir > 0 && atEnd) {
      showEdgeHint('没有更多了')
      return
    }

    const visible = measurePerView()
    const idx = nearestIndex()
    const next = idx + dir * visible
    scrollToItem(next)
  }

  function goToPage(index: number) {
    if (pageCount <= 1) return
    const visible = measurePerView()
    scrollToItem(index * visible)
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
