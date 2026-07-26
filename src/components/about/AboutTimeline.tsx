import type { AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

export function AboutTimeline({ items }: Props) {
  return (
    <section className="about-panel animate-fade-up space-y-4" aria-label="经历">
      <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">经历</h2>
      <div className="about-timeline">
        <div className="about-timeline__spine" aria-hidden />
        <ol className="m-0 flex list-none flex-col gap-[1.35rem] p-0">
          {items.map((item) => (
            <li key={item.year} className="about-timeline__item">
              <span className="about-timeline__node" aria-hidden />
              <div className="pt-0.5 text-sm font-medium text-[var(--color-accent)]">{item.year}</div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-[var(--color-text)]">{item.title}</h3>
                  {item.current && (
                    <span className="rounded-full border border-[var(--color-accent)] px-2 py-0.5 text-[10px] tracking-wider text-[var(--color-accent)]">
                      现在
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
