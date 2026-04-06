import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, BarChart3, Users, FileSearch, LogOut,
  Menu, X, ChevronRight, Bell, AlertTriangle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Footer from '../../components/Footer'

const navItems = [
  { to: '/admin',          label: 'Overview',    icon: BarChart3,   end: true },
  { to: '/admin/users',    label: 'All Users',   icon: Users },
  { to: '/admin/analyses', label: 'All Scans',   icon: FileSearch },
  { to: '/admin/flagged',  label: 'Flagged',     icon: AlertTriangle },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const NavItem = ({ to, label, icon: Icon, end }) => (
    <NavLink to={to} end={end} onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${
          isActive ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
        }`}>
      {({ isActive }) => (<>
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-red-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
        <span className="flex-1">{label}</span>
        {isActive && <ChevronRight className="w-3 h-3 text-red-400" />}
      </>)}
    </NavLink>
  )

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-display font-800 text-base text-white">VERI<span className="text-red-400">DEX</span></div>
            <div className="text-red-400/60 text-xs font-mono tracking-widest">ADMIN PANEL</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-600 truncate">{user?.name}</p>
            <p className="text-red-400/70 text-xs font-mono">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-slate-700 text-xs font-mono uppercase tracking-widest px-4 mb-3">Admin Menu</p>
        {navItems.map(item => <NavItem key={item.to} {...item} />)}
        <div className="pt-4 border-t border-white/5 mt-4">
          <NavLink to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-cyber-cyan hover:bg-cyber-cyan/5 transition-all">
            <BarChart3 className="w-4 h-4" />
            <span>User Dashboard</span>
          </NavLink>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full group">
          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cyber-bg bg-grid flex flex-col">
      <div className="hidden lg:flex">
        <aside className="fixed top-0 left-0 bottom-0 w-64 glass-strong border-r border-red-500/10 z-40 flex flex-col">
          <Sidebar />
        </aside>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 glass-strong border-r border-red-500/10 z-50 lg:hidden flex flex-col">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 glass-strong border-b border-red-500/10 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-xs font-mono uppercase tracking-widest">Admin Panel</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
