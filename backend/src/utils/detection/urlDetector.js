/**
 * Veridex URL Detection Engine
 * ─────────────────────────────
 * Modular rule-based analysis. Each check is a named function
 * that returns { triggered: boolean, reason: string }.
 * Easy to replace individual checks with ML models later.
 */

const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq',
  '.xyz', '.top', '.work', '.click', '.download',
  '.loan', '.win', '.racing', '.party', '.review',
  '.country', '.stream', '.gdn', '.mom', '.men',
  '.zip', '.mov', '.trade', '.accountant', '.science',
  '.date', '.faith', '.cricket', '.kim', '.fit'
];

const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly',
  'buff.ly', 'short.link', 'rb.gy', 'cutt.ly',
  'is.gd', 'soo.gd', 's2r.co', 'clicky.me',
  'budurl.com', 'bc.vc', 'adf.ly', 'rebrand.ly',
  'tiny.cc', 'lnkd.in'
];

const BRAND_KEYWORDS = [
  'paypal', 'amazon', 'google', 'microsoft', 'apple',
  'netflix', 'facebook', 'instagram', 'whatsapp',
  'linkedin', 'twitter', 'icloud', 'gmail',
  'bank', 'chase', 'wellsfargo', 'citibank',
  'hsbc', 'barclays', 'bankofamerica',
  'hdfc', 'icici', 'sbi', 'axis', 'kotak',
  'paytm', 'phonepe', 'gpay', 'razorpay',
  'flipkart', 'snapdeal', 'airtel', 'jio',
  'irs', 'fbi', 'gov', 'postoffice'
];

const PATH_KEYWORDS = [
  'login', 'signin', 'verify', 'secure', 'account',
  'update', 'confirm', 'password', 'credential',
  'banking', 'authorize', 'validate',
  'reset', 'recover', 'unlock', 'authenticate',
  'identity', 'security', 'check', 'otp',
  'verify-otp', 'confirm-otp',
  'payment', 'billing', 'invoice', 'checkout',
  'refund', 'transaction', 'wallet',
  'support', 'helpdesk', 'service',
  'delivery', 'courier', 'parcel', 'track',
  'order', 'status', 'redirect', 'click',
  'continue', 'next', 'access', 'portal'
];

const DANGER_EXTS = /\.(exe|bat|cmd|vbs|js|jar|ps1|scr|zip|rar|7z|msi|dmg|iso|img|apk|bin)($|\?)/i;

// ── Individual rule checks ────────────────────────────────────────────────────

const checks = {
  httpsCheck: (parsed, original) => {
    if (parsed.protocol !== 'https:') {
      return { triggered: true, weight: 20, reason: 'Uses HTTP instead of HTTPS — no encryption, data can be intercepted' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  ipAddress: (parsed) => {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      return { triggered: true, weight: 40, reason: 'URL uses a raw IP address — legitimate sites use domain names' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  atSymbol: (parsed, original) => {
    if (original.includes('@')) {
      return { triggered: true, weight: 30, reason: 'Contains "@" symbol — browser ignores everything before it (redirect trick)' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  suspiciousTld: (parsed) => {
    const tld = SUSPICIOUS_TLDS.find(t => parsed.hostname.endsWith(t))
    if (tld) {
      return { triggered: true, weight: 25, reason: `Suspicious TLD "${tld}" — commonly abused by phishing campaigns (free/anonymous domains)` }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  brandMimicry: (parsed) => {
    const hostname = parsed.hostname.toLowerCase()
    const brand = BRAND_KEYWORDS.find(b => hostname.includes(b))
    if (!brand) return { triggered: false, weight: 0, reason: '' }
    const officialDomains = { paypal: 'paypal.com', amazon: 'amazon.com', google: 'google.com', microsoft: 'microsoft.com', apple: 'apple.com', netflix: 'netflix.com', facebook: 'facebook.com' }
    if (officialDomains[brand] && !hostname.endsWith(officialDomains[brand])) {
      return { triggered: true, weight: 35, reason: `Impersonates trusted brand "${brand}" but is NOT the official domain` }
    }
    return { triggered: true, weight: 12, reason: `References brand "${brand}" — verify this is the official website` }
  },

  urlLength: (parsed, original) => {
    if (original.length > 100) {
      return { triggered: true, weight: 15, reason: `Unusually long URL (${original.length} chars) — designed to hide the real destination` }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  excessiveSubdomains: (parsed) => {
    const count = parsed.hostname.split('.').length - 2
    if (count >= 3) {
      return { triggered: true, weight: 15, reason: `${count} subdomains detected — often used to disguise the real domain` }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  hyphensInDomain: (parsed) => {
    const count = (parsed.hostname.match(/-/g) || []).length
    if (count >= 3) {
      return { triggered: true, weight: 10, reason: `Domain has ${count} hyphens — common pattern in spoof domains (e.g. paypal-secure-login.com)` }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  suspiciousPathKeywords: (parsed) => {
    const path = parsed.pathname.toLowerCase()
    const found = PATH_KEYWORDS.filter(k => path.includes(k))
    if (found.length > 0) {
      return { triggered: true, weight: found.length * 8, reason: `Path contains sensitive keywords: "${found.join('", "')}" — credential harvesting indicator` }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  urlShortener: (parsed) => {
    if (SHORTENERS.some(s => parsed.hostname.includes(s))) {
      return { triggered: true, weight: 20, reason: 'URL shortener detected — real destination is hidden and cannot be verified' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  punycode: (parsed) => {
    if (parsed.hostname.includes('xn--')) {
      return { triggered: true, weight: 35, reason: 'Punycode/IDN homograph attack — characters look identical to legitimate domain letters' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  dangerousExtension: (parsed) => {
    if (DANGER_EXTS.test(parsed.pathname)) {
      return { triggered: true, weight: 40, reason: 'URL points to executable or archive file — potential malware download' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },

  multipleDotsInDomain: (parsed) => {
    const hostParts = parsed.hostname.split('.')
    const suspicious = hostParts.some(p => p.length > 30)
    if (suspicious) {
      return { triggered: true, weight: 12, reason: 'Domain segment is unusually long — evasion technique to confuse scanners' }
    }
    return { triggered: false, weight: 0, reason: '' }
  },
}

// ── Main analyze function ─────────────────────────────────────────────────────
const analyzeUrl = (originalUrl) => {
  let parsed
  try {
    parsed = new URL(originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`)
  } catch {
    return { result: 'suspicious', riskScore: 30, reasons: ['Invalid or malformed URL format'] }
  }

  let score = 0
  const reasons = []
  const safeIndicators = []

  Object.values(checks).forEach(check => {
    const { triggered, weight, reason } = check(parsed, originalUrl)
    if (triggered) { score += weight; reasons.push(reason) }
  })

  if (parsed.protocol === 'https:') safeIndicators.push('Uses HTTPS secure connection')
  if (score === 0) safeIndicators.push('No significant phishing indicators detected')

  score = Math.min(100, Math.round(score))

  let result
  if (score >= 65) result = 'fraud'
  else if (score >= 30) result = 'suspicious'
  else result = 'safe'

  return {
    result,
    riskScore: score,
    reasons: reasons.length > 0 ? reasons : safeIndicators,
    metadata: {
      hostname: parsed.hostname,
      protocol: parsed.protocol,
      path: parsed.pathname,
      urlLength: originalUrl.length,
    },
  }
}

module.exports = { analyzeUrl }
