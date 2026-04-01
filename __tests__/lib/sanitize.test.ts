/**
 * Unit tests for src/lib/sanitize.ts
 *
 * Tests: sanitizeHtml — regex-based XSS sanitizer (pure function, no mocks)
 */

import { sanitizeHtml } from '@/lib/sanitize'

describe('sanitizeHtml', () => {
  // ------ Removal of dangerous content ------

  it('removes script tags and their content', () => {
    const input = '<p>Hello</p><script>alert("xss")</script><p>World</p>'
    const result = sanitizeHtml(input)

    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
    expect(result).toContain('Hello')
    expect(result).toContain('World')
  })

  it('removes javascript: protocol', () => {
    const input = '<a href="javascript:alert(1)">click</a>'
    const result = sanitizeHtml(input)

    expect(result.toLowerCase()).not.toContain('javascript:')
  })

  it('removes event handlers (onclick, onerror, etc.)', () => {
    const input = '<div onclick="alert(\'xss\')">test</div>'
    const result = sanitizeHtml(input)

    expect(result.toLowerCase()).not.toContain('onclick')
    expect(result).not.toContain("alert('xss')")
  })

  it('removes vbscript: protocol', () => {
    const input = '<a href="vbscript:MsgBox">click</a>'
    const result = sanitizeHtml(input)

    expect(result.toLowerCase()).not.toContain('vbscript:')
  })

  it('removes data: protocol', () => {
    const input = '<a href="data:text/html,<script>alert(1)</script>">click</a>'
    const result = sanitizeHtml(input)

    expect(result.toLowerCase()).not.toContain('data:')
  })

  it('strips unsafe tags: iframe, object, embed, form', () => {
    const inputs = [
      '<iframe src="evil.com"></iframe>',
      '<object data="evil.swf"></object>',
      '<embed src="evil.swf">',
      '<form action="evil.com"><input></form>',
    ]

    for (const input of inputs) {
      const result = sanitizeHtml(input)
      expect(result).not.toMatch(/<iframe/i)
      expect(result).not.toMatch(/<object/i)
      expect(result).not.toMatch(/<embed/i)
      expect(result).not.toMatch(/<form/i)
    }
  })

  // ------ Preservation of safe content ------

  it('preserves safe tags: p, strong, em, br, h1-h6', () => {
    const input = '<h1>Title</h1><p>Text <em>italic</em></p><br>'
    const result = sanitizeHtml(input)

    expect(result).toContain('<h1>')
    expect(result).toContain('<p>')
    expect(result).toContain('<em>')
    expect(result).toContain('<br>')
    expect(result).toContain('Title')
    expect(result).toContain('italic')
  })

  it('preserves safe attributes (href, target, rel) on anchor tags', () => {
    const input = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>'
    const result = sanitizeHtml(input)

    expect(result).toContain('href="https://example.com"')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noopener"')
    expect(result).toContain('Link')
  })

  // ------ Edge cases ------

  it('handles nested script tags', () => {
    const input = '<script><script>alert(1)</script></script>'
    const result = sanitizeHtml(input)

    expect(result.toLowerCase()).not.toContain('<script')
    expect(result).not.toContain('alert')
  })

  it('handles mixed case: <ScRiPt>, onClick', () => {
    const input = '<ScRiPt>alert(1)</ScRiPt><div onClick="bad()">test</div>'
    const result = sanitizeHtml(input)

    expect(result.toLowerCase()).not.toContain('<script')
    expect(result.toLowerCase()).not.toContain('onclick')
  })

  it('handles empty string', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('handles string with no HTML', () => {
    const input = 'Just plain text, nothing dangerous here.'
    expect(sanitizeHtml(input)).toBe(input)
  })

  it('handles complex nested HTML with mixed dangerous and safe content', () => {
    const input = [
      '<h2>Report</h2>',
      '<p>Summary: <em>important</em></p>',
      '<script>document.cookie</script>',
      '<iframe src="evil"></iframe>',
      '<a href="https://safe.com" target="_blank">Safe link</a>',
      '<div onmouseover="steal()">hover</div>',
    ].join('')

    const result = sanitizeHtml(input)

    // Safe content preserved
    expect(result).toContain('<h2>')
    expect(result).toContain('Report')
    expect(result).toContain('href="https://safe.com"')
    expect(result).toContain('Safe link')

    // Dangerous content removed
    expect(result.toLowerCase()).not.toContain('<script')
    expect(result.toLowerCase()).not.toContain('<iframe')
    expect(result.toLowerCase()).not.toContain('onmouseover')
    expect(result).not.toContain('document.cookie')
    expect(result).not.toContain('steal()')
  })
})
