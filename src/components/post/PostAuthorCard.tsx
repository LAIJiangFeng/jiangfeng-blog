import { Link } from 'react-router-dom'
import { site } from '@/config/site'

/**
 * Author strip under the article body. Used to live in the right rail — moved
 * out so the rail can stay a single-purpose, always-pinned table of contents.
 */
export function PostAuthorCard() {
  const author = site.author
  const bio = author.bio || site.description

  return (
    <section className="post-author" aria-label="作者">
      {author.avatar ? (
        <img
          src={author.avatar}
          alt=""
          className="post-author__avatar"
          width={56}
          height={56}
        />
      ) : (
        <span className="post-author__avatar post-author__avatar--fallback" aria-hidden>
          {author.name.slice(0, 1)}
        </span>
      )}

      <div className="post-author__body">
        <p className="post-author__label">作者</p>
        <p className="post-author__name">
          {author.name}
          {author.englishName ? (
            <span className="post-author__en">{author.englishName}</span>
          ) : null}
        </p>
        <p className="post-author__bio">{bio}</p>
      </div>

      <div className="post-author__actions">
        {site.social.github ? (
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="post-author__pill"
          >
            GitHub
          </a>
        ) : null}
        <Link to="/about" className="post-author__pill post-author__pill--accent">
          关于我
        </Link>
      </div>
    </section>
  )
}
