import { Resend } from 'resend'

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
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const safeName = escapeHtml(cleanName)
    const safeEmail = escapeHtml(cleanEmail)
    const safeIndustry = escapeHtml(cleanIndustry || 'General Inquiry')
    const safeMessage = escapeHtml(cleanMessage)

    const { error } = await resend.emails.send({
      from: 'SAM Intelligence Contact <onboarding@resend.dev>',
      to: ['contact@samintelligencegroup.com'],
      replyTo: cleanEmail,
      subject: `New Project Brief: ${cleanName} [${cleanIndustry || 'General'}]`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #081824; border-bottom: 2px solid #27d2e4; padding-bottom: 10px;">New Project Brief Received</h2>
          <p><strong>Client Name:</strong> ${safeName}</p>
          <p><strong>Client Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Industry:</strong> ${safeIndustry}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3>Project Details:</h3>
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #27d2e4; border-radius: 4px; white-space: pre-wrap;">${safeMessage}</div>
        </div>
      `,
    })

    if (error) {
      throw new Error(error.message || 'Failed to send message via Resend')
    }

    return res.status(200).json({ success: true, message: 'Brief delivered successfully' })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ success: false, error: error.message || 'Failed to send message via Resend' })
  }
}
