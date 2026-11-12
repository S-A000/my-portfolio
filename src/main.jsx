import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/service-showcase.css'
import './styles/corrections.css'
import './styles/case-studies.css'
import './styles/industries.css'
import './styles/visual-polish.css'

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
