import { useCallback, useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import { navLinks } from './navLinks'
import type { Category } from '@/lib/posts'
import { categoryLabel } from '@/components/ui/CategoryBadge'
import {
  IconCsdn,
  IconGitHub,
  IconRss,
  IconTelegram,
  IconWeChat,
  type FooterSocialItem,
} from './SocialIcons'

const categories: Category[] = ['tech', 'life', 'thoughts']

function isImagePath(href: string): boolean {
  return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(href) || href.startsWith('/wechat')
}

function buildFooterSocial(): FooterSocialItem[] {
  const items: FooterSocialItem[] = []

  if (site.social.github) {
    items.push({
      key: 'github',
      label: 'GitHub',
      href: site.social.github,
      external: true,
      icon: <IconGitHub />,
    })
  }
  if (site.social.csdn) {
    items.push({
      key: 'csdn',
      label: 'CSDN 博客',
      href: site.social.csdn,
      external: true,
      icon: <IconCsdn />,
    })
  }
  if (site.social.wechat) {
    items.push({
      key: 'wechat',
      label: '微信',
      href: site.social.wechat,
      icon: <IconWeChat />,
    })
  }
  if (site.social.telegram) {
    items.push({
      key: 'telegram',
      label: 'Telegram',
      href: site.social.telegram,
      external: true,
      icon: <IconTelegram />,
    })
  }

  // RSS: 订阅源 XML，供阅读器抓取新文章（构建时生成 /rss.xml）
  items.push({
    key: 'rss',
    label: 'RSS 订阅',
    href: '/rss.xml',
    reloadDocument: true,
    icon: <IconRss />,
  })

  return items
}

export function Footer() {
  const year = new Date().getFullYear()
  const social = buildFooterSocial()
  const [wechatOpen, setWechatOpen] = useState(false)
  const dialogTitleId = useId()

  const closeWechat = useCallback(() => setWechatOpen(false), [])

  useEffect(() => {
    if (!wechatOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWechat()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [wechatOpen, closeWechat])

  return (
    <footer className="site-footer mt-auto border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 md:py-14">
        <div className="footer-grid">
          {/* Brand — full width on mobile, left column on desktop */}
          <div className="footer-brand max-w-sm space-y-3 sm:space-y-4">
            <Link
              to="/"
              className="logo-mark inline-flex font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--color-text)]"
            >
              <img src="/logo.svg" alt="" className="logo-mark__img" width={28} height={28} decoding="async" />
              <span className="logo-mark__text">{site.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              {site.description}
            </p>
            <ul className="flex flex-wrap items-center gap-2 pt-0.5">
              {social.map((item) => {
                const isWechatQr = item.key === 'wechat' && isImagePath(item.href)

                if (isWechatQr) {
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        className="footer-social-icon"
                        title={item.label}
                        aria-label={`${item.label}二维码`}
                        onClick={() => setWechatOpen(true)}
                      >
                        {item.icon}
                      </button>
                    </li>
                  )
                }

                if (item.reloadDocument) {
                  return (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        className="footer-social-icon"
                        title={item.label}
                        aria-label={item.label}
                      >
                        {item.icon}
                      </a>
                    </li>
                  )
                }

                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="footer-social-icon"
                      title={item.label}
                      aria-label={item.label}
                    >
                      {item.icon}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Link columns: side-by-side from mobile (no tall empty stack) */}
          <div className="footer-link-cols">
            <div className="footer-col">
              <h3 className="footer-heading">导航</h3>
              <ul className="footer-link-list">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">分类</h3>
              <ul className="footer-link-list footer-link-list--chips">
                {categories.map((c) => (
                  <li key={c}>
                    <Link to={`/posts?category=${c}`} className="footer-chip">
                      {categoryLabel(c)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">更多</h3>
              <ul className="footer-link-list">
                <li>
                  <Link to="/archive" className="footer-link">
                    归档
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="footer-link">
                    搜索
                  </Link>
                </li>
                <li>
                  <a href="/rss.xml" className="footer-link">
                    RSS
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-muted)] sm:mt-12 sm:flex-row sm:items-center sm:pt-6">
          <p className="font-[family-name:var(--font-mono)] tracking-wide">
            © {year} {site.author.name}
            <span className="mx-2 text-[var(--color-accent)]/50">·</span>
            以阅读与记录为志
          </p>
          <p className="flex items-center gap-2 font-[family-name:var(--font-mono)] tracking-wider">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-glow)]" />
            {site.name}
          </p>
        </div>
      </div>

      {wechatOpen && site.social.wechat && (
        <div
          className="wechat-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          onClick={closeWechat}
        >
          <div
            className="wechat-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wechat-modal__head">
              <h2 id={dialogTitleId} className="wechat-modal__title">
                微信
              </h2>
              <button
                type="button"
                className="wechat-modal__close"
                onClick={closeWechat}
                aria-label="关闭"
              >
                ×
              </button>
            </div>
            <img
              src={site.social.wechat}
              alt="微信二维码 — 扫一扫添加好友"
              className="wechat-modal__qr"
              width={280}
              height={280}
            />
            <p className="wechat-modal__hint">扫一扫，添加我为朋友</p>
          </div>
        </div>
      )}
    </footer>
  )
}
