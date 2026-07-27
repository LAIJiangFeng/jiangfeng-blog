import { NavLink } from 'react-router-dom'
import { navLinks } from './navLinks'
import type { HeaderVariant } from './Header'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  variant?: HeaderVariant
}

export function MobileNav({ open, onClose, variant = 'default' }: MobileNavProps) {
  if (!open) return null

  const overlay = variant === 'overlay'

  return (
    <nav
      className={[
        'px-4 py-3 md:hidden',
        overlay
          ? 'border-b border-white/10 bg-black/80 backdrop-blur-xl'
          : 'border-b border-[var(--color-border)] bg-[var(--color-bg)]',
      ].join(' ')}
      aria-label="移动导航"
    >
      <ul className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'block rounded-lg px-3 py-2 font-[family-name:var(--font-nav)] text-[1rem] font-medium tracking-[0.02em] transition-colors',
                  overlay
                    ? isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    : isActive
                      ? 'bg-[var(--color-bg-elevated)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)]',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
