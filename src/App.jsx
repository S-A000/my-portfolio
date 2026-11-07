import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AboutPage from './pages/CompanyAboutPage'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import CaseStudyPage from './pages/CaseStudyPage'
import IndustriesPage from './pages/IndustriesPage'

const normalizePath = (value) => value.replace(/\/+$/, '') || '/'

function NotFoundPage() {
  return (
    <section className="not-found shell" aria-labelledby="not-found-title">
      <p className="eyebrow"><span /> 404 / Route not found</p>
      <h1 id="not-found-title">This page is outside the system.</h1>
      <p>Return to the SAM Intelligence Group homepage or explore the project library.</p>
      <div><a className="button button--primary" href="/">Go home</a><a className="button button--quiet" href="/projects">View projects</a></div>
    </section>
  )
}

export default function App() {
  const path = normalizePath(window.location.pathname)
  const caseId = ['/case-studies/lobatse-pharmacy', '/case-studies/aqi-forecasting'].includes(path) ? path.split('/').at(-1) : null
  const page = path === '/industries' ? <IndustriesPage /> : caseId ? <CaseStudyPage id={caseId} /> : path === '/case-studies' ? <CaseStudiesPage /> : path === '/about'
    ? <AboutPage />
    : path === '/projects'
      ? <ProjectsPage />
      : path === '/'
        ? <HomePage />
        : <NotFoundPage />

  return (
    <div className="site-shell">
      <Navbar />
      <main id="main-content">{page}</main>
      <Footer />
    </div>
  )
}
