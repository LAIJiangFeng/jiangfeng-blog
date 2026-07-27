import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Seo } from '@/components/seo/Seo'
import { OrbHero } from '@/components/home/OrbHero'
import { MarqueeBar } from '@/components/home/MarqueeBar'
import { HomeFeed } from '@/components/home/HomeFeed'
import { useHomeScroll } from '@/hooks/useHomeScroll'

export function Home() {
  const { scrolled } = useHomeScroll(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mark route so CSS vars can target the home underlay
  useEffect(() => {
    document.documentElement.classList.add('home-route')
    return () => document.documentElement.classList.remove('home-route')
  }, [])

  const orbLayer = (
    <div
      className={['home-orb-layer', scrolled ? 'is-scrolled' : ''].filter(Boolean).join(' ')}
      aria-hidden={false}
    >
      {/* hideCtas: only buttons fade on scroll — orb + title stay */}
      <OrbHero hideCtas={scrolled} />
    </div>
  )

  return (
    <div className={['home-page', scrolled ? 'home-page--scrolled' : ''].filter(Boolean).join(' ')}>
      <Seo path="/" />
      {/*
        Portal to body so the fixed orb sits under the frosted sheet, not trapped
        inside Shell's z-10 stacking context (which made the glass look solid).
      */}
      {mounted ? createPortal(orbLayer, document.body) : null}
      {/* Document-flow stand-in matching hero height */}
      <div className="home-orb-spacer" aria-hidden />
      {/* Frosted sheet that slides over the orb */}
      <div className="home-content-layer">
        <MarqueeBar />
        <div className="home-feed-wrap w-full max-w-full pb-2 pt-6 sm:pt-10 md:pt-12">
          <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <HomeFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
