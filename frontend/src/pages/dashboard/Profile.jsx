import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Edit2, Save, Clock, Globe, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const stats = [
    { icon: Globe, label: 'URLs Scanned', value: '89', color: '#00d4ff' },
    { icon: Mail, label: 'Emails Analyzed', value: '38', color: '#8b5cf6' },
    { icon: AlertTriangle, label: 'Threats Found', value: '23', color: '#ff3366' },
    { icon: Shield, label: 'Scans Safe', value: '87', color: '#00ff88' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-800 text-2xl text-white mb-1">My Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account information</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-cyber p-8">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-2xl font-bold">
              {user?.avatar || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-cyber-card" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {editing ? (
                <input value={name} onChange={e => setName(e.target.value)}
                  className="input-cyber px-3 py-2 rounded-lg text-lg font-display font-700" />
              ) : (
                <h2 className="font-display font-700 text-2xl text-white">{user?.name}</h2>
              )}
              <span className="badge-safe px-3 py-1 rounded-full text-xs font-mono">{user?.role}</span>
              {user?.isGuest && <span className="badge-warning px-3 py-1 rounded-full text-xs font-mono">Guest</span>}
            </div>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />{user?.email}
            </p>
            <p className="text-slate-600 text-xs mt-2 font-mono flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Session started: {user?.loginTime ? new Date(user.loginTime).toLocaleString() : 'N/A'}
            </p>
          </div>

          <button onClick={() => editing ? handleSave() : setEditing(true)}
            className={`btn-${editing ? 'primary' : 'ghost'} px-4 py-2 rounded-xl text-sm flex items-center gap-2 flex-shrink-0`}>
            {editing ? <><Save className="w-4 h-4 relative z-10" /><span className="relative z-10">Save</span></> : <><Edit2 className="w-4 h-4" />Edit</>}
          </button>
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            ✓ Profile updated successfully
          </motion.div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }} className="card-cyber p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <p className="font-display font-700 text-xl text-white">{value}</p>
            <p className="text-slate-600 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Account info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-cyber p-6">
        <h3 className="font-display font-700 text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-cyber-cyan" />Account Details</h3>
        <div className="space-y-3">
          {[
            ['Full Name', user?.name],
            ['Email', user?.email],
            ['Role', user?.role],
            ['Account Type', user?.isGuest ? 'Guest (Session Only)' : 'Registered User'],
            ['Member Since', '2026'],
          ].map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-slate-500 text-sm">{key}</span>
              <span className="text-slate-300 text-sm font-mono">{val}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
