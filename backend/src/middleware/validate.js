const { validationResult } = require('express-validator')

/**
 * Runs express-validator checks and returns 422 if any fail.
 * Use after your validation chain: [...validators, validate, controller]
 */
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg)
    return res.status(422).json({
      success: false,
      error: messages[0],   // first error for UI
      errors: messages,     // all errors for debugging
    })
  }
  next()
}

module.exports = { validate }
