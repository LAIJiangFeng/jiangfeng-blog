import { useEffect, useState, type RefObject } from 'react'

/**
 * Article read-through bar, pinned just under the site header.
 * The document is the only scroller on the reading page, so this always
 * measures the window.
 */
export function ReadingProgress({ articleRef }: { articleRef: RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const el = articleRef.current
      if (!el) {
        setProgress(0)
        return
      }

      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight

      if (total <= 0) {
        setProgress(0)
        return
      }

      const scrolled = Math.min(total, Math.max(0, -rect.top))
      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)))
    }

    const raf = window.requestAnimationFrame(update)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [articleRef])

  const visible = progress > 0.5

  return (
    <div
      className={['reading-progress-track', visible ? 'is-visible' : ''].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
      aria-hidden={!visible}
    >
      <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}
