import type { ChangeEvent } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  placeholder = '搜索文章…',
  autoFocus,
}: SearchInputProps) {
  return (
    <label className="block">
      <span className="sr-only">搜索</span>
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all focus:border-[var(--color-accent)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-accent)_35%,transparent),0_0_24px_-8px_var(--color-glow)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
      />
    </label>
  )
}
