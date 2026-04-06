import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Shield, Zap, Mail, Globe, Lock, Eye, BookOpen, ChevronRight, ArrowRight } from 'lucide-react'

const features = [
  { icon: Globe, title: 'URL Scanner', desc: 'Deep analysis of link structure, domain reputation, and phishing heuristics in real time.', href: '/scan-url', color: '#00d4ff' },
  { icon: Mail, title: 'Email Analyzer', desc: 'Detect social engineering, urgency patterns, credential harvesting, and malicious links.', href: '/scan-email', color: '#8b5cf6' },
  { icon: Shield, title: 'Threat Scoring', desc: 'AI-powered 0-100 risk scores with detailed explanations for every detected threat.', href: '/', color: '#ec4899' },
  { icon: Lock, title: 'PDF Reports', desc: 'Download professional security reports for every scan — shareable and offline-ready.', href: '/report', color: '#00ff88' },
  { icon: Eye, title: 'No Data Stored', desc: 'Session-only processing. Your URLs and emails are never stored or logged.', href: '/', color: '#ffaa00' },
  { icon: BookOpen, title: 'Learning Hub', desc: 'Interactive phishing awareness content to train yourself against social engineering.', href: '/learning', color: '#00d4ff' },
]

const steps = [
  { num: '01', title: 'Paste Your Input', desc: 'Enter a suspicious URL or paste email content you want to verify.' },
  { num: '02', title: 'AI Analysis', desc: 'Our engine runs multi-layer heuristic analysis on structure, patterns, and domain reputation.' },
  { num: '03', title: 'Get Your Report', desc: 'Receive an instant risk score, status verdict, and detailed findings list.' },
  { num: '04', title: 'Stay Protected', desc: 'Download the PDF report and visit the Learning Hub to sharpen your instincts.' },
]

function FeatureCard({ icon: Icon, title, desc, href, color, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link to={href} className="block h-full">
        <div className="card-cyber p-6 h-full group cursor-pointer">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <h3 className="font-display font-700 text-white mb-2 text-lg">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          <div className="flex items-center gap-1 mt-4 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
            Explore <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function StepCard({ step, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-8 card-cyber p-6">
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 border border-cyber-cyan/20 flex items-center justify-center">
        <span className="font-display font-800 text-cyber-cyan text-xl">{step.num}</span>
      </div>
      <div>
        <h3 className="font-display font-700 text-white text-lg mb-1">{step.title}</h3>
        <p className="text-slate-500 text-sm">{step.desc}</p>
      </div>
      {index < steps.length - 1 && <ArrowRight className="ml-auto text-slate-700 flex-shrink-0 hidden sm:block" />}
    </motion.div>
  )
}

export default function Home() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const handleQuickScan = () => {
    if (!input.trim()) return
    const isEmail = input.includes('\n') || (input.length > 50 && !input.startsWith('http') && !input.includes('.'))
    navigate(isEmail ? '/scan-email' : '/scan-url', { state: { prefill: input } })
  }

  return (
    <div className="relative z-10">
      <section className="min-h-screen flex items-center px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                Real-time Phishing Detection Engine v2.0
              </div>
              <h1 className="font-display font-800 text-5xl lg:text-7xl leading-none text-white">
                VERIFY<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">BEFORE</span><br />
                YOU CLICK
              </h1>
              <p className="text-slate-400 text-lg mt-6 leading-relaxed max-w-md">
                Detect phishing URLs and malicious emails instantly. No account needed. No data stored.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-3">
              <div className="flex gap-3">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleQuickScan()} placeholder="Paste a URL or email to quick-scan..." className="input-cyber flex-1 px-4 py-4 rounded-xl text-sm" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleQuickScan} className="btn-primary px-6 py-4 rounded-xl flex items-center gap-2 whitespace-nowrap">
                  <Zap className="w-5 h-5 relative z-10" /><span className="relative z-10">Scan Now</span>
                </motion.button>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
                <Link to="/scan-url" className="hover:text-cyber-cyan transition-colors flex items-center gap-1"><Globe className="w-3 h-3" /> URL Scanner</Link>
                <span>·</span>
                <Link to="/scan-email" className="hover:text-cyber-purple transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> Email Analyzer</Link>
                <span>·</span>
                <span className="text-slate-700">No login required</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-8">
              {[['99.2%', 'Detection Rate'], ['<1s', 'Analysis Time'], ['0', 'Data Stored']].map(([val, label]) => (
                <div key={label}>
                  <p className="font-display font-700 text-2xl text-cyber-cyan">{val}</p>
                  <p className="text-slate-600 text-xs font-mono">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-cyber-cyan/10 blur-3xl" />
              <div className="absolute inset-10 rounded-full bg-cyber-purple/10 blur-2xl" />
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'linear' }} className="absolute rounded-full border border-dashed" style={{ inset: `${i * 20}px`, borderColor: `rgba(0,212,255,${0.15 - i * 0.04})` }} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  <svg width="160" height="180" viewBox="0 0 160 180" fill="none">
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" /></linearGradient>
                      <linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00d4ff" stopOpacity="0.1" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" /></linearGradient>
                    </defs>
                    <path d="M80 8 L148 38 L148 88 C148 128 80 172 80 172 C80 172 12 128 12 88 L12 38 Z" fill="url(#sg2)" stroke="url(#sg)" strokeWidth="2" />
                    <path d="M80 30 L128 52 L128 88 C128 116 80 148 80 148 C80 148 32 116 32 88 L32 52 Z" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
                    <motion.path d="M54 88 L72 106 L108 70" stroke="#00d4ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }} style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }} />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyber-cyan font-mono text-sm tracking-widest uppercase mb-3">What We Detect</p>
            <h2 className="font-display font-800 text-4xl text-white">Complete Threat Coverage</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-purple/3 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyber-purple font-mono text-sm tracking-widest uppercase mb-3">Process</p>
            <h2 className="font-display font-800 text-4xl text-white">How It Works</h2>
          </div>
          <div className="space-y-6">
            {steps.map((step, i) => <StepCard key={step.num} step={step} index={i} />)}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-cyber p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-cyber-purple/5 to-cyber-pink/5" />
            <div className="relative z-10">
              <h2 className="font-display font-800 text-4xl text-white mb-4">Ready to Stay Protected?</h2>
              <p className="text-slate-500 mb-8">Scan your first URL or email in seconds. No signup. No tracking.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/scan-url">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2 mx-auto sm:mx-0">
                    <Globe className="w-5 h-5 relative z-10" /><span className="relative z-10">Scan a URL</span>
                  </motion.button>
                </Link>
                <Link to="/scan-email">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-ghost px-8 py-4 rounded-xl flex items-center gap-2 mx-auto sm:mx-0">
                    <Mail className="w-5 h-5" />Analyze Email
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
