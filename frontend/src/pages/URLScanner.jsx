import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, AlertCircle, Zap } from 'lucide-react'
import { analysisApi, scanUrl as publicScanUrl } from '../utils/api'
import { isValidUrl } from '../utils/validators'
import ScanResults from '../components/ScanResults'
import LoadingScanner from '../components/LoadingScanner'
import { useAuth } from '../context/AuthContext'

export default function URLScanner({ isDashboard = false }) {
  const [url, setUrl]       = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { user }            = useAuth()
  const location            = useLocation()

  useEffect(() => { if (location.state?.prefill) setUrl(location.state.prefill) }, [location.state])

  const handleScan = async () => {
    setError('')
    if (!url.trim()) { setError('Please enter a URL to scan.'); return }
    if (!isValidUrl(url)) { setError('Please enter a valid URL (e.g. https://example.com).'); return }
    setLoading(true); setResult(null)
    try {
      // Use authenticated API if logged in (saves history), else public
      const data = user && !user.isGuest ? await analysisApi.scanUrl(url) : await publicScanUrl(url)
      // Normalize response fields
      setResult({ ...data, riskScore: data.riskScore, status: data.result ? (data.result.charAt(0).toUpperCase() + data.result.slice(1)).replace('Fraud','Dangerous') : data.status, findings: data.reasons?.map(t => ({ type: data.result === 'fraud' ? 'danger' : data.result === 'suspicious' ? 'warning' : 'safe', text: t })) || data.findings || [] })
    } catch (err) { setError(err.message || 'Scan failed. Please try again.') }
    finally { setLoading(false) }
  }

  const handleReset = () => { setResult(null); setUrl(''); setError('') }

  return (
    <div className={isDashboard ? '' : 'relative z-10 min-h-screen pt-28 pb-16 px-6'}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono mb-5">
            <Globe className="w-3.5 h-3.5" /> URL Threat Scanner
          </div>
          <h1 className="font-display font-800 text-4xl text-white mb-3">Analyze Any Link</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Paste any suspicious URL and get an instant phishing risk score with detailed findings.</p>
          {user && !user.isGuest && <p className="text-green-400/70 text-xs font-mono mt-2">✓ Results will be saved to your history</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-cyber p-8">
          {!result && !loading && (
            <>
              <div className="space-y-4">
                <label className="text-slate-400 text-xs font-mono uppercase tracking-widest">URL to Analyze</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type="text" value={url} onChange={e => { setUrl(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleScan()}
                    placeholder="https://suspicious-site.example.com/login"
                    className="input-cyber w-full pl-11 pr-4 py-4 rounded-xl text-sm" autoFocus />
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleScan}
                  className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm">
                  <Zap className="w-5 h-5 relative z-10" /><span className="relative z-10">Analyze URL</span>
                </motion.button>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-slate-700 text-xs font-mono mb-3">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {['http://paypal-secure-login.tk/verify','https://192.168.1.1/bank-login','https://google.com','https://bit.ly/3xample'].map(ex => (
                    <button key={ex} onClick={() => setUrl(ex)}
                      className="px-3 py-1.5 rounded-lg bg-white/3 border border-white/8 text-slate-600 hover:text-slate-300 hover:border-cyber-cyan/20 transition-all text-xs font-mono truncate max-w-[200px]">
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {loading && <LoadingScanner type="url" />}
          <AnimatePresence>{result && !loading && <ScanResults result={result} type="url" onReset={handleReset} />}</AnimatePresence>
        </motion.div>

        {!result && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['HTTPS Check','IP Detection','Domain Spoofing','Suspicious TLDs','URL Length','Path Keywords','Brand Mimicry','Punycode Attack'].map(item => (
              <div key={item} className="bg-white/2 border border-white/5 rounded-xl px-3 py-2 text-center">
                <p className="text-slate-600 text-xs font-mono">{item}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
