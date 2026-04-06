import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, Zap, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/learning', label: 'Learning' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-lg shadow-cyber-cyan/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <Shield className="w-5 h-5 text-cyber-cyan relative z-10" strokeWidth={1.5} />
          </div>
          <span className="font-display font-800 text-xl tracking-wider text-white">
            VERI<span className="text-cyber-cyan">DEX</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-body transition-all duration-200 ${
                location.pathname === link.to
                  ? 'text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20'
                  : 'text-slate-400 hover:text-cyber-cyan hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-ghost px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />Dashboard
                </motion.button>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-cyber-cyan/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar || 'U'}
                  </div>
                  <span className="text-slate-300 text-sm">{user.name?.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="absolute right-0 top-12 w-44 glass-strong border border-white/10 rounded-xl shadow-xl overflow-hidden">
                      <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-colors">
                        <User className="w-4 h-4" />Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 text-sm transition-colors w-full">
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="btn-ghost px-4 py-2 rounded-lg text-sm">Login</button>
              </Link>
              <Link to="/scan-url">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary px-5 py-2 rounded-lg text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Scan Now</span>
                </motion.button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg border border-white/10 text-slate-400 hover:text-cyber-cyan transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5">
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm transition-all ${
                    location.pathname === link.to ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-slate-400 hover:text-cyber-cyan hover:bg-white/5'
                  }`}>{link.label}</Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 py-3 rounded-lg text-sm text-slate-400 hover:text-cyber-cyan hover:bg-white/5 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/5 text-left flex items-center gap-2">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="flex-1">
                    <button className="btn-ghost w-full py-3 rounded-lg text-sm">Login</button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <button className="btn-primary w-full py-3 rounded-lg text-sm relative z-10">Sign Up</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
