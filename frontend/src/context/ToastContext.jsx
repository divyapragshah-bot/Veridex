import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px]
                ${t.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                  t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                  'bg-cyber-cyan/10 border-cyber-cyan/20 text-cyber-cyan'}
              `}>
                <div className="flex-shrink-0">
                  {t.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                   t.type === 'error' ? <AlertCircle className="w-5 h-5" /> : 
                   <Info className="w-5 h-5" />}
                </div>
                <p className="flex-1 text-sm font-mono font-600">{t.message}</p>
                <button onClick={() => removeToast(t.id)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-4 h-4 opacity-50 hover:opacity-100" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
