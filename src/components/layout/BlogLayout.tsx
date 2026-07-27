import type { ReactNode } from 'react'

/** Full-width content shell for browse pages (no profile/category/tag sidebar). */
export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-layout mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div className="blog-layout__main min-w-0">{children}</div>
    </div>
  )
}
