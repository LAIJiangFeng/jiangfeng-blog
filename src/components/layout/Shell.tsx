import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { TechAtmosphere } from './TechAtmosphere'
import { PageTransition } from '@/components/ui/PageTransition'
import { BackToTop } from '@/components/ui/BackToTop'
import { MusicEscapeListener, MusicPlayer } from '@/components/music/MusicPlayer'

/** Pages that manage their own max-width / padding. */
function usesSelfLayout(pathname: string): boolean {
  if (pathname === '/') return true
  // Full-bleed pages that manage their own padding/max-width
  if (pathname === '/posts' || pathname.startsWith('/posts/')) return true
  if (pathname === '/projects') return true
  if (pathname === '/archive' || pathname === '/search' || pathname === '/friends') return true
  return false
}

export function Shell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const selfLayout = usesSelfLayout(pathname)

  return (
    <div className="relative flex min-h-screen flex-col">
      <TechAtmosphere />
      {/*
        z-10 keeps chrome above the body-portaled home orb (z-0).
        Transparent so the frosted home sheet can blur the energy ball.
        Home: site-chrome is pointer-events:none so hero CTAs under it still click
        (header / footer / feed re-enable hits via CSS).
      */}
      <div className="site-chrome relative z-10 flex min-h-screen flex-col bg-transparent">
        <Header variant={isHome ? 'overlay' : 'default'} />
        <main
          className={[
            'mx-auto w-full max-w-full flex-1 bg-transparent',
            isHome
              /* No overflow-x-clip on home: keeps fixed underlay + glass compositing clean */
              ? 'max-w-none px-0 pb-0 pt-0'
              : selfLayout
                ? 'max-w-none overflow-x-clip px-0 py-6 sm:py-10'
                : 'max-w-5xl px-4 py-6 sm:py-10',
          ].join(' ')}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
      </div>
      <BackToTop />
      <MusicEscapeListener />
      <MusicPlayer />
    </div>
  )
}
