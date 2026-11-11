import { industries } from '../data/industriesData'

export function formatContactBrief(data) {
  const name = String(data.get('name') || '').trim()
  const company = String(data.get('company') || '').trim() || 'Not provided'
  const email = String(data.get('email') || '').trim()
  const service = String(data.get('service') || '').trim() || 'General inquiry'
  const scope = String(data.get('scope') || '').trim()
  const industry = industries.find((item) => item.id === data.get('industry'))
  const industryLabel = industry?.name || service

  const lines = [
    `Name: ${name}`,
    `Company / organization: ${company}`,
    `Reply email: ${email}`,
    `Area of interest: ${service}`,
  ]
  if (industry) lines.push(`Industry / workflow: ${industry.name}`)
  lines.push('', 'Project context:', scope)

  const message = lines.join('\n')
  return {
    name,
    company,
    email,
    service,
    industry,
    industryLabel,
    message,
    subject: `New Project Brief from ${name} (${industryLabel})`,
    mailtoSubject: ['Project conversation', service, industry?.name, company].filter(Boolean).join(' — '),
  }
}

export function buildContactEmail(data, recipient) {
  const brief = formatContactBrief(data)
  return `mailto:${recipient}?subject=${encodeURIComponent(brief.mailtoSubject)}&body=${encodeURIComponent(brief.message)}`
}

export function buildBriefClipboardText(data, recipient) {
  const brief = formatContactBrief(data)
  return `To: ${recipient}\nSubject: ${brief.subject}\n\n${brief.message}`
}
