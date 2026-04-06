import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Trash2, Search, Shield, AlertTriangle, RefreshCw, CheckCircle, FileSearch, Globe, Mail } from 'lucide-react'
import { adminApi } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const { user: me } = useAuth()
  const { showToast } = useToast()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getUsers()
      if (data.success) setUsers(data.users)
    } catch {
      setUsers([
        { id: '1', name: 'Admin User', email: 'admin@veridex.com', role: 'admin', createdAt: new Date().toISOString(), isActive: true, loginCount: 3, analysisCount: 2, fraudCount: 0 },
        { id: '2', name: 'Demo User', email: 'demo@veridex.com', role: 'user', createdAt: new Date().toISOString(), isActive: true, loginCount: 7, analysisCount: 3, fraudCount: 2 },
      ])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])
  const handleDelete = async (id) => {
    try {
      await adminApi.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      showToast('User and their history deleted successfully', 'success')
    } catch (e) { showToast(e.message, 'error') }
    finally { setDeleting(null); setConfirmId(null) }
  }

  const handleViewUser = async (id) => {
    setSelectedUser(id)
    setLoadingDetail(true)
    try {
      const data = await adminApi.getUserDetails(id)
      if (data.success) setUserDetail(data)
    } catch (e) { showToast(e.message, 'error') }
    finally { setLoadingDetail(false) }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-800 text-2xl text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-red-400" />All Users
          </h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} registered accounts in memory</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchUsers}
          className="btn-ghost px-4 py-2 rounded-xl text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />Refresh
        </motion.button>
      </motion.div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
          className="input-cyber w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
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
                  {['User', 'Role', 'Scans', 'Fraud', 'Last Login', 'Visits', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-600 text-xs font-mono uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-600">{u.name} {u.id === me?.id && <span className="text-xs text-cyber-cyan">(you)</span>}</p>
                          <p className="text-slate-600 text-xs font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm font-mono">{u.analysisCount ?? 0}</td>
                    <td className="px-4 py-4">
                      {(u.fraudCount ?? 0) > 0
                        ? <span className="flex items-center gap-1 text-red-400 text-sm font-mono"><AlertTriangle className="w-3 h-3" />{u.fraudCount}</span>
                        : <span className="text-green-400 text-sm font-mono flex items-center gap-1"><CheckCircle className="w-3 h-3" />0</span>}
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-xs font-mono">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm font-mono">{u.loginCount ?? 0}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full ${u.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewUser(u.id)} className="text-xs px-2 py-1.5 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/10 transition-all font-mono">View</button>
                        {u.id !== me?.id ? (
                          confirmId === u.id ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
                                {deleting === u.id ? '...' : 'Confirm'}
                              </button>
                              <button onClick={() => setConfirmId(null)} className="text-xs px-2 py-1.5 rounded-lg text-slate-600 hover:text-white">Cancel</button>
                            </div>
                          ) : (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => setConfirmId(u.id)}
                              className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )
                        ) : (
                          <span className="text-slate-700 text-xs font-mono">—</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-sm font-mono">No users found.</div>
            )}
          </div>
        )}
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="card-cyber w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-800 text-white">
                    {loadingDetail ? 'Loading...' : userDetail?.user.name}
                  </h2>
                  <p className="text-slate-500 text-sm font-mono">{userDetail?.user.email}</p>
                </div>
                <button onClick={() => { setSelectedUser(null); setUserDetail(null) }}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loadingDetail ? (
                  <div className="flex items-center justify-center py-24"><RefreshCw className="w-8 h-8 text-red-500 animate-spin" /></div>
                ) : userDetail ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Analyses', value: userDetail.user.analysisCount, color: '#00d4ff' },
                        { label: 'Fraud Results', value: userDetail.user.fraudCount, color: '#ff3366' },
                        { label: 'Total Visits', value: userDetail.user.loginCount, color: '#8b5cf6' },
                        { label: 'Status', value: userDetail.user.isActive ? 'Active' : 'Inactive', color: userDetail.user.isActive ? '#00ff88' : '#ff3366' },
                      ].map(s => (
                        <div key={s.label} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <p className="text-slate-500 text-xs font-mono uppercase mb-1">{s.label}</p>
                          <p className="text-lg font-display font-700" style={{ color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-white font-display font-700 mb-4 flex items-center gap-2">
                        <FileSearch className="w-4 h-4 text-red-400" /> Recent Scan History
                      </h3>
                      <div className="space-y-3">
                        {userDetail.analyses.length > 0 ? userDetail.analyses.map((a, i) => (
                          <div key={a.id} className="p-4 rounded-xl bg-white/2 border border-white/5 hover:bg-white/4 transition-all">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">{a.type === 'url' ? <Globe className="w-4 h-4 text-cyber-cyan" /> : <Mail className="w-4 h-4 text-cyber-purple" />}</div>
                                <div>
                                  <p className="text-slate-300 text-sm font-mono break-all">{a.content}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {a.reasons?.map((r, ri) => (
                                      <span key={ri} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-500 border border-white/5">{r}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${a.result === 'fraud' ? 'bg-red-500/10 text-red-400' : a.result === 'suspicious' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                                  {a.result}
                                </span>
                                <p className="text-[10px] text-slate-600 font-mono mt-1">{new Date(a.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 text-slate-600 font-mono text-sm border border-dashed border-white/10 rounded-xl">No scans yet.</div>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
