import { pastProjects } from './projectsData'

export const brand = {
  name: 'SAM Intelligence Group',
  shortName: 'SAM',
  tagline: 'Engineering data, intelligent systems, and custom software.',
  email: 'abinemasood814@gmail.com',
}

export const navigation = [
  { label: 'Home', href: '/#home', route: '/' },
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'Industries', href: '/industries', route: '/industries' },
  { label: 'Case Studies', href: '/case-studies', route: '/case-studies' },
  { label: 'Work / Projects', href: '/projects', route: '/projects' },
  { label: 'About Us', href: '/about', route: '/about' },
  { label: 'Contact', href: '/#contact', section: 'contact' },
]

export const heroProof = [
  { value: String(pastProjects.length), label: 'documented builds and research projects' },
  { value: '04', label: 'connected engineering practices' },
  { value: '05', label: 'delivery stages from discovery to iteration' },
]

export const servicePillars = [
  {
    id: 'data-engineering', number: '01', title: 'Data Engineering', shortTitle: 'Data Engineering',
    executiveSummary: 'Reliable pipelines and analytical foundations that turn fragmented inputs into useful, reviewable information.',
    focus: 'Ingestion, ETL and ELT, automated exploration, storage design, and operational dashboards.',
    deliverables: ['Data ingestion and validation', 'Transformation workflows', 'Storage and query architecture', 'Reporting-ready outputs'],
    stack: ['Python', 'SQL Server', 'PostgreSQL', 'BigQuery', 'SSIS', 'Docker'],
  },
  {
    id: 'mlops', number: '02', title: 'MLOps', shortTitle: 'MLOps',
    executiveSummary: 'The repeatable engineering layer between model experiments and observable, maintainable delivery.',
    focus: 'Feature preparation, experiment tracking, model serving, evaluation, monitoring, and retraining workflows.',
    deliverables: ['Reproducible training pipelines', 'Experiment and model tracking', 'API-based model serving', 'Monitoring and iteration loops'],
    stack: ['MLflow', 'Feast', 'FastAPI', 'PyTorch', 'GitHub Actions', 'Docker'],
  },
  {
    id: 'web-software', number: '03', title: 'Web Development & Custom Software', shortTitle: 'Web & Software',
    executiveSummary: 'Purpose-built web and desktop systems shaped around the workflow, users, and constraints that actually matter.',
    focus: 'Responsive web products, APIs, operational tools, and .NET desktop or enterprise software.',
    deliverables: ['Responsive web applications', 'FastAPI and .NET backends', 'C# and WPF workflow tools', 'API and database integration'],
    stack: ['React', 'JavaScript', 'Python', 'FastAPI', 'C#', '.NET', 'WPF', 'SQL Server'],
  },
  {
    id: 'ai-solutions', number: '04', title: 'AI Solutions', shortTitle: 'AI Solutions',
    executiveSummary: 'Applied AI workflows that connect source material, models, automation, and human review in one coherent system.',
    focus: 'Computer vision, local AI assistants, research automation, forecasting, and responsible review surfaces.',
    deliverables: ['AI workflow architecture', 'Computer vision pipelines', 'Local-first automation', 'Human-reviewed outputs'],
    stack: ['PyTorch', 'OpenCV', 'YOLO', 'LangChain', 'Ollama', 'FastAPI'],
  },
]

export const approachSteps = [
  { number: '01', title: 'Discovery', description: 'Clarify the operating context, current system, users, constraints, and the decision the work needs to improve.' },
  { number: '02', title: 'Architecture', description: 'Choose boundaries, data flows, interfaces, and delivery trade-offs before implementation creates unnecessary lock-in.' },
  { number: '03', title: 'Build', description: 'Develop the smallest coherent system, validate it against real workflows, and keep technical decisions visible.' },
  { number: '04', title: 'Deployment', description: 'Prepare environments, automation, documentation, and operational handoff appropriate to the project context.' },
  { number: '05', title: 'Support & iteration', description: 'Review how the system performs in use, resolve friction, and plan the next practical improvement when needed.' },
]

export const technologyGroups = [
  { label: 'Data & MLOps', index: '01', items: ['Python', 'BigQuery', 'PostgreSQL', 'SQL Server', 'SSIS', 'MLflow', 'Feast'] },
  { label: 'AI & vision', index: '02', items: ['PyTorch', 'OpenCV', 'YOLO', 'MediaPipe', 'LangChain', 'Ollama'] },
  { label: 'Software delivery', index: '03', items: ['React', 'JavaScript', 'FastAPI', 'C#', '.NET', 'WPF', 'Docker', 'GitHub Actions'] },
]

export const aboutUs = {
  title: 'Connected engineering for systems that need to work in practice.',
  summary: 'SAM Intelligence Group designs and delivers data platforms, MLOps systems, applied AI workflows, and custom software.',
  detail: 'Projects begin with the operating reality: what information exists, how people use it, where the workflow breaks down, and what a maintainable next step looks like. Architecture, implementation, deployment, and iteration stay connected throughout delivery.',
  principles: [
    { title: 'Grounded in the workflow', description: 'The design follows the people, data, and decisions the system must support.' },
    { title: 'Architecture with evidence', description: 'Technical choices are tied to constraints and validated through working software.' },
    { title: 'Clear about maturity', description: 'Production work, prototypes, utilities, and research are presented for what they are.' },
  ],
}

export const serviceOptions = ['Data Engineering', 'MLOps', 'Web Development & Custom Software', 'AI Solutions', 'General Inquiry']

export const selectedProjectIds = ['aqi-forecasting', 'industrial-print-proofing', 'deepguard', 'sam-eda']
