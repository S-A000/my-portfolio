import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProjectRow from './components/ProjectRow'
import ProjectModal from './components/ProjectModal'
import SearchOverlay from './components/SearchOverlay'
import SkillsSection from './components/SkillsSection'
import ExperienceSection from './components/ExperienceSection'
import EducationSection from './components/EducationSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import { projectRows, projects } from './data/projects'

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const triggerRef = useRef(null)

  const syncUrl = useCallback(() => {
    const id = new URLSearchParams(window.location.search).get('project')
    setSelectedProject(id ? projects.find((project) => project.id === id) ?? null : null)
  }, [])

  useEffect(() => { syncUrl(); window.addEventListener('popstate', syncUrl); return () => window.removeEventListener('popstate', syncUrl) }, [syncUrl])

  const openProject = (project, trigger) => {
    triggerRef.current = trigger
    setSelectedProject(project)
    const url = new URL(window.location.href)
    url.searchParams.set('project', project.id)
    window.history.pushState({ project: project.id }, '', url)
  }
  const closeProject = useCallback(() => {
    setSelectedProject(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('project')
    window.history.replaceState({}, '', url)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }, [])

  return <>
    <Navbar onSearch={() => setSearchOpen(true)} />
    <main id="main-content">
      <Hero onFeatured={() => openProject(projects[0], document.activeElement)} />
      <div id="projects" className="project-library"><div className="library-intro"><span>Selected portfolio</span><h2>Browse the work</h2><p>Explore projects by discipline. Select any title for architecture, features and verified outcomes.</p></div>{projectRows.map((row) => <ProjectRow key={row.name} {...row} onOpen={openProject} />)}</div>
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </main>
    <Footer />
    <ProjectModal project={selectedProject} onClose={closeProject} />
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpenProject={openProject} />
  </>
}
