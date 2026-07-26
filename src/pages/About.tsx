import { site } from '@/config/site'
import { Seo } from '@/components/seo/Seo'
import { getAboutContent } from '@/data/about'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutStory } from '@/components/about/AboutStory'
import { AboutTimeline } from '@/components/about/AboutTimeline'
import { AboutSkills } from '@/components/about/AboutSkills'

export function About() {
  const content = getAboutContent()

  return (
    <div className="about-page">
      <Seo title="关于" description={`关于 ${site.author.name}。${content.tagline}`} path="/about" />
      <AboutHero tagline={content.tagline} badges={content.badges} />
      <AboutStory story={content.story} now={content.now} />
      <AboutTimeline items={content.timeline} />
      <AboutSkills groups={content.skills} />
    </div>
  )
}
