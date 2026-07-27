/** Format ISO date (YYYY-MM-DD) for Chinese UI. */
export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
  const d = new Date(iso + 'T00:00:00')
  if (style === 'long') {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatMonth(yyyyMm: string): string {
  const [y, m] = yyyyMm.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
  })
}
