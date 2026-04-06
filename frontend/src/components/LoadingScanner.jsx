import { motion } from 'framer-motion'

const steps = [
  'Parsing URL structure...',
  'Checking SSL certificate...',
  'Analyzing domain reputation...',
  'Running heuristic analysis...',
  'Generating risk score...',
]

export default function LoadingScanner({ type = 'url' }) {
  const emailSteps = [
    'Extracting email content...',
    'Scanning for urgency keywords...',
    'Detecting phishing patterns...',
    'Analyzing embedded links...',
    'Computing threat score...',
  ]
  const list = type === 'email' ? emailSteps : steps

  return (
    <div className="flex flex-col items-center py-12 gap-8">
      {/* Scanning animation */}
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-cyber-cyan/20"
          style={{ borderTopColor: '#00d4ff' }}
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-cyber-purple/20"
          style={{ borderTopColor: '#8b5cf6' }}
        />
        {/* Inner pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-8 rounded-full bg-cyber-cyan/10 flex items-center justify-center"
        >
          <span className="text-cyber-cyan font-mono text-xs">SCAN</span>
        </motion.div>
        {/* Scan line */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            animate={{ top: ['-2px', '130px'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
            style={{ opacity: 0.8 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2 w-full max-w-xs">
        {list.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-cyber-cyan flex-shrink-0"
            />
            <span className="text-slate-500 font-mono text-xs">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
