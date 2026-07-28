import { useCallback, useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react'
import { withBase } from '@/lib/asset'

type Fit = 'cover' | 'fill' | 'contain'

export type SoftImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  /**
   * Visual fit inside the frame.
   * Default `fill` = stretch to box (may distort; never crops).
   */
  fit?: Fit
  /** Wrapper class (positioned box). */
  className?: string
  /** img element class. */
  imgClassName?: string
  /** Show shimmer skeleton until loaded. Default true. */
  skeleton?: boolean
}

/**
 * Image with shimmer skeleton while loading — avoids empty frames on slow mobile networks.
 * Paths under /public are passed through `withBase` for GitHub Pages subpaths.
 */
export function SoftImage({
  src,
  alt = '',
  fit = 'fill',
  className,
  imgClassName,
  skeleton = true,
  onLoad,
  onError,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: SoftImageProps) {
  const resolved = withBase(src)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    setStatus('loading')
  }, [resolved])

  const markReady = useCallback(() => {
    setStatus((s) => (s === 'error' ? s : 'ready'))
  }, [])

  /** Catch cache hits where onLoad may not fire after hydration. */
  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (!node) return
      if (node.complete && node.naturalWidth > 0) markReady()
    },
    [markReady, resolved],
  )

  function handleLoad(e: SyntheticEvent<HTMLImageElement>) {
    markReady()
    onLoad?.(e)
  }

  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    setStatus('error')
    onError?.(e)
  }

  return (
    <span
      className={['soft-image', status === 'ready' ? 'is-ready' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-status={status}
    >
      {skeleton && status === 'loading' ? (
        <span className="soft-image__skeleton" aria-hidden />
      ) : null}
      {status !== 'error' ? (
        <img
          {...rest}
          ref={imgRef}
          src={resolved}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={['soft-image__img', `soft-image__img--${fit}`, imgClassName]
            .filter(Boolean)
            .join(' ')}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : null}
    </span>
  )
}
