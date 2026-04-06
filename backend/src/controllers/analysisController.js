const store = require('../data/store')
const { analyzeUrl } = require('../utils/detection/urlDetector')
const { analyzeEmail } = require('../utils/detection/emailDetector')

/**
 * POST /api/analysis/url
 */
const scanUrl = async (req, res) => {
  try {
    const { url } = req.body
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400)) // realistic latency

    const detection = analyzeUrl(url)
    const record = store.createAnalysis({
      userId:  req.user.id,
      type:    'url',
      content: url,
      result:  detection.result,
      reasons: detection.reasons,
    })

    res.json({
      success: true,
      scanId:  record.id,
      timestamp: record.timestamp,
      input: url,
      ...detection,
    })
  } catch (err) {
    console.error('URL scan error:', err)
    res.status(500).json({ success: false, error: 'URL analysis failed.' })
  }
}

/**
 * POST /api/analysis/email
 */
const scanEmail = async (req, res) => {
  try {
    const { content } = req.body
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500))

    const detection = analyzeEmail(content)
    const record = store.createAnalysis({
      userId:  req.user.id,
      type:    'email',
      content: content.substring(0, 500), // truncate stored content
      result:  detection.result,
      reasons: detection.reasons,
    })

    res.json({
      success: true,
      scanId:  record.id,
      timestamp: record.timestamp,
      inputLength: content.length,
      ...detection,
    })
  } catch (err) {
    console.error('Email scan error:', err)
    res.status(500).json({ success: false, error: 'Email analysis failed.' })
  }
}

/**
 * GET /api/analysis/history
 * Query params: ?type=url|email&result=safe|suspicious|fraud&search=term&page=1&limit=10
 */
const getHistory = (req, res) => {
  const { type, result, search, page = 1, limit = 20 } = req.query

  let records = store.getAnalysesByUser(req.user.id)

  if (type)   records = records.filter(r => r.type === type)
  if (result) records = records.filter(r => r.result === result)
  if (search) {
    const q = search.toLowerCase()
    records = records.filter(r =>
      r.content.toLowerCase().includes(q) ||
      r.result.toLowerCase().includes(q)
    )
  }

  const total = records.length
  const start = (parseInt(page) - 1) * parseInt(limit)
  const paginated = records.slice(start, start + parseInt(limit))

  res.json({
    success: true,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    records: paginated,
  })
}

/**
 * DELETE /api/analysis/:id
 */
const deleteAnalysis = (req, res) => {
  const record = store.getAnalysisById(req.params.id)
  if (!record) return res.status(404).json({ success: false, error: 'Analysis record not found.' })
  if (record.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'You can only delete your own records.' })
  }
  store.deleteAnalysis(req.params.id)
  res.json({ success: true, message: 'Record deleted.' })
}

module.exports = { scanUrl, scanEmail, getHistory, deleteAnalysis }
