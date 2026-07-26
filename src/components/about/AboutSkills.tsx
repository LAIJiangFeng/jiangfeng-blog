type Props = { tags: string[] }

/** Endless skill marquee — no group cards */
export function AboutSkills({ tags }: Props) {
  if (tags.length === 0) return null
  const track = [...tags, ...tags]

  return (
    <div className="about-skills" aria-label="技能">
      <div className="about-skills__head">
        <span className="about-skills__kicker">技能</span>
      </div>
      <div className="about-skills__rail">
        <div className="about-skills__fade about-skills__fade--l" aria-hidden />
        <div className="about-skills__fade about-skills__fade--r" aria-hidden />
        <div className="about-skills__track">
          {track.map((tag, i) => (
            <span key={`${tag}-${i}`} className="about-skills__chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
