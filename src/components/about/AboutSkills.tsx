import type { AboutSkillGroup } from '@/data/about'

type Props = { groups: AboutSkillGroup[] }

export function AboutSkills({ groups }: Props) {
  return (
    <section className="about-panel animate-fade-up space-y-5" aria-label="技能">
      <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">技能</h2>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.group} className="space-y-2">
            <h3 className="text-xs font-medium tracking-wider text-[var(--color-text-muted)] uppercase">
              {group.group}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="chip-glow inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-[12px] text-[var(--color-text)]"
                >
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
