import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, FileSearch, AlertTriangle, TrendingUp, Globe, Mail, Shield, RefreshCw } from 'lucide-react'
import { adminApi } from '../../utils/api'

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [recentAnalyses, setRecentAnalyses] = useState([])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getStats()
      if (data.success) setStats(data.stats)
      
      const recents = await adminApi.getAnalyses({ limit: 5 })
      if (recents.success) setRecentAnalyses(recents.records)
    } catch (e) {
      // Use mock data if backend not running
      setStats({ totalUsers: 2, totalScans: 5, fraudCount: 2, suspiciousCount: 1, safeCount: 2, fraudRate: 40, urlScans: 4, emailScans: 1, flaggedUsers: 1 })
      setRecentAnalyses([
        { id: '1', type: 'url', content: 'http://paypal-secure.tk/login', result: 'fraud', userName: 'Demo User', timestamp: new Date().toISOString() },
        { id: '2', type: 'email', content: 'URGENT: Verify your account...', result: 'fraud', userName: 'Demo User', timestamp: new Date(Date.now()-3600000).toISOString() },
      ])
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }

  useEffect(() => { fetchStats() }, [])

  const statCards = stats ? [
    { label: 'Total Users',    value: stats.totalUsers,     icon: Users,         color: '#00d4ff', sub: 'registered accounts' },
    { label: 'Total Scans',    value: stats.totalScans,     icon: FileSearch,    color: '#8b5cf6', sub: 'analyses run' },
    { label: 'Fraud Detected', value: stats.fraudCount,     icon: AlertTriangle, color: '#ff3366', sub: `${stats.fraudRate}% fraud rate` },
    { label: 'Flagged Users',  value: stats.flaggedUsers,   icon: Shield,        color: '#ffaa00', sub: 'users with fraud history' },
  ] : []

  const chartData = stats ? [
    { label: 'Safe',       value: stats.safeCount,       color: '#00ff88', pct: stats.totalScans ? Math.round(stats.safeCount / stats.totalScans * 100) : 0 },
    { label: 'Suspicious', value: stats.suspiciousCount, color: '#ffaa00', pct: stats.totalScans ? Math.round(stats.suspiciousCount / stats.totalScans * 100) : 0 },
    { label: 'Fraud',      value: stats.fraudCount,      color: '#ff3366', pct: stats.totalScans ? Math.round(stats.fraudCount / stats.totalScans * 100) : 0 },
  ] : []

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-red-500/20" style={{ borderTopColor: '#ff3366' }} />
    </div>
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-800 text-2xl text-white">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-1 font-mono">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchStats}
          className="btn-ghost px-4 py-2 rounded-xl text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />Refresh
        </motion.button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-cyber p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="font-display font-800 text-3xl text-white mb-1">{s.value}</p>
            <p className="text-slate-400 text-sm">{s.label}</p>
            <p className="text-slate-700 text-xs font-mono mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Detection breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-cyber p-6">
          <h3 className="font-display font-700 text-white mb-6">Detection Breakdown</h3>
          <div className="space-y-4">
            {chartData.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="font-mono text-sm font-700" style={{ color: item.color }}>{item.value} ({item.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-cyber-cyan" />
                <span className="text-slate-500 text-xs font-mono">URL Scans</span>
              </div>
              <p className="font-display font-700 text-xl text-cyber-cyan">{stats?.urlScans ?? 0}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-cyber-purple" />
                <span className="text-slate-500 text-xs font-mono">Email Scans</span>
              </div>
              <p className="font-display font-700 text-xl text-cyber-purple">{stats?.emailScans ?? 0}</p>
            </div>
          </div>
        </motion.div>

        {/* System status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-cyber p-6">
          <h3 className="font-display font-700 text-white mb-6">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'API Server',        status: 'Online', color: '#00ff88' },
              { label: 'In-Memory Store',   status: 'Active', color: '#00ff88' },
              { label: 'JWT Auth',          status: 'Enabled', color: '#00ff88' },
              { label: 'Rate Limiting',     status: 'Active', color: '#00ff88' },
              { label: 'Database',          status: 'Not Used', color: '#ffaa00' },
              { label: 'Email OTP',         status: 'Mock Mode', color: '#ffaa00' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-slate-400 text-sm">{item.label}</span>
                <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
            <p className="text-yellow-400/80 text-xs font-mono">⚠ In-memory storage resets on server restart. Upgrade to MongoDB for persistence.</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-cyber p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-700 text-white">Recent Activity</h3>
          <Link to="/admin/analyses" className="text-cyber-cyan text-xs font-mono hover:underline">View All</Link>
        </div>
        <div className="space-y-4">
          {recentAnalyses.length > 0 ? recentAnalyses.map((a, i) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5 hover:bg-white/4 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.result === 'fraud' ? 'bg-red-500/10 text-red-400' : a.result === 'suspicious' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                  {a.type === 'url' ? <Globe className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-mono truncate max-w-md">{a.content}</p>
                  <p className="text-slate-600 text-[10px] font-mono">
                    User: <span className="text-slate-400">{a.userName}</span> · {new Date(a.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${a.result === 'fraud' ? 'bg-red-500/10 text-red-400' : a.result === 'suspicious' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                {a.result}
              </span>
            </div>
          )) : (
            <div className="text-center py-12 text-slate-600 font-mono text-sm">No recent activity detected.</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
