import { useEffect, useRef, useState } from 'react'

/** Scroll past this (px) → compact transparent header; hide hero CTAs only. */
export const HOME_SCROLL_THRESHOLD = 72

/**
 * Hysteresis avoids rapid class toggles near the threshold (common on iOS when
 * the URL bar shows/hides and scrollY jitters a few px).
 */
const ENTER_AT = HOME_SCROLL_THRESHOLD
const EXIT_BELOW = HOME_SCROLL_THRESHOLD - 28

export function useHomeScroll(enabled: boolean) {
  const [scrolled, setScrolled] = useState(false)
  const scrolledRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      scrolledRef.current = false
      setScrolled(false)
      return
    }

    let ticking = false

    function read() {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const next = scrolledRef.current ? y > EXIT_BELOW : y > ENTER_AT
      if (next !== scrolledRef.current) {
        scrolledRef.current = next
        setScrolled(next)
      }
      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    // visualViewport resize fires when iOS chrome shows/hides — re-sync without jump thrash
    const vv = window.visualViewport
    vv?.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      vv?.removeEventListener('resize', onScroll)
    }
  }, [enabled])

  return { scrolled }
}
