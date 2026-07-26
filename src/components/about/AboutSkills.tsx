import type { AboutSkillGroup } from '@/data/about'

type Props = { groups: AboutSkillGroup[] }

export function AboutSkills({ groups }: Props) {
  return (
    <section className="about-panel about-panel--skills animate-fade-up" aria-label="技能">
      <div className="about-section-head">
        <span className="about-section-head__index">04</span>
        <h2 className="about-section-head__title">技能</h2>
      </div>

      <div className="about-skills-grid">
        {groups.map((group, gi) => (
          <div
            key={group.group}
            className="about-skill-card"
            style={{ ['--skill-i' as string]: gi }}
          >
            <div className="about-skill-card__shine" aria-hidden />
            <h3 className="about-skill-card__group">{group.group}</h3>
            <ul className="about-skill-card__items">
              {group.items.map((item) => (
                <li key={item} className="about-skill-chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
