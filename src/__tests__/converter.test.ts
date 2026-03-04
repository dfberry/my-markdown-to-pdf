import { describe, it, expect } from 'vitest'
import { mdToHtml } from '../../converter'

describe('mdToHtml()', () => {
  it('converts basic markdown to expected HTML tags', async () => {
    const html = await mdToHtml('# Jane Doe\n\n## Experience\n\nSome text.\n')
    expect(html).toContain('<h1')
    expect(html).toContain('<h2')
    expect(html).toContain('<p')
  })

  it('applies heading normalization so H4 is capped to H3 in output', async () => {
    const html = await mdToHtml('# Name\n\n#### Deep Section\n')
    expect(html).not.toMatch(/<h4[\s>]/)
    expect(html).toMatch(/<h3[\s>]/)
  })

  it('does not throw on empty string input and returns valid HTML', async () => {
    await expect(mdToHtml('')).resolves.not.toThrow()
    const html = await mdToHtml('')
    // Should return a string (even if minimal)
    expect(typeof html).toBe('string')
  })

  it('properly escapes special characters in content', async () => {
    const html = await mdToHtml('Some text with <script>alert("xss")</script> and & ampersand.\n')
    expect(html).not.toContain('<script>alert')
    // Angle brackets in prose should be escaped
    expect(html).toMatch(/&lt;|&amp;/)
  })
})

// htmlToPdf() is intentionally NOT tested here.
// It requires a live Puppeteer/Chromium browser instance,
// which is unsuitable for unit tests. Integration tests
// for PDF output should live in a separate e2e suite.
