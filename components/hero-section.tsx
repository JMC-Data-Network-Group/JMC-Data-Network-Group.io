import Image from 'next/image'
import { ArrowRight, BarChart3, Database, Network, Workflow } from 'lucide-react'
import { LOGO_ICON_URL } from './brand-lockup'

const flowSteps = [
  { icon: Database, label: 'FUENTES' },
  { icon: Workflow, label: 'GESTIÓN' },
  { icon: BarChart3, label: 'REPORTES' },
]

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="hero-section" id="inicio">
      <div className="site-shell hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span aria-hidden="true" className="hero-eyebrow-dot" />
            DATOS · REDES · DECISIONES
          </p>
          <h1 className="hero-title" id="hero-title">
            Que tus datos trabajen <span>por tu negocio.</span>
          </h1>
          <p className="hero-description">
            Diseñamos soluciones de almacenamiento, organización y reportes para que tu información
            sea más clara, accesible y útil en el día a día.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#servicios">
              Explorar servicios <ArrowRight aria-hidden="true" />
            </a>
            <a className="hero-text-link" href="#nosotros">
              Conoce a JMC <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div aria-label="Áreas de servicio" className="hero-specialties">
            <span>Almacenamiento</span>
            <span aria-hidden="true" className="specialty-separator" />
            <span>Reportes</span>
            <span aria-hidden="true" className="specialty-separator" />
            <span>Conectividad</span>
          </div>
        </div>

        <div
          aria-label="Ilustración conceptual del flujo de datos desde las fuentes hasta los reportes"
          className="hero-visual"
          role="img"
        >
          <div className="hero-visual-glow" />
          <div className="hero-data-card">
            <div className="hero-card-header">
              <div className="hero-card-brand">
                <span className="hero-card-mark">
                  <Image
                    alt=""
                    height={64}
                    priority
                    src={LOGO_ICON_URL}
                    unoptimized
                    width={64}
                  />
                </span>
                <span>
                  <strong>JMC / DATA HUB</strong>
                  <small>GESTIÓN DE INFORMACIÓN</small>
                </span>
              </div>
              <span className="model-tag">VISTA ILUSTRATIVA</span>
            </div>

            <div className="hero-card-intro">
              <p>UN FLUJO MÁS CLARO</p>
              <h2>De cada fuente, una visión útil.</h2>
            </div>

            <div aria-hidden="true" className="data-flow">
              {flowSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div className="data-flow-group" key={step.label}>
                    <div className="data-flow-step">
                      <span className="data-flow-icon">
                        <Icon />
                      </span>
                      <span className="data-flow-label">{step.label}</span>
                    </div>
                    {index < flowSteps.length - 1 && <span className="data-flow-connector" />}
                  </div>
                )
              })}
            </div>

            <div className="hero-report-panel">
              <div className="hero-report-copy">
                <span className="report-overline">INFORMACIÓN ORGANIZADA</span>
                <strong>Reportes a tu medida</strong>
                <span>Una lectura más sencilla de lo que importa.</span>
              </div>
              <div aria-hidden="true" className="report-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="floating-note floating-note--top">
            <span className="floating-note-icon"><Network /></span>
            <span><strong>Fuentes conectadas</strong><small>Información en contexto</small></span>
          </div>
          <div aria-hidden="true" className="floating-note floating-note--bottom">
            <span className="floating-note-indicator" />
            <span><strong>Claridad para avanzar</strong></span>
          </div>
        </div>
      </div>
    </section>
  )
}
