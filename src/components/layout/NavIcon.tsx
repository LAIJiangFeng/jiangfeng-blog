import type { NavIconName } from './navLinks'

export function NavIcon({
  name,
  className = 'h-[1.05rem] w-[1.05rem]',
}: {
  name: NavIconName
  className?: string
}) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.85,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6.5 9.8V20h11V9.8" />
          <path d="M10 20v-5.5h4V20" />
        </svg>
      )
    case 'posts':
      return (
        <svg {...common}>
          <path d="M7 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path d="M15 4v4h4" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      )
    case 'projects':
      return (
        <svg {...common}>
          <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7z" />
          <path d="M12 12 4.4 7.7M12 12l7.6-4.3M12 12v8" />
        </svg>
      )
    case 'friends':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="16.5" cy="10" r="2.4" />
          <path d="M3.5 19c.9-2.8 2.9-4.2 5.5-4.2s4.6 1.4 5.5 4.2" />
          <path d="M14 19c.5-1.8 1.7-2.8 3.4-2.8 1.5 0 2.6.8 3.1 2.2" />
        </svg>
      )
    case 'about':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19.5c1.3-3.2 3.7-4.8 6.5-4.8s5.2 1.6 6.5 4.8" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="5.5" />
          <path d="M16 16.5 20 20.5" />
        </svg>
      )
    default:
      return null
  }
}
