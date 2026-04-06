import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Globe, Mail, FileText, BookOpen, User,
  Settings, Activity, BarChart3, LogOut, Menu, X,
  ChevronRight, Bell, Search
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Footer from '../../components/Footer'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/dashboard/scan-url', label: 'URL Scanner', icon: Globe },
  { to: '/dashboard/scan-email', label: 'Email Analyzer', icon: Mail },
  { to: '/dashboard/reports', label: 'Reports', icon: FileText },
  { to: '/dashboard/activity', label: 'Activity Log', icon: Activity },
  { to: '/dashboard/learning', label: 'Learning Hub', icon: BookOpen },
]

const bottomItems = [
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavItem = ({ to, label, icon: Icon, end }) => (
    <NavLink to={to} end={end}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-body ${
          isActive
            ? 'bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan'
            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-cyber-cyan' : 'text-slate-600 group-hover:text-slate-400'}`} />
          <span className="flex-1">{label}</span>
          {isActive && <ChevronRight className="w-3 h-3 text-cyber-cyan" />}
        </>
      )}
    </NavLink>
  )

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-cyber-cyan" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-display font-800 text-base text-white">VERI<span className="text-cyber-cyan">DEX</span></div>
            <div className="text-slate-700 text-xs font-mono">v2.0</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-600 truncate">{user?.name}</p>
            <p className="text-slate-600 text-xs font-mono truncate">{user?.role}</p>
          </div>
          {user?.isGuest && <span className="text-xs font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full flex-shrink-0">Guest</span>}
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-700 text-xs font-mono uppercase tracking-widest px-4 mb-3">Main Menu</p>
        {navItems.map(item => <NavItem key={item.to} {...item} />)}

        <div className="pt-4 border-t border-white/5 mt-4">
          <p className="text-slate-700 text-xs font-mono uppercase tracking-widest px-4 mb-3">Account</p>
          {bottomItems.map(item => <NavItem key={item.to} {...item} />)}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full group">
          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid flex flex-col">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <aside className="fixed top-0 left-0 bottom-0 w-64 glass-strong border-r border-white/5 z-40 flex flex-col">
          <Sidebar />
        </aside>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 glass-strong border-r border-white/5 z-50 lg:hidden flex flex-col">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-600 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 relative hidden sm:block max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input placeholder="Search..." className="input-cyber w-full pl-9 pr-4 py-2 rounded-lg text-sm" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-cyber-cyan/30 transition-all relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-cyan rounded-full" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute right-0 top-11 w-72 glass-strong border border-white/10 rounded-xl shadow-xl z-50">
                    <div className="p-4 border-b border-white/5">
                      <p className="text-white text-sm font-600">Notifications</p>
                    </div>
                    {[
                      { msg: 'New phishing campaign detected targeting banking sites.', time: '2m ago', type: 'danger' },
                      { msg: 'Your last scan flagged a suspicious URL.', time: '1h ago', type: 'warning' },
                      { msg: 'Weekly threat report is ready.', time: '1d ago', type: 'info' },
                    ].map((n, i) => (
                      <div key={i} className="p-3 hover:bg-white/3 transition-colors">
                        <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: n.type === 'danger' ? '#ff3366' : n.type === 'warning' ? '#ffaa00' : '#00d4ff' }} />
                          <div>
                            <p className="text-slate-400 text-xs leading-relaxed">{n.msg}</p>
                            <p className="text-slate-700 text-xs mt-1 font-mono">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white text-xs font-bold cursor-pointer"
              onClick={() => navigate('/dashboard/profile')}>
              {user?.avatar || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
