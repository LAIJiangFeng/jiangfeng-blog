import { describe, it, expect } from 'vitest'
import { buildAboutConnectLinks } from './aboutLinks'

const emptySocial = {
  github: '',
  csdn: '',
  telegram: '',
  wechat: '',
  google: '',
}

describe('buildAboutConnectLinks', () => {
  it('always includes RSS', () => {
    const links = buildAboutConnectLinks(emptySocial)
    expect(links.some((l) => l.key === 'rss' && l.href.endsWith('/rss.xml'))).toBe(true)
  })

  it('includes only configured social entries', () => {
    const links = buildAboutConnectLinks({
      ...emptySocial,
      github: 'https://github.com/example',
      csdn: 'https://blog.csdn.net/example',
      wechat: '/wechat-qr.jpg',
    })
    expect(links.map((l) => l.key)).toEqual(['github', 'csdn', 'wechat', 'rss'])
    expect(links.find((l) => l.key === 'github')?.external).toBe(true)
    expect(links.find((l) => l.key === 'wechat')?.external).toBeFalsy()
  })

  it('includes mailto when email provided', () => {
    const links = buildAboutConnectLinks(emptySocial, { email: 'hi@example.com' })
    expect(links.find((l) => l.key === 'email')?.href).toBe('mailto:hi@example.com')
  })
})
