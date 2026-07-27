/**
 * Prefix a site-root path with Vite `base` (e.g. `/jiangfeng-blog/` on GitHub Pages).
 * Leaves absolute http(s)/data/mailto URLs unchanged.
 */
export function withBase(path: string): string {
  if (!path) return path
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path

  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.startsWith('/') ? path.slice(1) : path

  if (base === '/') return `/${normalized}`
  const baseNoSlash = base.endsWith('/') ? base.slice(0, -1) : base
  if (path === baseNoSlash || path.startsWith(`${baseNoSlash}/`)) return path
  return `${baseNoSlash}/${normalized}`
}

/** React Router basename — no trailing slash (except root). */
export function routerBasename(): string {
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return '/'
  return base.endsWith('/') ? base.slice(0, -1) : base
}
