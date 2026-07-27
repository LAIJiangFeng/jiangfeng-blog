import type { ComponentType } from 'react'
import { DEFAULT_COVER } from '@/config/site'
import type { Category, PostMeta } from './posts'
import { isPublished, sortByDateDesc } from './posts'
import { countBodyChars } from './stats'

export interface Post extends PostMeta {
  Component: ComponentType
}

const modules = import.meta.glob('../../content/posts/*.mdx', { eager: true }) as Record<
  string,
  { default: ComponentType; frontmatter: Record<string, unknown> }
>

/**
 * Raw MDX source for word counts.
 * Prefer Vite `?raw` (string). If MDX plugin intercepts and returns a module,
 * countBodyChars/coerceRawSource still no-ops safely; we then fall back to
 * title+summary length so stats never crash.
 */
const rawModules = import.meta.glob('../../content/posts/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, unknown>

function pathToSlug(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.mdx$/, '')
}

/** Match compiled module path to raw glob key (query suffix may differ). */
function resolveRaw(path: string): unknown {
  if (path in rawModules) return rawModules[path]
  const base = path.split('?')[0]
  for (const [key, value] of Object.entries(rawModules)) {
    if (key.split('?')[0] === base) return value
  }
  return ''
}

function fallbackWordCount(fm: Record<string, unknown>): number {
  const title = typeof fm.title === 'string' ? fm.title : ''
  const summary = typeof fm.summary === 'string' ? fm.summary : ''
  return countBodyChars(`${title}\n${summary}`)
}

function parseMeta(slug: string, fm: Record<string, unknown>, wordCount: number): PostMeta {
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
    cover: typeof fm.cover === 'string' && fm.cover.trim() ? fm.cover : DEFAULT_COVER,
    draft: Boolean(fm.draft),
    wordCount,
  }
}

export function getAllPosts(): Post[] {
  const posts: Post[] = Object.entries(modules).map(([path, mod]) => {
    const slug = pathToSlug(path)
    const fm = mod.frontmatter ?? {}
    const fromRaw = countBodyChars(resolveRaw(path))
    const wordCount = fromRaw > 0 ? fromRaw : fallbackWordCount(fm)
    const meta = parseMeta(slug, fm, wordCount)
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
