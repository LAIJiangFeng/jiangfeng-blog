import { describe, it, expect } from 'vitest'
import { getAboutContent } from './about'

describe('about content', () => {
  it('returns approved tagline and timeline years', () => {
    const content = getAboutContent()
    expect(content.tagline).toBe('AI 爱好者 · 全栈 AI 开发')
    expect(content.timeline.map((t) => t.year)).toEqual(['2018', '2021', '2025', '2026'])
    expect(content.timeline.at(-1)?.current).toBe(true)
  })

  it('keeps story compact and has focus + skill tags', () => {
    const content = getAboutContent()
    expect(content.story.join('')).toMatch(/2018/)
    expect(content.story.join('').length).toBeLessThan(120)
    expect(content.now.items.length).toBeGreaterThanOrEqual(3)
    expect(content.now.items.some((item) => item.includes('政企数字化'))).toBe(true)
    expect(content.skillTags.length).toBeGreaterThanOrEqual(6)
    expect(content.badges.length).toBeGreaterThanOrEqual(2)
  })
})
