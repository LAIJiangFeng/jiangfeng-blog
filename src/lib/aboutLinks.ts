export type AboutSocialInput = {
  github: string
  csdn: string
  telegram: string
  wechat: string
  google: string
}

export type AboutConnectLink = {
  key: string
  label: string
  href: string
  external?: boolean
  reloadDocument?: boolean
}

export function buildAboutConnectLinks(
  social: AboutSocialInput,
  options: { email?: string; authorUrl?: string } = {},
): AboutConnectLink[] {
  const links: AboutConnectLink[] = []

  if (social.github) {
    links.push({ key: 'github', label: 'GitHub', href: social.github, external: true })
  }
  if (social.csdn) {
    links.push({ key: 'csdn', label: 'CSDN 博客', href: social.csdn, external: true })
  }
  if (social.wechat) {
    links.push({ key: 'wechat', label: '微信二维码', href: social.wechat })
  }
  if (social.telegram) {
    links.push({ key: 'telegram', label: 'Telegram', href: social.telegram, external: true })
  }
  if (social.google) {
    links.push({ key: 'google', label: 'Google', href: social.google, external: true })
  }
  if (options.email) {
    links.push({ key: 'email', label: '邮箱', href: `mailto:${options.email}` })
  }
  if (options.authorUrl) {
    links.push({ key: 'site', label: '个人网站', href: options.authorUrl, external: true })
  }

  links.push({ key: 'rss', label: 'RSS 订阅', href: '/rss.xml', reloadDocument: true })
  return links
}
