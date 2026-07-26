type Props = {
  story: string[]
  now: { title: string; items: string[] }
}

export function AboutStory({ story, now }: Props) {
  return (
    <section
      className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      aria-label="关于我与当前在做"
    >
      <div className="about-panel animate-fade-up space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">关于我</h2>
        <div className="space-y-3 text-[var(--color-text-muted)] leading-relaxed">
          {story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="about-panel animate-fade-up space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">{now.title}</h2>
        <ul className="space-y-2.5">
          {now.items.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-glow)]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
