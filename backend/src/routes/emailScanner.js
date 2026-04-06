const express = require('express');
const router = express.Router();
const { analyzeEmail } = require('../utils/emailAnalyzer');

router.post('/scan-email', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Email content is required' });
    }

    if (content.trim().length < 10) {
      return res.status(400).json({ error: 'Email content is too short to analyze' });
    }

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

    const result = analyzeEmail(content);

    res.json({
      success: true,
      scanId: require('uuid').v4(),
      timestamp: new Date().toISOString(),
      inputLength: content.length,
      ...result
    });

  } catch (error) {
    console.error('Email scan error:', error);
    res.status(500).json({ error: 'Failed to analyze email content' });
  }
});

module.exports = router;
