import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { pastProjects } from '../src/data/projectsData'

const renderRoute = (route = '/') => {
  window.history.replaceState({}, '', route)
  return render(<App />)
}

describe('SAM Intelligence Group website', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('renders company navigation with dedicated About and Projects routes', () => {
    renderRoute()
    const navigation = within(screen.getByRole('navigation', { name: 'Primary navigation' }))
    expect(navigation.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/#home')
    expect(navigation.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/#services')
    expect(navigation.getByRole('link', { name: 'Work / Projects' })).toHaveAttribute('href', '/projects')
    expect(navigation.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about')
    expect(navigation.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/#contact')
  })

  it('provides four accessible service scenes in the required order', async () => {
    const user = userEvent.setup()
    renderRoute()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(4)
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      expect.stringContaining('Data Engineering'),
      expect.stringContaining('MLOps'),
      expect.stringContaining('Web & Software'),
      expect.stringContaining('AI Solutions'),
    ])

    await user.click(tabs[1])
    expect(screen.getByRole('heading', { name: 'MLOps', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /model artifact moves/i })).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { name: 'Web Development & Custom Software', level: 3 })).toBeInTheDocument()
  })

  it('positions the company around the four primary services only', () => {
    renderRoute()
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(screen.queryByRole('heading', { name: /cybersecurity/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/founder-led/i)).not.toBeInTheDocument()
  })

  it('renders the complete project library with filters and details', async () => {
    const user = userEvent.setup()
    renderRoute('/projects')
    expect(screen.getByRole('status')).toHaveTextContent(`${pastProjects.length} projects shown`)
    pastProjects.forEach((project) => {
      expect(screen.getByRole('heading', { name: project.title, level: 3 })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'MLOps & Data' }))
    expect(screen.getByRole('heading', { name: 'AQI Forecasting MLOps Platform', level: 3 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Industrial Print Proofing & Label Validation Suite', level: 3 })).not.toBeInTheDocument()

    const aqiCard = screen.getByRole('heading', { name: 'AQI Forecasting MLOps Platform', level: 3 }).closest('article')
    await user.click(within(aqiCard).getByRole('button', { name: /view details/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'AQI Forecasting MLOps Platform', level: 2 })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument()
  })

  it('renders a substantive company-focused About page and route metadata', () => {
    renderRoute('/about')
    expect(screen.getByRole('heading', { name: /intelligence is useful/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /four services, designed to work together/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Data Engineering', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'MLOps', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Web Development & Custom Software', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Solutions', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('PINN Web Application')).toBeInTheDocument()
    expect(document.querySelectorAll('.proof-strip__list > a')).toHaveLength(4)
    expect(document.querySelectorAll('.proof-strip__list > a > span')).toHaveLength(4)
    expect(screen.getByRole('heading', { name: 'What does SAM Intelligence Group build?', level: 3 })).toBeInTheDocument()
    expect(screen.queryByText(/founder/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument()
    expect(document.title).toBe('About Us | SAM Intelligence Group')
    expect(document.head.querySelector('link[rel=canonical]')).toHaveAttribute('href', 'https://samintelligencegroup.com/about')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('uses contact@samintelligencegroup.com globally and validates direct serverless brief submission', async () => {
    const user = userEvent.setup()
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'test-web3forms-key')
    let resolveFetch
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise((resolve) => { resolveFetch = resolve }),
    )

    renderRoute()
    expect(screen.getAllByRole('link', { name: /contact@samintelligencegroup\.com/i })).toHaveLength(2)
    expect(screen.queryByText(/abinemasood814@gmail\.com/i)).not.toBeInTheDocument()

    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Company / organization')).toBeRequired()
    expect(screen.getByLabelText('Work email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Area of interest')).toBeRequired()
    expect(screen.getByLabelText('Project context')).toHaveAttribute('minlength', '40')
    expect(screen.getByText(/without saving form data on this site/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Company / organization'), 'Acme Labs')
    await user.type(screen.getByLabelText('Work email'), 'jane@acme.example')
    await user.selectOptions(screen.getByLabelText('Area of interest'), 'MLOps')
    await user.type(
      screen.getByLabelText('Project context'),
      'We need a reproducible training and model-serving pipeline for hourly telemetry.',
    )

    await user.click(screen.getByRole('button', { name: 'Send project brief' }))
    expect(screen.getByRole('button', { name: /sending brief/i })).toBeDisabled()
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.web3forms.com/submit',
      expect.objectContaining({ method: 'POST' }),
    )

    const [, requestOptions] = fetchSpy.mock.calls[0]
    const payload = JSON.parse(requestOptions.body)
    expect(payload).toMatchObject({
      access_key: 'test-web3forms-key',
      from_name: 'SAM Intelligence Group Web Portal',
      name: 'Jane Doe',
      email: 'jane@acme.example',
      industry: 'MLOps',
      subject: 'New Project Brief from Jane Doe [MLOps]',
    })
    expect(payload.message).toContain('Acme Labs')

    resolveFetch({
      ok: true,
      json: async () => ({ success: true }),
    })

    expect(await screen.findByRole('heading', { name: 'Brief Sent Successfully!' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Success checkmark' })).toBeInTheDocument()
    expect(screen.getByText(/get back to you at/i)).toHaveTextContent('contact@samintelligencegroup.com')

    await user.click(screen.getByRole('button', { name: 'Send another message' }))
    expect(screen.getByRole('button', { name: 'Send project brief' })).toBeEnabled()
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('shows a clear error and preserves data when VITE_WEB3FORMS_ACCESS_KEY is missing', async () => {
    const user = userEvent.setup()
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '')
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    renderRoute()
    await user.type(screen.getByLabelText('Name'), 'Sara Ali')
    await user.type(screen.getByLabelText('Company / organization'), 'Beta Corp')
    await user.type(screen.getByLabelText('Work email'), 'sara@beta.example')
    await user.selectOptions(screen.getByLabelText('Area of interest'), 'AI Solutions')
    await user.type(
      screen.getByLabelText('Project context'),
      'Building a document extraction and human review workflow for our analysts.',
    )

    await user.click(screen.getByRole('button', { name: 'Send project brief' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/VITE_WEB3FORMS_ACCESS_KEY/i)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Name')).toHaveValue('Sara Ali')
    expect(within(alert).getByRole('button', { name: /copy brief & email/i })).toBeInTheDocument()
  })

  it('retains form data and offers a one-click Copy Brief & Email fallback on submission failure', async () => {
    const user = userEvent.setup()
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'test-web3forms-key')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network offline'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    renderRoute()
    await user.type(screen.getByLabelText('Name'), 'Ali Khan')
    await user.type(screen.getByLabelText('Company / organization'), 'Northwind')
    await user.type(screen.getByLabelText('Work email'), 'ali@northwind.example')
    await user.selectOptions(screen.getByLabelText('Area of interest'), 'Data Engineering')
    await user.type(
      screen.getByLabelText('Project context'),
      'Migrating SQL Server reporting pipelines and batch ETL jobs to BigQuery.',
    )

    await user.click(screen.getByRole('button', { name: 'Send project brief' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/network offline/i)
    expect(screen.getByLabelText('Name')).toHaveValue('Ali Khan')

    await user.click(within(alert).getByRole('button', { name: /copy brief & email/i }))
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText.mock.calls[0][0]).toContain('contact@samintelligencegroup.com')
    expect(writeText.mock.calls[0][0]).toContain('Migrating SQL Server reporting pipelines')
    expect(await screen.findByText(/copied your brief and contact@samintelligencegroup\.com to clipboard/i)).toBeInTheDocument()
  })

  it('does not display unsupported hardening or deployment claims', () => {
    renderRoute()
    expect(screen.queryByText(/100% hardened/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/enterprise ready/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/active deployment/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/secure intake/i)).not.toBeInTheDocument()
  })
})
