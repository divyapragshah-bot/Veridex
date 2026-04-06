import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileSearch, Trash2, Search, Globe, Mail, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '../../utils/api'
import { useToast } from '../../context/ToastContext'

const resultBadge = { safe: 'badge-safe', suspicious: 'badge-warning', fraud: 'badge-danger' }
const resultColor = { safe: '#00ff88', suspicious: '#ffaa00', fraud: '#ff3366' }

export default function AdminAnalyses() {
  const [records, setRecords] = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const { showToast } = useToast()
  const fetch_ = async () => {
    try {
      const params = { page, limit }
      if (filter !== 'all') params.result = filter
      if (typeFilter !== 'all') params.type = typeFilter
      const data = await adminApi.getAnalyses(params)
      if (data.success) { setRecords(data.records); setTotal(data.total) }
    } catch {
      // Mock data...
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch_() }, [filter, typeFilter, page])
  const handleDelete = async (id) => {
    try {
      await adminApi.deleteAnalysis(id)
      setRecords(prev => prev.filter(r => r.id !== id))
      setTotal(t => t - 1)
      showToast('Analysis record deleted successfully', 'success')
    } catch (e) { showToast(e.message, 'error') }
    finally { setDeleting(null); setConfirmId(null) }
  }

  const filtered = records.filter(r =>
    r.content.toLowerCase().includes(search.toLowerCase()) ||
    (r.userName || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-red-400" />All Analyses
          </h1>
          <p className="text-slate-500 text-sm mt-1">{total} total records across all users</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetch_}
          className="btn-ghost px-4 py-2 rounded-xl text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />Refresh
        </motion.button>
      </motion.div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content or user..."
            className="input-cyber w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2">
          {['all','safe','suspicious','fraud'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${filter === f ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'border border-white/10 text-slate-500 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['all','url','email'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${typeFilter === t ? 'bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan' : 'border border-white/10 text-slate-500 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-cyber overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full border-2 border-red-500/20" style={{ borderTopColor: '#ff3366' }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Type', 'Content & Reasons', 'Result', 'User', 'Time', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-600 text-xs font-mono uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className={`border-b border-white/3 hover:bg-white/2 transition-colors ${r.flagged ? 'border-l-2 border-l-red-500/40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: r.type === 'url' ? 'rgba(0,212,255,0.1)' : 'rgba(139,92,246,0.1)' }}>
                        {r.type === 'url' ? <Globe className="w-3.5 h-3.5 text-cyber-cyan" /> : <Mail className="w-3.5 h-3.5 text-cyber-purple" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="group cursor-pointer" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                        <p className={`text-slate-400 text-xs font-mono ${expandedId === r.id ? '' : 'truncate'}`}>{r.content}</p>
                        <div className={`mt-2 flex flex-wrap gap-1 ${expandedId === r.id ? '' : 'max-h-5 overflow-hidden'}`}>
                          {r.reasons?.map((reason, ri) => (
                            <span key={ri} className="text-[10px] font-mono bg-white/5 text-slate-500 border border-white/5 px-1.5 py-0.5 rounded">
                              {reason}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-cyber-cyan mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                          {expandedId === r.id ? 'Click to collapse' : 'Click to see full content & reasons'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${resultBadge[r.result]} px-2 py-0.5 rounded-full text-xs font-mono capitalize`}>{r.result}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-400 text-xs">{r.userName}</p>
                      <p className="text-slate-700 text-xs font-mono">{r.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {confirmId === r.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                            className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                            {deleting === r.id ? '...' : 'Delete'}
                          </button>
                          <button onClick={() => setConfirmId(null)} className="text-xs text-slate-600 hover:text-white">×</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(r.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-slate-600 text-sm font-mono">No records found.</div>}
          </div>
        )}
      </motion.div>

      {/* Pagination Controls */}
      {!loading && total > limit && (
        <div className="flex items-center justify-between px-4 py-3 bg-white/2 rounded-xl border border-white/5">
          <p className="text-slate-500 text-xs font-mono">
            Showing <span className="text-white">{(page-1)*limit + 1}</span> to <span className="text-white">{Math.min(page*limit, total)}</span> of <span className="text-white">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-mono text-xs px-3">{page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
