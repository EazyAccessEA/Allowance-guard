// XSS Protection - Built-in sanitization without external dependencies
export function sanitizeHtml(html: string): string {
  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove dangerous attributes
    .replace(/\s*(on\w+|javascript:|data:|vbscript:)/gi, '')
    // Allow only safe tags
    .replace(/<(?!\/?(?:p|br|strong|em|u|h[1-6]|ul|ol|li|a|blockquote|code|pre|table|thead|tbody|tr|td|th)\b)[^>]*>/gi, '')
    // Clean up any remaining dangerous content
    .replace(/<[^>]*>/g, (match) => {
      // Only allow safe attributes
      const safeAttrs = match.match(/\s+(?:href|target|rel)=["'][^"']*["']/gi) || []
      const tagName = match.match(/<\/?(\w+)/)?.[1]
      if (tagName && ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'td', 'th'].includes(tagName)) {
        return `<${tagName}${safeAttrs.join('')}>`
      }
      return ''
    })
}
