const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq',
  '.xyz', '.top', '.work', '.click', '.download',
  '.loan', '.win', '.racing', '.party', '.review',
  '.stream', '.gdn', '.mom', '.men',
  '.zip', '.mov', '.trade', '.science',
  '.date', '.faith', '.cricket', '.kim', '.fit'
];

const BRAND_KEYWORDS = [
  'paypal', 'amazon', 'google', 'microsoft', 'apple',
  'netflix', 'facebook', 'instagram', 'twitter',
  'whatsapp', 'linkedin', 'gmail', 'icloud',
  'bank', 'secure', 'login', 'account', 'verify',
  'update', 'confirm',
  'bankofamerica', 'chase', 'wellsfargo', 'citibank', 'hsbc',
  'hdfc', 'icici', 'sbi', 'axis', 'kotak',
  'paytm', 'phonepe', 'gpay', 'razorpay',
  'flipkart', 'snapdeal', 'airtel', 'jio',
  'adobe', 'dropbox', 'yahoo'
];

const PHISHING_PATTERNS = [
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address
  /@/,                                  // userinfo trick
  /--/,                                 // punycode / fake domain
  /\.{2,}/,                             // multiple dots
  /[а-яА-Я]/,                           // Cyrillic homoglyphs
  /xn--/,                               // punycode encoding
  /https?:\/\/\d+\./,                   // IP-based URL with protocol
  /[0-9]{6,}/,                          // long numeric strings
  /-%|%[0-9a-fA-F]{2}/,                 // encoded characters
  /\/\//,                               // double slash in path
  /[^\x00-\x7F]/                        // non-ASCII characters
];

const SUSPICIOUS_KEYWORDS_IN_PATH = [
  'login', 'signin', 'verify', 'secure', 'account',
  'update', 'confirm', 'password', 'credential', 'banking',
  'reset', 'recover', 'unlock', 'authenticate',
  'identity', 'security', 'check', 'otp',
  'verify-otp', 'confirm-otp',
  'payment', 'billing', 'invoice', 'checkout',
  'refund', 'transaction', 'wallet',
  'support', 'helpdesk', 'service',
  'delivery', 'courier', 'parcel', 'track',
  'order', 'status',
  'redirect', 'redirect-url', 'continue', 'next',
  'access', 'portal', 'dashboard',
  'authorize', 'validate', 'verification'
];


