import { Helmet } from 'react-helmet-async'
import { site } from '@/config/site'

interface SeoProps {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
}

export function Seo({
  title,
  description,
  path = '',
  type = 'website',
}: SeoProps) {
  const fullTitle = title ? `${title} · ${site.name}` : site.title
  const desc = description ?? site.description
  const url = `${site.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="zh_CN" />
      <html lang="zh-CN" />
    </Helmet>
  )
}
