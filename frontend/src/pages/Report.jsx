import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, Globe, Mail, ArrowRight } from 'lucide-react'

export default function Report() {
  return (
    <div className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono">
            <FileText className="w-3.5 h-3.5" /> Report Generator
          </div>
          <h1 className="font-display font-800 text-4xl text-white">Download Your Report</h1>
          <p className="text-slate-500 leading-relaxed">
            PDF reports are generated automatically after each scan. Complete a URL or email scan first, then click "PDF Report" in the results panel to download your full analysis report.
          </p>

          <div className="card-cyber p-8 space-y-6">
            <h3 className="font-display font-700 text-white text-xl">Run a Scan First</h3>
            <p className="text-slate-500 text-sm">Choose a scanner below to analyze a URL or email. After the scan completes, you can download a branded PDF report with all findings.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/scan-url">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2">
                  <Globe className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Scan a URL</span>
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </motion.button>
              </Link>
              <Link to="/scan-email">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-ghost px-8 py-4 rounded-xl flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Analyze Email
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Report contents preview */}
          <div className="card-cyber p-6 text-left space-y-4">
            <h3 className="font-display font-700 text-white">Report Includes</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Scan metadata & timestamp', 'Risk score (0–100%)', 'Status verdict', 'Full findings list', 'Technical metadata', 'Extracted URLs', 'Scan ID (UUID)', 'Branded PDF layout'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
