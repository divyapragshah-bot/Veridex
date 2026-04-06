require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes     = require('./routes/auth')
const analysisRoutes = require('./routes/analysis')
const adminRoutes    = require('./routes/admin')
const urlScanRoute   = require('./routes/urlScanner')
const emailScanRoute = require('./routes/emailScanner')
const reportRoute    = require('./routes/reportGenerator')

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: ['http://localhost:3000','http://localhost:5173','http://127.0.0.1:3000'], credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const globalLimit = rateLimit({ windowMs: 15*60*1000, max: 300, standardHeaders: true })
const authLimit   = rateLimit({ windowMs: 15*60*1000, max: 20, message: { success: false, error: 'Too many auth attempts. Try again in 15 minutes.' } })
app.use('/api/', globalLimit)
app.use('/api/auth/', authLimit)

app.use('/api/auth',     authRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api', urlScanRoute)
app.use('/api', emailScanRoute)
app.use('/api', reportRoute)

app.get('/api/health', (req, res) => {
  const store = require('./data/store')
  res.json({ status: 'online', service: 'Veridex API', version: '3.0.0', timestamp: new Date().toISOString(), stats: store.getStats() })
})

app.use((req, res) => res.status(404).json({ success: false, error: 'Endpoint not found' }))
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ success: false, error: 'Internal server error' }) })

app.listen(PORT, () => {
  console.log(`\n🛡️  Veridex API v3 → http://localhost:${PORT}`)
  console.log(`🔐  Auth:   POST /api/auth/signup | /api/auth/login`)
  console.log(`🔍  Scan:   POST /api/analysis/url | /api/analysis/email`)
  console.log(`👑  Admin:  GET  /api/admin/stats | /users | /analyses`)
  console.log(`📡  Health: GET  /api/health\n`)
})
