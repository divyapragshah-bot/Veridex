import { Link } from 'react-router-dom'
import { Shield, Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const sections = [
    {
      title: 'Platform',
      links: [
        { label: 'URL Scanner', to: '/dashboard/scan-url' },
        { label: 'Email Analyzer', to: '/dashboard/scan-email' },
        { label: 'Learning Center', to: '/learning' },
        { label: 'Dashboard', to: '/dashboard' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'About Project', to: '/about' },
        { label: 'Documentation', to: '#' },
        { label: 'Security Tips', to: '/learning' },
        { label: 'Support', to: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
        { label: 'Cookie Policy', to: '#' },
      ],
    },
  ]

  const socials = [
    { icon: Github, to: '#', label: 'GitHub' },
    { icon: Twitter, to: '#', label: 'Twitter' },
    { icon: Linkedin, to: '#', label: 'LinkedIn' },
    { icon: Mail, to: 'mailto:info@veridex.com', label: 'Email' },
  ]

  return (
    <footer className="relative z-20 border-t border-white/5 bg-[#020210]/95 backdrop-blur-md pt-16 pb-8 px-6 overflow-hidden">
      {/* Decorative Gradient Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber-cyan/10 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 -right-24 w-48 h-48 bg-cyber-purple/10 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center p-[1px]">
                  <div className="w-full h-full bg-[#050510] rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
                  </div>
              </div>
              <span className="font-display font-800 text-2xl text-white tracking-tight">
                VERI<span className="text-cyber-cyan">DEX</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-mono">
              The next-generation phishing detection platform. Verifying before you click, protecting the modern digital landscape.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((s, i) => (
                <motion.a key={s.label} href={s.to} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all duration-300">
                  <s.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-white font-display font-700 text-sm uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-slate-500 hover:text-cyber-cyan text-sm font-mono transition-colors flex items-center gap-1 group">
                      {link.label}
                      {link.to === '#' && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-600 text-xs font-mono">
            © 2026 <span className="text-cyber-cyan">Veridex Lab</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">Systems Online</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
            <p className="text-slate-700 text-[10px] font-mono">
              Designed as a Final Year Project Prototype
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
