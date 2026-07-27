import type { ReactNode } from 'react'
import type { AboutTimelineIcon, AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

const ICONS: Record<AboutTimelineIcon, ReactNode> = {
  school: (
    <svg viewBox="0 0 24 24" className="about-tl__icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" className="about-tl__icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" className="about-tl__icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" className="about-tl__icon-svg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

const FALLBACK_ICONS: AboutTimelineIcon[] = ['school', 'code', 'layers', 'spark']

function TimelineIcon({ icon, index }: { icon?: AboutTimelineIcon; index: number }) {
  const key = icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length]
  return <>{ICONS[key]}</>
}

/**
 * Alternating center-spine timeline (desktop):
 * left card | icon node | right card
 * Mobile collapses to single-column with left rail.
 */
export function AboutTimeline({ items }: Props) {
  return (
    <section className="about-exp" aria-label="经历">
      <div className="about-exp__head">
        <span className="about-exp__kicker">经历</span>
      </div>

      <ol className="about-tl">
        {items.map((item, i) => {
          const side = i % 2 === 0 ? 'left' : 'right'
          return (
            <li
              key={`${item.year}-${item.title}`}
              className={[
                'about-tl__item',
                `about-tl__item--${side}`,
                item.current ? 'about-tl__item--current' : '',
                i === items.length - 1 ? 'about-tl__item--last' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ ['--tl-i' as string]: i }}
            >
              <div className="about-tl__card">
                <div className="about-tl__meta">
                  <time className="about-tl__year" dateTime={item.year}>
                    {item.year}
                  </time>
                  {item.current && <span className="about-tl__now">现在</span>}
                </div>
                <h3 className="about-tl__title">{item.title}</h3>
                <p className="about-tl__desc">{item.description}</p>
              </div>

              <div className="about-tl__marker" aria-hidden>
                <span className="about-tl__spine" />
                <span className="about-tl__node">
                  <TimelineIcon icon={item.icon} index={i} />
                </span>
              </div>

              {/* Spacer keeps grid balance on desktop alternating layout */}
              <div className="about-tl__spacer" aria-hidden />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
