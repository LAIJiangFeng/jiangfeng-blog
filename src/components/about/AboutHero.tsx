import { site } from '@/config/site'
import BlurText from '@/components/react-bits/BlurText'
import ShinyText from '@/components/react-bits/ShinyText'
import FadeContent from '@/components/react-bits/FadeContent'
import { useTheme } from '@/components/theme/ThemeProvider'

type Props = {
  tagline: string
  badges: string[]
  story: string[]
}

export function AboutHero({ tagline, badges, story }: Props) {
  const avatar = site.author.avatar
  const initial = site.author.name.slice(0, 1) || '江'
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <header className="about-top">
      <FadeContent duration={0.7} delay={0} threshold={0.05} blur className="about-top__avatar-wrap">
        <div className="about-top__avatar" aria-hidden={!avatar}>
          <span className="about-top__ring" aria-hidden />
          {avatar ? (
            <img src={avatar} alt="" className="about-top__img" />
          ) : (
            <span className="about-top__initial">{initial}</span>
          )}
        </div>
      </FadeContent>

      <div className="about-top__body">
        <div className="about-top__names">
          <BlurText
            text={site.author.name}
            delay={80}
            animateBy="letters"
            direction="top"
            className="about-top__cn blur-text--title"
            stepDuration={0.28}
          />
          <span className="about-top__en">{site.author.englishName}</span>
        </div>

        <div className="about-top__tag">
          <ShinyText
            text={tagline}
            speed={2.4}
            yoyo
            delay={0.6}
            color={isLight ? '#0e7490' : '#67e8f9'}
            shineColor={isLight ? '#083344' : '#ecfeff'}
            className="about-top__shiny"
          />
        </div>

        {story[0] && (
          <BlurText
            text={story[0]}
            delay={28}
            animateBy="words"
            direction="bottom"
            className="about-top__story blur-text--story"
            stepDuration={0.32}
          />
        )}

        <FadeContent duration={0.65} delay={0.35} threshold={0.05}>
          <ul className="about-top__badges">
            {badges.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </FadeContent>
      </div>
    </header>
  )
}
