import { Link } from 'react-router-dom'
import {
  Archive,
  FileText,
  FolderOpen,
  Inbox,
  SearchX,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type EmptyStateVariant =
  | 'posts'
  | 'projects'
  | 'search'
  | 'friends'
  | 'archive'
  | 'generic'

interface EmptyStateProps {
  title: string
  description?: string
  variant?: EmptyStateVariant
  actionLabel?: string
  actionTo?: string
  compact?: boolean
  className?: string
}

const VARIANT_ICON: Record<EmptyStateVariant, LucideIcon> = {
  posts: FileText,
  projects: FolderOpen,
  search: SearchX,
  friends: Users,
  archive: Archive,
  generic: Inbox,
}

export function EmptyState({
  title,
  description,
  variant = 'generic',
  actionLabel,
  actionTo,
  compact = false,
  className = '',
}: EmptyStateProps) {
  const showAction = Boolean(actionLabel && actionTo)
  const Icon = VARIANT_ICON[variant]

  return (
    <div
      className={[
        'empty-state',
        compact ? 'empty-state--compact' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      <Icon
        className="empty-state__icon"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="empty-state__title">{title}</p>
      {description ? <p className="empty-state__desc">{description}</p> : null}
      {showAction ? (
        <Link to={actionTo!} className="empty-state__link">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
