import { Link } from 'react-router-dom'
import type { Category } from '@/lib/posts'

const labels: Record<Category, string> = {
  tech: '技术',
  life: '生活',
  thoughts: '随想',
}

export function CategoryBadge({
  category,
  asLink = true,
}: {
  category: Category
  asLink?: boolean
}) {
  const className =
    'chip-glow inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 min-h-[1.55rem] text-[11px] font-medium leading-none tracking-wider text-[var(--color-accent)]'

  if (asLink) {
    return (
      <Link to={`/posts?category=${category}`} className={className}>
        {labels[category]}
      </Link>
    )
  }

  return (
    <span className={`${className} border-[var(--color-accent)] shadow-[0_0_14px_-4px_var(--color-glow)]`}>
      {labels[category]}
    </span>
  )
}

export function categoryLabel(category: Category): string {
  return labels[category]
}
