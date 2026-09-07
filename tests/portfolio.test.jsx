import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import ProjectCard from '../src/components/ProjectCard'
import ProjectModal from '../src/components/ProjectModal'
import ProjectRow from '../src/components/ProjectRow'
import SearchOverlay from '../src/components/SearchOverlay'
import { projects } from '../src/data/projects'

describe('portfolio', () => {
  it('renders projects from the central data file', () => {
    render(<App />)
    projects.forEach((project) => expect(screen.getAllByText(project.title).length).toBeGreaterThan(0))
  })

  it('renders a project row from supplied data', () => {
    render(<ProjectRow name="Test Row" projects={projects.slice(0, 2)} onOpen={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Test Row' })).toBeInTheDocument()
    expect(screen.getAllByText('DeepGuard').length).toBeGreaterThan(0)
  })

  it('filters projects instantly in search', async () => {
    render(<SearchOverlay open onClose={vi.fn()} onOpenProject={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/search projects/i), 'MediaPipe')
    expect(screen.getAllByText('PalmPilot').length).toBeGreaterThan(0)
    expect(screen.queryByText('DeepGuard')).not.toBeInTheDocument()
  })

  it('shows an empty search state', async () => {
    render(<SearchOverlay open onClose={vi.fn()} onOpenProject={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/search projects/i), 'no-such-project-123')
    expect(screen.getByRole('heading', { name: 'No projects found' })).toBeInTheDocument()
  })

  it('opens a project modal from a card click', async () => {
    const onOpen = vi.fn()
    render(<ProjectCard project={projects[1]} onOpen={onOpen} />)
    await userEvent.click(screen.getByRole('button', { name: /open details for deepguard/i }))
    expect(onOpen).toHaveBeenCalledWith(projects[1], expect.anything())
  })

  it('opens project cards with the keyboard', () => {
    const onOpen = vi.fn()
    render(<ProjectCard project={projects[1]} onOpen={onOpen} />)
    fireEvent.keyDown(screen.getByRole('button', { name: /open details for deepguard/i }), { key: 'Enter' })
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('closes the modal with its close button', async () => {
    const onClose = vi.fn()
    render(<ProjectModal project={projects[0]} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close project details/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes the modal with Escape', () => {
    const onClose = vi.fn()
    render(<ProjectModal project={projects[0]} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('provides the real downloadable CV link', () => {
    render(<App />)
    const links = screen.getAllByRole('link', { name: /download cv/i })
    expect(links[0]).toHaveAttribute('href', '/cv/Syed-Abdullah-Bin-Masood-CV.pdf')
    expect(links[0]).toHaveAttribute('download')
  })

  it('only renders source buttons for verified URLs', () => {
    const { rerender } = render(<ProjectCard project={projects.find((project) => project.id === 'intelligent-data-agent')} onOpen={vi.fn()} />)
    expect(screen.queryByLabelText(/open intelligent data agent on/i)).not.toBeInTheDocument()
    rerender(<ProjectCard project={projects.find((project) => project.id === 'deepguard')} onOpen={vi.fn()} />)
    expect(screen.getByLabelText(/open deepguard on github/i)).toHaveAttribute('href', 'https://github.com/S-A000/deepguard')
  })
})
