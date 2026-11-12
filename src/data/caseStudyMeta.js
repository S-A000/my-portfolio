import { industriesMeta } from './industriesData.js'
import { pastProjects } from './projectsData.js'

export const siteOrigin = 'https://samintelligencegroup.com'
export const caseStudyMeta = {
  '/industries': {
    ...industriesMeta,
    heading: 'Technology built around how your business actually operates.',
    summary: 'SAM Intelligence Group connects custom software, data engineering, MLOps, and applied AI to real operational workflows across pharmacies, retail, B2B wholesale, manufacturing, logistics, research publishing, and environmental monitoring.',
    highlights: [
      'Pharmacies & Healthcare Retail: Searchable catalogs, stock-aware baskets, COD checkout, and separate pharmacist prescription review.',
      'B2B Wholesale & Distribution: Account-based catalogs, quotation workflows, reorder portals, and ERP/spreadsheet ETL.',
      'Manufacturing & Industrial Operations: C# / WPF operator validation tools, template checks, and print-proofing workflows.',
      'Environmental Data & Smart Infrastructure: Continuous telemetry ingestion, 606-feature MLOps forecasting, and computer vision benchmarking.',
    ],
  },
  '/case-studies': {
    title: 'Case Studies | SAM Intelligence Group',
    description: 'Explore Lobatse Pharmacy and the Three-City AQI Forecasting Platform: engineering decisions, interactive 3D walkthroughs, and verified outcomes.',
    image: '/case-studies/social-index.png',
    heading: 'Good engineering. Made visible.',
    summary: 'Deep-dive architectural case studies examining the operational constraints, engineering trade-offs, system walkthroughs, and verified outcomes behind SAM Intelligence Group builds.',
    highlights: [
      'Lobatse Pharmacy (.NET 10 / ASP.NET Core MVC / PostgreSQL / AWS): 11,204 source catalog rows processed with separate commerce and pharmacist prescription review paths.',
      'Three-City AQI Forecasting Platform (Python / BigQuery / MLflow / FastAPI / Streamlit): 105,054 checked-in hourly rows and 606 ordered model features for direct 24h, 48h, and 72h forecasts.',
    ],
  },
  '/case-studies/lobatse-pharmacy': {
    title: 'Lobatse Pharmacy Case Study | SAM Intelligence Group',
    description: 'An ASP.NET Core pharmacy platform connecting a large catalog, customer shopping, inventory, orders, and separate prescription review. 11,204 source rows processed.',
    image: '/case-studies/social-lobatse-pharmacy.png',
    heading: 'Building a Pharmacy E-commerce Platform for an 11,000+ Product Catalog',
    summary: 'Lobatse Pharmacy needed a digital storefront that could handle a large product catalog while supporting product discovery, cash-on-delivery orders, inventory reservations, and separate authorized pharmacist prescription review.',
    highlights: [
      'Verified Outcome: 11,204 source catalog rows processed (11,180 created, 19 updated, 5 skipped) with separate imagery reconciliation.',
      'Architecture: .NET 10, ASP.NET Core MVC, and EF Core modular monolith with PostgreSQL on Amazon RDS, Ubuntu AWS EC2 hosting, and Amazon S3 public/private document isolation.',
      'Designed and developed by Syed Abdullah Bin Masood.',
    ],
  },
  '/case-studies/aqi-forecasting': {
    title: 'Three-City AQI Forecasting Platform Case Study | SAM Intelligence Group',
    description: 'From hourly observations to direct 24h, 48h, and 72h AQI forecasts for Karachi, Lahore, and Islamabad. 105,054 checked-in rows and 606 ordered features.',
    image: '/case-studies/social-aqi-forecasting.png',
    heading: 'From Hourly Environmental Data to Three-City AQI Forecasts',
    summary: 'An end-to-end MLOps forecasting workflow turning hourly AQICN/WAQI and OpenWeather observations into direct 24-, 48-, and 72-hour air-quality forecasts for Karachi, Lahore, and Islamabad.',
    highlights: [
      'Verified Outcome: 105,054 checked-in hourly rows in BigQuery and a strict 606 ordered feature contract between training and FastAPI inference.',
      'Lifecycle: Chronological train/validation/test evaluation comparing Ridge, Random Forest, and Histogram Gradient Boosting in MLflow, served via FastAPI and Streamlit with scheduled GitHub Actions.',
      'Designed and developed by Syed Abdullah Bin Masood during an AI/ML and MLOps internship at 10Pearls.',
    ],
  },
  '/projects': {
    title: 'Work & Projects | SAM Intelligence Group',
    description: `Explore ${pastProjects.length} SAM Intelligence Group projects across data engineering, MLOps, custom software, AI, computer vision, cybersecurity, and developer tooling.`,
    image: '/social-preview.png',
    heading: 'A working archive, not a wall of claims.',
    summary: `Explore all ${pastProjects.length} documented SAM Intelligence Group builds across production MLOps platforms, custom .NET and React software, multimodal computer vision, cybersecurity, and open-source Python packages.`,
    highlights: [
      'Lobatse Pharmacy (.NET 10 / PostgreSQL / AWS) & Three-City AQI Forecasting MLOps Platform (BigQuery / MLflow / FastAPI).',
      'DeepGuard Multimodal Deepfake Video Forensics (186 commits, PyTorch, OpenCV) & BotShield Hybrid AI WAF.',
      'SAM-EDA Open-Source Python Package on PyPI & Industrial Print Proofing C#/WPF Desktop Validation Suite.',
    ],
  },
  '/about': {
    title: 'About Us | SAM Intelligence Group',
    description: 'Learn how SAM Intelligence Group delivers data engineering, MLOps, custom software, and applied AI projects.',
    image: '/social-preview.png',
    heading: 'Intelligence is useful when the system around it works.',
    summary: 'SAM Intelligence Group designs and delivers data platforms, MLOps systems, applied AI workflows, and custom software for global organizations through a 5-stage engineering lifecycle: Discovery, Architecture, Build, Deployment, and Support & Iteration.',
    highlights: [
      'Four Connected Practices: Data Engineering & ETL, MLOps & Production AI, Web Development & Custom Software, and AI Solutions.',
      'Global Delivery: Serving clients worldwide with transparent architecture, cloud deployment, and production-grade engineering led by Syed Abdullah Bin Masood.',
      'Direct Contact: contact@samintelligencegroup.com | https://samintelligencegroup.com/#contact',
    ],
  },
}
