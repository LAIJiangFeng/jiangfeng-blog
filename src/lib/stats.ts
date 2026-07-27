import type { Category, PostMeta } from './posts'
import { getAllTags } from './posts'

const CATEGORY_LABELS: Record<Category, string> = {
  tech: '技术',
  life: '生活',
  thoughts: '随想',
}

export interface CategoryStat {
  category: Category
  label: string
  count: number
}

export interface SiteStatsData {
  postCount: number
  categoryCount: number
  tagCount: number
  wordCount: number
  runDays: number
  /** Days since last activity; 0 = today */
  lastActivityDays: number
  lastActivityLabel: string
}

const CATEGORY_ORDER: Category[] = ['tech', 'life', 'thoughts']

/** Normalize Vite glob/`?raw` import shapes to a plain string. */
export function coerceRawSource(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const mod = raw as { default?: unknown }
    if (typeof mod.default === 'string') return mod.default
  }
  return ''
}

/** Count characters in MDX/Markdown body after stripping frontmatter. */
export function countBodyChars(raw: unknown): number {
  const source = coerceRawSource(raw)
  if (!source) return 0
  const stripped = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  // Collapse whitespace for a stable-ish count; keep CJK as 1 char each
  return stripped.replace(/\s+/g, '').length
}

export function getCategoryStats(posts: PostMeta[]): CategoryStat[] {
  const counts = new Map<Category, number>()
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  }
  return CATEGORY_ORDER.filter((c) => (counts.get(c) ?? 0) > 0).map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    count: counts.get(category) ?? 0,
  }))
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function parseIsoDate(iso: string): Date {
  const [y, m, day] = iso.split('-').map(Number)
  return new Date(y, m - 1, day)
}

export function computeRunDays(siteCreatedAt: string, now: Date = new Date()): number {
  const start = startOfLocalDay(parseIsoDate(siteCreatedAt))
  const today = startOfLocalDay(now)
  const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000)
  return Math.max(1, diff + 1)
}

export function computeLastActivity(
  posts: PostMeta[],
  now: Date = new Date(),
): { days: number; label: string } {
  if (posts.length === 0) {
    return { days: 0, label: '暂无' }
  }
  let latest = ''
  for (const p of posts) {
    const d = p.updated && p.updated > p.date ? p.updated : p.date
    if (d > latest) latest = d
  }
  const last = startOfLocalDay(parseIsoDate(latest))
  const today = startOfLocalDay(now)
  const days = Math.max(0, Math.floor((today.getTime() - last.getTime()) / 86_400_000))
  if (days === 0) return { days: 0, label: '今天' }
  return { days, label: `${days} 天前` }
}

export function computeSiteStats(
  posts: PostMeta[],
  siteCreatedAt: string,
  now: Date = new Date(),
): SiteStatsData {
  const tags = getAllTags(posts)
  const categories = getCategoryStats(posts)
  const wordCount = posts.reduce((sum, p) => sum + (p.wordCount ?? 0), 0)
  const last = computeLastActivity(posts, now)

  return {
    postCount: posts.length,
    categoryCount: categories.length,
    tagCount: tags.length,
    wordCount,
    runDays: computeRunDays(siteCreatedAt, now),
    lastActivityDays: last.days,
    lastActivityLabel: last.label,
  }
}

export function formatWordCount(n: number): string {
  return n.toLocaleString('zh-CN')
}
