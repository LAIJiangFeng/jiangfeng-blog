# About Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/about` into a five-section hybrid page (Hero, Story+Now, Timeline, Skills, Connect) with config-driven content and the blog’s existing glass / accent visual system.

**Architecture:** About-only copy lives in `src/data/about.ts`. Social URLs stay on `site.social`. `About.tsx` only composes section components under `src/components/about/*`. Shared icons come from `SocialIcons.tsx`. Visual polish is Tailwind + a small `.about-*` CSS block in `index.css`.

**Tech Stack:** React 19, React Router 7, TypeScript, Tailwind CSS 4, Vitest, existing site CSS variables / motion utilities.

**Spec:** `docs/superpowers/specs/2026-07-27-about-page-redesign-design.md`

## Global Constraints

- Five sections required: AboutHero, Story+Now, Timeline, Skills, Connect
- Page shell: `max-w-5xl` + `px-4` (not the old `max-w-3xl` only layout)
- No full homepage `Orb` embed in Hero — CSS radial glow only
- Social URLs: single source `site.social` (+ RSS `/rss.xml`); do not hardcode profile URLs in about components
- WeChat continues to use the QR asset path under `/public` (same product behavior as current About / Footer)
- Public wording for government work: 「政企数字化相关项目」 only
- Timeline years locked: 2018 → 2021 → 2025 → 2026
- Story copy: approved version A + 2018→全栈 AI transition (see Task 1)
- Motion: restrained; honor `prefers-reduced-motion`
- Themes: CSS variables only (`--color-accent`, `--color-border`, `--color-bg`, etc.)
- Do not change routes, global nav, or Footer architecture
- Non-goals: live stats APIs, avatar upload backend, i18n, homepage redesign

---

## File structure

| Path | Responsibility |
|------|----------------|
| `src/data/about.ts` | Types + approved content defaults + `getAboutContent()` |
| `src/data/about.test.ts` | Unit tests for content shape and key copy |
| `src/lib/aboutLinks.ts` | Pure builder: social + RSS → connect link list (no React) |
| `src/lib/aboutLinks.test.ts` | Tests for link inclusion / exclusion from `site.social` |
| `src/components/about/AboutHero.tsx` | Identity hero |
| `src/components/about/AboutStory.tsx` | Story + Now two-column section |
| `src/components/about/AboutTimeline.tsx` | Vertical timeline |
| `src/components/about/AboutSkills.tsx` | Skill pill matrix |
| `src/components/about/AboutConnect.tsx` | Connect card grid |
| `src/pages/About.tsx` | Composition + Seo only |
| `src/styles/index.css` | `.about-*` rules (hero glow, timeline spine, connect cards, reduced-motion) |

---

### Task 1: About content module + tests

**Files:**
- Create: `src/data/about.ts`
- Create: `src/data/about.test.ts`

**Interfaces:**
- Consumes: nothing from later tasks
- Produces:
  - `AboutTimelineItem`, `AboutSkillGroup`, `AboutContent` types
  - `aboutContent: AboutContent` constant
  - `getAboutContent(): AboutContent`

- [ ] **Step 1: Write the failing test**

Create `src/data/about.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getAboutContent } from './about'

describe('about content', () => {
  it('returns approved tagline and timeline years', () => {
    const content = getAboutContent()
    expect(content.tagline).toBe('AI 爱好者 · 全栈 AI 开发')
    expect(content.timeline.map((t) => t.year)).toEqual(['2018', '2021', '2025', '2026'])
    expect(content.timeline.at(-1)?.current).toBe(true)
  })

  it('includes story transition from 2018 and non-specific gov wording in now', () => {
    const content = getAboutContent()
    expect(content.story.join('')).toMatch(/2018/)
    expect(content.now.items.some((item) => item.includes('政企数字化'))).toBe(true)
    expect(content.skills.length).toBeGreaterThanOrEqual(4)
    expect(content.badges.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/about.test.ts`

