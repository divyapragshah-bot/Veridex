import { motion } from 'framer-motion'
import { Shield, Cpu, Globe, Lock, Users, Code } from 'lucide-react'

const tech = [
  { icon: Globe, name: 'React 18', desc: 'Frontend SPA with React Router and hooks', color: '#61dafb' },
  { icon: Cpu, name: 'Node.js + Express', desc: 'RESTful API backend with heuristic analysis engine', color: '#68a063' },
  { icon: Shield, name: 'Python (AI Layer)', desc: 'Optional ML pipeline for advanced pattern detection', color: '#ffd343' },
  { icon: Code, name: 'Tailwind CSS', desc: 'Utility-first CSS with custom cyber theme tokens', color: '#38bdf8' },
  { icon: Lock, name: 'Framer Motion', desc: 'Smooth animations, transitions, and gesture handling', color: '#a78bfa' },
  { icon: Users, name: 'jsPDF', desc: 'Client-side PDF report generation with full branding', color: '#fb7185' },
]

export default function About() {
  return (
    <div className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-cyber-cyan" strokeWidth={1.5} />
          </div>
          <h1 className="font-display font-800 text-5xl text-white mb-4">
            VERI<span className="text-cyber-cyan">DEX</span>
          </h1>
          <p className="text-cyber-cyan font-mono text-sm tracking-widest mb-6">"Verify Before You Click."</p>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Veridex is a final-year project prototype demonstrating real-time phishing detection using heuristic analysis, pattern recognition, and AI-assisted scoring — without any data storage or user accounts.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-display font-700 text-2xl text-white text-center mb-8">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tech.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-cyber p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                    <t.icon className="w-5 h-5" style={{ color: t.color }} />
                  </div>
                  <span className="font-display font-700 text-white text-sm">{t.name}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-cyber p-8">
          <h2 className="font-display font-700 text-2xl text-white mb-6">Project Scope & Architecture</h2>
          <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p><span className="text-cyber-cyan font-mono">Frontend:</span> React 18 SPA with React Router for multi-page navigation, Framer Motion for animations, Tailwind CSS for styling, and jsPDF for client-side PDF generation.</p>
            <p><span className="text-cyber-cyan font-mono">Backend:</span> Express.js REST API with stateless phishing heuristics — no database, no auth. The URL analyzer checks 13+ indicators. Email analyzer detects 10+ threat categories.</p>
            <p><span className="text-cyber-cyan font-mono">AI Layer (Python):</span> Optional Python microservice using scikit-learn or a transformer model for enhanced URL classification. Can be connected via HTTP to the Node backend.</p>
            <p><span className="text-cyber-cyan font-mono">Privacy:</span> Zero data persistence. All analysis is done in-memory and discarded after the response.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <p className="text-slate-700 text-sm font-mono">Built as a Final Year Project Prototype · Cybersecurity & Web Development</p>
          <p className="text-slate-800 text-xs font-mono mt-2">For educational and demonstration purposes only</p>
        </motion.div>
      </div>
    </div>
  )
}
