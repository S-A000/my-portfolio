import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import caseStudySeo from './scripts/caseStudySeo.js'

export default defineConfig({
  plugins: [react(), caseStudySeo()],
  test: { environment: 'jsdom', setupFiles: './tests/setup.js', css: true },
})
