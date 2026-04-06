import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Mail, Shield, AlertTriangle, TrendingUp, Clock, Zap, ChevronRight, Activity, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { analysisApi } from '../../utils/api'
import RiskMeter from '../../components/RiskMeter'

function StatusBadge({ result }) {
  const map = { safe: 'badge-safe', suspicious: 'badge-warning', fraud: 'badge-danger' }
  return <span className={`${map[result] || 'badge-safe'} px-2 py-0.5 rounded-full text-xs font-mono capitalize`}>{result}</span>
}

export default function DashboardHome() {
  const { user } = useAuth()
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [time, setTime]         = useState(new Date())

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      if (!user?.isGuest) {
        const data = await analysisApi.getHistory({ limit: 5 })
        if (data.success) setHistory(data.records)
      }
    } catch { /* keep empty */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchHistory() }, [user])

  const hour = time.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const fraud = history.filter(r => r.result === 'fraud').length
  const suspicious = history.filter(r => r.result === 'suspicious').length
  const safe = history.filter(r => r.result === 'safe').length
  const riskScore = history.length > 0 ? Math.round((fraud * 100 + suspicious * 50) / (history.length * 100) * 100) : 0

  const statsCards = [
    { label: 'Total Scans',    value: history.length || 0, icon: Shield,        color: '#00d4ff' },
    { label: 'Threats Found',  value: fraud,                icon: AlertTriangle, color: '#ff3366' },
    { label: 'URLs Scanned',   value: history.filter(r => r.type === 'url').length,   icon: Globe, color: '#8b5cf6' },
    { label: 'Emails Analyzed',value: history.filter(r => r.type === 'email').length, icon: Mail,  color: '#ec4899' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-800 text-2xl text-white">
              {greeting}, <span className="text-cyber-cyan">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-mono flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />{time.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' })}
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'admin' && (
              <Link to="/admin">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2.5 rounded-xl text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2">
                  <Shield className="w-4 h-4" />Admin Panel
                </motion.button>
              </Link>
            )}
            <Link to="/dashboard/scan-url">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 relative z-10" /><span className="relative z-10">Quick Scan</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {user?.isGuest && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-400/80 text-sm">You're browsing as a guest. <Link to="/signup" className="text-cyber-cyan underline">Create an account</Link> to save your scan history.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-cyber p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400 opacity-60" />
            </div>
            <p className="font-display font-800 text-3xl text-white mb-1">{s.value}</p>
            <p className="text-slate-500 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-cyber p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-cyber-cyan" /><h3 className="font-display font-700 text-white">Recent Scans</h3></div>
            <button onClick={fetchHistory} className="text-slate-600 hover:text-cyber-cyan transition-colors"><RefreshCw className="w-4 h-4" /></button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-6 h-6 rounded-full border-2 border-cyber-cyan/20" style={{ borderTopColor: '#00d4ff' }} />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm mb-3">No scans yet.</p>
              <Link to="/dashboard/scan-url"><button className="btn-primary px-5 py-2 rounded-xl text-sm"><span className="relative z-10">Run Your First Scan</span></button></Link>
            </div>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 5).map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: s.type === 'url' ? 'rgba(0,212,255,0.1)' : 'rgba(139,92,246,0.1)', border: `1px solid ${s.type === 'url' ? 'rgba(0,212,255,0.2)' : 'rgba(139,92,246,0.2)'}` }}>
                    {s.type === 'url' ? <Globe className="w-4 h-4 text-cyber-cyan" /> : <Mail className="w-4 h-4 text-cyber-purple" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm font-mono truncate">{s.content}</p>
                    <p className="text-slate-600 text-xs font-mono mt-0.5">{new Date(s.timestamp).toLocaleString()}</p>
                  </div>
                  <StatusBadge result={s.result} />
                </motion.div>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <Link to="/dashboard/reports" className="flex items-center gap-1 text-cyber-cyan text-xs font-mono mt-4 hover:text-cyan-300">
              View all history <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-cyber p-6 flex flex-col items-center justify-center">
          <h3 className="font-display font-700 text-white mb-2 text-center">Session Risk</h3>
          <p className="text-slate-600 text-xs font-mono mb-6 text-center">Based on your scan history</p>
          <RiskMeter score={riskScore} size={130} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/dashboard/scan-url',   icon: Globe,  label: 'Scan a URL',    desc: 'Check any link for threats',    color: '#00d4ff' },
          { to: '/dashboard/scan-email', icon: Mail,   label: 'Analyze Email', desc: 'Detect phishing content',       color: '#8b5cf6' },
          { to: '/dashboard/learning',   icon: Shield, label: 'Learning Hub',  desc: 'Improve your awareness',        color: '#00ff88' },
        ].map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to}>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} className="card-cyber p-5 cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div><p className="text-white text-sm font-600">{label}</p><p className="text-slate-600 text-xs mt-0.5">{desc}</p></div>
              <ChevronRight className="ml-auto w-4 h-4 text-slate-700" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
