import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, AlertCircle, Zap } from 'lucide-react'
import { analysisApi, scanEmail as publicScanEmail } from '../utils/api'
import ScanResults from '../components/ScanResults'
import LoadingScanner from '../components/LoadingScanner'
import { useAuth } from '../context/AuthContext'

const SAMPLE_EMAIL = `Subject: URGENT: Your account has been compromised!

Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be SUSPENDED within 24 hours if you do not verify your information immediately.

Click here to verify your account now:
http://paypal-secure-verify.tk/login?ref=urgent

Please provide your username and password to confirm your identity and avoid legal action.

This is your FINAL NOTICE. Act now before it's too late!

PayPal Security Team
support@paypal-helpdesk.com`

function highlightText(text, highlights) {
  if (!highlights || highlights.length === 0) return text
  let result = text
  highlights.forEach(kw => {
    const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    result = result.replace(regex, `<mark class="highlight-danger">$1</mark>`)
  })
  return result
}

export default function EmailAnalyzer({ isDashboard = false }) {
  const [content, setContent] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [showHighlights, setShowHighlights] = useState(false)
  const { user }              = useAuth()
  const location              = useLocation()

  useEffect(() => { if (location.state?.prefill) setContent(location.state.prefill) }, [location.state])

  const handleScan = async () => {
    setError('')
    if (!content.trim()) { setError('Please paste email content to analyze.'); return }
    if (content.trim().length < 20) { setError('Email content is too short.'); return }
    setLoading(true); setResult(null)
    try {
      const data = user && !user.isGuest ? await analysisApi.scanEmail(content) : await publicScanEmail(content)
      setResult({ ...data, riskScore: data.riskScore, status: data.result ? (data.result.charAt(0).toUpperCase() + data.result.slice(1)).replace('Fraud','Dangerous') : data.status, findings: data.reasons?.map(t => ({ type: data.result === 'fraud' ? 'danger' : data.result === 'suspicious' ? 'warning' : 'safe', text: t })) || data.findings || [] })
      setShowHighlights(true)
    } catch (err) { setError(err.message || 'Analysis failed.') }
    finally { setLoading(false) }
  }

  const handleReset = () => { setResult(null); setContent(''); setError(''); setShowHighlights(false) }

  return (
    <div className={isDashboard ? '' : 'relative z-10 min-h-screen pt-28 pb-16 px-6'}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-purple/20 bg-cyber-purple/5 text-cyber-purple text-xs font-mono mb-5">
            <Mail className="w-3.5 h-3.5" /> Email Phishing Analyzer
          </div>
          <h1 className="font-display font-800 text-4xl text-white mb-3">Analyze Suspicious Emails</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Paste email content to detect social engineering, threats, and phishing patterns.</p>
          {user && !user.isGuest && <p className="text-green-400/70 text-xs font-mono mt-2">✓ Results will be saved to your history</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-cyber p-8">
          {!result && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 text-xs font-mono uppercase tracking-widest">Email Content</label>
                <button onClick={() => setContent(SAMPLE_EMAIL)}
                  className="text-xs font-mono text-cyber-purple hover:text-purple-300 transition-colors border border-cyber-purple/20 px-3 py-1 rounded-lg hover:bg-cyber-purple/10">
                  Load Sample Phishing Email
                </button>
              </div>
              <textarea value={content} onChange={e => { setContent(e.target.value); setError('') }}
                placeholder="Paste the full email content here..." rows={12}
                className="input-cyber w-full px-4 py-4 rounded-xl text-sm font-mono resize-none leading-relaxed" />
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleScan}
                className="w-full py-4 rounded-xl text-sm font-display font-600 flex items-center justify-center gap-2 text-white"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                <Zap className="w-5 h-5" />Analyze Email
              </motion.button>
            </div>
          )}
          {loading && <LoadingScanner type="email" />}
          <AnimatePresence>
            {result && !loading && (
              <div className="space-y-6">
                {showHighlights && result.highlights?.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Highlighted Content</p>
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-400 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: highlightText(content, result.highlights) }} />
                  </motion.div>
                )}
                <ScanResults result={result} type="email" onReset={handleReset} />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
