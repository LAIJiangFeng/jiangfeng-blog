import { Link } from 'react-router-dom'
import { Seo } from '@/components/seo/Seo'

export function NotFound() {
  return (
    <div className="space-y-6 py-12 text-center">
      <Seo title="页面不存在" description="找不到该页面。" />
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">404</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
        页面不存在
      </h1>
      <p className="text-[var(--color-text-muted)]">
        链接可能写错了，或者这篇文章尚未发布。
      </p>
      <Link
        to="/"
        className="inline-block text-sm text-[var(--color-accent)] transition-colors hover:underline"
      >
        返回首页
      </Link>
    </div>
  )
}
