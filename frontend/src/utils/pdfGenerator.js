import jsPDF from 'jspdf'

export async function generatePDFReport(result, type) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  let y = 20

  const addPage = () => {
    doc.addPage()
    y = 20
  }
  const checkPage = (needed = 20) => { if (y + needed > pageH - 20) addPage() }

  // Background
  doc.setFillColor(2, 2, 16)
  doc.rect(0, 0, W, pageH, 'F')

  // Header bar
  doc.setFillColor(0, 212, 255)
  doc.rect(0, 0, W, 3, 'F')

  // Logo / Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(0, 212, 255)
  doc.text('VERIDEX', 20, y + 12)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 150)
  doc.text('Cybersecurity Threat Analysis Report', 20, y + 20)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y + 27)

  // Scan type badge
  doc.setFillColor(0, 212, 255)
  doc.roundedRect(W - 55, y, 40, 10, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(2, 2, 16)
  doc.text(type === 'url' ? 'URL SCAN' : 'EMAIL SCAN', W - 50, y + 7)

  y += 40

  // Divider
  doc.setDrawColor(0, 212, 255)
  doc.setLineWidth(0.3)
  doc.line(20, y, W - 20, y)
  y += 10

  // Input section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 150)
  doc.text('ANALYZED INPUT', 20, y)
  y += 6
  doc.setFillColor(10, 10, 40)
  doc.roundedRect(20, y, W - 40, 12, 2, 2, 'F')
  doc.setFont('courier', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(200, 200, 255)
  const inputText = result.input ? result.input.substring(0, 70) + (result.input.length > 70 ? '...' : '') : 'Email Content Analyzed'
  doc.text(inputText, 24, y + 8)
  y += 20

  // Risk score box
  const statusColors = { Safe: [0, 255, 136], Suspicious: [255, 170, 0], Dangerous: [255, 51, 102] }
  const col = statusColors[result.status] || [100, 100, 255]

  doc.setFillColor(10, 10, 40)
  doc.roundedRect(20, y, W - 40, 35, 3, 3, 'F')
  doc.setDrawColor(...col)
  doc.setLineWidth(0.5)
  doc.roundedRect(20, y, W - 40, 35, 3, 3, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(36)
  doc.setTextColor(...col)
  doc.text(`${result.riskScore}%`, W / 2, y + 22, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`STATUS: ${result.status.toUpperCase()}`, W / 2, y + 31, { align: 'center' })
  y += 45

  // Findings
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 150)
  doc.text(`FINDINGS (${result.findings?.length || 0})`, 20, y)
  y += 8

  const typeColors = {
    danger: [255, 51, 102],
    warning: [255, 170, 0],
    safe: [0, 255, 136],
    info: [0, 212, 255],
  }

  for (const finding of (result.findings || [])) {
    checkPage(16)
    const fc = typeColors[finding.type] || [0, 212, 255]
    doc.setFillColor(fc[0], fc[1], fc[2], 0.1)
    doc.roundedRect(20, y, W - 40, 12, 2, 2, 'F')
    doc.setFillColor(...fc)
    doc.circle(26, y + 6, 1.5, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(200, 200, 220)
    const lines = doc.splitTextToSize(finding.text, W - 60)
    doc.text(lines[0] || '', 31, y + 7)
    y += 14
  }

  // Metadata
  if (result.metadata) {
    checkPage(30)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 150)
    doc.text('TECHNICAL METADATA', 20, y)
    y += 6

    const entries = Object.entries(result.metadata)
    entries.forEach(([k, v], i) => {
      const col_ = i % 2 === 0 ? 20 : W / 2
      if (i % 2 === 0 && i > 0) y += 8
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(80, 80, 130)
      doc.text(k.replace(/([A-Z])/g, ' $1').toUpperCase(), col_, y)
      doc.setFont('courier', 'normal')
      doc.setTextColor(160, 160, 210)
      doc.text(String(v).substring(0, 30), col_, y + 4)
    })
    y += 12
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(2, 2, 16)
    doc.rect(0, pageH - 15, W, 15, 'F')
    doc.setFillColor(0, 212, 255)
    doc.rect(0, pageH - 2, W, 2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(60, 60, 100)
    doc.text('Veridex Cybersecurity Platform — "Verify Before You Click" — Report is for informational purposes only', W / 2, pageH - 6, { align: 'center' })
    doc.text(`Page ${i} of ${totalPages}`, W - 20, pageH - 6, { align: 'right' })
  }

  doc.save(`veridex-report-${Date.now()}.pdf`)
}
