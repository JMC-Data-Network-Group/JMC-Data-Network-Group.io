import { ArrowRight, Check } from 'lucide-react'
import { FullLogoArtwork } from './brand-lockup'

const commitments = [
  'Soluciones alineadas con cada operación',
  'Información organizada para consultar mejor',
  'Acompañamiento cercano en cada etapa',
]

export function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="about-section" id="nosotros">
      <div className="site-shell about-grid">
        <div className="about-copy">
          <p className="section-eyebrow section-eyebrow--light">QUIÉNES SOMOS</p>
          <h2 id="about-title">
            Tecnología clara. <span>Información útil.</span>
          </h2>
          <p className="about-description">
            En JMC Data &amp; Network Group acompañamos a las empresas en la organización y uso de su
            información. Integramos almacenamiento, reportes y conectividad tecnológica en
            soluciones pensadas alrededor de cada necesidad.
          </p>
          <ul className="commitment-list">
            {commitments.map((commitment) => (
              <li key={commitment}>
                <span className="commitment-check"><Check aria-hidden="true" /></span>
                {commitment}
              </li>
            ))}
          </ul>
          <a className="about-link" href="#contacto">
            Conversemos sobre tu proyecto <ArrowRight aria-hidden="true" />
          </a>
        </div>

        <div className="about-logo-stage">
          <div aria-hidden="true" className="about-logo-grid" />
          <div className="about-logo-frame">
            <FullLogoArtwork />
          </div>
          <div className="about-stage-caption">
            <span className="about-caption-dot" />
            DATOS QUE CONECTAN
          </div>
          <span aria-hidden="true" className="about-orbit about-orbit--one" />
          <span aria-hidden="true" className="about-orbit about-orbit--two" />
        </div>
      </div>
    </section>
  )
}
