import { describe, it, expect } from 'vitest'
import { withBase, routerBasename } from './asset'

describe('withBase', () => {
  it('keeps absolute http(s) URLs', () => {
    expect(withBase('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
    expect(withBase('http://example.com/x')).toBe('http://example.com/x')
  })

  it('keeps data and mailto URLs', () => {
    expect(withBase('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
    expect(withBase('mailto:a@b.com')).toBe('mailto:a@b.com')
  })

  it('prefixes root paths with Vite BASE_URL (default / in tests)', () => {
    expect(withBase('/logo.svg')).toBe('/logo.svg')
    expect(withBase('logo.svg')).toBe('/logo.svg')
  })
})

describe('routerBasename', () => {
  it('returns / when base is root', () => {
    expect(routerBasename()).toBe('/')
  })
})
