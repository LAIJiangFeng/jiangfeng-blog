import { describe, it, expect } from 'vitest'
import { collectHeadings } from './toc'

describe('collectHeadings', () => {
  it('assigns ids and returns h2/h3 items', () => {
    const root = document.createElement('div')
    root.innerHTML = `
      <h1>Title</h1>
      <h2>First section</h2>
      <h3>Nested</h3>
      <h2>Second</h2>
    `
    const items = collectHeadings(root)
    expect(items).toEqual([
      { id: 'first-section', text: 'First section', level: 2 },
      { id: 'nested', text: 'Nested', level: 3 },
      { id: 'second', text: 'Second', level: 2 },
    ])
    expect(root.querySelector('h2')?.id).toBe('first-section')
  })

  it('dedupes ids', () => {
    const root = document.createElement('div')
    root.innerHTML = `<h2>Same</h2><h2>Same</h2>`
    const items = collectHeadings(root)
    expect(items.map((i) => i.id)).toEqual(['same', 'same-1'])
  })

  it('keeps existing unique ids', () => {
    const root = document.createElement('div')
    root.innerHTML = `<h2 id="custom">Hello</h2>`
    const items = collectHeadings(root)
    expect(items[0].id).toBe('custom')
  })
})
