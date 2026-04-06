const express = require('express');
const router = express.Router();
const { analyzeUrl } = require('../utils/urlAnalyzer');

router.post('/scan-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return res.status(400).json({ error: 'URL cannot be empty' });
    }

    // Basic URL format validation
    let parsedUrl;
    try {
      parsedUrl = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const result = analyzeUrl(parsedUrl, trimmedUrl);

    // Simulate processing time for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    res.json({
      success: true,
      scanId: require('uuid').v4(),
      timestamp: new Date().toISOString(),
      input: trimmedUrl,
      ...result
    });

  } catch (error) {
    console.error('URL scan error:', error);
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
});

module.exports = router;