Expected: FAIL (module not found / `getAboutContent` undefined)

- [ ] **Step 3: Write minimal implementation**

Create `src/data/about.ts`:

```ts
export type AboutTimelineItem = {
  year: string
  title: string
  description: string
  current?: boolean
}

export type AboutSkillGroup = {
  group: string
  items: string[]
}

export type AboutContent = {
  tagline: string
  badges: string[]
  story: string[]
  now: {
    title: string
    items: string[]
  }
  timeline: AboutTimelineItem[]
  skills: AboutSkillGroup[]
}

export const aboutContent: AboutContent = {
  tagline: 'AI 爱好者 · 全栈 AI 开发',
  badges: ['持续更新中', '基于 MDX 写作', 'Open to chat'],
  story: [
    '我是江枫（Jiangfeng），一名 AI 爱好者。这里是一片安静的角落，用来写下技术笔记、生活碎片，以及那些不适合塞进聊天窗口的想法。从 2018 年在大学里写下第一行 HTML，到如今做全栈 AI 开发，博客不追求更新频率，只希望每一篇都经得起自己回头再读。',
  ],
  now: {
    title: '当前在做',
    items: [
      '打磨本博客',
      'AI Coding / Skill 编写',
      'AI 工作流',
      '自研：简历面试、MCP / Skill 管理等',
      '政企数字化相关项目',
    ],
  },
  timeline: [
    {
      year: '2018',
      title: '入门 · 大学计算机',
      description: '正式接触编程：HTML / CSS → C++ → Java → Spring。',
    },
    {
      year: '2021',
      title: '全栈开发工程师',
      description: 'Vue 前端 + Java 后端，兼微信小程序与 App 开发。',
    },
    {
      year: '2025',
      title: '多端与 AI',
      description: 'React / Vue 与既有技术栈，开始 AI 相关开发。',
    },
    {
      year: '2026',
      title: '全栈 AI · 至今',
      description: 'AI 工作流、UI 设计与全栈交付。',
      current: true,
    },
  ],
  skills: [
    { group: '语言', items: ['Java', 'TypeScript', 'JavaScript', 'C++', 'HTML/CSS'] },
    { group: '前端', items: ['Vue', 'React', '小程序', 'App'] },
    { group: '后端', items: ['Spring', 'Java 全栈'] },
    { group: 'AI', items: ['AI 工作流', 'AI Coding', 'MCP', 'Skill', 'Agent'] },
    { group: '设计 / 其他', items: ['UI 设计', 'Git', '工程化'] },
  ],
}

export function getAboutContent(): AboutContent {
  return aboutContent
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/about.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/about.ts src/data/about.test.ts
git commit -m "feat(about): add config-driven about content module"
```

---

### Task 2: About connect links builder + tests

**Files:**
- Create: `src/lib/aboutLinks.ts`
- Create: `src/lib/aboutLinks.test.ts`

**Interfaces:**
- Consumes: `site` from `@/config/site` (runtime)
- Produces:
  - `AboutConnectLink = { key: string; label: string; href: string; external?: boolean; reloadDocument?: boolean }`
  - `buildAboutConnectLinks(social, options?): AboutConnectLink[]`
  - Options should accept injectable social/email so tests do not depend on live `site` mutation

- [ ] **Step 1: Write the failing test**

