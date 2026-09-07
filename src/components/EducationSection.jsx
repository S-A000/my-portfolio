import { GraduationCap, Trophy } from 'lucide-react'

export default function EducationSection() {
  return <section className="content-section" id="education" aria-labelledby="education-title"><div className="section-heading"><span>Education & development</span><h2 id="education-title">Learning with an applied focus</h2></div><div className="education-grid"><article className="education-card"><GraduationCap /><span>In progress</span><h3>Bachelor of Science in Artificial Intelligence</h3><p>Iqra University · Karachi, Pakistan</p><small>Artificial Intelligence, Machine Learning, Deep Learning, Data Engineering, Databases, Software Engineering, Computer Vision and NLP.</small></article><article className="education-card"><Trophy /><span>80 hours</span><h3>DevOps Bootcamp</h3><p>Iqra University</p><small>Practical exposure to Git, Docker, deployment concepts, automation workflows and modern software development practices.</small></article></div></section>
}
