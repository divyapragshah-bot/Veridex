import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Shield, Eye, Moon, Globe, Save } from 'lucide-react'

const sections = [
  {
    title: 'Notifications', icon: Bell, color: '#00d4ff',
    settings: [
      { key: 'threatAlerts', label: 'Threat Alerts', desc: 'Notify when a high-risk scan is detected', default: true },
      { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly threat summary', default: true },
      { key: 'newFeatures', label: 'New Features', desc: 'Updates about new Veridex features', default: false },
    ]
  },
  {
    title: 'Privacy & Security', icon: Shield, color: '#8b5cf6',
    settings: [
      { key: 'saveHistory', label: 'Save Scan History', desc: 'Keep a record of your scan results', default: true },
      { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve Veridex (anonymous)', default: false },
      { key: 'autoScan', label: 'Auto-analyze Clipboard', desc: 'Detect URLs copied to clipboard', default: false },
    ]
  },
  {
    title: 'Display', icon: Eye, color: '#ec4899',
    settings: [
      { key: 'darkMode', label: 'Dark Mode', desc: 'Always use dark theme', default: true },
      { key: 'animations', label: 'Animations', desc: 'Enable UI animations and transitions', default: true },
      { key: 'compactView', label: 'Compact View', desc: 'Reduce spacing in scan results', default: false },
    ]
  },
]

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(() => {
    const defaults = {}
    sections.forEach(s => s.settings.forEach(({ key, default: d }) => { defaults[key] = d }))
    return defaults
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-800 text-2xl text-white mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyber-cyan" />Settings
        </h1>
        <p className="text-slate-500 text-sm">Customize your Veridex experience</p>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }} className="card-cyber p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}>
              <section.icon className="w-4 h-4" style={{ color: section.color }} />
            </div>
            <h3 className="font-display font-700 text-white">{section.title}</h3>
          </div>
          <div className="space-y-4">
            {section.settings.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">{label}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{desc}</p>
                </div>
                <button onClick={() => toggle(key)}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                  style={{ background: prefs[key] ? 'linear-gradient(135deg,#00d4ff,#8b5cf6)' : 'rgba(255,255,255,0.1)' }}>
                  <motion.div animate={{ x: prefs[key] ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="flex items-center justify-between">
        {saved && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-green-400 text-sm">
            ✓ Settings saved
          </motion.p>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
          className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2 ml-auto">
          <Save className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Save Settings</span>
        </motion.button>
      </div>
    </div>
  )
}
