import type { AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

/**
 * Vertical timeline for open about layout:
 * spine through node centers, year + title + desc on the right.
 */
export function AboutTimeline({ items }: Props) {
  return (
    <section className="about-exp" aria-label="经历">
      <div className="about-exp__head">
        <span className="about-exp__kicker">经历</span>
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
