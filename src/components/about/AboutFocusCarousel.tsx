import TrueFocus from '@/components/react-bits/TrueFocus'
import FadeContent from '@/components/react-bits/FadeContent'

type Props = {
  title: string
  items: string[]
}

/**
 * “此刻” — React Bits TrueFocus cycles focus across now-items.
 * Separator must not appear inside item labels.
 */
const SEP = ' · '

export function AboutFocusCarousel({ title, items }: Props) {
  if (items.length === 0) return null

  const sentence = items.join(SEP)

  return (
    <section className="about-focus" aria-label={title}>
      <header className="about-focus__head">
        <span className="about-focus__kicker">
          <span className="about-focus__pulse" aria-hidden />
          {title}
        </span>
      </header>

      <FadeContent duration={0.7} delay={0.05} threshold={0.15} className="about-focus__stage">
        <TrueFocus
          sentence={sentence}
          separator={SEP}
          blurAmount={4}
          borderColor="var(--color-accent)"
          glowColor="color-mix(in srgb, var(--color-glow) 70%, transparent)"
          animationDuration={0.45}
          pauseBetweenAnimations={1.6}
          className="about-focus__true"
          wordClassName="about-focus__true-word"
        />
      </FadeContent>

      {/* Accessible static list for SR / no-JS fallbacks of focus state */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
