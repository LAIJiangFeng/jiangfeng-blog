import { useEffect, useState } from 'react'

/** Scroll past this (px) → compact transparent header; hide hero CTAs only. */
export const HOME_SCROLL_THRESHOLD = 72

export function useHomeScroll(enabled: boolean) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setScrolled(false)
      return
    }

    let ticking = false

    function read() {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      setScrolled(y > HOME_SCROLL_THRESHOLD)
      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  return { scrolled }
}
