import { useState } from 'react'
import {
  friendSiteInfo,
  getFriends,
  resolveFriendAvatar,
  type FriendLink,
} from '@/data/friends'
import { Seo } from '@/components/seo/Seo'
import { EmptyState } from '@/components/ui/EmptyState'

function friendHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '')
  }
}

function FriendAvatar({
  friend,
  className = '',
  size = 'md',
}: {
  friend: FriendLink
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const src = resolveFriendAvatar(friend)
  const initial = friend.name.trim().charAt(0) || '?'

  return (
    <span
      className={`friend-avatar friend-avatar--${size} ${!loaded && !failed ? 'is-loading' : ''} ${className}`.trim()}
      aria-hidden
    >
      {!failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className={['friend-avatar__img', loaded ? 'is-ready' : ''].filter(Boolean).join(' ')}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="friend-avatar__fallback">{initial}</span>
      )}
    </span>
  )
}

/** Endless chip marquee */
function FriendMarquee({ friends }: { friends: FriendLink[] }) {
  if (friends.length === 0) return null
  const track = [...friends, ...friends]

  return (
    <div className="friend-marquee" aria-hidden>
      <div className="friend-marquee__fade friend-marquee__fade--left" />
      <div className="friend-marquee__fade friend-marquee__fade--right" />
      <div className="friend-marquee__track">
        {track.map((friend, i) => (
          <span key={`${friend.url}-${i}`} className="friend-marquee__chip">
            <FriendAvatar friend={friend} size="sm" />
            <span className="friend-marquee__name">{friend.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function FriendCard({ friend, index }: { friend: FriendLink; index: number }) {
  return (
    <a
      href={friend.url}
      target="_blank"
      rel="noreferrer"
      className="friend-card"
      style={{ ['--friend-i' as string]: index }}
    >
      <span className="friend-card__shine" aria-hidden />
      <span className="friend-card__breath" aria-hidden />

      <FriendAvatar friend={friend} size="md" className="friend-card__avatar" />

      <div className="friend-card__body">
        <div className="friend-card__title-row">
          <span className="friend-card__name">{friend.name}</span>
          <span className="friend-card__arrow" aria-hidden>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M7 17L17 7M17 7H9M17 7v8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        {friend.description && <p className="friend-card__desc">{friend.description}</p>}
        <div className="friend-card__meta">
          <span className="friend-card__host">{friendHost(friend.url)}</span>
          {friend.tags && friend.tags.length > 0 && (
            <ul className="friend-card__tags">
              {friend.tags.map((tag) => (
                <li key={tag}>
                  <span className="friend-card__tag">{tag}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </a>
  )
}

/** Full-width text strip — close to grid, no empty sides */
function ApplySection() {
  const host = friendSiteInfo.url.replace(/^https?:\/\//, '')

  return (
    <footer className="friend-glow" aria-label="互换友链">
      <div className="friend-glow__main">
        <span className="friend-glow__label">Exchange</span>
        <span className="friend-glow__title" data-text="欢迎互换友链">
          欢迎互换友链
        </span>
        <span className="friend-glow__rules">
          <span>可访问</span>
          <span className="friend-glow__dot" aria-hidden />
          <span>原创</span>
          <span className="friend-glow__dot" aria-hidden />
          <span>先挂本站</span>
        </span>
      </div>
      <a href={friendSiteInfo.url} target="_blank" rel="noreferrer" className="friend-glow__link">
        {friendSiteInfo.name}
        <span className="friend-glow__sep" aria-hidden>
          /
        </span>
        <span className="friend-glow__host">{host}</span>
      </a>
    </footer>
  )
}

export function Friends() {
  const list = getFriends()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <div className="friend-page space-y-7 pb-6">
        <Seo
          title="友链"
          description="一些常去的角落。欢迎互换链接。"
          path="/friends"
        />

        <header className="friend-page-header">
          <p className="friend-page-header__eyebrow">
            <span className="friend-page-header__pulse" aria-hidden />
            Friends Network
          </p>
          <h1 className="friend-page-header__title">友链</h1>
          <p className="friend-page-header__desc">
            互联网上的灯塔。技术、开源与安静的个人站点，欢迎互换链接。
          </p>
          {list.length > 0 && (
            <p className="friend-page-header__count">
              当前 <span>{list.length}</span> 位友人在线
            </p>
          )}
        </header>

        {list.length === 0 ? (
          <EmptyState variant="friends" title="暂无友链" />
        ) : (
          <>
            <FriendMarquee friends={list} />

            <section className="friend-grid-section" aria-label="全部友链">
              <div className="friend-grid-section__head">
                <h2 className="friend-grid-section__title">全部友人</h2>
                <p className="friend-grid-section__hint">点击卡片前往对方站点</p>
              </div>
              <ul className="friend-grid">
                {list.map((friend, i) => (
                  <li key={friend.url}>
                    <FriendCard friend={friend} index={i} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <ApplySection />
      </div>
    </div>
  )
}
