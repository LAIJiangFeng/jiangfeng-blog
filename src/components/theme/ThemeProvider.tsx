import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import {
  getTheme,
  setTheme as applyTheme,
  toggleThemeWithTransition,
  type Theme,
  getOrbConfig,
  type OrbThemeConfig,
} from '@/lib/theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  /** Optional click origin for circular expand transition */
  toggleTheme: (origin?: { x: number; y: number }) => void
  orb: OrbThemeConfig
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof document !== 'undefined' ? getTheme() : 'dark',
  )

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'blog-theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        applyTheme(e.newValue)
        setThemeState(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    void toggleThemeWithTransition(origin, {
      onApplied: (next) => {
        // flushSync so View Transition captures the re-rendered tree as "new"
        flushSync(() => {
          setThemeState(next)
        })
      },
    })
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      orb: getOrbConfig(theme),
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
