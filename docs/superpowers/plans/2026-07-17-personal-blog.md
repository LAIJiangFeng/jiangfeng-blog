# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static personal blog (Vite + React + React Router + Tailwind + MDX) with full v1 features: lists, detail, tags, archive, search, dark-premium theme, reading progress, related posts, RSS, Giscus, SEO.

**Architecture:** MDX posts under `content/posts/` are loaded at build time via Vite + MDX plugin and `import.meta.glob`. Pure functions in `src/lib/posts.ts` power sort/filter/search/related. SPA routes render pages; RSS is emitted as a static file during build. No backend.

**Tech Stack:** Vite, React 19, TypeScript, React Router 7, Tailwind CSS 4, MDX (`@mdx-js/rollup` + `@mdx-js/react`), gray-matter or remark-frontmatter, Shiki/rehype-pretty-code, react-helmet-async, Vitest, Giscus.

**Spec:** `docs/superpowers/specs/2026-07-17-personal-blog-design.md`

## Global Constraints

- Pure static SPA — no server API, no auth, no CMS.
- Content format is **MDX** only under `content/posts/*.mdx`.
- Slug = filename without extension (not frontmatter).
- Categories: `tech` | `life` | `thoughts` only.
- Default theme is **dark premium**; light mode optional via class + localStorage.
- Giscus must degrade to placeholder when config empty.
- Draft posts (`draft: true`) excluded from production lists/RSS; allowed in DEV if useful.
- Avoid generic purple-gradient “AI SaaS” look; one muted accent only.
- Commits should be frequent and scoped per task.

---

## File Structure (target)

```
content/posts/*.mdx
public/images/  public/favicon.svg
scripts/generate-rss.ts          # optional if RSS done via Vite plugin
src/
  config/site.ts
  lib/posts.ts
  lib/posts.test.ts
  lib/theme.ts
  components/layout/{Shell,Header,Footer,MobileNav}.tsx
  components/ui/{PostCard,TagChip,ThemeToggle,SearchInput,EmptyState,CategoryBadge}.tsx
  components/post/{ReadingProgress,RelatedPosts,PostHeader,GiscusComments}.tsx
  components/mdx/{Callout,CodeBlock,MDXImage,mdxComponents.tsx}.tsx
  pages/{Home,Posts,PostDetail,Tags,TagDetail,Archive,About,Search,NotFound}.tsx
  styles/index.css
  App.tsx  main.tsx  vite-env.d.ts
vite.config.ts  index.html  package.json
```

---

### Task 1: Scaffold project toolchain

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/styles/index.css`, `.gitignore`
- Test: `npm run build` succeeds

**Interfaces:**
- Produces: Vite React-TS app runnable with `npm run dev` / `npm run build`

- [ ] **Step 1: Scaffold with Vite**

```bash
npm create vite@latest . -- --template react-ts
```

If the directory is non-empty (docs already present), create in a temp folder and move app files into repo root, preserving `docs/` and `.git/`.

- [ ] **Step 2: Install runtime + dev dependencies**

```bash
npm install react-router-dom react-helmet-async
npm install -D tailwindcss @tailwindcss/vite @mdx-js/rollup @mdx-js/react remark-frontmatter remark-mdx-frontmatter rehype-pretty-code shiki vitest jsdom @testing-library/react @types/mdx
```

Pin to current stable majors available at install time; do not invent version numbers.

- [ ] **Step 3: Configure Vite**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import path from 'node:path'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark-dimmed' }]],
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@content': path.resolve(__dirname, 'content'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 4: Tailwind entry + path alias types**

`src/styles/index.css`:

```css
@import "tailwindcss";

@theme {
  --font-display: "Fraunces", ui-serif, Georgia, serif;
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --color-bg: #0a0a0b;
  --color-bg-elevated: #121214;
  --color-border: #2a2a2e;
  --color-text: #e8e6e3;
  --color-text-muted: #9a9690;
  --color-accent: #c4a574;
}

