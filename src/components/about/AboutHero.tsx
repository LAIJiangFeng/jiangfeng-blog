import { site } from '@/config/site'

type Props = {
  tagline: string
  badges: string[]
}

export function AboutHero({ tagline, badges }: Props) {
  const avatar = site.author.avatar
  const initial = site.author.name.slice(0, 1) || '江'

  return (
    <section className="about-hero animate-fade-up" aria-label="关于作者">
      <div className="about-hero__grid" aria-hidden />
      <div className="about-hero__glow about-hero__glow--a" aria-hidden />
      <div className="about-hero__glow about-hero__glow--b" aria-hidden />
      <div className="about-hero__scan" aria-hidden />

      <div className="about-hero__inner">
        <div className="about-hero__avatar-wrap">
          <div className="about-hero__avatar-ring">
            {avatar ? (
              <img src={avatar} alt="" className="about-hero__avatar" />
            ) : (
              <div className="about-hero__avatar about-hero__avatar--initials" aria-hidden>
                {initial}
              </div>
            )}
          </div>
          <span className="about-hero__live" title="在线创作中">
            <span className="about-hero__live-dot" aria-hidden />
            Active
          </span>
        </div>

        <div className="about-hero__copy">
          <p className="about-hero__kicker">About / 关于</p>
          <h1 className="about-hero__name">
            <span className="about-hero__name-cn">{site.author.name}</span>
            <span className="about-hero__name-en">{site.author.englishName}</span>
          </h1>
          <p className="about-hero__tagline">{tagline}</p>

          <ul className="about-hero__badges">
            {badges.map((badge) => (
              <li key={badge} className="about-hero__badge">
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
