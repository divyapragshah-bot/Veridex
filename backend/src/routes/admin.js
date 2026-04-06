const express = require('express')
const router = express.Router()

const { getAllUsers, getUserDetails, deleteUser, getAllAnalyses, deleteAnalysisAdmin, getStats } = require('../controllers/adminController')
const { adminOnly } = require('../middleware/auth')

// All admin routes require admin role
router.use(adminOnly)

// GET  /api/admin/stats
router.get('/stats', getStats)

// GET  /api/admin/users
router.get('/users', getAllUsers)
router.get('/users/:id', getUserDetails)

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser)

// GET  /api/admin/analyses
router.get('/analyses', getAllAnalyses)

// DELETE /api/admin/analyses/:id
router.delete('/analyses/:id', deleteAnalysisAdmin)

module.exports = router
