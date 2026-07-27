import { useEffect, useState } from 'react'

/** Show after scrolling past this many px. */
const SHOW_AFTER = 420

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    function read() {
      ticking = false
      const y = window.scrollY || document.documentElement.scrollTop || 0
      setVisible(y > SHOW_AFTER)
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
  }, [])

  function scrollTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={['back-to-top', visible ? 'is-visible' : ''].filter(Boolean).join(' ')}
      aria-label="回到顶部"
      title="回到顶部"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={scrollTop}
    >
      <svg viewBox="0 0 24 24" className="back-to-top__icon" fill="none" aria-hidden>
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
