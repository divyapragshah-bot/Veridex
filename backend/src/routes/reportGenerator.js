const express = require('express');
const router = express.Router();

router.post('/generate-report', async (req, res) => {
  try {
    const { scanData, type } = req.body;

    if (!scanData || !type) {
      return res.status(400).json({ error: 'Scan data and type are required' });
    }

    // Generate HTML report content (returned to frontend for jsPDF rendering)
    const reportHtml = generateReportHTML(scanData, type);
    const reportJson = generateReportJSON(scanData, type);

    res.json({
      success: true,
      reportId: require('uuid').v4(),
      timestamp: new Date().toISOString(),
      reportHtml,
      reportData: reportJson
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

function generateReportHTML(data, type) {
  const statusColors = { Safe: '#00ff88', Suspicious: '#ffaa00', Dangerous: '#ff3366' };
  const color = statusColors[data.status] || '#ffffff';

  return `
    <div style="font-family: monospace; background: #0a0a1a; color: #e0e0ff; padding: 40px; max-width: 800px;">
      <div style="border-bottom: 2px solid #00d4ff; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #00d4ff; font-size: 28px; margin: 0;">VERIDEX</h1>
        <p style="color: #888; margin: 5px 0 0;">Cybersecurity Threat Analysis Report</p>
        <p style="color: #666; font-size: 12px;">Generated: ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #111133; border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #aaa; font-size: 14px; text-transform: uppercase; margin: 0 0 15px;">Scan Details</h2>
        <p><strong style="color: #888;">Type:</strong> <span style="color: #00d4ff;">${type === 'url' ? 'URL Analysis' : 'Email Analysis'}</span></p>
        <p><strong style="color: #888;">Input:</strong> <span style="color: #e0e0ff; word-break: break-all;">${data.input || 'Email Content'}</span></p>
        <p><strong style="color: #888;">Scan ID:</strong> <span style="color: #666;">${data.scanId || 'N/A'}</span></p>
      </div>
      <div style="background: #111133; border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #aaa; font-size: 14px; text-transform: uppercase; margin: 0 0 15px;">Risk Assessment</h2>
        <div style="font-size: 64px; font-weight: bold; color: ${color};">${data.riskScore}%</div>
        <div style="font-size: 24px; color: ${color}; margin-top: 10px;">${data.status}</div>
      </div>
      <div style="background: #111133; border: 1px solid #333; border-radius: 8px; padding: 20px;">
        <h2 style="color: #aaa; font-size: 14px; text-transform: uppercase; margin: 0 0 15px;">Findings</h2>
        ${(data.findings || []).map(f => `
          <div style="padding: 8px 0; border-bottom: 1px solid #222; display: flex; align-items: start; gap: 10px;">
            <span style="color: ${f.type === 'danger' ? '#ff3366' : f.type === 'warning' ? '#ffaa00' : f.type === 'safe' ? '#00ff88' : '#00d4ff'};">
              ${f.type === 'danger' ? '⚠' : f.type === 'warning' ? '⚡' : f.type === 'safe' ? '✓' : 'ℹ'}
            </span>
            <span style="color: #ccc;">${f.text}</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #444; font-size: 11px; text-align: center;">
        Veridex Cybersecurity Platform — "Verify Before You Click" — Report is for informational purposes only
      </div>
    </div>
  `;
}

function generateReportJSON(data, type) {
  return {
    reportTitle: 'Veridex Phishing Analysis Report',
    generatedAt: new Date().toISOString(),
    scanType: type,
    summary: {
      status: data.status,
      riskScore: data.riskScore,
      totalFindings: (data.findings || []).length,
      dangerCount: (data.findings || []).filter(f => f.type === 'danger').length,
      warningCount: (data.findings || []).filter(f => f.type === 'warning').length,
    },
    findings: data.findings || [],
    metadata: data.metadata || {}
  };
}

module.exports = router;
