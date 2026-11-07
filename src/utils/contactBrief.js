import { industries } from '../data/industriesData'

export function buildContactEmail(data, recipient) {
  const company=data.get('company')||'Not provided'
  const service=data.get('service')||'General inquiry'
  const industry=industries.find(item=>item.id===data.get('industry'))
  const subject=['Project conversation',service,industry?.name,company].filter(Boolean).join(' — ')
  const lines=[`Name: ${data.get('name')}`,`Company / organization: ${company}`,`Reply email: ${data.get('email')}`,`Area of interest: ${service}`]
  if(industry)lines.push(`Industry / workflow: ${industry.name}`)
  lines.push('','Project context:',data.get('scope'))
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}
