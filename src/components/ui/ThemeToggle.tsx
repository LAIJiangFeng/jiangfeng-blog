import { useRef } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Prefer actual click coordinates; fall back to button center
    const el = btnRef.current
    if (e.clientX || e.clientY) {
      toggleTheme({ x: e.clientX, y: e.clientY })
      return
    }
    if (!el) {
      toggleTheme()
      return
    }
    const rect = el.getBoundingClientRect()
    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
      title={theme === 'dark' ? '浅色' : '深色'}
      className={[
        'icon-btn theme-toggle-btn inline-flex h-8 w-8 items-center justify-center rounded-md border sm:h-9 sm:w-9',
        className ||
          'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]',
      ].join(' ')}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </button>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z" />
    </svg>
  )
}
