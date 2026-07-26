import { site } from '@/config/site'
import { Seo } from '@/components/seo/Seo'
import { getAboutContent } from '@/data/about'
import { buildAboutConnectLinks } from '@/lib/aboutLinks'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutStory } from '@/components/about/AboutStory'
import { AboutTimeline } from '@/components/about/AboutTimeline'
import { AboutSkills } from '@/components/about/AboutSkills'
import { AboutConnect } from '@/components/about/AboutConnect'

export function About() {
  const content = getAboutContent()
  const links = buildAboutConnectLinks(site.social, {
    email: site.author.email || undefined,
    authorUrl: site.author.url || undefined,
  })

  return (
    <div className="about-page">
      <Seo title="关于" description={`关于 ${site.author.name}。${content.tagline}`} path="/about" />
      <AboutHero tagline={content.tagline} badges={content.badges} socialLinks={links} />
      <AboutStory story={content.story} now={content.now} />
      <AboutTimeline items={content.timeline} />
      <AboutSkills groups={content.skills} />
      <AboutConnect links={links} />
    </div>
  )
}
