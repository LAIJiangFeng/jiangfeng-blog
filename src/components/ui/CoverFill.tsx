import { SoftImage } from './SoftImage'

/**
 * Cover art stretched to the card frame (object-fit: fill).
 * Distortion is OK — full image visible, no side crop / letterbox.
 * SoftImage shows a shimmer skeleton while loading.
 */
export function CoverFill({ src, className }: { src: string; className?: string }) {
  return (
    <SoftImage
      src={src}
      alt=""
      fit="fill"
      className={['cover-fill', className].filter(Boolean).join(' ')}
      imgClassName="cover-fill__art"
      aria-hidden
    />
  )
}
