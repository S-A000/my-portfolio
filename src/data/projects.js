const art = (name) => `/projects/${name}.svg`

const details = (problem, built, architecture, features, contribution, outcomes = []) => ({ problem, built, architecture, features, contribution, outcomes })

export const projects = [
  {
    id: 'aqi-forecasting', title: 'AQI Forecasting MLOps Platform', category: 'MLOps · Data Engineering', status: 'Flagship', featured: true,
    image: '/projects/dashboard-karachi.webp', alt: 'AQI forecasting dashboard showing Karachi conditions and direct forecast cards',
    summary: 'A production-oriented system forecasting air quality across Pakistan’s three major cities.',
    overview: 'An end-to-end MLOps platform that turns hourly environmental observations into direct, monitored AQI forecasts for Karachi, Lahore and Islamabad.',
    ...details(
      'Operational AQI forecasting requires trustworthy live ingestion, leakage-safe feature engineering, reproducible model selection and reliable serving—not only a notebook model.',
      'A shared data and feature pipeline, per-horizon model selection, registered model bundles, strict inference validation, a FastAPI service, Streamlit dashboard and scheduled automation.',
      ['AQICN/WAQI + OpenWeather ingestion', 'BigQuery hourly feature storage', 'Canonical 606-feature pipeline', 'Chronological train/validation/test splits', 'MLflow comparison and model registration', 'FastAPI → Streamlit serving'],
      ['Direct 24h, 48h and 72h forecasts', 'City-isolated failure handling', 'Train-fitted preprocessing', 'Model-aware explanations', 'Automated hourly ingestion and daily training'],
      'Designed and developed the end-to-end system during an AI/ML & MLOps internship at 10Pearls.',
      ['105,054 checked-in hourly rows', 'Three supported cities', '606 ordered model features', 'Ridge, Random Forest and Histogram Gradient Boosting comparison'],
    ),
    tech: ['Python', 'BigQuery', 'MLflow', 'FastAPI', 'Streamlit', 'GitHub Actions', 'Docker'],
    tags: ['Featured Work', 'MLOps & Data Engineering', 'AI & Deep Learning'],
    gallery: [
      ['/projects/dashboard-karachi.webp', 'Karachi AQI dashboard'], ['/projects/dashboard-lahore.webp', 'Lahore AQI dashboard'], ['/projects/dashboard-islamabad.webp', 'Islamabad AQI dashboard'], ['/projects/api-docs.webp', 'FastAPI Swagger documentation'], ['/projects/mlflow-runs.webp', 'MLflow experiment runs'], ['/projects/shap-summary.webp', 'Local explanation contributions'], ['/projects/github-hourly-green.webp', 'Successful hourly GitHub Actions workflow'], ['/projects/github-daily-green.webp', 'Successful daily GitHub Actions workflow'],
    ],
    link: { label: 'GitHub', url: 'https://github.com/S-A000/AQI_Predictor-' },
  },
  {
    id: 'deepguard', title: 'DeepGuard', category: 'Computer Vision · Multimodal AI', status: 'Research Project', image: art('deepguard'), alt: 'Abstract face-forensics mesh with video analysis indicators',
    summary: 'A multi-branch deepfake video detection system combining visual, motion, forensic and audio evidence.', overview: 'A research-focused system for identifying AI-generated and manipulated videos using multimodal evidence.',
    ...details('Modern synthetic video can evade detectors that depend on a single visual signal or frame-level artifacts.', 'A deployment-oriented repository with expert branches, fusion logic, training pipelines, datasets, checkpoints, tests, frontend and backend surfaces.', ['Video input', 'Visual + motion + physics-informed + forensic + audio branches', 'Multimodal fusion', 'Deepfake classification'], ['Multi-branch neural architecture', 'Video dataset processing', 'Checkpointed training', 'Evaluation metrics'], 'Developed the research architecture, training workflow and deployment-oriented project structure.', ['186 repository commits', 'Public training and deployment structure']),
    tech: ['Python', 'PyTorch', 'OpenCV', 'Multimodal AI', 'Video Forensics', 'Docker'], tags: ['Featured Work', 'AI & Deep Learning', 'Computer Vision & Multimodal AI'], link: { label: 'GitHub', url: 'https://github.com/S-A000/deepguard' },
  },
  {
    id: 'intelligent-data-agent', title: 'Intelligent Data Agent', category: 'Local AI · Automation', status: 'Local-First', image: art('data-agent'), alt: 'Abstract terminal interface connected to local AI workflow nodes',
    summary: 'A privacy-aware CLI assistant for automating structured data tasks with local LLMs.', overview: 'A local-first developer assistant that coordinates data work through structured commands and on-device language models.',
    ...details('Data automation can expose sensitive context when it depends on remote AI services or opaque execution flows.', 'A CLI workflow integrating Ollama and LangChain with secure, structured command handling.', ['CLI request', 'Structured command layer', 'LangChain orchestration', 'Ollama local model', 'Data task execution'], ['Local model execution', 'Privacy-aware workflow', 'Structured commands', 'Data automation'], 'Designed and implemented the local agent workflow and command experience.'),
    tech: ['Python', 'Ollama', 'LangChain', 'CLI', 'Local LLM'], tags: ['Featured Work', 'Developer Tools & Automation', 'AI & Deep Learning'],
  },
  {
    id: 'instapipeline', title: 'InstaPipeline', category: 'Data Engineering · ETL', status: 'Pipeline', image: art('pipeline'), alt: 'Connected data pipeline nodes showing ingest, transform and archive stages',
    summary: 'An automated SSIS pipeline for video processing, structured logging and reliable archival.', overview: 'An ETL workflow that processes Instagram video files while maintaining structured, duplicate-safe operational records.',
    ...details('Manual file categorization, CSV logging and archival are repetitive and prone to duplicate processing.', 'Extraction, categorization, structured CSV logging and archive-folder movement as one automated pipeline.', ['File ingestion', 'Duplicate guard', 'Categorization', 'CSV logging', 'Archive movement'], ['Duplicate prevention', 'Automated categorization', 'Structured logs', 'Reliable archive workflow'], 'Designed the pipeline logic and safeguards for consistent repeated execution.'),
    tech: ['SSIS', 'SQL Server', 'ETL', 'CSV Automation'], tags: ['MLOps & Data Engineering', 'Developer Tools & Automation'], link: { label: 'GitHub', url: 'https://github.com/S-A000/Data_pipeline' },
  },
  {
    id: 'sam-eda', title: 'SAM-EDA', category: 'Open Source · Data', status: 'Published Package', image: art('sam-eda'), alt: 'Exploratory data analysis panels with distributions and correlations',
    summary: 'An open-source Python package that accelerates heuristic exploratory data analysis.', overview: 'A packaged developer utility for reducing repetitive early-stage dataset exploration.',
    ...details('Initial data profiling repeatedly requires the same checks, summaries and visual diagnostics.', 'A distributable Python package for automated heuristic EDA and early dataset understanding.', ['Dataset input', 'Heuristic profiling', 'Automated analysis', 'Readable report output'], ['Automated profiling', 'Reusable package API', 'Open-source distribution'], 'Designed, packaged and published the project through PyPI and GitHub Packages.', ['Published on PyPI']),
    tech: ['Python', 'PyPI', 'GitHub Packages', 'EDA'], tags: ['MLOps & Data Engineering', 'Developer Tools & Automation'], link: { label: 'PyPI', url: 'https://pypi.org/project/sam_eda/' },
  },
  {
    id: 'fraud-detection', title: 'Credit Card Fraud Detection', category: 'Deep Learning · Anomaly Detection', status: 'ML Project', image: art('fraud'), alt: 'Financial anomaly heatmap highlighting suspicious transactions',
    summary: 'CNN-based transaction classification with preprocessing, evaluation and a Streamlit demo.', overview: 'A deep-learning project that classifies financial transactions as legitimate or fraudulent.',
    ...details('Fraud detection must identify rare anomalous transactions within highly imbalanced financial data.', 'A preprocessing and CNN classification workflow with evaluation across accuracy, precision, recall and F1-score.', ['Transaction data', 'Preprocessing', 'CNN classifier', 'Evaluation', 'Streamlit demonstration'], ['CNN classification', 'Anomaly detection', 'Metric-driven evaluation', 'Interactive demo interface'], 'Implemented the preprocessing, model training, evaluation and demonstration flow.'),
    tech: ['Python', 'CNN', 'Kaggle', 'Streamlit', 'Anomaly Detection'], tags: ['AI & Deep Learning', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/Credit-Card-Fraud-Detection' },
  },
  {
    id: 'stock-forecast', title: 'Stock Price Prediction — Google', category: 'Time Series · Deep Learning', status: 'Forecasting', image: art('stock'), alt: 'Abstract stock-price chart with model forecast band',
    summary: 'An LSTM application for Google stock time-series forecasting and interactive visualization.', overview: 'A forecasting application that learns from historical Google stock sequences and presents predictions in Streamlit.',
    ...details('Financial time series require ordered sequence preparation and clear comparison of historical and forecast signals.', 'Historical preprocessing, sequence generation, LSTM training, prediction visualization and a Streamlit interface.', ['Historical GOOG data', 'Sequence preparation', 'LSTM training', 'Forecast generation', 'Streamlit visualization'], ['Sequence modeling', 'Trend visualization', 'Interactive interface'], 'Built the end-to-end time-series experimentation and visualization workflow.'),
    tech: ['Python', 'LSTM', 'Jupyter Notebook', 'Streamlit'], tags: ['AI & Deep Learning', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/Stock_price_prediction' },
  },
  {
    id: 'palmpilot', title: 'PalmPilot', category: 'Computer Vision · Interaction', status: 'Real-Time', image: art('palmpilot'), alt: 'Hand landmark visualization mapped to game controller inputs',
    summary: 'A real-time gesture controller that turns webcam hand landmarks into keyboard actions.', overview: 'A camera-only interaction system for controlling games through mapped hand gestures.',
    ...details('Accessible gesture input typically requires specialist hardware or dedicated controllers.', 'A webcam pipeline for hand landmark detection, gesture recognition and keyboard-event mapping.', ['Laptop camera', 'MediaPipe landmarks', 'Gesture mapping', 'Keyboard controls'], ['Real-time tracking', 'No additional hardware', 'Configurable gesture mapping'], 'Implemented the computer-vision pipeline and game-control integration.'),
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Computer Vision'], tags: ['Computer Vision & Multimodal AI', 'Developer Tools & Automation'], link: { label: 'GitHub', url: 'https://github.com/S-A000/PalmPilot' },
  },
  {
    id: 'vscode-extensions', title: 'VS Code Developer Extensions', category: 'Developer Tools · Automation', status: 'Tooling', image: art('extensions'), alt: 'Code editor panels connected to translation and explanation utilities',
    summary: 'Productivity extensions for automated SQL translation and plain-language code explanation.', overview: 'Custom editor tools that move repetitive explanation and translation tasks into the developer’s workflow.',
    ...details('Context switching slows down common code comprehension and database translation work.', 'VS Code extensions including an automated SQL translator and an “Explain Like I Am Five” code explainer.', ['Editor command', 'Selected code or SQL', 'Extension logic', 'In-editor output'], ['SQL translation', 'Code explanation', 'Native editor commands'], 'Designed and developed the extension workflows with the VS Code API.'),
    tech: ['JavaScript', 'VS Code API', 'Automation'], tags: ['Developer Tools & Automation'],
  },
  {
    id: 'web-extraction', title: 'Web Data Extraction Tool', category: 'Data Engineering · Automation', status: 'Utility', image: art('pipeline'), alt: 'Web extraction pipeline producing clean structured data',
    summary: 'A Python utility for extracting, cleaning, transforming and exporting web data to CSV.', overview: 'A reusable web-scraping utility that converts unstructured web content into structured records.',
    ...details('Manual collection and cleanup of website data is slow and inconsistent.', 'A scripted extraction, transformation and CSV export workflow.', ['Web source', 'Extractor', 'Cleaning', 'Transformation', 'CSV output'], ['Web scraping', 'Data cleanup', 'Structured export'], 'Implemented the extraction and transformation utility.'),
    tech: ['Python', 'Web Scraping', 'ETL', 'CSV'], tags: ['MLOps & Data Engineering', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/Extraction_Of_Data' },
  },
  {
    id: 'house-price', title: 'House Price Prediction', category: 'Machine Learning · Regression', status: 'ML Project', image: art('housing'), alt: 'Abstract house valuation chart and feature indicators', summary: 'A regression workflow covering preprocessing, feature analysis, model training and evaluation.', overview: 'A supervised-learning project for estimating real-estate prices from structured housing features.', ...details('Property valuation depends on interacting numeric and categorical signals that require consistent preprocessing.', 'A regression pipeline with feature analysis, training and prediction evaluation.', ['Housing data', 'Preprocessing', 'Feature analysis', 'Regression model', 'Evaluation'], ['Regression modeling', 'Feature analysis', 'Prediction evaluation'], 'Built the full experimentation workflow.'), tech: ['Python', 'Regression', 'Jupyter Notebook'], tags: ['AI & Deep Learning', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/House-price-Prediction' },
  },
  {
    id: 'pinn-app', title: 'PINN Web Application', category: 'Scientific ML · Web', status: 'Exploration', image: art('pinn'), alt: 'Neural network constrained by mathematical equations', summary: 'A web exploration of Physics-Informed Neural Networks and mathematical constraints.', overview: 'An exploratory application connecting neural learning with physics-informed mathematical constraints.', ...details('Scientific learning systems must balance observed data with governing equations.', 'A web application demonstrating how PINN concepts integrate constraints with neural networks.', ['Input conditions', 'Neural network', 'Physics constraint', 'Web result'], ['Scientific ML concepts', 'Constraint-aware learning', 'Web interface'], 'Explored and implemented the application concept.'), tech: ['Python', 'PINN', 'HTML'], tags: ['AI & Deep Learning', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/pinn_web_app' },
  },
  {
    id: 'chatbot', title: 'Chatbot Application', category: 'Conversational AI · Web', status: 'Application', image: art('chatbot'), alt: 'Conversation bubbles connected to a compact language-processing node', summary: 'A conversational interface built with web technologies and NLP-oriented concepts.', overview: 'A chatbot application that explores conversational interaction and language processing.', ...details('Conversational interfaces need clear interaction states and a coherent message workflow.', 'A web-based chat interface with NLP-oriented processing concepts.', ['User message', 'Conversation handler', 'NLP logic', 'Response interface'], ['Conversational UI', 'Message workflow', 'NLP concepts'], 'Developed the interface and conversation flow.'), tech: ['HTML', 'JavaScript', 'NLP'], tags: ['AI & Deep Learning', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/Chatbot-' },
  },
  {
    id: 'reel-downloader', title: 'Instagram Reel Downloader', category: 'Python · Automation', status: 'Utility', image: art('reel'), alt: 'Abstract media download queue and automated file handling flow', summary: 'A Python utility that automates repetitive Instagram media handling.', overview: 'A focused automation tool for simplifying repetitive reel download and file-handling tasks.', ...details('Repeated manual media retrieval and organization creates unnecessary friction.', 'A Python utility for automated reel download and file handling.', ['Media URL', 'Download utility', 'File processing', 'Local output'], ['Automated downloads', 'Repeatable file handling'], 'Created the focused automation utility.'), tech: ['Python', 'Automation'], tags: ['Developer Tools & Automation', 'More Projects'], link: { label: 'GitHub', url: 'https://github.com/S-A000/insta_reel_downloder' },
  },
]

export const rowNames = ['Featured Work', 'MLOps & Data Engineering', 'AI & Deep Learning', 'Computer Vision & Multimodal AI', 'Developer Tools & Automation', 'More Projects']
export const projectRows = rowNames.map((name) => ({ name, projects: projects.filter((project) => project.tags.includes(name)) }))

export const searchProjects = (query) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return projects
  return projects.filter((project) => [project.title, project.summary, project.category, ...project.tech].join(' ').toLowerCase().includes(normalized))
}
