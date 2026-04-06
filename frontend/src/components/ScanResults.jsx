import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle, Download, RotateCcw } from 'lucide-react'
import RiskMeter from './RiskMeter'
import { generatePDFReport } from '../utils/pdfGenerator'

const iconMap = {
  danger: <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />,
  safe: <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />,
  info: <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />,
}

const bgMap = {
  danger: 'bg-red-500/5 border-red-500/20',
  warning: 'bg-yellow-500/5 border-yellow-500/20',
  safe: 'bg-green-500/5 border-green-500/20',
  info: 'bg-blue-500/5 border-blue-500/20',
}

export default function ScanResults({ result, type, onReset }) {
  if (!result) return null

  const handleDownload = async () => {
    try {
      await generatePDFReport(result, type)
    } catch (err) {
      console.error('PDF generation failed:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-700 text-lg text-white">Scan Results</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="btn-ghost px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Scan
          </motion.button>
        </div>
      </div>

      {/* Risk overview */}
      <div className="card-cyber p-6 flex flex-col sm:flex-row items-center gap-8">
        <RiskMeter score={result.riskScore} />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest mb-1">Input Analyzed</p>
            <p className="text-white font-mono text-sm break-all bg-black/30 rounded-lg px-3 py-2">
              {result.input || 'Email Content'}
            </p>
          </div>
          {result.metadata && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.metadata).slice(0, 4).map(([key, val]) => (
                <div key={key} className="bg-white/3 rounded-lg px-3 py-2">
                  <p className="text-slate-600 text-xs font-mono capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-slate-300 text-xs font-mono truncate">{String(val)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-2">
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest px-1">
          {result.findings?.length} Finding{result.findings?.length !== 1 ? 's' : ''}
        </p>
        {result.findings?.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`flex items-start gap-3 p-4 rounded-xl border ${bgMap[f.type] || bgMap.info}`}
          >
            {iconMap[f.type] || iconMap.info}
            <p className="text-slate-300 text-sm leading-relaxed">{f.text}</p>
          </motion.div>
        ))}
      </div>

      {/* URLs extracted (email analyzer) */}
      {result.extractedUrls?.length > 0 && (
        <div className="card-cyber p-4 space-y-2">
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Extracted URLs</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {result.extractedUrls.map((url, i) => (
              <p key={i} className="text-cyber-cyan text-xs font-mono break-all hover:text-white transition-colors cursor-default">{url}</p>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-center text-slate-700 text-xs font-mono">
        Scan completed at {new Date(result.timestamp).toLocaleString()}
      </p>
    </motion.div>
  )
}
