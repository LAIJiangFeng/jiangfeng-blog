import type { AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

export function AboutTimeline({ items }: Props) {
  return (
    <section className="about-panel about-panel--timeline animate-fade-up" aria-label="经历">
      <div className="about-section-head">
        <span className="about-section-head__index">03</span>
        <h2 className="about-section-head__title">经历</h2>
      </div>

      <div className="about-timeline">
        <div className="about-timeline__spine" aria-hidden />
        <ol className="about-timeline__list">
          {items.map((item, i) => (
            <li
              key={item.year}
              className={[
                'about-timeline__item',
                item.current ? 'about-timeline__item--current' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ ['--tl-i' as string]: i }}
            >
              <span className="about-timeline__node" aria-hidden>
                <span className="about-timeline__node-core" />
              </span>
              <div className="about-timeline__year">{item.year}</div>
              <div className="about-timeline__body">
                <div className="about-timeline__title-row">
                  <h3 className="about-timeline__title">{item.title}</h3>
                  {item.current && <span className="about-timeline__now">现在</span>}
                </div>
                <p className="about-timeline__desc">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
