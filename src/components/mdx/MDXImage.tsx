import type { ImgHTMLAttributes } from 'react'
import { withBase } from '@/lib/asset'

export interface MDXImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string
  src: string
}

export function MDXImage({ alt, src, className, ...rest }: MDXImageProps) {
  return (
    <img
      src={withBase(src)}
      alt={alt}
      loading="lazy"
      className={['max-w-full h-auto rounded-md', className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}
