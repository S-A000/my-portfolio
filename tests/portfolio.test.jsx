import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { caseStudies, flagshipProducts, servicePillars, technologyGroups } from '../src/data/agencyData'

describe('SAM Intelligence Group website', () => {
  it('renders the enterprise brand and core navigation', () => {
    render(<App />)
    expect(screen.getAllByText('SAM Intelligence Group').length).toBeGreaterThan(0)
    const primaryNavigation = within(screen.getByRole('navigation', { name: 'Primary navigation' }))
    expect(primaryNavigation.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services')
    expect(primaryNavigation.getByRole('link', { name: 'Flagship Products' })).toHaveAttribute('href', '#products')
    expect(primaryNavigation.getByRole('link', { name: 'Book a Consultation' })).toHaveAttribute('href', '#contact')
  })

  it('renders every service pillar from the central agency data', () => {
    render(<App />)
    servicePillars.forEach((pillar) => {
      expect(screen.getByRole('heading', { name: pillar.title })).toBeInTheDocument()
    })
  })

  it('renders both flagship products and only verified product links', () => {
    render(<App />)
    flagshipProducts.forEach((product) => {
      expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: /repository for botshield/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view repository for deepguard/i })).toHaveAttribute('href', 'https://github.com/S-A000/deepguard')
  })

  it('filters case studies by engineering domain', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'MLOps & Data' }))
    expect(screen.getByRole('heading', { name: 'sam-eda' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'SmartPark-Vision' })).not.toBeInTheDocument()
    expect(screen.getByText('3 case studies shown')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Computer Vision & AI' }))
    expect(screen.getByRole('heading', { name: 'SmartPark-Vision' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PalmPilot' })).toBeInTheDocument()
  })

  it('renders all case studies by default', () => {
    render(<App />)
    caseStudies.forEach((study) => expect(screen.getByRole('heading', { name: study.title })).toBeInTheDocument())
    expect(screen.getByText(`${caseStudies.length} case studies shown`)).toBeInTheDocument()
  })

  it('renders the categorized technology matrix without skill percentages', () => {
    render(<App />)
    technologyGroups.forEach((group) => expect(screen.getByRole('heading', { name: group.label })).toBeInTheDocument())
    expect(screen.queryByText(/90%/)).not.toBeInTheDocument()
  })

  it('provides the complete project discovery intake form', () => {
    render(<App />)
    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Company / Organization')).toBeRequired()
    expect(screen.getByLabelText('Work Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Service Required')).toBeRequired()
    expect(screen.getByLabelText('Project Scope / Architecture Needs')).toBeRequired()
    expect(screen.getByRole('option', { name: 'Cybersecurity / BotShield' })).toBeInTheDocument()
  })

  it('removes personal portfolio and CV language', () => {
    render(<App />)
    expect(screen.queryByText(/download cv/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/open to opportunities/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/more about me/i)).not.toBeInTheDocument()
  })
})
