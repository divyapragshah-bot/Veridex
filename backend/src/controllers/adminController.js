const store = require('../data/store')

/**
 * GET /api/admin/users — All users (admin only)
 */
const getAllUsers = (req, res) => {
  const users = store.getUsers().map(u => {
    const { password, ...safe } = u
    return {
      ...safe,
      analysisCount: store.getAnalysesByUser(u.id).length,
      fraudCount: store.getAnalysesByUser(u.id).filter(a => a.result === 'fraud').length,
      lastLogin: u.lastLogin,
      loginCount: u.loginCount || 0
    }
  })
  res.json({ success: true, total: users.length, users })
}

/**
 * DELETE /api/admin/users/:id
 */
const deleteUser = (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'You cannot delete your own admin account.' })
  }
  const deleted = store.deleteUser(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, error: 'User not found.' })
  res.json({ success: true, message: 'User and their analysis history deleted.' })
}

/**
 * GET /api/admin/users/:id — Get user details and their analysis history
 */
const getUserDetails = (req, res) => {
  const user = store.getUserById(req.params.id)
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' })

  const analyses = store.getAnalysesByUser(req.params.id)
  const safe = store.safeUser(user)

  res.json({
    success: true,
    user: {
      ...safe,
      analysisCount: analyses.length,
      fraudCount: analyses.filter(a => a.result === 'fraud').length,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount || 0
    },
    analyses
  })
}

/**
 * GET /api/admin/analyses — All analyses across all users
 */
const getAllAnalyses = (req, res) => {
  const { type, result, userId, page = 1, limit = 30 } = req.query

  let records = store.getAnalyses()
  if (type)   records = records.filter(r => r.type === type)
  if (result) records = records.filter(r => r.result === result)
  if (userId) records = records.filter(r => r.userId === userId)

  const total = records.length
  const start = (parseInt(page) - 1) * parseInt(limit)
  const paginated = records.slice(start, start + parseInt(limit))

  // Enrich with user display name
  const enriched = paginated.map(r => {
    const user = store.getUserById(r.userId)
    return { ...r, userName: user?.name || 'Deleted User', userEmail: user?.email || 'N/A' }
  })

  res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), records: enriched })
}

/**
 * DELETE /api/admin/analyses/:id
 */
const deleteAnalysisAdmin = (req, res) => {
  const deleted = store.deleteAnalysis(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, error: 'Analysis record not found.' })
  res.json({ success: true, message: 'Analysis record deleted.' })
}

/**
 * GET /api/admin/stats
 */
const getStats = (req, res) => {
  res.json({ success: true, stats: store.getStats() })
}

module.exports = { getAllUsers, getUserDetails, deleteUser, getAllAnalyses, deleteAnalysisAdmin, getStats }
