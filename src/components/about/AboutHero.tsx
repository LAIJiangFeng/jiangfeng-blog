import { site } from '@/config/site'
import {
  IconCsdn,
  IconGitHub,
  IconRss,
  IconTelegram,
  IconWeChat,
} from '@/components/layout/SocialIcons'
import type { AboutConnectLink } from '@/lib/aboutLinks'

type Props = {
  tagline: string
  badges: string[]
  socialLinks: AboutConnectLink[]
}

function socialIcon(key: string) {
  switch (key) {
    case 'github':
      return <IconGitHub />
    case 'csdn':
      return <IconCsdn />
    case 'wechat':
      return <IconWeChat />
    case 'telegram':
      return <IconTelegram />
    case 'rss':
      return <IconRss />
    default:
      return null
  }
}

export function AboutHero({ tagline, badges, socialLinks }: Props) {
  const avatar = site.author.avatar
  const initial = site.author.name.slice(0, 1) || '江'
  const iconLinks = socialLinks.filter((l) => socialIcon(l.key))

  return (
    <section className="about-hero animate-fade-up" aria-label="关于作者">
      <div className="about-hero__glow" aria-hidden />
      <div className="relative z-[1] flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
        <div className="about-hero__avatar-ring">
          {avatar ? (
            <img src={avatar} alt="" className="about-hero__avatar" />
          ) : (
            <div
              className="about-hero__avatar flex items-center justify-center font-[family-name:var(--font-display)] text-2xl text-[var(--color-accent)]"
              aria-hidden
            >
              {initial}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
            {site.author.name}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">{site.author.englishName}</p>
          <p className="text-base text-[var(--color-text)] sm:text-lg">{tagline}</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {badges.map((badge) => (
            <li
              key={badge}
              className="chip-glow inline-flex items-center rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-[var(--color-text-muted)]"
            >
              {badge}
            </li>
          ))}
        </ul>

        {iconLinks.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {iconLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  title={link.label}
                  aria-label={link.label}
                  className="icon-btn inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]"
                >
                  {socialIcon(link.key)}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
