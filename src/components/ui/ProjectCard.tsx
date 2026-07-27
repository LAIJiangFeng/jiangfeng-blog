import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import { statusLabel } from '@/data/projects'
import { DEFAULT_COVER, site } from '@/config/site'
import { CoverFill } from './CoverFill'

/** Same visual language as post browse cards: cover + title / summary / meta / tags */
export function ProjectCard({ project }: { project: Project }) {
  const author = site.author.englishName
  const cover = project.cover || DEFAULT_COVER

  const titleNode = project.external ? (
    <a href={project.href} target="_blank" rel="noreferrer">
      {project.title}
    </a>
  ) : (
    <Link to={project.href}>{project.title}</Link>
  )

  const media = project.external ? (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="post-browse-card__media-link"
      aria-label={project.title}
    >
      <CoverFill src={cover} />
    </a>
  ) : (
    <Link to={project.href} className="post-browse-card__media-link" aria-label={project.title}>
      <CoverFill src={cover} />
    </Link>
  )

  return (
    <article className="post-browse-card group">
      <div className="post-browse-card__media">{media}</div>
      <div className="post-browse-card__body">
        <h2 className="post-browse-card__title">{titleNode}</h2>
        <p className="post-browse-card__summary">{project.summary}</p>
        <div className="post-browse-card__meta">
          <span>{project.year}</span>
          <span className="post-browse-card__dot" aria-hidden>
            ·
          </span>
          <span>{author}</span>
          <span className="post-browse-card__dot" aria-hidden>
            ·
          </span>
          <span className="post-browse-card__cat">{statusLabel[project.status]}</span>
        </div>
        {project.tags.length > 0 && (
          <ul className="post-browse-card__tags">
            {project.tags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <span className="post-browse-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
