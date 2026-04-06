/**
 * Veridex Email Detection Engine
 * ───────────────────────────────
 * Modular phishing detection for email content.
 * Each check returns { triggered, weight, reason }.
 */

const URGENCY = [
  'urgent', 'immediately', 'action required', 'act now', 'respond immediately',
  'limited time', 'expires today', 'last chance', 'final notice',
  'within 24 hours', 'within 48 hours', 'asap', 'do not ignore',
  'urgent response needed', 'time sensitive', 'instant action required',
  'your account is at risk', 'deadline approaching', 'respond now',
  'failure to act', 'important notice', 'critical alert',
  'security alert', 'unusual activity detected', 'attention required'
];

const THREATS = [
  'account suspended', 'account blocked', 'account will be closed',
  'legal action', 'lawsuit', 'police', 'irs investigation',
  'tax violation', 'arrest warrant', 'fraud detected',
  'unauthorized access', 'account compromised', 'security breach',
  'identity theft', 'your account has been hacked',
  'suspicious login attempt', 'we detected unusual activity',
  'your account is locked', 'penalty imposed',
  'non-compliance notice', 'legal consequences',
  'service termination', 'permanent suspension'
];

const LURES = [
  'you won', 'winner', 'prize', 'lottery', 'claim your reward',
  'free gift', 'bonus cash', 'selected user', 'congratulations',
  'jackpot', 'inheritance', 'million dollar',
  'exclusive offer', 'limited offer', 'special promotion',
  'gift voucher', 'free subscription', 'reward points',
  'cashback offer', 'guaranteed income', 'risk free',
  'no investment required', 'double your money',
  'earn money fast', 'instant profit'
];

const CREDENTIALS = [
  'verify your account', 'confirm your password', 'update your details',
  'validate your information', 'enter your password',
  'provide your credentials', 'submit your login',
  'sign in to verify', 're-enter your',
  'confirm your identity', 'login to continue',
  'verify your identity', 'update your account',
  'security verification', 'complete verification',
  'enter otp', 'share otp', 'otp verification',
  'confirm otp', 'reset your password',
  'recover your account', 'unlock your account'
];

const FINANCIAL = [
  'wire transfer', 'bitcoin', 'crypto payment', 'gift card',
  'western union', 'moneygram', 'payment required',
  'send money now', 'transfer funds', 'bank details',
  'routing number', 'upi payment', 'upi id',
  'paytm', 'google pay', 'phonepe',
  'wallet transfer', 'crypto wallet',
  'btc', 'eth', 'usdt',
  'processing fee', 'transaction fee',
  'release funds', 'pending payment',
  'invoice attached', 'billing issue',
  'refund issued', 'claim refund',
  'overpayment', 'advance payment'
];

const BRANDS = [
  'paypal', 'amazon', 'google', 'microsoft', 'apple', 'netflix',
  'facebook', 'irs', 'fbi', 'bank of america', 'chase bank',
  'wells fargo', 'citibank', 'hsbc',
  'instagram', 'whatsapp', 'linkedin', 'twitter',
  'yahoo', 'dropbox', 'adobe',
  'icici bank', 'hdfc bank', 'sbi bank', 'axis bank',
  'flipkart', 'snapdeal', 'airtel', 'jio',
  'phonepe', 'paytm', 'razorpay'
];

const SHORTENERS = [
  'bit.ly', 'tinyurl', 'goo.gl', 'ow.ly', 'rb.gy', 'cutt.ly',
  'is.gd', 'buff.ly', 'adf.ly', 'shorturl.at',
  't.co', 'rebrand.ly', 'soo.gd', 'lnkd.in'
];

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

