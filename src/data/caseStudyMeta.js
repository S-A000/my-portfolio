import { industriesMeta } from './industriesData.js'

export const siteOrigin = 'https://my-portfolio-nine-nu-52.vercel.app'
export const caseStudyMeta = {
  '/industries': industriesMeta,
  '/case-studies': { title: 'Case Studies | SAM Intelligence Group', description: 'Explore Lobatse Pharmacy and the Three-City AQI Forecasting Platform: engineering decisions, interactive 3D walkthroughs, and verified outcomes.', image: '/case-studies/social-index.png' },
  '/case-studies/lobatse-pharmacy': { title: 'Lobatse Pharmacy Case Study | SAM Intelligence Group', description: 'An ASP.NET Core pharmacy platform connecting a large catalog, customer shopping, inventory, orders, and separate prescription review. 11,204 source rows processed.', image: '/case-studies/social-lobatse-pharmacy.png' },
  '/case-studies/aqi-forecasting': { title: 'Three-City AQI Forecasting Platform Case Study | SAM Intelligence Group', description: 'From hourly observations to direct 24h, 48h, and 72h AQI forecasts for Karachi, Lahore, and Islamabad. 105,054 checked-in rows and 606 ordered features.', image: '/case-studies/social-aqi-forecasting.png' },
}
