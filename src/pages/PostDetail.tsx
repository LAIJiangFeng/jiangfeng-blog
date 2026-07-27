import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { getPostBySlug, getPublishedPosts } from '@/lib/loadPosts'
import { getRelatedPosts } from '@/lib/posts'
import { mdxComponents } from '@/components/mdx/mdxComponents'
import { PostHeader } from '@/components/post/PostHeader'
import { PostAuthorCard } from '@/components/post/PostAuthorCard'
import { ReadingProgress } from '@/components/post/ReadingProgress'
import { RelatedPosts } from '@/components/post/RelatedPosts'
import { GiscusComments } from '@/components/post/GiscusComments'
import { ReadingLayout } from '@/components/layout/ReadingLayout'
import { Seo } from '@/components/seo/Seo'
import { NotFound } from '@/pages/NotFound'

export function PostDetail() {
  const { slug = '' } = useParams()
  const post = getPostBySlug(slug)
  const articleRef = useRef<HTMLElement>(null)

  if (!post) {
    return <NotFound />
  }

  const allPosts = getPublishedPosts()
  const related = getRelatedPosts(allPosts, post)

  return (
    <>
      <Seo
        title={post.title}
        description={post.summary}
        path={`/posts/${post.slug}`}
        type="article"
      />
      <ReadingLayout
        articleRef={articleRef}
        below={
          <>
            <RelatedPosts posts={related} />
            <GiscusComments />
          </>
        }
      >
        {/* Page-level progress: one bar pinned under the header */}
        <ReadingProgress articleRef={articleRef} />
        <div className="reading-article">
          <Link to="/posts" className="reading-article__back">
            <span className="reading-article__back-icon" aria-hidden>
              ‹
            </span>
            全部文章
          </Link>
          <article ref={articleRef} className="prose-blog prose-blog--article">
            <PostHeader post={post} />
            <div className="prose-blog__body">
              <MDXProvider components={mdxComponents}>
                <post.Component />
              </MDXProvider>
            </div>
          </article>
          {/* Sits in the article column so it shares the body's measure */}
          <PostAuthorCard />
        </div>
      </ReadingLayout>
    </>
  )
}
