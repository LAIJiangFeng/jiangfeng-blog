import { describe, it, expect } from 'vitest'
import {
  countBodyChars,
  computeRunDays,
  computeLastActivity,
  computeSiteStats,
  getCategoryStats,
} from './stats'
import type { PostMeta } from './posts'

const sample: PostMeta[] = [
  {
    slug: 'a',
    title: 'A',
    date: '2026-07-10',
    summary: 's',
    tags: ['React', 'Vite'],
    category: 'tech',
    wordCount: 100,
  },
  {
    slug: 'b',
    title: 'B',
    date: '2026-07-05',
    updated: '2026-07-12',
    summary: 's',
    tags: ['life'],
    category: 'life',
    wordCount: 50,
  },
  {
    slug: 'c',
    title: 'C',
    date: '2026-06-01',
    summary: 's',
    tags: ['React'],
    category: 'tech',
    wordCount: 25,
  },
]

describe('stats', () => {
  it('strips frontmatter and counts body chars', () => {
    const raw = `---
title: x
---

你好 world
`
    // 你好(2) + world(5) = 7 after whitespace collapse
    expect(countBodyChars(raw)).toBe(7)
  })

  it('tolerates non-string raw imports', () => {
    expect(countBodyChars(undefined)).toBe(0)
    expect(countBodyChars({ default: 'ab cd' })).toBe(4)
    expect(countBodyChars({ default: () => null })).toBe(0)
  })

  it('computes run days inclusive from siteCreatedAt', () => {
    expect(computeRunDays('2026-07-01', new Date(2026, 6, 1))).toBe(1)
    expect(computeRunDays('2026-07-01', new Date(2026, 6, 21))).toBe(21)
  })

  it('computes last activity from date/updated', () => {
    const { days, label } = computeLastActivity(sample, new Date(2026, 6, 21))
    // latest is 2026-07-12 → 9 days before 2026-07-21
    expect(days).toBe(9)
    expect(label).toBe('9 天前')
  })

  it('labels last activity as 今天', () => {
    const { label } = computeLastActivity(
      [{ ...sample[0], date: '2026-07-21' }],
      new Date(2026, 6, 21),
    )
    expect(label).toBe('今天')
  })

  it('aggregates category stats in fixed order', () => {
    expect(getCategoryStats(sample)).toEqual([
      { category: 'tech', label: '技术', count: 2 },
      { category: 'life', label: '生活', count: 1 },
    ])
  })

  it('computes full site stats', () => {
    const stats = computeSiteStats(sample, '2026-07-01', new Date(2026, 6, 21))
    expect(stats.postCount).toBe(3)
    expect(stats.categoryCount).toBe(2)
    expect(stats.tagCount).toBe(3)
    expect(stats.wordCount).toBe(175)
    expect(stats.runDays).toBe(21)
    expect(stats.lastActivityLabel).toBe('9 天前')
  })
})
