import { useEffect, useRef, useState, type ChangeEvent, type CompositionEvent } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

/**
 * Controlled search field with IME-safe composition handling.
 *
 * Intermediate pinyin (etc.) stays in a local buffer; the parent only
 * receives committed text after composition ends, so React never rewrites
 * the input mid-IME and duplicates characters.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = '搜索文章…',
  autoFocus,
}: SearchInputProps) {
  const [inner, setInner] = useState(value)
  const composingRef = useRef(false)

  // Mirror external value, but never clobber an active IME session.
  useEffect(() => {
    if (!composingRef.current) {
      setInner(value)
    }
  }, [value])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setInner(next)
    if (!composingRef.current) {
      onChange(next)
    }
  }

  function handleCompositionStart() {
    composingRef.current = true
  }

  function handleCompositionEnd(e: CompositionEvent<HTMLInputElement>) {
    composingRef.current = false
    const next = e.currentTarget.value
    setInner(next)
    onChange(next)
  }

  return (
    <label className="block">
      <span className="sr-only">搜索</span>
      <input
        type="search"
        value={inner}
        autoFocus={autoFocus}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="search"
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all focus:border-[var(--color-accent)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-accent)_35%,transparent),0_0_24px_-8px_var(--color-glow)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
      />
    </label>
  )
}
