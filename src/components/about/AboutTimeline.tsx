import { useCallback, useEffect, useState } from 'react'
import type { AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

/** Year tabs + crossfading detail — denser than a long vertical list */
export function AboutTimeline({ items }: Props) {
  const initial = Math.max(
    0,
    items.findIndex((t) => t.current),
  )
  const [active, setActive] = useState(initial === -1 ? 0 : initial)
  const [paused, setPaused] = useState(false)
  const count = items.length
  const current = items[active]

  const select = useCallback((i: number) => {
    setActive(i)
  }, [])

  useEffect(() => {
    if (paused || count <= 1) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count)
    }, 4200)
    return () => window.clearInterval(id)
  }, [paused, count])

  if (!current) return null

  return (
    <div
      className="about-exp"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="about-exp__head">
        <span className="about-exp__kicker">经历</span>
        <div className="about-exp__track" role="tablist" aria-label="经历年份">
          {items.map((item, i) => (
            <button
              key={item.year}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={[
                'about-exp__year',
                i === active ? 'is-active' : '',
                item.current ? 'is-now' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => select(i)}
            >
              {item.year}
            </button>
          ))}
          <span
            className="about-exp__thumb"
            style={{
              width: `${100 / count}%`,
              transform: `translateX(${active * 100}%)`,
            }}
            aria-hidden
          />
        </div>
      </div>

      <div className="about-exp__panel" key={current.year}>
        <div className="about-exp__panel-inner">
          <div className="about-exp__title-row">
            <h3 className="about-exp__title">{current.title}</h3>
            {current.current && <span className="about-exp__badge">现在</span>}
          </div>
          <p className="about-exp__desc">{current.description}</p>
        </div>
      </div>
    </div>
  )
}
