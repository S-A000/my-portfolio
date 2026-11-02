/**
 * @typedef {Object} ServicePillar
 * @property {string} id
 * @property {string} number
 * @property {string} title
 * @property {string} executiveSummary
 * @property {string} focus
 * @property {string[]} deliverables
 * @property {string[]} stack
 * @property {'cyan'|'indigo'|'emerald'|'violet'} accent
 */

/**
 * @typedef {Object} CaseStudy
 * @property {string} id
 * @property {string} title
 * @property {string} eyebrow
 * @property {string[]} categories
 * @property {string} challenge
 * @property {string} architecture
 * @property {string} impact
 * @property {string[]} stack
 * @property {{label: string, url: string}[]} links
 */

export const brand = {
  name: 'SAM Intelligence Group',
  shortName: 'SAM',
  tagline: 'Engineering Autonomous Intelligence, Resilient Data Architectures & Next-Gen Cyber Defense.',
  email: 'abinemasood814@gmail.com',
  github: 'https://github.com/S-A000',
}

export const navigation = [
  { label: 'Home', id: 'home' },
  { label: 'Services', id: 'services' },
  { label: 'Past Projects', id: 'projects' },
  { label: 'Tech Stack', id: 'stack' },
  { label: 'Contact', id: 'contact' },
]

export const trustMetrics = [
  { value: 'End-to-End MLOps', label: 'Automated Model Pipelines' },
  { value: 'Data Architecture', label: 'Low-Latency ETL & Warehousing' },
  { value: '100% Hardened', label: 'AI WAF & Deepfake Forensics' },
  { value: 'Enterprise Ready', label: 'Scalable Web & Desktop Systems' },
]

/** @type {ServicePillar[]} */
export const servicePillars = [
  {
    id: 'software-engineering',
    number: '01',
    title: 'Enterprise Web & Custom Software Engineering',
    executiveSummary: 'High-throughput digital products and operational software engineered around complex business workflows.',
    focus: 'B2B SaaS platforms, responsive web applications, and mission-critical desktop and industrial automation software.',
    deliverables: [
      'Full-stack React and Next.js applications',
      'Scalable FastAPI and .NET backends',
      'C# / WPF workflow and validation suites',
      'Cloud-native API ecosystems',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'C#', '.NET', 'WPF', 'Python', 'FastAPI', 'SQL Server', 'PostgreSQL', 'Supabase'],
    accent: 'cyan',
  },
  {
    id: 'data-engineering',
    number: '02',
    title: 'Data Engineering & Automated Pipelines',
    executiveSummary: 'Clean, governed data flows that turn fragmented sources into dependable analytical and operational systems.',
    focus: 'Low-latency data movement, repeatable transformations, reliable telemetry, and performance-aware storage architecture.',
    deliverables: [
      'End-to-end ETL and ELT orchestration',
      'Automated cleaning and EDA frameworks',
      'Real-time telemetry ingestion',
      'High-performance database architecture',
    ],
    stack: ['Python', 'PostgreSQL', 'SQL Server', 'Automated EDA', 'Real-Time Streaming', 'Docker'],
    accent: 'indigo',
  },
  {
    id: 'mlops',
    number: '03',
    title: 'MLOps & Production AI Infrastructure',
    executiveSummary: 'The engineering layer between a promising model and an observable, repeatable production capability.',
    focus: 'Reproducible training, resilient model serving, private AI, and measurable inference performance across the delivery lifecycle.',
    deliverables: [
      'Centralized Feast feature stores',
      'Multi-horizon forecasting pipelines',
      'Automated training and retraining CI/CD',
      'Local-first LLM and MCP deployments',
    ],
    stack: ['Feast', 'PyTorch', 'FastAPI', 'Docker', 'GitHub Actions', 'LangChain', 'Ollama', 'MCP'],
    accent: 'emerald',
  },
  {
    id: 'cybersecurity',
    number: '04',
    title: 'Cybersecurity, Edge WAF & AI Forensics',
    executiveSummary: 'Intelligent protection for applications, media, and AI systems operating in adversarial environments.',
    focus: 'Proactive application defense, bot mitigation, media integrity, and rigorous AI safety evaluation.',
    deliverables: [
      'Hybrid edge-and-cloud AI WAF systems',
      'Automated bot and threat mitigation',
      'Multi-modal deepfake forensics',
      'LLM red-teaming and safety evaluations',
    ],
    stack: ['Edge / Cloud WAF', '.NET Security', 'Multi-Modal Forensics', 'AI Red-Teaming', 'Threat Telemetry'],
    accent: 'violet',
  },
  {
    id: 'aspnet-web-development',
    number: '05',
    title: 'Enterprise ASP.NET & .NET Core Ecosystems',
    executiveSummary: 'Architecting highly secure, high-throughput, and mission-critical web applications, corporate portals, and scalable SaaS platforms.',
    focus: 'Full-stack ASP.NET Core MVC & Blazor development, robust backend microservices, resilient REST/gRPC APIs, legacy architecture modernization, and seamless SQL Server/Cloud integrations tailored for enterprise-grade performance and reliability.',
    deliverables: [
      'Full-stack ASP.NET Core MVC & Blazor development',
      'Robust backend microservices and resilient REST/gRPC APIs',
      'Legacy architecture modernization',
      'Seamless SQL Server/Cloud integrations',
    ],
    stack: ['ASP.NET Core', '.NET Core', 'MVC', 'Blazor', 'REST', 'gRPC', 'SQL Server', 'Azure'],
    accent: 'indigo',
  },
]

