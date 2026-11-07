import { beforeEach, describe, expect, it } from 'vitest'
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
      expect(screen.getByRole('heading', { name: project.title, level: 2 })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'MLOps & Data' }))
    expect(screen.getByRole('heading', { name: 'AQI Forecasting MLOps Platform', level: 2 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Industrial Print Proofing & Label Validation Suite', level: 2 })).not.toBeInTheDocument()

    const aqiCard = screen.getByRole('heading', { name: 'AQI Forecasting MLOps Platform', level: 2 }).closest('article')
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
    expect(screen.queryByText(/founder/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument()
    expect(document.title).toBe('About Us | SAM Intelligence Group')
  })

  it('makes the local email handoff and validation explicit', () => {
    renderRoute()
    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Company / organization')).toBeRequired()
    expect(screen.getByLabelText('Work email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Area of interest')).toBeRequired()
    expect(screen.getByLabelText('Project context')).toHaveAttribute('minlength', '40')
    expect(screen.getByText(/only opens a prefilled draft/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open prepared email' })).toBeInTheDocument()
  })

  it('does not display unsupported hardening or deployment claims', () => {
    renderRoute()
    expect(screen.queryByText(/100% hardened/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/enterprise ready/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/active deployment/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/secure intake/i)).not.toBeInTheDocument()
  })
})
