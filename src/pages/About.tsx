import { site } from '@/config/site'
import { Seo } from '@/components/seo/Seo'
import { getAboutContent } from '@/data/about'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutFocusCarousel } from '@/components/about/AboutFocusCarousel'
import { AboutTimeline } from '@/components/about/AboutTimeline'
import { AboutSkills } from '@/components/about/AboutSkills'

export function About() {
  const content = getAboutContent()

  return (
    <div className="about-page">
      <Seo title="关于" description={`关于 ${site.author.name}。${content.tagline}`} path="/about" />

      <div className="about-shell about-breath-surface">
        <div className="about-shell__glow" aria-hidden />
        <AboutHero tagline={content.tagline} badges={content.badges} story={content.story} />
        <AboutFocusCarousel title={content.now.title} items={content.now.items} />
        <AboutTimeline items={content.timeline} />
        <AboutSkills tags={content.skillTags} />
      </div>
    </div>
  )
}
