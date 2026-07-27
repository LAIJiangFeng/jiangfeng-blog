import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '@/config/site'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { MusicNavButton } from '@/components/music/MusicPlayer'
import { useTheme } from '@/components/theme/ThemeProvider'
import { useHomeScroll } from '@/hooks/useHomeScroll'
import { MobileNav } from './MobileNav'
import { SearchNavButton } from './SearchNavButton'
import { withBase } from '@/lib/asset'
import { navLinks } from './navLinks'

export type HeaderVariant = 'default' | 'overlay'

/**
 * Home top: glass overlay on orb.
 * Home scrolled: fully transparent bar over content.
 * Other pages: frosted solid bar.
 */
export function Header({ variant = 'default' }: { variant?: HeaderVariant }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme } = useTheme()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { scrolled: homeScrolled } = useHomeScroll(isHome && variant === 'overlay')

  const overOrb = variant === 'overlay' && !homeScrolled
  const transparent = variant === 'overlay' && homeScrolled
  const overlayDark = overOrb && theme === 'dark'
  const overlayLight = overOrb && theme === 'light'
  const onDarkText = overlayDark

  const iconClass = onDarkText
    ? 'border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:text-white'
    : transparent
      ? theme === 'dark'
        ? 'border-white/10 bg-white/[0.04] text-[var(--color-text-muted)] hover:border-white/20 hover:text-[var(--color-text)]'
        : 'border-black/8 bg-white/30 text-[var(--color-text-muted)] hover:border-black/15'
      : overlayLight
        ? 'border-black/10 bg-white/70 text-[var(--color-text-muted)] hover:border-black/20'
        : undefined

  return (
    <header
      className={[
        /* Solid bg always — never glass/blur over the orb (that created the gray band) */
        'site-header sticky top-0 z-40 bg-[var(--color-bg)] transition-[background,border-color,color] duration-300 ease-out',
        overlayDark
          ? 'site-header--overlay site-header--overlay-dark text-white'
          : overlayLight
            ? 'site-header--overlay site-header--overlay-light text-[var(--color-text)]'
            : transparent
              ? 'site-header--transparent text-[var(--color-text)]'
              : 'text-[var(--color-text)]',
      ].join(' ')}
      data-home-scrolled={homeScrolled ? 'true' : 'false'}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3.5 sm:gap-4 sm:px-4">
        <Link
          to="/"
          className={[
            'logo-mark min-w-0 shrink font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] transition-colors',
            onDarkText
              ? 'text-white hover:text-white/85'
              : 'text-[var(--color-text)] hover:text-[var(--color-accent)]',
          ].join(' ')}
        >
          <img src={withBase('/logo.svg')} alt="" className="logo-mark__img" width={28} height={28} decoding="async" />
          <span className="logo-mark__text">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex" aria-label="主导航">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  'nav-link inline-flex items-center rounded-lg px-2.5 py-1.5 transition-colors',
                  onDarkText
                    ? isActive
                      ? 'is-active text-white'
                      : 'text-white/65 hover:text-white'
                    : isActive
                      ? 'is-active text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <SearchNavButton className={iconClass} />
          <MusicNavButton className={iconClass} />
          <ThemeToggle className={iconClass} />
          <button
            type="button"
            className={[
              'icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md border sm:h-9 sm:w-9 md:hidden',
              onDarkText
                ? 'border-white/15 bg-white/5 text-white/80'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)]',
            ].join(' ')}
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant={onDarkText ? 'overlay' : 'default'}
      />
    </header>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}
