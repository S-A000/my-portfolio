import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ServicesSection from './components/ServicesSection'
import PastProjectsSection from './components/PastProjectsSection'
import StackSection from './components/StackSection'
import LeadershipSection from './components/LeadershipSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import NeuralField from './components/NeuralField'

export default function App() {
  return (
    <div className="site-shell">
      <NeuralField />
      <Navbar />
      <main id="main-content">
        <Hero />
        <ServicesSection />
        <PastProjectsSection />
        <StackSection />
        <LeadershipSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
