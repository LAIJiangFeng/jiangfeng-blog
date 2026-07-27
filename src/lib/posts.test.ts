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
