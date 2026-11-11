import nodemailer from 'nodemailer'

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const sanitizeHeader = (value) => String(value).replace(/[\r\n]+/g, ' ').trim()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  let parsedBody = req.body
  if (typeof parsedBody === 'string') {
    try {
      parsedBody = JSON.parse(parsedBody)
    } catch {
      parsedBody = {}
    }
  }

  const { name, email, industry, message } = parsedBody || {}
  const cleanName = sanitizeHeader(name || '')
  const cleanEmail = sanitizeHeader(email || '')
  const cleanIndustry = sanitizeHeader(industry || '')
  const cleanMessage = String(message || '').trim()

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields: name, email, and message.',
    })
  }

  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete.')
    }

    const port = Number(process.env.SMTP_PORT) || 465
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER, // contact@samintelligencegroup.com
        pass: process.env.SMTP_PASS,
      },
    })

    const recipient = process.env.CONTACT_RECEIVER_EMAIL || 'contact@samintelligencegroup.com'
    const safeName = escapeHtml(cleanName)
    const safeEmail = escapeHtml(cleanEmail)
    const safeIndustry = escapeHtml(cleanIndustry || 'Not specified')
    const safeMessage = escapeHtml(cleanMessage)

    const mailOptions = {
      from: `"SAM Intelligence Group" <${process.env.SMTP_USER || 'contact@samintelligencegroup.com'}>`,
      replyTo: cleanEmail,
      to: recipient,
      subject: `New Project Brief from ${cleanName} [${cleanIndustry || 'General'}]`,
      text: `
New Project Brief Received

Name: ${cleanName}
Email: ${cleanEmail}
Industry / Focus: ${cleanIndustry || 'Not specified'}

Project Brief Details:
${cleanMessage}
      `.trim(),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #081824; margin-top: 0; border-bottom: 2px solid #27d2e4; padding-bottom: 12px;">New Project Brief Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569;">Client Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email Address:</td>
              <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #27d2e4; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Industry / Track:</td>
              <td style="padding: 8px 0; color: #0f172a;">${safeIndustry}</td>
            </tr>
          </table>
          <h3 style="color: #081824; margin-bottom: 8px;">Project Brief:</h3>
          <div style="background-color: #f8fafc; border-left: 4px solid #27d2e4; padding: 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${safeMessage}</div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            Sent automatically via SAM Intelligence Group website contact portal.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return res.status(200).json({ success: true, message: 'Brief delivered successfully' })
  } catch (error) {
    console.error('Nodemailer submission error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to send message via mail server. Please try again or reach out directly.',
    })
  }
}
