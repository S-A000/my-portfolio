import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import nodemailer from 'nodemailer'
import handler from '../api/contact'

const createMockResponse = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
  return res
}

describe('Vercel serverless contact handler (/api/contact)', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.SMTP_HOST = 'smtp.example.com'
    process.env.SMTP_PORT = '465'
    process.env.SMTP_USER = 'contact@samintelligencegroup.com'
    process.env.SMTP_PASS = 'secret-pass'
    process.env.CONTACT_RECEIVER_EMAIL = 'contact@samintelligencegroup.com'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  it('rejects non-POST requests with 405', async () => {
    const res = createMockResponse()
    await handler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(405)
    expect(res.body).toEqual({ success: false, error: 'Method not allowed' })
  })

  it('validates required fields and returns 400 when missing', async () => {
    const res = createMockResponse()
    await handler({ method: 'POST', body: { name: 'Jane', email: '', message: 'Hello' } }, res)
    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toMatch(/required fields/i)
  })

  it('sends formatted email via Nodemailer and escapes HTML input', async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: 'msg-1' })
    const createTransport = vi.spyOn(nodemailer, 'createTransport').mockReturnValue({ sendMail })
    const res = createMockResponse()

    await handler({
      method: 'POST',
      body: {
        name: 'Jane <script>',
        email: 'jane@acme.example',
        industry: 'MLOps',
        message: 'Need <b>pipeline</b> & monitoring',
      },
    }, res)

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@samintelligencegroup.com',
        pass: 'secret-pass',
      },
    })
    expect(sendMail).toHaveBeenCalledTimes(1)
    const mailOptions = sendMail.mock.calls[0][0]
    expect(mailOptions.to).toBe('contact@samintelligencegroup.com')
    expect(mailOptions.replyTo).toBe('jane@acme.example')
    expect(mailOptions.subject).toBe('New Project Brief from Jane <script> [MLOps]')
    expect(mailOptions.html).toContain('Jane &lt;script&gt;')
    expect(mailOptions.html).toContain('Need &lt;b&gt;pipeline&lt;/b&gt; &amp; monitoring')
    expect(mailOptions.html).not.toContain('<script>')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ success: true, message: 'Brief delivered successfully' })
  })

  it('returns 500 if Nodemailer fails to deliver', async () => {
    const sendMail = vi.fn().mockRejectedValue(new Error('SMTP connection failed'))
    vi.spyOn(nodemailer, 'createTransport').mockReturnValue({ sendMail })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = createMockResponse()

    await handler({
      method: 'POST',
      body: {
        name: 'Jane Doe',
        email: 'jane@acme.example',
        industry: 'MLOps',
        message: 'Project brief message',
      },
    }, res)

    expect(res.statusCode).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toMatch(/failed to send message/i)
  })
})
