import { Link, useSearchParams } from 'react-router-dom'
import { Seo } from '@/components/seo/Seo'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { BlogLayout } from '@/components/layout/BlogLayout'
import {
  filterProjectsByStatus,
  getProjects,
  statusLabel,
  type ProjectStatus,
} from '@/data/projects'

const statuses: ProjectStatus[] = ['active', 'wip', 'shipped', 'completed']

function isStatus(value: string | null): value is ProjectStatus {
  return value === 'active' || value === 'wip' || value === 'shipped' || value === 'completed'
}

export function Projects() {
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  const status = isStatus(statusParam) ? statusParam : null

  const all = getProjects()
  const list = filterProjectsByStatus(all, status)

  return (
    <BlogLayout>
      <div className="posts-browse space-y-5">
        <Seo
          title={status ? `项目 · ${statusLabel[status]}` : '项目'}
          description="个人项目与实验合集。"
          path={status ? `/projects?status=${status}` : '/projects'}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/projects"
            className={[
              'chip-glow inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wider transition-colors',
              status === null
                ? 'border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_14px_-4px_var(--color-glow)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
            ].join(' ')}
          >
            全部
          </Link>
          {statuses.map((s) => {
            const active = status === s
            const className = [
              'chip-glow inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wider transition-colors',
              active
                ? 'border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-accent)] shadow-[0_0_14px_-4px_var(--color-glow)]'
                : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-accent)] hover:border-[var(--color-accent)]',
            ].join(' ')

            return active ? (
              <span key={s} className={className}>
                {statusLabel[s]}
              </span>
            ) : (
              <Link key={s} to={`/projects?status=${s}`} className={className}>
                {statusLabel[s]}
              </Link>
            )
          })}
        </div>

        {status && (
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--color-text-muted)]">
            共 {list.length} 个 · {statusLabel[status]}
          </p>
        )}

        {list.length === 0 ? (
          <EmptyState
            variant="projects"
            title={status ? `「${statusLabel[status]}」下暂无项目` : '暂无项目'}
            actionLabel={status ? '查看全部' : undefined}
            actionTo={status ? '/projects' : undefined}
          />
        ) : (
          <div className="posts-masonry">
            {list.map((project, i) => (
              <div
                key={project.slug}
                className="posts-masonry__item animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
