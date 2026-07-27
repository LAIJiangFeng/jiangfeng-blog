import { cn } from '@/lib/utils'

export interface AiLoaderProps {
  /** Letters rendered with staggered bounce (default: Generating) */
  text?: string
  className?: string
  /** Extra class on the rotating orb */
  loaderClassName?: string
}

/**
 * Animated “Generating” AI-style loader: letter bounce + inset-glow orb.
 * Pure presentational — no progress logic.
 */
export function AiLoader({
  text = 'Generating',
  className,
  loaderClassName,
}: AiLoaderProps) {
  const letters = Array.from(text)

  return (
    <div className={cn('ai-loader', className)} role="status" aria-label={text}>
      <div className="loader-wrapper">
        {letters.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className="loader-letter"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
        <div className={cn('loader', loaderClassName)} aria-hidden />
      </div>
    </div>
  )
}

/** Alias matching the original component export name from the source snippet. */
export const Component = AiLoader
