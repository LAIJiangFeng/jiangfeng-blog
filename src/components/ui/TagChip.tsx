import { Link } from 'react-router-dom'

/** Tag chip — links into article list filter (`/posts?tag=`), not a standalone tags page. */
export function TagChip({
  tag,
  asLink = true,
}: {
  tag: string
  asLink?: boolean
}) {
  const className = 'tag-chip chip-glow'

  if (asLink) {
    return (
      <Link to={`/posts?tag=${encodeURIComponent(tag)}`} className={className}>
        <span className="tag-chip__hash" aria-hidden>
          #
        </span>
        <span className="tag-chip__label">{tag}</span>
      </Link>
    )
  }

  return (
    <span className={className}>
      <span className="tag-chip__hash" aria-hidden>
        #
      </span>
      <span className="tag-chip__label">{tag}</span>
    </span>
  )
}
