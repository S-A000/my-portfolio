export default function SectionHeading({ eyebrow, title, description, align = 'left', id }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="section-heading__eyebrow"><span aria-hidden="true">//</span> {eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
