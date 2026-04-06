const URGENCY_KEYWORDS = [
  'urgent', 'immediately', 'action required', 'act now', 'respond immediately',
  'limited time', 'expires', 'last chance', 'final notice',
  'within 24 hours', 'within 48 hours', 'asap',
  'do not ignore', 'urgent response needed', 'time sensitive',
  'respond now', 'deadline', 'important notice',
  'attention required', 'critical alert', 'instant action required'
];

const THREAT_KEYWORDS = [
  'account suspended', 'account blocked', 'account will be closed',
  'legal action', 'lawsuit', 'police', 'irs',
  'tax violation', 'arrest', 'fraud detected',
  'unauthorized access', 'account compromised',
  'security breach', 'identity theft',
  'account locked', 'account restricted',
  'service termination', 'penalty', 'legal notice',
  'non compliance', 'violation detected'
];

const LURE_KEYWORDS = [
  'you won', 'winner', 'prize', 'lottery',
  'claim your', 'free gift', 'bonus', 'reward',
  'selected', 'congratulations',
  'exclusive offer', 'special offer',
  'limited offer', 'gift voucher',
  'cashback', 'earn money', 'guaranteed',
  'risk free', 'double your money',
  'instant profit', 'no investment'
];

const CREDENTIAL_KEYWORDS = [
  'verify your', 'confirm your', 'update your',
  'validate your', 'enter your password',
  'provide your', 'submit your credentials',
  'log in to', 'sign in to',
  'confirm your identity', 'verify your identity',
  'security check', 'account verification',
  'reset your password', 'recover your account',
  'unlock your account', 'enter otp',
  'confirm otp', 'share otp'
];

const FINANCIAL_KEYWORDS = [
  'bank account', 'wire transfer', 'bitcoin',
  'gift card', 'western union', 'moneygram',
  'payment required', 'send money', 'transfer funds',
  'upi', 'upi id', 'paytm', 'phonepe', 'gpay',
  'crypto', 'btc', 'eth', 'usdt',
  'wallet transfer', 'transaction fee',
  'processing fee', 'pending payment',
  'invoice', 'billing issue', 'refund',
  'claim refund', 'advance payment'
];

const IMPERSONATION_KEYWORDS = [
  'paypal', 'amazon', 'google', 'microsoft', 'apple',
  'netflix', 'irs', 'fbi',
  'bank of america', 'chase bank', 'wells fargo',
  'citibank', 'hsbc',
  'instagram', 'facebook', 'whatsapp',
  'linkedin', 'twitter',
  'gmail', 'icloud',
  'hdfc bank', 'icici bank', 'sbi bank', 'axis bank',
  'flipkart', 'airtel', 'jio', 'paytm'
];
const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function extractUrls(text) {
  return (text.match(URL_REGEX) || []).map(url => url.replace(/[.,;!?]$/, ''));
}

