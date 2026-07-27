# Personal Blog Design Spec

**Date:** 2026-07-17  
**Status:** Draft for user review  
**Stack:** Vite + React + React Router + Tailwind CSS + MDX

## 1. Goal

Build a static personal blog as a pure frontend site: no backend, no login, no online editor. Content lives in local MDX files and is compiled at build time. Primary use is tech writing, with occasional life and thought pieces. Visual direction is dark, premium reading experience.

## 2. Scope

### In scope (v1)

| Area | Capability |
|------|------------|
| Pages | Home, all posts, post detail, tags (list + by tag), archive, about, search |
| Content | MDX posts with frontmatter; draft filtering |
| UX | Dark default theme + light toggle; reading progress on post pages |
| Discovery | Client-side search (title, summary, tags); tag filter; related posts |
| Social | RSS feed (`/rss.xml` generated at build); Giscus comments (config placeholder) |
| SEO | Per-page title/description via `react-helmet-async`; basic Open Graph on posts |
| Deploy | Static assets only (Vercel / GitHub Pages / any static host) |

### Out of scope (v1)

- Auth, admin, CMS, database
- Server-side APIs or SSR (SPA + static export only)
- i18n / multi-language routing
- Full-text server search, analytics product integration
- Interactive demos beyond a small set of MDX components

## 3. Architecture

### 3.1 Content pipeline (MDX)

```
content/posts/*.mdx
        │
        ▼
  Vite + @mdx-js/rollup (or equivalent)
  + gray-matter / remark-frontmatter for metadata
        │
        ▼
  src/lib/posts.ts  (import.meta.glob, typed PostMeta + component)
        │
        ▼
  Pages consume list/meta; detail page renders MDX default export
```

- Posts are discovered with `import.meta.glob('/content/posts/**/*.mdx', { eager: true })` (or lazy + React.lazy for code-splitting if bundle size warrants it).
- Frontmatter is parsed into a typed `PostMeta` object; the MDX module’s default export is the page body component.
- `draft: true` posts are excluded from production lists/RSS; optionally visible only in `import.meta.env.DEV`.

### 3.2 Frontmatter schema

```yaml
---
title: string          # required
date: YYYY-MM-DD       # required, publish date
updated: YYYY-MM-DD    # optional
summary: string        # required, used in cards and SEO
tags: string[]         # required, at least one recommended
category: tech | life | thoughts   # required
cover: string          # optional, public path under /public
draft: boolean         # optional, default false
---
```

Slug is derived from the filename (e.g. `hello-world.mdx` → `hello-world`), not from frontmatter, to avoid rename/routing drift.

### 3.3 Routing

| Path | Page | Behavior |
|------|------|----------|
| `/` | Home | Latest posts, featured strip optional, category chips, CTA to about/search |
| `/posts` | Post list | Paginated or infinite-friendly list; filter by category query |
| `/posts/:slug` | Post detail | MDX body, progress bar, tags, related posts, Giscus |
| `/tags` | Tag index | Tag cloud / list with counts |
| `/tags/:tag` | Tag posts | Posts containing that tag |
| `/archive` | Archive | Grouped by year → month |
| `/about` | About | Static content (MDX or React page) |
| `/search` | Search | Query string `?q=`; filters client-side index |
| `/rss.xml` | RSS | Static file emitted at build (plugin or `vite` generateBundle hook) |

404: catch-all route with branded empty state.

### 3.4 Project layout

```
content/
  posts/
    example-tech.mdx
    example-life.mdx
public/
  images/
  favicon.svg
src/
  components/
    layout/       # Shell, Header, Footer, MobileNav
    ui/           # PostCard, TagChip, ThemeToggle, SearchInput, EmptyState
    post/         # ReadingProgress, RelatedPosts, PostHeader, Giscus
    mdx/          # Callout, CodeBlock, MDXImage, MDXProvider map
  pages/          # route-level pages
  lib/
    posts.ts      # load, sort, filter, related, search index
    rss.ts        # feed builders used by build step
    theme.ts      # theme init / toggle helpers
  styles/
    index.css     # Tailwind + CSS variables (premium dark tokens)
  App.tsx
  main.tsx
docs/superpowers/specs/
  2026-07-17-personal-blog-design.md
```

### 3.5 MDX components (v1)

Injected via MDX provider so authors can write:

```mdx
<Callout type="info">Tip text</Callout>
```

| Component | Purpose |
|-----------|---------|
| `Callout` | `info` / `warning` / `tip` styled asides |
| `CodeBlock` | Syntax-highlighted fenced code (e.g. `rehype-pretty-code` or `shiki`) |
| `MDXImage` | Responsive image with alt required |

No arbitrary remote component loading. Only this allowlist.

