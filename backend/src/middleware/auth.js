const { verifyToken } = require('../utils/token')
const store = require('../data/store')

/**
 * protect — Requires valid JWT in Authorization header.
 * Attaches req.user (safe user object, no password).
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token. Please log in again.' })
  }

  const user = store.getUserById(decoded.id)
  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, error: 'User account not found or deactivated.' })
  }

  req.user = store.safeUser(user)
  next()
}

/**
 * adminOnly — Extends protect. Requires role === 'admin'.
 */
const adminOnly = (req, res, next) => {
  protect(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access forbidden. Admin privileges required.' })
    }
    next()
  })
}

module.exports = { protect, adminOnly }
