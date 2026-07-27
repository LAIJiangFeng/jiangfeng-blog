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
  /** Plain-text character count of body (no frontmatter) */
  wordCount?: number
}

export function isPublished(post: PostMeta, isDev: boolean): boolean {
  return !post.draft || isDev
}

export function sortByDateDesc(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function filterByTag(posts: PostMeta[], tag: string): PostMeta[] {
  const needle = tag.toLowerCase()
  return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === needle))
}

export function filterByCategory(posts: PostMeta[], category: Category): PostMeta[] {
  return posts.filter((p) => p.category === category)
}

export function groupByArchive(
  posts: PostMeta[],
): { year: string; months: { month: string; posts: PostMeta[] }[] }[] {
  const byYear = new Map<string, Map<string, PostMeta[]>>()

  for (const post of posts) {
    const year = post.date.slice(0, 4)
    const month = post.date.slice(0, 7) // YYYY-MM
    if (!byYear.has(year)) byYear.set(year, new Map())
    const months = byYear.get(year)!
    if (!months.has(month)) months.set(month, [])
    months.get(month)!.push(post)
  }

  const years = [...byYear.keys()].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))

  return years.map((year) => {
    const monthMap = byYear.get(year)!
    const months = [...monthMap.keys()]
      .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
      .map((month) => ({
        month,
        posts: sortByDateDesc(monthMap.get(month)!),
      }))
    return { year, months }
  })
}

export function searchPosts(posts: PostMeta[], query: string): PostMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  )
}

export function getRelatedPosts(
  posts: PostMeta[],
  current: PostMeta,
  limit = 3,
): PostMeta[] {
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()))

  return posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const shared = p.tags.filter((t) => currentTags.has(t.toLowerCase())).length
      return { post: p, shared }
    })
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared
      const aSame = a.post.category === current.category ? 1 : 0
      const bSame = b.post.category === current.category ? 1 : 0
      if (bSame !== aSame) return bSame - aSame
      return a.post.date < b.post.date ? 1 : a.post.date > b.post.date ? -1 : 0
    })
    .slice(0, limit)
    .map(({ post }) => post)
}

export function getAllTags(posts: PostMeta[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0
    })
}