html.light {
  --color-bg: #f7f5f2;
  --color-bg-elevated: #ffffff;
  --color-border: #e4e0d8;
  --color-text: #1a1917;
  --color-text-muted: #6b6560;
  --color-accent: #8a6a3b;
}

html {
  color-scheme: dark;
}
html.light {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

Load fonts in `index.html` (Google Fonts or later fontsource).

`tsconfig` paths: `"@/*": ["src/*"]`, `"@content/*": ["content/*"]`.

- [ ] **Step 5: Minimal App shell**

`src/main.tsx` mounts `<BrowserRouter><App /></BrowserRouter>`.  
`src/App.tsx` renders a placeholder route `/` with text “Blog scaffold”.

- [ ] **Step 6: Verify**

```bash
npm run build
npm test -- --run
```

Expected: build succeeds (tests may be empty pass).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React TS Tailwind MDX blog"
```

---

### Task 2: Site config + theme helpers

**Files:**
- Create: `src/config/site.ts`, `src/lib/theme.ts`
- Modify: `src/main.tsx` (call `initTheme()` before render)

**Interfaces:**
- Produces:
  - `site` object: `{ name, title, description, url, author, social, giscus }`
  - `initTheme(): void`, `getTheme(): 'dark' | 'light'`, `setTheme(t: 'dark' | 'light'): void`, `toggleTheme(): 'dark' | 'light'`

- [ ] **Step 1: Write `src/config/site.ts`**

```ts
export const site = {
  name: 'Grok Blob',
  title: 'Grok Blob — Personal Blog',
  description: 'Tech notes, life fragments, and quiet thoughts.',
  url: 'https://example.com',
  author: {
    name: 'Author',
    email: '',
    url: '',
  },
  social: {
    github: 'https://github.com',
    // twitter: '',
  },
  giscus: {
    repo: '',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname' as const,
  },
} as const
```

- [ ] **Step 2: Write `src/lib/theme.ts`**

```ts
export type Theme = 'dark' | 'light'
const KEY = 'blog-theme'

export function getTheme(): Theme {
  const stored = localStorage.getItem(KEY) as Theme | null
  if (stored === 'dark' || stored === 'light') return stored
  return 'dark'
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(KEY, theme)
  document.documentElement.classList.toggle('light', theme === 'light')
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function initTheme(): void {
  setTheme(getTheme())
}

export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}
```

- [ ] **Step 3: Call `initTheme()` in `main.tsx` before `createRoot`**

- [ ] **Step 4: Commit**

```bash
git add src/config/site.ts src/lib/theme.ts src/main.tsx
git commit -m "feat: add site config and theme helpers"
```

---

### Task 3: Post domain types + pure library (TDD)

**Files:**
- Create: `src/lib/posts.ts`, `src/lib/posts.test.ts`
- Note: MDX loading stubs later; this task implements pure functions on `PostMeta[]`

**Interfaces:**
- Produces types and functions:

```ts
export type Category = 'tech' | 'life' | 'thoughts'

export interface PostMeta {
  slug: string
  title: string
  date: string
  updated?: string
  summary: string
  tags: string[]
  category: Category
  cover?: string
  draft?: boolean
}

export function isPublished(post: PostMeta, isDev: boolean): boolean
export function sortByDateDesc(posts: PostMeta[]): PostMeta[]
export function filterByTag(posts: PostMeta[], tag: string): PostMeta[]
export function filterByCategory(posts: PostMeta[], category: Category): PostMeta[]
export function groupByArchive(posts: PostMeta[]): { year: string; months: { month: string; posts: PostMeta[] }[] }[]
export function searchPosts(posts: PostMeta[], query: string): PostMeta[]
export function getRelatedPosts(posts: PostMeta[], current: PostMeta, limit?: number): PostMeta[]
export function getAllTags(posts: PostMeta[]): { tag: string; count: number }[]
```

- [ ] **Step 1: Write failing tests in `src/lib/posts.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import {
  sortByDateDesc,
  filterByTag,
  searchPosts,
  getRelatedPosts,
  isPublished,
  getAllTags,
} from './posts'

const sample = [
  {
    slug: 'a',
    title: 'React Hooks',
    date: '2026-01-02',
    summary: 'About hooks',
    tags: ['React', 'JS'],
    category: 'tech' as const,
  },
  {
    slug: 'b',
    title: 'A Quiet Walk',
    date: '2026-03-01',
    summary: 'Evening stroll',
    tags: ['life'],
    category: 'life' as const,
  },
  {
    slug: 'c',
    title: 'Draft',
    date: '2026-04-01',
    summary: 'Hidden',
    tags: ['React'],
    category: 'tech' as const,
    draft: true,
  },
]

describe('posts lib', () => {
  it('sorts by date descending', () => {
    expect(sortByDateDesc(sample).map((p) => p.slug)).toEqual(['c', 'b', 'a'])
  })

  it('filters by tag case-insensitively', () => {
    expect(filterByTag(sample, 'react').map((p) => p.slug)).toEqual(['a', 'c'])
  })

  it('searches title summary tags', () => {
    expect(searchPosts(sample, 'quiet').map((p) => p.slug)).toEqual(['b'])
    expect(searchPosts(sample, 'react').map((p) => p.slug).sort()).toEqual(['a', 'c'])
  })

  it('related prefers shared tags', () => {
    const related = getRelatedPosts(sample, sample[0], 2)
    expect(related[0].slug).toBe('c')
  })

  it('hides drafts in production', () => {
    expect(isPublished(sample[2], false)).toBe(false)
    expect(isPublished(sample[2], true)).toBe(true)
  })

  it('counts tags', () => {
    expect(getAllTags(sample)).toEqual(
      expect.arrayContaining([
        { tag: 'React', count: 2 },
        { tag: 'JS', count: 1 },
        { tag: 'life', count: 1 },
      ]),
    )
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/lib/posts.test.ts
```

Expected: FAIL (module or exports missing).

- [ ] **Step 3: Implement `src/lib/posts.ts`**

Implement all functions above. Rules:

- `sortByDateDesc`: ISO date string compare, newest first.
- `filterByTag`: case-insensitive equality on tag strings.
- `searchPosts`: trim query; empty → `[]`; match if query (lower) is substring of title, summary, or any tag (lower).
- `getRelatedPosts`: exclude current slug; score by shared tag count; tie-break same category then newer date; default limit 3.
- `isPublished`: `!draft || isDev`.
- `groupByArchive`: years desc, months desc (`YYYY-MM` keys).
- `getAllTags`: aggregate counts, sort by count desc then tag asc.

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/lib/posts.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/posts.ts src/lib/posts.test.ts
git commit -m "feat: post meta pure helpers with tests"
```

---

### Task 4: MDX load pipeline + sample posts

**Files:**
- Create: `content/posts/welcome-to-the-lab.mdx`, `content/posts/quiet-evening.mdx`, `content/posts/on-shipping-slowly.mdx`
- Create: `src/lib/loadPosts.ts` (or extend `posts.ts` with loader)
- Create: `src/components/mdx/Callout.tsx`, `MDXImage.tsx`, `mdxComponents.tsx`
- Modify: `src/vite-env.d.ts` for `*.mdx` modules

**Interfaces:**
- Produces:

```ts
export interface Post extends PostMeta {
  Component: React.ComponentType
}

export function getAllPosts(): Post[]
export function getPostBySlug(slug: string): Post | undefined
export function getPublishedPosts(): PostMeta[]  // uses import.meta.env.DEV
```

MDX modules expose frontmatter via `remark-mdx-frontmatter` as named export `frontmatter` (verify actual export shape for the plugin version; map accordingly).

- [ ] **Step 1: Add MDX module types**

```ts
// src/vite-env.d.ts
/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: Record<string, unknown>
  const MDXComponent: ComponentType
  export default MDXComponent
}
```

- [ ] **Step 2: Implement loader**

```ts
// src/lib/loadPosts.ts
import type { ComponentType } from 'react'
import type { Category, PostMeta } from './posts'
import { isPublished, sortByDateDesc } from './posts'

export interface Post extends PostMeta {
  Component: ComponentType
}

const modules = import.meta.glob('../../content/posts/*.mdx', { eager: true }) as Record<
  string,
  { default: ComponentType; frontmatter: Record<string, unknown> }
>

function pathToSlug(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.mdx$/, '')
}

function parseMeta(slug: string, fm: Record<string, unknown>): PostMeta {
  const category = fm.category as Category
  if (!['tech', 'life', 'thoughts'].includes(category)) {
    throw new Error(`Invalid category for ${slug}: ${String(fm.category)}`)
  }
  if (typeof fm.title !== 'string' || typeof fm.date !== 'string' || typeof fm.summary !== 'string') {
    throw new Error(`Missing required frontmatter on ${slug}`)
  }
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : []
  return {
    slug,
    title: fm.title,
    date: fm.date,
    updated: typeof fm.updated === 'string' ? fm.updated : undefined,
    summary: fm.summary,
    tags,
    category,
    cover: typeof fm.cover === 'string' ? fm.cover : undefined,
    draft: Boolean(fm.draft),
  }
}

export function getAllPosts(): Post[] {
  const posts: Post[] = Object.entries(modules).map(([path, mod]) => {
    const slug = pathToSlug(path)
    const meta = parseMeta(slug, mod.frontmatter ?? {})
    return { ...meta, Component: mod.default }
  })
  return sortByDateDesc(posts) as Post[]
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => isPublished(p, import.meta.env.DEV))
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((p) => p.slug === slug)
}
```

Adjust glob path if Vite resolves differently from `src/lib/`.

- [ ] **Step 3: MDX components**

`Callout.tsx`: props `{ type?: 'info' | 'warning' | 'tip'; children }`, styled with border + accent.  
`MDXImage.tsx`: requires `alt`, `className` max-width 100%.  
`mdxComponents.tsx`: export map `{ Callout, img: MDXImage }` for `MDXProvider`.

- [ ] **Step 4: Three sample MDX posts**

1. `welcome-to-the-lab.mdx` — category `tech`, tags include React, uses `<Callout>` and a code fence.  
2. `quiet-evening.mdx` — category `life`.  
3. `on-shipping-slowly.mdx` — category `thoughts`.

Each has valid frontmatter per spec.

- [ ] **Step 5: Smoke import in a temporary page or console via Home later; for now `npm run build` must succeed**

```bash
npm run build
```

Expected: success; if frontmatter export name differs, fix loader to match plugin docs.

- [ ] **Step 6: Commit**

```bash
git add content src/lib/loadPosts.ts src/components/mdx src/vite-env.d.ts
git commit -m "feat: MDX pipeline, components, and sample posts"
```

---

### Task 5: Layout shell + routing skeleton

**Files:**
- Create: layout components listed in file structure
- Modify: `src/App.tsx` with all routes (pages can be stubs)
- Create: stub pages under `src/pages/`

**Interfaces:**
- Produces: `Shell` wrapping `<Outlet />`; nav links to Home, Posts, Tags, Archive, About, Search; footer with site name + year

- [ ] **Step 1: Implement Header / Footer / Shell / ThemeToggle**

- Header: logo = `site.name`, nav links, `ThemeToggle` calling `toggleTheme`.
- Footer: copyright `© {year} {site.author.name}`.
- Shell: min-h-screen flex flex-col; main max-w-3xl or max-w-5xl mx-auto px-4 py-10 flex-1.

- [ ] **Step 2: Wire routes in App.tsx**

```tsx
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Shell } from '@/components/layout/Shell'
import { Home } from '@/pages/Home'
// ... other pages

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:slug" element={<PostDetail />} />
          <Route path="tags" element={<Tags />} />
          <Route path="tags/:tag" element={<TagDetail />} />
          <Route path="archive" element={<Archive />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HelmetProvider>
  )
}
```

- [ ] **Step 3: Stub each page with a heading**

- [ ] **Step 4: Manual check `npm run dev` — nav works**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: layout shell and route skeleton"
```

---

### Task 6: PostCard + Home + Posts list

**Files:**
- Create: `src/components/ui/PostCard.tsx`, `CategoryBadge.tsx`, `TagChip.tsx`
- Modify: `src/pages/Home.tsx`, `src/pages/Posts.tsx`

**Interfaces:**
- `PostCard` props: `post: PostMeta`
- Links to `/posts/${slug}`

- [ ] **Step 1: Implement PostCard, CategoryBadge, TagChip** with premium dark styling (elevated card, hairline border, accent hover).

- [ ] **Step 2: Home** — hero with `site.title` / description; list latest 6 from `getPublishedPosts()`; category chips linking to `/posts?category=tech` etc.

- [ ] **Step 3: Posts** — full list; read `useSearchParams` for `category`; use `filterByCategory` when set.

- [ ] **Step 4: Visual check in browser**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: home and posts list with cards"
```

---

### Task 7: Post detail + MDX render + reading progress + related

**Files:**
- Create: `src/components/post/PostHeader.tsx`, `ReadingProgress.tsx`, `RelatedPosts.tsx`
- Modify: `src/pages/PostDetail.tsx`

**Interfaces:**
- ReadingProgress: listens to scroll on `document`, computes progress over article element ref
- RelatedPosts: `posts: PostMeta[]` display

- [ ] **Step 1: PostDetail loads `getPostBySlug`; if missing → navigate to NotFound or render NotFound**

- [ ] **Step 2: Render**

```tsx
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from '@/components/mdx/mdxComponents'

// ...
<article ref={articleRef} className="prose-blog">
  <PostHeader post={post} />
  <MDXProvider components={mdxComponents}>
    <post.Component />
  </MDXProvider>
</article>
<RelatedPosts posts={getRelatedPosts(getPublishedPosts(), post)} />
```

- [ ] **Step 3: ReadingProgress fixed top bar using article ref height/scroll**

- [ ] **Step 4: Style article typography in CSS (`.prose-blog` for h1–h3, p, pre, a, blockquote)**

- [ ] **Step 5: Verify sample post with Callout and code highlights**

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: post detail with MDX, progress, related"
```

---

### Task 8: Tags, Archive, Search, About, 404

**Files:**
- Modify: `src/pages/Tags.tsx`, `TagDetail.tsx`, `Archive.tsx`, `Search.tsx`, `About.tsx`, `NotFound.tsx`
- Create: `src/components/ui/SearchInput.tsx`, `EmptyState.tsx`

- [ ] **Step 1: Tags** — `getAllTags(getPublishedPosts())`; links to `/tags/:tag` (encodeURIComponent).

- [ ] **Step 2: TagDetail** — decode param; `filterByTag`; EmptyState if none.

- [ ] **Step 3: Archive** — `groupByArchive(getPublishedPosts())`; nested year/month headings + links.

- [ ] **Step 4: Search** — controlled input syncing `?q=`; `searchPosts` on published metas; EmptyState when no hits.

- [ ] **Step 5: About** — author bio from `site`, social links, short static story (inline JSX is fine).

- [ ] **Step 6: NotFound** — message + link home.

- [ ] **Step 7: Commit**

```bash
git commit -am "feat: tags archive search about 404"
```

---

### Task 9: SEO (Helmet) + Giscus

**Files:**
- Create: `src/components/seo/Seo.tsx`, `src/components/post/GiscusComments.tsx`
- Modify: pages to use `<Seo title description />`; PostDetail mounts Giscus

- [ ] **Step 1: Seo component**

```tsx
import { Helmet } from 'react-helmet-async'
import { site } from '@/config/site'

export function Seo({ title, description, path = '' }: { title?: string; description?: string; path?: string }) {
  const fullTitle = title ? `${title} · ${site.name}` : site.title
  const desc = description ?? site.description
  const url = `${site.url}${path}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
```

- [ ] **Step 2: GiscusComments**

If `!site.giscus.repo`, render muted placeholder “Comments coming soon.”  
Else load `@giscus/react` (add dependency) with props from `site.giscus` and theme from `getTheme()`.

```bash
npm install @giscus/react
```

- [ ] **Step 3: Mount under post article; add Seo on every page**

- [ ] **Step 4: Commit**

```bash
git commit -am "feat: SEO helmet and Giscus placeholder"
```

---

### Task 10: RSS build step

**Files:**
- Create: `scripts/generate-rss.mjs` (or `.ts` run via `tsx`)
- Modify: `package.json` scripts: `"build": "tsc -b && vite build && node scripts/generate-rss.mjs"`

**Interfaces:**
- Reads `content/posts/*.mdx` frontmatter with a simple regex or `gray-matter` in Node
- Writes `dist/rss.xml`

- [ ] **Step 1: Install gray-matter if needed for Node script**

```bash
npm install -D gray-matter
```

- [ ] **Step 2: Implement generator**

- Parse all non-draft posts.
- Sort by date desc.
- Emit valid RSS 2.0 with `site.url`, `site.title`, `site.description`.
- Item link: `${site.url}/posts/${slug}`.

- [ ] **Step 3: Wire into build script; run build; confirm `dist/rss.xml` exists**

- [ ] **Step 4: Commit**

```bash
git commit -am "feat: generate rss.xml on build"
```

---

### Task 11: Visual polish + a11y pass

**Files:**
- Modify: `src/styles/index.css`, layout/components as needed
- Create: `public/favicon.svg` (simple monogram)

- [ ] **Step 1: Typography** — Fraunces for display headings, DM Sans for UI/body; article measure ~68ch.

- [ ] **Step 2: Motion** — CSS only: fade-in on cards (`@keyframes`), progress bar transition, focus-visible rings on links/buttons.

- [ ] **Step 3: Mobile nav** — collapsible menu under `md` breakpoint.

- [ ] **Step 4: Contrast check** — muted text still readable on dark bg; light theme tokens balanced.

- [ ] **Step 5: Commit**

```bash
git commit -am "style: premium dark polish and a11y basics"
```

---

### Task 12: Final verification

**Files:** none new

- [ ] **Step 1: Run unit tests**

```bash
npx vitest run
```

Expected: all pass.

- [ ] **Step 2: Production build**

```bash
npm run build
npm run preview
```

- [ ] **Step 3: Manual checklist**

- [ ] Home shows 3 sample posts  
- [ ] Post detail MDX + Callout + code highlight  
- [ ] Reading progress moves  
- [ ] Related posts appear  
- [ ] Tags / archive / search work  
- [ ] Theme toggle persists after reload  
- [ ] `dist/rss.xml` present  
- [ ] Giscus shows placeholder  
- [ ] Unknown route → 404  
- [ ] Mobile nav usable  

- [ ] **Step 4: Final commit if polish fixes**

```bash
git commit -am "chore: final verification fixes"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Vite + React + Router + Tailwind | 1 |
| MDX content pipeline | 4 |
| Home / posts / detail | 6–7 |
| Tags + archive + search + about | 8 |
| Theme dark default + toggle | 2, 5, 11 |
| Reading progress | 7 |
| Related posts | 3, 7 |
| RSS | 10 |
| Giscus + placeholder | 9 |
| SEO / OG | 9 |
| 404 | 8 |
| Draft filtering | 3, 4 |
| Premium dark visual | 1, 11 |
| Pure helpers tested | 3 |

## Self-review notes

- No TBD placeholders in task steps.
- Types `PostMeta`, `Post`, `Category` consistent across tasks.
- RSS uses Node-side parse so it does not depend on browser `import.meta.glob`.
- Giscus package added only in Task 9.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-17-personal-blog.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — implement in this session with executing-plans style checkpoints  

Which approach?
