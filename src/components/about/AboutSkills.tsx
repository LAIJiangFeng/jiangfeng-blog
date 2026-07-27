import LogoLoop, { type LogoItem } from '@/components/react-bits/LogoLoop'
import { useTheme } from '@/components/theme/ThemeProvider'
import { SURFACE } from '@/lib/theme'

type Props = { tags: string[] }

/** Skill marquee via React Bits LogoLoop (text nodes). */
export function AboutSkills({ tags }: Props) {
  const { theme } = useTheme()
  if (tags.length === 0) return null

  const logos: LogoItem[] = tags.map((tag) => ({
    node: <span className="about-skills__chip">{tag}</span>,
    title: tag,
    ariaLabel: tag,
  }))

  return (
    <div className="about-skills" aria-label="技能">
      <div className="about-skills__head">
        <span className="about-skills__kicker">技能</span>
      </div>
      <div className="about-skills__rail">
        <LogoLoop
          logos={logos}
          speed={48}
          direction="left"
          gap={14}
          logoHeight={36}
          pauseOnHover
          fadeOut
          fadeOutColor={SURFACE[theme]}
          scaleOnHover
          ariaLabel="技能"
          className="about-skills__loop"
        />
      </div>
    </div>
  )
}
