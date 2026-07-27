export type Theme = 'dark' | 'light'

const KEY = 'blog-theme'

/** Orb look per site theme — backgroundColor matches official Orb config API. */
export interface OrbThemeConfig {
  backgroundColor: string
  hue: number
  hoverIntensity: number
}

export const orbByTheme: Record<Theme, OrbThemeConfig> = {
  dark: {
    backgroundColor: '#07080c',
    hue: 0,
    hoverIntensity: 2,
  },
  light: {
    backgroundColor: '#f4f6fa',
    hue: 195,
    hoverIntensity: 1.6,
  },
}

/** Must match CSS `--color-bg` for each theme. */
export const SURFACE: Record<Theme, string> = {
  dark: '#07080c',
  light: '#f4f6fa',
}

export function getTheme(): Theme {
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('light')) return 'light'
    if (document.documentElement.classList.contains('dark')) return 'dark'
  }
  try {
    const stored = localStorage.getItem(KEY) as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // ignore
  }
  return 'dark'
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // ignore
  }
  const root = document.documentElement
  root.classList.toggle('light', theme === 'light')
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  root.style.backgroundColor = SURFACE[theme]
  if (document.body) {
    document.body.style.backgroundColor = SURFACE[theme]
  }

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', SURFACE[theme])
  }
}

export function initTheme(): void {
  setTheme(getStoredOrDefault())
}

function getStoredOrDefault(): Theme {
  try {
    const stored = localStorage.getItem(KEY) as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    // ignore
  }
  return 'dark'
}

export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function getOrbConfig(theme: Theme = getTheme()): OrbThemeConfig {
  return orbByTheme[theme]
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function endRadius(x: number, y: number): number {
  const w = window.innerWidth
  const h = window.innerHeight
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 8
}

type ViewTransition = {
  ready: Promise<void>
  finished: Promise<void>
  updateCallbackDone: Promise<void>
}

export type ThemeTransitionHooks = {
  /**
   * Must apply React theme state synchronously (e.g. via flushSync)
   * so the View Transition "new" snapshot includes the re-rendered tree.
   */
  onApplied?: (theme: Theme) => void
}

/**
 * Circular reveal: new themed *page content* expands from the click point
 * over the old themed page (not a solid color disc).
 *
 * Uses View Transition API:
 * - old snapshot stays fully opaque underneath
 * - only ::view-transition-new(root) is clip-path expanded
 * - default cross-fade disabled in CSS (that blend is the gray flash)
 */
export async function toggleThemeWithTransition(
  origin?: { x: number; y: number },
  hooks?: ThemeTransitionHooks,
): Promise<Theme> {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'

  const apply = () => {
    setTheme(next)
    hooks?.onApplied?.(next)
  }

  if (prefersReducedMotion() || typeof document === 'undefined') {
    apply()
    return next
  }

  if (document.documentElement.classList.contains('theme-transitioning')) {
    apply()
    return next
  }

  const x = origin?.x ?? window.innerWidth - 48
  const y = origin?.y ?? 28
  const r = endRadius(x, y)

  const doc = document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => ViewTransition
  }

  if (typeof doc.startViewTransition !== 'function') {
    apply()
    return next
  }

  return runViewTransition(doc, next, x, y, r, apply)
}

async function runViewTransition(
  doc: Document & {
    startViewTransition: (cb: () => void | Promise<void>) => ViewTransition
  },
  next: Theme,
  x: number,
  y: number,
  r: number,
  apply: () => void,
): Promise<Theme> {
  const root = document.documentElement
  root.classList.add('theme-transitioning')
  // Hint CSS / keep surfaces solid during capture
  root.style.setProperty('--theme-x', `${x}px`)
  root.style.setProperty('--theme-y', `${y}px`)
  root.style.setProperty('--theme-r', `${r}px`)

  try {
    const transition = doc.startViewTransition(() => {
      // Caller should flushSync React state inside onApplied
      apply()
    })

    await transition.ready

    // Expand ONLY the new page snapshot as a circle.
    // Do not touch opacity on old or new — any dual opacity = muddy gray.
    const anim = root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${r}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'both',
        pseudoElement: '::view-transition-new(root)',
      },
    )

    // Keep old snapshot static and fully opaque (no animation)
    // CSS already sets animation: none on old; reinforce z-order via CSS.

    await Promise.all([
      anim.finished.catch(() => undefined),
      transition.finished.catch(() => undefined),
    ])
  } catch {
    apply()
  } finally {
    root.classList.remove('theme-transitioning')
    root.style.removeProperty('--theme-x')
    root.style.removeProperty('--theme-y')
    root.style.removeProperty('--theme-r')
  }

  return next
}
