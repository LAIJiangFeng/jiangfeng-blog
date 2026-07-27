import { useEffect, useRef, useState } from 'react'

interface TypewriterProps {
  text: string
  /** ms per character when typing (slower = more natural) */
  typeSpeed?: number
  /** ms per character when deleting */
  deleteSpeed?: number
  /** delay before first type starts */
  delay?: number
  /** pause after a line is fully typed, before delete (only if text will change) */
  holdMs?: number
  className?: string
  cursorClassName?: string
  /** called after current text is fully typed (not after delete) */
  onTyped?: () => void
  showCursor?: boolean
  /** keep cursor after this text is fully typed */
  cursorAfterDone?: boolean
  as?: 'span' | 'p' | 'h1' | 'h2'
}

type Phase = 'waiting' | 'typing' | 'holding' | 'deleting' | 'done'

/**
 * Keyboard-style typewriter. When `text` changes, deletes the previous
 * string character-by-character, then types the new one.
 */
export function Typewriter({
  text,
  typeSpeed = 110,
  deleteSpeed = 48,
  delay = 0,
  holdMs = 1600,
  className = '',
  cursorClassName = '',
  onTyped,
  showCursor = true,
  cursorAfterDone = true,
  as: Tag = 'span',
}: TypewriterProps) {
  const [display, setDisplay] = useState('')
  const [phase, setPhase] = useState<Phase>('waiting')

  const displayRef = useRef('')
  const targetRef = useRef(text)
  const phaseRef = useRef<Phase>('waiting')
  const timerRef = useRef<number | undefined>(undefined)
  const onTypedRef = useRef(onTyped)
  onTypedRef.current = onTyped

  useEffect(() => {
    displayRef.current = display
  }, [display])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setDisplay(text)
      displayRef.current = text
      setPhase('done')
      phaseRef.current = 'done'
      onTypedRef.current?.()
      return
    }

    const clearTimer = () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }

    const schedule = (fn: () => void, ms: number) => {
      clearTimer()
      timerRef.current = window.setTimeout(fn, ms)
    }

    const tickType = () => {
      const target = targetRef.current
      const current = displayRef.current
      if (current.length >= target.length) {
        setDisplay(target)
        displayRef.current = target
        setPhase('holding')
        phaseRef.current = 'holding'
        onTypedRef.current?.()
        return
      }
      const next = target.slice(0, current.length + 1)
      setDisplay(next)
      displayRef.current = next
      schedule(tickType, typeSpeed)
    }

    const tickDelete = () => {
      const current = displayRef.current
      if (current.length === 0) {
        // finished deleting — type the pending target
        setPhase('typing')
        phaseRef.current = 'typing'
        schedule(tickType, typeSpeed)
        return
      }
      const next = current.slice(0, -1)
      setDisplay(next)
      displayRef.current = next
      schedule(tickDelete, deleteSpeed)
    }

    // New target text arrived
    targetRef.current = text
    const current = displayRef.current

    if (current === text) {
      setPhase('done')
      phaseRef.current = 'done'
      return
    }

    clearTimer()

    if (current.length === 0) {
      // first paint or fully cleared — start typing (with optional delay)
      setPhase(delay > 0 ? 'waiting' : 'typing')
      phaseRef.current = delay > 0 ? 'waiting' : 'typing'
      schedule(
        () => {
          setPhase('typing')
          phaseRef.current = 'typing'
          tickType()
        },
        delay > 0 ? delay : typeSpeed,
      )
    } else {
      // have old text — delete first, then type
      setPhase('deleting')
      phaseRef.current = 'deleting'
      // brief hold so the full line is readable before delete starts
      schedule(tickDelete, holdMs)
    }

    return clearTimer
  }, [text, typeSpeed, deleteSpeed, delay, holdMs])

  const cursorVisible =
    showCursor &&
    phase !== 'waiting' &&
    (phase !== 'done' && phase !== 'holding' ? true : cursorAfterDone)

  return (
    <Tag className={className}>
      <span className="typewriter-text">{display}</span>
      {cursorVisible && (
        <span
          className={['typewriter-cursor', cursorClassName].filter(Boolean).join(' ')}
          aria-hidden
        >
          |
        </span>
      )}
      <span className="sr-only">{text}</span>
    </Tag>
  )
}
