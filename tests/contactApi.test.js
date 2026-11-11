import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '../api/contact'

const createMockResponse = () => ({
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
})

describe('Vercel serverless contact handler (/api/contact via Resend)', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test_key_123'
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
    expect(res.body).toEqual({ success: false, error: 'Name, email, and message are required.' })
  })

  it('sends formatted email via Resend API and escapes HTML input', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'email_123' }),
    })
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

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(options.method).toBe('POST')

    const payload = JSON.parse(options.body)
    expect(payload).toMatchObject({
      from: 'SAM Intelligence Contact <onboarding@resend.dev>',
      to: ['contact@samintelligencegroup.com'],
      reply_to: 'jane@acme.example',
      subject: 'New Project Brief: Jane <script> [MLOps]',
    })
    expect(payload.html).toContain('Jane &lt;script&gt;')
    expect(payload.html).toContain('Need &lt;b&gt;pipeline&lt;/b&gt; &amp; monitoring')
    expect(payload.html).not.toContain('<script>')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ success: true, message: 'Brief delivered successfully' })
  })

  it('returns 500 if Resend API returns an error response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      text: async () => JSON.stringify({ name: 'validation_error', message: 'Invalid API key' }),
    })
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
    expect(res.body).toEqual({ success: false, error: 'Invalid API key' })
  })

  it('returns 500 if RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY
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
    expect(res.body.error).toMatch(/missing api key/i)
  })
})
