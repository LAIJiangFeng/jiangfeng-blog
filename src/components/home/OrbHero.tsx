import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Orb from '@/components/react-bits/Orb'
import { site } from '@/config/site'
import { useTheme } from '@/components/theme/ThemeProvider'
import { Typewriter } from '@/components/ui/Typewriter'

const HERO_TITLE = `Hi, I'm ${site.author.englishName}, an AI enthusiast.`
const HERO_LINES = [
  site.description,
  '用 MDX 写下技术笔记、项目实践与生活随想。',
  '慢一点交付，认真一点记录。',
] as const

export function OrbHero({ hideCtas = false }: { hideCtas?: boolean }) {
  const { theme, orb } = useTheme()
  const isLight = theme === 'light'
  const [titleDone, setTitleDone] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)

  const currentLine = HERO_LINES[lineIndex] ?? HERO_LINES[0]

  const handleTitleDone = useCallback(() => {
    setTitleDone(true)
  }, [])

  // After a line is typed, wait then advance index so Typewriter deletes → types next
  const handleLineTyped = useCallback(() => {
    window.setTimeout(() => {
      setLineIndex((i) => (i + 1) % HERO_LINES.length)
    }, 2400)
  }, [])

  return (
    <section
      className={[
        // w-full not 100vw — avoids bottom horizontal scrollbar on Windows
        'orb-hero relative mb-0 h-full w-full max-w-full overflow-hidden',
        isLight ? 'orb-hero--light' : 'orb-hero--dark',
      ].join(' ')}
      aria-label="首页主视觉"
    >
      {/* Stage is only BELOW the sticky header so the sphere centers in the visible hero */}
      <div className="orb-hero__stage">
        <Orb
          key={theme}
          hue={orb.hue}
          hoverIntensity={orb.hoverIntensity}
          rotateOnHover
          autoRotate
          forceHoverState={false}
          backgroundColor={orb.backgroundColor}
        />
      </div>

      <div
        className="orb-hero__veil"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse 55% 50% at 50% 50%, transparent 0%, transparent 52%, color-mix(in srgb, var(--color-bg) 55%, transparent) 100%)'
            : 'radial-gradient(ellipse 55% 50% at 50% 50%, transparent 0%, transparent 52%, color-mix(in srgb, var(--color-bg) 45%, transparent) 100%)',
        }}
      />

      {/* Same box as stage — title / CTAs share the sphere center */}
      <div className="orb-hero__copy">
        <div
          className={[
            'mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-md',
            isLight
              ? 'border-black/10 bg-white/70 text-black/75'
              : 'border-white/15 bg-black/40 text-white/80',
          ].join(' ')}
        >
          <span
            className={[
              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide',
              isLight ? 'bg-black text-white' : 'bg-white text-black',
            ].join(' ')}
          >
            BLOG
          </span>
          <span
            className={[
              'font-[family-name:var(--font-mono)] tracking-wide',
              isLight ? 'text-black/60' : 'text-white/70',
            ].join(' ')}
          >
            {site.author.name} · {site.author.englishName}
          </span>
        </div>

        <Typewriter
          key={`title-${theme}`}
          as="h1"
          text={HERO_TITLE}
          typeSpeed={120}
          delay={400}
          onTyped={handleTitleDone}
          cursorAfterDone={false}
          className={[
            'min-h-[1.3em] max-w-3xl text-balance font-[family-name:var(--font-display)] text-[2rem] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-5xl md:text-[3.35rem] md:leading-[1.12]',
            isLight ? 'text-[var(--color-text)]' : 'text-white',
          ].join(' ')}
          cursorClassName="text-[var(--color-accent)]"
        />

        <div
          className={[
            'mt-6 min-h-[3.6em] max-w-xl text-[1.05rem] font-normal leading-[1.75] tracking-[0.01em] sm:min-h-[3.8em] sm:text-lg sm:leading-[1.7]',
            isLight ? 'text-[var(--color-text-muted)]' : 'text-white/68',
          ].join(' ')}
        >
          {titleDone && (
            <Typewriter
              key={`subtitle-${theme}`}
              as="p"
              text={currentLine}
              typeSpeed={95}
              deleteSpeed={42}
              delay={350}
              holdMs={1800}
              onTyped={handleLineTyped}
              cursorAfterDone
              showCursor
              className="inline"
              cursorClassName="text-[var(--color-accent)]"
            />
          )}
        </div>

        {/* Only CTAs hide on scroll — title / typewriter stay with the orb */}
        <div
          className={[
            'orb-hero__ctas mt-8 flex flex-wrap items-center justify-center gap-3',
            hideCtas ? 'is-hidden' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden={hideCtas}
        >
          <Link
            to="/posts"
            tabIndex={hideCtas ? -1 : undefined}
            className={[
              'pointer-events-auto inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition hover:scale-[1.02] active:scale-[0.98]',
              isLight
                ? 'bg-[var(--color-text)] text-white shadow-[0_8px_28px_-10px_rgba(11,126,164,0.45)] hover:opacity-90'
                : 'bg-white text-black shadow-[0_0_30px_-6px_rgba(255,255,255,0.55)] hover:bg-white/95',
            ].join(' ')}
          >
            开始阅读
          </Link>
          <Link
            to="/projects"
            tabIndex={hideCtas ? -1 : undefined}
            className={[
              'pointer-events-auto inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium backdrop-blur-sm transition active:scale-[0.98]',
              isLight
                ? 'border-black/15 bg-white/60 text-[var(--color-text)] hover:border-black/25 hover:bg-white/80'
                : 'border-white/20 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10',
            ].join(' ')}
          >
            浏览项目
          </Link>
        </div>
      </div>
    </section>
  )
}
