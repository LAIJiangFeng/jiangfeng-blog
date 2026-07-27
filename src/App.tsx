import { Navigate, Routes, Route, useParams } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Shell } from '@/components/layout/Shell'
import { Home } from '@/pages/Home'
import { Posts } from '@/pages/Posts'
import { PostDetail } from '@/pages/PostDetail'
import { Archive } from '@/pages/Archive'
import { Projects } from '@/pages/Projects'
import { About } from '@/pages/About'
import { Friends } from '@/pages/Friends'
import { Search } from '@/pages/Search'
import { NotFound } from '@/pages/NotFound'

/** Old /tags/:tag bookmarks → article list filtered by tag */
function RedirectTagToPosts() {
  const { tag: raw = '' } = useParams()
  const tag = decodeURIComponent(raw)
  const to = tag ? `/posts?tag=${encodeURIComponent(tag)}` : '/posts'
  return <Navigate to={to} replace />
}

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:slug" element={<PostDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="friends" element={<Friends />} />
          {/* Legacy tag routes — no standalone tag pages */}
          <Route path="tags" element={<Navigate to="/posts" replace />} />
          <Route path="tags/:tag" element={<RedirectTagToPosts />} />
          <Route path="archive" element={<Archive />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HelmetProvider>
  )
}