export const flagshipProducts = [
  {
    id: 'botshield',
    name: 'BotShield',
    badge: 'Cybersecurity & Edge AI',
    status: 'Enterprise Ready',
    summary: 'A hybrid edge-and-cloud defense engine for WordPress and .NET ecosystems, designed to stop automated scraping, credential stuffing, and anomalous traffic before it reaches critical application paths.',
    architecture: ['Edge signal capture', 'Behavioral risk scoring', 'Cloud-assisted inference', 'Policy enforcement'],
    features: ['Adaptive bot classification', 'Threat telemetry and audit trails', 'WordPress and .NET integration paths'],
    stack: ['Edge WAF', '.NET', 'WordPress', 'Threat Intelligence'],
    accent: 'cyan',
  },
  {
    id: 'deepguard',
    name: 'DeepGuard',
    badge: 'AI Forensics & Security',
    status: 'Active Deployment',
    summary: 'A multi-modal media integrity platform that analyzes spatial, motion, frequency, and audio evidence in parallel to identify synthetic video and deepfake manipulation.',
    architecture: ['Video and audio ingest', 'Parallel forensic branches', 'Evidence fusion', 'Integrity assessment'],
    features: ['Multi-branch analysis', 'Deployment-oriented evaluation pipeline', 'Explainable evidence surfaces'],
    stack: ['PyTorch', 'OpenCV', 'Multi-Modal AI', 'Docker'],
    accent: 'indigo',
    link: { label: 'View repository', url: 'https://github.com/S-A000/deepguard' },
  },
]

export const caseStudyFilters = ['All', 'MLOps & Data', 'Cybersecurity', 'Enterprise Software', 'Computer Vision & AI']

