import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const postsDir = path.join(root, 'content', 'posts')
const distDir = path.join(root, 'dist')

// 与 src/config/site.ts 保持同步
const site = {
  name: 'Jiangfeng Blog',
  title: 'Jiangfeng Blog — 个人博客',
  description: '技术笔记、生活碎片，以及一些安静的思考。',
  url: 'https://example.com',
  author: { name: '江枫' },
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function loadPosts() {
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))
  const posts = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
    const { data } = matter(raw)
    if (data.draft) continue
    if (!data.title || !data.date || !data.summary) continue

    const slug = file.replace(/\.mdx$/, '')
    posts.push({
      slug,
      title: String(data.title),
      date: String(data.date),
      summary: String(data.summary),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    })
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function buildRss(posts) {
  const base = site.url.replace(/\/$/, '')
  const items = posts
    .map((post) => {
      const link = `${base}/posts/${post.slug}`
      const cats = post.tags
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join('\n')
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(post.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
${cats}
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>grok-blob</generator>
${items}
  </channel>
</rss>
`
}

const posts = loadPosts()
const xml = buildRss(posts)

// dist: production build output
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}
const distPath = path.join(distDir, 'rss.xml')
fs.writeFileSync(distPath, xml, 'utf8')
console.log(`已写入 ${distPath}（${posts.length} 篇文章）`)

// public: so Vite dev server serves /rss.xml (avoids footer 404 in dev)
const publicDir = path.join(root, 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}
const publicPath = path.join(publicDir, 'rss.xml')
fs.writeFileSync(publicPath, xml, 'utf8')
console.log(`已写入 ${publicPath}`)
