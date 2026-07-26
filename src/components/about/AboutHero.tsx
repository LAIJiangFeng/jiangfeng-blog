import { site } from '@/config/site'

type Props = {
  tagline: string
  badges: string[]
  story: string[]
}

export function AboutHero({ tagline, badges, story }: Props) {
  const avatar = site.author.avatar
  const initial = site.author.name.slice(0, 1) || '江'

  return (
    <header className="about-top">
      <div className="about-top__avatar about-breath" aria-hidden={!avatar}>
        <span className="about-top__ring" aria-hidden />
        {avatar ? (
          <img src={avatar} alt="" className="about-top__img" />
        ) : (
          <span className="about-top__initial">{initial}</span>
        )}
      </div>

      <div className="about-top__body">
        <div className="about-top__names">
          <h1 className="about-top__cn">{site.author.name}</h1>
          <span className="about-top__en">{site.author.englishName}</span>
        </div>
        <p className="about-top__tag">{tagline}</p>
        {story[0] && <p className="about-top__story">{story[0]}</p>}
        <ul className="about-top__badges">
          {badges.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </header>
  )
}
