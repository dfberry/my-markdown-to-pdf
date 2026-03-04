import { describe, it, expect } from 'vitest'
import { headingNormalizePlugin } from '../plugins/heading-normalize'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

function parseHeadings(markdown: string) {
  const processor = unified().use(remarkParse).use(headingNormalizePlugin)
  return processor.runSync(processor.parse(markdown))
}

describe('headingNormalizePlugin', () => {
  it('preserves an existing H1', () => {
    const tree = parseHeadings('# My Name\n\n## Experience\n')
    const headings = (tree as any).children.filter((n: any) => n.type === 'heading')
    expect(headings[0].depth).toBe(1)
    expect(headings[1].depth).toBe(2)
  })

  it('promotes first heading to H1 when input starts at H2', () => {
    const tree = parseHeadings('## Experience\n\n### Company\n')
    const headings = (tree as any).children.filter((n: any) => n.type === 'heading')
    // first heading should be promoted from H2 → H1
    expect(headings[0].depth).toBe(1)
  })

  it('caps headings deeper than H3 to H3', () => {
    const tree = parseHeadings('# Name\n\n#### Deep Section\n\n##### Even Deeper\n')
    const headings = (tree as any).children.filter((n: any) => n.type === 'heading')
    const deep = headings.filter((h: any) => h.depth > 3)
    expect(deep.length).toBe(0)
  })

  it('injects H1 from title option when document has no headings', () => {
    const processor = unified()
      .use(remarkParse)
      .use(headingNormalizePlugin, { title: 'Jane Doe' })
    const tree = processor.runSync(processor.parse('Some paragraph text with no headings.'))
    const headings = (tree as any).children.filter((n: any) => n.type === 'heading')
    expect(headings.length).toBeGreaterThan(0)
    expect(headings[0].depth).toBe(1)
    const textNode = headings[0].children[0]
    expect(textNode.value).toBe('Jane Doe')
  })

  it('leaves subsequent H1s unchanged when multiple H1s are present', () => {
    const tree = parseHeadings('# First\n\n# Second\n\n# Third\n')
    const headings = (tree as any).children.filter((n: any) => n.type === 'heading')
    // All three were originally H1 — only first is "handled"; rest remain H1
    expect(headings[0].depth).toBe(1)
    expect(headings[1].depth).toBe(1)
    expect(headings[2].depth).toBe(1)
  })
})
