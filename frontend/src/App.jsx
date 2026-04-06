import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import ParticleBackground from './components/ParticleBackground'

// Auth
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Public
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Learning from './pages/Learning'
import Contact from './pages/Contact'

// User Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import Profile from './pages/dashboard/Profile'
import SettingsPage from './pages/dashboard/SettingsPage'
import Reports from './pages/dashboard/Reports'
import ActivityLog from './pages/dashboard/ActivityLog'
import URLScanner from './pages/URLScanner'
import EmailAnalyzer from './pages/EmailAnalyzer'
import DashLearning from './pages/dashboard/DashLearning'

// Admin Dashboard
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnalyses from './pages/admin/AdminAnalyses'
import AdminFlagged from './pages/admin/AdminFlagged'

function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-cyber-bg bg-grid flex flex-col">
      <ParticleBackground />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/learning" element={<PublicLayout><Learning /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* User Dashboard - Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="reports" element={<Reports />} />
                <Route path="activity" element={<ActivityLog />} />
                <Route path="scan-url" element={<URLScanner />} />
                <Route path="scan-email" element={<EmailAnalyzer />} />
                <Route path="learning" element={<DashLearning />} />
              </Route>

              {/* Admin Dashboard - Protected & Admin-only */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analyses" element={<AdminAnalyses />} />
                <Route path="flagged" element={<AdminFlagged />} />
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
