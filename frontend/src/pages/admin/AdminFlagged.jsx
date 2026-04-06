import { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Globe, Mail, User, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { adminApi } from '../../utils/api'

export default function AdminFlagged() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const fetchFlagged = async () => {
    setLoading(true)
    try {
      const d = await adminApi.getAnalyses({ result: 'fraud' })
      if (d.success) setRecords(d.records)
    } catch {
      // Mock data fallback
      setRecords([
        { id: '1', type: 'url', content: 'http://paypal-secure-verify.tk/login', result: 'fraud', reasons: ['Suspicious TLD .tk', 'Brand mimicry: paypal', 'HTTP not HTTPS'], timestamp: new Date().toISOString(), userName: 'Demo User', userEmail: 'demo@veridex.com' },
        { id: '2', type: 'email', content: 'URGENT: Your account will be suspended. Click here to verify: http://bit.ly/xyz', result: 'fraud', reasons: ['Urgency language', 'Credential harvesting', 'URL shortener'], timestamp: new Date(Date.now()-3600000).toISOString(), userName: 'Demo User', userEmail: 'demo@veridex.com' },
      ])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchFlagged() }, [])

  return (
    <div className="space-y-6">
      <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />Flagged Activities
          </h1>
          <p className="text-slate-500 text-sm mt-1">{records.length} fraud-level detections recorded</p>
        </div>
      </m.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <m.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-red-500/20" style={{ borderTopColor: '#ff3366' }} />
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((r, i) => (
            <m.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`card-cyber p-5 border-l-4 transition-all ${expandedId === r.id ? 'bg-white/5' : 'hover:bg-white/3'}`}
              style={{ borderLeftColor: '#ff3366' }}>
              
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 border border-red-500/20`}>
                  {r.type === 'url' ? <Globe className="w-5 h-5 text-red-400" /> : <Mail className="w-5 h-5 text-red-400" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="badge-danger px-2 py-0.5 rounded-full text-[10px] font-mono">FRAUD DETECTED</span>
                      <span className="text-slate-500 text-xs font-mono uppercase">{r.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(r.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <p className={`text-slate-200 text-sm font-mono mb-3 break-all ${expandedId === r.id ? '' : 'line-clamp-1'}`}>
                    {r.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                        <User className="w-3 h-3" />
                        <span className="text-slate-400">{r.userName || 'Anonymous'}</span>
                      </div>
                    </div>
                    
                    <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      className="text-xs text-cyber-cyan hover:text-white font-mono flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-cyber-cyan/10 transition-all">
                      {expandedId === r.id ? 'Show Less' : 'Show Details'}
                      {expandedId === r.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {expandedId === r.id && (
                    <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-white/5">
                      <h4 className="text-slate-500 text-[10px] font-mono uppercase mb-2 tracking-wider">Detection Reasons</h4>
                      <div className="flex flex-wrap gap-2">
                        {r.reasons?.map((reason, ri) => (
                          <span key={ri} className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg">
                            {reason}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 p-3 rounded-lg bg-black/20 border border-white/5">
                         <p className="text-slate-600 text-[10px] font-mono uppercase mb-1">User Email</p>
                         <p className="text-slate-400 text-xs font-mono">{r.userEmail || 'N/A'}</p>
                      </div>
                    </m.div>
                  )}
                </div>
              </div>
            </m.div>
          ))}
          {records.length === 0 && (
            <div className="card-cyber p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <Clock className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-white font-display font-700 text-xl mb-2">No Flagged Activities</p>
              <p className="text-slate-600 text-sm font-mono max-w-xs mx-auto">All recent scans are below the fraud threshold. The platform is currently "clean."</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
