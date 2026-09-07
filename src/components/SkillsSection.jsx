import { BrainCircuit, Boxes, Code2, Database, GitBranch, ServerCog, Sparkles } from 'lucide-react'
import { skillGroups } from '../data/skills'

const icons = [Code2, BrainCircuit, ServerCog, Sparkles, Database, Boxes, GitBranch]

export default function SkillsSection() {
  return <section className="content-section" id="skills" aria-labelledby="skills-title"><div className="section-heading"><span>Technical range</span><h2 id="skills-title">The stack behind the systems</h2><p>From experimentation to observable, deployment-oriented machine learning workflows.</p></div><div className="skills-grid">{skillGroups.map((group, index) => { const Icon = icons[index]; return <article className="skill-card" key={group.name}><Icon /><h3>{group.name}</h3><div className="chips">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article> })}</div></section>
}
