const bcrypt = require('bcryptjs')
const store = require('../data/store')
const { signToken } = require('../utils/token')

/**
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check duplicate email
    if (store.getUserByEmail(email)) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' })
    }

    const user = await store.createUser({ name: name.trim(), email: email.trim(), password })
    const token = signToken({ id: user.id, email: user.email, role: user.role })

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: store.safeUser(user),
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ success: false, error: 'Account creation failed. Please try again.' })
  }
}

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body

    const user = store.getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'This account has been deactivated. Contact support.' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' })
    }

    store.updateUserLogin(user.id)
    const token = signToken({ id: user.id, email: user.email, role: user.role }, !!remember)

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: store.safeUser(user),
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' })
  }
}

/**
 * GET /api/auth/me  — Returns current user from token
 */
const getMe = (req, res) => {
  res.json({ success: true, user: req.user })
}

module.exports = { signup, login, getMe }
