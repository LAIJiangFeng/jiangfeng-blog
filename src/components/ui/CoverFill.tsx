import { SoftImage } from './SoftImage'

/**
 * Cover art stretched edge to edge inside an absolutely positioned frame.
 * Uses SoftImage skeleton while loading; `cover` fills the box on all browsers
 * (including iOS Safari) without letterboxing on the right.
 */
export function CoverFill({ src, className }: { src: string; className?: string }) {
  return (
    <SoftImage
      src={src}
      alt=""
      fit="cover"
      className={['cover-fill', className].filter(Boolean).join(' ')}
      imgClassName="cover-fill__art"
      aria-hidden
    />
  )
}
