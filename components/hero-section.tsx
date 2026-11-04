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

        <div className="hero-video-wrapper">
          <div className="hero-video-header">
            <div className="hero-video-brand">
            </div>

          </div>

          <div className="hero-video-frame">
            <video
              className="hero-video"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/videos/presentacion.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
          </div>

          <div className="hero-video-footer">
            <div>
              <strong>Tecnología que impulsa resultados</strong>
              <span>Conectamos datos, infraestructura e innovación.</span>
            </div>

            <span className="hero-video-status">
      <span />
      VIDEO CORPORATIVO
    </span>
          </div>
        </div>
      </div>
    </section>
  )
}
