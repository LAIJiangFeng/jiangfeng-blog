import { useCallback, useEffect, useState } from 'react'

type Props = {
  title: string
  items: string[]
  /** Auto-advance interval ms */
  intervalMs?: number
}

/** Vertical focus carousel — one line at a time with crossfade */
export function AboutFocusCarousel({ title, items, intervalMs = 2800 }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length

  const go = useCallback(
    (next: number) => {
      if (count === 0) return
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (paused || count <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [paused, count, intervalMs])

  if (count === 0) return null

  return (
    <div
      className="about-focus"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="about-focus__label">
        <span className="about-focus__pulse" aria-hidden />
        {title}
      </div>

      <div className="about-focus__stage" aria-live="polite">
        {items.map((item, i) => (
          <p
            key={item}
            className={['about-focus__line', i === index ? 'is-active' : ''].filter(Boolean).join(' ')}
            aria-hidden={i !== index}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="about-focus__dots" role="tablist" aria-label={title}>
        {items.map((item, i) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={item}
            className={['about-focus__dot', i === index ? 'is-active' : ''].filter(Boolean).join(' ')}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  )
}
