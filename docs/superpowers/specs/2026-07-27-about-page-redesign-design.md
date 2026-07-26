# About Page Redesign Design

**Date:** 2026-07-27  
**Status:** Approved  
**Route:** `/about`  
**Approach:** Immersive Hero + sectioned glass cards (Option C hybrid tone, layout Option 1)

## 1. Goals and constraints

### Goals

Upgrade `/about` from a minimal two-paragraph + text-links page into a distinctive personal page:

- Upper half: immersive identity (Hero)
- Lower half: story, current focus, career timeline, skill matrix, connect cards

Tone is **hybrid**: cool tech presentation without burying the quiet narrative voice the author chose.

### Constraints

- Visual system must match the existing blog: dark grid atmosphere, cyan-blue accent, glass cards, chip-glow chips
- Copy is author-confirmed and **config-driven** (not hard-coded only in JSX)
- Motion is restrained: entrance fades, light glow on hover — no full-page particles
- Do not change routes, global nav structure, or Footer architecture
- Optional extension of `site.ts` and/or new `src/data/about.ts` is allowed

### Non-goals (this iteration)

- Live stats APIs or contribution heatmaps
- Avatar upload backend (avatar remains a public path in config)
- Homepage / global layout redesign
- i18n

## 2. Information architecture

Top-to-bottom, five sections inside a `max-w-5xl` page shell (wider than the current `max-w-3xl`):

| # | Section | Role |
|---|---------|------|
| 1 | **AboutHero** | Identity: avatar ring, name, tagline, badges, social icons |
| 2 | **Story + Now** | Left: “关于我”; right: “当前在做” (stack on mobile) |
| 3 | **Timeline** | Vertical timeline 2018 → 2021 → 2025 → 2026 |
| 4 | **Skills** | Grouped skill pill matrix |
| 5 | **Connect** | Card grid for GitHub / CSDN / WeChat / RSS / etc. |

Horizontal padding: `px-4`. SEO via existing `Seo` component.

## 3. Section specifications

### 3.1 AboutHero

- Full-width relative container with a **CSS radial glow** only (no full homepage `Orb` embed — performance and visual noise)
- Avatar: `site.author.avatar` if set; else initials (“江”) with accent border + soft glow ring
- Primary name: `江枫` with subtitle `Jiangfeng`
- Tagline: `AI 爱好者 · 全栈 AI 开发`
- Badges (2–3): e.g. `持续更新中`, `基于 MDX 写作`, `Open to chat`
- Social row: same link sources as Footer / ProfileCard (`site.social` + RSS)

### 3.2 Story + Now

**关于我** (confirmed copy, version A + transition):

> 我是江枫（Jiangfeng），一名 AI 爱好者。这里是一片安静的角落，用来写下技术笔记、生活碎片，以及那些不适合塞进聊天窗口的想法。从 2018 年在大学里写下第一行 HTML，到如今做全栈 AI 开发，博客不追求更新频率，只希望每一篇都经得起自己回头再读。

Optional second short line may reuse `site.author.bio` / site description if it does not feel redundant — prefer one cohesive block over repetition.

**当前在做** (glass side card, list):

- 打磨本博客
- AI Coding / Skill 编写
- AI 工作流
- 自研：简历面试、MCP / Skill 管理等
- 政企数字化相关项目（public, non-specific wording)

Desktop: two columns. Mobile: single column (story then now).

### 3.3 Timeline

Vertical axis + accent nodes + title/description on the right:

| Year | Title | Description highlights |
|------|-------|------------------------|
| 2018 | 入门 · 大学计算机 | HTML/CSS → C++ → Java → Spring |
| 2021 | 全栈开发工程师 | Vue + Java; 微信小程序与 App |
| 2025 | 多端与 AI | React / Vue + AI-related development |
| 2026 | 全栈 AI · 至今 | AI workflows, UI, full-stack delivery |

Last node may show a small `现在` badge (`current: true`).

### 3.4 Skills