function analyzeUrl(parsedUrl, originalUrl) {
  const findings = [];
  let riskScore = 0;

  const hostname = parsedUrl.hostname.toLowerCase();
  const fullUrl = originalUrl.toLowerCase();
  const path = parsedUrl.pathname.toLowerCase();

  // 1. HTTPS check
  if (parsedUrl.protocol !== 'https:') {
    findings.push({ type: 'warning', text: 'Connection is not secure (HTTP instead of HTTPS)' });
    riskScore += 20;
  } else {
    findings.push({ type: 'safe', text: 'Uses HTTPS secure connection' });
  }

  // 2. IP address in URL
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    findings.push({ type: 'danger', text: 'URL uses raw IP address instead of domain name — strong phishing indicator' });
    riskScore += 40;
  }

  // 3. URL length
  if (fullUrl.length > 100) {
    findings.push({ type: 'warning', text: `Unusually long URL (${fullUrl.length} characters) — often used to hide real destination` });
    riskScore += 15;
  } else if (fullUrl.length > 75) {
    findings.push({ type: 'warning', text: 'Moderately long URL — worth inspecting carefully' });
    riskScore += 8;
  }

  // 4. Suspicious TLD
  const tldMatch = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
  if (tldMatch) {
    findings.push({ type: 'danger', text: `Suspicious top-level domain "${tldMatch}" — frequently used in phishing campaigns` });
    riskScore += 25;
  }

  // 5. Brand impersonation
  const brandFound = BRAND_KEYWORDS.filter(brand => hostname.includes(brand));
  if (brandFound.length > 0) {
    const knownDomains = { paypal: 'paypal.com', amazon: 'amazon.com', google: 'google.com', microsoft: 'microsoft.com', apple: 'apple.com', netflix: 'netflix.com', facebook: 'facebook.com' };
    const suspicious = brandFound.filter(b => knownDomains[b] && !hostname.endsWith(knownDomains[b]));
    if (suspicious.length > 0) {
      findings.push({ type: 'danger', text: `Domain mimics trusted brand "${suspicious[0]}" but is NOT the official website` });
      riskScore += 35;
    } else {
      findings.push({ type: 'warning', text: `Contains brand-related keyword "${brandFound[0]}" — verify this is the official domain` });
      riskScore += 10;
    }
  }

  // 6. @ symbol in URL
  if (fullUrl.includes('@')) {
    findings.push({ type: 'danger', text: 'URL contains "@" symbol — browser ignores everything before it, potential redirect trick' });
    riskScore += 30;
  }

  // 7. Multiple subdomains
  const subdomainCount = hostname.split('.').length - 2;
  if (subdomainCount >= 3) {
    findings.push({ type: 'warning', text: `Excessive subdomains (${subdomainCount}) — may be disguising the real domain` });
    riskScore += 15;
  }

  // 8. Hyphens in domain
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    findings.push({ type: 'warning', text: `Domain contains ${hyphenCount} hyphens — common pattern in phishing domains` });
    riskScore += 10;
  } else if (hyphenCount >= 1) {
    findings.push({ type: 'info', text: 'Domain contains hyphens — minor indicator, but review carefully' });
    riskScore += 3;
  }

  // 9. Suspicious keywords in path
  const pathKeywords = SUSPICIOUS_KEYWORDS_IN_PATH.filter(kw => path.includes(kw));
  if (pathKeywords.length > 0) {
    findings.push({ type: 'warning', text: `Path contains sensitive keywords: "${pathKeywords.join('", "')}" — often used in credential-harvesting pages` });
    riskScore += pathKeywords.length * 8;
  }

  // 10. Punycode / IDN homograph
  if (hostname.includes('xn--')) {
    findings.push({ type: 'danger', text: 'Domain uses Punycode (IDN homograph attack) — characters may visually resemble legitimate domains' });
    riskScore += 35;
  }

  // 11. URL shorteners
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'buff.ly', 'short.link'];
  if (shorteners.some(s => hostname.includes(s))) {
    findings.push({ type: 'warning', text: 'URL shortener detected — real destination is hidden and unverifiable' });
    riskScore += 20;
  }

  // 12. Double extensions
  if (/\.(exe|zip|rar|bat|cmd|vbs|js)\./i.test(path) || /\.(exe|zip|bat)$/i.test(path)) {
    findings.push({ type: 'danger', text: 'URL points to executable or archive file — potential malware download' });
    riskScore += 40;
  }

  // 13. Query string analysis
  const query = parsedUrl.search;
  if (query.length > 150) {
    findings.push({ type: 'warning', text: 'Very long query string — may be encoding malicious parameters' });
    riskScore += 10;
  }

  // Cap at 100
  riskScore = Math.min(100, Math.round(riskScore));

  // Status determination
  let status, statusColor;
  if (riskScore >= 70) {
    status = 'Dangerous';
    statusColor = 'red';
  } else if (riskScore >= 35) {
    status = 'Suspicious';
    statusColor = 'yellow';
  } else {
    status = 'Safe';
    statusColor = 'green';
  }

  // Add overall assessment
  if (findings.filter(f => f.type === 'safe').length === 0 && riskScore < 20) {
    findings.push({ type: 'safe', text: 'No significant phishing indicators detected' });
  }

  return {
    riskScore,
    status,
    statusColor,
    findings,
    metadata: {
      hostname: parsedUrl.hostname,
      protocol: parsedUrl.protocol,
      path: parsedUrl.pathname,
      hasQuery: parsedUrl.search.length > 0,
      urlLength: fullUrl.length
    }
  };
}

module.exports = { analyzeUrl };
