import { Link } from 'react-router-dom'
import { getPublishedPosts } from '@/lib/loadPosts'
import { getProjects } from '@/data/projects'
import { EmptyState } from '@/components/ui/EmptyState'
import { HorizontalRail } from './HorizontalRail'
import { PostGlassCard, ProjectGlassCard } from './GlassMediaCard'

const HOME_RAIL_LIMIT = 6

function MoreArrow() {
  return (
    <svg
      className="section-more__arrow"
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      aria-hidden
    >
      {/* path centered on y=8 for even visual balance next to CJK */}
      <path
        d="M5.75 3.25 11 8 5.75 12.75"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SectionHead({
  title,
  moreTo,
  moreLabel,
}: {
  title: string
  moreTo: string
  moreLabel: string
}) {
  return (
    <div className="home-section-head">
      <h2 className="home-section-title">{title}</h2>
      <Link to={moreTo} className="section-more">
        <span className="section-more__label">{moreLabel}</span>
        <MoreArrow />
      </Link>
    </div>
  )
}

export function HomeFeed() {
  const posts = getPublishedPosts().slice(0, HOME_RAIL_LIMIT)
  const projects = getProjects().slice(0, HOME_RAIL_LIMIT)

  return (
    <div className="home-feed space-y-12 sm:space-y-14">
      <section className="space-y-5">
        <SectionHead title="近期博客" moreTo="/posts" moreLabel="查看所有" />
        {posts.length === 0 ? (
          <EmptyState compact variant="posts" title="暂无文章" />
        ) : (
          <HorizontalRail itemCount={posts.length} label="近期博客" perView={3}>
            {posts.map((post) => (
              <div key={post.slug} data-rail-item className="h-rail__item">
                <PostGlassCard post={post} />
              </div>
            ))}
          </HorizontalRail>
        )}
      </section>

      <section className="space-y-5">
        <SectionHead title="近期作品" moreTo="/projects" moreLabel="查看所有" />
        {projects.length === 0 ? (
          <EmptyState compact variant="projects" title="暂无项目" />
        ) : (
          <HorizontalRail itemCount={projects.length} label="近期作品" perView={3}>
            {projects.map((project) => (
              <div key={project.slug} data-rail-item className="h-rail__item">
                <ProjectGlassCard project={project} />
              </div>
            ))}
          </HorizontalRail>
        )}
      </section>
    </div>
  )
}
