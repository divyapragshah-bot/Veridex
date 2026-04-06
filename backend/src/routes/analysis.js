const express = require('express')
const { body } = require('express-validator')
const router = express.Router()

const { scanUrl, scanEmail, getHistory, deleteAnalysis } = require('../controllers/analysisController')
const { protect } = require('../middleware/auth')
const { validate } = require('../middleware/validate')

// All analysis routes require authentication
router.use(protect)

// POST /api/analysis/url
router.post('/url', [
  body('url').trim().notEmpty().withMessage('URL is required'),
  validate,
], scanUrl)

// POST /api/analysis/email
router.post('/email', [
  body('content').trim().isLength({ min: 10 }).withMessage('Email content must be at least 10 characters'),
  validate,
], scanEmail)

// GET /api/analysis/history
router.get('/history', getHistory)

// DELETE /api/analysis/:id
router.delete('/:id', deleteAnalysis)

module.exports = router
