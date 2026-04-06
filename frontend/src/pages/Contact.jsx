import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, Github, Linkedin, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // No backend — just show success (this is a prototype)
    setSent(true)
  }

  return (
    <div className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono mb-5">
            <MessageSquare className="w-3.5 h-3.5" /> Contact
          </div>
          <h1 className="font-display font-800 text-4xl text-white mb-3">Get in Touch</h1>
          <p className="text-slate-500 text-sm">Questions, feedback, or collaboration? Reach out anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">
            <div className="card-cyber p-6 space-y-4">
              <h3 className="font-display font-700 text-white">Project Info</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Veridex is an open-source final year project. Contributions, bug reports, and feedback are welcome.</p>
              {[
                { icon: Mail, label: 'Email', value: 'veridex@example.com' },
                { icon: Github, label: 'GitHub', value: 'github.com/veridex' },
                { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/veridex' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-cyber-cyan" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs font-mono">{label}</p>
                    <p className="text-slate-300 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="md:col-span-3">
            <div className="card-cyber p-8">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 gap-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                  <h3 className="font-display font-700 text-white text-xl">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">Thanks for reaching out. This is a prototype, so no real message was sent — but we appreciate the spirit!</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }} className="btn-ghost px-6 py-2 rounded-xl text-sm mt-2">Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-xs font-mono uppercase tracking-widest block mb-2">Name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" className="input-cyber w-full px-4 py-3 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-mono uppercase tracking-widest block mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com" className="input-cyber w-full px-4 py-3 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-mono uppercase tracking-widest block mb-2">Message</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Your message..." rows={5} className="input-cyber w-full px-4 py-3 rounded-xl text-sm resize-none" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                    className="btn-primary w-full py-4 rounded-xl text-sm flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Send Message</span>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
