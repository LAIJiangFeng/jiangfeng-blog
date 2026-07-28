import { useEffect, useState } from 'react'
import { site } from '@/config/site'

const EXIT_MS = 720
const EXIT_MS_REDUCED = 250

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/**
 * Full-viewport splash on hard refresh / first load.
 * Markup lives in index.html for zero FOUC; this component drives progress + exit.
 */
export function PageLoader() {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = document.getElementById('page-loader')
    if (!root || root.dataset.dismissed === '1') {
      setGone(true)
      return
    }

    const progressEl = root.querySelector('[data-loader-progress]') as HTMLSpanElement | null
    const barEl = root.querySelector('[data-loader-bar]') as HTMLDivElement | null
    const startedAt = performance.now()
    const reduced = prefersReducedMotion()
    const minVisible = reduced ? 400 : 1400
    const exitMs = reduced ? EXIT_MS_REDUCED : EXIT_MS

    let raf = 0
    let finished = false
    let exitTimer = 0
    /*
      Do NOT wait for window `load` (all images/fonts). On mobile the home
      covers can take seconds; blocking the full-screen splash until then
      makes the header menu feel dead. React mount + interactive DOM is enough;
      SoftImage skeletons cover remaining media.
    */
    let appReady =
      document.readyState === 'interactive' || document.readyState === 'complete'

    if (barEl) barEl.classList.add('is-driven')

    const setProgress = (value: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(value)))
      if (progressEl) progressEl.textContent = String(clamped).padStart(2, '0')
      if (barEl) barEl.style.width = `${clamped}%`
    }

    const markReady = () => {
      appReady = true
    }

    if (!appReady) {
      document.addEventListener('DOMContentLoaded', markReady, { once: true })
    }
    // This component only mounts after React hydrates — mark ready on next frame
    const readyRaf = window.requestAnimationFrame(markReady)

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      setProgress(100)
      root.dataset.dismissed = '1'
      root.classList.add('page-loader--exit')
      root.setAttribute('aria-busy', 'false')
      // Allow interaction immediately on exit start (overlay is fading out)
      root.style.pointerEvents = 'none'
      document.documentElement.classList.remove('is-loading')
      document.body.classList.remove('is-loading')

      exitTimer = window.setTimeout(() => {
        root.remove()
        setGone(true)
      }, exitMs)
    }

    const tick = () => {
      if (finished) return
      const elapsed = performance.now() - startedAt
      // Ease toward 92% while waiting; finish at 100% when ready + min time met
      const waitingCap = 92
      const t = Math.min(1, elapsed / minVisible)
      const eased = 1 - Math.pow(1 - t, 2.4)
      const next = eased * waitingCap

      if (appReady && elapsed >= minVisible) {
        setProgress(100)
        finish()
        return
      }

      setProgress(next)
      raf = requestAnimationFrame(tick)
    }

    document.documentElement.classList.add('is-loading')
    document.body.classList.add('is-loading')
    raf = requestAnimationFrame(tick)

    // Failsafe: never trap the user if something hangs
    const failsafe = window.setTimeout(finish, 3500)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(readyRaf)
      window.clearTimeout(failsafe)
      window.clearTimeout(exitTimer)
      document.removeEventListener('DOMContentLoaded', markReady)
    }
  }, [])

  // React never re-renders the HTML splash; this is a side-effect host only.
  if (gone) return null
  return (
    <span className="sr-only" aria-live="polite">
      {site.name} loading
    </span>
  )
}
