import {
  IconCsdn,
  IconGitHub,
  IconRss,
  IconTelegram,
  IconWeChat,
} from '@/components/layout/SocialIcons'
import type { AboutConnectLink } from '@/lib/aboutLinks'

type Props = { links: AboutConnectLink[] }

function connectIcon(key: string) {
  switch (key) {
    case 'github':
      return <IconGitHub className="size-5" />
    case 'csdn':
      return <IconCsdn className="size-5" />
    case 'wechat':
      return <IconWeChat className="size-5" />
    case 'telegram':
      return <IconTelegram className="size-5" />
    case 'rss':
      return <IconRss className="size-5" />
    default:
      return (
        <span className="inline-flex size-5 items-center justify-center text-xs font-semibold text-[var(--color-accent)]">
          @
        </span>
      )
  }
}

export function AboutConnect({ links }: Props) {
  if (links.length === 0) return null

  return (
    <section className="space-y-4 animate-fade-up" aria-label="连接">
      <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">连接</h2>
      <ul className="about-connect-grid">
        {links.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              className="about-connect-card"
            >
              <span className="text-[var(--color-accent)]">{connectIcon(link.key)}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