## 4. Feature design

### 4.1 Lists and cards

- Card shows: title, date, summary, tags, category badge.
- Sort: `date` descending (then `updated` if needed for display only).
- Home: top N latest (e.g. 6) + link to `/posts`.

### 4.2 Search

- Build in-memory index from all published post meta at runtime (title, summary, tags, category).
- Simple case-insensitive substring match is enough for v1 (dozens of posts).
- URL sync: `/search?q=react` shareable.

### 4.3 Related posts

- On detail page: up to 3 posts sharing the most tags with current; fallback to same `category`, then latest.

### 4.4 Theme

- Default: dark premium.
- Toggle: `document.documentElement.classList` (`dark` / `light`) + `localStorage`.
- Tokens via CSS variables for backgrounds, borders, text, accent (muted gold or cool cyan—one accent only).

### 4.5 Reading progress

- Fixed top bar; width = scroll progress within article column only (not whole page chrome).

### 4.6 RSS

- Build-time generation of `dist/rss.xml` (and optionally copy to `public` for dev).
- Items: title, link, pubDate, description from summary, categories from tags.

### 4.7 Giscus

- Component reads config from `src/config/site.ts`:
  - `giscus.repo`, `repoId`, `category`, `categoryId`, `mapping: 'pathname'`
- If repo is empty, show a quiet “Comments coming soon” placeholder instead of loading the script.
- Theme prop follows site light/dark.

### 4.8 Site config

```ts
// src/config/site.ts
export const site = {
  name: string,
  title: string,
  description: string,
  url: string,           // canonical origin for RSS/OG
  author: { name, email?, url? },
  social: { github?, twitter?, ... },
  giscus: { ... },
}
```

User fills real identity before deploy; placeholders allowed in scaffold.

## 5. Visual design (dark premium)

- **Background:** near-black layers (`#0a0a0b`, elevated `#121214`), hairline borders, soft separation—not heavy glow.
- **Accent:** single restrained accent (muted gold **or** cool cyan); avoid purple gradients and generic “AI SaaS” look.
- **Typography:** distinctive display face for titles + highly readable body (serif or humanist for long-form). Load via `fontsource` or Google Fonts carefully (subset).
- **Motion:** page enter stagger, card hover lift/border, progress bar; prefer CSS; optional Motion later if needed.
- **Layout:** generous article measure (~65–72ch), asymmetric home hero acceptable; strong hierarchy over decoration.
- **Responsive:** mobile-first nav; readable type scale on small screens.

## 6. Technical choices

| Concern | Choice |
|---------|--------|
| Bundler | Vite |
| UI | React 18/19 |
| Routing | React Router 6/7 (data-less SPA routes fine) |
| Styling | Tailwind CSS v4 (or v3 if tooling simpler) + CSS variables |
| Content | MDX via official Vite MDX integration |
| Code highlight | Shiki or rehype-pretty-code |
| Head | react-helmet-async |
| Comments | Giscus |
| Deploy | Static `dist/` |

### Error handling

- Missing slug → 404 page.
- Malformed frontmatter → fail build with clear error (validate in `posts.ts` at load).
- Giscus misconfig → placeholder UI, never blank crash.

### Testing (lightweight v1)

- Unit: pure functions in `lib/posts.ts` (sort, filter, related, search).
- Manual: route smoke, theme toggle, one MDX with Callout + code fence.

## 7. Implementation phases (for planning)

1. Scaffold Vite React TS + Tailwind + Router + base layout/theme tokens.
2. MDX pipeline + sample posts + post list/detail.
3. Tags, archive, search, about, related posts.
4. Reading progress, theme toggle polish, RSS build step.
5. Giscus + SEO meta + 404 + responsive pass.
6. Visual polish (premium dark) + sample content pass.

## 8. Open inputs (user-provided later)

- Real site name, author bio, avatar, social URLs
- Canonical production URL
- Giscus repository IDs
- Optional cover images

Placeholders ship in v1 so the app runs without blocking on these.

## 9. Success criteria

- `npm run build` produces a fully static site including `rss.xml`.
- All listed routes work offline after load (except Giscus network).
- Adding a new `.mdx` under `content/posts/` is sufficient to publish a post.
- Dark theme is default and looks intentionally premium, not template-generic.
- Lighthouse-ish basics: readable contrast, no layout-breaking mobile nav.

## 10. Decisions log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting model | Pure static SPA | User chose option 1 (no backend) |
| Content | MDX | User chose approach B for embedded components |
| Stack | Vite + React Router + Tailwind | User explicit preference |
| Visual | Dark premium | User direction |
| Feature depth | Full v1 set | User chose complete tier |
| Slug source | Filename | Stable, simple |
| Search | Client substring | Enough for personal scale |