const checks = {
  urgencyLanguage: (text) => {
    const found = URGENCY.filter(k => text.includes(k))
    if (found.length >= 2) return { triggered: true, weight: 25, reason: `Multiple urgency triggers: "${found.slice(0, 3).join('", "')}" — artificial pressure tactic` }
    if (found.length === 1) return { triggered: true, weight: 12, reason: `Urgency language: "${found[0]}" — pressuring victim to act without thinking` }
    return { triggered: false, weight: 0, reason: '' }
  },

  threatLanguage: (text) => {
    const found = THREATS.filter(k => text.includes(k))
    if (found.length > 0) return { triggered: true, weight: 30, reason: `Threatening language: "${found[0]}" — fear tactic to force compliance` }
    return { triggered: false, weight: 0, reason: '' }
  },

  lureLanguage: (text) => {
    const found = LURES.filter(k => text.includes(k))
    if (found.length > 0) return { triggered: true, weight: 28, reason: `Lure/prize language: "${found[0]}" — too-good-to-be-true social engineering` }
    return { triggered: false, weight: 0, reason: '' }
  },

  credentialHarvesting: (text) => {
    const found = CREDENTIALS.filter(k => text.includes(k))
    if (found.length > 0) return { triggered: true, weight: 32, reason: `Credential-harvesting phrase: "${found[0]}" — phishing for login information` }
    return { triggered: false, weight: 0, reason: '' }
  },

  financialScam: (text) => {
    const found = FINANCIAL.filter(k => text.includes(k))
    if (found.length > 0) return { triggered: true, weight: 35, reason: `Financial scam indicator: "${found[0]}" — gift cards/wire transfers/crypto are always scam payment methods` }
    return { triggered: false, weight: 0, reason: '' }
  },

  brandImpersonation: (text, emailAddresses) => {
    const brandFound = BRANDS.filter(b => text.includes(b))
    if (brandFound.length === 0) return { triggered: false, weight: 0, reason: '' }
    const freeEmailDomains = ['gmail', 'yahoo', 'hotmail', 'outlook', 'protonmail']
    const suspicious = emailAddresses.filter(e => {
      const domain = e.split('@')[1]?.toLowerCase() || ''
      return freeEmailDomains.some(d => domain.includes(d))
    })
    if (suspicious.length > 0) {
      return { triggered: true, weight: 35, reason: `Brand impersonation via free email: "${suspicious[0]}" claims to be "${brandFound[0]}" — real companies use official domains` }
    }
    return { triggered: true, weight: 15, reason: `References trusted brand "${brandFound[0]}" — verify sender's actual domain` }
  },

  suspiciousLinks: (urls) => {
    const suspicious = urls.filter(u => {
      const lower = u.toLowerCase()
      return SHORTENERS.some(s => lower.includes(s)) ||
        /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower) ||
        !lower.startsWith('https') ||
        ['login', 'verify', 'secure', 'update', 'confirm'].some(k => lower.includes(k))
    })
    if (suspicious.length > 0) return { triggered: true, weight: suspicious.length * 15, reason: `${suspicious.length} suspicious link(s) detected with phishing patterns` }
    if (urls.length > 0) return { triggered: true, weight: 5, reason: `${urls.length} link(s) found — verify before clicking` }
    return { triggered: false, weight: 0, reason: '' }
  },

  excessiveCapitals: (original) => {
    const capsWords = (original.match(/\b[A-Z]{4,}\b/g) || [])
    if (capsWords.length > 5) return { triggered: true, weight: 10, reason: `Excessive capitalization (${capsWords.length} all-caps words) — manipulative emphasis tactic` }
    return { triggered: false, weight: 0, reason: '' }
  },

  excessiveExclamations: (original) => {
    const count = (original.match(/!/g) || []).length
    if (count > 5) return { triggered: true, weight: 8, reason: `${count} exclamation marks — emotional manipulation to override critical thinking` }
    return { triggered: false, weight: 0, reason: '' }
  },

  mismatchedSender: (text) => {
    const genericGreetings = ['dear customer', 'dear user', 'dear valued member', 'dear account holder', 'hello user']
    const found = genericGreetings.filter(g => text.includes(g))
    if (found.length > 0) return { triggered: true, weight: 12, reason: `Generic greeting: "${found[0]}" — legitimate services address you by name` }
    return { triggered: false, weight: 0, reason: '' }
  },
}

// ── Main analyze function ─────────────────────────────────────────────────────
const analyzeEmail = (content) => {
  const lower = content.toLowerCase()
  const urls = (content.match(URL_REGEX) || []).map(u => u.replace(/[.,;!?]$/, ''))
  const emails = content.match(EMAIL_REGEX) || []

  let score = 0
  const reasons = []

  // Run all checks
  const checkResults = [
    checks.urgencyLanguage(lower),
    checks.threatLanguage(lower),
    checks.lureLanguage(lower),
    checks.credentialHarvesting(lower),
    checks.financialScam(lower),
    checks.brandImpersonation(lower, emails),
    checks.suspiciousLinks(urls),
    checks.excessiveCapitals(content),
    checks.excessiveExclamations(content),
    checks.mismatchedSender(lower),
  ]

  checkResults.forEach(({ triggered, weight, reason }) => {
    if (triggered) { score += weight; reasons.push(reason) }
  })

  score = Math.min(100, Math.round(score))

  let result
  if (score >= 60) result = 'fraud'
  else if (score >= 25) result = 'suspicious'
  else result = 'safe'

  return {
    result,
    riskScore: score,
    reasons: reasons.length > 0 ? reasons : ['No significant phishing indicators found'],
    extractedUrls: urls,
    metadata: {
      wordCount: content.split(/\s+/).length,
      linkCount: urls.length,
      emailCount: emails.length,
      hasUrgency: checkResults[0].triggered,
      hasThreats: checkResults[1].triggered,
      hasFinancialAsk: checkResults[4].triggered,
    },
  }
}

module.exports = { analyzeEmail }
