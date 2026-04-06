const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'veridex_dev_secret_change_in_production'

/**
 * Sign a JWT for the given user payload.
 * @param {object} payload  - { id, email, role }
 * @param {boolean} remember - extend expiry to 7 days
 */
const signToken = (payload, remember = false) => {
  const expiresIn = remember
    ? (process.env.JWT_REMEMBER_EXPIRES_IN || '7d')
    : (process.env.JWT_EXPIRES_IN || '24h')

  return jwt.sign(payload, SECRET, { expiresIn })
}

/**
 * Verify a JWT and return the decoded payload, or null on failure.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

module.exports = { signToken, verifyToken }
