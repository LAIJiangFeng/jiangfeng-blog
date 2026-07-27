import { useEffect, useId, useRef, useState } from 'react'
import type { TocItem } from '@/lib/toc'
import { TableOfContents } from './TableOfContents'

export function TocFloatingButton({
  items,
  activeId,
  onNavigate,
}: {
  items: TocItem[]
  activeId: string | null
  onNavigate?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (items.length === 0) return null

  return (
    <>
      <button
        ref={openRef}
        type="button"
        className="toc-fab lg:hidden"
        aria-label="打开文章目录"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <ListIcon />
      </button>

      {open && (
        <div className="toc-sheet lg:hidden" role="presentation">
          <button
            type="button"
            className="toc-sheet__backdrop"
            aria-label="关闭目录"
            onClick={() => {
              setOpen(false)
              openRef.current?.focus()
            }}
          />
          <div
            id={panelId}
            className="toc-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-label="文章目录"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-[family-name:var(--font-display)] text-base tracking-tight">
                文章目录
              </p>
              <button
                ref={closeRef}
                type="button"
                className="icon-btn inline-flex size-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]"
                aria-label="关闭"
                onClick={() => {
                  setOpen(false)
                  openRef.current?.focus()
                }}
              >
                ×
              </button>
            </div>
            <TableOfContents
              items={items}
              activeId={activeId}
              onNavigate={(id) => {
                onNavigate?.(id)
                setOpen(false)
                openRef.current?.focus()
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
    </svg>
  )
}
