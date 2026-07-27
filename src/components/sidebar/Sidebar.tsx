import { getPublishedPosts } from '@/lib/loadPosts'
import { getAllTags } from '@/lib/posts'
import { computeSiteStats, getCategoryStats } from '@/lib/stats'
import { site } from '@/config/site'
import { ProfileCard } from './ProfileCard'
import { CategoryList } from './CategoryList'
import { TagCloud } from './TagCloud'
import { SiteStats } from './SiteStats'

/** Sticky info column: profile, categories, tags, stats. */
export function Sidebar() {
  const posts = getPublishedPosts()
  const categories = getCategoryStats(posts)
  const tags = getAllTags(posts)
  const stats = computeSiteStats(posts, site.siteCreatedAt)

  return (
    <div className="sidebar flex flex-col gap-3.5">
      <ProfileCard />
      <CategoryList items={categories} />
      <TagCloud tags={tags} limit={12} />
      <SiteStats stats={stats} />
    </div>
  )
}
