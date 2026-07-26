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
