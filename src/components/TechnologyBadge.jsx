import { Boxes } from 'lucide-react'

const iconTypes = {
  python: 'python',
  bigquery: 'bigquery',
  postgresql: 'postgresql',
  'sql-server': 'sqlserver',
  ssis: 'ssis',
  mlflow: 'mlflow',
  feast: 'feast',
  pytorch: 'pytorch',
  opencv: 'opencv',
  yolo: 'yolo',
  mediapipe: 'mediapipe',
  langchain: 'langchain',
  ollama: 'ollama',
  react: 'react',
  javascript: 'javascript',
  fastapi: 'fastapi',
  'c-sharp': 'csharp',
  dotnet: 'dotnet',
  wpf: 'wpf',
  docker: 'docker',
  'github-actions': 'githubactions',
  'asp-net-core-mvc': 'dotnet',
  'ef-core': 'dotnet',
  streamlit: 'streamlit',
  'amazon-rds': 'rds',
  'aws-ec2': 'ec2',
  'amazon-s3': 's3',
}

const slugify = (name) => name.toLowerCase()
  .replace('c#', 'c-sharp')
  .replace('.net', 'dotnet')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

function BrandMark({ type }) {
  if (type === 'streamlit') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ff4b4b" d="m3 10 8 4 5-8 5 8 8-4-4 15H7Z"/><path fill="#ff8c8c" d="m3 10 13 9L29 10l-4 15H7Z"/></svg>
  if (type === 'ec2') return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="6" width="20" height="20" rx="2" fill="#ed7100"/><rect x="11" y="11" width="10" height="10" fill="none" stroke="white" strokeWidth="1.5"/><path d="M10 2v4m6-4v4m6-4v4M10 26v4m6-4v4m6-4v4M2 10h4m-4 6h4m-4 6h4m20-12h4m-4 6h4m-4 6h4" stroke="#ed7100" strokeWidth="2"/></svg>
  if (type === 'rds') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#527fff" d="m16 2 12 6v16l-12 6-12-6V8Z"/><ellipse cx="16" cy="10" rx="7" ry="3" fill="none" stroke="white" strokeWidth="1.5"/><path d="M9 10v11c0 4 14 4 14 0V10M9 16c0 4 14 4 14 0" fill="none" stroke="white" strokeWidth="1.5"/></svg>
  if (type === 's3') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#569a31" d="m5 5 11-3 11 3-3 22-8 3-8-3Z"/><ellipse cx="16" cy="6" rx="11" ry="3.5" fill="#75b643"/><path d="M11 13h10l-1 10-4 2-4-2Z" fill="none" stroke="white" strokeWidth="1.5"/></svg>
  if (type === 'python') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#3776ab" d="M15.8 3.2c-6 0-5.6 2.6-5.6 2.6v3.1h5.7v1H8s-3.8-.4-3.8 5.6 3.3 5.8 3.3 5.8h2v-2.8s-.1-3.3 3.3-3.3h5.6s3.1.1 3.1-3V6.3s.5-3.1-5.7-3.1Zm-3.2 1.9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/><path fill="#ffd43b" d="M16.2 28.8c6 0 5.6-2.6 5.6-2.6v-3.1h-5.7v-1H24s3.8.4 3.8-5.6-3.3-5.8-3.3-5.8h-2v2.8s.1 3.3-3.3 3.3h-5.6s-3.1-.1-3.1 3v5.9s-.5 3.1 5.7 3.1Zm3.2-1.9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>
  if (type === 'react') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="2.7" fill="#61dafb"/><g fill="none" stroke="#61dafb" strokeWidth="1.5"><ellipse cx="16" cy="16" rx="13" ry="5"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(120 16 16)"/></g></svg>
  if (type === 'javascript') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#f7df1e" d="M3 3h26v26H3z"/><path fill="#111827" d="M17 24.4c.6 1.1 1.4 1.9 2.8 1.9 1.2 0 1.9-.6 1.9-1.4 0-1-.8-1.3-2-1.9l-.7-.3c-2-.9-3.4-2-3.4-4.4 0-2.2 1.7-3.8 4.3-3.8 1.9 0 3.2.7 4.2 2.4l-2.3 1.5c-.5-.9-1.1-1.2-1.9-1.2-.9 0-1.4.6-1.4 1.2 0 .9.6 1.2 1.8 1.8l.7.3c2.4 1 3.7 2.1 3.7 4.5 0 2.6-2 4-4.8 4-2.7 0-4.4-1.3-5.2-3.1Zm-10 .3c.5.9 1 1.6 2.1 1.6s1.7-.4 1.7-2V14.7h3v9.6c0 3.1-1.8 4.5-4.5 4.5-2.4 0-3.8-1.2-4.5-2.8Z"/></svg>
  if (type === 'opencv') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="8.5" r="6" fill="none" stroke="#ff3535" strokeWidth="4"/><circle cx="9" cy="21.5" r="6" fill="none" stroke="#00a859" strokeWidth="4"/><circle cx="23" cy="21.5" r="6" fill="none" stroke="#0088d7" strokeWidth="4"/></svg>
  if (type === 'pytorch') return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M22.4 9.2a10.3 10.3 0 1 1-8.5-3.4v4a6.4 6.4 0 1 0 5.5 2.1Z" fill="#ee4c2c"/><circle cx="22.4" cy="6.5" r="2" fill="#ee4c2c"/></svg>
  if (type === 'fastapi') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="#009688"/><path fill="#fff" d="m17.4 5.8-8.1 11h5.1l-1 9.4 9.3-12h-5.2Z"/></svg>
  if (type === 'docker') return <svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#2496ed"><path d="M5 12h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zm-5-5h4v4h-4zm5 0h4v4h-4zm0-5h4v4h-4zm5 10h4v4h-4z"/><path d="M29 14.5c-1-.6-2.2-.8-3.4-.5-.2-1.2-1-2.2-2.1-2.9l-.8-.5-.5.8c-.6.9-.8 2-.6 3H3.4c-.3 3.2.3 6.1 2 8.3 1.7 2.2 4.3 3.3 7.6 3.3 7.2 0 12.5-3.2 15-9.2 1.1.1 2.1-.2 2.9-.9l.6-.5-.6-.6Z"/></g></svg>
  if (type === 'bigquery') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#4285f4" d="m16 2 12 7v14l-12 7-12-7V9Z"/><circle cx="14.5" cy="14.5" r="6.2" fill="none" stroke="#fff" strokeWidth="2.2"/><path d="m19 19 5 5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/><path d="M11 17v-4m3 4V9m3 8v-6" stroke="#fff" strokeWidth="1.5"/></svg>
  if (type === 'postgresql') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#336791" d="M7 5.5c3-3.6 14-3.6 18 1.1 2.6 3.1 1.2 10.3-.6 13.2-1.1 1.8-3.8 2.5-5.3 1.2-.8-.7-.4-2.4-1.2-2.8-.7-.4-1.6.4-2.1 1.1-1 1.5-.4 5.7-2.6 7.3-1.2.9-3.2.4-3.3-.9-.2-1.8 2.7-2.9 3.2-5.1.3-1.4-.5-2.3-1.4-3.3C8.8 14.2 4.5 8.5 7 5.5Z"/><path fill="none" stroke="#fff" strokeWidth="1.4" d="M11 7c2-1.7 6.7-1.8 9 .4 2 1.8 1.6 7.4-.1 8.7-1.2.9-3 .1-3.7-1.4-.8-1.8-.8-4.7-1.2-5.3-.8-1.1-2.3-1-3.1-.1"/></svg>
  if (type === 'sqlserver') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="#cc2927" strokeWidth="3" d="M6 9c5-3.3 14-3.3 20 0-5 3.3-14 3.3-20 0Zm0 0v14c5 3.3 14 3.3 20 0V9M6 16c5 3.3 14 3.3 20 0"/></svg>
  if (type === 'csharp') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#68217a" d="M16 2 28 9v14l-12 7-12-7V9Z"/><path fill="#fff" d="M16 10a6 6 0 1 0 4.8 9.6l-2.1-1.5A3.4 3.4 0 1 1 18.8 14l2-1.6A6 6 0 0 0 16 10Z"/><path stroke="#fff" strokeWidth="1.3" d="M22 13v7m3-7v7m-5-4.8h7m-7 2.6h7"/></svg>
  if (type === 'dotnet') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#512bd4"/><text x="16" y="19.2" fill="#fff" fontSize="7.4" fontWeight="700" textAnchor="middle">.NET</text></svg>
  if (type === 'githubactions') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#2088ff"/><path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" d="M11 10v12m0-8h6a4 4 0 0 1 4 4v2m-12-8 2-2 2 2m6 8 2 2 2-2"/></svg>
  if (type === 'langchain') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="#1c3c3c" strokeWidth="3.2" strokeLinecap="round" d="M13 9 9 5 5 9l6 6 4-4m4 12 4 4 4-4-6-6-4 4m-6-2 8-8"/></svg>
  if (type === 'mediapipe') return <svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#ff6f00"><circle cx="8" cy="9" r="2.5"/><circle cx="16" cy="5" r="2.5"/><circle cx="24" cy="9" r="2.5"/><circle cx="9" cy="20" r="2.5"/><circle cx="16" cy="16" r="2.5"/><circle cx="23" cy="21" r="2.5"/><circle cx="16" cy="27" r="2.5"/></g><path fill="none" stroke="#ff6f00" strokeWidth="1.5" d="m8 9 8-4 8 4-8 7-7 4 7 7 7-6"/></svg>
  if (type === 'yolo') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="#7b2cff" strokeWidth="3"/><circle cx="16" cy="16" r="5" fill="none" stroke="#00d4b8" strokeWidth="3"/><circle cx="16" cy="16" r="1.8" fill="#ff6a00"/></svg>
  if (type === 'mlflow') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#0194e2" d="M16 3 4 10v12l12 7 12-7V10Z"/><path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m8 21 5-6 4 3 7-8m-4 0h4v4"/></svg>
  if (type === 'feast') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#f4511e" d="M5 4h22v7H12v5h12v7H12v5H5Z"/></svg>
  if (type === 'ssis') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#f2c811" d="m16 2 6 6-6 6-6-6Zm-8 16 6 6-6 6-6-6Zm16 0 6 6-6 6-6-6Z"/><path stroke="#f2c811" strokeWidth="2" d="M16 14v4m-2 2-6-2m10 2 6-2"/></svg>
  if (type === 'wpf') return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="4" width="26" height="24" rx="3" fill="#512bd4"/><path fill="#fff" d="M7 9h8v6H7zm10 0h8v6h-8zM7 17h8v6H7zm10 0h8v6h-8z"/></svg>
  if (type === 'ollama') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#111827" d="M9 27V12c0-5 3-9 7-9s7 4 7 9v15h-4v-7h-6v7Zm4-12h6v-4c0-2-1.3-4-3-4s-3 2-3 4Z"/><circle cx="14" cy="11" r="1" fill="#fff"/><circle cx="18" cy="11" r="1" fill="#fff"/></svg>
  return <Boxes aria-hidden="true" />
}

export default function TechnologyBadge({ name, compact = false }) {
  const slug = slugify(name)
  const type = iconTypes[slug]
  return (
    <span className={`technology-badge${compact ? ' technology-badge--compact' : ''}`} data-technology={slug}>
      <span className="technology-badge__icon"><BrandMark type={type} /></span>
      <span>{name}</span>
    </span>
  )
}