Create `src/lib/aboutLinks.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildAboutConnectLinks } from './aboutLinks'

const emptySocial = {
  github: '',
  csdn: '',
  telegram: '',
  wechat: '',
  google: '',
}

describe('buildAboutConnectLinks', () => {
  it('always includes RSS', () => {
    const links = buildAboutConnectLinks(emptySocial)
    expect(links.some((l) => l.key === 'rss' && l.href === '/rss.xml')).toBe(true)
  })

  it('includes only configured social entries', () => {
    const links = buildAboutConnectLinks({
      ...emptySocial,
      github: 'https://github.com/example',
      csdn: 'https://blog.csdn.net/example',
      wechat: '/wechat-qr.jpg',
    })
    expect(links.map((l) => l.key)).toEqual(['github', 'csdn', 'wechat', 'rss'])
    expect(links.find((l) => l.key === 'github')?.external).toBe(true)
    expect(links.find((l) => l.key === 'wechat')?.external).toBeFalsy()
  })

  it('includes mailto when email provided', () => {
    const links = buildAboutConnectLinks(emptySocial, { email: 'hi@example.com' })
    expect(links.find((l) => l.key === 'email')?.href).toBe('mailto:hi@example.com')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/aboutLinks.test.ts`

Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/aboutLinks.ts`:

```ts
export type AboutSocialInput = {
  github: string
  csdn: string
  telegram: string
  wechat: string
  google: string
}

export type AboutConnectLink = {
  key: string
  label: string
  href: string
  external?: boolean
  reloadDocument?: boolean
}

export function buildAboutConnectLinks(
  social: AboutSocialInput,
  options: { email?: string; authorUrl?: string } = {},
): AboutConnectLink[] {
  const links: AboutConnectLink[] = []

  if (social.github) {
    links.push({ key: 'github', label: 'GitHub', href: social.github, external: true })
  }
  if (social.csdn) {
    links.push({ key: 'csdn', label: 'CSDN 博客', href: social.csdn, external: true })
  }
  if (social.wechat) {
    links.push({ key: 'wechat', label: '微信二维码', href: social.wechat })
  }
  if (social.telegram) {
    links.push({ key: 'telegram', label: 'Telegram', href: social.telegram, external: true })
  }
  if (social.google) {
    links.push({ key: 'google', label: 'Google', href: social.google, external: true })
  }
  if (options.email) {
    links.push({ key: 'email', label: '邮箱', href: `mailto:${options.email}` })
  }
  if (options.authorUrl) {
    links.push({ key: 'site', label: '个人网站', href: options.authorUrl, external: true })
  }

  links.push({ key: 'rss', label: 'RSS 订阅', href: '/rss.xml', reloadDocument: true })
  return links
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/aboutLinks.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/aboutLinks.ts src/lib/aboutLinks.test.ts
git commit -m "feat(about): add pure connect-links builder"
```

---

### Task 3: About CSS primitives

**Files:**
- Modify: `src/styles/index.css` (append a new `/* ---------- About page ---------- */` section near other page-specific blocks such as Friends)

**Interfaces:**
- Consumes: existing CSS variables and motion keyframes (`pulse-glow`, `fade-up`)
- Produces: class names used by later components:
  - `.about-page`
  - `.about-hero`, `.about-hero__glow`, `.about-hero__avatar`, `.about-hero__avatar-ring`
  - `.about-panel` (glass panel for story/now)
  - `.about-timeline`, `.about-timeline__item`, `.about-timeline__node`, `.about-timeline__spine`
  - `.about-skill-group`, `.about-connect-grid`, `.about-connect-card`
  - reduced-motion overrides for about animations

- [ ] **Step 1: Append About CSS block**

Append to the end of `src/styles/index.css` (or after the Friends section if easier to maintain):

```css
/* ---------- About page ---------- */
.about-page {
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  width: 100%;
  max-width: 64rem; /* ~max-w-5xl */
  margin-inline: auto;
  padding-inline: 1rem;
  padding-bottom: 2rem;
}

.about-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-border) 90%, transparent);
  border-radius: 1.5rem;
  padding: 2rem 1.25rem 1.75rem;
  background:
    linear-gradient(
      165deg,
      color-mix(in srgb, var(--color-accent) 10%, var(--color-bg-elevated)) 0%,
      var(--color-bg-elevated) 55%
    );
}

.about-hero__glow {
  pointer-events: none;
  position: absolute;
  inset: -20% auto auto 50%;
  width: min(28rem, 90vw);
  height: min(28rem, 90vw);
  translate: -50% 0;
  border-radius: 9999px;
  background: radial-gradient(circle, var(--color-glow), transparent 68%);
  opacity: 0.45;
}

