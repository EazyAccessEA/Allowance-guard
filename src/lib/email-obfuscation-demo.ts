/**
 * Email Obfuscation Techniques Demo
 * Shows different methods and their effectiveness against various bot types
 */

export const OBFUSCATION_METHODS = {
  // Basic methods - easy to decode
  ROT13: 'fghcvb@nyybhagntnheq.pbz',
  HTML_ENTITIES: '&#115;&#117;&#112;&#112;&#111;&#114;&#116;&#64;&#97;&#108;&#108;&#111;&#119;&#97;&#110;&#99;&#101;&#103;&#117;&#97;&#114;&#100;&#46;&#99;&#111;&#109;',
  URL_ENCODING: 'support%40allowanceguard%2Ecom',
  
  // Intermediate methods - moderate protection
  JAVASCRIPT_CONCAT: "'support' + String.fromCharCode(64) + 'allowanceguard.com'",
  BASE64: 'c3VwcG9ydEBhbGxvd2FuY2VndWFyZC5jb20=',
  HEXADECIMAL: '\\x73\\x75\\x70\\x70\\x6f\\x72\\x74\\x40\\x61\\x6c\\x6c\\x6f\\x77\\x61\\x6e\\x63\\x65\\x67\\x75\\x61\\x72\\x64\\x2e\\x63\\x6f\\x6d',
  
  // Advanced methods - better protection
  UNICODE: '\\u0073\\u0075\\u0070\\u0070\\u006f\\u0072\\u0074\\u0040\\u0061\\u006c\\u006c\\u006f\\u0077\\u0061\\u006e\\u0063\\u0065\\u0067\\u0075\\u0061\\u0072\\u0064\\u002e\\u0063\\u006f\\u006d',
  MIXED: 'support&#64;allowanceguard.com',
  REVERSED: 'moc.draugacewallan@troppus',
  
  // Server-side methods - best protection
  IMAGE_BASED: '[Email displayed as image]',
  FORM_BASED: '[Contact form required]',
  CAPTCHA_PROTECTED: '[CAPTCHA required]'
} as const

/**
 * Effectiveness against different bot types
 */
export const BOT_PROTECTION_LEVELS = {
  // Basic scrapers (regex-based)
  BASIC_SCRAPERS: {
    methods: ['ROT13', 'HTML_ENTITIES', 'URL_ENCODING'],
    effectiveness: 'Low - easily decoded'
  },
  
  // Intermediate scrapers (DOM parsing)
  INTERMEDIATE_SCRAPERS: {
    methods: ['JAVASCRIPT_CONCAT', 'BASE64', 'HEXADECIMAL'],
    effectiveness: 'Medium - requires JavaScript execution'
  },
  
  // Advanced scrapers (headless browsers)
  ADVANCED_SCRAPERS: {
    methods: ['UNICODE', 'MIXED', 'REVERSED'],
    effectiveness: 'High - requires complex parsing'
  },
  
  // Sophisticated bots (AI-powered)
  SOPHISTICATED_BOTS: {
    methods: ['IMAGE_BASED', 'FORM_BASED', 'CAPTCHA_PROTECTED'],
    effectiveness: 'Very High - requires human interaction'
  }
} as const

/**
 * Recommended obfuscation strategy based on use case
 */
export const OBFUSCATION_STRATEGIES = {
  // For public websites with high traffic
  HIGH_TRAFFIC: {
    primary: 'MIXED',
    fallback: 'HTML_ENTITIES',
    additional: ['Rate limiting', 'IP blocking', 'Behavioral analysis']
  },
  
  // For contact forms
  CONTACT_FORMS: {
    primary: 'FORM_BASED',
    fallback: 'CAPTCHA_PROTECTED',
    additional: ['Honeypot fields', 'Time-based validation']
  },
  
  // For documentation/help pages
  DOCUMENTATION: {
    primary: 'JAVASCRIPT_CONCAT',
    fallback: 'HTML_ENTITIES',
    additional: ['Click-to-reveal', 'Hover-to-reveal']
  },
  
  // For high-security applications
  HIGH_SECURITY: {
    primary: 'IMAGE_BASED',
    fallback: 'CAPTCHA_PROTECTED',
    additional: ['Multi-factor verification', 'IP whitelisting']
  }
} as const

/**
 * Implementation examples for different frameworks
 */
export const IMPLEMENTATION_EXAMPLES = {
  // React/Next.js
  REACT: `
// Component with click-to-reveal
function ObfuscatedEmail({ email, subject }) {
  const [revealed, setRevealed] = useState(false)
  
  return (
    <span 
      onClick={() => setRevealed(true)}
      className="cursor-pointer"
    >
      {revealed ? email : obfuscateEmail(email)}
    </span>
  )
}`,

  // Vanilla JavaScript
  VANILLA_JS: `
// HTML with data attributes
<span data-email="support@allowanceguard.com" 
      onclick="revealEmail(this)">
  Click to reveal email
</span>

<script>
function revealEmail(element) {
  const email = element.dataset.email
  element.textContent = email
  element.onclick = () => window.location.href = 'mailto:' + email
}
</script>`,

  // CSS-only obfuscation
  CSS_ONLY: `
/* Reverse text direction */
.email-reversed {
  unicode-bidi: bidi-override;
  direction: rtl;
}

/* Hide parts with pseudo-elements */
.email-hidden::before {
  content: "support";
}
.email-hidden::after {
  content: "@allowanceguard.com";
}`,

  // Server-side (Node.js/Express)
  SERVER_SIDE: `
// Generate obfuscated email on server
app.get('/contact', (req, res) => {
  const email = 'support@allowanceguard.com'
  const obfuscated = obfuscateEmail(email)
  
  res.render('contact', { 
    email: obfuscated,
    originalEmail: email 
  })
})`
} as const

/**
 * Best practices for email obfuscation
 */
export const BEST_PRACTICES = {
  LAYERED_PROTECTION: [
    'Use multiple obfuscation methods',
    'Implement rate limiting',
    'Add behavioral analysis',
    'Use honeypot fields',
    'Monitor for suspicious activity'
  ],
  
  USER_EXPERIENCE: [
    'Provide clear instructions',
    'Use click-to-reveal for better UX',
    'Include fallback methods',
    'Test on different devices',
    'Ensure accessibility compliance'
  ],
  
  SECURITY_CONSIDERATIONS: [
    'Don\'t rely solely on client-side obfuscation',
    'Implement server-side validation',
    'Monitor for new attack vectors',
    'Keep obfuscation methods updated',
    'Use HTTPS for all communications'
  ],
  
  MAINTENANCE: [
    'Regularly update obfuscation methods',
    'Monitor effectiveness',
    'Test against new bot types',
    'Document implementation',
    'Have backup contact methods'
  ]
} as const
