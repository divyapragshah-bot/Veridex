import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ParticleBackground from '../../components/ParticleBackground'
import Footer from '../../components/Footer'
import { isValidEmail } from '../../utils/validators'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signup, loginAsGuest } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })) }

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Full name is required (min 2 chars).'
    if (!form.email.trim()) errs.email = 'Email address is required.'
    else if (!isValidEmail(form.email)) errs.email = 'Please enter a valid email address.'
    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (!form.confirm) errs.confirm = 'Please confirm your password.'
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form.name.trim(), form.email.trim(), form.password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setErrors({ global: err.message })
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#ff3366', '#ffaa00', '#00d4ff', '#00ff88'][strength]

  const fields = [
    { key: 'name', label: 'FULL NAME', placeholder: 'Diyansh Shah', type: 'text', icon: User, show: null },
    { key: 'email', label: 'EMAIL ADDRESS', placeholder: 'Diyansh@example.com', type: 'email', icon: Mail, show: null },
    { key: 'password', label: 'PASSWORD', placeholder: '••••••••', type: 'password', icon: Lock, show: showPass, toggle: () => setShowPass(s => !s) },
    { key: 'confirm', label: 'CONFIRM PASSWORD', placeholder: '••••••••', type: 'password', icon: Lock, show: showConfirm, toggle: () => setShowConfirm(s => !s) },
  ]

  if (success) {
    return (
      <div className="min-h-screen bg-[#070d1f] flex flex-col">
        <ParticleBackground />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl p-12 border border-green-500/20 text-center max-w-md mx-4">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="font-display font-800 text-2xl text-white mb-2">Account Created!</h2>
            <p className="text-slate-500 text-sm mb-4">Redirecting you to login...</p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} className="h-full bg-green-400 rounded-full" />
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070d1f] flex flex-col relative overflow-hidden">
      <ParticleBackground />

      <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/20 flex items-center justify-center">
                <span className="text-cyber-cyan text-xs font-bold">V</span>
              </div>
              <span className="font-display font-800 text-xl text-white">VERI<span className="text-cyber-cyan">DEX</span></span>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-8 border border-cyber-purple/15 shadow-2xl shadow-cyber-purple/5">
            {/* Header */}
            <div className="text-center mb-7">
              <h1 className="font-display font-800 text-3xl text-white mb-1">CREATE ACCOUNT</h1>
              <p className="text-slate-500 text-sm">Join Veridex — protect yourself online</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map(({ key, label, placeholder, type, icon: Icon, show, toggle }) => (
                <div key={key} className="relative">
                  <label className="absolute -top-2.5 left-3 text-xs font-mono px-1 z-10"
                    style={{ color: errors[key] ? '#ff3366' : key === 'email' ? '#00d4ff' : '#8b8baa', background: '#0a0a2e' }}>
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type={show === null ? type : show ? 'text' : 'password'}
                      value={form[key]}
                      onChange={set(key)}
                      placeholder={placeholder}
                      className="input-cyber w-full pl-10 pr-12 py-3.5 rounded-xl text-sm"
                      style={{ borderColor: errors[key] ? 'rgba(255,51,102,0.4)' : undefined }}
                    />
                    {toggle && (
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                    {key === 'confirm' && form.confirm && form.password === form.confirm && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <AnimatePresence>
                    {errors[key] && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors[key]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {/* Password strength */}
                  {key === 'password' && form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? strengthColor : 'rgba(255,255,255,0.1)' }} />
                        ))}
                      </div>
                      <p className="text-xs font-mono" style={{ color: strengthColor }}>{strengthLabel}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Global error */}
              <AnimatePresence>
                {errors.global && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{errors.global}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 rounded-xl text-white font-display font-700 text-base tracking-widest flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: loading ? 'none' : '0 0 30px rgba(139,92,246,0.3)' }}>
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <><UserPlus className="w-5 h-5" />CREATE ACCOUNT</>
                )}
              </motion.button>
            </form>

            <div className="mt-5 space-y-3 text-center">
              <button onClick={() => { loginAsGuest(); navigate('/dashboard') }}
                className="text-slate-500 text-xs hover:text-slate-300 transition-colors underline underline-offset-2">
                Continue as Guest
              </button>
              <p className="text-slate-600 text-xs">
                ALREADY HAVE AN ACCOUNT?{' '}
                <Link to="/login" className="text-cyber-cyan hover:text-cyan-300 font-600 transition-colors">LOGIN</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
