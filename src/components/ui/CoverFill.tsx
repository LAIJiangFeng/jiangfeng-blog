/**
 * Cover art stretched edge to edge.
 *
 * Source covers ship at mixed aspect ratios (1.41 – 1.78) while card frames are
 * fixed at 16:9. `contain` left bars beside the narrow ones and `cover` would
 * slice the poster text baked into them, so the frame is filled by distorting
 * instead: `object-fit: fill` (see .cover-fill__art). Nothing is cropped and
 * nothing is left unpainted — the 1.41 covers just render ~26% wider than shot.
 */
export function CoverFill({ src, className }: { src: string; className?: string }) {
  return (
    <span className={['cover-fill', className].filter(Boolean).join(' ')} aria-hidden>
      <img src={src} alt="" loading="lazy" className="cover-fill__art" />
    </span>
  )
}
