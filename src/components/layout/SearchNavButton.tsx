import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavIcon } from './NavIcon'

export function SearchNavButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const panelId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [open])

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function submit(e?: FormEvent) {
    e?.preventDefault()
    const q = query.trim()
    if (!q) {
      inputRef.current?.focus()
      return
    }
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div ref={rootRef} className="search-nav relative">
      <button
        type="button"
        className={[
          'icon-btn inline-flex h-8 w-8 items-center justify-center rounded-md border sm:h-9 sm:w-9',
          className ??
            'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]',
        ].join(' ')}
        aria-label={open ? '关闭搜索' : '打开搜索'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <NavIcon name="search" className="h-4 w-4" />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="搜索文章"
          className="search-popover"
        >
          <form onSubmit={submit} className="search-popover__panel">
            <label className="sr-only" htmlFor={`${panelId}-input`}>
              搜索关键词
            </label>
            <div className="search-popover__row">
              <NavIcon name="search" className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
              <input
                id={`${panelId}-input`}
                ref={inputRef}
                type="search"
                value={query}
                placeholder="搜索标题、摘要、标签…"
                autoComplete="off"
                enterKeyHint="search"
                className="search-popover__input"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
              />
            </div>
            {/* Desktop: keyboard shortcuts; mobile has no Enter/Esc keys */}
            <p className="search-popover__hint search-popover__hint--desktop">
              按 Enter 查询 · Esc 关闭
            </p>
            <div className="search-popover__actions">
              <button
                type="button"
                className="search-popover__btn search-popover__btn--ghost"
                onClick={() => setOpen(false)}
              >
                关闭
              </button>
              <button type="submit" className="search-popover__btn search-popover__btn--primary">
                搜索
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
