import { motion } from 'framer-motion'
import { Activity, Globe, Mail, LogIn, LogOut, Settings, User, Shield } from 'lucide-react'

const logs = [
  { icon: LogIn, label: 'Logged in', detail: 'Session started', time: 'Just now', color: '#00ff88' },
  { icon: Globe, label: 'URL Scanned', detail: 'http://paypal-secure-verify.tk/login → DANGEROUS (82%)', time: '2m ago', color: '#ff3366' },
  { icon: Mail, label: 'Email Analyzed', detail: 'Subject: URGENT account suspension → SUSPICIOUS (61%)', time: '15m ago', color: '#ffaa00' },
  { icon: Globe, label: 'URL Scanned', detail: 'https://google.com → SAFE (4%)', time: '1h ago', color: '#00ff88' },
  { icon: Globe, label: 'URL Scanned', detail: 'https://bit.ly/3xFakeLink → SUSPICIOUS (45%)', time: '2h ago', color: '#ffaa00' },
  { icon: Mail, label: 'Email Analyzed', detail: 'Subject: You won $5000! → DANGEROUS (91%)', time: '3h ago', color: '#ff3366' },
  { icon: Settings, label: 'Settings Updated', detail: 'Notification preferences changed', time: '1d ago', color: '#00d4ff' },
  { icon: User, label: 'Profile Viewed', detail: 'Account details page visited', time: '1d ago', color: '#8b5cf6' },
  { icon: Globe, label: 'URL Scanned', detail: 'https://amazon.com → SAFE (6%)', time: '2d ago', color: '#00ff88' },
  { icon: LogIn, label: 'Logged in', detail: 'Previous session', time: '2d ago', color: '#00d4ff' },
]

export default function ActivityLog() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-800 text-2xl text-white mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-cyan" />Activity Log
        </h1>
        <p className="text-slate-500 text-sm">Your complete session activity history</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[['7', 'URL Scans', '#00d4ff'], ['3', 'Email Scans', '#8b5cf6'], ['4', 'Threats Found', '#ff3366'], ['2', 'Sessions', '#00ff88']].map(([val, label, color], i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-cyber p-4 text-center">
            <p className="font-display font-700 text-2xl" style={{ color }}>{val}</p>
            <p className="text-slate-600 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-cyber p-6">
        <h3 className="font-display font-700 text-white mb-6">Recent Activity</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />
          <div className="space-y-4">
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{ background: `${log.color}15`, border: `1px solid ${log.color}30` }}>
                  <log.icon className="w-4 h-4" style={{ color: log.color }} />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-white text-sm font-600">{log.label}</p>
                    <span className="text-slate-700 text-xs font-mono">{log.time}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 font-mono break-all">{log.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
