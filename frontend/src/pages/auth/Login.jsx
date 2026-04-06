import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Shield, AlertCircle, Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ParticleBackground from '../../components/ParticleBackground'
import Footer from '../../components/Footer'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' toggle
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, loginAsGuest, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => { if (user) navigate(from, { replace: true }) }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password) { setError('Please enter your password.'); return }
    setLoading(true)
    try {
      await login(email, password, remember)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#070d1f] flex flex-col relative overflow-hidden">
      <ParticleBackground />

      {/* Binary rain background deco */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute text-cyber-cyan font-mono text-xs leading-5"
            style={{ left: `${i * 5.2}%`, top: 0, animation: `fall ${4 + i % 3}s linear ${i * 0.3}s infinite` }}>
            {Array.from({ length: 40 }).map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Cyber illustration */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:flex flex-col items-center gap-8">
            {/* Isometric shield illustration */}
            <div className="relative w-96 h-80">
              <div className="absolute inset-0 bg-cyber-cyan/5 rounded-3xl blur-3xl" />
              <div className="absolute inset-10 bg-cyber-purple/10 rounded-full blur-2xl" />
              <svg viewBox="0 0 400 320" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
                {/* Grid floor */}
                <g opacity="0.3">
                  {[0,1,2,3,4].map(i => (
                    <line key={`h${i}`} x1="40" y1={200 + i*18} x2="360" y2={200 + i*18} stroke="#00d4ff" strokeWidth="0.5" />
                  ))}
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <line key={`v${i}`} x1={40 + i*46} y1="200" x2={40 + i*46} y2="272" stroke="#00d4ff" strokeWidth="0.5" />
                  ))}
                </g>

                {/* Main shield - left */}
                <g transform="translate(60, 80)">
                  <path d="M50 10 L90 30 L90 70 C90 100 50 120 50 120 C50 120 10 100 10 70 L10 30 Z" fill="rgba(0,212,255,0.1)" stroke="#00d4ff" strokeWidth="1.5" />
                  <path d="M50 25 L75 40 L75 65 C75 85 50 100 50 100" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
                  <path d="M33 65 L45 78 L68 55" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
                </g>

                {/* Lock icon - center */}
                <g transform="translate(160, 100)">
                  <rect x="15" y="35" width="50" height="40" rx="5" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1.5" />
                  <path d="M25 35 L25 25 C25 10 55 10 55 25 L55 35" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                  <circle cx="40" cy="55" r="5" fill="#8b5cf6" opacity="0.8" />
                  <line x1="40" y1="60" x2="40" y2="68" stroke="#8b5cf6" strokeWidth="2" />
                  <ellipse cx="40" cy="80" rx="25" ry="5" fill="rgba(139,92,246,0.15)" />
                </g>

                {/* Shield right - neon pink */}
                <g transform="translate(260, 60)">
                  <path d="M45 8 L82 26 L82 65 C82 92 45 110 45 110 C45 110 8 92 8 65 L8 26 Z" fill="rgba(236,72,153,0.1)" stroke="#ec4899" strokeWidth="1.5" />
                  <circle cx="45" cy="58" r="12" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="1" />
                  <path d="M38 58 L43 63 L52 52" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>

                {/* Key */}
                <g transform="translate(140, 200)">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#ffaa00" strokeWidth="2" />
                  <circle cx="20" cy="20" r="6" fill="rgba(255,170,0,0.3)" />
                  <line x1="35" y1="20" x2="70" y2="20" stroke="#ffaa00" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="60" y1="20" x2="60" y2="28" stroke="#ffaa00" strokeWidth="2" />
                  <line x1="68" y1="20" x2="68" y2="26" stroke="#ffaa00" strokeWidth="2" />
                  <ellipse cx="20" cy="32" rx="15" ry="4" fill="rgba(255,170,0,0.1)" />
                </g>

                {/* Network nodes */}
                {[[60,50],[100,30],[320,45],[340,80],[280,170],[80,180]].map(([x,y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#00d4ff" opacity="0.6" />
                    <circle cx={x} cy={y} r="8" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
                  </g>
                ))}
                {/* Connection lines */}
                <g stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" strokeDasharray="4,4">
                  <line x1="60" y1="50" x2="100" y2="30" />
                  <line x1="100" y1="30" x2="200" y2="100" />
                  <line x1="320" y1="45" x2="300" y2="100" />
                  <line x1="280" y1="170" x2="200" y2="150" />
                </g>

                {/* Floating particles */}
                {[[50,145],[130,170],[310,140],[350,170]].map(([x,y], i) => (
                  <circle key={`p${i}`} cx={x} cy={y} r="2.5" fill={i%2===0 ? '#00d4ff' : '#8b5cf6'} opacity="0.8" />
                ))}

                {/* Data flow arrows */}
                <g stroke="#00d4ff" fill="#00d4ff" opacity="0.4">
                  <path d="M200 160 L210 155 L210 165 Z" />
                  <path d="M230 150 L240 145 L240 155 Z" />
                </g>

                {/* Text labels */}
                <text x="52" y="175" fill="#00d4ff" fontSize="8" fontFamily="monospace" opacity="0.6">SECURE ACCESS</text>
                <text x="220" y="200" fill="#8b5cf6" fontSize="8" fontFamily="monospace" opacity="0.6">DATA PROTECTION</text>
              </svg>
            </div>

            <div className="text-center">
              <h2 className="font-display font-800 text-3xl text-white mb-2">VERI<span className="text-cyber-cyan">DEX</span></h2>
              <p className="text-slate-500 text-sm font-mono">"Verify Before You Click."</p>
              <div className="flex items-center justify-center gap-6 mt-6">
                {[['🛡️', 'Phishing Detection'], ['🔍', 'URL Analysis'], ['📧', 'Email Scanner']].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span className="text-xl">{icon}</span>
                    <span className="text-slate-600 text-xs font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Auth card */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="glass-strong rounded-2xl p-8 border border-cyber-cyan/15 shadow-2xl shadow-cyber-cyan/5 max-w-md mx-auto">

              {/* LOGIN / SIGNUP toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-sm font-display font-600 transition-colors ${mode === 'login' ? 'text-cyber-cyan' : 'text-slate-600'}`}>LOGIN</span>
                <button
                  onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError('') }}
                  className="relative w-14 h-7 rounded-full transition-all duration-300"
                  style={{ background: mode === 'signup' ? 'linear-gradient(135deg,#00d4ff,#8b5cf6)' : 'rgba(0,212,255,0.3)' }}
                >
                  <motion.div
                    animate={{ x: mode === 'signup' ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  />
                </button>
                <span className={`text-sm font-display font-600 transition-colors ${mode === 'signup' ? 'text-cyber-cyan' : 'text-slate-600'}`}>SIGNUP</span>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="text-center mb-8">
                      <h1 className="font-display font-800 text-3xl text-white mb-1">WELCOME BACK</h1>
                      <p className="text-slate-500 text-sm">Sign in to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email */}
                      <div className="relative">
                        <label className="absolute -top-2.5 left-3 text-cyber-cyan text-xs font-mono bg-[#0a0a2e] px-1 z-10">EMAIL</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="demo@veridex.com"
                            className="input-cyber w-full pl-10 pr-4 py-3.5 rounded-xl text-sm border-cyber-cyan/30 focus:border-cyber-cyan"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <label className="absolute -top-2.5 left-3 text-slate-500 text-xs font-mono bg-[#0a0a2e] px-1 z-10">PASSWORD</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-cyber w-full pl-10 pr-12 py-3.5 rounded-xl text-sm"
                            autoComplete="current-password"
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember + Forgot */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-cyber-cyan rounded" />
                          <span className="text-slate-500 text-xs">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-cyber-cyan text-xs hover:text-cyan-300 transition-colors">FORGOT PASSWORD?</Link>
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Sign In button */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-4 rounded-xl text-white font-display font-700 text-base tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
                        style={{ background: 'linear-gradient(135deg, #00b4d8, #7b2ff7, #ec4899)', boxShadow: loading ? 'none' : '0 0 30px rgba(0,212,255,0.3)' }}
                      >
                        {loading ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <><LogIn className="w-5 h-5" />SIGN IN</>
                        )}
                      </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-slate-600 text-xs font-mono">OR LOGIN WITH</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Social buttons */}
                    <div className="flex justify-center gap-4 mb-5">
                      {[
                        { label: 'G', color: '#EA4335', bg: 'rgba(234,67,53,0.1)' },
                        { label: '🍎', color: '#fff', bg: 'rgba(255,255,255,0.1)' },
                        { label: 'f', color: '#1877F2', bg: 'rgba(24,119,242,0.1)' },
                      ].map(({ label, color, bg }) => (
                        <motion.button key={label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all border"
                          style={{ background: bg, borderColor: `${color}30`, color }}>
                          {label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Guest + Signup links */}
                    <div className="space-y-3 text-center">
                      <button onClick={handleGuest} className="text-slate-500 text-xs hover:text-slate-300 transition-colors underline underline-offset-2">
                        Continue as Guest
                      </button>
                      <p className="text-slate-600 text-xs">
                        DON'T HAVE AN ACCOUNT?{' '}
                        <button onClick={() => { setMode('signup'); setError('') }} className="text-cyber-cyan hover:text-cyan-300 font-600 transition-colors">SIGN UP</button>
                      </p>
                    </div>

                    {/* Demo hint */}
                    
                  </motion.div>
                ) : (
                  <motion.div key="signup-redirect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="text-center mb-6">
                      <h1 className="font-display font-800 text-3xl text-white mb-1">CREATE ACCOUNT</h1>
                      <p className="text-slate-500 text-sm">Join Veridex today</p>
                    </div>
                    <Link to="/signup">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl text-white font-display font-700 text-base tracking-widest mb-4"
                        style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
                        GO TO SIGNUP
                      </motion.button>
                    </Link>
                    <p className="text-center text-slate-600 text-xs">Already have an account? <button onClick={() => setMode('login')} className="text-cyber-cyan">Login</button></p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <style>{`
        @keyframes fall { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
      `}</style>
    </div>
  )
}
