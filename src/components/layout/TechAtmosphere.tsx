/**
 * Fixed ambient layer: soft grid, glow orbs, slow scanline.
 * Decorative only — pointer-events none, aria-hidden.
 */
export function TechAtmosphere() {
  return (
    <div className="tech-atmosphere" aria-hidden>
      <div className="tech-atmosphere__grid" />
      <div className="tech-atmosphere__orb tech-atmosphere__orb--a" />
      <div className="tech-atmosphere__orb tech-atmosphere__orb--b" />
      <div className="tech-atmosphere__orb tech-atmosphere__orb--c" />
      <div className="tech-atmosphere__scan" />
      <div className="tech-atmosphere__vignette" />
    </div>
  )
}