Grouped pills, styled like existing `chip-glow` patterns:

| Group | Items |
|-------|--------|
| 语言 | Java, TypeScript, JavaScript, C++, HTML/CSS |
| 前端 | Vue, React, 小程序, App |
| 后端 | Spring, Java 全栈 |
| AI | AI 工作流, AI Coding, MCP, Skill, Agent |
| 设计 / 其他 | UI 设计, Git, 工程化 |

### 3.5 Connect

- Build cards from `site.social` + RSS (same rules as current `buildAboutLinks`)
- Each card: icon + label + external/internal behavior
- WeChat continues to point at the QR asset path under `/public` (same product behavior as today)

## 4. Data model

Prefer a dedicated module so the page stays presentational:

**File:** `src/data/about.ts` (recommended)  
or nested under `site.about` in `src/config/site.ts` if the object stays small.

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
```

**Rules:**

- Author name / englishName / avatar / email remain on `site.author`
- Social URLs remain on `site.social` (single source of truth; About Connect must not hardcode URLs)
- About-only narrative (story, timeline, skills, now, badges, tagline) lives in about content config

## 5. Component structure

| File | Responsibility |
|------|----------------|
| `src/pages/About.tsx` | Composition + `Seo` |
| `src/components/about/AboutHero.tsx` | Hero identity block |
| `src/components/about/AboutStory.tsx` | Story + Now two-column section |
| `src/components/about/AboutTimeline.tsx` | Timeline |
| `src/components/about/AboutSkills.tsx` | Skill matrix |
| `src/components/about/AboutConnect.tsx` | Connect card grid |
| `src/data/about.ts` | Confirmed content defaults |
| `src/styles/index.css` | Small set of `.about-*` rules where Tailwind is awkward (timeline spine, hero glow) |

Reuse existing patterns from Friends / glass-card / ProfileCard social icons where practical; do not invent a second social URL map.

**Layout wrapper:** Keep whatever layout About already uses relative to other content pages (do not introduce a new shell).

## 6. Motion and responsive behavior

| Concern | Behavior |
|---------|----------|
| Entrance | Sections use existing `animate-fade-up` / fade patterns; optional staggered `--i` delay 50–80ms |
| Hero | Soft pulse on avatar ring; badge hover lift |
| Timeline | Node accent on hover; viewport reveal optional — **CSS-only is fine for v1** |
| Skills | Pill hover border + glow |
| Connect | Card hover aligned with `glass-card` / `friend-card` feel |
| Reduced motion | Honor `prefers-reduced-motion`: disable pulse and stagger |
| Mobile | Hero centered stack; Story/Now single column; timeline stays vertical; skills wrap; Connect 2 columns |
| Themes | All colors via CSS variables (`--color-accent`, `--color-border`, `--color-bg`, etc.) so light theme works |

## 7. Acceptance criteria

1. `/about` shows all five sections; readable on desktop and mobile
2. Dark and light themes do not break layout or contrast
3. External links open correctly; WeChat still uses QR asset path
4. Changing about content config updates copy without editing layout components
5. Visual quality is clearly above the previous minimal page and consistent with the blog’s tech aesthetic
6. No regression to nav, footer, or other routes

## 8. Implementation notes

- Prefer composition over one mega-file `About.tsx`
- Avoid duplicating social icon SVG sets if `SocialIcons` / ProfileCard already export usable pieces; extract only if needed for Connect cards
- Keep Chinese UI labels consistent with the rest of the site (关于我 / 当前在做 / 经历 / 技能 / 连接)
- Do not invent new years or job titles beyond the approved timeline table

## 9. Approved content snapshot

**Tagline:** `AI 爱好者 · 全栈 AI 开发`

**Badges:** `持续更新中` · `基于 MDX 写作` · `Open to chat`

**Story:** version A + 2018→全栈 AI transition (see §3.2)

**Timeline years:** 2018 → 2021 → 2025 → 2026 (confirmed)

**Government work:** public wording only — 「政企数字化相关项目」