.about-hero__avatar-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  box-shadow: 0 0 28px -8px var(--color-glow);
  animation: pulse-glow 4.5s ease-in-out infinite;
}

.about-hero__avatar {
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 9999px;
  object-fit: cover;
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-bg));
}

.about-panel {
  border: 1px solid color-mix(in srgb, var(--color-border) 90%, transparent);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--color-bg-elevated) 92%, transparent);
  backdrop-filter: blur(12px);
  padding: 1.25rem 1.35rem 1.4rem;
  box-shadow: 0 12px 40px -28px color-mix(in srgb, var(--color-glow) 55%, transparent);
}

.about-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  padding-left: 0.25rem;
}

.about-timeline__spine {
  position: absolute;
  left: 0.55rem;
  top: 0.35rem;
  bottom: 0.35rem;
  width: 1px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-accent) 55%, transparent),
    color-mix(in srgb, var(--color-border) 80%, transparent)
  );
}

.about-timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.85rem 1rem;
  padding-left: 1.5rem;
}

.about-timeline__node {
  position: absolute;
  left: 0.35rem;
  top: 0.45rem;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 9999px;
  background: var(--color-accent);
  box-shadow: 0 0 12px var(--color-glow);
}

.about-timeline__item:hover .about-timeline__node {
  box-shadow: 0 0 18px var(--color-glow);
  transform: scale(1.15);
}

.about-connect-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .about-connect-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .about-connect-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.about-connect-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 0.85rem 0.95rem;
  background: color-mix(in srgb, var(--color-bg-elevated) 90%, transparent);
  color: var(--color-text);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.about-connect-card:hover {
  border-color: color-mix(in srgb, var(--color-accent) 55%, var(--color-border));
  box-shadow: 0 0 24px -10px var(--color-glow);
  transform: translateY(-2px);
  color: var(--color-text);
}

