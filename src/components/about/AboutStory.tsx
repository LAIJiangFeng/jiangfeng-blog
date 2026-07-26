type Props = {
  story: string[]
  now: { title: string; items: string[] }
}

export function AboutStory({ story, now }: Props) {
  return (
    <section className="about-story" aria-label="关于我与当前在做">
      <div className="about-panel about-panel--story animate-fade-up">
        <div className="about-section-head">
          <span className="about-section-head__index">01</span>
          <h2 className="about-section-head__title">关于我</h2>
        </div>
        <div className="about-story__prose">
          {story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="about-panel about-panel--now animate-fade-up">
        <div className="about-section-head">
          <span className="about-section-head__index">02</span>
          <h2 className="about-section-head__title">{now.title}</h2>
        </div>
        <ul className="about-now-list">
          {now.items.map((item, i) => (
            <li key={item} className="about-now-item" style={{ ['--now-i' as string]: i }}>
              <span className="about-now-item__bar" aria-hidden />
              <span className="about-now-item__text">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
