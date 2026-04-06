import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('veridex_token') || sessionStorage.getItem('veridex_token')
    if (stored) {
      setToken(stored)
      // Verify token is still valid
      authApi.getMe(stored)
        .then(data => { if (data.success) setUser(data.user) })
        .catch(() => { localStorage.removeItem('veridex_token'); sessionStorage.removeItem('veridex_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password, remember) => {
    const data = await authApi.login(email, password, remember)
    if (!data.success) throw new Error(data.error || 'Login failed')
    setUser(data.user)
    setToken(data.token)
    if (remember) localStorage.setItem('veridex_token', data.token)
    sessionStorage.setItem('veridex_token', data.token)
    return data.user
  }

  const signup = async (name, email, password) => {
    const data = await authApi.signup(name, email, password)
    if (!data.success) throw new Error(data.error || 'Signup failed')
    return true
  }

  const loginAsGuest = () => {
    const guest = { id: 'guest', name: 'Guest User', email: 'guest@veridex.com', role: 'guest', isGuest: true }
    setUser(guest)
    setToken('guest-token')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('veridex_token')
    sessionStorage.removeItem('veridex_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