/** @type {CaseStudy[]} */
export const caseStudies = [
  {
    id: 'air-quality-mlops',
    title: 'Multi-Horizon Air Quality Forecasting MLOps Platform',
    eyebrow: 'Production forecasting',
    categories: ['MLOps & Data'],
    challenge: 'Continuous environmental forecasting requires consistent features, repeatable training, and reliable predictions across multiple time horizons.',
    architecture: 'Live ingestion feeds validated feature pipelines and a Feast feature store, with FastAPI microservices and automated CI/CD coordinating training and inference.',
    impact: 'A cohesive production architecture connects changing environmental data to reproducible forecasts, observability, and deployment workflows.',
    stack: ['Feast', 'FastAPI', 'Python', 'Docker', 'GitHub Actions'],
    links: [{ label: 'GitHub', url: 'https://github.com/S-A000/AQI_Predictor-' }],
  },
  {
    id: 'industrial-print-proofing',
    title: 'Industrial Print Proofing & Label Validation Suite',
    eyebrow: 'Industrial workflow automation',
    categories: ['Enterprise Software'],
    challenge: 'High-volume print workflows need dependable proofing and template validation without repetitive manual inspection.',
    architecture: 'A C# and WPF desktop application combines deterministic validation rules, workflow state, and structured data access for operator-ready quality assurance.',
    impact: 'The solution standardizes validation decisions and gives industrial teams a faster, repeatable path from artwork review to approved output.',
    stack: ['C#', '.NET', 'WPF', 'SQL Server', 'Validation Engine'],
    links: [],
  },
  {
    id: 'research-brief-engine',
    title: 'Automated Intelligence & Research Brief Engine',
    eyebrow: 'Generative intelligence workflows',
    categories: ['MLOps & Data', 'Computer Vision & AI'],
    challenge: 'Decision-makers need structured insight from dense, multi-source current-affairs material without losing traceability or context.',
    architecture: 'A governed LLM workflow collects source material, orchestrates synthesis, and formats findings into consistent executive-ready research briefs.',
    impact: 'Complex source material becomes a repeatable intelligence artifact that is easier to review, compare, and act on.',
    stack: ['LLMs', 'LangChain', 'Python', 'Structured Outputs'],
    links: [],
  },
  {
    id: 'smartpark-vision',
    title: 'SmartPark-Vision',
    eyebrow: 'Automated occupancy analytics',
    categories: ['Computer Vision & AI'],
    challenge: 'Real-time spatial occupancy tracking must balance detection quality, processing cost, and deployment constraints.',
    architecture: 'Classical computer vision and YOLO detection pipelines are benchmarked against the same video streams to compare accuracy, latency, and operational fit.',
    impact: 'The evaluation framework supports evidence-based model selection for responsive occupancy monitoring at the edge.',
    stack: ['YOLO', 'OpenCV', 'Python', 'Edge Vision'],
    links: [],
  },
  {
    id: 'sam-eda',
    title: 'sam-eda',
    eyebrow: 'Open-source data engineering toolkit',
    categories: ['MLOps & Data'],
    challenge: 'Data teams repeatedly spend early project cycles recreating the same cleaning, profiling, and exploratory analysis steps.',
    architecture: 'A distributable Python package standardizes heuristic dataset inspection through a reusable API and repeatable report flow.',
    impact: 'Published tooling reduces repetitive setup and creates a consistent baseline for early-stage dataset understanding.',
    stack: ['Python', 'PyPI', 'Automated EDA', 'Data Quality'],
    links: [{ label: 'PyPI', url: 'https://pypi.org/project/sam_eda/' }],
  },
  {
    id: 'palmpilot',
    title: 'PalmPilot',
    eyebrow: 'Low-latency vision control',
    categories: ['Computer Vision & AI'],
    challenge: 'Natural gesture control needs responsive input without specialist hardware or a dedicated physical controller.',
    architecture: 'A webcam pipeline maps MediaPipe hand landmarks through gesture recognition into low-latency keyboard control events.',
    impact: 'The engine demonstrates responsive, camera-only interaction and configurable gesture mapping for edge experiences.',
    stack: ['MediaPipe', 'OpenCV', 'Python', 'Real-Time Vision'],
    links: [{ label: 'GitHub', url: 'https://github.com/S-A000/PalmPilot' }],
  },
]

export const technologyGroups = [
  { label: 'AI & MLOps', index: '01', items: ['PyTorch', 'LangChain', 'Feast', 'Ollama', 'MCP', 'OpenCV', 'YOLO'] },
  { label: 'Backend & Data', index: '02', items: ['Python', 'FastAPI', 'C#', '.NET', 'WPF', 'PostgreSQL', 'SQL Server', 'Supabase'] },
  { label: 'Frontend & Cloud', index: '03', items: ['React', 'Next.js', 'TypeScript', 'Docker', 'GitHub Actions'] },
]

export const leadership = {
  name: 'Syed Abdullah Bin Masood',
  role: 'Founder & Principal Architect',
  summary: 'Leads AI systems architecture, MLOps infrastructure, and enterprise software delivery at SAM Intelligence Group.',
  detail: 'The practice is grounded in hands-on R&D across Scientific ML, AI safety, production data engineering, multi-modal forensics, and resilient application architecture.',
  focusAreas: ['AI systems architecture', 'Production MLOps', 'Enterprise software delivery', 'AI safety & Scientific ML'],
}

export const serviceOptions = [
  'AI & ML Development',
  'MLOps & Data Engineering',
  'Cybersecurity / BotShield',
  'Custom Web & Enterprise Software',
  'General Inquiry',
]
