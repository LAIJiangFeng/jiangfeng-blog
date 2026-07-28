import { Link } from 'react-router-dom'
import type { PostMeta } from '@/lib/posts'
import type { Project } from '@/data/projects'
import { statusLabel } from '@/data/projects'
import { DEFAULT_COVER, site } from '@/config/site'
import { SoftImage } from '@/components/ui/SoftImage'
import { categoryLabel } from '@/components/ui/CategoryBadge'

function formatCardDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${y}-${m}-${d}`
}

export function PostGlassCard({ post }: { post: PostMeta }) {
  const author = site.author.englishName
  return (
    <Link to={`/posts/${post.slug}`} className="glass-card group" aria-label={post.title}>
      <CardVisual cover={post.cover} />
      <div className="glass-card__panel">
        <h3 className="glass-card__title">{post.title}</h3>
        <p className="glass-card__summary">{post.summary}</p>
        <div className="glass-card__meta">
          <time dateTime={post.date}>{formatCardDate(post.date)}</time>
          <span className="glass-card__dot" aria-hidden>
            ·
          </span>
          <span>{author}</span>
          <span className="glass-card__dot" aria-hidden>
            ·
          </span>
          <span className="glass-card__accent">{categoryLabel(post.category)}</span>
        </div>
        {post.tags.length > 0 && (
          <ul className="glass-card__tags">
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <span className="glass-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}

export function ProjectGlassCard({ project }: { project: Project }) {
  const className = 'glass-card group'
  const body = (
    <>
      <CardVisual cover={project.cover} />
      <div className="glass-card__panel">
        <h3 className="glass-card__title">{project.title}</h3>
        <p className="glass-card__summary">{project.summary}</p>
        <div className="glass-card__meta">
          <span>{project.year}</span>
          <span className="glass-card__dot" aria-hidden>
            ·
          </span>
          <span className="glass-card__accent">{statusLabel[project.status]}</span>
        </div>
        {project.tags.length > 0 && (
          <ul className="glass-card__tags">
            {project.tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <span className="glass-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className={className} aria-label={project.title}>
        {body}
      </a>
    )
  }

  return (
    <Link to={project.href} className={className} aria-label={project.title}>
      {body}
    </Link>
  )
}

/**
 * The wash spans the whole card (art region *and* nameplate) so the frosted
 * panel always has something to blur; the sharp art keeps its own 16:9 band.
 */
function CardVisual({ cover }: { cover?: string }) {
  const src = cover || DEFAULT_COVER
  return (
    <>
      <span className="glass-card__wash" aria-hidden>
        {/* Blur wash can crop; only the sharp band must show the full stretched art */}
        <SoftImage src={src} alt="" fit="cover" skeleton={false} className="glass-card__wash-img" />
      </span>
      <span className="glass-card__visual" aria-hidden>
        <SoftImage
          src={src}
          alt=""
          fit="fill"
          className="glass-card__visual-img"
          imgClassName="glass-card__img"
        />
        <span className="glass-card__shade" />
      </span>
    </>
  )
}
