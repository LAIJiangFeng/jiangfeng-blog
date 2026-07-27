import type { ReactNode } from 'react'

export type CalloutType = 'info' | 'warning' | 'tip'

export interface CalloutProps {
  type?: CalloutType
  children: ReactNode
}

const styles: Record<CalloutType, string> = {
  info: 'border-[var(--color-accent)]/50 bg-[var(--color-bg-elevated)]',
  warning: 'border-amber-600/60 bg-amber-950/20',
  tip: 'border-emerald-600/50 bg-emerald-950/15',
}

const labels: Record<CalloutType, string> = {
  info: '说明',
  warning: '注意',
  tip: '提示',
}

export function Callout({ type = 'info', children }: CalloutProps) {
  return (
    <aside
      className={`my-6 rounded-lg border-l-4 px-4 py-3 ${styles[type]}`}
      data-callout={type}
    >
      <p className="mb-1 text-xs font-semibold tracking-wide text-[var(--color-accent)]">
        {labels[type]}
      </p>
      <div className="text-[var(--color-text)] text-[0.95rem] leading-relaxed [&_p]:m-0">
        {children}
      </div>
    </aside>
  )
}
