import { ArrowRight, CheckCircle2, ExternalLink, Eye, ShieldCheck } from 'lucide-react'
import { flagshipProducts } from '../data/agencyData'

const productIcons = {
  botshield: ShieldCheck,
  deepguard: Eye,
}

export default function ProductsSection() {
  return (
    <section className="products content-section" id="products" aria-labelledby="products-title">
      <header className="products__heading section-heading">
        <span>Proprietary platforms</span>
        <h2 id="products-title">Flagship products built for hostile, high-stakes environments.</h2>
        <p>
          Purpose-built security systems combine applied AI with deployment-ready controls,
          telemetry, and governance.
        </p>
      </header>

      <div className="products__grid">
        {flagshipProducts.map((product) => {
          const Icon = productIcons[product.id]
          const titleId = `product-${product.id}-title`

          return (
            <article
              className={`products__card products__card--${product.accent}`}
              key={product.id}
              aria-labelledby={titleId}
            >
              <header className="products__card-header">
                <span className="products__icon" aria-hidden="true"><Icon /></span>
                <div className="products__identity">
                  <span className="products__badge">{product.badge}</span>
                  <h3 id={titleId}>{product.name}</h3>
                </div>
                <span className="products__status">
                  <span className="products__status-dot" aria-hidden="true" />
                  {product.status}
                </span>
              </header>

              <p className="products__summary">{product.summary}</p>

              <div className="products__architecture">
                <h4>Architecture flow</h4>
                <ol aria-label={`${product.name} architecture flow`}>
                  {product.architecture.map((stage, index) => (
                    <li key={stage}>
                      <span>{stage}</span>
                      {index < product.architecture.length - 1 && <ArrowRight aria-hidden="true" />}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="products__details">
                <div className="products__features">
                  <h4>Platform capabilities</h4>
                  <ul>
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <CheckCircle2 aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="products__stack" aria-label={`${product.name} technology stack`}>
                  {product.stack.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              </div>

              {product.link && (
                <a
                  className="products__link"
                  href={product.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${product.link.label} for ${product.name} (opens in a new tab)`}
                >
                  <span>{product.link.label}</span>
                  <ExternalLink aria-hidden="true" />
                </a>
              )}
              {!product.link && (
                <a className="products__link" href="#contact" aria-label={`Request a deployment review for ${product.name}`}>
                  <span>Request a deployment review</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
