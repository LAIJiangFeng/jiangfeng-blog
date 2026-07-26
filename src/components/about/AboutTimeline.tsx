import type { AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

/**
 * Classic vertical timeline:
 *   [spine + node] | year + title + description
 * Node vertically centers on the year line; spine runs through node centers.
 */
export function AboutTimeline({ items }: Props) {
  return (
    <section className="about-panel about-panel--timeline animate-fade-up" aria-label="经历">
      <div className="about-section-head">
        <span className="about-section-head__index">03</span>
        <h2 className="about-section-head__title">经历</h2>
      </div>

      <ol className="about-tl">
        {items.map((item, i) => (
          <li
            key={item.year}
            className={[
              'about-tl__item',
              item.current ? 'about-tl__item--current' : '',
              i === items.length - 1 ? 'about-tl__item--last' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ ['--tl-i' as string]: i }}
          >
            {/* Marker column: continuous spine + centered node */}
            <div className="about-tl__marker" aria-hidden>
              <span className="about-tl__spine" />
              <span className="about-tl__node">
                <span className="about-tl__node-core" />
              </span>
            </div>

            <div className="about-tl__content">
              <div className="about-tl__meta">
                <time className="about-tl__year" dateTime={item.year}>
                  {item.year}
                </time>
                {item.current && <span className="about-tl__now">现在</span>}
              </div>
              <h3 className="about-tl__title">{item.title}</h3>
              <p className="about-tl__desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
