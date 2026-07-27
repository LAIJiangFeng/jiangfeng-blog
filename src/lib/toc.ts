export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base || 'section'
}

/** Ensure every h2/h3 in root has a unique id; return TOC items. */
export function collectHeadings(root: HTMLElement): TocItem[] {
  const nodes = root.querySelectorAll('h2, h3')
  const used = new Map<string, number>()
  const items: TocItem[] = []

  nodes.forEach((el) => {
    if (!(el instanceof HTMLHeadingElement)) return
    const level = el.tagName === 'H2' ? 2 : 3
    const text = (el.textContent ?? '').trim()
    if (!text) return

    let id = el.id || slugify(text)
    const n = used.get(id) ?? 0
    used.set(id, n + 1)
    if (n > 0) id = `${id}-${n}`
    if (el.id !== id) el.id = id

    items.push({ id, text, level })
  })

  return items
}
