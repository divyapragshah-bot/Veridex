import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const R = 54
const CIRCUMFERENCE = 2 * Math.PI * R

function getRiskColor(score) {
  if (score >= 70) return { stroke: '#ff3366', glow: 'rgba(255,51,102,0.5)', text: '#ff3366', label: 'Dangerous' }
  if (score >= 35) return { stroke: '#ffaa00', glow: 'rgba(255,170,0,0.5)', text: '#ffaa00', label: 'Suspicious' }
  return { stroke: '#00ff88', glow: 'rgba(0,255,136,0.5)', text: '#00ff88', label: 'Safe' }
}

export default function RiskMeter({ score = 0, animated = true, size = 140 }) {
  const [displayScore, setDisplayScore] = useState(0)
  const colors = getRiskColor(score)
  const offset = CIRCUMFERENCE - (displayScore / 100) * CIRCUMFERENCE

  useEffect(() => {
    if (!animated) { setDisplayScore(score); return }
    let start = null
    const duration = 1500
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [score, animated])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20 transition-all duration-1000"
          style={{ background: colors.glow }}
        />
        <svg width={size} height={size} viewBox="0 0 130 130" className="circle-progress">
          {/* Track */}
          <circle className="circle-track" cx="65" cy="65" r={R} strokeWidth="8" />
          {/* Fill */}
          <motion.circle
            className="circle-fill"
            cx="65"
            cy="65"
            r={R}
            strokeWidth="8"
            stroke={colors.stroke}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${colors.stroke})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-600 text-2xl" style={{ color: colors.text }}>
            {displayScore}%
          </span>
          <span className="text-xs text-slate-500 font-mono mt-1">RISK</span>
        </div>
      </div>
      <div
        className="px-4 py-1 rounded-full text-sm font-display font-600 tracking-widest uppercase"
        style={{
          color: colors.text,
          background: `${colors.stroke}15`,
          border: `1px solid ${colors.stroke}40`,
          boxShadow: `0 0 12px ${colors.glow}`
        }}
      >
        {colors.label}
      </div>
    </div>
  )
}
