import { ArrowDown, Download, Info, Layers3, Play } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero({ onFeatured }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__visual" aria-hidden="true"><div className="hero__grid" /><div className="hero__orb hero__orb--one" /><div className="hero__orb hero__orb--two" /><div className="hero__pipeline"><span /><span /><span /><span /><span /></div></div>
      <motion.div className="hero__content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
        <div className="eyebrow"><span className="signal" /> Open to opportunities</div>
        <div className="hero__kicker"><Layers3 size={18} /> AI/ML Developer</div>
        <h1 id="hero-title">Syed Abdullah<br /><span>Bin Masood</span></h1>
        <p className="hero__description">AI/ML Developer and Artificial Intelligence undergraduate building production-oriented systems across machine learning, MLOps, data engineering, computer vision, multimodal AI and local LLM automation.</p>
        <p className="hero__meta">BS Artificial Intelligence <b>•</b> Karachi, Pakistan <b>•</b> Open to AI/ML, MLOps and Data Engineering opportunities</p>
        <div className="hero__actions">
          <a className="button button--light" href="#projects"><Play fill="currentColor" /> View Projects</a>
          <button className="button button--glass" type="button" onClick={onFeatured}><Info /> More About Me</button>
          <a className="button button--ghost" href="/cv/Syed-Abdullah-Bin-Masood-CV.pdf" download><Download /> Download CV</a>
        </div>
      </motion.div>
      <a className="hero__scroll" href="#projects" aria-label="Scroll to projects"><ArrowDown /></a>
    </section>
  )
}