function analyzeEmail(content) {
  const findings = [];
  const highlights = [];
  let riskScore = 0;

  const lowerContent = content.toLowerCase();

  // 1. Urgency language
  const urgencyFound = URGENCY_KEYWORDS.filter(kw => lowerContent.includes(kw));
  if (urgencyFound.length >= 2) {
    findings.push({ type: 'danger', text: `Multiple urgency triggers detected: "${urgencyFound.slice(0, 3).join('", "')}" — creates artificial pressure` });
    highlights.push(...urgencyFound.slice(0, 3));
    riskScore += 25;
  } else if (urgencyFound.length === 1) {
    findings.push({ type: 'warning', text: `Urgency language detected: "${urgencyFound[0]}" — common phishing tactic` });
    highlights.push(urgencyFound[0]);
    riskScore += 12;
  }

  // 2. Threat language
  const threatFound = THREAT_KEYWORDS.filter(kw => lowerContent.includes(kw));
  if (threatFound.length > 0) {
    findings.push({ type: 'danger', text: `Threatening language detected: "${threatFound[0]}" — used to scare victims into acting` });
    highlights.push(...threatFound);
    riskScore += 30;
  }

  // 3. Lure/prize language
  const lureFound = LURE_KEYWORDS.filter(kw => lowerContent.includes(kw));
  if (lureFound.length > 0) {
    findings.push({ type: 'danger', text: `Prize/lure language detected: "${lureFound[0]}" — classic social engineering tactic` });
    highlights.push(...lureFound);
    riskScore += 25;
  }

  // 4. Credential harvesting
  const credFound = CREDENTIAL_KEYWORDS.filter(kw => lowerContent.includes(kw));
  if (credFound.length > 0) {
    findings.push({ type: 'danger', text: `Credential-harvesting language: "${credFound[0]}" — designed to steal your login info` });
    highlights.push(...credFound);
    riskScore += 30;
  }

  // 5. Financial scam indicators
  const finFound = FINANCIAL_KEYWORDS.filter(kw => lowerContent.includes(kw));
  if (finFound.length > 0) {
    findings.push({ type: 'danger', text: `Financial scam indicator: "${finFound[0]}" — requests involving gift cards, wire transfers, or crypto are always scams` });
    highlights.push(...finFound);
    riskScore += 35;
  }

  // 6. Brand impersonation
  const brandFound = IMPERSONATION_KEYWORDS.filter(kw => lowerContent.includes(kw));
  if (brandFound.length > 0) {
    findings.push({ type: 'warning', text: `References trusted brand "${brandFound[0]}" — verify the sender's actual email domain` });
    highlights.push(brandFound[0]);
    riskScore += 15;
  }

  // 7. Extract and analyze URLs
  const urls = extractUrls(content);
  if (urls.length > 0) {
    findings.push({ type: 'info', text: `Found ${urls.length} URL(s) in email — each should be verified before clicking` });

    // Analyze each URL
    const suspiciousUrls = urls.filter(url => {
      const lower = url.toLowerCase();
      return lower.includes('bit.ly') || lower.includes('tinyurl') ||
        /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower) ||
        lower.includes('login') || lower.includes('verify') ||
        lower.includes('secure') || lower.includes('update');
    });

    if (suspiciousUrls.length > 0) {
      findings.push({ type: 'danger', text: `${suspiciousUrls.length} suspicious URL(s) detected with phishing patterns` });
      riskScore += suspiciousUrls.length * 15;
    }

    if (urls.length > 5) {
      findings.push({ type: 'warning', text: `Unusually high number of links (${urls.length}) — may be spam or phishing` });
      riskScore += 10;
    }
  }

  // 8. Mismatched sender patterns
  const emails = content.match(EMAIL_REGEX) || [];
  if (emails.length > 0) {
    const suspiciousEmails = emails.filter(email => {
      const domain = email.split('@')[1]?.toLowerCase();
      return domain && (domain.includes('gmail') || domain.includes('yahoo') || domain.includes('hotmail')) &&
        brandFound.some(brand => lowerContent.includes(brand));
    });
    if (suspiciousEmails.length > 0) {
      findings.push({ type: 'danger', text: `Brand impersonation via free email service: "${suspiciousEmails[0]}" — legitimate companies use official domains` });
      riskScore += 25;
    }
  }

  // 9. Grammar/formatting checks
  const allCaps = content.match(/\b[A-Z]{4,}\b/g) || [];
  if (allCaps.length > 5) {
    findings.push({ type: 'warning', text: `Excessive capitalization (${allCaps.length} instances) — used to create panic or urgency` });
    riskScore += 10;
  }

  // 10. Excessive exclamation marks
  const exclamations = (content.match(/!/g) || []).length;
  if (exclamations > 5) {
    findings.push({ type: 'warning', text: `Excessive exclamation marks (${exclamations}) — manipulative emotional pressure tactic` });
    riskScore += 8;
  }

  // Cap score
  riskScore = Math.min(100, Math.round(riskScore));

  let status, statusColor;
  if (riskScore >= 65) { status = 'Dangerous'; statusColor = 'red'; }
  else if (riskScore >= 30) { status = 'Suspicious'; statusColor = 'yellow'; }
  else { status = 'Safe'; statusColor = 'green'; }

  if (findings.length === 0) {
    findings.push({ type: 'safe', text: 'No significant phishing indicators found in this email' });
  }

  return {
    riskScore,
    status,
    statusColor,
    findings,
    highlights: [...new Set(highlights)],
    extractedUrls: extractUrls(content),
    metadata: {
      wordCount: content.split(/\s+/).length,
      linkCount: extractUrls(content).length,
      hasUrgency: urgencyFound.length > 0,
      hasThreats: threatFound.length > 0,
      hasFinancialAsk: finFound.length > 0
    }
  };
}

module.exports = { analyzeEmail };