@media (prefers-reduced-motion: reduce) {
  .about-hero__avatar-ring,
  .about-connect-card,
  .about-timeline__item .about-timeline__node {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: Smoke-check CSS syntax**

Run: `npm run build`

Expected: TypeScript + Vite build still succeeds (CSS parses). If the full project has unrelated pre-existing build errors, at least confirm the CSS file has no syntax errors by re-running after later tasks; do not “fix” unrelated modules in this task.

If `npm run build` is too heavy mid-plan, run `npx vite build` only after Task 6. For this task, visually verify braces balance and no unclosed rules.

- [ ] **Step 3: Commit**

```bash
git add src/styles/index.css
git commit -m "style(about): add about page visual primitives"
```

---

### Task 4: Section components (Hero, Story, Timeline, Skills, Connect)

**Files:**
- Create: `src/components/about/AboutHero.tsx`
- Create: `src/components/about/AboutStory.tsx`
- Create: `src/components/about/AboutTimeline.tsx`
- Create: `src/components/about/AboutSkills.tsx`
- Create: `src/components/about/AboutConnect.tsx`

**Interfaces:**
- Consumes:
  - `AboutContent` fields from Task 1
  - `AboutConnectLink[]` from Task 2
  - `site.author` for name / englishName / avatar
  - Icons from `@/components/layout/SocialIcons`
- Produces: five named React components listed above

- [ ] **Step 1: Implement AboutHero**

```tsx
// src/components/about/AboutHero.tsx
import { site } from '@/config/site'
import {
  IconCsdn,
  IconGitHub,
  IconRss,
  IconTelegram,
  IconWeChat,
} from '@/components/layout/SocialIcons'
import type { AboutConnectLink } from '@/lib/aboutLinks'

type Props = {
  tagline: string
  badges: string[]
  socialLinks: AboutConnectLink[]
}

function socialIcon(key: string) {
  switch (key) {
    case 'github':
      return <IconGitHub />
    case 'csdn':
      return <IconCsdn />
    case 'wechat':
      return <IconWeChat />
    case 'telegram':
      return <IconTelegram />
    case 'rss':
      return <IconRss />
    default:
      return null
  }
}

export function AboutHero({ tagline, badges, socialLinks }: Props) {
  const avatar = site.author.avatar
  const initial = site.author.name.slice(0, 1) || '江'
  const iconLinks = socialLinks.filter((l) => socialIcon(l.key))

  return (
    <section className="about-hero animate-fade-up" aria-label="关于作者">
      <div className="about-hero__glow" aria-hidden />
      <div className="relative z-[1] flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
        <div className="about-hero__avatar-ring">
          {avatar ? (
            <img src={avatar} alt="" className="about-hero__avatar" />
          ) : (
            <div
              className="about-hero__avatar flex items-center justify-center font-[family-name:var(--font-display)] text-2xl text-[var(--color-accent)]"
              aria-hidden
            >
              {initial}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
            {site.author.name}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">{site.author.englishName}</p>
          <p className="text-base text-[var(--color-text)] sm:text-lg">{tagline}</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {badges.map((badge) => (
            <li
              key={badge}
              className="chip-glow inline-flex items-center rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-[var(--color-text-muted)]"
            >
              {badge}
            </li>
          ))}
        </ul>

        {iconLinks.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {iconLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  title={link.label}
                  aria-label={link.label}
                  className="icon-btn inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]"
                >
                  {socialIcon(link.key)}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Implement AboutStory**

```tsx
// src/components/about/AboutStory.tsx
type Props = {
  story: string[]
  now: { title: string; items: string[] }
}

export function AboutStory({ story, now }: Props) {
  return (
    <section
      className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      aria-label="关于我与当前在做"
      style={{ ['--i' as string]: 1 }}
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
```

- [ ] **Step 3: Implement AboutTimeline**

```tsx
// src/components/about/AboutTimeline.tsx
import type { AboutTimelineItem } from '@/data/about'

type Props = { items: AboutTimelineItem[] }

export function AboutTimeline({ items }: Props) {
  return (
    <section className="about-panel animate-fade-up space-y-4" aria-label="经历">
      <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">经历</h2>
      <ol className="about-timeline">
        <span className="about-timeline__spine" aria-hidden />
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
    </section>
  )
}
```

- [ ] **Step 4: Implement AboutSkills**

```tsx
// src/components/about/AboutSkills.tsx
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
```

- [ ] **Step 5: Implement AboutConnect**

```tsx
// src/components/about/AboutConnect.tsx
import {
  IconCsdn,
  IconGitHub,
  IconRss,
  IconTelegram,
  IconWeChat,
} from '@/components/layout/SocialIcons'
import type { AboutConnectLink } from '@/lib/aboutLinks'

type Props = { links: AboutConnectLink[] }

function connectIcon(key: string) {
  switch (key) {
    case 'github':
      return <IconGitHub className="size-5" />
    case 'csdn':
      return <IconCsdn className="size-5" />
    case 'wechat':
      return <IconWeChat className="size-5" />
    case 'telegram':
      return <IconTelegram className="size-5" />
    case 'rss':
      return <IconRss className="size-5" />
    default:
      return (
        <span className="inline-flex size-5 items-center justify-center text-xs font-semibold text-[var(--color-accent)]">
          @
        </span>
      )
  }
}

export function AboutConnect({ links }: Props) {
  if (links.length === 0) return null

  return (
    <section className="space-y-4 animate-fade-up" aria-label="连接">
      <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight">连接</h2>
      <ul className="about-connect-grid">
        {links.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              className="about-connect-card"
            >
              <span className="text-[var(--color-accent)]">{connectIcon(link.key)}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/about
git commit -m "feat(about): add about section components"
```

---

### Task 5: Wire About page

**Files:**
- Modify: `src/pages/About.tsx` (replace entire file)

**Interfaces:**
- Consumes: `getAboutContent`, `buildAboutConnectLinks`, all five section components, `site`, `Seo`
- Produces: redesigned `/about` route content

- [ ] **Step 1: Replace About page composition**

```tsx
// src/pages/About.tsx
import { site } from '@/config/site'
import { Seo } from '@/components/seo/Seo'
import { getAboutContent } from '@/data/about'
import { buildAboutConnectLinks } from '@/lib/aboutLinks'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutStory } from '@/components/about/AboutStory'
import { AboutTimeline } from '@/components/about/AboutTimeline'
import { AboutSkills } from '@/components/about/AboutSkills'
import { AboutConnect } from '@/components/about/AboutConnect'

export function About() {
  const content = getAboutContent()
  const links = buildAboutConnectLinks(site.social, {
    email: site.author.email || undefined,
    authorUrl: site.author.url || undefined,
  })

  return (
    <div className="about-page">
      <Seo title="关于" description={`关于 ${site.author.name}。${content.tagline}`} path="/about" />
      <AboutHero tagline={content.tagline} badges={content.badges} socialLinks={links} />
      <AboutStory story={content.story} now={content.now} />
      <AboutTimeline items={content.timeline} />
      <AboutSkills groups={content.skills} />
      <AboutConnect links={links} />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck / tests**

Run:

```bash
npx vitest run src/data/about.test.ts src/lib/aboutLinks.test.ts
npx tsc -b --pretty false
```

Expected: tests PASS; `tsc` exits 0 (or only pre-existing unrelated errors — new about files must be clean).

- [ ] **Step 3: Commit**

```bash
git add src/pages/About.tsx
git commit -m "feat(about): wire redesigned about page sections"
```

---

### Task 6: Visual polish pass + verification

**Files:**
- Modify (only if needed after visual check):
  - `src/styles/index.css` (spacing, light-theme tweaks)
  - section components (class tweaks only)

**Interfaces:** none new

- [ ] **Step 1: Run full test + build**

```bash
npx vitest run
npm run build
```

Expected: vitest green for about + existing tests; production build succeeds and emits assets.

- [ ] **Step 2: Manual checklist in `npm run dev`**

Open `/about` and verify:

1. All five sections visible
2. Desktop: Story | Now side-by-side; mobile: stacked
3. Timeline shows 2018/2021/2025/2026 with `现在` on last node
4. Skill groups render chips
5. Connect cards open correct URLs; WeChat href is QR path
6. Dark + light themes both readable
7. Reduced-motion: no endless avatar pulse if OS setting is on (optional)

- [ ] **Step 3: Fix only gaps found in Step 2**

Keep changes minimal; do not expand scope into homepage or footer redesign.

- [ ] **Step 4: Final commit (if polish edits exist)**

```bash
git add src/styles/index.css src/components/about src/pages/About.tsx
git commit -m "polish(about): tighten layout and theme contrast"
```

If no polish edits were needed, skip this commit.

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| AboutHero with glow, avatar, tagline, badges, social | 4, 5 |
| Story + Now two-column / mobile stack | 4, 5 |
| Timeline 2018→2021→2025→2026 + current badge | 1, 4 |
| Skills grouped pills | 1, 4 |
| Connect cards from site.social + RSS | 2, 4, 5 |
| Config-driven about content | 1 |
| No Orb embed; CSS glow only | 3, 4 |
| max-w-5xl shell | 3 (`.about-page`) |
| prefers-reduced-motion | 3 |
| CSS variables / light theme | 3, 6 |
| Acceptance: tests + build + manual | 5, 6 |

## Self-review notes

- No TBD placeholders in task steps
- Types `AboutContent` / `AboutConnectLink` are consistent across Tasks 1–5
- Social icons reuse `SocialIcons.tsx` rather than a second SVG map
- Pure link builder is testable without React Testing Library

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-27-about-page-redesign.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, faster iteration  
2. **Inline Execution** — execute tasks in this session with checkpoint reviews  

Which approach do you want?
