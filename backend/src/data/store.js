/**
 * Veridex In-Memory Data Store
 * ─────────────────────────────
 * All data resets on server restart.
 * Designed to be easily swapped for MongoDB/Postgres later.
 * Just replace these arrays with Mongoose models or Prisma clients.
 */

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

// ── Users store ──────────────────────────────────────────────────────────────
const users = []

// Seed default admin account on startup
const seedAdmin = async () => {
  const hash = await bcrypt.hash('admin123', 10)
  users.push({
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@veridex.com',
    password: hash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    isActive: true,
    loginCount: 0,
    lastLogin: null,
  })
  const userHash = await bcrypt.hash('demo1234', 10)
  users.push({
    id: uuidv4(),
    name: 'Demo User',
    email: 'demo@veridex.com',
    password: userHash,
    role: 'user',
    createdAt: new Date().toISOString(),
    isActive: true,
    loginCount: 0,
    lastLogin: null,
  })
  console.log('✅  Seeded: admin@veridex.com / admin123  |  demo@veridex.com / demo1234')
}

// ── Analysis history store ────────────────────────────────────────────────────
const analyses = []

// Seed some demo history so the dashboard isn't empty
const seedAnalyses = (adminId, demoId) => {
  const records = [
    { userId: demoId, type: 'url',   content: 'http://paypal-secure-verify.tk/login', result: 'fraud',      reasons: ['Suspicious TLD .tk', 'HTTP not HTTPS', 'Brand mimicry: paypal', 'Path contains "verify"'] },
    { userId: demoId, type: 'email', content: 'URGENT: Your account will be suspended. Verify now at http://bit.ly/xyz', result: 'fraud', reasons: ['Urgency keyword: URGENT', 'Shortener URL detected', 'Credential harvesting phrase'] },
    { userId: demoId, type: 'url',   content: 'https://google.com', result: 'safe', reasons: ['HTTPS secure', 'No suspicious patterns', 'Trusted domain'] },
    { userId: demoId, type: 'url',   content: 'https://bit.ly/3xFakeLink', result: 'suspicious', reasons: ['URL shortener hides real destination', 'Cannot verify final domain'] },
    { userId: adminId, type: 'url',  content: 'https://amazon.com/orders', result: 'safe', reasons: ['HTTPS secure', 'Known trusted domain'] },
  ]
  records.forEach((r, i) => {
    analyses.push({
      id: uuidv4(),
      ...r,
      timestamp: new Date(Date.now() - (records.length - i) * 3600000).toISOString(),
      flagged: r.result === 'fraud',
    })
  })
}

// Run seed
seedAdmin().then(() => {
  const adminId = users.find(u => u.role === 'admin')?.id
  const demoId  = users.find(u => u.role === 'user')?.id
  if (adminId && demoId) seedAnalyses(adminId, demoId)
})

// ── Store API ─────────────────────────────────────────────────────────────────
const store = {
  // ── Users ──
  getUsers:       ()      => users,
  getUserById:    (id)    => users.find(u => u.id === id),
  getUserByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),

  createUser: async ({ name, email, password, role = 'user' }) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    const hash = await bcrypt.hash(password, saltRounds)
    const user = {
      id: uuidv4(), name, email: email.toLowerCase(), password: hash, role,
      createdAt: new Date().toISOString(), isActive: true, loginCount: 0, lastLogin: null,
    }
    users.push(user)
    return user
  },

  updateUserLogin: (id) => {
    const u = users.find(u => u.id === id)
    if (u) { u.loginCount += 1; u.lastLogin = new Date().toISOString() }
  },

  deleteUser: (id) => {
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) return false
    users.splice(idx, 1)
    // Also remove their analyses
    const toRemove = analyses.filter(a => a.userId === id).map(a => a.id)
    toRemove.forEach(aid => {
      const ai = analyses.findIndex(a => a.id === aid)
      if (ai !== -1) analyses.splice(ai, 1)
    })
    return true
  },

  safeUser: (user) => {
    const { password, ...safe } = user
    return safe
  },

  // ── Analyses ──
  getAnalyses:          ()       => analyses,
  getAnalysesByUser:    (userId) => analyses.filter(a => a.userId === userId),
  getAnalysisById:      (id)     => analyses.find(a => a.id === id),

  createAnalysis: ({ userId, type, content, result, reasons }) => {
    const record = {
      id: uuidv4(), userId, type, content, result, reasons,
      timestamp: new Date().toISOString(),
      flagged: result === 'fraud',
    }
    analyses.unshift(record) // newest first
    return record
  },

  deleteAnalysis: (id) => {
    const idx = analyses.findIndex(a => a.id === id)
    if (idx === -1) return false
    analyses.splice(idx, 1)
    return true
  },

  // ── Analytics ──
  getStats: () => {
    const total    = analyses.length
    const frauds   = analyses.filter(a => a.result === 'fraud').length
    const suspects = analyses.filter(a => a.result === 'suspicious').length
    const safe     = analyses.filter(a => a.result === 'safe').length
    return {
      totalUsers:     users.length,
      totalScans:     total,
      fraudCount:     frauds,
      suspiciousCount: suspects,
      safeCount:      safe,
      fraudRate:      total > 0 ? Math.round((frauds / total) * 100) : 0,
      urlScans:       analyses.filter(a => a.type === 'url').length,
      emailScans:     analyses.filter(a => a.type === 'email').length,
      flaggedUsers:   [...new Set(analyses.filter(a => a.flagged).map(a => a.userId))].length,
    }
  },
}

module.exports = store
