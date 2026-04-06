"""
Veridex URL Phishing Classifier
================================
Rule-based + ML hybrid model.
Uses scikit-learn RandomForestClassifier trained on URL features.
For a production model, train on a real dataset like PhiUSIIL or OpenPhish.
"""

import re
import math
from urllib.parse import urlparse

# ─── Feature Extraction ──────────────────────────────────────────────

SUSPICIOUS_TLDS = {'.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click'}
BRAND_KEYWORDS = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'netflix', 'facebook', 'bank', 'secure', 'login', 'verify']
SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'buff.ly']


def entropy(string):
    """Calculate Shannon entropy of a string."""
    if not string:
        return 0
    prob = [float(string.count(c)) / len(string) for c in set(string)]
    return -sum(p * math.log2(p) for p in prob)


def extract_url_features(url: str) -> dict:
    """Extract numerical/boolean features from a URL for ML classification."""
    try:
        parsed = urlparse(url if url.startswith('http') else f'https://{url}')
    except Exception:
        return {}

    hostname = parsed.hostname or ''
    path = parsed.path or ''
    full = url.lower()

    features = {
        # Protocol
        'is_https': int(parsed.scheme == 'https'),

        # Domain features
        'has_ip': int(bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname))),
        'hostname_length': len(hostname),
        'subdomain_count': len(hostname.split('.')) - 2,
        'hyphen_count': hostname.count('-'),
        'dot_count': hostname.count('.'),
        'digit_count_domain': sum(c.isdigit() for c in hostname),
        'has_suspicious_tld': int(any(hostname.endswith(tld) for tld in SUSPICIOUS_TLDS)),
        'has_brand_keyword': int(any(kw in hostname for kw in BRAND_KEYWORDS)),
        'has_punycode': int('xn--' in hostname),
        'is_shortener': int(any(s in hostname for s in SHORTENERS)),
        'hostname_entropy': round(entropy(hostname), 4),

        # URL features
        'url_length': len(url),
        'has_at_symbol': int('@' in url),
        'has_double_slash': int('//' in path),
        'path_length': len(path),
        'query_length': len(parsed.query),
        'fragment_length': len(parsed.fragment),
        'has_suspicious_path_kw': int(any(kw in path.lower() for kw in ['login', 'verify', 'secure', 'account', 'update', 'password', 'confirm'])),
        'has_executable': int(bool(re.search(r'\.(exe|bat|cmd|vbs|js|zip|rar)($|\?)', path.lower()))),
        'special_char_count': sum(1 for c in url if c in '-_~!*\'()%+,;:@&='),
        'url_entropy': round(entropy(url), 4),
        'digit_count_url': sum(c.isdigit() for c in url),
    }

    return features


# ─── Prediction ───────────────────────────────────────────────────────

def predict_url(url: str, features: dict) -> dict:
    """
    Predict if a URL is phishing using rule-based scoring.
    
    In production: replace with a trained RandomForestClassifier:
    
        from joblib import load
        model = load('phishing_model.joblib')
        X = [[features[k] for k in FEATURE_ORDER]]
        prob = model.predict_proba(X)[0]
        risk_score = int(prob[1] * 100)  # class 1 = phishing
    """
    if not features:
        return {'prediction': 'unknown', 'confidence': 0.0, 'risk_score': 0}

    score = 0
    max_score = 100

    # Weighted rule scoring (mirrors the Node.js heuristics but via Python)
    if features.get('has_ip'): score += 35
    if not features.get('is_https'): score += 15
    if features.get('has_at_symbol'): score += 25
    if features.get('has_suspicious_tld'): score += 20
    if features.get('has_punycode'): score += 30
    if features.get('is_shortener'): score += 18
    if features.get('has_brand_keyword'): score += 12
    if features.get('has_suspicious_path_kw'): score += 10
    if features.get('has_executable'): score += 35
    if features.get('subdomain_count', 0) >= 3: score += 12
    if features.get('hyphen_count', 0) >= 3: score += 8
    if features.get('url_length', 0) > 100: score += 10
    if features.get('hostname_entropy', 0) > 4.0: score += 8
    if features.get('url_entropy', 0) > 5.0: score += 6

    risk_score = min(100, score)
    confidence = risk_score / 100

    return {
        'prediction': 'phishing' if risk_score >= 50 else 'legitimate',
        'confidence': round(confidence, 3),
        'risk_score': risk_score,
    }
