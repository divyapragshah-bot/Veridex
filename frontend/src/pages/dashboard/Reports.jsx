import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Globe, Mail, Download, Search, Trash2, RefreshCw } from 'lucide-react'
import { analysisApi } from '../../utils/api'
import { generatePDFReport } from '../../utils/pdfGenerator'
import { useAuth } from '../../context/AuthContext'

const resultBadge = { safe: 'badge-safe', suspicious: 'badge-warning', fraud: 'badge-danger' }
const resultColor = { safe: '#00ff88', suspicious: '#ffaa00', fraud: '#ff3366' }

export default function Reports() {
  const { user } = useAuth()
  const [records, setRecords]   = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch]     = useState('')
  const [downloading, setDownloading] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchRecords = async () => {
    setLoading(true)
    try {
      if (user?.isGuest) { setRecords([]); setTotal(0); return }
      const params = {}
      if (filter !== 'all') params.result = filter
      if (typeFilter !== 'all') params.type = typeFilter
      if (search) params.search = search
      const data = await analysisApi.getHistory(params)
      if (data.success) { setRecords(data.records); setTotal(data.total) }
    } catch { setRecords([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchRecords() }, [filter, typeFilter])

  const handleSearch = (e) => { if (e.key === 'Enter') fetchRecords() }

  const handleDownload = async (r) => {
    setDownloading(r.id)
    const fakeResult = { input: r.content, riskScore: r.result === 'fraud' ? 80 : r.result === 'suspicious' ? 45 : 5, status: r.result.charAt(0).toUpperCase() + r.result.slice(1), scanId: r.id, timestamp: r.timestamp, findings: r.reasons?.map(t => ({ type: r.result === 'fraud' ? 'danger' : r.result === 'suspicious' ? 'warning' : 'safe', text: t })) || [], metadata: {} }
    try { await generatePDFReport(fakeResult, r.type) } catch {}
    setDownloading(null)
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await analysisApi.deleteRecord(id)
      setRecords(prev => prev.filter(r => r.id !== id))
      setTotal(t => t - 1)
    } catch (e) { alert(e.message) }
    finally { setDeleting(null) }
  }

  const summaryStats = {
    safe: records.filter(r => r.result === 'safe').length,
    suspicious: records.filter(r => r.result === 'suspicious').length,
    fraud: records.filter(r => r.result === 'fraud').length,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-800 text-2xl text-white mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyber-cyan" />My Reports
        </h1>
        <p className="text-slate-500 text-sm">Your personal scan history — stored in-memory (resets on server restart)</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {[['Safe', summaryStats.safe, '#00ff88'], ['Suspicious', summaryStats.suspicious, '#ffaa00'], ['Fraud', summaryStats.fraud, '#ff3366']].map(([label, val, color]) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-cyber p-4 text-center">
            <p className="font-display font-700 text-2xl" style={{ color }}>{val}</p>
            <p className="text-slate-500 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
            placeholder="Search (Enter to search)..."
            className="input-cyber w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'safe', 'suspicious', 'fraud'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${filter === f ? 'bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan' : 'border border-white/10 text-slate-500 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['all', 'url', 'email'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${typeFilter === t ? 'bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple' : 'border border-white/10 text-slate-500 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={fetchRecords} className="p-2.5 rounded-xl border border-white/10 text-slate-600 hover:text-white hover:border-cyber-cyan/20 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-cyber overflow-hidden">
        {user?.isGuest ? (
          <div className="text-center py-16 px-6">
            <p className="text-slate-500 text-sm mb-3">Guest users cannot save scan history.</p>
            <a href="/signup" className="text-cyber-cyan text-sm underline">Create a free account to track your scans.</a>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full border-2 border-cyber-cyan/20" style={{ borderTopColor: '#00d4ff' }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Type', 'Content', 'Result', 'Reason', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-600 text-xs font-mono uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: r.type === 'url' ? 'rgba(0,212,255,0.1)' : 'rgba(139,92,246,0.1)' }}>
                        {r.type === 'url' ? <Globe className="w-3.5 h-3.5 text-cyber-cyan" /> : <Mail className="w-3.5 h-3.5 text-cyber-purple" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs"><p className="text-slate-400 text-xs font-mono truncate">{r.content}</p></td>
                    <td className="px-4 py-3">
                      <span className={`${resultBadge[r.result]} px-2 py-0.5 rounded-full text-xs font-mono capitalize`}>{r.result}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs max-w-xs">
                      <p className="truncate">{r.reasons?.[0] || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownload(r)} disabled={downloading === r.id}
                          className="btn-ghost px-2 py-1.5 rounded-lg text-xs flex items-center gap-1">
                          {downloading === r.id ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-3 h-3 border border-cyber-cyan/30 border-t-cyber-cyan rounded-full" /> : <Download className="w-3 h-3" />}
                        </motion.button>
                        <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          {deleting === r.id ? '...' : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {records.length === 0 && <div className="text-center py-12 text-slate-600 text-sm font-mono">No records found.</div>}
          </div>
        )}
      </motion.div>
    </div>
  )
}
